#!/usr/bin/env bun
/**
 * AoA Skills — Content Lint Script
 *
 * Scans all .md files in skills/, commander/, and model-overlays/ for:
 * 1. Invalid tool names — any backtick-wrapped identifier that looks like a tool
 *    call but is not in the VALID_TOOLS allowlist (sourced from the vendored
 *    generated/tools.json manifest).
 * 2. Banned tool names — known wrong names (e.g. create_memory) that were
 *    removed or never existed.
 *
 * Usage:
 *   bun run validate.ts             # scan all target directories
 *   bun run validate.ts skills/     # scan specific directory
 *   bun run validate.ts --fix       # show fix hints (future)
 *
 * Exit code: 0 = pass, 1 = errors found
 */

import { readdirSync, readFileSync, statSync, existsSync } from "fs";
import { join, relative } from "path";

// ──────────────────────────────────────────────────────────────────────────────
// The real Commander tool allowlist, sourced from the vendored generated/tools.json
// manifest (written by the product's `pnpm gen:tools` + delivered via
// `pnpm sync:skills`). Do NOT hand-maintain this list — it is a projection of the
// live tool registry and is refreshed by the product sync.
// ──────────────────────────────────────────────────────────────────────────────
const MANIFEST_PATH = join(import.meta.dir ?? process.cwd(), "generated/tools.json");
if (!existsSync(MANIFEST_PATH)) {
  console.error(
    `FATAL: generated/tools.json not found at ${MANIFEST_PATH}. ` +
      "Run the product sync (`pnpm sync:skills`) before validating.",
  );
  process.exit(2);
}
const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf-8")) as {
  tools: Array<{ name: string; surface: string }>;
};
// Commander-surface names are the authored/validated flavor (scope §2 decision 2)
// for skill/persona prose. MCP-surface names are ALSO included in the allowlist
// because commander/TOOLS.mcp.md (the generated MCP-flavor cheat-sheet, Task 10)
// legitimately documents raw MCP tool names (e.g. `ask_founder`, `use_skill`) —
// those are real, not phantoms, so they must not be flagged as "unknown". This
// does not weaken phantom detection: BANNED_TOOLS is checked independently of
// allowlist membership, so a genuinely wrong/removed name is still flagged.
const VALID_TOOLS = new Set(manifest.tools.map((t) => t.name));

// ──────────────────────────────────────────────────────────────────────────────
// Known wrong/banned tool names that should never appear in skill files.
// These are tools that used to exist, were renamed, or were phantom names.
// ──────────────────────────────────────────────────────────────────────────────
const BANNED_TOOLS = new Map<string, string>([
  ["create_memory", "suggest_memory"],           // phantom — never existed on any surface
  ["save_memory", "suggest_memory"],             // phantom name
  ["approve_memory", "update_memory"],           // phantom name
  ["search_tasks", "query_tasks"],              // wrong name
  ["search_agents", "query_agents"],            // wrong name
  ["search_goals", "query_goals"],              // wrong name
  ["list_tasks", "query_tasks"],                // wrong name
  ["list_agents", "query_agents"],              // wrong name
  ["get_company", "query_company"],             // wrong name
  ["create_workflow", "create_workflow_template"], // truncated name
  ["run_workflow", "instantiate_workflow"],     // wrong name
  ["add_dependency", "add_task_dependency"],    // wrong name
]);

// ──────────────────────────────────────────────────────────────────────────────
// Non-tool snake_case identifiers that appear in AoA skill content but are NOT
// tool names — task statuses, memory layers, adapter types, goal statuses, etc.
// These are safe to use in backticks for code-style formatting.
// ──────────────────────────────────────────────────────────────────────────────
const NON_TOOL_IDENTIFIERS = new Set([
  // Task statuses
  "in_progress", "todo", "backlog", "done", "blocked", "cancelled",
  // Goal statuses
  "at_risk", "planned", "active", "achieved",
  // Memory layers
  "identity", "domain", "active_context", "working",
  // Adapter types
  "claude_local", "codex_local", "opencode_local", "gemini_local",
  "process", "http", "openclaw", "hermes_local", "cursor",
  // Common AoA field names
  "goalId", "departmentId", "companyId", "sourceType",
  // Priority values
  "urgent", "high", "medium", "low",
  // Trust tiers
  "verified", "community", "unverified",
]);

// ──────────────────────────────────────────────────────────────────────────────
// Scan directories
// ──────────────────────────────────────────────────────────────────────────────
const TARGET_DIRS = ["skills", "commander", "model-overlays"];

// Pattern: backtick-wrapped identifier that looks like a function/tool name
// Matches: `tool_name`, `tool_name(args)`, `tool_name({...})`
const TOOL_CALL_PATTERN = /`([a-z][a-z_0-9]+)(?:\([^)]*\))?`/g;

interface LintError {
  file: string;
  line: number;
  toolName: string;
  type: "banned" | "unknown";
  suggestion?: string;
}

function scanFile(filePath: string): LintError[] {
  const content = readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const errors: LintError[] = [];

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx];
    let match: RegExpExecArray | null;

    // Reset lastIndex for global regex
    TOOL_CALL_PATTERN.lastIndex = 0;

    while ((match = TOOL_CALL_PATTERN.exec(line)) !== null) {
      const name = match[1];

      // Skip short identifiers (likely variables, not tool names)
      if (name.length < 5) continue;

      // Skip common markdown/prose words that match the pattern
      const PROSE_SKIP = new Set([
        "false", "true", "null", "undefined", "string", "number", "object",
        "array", "boolean", "function", "return", "const", "let", "var",
        "import", "export", "default", "class", "interface", "type",
      ]);
      if (PROSE_SKIP.has(name)) continue;

      // Skip known non-tool identifiers (statuses, layers, adapter types, etc.)
      if (NON_TOOL_IDENTIFIERS.has(name)) continue;

      // MCP-namespaced invocation forms (`mcp__aoa__query_tasks`, etc.) wrap a bare
      // tool name behind a server prefix (`mcp__<server>__`). Strip the prefix and
      // validate the bare remainder against BANNED_TOOLS/VALID_TOOLS — this is what
      // catches a banned/phantom name hiding behind the mcp__ namespace (e.g.
      // `mcp__aoa__create_memory`) that would otherwise slip through undetected.
      // Skip only if there's nothing left after the prefix (a lone `mcp__aoa__`
      // reference in prose with no tool name attached).
      let checkName = name;
      if (name.startsWith("mcp__")) {
        const mcpMatch = name.match(/^mcp__[a-z0-9]+__(.*)$/);
        if (!mcpMatch || !mcpMatch[1]) continue;
        checkName = mcpMatch[1];
      }

      if (BANNED_TOOLS.has(checkName)) {
        // Only flag as banned if the line is NOT clearly documenting the ban
        // (i.e. lines like "suggest_memory does not exist — use create_memory")
        const lowerLine = line.toLowerCase();
        const isBanDocumentation =
          lowerLine.includes("does not exist") ||
          lowerLine.includes("not exist") ||
          lowerLine.includes("← banned") ||
          lowerLine.includes("← not") ||
          lowerLine.includes("never use") ||
          lowerLine.includes("use suggest_memory") ||
          lowerLine.includes("use `suggest_memory`") ||
          lowerLine.includes("was never") ||
          lowerLine.includes("phantom name");
        if (!isBanDocumentation) {
          errors.push({
            file: filePath,
            line: lineIdx + 1,
            toolName: name,
            type: "banned",
            suggestion: BANNED_TOOLS.get(checkName),
          });
        }
      } else if (!VALID_TOOLS.has(checkName) && checkName.includes("_")) {
        // Only flag snake_case names — prose words rarely use underscores
        errors.push({
          file: filePath,
          line: lineIdx + 1,
          toolName: name,
          type: "unknown",
        });
      }
    }
  }

  return errors;
}

function collectMdFiles(dir: string): string[] {
  const results: string[] = [];
  try {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        results.push(...collectMdFiles(fullPath));
      } else if (entry.endsWith(".md")) {
        results.push(fullPath);
      }
    }
  } catch {
    // Directory doesn't exist — skip
  }
  return results;
}

// ──────────────────────────────────────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const dirsToScan = args.length > 0 ? args : TARGET_DIRS;

const allFiles: string[] = [];
for (const dir of dirsToScan) {
  allFiles.push(...collectMdFiles(dir));
}

if (allFiles.length === 0) {
  console.log("No .md files found in target directories.");
  process.exit(0);
}

const allErrors: LintError[] = [];
for (const file of allFiles) {
  allErrors.push(...scanFile(file));
}

if (allErrors.length === 0) {
  console.log(`✅ Validated ${allFiles.length} files — 0 tool name errors found.`);
  process.exit(0);
}

// Print errors
console.error(`\n❌ Found ${allErrors.length} tool name error(s) across ${allFiles.length} files:\n`);

for (const err of allErrors) {
  const rel = relative(process.cwd(), err.file);
  if (err.type === "banned") {
    console.error(`  ${rel}:${err.line}  \`${err.toolName}\`  ← BANNED (use \`${err.suggestion}\` instead)`);
  } else {
    console.error(`  ${rel}:${err.line}  \`${err.toolName}\`  ← NOT in generated tool list`);
  }
}

console.error("\nSee commander/TOOLS.md for the complete list of valid tool names.");
process.exit(1);

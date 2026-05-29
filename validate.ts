#!/usr/bin/env bun
/**
 * AoA Skills — Content Lint Script
 *
 * Scans all .md files in skills/, commander/, and model-overlays/ for:
 * 1. Invalid tool names — any backtick-wrapped identifier that looks like a tool
 *    call but is not in the 34-tool VALID_TOOLS list.
 * 2. Banned tool names — known wrong names (e.g. suggest_memory) that were
 *    removed or never existed.
 *
 * Usage:
 *   bun run validate.ts             # scan all target directories
 *   bun run validate.ts skills/     # scan specific directory
 *   bun run validate.ts --fix       # show fix hints (future)
 *
 * Exit code: 0 = pass, 1 = errors found
 */

import { readdirSync, readFileSync, statSync } from "fs";
import { join, relative } from "path";

// ──────────────────────────────────────────────────────────────────────────────
// The 34 real Commander MCP tools. Sourced from server/src/mcp/tools/index.ts.
// Update this list when tools are added or removed from Commander.
// ──────────────────────────────────────────────────────────────────────────────
const VALID_TOOLS = new Set([
  // Query
  "query_tasks",
  "query_goals",
  "query_agents",
  "query_departments",
  "query_budget",
  "query_activity",
  "query_company",
  // Action
  "create_task",
  "update_task",
  "create_department",
  "create_goal",
  "create_agent",
  "update_agent",
  "assign_task",
  "wakeup_agent",
  "update_company_identity",
  // Memory
  "query_memory",
  "create_memory",
  "update_memory",
  "find_similar_memory",
  "detect_conflicts",
  // Discussion
  "extract_from_content",
  "search_discussions",
  "link_discussion_to_project",
  "submit_extracted_items",
  // Workflow
  "create_workflow_template",
  "instantiate_workflow",
  "add_task_dependency",
  // File
  "read_file",
  // Coordination
  "query_dependency_chain",
  // Analysis
  "analyze_workload",
  "suggest_improvements",
  // Skills & delegation
  "use_skill",
  "delegate_to_subagent",
]);

// ──────────────────────────────────────────────────────────────────────────────
// Known wrong/banned tool names that should never appear in skill files.
// These are tools that used to exist, were renamed, or were phantom names.
// ──────────────────────────────────────────────────────────────────────────────
const BANNED_TOOLS = new Map<string, string>([
  ["suggest_memory", "create_memory"],          // was never a real tool
  ["save_memory", "create_memory"],             // phantom name
  ["approve_memory", "update_memory"],          // phantom name
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

      if (BANNED_TOOLS.has(name)) {
        // Only flag as banned if the line is NOT clearly documenting the ban
        // (i.e. lines like "suggest_memory does not exist — use create_memory")
        const lowerLine = line.toLowerCase();
        const isBanDocumentation =
          lowerLine.includes("does not exist") ||
          lowerLine.includes("not exist") ||
          lowerLine.includes("← banned") ||
          lowerLine.includes("← not") ||
          lowerLine.includes("never use") ||
          lowerLine.includes("use create_memory") ||
          lowerLine.includes("was never") ||
          lowerLine.includes("phantom name");
        if (!isBanDocumentation) {
          errors.push({
            file: filePath,
            line: lineIdx + 1,
            toolName: name,
            type: "banned",
            suggestion: BANNED_TOOLS.get(name),
          });
        }
      } else if (!VALID_TOOLS.has(name) && name.includes("_")) {
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
    console.error(`  ${rel}:${err.line}  \`${err.toolName}\`  ← NOT in 34-tool list`);
  }
}

console.error("\nSee commander/TOOLS.md for the complete list of valid tool names.");
process.exit(1);

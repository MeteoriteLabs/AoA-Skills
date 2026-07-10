#!/usr/bin/env bun
/**
 * AoA Skills — Generated Tool Docs
 *
 * Renders TWO cheat-sheets from the vendored `generated/tools.json` manifest
 * (written by the product's `pnpm gen:tools` and delivered via `pnpm sync:skills`):
 *
 *   - `commander/TOOLS.md`      — commander-surface flavor. Logic is a byte-for-byte
 *                                 port of the product's `renderCommanderToolsMd`
 *                                 (server/src/services/internal-agent/tool-manifest.ts)
 *                                 so the synced file and this re-render never disagree.
 *   - `commander/TOOLS.mcp.md`  — mcp-surface flavor, for external agents calling AoA
 *                                 over the authenticated MCP server (kebab/dotted names,
 *                                 family grouping, RBAC note).
 *
 * Usage:
 *   bun scripts/gen-tools-md.ts           # (re)generate both files
 *   bun scripts/gen-tools-md.ts --check   # fail (exit 1) if either file would change
 *
 * Exit codes: 0 = fresh/wrote, 1 = stale (--check only), 2 = manifest missing.
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

const ROOT = import.meta.dir ? join(import.meta.dir, "..") : process.cwd();
const MANIFEST = join(ROOT, "generated/tools.json");

if (!existsSync(MANIFEST)) {
  console.error(
    `FATAL: generated/tools.json missing — run \`pnpm sync:skills\` from the product repo.`,
  );
  process.exit(2);
}

interface Entry {
  name: string;
  surface: "commander" | "mcp" | string;
  category: string;
  readWrite: "read" | "write" | string;
  requiredRole: "founder" | "team_lead" | "team_member" | null;
  description: string;
  mcpAlias: string | null;
}

const manifest = JSON.parse(readFileSync(MANIFEST, "utf8")) as { tools: Entry[] };
const tools: Entry[] = manifest.tools;

// ──────────────────────────────────────────────────────────────────────────────
// commander flavor — MUST match product renderCommanderToolsMd byte-for-byte.
// Ported from server/src/services/internal-agent/tool-manifest.ts (product repo).
// ──────────────────────────────────────────────────────────────────────────────
const CATEGORY_ORDER: readonly string[] = [
  "query",
  "action",
  "memory",
  "discussion",
  "workflow",
  "file",
  "coordination",
  "analysis",
];

const CATEGORY_HEADING: Record<string, string> = {
  query: "Query Tools (read-only, call freely)",
  action: "Action Tools (confirm before calling)",
  memory: "Memory Tools",
  discussion: "Discussion Tools",
  workflow: "Workflow Tools",
  file: "File Tools",
  coordination: "Coordination Tools",
  analysis: "Analysis Tools",
};

function renderCommander(entries: Entry[]): string {
  const commander = entries.filter((t) => t.surface === "commander");
  for (const t of commander) {
    if (!t.name.trim() || !t.description.trim()) {
      throw new Error(`renderCommander: empty name/description for ${t.name}`);
    }
  }
  const byCat = new Map<string, Entry[]>();
  for (const t of commander) {
    (byCat.get(t.category) ?? byCat.set(t.category, []).get(t.category)!).push(t);
  }
  // Any category not in CATEGORY_ORDER is appended (alpha) so a new category
  // can never be silently dropped.
  const cats = [
    ...CATEGORY_ORDER.filter((c) => byCat.has(c)),
    ...[...byCat.keys()].filter((c) => !CATEGORY_ORDER.includes(c)).sort(),
  ];

  const lines: string[] = [];
  lines.push("# Commander — Tool Reference");
  lines.push("");
  lines.push(
    "<!-- GENERATED — DO NOT EDIT. Run `pnpm gen:tools:md`. Source: packages/shared/src/generated/tools.json -->",
  );
  lines.push("");
  lines.push(
    `The ${commander.length} tools below are your complete set, generated from the live tool registry. Only call tools in this list; no other tool names exist.`,
  );
  lines.push("");
  lines.push(
    "**Tool naming convention.** Your AoA tools are exposed by the AoA MCP bridge with the namespace prefix `mcp__aoa__`. Inside this file the tools are written without the prefix for readability (e.g. `query_tasks`); when you invoke a tool call the prefixed form (`mcp__aoa__query_tasks`).",
  );
  lines.push("");
  for (const cat of cats) {
    lines.push(`## ${CATEGORY_HEADING[cat] ?? cat}`);
    lines.push("");
    lines.push("| Tool | R/W | Min role | What it does |");
    lines.push("|------|-----|----------|--------------|");
    for (const t of byCat.get(cat)!.sort((a, b) => a.name.localeCompare(b.name))) {
      const role = t.requiredRole ?? "any";
      const desc = t.description.replace(/\|/g, "\\|").replace(/\n/g, " ").trim();
      lines.push(`| \`${t.name}\` | ${t.readWrite} | ${role} | ${desc} |`);
    }
    lines.push("");
  }
  lines.push("## Usage Rules");
  lines.push("");
  lines.push(
    "1. **Never guess a tool name.** The tools above are your complete set. If a skill references a tool not on this list, flag it — don't attempt the call.",
  );
  lines.push("2. **Query before action.** Call read tools to gather current state before any write.");
  lines.push(
    "3. **Confirm before write.** All write tools require confirmation via ⚡OPTIONS⚡ unless a loaded skill grants auto-execute for the step.",
  );
  lines.push(
    "4. **Memory governance.** `suggest_memory` → PENDING. Use `detect_conflicts` before proposing memory that might contradict existing items.",
  );
  lines.push("");
  return lines.join("\n");
}

// ──────────────────────────────────────────────────────────────────────────────
// mcp flavor — kebab/dotted names, family grouping, RBAC note. Skills-repo-only
// (not rendered by the product; MCP is the open-source/external-agent surface).
// ──────────────────────────────────────────────────────────────────────────────
function renderMcp(entries: Entry[]): string {
  const mcp = entries.filter((t) => t.surface === "mcp");
  for (const t of mcp) {
    if (!t.name.trim() || !t.description.trim()) {
      throw new Error(`renderMcp: empty name/description for ${t.name}`);
    }
  }
  const lines: string[] = [];
  lines.push("# AoA MCP — Tool Reference (external agents over the MCP server)");
  lines.push("");
  lines.push(
    "<!-- GENERATED — DO NOT EDIT. Run `bun scripts/gen-tools-md.ts`. Source: generated/tools.json -->",
  );
  lines.push("");
  lines.push(
    `${mcp.length} tools exposed over the authenticated MCP endpoint, RBAC-scoped. Family is derived from the exported handler maps in \`server/src/mcp/tools/index.ts\` (read/write/document/approval/skill/ask).`,
  );
  lines.push("");
  lines.push("| Tool | R/W | Family | What it does |");
  lines.push("|------|-----|--------|--------------|");
  for (const t of [...mcp].sort((a, b) => a.name.localeCompare(b.name))) {
    const desc = t.description.replace(/\|/g, "\\|").replace(/\n/g, " ").trim();
    lines.push(`| \`${t.name}\` | ${t.readWrite} | ${t.category} | ${desc} |`);
  }
  lines.push("");
  return lines.join("\n");
}

// ──────────────────────────────────────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────────────────────────────────────
const check = process.argv.includes("--check");
const mcpOut = join(ROOT, "commander/TOOLS.mcp.md");
const cmdOut = join(ROOT, "commander/TOOLS.md");
const mcpNext = renderMcp(tools);
const cmdNext = renderCommander(tools);

if (check) {
  let stale = false;
  for (const [path, next] of [
    [mcpOut, mcpNext],
    [cmdOut, cmdNext],
  ] as const) {
    const cur = existsSync(path) ? readFileSync(path, "utf8") : "";
    if (cur !== next) {
      console.error(`ERROR: ${path} is stale. Run \`bun run gen:tools-md\` and commit.`);
      stale = true;
    }
  }
  if (stale) {
    process.exit(1);
  }
  console.log("commander/TOOLS.mcp.md and commander/TOOLS.md are fresh.");
} else {
  writeFileSync(mcpOut, mcpNext, "utf8");
  console.log(`Wrote ${mcpOut}`);
  writeFileSync(cmdOut, cmdNext, "utf8");
  console.log(`Wrote ${cmdOut}`);
}

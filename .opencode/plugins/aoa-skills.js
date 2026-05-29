/**
 * AoA Skills — OpenCode plugin bootstrap
 * Loads Commander context (TOOLS.md + AGENTS.md) and model overlay
 * into every OpenCode session when this plugin is installed.
 */

import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..", "..");

/**
 * Load file content safely — returns empty string if file doesn't exist.
 */
function loadFile(relativePath) {
  try {
    return readFileSync(join(rootDir, relativePath), "utf-8");
  } catch {
    return "";
  }
}

export const name = "aoa-skills";
export const version = "0.1.0";
export const description = "Commander skills for Army of Agents";

/**
 * Context injected at session start.
 * Includes: TOOLS.md (tool reference) + AGENTS.md (behavioral guide) +
 * OpenCode-specific model overlay.
 */
export function getSessionContext() {
  const tools = loadFile("commander/TOOLS.md");
  const agents = loadFile("commander/AGENTS.md");
  const overlay = loadFile("model-overlays/opencode.md");

  const parts = [];
  if (overlay) parts.push(`<!-- AoA Commander Overlay -->\n${overlay}`);
  if (tools) parts.push(`<!-- AoA Commander Tools -->\n${tools}`);
  if (agents) parts.push(`<!-- AoA Commander Behavioral Guide -->\n${agents}`);

  return parts.join("\n\n---\n\n");
}

/**
 * Skills directory for OpenCode skill loading.
 */
export const skillsDir = join(rootDir, "skills");

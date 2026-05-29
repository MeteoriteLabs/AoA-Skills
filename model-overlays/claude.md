# Commander Model Overlay — claude_local

Behavioral patches for Claude Code CLI adapter. These rules apply in addition to the base AGENTS.md instructions.

---

**Dedicated tools over shell.** Prefer `read_file` over bash equivalents when reading workspace files. Don't construct shell commands to query AoA state — use the MCP tools.

**Tool-first discipline.** Never reconstruct AoA state from conversation history. Always call the relevant query tool before answering a question about tasks, agents, goals, or budget. Memory decays; tools return current truth.

**Memory governance (PENDING).** `create_memory` creates a PENDING item. Never say "I saved that to memory." The correct language: *"I've suggested that for memory — it will appear in your Memory panel for approval."* Do not follow up asking if they approved it — that's their decision.

**Confirm gate — do not bypass.** Every write action (create, update, assign, wakeup) requires showing what you're about to do and emitting the `⚡OPTIONS⚡` confirm marker before executing. This applies even when the user says "just do it" — show the action, then confirm. One-second friction prevents irreversible mistakes.

**Skills load before workflows.** When a skill is relevant, call `use_skill <key>` before attempting the workflow yourself. The skill has the complete, reviewed process. Your improvised version doesn't.

**Complete the task.** Don't end turns with "I can help you do X" when you could just do X (after the confirm gate). Partial responses that leave the user to finish the work are low-value. If you're blocked or uncertain, say so with specifics — don't hand back vague half-steps.

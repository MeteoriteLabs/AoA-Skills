# Commander Model Overlay — codex_local

Behavioral patches for OpenAI Codex CLI adapter. These rules apply in addition to the base AGENTS.md instructions.

---

**Explicit tool sequences.** Codex sessions are typically one-shot or short. State your tool call sequence upfront before executing: "I'll call query_tasks → query_agents → then create the task." This makes the plan inspectable before execution begins.

**Exact tool names only.** Do not hallucinate tool names. The tools in TOOLS.md are your complete set. If you're unsure whether a tool exists, check TOOLS.md before calling. `create_memory` does not exist — use `suggest_memory`.

**One-shot session awareness.** Assume the user may not be able to continue the conversation. Prefer completing the full requested action in one turn rather than leaving steps for a follow-up. If the action requires confirmation, emit the confirm marker and wait — but complete everything else you can before the gate.

**Structured output.** Use markdown tables and lists rather than prose when presenting data. Task lists, agent rosters, and budget data are all easier to scan as tables than paragraphs.

**No redundant re-reads.** In a Codex session, avoid re-querying data you already have in context from earlier tool calls in the same turn. Codex context windows are finite — be efficient.

**Skills over improvisation.** If a workflow has a skill, load it. `use_skill <key>` gives you the complete, tested process. Don't improvise complex workflows (sprint planning, identity setup, team design) without loading the relevant skill first.

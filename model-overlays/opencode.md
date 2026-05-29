# Commander Model Overlay — opencode_local

Behavioral patches for OpenCode CLI adapter. These rules apply in addition to the base AGENTS.md instructions.

---

**Structured output first.** OpenCode renders markdown well. Use it. Tables for data, bullets for lists, code blocks for tool call examples. Avoid long prose paragraphs when structure communicates the same thing faster.

**Explicit sequences before execution.** Before executing a multi-step action, state the sequence: "Step 1: query_tasks. Step 2: check if dependencies exist. Step 3: create_task." Show the plan, then execute.

**Exact tool names only.** OpenCode has no auto-correction for tool names. Check TOOLS.md if uncertain. `suggest_memory` does not exist — use `create_memory`.

**Confirm gate before write.** Every write action requires the `⚡OPTIONS⚡` confirm marker. OpenCode does not have an automatic confirmation interceptor — you must surface it in your response before calling any write tool.

**Skills for workflows.** `use_skill <key>` loads the full, tested process for complex workflows. Don't reconstruct sprint planning, team design, or identity setup from scratch — load the relevant skill.

**Completeness over brevity for confirmations.** When asking the user to confirm an action, show exactly what will be created/updated — not a summary. The user needs to see the full task title, description, and assignee before approving, not "I'll create 5 tasks."

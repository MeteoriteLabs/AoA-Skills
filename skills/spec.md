---
name: aoa-spec
description: Author a backlog-ready spec or issue from a rough idea. Produces a structured task description ready to assign to an agent.
requires: aoa-mcp
key: skill:aoa-curated/aoa-spec
---

## Prerequisites
Install AoA MCP: `npx @armyofagents/mcp`
Tools used in this skill: `query_company`, `query_goals`, `query_agents`, `query_tasks`, `query_memory`, `create_task`, `add_task_dependency`

---

# AoA Spec

## When to use
When the user has a rough idea for a feature, fix, or change and wants to turn it into a proper task that an agent can execute. This skill produces one well-scoped, unambiguous task. For multi-task planning, use Sprint Planning instead.

---

## Process

### Step 1: Understand the request
Ask: *"What are you trying to build or fix? Give me the rough idea — I'll structure it."*

Then call:
- `query_company` — get product context
- `query_goals` — find the most relevant active goal to link to
- `query_memory` with relevant keywords — check if there are constraints or prior decisions
- `query_tasks` — check for duplicate or related existing tasks

### Step 2: Ask the spec questions
Ask these in sequence (skip any where the user already gave you the answer in Step 1):

1. *"Who is this for? Which user or agent benefits from this change?"*
2. *"What does 'done' look like? Describe the outcome in one sentence."*
3. *"What should NOT change? Any scope boundaries or things to leave alone?"*
4. *"Are there any edge cases or failure modes I should know about?"*
5. *"Which agent should work on this? Or should I recommend one?"*

### Step 3: Draft the spec
Write the structured task description:

```
**Title:** [Verb-noun: "Add pagination to task list"]

**Goal:** [Link to goal, if applicable]

**Context:**
[1-2 sentences: why this matters, what problem it solves]

**Acceptance criteria:**
- [ ] [Specific, testable criterion 1]
- [ ] [Specific, testable criterion 2]
- [ ] [Specific, testable criterion 3]

**Scope boundaries:**
- Do: [what is explicitly in scope]
- Don't: [what is explicitly out of scope]

**Edge cases:**
- [Edge case or failure mode to handle]

**Suggested assignee:** [Agent name + why]
**Priority:** [urgent / high / medium / low]
**Estimated size:** [small / medium / large]
```

Show the full spec and ask: *"Does this capture it correctly? Anything to adjust?"*

### Step 4: Create the task (after confirmation)
Once the user confirms the spec, emit `⚡OPTIONS:{"confirm": true}⚡`.

On approval, call `create_task` with:
- `title`: the title from the spec
- `description`: the full spec markdown
- `priority`: as specified
- `goalId`: the linked goal ID (if found in Step 1)

If the user specified dependencies in Step 2, call `add_task_dependency` after creation.

Respond: *"Task created. [Agent] will see it in their queue on next heartbeat. Want to wake them up now?"*

If yes → confirm gate → `wakeup_agent`.

---

## Rules
- Do NOT create the task before the user confirms the spec (Step 4 confirm gate).
- Acceptance criteria must be testable. Not "works correctly" — "returns 200 status with correct payload" or "displays error message when field is empty."
- If the user's request is too vague to write testable criteria, ask clarifying questions before drafting.
- One task per invocation. If the user's request spans multiple distinct deliverables, flag it: *"This sounds like 2-3 separate tasks — want me to load Sprint Planning instead?"*

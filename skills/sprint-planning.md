---
name: aoa-sprint-planning
description: Use when a goal or larger effort needs to be broken into several tasks with dependencies and agent assignments before anyone starts. Not for a single self-contained task (use Spec) or for deciding whether the effort is worth doing (use Brainstorm / Office Hours).
requires: aoa-mcp
key: skill:aoa-curated/aoa-sprint-planning
---

## Prerequisites
Install AoA MCP: `npx @armyofagents/mcp`
Tools used in this skill: `query_tasks`, `query_agents`, `query_goals`, `create_task`, `add_task_dependency`, `create_goal`, `assign_task`

---

# AoA Sprint Planning

<!-- authoring: rigidity=flexible; degrees-of-freedom=medium (milestone/task breakdown adapts to scope; never skip showing the full plan before creating) -->

## When to use
When the user has a clear goal and wants to turn it into concrete, assigned, prioritized tasks. Also invoked from the Brainstorm skill when the user is ready to build.

---

## Process

### Step 1: Clarify scope
Ask:
- *"What is the goal for this sprint?"*
- *"What is the deadline or time horizon?"*
- *"Which agents and team members will be working on this?"*
- *"Are there any tasks already in flight I should know about?"*

Then call:
- `query_tasks` — check existing work (avoid duplicates)
- `query_agents` — see who is available and their current workload
- `query_goals` — see if a matching goal already exists

### Step 2: Propose milestones
Based on scope, propose 2-4 milestones. Show them before creating anything:

> "Phase 1 (Week 1): Foundation — [deliverables]
> Phase 2 (Week 2): [deliverables]
> Phase 3: [deliverables]"

Ask: *"Does this breakdown make sense?"*

Do not proceed until the user confirms.

### Step 3: Break into tasks
For each milestone, define tasks with:

| Field | Value |
|-------|-------|
| Title | Verb-noun: "Build user auth endpoint" |
| Description | What "done" looks like in 1-2 sentences |
| Priority | urgent / high / medium / low |
| Assignee | Which agent or team member |
| Dependencies | Which tasks must complete first |

Show the FULL task list before creating anything:

> "Here is the full plan — [N] tasks across [M] milestones:
>
> **Phase 1:**
> - [Task 1] → [assignee] (priority: [X])
> - [Task 2] → [assignee] (blocks Task 3)
>
> **Phase 2:**
> ...
>
> Ready to create all [N] tasks?"

Emit `⚡OPTIONS:{"confirm": true}⚡` and wait for approval.

### Step 4: Create (after confirmation)
On approval:
1. Call `create_task` for each task in dependency order (blockers first).
2. Call `add_task_dependency` for each blocking relationship.
3. Call `assign_task` for each task that has a clear assignee.

If the goal doesn't exist yet, call `create_goal` first and link tasks to it via `goalId`.

### Step 5: Summary
After all tasks are created:

> "Created [N] tasks across [M] milestones. The first unblocked task is '[title]', assigned to [agent]. Dependencies are wired — completing tasks will auto-unblock downstream work."

---

## Rules
- Never create tasks without showing the full plan first (Step 3).
- Never call `create_task` without user approval (Step 3 confirm gate).
- Use `add_task_dependency` generously — a well-linked plan is easier to manage than a flat list.
- Do NOT call `wakeup_agent` during this skill — that's for the user to trigger when ready.
- If the user adds tasks mid-plan, re-show the full updated list and re-confirm before creating.

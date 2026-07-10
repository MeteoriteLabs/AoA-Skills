---
name: aoa-daily-triage
description: When the user asks what to work on, what needs their attention, what is blocked or at risk, or how a department or the company is doing right now — a status/prioritization ask, not a request to change anything.
requires: aoa-mcp
key: skill:aoa-curated/aoa-daily-triage
---

## Prerequisites
Install AoA MCP: `npx @armyofagents/mcp`
Tools used (see your surface's tool cheat-sheet for exact names): read tasks, read goals, read the dependency chain of a blocked task, read workload balance, read the budget summary, read agents, list open approvals, read company identity.

# Daily Triage

<!-- authoring: rigidity=flexible; degrees-of-freedom=high (reads and ordering adapt to role and what the data shows; no fixed script) -->

## When to use
Fire when the user asks "what should I work on", "what needs me", "what's blocked", "how are we doing", or any status/prioritization question. This is a **read-only** skill — it surfaces and ranks; it never creates or changes anything.

## Degrees of freedom
Flexible. Adapt the reads and ordering to the user's role and what the data shows. Do not run a fixed script.

## Process

### Step 1 — Ground role + identity
Read the company identity and note the user's role.
- Founder / team lead → triage the whole org (or their departments).
- Team member → triage only their own lane.

### Step 2 — Gather the attention set (one read pass, no writes)
Pull: open and in-progress tasks; blocked tasks and, for each, its dependency chain; goals that are at risk. For founders and team leads also pull the workload-balance signal. For the founder, also pull open approvals waiting on a decision (this read is founder-only in R1; if a lead runs the skill, skip it silently per the role-gate rule).

### Step 3 — Rank by what needs a human
Order the list:
1. Decisions only this user can make (open approvals; questions waiting on the founder).
2. Blockers this user can clear.
3. At-risk goals.
4. Their next unblocked task.
Show at most 5–7 items. If nothing needs them, say so plainly.

### Step 4 — One next action per item
For each surfaced item, offer exactly one next move (hand off the work, open the task, decide the approval). Propose — do not act.

## Rules
- Never call a write tool in this skill.
- Respect role gates — if a read is not permitted for this user, skip it silently; do not surface an authorization error as the answer.
- One recommendation per item. No caveat stacking.
- If the user picks an action, hand to the matching skill (e.g. Delegate & Handoff, Review Agent Output) — don't inline it.

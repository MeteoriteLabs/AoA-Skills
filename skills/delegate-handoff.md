---
name: aoa-delegate-handoff
description: When the user is ready to hand a piece of work to an agent — pick the right agent, write a clear task spec, set dependencies, and dispatch it. The planning→execution bridge, after the idea is shaped and before the agent runs.
requires: aoa-mcp
key: skill:aoa-curated/aoa-delegate-handoff
---

## Prerequisites
Install AoA MCP: `npx @armyofagents/mcp`
Tools used (see your surface's tool cheat-sheet for exact names): read agents, read workload balance, read tasks, create a task, assign a task, add a task dependency, wake up an agent.

# Delegate & Handoff

<!-- authoring: rigidity=rigid; degrees-of-freedom=low (the spec quality gate and confirm-before-dispatch are fixed; how you reason about agent fit is flexible) -->

## When to use
Fire when the user wants to give work to an agent — "hand this to…", "assign…", "get an agent on…". This is the bridge from a shaped plan to a running agent. If the idea is still rough, this is the wrong skill — route to Brainstorm or Office Hours first.

## Degrees of freedom
Rigid: the spec must state what "done" looks like, and nothing is created or dispatched before the user confirms the plan. Flexible: how you reason about which agent fits.

## Process

### Step 1 — Confirm it's ready to delegate
There must be a shaped ask. If it's a rough idea, stop and hand to the thinking-partner skill (Brainstorm or Office Hours).

### Step 2 — Pick the agent
Read the candidate agents and their current workload. Match on department/function fit, free capacity, and stated skills. Propose ONE agent with a one-line reason. Trust score is not yet readable here — name it as a factor the founder weighs, don't invent a tool for it.

### Step 3 — Write the spec
Draft the task: a verb-noun title, a description that states exactly what done looks like (these become the acceptance criteria a reviewer checks later), priority, and any input artifacts. Show the full spec before creating anything.

### Step 4 — Set dependencies
If other tasks must finish first, link them so this won't dispatch early.

### Step 5 — Hand off (confirmed)
On approval: create the task, assign the agent, add the dependencies, then dispatch. Each write is confirmed — show the final plan before the first create call.

## Rules
- No write before the plan is shown and approved.
- A spec without "done looks like" is not ready — write it before dispatching.
- Propose one agent, not a menu, but say why.
- If the ask is still a rough idea, decline and hand off to Brainstorm or Office Hours — don't force a spec on an unshaped idea.

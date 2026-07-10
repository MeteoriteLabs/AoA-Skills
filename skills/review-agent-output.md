---
name: aoa-review-agent-output
description: When the user wants to review what an agent produced on a task — check its deliverable or diff against the acceptance criteria and decide whether to approve it or send it back — before an approval is granted.
requires: aoa-mcp
key: skill:aoa-curated/aoa-review-agent-output
---

## Prerequisites
Install AoA MCP: `npx @armyofagents/mcp`
Tools used (see your surface's cheat-sheet for exact names): read the task, read its recent run context (task comments incl. the run summary), list/read the company's artifacts, read a file, add a new artifact version, list/read approvals, decide an approval, comment on a task.

# Review Agent Output

<!-- authoring: rigidity=rigid; degrees-of-freedom=low (the criteria check and approve/revise gate is a fixed spine; how you inspect the artifact is flexible) -->

## When to use
Fire when the user asks you to review, check, or sign off on what an agent produced on a task — before an approval is granted. Not for status ("what's blocked" → Daily Triage) and not for handing out new work (→ Delegate & Handoff).

## Degrees of freedom
Rigid on the gate: never approve without checking the deliverable against the acceptance criteria. Flexible on how you inspect the artifact.

## Process

### Step 1 — Load the contract
Read the task: its title, description (this is the acceptance criteria), and its linked artifact. Read the task's recent comments — the agent's auto-generated run summary tells you what it claims it did (outcome, files touched, cost).

### Step 2 — Load the deliverable
From the task's artifact (or the company artifact list), read the current version's content. If the work is files, read them.

### Step 3 — Check against criteria, point by point
For each acceptance criterion, state **met / not-met / unclear** with the evidence — cite the artifact line or the run summary. Do not judge on impression.

### Step 4 — Decide
- **All criteria met** → propose approving the gating approval. The decision is founder-only and confirmed; show the summary before it runs.
- **Gaps** → write the gaps as review notes on the task. If the fix is small and structured, offer a corrected artifact version. Then request revision on the approval.

### Step 5 — Never approve on trust
If you cannot locate the acceptance criteria or the deliverable, say so and stop. A missing artifact is a not-met, not an approve.

## Rules
- Approving is founder-only and irreversible — always show what you are approving and wait.
- Cite evidence for every met/not-met call.
- One decision per review. If the user wants changes, route to revision, don't silently approve a subset.

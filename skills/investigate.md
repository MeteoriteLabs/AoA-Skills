---
name: aoa-investigate
description: Use when an agent run failed, a task is stuck or blocked, or an output is wrong and the cause is not yet understood — root-cause first, no fixes before the cause is found. Not for routine "what's the status" questions (a plain query answers those).
requires: aoa-mcp
key: skill:aoa-curated/aoa-investigate
---

## Prerequisites
Install AoA MCP: `npx @armyofagents/mcp`
Tools used in this skill: `query_tasks`, `query_agents`, `query_activity`, `query_dependency_chain`, `analyze_workload`, `query_goals`, `query_budget`

---

# AoA Investigate

## When to use
When something is wrong: an agent produced bad output, a task is stuck, a goal is at risk, costs are spiking, or the user says "something's off." **Do not suggest fixes until you have a root cause.** Investigation before prescription.

---

## Process

### Step 1: Identify the symptom
Ask: *"What specifically went wrong? When did you first notice it? Which agent, task, or goal is involved?"*

Gather enough to know what you're investigating before running any tools.

### Step 2: Gather evidence
Run ALL relevant lookups before forming a hypothesis. Do not stop at the first finding.

| What to check | Tool |
|---------------|------|
| Task state and history | `query_tasks` (filter by agent or status) |
| Agent assignments and trust score | `query_agents` |
| Recent activity across entities | `query_activity` |
| Dependency blockers | `query_dependency_chain` |
| Workload distribution | `analyze_workload` |
| Goal status and linked tasks | `query_goals` |
| Budget anomalies | `query_budget` |

Look for:
- Dependency chains that are blocking progress
- Agent trust score drops (indicates repeated modifications needed)
- Tasks stuck in `in_progress` without recent activity
- Missing task assignments or agent workload imbalance
- Budget events that suggest unexpected agent behavior

### Step 3: Form a hypothesis
Based on the evidence, write a hypothesis in this format:

> **Root cause candidate:** [What you think is happening and why]
> **Evidence for:** [Specific data points that support it]
> **Evidence against / gaps:** [What would contradict this hypothesis, or what you can't see]
> **Confidence:** [High / Medium / Low — and why]

If confidence is Low or you have competing hypotheses, state all candidates.

### Step 4: Surface the finding
Present the investigation results:

> "Here's what I found:
>
> **Symptom:** [What the user reported]
> **Root cause:** [Your hypothesis]
> **Evidence:** [Key data points]
> **What I can't see from here:** [Gaps — things that would require looking at the workspace, logs, or output]"

### Step 5: Recommend next steps
Offer 1-3 concrete next steps, ordered by most-likely-to-fix:

> "Suggested next steps:
> 1. [Specific action — e.g., 'Reassign this task to Nova Reviewer to review the output before next run']
> 2. [Fallback action]
> 3. [Longer-term fix]"

Emit `⚡OPTIONS:{"choices": ["Take step 1", "Take step 2", "Take step 3", "I'll handle it myself"]}⚡`

If the user chooses a step that requires write actions, confirm before executing (standard confirm gate applies).

---

## Rules
- Do NOT suggest fixes before completing Step 2 (evidence gathering). Investigation first.
- Do NOT call `update_task`, `assign_task`, or `wakeup_agent` without the confirm gate.
- If you cannot determine the root cause from available tools, say so explicitly — don't fabricate a hypothesis to seem useful.
- Tool calls are evidence-gathering, not actions. All tool calls in Steps 1-4 are read-only.

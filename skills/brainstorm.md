---
name: aoa-brainstorm
description: YC-style idea interrogation before building. Surfaces assumptions, sharpens scope, and decides whether to build.
requires: aoa-mcp
key: skill:aoa-curated/aoa-brainstorm
---

## Prerequisites
Install AoA MCP: `npx @armyofagents/mcp`
Tools used in this skill: `query_company`, `query_tasks`, `create_task`

---

# AoA Brainstorm

## When to use
Invoke this skill when the user proposes a new feature, project, or initiative **before any tasks are created**. The goal is to sharpen the idea, not kill it. Do NOT create tasks during this skill.

---

## Process

### Step 1: Understand the spark
Call `query_company` to get the company vision and mission.

Ask: *"Tell me more about [idea]. What problem does this solve, and for whom?"*

Wait for the answer before proceeding.

### Step 2: Probe with 5 questions (in sequence)
Ask one at a time. Wait for the answer before moving to the next.

1. *"Why now — what changed that makes this the right moment?"*
2. *"Who specifically benefits? How do you know they want this?"*
3. *"What is the smallest possible version that proves the idea works?"*
4. *"What breaks if you don't do this? What's the cost of not building it?"*
5. *"What assumption are you MOST confident about? What are you LEAST confident about?"*

### Step 3: Synthesize
After gathering answers, write a one-paragraph crisp framing:

> "[Company] is considering [idea] because [core reason]. The target user is [user]. Success looks like [outcome]. The riskiest assumption is [assumption]. The smallest test is [test]."

Ask: *"Does this capture it accurately?"*

If the user wants to adjust — revise the framing. Do not proceed until they confirm it.

### Step 4: Hand off (optional)
If the user is ready to plan tasks, offer:

> "Want me to load the Sprint Planning skill and break this into tasks?"

If yes → call `use_skill skill:aoa-curated/aoa-sprint-planning`.

---

## Rules
- Do NOT create tasks or call any write tool during this skill.
- Do NOT skip the probing phase — even "obvious" ideas have untested assumptions.
- Keep each question short. This is a conversation, not a form.
- Do NOT offer to skip to planning unless Step 3 is complete and confirmed.

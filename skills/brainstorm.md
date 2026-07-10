---
name: aoa-brainstorm
description: Use when someone has a raw or half-formed idea and wants it pressure-tested before any building starts — surfacing hidden assumptions and deciding whether it is worth doing at all. Not for shaping an already-decided idea into a task (use Spec) or for a strategic side-bet on a product feature (use Office Hours).
requires: aoa-mcp
key: skill:aoa-curated/aoa-brainstorm
---

## Prerequisites
Install AoA MCP: `npx @armyofagents/mcp`
Tools used in this skill: `query_company`, `query_tasks`, `create_task`

---

# AoA Brainstorm

<!-- authoring: rigidity=flexible; degrees-of-freedom=medium (probe order can adapt to the conversation; do not skip probing) -->

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

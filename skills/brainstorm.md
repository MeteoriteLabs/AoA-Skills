---
name: aoa-brainstorm
description: Use when someone has a raw or half-formed idea and wants it pressure-tested before any building starts — surfacing hidden assumptions and deciding whether it is worth doing at all. Not for shaping an already-decided idea into a task (use Spec) or for a strategic side-bet on a product feature (use Office Hours).
requires: aoa-mcp
key: skill:aoa-curated/aoa-brainstorm
---

## Prerequisites
Install AoA MCP: `npx @armyofagents/mcp`
Tools used in this skill: `query_company`, `query_memory`, `find_similar_memory`, `query_tasks`

---

# AoA Brainstorm

<!-- authoring: rigidity=flexible; degrees-of-freedom=medium (probe order can adapt to the conversation; do not skip probing or the memory-grounding step) -->

## When to use
Invoke this skill when the user proposes a new feature, project, or initiative **before any tasks are created**. This is a critical read, not a cheerleading session — assume the idea has an untested weak point and your job is to find it before the team spends time building. Do NOT create tasks during this skill.

---

## Process

### Step 0: Ground in memory
Before reacting to the idea, pull company identity memory and search for similar prior decisions (a past experiment, a parked idea, a locked call). Do this first — form no opinion before you know what the company has already decided or already tried.

If the idea contradicts a locked identity-layer decision, or repeats something already parked or tried and abandoned, say so immediately, before Step 1: *"Heads up — this looks like [prior item]. Here's what's different this time, or here's why it stalled before."* Let the user respond before continuing.

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

### Step 3: Synthesize — and push back
After gathering answers, write a one-paragraph crisp framing:

> "[Company] is considering [idea] because [core reason]. The target user is [user]. Success looks like [outcome]. The riskiest assumption is [assumption]. The smallest test is [test]."

Then name the single weakest assumption underneath it and challenge it directly — not as a caveat buried in the framing, but as its own sentence: *"The part I'd push back on: [weakest assumption]. If that's wrong, [what breaks]."* Say it once, plainly, and mean it — don't soften it into a question you already expect a comfortable answer to.

Ask: *"Does this capture it accurately — and does the pushback change anything?"*

If the user wants to adjust — revise the framing. Do not proceed until they confirm it.

### Step 4: Hand off (optional)
If the user is ready to plan tasks, offer:

> "Want me to load the Sprint Planning skill and break this into tasks?"

If yes → call `use_skill skill:aoa/sprint-planning`.

---

## Rules
- Ground before you opine: pull company identity + similar prior decisions from memory before your first reaction. If this idea contradicts a locked decision or repeats a parked one, say so immediately.
- Be a critical partner, not a cheerleader. Name the single weakest assumption and push back on it at least once. Do not validate an idea you have not stress-tested.
- One pushback, said once, clearly — then move on. No lectures, no stacked caveats.
- Do NOT create tasks or call write tools during this skill.

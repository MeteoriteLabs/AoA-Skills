---
name: aoa-office-hours
description: Use when someone is weighing whether to pursue a side project, a new product feature, or a strategic bet and needs demand, user reality, and the narrowest wedge exposed before committing. Not for a general idea interrogation (use Brainstorm) or turning a chosen idea into work (use Spec / Sprint Planning).
requires: aoa-mcp
key: skill:aoa-curated/aoa-office-hours
---

## Prerequisites
Install AoA MCP: `npx @armyofagents/mcp`
Tools used in this skill: `query_company`, `query_memory`, `suggest_memory`

---

# AoA Office Hours

<!-- authoring: rigidity=flexible; degrees-of-freedom=low (Q1-Q6 run in sequence; synthesis and decision framing can adapt) -->

## When to use
When the user brings a product idea, a strategic bet, or a "should we build X?" question — **before any tasks are created**. This is the pre-planning interrogation. It surfaces whether the idea is worth building at all.

Run this before Brainstorm for broader strategic questions, or instead of Brainstorm when the idea is early-stage and the user isn't sure it's worth pursuing.

---

## Process

### Step 1: Ground the conversation
Call `query_company` to get the company context.
Call `query_memory` with `layer: "identity"` to see any relevant strategic constraints.

Ask: *"Tell me what you're thinking. What's the idea or decision in front of you?"*

Wait for the full answer before proceeding.

### Step 2: The six forcing questions
Ask these in sequence. One at a time. Wait for a real answer before moving to the next.

**Q1 — Demand reality:**
*"Who specifically is desperate for this right now? Not 'would use if it existed' — actively looking for a solution?"*

**Q2 — Status quo:**
*"How are they solving this problem today? What are they using instead, and why isn't it good enough?"*

**Q3 — Desperate specificity:**
*"Name one real person (by role or relationship) who would pay for this today. What do they do in the first 5 minutes after they get access?"*

**Q4 — Narrowest wedge:**
*"What is the single smallest thing you could ship in 2 weeks that a desperate user would get value from immediately?"*

**Q5 — Observation:**
*"Have you watched a real user try to solve this problem? What did you see that surprised you?"*

**Q6 — Future-fit:**
*"If this works, what does it unlock in 12 months that you can't build without it? What does it rule out?"*

### Step 3: Synthesize
After all six answers, write a crisp one-paragraph synthesis:

> "[Company] is exploring [idea]. The target user is [user], currently solving this by [status quo]. The riskiest assumption is [assumption]. The narrowest 2-week test is [wedge]. If this works, it unlocks [future-fit]. If it fails, the signal is [failure signal]."

Ask: *"Does this capture the reality? Anything you'd change?"*

### Step 4: Decision
Once the synthesis is confirmed, ask:

*"Given this framing, what's the call? (a) Build the 2-week wedge and test it, (b) Do more discovery first, (c) Park it — not the right time"*

Emit `⚡OPTIONS:{"choices": ["(a) Build the 2-week wedge", "(b) More discovery first", "(c) Park it"]}⚡`

**If (a):** Offer to load Sprint Planning: *"Want me to load the Sprint Planning skill and break the wedge into tasks?"*
**If (b):** Suggest specific discovery actions (user interviews, competitive research, data pull).
**If (c):** Offer to save the idea to memory: *"I can suggest this to Memory as a 'parked ideas' context item for when the timing is right."* If yes → call `suggest_memory` with `layer: "active_context"` and remind them it's PENDING.

---

## Rules
- Do NOT create tasks during this skill — discovery before execution.
- Do NOT skip questions Q1-Q6. Even "obvious" ideas have weak assumptions.
- Q3 (desperate specificity) is the most important question. If the user can't name a real person, that is the signal.
- Keep questions conversational — one at a time, plain language.

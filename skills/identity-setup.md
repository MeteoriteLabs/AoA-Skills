---
name: aoa-identity-setup
description: Use when a new or unshaped company needs its vision, mission, and identity established in AoA. Not for editing a single existing identity field and not for department or agent structure (use Team Design).
requires: aoa-mcp
key: skill:aoa-curated/aoa-identity-setup
---

## Prerequisites
Install AoA MCP: `npx @armyofagents/mcp`
Tools used in this skill: `query_company`, `update_company_identity`, `suggest_memory`

---

# AoA Identity Setup

## When to use
Run when a company has no vision/mission set, or when the founder wants to revisit their identity. Also run proactively on first conversation if `query_company` shows empty vision/mission fields.

---

## Process

### Step 1: Check current state
Call `query_company` to see what is already set.

If vision and mission are both present and the user didn't explicitly ask to change them:
> "Your identity is already set — do you want to revisit it?"

Wait for confirmation before continuing.

### Step 2: The founding question
Ask: *"In one sentence: what problem does [company name] exist to solve, and for whom?"*

Wait for the answer. Do NOT offer examples or suggest language — let the founder find their own words.

### Step 3: Dig deeper (in sequence, wait for each answer)
1. *"Why hasn't this problem been solved well before?"*
2. *"What does winning look like in 3-5 years? What's different in the world?"*
3. *"If [company] disappeared tomorrow, who would notice and why?"*

### Step 4: Draft vision and mission
Based on the founder's answers, synthesize two statements:

- **Vision** — the world-change. One sentence. Starts with "A world where…" or similar future-state framing.
- **Mission** — how you get there. One sentence. Starts with "[Company] helps/builds/enables…"

Show both and ask: *"Does this feel true? Should we adjust anything?"*

Iterate until the founder approves the exact text.

### Step 5: Save (with confirmation)
Once the founder explicitly approves, show the final values:

> "I'll save:
> **Vision:** [text]
> **Mission:** [text]
>
> Confirm?"

Emit `⚡OPTIONS:{"confirm": true}⚡` and wait for approval.

On approval, call `update_company_identity` with the approved vision and mission.

### Step 6: Stage and team (suggest to memory)
After identity is saved, ask:
- *"What stage is [company] at? (idea / pre-revenue / revenue / growth)"*
- *"How many people are on the team right now?"*

If the founder answers, call `suggest_memory` with:
- `layer: "identity"`
- `content`: stage + team size summary
- A note that this is a PENDING suggestion for their approval

Remind the user: *"I've suggested the stage and team context to Memory — it will appear in your Memory panel for approval."*

---

## Rules
- Never invent or suggest vision/mission text without asking Step 2-3 first.
- `update_company_identity` always requires the confirm gate (Step 5). Do not skip it.
- `suggest_memory` creates a PENDING item — always tell the user it needs their approval.
- Do NOT call `update_memory` on any item during this skill — only create suggestions.

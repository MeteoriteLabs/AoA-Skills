---
name: aoa-team-design
description: Use when someone is deciding which agents a company or project should have — roles, adapter types, and concurrency — usually while setting up or scaling. Not for assigning existing agents to a specific task (that is routine assignment, no skill needed).
requires: aoa-mcp
key: skill:aoa-curated/aoa-team-design
---

## Prerequisites
Install AoA MCP: `npx @armyofagents/mcp`
Tools used in this skill: `query_company`, `query_agents`, `query_departments`, `create_agent`, `create_department`

---

# AoA Team Design

<!-- authoring: rigidity=flexible; degrees-of-freedom=medium (function/role recommendations adapt to what the company is building; org chart confirmation is not skippable) -->

## When to use
When a founder is starting out or expanding their agent team and wants structured guidance on which agents to hire and how to structure them. Run before `create_agent` calls.

---

## Process

### Step 1: Understand the company
Call `query_company` to get vision and mission.
Call `query_agents` to see who is already on the team.
Call `query_departments` to see current structure.

Ask: *"What are you primarily trying to build or operate? (e.g. a SaaS product, a content operation, an e-commerce store)"*

### Step 2: Identify functions needed
Based on the answer, identify which functions the company needs:

| Function | What agents do |
|----------|---------------|
| **Engineering** | Write code, review PRs, maintain systems |
| **Design** | UI/UX, brand, visual assets |
| **QA** | Testing, bug verification, regression checks |
| **Content/Marketing** | Copy, posts, SEO, campaigns |
| **Support** | Respond to user issues, triage |
| **Research** | Competitive analysis, user interviews, data |
| **Operations** | Project management, coordination, documentation |

Ask: *"Which of these are priorities for the next 90 days?"*

### Step 3: Recommend the team
For each needed function, recommend:

| Role | Adapter | Concurrency | First task |
|------|---------|-------------|-----------|
| [Role name] | claude_local / codex_local / gemini_local | Start at 1 | [Specific task] |

Explain concurrency: *"Each agent starts at concurrency 1 — AoA's teaching default. As you see reliable output (tasks completed, no major mistakes), you can increase to 2-3. This is a ceiling you raise by trust, not a bottleneck."*

### Step 4: Show the org chart
Render a simple tree:

```
Engineering Department
├── Nova Coder (claude_local, concurrency: 1)
└── Nova Reviewer (claude_local, concurrency: 1)
QA Department
└── QA Agent (claude_local, concurrency: 1)
```

Ask: *"Does this structure make sense? Should I adjust any roles or departments?"*

Do NOT proceed until the user confirms.

### Step 5: Create (after confirmation)
Emit `⚡OPTIONS:{"confirm": true}⚡` before each create call.

Create in order:
1. Call `create_department` for any new departments needed.
2. Call `create_agent` for each new agent (with `departmentId` linking to their department).

After each `create_agent` call, confirm before the next one unless the user approved the full batch.

### Step 6: Summary
After creation:

> "Created [N] agents across [M] departments. Each starts at concurrency 1. When you're ready to give an agent their first task, I can assign it — just say the word."

---

## Rules
- Always explain the concurrency teaching default (Step 3). Never skip it.
- Do NOT create agents without showing the org chart first (Step 4).
- Respect department scope — agents should be assigned to a department on creation.
- `create_agent` requires founder-level permission. If the user is a team lead, tell them the founder needs to approve agent creation.
- Adapter guidance: `claude_local` for general-purpose; `codex_local` for coding-heavy roles; `gemini_local` for research/analysis-heavy roles.

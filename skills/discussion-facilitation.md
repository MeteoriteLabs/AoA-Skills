---
name: aoa-discussion-facilitation
description: Use when a discussion thread has accumulated conversation and someone wants the decisions, tasks, insights, and context pulled out and organized. Not for authoring one new task from scratch (use Spec).
requires: aoa-mcp
key: skill:aoa-curated/aoa-discussion-facilitation
---

## Prerequisites
Install AoA MCP: `npx @armyofagents/mcp`
Tools used in this skill: `search_discussions`, `extract_from_content`, `link_discussion_to_project`, `submit_extracted_items`, `query_goals`, `query_departments`, `create_task`

---

# AoA Discussion Facilitation

<!-- authoring: rigidity=flexible; degrees-of-freedom=high (which sub-actions to run — extract, link, create tasks — depend entirely on what the user asks for) -->

## When to use
When the user wants to get value out of a discussion thread: extract decisions that were made, surface tasks that were mentioned but not created, capture insights or context for Memory, or link a thread to the right department/project.

---

## Process

### Step 1: Find the discussion
If the user hasn't specified which thread:

Call `search_discussions` to find recent or relevant threads.

Ask: *"Which discussion thread should I work with? Here are the most recent ones: [list from search results]"*

If the user names one directly, use that.

### Step 2: Understand the goal
Ask: *"What do you want me to do with this thread?"*

Offer options:
- Extract decisions, tasks, and insights for review
- Link this thread to a department or project
- Create tasks directly from action items in the thread
- All of the above

Emit `⚡OPTIONS:{"choices": ["Extract items for review", "Link to project/department", "Create tasks from action items", "All of the above"]}⚡`

### Step 3: Extract structured items (if selected)
Call `extract_from_content` with the thread content.

The extraction identifies:
- **decision** — choices that were made, with rationale
- **task** — action items that need doing
- **insight** — non-obvious observations or learnings
- **context** — background information about the team/product
- **reference** — links, tools, or resources mentioned
- **preference** — working style or operational preferences

Show the extraction results to the user:

> "Found [N] items in this thread:
> - [N] decisions
> - [N] tasks
> - [N] insights
> - [N] context items
>
> [Show the full list with confidence levels]"

Ask: *"Which items should I submit for your review? You can remove any before I submit."*

### Step 4: Submit items (after confirmation)
Once the user approves the item list, emit `⚡OPTIONS:{"confirm": true}⚡`.

Call `submit_extracted_items` with the approved items. These will appear in the Discussion panel for founder approval.

### Step 5: Link to project/department (if selected)
Call `query_departments` and `query_goals` to show available link targets.

Ask: *"Which department or project should this thread be linked to?"*

On selection, call `link_discussion_to_project` with the thread ID and selected target.

### Step 6: Create tasks (if selected)
For each task-type extracted item, show a brief task spec:

> "Found [N] action items:
> 1. [Action item] → suggested assignee: [agent]
> 2. [Action item] → suggested assignee: [agent]"

Ask: *"Which of these should I create as tasks? I'll show you each spec before creating."*

For each approved task, call `create_task` with the confirm gate.

---

## Rules
- Do NOT call `submit_extracted_items` without showing the user the extracted items first.
- Do NOT call `create_task` without the confirm gate for each task.
- Low-confidence items (ambiguous or unclear) must be flagged to the user before submitting — do not silently include them.
- `extract_from_content` is read-only. `submit_extracted_items` is a write action requiring confirmation.
- If the thread has no meaningful content to extract, say so: *"This thread doesn't appear to have decisions, tasks, or insights worth capturing."*

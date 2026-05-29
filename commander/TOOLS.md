# Commander — Tool Reference

You have **34 tools** across 9 categories. Only call tools in this list. No other tool names exist.

---

## Query Tools (read-only, call freely)

| Tool | What it returns |
|------|----------------|
| `query_tasks` | Tasks filtered by status, assignee, department, goal |
| `query_goals` | Company goals with status, progress, linked tasks |
| `query_agents` | Agent roster with adapter type, trust score, current assignments |
| `query_departments` | Department list with agent counts and goals |
| `query_budget` | Spend by agent/department, remaining budget, cost events |
| `query_activity` | Recent activity log across all entities |
| `query_company` | Company identity: name, vision, mission, stage, settings |

---

## Action Tools (confirm before calling)

| Tool | What it does |
|------|-------------|
| `create_task` | Creates a new task (title, description, priority, assignee, goalId) |
| `update_task` | Updates an existing task (status, priority, assignee, description) |
| `create_department` | Creates a new department (name, description, parentId) |
| `create_goal` | Creates a company goal (title, description, targetDate) |
| `create_agent` | Provisions a new agent (name, role, adapterType, department) |
| `update_agent` | Updates agent config (name, concurrency, adapterConfig) |
| `assign_task` | Assigns a task to a specific agent |
| `wakeup_agent` | Triggers an immediate agent heartbeat run |
| `update_company_identity` | Updates company vision and/or mission — founder must approve |

---

## Memory Tools

| Tool | Notes |
|------|-------|
| `query_memory` | Search or list memory items by layer, department, or keyword |
| `create_memory` | Create a PENDING memory item (not saved until founder approves) |
| `update_memory` | Update an existing approved memory item |
| `find_similar_memory` | Semantic search — find memory items related to a concept |
| `detect_conflicts` | Check whether a new memory item contradicts existing ones |

**Layer reference:** `identity` (company-wide permanent) → `domain` (how we work, semi-permanent) → `active_context` (goal/project-scoped, expires) → `working` (task-chain-scoped, ephemeral, 7-day auto-archive)

---

## Discussion Tools

| Tool | What it does |
|------|-------------|
| `extract_from_content` | Extract structured items (decisions, tasks, insights) from raw text |
| `search_discussions` | Search discussion threads by keyword, department, or date range |
| `link_discussion_to_project` | Link a discussion thread to a department or project |
| `submit_extracted_items` | Submit extracted items for founder review and approval |

---

## Workflow Tools

| Tool | What it does |
|------|-------------|
| `create_workflow_template` | Create a reusable task-chain template with ordered steps |
| `instantiate_workflow` | Expand a workflow template into real tasks for a goal |
| `add_task_dependency` | Add a blocking relationship between two tasks |

---

## File Tools

| Tool | What it does |
|------|-------------|
| `read_file` | Read a file from the execution workspace |

---

## Coordination Tools

| Tool | What it does |
|------|-------------|
| `query_dependency_chain` | Get the full dependency graph for a task or goal |

---

## Analysis Tools

| Tool | What it does |
|------|-------------|
| `analyze_workload` | Summarize agent workload distribution across departments |
| `suggest_improvements` | Generate improvement suggestions based on current company state |

---

## Skills & Delegation Tools

| Tool | What it does |
|------|-------------|
| `use_skill` | Load the full markdown for a named skill and apply its instructions |
| `delegate_to_subagent` | Hand off a subtask to a specialized agent |

---

## Usage Rules

1. **Never guess a tool name.** The 34 tools above are your complete set. If a skill or instruction references a tool not on this list, flag it.
2. **Query before action.** Call read tools to gather current state before any write.
3. **Confirm before write.** All Action and Workflow tools require user confirmation via ⚡OPTIONS⚡ unless a loaded skill explicitly grants auto-execute for the specific step.
4. **Memory governance.** `create_memory` → PENDING. Use `detect_conflicts` before creating new memory that might contradict existing items.

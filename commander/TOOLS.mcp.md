# AoA MCP — Tool Reference (external agents over the MCP server)

<!-- GENERATED — DO NOT EDIT. Run `bun scripts/gen-tools-md.ts`. Source: generated/tools.json -->

37 tools exposed over the authenticated MCP endpoint, RBAC-scoped. Family is derived from the exported handler maps in `server/src/mcp/tools/index.ts` (read/write/document/approval/skill/ask).

| Tool | R/W | Family | What it does |
|------|-----|--------|--------------|
| `add-approval-comment` | write | approval | Add a comment to an approval. Any role may comment on approvals they can see. |
| `add-task-comment` | write | write | Add a comment to a task the caller can access |
| `approval-decision` | write | approval | Approve, reject, request revision, or resubmit an approval. Founders + team leads only. Team leads limited to approvals with at least one task in their scope. |
| `ask_founder` | write | ask | Ask the founder a question and block (up to ~5 min) for the answer. For org/heartbeat task-execution agents during an active run only. Surfaces in the Inbox as a question the founder answers (free-text, or one of your options). On timeout the run is parked and you get {answered:false, status:"parked"} — stop gracefully; do not retry. |
| `attach-artifact-version` | write | write | Add a new immutable version to an artifact |
| `create-approval` | write | approval | Create a new approval request. Founders + team leads only. Team leads must link at least one task from their scope. |
| `create-task` | write | write | Create a task directly in the caller's company (RBAC scoped). Does NOT route through Discussion; use debrief-push for unstructured content extraction (Decision #14 revised) |
| `debrief-push` | write | write | Push content into the Debrief pipeline |
| `get-agent` | read | read | Get a single agent by id (RBAC scoped) |
| `get-approval` | read | approval | Get an approval by id (RBAC scoped; cross-company 404) |
| `get-approval-tasks` | read | approval | List tasks linked to an approval. Scoped users see only tasks in their projects. |
| `get-heartbeat-context` | read | read | Return a compact { task, recentComments } payload for a task (last 10 comments) |
| `get-project` | read | read | Get a single project by id (RBAC scoped) |
| `get-task-comment` | read | read | Get a single task comment by id (RBAC scoped via its task) |
| `get-task-document` | read | document | Return the task's document artifact with its latest version (content + metadata) |
| `link-task-approval` | write | approval | Link an existing approval to an existing task. Founders + team leads only. |
| `list-agents` | read | read | List agents in the caller's company, scoped by RBAC |
| `list-approval-comments` | read | approval | List comments on an approval (RBAC scoped) |
| `list-approvals` | read | approval | List approvals in the caller's company. Scoped users see only approvals linked to tasks in their projects. Filterable by status and type. |
| `list-projects` | read | read | List projects (departments + projects) in the caller's company |
| `list-task-approvals` | read | approval | List approvals linked to a task (RBAC scoped via the task) |
| `list-task-comments` | read | read | List comments on a task (RBAC scoped) |
| `list-task-document-revisions` | read | document | List all immutable revisions of the task's document artifact, ordered ascending by version number |
| `list-task-documents` | read | document | List document artifacts attached to a task (0 or 1 — AoA has 1:1 task↔artifact) |
| `list-tasks` | read | read | List tasks in the caller's company with RBAC scoping. Supports filters: status, projectId, assigneeAgentId, assigneeUserId, responsibleUserId, touchedByUserId, unreadForUserId, labelId, q |
| `me` | read | read | Return the authenticated caller's identity and role |
| `memory.get` | read | read | Fetch a single approved memory item by id. Returns 404 when the item is outside the caller's RBAC scope. |
| `memory.retain` | write | write | Persist an observation to memory. When called by an agent actor with scopeToSelf=true AND layer="working", the item is auto-approved into that agent's personal working-memory bucket. Self-scoped retains targeting identity/domain/active_context — and all non-agent writes — instead create a pending item awaiting founder review (Critical Rule #6: only the founder approves identity/domain). |
| `memory.search` | read | read | Search company memory using multi-pathway retrieval (semantic + keyword + temporal). Returns top-K items ranked by RRF + trust weighting, scoped to the caller's RBAC visibility. |
| `memory.write` | write | write | Create a memory item and immediately enqueue it for RAG embedding. Always creates with status='pending' — the founder must approve before the item enters the Knowledge Base (Critical Rule #6: agents/MCP cannot self-approve identity or domain memory). Use this when you have structured knowledge to persist; use debrief-push for unstructured content that needs LLM extraction first. |
| `restore-task-document-revision` | write | document | Create a NEW document artifact version whose content is copied from the specified older revision. The older revision is never mutated (preserves Decisions #43/#45 — artifact versions are immutable). |
| `suggest-memory` | write | write | Create a pending memory suggestion |
| `unlink-task-approval` | write | approval | Unlink an approval from a task. Founders + team leads only. |
| `update-task` | write | write | Update a task's fields (title, description, status, priority, assignee, etc.) with RBAC checks |
| `update-task-status` | write | write | Update a task status with permission checks |
| `upsert-task-document` | write | document | Create or update the task's document (markdown). If the task already has a document artifact, appends a new immutable version; otherwise creates an artifact of type 'document' and links it to the task. Maps Paperclip's upsert-issue-document to AoA's artifact subsystem. |
| `use_skill` | write | skill | Load the full instructions for an AoA skill by key (e.g. 'skill:aoa/brainstorm'). Returns the skill's markdown so your model can follow it. Call query_skills first if you are unsure of the available skill keys. |

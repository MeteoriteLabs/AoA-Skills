# AoA Commander Skills

Official Commander skills and instruction files for [Army of Agents](https://armyofagents.com). This repo is the canonical source for:

- **Commander instruction files** (`commander/`) — AGENTS.md, SOUL.md, TOOLS.md, HEARTBEAT.md
- **Skills** (`skills/`) — structured workflows for 8 Commander capabilities
- **Model overlays** (`model-overlays/`) — adapter-specific behavioral patches for claude_local, codex_local, opencode_local, gemini_local
- **Platform configs** — plugin configs for Claude Code, Codex, OpenCode, and Gemini external users

## Skills

| Skill | Key | When to use |
|-------|-----|-------------|
| Brainstorm | `skill:aoa-curated/aoa-brainstorm` | A raw or half-formed idea needs pressure-testing before any building starts |
| Identity Setup | `skill:aoa-curated/aoa-identity-setup` | A new or unshaped company needs vision, mission, and identity established |
| Sprint Planning | `skill:aoa-curated/aoa-sprint-planning` | A goal or larger effort needs breaking into several tasks with dependencies |
| Team Design | `skill:aoa-curated/aoa-team-design` | Deciding which agents a company or project should have |
| Office Hours | `skill:aoa-curated/aoa-office-hours` | Weighing a side project, product feature, or strategic bet before committing |
| Investigate | `skill:aoa-curated/aoa-investigate` | An agent run failed, a task is stuck, or an output is wrong and the cause is unclear |
| Spec | `skill:aoa-curated/aoa-spec` | A decided change needs writing up as one backlog-ready task |
| Discussion Facilitation | `skill:aoa-curated/aoa-discussion-facilitation` | A discussion thread needs its decisions, tasks, and insights pulled out |

## Using skills in AoA

Commander loads skills automatically. Call `use_skill skill:aoa-curated/aoa-brainstorm` in any Commander conversation to load a skill's full instructions.

## Using skills externally (Claude Code, Codex, Gemini)

### Claude Code
```bash
cd ~/.claude/plugins && git clone https://github.com/MeteoriteLabs/AoA-Skills.git aoa-skills
```
Requires AoA MCP: `npx @armyofagents/mcp`

### Codex
```bash
cd ~/.codex/plugins && git clone https://github.com/MeteoriteLabs/AoA-Skills.git aoa-skills
```

### OpenCode
```bash
cd ~/.opencode/plugins && git clone https://github.com/MeteoriteLabs/AoA-Skills.git aoa-skills
```

### Gemini CLI
```bash
cd ~/.gemini/extensions && git clone https://github.com/MeteoriteLabs/AoA-Skills.git aoa-skills
```

All adapters require AoA MCP: `npx @armyofagents/mcp`

## Validation

```bash
bun run validate      # check all skill files for invalid tool names
bun run validate:skills   # skills/ only
bun run validate:commander  # commander/ only
```

## Contributing

Skills in this repo are published to the AoA marketplace via `aoa-marketplace`. Read
[`AUTHORING.md`](./AUTHORING.md) first — it covers description rules (WHEN-only
routing prose), surface-agnostic tool references, the shared-preamble contract,
rigid-vs-flexible self-labeling, and cross-skill referencing conventions. To
update a skill:

1. Edit the `.md` file in `skills/`
2. Run `bun run validate` to check tool names
3. Open a PR — CI will validate automatically
4. After merge, run `scripts/sync-to-marketplace.sh` to publish

## License

MIT — see LICENSE.

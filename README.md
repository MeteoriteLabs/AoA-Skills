# AoA Commander Skills

Official Commander skills and instruction files for [Army of Agents](https://armyofagents.com). This repo is the canonical source for:

- **Commander instruction files** (`commander/`) — AGENTS.md, SOUL.md, TOOLS.md, HEARTBEAT.md
- **Skills** (`skills/`) — structured workflows for 8 Commander capabilities
- **Model overlays** (`model-overlays/`) — adapter-specific behavioral patches for claude_local, codex_local, opencode_local, gemini_local
- **Platform configs** — plugin configs for Claude Code, Codex, OpenCode, and Gemini external users

## Skills

| Skill | Key | Description |
|-------|-----|-------------|
| Brainstorm | `skill:aoa-curated/aoa-brainstorm` | YC-style idea interrogation before building |
| Identity Setup | `skill:aoa-curated/aoa-identity-setup` | Guide a new company through vision/mission setup |
| Sprint Planning | `skill:aoa-curated/aoa-sprint-planning` | Break a goal into structured tasks |
| Team Design | `skill:aoa-curated/aoa-team-design` | Design the right agent team |
| Office Hours | `skill:aoa-curated/aoa-office-hours` | Design thinking for product ideas |
| Investigate | `skill:aoa-curated/aoa-investigate` | Root-cause investigation for failures |
| Spec | `skill:aoa-curated/aoa-spec` | Author a backlog-ready task spec |
| Discussion Facilitation | `skill:aoa-curated/aoa-discussion-facilitation` | Extract value from discussion threads |

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

Skills in this repo are published to the AoA marketplace via `aoa-marketplace`. To update a skill:

1. Edit the `.md` file in `skills/`
2. Run `bun run validate` to check tool names
3. Open a PR — CI will validate automatically
4. After merge, run `scripts/sync-to-marketplace.sh` to publish

## License

MIT — see LICENSE.

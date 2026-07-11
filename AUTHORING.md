# Authoring Conventions

Rules for writing and editing skills in this repo. Read this before adding a new
skill or editing an existing one.

## 1. Descriptions are WHEN-only

The frontmatter `description` states **when** to reach for the skill and when
**not** to — it never summarizes the steps. A summary lets the model think it
already knows the process and skip the skill body entirely.

This is the field that survives the marketplace pipeline and reaches Commander
at runtime (`triggerPhrases` does not — see `commander-skills.ts`'s
`buildCompactSkillList`). It is the durable routing signal, so it carries all
the weight: situation, intent, and disambiguation against sibling skills.

> Good: `Use when someone has a decided change... Not for still-uncertain ideas (use Brainstorm).`
> Bad: `Interrogates the idea, surfaces assumptions, and decides whether to build.`

## 2. Prefer intent-words; Commander-surface tool names are acceptable in prose

Skill prose should prefer describing *intent* — "suggest a memory item,"
"create the task" — over a hardcoded tool spelling. But naming a real
Commander-surface tool verbatim in prose is acceptable: Commander is the
primary surface skills run on, and every name is checked against the
generated allowlist (`generated/tools.json` via `bun run validate`), so a
stale or phantom name gets caught, not silently shipped.

What's not acceptable is hardcoding an MCP-surface spelling (e.g.
`memory.write` where the Commander name is `suggest_memory`) — those differ
per surface and are resolved from the generated per-surface cheat-sheet, not
authored by hand in skill bodies.

The one tool name safe to write verbatim on every surface is `use_skill`.

> Good: "...suggest this to Memory as a `active_context` item."
> Good (Commander-surface, validated): "...call `suggest_memory`."
> Bad (MCP-surface spelling, don't hardcode in prose): "...call `memory.write`."

The `## Prerequisites` "Tools used in this skill" cheat-sheet line is the
exception: it is a per-skill tool list generated/maintained per Plan 1's
manifest and is expected to name real tools verbatim.

## 3. The shared preamble is assumed, not restated

Persona, the confirm-gate (`⚡OPTIONS⚡`), and memory-is-PENDING are injected
once by the product (`commander-preamble.ts`, above the skills table and at
`use_skill` point-of-load). Skill bodies must not re-teach these as a general
rule.

Do reference the confirm gate at the **specific step** where a write happens
("Once the founder explicitly approves... Emit `⚡OPTIONS:{"confirm": true}⚡`")
— that is instructional, not boilerplate. Don't add a generic paragraph
explaining what the confirm gate is or that memory suggestions are PENDING in
general; the preamble already says that.

## 4. Self-label rigidity + degrees of freedom

Every skill declares, near the top (immediately under the H1), whether its
process is:

- **rigid** — follow verbatim; order/governance matters (e.g. identity setup,
  investigation — skipping steps or reordering them breaks the guarantee the
  skill exists to provide).
- **flexible** — adapt to context; skip questions already answered, reorder
  within reason.

Format is a single HTML comment, greppable by humans and tooling:

```
<!-- authoring: rigidity=flexible; degrees-of-freedom=high (skip questions already answered; adapt template) -->
```

## 5. One excellent example beats three mediocre ones

Prefer a single fully-worked example over several partial ones. `spec.md`'s
spec template is the reference: one complete, concrete artifact the model can
pattern-match against, not three half-shown variants.

## 6. Reference sibling skills by name, never eager-load

Write "load Sprint Planning" or "use Spec instead" — do not `@`-include or
paste another skill's content into this one. This matches the product
preamble's routing rule and keeps each skill file self-contained.

## 7. Single-file for R1

Multi-file progressive disclosure (`references/`, `scripts/` subdirectories)
is deferred until the `use_skill` product change that supports it lands.
Until then, keep each skill a single `.md` file.

## 8. Validation is required

`bun run validate` must pass (0 tool name errors) before merging any skill
change. Descriptions must not summarize a workflow — see §1. When editing a
skill, re-run the description length/no-summary checks described in the
skills-repo plan before committing.

# create-agentic-workspace

Scaffold a complete, **harness-agnostic agentic workspace** into any new project — works
with Claude Code (Fable 5), OpenCode (Kimi K3 or any model), and every
AGENTS.md-compatible tool.

One interactive command gives you:

- **`AGENTS.md` as single source of truth** — harness files (`CLAUDE.md`,
  `.claude/commands/`, `.opencode/command/`) are generated mirrors of `.agents/skills/`.
- **Scrum loops with ceremonies** as slash commands: `/backlog-refinement`,
  `/sprint-planning`, `/standup`, `/sprint-review`, `/retrospective` — plus product
  backlog, Definition of Done and per-sprint files in `scrum/`.
- **Living memory** (`memory/`) — project brief, active context, decision log, progress —
  kept in sync with `/memory-update`, shared across sessions and harnesses.
- **ADRs** (`docs/adr/`, MADR-lite) via `/adr-new`.
- **Security baseline** (`security/SECURITY-BASELINE.md`) audited by `/security-review`.
- **Portfolio plugin** — vendors the [portfolio-agent](https://github.com/vincentheimann/portfolio-agent)
  so `/portfolio` builds an evidence-based `PORTFOLIO.md` case study.
- **Context optimizers** — guided setup (`/setup-optimizers`) for
  [Headroom](https://docs.headroomlabs.ai/docs) (context compression),
  [Ponytail](https://github.com/dietrichgebert/ponytail) (minimal-code discipline) and
  [Graphify](https://github.com/Graphify-Labs/graphify) (codebase knowledge graph).

## Usage

```bash
# from this repo on GitHub
npx github:vincentheimann/create-agentic-workspace my-project

# or from a local clone
node bin/cli.js my-project
```

The wizard asks for: project name & description, stack, target harnesses, sprint length,
team mode, modules to enable, optimizers, and whether to `git init` with an initial
commit. Every module is optional; `AGENTS.md` is composed from only what you enable.

Non-interactive: `--yes` accepts all defaults. Other flags: `--offline` (skip the
portfolio-agent download), `--no-git`.

## Generated workspace layout

```
my-project/
├── AGENTS.md                  # single source of truth for all agents
├── CLAUDE.md                  # thin Claude Code entrypoint (imports AGENTS.md)
├── .agents/
│   ├── skills/                # skill sources (edit here, then re-copy to mirrors)
│   └── portfolio-agent.md     # vendored portfolio agent definition
├── .claude/commands/          # mirror for Claude Code   (if selected)
├── .claude/agents/portfolio.md
├── .opencode/command/         # mirror for OpenCode      (if selected)
├── memory/                    # living memory (brief, active context, decisions, progress)
├── docs/adr/                  # architecture decision records
├── scrum/                     # backlog, DoD, sprints/, working agreements
├── security/SECURITY-BASELINE.md
└── optimizers/OPTIMIZERS.md   # chosen optimizers + real install commands
```

## The Scrum loop

```
/backlog-refinement → /sprint-planning → daily /standup → /sprint-review → /retrospective
```

The user is the Product Owner; agents facilitate ceremonies, keep artifacts and memory in
sync, and never invent priorities. Ceremonies are plain markdown skills, so they run
identically in any harness that supports commands — and can be followed manually in one
that doesn't.

## Extending

- **Add a skill:** drop a markdown file (frontmatter `description:` + instructions) into
  `template/skills/`, register it in the `SKILLS` map in `bin/cli.js`.
- **Add a module:** add its files to `template/`, register paths in the `FILES` map, and
  wrap any `AGENTS.md` additions in `<!-- BEGIN:yourmodule --> … <!-- END:yourmodule -->`.
- Conditional content anywhere in templates uses the same BEGIN/END markers; `{{VARS}}`
  are substituted at scaffold time.

## Development

Zero runtime dependencies (Node ≥ 18.17). Run the smoke test:

```bash
npm test
```

## License

MIT

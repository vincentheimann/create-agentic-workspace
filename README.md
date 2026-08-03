# create-agentic-workspace

Scaffold a complete, **harness-agnostic agentic workspace** into any new project — works
with Claude Code (Fable 5), OpenCode (Kimi K3 or any model), and every
AGENTS.md-compatible tool.

**New to AI coding agents?** Everything here is beginner-friendly: the scaffolder asks
plain questions, and the generated project includes a `GETTING-STARTED.md` written for
humans who have never used an agent before.

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

## Prerequisites

| Tool | Needed for | Install |
|---|---|---|
| **Node.js ≥ 18.17** | Running the scaffolder | https://nodejs.org (LTS) |
| **git** | The `npx github:` form and `git init` | https://git-scm.com |
| **A harness** (at least one) | Actually working with agents | Claude Code: `npm install -g @anthropic-ai/claude-code` · OpenCode: `npm install -g opencode-ai` |

Optional, only if you enable the matching optimizer:

- **Graphify** needs Python tooling (`uv` or `pipx`) — https://docs.astral.sh/uv/. You
  don't have to prepare it: the wizard detects a missing Python setup when you select
  Graphify and warns you, and `/setup-optimizers` offers to install `uv` later (with
  your consent, never automatically).
- **Headroom** and **Ponytail** are installed later, guided by `/setup-optimizers` inside
  the workspace. Nothing to prepare.

Check your versions: `node --version` and `git --version`.

## Quick start

```bash
# straight from GitHub (requires git installed)
npx github:vincentheimann/create-agentic-workspace my-project

# or from a local clone
git clone https://github.com/vincentheimann/create-agentic-workspace
node create-agentic-workspace/bin/cli.js my-project
```

The wizard asks about: project name & description, stack, target harnesses, sprint
length, team mode, modules, optimizers, and git init. **Press Enter to accept the
defaults** — the defaults produce a full workspace with everything enabled.

Then:

```bash
cd my-project
claude        # or: opencode
```

…and follow `GETTING-STARTED.md` in the generated project — it walks a first-time user
through the first 15 minutes (fill the project brief, install optimizers, build a
backlog, start Sprint 1).

Flags for non-interactive use: `--yes` (all defaults), `--offline` (skip the
portfolio-agent download), `--no-git`, `--help`, `--version`.

## Generated workspace layout

```
my-project/
├── AGENTS.md                  # single source of truth for all agents
├── GETTING-STARTED.md         # human-facing guide to the workspace
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

## FAQ

**Do I need both Claude Code and OpenCode?**
No — pick whichever you have in the wizard's harness question. `AGENTS.md` works with
any compliant tool, so you can add a harness later.

**Can I run this on an existing project?**
Yes. The scaffolder never overwrites existing files (it lists what it kept untouched),
and it refuses to run at all if the project already has an `AGENTS.md`. Review the
generated `.gitignore` note in the output if your project already had one.

**Which model do I need?**
Any capable coding model. The workspace is tested with Claude (Fable 5 / Opus) via
Claude Code and Kimi K3 via OpenCode; nothing in it is model-specific.

**Are the optimizers required?**
No — they're all optional and can be skipped in the wizard or installed later with
`/setup-optimizers`.

**I don't have Python — can I still pick Graphify?**
Yes. The wizard warns you that Python tooling is missing and lets you keep or drop the
selection. If you keep it, `/setup-optimizers` walks you through installing `uv`
(Windows: `winget install --id=astral-sh.uv -e`, macOS/Linux: the official install
script) before installing Graphify. The scaffolder itself never installs Python — that
choice stays yours.

## Troubleshooting

- **`npx github:… ` fails immediately** — you probably don't have git installed (npx
  needs it to fetch from GitHub), or a corporate proxy blocks GitHub. Clone manually and
  run `node bin/cli.js` instead.
- **"needs Node.js >= 18.17"** — update Node from https://nodejs.org.
- **"Could not fetch the portfolio agent"** — you were offline or GitHub was
  unreachable; the scaffolder wrote a placeholder at `.agents/portfolio-agent.md` with
  the URL to fetch manually. Everything else works normally.
- **Slash command not found in the harness** — commands live in `.claude/commands/`
  (Claude Code) or `.opencode/command/` (OpenCode); restart the harness after
  scaffolding, or check that you selected that harness in the wizard.
- **`graphify: command not found` after install** — run `uv tool update-shell` (uv) or
  `pipx ensurepath`, then open a new terminal.

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

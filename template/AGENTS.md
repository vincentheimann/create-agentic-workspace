# {{PROJECT_NAME}}

{{PROJECT_DESCRIPTION}}

**Stack:** {{STACK}}
**Harnesses:** {{HARNESSES}}

This file is the single source of truth for every AI agent working in this repository —
Claude Code (Fable 5), OpenCode (Kimi K3 or others), or any AGENTS.md-compatible tool.
Harness-specific files (`CLAUDE.md`, `.claude/commands/`, `.opencode/command/`) are thin
mirrors of `.agents/skills/`. Edit a skill in `.agents/skills/` and copy it to the mirrors;
never edit a mirror directly.

## Operating rules

1. **Read before you act.** At session start, read `memory/active-context.md` and skim
   `memory/project-brief.md`. Do not re-derive what the memory already records.
2. **Minimalism.** The best code is the code you never wrote. Before adding code, check
   whether the standard library, the platform, or an existing dependency already solves it.
3. **Record decisions.** Significant or hard-to-reverse choices get an ADR (`/adr-new`).
   Small learnings go to `memory/decision-log.md`.
4. **Leave the camp clean.** Before ending a work session, run `/memory-update`.
5. **Honesty.** Report failing tests as failing. Never fabricate results, metrics, or
   evidence. Prefer "unknown" over a guess.

<!-- BEGIN:memory -->
## Living memory

The `memory/` directory is the project's persistent memory across sessions and across
harnesses. It is deliberately small — four files, each kept under ~150 lines:

| File | Contains | Updated |
|---|---|---|
| `memory/project-brief.md` | Purpose, users, goals, constraints | Rarely |
| `memory/active-context.md` | Current focus, recent changes, next steps | Every session (`/memory-update`) |
| `memory/decision-log.md` | Dated log of decisions with rationale | When deciding |
| `memory/progress.md` | What works, what's left, known issues | End of each sprint / milestone |

Prune aggressively: stale content in memory is worse than no content.
<!-- END:memory -->

<!-- BEGIN:scrum -->
## Scrum protocol

- Sprint length: **{{SPRINT_LENGTH_WEEKS}} week(s)**. Team mode: **{{TEAM_MODE}}**.
- The user is the Product Owner. The agent facilitates ceremonies and can act as
  developer; it never invents Product Owner priorities.
- Artifacts live in `scrum/`: `PRODUCT-BACKLOG.md` (ordered), `DEFINITION-OF-DONE.md`,
  and one file per sprint in `scrum/sprints/`.

Ceremonies are slash commands (harness-portable, human-triggered):

| Ceremony | Command | Cadence |
|---|---|---|
| Backlog refinement | `/backlog-refinement` | As needed |
| Sprint planning | `/sprint-planning` | Sprint start |
| Daily scrum | `/standup` | Daily |
| Sprint review | `/sprint-review` | Sprint end |
| Retrospective | `/retrospective` | After review |

An increment only counts as Done when it satisfies `scrum/DEFINITION-OF-DONE.md`.
<!-- END:scrum -->

<!-- BEGIN:adr -->
## Architecture Decision Records

ADRs live in `docs/adr/`, numbered sequentially, using the MADR-lite format in
`docs/adr/template.md`. Create one with `/adr-new` whenever a decision is significant,
hard to reverse, or someone will later ask "why is it like this?". Supersede rather than
edit accepted ADRs.
<!-- END:adr -->

<!-- BEGIN:security -->
## Security baseline

`security/SECURITY-BASELINE.md` defines the practices this project commits to (secrets
handling, dependency hygiene, input validation, least privilege, ...). Run
`/security-review` before releases and after significant changes; findings are written to
`security/FINDINGS.md` with severity. Never commit secrets — use environment variables or
a secret manager.
<!-- END:security -->

<!-- BEGIN:portfolio -->
## Portfolio

`.agents/portfolio-agent.md` contains the Portfolio agent definition (mirrored to
`.claude/agents/portfolio.md` for Claude Code). Run `/portfolio` after notable milestones
to create or refresh `PORTFOLIO.md` — an honest, evidence-based case study built from git
history, ADRs and docs. It never fabricates metrics or outcomes.
<!-- END:portfolio -->

<!-- BEGIN:optimizers -->
## Context optimizers

`optimizers/OPTIMIZERS.md` documents the optimizers chosen for this workspace and how to
install them (`/setup-optimizers` walks through it):

<!-- BEGIN:headroom -->
- **Headroom** — context compression layer between agent and LLM (proxy / library / MCP).
<!-- END:headroom -->
<!-- BEGIN:ponytail -->
- **Ponytail** — minimal-code discipline: prefer deleting/reusing over writing new code.
<!-- END:ponytail -->
<!-- BEGIN:graphify -->
- **Graphify** — local knowledge graph of the codebase; query the graph (`graphify query`,
  `graphify path`, `graphify explain`) instead of grepping broadly. Rebuild with
  `/graphify .` after structural changes.
<!-- END:graphify -->
<!-- END:optimizers -->

## Available commands

<!-- BEGIN:scrum -->
- `/sprint-planning`, `/standup`, `/backlog-refinement`, `/sprint-review`, `/retrospective` — Scrum ceremonies
<!-- END:scrum -->
<!-- BEGIN:adr -->
- `/adr-new` — record an architecture decision
<!-- END:adr -->
<!-- BEGIN:memory -->
- `/memory-update` — sync the living memory before ending a session
<!-- END:memory -->
<!-- BEGIN:security -->
- `/security-review` — run the security baseline checklist
<!-- END:security -->
<!-- BEGIN:portfolio -->
- `/portfolio` — create or refresh PORTFOLIO.md
<!-- END:portfolio -->
<!-- BEGIN:optimizers -->
- `/setup-optimizers` — install/verify the context optimizers
<!-- END:optimizers -->

For harnesses without slash commands, open the corresponding file in `.agents/skills/`
and follow its instructions.

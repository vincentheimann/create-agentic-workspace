# Claude Code entrypoint

The workspace rules live in AGENTS.md — it is the single source of truth:

@AGENTS.md

Claude-specific notes:

- Slash commands are mirrored into `.claude/commands/` from `.agents/skills/`. If you
  change a skill, update `.agents/skills/` first, then re-copy to the mirrors.
<!-- BEGIN:portfolio -->
- The Portfolio agent is available as a subagent at `.claude/agents/portfolio.md`.
<!-- END:portfolio -->

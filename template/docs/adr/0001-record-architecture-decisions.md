# 0001. Record architecture decisions

- Status: accepted
- Date: {{DATE}}
- Deciders: {{PROJECT_NAME}} team

## Context and problem statement

Decisions made early in a project are forgotten, re-litigated, or silently reversed.
Agents and humans working across sessions need a durable record of *why* things are the
way they are.

## Considered options

1. **ADRs in the repository** — versioned with the code, readable by agents and humans.
2. **External wiki / tickets** — separate from the code, easily drifts out of date.
3. **No records** — fastest today, most expensive later.

## Decision outcome

Chosen option: **ADRs in the repository**, in `docs/adr/`, using the MADR-lite template.
The living memory (`memory/decision-log.md`) links to ADRs but does not duplicate them.

### Consequences

- Positive: decisions survive sessions, agents can cite them, review is possible.
- Negative: small writing overhead per significant decision.

# Living memory

Persistent project memory shared by all agents and all harnesses. Four files, each kept
short (target: under ~150 lines). The value of this directory is inversely proportional
to its size — prune stale content whenever you touch a file.

| File | Contains | Update cadence |
|---|---|---|
| `project-charter.md` | The compass: mission, vision, success criteria, non-goals, constraints | Rarely — only by explicit PO decision, logged in the decision log |
| `active-context.md` | Current focus, recent changes, next steps, open questions | Every session, via `/memory-update` |
| `decision-log.md` | Dated decisions with one-line rationale, links to ADRs | When a decision is made |
| `progress.md` | What works, what's left, known issues | Sprint end / milestones |

Rules:

- Memory records **facts and decisions**, not conversation history.
- The charter is the exception to pruning freely: it is the project's compass and
  changes only by explicit Product Owner decision.
- Convert relative dates ("last week") to absolute dates when writing.
- If a memory entry turns out to be wrong, delete or correct it — don't append a rebuttal.
- Deep architectural rationale belongs in `docs/adr/`; the decision log only links to it.

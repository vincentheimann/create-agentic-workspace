---
description: Record an architecture decision as a new ADR in docs/adr/.
---

Create a new **Architecture Decision Record**.

1. Determine the next number NNNN from the files in `docs/adr/`.
2. If the decision context isn't already clear from the conversation, ask for: the
   problem, the options considered, and the chosen option with rationale. Don't pad —
   a real ADR with two honest options beats a fake one with four.
3. Create `docs/adr/NNNN-<kebab-title>.md` from `docs/adr/template.md`, filling number,
   title, today's date, deciders, context, options, outcome and consequences.
   Status is `accepted` if the decision is confirmed, else `proposed`.
4. If it supersedes an older ADR, set that ADR's status to `superseded by NNNN` — the
   only edit ever allowed on an accepted ADR.
5. Add the ADR to the index table in `docs/adr/README.md`.
<!-- BEGIN:memory -->
6. Add a one-line entry to `memory/decision-log.md` linking to the ADR.
<!-- END:memory -->

---
description: Sync the living memory (memory/) with what happened this session. Run before ending work.
---

Update the **living memory** so the next session (any harness, any model) can continue
without re-deriving context.

1. Review what actually happened this session: files changed (`git status` / `git diff
   --stat`), decisions made, problems found.
2. Update `memory/active-context.md`:
   - **Current focus** — one or two sentences, present tense.
   - **Recent changes** — append dated facts; prune entries older than ~2 sprints.
   - **Next steps** — concrete, ordered; remove completed ones.
   - **Open questions** — add new ones, delete answered ones.
3. If a decision was made this session, ensure it's in `memory/decision-log.md`
   (and as an ADR via `/adr-new` if significant).
4. If a milestone was reached or new issues surfaced, update `memory/progress.md`.
5. Keep every file under ~150 lines — prune before appending. Stale memory is worse
   than no memory.
6. Reply with a 3–5 line summary of what you recorded.

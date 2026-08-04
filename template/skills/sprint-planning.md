---
description: Run Sprint Planning — agree a sprint goal with the PO and commit refined backlog items to a new sprint.
---

Facilitate **Sprint Planning**. The user is the Product Owner (PO); you propose, they decide.

1. **Prepare.** Read `memory/active-context.md`, `scrum/PRODUCT-BACKLOG.md`,
   `scrum/DEFINITION-OF-DONE.md`, and the previous sprint file in `scrum/sprints/`
   (including its retrospective actions — they must be honored this sprint).
2. **Propose a sprint goal.** One sentence of outcome (not a task list), derived from the
   top of the ordered backlog and serving the mission in `memory/project-charter.md` —
   say explicitly which success criterion it advances. Ask the PO to confirm or adjust
   before continuing.
3. **Select the commitment.** Walk the backlog top-down, taking only `refined` items
   (acceptance criteria + estimate present) that plausibly fit the sprint. If a top item
   is not refined, refine it now with the PO or skip it explicitly and say why.
4. **Create the sprint file.** Copy `scrum/sprints/_template.md` to
   `scrum/sprints/sprint-NNN.md` (next number, zero-padded). Fill sprint number, start
   date (today), end date (start + {{SPRINT_LENGTH_WEEKS}} week(s)), goal, and the
   commitment table. Carry retro actions into the commitment or the daily log as reminders.
5. **Sync state.** Mark committed items `committed` in the backlog. Update
   `memory/active-context.md`: current focus = the sprint goal.
6. **Close.** Summarize to the PO: goal, committed items with estimates, first steps, and
   any risks you already see.

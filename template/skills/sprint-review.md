---
description: Run the Sprint Review — inspect the increment against the sprint goal and adapt the backlog.
---

Facilitate the **Sprint Review** for the current sprint (highest-numbered file in
`scrum/sprints/`). Running this ceremony is what ends the sprint — whether it lasted a
single session or several weeks.

1. Read the sprint file, `scrum/DEFINITION-OF-DONE.md`, and the backlog.
2. For each committed story, verify Done honestly against the Definition of Done —
   run the test suite if one exists. A story that fails any DoD item is **not done**;
   say so plainly and move it back to the backlog (top, unless the PO decides otherwise).
3. Write the Review section of the sprint file, dated today (that date is the sprint's
   end):
   - What was achieved vs. the sprint goal (met / partly met / missed — and why).
   - One line of progress against the success criteria in `memory/project-charter.md` —
     the sprint served the mission, or say plainly that it didn't.
   - A short demo script or walkthrough the PO can follow to see the increment.
   - PO feedback and decisions (ask for them).
4. Adapt the backlog: mark done items `done`, re-add unfinished work, capture new items
   from feedback.
5. Update `memory/progress.md` (what works / what's left / known issues).
<!-- BEGIN:portfolio -->
6. If the sprint produced a notable milestone, suggest running `/portfolio` to refresh
   the case study.
<!-- END:portfolio -->

Close by proposing `/retrospective`.

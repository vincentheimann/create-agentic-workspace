---
description: Run the Standup — log progress since the last entry, plan the next step, surface blockers against the sprint goal.
---

Facilitate a **Standup** (max ~10 lines of output). Run it once per working session — at
least daily when work spans days. Focus on the sprint goal, not individual busywork.

1. Read the current sprint file in `scrum/sprints/` (highest number). If none exists,
   stop and suggest `/sprint-planning`.
2. Establish what happened since the last standup entry: check `git log` since that date,
   test status if cheap to obtain, and the story statuses in the commitment table.
3. Append a dated entry to the sprint file's Standup log:
   - **Done since last standup** — facts, with story IDs.
   - **Next** — the most valuable step toward the sprint goal this session.
   - **Blockers / risks to the goal** — anything threatening the goal; propose a
     mitigation or a question for the PO. If scope is clearly not going to fit, say so
     now, not at review.
4. Update story statuses in the sprint commitment table if they changed.
5. If the sprint goal is already Done, say so and suggest `/sprint-review` — the sprint
   ends at the review, not on a date.
6. Reply to the user with the three bullets only.

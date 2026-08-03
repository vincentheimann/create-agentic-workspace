---
description: Run the Daily Scrum — log progress, plan the day, surface blockers against the sprint goal.
---

Facilitate a **Daily Scrum** (max ~10 lines of output). Focus on the sprint goal, not
individual busywork.

1. Read the current sprint file in `scrum/sprints/` (highest number). If none exists,
   stop and suggest `/sprint-planning`.
2. Establish what happened since the last standup entry: check `git log` since that date,
   test status if cheap to obtain, and the story statuses in the commitment table.
3. Append a dated entry to the sprint file's Daily log:
   - **Done since last standup** — facts, with story IDs.
   - **Next** — the most valuable step toward the sprint goal today.
   - **Blockers / risks to the goal** — anything threatening the goal; propose a
     mitigation or a question for the PO. If scope is clearly not going to fit, say so
     now, not at review.
4. Update story statuses in the sprint commitment table if they changed.
5. Reply to the user with the three bullets only.

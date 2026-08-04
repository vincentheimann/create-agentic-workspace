---
description: Zero-to-first-feature kickoff — capture the idea, seed the backlog, plan Sprint 1 and ship the smallest working slice, all in one session.
---

Take this freshly initialized project from empty to a **first working feature, today**.
The session is a success when the user sees their idea running, however small — not when
the paperwork is complete. Momentum first, ceremony second.

1. **Capture the idea as a charter.** Ask the user to describe what they want to build
   in one or two sentences. Then ask at most 3–5 focused follow-up questions: who is it
   for, what's the one thing it must do first, what does success look like (one
   measurable criterion is enough), any hard constraints.
<!-- BEGIN:memory -->
   Write the answers into `memory/project-charter.md` (mission, vision, success
   criteria) — briefly; it can be polished later, but it is the compass every later
   ceremony checks against.
<!-- END:memory -->
<!-- BEGIN:scrum -->
2. **Seed a small backlog.** Follow `.agents/skills/backlog-refinement.md`, but keep it
   light: 3–6 stories, ordered by value. Resist completeness — the backlog can grow later.
3. **Plan Sprint 1.** Follow `.agents/skills/sprint-planning.md`. Propose a sprint goal
   the user can see working fast. The **first story must be completable in this very
   session**: a walking skeleton — the smallest end-to-end slice of the idea that runs
   (one screen, one command, one endpoint — whatever fits the project).
<!-- END:scrum -->
4. **Build it now.** Implement that first slice immediately — do not stop after
   planning, do not ask "shall I proceed". Set up only the tooling this slice needs.
   Honor `scrum/DEFINITION-OF-DONE.md` where it applies, but prefer a small honest
   increment over a perfect setup.
5. **Demo it.** Show the user exactly how to run or view the result themselves — the
   concrete command or URL, not a description.
6. **Close the loop.**
<!-- BEGIN:memory -->
   Update the living memory per `.agents/skills/memory-update.md`.
<!-- END:memory -->
   Tell the user what tomorrow looks like: `/standup` to continue the sprint,
   `/backlog-refinement` when new ideas pile up. One sentence, then stop.

If the workspace is not fresh (the charter is filled, sprints exist), say so and point the
user to `/standup` or `/sprint-planning` instead of redoing the kickoff.

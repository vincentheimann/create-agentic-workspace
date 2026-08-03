# Scrum workspace

Sprint length: {{SPRINT_LENGTH_WEEKS}} week(s) · Team mode: {{TEAM_MODE}}

The loop:

```
/backlog-refinement  →  /sprint-planning  →  daily /standup  →  /sprint-review  →  /retrospective
        ↑                                                                              │
        └──────────────────────────── actions feed the next sprint ────────────────────┘
```

- The **user is the Product Owner**: agents propose, the PO decides priorities and accepts
  work. Agents never invent business priorities.
- `PRODUCT-BACKLOG.md` is strictly ordered — top item is the next most valuable thing.
- Each sprint gets one file in `sprints/` (created by `/sprint-planning` from
  `sprints/_template.md`), holding the goal, commitment, daily log, review and retro notes.
- "Done" means `DEFINITION-OF-DONE.md` is satisfied — no exceptions, no "done except…".

## Working agreements

> The retrospective (`/retrospective`) appends improvement actions here.

- {{DATE}}: Initial agreement — ceremonies run via slash commands; memory updated every session.

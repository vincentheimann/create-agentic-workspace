# Scrum workspace

Sprint cadence: {{SPRINT_CADENCE}} · Team mode: {{TEAM_MODE}}

The loop:

```
/backlog-refinement  →  /sprint-planning  →  /standup each session  →  /sprint-review  →  /retrospective
        ↑                                                                                      │
        └────────────────────────────── actions feed the next sprint ──────────────────────────┘
```

- **A sprint is delimited by ceremonies, not by the clock**: it starts at
  `/sprint-planning` and ends at `/sprint-review`. A sprint may fit in one working
  session or span weeks. {{SPRINT_END_RULE}}
- The **user is the Product Owner**: agents propose, the PO decides priorities and accepts
  work. Agents never invent business priorities.
- `PRODUCT-BACKLOG.md` is strictly ordered — top item is the next most valuable thing.
- Each sprint gets one file in `sprints/` (created by `/sprint-planning` from
  `sprints/_template.md`), holding the goal, commitment, standup log, review and retro notes.
- "Done" means `DEFINITION-OF-DONE.md` is satisfied — no exceptions, no "done except…".

## Working agreements

> The retrospective (`/retrospective`) appends improvement actions here.

- {{DATE}}: Initial agreement — ceremonies run via slash commands; memory updated every session.

# How it works

Two pictures: the **three nested loops** the workspace runs on, and the **common user
path** from idea to steady rhythm.

## The loop layers

The workspace is three loops running at different speeds, each nested in the one above.
The slower a layer, the harder it should be to change it.

```mermaid
flowchart TB
    subgraph governance ["Layer 1 · Governance — for the life of the project"]
        CH["Project charter<br/>memory/project-charter.md<br/>mission · vision · success criteria"]
        AD["Decision records<br/>docs/adr/ + memory/decision-log.md"]
    end

    subgraph sprint ["Layer 2 · Sprint loop — per sprint (one session to a few weeks)"]
        R["/backlog-refinement"] --> P["/sprint-planning"]
        P --> B["Build the committed stories"]
        B --> V["/sprint-review"]
        V --> T["/retrospective"]
        T --> R
    end

    subgraph session ["Layer 3 · Session loop — every working session"]
        S1["Read memory/active-context.md"] --> S2["Work on the sprint<br/>+ /standup"]
        S2 --> S3["/memory-update"]
        S3 -->|"next session"| S1
    end

    CH -->|"defines what value means"| R
    CH -->|"sprint goal must advance<br/>a success criterion"| P
    B ---|"one sprint =<br/>one or more sessions"| session
    B -.->|"significant choices<br/>→ /adr-new"| AD
    T -.->|"may propose charter changes<br/>— the PO decides"| CH
```

- **Layer 1 — Governance** moves at the speed of the project. The charter is the
  compass: refinement uses it to judge value, planning must say which success criterion
  a sprint goal advances, and ADRs that touch direction cite it. It changes only by
  explicit Product Owner decision — usually because a retrospective surfaced a reason.
- **Layer 2 — Sprint loop** moves at the speed of the work, not the calendar: a sprint
  starts at `/sprint-planning` and ends at `/sprint-review` — with AI agents that can be
  a single intense session or a few weeks (the cadence chosen at scaffold time says when
  the review is due). It turns the charter into ordered work and honest increments; the
  retrospective's actions feed the next turn of the loop.
- **Layer 3 — Session loop** moves in hours. It's what makes the whole thing survive
  interruptions: every session starts by reading the active context and ends by writing
  it, so any harness — or any model — can pick up where the last one stopped.

## The common user path

What using the kit actually looks like, end to end:

```mermaid
flowchart TD
    A["💡 An idea"] --> B["Install once:<br/>Node ≥ 18.17 · git · a harness<br/>(Claude Code or OpenCode)"]
    B --> C["npx github:vincentheimann/create-agentic-workspace my-project"]
    C --> D["Answer the wizard<br/>(Enter = good defaults)"]
    D --> E["cd my-project<br/>run claude or opencode"]
    E --> F["/kickoff<br/>charter interview → mini-backlog →<br/>Sprint 1 → first slice running today"]
    F --> G["Session rhythm<br/>/standup → build → /memory-update"]
    G -->|"goal Done or cap reached"| H["/sprint-review<br/>+ /retrospective"]
    H -->|"next sprint"| I["/sprint-planning<br/>(+ /backlog-refinement as needed)"]
    I --> G
    H -.->|"milestone reached"| J["/portfolio — case study<br/>/security-review — before release<br/>/scrum-health — nothing-left-behind audit"]
```

The two moments that matter most:

1. **The first session** ends with a piece of the idea actually running (`/kickoff`
   guarantees the first story is small enough for that).
2. **Every session after** starts in seconds, because the memory loop means nothing has
   to be re-explained — not to the same agent, and not to a different one.

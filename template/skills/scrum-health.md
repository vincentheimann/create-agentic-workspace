---
description: Scrum health check — audit sprint/backlog/memory consistency so nothing is left behind. Run at review/retro time or on demand.
---

Run a **Scrum health check** — the "nothing left behind" audit. Blame-free,
evidence-based, read-mostly: fix trivial bookkeeping directly and report it;
anything substantive goes to the PO.

1. Read the current sprint file (highest number in `scrum/sprints/`),
   `scrum/PRODUCT-BACKLOG.md`, `scrum/DEFINITION-OF-DONE.md`, `scrum/README.md`
   (working agreements) and `memory/active-context.md` + `memory/progress.md`.
2. Check, with evidence (grep / git log — never assume):
   - **Status sync:** every commitment-table status matches the backlog status and
     its AC tick state; `committed` items exist only in the active sprint.
   - **Open items:** nothing listed as open that is already resolved in code
     (spot-check each open item's claim against the actual files/commits) — and
     nothing resolved-in-passing that was never logged.
   - **Retro actions:** every action from the previous retro is traceably
     honored, explicitly carried, or explicitly dropped — never silent.
   - **Memory freshness:** `active-context.md` "Updated:" date and Next steps
     match reality; `progress.md` reflects the latest sprint end; no dead
     references to files/flags that no longer exist.
   - **Leftover work:** `git status` in the workspace repo and all nested repos —
     uncommitted changes are either intentional (say why) or lost work.
   - **DoD evidence:** stories marked done this sprint have verifiable evidence
     for their build/test claims (re-run cheap checks; don't trust prose).
3. Reply with a compact health report: one ✅/⚠️ line per check, then only the
   discrepancies — each with file reference and either "fixed (what)" or a
   proposed fix for the PO. No discrepancies → say so in one line.
4. If a discrepancy reveals a process gap (not a one-off slip), propose it as a
   candidate action for the next retrospective — do not add working agreements
   yourself from this skill.

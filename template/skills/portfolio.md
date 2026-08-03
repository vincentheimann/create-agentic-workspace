---
description: Create or refresh PORTFOLIO.md — an evidence-based case study of this project.
---

Generate or update **`PORTFOLIO.md`** for this project.

- **Claude Code:** delegate to the `portfolio` subagent (`.claude/agents/portfolio.md`).
- **Any other harness:** open `.agents/portfolio-agent.md` and follow its instructions
  yourself — it is a self-contained agent definition.

Ground rules regardless of harness:

- Evidence only: git history, ADRs, docs, code. Missing data gets a visible placeholder,
  never an invented metric or testimonial.
- Preserve human edits when updating an existing `PORTFOLIO.md`.
- Output is Markdown only (PDF rendering is a separate step documented in the agent kit).

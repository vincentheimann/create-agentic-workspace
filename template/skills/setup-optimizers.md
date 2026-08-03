---
description: Install and verify the context optimizers chosen for this workspace (see optimizers/OPTIMIZERS.md).
---

Walk the user through installing the optimizers listed in `optimizers/OPTIMIZERS.md`.

1. Read `optimizers/OPTIMIZERS.md` to see which optimizers were selected and their
   current status.
2. For each one still marked _not yet installed_, in this order:
<!-- BEGIN:ponytail -->
   - **Ponytail:** if running in Claude Code, tell the user to run
     `/plugin marketplace add DietrichGebert/ponytail` then
     `/plugin install ponytail@ponytail` (plugin commands are user-level; you cannot run
     them yourself). For OpenCode, add `"@dietrichgebert/ponytail"` to the `plugin` array
     of `opencode.json` (create the file if needed).
<!-- END:ponytail -->
<!-- BEGIN:graphify -->
   - **Graphify:** check Python tooling (`uv --version` or `pipx --version`). If neither
     exists, offer to install `uv` first — only with the user's explicit OK:
     Windows: `winget install --id=astral-sh.uv -e` · macOS/Linux:
     `curl -LsSf https://astral.sh/uv/install.sh | sh` — then open a new terminal or
     refresh PATH. Never install Python tooling without asking. Then run
     `uv tool install graphifyy` (fallback: `pipx install graphifyy`), then
     `graphify install --project`. Build the first graph with `/graphify .` and confirm
     `graphify-out/` was produced.
<!-- END:graphify -->
<!-- BEGIN:headroom -->
   - **Headroom:** ask which integration mode the user wants (proxy / MCP / library) —
     see https://docs.headroomlabs.ai/docs for current install commands, fetch the
     installation page if web access is available. Proxy mode changes the harness's base
     URL: confirm with the user before touching harness config.
<!-- END:headroom -->
3. After each successful install, update its Status line in `optimizers/OPTIMIZERS.md`.
4. If an install fails or a prerequisite is missing, record the blocker in the Status
   line and move on — never leave the file claiming something is installed when it isn't.
5. Summarize: what's installed, what's pending, and any manual steps left for the user.

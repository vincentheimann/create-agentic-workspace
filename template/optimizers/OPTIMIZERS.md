# Context optimizers

The optimizers selected for this workspace, with real install commands. Run
`/setup-optimizers` to be walked through installation and verification. All three are
model-agnostic — they work with Claude Code (Fable 5) and OpenCode/Kimi K3 alike.

<!-- BEGIN:headroom -->
## Headroom — context compression layer

Compresses tool outputs, file reads, logs and RAG chunks before they reach the model
(~87% average token reduction claimed). Docs: https://docs.headroomlabs.ai/docs

Integration options (pick one):

- **Transparent proxy** — zero code changes; point the harness's base URL at the proxy.
- **MCP server** — expose compression tools to the agent.
- **Library** — call `compress()` from Python/TypeScript in your own tooling.

See the installation page of the docs for exact commands for your platform, then record
the chosen mode here.

- Chosen integration: _not yet installed_
<!-- END:headroom -->

<!-- BEGIN:ponytail -->
## Ponytail — minimal-code discipline

Skill pack that pushes agents toward smaller, simpler solutions ("the best code is the
code you never wrote"). Repo: https://github.com/dietrichgebert/ponytail

Install per harness:

- **Claude Code:**
  ```
  /plugin marketplace add DietrichGebert/ponytail
  /plugin install ponytail@ponytail
  ```
- **OpenCode** — add to `opencode.json`:
  ```json
  { "plugin": ["@dietrichgebert/ponytail"] }
  ```
- **Instruction-only harnesses:** copy Ponytail's `AGENTS.md` ruleset into this repo's
  `AGENTS.md` (or reference it) per the repo's README.

Useful commands once installed: `/ponytail-review`, `/ponytail-audit`, `/ponytail-debt`,
`/ponytail-gain`.

- Status: _not yet installed_
<!-- END:ponytail -->

<!-- BEGIN:graphify -->
## Graphify — codebase knowledge graph

Builds a local, queryable knowledge graph of the codebase (tree-sitter AST, no vector
store, code never leaves the machine). Repo: https://github.com/Graphify-Labs/graphify

```
uv tool install graphifyy        # or: pipx install graphifyy / pip install graphifyy
graphify install --project       # registers the /graphify skill for this project
```

Usage:

- `/graphify .` — build/rebuild the graph (outputs to `graphify-out/`, which is
  gitignored). Rebuild after structural changes.
- `graphify query "what connects auth to the database?"`
- `graphify path "ServiceA" "ServiceB"` · `graphify explain "SomeComponent"`

Agents should prefer querying the graph over broad grepping once it exists.

- Status: _not yet installed_
<!-- END:graphify -->

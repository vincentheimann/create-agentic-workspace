# Releasing — {{PROJECT_NAME}}

Releases and release notes are automated with
[release-please](https://github.com/googleapis/release-please), driven entirely by
**Conventional Commit** messages. Nobody — human or agent — writes CHANGELOG entries or
bumps versions by hand.

## How it works

1. Commits land on `main` with Conventional Commit subjects (`feat: …`, `fix: …`,
   `docs: …`). Agents in this workspace are instructed to write them this way.
2. The GitHub Action (`.github/workflows/release-please.yml`) keeps a **release PR**
   open, accumulating the next version number and a draft `CHANGELOG.md` entry from
   those commits. `feat:` → minor bump, `fix:` → patch, `feat!:` or a
   `BREAKING CHANGE:` footer → major (minor while the project is below 1.0.0).
3. When you decide it's time to ship, review the release PR — you can edit its notes —
   and **merge it**. release-please then tags the commit, updates `CHANGELOG.md` and the
   version file, and publishes a GitHub Release with the notes.

Run `/release` to have the agent walk through this: check commit hygiene, find the
pending release PR, and review the draft notes with you.

## Prerequisites

- The repository must be pushed to **GitHub** with Actions enabled — the workflow does
  nothing in a purely local repo.
- Under *Settings → Actions → General → Workflow permissions*, allow GitHub Actions to
  create pull requests ("Allow GitHub Actions to create and approve pull requests").

## Adapting to your stack

The scaffolded config uses `"release-type": "simple"`, which tracks the version in a
plain `version.txt` — it works for any language. If your stack has a native manifest,
switch `release-type` in `release-please-config.json` so the version is bumped where it
actually lives:

| Stack | release-type | Version bumped in |
|---|---|---|
| Node.js | `node` | `package.json` |
| Python | `python` | `pyproject.toml` / `setup.py` |
| Rust | `rust` | `Cargo.toml` |
| Go | `go` | tags only |
| Java (Maven) | `maven` | `pom.xml` |
| Anything else | `simple` | `version.txt` |

Full list and options: https://github.com/googleapis/release-please/blob/main/docs/customizing.md

## Rules that keep the notes useful

- Write commit subjects **user-facing**: "feat: detect missing Python tooling instead of
  failing" beats "feat: add hasPythonTooling helper".
- Use `fix:` for behavior corrections (patch bump), `feat:` for new capability (minor).
- Never edit `CHANGELOG.md`, `version.txt` or `.release-please-manifest.json` outside
  the release PR — release-please owns them.

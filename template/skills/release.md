---
description: Prepare and review a release — verify Conventional Commits, check the release-please PR, cut the release with the user.
---

Guide the user through shipping a release with release-please (see `docs/RELEASING.md`
for the full mechanics). Never bump versions or edit `CHANGELOG.md` by hand — the
release PR owns both.

1. **Check the setup.** Confirm `.github/workflows/release-please.yml`,
   `release-please-config.json` and `.release-please-manifest.json` exist, and that the
   repo has a GitHub remote (`git remote -v`). If there is no GitHub remote, explain
   that the workflow only runs on GitHub and stop after offering to help set the
   remote up.
2. **Check the release-type.** The scaffold defaults to `"release-type": "simple"`
   (version in `version.txt`). If the project's stack has a native manifest (Node →
   `node`, Python → `python`, Rust → `rust`, …), propose updating
   `release-please-config.json` — only with the user's OK, and before the first release
   if possible.
3. **Audit commit hygiene.** List commits since the last release tag
   (`git log <last-tag>..HEAD --oneline`, or all history if no tag). Flag commits that
   do not follow Conventional Commits — they will be invisible in the release notes.
   Going forward, every commit in this workspace must use `feat:` / `fix:` / `docs:` /
   `chore:` prefixes with user-facing subjects.
4. **Find the release PR.** If the `gh` CLI is available:
   `gh pr list --search "chore: release" --state open` (release-please PRs are titled
   `chore(main): release X.Y.Z` and labeled `autorelease: pending`). Show the user the
   proposed version and the draft CHANGELOG entry, and check the notes are honest and
   complete against the actual commits.
5. **Cut the release.** Merging the release PR is the release: release-please tags,
   updates `CHANGELOG.md` and the version file, and publishes the GitHub Release.
   Merging is the user's decision — offer `gh pr merge` but never merge on your own
   initiative.
6. **If no release PR exists** despite releasable commits on `main`: check the Actions
   tab for failed `release-please` runs and that workflow permissions allow creating
   pull requests (*Settings → Actions → General*). Report what you find; do not try to
   fake the release manually.

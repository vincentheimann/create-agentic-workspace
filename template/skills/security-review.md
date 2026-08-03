---
description: Run the security baseline checklist against the repository and write findings with severity.
---

Run a **defensive security review** of this repository against
`security/SECURITY-BASELINE.md`. This is a self-audit for hardening — not exploit
development.

1. **Secrets.** Search tracked files for credential patterns (API keys, tokens, private
   keys, passwords in config/history). Verify `.gitignore` covers `.env*`, key files.
2. **Dependencies.** Run the ecosystem's audit tool if available (`npm audit`,
   `pip-audit`, `cargo audit`, …). Check for unpinned or abandoned dependencies.
3. **Code review of recent changes.** Focus on: input validation at trust boundaries,
   injection risks (SQL/command/path), authn/authz checks, unsafe deserialization,
   error handling that leaks internals, logging of secrets or personal data.
4. **Configuration.** TLS usage, default credentials, debug modes, permissive CORS,
   overly broad file/DB permissions.
5. **Write findings** to `security/FINDINGS.md`, newest section on top, each finding:
   `[CRITICAL|HIGH|MEDIUM|LOW]` — description, location (`file:line`), recommended fix.
   If a previous finding is fixed, mark it resolved with the date. No findings is a valid
   result — say so explicitly rather than inventing issues.
6. Summarize: counts by severity and the top 3 recommended actions. Fix nothing without
   the user's go-ahead unless it's trivial and safe (e.g. adding a `.gitignore` line).

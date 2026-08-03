# Security baseline — {{PROJECT_NAME}}

The practices this project commits to. `/security-review` audits the repository against
this list and writes findings to `security/FINDINGS.md`.

## Secrets & credentials

- No secrets in the repository or its history. Use environment variables or a secret
  manager; commit `.env.example` with names only.
- `.gitignore` covers `.env*`, `*.pem`, `*.key`.
- Rotate any credential that was ever committed — deleting the file is not enough.

## Dependencies

- Pin versions (lockfile committed). Run the ecosystem audit tool (`npm audit`,
  `pip-audit`, …) at least every sprint and before releases.
- Prefer standard library / existing dependencies over adding new ones (see the
  minimalism rule in `AGENTS.md`); every dependency is attack surface.

## Code

- Validate and encode all input at trust boundaries (user input, files, network, LLM
  output used in commands or queries).
- Parameterized queries only — never string-built SQL/shell commands from input.
- AuthN/AuthZ checks server-side, on every privileged path; deny by default.
- Errors: fail closed, log the details, show the user a generic message.
- Never log secrets, tokens or personal data.

## Configuration & operations

- TLS for anything crossing a network boundary.
- No default credentials, no debug mode in production, CORS restricted to known origins.
- Least privilege for service accounts, tokens (scoped, expiring) and file permissions.

## Process

- Review this baseline each retrospective; update it via `/adr-new` when the project's
  threat model changes.
- Reference: OWASP Top 10 — https://owasp.org/www-project-top-ten/

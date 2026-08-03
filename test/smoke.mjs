import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = fs.mkdtempSync(path.join(os.tmpdir(), 'caw-smoke-'));

const res = spawnSync(
  process.execPath,
  [path.join(root, 'bin', 'cli.js'), target, '--yes', '--offline', '--no-git'],
  { encoding: 'utf8' }
);
if (res.status !== 0) {
  console.error(res.stdout, res.stderr);
  throw new Error(`CLI exited with ${res.status}`);
}

const mustExist = [
  'AGENTS.md',
  'CLAUDE.md',
  '.gitignore',
  '.agents/skills/sprint-planning.md',
  '.agents/skills/memory-update.md',
  '.agents/skills/setup-optimizers.md',
  '.agents/portfolio-agent.md',
  '.claude/commands/standup.md',
  '.claude/agents/portfolio.md',
  '.opencode/command/retrospective.md',
  'memory/active-context.md',
  'memory/decision-log.md',
  'docs/adr/0001-record-architecture-decisions.md',
  'scrum/PRODUCT-BACKLOG.md',
  'scrum/DEFINITION-OF-DONE.md',
  'scrum/sprints/_template.md',
  'security/SECURITY-BASELINE.md',
  'optimizers/OPTIMIZERS.md',
];
for (const rel of mustExist) {
  if (!fs.existsSync(path.join(target, rel))) throw new Error(`missing: ${rel}`);
}

const agents = fs.readFileSync(path.join(target, 'AGENTS.md'), 'utf8');
if (agents.includes('<!-- BEGIN:')) throw new Error('AGENTS.md still contains section markers');
if (agents.includes('{{PROJECT_NAME}}')) throw new Error('AGENTS.md still contains unrendered vars');
if (!agents.includes('Scrum protocol')) throw new Error('AGENTS.md missing Scrum section');

const sprint = fs.readFileSync(path.join(target, 'scrum', 'sprints', '_template.md'), 'utf8');
if (!sprint.includes('{{SPRINT_NUMBER}}')) {
  throw new Error('sprint template placeholders must survive scaffolding');
}

// Re-run against the same directory must refuse to overwrite.
const rerun = spawnSync(
  process.execPath,
  [path.join(root, 'bin', 'cli.js'), target, '--yes', '--offline', '--no-git'],
  { encoding: 'utf8' }
);
if (rerun.status === 0) throw new Error('expected refusal when AGENTS.md already exists');

fs.rmSync(target, { recursive: true, force: true });
console.log('smoke test passed');

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
  'GETTING-STARTED.md',
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

const started = fs.readFileSync(path.join(target, 'GETTING-STARTED.md'), 'utf8');
if (started.includes('<!-- BEGIN:') || started.includes('{{PROJECT_NAME}}')) {
  throw new Error('GETTING-STARTED.md not fully rendered');
}

// --help must print usage and exit 0 without scaffolding anything.
const help = spawnSync(process.execPath, [path.join(root, 'bin', 'cli.js'), '--help'], {
  encoding: 'utf8',
});
if (help.status !== 0 || !help.stdout.includes('Usage:')) throw new Error('--help is broken');

// Scaffolding into a dir with existing files must keep them untouched.
const existing = fs.mkdtempSync(path.join(os.tmpdir(), 'caw-existing-'));
fs.writeFileSync(path.join(existing, '.gitignore'), 'SENTINEL\n');
const over = spawnSync(
  process.execPath,
  [path.join(root, 'bin', 'cli.js'), existing, '--yes', '--offline', '--no-git'],
  { encoding: 'utf8' }
);
if (over.status !== 0) throw new Error('scaffold into existing dir failed');
if (fs.readFileSync(path.join(existing, '.gitignore'), 'utf8') !== 'SENTINEL\n') {
  throw new Error('existing .gitignore was overwritten');
}
fs.rmSync(existing, { recursive: true, force: true });

// Answer flags must skip the wizard and shape the workspace.
const flagged = fs.mkdtempSync(path.join(os.tmpdir(), 'caw-flags-'));
const fr = spawnSync(
  process.execPath,
  [
    path.join(root, 'bin', 'cli.js'),
    flagged,
    '--offline',
    '--no-git',
    '--name=Flagged App',
    '--stack=Python',
    '--harnesses=claude',
    '--modules=memory,adr',
    '--optimizers=none',
  ],
  { encoding: 'utf8' }
);
if (fr.status !== 0) {
  console.error(fr.stdout, fr.stderr);
  throw new Error('flag-driven scaffold failed');
}
const flaggedAgents = fs.readFileSync(path.join(flagged, 'AGENTS.md'), 'utf8');
if (!flaggedAgents.includes('Flagged App')) throw new Error('--name not applied');
if (flaggedAgents.includes('Scrum protocol')) throw new Error('--modules did not exclude scrum');
if (fs.existsSync(path.join(flagged, 'scrum'))) throw new Error('scrum/ generated despite --modules');
if (fs.existsSync(path.join(flagged, 'optimizers'))) throw new Error('optimizers/ generated despite --optimizers=none');
if (fs.existsSync(path.join(flagged, '.opencode'))) throw new Error('.opencode/ generated despite --harnesses=claude');
fs.rmSync(flagged, { recursive: true, force: true });

// Invalid flag values must fail fast with a clear error.
const bad = spawnSync(
  process.execPath,
  [path.join(root, 'bin', 'cli.js'), path.join(os.tmpdir(), 'caw-never'), '--modules=scrum,nonsense', '--offline', '--no-git'],
  { encoding: 'utf8' }
);
if (bad.status === 0 || !bad.stderr.includes('nonsense')) throw new Error('invalid --modules value not rejected');

// Re-run against the same directory must refuse to overwrite.
const rerun = spawnSync(
  process.execPath,
  [path.join(root, 'bin', 'cli.js'), target, '--yes', '--offline', '--no-git'],
  { encoding: 'utf8' }
);
if (rerun.status === 0) throw new Error('expected refusal when AGENTS.md already exists');

fs.rmSync(target, { recursive: true, force: true });
console.log('smoke test passed');

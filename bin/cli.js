#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import * as p from '../lib/prompts.js';
import { writeRendered, render, stripSections } from '../lib/scaffold.js';

const [nodeMajor, nodeMinor] = process.versions.node.split('.').map(Number);
if (nodeMajor < 18 || (nodeMajor === 18 && nodeMinor < 17)) {
  console.error(`create-agentic-workspace needs Node.js >= 18.17 — you are running ${process.versions.node}.`);
  console.error('Download the current LTS from https://nodejs.org and try again.');
  process.exit(1);
}

const TEMPLATE_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'template');
const PORTFOLIO_AGENT_URL =
  'https://raw.githubusercontent.com/vincentheimann/portfolio-agent/main/.claude/agents/portfolio.md';

// Skills shipped per module. Source of truth ends up in .agents/skills/,
// mirrored into each selected harness's command directory.
const SKILLS = {
  core: ['kickoff'],
  memory: ['memory-update'],
  adr: ['adr-new'],
  scrum: ['sprint-planning', 'standup', 'backlog-refinement', 'sprint-review', 'retrospective'],
  security: ['security-review'],
  release: ['release'],
  portfolio: ['portfolio'],
  optimizers: ['setup-optimizers'],
};

// Plain files per module: [templatePath, destPath].
const FILES = {
  core: [
    ['AGENTS.md', 'AGENTS.md'],
    ['GETTING-STARTED.md', 'GETTING-STARTED.md'],
    ['gitignore', '.gitignore'],
  ],
  memory: [
    ['memory/README.md', 'memory/README.md'],
    ['memory/project-charter.md', 'memory/project-charter.md'],
    ['memory/active-context.md', 'memory/active-context.md'],
    ['memory/decision-log.md', 'memory/decision-log.md'],
    ['memory/progress.md', 'memory/progress.md'],
  ],
  adr: [
    ['docs/adr/README.md', 'docs/adr/README.md'],
    ['docs/adr/template.md', 'docs/adr/template.md'],
    ['docs/adr/0001-record-architecture-decisions.md', 'docs/adr/0001-record-architecture-decisions.md'],
  ],
  scrum: [
    ['scrum/README.md', 'scrum/README.md'],
    ['scrum/PRODUCT-BACKLOG.md', 'scrum/PRODUCT-BACKLOG.md'],
    ['scrum/DEFINITION-OF-DONE.md', 'scrum/DEFINITION-OF-DONE.md'],
    ['scrum/sprints/_template.md', 'scrum/sprints/_template.md'],
  ],
  security: [['security/SECURITY-BASELINE.md', 'security/SECURITY-BASELINE.md']],
  release: [
    ['release/release-please.yml', '.github/workflows/release-please.yml'],
    ['release/release-please-config.json', 'release-please-config.json'],
    ['release/release-please-manifest.json', '.release-please-manifest.json'],
    ['release/RELEASING.md', 'docs/RELEASING.md'],
  ],
  optimizers: [['optimizers/OPTIMIZERS.md', 'optimizers/OPTIMIZERS.md']],
};

const USAGE = `create-agentic-workspace — scaffold an agent-agnostic AI workspace

Usage:
  npx github:vincentheimann/create-agentic-workspace [target-dir] [flags]

Without flags an interactive wizard asks a few questions (Enter keeps defaults).

Flags:
  --yes        Accept all defaults, no questions asked
  --offline    Skip downloading the portfolio agent
  --no-git     Don't initialize a git repository
  --help       Show this help
  --version    Show the version

Non-interactive answers (any of these skips the wizard; unset ones keep defaults —
made for AI agents scaffolding on a user's behalf):
  --name="…" --description="…" --stack="…"
  --harnesses=claude,opencode,agnostic
  --sprint-weeks=1|2|3|4
  --team=solo|team
  --modules=memory,adr,scrum,security,portfolio,release   (or "none")
               ("release" = release-please automation — needs a GitHub repo; off by default)
  --optimizers=headroom,ponytail,graphify         (or "none")

Full documentation: https://github.com/vincentheimann/create-agentic-workspace`;

const HARNESS_VALUES = ['claude', 'opencode', 'agnostic'];
const MODULE_VALUES = ['memory', 'adr', 'scrum', 'security', 'portfolio', 'release'];
const OPTIMIZER_VALUES = ['headroom', 'ponytail', 'graphify'];

function parseArgs(argv) {
  const flags = new Set();
  const opts = {};
  const positional = [];
  for (const a of argv) {
    if (a.startsWith('--') && a.includes('=')) {
      const [k, ...rest] = a.slice(2).split('=');
      opts[k] = rest.join('=');
    } else if (a.startsWith('-')) {
      flags.add(a);
    } else {
      positional.push(a);
    }
  }
  return {
    targetArg: positional[0] || '',
    opts,
    yes: flags.has('--yes') || flags.has('-y'),
    offline: flags.has('--offline') || process.env.CAW_OFFLINE === '1',
    noGit: flags.has('--no-git'),
    help: flags.has('--help') || flags.has('-h'),
    version: flags.has('--version') || flags.has('-v'),
  };
}

function parseList(name, value, allowed) {
  if (value === 'none') return [];
  const items = [...new Set(value.split(',').map((s) => s.trim()).filter(Boolean))];
  for (const item of items) {
    if (!allowed.includes(item)) {
      console.error(`Invalid value "${item}" for --${name}. Allowed: ${allowed.join(', ')} (or "none").`);
      process.exit(1);
    }
  }
  return items;
}

function applyOverrides(answers, opts) {
  if (opts.name) answers.projectName = opts.name;
  if (opts.description) answers.description = opts.description;
  if (opts.stack) answers.stack = opts.stack;
  if (opts.harnesses) answers.harnesses = parseList('harnesses', opts.harnesses, HARNESS_VALUES);
  if (opts.modules) answers.modules = parseList('modules', opts.modules, MODULE_VALUES);
  if (opts.optimizers) answers.optimizers = parseList('optimizers', opts.optimizers, OPTIMIZER_VALUES);
  if (opts['sprint-weeks'] !== undefined) {
    const weeks = Number(opts['sprint-weeks']);
    if (![1, 2, 3, 4].includes(weeks)) {
      console.error('--sprint-weeks must be 1, 2, 3 or 4.');
      process.exit(1);
    }
    answers.sprintWeeks = weeks;
  }
  if (opts.team !== undefined) {
    const modes = { solo: 'Solo developer + AI agents', team: 'Small human team + AI agents' };
    if (!modes[opts.team]) {
      console.error('--team must be "solo" or "team".');
      process.exit(1);
    }
    answers.teamMode = modes[opts.team];
  }
}

function hasCommand(cmd) {
  return spawnSync(cmd, ['--version'], { stdio: 'ignore', shell: process.platform === 'win32' }).status === 0;
}

const hasPythonTooling = () => ['uv', 'pipx', 'python3', 'python'].some(hasCommand);

function defaults(targetArg) {
  const name = targetArg ? path.basename(path.resolve(targetArg)) : 'my-project';
  return {
    targetDir: targetArg || name,
    projectName: name,
    description: 'A project with an agentic workspace.',
    stack: 'to be defined',
    harnesses: ['claude', 'opencode'],
    sprintWeeks: 2,
    teamMode: 'Solo developer + AI agents',
    modules: ['memory', 'adr', 'scrum', 'security', 'portfolio'],
    optimizers: ['headroom', 'ponytail', 'graphify'],
    gitInit: true,
  };
}

async function wizard(targetArg) {
  const d = defaults(targetArg);
  p.open();
  try {
    console.log('\ncreate-agentic-workspace — answer a few questions (Enter keeps the default)\n');
    const targetDir = targetArg || (await p.text('Target directory', d.targetDir));
    const projectName = await p.text('Project name', path.basename(path.resolve(targetDir)));
    const description = await p.text('One-line description', d.description);
    const stack = await p.text('Main language / stack (e.g. "TypeScript + PostgreSQL")', d.stack);
    const harnesses = await p.multiselect('Which agent harnesses will be used?', [
      { label: 'Claude Code (Fable 5 / Opus)', value: 'claude', selected: true },
      { label: 'OpenCode (Kimi K3 or other models)', value: 'opencode', selected: true },
      { label: 'Other AGENTS.md-compatible tool only', value: 'agnostic', selected: false },
    ]);
    const sprintWeeks = await p.select('Sprint length?', [
      { label: '1 week', value: 1 },
      { label: '2 weeks', value: 2 },
      { label: '3 weeks', value: 3 },
      { label: '4 weeks', value: 4 },
    ], 1);
    const teamMode = await p.select('Team setup?', [
      { label: 'Solo developer + AI agents (agents play Scrum roles)', value: 'Solo developer + AI agents' },
      { label: 'Small human team + AI agents', value: 'Small human team + AI agents' },
    ]);
    const modules = await p.multiselect('Modules to enable?', [
      { label: 'Living memory (memory/ + /memory-update)', value: 'memory', selected: true },
      { label: 'ADRs (docs/adr/ + /adr-new)', value: 'adr', selected: true },
      { label: 'Scrum ceremonies (/sprint-planning, /standup, /sprint-review, /retrospective, /backlog-refinement)', value: 'scrum', selected: true },
      { label: 'Security baseline (/security-review)', value: 'security', selected: true },
      { label: 'Release automation (release-please: Conventional Commits → CHANGELOG + GitHub Releases; needs a GitHub repo)', value: 'release', selected: false },
    ]);
    const wantPortfolio = await p.confirm('Add the Portfolio agent (generates PORTFOLIO.md case studies)?', true);
    if (wantPortfolio) modules.push('portfolio');
    const optimizers = await p.multiselect('Context optimizers to set up?', [
      { label: 'Headroom — context compression layer (proxy/MCP, provider-agnostic)', value: 'headroom', selected: true },
      { label: 'Ponytail — minimal-code discipline skill', value: 'ponytail', selected: true },
      { label: 'Graphify — local codebase knowledge graph (/graphify, needs Python)', value: 'graphify', selected: true },
    ]);
    if (optimizers.includes('graphify') && !hasPythonTooling()) {
      console.log('\n  Note: Graphify needs Python tooling (uv or pipx), which was not found on this machine.');
      console.log('  You can keep it selected — /setup-optimizers will guide you through installing uv later.');
      if (!(await p.confirm('Keep Graphify selected?', true))) {
        optimizers.splice(optimizers.indexOf('graphify'), 1);
      }
    }
    const gitInit = await p.confirm('Initialize a git repository with an initial commit?', true);
    return { targetDir, projectName, description, stack, harnesses, sprintWeeks, teamMode, modules, optimizers, gitInit };
  } finally {
    p.close();
  }
}

async function fetchPortfolioAgent(offline) {
  if (offline) return null;
  try {
    const res = await fetch(PORTFOLIO_AGENT_URL, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function mirrorDirsFor(harnesses) {
  const dirs = [];
  if (harnesses.includes('claude')) dirs.push(path.join('.claude', 'commands'));
  if (harnesses.includes('opencode')) dirs.push(path.join('.opencode', 'command'));
  return dirs;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(USAGE);
    return;
  }
  if (args.version) {
    const pkg = JSON.parse(fs.readFileSync(path.join(TEMPLATE_DIR, '..', 'package.json'), 'utf8'));
    console.log(pkg.version);
    return;
  }
  const nonInteractive = args.yes || Object.keys(args.opts).length > 0;
  const answers = nonInteractive ? defaults(args.targetArg) : await wizard(args.targetArg);
  applyOverrides(answers, args.opts);
  if (!args.targetArg && args.opts.name) answers.targetDir = args.opts.name;
  if (args.noGit) answers.gitInit = false;
  if (nonInteractive && answers.optimizers.includes('graphify') && !hasPythonTooling()) {
    console.warn('! Graphify needs Python tooling (uv or pipx), which was not found — /setup-optimizers will guide the install later.');
  }

  const target = path.resolve(answers.targetDir);
  if (fs.existsSync(path.join(target, 'AGENTS.md'))) {
    console.error(`\nAborted: ${target} already contains an AGENTS.md — refusing to overwrite an existing workspace.`);
    process.exit(1);
  }
  fs.mkdirSync(target, { recursive: true });

  // Never overwrite files the user already has (e.g. scaffolding into an existing repo).
  const skipped = [];
  const writeNew = (dest, fn) => {
    if (fs.existsSync(dest)) {
      skipped.push(path.relative(target, dest));
      return;
    }
    fn();
  };

  const enabled = new Set(['core', ...answers.modules]);
  if (answers.optimizers.length > 0) enabled.add('optimizers');
  for (const opt of answers.optimizers) enabled.add(opt); // headroom | ponytail | graphify
  for (const h of answers.harnesses) enabled.add(`harness-${h}`);

  const vars = {
    PROJECT_NAME: answers.projectName,
    PROJECT_DESCRIPTION: answers.description,
    STACK: answers.stack,
    SPRINT_LENGTH_WEEKS: answers.sprintWeeks,
    TEAM_MODE: answers.teamMode,
    DATE: new Date().toISOString().slice(0, 10),
    HARNESSES: answers.harnesses.join(', '),
  };

  // 1. Module files
  for (const mod of Object.keys(FILES)) {
    if (!enabled.has(mod)) continue;
    for (const [src, dest] of FILES[mod]) {
      const destPath = path.join(target, dest);
      writeNew(destPath, () => writeRendered(path.join(TEMPLATE_DIR, src), destPath, vars, enabled));
    }
  }

  // 2. CLAUDE.md only when Claude Code is a target harness
  if (answers.harnesses.includes('claude')) {
    const destPath = path.join(target, 'CLAUDE.md');
    writeNew(destPath, () => writeRendered(path.join(TEMPLATE_DIR, 'CLAUDE.md'), destPath, vars, enabled));
  }

  // 3. Skills: source of truth + per-harness mirrors
  const mirrors = mirrorDirsFor(answers.harnesses);
  for (const mod of Object.keys(SKILLS)) {
    if (!enabled.has(mod)) continue;
    for (const skill of SKILLS[mod]) {
      const src = path.join(TEMPLATE_DIR, 'skills', `${skill}.md`);
      const content = render(stripSections(fs.readFileSync(src, 'utf8'), enabled), vars);
      const srcDest = path.join(target, '.agents', 'skills', `${skill}.md`);
      writeNew(srcDest, () => {
        fs.mkdirSync(path.dirname(srcDest), { recursive: true });
        fs.writeFileSync(srcDest, content);
      });
      for (const dir of mirrors) {
        const mirrorDest = path.join(target, dir, `${skill}.md`);
        writeNew(mirrorDest, () => {
          fs.mkdirSync(path.dirname(mirrorDest), { recursive: true });
          fs.writeFileSync(mirrorDest, content);
        });
      }
    }
  }

  // 4. Portfolio agent (vendored from GitHub at init time)
  if (enabled.has('portfolio')) {
    const agentContent = await fetchPortfolioAgent(args.offline);
    const body =
      agentContent ??
      [
        '<!-- Download failed or offline. Fetch manually: -->',
        `<!-- ${PORTFOLIO_AGENT_URL} -->`,
        '# Portfolio agent placeholder',
        '',
        'Run `/setup-optimizers` or download the agent definition from:',
        PORTFOLIO_AGENT_URL,
      ].join('\n');
    const agentDest = path.join(target, '.agents', 'portfolio-agent.md');
    writeNew(agentDest, () => {
      fs.mkdirSync(path.dirname(agentDest), { recursive: true });
      fs.writeFileSync(agentDest, body);
    });
    if (answers.harnesses.includes('claude')) {
      const claudeDest = path.join(target, '.claude', 'agents', 'portfolio.md');
      writeNew(claudeDest, () => {
        fs.mkdirSync(path.dirname(claudeDest), { recursive: true });
        fs.writeFileSync(claudeDest, body);
      });
    }
    if (!agentContent) console.warn('! Could not fetch the portfolio agent — wrote a placeholder with instructions.');
  }

  // 5. git init
  if (answers.gitInit) {
    const git = (...a) => spawnSync('git', a, { cwd: target, stdio: 'ignore' });
    if (git('init').status === 0) {
      git('add', '-A');
      git('commit', '-m', 'chore: initialize agentic workspace');
      console.log('✓ git repository initialized with initial commit');
    } else {
      console.warn('! git not available — skipped repository initialization.');
    }
  }

  if (skipped.length > 0) {
    console.warn(`! Kept ${skipped.length} existing file(s) untouched: ${skipped.join(', ')}`);
  }
  console.log(`\n✓ Agentic workspace created in ${target}\n`);
  console.log('What\'s next — ship your first idea today:');
  console.log('  1. Open the project in your harness (Claude Code: `claude`, OpenCode: `opencode`).');
  console.log('  2. Run /kickoff and describe your idea — the agent interviews you, plans');
  console.log('     Sprint 1 and builds the first working slice in the same session.');
  console.log('  3. GETTING-STARTED.md explains everything else, whenever you need it.');
  if (answers.optimizers.length > 0) {
    console.log('  (Anytime: /setup-optimizers installs ' + answers.optimizers.join(', ') + '.)');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

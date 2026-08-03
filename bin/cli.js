#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import * as p from '../lib/prompts.js';
import { writeRendered, render, stripSections } from '../lib/scaffold.js';

const TEMPLATE_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'template');
const PORTFOLIO_AGENT_URL =
  'https://raw.githubusercontent.com/vincentheimann/portfolio-agent/main/.claude/agents/portfolio.md';

// Skills shipped per module. Source of truth ends up in .agents/skills/,
// mirrored into each selected harness's command directory.
const SKILLS = {
  memory: ['memory-update'],
  adr: ['adr-new'],
  scrum: ['sprint-planning', 'standup', 'backlog-refinement', 'sprint-review', 'retrospective'],
  security: ['security-review'],
  portfolio: ['portfolio'],
  optimizers: ['setup-optimizers'],
};

// Plain files per module: [templatePath, destPath].
const FILES = {
  core: [
    ['AGENTS.md', 'AGENTS.md'],
    ['gitignore', '.gitignore'],
  ],
  memory: [
    ['memory/README.md', 'memory/README.md'],
    ['memory/project-brief.md', 'memory/project-brief.md'],
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
  optimizers: [['optimizers/OPTIMIZERS.md', 'optimizers/OPTIMIZERS.md']],
};

function parseArgs(argv) {
  const flags = new Set(argv.filter((a) => a.startsWith('--')));
  const positional = argv.filter((a) => !a.startsWith('--'));
  return {
    targetArg: positional[0] || '',
    yes: flags.has('--yes'),
    offline: flags.has('--offline') || process.env.CAW_OFFLINE === '1',
    noGit: flags.has('--no-git'),
  };
}

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
    ]);
    const wantPortfolio = await p.confirm('Add the Portfolio agent (generates PORTFOLIO.md case studies)?', true);
    if (wantPortfolio) modules.push('portfolio');
    const optimizers = await p.multiselect('Context optimizers to set up?', [
      { label: 'Headroom — context compression layer (proxy/MCP, provider-agnostic)', value: 'headroom', selected: true },
      { label: 'Ponytail — minimal-code discipline skill', value: 'ponytail', selected: true },
      { label: 'Graphify — local codebase knowledge graph (/graphify)', value: 'graphify', selected: true },
    ]);
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
  const answers = args.yes ? defaults(args.targetArg) : await wizard(args.targetArg);
  if (args.noGit) answers.gitInit = false;

  const target = path.resolve(answers.targetDir);
  if (fs.existsSync(path.join(target, 'AGENTS.md'))) {
    console.error(`\nAborted: ${target} already contains an AGENTS.md — refusing to overwrite an existing workspace.`);
    process.exit(1);
  }
  fs.mkdirSync(target, { recursive: true });

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
      writeRendered(path.join(TEMPLATE_DIR, src), path.join(target, dest), vars, enabled);
    }
  }

  // 2. CLAUDE.md only when Claude Code is a target harness
  if (answers.harnesses.includes('claude')) {
    writeRendered(path.join(TEMPLATE_DIR, 'CLAUDE.md'), path.join(target, 'CLAUDE.md'), vars, enabled);
  }

  // 3. Skills: source of truth + per-harness mirrors
  const mirrors = mirrorDirsFor(answers.harnesses);
  for (const mod of Object.keys(SKILLS)) {
    if (!enabled.has(mod)) continue;
    for (const skill of SKILLS[mod]) {
      const src = path.join(TEMPLATE_DIR, 'skills', `${skill}.md`);
      const content = render(stripSections(fs.readFileSync(src, 'utf8'), enabled), vars);
      const rel = path.join('.agents', 'skills', `${skill}.md`);
      fs.mkdirSync(path.dirname(path.join(target, rel)), { recursive: true });
      fs.writeFileSync(path.join(target, rel), content);
      for (const dir of mirrors) {
        fs.mkdirSync(path.join(target, dir), { recursive: true });
        fs.writeFileSync(path.join(target, dir, `${skill}.md`), content);
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
    fs.mkdirSync(path.join(target, '.agents'), { recursive: true });
    fs.writeFileSync(path.join(target, '.agents', 'portfolio-agent.md'), body);
    if (answers.harnesses.includes('claude')) {
      fs.mkdirSync(path.join(target, '.claude', 'agents'), { recursive: true });
      fs.writeFileSync(path.join(target, '.claude', 'agents', 'portfolio.md'), body);
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

  console.log(`\n✓ Agentic workspace created in ${target}\n`);
  console.log('Next steps:');
  console.log('  1. Open the project in your harness (Claude Code, OpenCode, ...).');
  if (enabled.has('memory')) console.log('  2. Fill in memory/project-brief.md (or ask the agent to interview you).');
  if (answers.optimizers.length > 0) console.log('  3. Run /setup-optimizers to install ' + answers.optimizers.join(', ') + '.');
  if (enabled.has('scrum')) console.log('  4. Run /backlog-refinement, then /sprint-planning to start Sprint 1.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

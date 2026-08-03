import readline from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

let rl = null;

export function open() {
  rl = readline.createInterface({ input: stdin, output: stdout });
}

export function close() {
  if (rl) rl.close();
  rl = null;
}

export async function text(question, def = '') {
  const suffix = def ? ` (${def})` : '';
  const answer = (await rl.question(`? ${question}${suffix}: `)).trim();
  return answer || def;
}

export async function confirm(question, def = true) {
  const hint = def ? 'Y/n' : 'y/N';
  const a = (await rl.question(`? ${question} [${hint}]: `)).trim().toLowerCase();
  if (!a) return def;
  return a.startsWith('y') || a === 'oui' || a === 'o';
}

export async function select(question, choices, defIndex = 0) {
  stdout.write(`? ${question}\n`);
  choices.forEach((c, i) => stdout.write(`    ${i + 1}. ${c.label}\n`));
  for (;;) {
    const a = (await rl.question(`  Choose 1-${choices.length} (default ${defIndex + 1}): `)).trim();
    const i = a === '' ? defIndex : Number(a) - 1;
    if (Number.isInteger(i) && i >= 0 && i < choices.length) return choices[i].value;
    stdout.write('  Invalid choice.\n');
  }
}

// choices: [{label, value, selected}] — empty answer keeps defaults,
// "all"/"none" select everything/nothing, otherwise "1,3" style numbers.
export async function multiselect(question, choices) {
  stdout.write(`? ${question}\n`);
  choices.forEach((c, i) =>
    stdout.write(`    ${i + 1}. ${c.label}${c.selected ? '  [default: on]' : ''}\n`)
  );
  for (;;) {
    const a = (await rl.question('  Numbers (comma-separated), "all", "none", or Enter for defaults: '))
      .trim()
      .toLowerCase();
    if (a === '') return choices.filter((c) => c.selected).map((c) => c.value);
    if (a === 'all') return choices.map((c) => c.value);
    if (a === 'none') return [];
    const picks = a.split(/[\s,]+/).map((n) => Number(n) - 1);
    if (picks.every((i) => Number.isInteger(i) && i >= 0 && i < choices.length)) {
      return [...new Set(picks)].map((i) => choices[i].value);
    }
    stdout.write('  Invalid selection.\n');
  }
}

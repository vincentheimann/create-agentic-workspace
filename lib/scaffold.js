import fs from 'node:fs';
import path from 'node:path';

// Replace {{KEY}} with vars.KEY; unknown keys are left intact so downstream
// templates (e.g. the sprint template) keep their own placeholders.
export function render(content, vars) {
  return content.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}

// Keep <!-- BEGIN:key --> ... <!-- END:key --> blocks whose key is in `enabled`
// (markers removed), drop the whole block otherwise. Iterates so nested blocks
// (e.g. per-optimizer sections inside the optimizers block) are resolved too.
export function stripSections(content, enabled) {
  const re = /[ \t]*<!-- BEGIN:([\w-]+) -->\r?\n([\s\S]*?)[ \t]*<!-- END:\1 -->(\r?\n)?/g;
  let prev;
  do {
    prev = content;
    content = prev.replace(re, (m, key, body) => (enabled.has(key) ? body : ''));
  } while (content !== prev);
  return content;
}

export function writeRendered(src, dest, vars, enabled) {
  let content = fs.readFileSync(src, 'utf8');
  content = stripSections(content, enabled);
  content = render(content, vars);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, content);
}

export function copyRaw(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

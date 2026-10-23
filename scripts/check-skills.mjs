#!/usr/bin/env node
// Validate skills/ and agents/: frontmatter, names, sizes, references, links, and leftover terms.
// Usage: node scripts/check-skills.mjs
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillsRoot = path.join(root, "skills");
const agentsRoot = path.join(root, "agents");
const external = new Set(["dataviz", "engram:recall", "engram:history"]);
const allowedKeys = new Set(["name", "description", "disable-model-invocation"]);
const forbidden = [
  /poteto/i, /pstack/i, /\bcursor\b/i, /\.mdc\b/, /`Task`|\bTask (tool|call|subagent)/, /AskQuestion\b/,
  /generalPurpose/, /readonly: true/, /\bgrok/i, /\bgpt-/i, /bugbot/i, /cloud agent/i, /\bketchup\b/i,
  /\bbro\b/, /comment-sicko/, /deslop/, /control-(ui|cli)/, /\/loop 1h/, /[–—]/,
  /\bjj\b/, /jujutsu/i, /\bgh (pr|issue|api)\b/, /GitHub/, /bookmark/i, /memmini/i, /\bpmg\b/, /\bbunx?\b/, /python-standards/, /web-verify/,
];
const problems = [];
// Windows checkouts can turn LF into CRLF, so normalize before parsing.
const read = (file) => readFileSync(file, "utf8").replace(/\r\n/g, "\n");

const walk = (dir) =>
  readdirSync(dir).flatMap((n) => {
    const p = path.join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

function frontmatter(text, where) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return problems.push(`${where}: missing or unclosed frontmatter`), null;
  const fields = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^([a-zA-Z][\w-]*):\s*(.*)$/);
    if (kv) fields[kv[1]] = kv[2].replace(/^(["'])(.*)\1$/, "$2");
  }
  return fields;
}

const skills = readdirSync(skillsRoot).filter((n) => !n.startsWith(".") && statSync(path.join(skillsRoot, n)).isDirectory());
const known = new Set(skills);

for (const name of skills) {
  const file = path.join(skillsRoot, name, "SKILL.md");
  if (!existsSync(file)) { problems.push(`${name}: missing SKILL.md`); continue; }
  const text = read(file);
  const fm = frontmatter(text, name);
  if (!fm) continue;
  if (fm.name !== name) problems.push(`${name}: name "${fm.name}" != directory`);
  if (!fm.description) problems.push(`${name}: no description`);
  else if (fm.description.length > 1024) problems.push(`${name}: description ${fm.description.length} chars > 1024`);
  for (const k of Object.keys(fm)) if (!allowedKeys.has(k)) problems.push(`${name}: frontmatter key "${k}" not allowed`);
  const lines = text.split("\n").length;
  if (lines > 500) problems.push(`${name}: SKILL.md is ${lines} lines > 500`);
}

const agents = existsSync(agentsRoot) ? readdirSync(agentsRoot).filter((n) => n.endsWith(".md")) : [];
for (const a of agents) {
  const fm = frontmatter(read(path.join(agentsRoot, a)), `agents/${a}`);
  if (fm && fm.name !== a.replace(/\.md$/, "")) problems.push(`agents/${a}: name "${fm.name}" != file name`);
}

const playbookDir = path.join(skillsRoot, "analyst-mode", "playbooks");
const analystIndex = read(path.join(skillsRoot, "analyst-mode", "SKILL.md"));
const indexed = new Set([...analystIndex.matchAll(/`playbooks\/([\w-]+)\.md`/g)].map((m) => m[1]));
const onDisk = new Set(readdirSync(playbookDir).filter((n) => n.endsWith(".md")).map((n) => n.replace(/\.md$/, "")));
for (const p of onDisk) if (!indexed.has(p)) problems.push(`analyst-mode index: playbooks/${p}.md exists but is not listed in SKILL.md`);
for (const p of indexed) if (!onDisk.has(p)) problems.push(`analyst-mode index: playbooks/${p}.md is listed in SKILL.md but missing`);

const files = [...walk(skillsRoot), ...agents.map((a) => path.join(agentsRoot, a))].filter((f) => f.endsWith(".md"));
for (const file of files) {
  const rel = path.relative(root, file);
  const text = read(file);
  text.split("\n").forEach((line, i) => {
    for (const re of forbidden) if (re.test(line)) problems.push(`${rel}:${i + 1}: forbidden ${re} in "${line.trim().slice(0, 90)}"`);
  });
  for (const m of text.matchAll(/\*\*([a-z][a-z0-9-]+)\*\* skill|\bwstack:([a-z][a-z0-9-]+)/g)) {
    const ref = m[1] ?? m[2];
    if (!known.has(ref) && !external.has(ref) && !["analyst", "comment-critic"].includes(ref))
      problems.push(`${rel}: unknown skill reference "${ref}"`);
  }
  for (const m of text.matchAll(/\]\(([^)#\s]+\.md)\)|`((?:playbooks|references)\/[\w./-]+\.md)`/g)) {
    const target = m[1] ?? m[2];
    if (target.startsWith("http")) continue;
    const skillDir = path.join(skillsRoot, rel.split(path.sep)[1] ?? "");
    const ok = [path.dirname(file), skillDir].some((d) => existsSync(path.resolve(d, target)));
    if (!ok) problems.push(`${rel}: link ${target} does not resolve`);
  }
}

for (const p of problems) console.error(`error ${p}`);
if (problems.length) {
  console.error(`\n${problems.length} problem(s)`);
  process.exit(1);
}
console.log(`ok: ${skills.length} skills, ${agents.length} agents`);

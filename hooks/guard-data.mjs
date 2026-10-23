#!/usr/bin/env node
// Block the agent from reading real data: data files and raw notebooks (their saved outputs hold rows).
// Paths under tests/ or containing "synthetic" or "fixture" stay readable. WSTACK_ANALYST=off skips the guard.
// Matches file paths and common reader commands only. A script that loads data through `uv run` is not caught.
import { readFileSync } from "node:fs";

if (process.env.WSTACK_ANALYST === "off") process.exit(0);

const DATA = /\.(parquet|csv|tsv|xlsx?|feather|arrow|ipc|jsonl|ndjson|avro|orc|sqlite3?|db|duckdb|pkl|pickle|h5|hdf5|sav|dta|sas7bdat|ipynb)$/i;
const SYNTHETIC = /(^|\/)tests?\/|synthetic|fixture/i;
const READER = /(^|[\s|;&(])(cat|head|tail|less|more|bat|sed|awk|grep|rg|jq|sqlite3|duckdb|csvlook|xsv|qsv|parquet-tools|strings|xxd|od)\b([^|;&\n]*)/g;

const blocked = (p) => typeof p === "string" && DATA.test(p.replace(/["')]+$/, "")) && !SYNTHETIC.test(p);

function check({ tool_name, tool_input = {} }) {
  if (tool_name === "Read" || tool_name === "NotebookRead") return blocked(tool_input.file_path) && tool_input.file_path;
  if (tool_name === "Grep") return [tool_input.path, tool_input.glob].find(blocked);
  if (tool_name === "Bash") {
    for (const [, , , args] of String(tool_input.command ?? "").matchAll(READER)) {
      const hit = args.split(/\s+/).map((a) => a.replace(/^["'(]+/, "")).find(blocked);
      if (hit) return hit;
    }
  }
  return false;
}

const hit = check(JSON.parse(readFileSync(0, "utf8")));
if (hit) {
  process.stderr.write(
    `wstack: blocked reading ${hit}. The human runs everything on real data. ` +
      `Write a script that prints aggregates only and hand it over as a run request. ` +
      `For a notebook, convert it first with uvx jupytext --to py:percent --output /tmp/<name>.py <notebook>.ipynb.`,
  );
  process.exit(2);
}

#!/usr/bin/env node
// Self-check for hooks/guard-data.mjs: exit 2 means blocked.
// Usage: node scripts/check-guard.mjs
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const hook = fileURLToPath(new URL("../hooks/guard-data.mjs", import.meta.url));
const cases = [
  [2, "Read", { file_path: "/w/data/orders.parquet" }],
  [2, "Read", { file_path: "/w/data/orders.csv.gz" }],
  [2, "Read", { file_path: "/w/analysis/explore.ipynb" }],
  [0, "Read", { file_path: "/w/tests/fixtures/orders.csv" }],
  [0, "Read", { file_path: "/w/analysis/eda.py" }],
  [2, "Edit", { file_path: "/w/analysis/explore.ipynb" }],
  [0, "Edit", { file_path: "/w/tests/fixtures/orders.csv" }],
  [2, "Write", { file_path: "/w/data/orders.csv" }],
  [0, "Write", { file_path: "/w/tests/synthetic_orders.parquet" }],
  [2, "Bash", { command: "head -5 data/orders.csv" }],
  [2, "Bash", { command: "cut -d, -f1 data/orders.csv" }],
  [2, "Bash", { command: "column -s, -t data/orders.csv" }],
  [2, "Bash", { command: "zcat data/orders.csv.gz" }],
  [2, "Bash", { command: "ls && jq '.cells' analysis/explore.ipynb" }],
  [0, "Bash", { command: "uvx jupytext --to py:percent --output /tmp/x.py analysis/explore.ipynb" }],
  [0, "Bash", { command: "cat data/synthetic_orders.csv" }],
  [2, "Bash", { command: "cat 'data/orders.csv'" }],
  [0, "Bash", { command: "cat > analysis/eda.py <<'EOF'\nlf = pl.scan_parquet(\"data/orders.parquet\")\nEOF" }],
  [0, "Bash", { command: "sed -i 's/old.parquet/new.parquet/' analysis/x.py" }],
  [0, "Bash", { command: "uvx jupytext --update --to ipynb --output analysis/explore.ipynb /tmp/explore.py" }],
  [2, "Grep", { pattern: "x", glob: "*.csv" }],
  [0, "Grep", { pattern: "x", glob: "*.py" }],
  [0, "Read", null],
  [0, "EmptyInput", null, ""],
];
let bad = 0;
for (const [want, tool_name, tool_input, rawInput] of cases) {
  const input = rawInput !== undefined ? rawInput : JSON.stringify({ tool_name, tool_input });
  const { status } = spawnSync("node", [hook], { input, env: { ...process.env, ASTACK_ANALYST: "" } });
  if (status !== want) bad++, console.log(`FAIL ${tool_name} ${JSON.stringify(tool_input)}: exit ${status}, want ${want}`);
}
console.log(bad ? `${bad} failing` : `PASS ${cases.length} cases`);
process.exit(bad ? 1 : 0);

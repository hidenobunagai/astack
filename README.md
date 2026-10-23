# wstack

A Claude Code plugin for data analysis work: Python with uv and Polars, Jupyter and marimo notebooks, and charts and dashboards. It gives the agent a strict working style, playbooks for common analysis tasks, and principle skills that keep numbers honest.

wstack is adapted from [pstack](https://github.com/cursor/plugins/tree/main/pstack) 0.15.30 by Lauren Tan (MIT). The general engineering workflows are kept, rewritten with Claude Code tool names. The web, PR-automation, and Cursor-only parts are dropped. Data-specific playbooks and principles are added.

It assumes plain git with any hosting or review tool (or none), works on Windows, macOS, and Linux, and uses [engram](https://github.com/hidenobunagai/engram) for memory of past sessions when it is installed.

> Provided as-is, with no support. Issues and pull requests may go unanswered. Fork it and make it yours.

## Requirements

- Claude Code
- git. On Windows, install [Git for Windows](https://git-scm.com/downloads/win) so Claude Code's Bash tool runs in Git Bash. No hosting service or CLI is required. The agent pushes only when a remote exists and hands the review request to you.
- [uv](https://docs.astral.sh/uv/) for Python
- Node.js 18 or newer for `npx` tools and the skill check
- Optional: [engram](https://github.com/hidenobunagai/engram) for recall of past sessions and saved notes

## Install

```bash
claude plugin marketplace add hidenobunagai/wstack
claude plugin install wstack@wstack

# optional: memory of past sessions
claude plugin marketplace add hidenobunagai/engram
claude plugin install engram@engram-marketplace
```

For local development, load the working tree without installing:

```bash
claude --plugin-dir path/to/wstack
```

If pstack is also installed, its skills (`how`, `why`, `unslop`, and others) share names and descriptions with wstack's and compete for auto-triggering. Disable pstack in data repos through the project's `.claude/settings.json`:

```json
{ "enabledPlugins": { "pstack@cursor-plugins": false } }
```

## Who runs the data

The agent never sees real data. It writes the plan and the code, runs them on synthetic data it builds from the schema, and hands every run on real data to you as a run request: the command, the checks with their expected results, and the summary block to paste back. Scripts meant for real data print aggregates and `PASS`/`FAIL` lines only, never rows. The agent then reads what you paste. The rules live in the Human runs the data section of `skills/analyst-mode/SKILL.md`.

A `PreToolUse` hook (`hooks/guard-data.mjs`) backs this up. It blocks the Read and Grep tools and common shell readers (`cat`, `head`, `jq`, `duckdb`, and others) on data files and raw `.ipynb` notebooks, whose saved outputs can hold rows. Paths under `tests/` or with `synthetic` or `fixture` in the name stay readable. The hook cannot see what a script loads, so a project that needs a hard wall should also deny the data directories in `.claude/settings.json`:

```json
{ "permissions": { "deny": ["Read(./data/**)", "Bash(bq query:*)"] } }
```

## Models and cost

Every subagent call names its model and effort. `opus` runs only the roles that make a final judgment (result-validity and statistical-validity review, the arena judge, the hardest design work). Code delegates run on `sonnet` at `medium` effort, verification and review at `high`, and search and exploration on `haiku` at `low`. Higher effort buys edge-case coverage, not a better approach, so it goes to verification and review. Edit the defaults in `skills/analyst-mode/SKILL.md` and the panel tables in `interrogate`, `arena`, `architect`, and `reflect`.

## Use

analyst-mode is on in every session. A `SessionStart` hook loads it at startup, resume, `/clear`, and compaction, so you do not need to type `/wstack:analyst-mode`. Say "analyst-mode off" to drop it for the rest of a session. To skip it for good, such as in headless jobs or repos that are not about data, set `WSTACK_ANALYST=off` in the environment or in the `env` block of `.claude/settings.json`.

analyst-mode routes each task to a playbook:

| Task | Playbook |
| --- | --- |
| First look at a new dataset | `eda` |
| "Why did this metric move?" | `metric-investigation` |
| Checks on a dataset or pipeline output | `data-quality-check` |
| A wrong number, a broken pipeline, a failing notebook | `bug-fix` |
| A slow query, transform, or notebook | `perf-issue` |
| Improving one metric over many iterations | `hillclimb` |
| New analysis code or pipeline step | `feature` |
| An exploratory notebook to a re-runnable script | `notebook-to-pipeline` |
| A chart or dashboard | `visualization` |
| A write-up for readers | `findings-report` |
| Read-only questions about code or data | `investigation` |

Other playbooks cover refactoring, prototypes, multi-phase plans, autonomous runs, pausing and resuming, authoring skills, and opening a PR. Type `/wstack:wstack-help` with a question to find the right one.

The principle skills load on demand. The data-specific ones are `principle-define-the-question`, `principle-respect-the-grain`, `principle-reproduce-from-clean-state`, `principle-explain-the-number`, `principle-name-the-estimand`, and `principle-simulate-the-method`. The last two cover statistical work: naming the quantity and the unit of assignment before picking a method, and checking the method on synthetic data with a planted truth before it runs on real data. The `interrogate` skill adds a statistical-validity reviewer when the work makes a statistical claim.

Two agents ship with the plugin. `wstack:analyst` is the delegate for code and notebook work. `wstack:comment-critic` removes comments that do not earn their place.

wstack uses the `dataviz` skill for chart design when your Claude Code has it, and falls back to the rules in the visualization playbook otherwise.

## Develop

```bash
node scripts/check-skills.mjs
node scripts/check-guard.mjs
```

The first check validates frontmatter, names, size limits, cross-skill references, links, the analyst-mode playbook index, and leftover upstream terms. The second runs the data guard hook against known cases. Run both before each commit.

## License

MIT. See [LICENSE](LICENSE).

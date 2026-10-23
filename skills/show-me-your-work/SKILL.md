---
name: show-me-your-work
description: "Keep a reviewable decision trail for long-running or unattended analysis: a TSV log with one row per decision (what, why, evidence, result). Local by default; commit it when a reviewer needs the trail to trust the result. Use for /wstack:show-me-your-work, autonomous or multi-phase runs, or analysis a human reviews after stepping away."
---

# Show me your work

Keep one canonical log.

## The format

A single TSV file, one row per decision. Cells stay single-line. Evidence is a pointer, not prose.

Copy `references/decision-log-template.tsv` (the header row) to start a clean log. Columns:

- **ts.** ISO8601 timestamp.
- **phase.** The phase or workstream.
- **decision.** What was chosen or done, one line.
- **why.** The reason in plain words. If a principle drove it, say it plainly, not as a jargon tag.
- **evidence.** A link or path that proves it: a commit SHA, PR number, `file:line`, or a notebook, query, chart, or row-count artifact path. Never a paragraph.
- **result.** The outcome or predicate state: `counts match`, `reverted`, `diff 0 rows`, `INCONCLUSIVE`, `open`.

An example, plain-spoken so a reviewer reads it at a glance.

```
ts	phase	decision	why	evidence	result
2026-05-24T09:02:00Z	frame	counted the source tables first, 14 tables and about 80 million rows	wanted to know the data size before a long rebuild	notebooks/eda_profile.md	found 3 duplicate order keys to resolve first
2026-05-24T09:40:00Z	baseline	saved the current monthly revenue table before changing anything	so the new table can be compared with the old one row by row	baseline/orders_monthly_before.parquet	saved 36 months of totals
2026-05-24T11:15:00Z	orders	changed the dedup rule to keep the latest row per order_id	the old rule kept the first row, which dropped refunds	commit 7c21e0a, scripts/build_orders.py:42	revenue differs by 0.4 percent, matches refund table
2026-05-24T12:30:00Z	dashboard	threw out a helper's chart because it plotted an empty frame	checked the real output instead of trusting its summary	chart reset	reverted, added a row-count assertion for next time
```

## Logging a row

Write each entry the way you'd tell a teammate what you did. Plain words, concrete actions, no AI speak or abstract jargon (the **unslop** skill applies to log text too).

Use the helper `scripts/log.sh <logfile> <phase> <decision> <why> <evidence> <result>` from this skill's directory. It stamps `ts`, writes the header on first use, strips stray tabs and newlines, and prefixes any cell starting with `=`, `+`, `-`, or `@` with a single quote. A bare `printf` appending a row works too, but mind those same bytes if cells come from generated or user-supplied text. Spreadsheets run such cells as formulas.

Log decision points and checkpoints, not every action. A fork chosen, a unit completed with its verification result, a pivot or revert with its trigger, a blocker surfaced, a gate fixed. For loop runs, one row per iteration. Skip the trivial and self-evident.

Keep cells free of raw data, row-level samples, credentials, and notebook outputs. Cite a path to the artifact instead.

A run is one agent conversation, including its later turns and any summary of it. A pickup, a replacement agent, or a new chat starts a new run. When a run adds to a log that already has rows, its first row has phase `start`, and so does its first row after another run's `start` row. So a run that comes back to a log in a later turn first reads the log's last rows to see whether another run wrote since. A `start` row names the `ts` range of the rows before it that this run did not write, and its evidence names this run, such as its agent ID. Use phase `start` for nothing else.

## Where it lives

By default the log is a working artifact, not committed. Keep it at `decisions.tsv` in the work dir, or `.audit/<task-slug>.tsv` when several efforts run at once. Add the path to `.gitignore` so it never lands in a commit by accident.

Commit it only when the work is ambitious enough that a reviewer needs the trail to trust the result. Then commit it with `git add` and `git commit` like any other file.

## Rules

- Append-only. A wrong call gets a new row that supersedes it. Never edit or delete history.
- Prefer evidence produced by committed scripts over hand-made one-offs (the **principle-encode-lessons-in-structure** skill).

## Audit the log against the transcript

At the end of the run, before handing back, check the log told the truth. Read this run's transcript at `~/.claude/projects/<slug>/<session>.jsonl`, where the slug is the workspace path with its separators replaced by `-` (list `~/.claude/projects/` to find the exact folder). Don't glob across `~/.claude/projects/*/`. That reads unrelated private chats. Walk this run's rows against what actually happened. Each stretch of them begins at one of this run's `start` rows, or at the first row if this run created the log, and ends at the next `start` row of another run:

- Check that every row maps to a real decision or action.
- Check that each row's evidence resolves and shows what the row claims. Open the notebook cell, rerun the query, or count the rows.
- A fork, pivot, or abandoned approach that shaped the work but isn't logged is a gap. Add it.

Correct the log, not the story. The audit never edits or removes a row, even an invented one. When a row records neither a real decision nor a real action, or its claim or evidence is wrong, add a row that supersedes it with what actually happened and a pointer that resolves. This audit does not check rows outside this run's stretches. If this run's own work shows one of them is wrong, supersede it like any wrong call.

## Cross-model review of the trail

Before handing back, spawn a subagent on a different model from the one that did the work. Self-review is not a substitute. Claude Code offers only Claude models, so the check comes from a different model in the same family, and the reviewer brief says so. Use `subagent_type` `general-purpose`, `model` `sonnet` and `effort` `high` when the work ran on `opus`, or `model` `opus` and `effort` `high` when it ran on `sonnet`. The subagent reads the audit trail and the run's transcript, then flags what the user should pay attention to. It is not a redo of the work. It scans for what's suboptimal or risky.

- Decisions logged with weak or absent evidence.
- Verification steps skipped or claimed without proof in the transcript.
- Choices that look risky in hindsight (premature, scope-creeping, papering over a symptom, a number reported without a row count or a reconciliation).
- Gaps the user would otherwise miss on a casual skim.

Every reply for a run that produced a trail ends with an "Attention" section. Lead with the reviewer's model on its own line (`reviewed by <model>`), then list each flag pointing to specific rows or moments. "No flags" is a valid value. The model name is not.

## Reviewing the trail

Read top to bottom, follow the evidence pointers, spot-check. Many git web interfaces render a committed TSV as a table. `column -s$'\t' -t decisions.tsv` renders it in a terminal.

## Composing this skill

Other skills route their audit trail here instead of inventing one. Reference it by name and let it own the format. Don't restate the columns.

---
name: swarm
description: "Fan out N parallel workers over data slices, datasets, notebooks, or charts, drain them, and return one report. Use for /swarm, \"swarm this\", or parallel coverage (check every table, profile every dataset), races between analysis approaches, and gauntlet-style exploration."
---

# Swarm

Open a todo list with one entry per phase before you launch anything: Frame, Fan out, Aggregate, Report.

## Phase A: Frame

1. State the done predicate and the report the swarm must return. Example: "every table in `warehouse/staging` has a row count, a key check, and a null summary, and each result is PASS, ISSUES, or BLOCKED".
2. Choose the shape:
   - **Partition**: split the work into slices, one per dataset, notebook, or table. Each slice must have a result.
   - **Race**: run N workers on the same brief, or on N approaches to one question. Declare the selection rule first: `first pass`, `rank all`, or `best-of`.
   - Mix both when needed.
3. Pick the worker model. Use `Agent` with `subagent_type` `general-purpose`, `model` `sonnet`, `effort` `high` for most workers. For a trivial mechanical sweep (renaming, listing, counting), use `model` `haiku`, `effort` `low`. For a race, name each arm's model before you spawn. Put one arm on `opus` at `high` as a second opinion, so the race is not decided by one model family alone.
4. Give each writing worker its own output. Use `isolation` `worktree` for code. When workers verify or measure something, the brief names the exact input: the file path with its content hash, or the query text with the data snapshot date. A measurement brief also names the method: sample count, what one sample is, and the order of the runs. The worker records both in its result.

## Phase B: Fan out

Spawn all workers in one message. Every brief stands alone. It includes the goal, the scope, the slice or race arm, how to verify, and what to report. Reports use `PASS`, `ISSUES`, or `BLOCKED`, each with evidence. A worker that can prove a defect reports `ISSUES` and lists every provable issue, not only the first.

Workers may read warehouse data but must not write to it. Any write to a shared table or a scheduled job is out of scope and pauses for the human.

If a worker drops out, continue with N-1 and note the dropout.

## Phase C: Aggregate

Read every result. If a result does not record the inputs and method its brief names, discard it and respawn that worker once. After a second miss, record a gap. A gap does not count as a pass. For coverage, every required slice needs a result. For a race, apply the rule you declared in Phase A.

## Phase D: Report

Return one consolidated report in the chat: a table with one row per slice or arm, the issues in one line each, the gaps and dropouts, and the race rule when one was used. Do not paste raw worker output.

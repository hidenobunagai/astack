---
name: blast-radius
description: "Find what a change to a table, column, transform, metric, or notebook could break downstream (dashboards, saved queries, notebooks, consumers) before it ships, beyond the diff, and prove the one fact it is safe because of by running real code. Use for 'blast radius of X', 'what could this break', or reviewing a small diff you don't trust."
---

# Blast radius

Find what a change breaks somewhere else, before it ships. Use for "blast radius of X", "what could this break", or reviewing a small diff you don't trust yet. The change can be a renamed column, a new join key, a changed dedup rule, a new file format, or a changed definition of an active user.

Companion to the **how** and **why** skills. **how** tells you what the code does. **why** tells you why it's shaped that way. Blast radius tells you what it breaks somewhere else.

Listing the callers is not the job. The agent can grep those in a second. The job is the breakage grep won't show you.

## Don't trust your own writeup

A blast-radius writeup that sounds right is worthless. It reads as convincing whether or not it's true. So don't hand back the writeup. Find the one or two facts the whole thing depends on and prove them by running code.

### How sure are you

For each fact the change's safety depends on, get it as far down this list as is cheap, and say where it stopped.

1. You said so. Worthless on its own.
2. You pointed at the line. A real `file:line`, or the library's own source.
3. You showed the bad case can't happen. You walked the failure step by step and it doesn't reach.
4. You ran it. A script or test that calls the real code and fails loud if you're wrong.
5. You reproduced it in the real output. Re-run the downstream notebook or query on the new output and compare with the old.

Step 4 is usually one small script that imports the same library the project ships, at the version pinned in `uv.lock`, and calls the exact function you're worried about.

## Where the breakage hides

Search the places grep does not reach:

- **Dashboards and saved queries.** A renamed column breaks a chart that names it as a string. The chart fails at render time, not at build time.
- **Notebooks.** A notebook that reads a Parquet path or a column by position keeps running on the old file. Search the notebook source, not only the `.py` files, after you convert them.
- **Dtypes.** An `Int64` column that gains a null becomes a float in some readers. A downstream `.cast(pl.Int64)` then fails, or a comparison against `0` silently changes.
- **Grain.** A table that goes from one row per order to one row per line item multiplies every join downstream. Totals double without an error.
- **Sort order and keys.** Code that assumes `first()` is the earliest row breaks when the sort changes.
- **Definitions.** A new dedup rule, timezone, or filter changes a metric that a finance report reconciles against.
- **Files and formats.** A consumer in another language or tool reads the same Parquet or CSV bytes and expects the old encoding.

## Steps

1. Read the change. The diff, the columns and tables it adds, changes, and deletes, and what it now does differently, including the part the diff doesn't spell out. Use the **why** skill to pull the PR and commits, with `git log` and the team's review tool when reachable.
2. Find the one fact it's safe because of. Most changes that look risky are safe because of a single fact, like "this join only adds columns and keeps the grain, because `order_id` is unique in `orders_clean`". Find that fact. If it holds, most risky cases are cleared at once. Spend your time here, not on a long list of maybes.
3. Look where grep stops. Read the source of the library you call, and check its pinned version in `uv.lock` and any local patch. Work out when things run: lazy evaluation at `collect()` time, a scheduled job that runs before the change lands, a notebook that is still open with old state. Follow what a symbol search misses: the dashboard definition, a notebook cell, a Parquet file another team reads, a feature flag, code three hops downstream.
4. Be honest about each risk. Give it a real chance of happening and a real cost if it does. Keep the risks you confirmed. List the ones you checked and cleared separately. Same rules as the **why** skill. Cite a real `file:line`, a search that finds nothing is still an answer, and never make up a consumer or a table.
5. Prove the one fact. Write a script or test that runs the real code on the real schema, run it, and paste what happened. Compare row counts, dtypes, and a grouped total before and after.
6. For a big or wide change, run it as an **arena**. Ask more than one model the same question and merge the answers. Different models catch different real bugs.

Never run a write against a shared warehouse, a production table, or a scheduled job to test a change. Build the proof on a local copy or a sampled extract, and leave the real run for the human.

## What to hand back

- **What it does.** What changed, including the part that isn't obvious.
- **The one fact it's safe because of.** State it, say which step you got it to, and show the proof. If you couldn't prove it, write unproven.
- **Risks.** Each names how it breaks, the `file:line` or dashboard, how likely and how bad, and how to check. Paste the proof for the ones that matter.
- **Cleared.** What you checked and why it's fine.
- **Before you merge.** The cheapest test or repro that catches the real bug, including the script you wrote.

Write it through the **unslop** skill, cite real code, and strip anything private, such as customer identifiers or credentials, before it goes anywhere public.

**Reply:** the writeup above, with the one safety fact either proven or marked unproven.

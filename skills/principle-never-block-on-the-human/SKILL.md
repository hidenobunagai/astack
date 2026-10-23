---
name: principle-never-block-on-the-human
description: "Apply when tempted to stop and ask 'should I do X?' during reversible analysis work, such as writing a query, adding a cleaning step, choosing a bin width, or drafting a chart. Proceed with a reasonable choice, state it, and let the human correct it afterward."
---

# Never Block on the Human

The human supervises asynchronously. Keep the work unblocked. Make a reasonable decision, proceed, and let the human course-correct after the fact. Queries, scripts, and charts are reversible and reviewable, so a wrong default usually costs less than a stalled session.

- Proceed, then present. Run the analysis and show the result along with the decisions behind it: the time window, the exclusions, and the metric definition. Do not ask "should I use 28 days?" Use 28 days, say so, and offer the alternative.
- Make the pipeline self-healing where it is safe. When a check fails, log it and fix it in the next round.
- Irreversible actions still need explicit confirmation. These are writes to a shared warehouse or production table, changes to a scheduled job, deletes, and sending results to people outside the session. Prefer a dry run or a compile step first.
- Reversible actions proceed without blocking. These are queries against a local copy, files in the repo, notebooks, charts, and scripts.
- Product direction comes from the human. Which question matters, and which metric the business owns, is theirs to decide. Execution should not wait on it.

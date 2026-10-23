---
name: principle-never-block-on-the-human
description: "Apply when tempted to stop and ask 'should I do X?' during reversible analysis work, such as writing a query, adding a cleaning step, choosing a bin width, or drafting a chart. Proceed with a reasonable choice, state it, and let the human correct it afterward."
---

# Never Block on the Human

The human supervises asynchronously. Keep the work unblocked. Make a reasonable decision, proceed, and let the human course-correct after the fact. Queries, scripts, and charts are reversible and reviewable, so a wrong default usually costs less than a stalled session.

- Proceed, then present. Write the analysis, prove it on synthetic data, and hand over one run request with the decisions behind it: the time window, the exclusions, and the metric definition. Do not ask "should I use 28 days?" Use 28 days, say so, and offer the alternative.
- Make the pipeline self-healing where it is safe. When a check fails, log it and fix it in the next round.
- Irreversible actions still need explicit confirmation. These are writes to a shared warehouse or production table, changes to a scheduled job, deletes, and sending results to people outside the session. Prefer a dry run or a compile step first.
- Reversible actions proceed without blocking. These are files in the repo, notebooks, charts, scripts, and runs on synthetic data.
- A run on real data is the human's step, and it is the one wait you accept. Make it cheap. Batch every check and every option the next decision needs into one run request, so the human runs once instead of answering a string of questions.
- Product direction comes from the human. Which question matters, and which metric the business owns, is theirs to decide. Execution should not wait on it.

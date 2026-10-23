---
name: principle-build-the-lever
description: "Apply to any non-trivial analysis or data work: bulk edits, notebook conversions, backfills, reconciliations, and checks. Build the script or query that does the work or proves it, so a reviewer can rerun it instead of trusting a hand-done result."
---

# Build the Lever

When the work is not trivial, build the tool that does it or proves it, instead of doing it by hand in a notebook cell.

A script, a SQL query file, a Polars pipeline, or a re-runnable check does the same work the same way every time. A reviewer can read it and rerun it. A result clicked through by hand can only be re-verified by redoing the clicks.

Default to building the lever. Skip it only for trivial work, such as one obvious edit or one glance at a table.

- Do the first unit on synthetic data to learn the recipe. Then script it. Prove the script on synthetic data, including a case it must reject, before the human runs it on real data. Make it safe to rerun.
- Use a script for repeated transforms, a generator for repetitive notebooks or report pages, a pinned query file for analysis, and a re-runnable assertion script for checks.
- A deterministic lever beats fan-out. If one script can process every partition, table, or segment in one pass, hand the human that one script in one run request. Do not hand the same manual check to subagents.
- When you fan work out to subagents, write the lever as a skill they all read: the recipe, the verification contract, and the do-not-touch fences in one artifact. Keep it outside the write scope of the delegates so they cannot quietly edit the contract.
- Commit the lever with `git commit` when the work outlives the session. Commit code, queries, and lockfiles. Never commit raw data, credentials, or notebook outputs.

The bar is triviality, not repetition. A one-off analysis still earns a lever when the lever is what makes the number checkable. Per **principle-laziness-protocol**, build the smallest script that does or proves the job, never a framework. For the check itself, see **principle-prove-it-works**.

If you cite this principle and the diff contains no script, query file, or generator, you did not apply it.

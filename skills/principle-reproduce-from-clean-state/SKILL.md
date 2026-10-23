---
name: principle-reproduce-from-clean-state
description: "Apply before reporting a result, handing off a notebook, or merging an analysis. A result counts only when it re-runs from a clean kernel or process, from the source data, with pinned dependencies (uv.lock) and fixed seeds. Hidden notebook state and cell order are bugs."
---

# Reproduce from Clean State

A result counts only when it can be reproduced from scratch. Restart the kernel or open a new process, run from the top, and read what comes out. A number that exists only in a warm kernel is not a result.

Notebooks keep state across cells. A variable from a deleted cell, a file overwritten earlier, or cells run out of order can produce numbers that no one can rebuild. Saved outputs show what was true once, not what the code does now.

- Re-execute top to bottom in a fresh process. Use "Restart and Run All" in the notebook tool, or run the converted script with `uv run`.
- Pin the environment with `uv.lock`, commit it, and run through `uv run` so the versions match. Do not rely on whatever happens to be installed.
- Set and record a seed for any sampling, bootstrap, or model fit. Pass the seed as a parameter, not as a value hidden in a cell.
- Read from the source data path, not from an intermediate you made by hand. If a cache is used, its key includes the source version, such as a date or a hash.
- Pin the input. Every run takes an explicit as-of timestamp, partition, or snapshot id, and filters the source to rows that existed at that point, for example `ingested_at <= as_of`. Write the as-of value into the output next to the command that produced it. Without a pinned input, two clean runs days apart can differ for reasons that are not bugs.
- Cell order is a bug. If a top-to-bottom run gives a different result from the saved one, the notebook is wrong. Fix the order, or move the logic into functions.
- Keep raw data, credentials, and notebook outputs out of commits. Commit the code and the lockfile. The number lives in the report, next to the command that produced it.
- Run it a second time and compare. Two clean runs that match are the minimum evidence.

You skipped this when a result exists only in a warm kernel, when a saved notebook output is quoted as the answer, or when a rerun with the same inputs gives a different number.

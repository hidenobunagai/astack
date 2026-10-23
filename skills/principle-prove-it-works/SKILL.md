---
name: principle-prove-it-works
description: "Apply after finishing an analysis, pipeline change, notebook, chart, or model, before reporting a number as done. Verify against the real artifact: a clean re-run by the human, the actual output values in the pasted summary, the rendered chart. Do not rely on a saved output, a self-report, or 'it runs'."
---

# Prove It Works

Verify every output by checking the real thing directly. Do not infer from proxies, self-reports, saved outputs, or "it ran without errors".

Unverified work has unknown correctness. Indirect checks feel cheaper than direct observation, and acting on a wrong inference costs far more than checking the source.

- The human re-executes from clean state through a run request, and you read the values in the pasted output. A notebook passes when a fresh run produces the numbers, not when the saved outputs look right (see **principle-reproduce-from-clean-state**).
- Prove the code and the checks on synthetic data first. Run them yourself, and feed each check a known bad input so it fails. A run on real data then tests the data, not your code.
- Check that a job ran by reading the output table's latest date or row count, not the job's status log.
- Read the actual value, not a cached summary. Reconcile a total against an independent source.
- Look at the rendered chart, not only the code that builds it. Render it on synthetic data yourself, and read the real render the human shares. Check each plotted number against the source in the check script.
- When verification fails, suspect the check before the system. A filter in your check query, a stale cache file, or a timezone mismatch in the comparison is the usual cause.

The strongest proof is a deterministic check script that reruns the same comparison, not a one-time look. Write it as a re-runnable `uv run` script that prints only aggregates and `PASS`/`FAIL` lines. Run it on synthetic data, hand the real run to the human, and keep the pasted output as an artifact a reviewer can rerun. Commit the check only for large or complex work where the trail must be auditable later (see **show-me-your-work**).

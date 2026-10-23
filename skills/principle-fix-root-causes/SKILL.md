---
name: principle-fix-root-causes
description: "Apply when debugging a wrong number, a failing pipeline, a broken notebook, or a failing test. Trace each symptom back to the first step where the data or code went wrong, and fix it there. A guard is a fix only when the bad state is legitimate."
---

# Fix Root Causes

When debugging, fix the fault, not the place where it surfaced. The symptom is where a wrong value became visible, such as a dashboard total or a failed assertion. The root cause is the first step that produced a wrong row, a wrong dtype, or an unhandled state.

A symptom fix hides the evidence and lets the fault surface somewhere else. A `fill_null(0)` added to silence a downstream error can turn a missing source into a real zero in the report.

- Reproduce first, on the same data, in a clean run (see **principle-reproduce-from-clean-state**).
- Ask "why" at each step until the answer is a wrong decision in the code or the data handling. Walk back through the pipeline and check the row count and dtypes at each stage.
- When stuck, instrument. Print the actual frame, count the rows, read the schema. Read the real value. Do not guess.
- Ask whether the bad state is legitimate. If the source can really contain it, the code that broke on it is the root cause, and handling the state there is the fix. If the state should never exist, a check at the point of failure hides the bug. Find what produced it. Defaults, retries, swallowed exceptions, clamped values, and silently dropped rows are the usual ways to hide a bug.
- When something changes only after a rerun or a restart, suspect persisted state first: cached intermediate files, a stale kernel, a lock file, a saved model artifact.
- Check for the pattern, not only the instance. Find every place with the same fault and fix them all.
- If a workaround needs a paragraph-long comment to justify it, the code is wrong. Fix the code, not the comment.
- If the deciding fact took a deep dig to find, add the cheap, always-on signal that would have shown it at first look, such as a row-count log or a schema assertion.

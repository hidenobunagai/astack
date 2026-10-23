---
name: principle-make-operations-idempotent
description: "Apply when designing a data load, backfill, export, scheduled job, or any pipeline step that may run again after a crash, retry, or partial failure. Converge to the same end state no matter how many times it runs or where the last run stopped."
---

# Make Operations Idempotent

Design each operation so it converges to the correct state however many times it runs and wherever the previous run stopped. For every write, ask: what happens if this runs twice, and what happens if the previous run crashed halfway?

Pipelines run where crashes, restarts, and retries are normal. If partial state changes the next run's outcome, every restart becomes a debugging session.

Derive each step from the state that exists, not from what the previous run meant to do. Read the current state, compare it to the goal, and apply only the difference. A step written this way is safe to repeat.

- For a daily load, overwrite the partition for that date instead of appending rows. A rerun then cannot double count.
- Write to a temporary path and rename it into place, so a crash never leaves a half-written table or file.
- Compare artifacts by content (a hash, a row count, a key set) instead of by creation order.

Anything a run leaves behind, such as a lock, a temporary file, a half-written table, or a claimed job, must be recognizable as stale by the next run. Judge staleness by evidence that stays true wherever the run stopped, not only in the common case. A marker that the next run cannot judge turns every crash into manual cleanup.

The test has three questions. What happens if this runs twice in a row? What happens if the previous run crashed at every possible point? Does a rerun converge to the same end state? If any answer is "it depends on what state was left behind", the operation needs a reconciliation step.

Changes to a scheduled job or a shared table still need the human's confirmation before they run (see **principle-never-block-on-the-human**).

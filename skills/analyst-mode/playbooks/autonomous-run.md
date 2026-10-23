### Autonomous run

**You own the exit condition. Define done, then drive to it without stopping.**

1. State the exit condition as a checkable predicate before the first iteration. Examples: the check suite is green, the repro gives the expected value, all N PRs are merged, the rendered chart matches the reference image, the metric meets its target on the held-out split.
2. Pick the wake mechanism. Use the loop skill for a time-based heartbeat, sized to when the result is worth re-checking (a long job, a nightly run). For an event to watch (a CI run, a merge, a data file landing), start a watcher with the Monitor tool that wakes you on the event, with a long heartbeat as fallback. Pick each subagent's reasoning level per the subagent rules in the analyst-mode skill.
3. Each iteration makes the smallest change the evidence justifies, re-runs it against the predicate from a clean process, and commits if the predicate advanced. Discard changes that did not help. Belt-and-suspenders that "might help" gets reverted, not left in place. Sequence the work with the **principle-sequence-verifiable-units** skill: verify each unit before the next, not in a batch at the end.
4. Mid-run discoveries are yours. Fix broken checks, flaky tests, stale lockfiles, failing notebooks, tooling failures, and drift in the skills yourself. Put out-of-band fixes in their own PR. Do not park reversible work for the human, and do not call AskUserQuestion for it. Surface only these: irreversible actions (writes to shared tables, changes to scheduled jobs, deletes, anything sent outside the session), genuine product or preference calls that no experiment can settle, and a real dead end. Keep the predicate as the main drive, and return to it after each side fix.
5. Checkpoint every iteration with the **show-me-your-work** skill. Each row says what changed and whether the predicate moved.
6. Stop when the predicate is met. A plateau is not a stop. Pivot the approach to push past it. Surface a real dead end rather than spinning. Never relax the predicate to declare victory.

**Reply:** the exit condition, iterations run, what landed, what was discarded, and the final predicate state with its values.

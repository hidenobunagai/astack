### Bug fix

**You own this task. Plan, review, verify.** Delegate investigation and the fix to subagents. Stay in the lead.

A bug here is a wrong number, a broken pipeline, or a failing notebook.

Be scientific. Every shipped line traces to evidence from a clean re-run. A change that "might help" is a hypothesis, not a fix, and does not ship. When evidence refutes a hypothesis, revert what it motivated. Ship the smallest change the evidence justifies.

1. Reproduce it yourself. Re-run the failing query, script, or notebook from a clean process and capture the wrong value or the error. Ask the user only when you cannot reach the data or the environment, and only after you tried what you can. If it does not fail on demand, narrow the input (a date range, a segment, a sample of keys) until it does.
2. Binary-search the cause. List the candidate causes and rule them out one at a time. Common ones: join fan-out or dropped rows, nulls and sentinel values, a filter or timezone that cuts the window differently, a changed upstream source, a changed definition. Seed the list with the **principle-explain-the-number** skill and the **how** skill over the affected pipeline. Each pass, pick the check that splits the remaining candidates most, run it, and eliminate. When the state is unclear, add row counts, key-uniqueness checks, or prints at each stage. Don't guess. Confirm the surviving mechanism by reading the values it produces before step 3.
3. Plan the fix. If the fix changes a shared function (a transform, a join helper, a metric definition), run the **architect** skill first. Delegate implementation to a subagent with `model: "sonnet"` and `effort: "high"`, with a specific scope: file paths, the function, and the values it must produce.
4. Verify from a clean state. Re-run the same query, script, or notebook in a fresh process. The original repro now gives the expected value. Read the actual values and compare them with the expected values you wrote down before the fix. "Inconclusive," or a check that ran on a different slice, is not a pass. Flag it. Unit tests show branch behavior, not bug absence.
5. Stage the commits so the failing check lands before the fix. Commit the failing data check or test first with `git add <paths>` and `git commit -m "..."`, then the fix on top. Use the **tdd** skill when a cheap local test exists. Skip it when the check needs the full warehouse or is unclear. This is the **principle-sequence-verifiable-units** skill in practice.
6. Run the opening-a-pr playbook (`playbooks/opening-a-pr.md`).

**Reply:** what was wrong, root cause, fix, how you verified. Paste the failing and passing output verbatim, with the values before and after.

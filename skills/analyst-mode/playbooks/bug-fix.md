### Bug fix

**You own this task. Investigate, fix, verify.** Keep the evidence and the fix in one context, so nothing is lost in a handoff.

A bug here is a wrong number, a broken pipeline, or a failing notebook.

Be scientific. Every shipped line traces to evidence from a clean re-run: yours on synthetic data, or the human's on real data. A change that "might help" is a hypothesis, not a fix, and does not ship. When evidence refutes a hypothesis, revert what it motivated. Ship the smallest change the evidence justifies.

1. Reproduce it. First try to reproduce it on synthetic data: a few inline rows that trigger the same code path. That repro is yours to run. When the bug lives in the data itself, write a repro script that prints the wrong value and the stage counts, and hand it over as a run request (analyst-mode, Human runs the data). If it does not fail on demand, narrow the input (a date range, a segment, a set of keys) in the next request until it does.
2. Binary-search the cause. List the candidate causes and rule them out one at a time. Common ones: join fan-out or dropped rows, nulls and sentinel values, a filter or timezone that cuts the window differently, a changed upstream source, a changed definition. Seed the list with the **principle-explain-the-number** skill and the **how** skill over the affected pipeline. Each pass, pick the checks that split the remaining candidates most, put them all in one script, and eliminate. When the state is unclear, add row counts, key-uniqueness checks, or aggregate prints at each stage. Don't guess. Confirm the surviving mechanism by reading the values it produces before step 3.
3. Plan the fix. If the fix changes a shared function (a transform, a join helper, a metric definition), run the **architect** skill first. Write down the file paths, the function, and the values it must produce, then make the fix yourself.
4. Verify from a clean state. Run the synthetic repro yourself, then hand the original real data repro back to the human in a fresh process. It now gives the expected value. Read the actual values and compare them with the expected values you wrote down before the fix. "Inconclusive," or a check that ran on a different slice, is not a pass. Flag it. Unit tests show branch behavior, not bug absence.
5. Stage the commits so the failing check lands before the fix. Commit the failing data check or test first with `git add <paths>` and `git commit -m "..."`, then the fix on top. Use the **tdd** skill when a cheap local test exists. Skip it when the check needs the full warehouse or is unclear. This is the **principle-sequence-verifiable-units** skill in practice.
6. Run the opening-a-pr playbook (`playbooks/opening-a-pr.md`).

**Reply:** what was wrong, root cause, fix, how you verified. Quote the failing and passing output verbatim, from your synthetic runs and the human's pastes, with the values before and after.

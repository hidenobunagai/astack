### Perf issue

**You own the measurement story. Plan, review, verify the numbers.** Tie every fix to a measurement. Do not infer speed from reading code.

1. Capture a baseline. Write a benchmark script that times the slow query, transform, or notebook in a clean process over several runs and prints only timings, sizes, and counts. Prove it on synthetic data, then the human runs it on the real input through a run request (analyst-mode, Human runs the data). Record the input size, the output row count, and the peak memory if you can read it. For a Polars query, save `LazyFrame.explain()` before the change. Vet the baseline, and each later number, with the **benchmark-checklist** skill.
2. Ground hypotheses with the **how** skill. Don't claim a ceiling without running it first. Try the performance mantras in order, cheapest first:
   1. Don't do it. Stop work whose result nothing uses.
   2. Do it, but don't do it again. Cache a repeated read or computation.
   3. Do it less. Read fewer columns and rows, push filters down, drop unused joins.
   4. Do it later. Move work off the path that must finish first.
   5. Do it when they're not looking. Run it in a scheduled batch, off the interactive path.
   6. Do it concurrently. Parallelize independent partitions.
   7. Do it cheaper. Use narrower dtypes, the lazy engine, or a better algorithm.

   When an earlier mantra meets the target, stop.
3. Plan the fix from the baseline and the query plan. If it crosses a function boundary, run the **architect** skill first. Make the change yourself. When several candidate fixes are independent, you may build them in parallel subagents, each in its own worktree (`isolation: "worktree"`), and review each diff. Re-measure with the same probe on the same input. When several candidate fixes are live, one request runs the baseline and every candidate and prints one table. Apply the **principle-sequence-verifiable-units** skill: verify each attempt before trying the next.
4. Check the output too. A faster result that changes values is a bug. Compare row counts, key sets, and column sums with the baseline output. "Inconclusive," or a measurement on a different input, is not a pass. Flag it.
5. Cite the measurement in the PR.
6. Run the opening-a-pr playbook (`playbooks/opening-a-pr.md`).

For sustained improvement against a metric rather than a one-off fix, use the hillclimb playbook (`playbooks/hillclimb.md`).

**Reply:** baseline number, post-fix number, delta, the output parity check, and the path to the benchmark script.

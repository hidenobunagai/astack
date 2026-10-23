---
name: benchmark-checklist
description: "Vet a runtime measurement for a query, dataframe transform, pipeline, or notebook before you report or act on it: limiter, tuning, data volume, warm vs cold cache, errors, repeatability, relevance, and whether the work really ran. Use when you time a run or report a speedup or regression."
---

# Benchmark checklist

Use this when you produce a runtime number: a query or transform before and after, a notebook that got slower, a pipeline step's wall time, or a library or file-format choice (CSV, Parquet, eager vs lazy Polars). Answer each question with evidence from a run, not a guess about the code.

For a quick ballpark the user asked for, one run is enough. Still check questions 4 and 7, and say that it is one run. Skip the rest unless that run looks wrong. A choice between options is never a ballpark.

## Before you run anything

- Write down the claim you expect to make, in the words you would ship ("the Parquet version of `events_daily` builds 3 times faster at 60 million rows, warm cache"). The questions test that sentence.
- Pin the data. Name the file, its row count, and its size on disk. Check that both sides read the same input.
- Read the timing script. Note what it times, counts, and ignores. A `time.perf_counter()` around `lf.collect()` times the query. Around `lf = pl.scan_parquet(...)` it times almost nothing.
- Check the load average with `uptime` and the core count with `nproc`. If the machine is busy, find out what is running. If you cannot stop it, interleave the sides so both see the same noise, and say so in the report.
- Decide the cache state before you run. Warm means the file was just read. Cold means the OS page cache was dropped. Production usually runs warm for repeated jobs and cold for the first job of the day. Say which one you measured. Dropping caches needs root. Run `sync`, then `echo 3 | sudo tee /proc/sys/vm/drop_caches`, and do it only on a box you own.

## The questions

1. **Why not double?** Name the limiter. Profile in a run you do not report, because profilers slow the work down. On real data, the human runs the profiler from a run request and shares the summary or the flame graph image. For Python code, `py-spy record --subprocesses -o profile.svg -- uv run python script.py`. Without `--subprocesses`, py-spy attaches to the `uv` wrapper and fails with "Failed to find python version from target process". Or call the venv interpreter directly (`.venv/bin/python script.py`) and say so. Either form samples the call stack without changing the code. For a Polars query, `lf.explain()` shows the plan that runs, so you can see whether a filter was pushed down into the scan. Check I/O wait (`iostat` or `vmstat`) and CPU per process (`top`). Watch the load generator too: if the reader saturates the disk first, you measured the disk. If a change did not move the number, the limiter explains why, so find it before you call the change useless.
2. **Was it tuned?** Run every side the way production runs it: release builds of compiled extensions, the same engine setting (`engine="streaming"` or the default), the same file format and compression, the same partitioning, and the same versions pinned in `uv.lock`. If one side runs on defaults, you compared configurations, not implementations. A limiter that is a setting (a row-by-row Python loop, a missing index in the database, `collect()` inside a loop, a debug build) means that side is untuned. Tune it and measure again before you pick a winner. If you cannot tune it, do not pick a winner from that run. When the user is choosing what to adopt, narrowing the claim to the code as it ships today does not fix this, because they adopt the option, not today's settings.
3. **Did it break limits?** Do the arithmetic. Compare bytes per second with disk and memory bandwidth, rows per second times cost per row with your cores, and the time saved with the time the changed step took. Removing a step that takes 10 percent of the run can make the run at most about 11 percent faster. A result past a limit measured something other than the work, such as a cache, a skipped scan, or a bug.
4. **Did it error, and is the output right?** Count failures, warnings, and dropped rows. Compare row counts and null counts for both sides, and compare a checksum or a grouped total. A faster query that returns fewer rows measured a filter bug, not a speedup. If the script does not count these, add the count.
5. **Does it reproduce?** Run each side at least 5 times, alternating (A, B, A, B, and so on) so warmup, lazy initialization, caches, and drift favor neither. Report the median and range. Discard nothing silently. A gap smaller than the run-to-run variation is no measurable difference. When the call is close, use a rank-sum test (`scipy.stats.mannwhitneyu`) or the harness's own statistics.
6. **Does it matter?** Next to any micro result, measure the end-to-end path a user waits on, with realistic data sizes and the same notebook or job the user runs, and report the micro result as a share of the whole. A step that takes 1 percent of a job can make the job at most 1 percent faster, however fast the step gets. Check that the time scales with data volume: run the same measurement at two sizes, such as 1 million and 10 million rows. A line that bends away from linear means the result will not hold at production size.
7. **Did it even happen?** Confirm the work ran inside the timed region. A `LazyFrame` that nobody calls `collect()` on does no work. A `sink_*` call with `lazy=True` returns a LazyFrame that does no work until you call `collect()`. The default `lazy=False` runs the query and returns None, so a bare `sink_parquet(path)` does run. A notebook cell that was not re-executed still shows an old output. Check that the rows were written, the bytes were read, and the code used the result. Lazy code and timeouts produce numbers for work that never happened.

## Report

- Lead with the verdict: faster, slower, no measurable difference, or inconclusive.
- Give the number with its unit, the run count, the range, the cache state, the data size, and the limiter. For example, "p50 41 s to 33 s on `events` (58 million rows, warm cache), median of 7 runs per side, range 32 to 35 s after, bound by CSV parsing on one core."
- Call the verdict inconclusive when you claim a difference but cannot name the limiter, when a side ran untuned, when the data size is not stated, or when you could not check questions 4 and 7. Name the gap.
- Keep a PR body to one primary number, per the **opening-a-pr** playbook of the analyst-mode skill. Put the runs, range, and limiter evidence in a linked artifact or notes file.

## Other perf material

- Vet the **perf-issue** playbook's baseline before the playbook plans from it, and every number after that.
- Vet the **hillclimb** playbook's harness before it is frozen. The frozen harness then prints error and row counts, so each keep-or-revert checks questions 4 and 7 for free.

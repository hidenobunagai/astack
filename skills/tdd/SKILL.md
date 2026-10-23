---
name: tdd
description: "Test-first bug fix for data code, using pytest run through uv and small inline fixture frames. Use only when the user explicitly asks for TDD, a failing test, or a regression test, OR when a wrong number or broken transform has a cheap local test target. Skip when the test path is unclear, needs a warehouse or large data, or was not requested."
---

# TDD Bug Fix

When fixing a bug in a transform or metric with a clear, cheap test path, make the broken behavior executable before changing production code. The goal is a focused regression test that fails before the fix and passes after it.

Do not force a test when it would be impractical. If the available test would need a warehouse connection, a multi-gigabyte extract, mocked database clients, production-only state, vague reproduction steps, or large unrelated fixture churn, skip adding a new test and use the closest useful verification instead.

## Setup

Run tests through `uv run pytest`. If the project has no pytest yet, add it as a dev dependency with `uv add --dev pytest`. Keep tests in `tests/`, and name each file after the module it covers.

Write fixtures as small Polars frames built inline, with three to ten rows that show the bug. Do not load the real data in a unit test. A regression test on a 6-row frame runs in milliseconds and shows the reader the input.

```python
import polars as pl
from pipeline.orders import dedupe_orders

def test_dedupe_keeps_latest_row_per_order():
    raw = pl.DataFrame(
        {
            "order_id": [1, 1, 2],
            "updated_at": ["2026-01-01", "2026-01-05", "2026-01-02"],
            "amount": [10.0, 12.0, 7.0],
        }
    )
    out = dedupe_orders(raw).sort("order_id")
    assert out["amount"].to_list() == [12.0, 7.0]
```

## Workflow

1. **Understand the bug.** Identify the intended behavior, current behavior, affected transform or metric, and the smallest input that shows the wrong output.
2. **Choose the narrowest executable check.** Prefer the closest unit test already used for that function. If no practical test path is obvious, do not create one from scratch just to satisfy the workflow.
3. **Write the failing test first.** Add the smallest test that would have caught the bug, on a small inline frame. The test should encode the intended behavior, not mirror the current implementation. Put the expected values in the test as literals. Do not compute them with the code under test.
4. **Run the new test before fixing.** Run only the affected file while iterating: `uv run pytest tests/test_orders.py::test_dedupe_keeps_latest_row_per_order`. Confirm it fails for the intended reason, with a wrong value in the assertion message. If it passes or fails for an unrelated reason such as an import error or a dtype mismatch in the fixture, correct the test before editing the implementation.
5. **Fix the bug.** Make the smallest production change that satisfies the intended behavior while preserving nearby contracts, such as column names, dtypes, and the grain.
6. **Rerun the regression test.** Confirm it passes. Then run the full suite once with `uv run pytest` at the end.

## If a Failing Test Is Impractical

Use the closest executable regression check instead, written by you and run by the human: a script that re-runs the transform on a sampled extract, a row-count or checksum assertion on the real output, a data-quality check on the output table, or a saved query that compares old and new results. The **data-quality-check** playbook of the analyst-mode skill covers the last one.

Prefer no new test over a bad test. A bad test is one that mostly tests mocks, encodes current implementation details, depends on file paths or wall-clock time, needs a warehouse for a small fix, or would be deleted right after it proves the fix.

## Guardrails

- Do not change expected values to match a wrong implementation.
- Do not weaken existing assertions unless the expected behavior has genuinely changed and the reason is clear.
- Keep the regression test focused on the bug. Avoid broad fixture churn or unrelated coverage expansion.
- Never commit real data into a fixture. Build the rows inline, or use a few rows you made up.
- If the bug is flaky, fix the seed and the sort order so the test is deterministic, and document the signal being locked down.
- If the bug exposes a broader class of failures, first land the focused regression test, then consider sibling coverage.

## Final Response

Report the evidence, not just the outcome:

- Name the failing-before test and the assertion it produced, with the wrong value.
- Name the passing-after test run and any nearby validation performed.
- If failing-before evidence could not be demonstrated, state why and describe the closest regression check used instead.

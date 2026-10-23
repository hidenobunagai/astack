# Query history (warehouse logs and saved SQL)

## What this source contains

- Query logs in the warehouse: which queries ran, when, by whom, how long they took, and how much they read. Examples: `system.query.history` on Databricks, `INFORMATION_SCHEMA.JOBS` views on BigQuery, `QUERY_HISTORY` on Snowflake.
- Saved SQL and dbt-style models in the repo, with their own history.
- Experiment exposure or flag tables, when the project has them.

Query history shows what was actually run. It answers "did anyone use this", "was this expensive", and "when did this start". It does not explain why.

## How to search it

Use the warehouse MCP or CLI that the project has connected. Read-only queries only.

1. **Orient first.** Table and view names are project-specific. List candidates with the warehouse's own listing command or `SHOW TABLES`, and check columns with `DESCRIBE TABLE` before you trust a name.
2. **Time-bound every query.** Filter on the log's start time with a window around the date in question, usually 30 days before and after. Widen only with a reason.
3. **Prefer the typed model over the raw log.** For event data, use the deduplicated model in the repo rather than the raw events table.
4. **Read the repo's SQL first.** `rg -l '<table or column>' --glob '*.sql'` shows which models read or write the target. Their history explains the lineage. Hand that lead to the source-control investigator.

Patterns that pay off:

- **Usage trajectory.** Daily count of the output table or query around the change date. A step up after a launch date is circumstantial support for the launch. A drop to zero suggests a removal.
- **Value distribution.** Median, p99, and max of the input column in the 14 days before a change. A threshold that matches the p99 suggests the number came from the data.
- **Expensive queries as motive.** For a rewrite or backfill, sort the log by duration or bytes read for statements that mention the table, inside a tight window.

## What good evidence looks like

- A step change in usage on the day a PR merged, with the PR cited.
- Query text in the log that matches the new code, with a start time just before the change.

## Common pitfalls

- **Logged is not caused.** The existence of a query does not prove the code exists because of it. Pair it with a commit or PR citation before you claim causation.
- **Instrumentation changes.** A step in event volume may mean a new event started, not that behavior changed. Check for logging changes in the same window.
- **Schema drift.** A column that exists now may not have existed when the code was written.
- **Refresh lag.** Derived models rebuild on a schedule. Recent rows may be missing from them.
- **Retention cliff.** If the window is older than the log's retention, that is a gap, not "no activity". Say so.
- **Unconfirmed names.** Do not report a result from a table whose name you did not confirm.

## What to return

For each relevant finding:
- Type (log row, saved query, model, or experiment table)
- Fully qualified name and the exact query you ran
- Time window
- Compact numeric summary (counts, percentiles, first and last timestamps). Do not dump raw rows.
- Timing against the change date, for example "first row 2026-03-02; PR #41 merged 2026-03-01"
- Strength: direct, circumstantial, or weak

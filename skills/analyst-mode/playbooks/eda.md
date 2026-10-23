### EDA

**You own the profile script. Measure what the data is before you analyze anything in it.** EDA is read-only. Never write back to the source file, table, or notebook outputs. You write the profile and prove it on synthetic data. The human runs it on the real data and pastes back the summary. Steps 2 to 9 describe what the script computes and prints, not what you read.

1. Write one sentence on what the dataset is for, even if the question is still vague. Use the **principle-define-the-question** skill. A profile with no question drifts into fishing, so note the decision it may serve and move on.
2. Convert before reading. A notebook goes through `uvx jupytext --to py:percent --output /tmp/<name>.py <notebook>.ipynb` first. The profile opens the data file lazily so nothing loads yet, and prints the schema and the row count first:

   ```python
   import polars as pl

   lf = pl.scan_parquet("data/orders.parquet")  # lazy, nothing read yet
   print(lf.collect_schema())
   print(lf.select(pl.len().alias("rows")).collect())
   ```

   Use the **principle-guard-the-context-window** skill here. Print summaries only, never a whole frame or a row.
3. Name the grain. Write down what one row means (one order, one customer-day, one event). Find the candidate key and check it. Count duplicates on the key and stop to report if it is not unique. Use the **principle-respect-the-grain** skill.
4. Profile each column. Record the type, null count and share, distinct count, and min, max, and quantiles for numbers. For text, list the top values. `df.describe()` is a start, not the answer.
5. Check for sentinels that look like values. Look for `0`, `-1`, `""`, `"N/A"`, `1970-01-01`, and `9999-12-31`. Decide with evidence whether each one means missing or means a real value. Use the **principle-explain-the-number** skill on any odd spike.
6. Check time coverage. Convert every timestamp to the business timezone, and state that timezone in the profile header, before you truncate to a day. A UTC day and a JST day differ by 9 hours, so the wrong zone moves rows between days. Then find the min and max of each date column, count rows per day or week, and list gaps. Flag any period where the volume drops or jumps.
7. Check the keys you plan to join on. Count null keys on each side first. A Polars join never matches a null key by default, so an inner join drops those rows and a left join leaves them unmatched. Then, for each join, count the match rate and the orphans with an anti join. Count the rows on each side before and after. Fan-out and silent drops are the usual wrong number. Use the **principle-respect-the-grain** skill again.
8. Print distributions and outliers. Print p1, p50, p99, and max. Do not drop outliers. Count them, and describe them by aggregates (their count per segment and per day, their share of the total), not by printing the rows.
9. Print format checks in place of a raw sample. Stats hide mixed formats, encoding damage, and odd strings, so count them directly: string lengths per column, the share matching the expected pattern (dates, codes, emails), non ASCII or control characters, leading or trailing spaces, and the number of distinct formats. Never print the rows themselves. If a count looks wrong, the human inspects the rows and tells you what they saw.
10. Leave the profile as one re-runnable script, `analysis/eda_<dataset>.py`. It covers steps 2 to 9 and prints its tables. Run it yourself on a synthetic frame with the same schema, with planted duplicates, nulls, sentinels, and bad formats, and confirm it reports each one. Then hand the human a run request (analyst-mode, Human runs the data) for `uv run python analysis/eda_<dataset>.py` from a clean process, twice, and read the pasted values. The same input must give the same output.

**Reply:** before the human's run, the script path, the synthetic run result, and the run request. After it, the profile, in this order.
- One line on the dataset: source, grain, row count, time range, candidate key.
- A column table with type, null share, and distinct count. Cover every column when there are about 15 or fewer. Above that, list only the columns with a finding.
- Findings with row counts: duplicates, sentinels, orphans, gaps, outliers.
- Questions the profile raises, and which of them the data owner must answer before analysis. Do not guess the answers.
- The artifact path and the command to re-run it.
- Which columns hold personal data, and how the script kept their values out of the output.
- What you did not check, and why.

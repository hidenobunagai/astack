### EDA

**You own the profile. Measure what the data is before you analyze anything in it.** EDA is read-only. Never write back to the source file, table, or notebook outputs.

1. Write one sentence on what the dataset is for, even if the question is still vague. Use the **principle-define-the-question** skill. A profile with no question drifts into fishing, so note the decision it may serve and move on.
2. Convert before reading. A notebook goes through `uvx jupytext --to py:percent --output /tmp/<name>.py <notebook>.ipynb` first. A data file gets metadata before any rows. Open it lazily so nothing loads yet, and read the schema:

   ```python
   import polars as pl

   lf = pl.scan_parquet("data/orders.parquet")  # lazy, nothing read yet
   print(lf.collect_schema())
   print(lf.select(pl.len().alias("rows")).collect())
   ```

   Use the **principle-guard-the-context-window** skill here. Print summaries and samples, never a whole frame.
3. Name the grain. Write down what one row means (one order, one customer-day, one event). Find the candidate key and check it. Count duplicates on the key and stop to report if it is not unique. Use the **principle-respect-the-grain** skill.
4. Profile each column. Record the type, null count and share, distinct count, and min, max, and quantiles for numbers. For text, list the top values. `df.describe()` is a start, not the answer.
5. Check for sentinels that look like values. Look for `0`, `-1`, `""`, `"N/A"`, `1970-01-01`, and `9999-12-31`. Decide with evidence whether each one means missing or means a real value. Use the **principle-explain-the-number** skill on any odd spike.
6. Check time coverage. Convert every timestamp to the business timezone, and state that timezone in the profile header, before you truncate to a day. A UTC day and a JST day differ by 9 hours, so the wrong zone moves rows between days. Then find the min and max of each date column, count rows per day or week, and list gaps. Flag any period where the volume drops or jumps.
7. Check the keys you plan to join on. Count null keys on each side first. A Polars join never matches a null key by default, so an inner join drops those rows and a left join leaves them unmatched. Then, for each join, count the match rate and the orphans with an anti join. Count the rows on each side before and after. Fan-out and silent drops are the usual wrong number. Use the **principle-respect-the-grain** skill again.
8. Look at distributions and outliers. Read p1, p50, p99, and max. Look at the top rows by value. Do not drop outliers. Count them and record what they look like.
9. Read a fixed random sample of raw rows. Print raw rows only when the table has no personal data. Otherwise print a masked sample and the aggregates. Take the sample from the collected frame, for example `lf.collect().sample(20, seed=0)`. Stats hide mixed formats, encoding damage, and odd strings that a sample shows at once. Use the **principle-reproduce-from-clean-state** skill, so the seed stays fixed.
10. Leave the profile as one re-runnable script, `analysis/eda_<dataset>.py`. It covers steps 2 to 9 and prints its tables. Run it again from a clean process with `uv run python analysis/eda_<dataset>.py` and read the values it prints. The same input must give the same output.

**Reply:** the profile, in this order.
- One line on the dataset: source, grain, row count, time range, candidate key.
- A column table with type, null share, and distinct count. Cover every column when there are about 15 or fewer. Above that, list only the columns with a finding.
- Findings with row counts: duplicates, sentinels, orphans, gaps, outliers.
- Questions the profile raises, and which of them the data owner must answer before analysis. Do not guess the answers.
- The artifact path and the command to re-run it.
- Any personal data in the sample, and how it was masked or left out.
- What you did not check, and why.

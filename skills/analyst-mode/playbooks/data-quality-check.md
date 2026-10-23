### Data quality check

**You own the verdict. Write the checks, run them against the data, and say which ones failed and what each failure does to the people downstream.** Checks only read. If the target is a shared warehouse or production table, run `SELECT`-style reads only. Any write, schedule, or alert setup pauses for the human.

1. Write the contract before you run anything. List each check with its rule and threshold: schema, uniqueness, nulls, ranges, referential integrity, freshness, and volume. Take each threshold from the owner. If the owner has none, derive it from history and state the basis. Use the **principle-define-the-question** skill.
2. Confirm the grain and key first. Count duplicates on the key and the expected row count per period. Use the **principle-respect-the-grain** skill. A check on a table whose grain is wrong produces numbers that look fine and mean nothing.
3. Write one check script, `checks/dq_<dataset>.py`. Each check is a named function that returns pass or fail, the offending row count, and up to 20 sample offending rows. The checks cover these categories:
   - **Schema**: expected columns and dtypes, compared with `lf.collect_schema()`.
   - **Uniqueness**: zero duplicates on the key.
   - **Nulls**: null share at or below the threshold for each required column.
   - **Ranges**: values inside the allowed bounds, with no impossible negatives or dates.
   - **Referential integrity**: child keys with no parent, found with an anti join. Null child keys go under **Nulls**, not here.
   - **Freshness**: max timestamp no older than the allowed lag, measured against a timezone-aware now in the business timezone. Name that timezone in the script.
   - **Volume**: today's row count inside the band set by the trailing history, compared with the same weekday in that history so a weekly cycle does not trigger it.

   Two of them, written out in full.

   ```python
   import polars as pl
   import sys

   def check_unique(lf: pl.LazyFrame, keys: list[str]) -> int:
       return lf.select(pl.struct(keys).is_duplicated().sum()).collect().item()

   def check_orphans(child: pl.LazyFrame, parent: pl.LazyFrame, key: str) -> int:
       return child.filter(pl.col(key).is_not_null()).join(parent.select(key), on=key, how="anti").select(pl.len()).collect().item()

   orders = pl.scan_parquet("data/orders.parquet")
   customers = pl.scan_parquet("data/customers.parquet")
   failures = {
       "orders.order_id duplicates": check_unique(orders, ["order_id"]),
       "orders.customer_id orphans": check_orphans(orders, customers, "customer_id"),
   }
   for name, n in failures.items():
       print(f"{'FAIL' if n else 'PASS'} {name}: {n}")
   sys.exit(1 if any(failures.values()) else 0)
   ```


   Use the **principle-minimize-reader-load** skill. Keep each check to one line of intent, and write the rest once in the helper functions.
4. Make the script exit non-zero when any check fails, so a scheduler can read the result. Do not set up the schedule or the alert. That is a write, and it pauses for the human.
5. Prove the checks can fail. A check that never fails proves nothing. Feed it a known-bad input, such as a duplicated key or a row with a null required column, and confirm it reports the failure. Use the **principle-prove-it-works** skill.
6. Run the script from a clean process with `uv run python checks/dq_<dataset>.py`. Read the printed values, not the summary alone. Run it twice on the same snapshot and check the results match. Use the **principle-make-operations-idempotent** skill and the **principle-reproduce-from-clean-state** skill.
7. Triage each failure. Use the **principle-explain-the-number** skill to decide whether the cause is the data, the threshold, or the definition. Do not loosen a threshold to make a check pass. If you change one, record the old value, the new value, and the reason in the script. If the cause sits in the pipeline that produced the data, route the fix through the **principle-fix-root-causes** skill.
8. Rate each failure as blocking or warning. A blocking failure stops the downstream use of the data. A warning goes on the list for the owner.

**Reply:** the verdict, in this order.
- A table with one row per check: name, rule, threshold, result, and offending row count. Give the sample offending rows for each failure.
- The blocking failures first, with what each one does to the downstream use.
- The thresholds and where each one came from.
- The artifact path and the command to re-run it.
- What you did not check, such as freshness when no reliable clock source exists.
- The decision the human must make, such as whether to block the downstream job. Do not make it for them.

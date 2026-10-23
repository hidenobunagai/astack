---
name: principle-respect-the-grain
description: "Apply before you join, filter, group, or aggregate a table, and before you trust a total. Name the grain (what one row means) of every table, and check key uniqueness and row counts before and after each step so fan-out and silent drops do not change the number."
---

# Respect the Grain

Every table has a grain: what one row represents, such as one order, one customer per day, or one page view per session. Name the grain before you use the table. Most wrong numbers in analysis come from ignoring it.

A join that fans out duplicates rows and inflates sums. An inner join that silently drops unmatched keys shrinks the base. A group-by at the wrong level averages averages. Each of these still returns a clean-looking table.

- Write the grain next to the load, for example "one row per order_id", and assert it with a uniqueness check on the key.
- Before and after each join, log row counts and key uniqueness on the side that must be unique. A left join from orders to a customer table with duplicate `customer_id` rows multiplies every order. Pass `validate="m:1"` (or `"1:1"`) to `join` on the lookup side. The default is `validate="m:m"`, which checks nothing. The streaming engine does not run the check, so for streaming runs add an explicit assertion on key uniqueness.
- Count null keys on each side before every join. A Polars join never matches null keys by default (`nulls_equal=False`, renamed from `join_nulls` in 1.24). An inner join drops them without a trace, and a left join keeps them unmatched. Write the count with `pl.col(key).is_null().sum()`, and state the handling: kept unmatched, or excluded by design.
- Make the join type explicit. Use `how="anti"` to list the keys that did not match before you decide to drop them.
- After each filter or aggregation, compare the count with the count the definition predicts. A filter that removes 40 percent of rows needs a reason you can state.
- Aggregate at the grain the question asks for. Sum the lowest-level rows, then roll up. Do not average per-segment averages unless the weights are equal.
- Compare the total against an independent figure at the same grain (see **principle-explain-the-number**).

You skipped this when a join changes the row count with no stated reason, or when a total is reported without row counts before and after.

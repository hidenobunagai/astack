# Example: the human runs the data

A complete, small walk through astack's working model on synthetic data:
the agent writes the plan and the code, proves the code on data it may see,
and hands every run on real data to you. Nothing here is real data; the
sales file is invented by `make_synthetic.py`, with one dip planted at
store B in the week of 2026-09-14.

## 1. You ask

> Our weekly sales report looked low in mid-September. Can you check whether
> something actually dipped, and where?

## 2. The agent writes a check, not a query

The agent does not open your sales extract. Reading it would be blocked by
the data guard anyway: `Read` and shell readers refuse data files whose
path does not contain `synthetic` or `fixture` and is not under `tests/`.

Instead the agent writes `check_sales.py`, a script with three rules:

- It prints aggregates and `PASS`/`FAIL` lines only, never a data row, so
  its whole output is safe to paste back into the chat.
- It checks structure first (no negative sales, no missing store-days),
  then looks for the anomaly (each store's most unusual week against that
  store's median week).
- It exits non-zero if any check fails, so a failure cannot be overlooked.

## 3. The agent proves the check on synthetic data

```bash
uv run make_synthetic.py synthetic_sales.csv
uv run check_sales.py synthetic_sales.csv
```

The path contains `synthetic`, so the agent may run this itself. Output:

```text
wrote 84 rows to synthetic_sales.csv
PASS no negative sales: 0 rows
PASS no missing store-days: 84 of 84 store-days, 2026-09-07 to 2026-10-04
PASS store A every week within 15% of its median week: worst week of 2026-09-14: 3,996,143 yen vs median 3,903,318 yen (+2.4%)
FAIL store B every week within 15% of its median week: worst week of 2026-09-14: 2,069,614 yen vs median 2,774,420 yen (-25.4%)
PASS store C every week within 15% of its median week: worst week of 2026-09-28: 2,217,548 yen vs median 2,172,344 yen (+2.1%)
summary: 84 rows, 3 stores, weeks 2026-09-07 to 2026-09-28
```

The planted dip is found, in the right store and the right week, and the
other stores pass: the check is known to detect the thing it claims to
detect before it ever touches real data.

## 4. The run request: you run it on the real file

The agent hands you exactly this, and stops:

> Run request
>
> ```bash
> uv run check_sales.py <your-sales-extract.csv>
> ```
>
> Expected, if mid-September was a reporting artifact rather than a real
> dip: every line PASS. If a store really dipped, its line FAILs and names
> the week and the size. Paste the full output back, whatever it says.

## 5. You paste the output, the agent reads numbers, not rows

From the pasted block the agent can now work: whether the dip is real,
which store and week carry it, and how large it is against that store's
own median. The next step would be a second, narrower check (transactions
versus sales per transaction, to separate fewer customers from smaller
baskets) — again written by the agent, proven on synthetic data, and run
by you.

Your extract never entered the chat, the agent's context, or any log.

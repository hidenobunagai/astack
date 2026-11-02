# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""Weekly sales check, written to run on real data without showing rows.

Prints aggregates and PASS/FAIL lines only, never a data row, so the whole
output can be pasted back to the agent. Usage:

    uv run check_sales.py <sales.csv>

Checks: no negative sales, no missing store-days inside the covered range,
and each store's most unusual week against that store's median week.
"""

import csv
import statistics
import sys
from collections import defaultdict
from datetime import date, timedelta

path = sys.argv[1]
with open(path, newline="") as f:
    raw = list(csv.DictReader(f))

# (date, store, sales_yen, transactions), parsed once into plain types.
rows: list[tuple[date, str, int, int]] = [
    (
        date.fromisoformat(r["date"]),
        r["store"],
        int(r["sales_yen"]),
        int(r["transactions"]),
    )
    for r in raw
]

failures = 0


def report(ok: bool, label: str, detail: str) -> None:
    global failures
    failures += 0 if ok else 1
    print(f"{'PASS' if ok else 'FAIL'} {label}: {detail}")


neg = sum(1 for _, _, sales, _ in rows if sales < 0)
report(neg == 0, "no negative sales", f"{neg} rows")

stores = sorted({store for _, store, _, _ in rows})
days = sorted({d for d, _, _, _ in rows})
expected = {(d, s) for d in days for s in stores}
present = {(d, s) for d, s, _, _ in rows}
report(
    len(present) == len(expected),
    "no missing store-days",
    f"{len(present)} of {len(expected)} store-days, {days[0]} to {days[-1]}",
)


def week_start(d: date) -> date:
    return d - timedelta(days=d.weekday())


weekly: dict[tuple[str, date], int] = defaultdict(int)
for d, store, sales, _ in rows:
    weekly[(store, week_start(d))] += sales

weeks = sorted({w for _, w in weekly})
for s in stores:
    by_week = [(weekly[(s, w)], w) for w in weeks]
    median = statistics.median(v for v, _ in by_week)
    worst, worst_week = max(by_week, key=lambda t: abs(t[0] / median - 1))
    change = (worst / median - 1) * 100
    report(
        abs(change) <= 15,
        f"store {s} every week within 15% of its median week",
        f"worst week of {worst_week}: {worst:,} yen vs median {median:,.0f} yen ({change:+.1f}%)",
    )

print(
    f"summary: {len(rows)} rows, {len(stores)} stores, weeks {weeks[0]} to {weeks[-1]}"
)
sys.exit(1 if failures else 0)

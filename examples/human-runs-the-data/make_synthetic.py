# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
"""Build a small synthetic daily-sales file shaped like a real extract.

The numbers are invented. One week (2026-09-14 onward) is planted with a
dip at store B, so the check script has something real to find.
"""

import csv
import random
import sys
from datetime import date, timedelta

random.seed(42)
start = date(2026, 9, 7)
stores = {"A": 520_000, "B": 380_000, "C": 290_000}

rows = []
for day in range(28):
    d = start + timedelta(days=day)
    for store, base in stores.items():
        factor = 1.0 + random.uniform(-0.06, 0.06)
        if d.weekday() >= 5:
            factor *= 1.25
        if store == "B" and date(2026, 9, 14) <= d <= date(2026, 9, 20):
            factor *= 0.72  # the planted dip
        sales = round(base * factor)
        rows.append(
            {
                "date": d.isoformat(),
                "store": store,
                "sales_yen": sales,
                "transactions": round(sales / 1450),
            }
        )

out = sys.argv[1] if len(sys.argv) > 1 else "synthetic_sales.csv"
with open(out, "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=["date", "store", "sales_yen", "transactions"])
    w.writeheader()
    w.writerows(rows)
print(f"wrote {len(rows)} rows to {out}")

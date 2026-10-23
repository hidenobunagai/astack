### Visualization

**You own the picture. Name the question, pick the form, render the chart, look at the image, and check every plotted number against the source.** Chart design rules come from the **dataviz** skill when it is available, otherwise from the rules below. This playbook is the process around them. A chart you have not rendered and looked at is not finished.

1. Write the question the view answers, in one sentence, and who reads it. Use the **principle-experience-first** skill: the reader of the chart is the consumer, so the view serves their decision, not the data's shape. A view with no question gets cut.
2. Pick the form from the question. Comparing values across categories: a bar chart, sorted by value. Change over time: a line chart with a labeled time axis. A distribution: a histogram or box plot. A relationship between two numbers: a scatter plot. A part of a whole: a bar, not a pie, unless there are two or three parts. Read the **dataviz** skill before you choose colors, sizes, or layout.
3. Aggregate in Polars, before the plotting call. Name the frame after its grain, for example `by_week_channel`. Check its row count and check that its totals match the source. Use the **principle-respect-the-grain** skill.
4. Build the chart from that one frame, in the plotting library the project already uses (check `uv.lock`). Save it to a file with a fixed size and resolution, so the render is repeatable:

   ```python
   import matplotlib.pyplot as plt

   fig, ax = plt.subplots(figsize=(8, 4.5))
   ax.barh(by_channel["channel"], by_channel["revenue"])
   ax.set_xlabel("Revenue (JPY, Jan 2026)")
   ax.set_title("Web drove 62% of January revenue")
   fig.savefig("analysis/figures/revenue_by_channel.png", dpi=150, bbox_inches="tight")
   ```

   The title states the finding, not the topic. Label axes with units.
5. Render it and look at it. Use the Read tool on the PNG. Check each of these in the image:
   - The title says the finding, and the finding matches the number in the title.
   - Axis labels and units are readable, and no tick label is cut off.
   - The point or bar the text talks about is the one the reader sees first.
   - Labels do not overlap, and the legend does not hide data.
   - Sort order is meaningful. Alphabetical order is not a finding.
6. Check accessibility. Text contrast is at least 4.5:1 and non-text marks at least 3:1. Never encode meaning by color alone. Add a direct label, a marker shape, or a pattern. Animation respects `prefers-reduced-motion` in web views. The full palette and a11y review belong to the **dataviz** skill.
7. Check every plotted number against the source. Pick at least the maximum, the minimum, one middle value, and the total. Pull each from the source by query, not from the chart frame, and compare. Here `lf` is the lazy source frame. `WINDOW` is the one window both queries read, so the filter cannot differ between them. Convert timestamps to the business timezone before you filter. Put the checks in a script that asserts, so a rerun catches drift:

   ```python
   import polars as pl

   WINDOW = pl.col("order_date").is_between(pl.date(2026, 1, 1), pl.date(2026, 1, 31))
   source = lf.filter(WINDOW)
   source_total = source.select(pl.col("amount").sum()).collect().item()
   by_channel = source.group_by("channel").agg(pl.col("amount").sum().alias("revenue")).collect()
   assert abs(by_channel["revenue"].sum() - source_total) < 0.5, f"chart {by_channel['revenue'].sum()} != source {source_total}"
   assert by_channel.height == source.select(pl.col("channel").n_unique()).collect().item()
   ```

   A mismatch means the aggregation or join is wrong. Fix the frame, not the label. Use the **principle-explain-the-number** skill on any value you cannot tie out.
8. For a dashboard, check every view, not only the one you changed. Re-execute the app from a clean process. For a marimo dashboard, export it and render the HTML:

   ```bash
   uv run marimo export html analysis/dashboard.py -o /tmp/dashboard.html -f
   ```

   Render that HTML to a PNG in a headless browser, for example `npx playwright screenshot --full-page file://<path> <out.png>` (run `npx playwright install chromium` once), then Read each image. Saved outputs are not evidence.
9. Keep the figure file and its check script in the repo. Do not commit raw data embedded in the image or the HTML. When the figure goes into a write-up, follow the findings-report playbook (`playbooks/findings-report.md`).

**Reply:** what the view shows.
- The question each view answers, and the path of each rendered image.
- What you checked on the image, and what you changed after looking.
- The source comparison: each checked value, the source value, and the difference (zero is the goal).
- Accessibility results: contrast checked, and which information carries a label beyond color.
- What you did not check, such as a narrower screen size or a different date window.

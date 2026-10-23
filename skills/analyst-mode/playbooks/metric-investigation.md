### Metric investigation

**You own the answer. Confirm the move is real, find what drives it, and reconcile the parts to the total before you report.** Investigations are read-only. They produce a cited explanation with a confidence label, not a change to a pipeline or dashboard.

1. Write the metric definition in words and in the query: numerator, denominator, filters, population, time window, and timezone. Take the definition from the owner's dashboard code or documentation, not from memory. Write down the decision the answer serves and the result that would change it. Use the **principle-define-the-question** skill.
2. Attack the premise that the metric moved. Use the **principle-attack-the-premise** skill. Check these first:
   - Is the latest period complete? A partial day or week looks like a drop.
   - Is the source fresh? Compare the max timestamp per source table with now.
   - Did a pipeline run fail, backfill, or change schema in the window?
   - Did the definition, a filter, or an upstream source change between the two periods?
   - Is it bot or test traffic?
3. Compare the move with its normal spread. Compute the same metric for at least 8 comparable prior periods, so the spread has a real sample behind it. For a seasonal metric, compare with the same weekday or the same period last year, and check holiday windows such as Golden Week or New Year. A move inside that spread is not a finding. If that is the result, stop and report "no change beyond normal spread" with the numbers.
4. Reconcile the baseline. Compute both periods with one definition from one source. Record the row count and the value for each period. Tie the total to a number someone else owns, such as a dashboard or a finance report, and state the difference. Use the **principle-explain-the-number** skill.
5. Decompose by segment. Pick the dimensions the owner cares about (channel, region, product, cohort). For a ratio, split the change into a mix effect and a rate effect. With shares `s` and rates `r` for each segment `i`, the two terms add to the total change with no residual:

   ```python
   import polars as pl

   P0, P1 = "2025-12", "2026-01"

   by_seg = (
       df.group_by("period", "segment")
       .agg(pl.col("num").sum(), pl.col("den").sum())
       .with_columns(
           share=pl.col("den") / pl.col("den").sum().over("period"),
           rate=pl.col("num") / pl.col("den"),
       )
   )
   p0 = by_seg.filter(pl.col("period") == P0).select("segment", share0="share", rate0="rate")
   p1 = by_seg.filter(pl.col("period") == P1).select("segment", share1="share", rate1="rate")
   wide = (
       p0.join(p1, on="segment", how="full", coalesce=True)
       .with_columns(
           share0=pl.col("share0").fill_null(0.0),
           share1=pl.col("share1").fill_null(0.0),
       )
       .with_columns(
           rate0=pl.coalesce("rate0", "rate1"),
           rate1=pl.coalesce("rate1", "rate0"),
       )
       .with_columns(
           mix_i=(pl.col("share1") - pl.col("share0")) * pl.col("rate0"),
           rate_i=pl.col("share1") * (pl.col("rate1") - pl.col("rate0")),
       )
   )
   ratio0 = df.filter(pl.col("period") == P0).select(pl.col("num").sum() / pl.col("den").sum()).item()
   ratio1 = df.filter(pl.col("period") == P1).select(pl.col("num").sum() / pl.col("den").sum()).item()
   assert abs(wide["mix_i"].sum() + wide["rate_i"].sum() - (ratio1 - ratio0)) < 1e-9
   ```

   Here `df` has the columns `period`, `segment`, `num`, and `den`. A segment absent in one period gets share 0 there, and its missing rate is taken from the period where it exists, so its rate term is zero. A zero denominator makes a rate null, so settle that convention before this step.

   If the rates are flat and the total moved, the mix shifted. That is a mix effect, not Simpson's paradox. The **principle-explain-the-number** skill covers both.
6. Rank the drivers by absolute contribution. List the segments that explain most of the move, and the row count under each. Flag any segment with few rows, because its rate is noise. Give each segment a binomial or bootstrap interval for its rate, record the number of segments tested, and apply a multiple-comparison adjustment (Holm or Benjamini-Hochberg) before you name a driver.
7. Reconcile the parts to the total. The sum of the segment effects must equal the total change. If the residual is not zero, a NULL segment, a dropped row, or a join is wrong. Find it before you go on. Use the **principle-respect-the-grain** skill.
8. Test the top driver as an artifact. Ask what else could produce it: fan-out, one account or customer dominating, a changed filter, a sentinel value. Rerun with that suspect removed or capped. If the total still moves the same way, the driver survives.
9. Label every claim with confidence:
   - **High**: the move exceeds the spread with an interval that excludes zero, it reconciles, it re-runs from a clean process, and an independent source agrees.
   - **Medium**: reconciled on one source, no independent check.
   - **Low**: inferred, with a suspect not yet ruled out.
10. Leave one re-runnable script, `analysis/metric_<name>.py`, that takes the period bounds as arguments and prints the baseline, the decomposition table, and the residual. Run it again from a clean process and read the printed values. Use the **principle-reproduce-from-clean-state** skill.

**Reply:** the answer first, then the support.
- One line that states the answer, the size of the move, and the segment that drives it, with its confidence label. For example, "Conversion fell 2.1 points, and mobile web accounts for 1.6 of that. Confidence: high."
- The reconciliation: both baselines, the independent tie-out with its difference, and the residual (zero).
- The method in three lines, not a tour.
- Caveats, and what result would change the conclusion.
- The next checks, if the confidence is below high.
- The artifact path and the command to re-run it.

Apply the **unslop** skill to the reply before you send it.

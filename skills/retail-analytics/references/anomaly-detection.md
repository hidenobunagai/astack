# Anomaly detection on KPIs

Use to flag unusual movements in sales, traffic, basket size, member share, or data-feed volume across stores, categories, and days. Explaining a flagged move is the **metric-investigation** playbook. This reference is for finding it.

## Baseline first

An anomaly is a deviation from what was expected, so build the expectation:

- Remove weekly and yearly seasonality and holiday effects. STL decomposition in `statsmodels` works for daily series with a stable weekly cycle. Add a holiday calendar.
- Compare with the same weekday last week and last year, adjusted for the trend, as a simple baseline.
- For many series, use a forecast model from `references/forecasting.md` and flag large forecast errors.

Score the residual with a robust spread (median and median absolute deviation), not the mean and standard deviation, because past anomalies inflate the standard deviation and hide new ones.

## Many series, many alarms

With hundreds of stores times categories checked daily, a 1% false alarm rate means many alarms every day. Teams stop reading them.

- Set thresholds from a target number of alerts per day, then check that past known incidents would have been caught.
- Check the total first, then drill down. A store-level alert that does not move any total may not matter.
- Require persistence (two days in a row) or size (a minimum yen amount) for low-volume series.
- Separate data problems (a missing feed, a duplicated file, a store with zero receipts) from business moves. Data checks come first, as in the **data-quality-check** playbook.

## Validation

Collect past incidents (data outages, system changes, real business shocks) and backtest: how many were flagged, how many days late, and how many alerts fired in normal weeks. Plant spikes, dips, and level shifts of known size in synthetic series with realistic seasonality, and report the detection rate by size.

## Report

The detection rate on past incidents, the alert volume per day, and the threshold rule. For each alert, the expected value, the observed value, and the gap in yen or percent.

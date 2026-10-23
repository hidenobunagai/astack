# Forecasting and prediction

Use for demand, sales, traffic, and staffing forecasts, and for customer-level predictions such as churn or next purchase.

## Fix the forecast problem

- **Target and grain.** Product-store-day, store-week, category-month. Forecast at the grain the decision uses (ordering is per product per store, budgeting is per store per month).
- **Horizon and lead time.** How far ahead, and when the forecast must be ready. Features must be known at forecast time. Next week's promotion plan is known, next week's weather is not.
- **Error measure.** Choose one that matches the cost. MAE or WAPE for totals, a quantile loss when stockouts and waste have different costs. MAPE breaks on low or zero sales, so do not use it for item-level forecasts.

## Validate with time

Never use a random train and test split. Use a rolling-origin backtest: fit on data up to a cutoff, forecast the horizon, move the cutoff forward, and repeat over at least several cutoffs that include different seasons. For customer-level predictions, use a reference date: features from before it, the outcome from after it, and test on a later reference date.

Compare every model with naive baselines on the same backtest:

- Same period last week, and the same period last year adjusted for the trend.
- A moving average of recent periods.

A model that does not beat the seasonal naive baseline by a margin that matters is not worth its cost.

## Methods

| Situation | Method |
| --- | --- |
| A few aggregate series with clear seasonality | Exponential smoothing (ETS) or SARIMA from `statsmodels` |
| Many series (items by stores) with shared patterns | One gradient boosting model across series with lag, calendar, price, and promotion features |
| Many intermittent series (slow movers with many zero days) | Croston-type methods, or forecast at a higher level and split down by share |
| Hierarchy (item to category to total) | Forecast each level and reconcile so they add up |

## Leakage checks

- No feature uses data from after the forecast origin, including rolling means computed over the whole series and target encodings computed on all rows.
- Calendar features for holidays and paydays come from a calendar, not from the sales data.
- Stockout days are low sales because there was nothing to sell, not low demand. Flag them and exclude them from training or treat them as censored.
- New stores and new items have no history. Test them separately.

## Report

The backtest error per cutoff against each baseline, the error by segment (top sellers versus slow movers, old versus new stores), and the forecast interval coverage. Feature importance shows what the model uses, not what causes sales.

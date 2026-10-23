# Customer base: cohorts, churn, and lifetime value

Use for retention, repeat purchase, churn, and lifetime value (CLV) of members.

## Define churn first

Retail is non-contractual: customers do not cancel, they stop coming. Churn needs a definition, such as "no purchase in the 90 days after the reference date". Choose the window from the distribution of gaps between visits (for example, a window longer than the 90th percentile gap for active customers) and state it. Results depend heavily on this window.

## Cohorts

Group members by first purchase month (or by acquisition channel or first store), and track the share active and spend per original member in each later month. Report curves per cohort, not one blended curve, because the cohort mix changes over time. Watch for definition changes: a new card program or a point campaign can create a cohort of members who joined for the points.

## Churn prediction

This is a prediction task. Follow `references/forecasting.md` for validation: a reference date, features only from before it, the outcome from after it, and a test on a later reference date. Report precision and recall at the targeting capacity (the number of customers the retention team can contact), and compare with a rule baseline such as recency alone. Recency often does most of the work.

Predicting who will churn is not the same as knowing who a retention offer will save. For that, test the offer as an experiment (`references/experiment.md`) and model the uplift.

## Lifetime value

| Method | Use when |
| --- | --- |
| Historical average by segment or cohort | Enough history, a stable business, and a decision that needs a rough value |
| BG/NBD for purchase count with Gamma-Gamma for spend per purchase | Repeat-purchase business with irregular visits, and a need for per-customer forecasts |
| A regression or gradient boosting model on pre-period features | Rich features and a need for accuracy over interpretability, validated as a forecast |

BG/NBD and Gamma-Gamma need recency, frequency, and the customer's age in the window, computed at the customer grain. Gamma-Gamma assumes spend per purchase is independent of purchase frequency. Check the correlation and report it. The `lifetimes` package is no longer maintained. Prefer the CLV module in PyMC-Marketing.

Validate a CLV model on a holdout period: predicted versus actual purchases and spend per customer, by decile of prediction.

## Synthetic data to plant

Customers with individual purchase rates drawn from a gamma distribution, a dropout process, and skewed spend per purchase. Check that BG/NBD recovers the planted rates and that the churn rule labels the planted dropouts.

## Report

The churn definition and why, cohort curves, the holdout accuracy against the baseline, and CLV by segment with its uncertainty.

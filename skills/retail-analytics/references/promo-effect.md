# Promotion and campaign effects from observational data

Use when a promotion, coupon, mailing, app campaign, or store change ran without random assignment, and the decision needs its effect.

## The trap

Who got or used the treatment was not random. Coupon users already buy more, campaign targets were picked for high response, and stores chosen for a pilot are often the best ones. Comparing treated with untreated measures who they are, not what the treatment did. Never report a raw treated-versus-untreated difference as an effect.

Separate offer from use. Receiving a coupon can be close to random in some campaigns, while redeeming it is always self-selected. Estimate the effect of being offered (intention to treat) unless the design supports more.

## Methods

| Design available | Method | Key assumption and its check |
| --- | --- | --- |
| Treated and untreated stores or customers, with a pre-period | Difference-in-differences (DiD), with unit and period fixed effects | Parallel trends. Plot and test pre-period trends, and run a placebo with a fake start date in the pre-period. |
| Few treated stores, many candidate controls | Synthetic control: non-negative weights on control stores that match the treated store's pre-period | Good pre-period fit. Report pre-period error, and run placebos that treat each control store as if treated. |
| Customer-level treatment with rich pre-period behavior | Propensity score matching or inverse probability weighting on pre-period RFM, category mix, and store | No unmeasured confounding, and overlap. Report standardized mean differences after weighting (below 0.1) and the propensity score range of both groups. |
| A sharp eligibility rule (spend above a threshold gets a coupon) | Regression discontinuity around the threshold | No manipulation at the threshold. Check the density of the running variable, and that pre-period covariates are smooth across it. |
| No untreated units: a chain-wide launch, price change, or campaign | Interrupted time series (segmented regression on the pre-period trend and seasonality), or a structural time-series counterfactual built on series the treatment did not touch (CausalImpact style) | The pre-period model forecasts well: backtest it on a fake start date in the pre-period. The control series (weather, a region or category outside the campaign, a competitor index) are not affected by the treatment. Nothing else changed at the same time. |
| Staggered rollout across stores | DiD estimators built for staggered timing (group-time effects), not one two-way fixed-effects regression | The same as DiD, per rollout group. Two-way fixed effects with staggered timing can give the wrong sign. |

`statsmodels` covers DiD with fixed effects and cluster-robust errors, propensity models, and weighting. Synthetic control weights are a constrained least squares fit with `scipy.optimize`. Segmented regression and structural time-series models (`UnobservedComponents` with regressors) are in `statsmodels`.

Without a control group, the estimate rests entirely on the claim that the pre-period pattern would have continued. Treat it as weaker evidence than a design with controls, list every other change in the same window (price changes, competitor openings, weather, holidays), and say so in the report.

## Retail effects to separate

- **Pull-forward.** Customers buy earlier, not more. Extend the outcome window past the promotion and look for a dip.
- **Cannibalization.** Sales of the promoted item rise while substitutes in the same category fall. Measure the effect on the category, not only the item.
- **Halo.** Other categories rise because the visit happened. Measure the effect on the whole basket or customer spend.
- **Store traffic versus basket.** Split the effect into visits and spend per visit.
- **Margin.** A sales lift at a discount can lose money. Report gross profit when the decision is about profit.

## Trade promotions

Manufacturer-funded promotions (temporary price reductions, end-cap displays, flyer features) are evaluated at the product-store-week grain.

- **Baseline.** The sales the item would have had without the promotion. Estimate it from non-promoted weeks with seasonality, price, and store effects, not from the week before. Weeks next to a promotion are not clean baseline weeks because of pull-forward and stockpiling.
- **Lift decomposition.** Split the promotional sales into baseline, incremental sales from new buyers and extra volume, pull-forward from later weeks, switching from competitor brands, and cannibalization of the manufacturer's own items. Each owner counts a different part as gain.
- **Confounded levers.** Price cuts, displays, and flyer features usually run together. Estimate their effects separately only where the data has weeks with one lever without the others. Otherwise report the combined effect.
- **Return on spend.** Incremental gross profit (for the manufacturer, at its own margin) divided by the trade spend. A promotion with high lift can still lose money.

## Inference

Cluster standard errors at the unit of assignment, usually the store or the customer. With fewer than about 30 treated clusters, cluster-robust errors are too small. Use a wild cluster bootstrap instead. With only a handful of treated stores, as in a typical pilot of one to five stores, the bootstrap fails too. Use only placebo or randomization inference, such as the synthetic-control placebo across control stores.

## Synthetic data to plant

Heavy buyers more likely to be treated. A pre-period trend difference in one variant, to check that the pre-trend check catches it. A post-period dip for pull-forward. Store-level noise and seasonality. The naive comparison should fail recovery and the chosen method should pass.

## Report

The estimated effect per treated unit and in total, with its interval, net of pull-forward and cannibalization when measured. The pre-trend or balance check results. What the estimate does not cover, such as customers outside the overlap region.

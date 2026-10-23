---
name: retail-analytics
description: "Pick and run the right statistical method for a retail or ID-POS question: A/B and store tests, promotion or campaign effects from observational data, chain-wide changes with no control group, uplift targeting, customer segmentation, cohorts, time to repurchase, churn and lifetime value, surveys and conjoint, explanatory regression and store rankings, demand and sales forecasting, KPI anomaly detection, marketing mix modeling, trade areas and new stores, price elasticity, assortment, basket analysis, and manufacturer marketing on retail data: brand share and switching, new-product trial and repeat, trade promotions, and retail media. Use when a retail analysis needs a test, an effect estimate, a model, a forecast, or segments, or when the user asks which method fits."
---

# Retail analytics

Route a retail question to a method family, fix the quantity, check the method on synthetic data, hand the real run to the human, and report the result with its uncertainty. The rules in the Human runs the data section of the **analyst-mode** skill apply to every step.

## Step 0, Whose decision

The same data answers different questions for a retailer and a manufacturer, and the analysis may serve either. Name the decision owner before anything else.

- **Retailer.** Cares about the category and the store: category sales and margin, store traffic, basket size, customer retention. A brand gaining share from another brand in the same category is neutral or negative for the retailer.
- **Manufacturer.** Cares about its brands across retailers: brand share, buyers gained from competitors, new-product success, the return on trade and media spend. A lift taken from its own other products is not a gain.
- **Both.** For joint business plans and category proposals, report the result twice: the effect on the brand and the effect on the category. Say where they conflict.

The owner also sets what the output may show. Read the external sharing section in `references/id-pos-grain.md` before any output leaves the team.

## Step 1, Explain or predict

Decide this first. It changes the method and the validation.

- **Explain.** The decision needs to know what a lever did or how much a factor matters: a promotion's lift, a price effect, a segment difference. The output is an effect with a confidence interval. Validation is the planted-truth check in the **principle-simulate-the-method** skill.
- **Predict.** The decision needs a number for the future or for unseen customers: next month's demand, who will churn. The output is a forecast with an error measure. Validation is a holdout that respects time, compared with a naive baseline. A model that predicts well does not show that any one feature causes the outcome.
- **Describe.** The decision needs a structure: segments, cohorts, baskets. Validation is stability and a check on data with no structure.

If the user wants both, split the work into two analyses with separate validations.

## Step 2, Pick the family

| Question | Reference |
| --- | --- |
| A test we can still design or have just run, with random assignment | `references/experiment.md` |
| The effect of a promotion, coupon, campaign, or store change that was not randomized, including chain-wide changes with no control group | `references/promo-effect.md` |
| Who to target: the customers an offer changes, not the likely buyers | `references/uplift.md` |
| Customer segments, personas, or clusters | `references/segmentation.md` |
| Retention by cohort, time to next purchase, churn, or lifetime value | `references/customer-base.md` |
| Survey responses, satisfaction, conjoint, brand maps, or survey answers joined to purchases | `references/survey.md` |
| How much each factor is associated with an outcome, with control variables, or a ranking of stores or items | `references/regression.md` |
| A forecast of demand, sales, or traffic | `references/forecasting.md` |
| Finding unusual moves in KPIs across stores and categories | `references/anomaly-detection.md` |
| Splitting a media budget across flyers, TV, and digital | `references/mmm.md` |
| Trade areas, new-store forecasts, the effect of a new store on nearby stores, store benchmarking | `references/store-area.md` |
| Price elasticity, markdowns, assortment cuts, product affinity, or cross-selling | `references/price-basket.md` |
| Brand share, buyer penetration and frequency, brand switching, loyalty, or the structure of a category | `references/brand-category.md` |
| A new product's trial, repeat, long-run share, and where its sales came from | `references/new-product.md` |
| A manufacturer-funded promotion: baseline, lift, and return on trade spend | `references/promo-effect.md` |
| Ads on retailer channels (app, site, signage, receipt coupons) and their incremental sales | `references/retail-media.md` |

Read `references/id-pos-grain.md` for every family. Most wrong retail numbers come from mixing the line, receipt, customer, and store-day grains, or from an unstated sales definition.

A simple comparison of two or more groups with no causal claim (spend of members versus non-members, satisfaction by region) does not need a family. Compare means with Welch's t-test, or use a bootstrap interval when spend is skewed. Compare proportions with a difference in proportions and its interval, or a chi-squared test for a table. Report the difference with its interval and the group sizes, and call it a difference between groups, not an effect.

When no family fits, say so in the plan. Go on with the **principle-name-the-estimand** and **principle-simulate-the-method** skills alone, name the method and the reason, and list its assumptions with their checks.

When a question fits two families, read both. For example, "did the loyalty program raise spend for heavy buyers" is a promotion effect within a segment.

## Step 3, Fix the quantity and the method

Load the **principle-define-the-question** and **principle-name-the-estimand** skills. Write the decision, the estimand or forecast target, the unit of assignment, the comparison, and two candidate methods from the family reference with their assumptions. Pick one. State the smallest effect or error that would change the decision.

## Step 4, Check the method on synthetic data

Load the **principle-simulate-the-method** skill. Build synthetic ID-POS data with the problems the family reference lists, plant a truth, and run the checks. For a forecast, use the backtest in `references/forecasting.md` instead. Fix the method or the design until the checks pass. Do not loosen the thresholds.

## Step 5, Run request

Write one script that runs the method on real data and prints aggregates, diagnostics, and `PASS`/`FAIL` lines for each assumption check named in the family reference. It never prints customer rows or IDs. Hand it over as a run request.

## Step 6, Report

From the pasted output, report in the decision's units: the effect with its confidence interval, or the forecast with its error against the baseline, or the segments with their sizes and stability. Then list the assumption checks and their results, the limits (who is not covered, what could not be tested), and the next step for the decision. Use the **findings-report** playbook for a written report. Use the **interrogate** skill before the result drives a decision with real money behind it.

You skipped this when a method was chosen before the explain-or-predict call, when the grain or the sales definition was not stated, or when a real run happened before a synthetic check.

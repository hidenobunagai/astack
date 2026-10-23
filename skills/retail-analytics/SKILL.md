---
name: retail-analytics
description: "Pick and run the right statistical method for a retail or ID-POS question: A/B and store tests, promotion or campaign effects from observational data, customer segmentation, cohorts, churn and lifetime value, surveys, explanatory regression, demand and sales forecasting, price elasticity, and basket analysis. Use when a retail analysis needs a test, an effect estimate, a model, a forecast, or segments, or when the user asks which method fits."
---

# Retail analytics

Route a retail question to a method family, fix the quantity, check the method on synthetic data, hand the real run to the human, and report the result with its uncertainty. The rules in the Human runs the data section of the **analyst-mode** skill apply to every step.

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
| The effect of a promotion, coupon, campaign, or store change that was not randomized | `references/promo-effect.md` |
| Customer segments, personas, or clusters | `references/segmentation.md` |
| Retention by cohort, churn, repeat purchase, or lifetime value | `references/customer-base.md` |
| Survey responses, satisfaction, or survey answers joined to purchases | `references/survey.md` |
| How much each factor is associated with an outcome, with control variables | `references/regression.md` |
| A forecast of demand, sales, or traffic | `references/forecasting.md` |
| Price elasticity, markdowns, product affinity, or cross-selling | `references/price-basket.md` |

Read `references/id-pos-grain.md` for every family. Most wrong retail numbers come from mixing the line, receipt, customer, and store-day grains, or from an unstated sales definition.

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

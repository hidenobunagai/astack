---
name: principle-name-the-estimand
description: "Apply before any statistical test, effect estimate, confidence interval, regression, or clustering: A/B tests, promotion or campaign effects, customer segments, churn or lifetime value. Name the estimand, the unit, the comparison, and the assumptions the method needs, pick the method from them, and report an effect size with its uncertainty instead of a bare p-value."
---

# Name the Estimand

A method answers a precise question. If the question is vague, the method answers some other question and the number still looks fine. Write the estimand first, then let it pick the method.

Extend the **principle-define-the-question** block with these lines before you write the analysis code:

- **Estimand.** The exact quantity, in one sentence. "The mean 4-week spend per member who received the coupon, minus what the same members would have spent without it" is an estimand (the ATT). "Coupon effect" is not. Say whether it is a difference or a ratio, a mean or a median or a share, and for whom: everyone (ATE), the treated (ATT), or the people who complied.
- **Unit of analysis and unit of assignment.** What one observation is (a member, a receipt, a store-week), and what was assigned to treatment (a member, a store, a region). When the assignment unit is larger than the analysis unit, the effective sample size is the number of assignment units. Analyze at that level or use cluster-robust errors.
- **Comparison.** What the treated group is compared with, and why that group shows what would have happened otherwise. For observational data, name the confounders: who chose or was chosen for treatment, and what else drives the outcome.
- **Outcome distribution.** Continuous, binary, count, or time to event. Retail spend is skewed with heavy tails and many zeros. Decide the handling (log, winsorizing at a stated percentile, a two-part model, a bootstrap) before you see the result.
- **Method and its assumptions.** Name two candidate methods with their tradeoffs, pick one, and list the assumptions it needs, each with the check that tests it. Examples: parallel pre-trends for difference-in-differences, covariate balance and overlap for propensity scores, sample ratio match for an A/B test, independence across units for a t-test.
- **Analysis count.** Every test or model fit you run counts, including the ones you drop. Log them with the **show-me-your-work** skill. Name one primary metric. Correct secondary metrics for multiple comparisons (Holm, or Benjamini-Hochberg for many segments), or label them exploratory.

## Report

Report each result as an effect size with a confidence interval, in the units the decision uses (yen per member, points of repeat rate). Add the p-value only next to the interval. Then state what the result does not show: the population it does not cover, the assumption that failed or could not be tested, and the effect size the study could not have detected. A non-significant result with a wide interval is "we cannot tell", not "no effect".

Check the method on synthetic data with a planted truth before the human runs it on real data. See the **principle-simulate-the-method** skill.

Use `scipy` and `statsmodels` first. Add a specialized library only when they do not cover the method.

You skipped this when a result is a p-value or "significant" with no effect size and interval, when the unit of assignment is unstated, or when the method was picked before the estimand was written.

Distinct from **principle-define-the-question**, which fixes the decision and the metric. This skill fixes the quantity and the method that estimates it.

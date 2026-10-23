# Experiments: A/B and store tests

Use when assignment to treatment is random: a coupon split by member, an app test, or a store test with randomized stores.

## Design before launch

- **Unit of assignment.** Member, receipt, store, or region. Customers who visit several stores make store tests leak. Note the share of customers who shop at both treated and control stores.
- **Primary metric.** One metric, fixed before launch, in the decision's units. Add guardrail metrics (margin, returns, complaints) that must not get worse.
- **Sample size.** Compute power for the smallest effect worth acting on, at the unit of assignment. For a store test, the number of stores is the sample size. With few stores, pair or stratify them on pre-period sales and region before randomizing.
- **Duration.** Cover at least one full weekly cycle, and avoid holiday periods unless the decision is about them. Fix the end date before launch.
- **Variance reduction.** Use pre-period spend as a covariate (CUPED, or regression adjustment). The variance falls by a factor of 1 minus rho squared, where rho is the correlation between pre-period and test-period outcomes. Spend is persistent in retail, so rho is often high. Compute rho from the pre-period in the synthetic check or the run request, and size the test with it.

## Checks after the test

- **Sample ratio mismatch.** The observed split matches the planned split. Test with a chi-squared test. A mismatch means the assignment or the logging is broken, and the result cannot be trusted until the cause is found.
- **Pre-period balance.** The groups had the same pre-period spend and visits.
- **Exposure.** How many treated units actually received the treatment. Report the effect of being assigned (intention to treat) as the main result.

## Analysis

| Outcome | Method |
| --- | --- |
| Mean spend or visits per member | Regression of the outcome on treatment and pre-period outcome, with robust errors. Bootstrap the interval when the tail is heavy. |
| Conversion or repeat rate | Difference in proportions, or logistic regression with pre-period covariates. |
| Store-level sales | Regression at the store level with the pre-period as a covariate, or a randomization test when stores are few. |
| Ratio metric (spend per visit) | Delta method or bootstrap at the unit of assignment. Never treat visits as independent units when members were assigned. |

Do not look at the result repeatedly and stop when it is significant. If interim looks are needed, plan them with a sequential method (alpha spending) before launch.

## Synthetic data to plant

Skewed spend with many zeros, member-level persistence across periods (so CUPED has something to work with), and store clustering when the design assigns stores. Check the false-positive rate under no effect at the planned sample size, and the power at the smallest effect worth acting on.

## Report

The effect with its interval, the sample ratio check, the balance check, guardrail results, and the minimum detectable effect the test had.

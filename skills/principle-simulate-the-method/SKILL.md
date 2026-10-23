---
name: principle-simulate-the-method
description: "Apply before a statistical method runs on real data: a test, an effect estimate (A/B, difference-in-differences, propensity scores), a regression, a clustering, or a churn or lifetime-value model. Build synthetic data with a known truth, and check that the method recovers it, keeps its false-positive rate, and covers the truth with its intervals."
---

# Simulate the Method

Real data never tells you the true effect, so a run on real data cannot show that the method works. Synthetic data can, because you planted the answer. You already build synthetic data from the schema before every run request. Plant a truth in it and grade the method against that truth.

## The four checks

Write one script that generates the data, runs the method, and prints the checks as `PASS`/`FAIL` lines. Fix the seed, and loop over at least 200 simulated datasets for the rate checks.

1. **Recovery.** Plant an effect of a realistic size, such as a 3% spend lift. The mean estimate across runs lands near it. A large gap is bias, and real data will have it too.
2. **Null.** Plant no effect. The method calls a result significant in about 5% of runs at alpha 0.05. Far more means the errors are too small, often because the unit of assignment was ignored.
3. **Coverage.** The 95% interval contains the planted value in about 95% of runs. Allow some spread: with 200 runs, 92% to 98% is consistent with 95%.
4. **Power.** At the real sample size, how often does the method detect the planted effect? This is the smallest effect the study can see. State it in the plan, before the human runs the real analysis.

## Make the simulation as hard as the data

A simulation that is easier than the real data passes every method. Plant the problems the real data has:

- Skewed spend with heavy tails and many zero weeks, such as a lognormal amount times a purchase indicator.
- Clustering by store or region, with treatment assigned by cluster when the real design does that.
- Confounding for observational designs: heavy buyers more likely to be treated. A naive comparison should fail recovery, and the chosen method should pass it.
- Seasonality and a pre-period trend for time designs, and a pre-trend violation to check that the pre-trend check catches it.

## Clustering and segmentation

There is no single planted effect, so plant structure instead:

- **Planted segments.** Generate customers from known segments, then check that the method recovers them. Report the adjusted Rand index against the planted labels.
- **No structure.** Generate customers from one population with realistic skew and correlation. If the method still returns clean, well-separated segments, its output on real data proves nothing on its own.
- **Stability.** Refit on bootstrap resamples and report how often pairs of customers stay together. A segment that dissolves under resampling is not a segment.

## Hand-off

The simulation results go into the plan and the run request: the planted values, the four checks, and the minimum detectable effect. When a check fails, change the method or the design, not the threshold. Do not run the real analysis until the method passes on data at least as hard as the real data.

You skipped this when a method runs on real data without a run on planted data, when the false-positive rate was never checked, or when nobody can state the smallest effect the study could detect.

Distinct from **principle-prove-it-works**, which checks that the real output exists and is what it claims. This skill checks that the method can find the truth at all.

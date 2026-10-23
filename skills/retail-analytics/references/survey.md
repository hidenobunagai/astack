# Surveys

Use for customer satisfaction, brand, and attitude surveys, and for survey answers joined to purchase data.

## Who answered

Respondents are not the customer base. Loyal and heavy buyers answer more, and online surveys miss customers who do not use the app. Compare respondents with the invited population on the purchase data (recency, frequency, spend, store, age band) and report the gaps. This is the main advantage of ID-POS: you can measure the nonresponse bias that most surveys can only guess.

When the gaps matter, weight respondents to match the population on those variables. Raking (iterative proportional fitting) on a few variables takes a few lines of `numpy`. Trim extreme weights and report the effective sample size after weighting. Report both weighted and unweighted results when they differ.

## Scales

- Likert items (1 to 5) are ordinal. Report the distribution and the top-two-box share. A mean is acceptable for a quick comparison but say so, and use ordinal logistic regression when modeling.
- A multi-item scale needs a reliability check: Cronbach's alpha (above about 0.7) and the item-total correlations. Drop items that do not fit before summing.
- Exploratory factor analysis groups many items into a few factors. Check that the factors are stable on a split half.
- Net Promoter Score is a difference of two shares. Its interval is wide. Compute it with the bootstrap, and do not compare NPS between small groups without the intervals.

## Free text

Free text is raw rows and often holds personal data, so you never read it. Write a codebook and a coding script. The human runs the script, hand-codes a random sample with the same codebook, and pastes back only the share per code and the agreement rate between the script and the hand coding.

## Joining to purchase data

Join on member ID at the customer grain. Report the match rate. Use purchases from before the survey as covariates and purchases after it as outcomes. Satisfaction and spend are associated, but the survey alone cannot show that raising satisfaction raises spend. State that limit.

## Driver analysis

"Which factor drives overall satisfaction" is usually a regression of the overall score on item scores. The items are correlated, so coefficients are unstable. Report relative importance (dominance analysis or Shapley decomposition of R squared) instead of raw coefficients, and call it association.

## Synthetic data to plant

A population with purchase behavior, a response probability that rises with frequency, and answers that depend on a known latent satisfaction. Check that weighting recovers the planted population mean and that the unweighted mean is biased.

## Report

The response rate, the respondent-versus-population comparison, weighted results with intervals, scale reliability, and what the survey cannot say about cause.

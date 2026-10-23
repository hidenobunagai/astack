# Explanatory regression

Use when the decision needs to know how strongly factors are associated with an outcome, holding others fixed: store performance drivers, the spend gap between segments after controlling for region, the relation between assortment and sales.

A coefficient is an association. It is a causal effect only when the design supports it, as in `references/promo-effect.md` or `references/experiment.md`. Say which one it is in the report.

## Choose the model from the outcome

| Outcome | Model |
| --- | --- |
| Continuous, roughly symmetric | Linear regression (OLS) with robust errors |
| Spend: positive and skewed | Log-linear OLS, or a gamma GLM with log link. Coefficients read as percent differences. |
| Spend with many zeros | A two-part model: logistic for any purchase, then a gamma GLM on the positive spend. Or a Tweedie GLM. |
| Binary (bought, churned) | Logistic regression. Report average marginal effects in percentage points, not odds ratios alone. |
| Count (visits, items) | Poisson with robust errors, or negative binomial when overdispersed |
| Ordinal (satisfaction 1 to 5) | Ordinal logistic regression |

`statsmodels` covers all of these.

## Structure in retail data

- **Nesting.** Customers within stores, stores within regions, repeated weeks per store. Use cluster-robust errors at the top level that matters, or a mixed model with random intercepts for stores. Ignoring nesting makes intervals too narrow.
- **Fixed effects.** Store and week fixed effects remove level differences and common shocks. Then the coefficients come only from changes within a store.
- **Interactions.** Add an interaction only for a question you named before fitting, such as "does the effect differ between urban and suburban stores".

## Diagnostics as run-request checks

Print these as aggregates, never rows:

- Residuals against fitted values, binned, to spot nonlinearity.
- Variance inflation factors. Above about 10, the coefficients of those variables cannot be separated. Drop or combine them.
- For count models, the dispersion ratio. Above about 1.5, use negative binomial or robust errors.
- Influence: the number of observations with Cook's distance above 4/n, and whether the main coefficient changes when they are dropped.
- The number of rows dropped for missing values, by variable.

## Pitfalls

- Controlling for a variable that the factor of interest itself changes (a mediator, such as visits when studying a loyalty program's effect on spend) removes part of the effect.
- Many candidate controls and specifications create forking paths. Fix the specification in the plan and report the others as robustness checks.
- Standardized coefficients hide units. Report coefficients in the decision's units.

## Synthetic data to plant

Known coefficients, skewed outcomes, store-level random intercepts, and correlated predictors. Check recovery of the planted coefficients and interval coverage with the chosen error structure.

## Report

The coefficients that answer the question, in the decision's units, with intervals. Diagnostics results, robustness to other specifications, and whether each result is association or effect.

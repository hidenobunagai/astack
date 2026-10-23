# Uplift and heterogeneous effects

Use when the decision is who to target: which members get a coupon, a retention offer, or a mailing. The goal is the customers for whom the offer changes behavior, not the customers who are most likely to buy.

## The four kinds of customer

- Persuadables buy because of the offer. Target them.
- Sure things buy anyway. An offer to them costs the discount and gains nothing.
- Lost causes do not buy either way.
- Sleeping dogs buy less when contacted, for example members annoyed by mailings.

A response model ranks sure things at the top. That is why targeting by predicted purchase probability often wastes most of the budget.

## Data

Uplift needs random assignment, or at least a design that supports an effect estimate. Train on a past randomized campaign with a holdout group, as in `references/experiment.md`. Without one, run a test with a random holdout first. Observational uplift inherits every confounding problem in `references/promo-effect.md`.

## Methods

| Method | How it works | Use when |
| --- | --- | --- |
| Two models (T-learner) | Fit one outcome model on treated, one on control, take the difference | A simple baseline. Noisy when one group is small. |
| X-learner or DR-learner | Model the effect directly with corrections across groups | Unequal group sizes, or a need for better accuracy |
| Causal forest | Splits customers into groups with different effects, with intervals | A need for intervals on segment-level effects |
| Segment-level effects | Estimate the effect within a few pre-defined segments (RFM tiers) | Small samples, or a need to explain the targeting rule |

Two models need only `scikit-learn`. The `econml` and `causalml` packages implement the others.

## Validation

You cannot see one customer's uplift, so validate on groups. On a held-out part of the test, rank customers by predicted uplift, and plot the cumulative incremental response (a Qini or uplift curve) against random targeting. Report the incremental sales and the profit at the targeting capacity the campaign has. Check the ranking on a later campaign before rolling it out.

Effect differences across many segments create forking paths. Name the segments before looking, or confirm the differences on held-out data.

## Synthetic data to plant

All four kinds of customer, with the sure things also the most likely to buy. Check that the response model ranks them first, and that the uplift method ranks persuadables first and recovers the planted effect per kind.

## Report

The uplift curve against random targeting, the incremental profit at the planned capacity, and the targeting rule in terms a campaign team can apply.

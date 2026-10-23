# Marketing mix modeling

Use when the decision is how to split a media budget across flyers, TV, digital ads, and app notifications, and the data is aggregate sales over time.

## Shape

Model weekly sales (by region if the media varies by region) as baseline plus seasonality plus price and promotion effects plus a contribution from each channel. Each channel's contribution has two transforms:

- **Adstock.** Spend this week affects sales in later weeks with a decay. A flyer's effect lasts days, TV's can last weeks.
- **Saturation.** Each extra yen buys less. Fit a curve (Hill or logistic) per channel, so the model can say where the next yen should go.

## Methods

A Bayesian MMM is the practical default, because with two or three years of weekly data there are few observations for many parameters. Priors on decay and saturation keep the estimates sensible. PyMC-Marketing has an MMM module with adstock and saturation built in. A regression with fixed decay rates chosen by a grid search is the lightweight alternative.

## Pitfalls

- **Spend follows demand.** Budgets rise in strong seasons, so spend and sales move together even without an effect. Include seasonality and holidays, and treat channel results that line up with the budget calendar with suspicion.
- **Collinear channels.** Channels launched together cannot be separated. The posterior will be wide, and the model may move credit between them across runs. Report it, and plan a test that varies one channel alone.
- **Too few data points.** About 100 to 150 weeks for a handful of channels is the usual minimum. Regional data multiplies the observations.
- **Calibration.** Where a geo test or holdout test of a channel exists, use its result as a prior or a check. An MMM that disagrees with a clean test is wrong about that channel.

## Validation

- A time holdout: fit on all but the last 10 to 20 weeks and forecast them, compared with a baseline without media.
- Parameter recovery on synthetic data with planted decay, saturation, and contributions, including spend that follows seasonal demand.
- Stability: refit with a few weeks removed at the end, and check that the channel ranking holds.

## Report

The contribution and return on spend per channel, with intervals. The saturation curves and the current spend point on each. A budget reallocation scenario with its uncertainty, and the channels the data cannot separate.

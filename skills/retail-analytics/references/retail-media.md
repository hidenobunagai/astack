# Retail media

Use for ads a manufacturer buys on the retailer's channels: app banners and push notifications, the online store, in-store signage, and receipt coupons, measured against ID-POS purchases.

## The trap

Customers who see an ad are not like those who do not. App users visit more often, ads target past buyers, and signage reaches people already in the store. Comparing exposed with unexposed buyers, or reporting sales from exposed customers, measures the audience. Report incremental sales, not attributed sales.

Last-touch attribution (a purchase after an exposure counts as caused by it) credits the ad with purchases that would have happened anyway. Attributed return on ad spend is not incremental return on ad spend, and the gap is often several times.

## Methods

| Design | Method | Check |
| --- | --- | --- |
| A random holdout of the target audience that is eligible but not shown the ad | Compare the full exposed-eligible group with the holdout (intention to treat), as in `references/experiment.md` | Sample ratio, pre-period balance |
| Ghost ads: the ad server logs who would have been shown the ad in the holdout | Compare the would-be-exposed in the holdout with the actually exposed | The logging of would-be exposure is the same in both groups |
| Signage or in-store media in some stores | A store-level test with matched or randomized stores, or difference-in-differences as in `references/promo-effect.md` | Enough stores, pre-trends |
| No holdout | Matching on pre-period behavior and app activity, as in `references/promo-effect.md` | Treat the result as weak, and recommend a holdout for the next campaign |

Build the holdout into every campaign. It is cheap, and without it the effect cannot be measured.

## Measures

- Incremental sales and incremental buyers per exposed customer, with intervals.
- Incremental return on ad spend: incremental gross profit (or sales, stated) divided by the ad cost.
- New-to-brand share among incremental buyers, which manufacturers value most.
- Effects on the category, for the retailer: a brand ad that only moves buyers between brands adds media revenue but no category sales.
- Long windows: measure for some weeks after the campaign, to catch pull-forward and lasting effects.

## Synthetic data to plant

Targeting toward past buyers, exposure that rises with app activity, and a small planted effect. The attributed measure should overstate the planted effect, and the holdout comparison should recover it.

## Report

Incremental sales and return on spend with intervals, the attributed figure next to it with the gap explained, new-to-brand buyers, and the category effect. Apply the external sharing rules in `references/id-pos-grain.md` before the report goes to the manufacturer.

# New product evaluation

Use for a new item's early performance, its long-run share, and where its sales came from.

## Trial and repeat

Track by weeks since launch, not by calendar week:

- **Cumulative trial.** The share of category buyers who have bought the item at least once.
- **Repeat.** Among triers, the share who bought again, and the share of their category purchases that went to the item after the trial.
- **Depth of repeat.** Second, third, and later repeat rates. A product with high trial and low repeat is selling curiosity.

Repeat needs time to happen. A trier from last week has not had a chance to repeat yet. Measure repeat within a fixed window after each customer's trial (such as 8 weeks), and include only triers whose window has ended. Or use the survival methods in `references/customer-base.md`, treating recent triers as censored.

## Long-run share

The Parfitt-Collins estimate: long-run share = cumulative trial (where it levels off) × repeat share among triers × buying-rate index (triers' category purchase rate relative to the average buyer). Early triers are often heavy category buyers, so the buying-rate index is above 1 early on and the estimate falls over time. Report the estimate by week since launch with a range, and stop calling it a forecast until trial has levelled off.

## Distribution

A new item's sales grow as more stores carry it. Separate the growth in stores carrying it from the growth in sales per carrying store. Compare trial rates only between stores that carried the item for the same number of weeks.

## Source of volume

Split the item's sales into buyers new to the category, sales taken from competitor brands, and sales taken from the manufacturer's own items, using the switching method in `references/brand-category.md`. For the manufacturer, the net gain is the sales minus its own cannibalized sales. For the retailer, the net gain is the growth of the category.

Compare with matched buyers who did not try the item, using pre-launch category spend, to separate the item's effect from buyers who were already increasing their category spend.

## Synthetic data to plant

Launches with planted trial curves, repeat rates, heavy buyers trying first, and a staggered store rollout. Check that the repeat measure is not biased by recent triers, and that the Parfitt-Collins estimate converges to the planted share.

## Report

Trial and repeat by week since launch, the long-run share estimate with its range, sales per carrying store, and the source of volume for both the manufacturer and the retailer.

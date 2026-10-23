# Price elasticity and basket analysis

## Price elasticity

Use when the decision is a price, a markdown, or a discount depth.

**The trap.** Prices are not set at random. Markdowns happen when items are not selling, promotions happen in high-demand weeks, and competitors move at the same time. A regression of sales on price in observational data mixes all of this, and can show the wrong sign.

**Methods**

| Design | Method | Check |
| --- | --- | --- |
| A randomized price test across stores | Compare stores directly, as in `references/experiment.md` | Balance and enough stores |
| Price changes over time across many stores and items | Log-log regression of units on price with item-store and week fixed effects, controlling for promotion flags, display, and feature ads | Pre-trends around price changes, and stability across product groups |
| A price change in some stores only | Difference-in-differences, as in `references/promo-effect.md` | Parallel pre-trends |

The log-log coefficient is the elasticity: the percent change in units for a 1% change in price. Report it per category with its interval. Also estimate the cross-price effect on substitutes in the same category, because a price cut that takes sales from a sibling product grows the category less than the item.

Stockouts cap observed sales. Exclude stockout days or the elasticity is biased toward zero.

## Assortment

- **ABC analysis.** Rank items by sales or gross profit and split by cumulative share (for example, A up to 70%, B to 90%, C the rest). Compute it per store type and per period, and report how many items change class between periods. Rank on profit when the decision is about profit. An item in class C can still bring in customers who buy class A items, so check basket roles before a cut.
- **Demand transfer.** When an item is removed, some of its buyers switch to substitutes and some stop buying the category. Estimate the transfer rate from past delistings or stockouts with a before-after comparison of its buyers' category spend, against similar buyers of items that stayed. Report the share of the removed item's sales that stayed in the category.
- **Incrementality.** An item's sales are not its contribution. Its contribution is the sales that would be lost if it were removed, which is its sales times one minus the transfer rate.

## Basket analysis

Use for cross-selling, layout, bundling, and recommendation rules.

- **Grain.** The receipt. Deduplicate products within a receipt before counting. Use the customer grain instead when the question is about purchases across visits.
- **Level.** Count at the category or subcategory level first. At the item level, most pairs are too rare to say anything.
- **Measures.** Support (the share of baskets with both), confidence (the share of baskets with A that also have B), and lift (confidence divided by the share of baskets with B). Lift above 1 means the pair appears together more than chance.
- **Thresholds.** Set a minimum support so each reported pair rests on enough baskets, such as at least a few hundred. Many pairs tested at once produce high lift by chance in rare pairs. Check the top pairs on a later period before acting.
- **Confounding.** Pairs often appear together because of the store, the season, or a joint promotion. Recompute the top pairs within store type and excluding promotion weeks.

Counting pairs is a self-join on the receipt-product table in Polars, filtered by minimum support. A specialized library is not needed for pairs.

Association is not effect. A high-lift pair does not show that placing the items together raises sales. Test a layout change as an experiment.

## Synthetic data to plant

For elasticity, a known elasticity plus promotions timed to high-demand weeks. The naive regression should be biased and the fixed-effects model should recover the planted value. For baskets, a few planted pairs among many random items. The method should find the planted pairs and not report chance pairs above the support threshold.

## Report

Elasticities per category with intervals and the cross-price effects. For baskets, the top pairs with support counts, lift, and whether they held in the later period.

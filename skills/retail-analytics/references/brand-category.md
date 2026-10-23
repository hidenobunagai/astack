# Brand and category analysis

Use for brand share, buyer penetration and frequency, brand switching, loyalty, and category structure. Name the decision owner first, as Step 0 of the router describes. The same switching table means a gain for one brand and nothing for the category.

## Decompose sales

Brand sales = buyers (penetration times the member base) × purchase occasions per buyer × units per occasion × price per unit. Compute each factor for both periods, and attribute the change to each factor with a log decomposition, so the parts add up to the total change. Most brand growth comes from penetration, not frequency. Check that claim on the data instead of assuming it.

Report the decomposition for the brand and for the category side by side. A brand that grows while the category grows at the same rate gained no share.

## Switching and source of volume

- **Switching table.** For buyers of the category in both periods, cross-tabulate the main brand (largest share of their category spend) in the earlier period against the later period. Report the gains from and losses to each brand, plus buyers entering and leaving the category.
- **Volume-based source.** For a brand's growth, split the extra volume into new category buyers, buyers from each competitor, more volume from existing buyers, and the manufacturer's own other items.
- Main-brand switching depends on the period length and the share threshold. Fix them before reading the result, and check that the main conclusions hold for one other choice.

## Loyalty against a baseline

Raw loyalty measures (repeat rate, share of category requirements) are driven by brand size. Small brands have fewer buyers who also buy less often (double jeopardy). Before calling a brand's loyalty high or low, compare it with the value expected for its size:

- The NBD-Dirichlet model predicts penetration, purchase frequency, share of requirements, and duplication for each brand from the category's purchase rates and the brands' shares. Fit it with `scipy.optimize`. Brands that deviate from the prediction are the finding. Most brands fit closely.
- Duplication of purchase: the share of a brand's buyers who also bought each other brand should be roughly proportional to the other brand's penetration. Pairs well above that are closer substitutes, and form a sub-market.
- Heavy-buyer concentration: report the share of brand sales from the top 20% of buyers with the actual value. It is usually lower than the 80% that the Pareto rule suggests, and light buyers carry much of a brand's sales.

## Category structure

The customer decision tree shows which attribute customers hold fixed and which they switch across: brand first, then size, or price tier first, then brand. Estimate it from switching: attributes within which customers mostly switch define the branches. Validate on a later period. The tree informs shelf layout and assortment proposals. Add the private-label versus national-brand split as its own branch when the retailer has private labels.

## Synthetic data to plant

A category generated from an NBD-Dirichlet with known shares, plus one brand with planted excess loyalty and one pair of planted close substitutes. The method should flag exactly those, and the decomposition should recover a planted penetration change.

## Report

The sales decomposition for brand and category, the source of volume, loyalty against the Dirichlet baseline, and the sub-markets. State the period, the threshold choices, and that the data covers this retailer's members, as `references/id-pos-grain.md` describes.

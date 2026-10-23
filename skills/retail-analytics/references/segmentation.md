# Customer segmentation

Use when the decision needs groups of customers to treat differently: targeting, personas, store or assortment strategy.

## Start from the action

Name the actions the segments will drive (a campaign per segment, a different assortment, a retention offer) before choosing features. A segmentation nobody can act on is a description, not a result. If two segments would get the same action, they are one segment.

Consider rules before clustering. RFM tiers or a decision tree on a business rule are easy to explain, stable over time, and often enough. Cluster only when the structure is unknown.

## Features

- Recency, frequency, and monetary value over a fixed window, with the window stated.
- Category share of spend, time-of-day and day-of-week share, price-tier share, promotion share, store count.
- Log-transform skewed amounts and counts, then standardize. Without it, the heaviest buyers become their own clusters and the rest blur together.
- Use shares, not raw category amounts, or the clusters only separate heavy from light buyers.
- Drop features that are near duplicates. Correlated features count the same thing twice.
- Set a minimum activity rule (such as two or more visits in the window) and report how many customers it drops. Customers with one visit have no pattern to cluster.

## Methods

| Method | Use when | Watch for |
| --- | --- | --- |
| k-means on standardized features | Many customers, numeric features, roughly round groups | Sensitive to scale and outliers. Run several seeds. |
| Gaussian mixture | Groups of different spread, soft membership wanted | Pick the number of components with BIC, then check stability. |
| Hierarchical clustering on a sample | Want to see how groups split, fewer than about 20,000 customers | Ward linkage on standardized features. Assign the rest with nearest centroid. |
| Latent class analysis | Categorical features such as survey answers or category yes/no | Needs a specialized package. Check that classes are stable. |

`scikit-learn` covers k-means, mixtures, and hierarchical clustering.

## Choosing k and checking the result

Do not pick k from one index. Look at silhouette or BIC across k, then at stability and usefulness:

- **Stability.** Refit on bootstrap samples and compare labels with the adjusted Rand index. Report it per k.
- **No-structure check.** Run the same pipeline on synthetic customers drawn from one population with the same skew and correlations. If it returns similar-looking separation, the real clusters may be cuts of a continuum. Say so.
- **Time stability.** Fit on one period and assign the next. Report how many customers change segment, and whether the segment sizes hold.
- **Profiles.** For each segment, report the size, the share of sales, and the features that differ most from the overall mean, in original units.

## Synthetic data to plant

Known segments with realistic overlap and skew, plus a no-structure dataset. The method passes when it recovers the planted segments with a high adjusted Rand index and does not show strong separation on the no-structure data.

## Report

Segment sizes, sales share, profiles in plain units, stability results, and the action for each segment. Give each segment a name that describes behavior, not a persona story the data cannot support.

# ID-POS grain and definitions

Read before any query on retail transaction data. State the grain of every table in one line, and check key uniqueness and row counts before and after each join, as the **principle-respect-the-grain** skill describes.

## Grains

| Grain | One row means | Usual key | Typical use |
| --- | --- | --- | --- |
| Line | One product on one receipt | receipt ID + line number | Product sales, baskets, price |
| Receipt | One checkout | receipt ID (often with store and date) | Basket size, visit counts |
| Customer | One member | member ID | Segments, CLV, churn |
| Customer-period | One member in one week or month | member ID + period | Cohorts, panel models, A/B outcomes |
| Store-day | One store on one day | store ID + date | Forecasts, store tests, DiD |
| Product-store-day | One item in one store on one day | product + store + date | Demand forecasts, elasticity |

## Common fan-out and drops

- Joining a line table to a receipt-level table and then summing a receipt total counts that total once per line.
- Joining a product master that has several rows per product (history of category changes, several barcodes per product) multiplies lines. Pick the version valid on the sale date.
- Joining customer attributes that change over time (address, rank) without a validity window multiplies customers.
- An inner join to the member table drops non-member receipts. That is right for customer analysis and wrong for store totals.
- A calendar built from sales has no rows for days with no sales. Zero-sales days vanish from averages and forecasts. Build store-day and product-store-day tables from a full calendar crossed with the store or product list, and fill zero only where the store was open and the item was on sale.

## Definitions to fix before the first query

Fill these in once per project, in the project notes or a definitions module, and import them instead of re-writing the formula. Until a line is filled in, state the choice you made in the plan and in the run request.

- Sales amount: tax included or excluded, before or after line discounts, before or after coupon and point redemption.
- Returns and voids: dropped, netted against the original sale, or kept as negative lines.
- Non-member receipts: excluded from customer analysis, and how their share is reported.
- Staff, test, and business accounts: how they are identified and excluded.
- Week start day and fiscal calendar. Store opening hours that cross midnight.
- Customer identity: card reissues and merges. Members with several cards count once.
- Store changes: openings, closures, renovations, and relocations. Like-for-like store sets for period comparisons.
- Points and loyalty-rank rules that change the incentive to show a member card, which changes the member share without changing behavior.

## External sharing

Outputs often go to another company: a retailer's data to a manufacturer, or a joint report to both. Fix these per project, from the data-sharing agreement, before the first output. Until a line is fixed, state the assumption in the plan and ask the human to confirm it.

- Minimum cell size: the smallest number of customers (and of stores) behind any shared number. Suppress or merge smaller cells, and check that totals minus shown cells cannot reveal a suppressed one.
- Competitor visibility: whether other manufacturers' brands appear by name, as an aggregate "other", or not at all.
- Grain: customer-level rows never leave. Shared outputs are aggregates.
- Store and retailer identity: whether stores, regions, or the retailer itself may be named.
- Price and margin: whether retailer cost, margin, and funding terms may appear.

## Representativeness

One retailer's ID-POS covers that chain's customers, not the market. Its brand shares differ from the market's when the chain's shoppers, regions, or assortment differ. Members differ from non-members. When the decision is about the market (national brand share, total category size), say that the result describes this retailer's members, and compare with a market source such as a consumer panel or store-sales data when one is available.

## Data traits to plant in synthetic data

Spend per customer is skewed with a heavy right tail and many zero periods. Purchase frequency is overdispersed relative to a Poisson. Sales have weekly and yearly seasonality, holiday spikes, and payday effects. Stores differ in level and trend. Member share differs by store. Plant these in every synthetic dataset, as the **principle-simulate-the-method** skill describes.

# Stores and trade areas

Use for trade-area definition, new-store sales forecasts, the effect of a new store on nearby stores, and store benchmarking.

## Trade area

Define each store's trade area from where its members live, when member addresses (at the postal code or grid level) are available: the smallest area that covers a fixed share of the store's members or sales, such as 70%. Report the share of sales from inside the area, and how many members shop at two or more stores. Work only with aggregated location (postal code or mesh), never with raw addresses.

## Store choice: the Huff model

The Huff model gives the probability that a customer in an area chooses a store: proportional to the store's attractiveness (floor area, assortment) divided by distance or travel time raised to a power, normalized over the stores in reach. Fit the attractiveness and distance exponents to the observed member shares by area, with `scipy.optimize`. It takes a few lines of `numpy` once the area-to-store distance table exists. Validate by holding out some areas and comparing predicted with observed shares.

## New store sales forecast

- **Analog method.** Find existing stores with similar trade areas (population, age mix, competition, access) and use their sales, adjusted. Report the spread across analogs as the uncertainty.
- **Regression on trade-area features.** Model store sales on population, household mix, competitor count, floor area, and parking. With few stores, keep the model small and validate with leave-one-out across stores.
- **Huff-based.** Use the fitted Huff model to compute the new store's expected share in each area, times area spending potential.

Report a range, not one number. New stores also ramp up over months. Compare with the analogs' first-year curves.

## Effect of a new store on nearby stores

Treat the opening as an event. Use difference-in-differences with the nearby stores as treated and similar stores outside the reach as controls, as in `references/promo-effect.md`. Split the effect by distance band, and measure the member transfer directly: how many of the existing store's members now shop at the new one.

## Store benchmarking

Compare stores on sales per floor area or per trade-area household, not on raw sales. Adjust for trade area with a regression, and rank on the residual with the shrinkage in `references/regression.md`, because small stores swing more.

## Synthetic data to plant

Areas with populations and distances, stores with planted attractiveness, and a planted distance exponent. Check that the Huff fit recovers both, and that a new-store event study recovers a planted transfer.

## Report

Trade-area maps or tables at an aggregated level, the forecast range with analogs, and the effect on nearby stores by distance band.

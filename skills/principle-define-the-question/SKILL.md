---
name: principle-define-the-question
description: "Apply at the start of an analysis, before writing the first query. Write down the decision the analysis serves, the metric definition, the population, the time window, and the result that would change the decision. Without this, analysis drifts into fishing."
---

# Define the Question

Before querying, write down what the analysis is for. An analysis with no decision attached produces charts that look interesting and change nothing.

Write this block at the top of the notebook or the notes file before the first query:

- Decision. What will someone do differently depending on the answer? Name the person and the action.
- Metric definition. The exact formula, such as "revenue equals the sum of net_amount for completed orders, excluding tax". Name the source table and column.
- Population. Who or what is counted, with the inclusions and exclusions.
- Time window. Start and end dates, the time zone, and how long data takes to become complete.
- Decision threshold. The result that would change the decision, stated before you look. For example, "if week-4 retention in the new flow is not at least 2 points above the old flow, we keep the old flow."
- Known unknowns. What you cannot measure, and the proxy you will use instead.

Exploration does not need this block, but label the work as exploration. Confirmatory analysis needs the block before the results are read.

Without a stated question, each result invites another cut. Searching many slices until one looks significant is fishing, and the pattern that survives is usually noise. Record a new cut after the fact as exploratory. Check it on held-out data or a later period before acting on it.

Update the block only with a dated note, never by silent edits. Stop when the decision is clear, even if more slices are available.

You skipped this when a query runs before anyone can name the decision it serves, or when a result is reported with no threshold for changing the decision.

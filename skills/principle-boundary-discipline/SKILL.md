---
name: principle-boundary-discipline
description: "Apply when wiring data ingestion, parsing raw files, validating input schemas, or connecting to databases, APIs, and notebooks. Check data once at the boundary, convert it to typed frames, and keep transforms as pure functions the shell calls."
---

# Boundary Discipline

Place schema checks, type narrowing, and error handling at system boundaries: file reads, warehouse queries, API responses, CLI arguments, config files, and parameters passed into a notebook. Inside the pipeline, trust the typed frames. Business logic lives in pure functions over Polars frames. The shell (the script entry point or the notebook cell that calls them) stays thin.

Scattered checks make a pipeline noisy and give a false sense of safety. Logic stuck in notebook cells cannot be tested without running the whole notebook.

- At boundaries, validate the schema, dtypes, and expected ranges, and fail loudly with the offending column or row. Parse raw columns into domain types (dates, categories, currency units) once, at this point.
- Inside the system, use typed frames. Do not re-check the same schema in every function. Do not repeat a null check deep in a chain when the loader already enforced it.
- Across the boundary, expose domain names (`active_customers`, `order_date`), not raw source column names or a vendor's wire format.
- Keep the general mechanism (a reader, a cast helper) inside. Keep the special policy (which rows count as a valid order) at the edge.
- Put input schema assertions in one loader function, not in every analysis cell.
- Metric definitions, cohort rules, and cleaning rules are pure functions that take a frame and return a frame or a value. A tiny hand-made frame can test them, with no database and no notebook.
- Plots and reports call those functions. They do not recompute the metric.

Ask two questions. "Is this data crossing a system boundary right now?" If not, the validation is redundant. "Can this be a pure function over a frame that the shell calls?" If yes, extract it.

You skipped this when a metric definition lives inside a notebook cell that also reads the source, or when the same schema check appears in three files.

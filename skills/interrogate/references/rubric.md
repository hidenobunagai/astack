# Review rubric

Review through the lenses that apply. Not every lens fits every change.

## Result validity

Does the change produce the number or result the intent says it should?

- **Grain.** What does one row mean before and after the change? Did a join, a filter, or an aggregation change it? See the **principle-respect-the-grain** skill.
- **Join fan-out and dropped rows.** Compare row counts and key uniqueness before and after each join. A left join on a non-unique key multiplies rows. An inner join silently drops them.
- **Nulls and sentinels.** Are `NULL`, `0`, `-1`, `""`, or `1970-01-01` counted or excluded on purpose? Trace one real null through the code.
- **Filters and windows.** Check the date boundary, the timezone, the inclusive or exclusive end, and the population filter (test accounts, internal users, refunds).
- **Definitions.** Is the metric computed the same way everywhere it appears? A second copy of the formula is a bug waiting to happen.
- **Edge cases.** Empty input, a single group, a group with zero denominator, and a late-arriving row.

When you suspect a wrong number, trace the path: the input value, each stage, and the output row. Show the path, not only the claim.

## Statistical validity

Does the method answer the question, and does the conclusion follow from the result? See the **principle-name-the-estimand** and **principle-simulate-the-method** skills.

- **Estimand.** Is the quantity stated (ATE or ATT, difference or ratio, for whom)? Does the code estimate that quantity, or a different one?
- **Unit of assignment.** Was treatment assigned by member, store, or region? Are the errors computed at that level? Store-level assignment analyzed as independent members makes every interval too narrow.
- **Self-selection and confounding.** In observational data, who chose or was chosen for treatment? Comparing coupon users with non-users measures who they are, not what the coupon did. Check that the design removes this: pre-period balance, overlap, parallel pre-trends, a placebo period.
- **Assumptions.** Each assumption the method needs has a check that ran, and the result is reported. An untested assumption is a limitation in the write-up.
- **Multiplicity and forking paths.** How many metrics, segments, and specifications were tried? Is there one primary metric fixed before the result? Are secondary results corrected or labeled exploratory?
- **Heavy tails.** A few large baskets can move a mean. Was the handling (log, winsorizing, bootstrap) fixed before the result was read?
- **Conclusion against the interval.** Does the write-up claim more than the interval allows? "No effect" from a wide interval, or a business decision from the edge of a 95% interval, are findings.
- **Retail effects.** For a promotion, is the lift net of pull-forward (a dip after the period), cannibalization within the category, and the normal seasonal pattern?
- **Segments.** Does a clustering pass a no-structure check and a stability check? Are the segments different in a way a campaign can act on?
- **Method check.** Did the method run on synthetic data with a planted truth, and pass recovery, the null false-positive rate, and coverage?

## Reproducibility

Would the result come out the same from a clean process?

- Does it depend on notebook state, cell order, or a variable left over from an earlier cell?
- Are dependencies pinned (`uv.lock`), and are random seeds fixed?
- Does it read a snapshot, or a live table that changes between runs? If it reads live data, is the snapshot date recorded?
- Is the run idempotent? If it runs twice, or crashes halfway, does it leave a half-written output? See the **principle-make-operations-idempotent** skill.

## Root causes versus symptoms

Is the change fixing the real problem, or hiding it?

- A `drop_duplicates()` with no explanation can hide a fan-out bug.
- A `fill_null(0)` can hide a missing-data problem that changes the mean.
- A `try/except` around a query can hide a schema change.
- A filter added to make a chart look right can hide the actual cause.
- A fix in one notebook that should be a fix in the shared definition.
- A rule that lives in a comment ("do not include refunds here") should be a type, a check, or a test.

## Structural integrity

- **Boundary discipline.** Validate the data once where it enters. Trust it inside. Do not repeat validation in every stage.
- **Data model fit.** Do the tables and frames match the access patterns? Is the key the one the joins need?
- **Coupling.** Does the change make a notebook depend on a pipeline's internals?
- **Single source of truth.** Is a definition written once and imported, or copied?
- **Legacy paths.** Does the change keep an old definition alive next to a new one? If the callers can be moved, move them and delete the old one.

Do not penalize simple code for lacking abstraction. Duplicate code is cheaper than the wrong abstraction.

## Verification

Can you tell the result is right from reading it?

- Are there checks that fail on a bad grain, a null key, or a row-count jump? Assertions in the pipeline are better than a comment.
- Does a test or a check cover the bug, if this change fixes one?
- Are the numbers checked against an independent source, such as a dashboard, a finance total, or a raw count?
- Is the check run against the real data path, or against a small sample that avoids the problem?
- For a chart, is each plotted number traceable to the query that produced it?

## Complexity budget

- Code that could be simpler without losing correctness.
- Abstractions that serve one call site.
- Parameters for cases that do not exist.
- Dead code, unused columns, unused imports.
- Obsolete paths kept alive for a transition that has ended.

Simpler is better unless simpler is wrong.

## Security and data handling

- Credentials, tokens, or connection strings in code, notebooks, or outputs.
- Personal data in an output that is shared, committed, or published. Check the saved notebook outputs too.
- A write to a shared table, a production object, or a schedule. These always need the human's confirmation. Flag any change that adds one without that gate.
- SQL built by string concatenation from user input.

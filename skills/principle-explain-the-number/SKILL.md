---
name: principle-explain-the-number
description: "Apply before you trust, report, or act on a number you computed: a metric value, a delta between periods or segments, a model score, a row count, a runtime. Find what drives it, and rule out that it measured something other than what you think."
---

# Explain the Number

- **Ask "why this value and not double or half?"** Name what drives the result: which segment, which period, which rows, which filter. Get it from a breakdown you ran, not from reading the code. If you cannot say which part of the data produces most of the number, you do not know what you measured.
- **List what else the number could be measuring, and rule out each one with evidence.** The usual suspects in data work:
  - Join fan-out or dropped rows. Compare row counts and key uniqueness before and after each join (**principle-respect-the-grain**).
  - Nulls, sentinels (`0`, `-1`, `""`, `1970-01-01`), and duplicates silently included or excluded.
  - A filter, date boundary, or timezone that cuts the window differently than you think.
  - Survivorship, a changed definition, or a changed upstream source between the two periods.
  - Small samples and noise. A delta inside the normal spread is not a finding.
  - Mix effect. A shift in segment shares can move the total while every segment rate stays flat. This is not Simpson's paradox.
  - Simpson's paradox. The aggregate trend has the opposite sign from every segment trend. Test for it by comparing the sign of each segment's change with the sign of the total change.
- **Reconcile against an independent source.** Tie the total to a number someone else owns (a dashboard, a finance report, a raw count from the source table). Say which one and by how much they differ.
- **Keep the evidence with the number.** Put the query or code, the row counts, the spread, and the main driver in the notes or a linked artifact.

For a runtime or performance number, run the full procedure with the **benchmark-checklist** skill.

You skipped this when a reported number has no row count, no comparison baseline, no named driver, or no reconciliation.

Distinct from **principle-prove-it-works**, which checks that an output is real.

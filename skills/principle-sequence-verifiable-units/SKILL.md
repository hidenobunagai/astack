---
name: principle-sequence-verifiable-units
description: "Apply to multi-step analysis work: backfills, notebook-to-pipeline conversions, migrations of many similar queries, and how commits and PRs are stacked. Break work into small units that each end in a checkable state, verify each before the next, and order delivery so a reviewer can follow it."
---

# Sequence Work into Verifiable Units

Order work as a sequence of small units. Each unit ends in a state you can check. Do not advance until the current unit is green.

A break caught at the unit that caused it is cheap to localize. A break caught after a batch is buried, and you have already built further on a broken base. The same units, delivered in order, let a reviewer replay the work: watch it fail, then watch it pass.

In a backfill, migration, or run of similar edits, verify each change before starting the next. Each unit is a before-and-after bracket: a known-good state, one change, the check, then proceed. Start from a clean, re-run baseline so every check measures against the real starting point. When a script makes the edits, the per-unit check is nearly free. Run it anyway.

For delivery, stack commits and PRs in the order that proves the work. Each unit is its own commit on top of the last. The canonical shape is the failing data-quality assertion first, then the fix on top. Other story orders are a removal before the reshape, a baseline capture before the treatment, and the scaffold before the feature. Each change lands on its own, and the sequence reads as an argument.

This is the sequencing companion to **principle-prove-it-works**, which keeps each check real, and to **principle-build-the-lever**, which makes the per-unit check cheap.

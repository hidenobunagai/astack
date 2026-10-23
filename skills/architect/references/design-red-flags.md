# Design red flags

Screen every candidate before synthesis. A red flag is a reason to revise or reject the shape.

## Shallow module

A shallow module exposes a large interface and hides little. Judge depth by the policy hidden behind the public surface, relative to the size of that surface.

Signs:

- Callers must call several functions in order to finish one analysis step.
- Options expose internal stages, such as `load=`, `dedupe=`, `join_mode=`, that the caller has to choose correctly.
- Learning the interface does not spare the caller from learning the implementation.

## Information leakage

Two or more modules depend on the same internal decision. A representation, a filter rule, or a column name appears in several places, so changing it means coordinated edits.

Signs: a raw source column name used in a dashboard, a notebook, and a pipeline. A timezone rule repeated in three functions.

Fix: parse external data into domain types once, behind the interface.

## Temporal decomposition

Modules are grouped by execution order (load, clean, transform, save) instead of by the knowledge they own. The same schema and the same invariants then repeat at each stage.

Fix: group by what the data means, such as "users", "sessions", or "revenue", and keep each group's rules in one place.

## Pass-through function

A function forwards its arguments to another function with the same shape and adds nothing. Remove it, or move the responsibility to the module that can complete the work.

## Split ownership

Two or more modules write the same table, file, or metric, or keep their own copy. Each change to one writer leaves the others out of date.

Fix: one owner per output. Other modules read it or ask the owner to change it.

## Two ways to do one task

The design supports two ways to compute the same metric, for example a notebook formula and a pipeline function. Agents copy whichever they find first, so both keep gaining callers.

Fix: keep one way. Move callers to it and delete the other in the same change.

## Importable internals

A caller can import a helper that is meant to be private. The agent takes the shortest path that runs, so the helper becomes part of the interface.

Fix: keep internals out of the public module, and make the import fail where a boundary test can catch it.

## Hand-synced list

Two places list the same items, such as the columns of a schema and the columns of a validation check. Adding one item means editing both.

Fix: derive one from the other, or make the check fail when the lists disagree.

## Grain drift

A stage's output grain is not written down, or it changes silently after a join, filter, or aggregation. Downstream code then double counts or drops rows without an error.

Fix: declare the grain and the key in the signature or the schema, and assert the row count and key uniqueness at the stage boundary.

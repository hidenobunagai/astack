---
name: architect
description: "Sketch data shapes (grain, keys, schemas), function signatures, and the module or pipeline structure before code, then stay in the loop while implementation fills in. Use for /architect, \"architect this\", \"design this pipeline\", \"design the schema\", or non-trivial analysis or data work where jumping to code would lock in the wrong shape."
---

# Architect

Sketch the data shapes, function signatures, and module or pipeline boundaries with `NotImplementedError` bodies and pseudocode. Synthesize across several candidate designs, then fill in code against the chosen sketch.

## Start

Open a todo list with one entry per phase before you start: Ground, Sketch, Agree, Implement, Scrap.

## Phase A: Ground the problem

Build a real model of every system the new code touches. Run the **how** skill over the relevant subsystems. Naming a file is not grounding. Include the sources, the tables or frames that flow through them, and their grain. If the design changes ownership or layering of a metric or a table, also run the **why** skill on the existing shape, so the rationale becomes a constraint rather than a guess.

Skip Phase A only for greenfield work with no surrounding system to integrate.

## Phase B: Sketch

Run the **arena** skill with the design-sketch task and the Phase A artifacts. Pass `references/runner-prompt.md` as each runner's prompt.

Spawn two runners with the `Agent` tool and `isolation` `worktree`:

- Runner 1: `subagent_type` `general-purpose`, `model` `opus`, `effort` `medium`. Lens: data shapes and invariants.
- Runner 2: `subagent_type` `general-purpose`, `model` `sonnet`, `effort` `medium`. Lens: pipeline structure and what is cheap to change.

Require at least two structurally different candidates before synthesis, even when the first looks enough. Compare whole shapes, not point fixes inside one shape. Examples of shape differences: one wide table versus a fact and dimension pair; one pipeline script versus a set of pure functions with a thin runner.

Screen every candidate with `references/design-red-flags.md` before synthesis. Assume the next contributor is an agent that copies the nearest example and takes the shortest path that runs. Prefer the design where a change that looks right in one file is right for the whole project.

Compare viable candidates on interface depth. Prefer the design that hides more behind a smaller public surface. A function that takes a raw frame and returns a typed result beats five helpers the caller must call in order.

The arena returns one synthesized design. Its synthesis decision fills the rationale's "Synthesis decision" section.

## Phase C: Agree (opt-in)

By default, go straight to implementation with the synthesized design. No human checkpoint.

Opt in to a checkpoint only when the user asks ("with checkpoint", "show me before implementing"). Then show the synthesized design and wait for sign-off. Stop and ask with `AskUserQuestion` when the sketch needs a decision the user owns, such as a metric definition or a population.

The synthesis can ship as its own commit, the "scaffold first" mode of the **principle-foundational-thinking** skill. For adversarial review of the sketch, run the **interrogate** skill on it.

If the user pushes back on the shape, treat that as Phase A evidence. Re-ground and re-run Phase B before you write more code.

## Phase D: Implement against the sketch

Replace `NotImplementedError` bodies with code and pseudocode with logic. The sketch is the contract. Deviations are signal to surface, not friction to absorb quietly. If a function needs a parameter the sketch did not anticipate, ask whether the sketch was wrong, the requirement was missed, or the code is overreaching.

Follow the project's Python conventions (uv, ruff, ty, Polars). Verify each stage's output against its declared grain and key before moving on. See the **principle-respect-the-grain** skill.

## Phase E: Scrap when the architecture is wrong

If implementation keeps hitting friction the sketch cannot absorb, throw the sketch out. Do not bolt fixes onto a wrong design, per the **principle-fix-root-causes** skill, and redesign from the constraints as they now stand.

The signal is a pattern, not one instance:

- The same workaround appears in unrelated code.
- Several unrelated edge cases each need their own branch.
- Types need escape hatches (`Any`, casts, nullable columns that are always filled in practice) to compile.
- A "cache the intermediate result" reflex appears because two stages keep recomputing the same frame with different filters.
- Callers must know the module's internal rules to use it.
- Two or more independent Phase D deviations share one shape.

Use judgment. A few edge cases do not condemn a design. Complex data is not the same as a complex design.

When you scrap:

1. Re-run the **how** skill over what has been built.
2. Redesign as if the new constraints had been there from day one.
3. Subtract before you add, per the **principle-subtract-before-you-add** skill. The new sketch should be smaller than the old one before it grows.
4. Return to Phase B and re-run the arena.

## Outputs

Write the caller's usage first, then derive the sketch from it. For a small change, one file with the new types and signatures. For a larger one, a module or pipeline map plus the type definitions. Ship the rationale next to it, shaped per `references/rationale-template.md`, with the usage sketch and the synthesis decision.

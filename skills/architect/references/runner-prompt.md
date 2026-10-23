# Architect runner prompt

The orchestrator passes this file to every candidate runner in Phase B. It fills in the task, the Phase A artifacts, the isolated worktree, and the output path. Each runner works in its own worktree, so candidates stay independent.

You are producing one candidate design in the architect's parallel exploration. Read the **architect** skill in full first. You are inside its workflow. Output a candidate package: the data shapes, the function signatures, the module or pipeline map, and a prose rationale shaped per `rationale-template.md`.

Apply this discipline. The orchestrator compares candidates on these axes to pick a base.

- **Usage first.** Write the caller's view (how an analyst or a downstream job calls the code) and two or three real call sites before the types. Then derive the types from the usage. Reconcile the sketch to the usage, not the reverse.
- **Data shapes first.** For every table or frame, state its grain (what one row means), its key, its nullable columns, and its units. Trace each main access pattern through the shape. If the answer is "we will add an index later", the shape is wrong.
- **Declare the stages.** For each stage that changes data, state its input grain, its output grain, and the invariant it must keep (for example "one row per user_id after this stage"). The invariant is what gets checked.
- **Interface depth.** Prefer a small public surface that pulls complexity into the callee. Do not expose wire types or raw source schemas on the public surface. Parse them into domain types behind the interface.
- **Shared state.** If two actors might write the same table or file, ask what happens. If the answer is not "nothing", give each actor its own output and merge at the read boundary.
- **Make boundaries visible.** Use `raise NotImplementedError` for bodies and pseudocode comments for tricky logic. A reader should trace the data from input to output by reading signatures and types alone.
- **Encode invariants in types.** Typed schemas or dataclasses beat runtime checks, and runtime checks beat prose. See the **principle-encode-lessons-in-structure** skill.
- **Validate at the boundary.** Check the input once where it enters, then trust it. Keep the transformation logic as pure functions over frames. See the **principle-boundary-discipline** skill.
- **One source of truth per definition.** A metric's definition lives in one function. Other code imports it. Do not copy it into a notebook and a pipeline.
- **Idempotent runs.** A pipeline run twice on the same input must produce the same output. Ask what happens after a crash halfway. See the **principle-make-operations-idempotent** skill.
- **Short call chains.** If tracing a flow needs more than three files, flatten it. See the **principle-minimize-reader-load** skill.

You are one of several runners, and each runs on a different model or lens. Produce the best design you can. Do not hedge toward the other candidates. The differences are the signal the orchestrator uses to pick a base and graft. A safe middle design defeats the exploration.

---
name: principle-minimize-reader-load
description: "Apply when reviewing or shaping analysis code that is hard to trace: a notebook with hidden state, a pipeline with many wrapper functions, or a dashboard with chained parameters. Count the layers between question and answer and the state a reader must hold, then collapse one-caller wrappers and shrink mutable scope."
---

# Minimize Reader Load

Maintainability is the work a reader must do to understand code. Track two axes. Layers to trace are the indirections between the question and the answer. State to hold is the hidden or mutable context the reader must keep in mind. Line count and "clean architecture" are proxies. Reader load is what matters. The two axes are independent. A flat script with fifty globals can be as hard to reason about as a six-layer adapter stack.

A notebook is the extreme case. A variable defined in cell 3, reassigned in cell 9, and read in cell 12 is hidden state.

- Collapse layers that cost more than they save: wrappers with one caller, adapters with no second implementation, indirection that was never needed. Inline them.
- Collapse pass-through layers. A layer that repeats the same arguments without changing the abstraction adds reader load and no compression.
- Prefer boundaries that hide a meaningful decision. A broad interface that hides nothing makes readers learn both the surface and the implementation.
- Shrink state scope. Prefer pure functions that return frames over functions that mutate them, locals over module state, and module state over globals.
- Derive instead of sync. Compute a column from its source instead of keeping a copy in step with it.
- Chain Polars expressions in one place rather than reassigning the same `df` name across many cells.
- Name the invariant at the boundary, such as "order_id is unique", so readers learn it once.
- Before you add a layer or a piece of state, ask whether it reduces reader load elsewhere by at least as much.

The test is whether a new reader can answer "where does X come from?" and "what can change X?" in under 30 seconds. If not, cut layers or cut state.

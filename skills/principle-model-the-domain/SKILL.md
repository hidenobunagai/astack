---
name: principle-model-the-domain
description: "Apply when writing stateful analysis logic: pipeline stages with status flags, metric definitions with many branches, segment rules spread across files, or a feature that grows an if/else chain. Encode the real domain in a data structure instead of scattering conditionals."
---

# Model the Domain

Encode the real domain in a data structure instead of scattering it across conditionals. A structure that matches the domain makes invalid states unrepresentable and deletes branches. Choosing it at write time is cheap. Recovering it later reads as a refactor and gets deferred.

Reach for:

- A state machine instead of scattered booleans or status checks, such as a pipeline run that is pending, running, passed, or failed.
- A typed model instead of loose parameters or repeated shape assumptions. Use a typed schema or a `pl.Enum` dtype for categories.
- A lookup table or mapping frame, joined in, instead of branching on a segment name in several files.
- A reducer or event log instead of ad hoc state mutations.
- A module organized around one body of domain knowledge, such as "churn", instead of a sequence of load, clean, transform, and save. Execution order is not ownership.
- A normalized table or an index where the access pattern calls for it.
- Any other structure that fits. When none fits, work out what the code must never allow and how the data gets read, then find the structure that encodes exactly that.

Do not force an abstraction. Prefer boring code if the current shape is already clear, local, and unlikely to grow. Be skeptical of an abstraction that adds indirection without removing branches, duplicated rules, invalid states, or stale-state risk.

You skipped this when a new feature adds one more branch to an existing if/else chain, or a second boolean must stay in sync with the first. Phase-named modules that repeat the same domain rules in each step are another sign.

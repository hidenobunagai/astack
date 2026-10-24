### Feature

**You own the design. Plan, review, verify.** Delegate implementation. Stay in the lead. A feature here is new analysis code, a transform, or a pipeline step, built from a named data shape.

1. Run the **how** skill over the affected pipeline or analysis code.
2. Run the **architect** skill for parallel design exploration.
3. Name the data shape before any code. Write down the input table and its grain, the output table and its grain, the keys, and the column types. Pick the organizing structure with the **principle-model-the-domain** skill: a typed schema over repeated column assumptions, a table or registry over branching on segment names, a state machine over scattered booleans. Choose it before the subagent writes logic.
4. Write the throughput checkpoint as four todo items. A dimension that does not apply keeps its item with `n/a: <reason>`.
   - **Blocking first steps.** Schema and grain checks, and the test data, run before fan-out.
   - **Independent workstreams.** Disjoint files or pipeline steps parallelize. Shared writes serialize.
   - **Shared mutable state.** Default to splitting the target. Serialize only for real invariants.
   - **Smallest safe decomposition.** If one worker is best, name why.
5. Delegate code-writing to a subagent with `model: "sonnet"` and `effort: "medium"`. Give it a specific scope: file paths, the input and output shapes, the grain, and the success criteria. When the implementation has several valid shapes (error handling, the function boundary, the test layout), use the **arena** skill so the runners surface the alternatives and the judge picks. The delegation is mandatory. A subagent that cannot spawn owns the diff directly, with the same review separation. Never wait on a nested agent. Follow the Python conventions in the analyst-mode skill. Make surgical edits. Port shared improvements to every consumer and verify each. Commit liberally with `git add <paths>` and `git commit`.
6. Verify from a clean state. Run the new step yourself in a fresh process on a synthetic input that follows the real schema, including the edge cases (nulls, duplicates, empty segments). Then hand the real input run to the human as a run request (analyst-mode, Human runs the data), with the script asserting the row count and key uniqueness against the grain you named in step 3. Read the pasted values. "Inconclusive," or a check on a different slice, is not a pass. Flag it.
7. Rebase into small, ordered commits. Build, verify, and commit each unit before the next (the **principle-sequence-verifiable-units** skill). Commit each unit on its own. Fold a fix into the unit it belongs to with `git commit --fixup <sha>` and `git rebase -i --autosquash <base>`.
8. If the design is contested, run the **interrogate** skill before shipping.
9. Run the opening-a-pr playbook (`playbooks/opening-a-pr.md`).

Code-coupled work (one feature, one migration) goes to a single owner with the checkpoint inline. That owner fans out internally after the blocking phase. Parent-level fan-out is for slices that produce independent artifacts: audits, cross-source investigations, competing experiments.

**Reply:** what you built, the data shape and grain, what you chose and why, the throughput checkpoint, open decisions. Use tables for design alternatives.

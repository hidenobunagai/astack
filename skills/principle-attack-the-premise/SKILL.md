---
name: principle-attack-the-premise
description: "Apply when two or more fixes that share one premise have failed the same check, such as a metric that will not move, a pipeline that keeps failing one assertion, or a model score that stays flat. Write the premise down and test it directly before you try another fix."
---

# Attack the Premise

When two or more fixes that share one premise have failed the same check, suspect the premise, not the fixes.

Each failed fix is evidence against the belief it assumed. A third fix on the same premise spends effort where the evidence already says the cause is not. In data work the usual premises are "the join is one row per customer", "the source is fresh", "the filter matches the definition", and "the feature reaches the model".

- Write the premise down. It is the one sentence that every failed fix assumed.
- Test the premise before the next fix. Find an observation that would come out differently if the premise were false, and run it. Look at how the failures are distributed, not only how large they are.
- Make that check a re-runnable script (see **principle-build-the-lever**), so the next run reuses it.
- Follow the evidence. If it contradicts the premise, the cause is elsewhere. Look for what the failures share that the premise did not predict, such as one segment, one date range, or one source table. If it confirms the premise, ask the next "why" (see **principle-fix-root-causes**). Earlier fixes may have treated a consequence.
- Remove the condition instead of compensating for it (see **principle-laziness-protocol**). If one segment always lands on the losing side, change what puts it there. A dedupe step that cleans up after a bad join leaves the join in place and adds work to every run.

Do not start the next fix before the premise is written down and tested.

---
name: arena
description: "Run N parallel candidates at the same analysis, pipeline, notebook, or chart task, pick a base, and graft the strongest parts of the rest into it. Use for /arena, \"arena this\", or when one attempt at a non-trivial artifact (a transform, a model, a dashboard layout) would lock in the wrong shape."
---

# Arena

Open a todo list with one entry per phase before you launch anything: Frame, Fan out, Cross-judge, Pick, Graft, Verify.

## Panel note

This panel uses Claude models only, so vendor diversity is not available. Get diversity from distinct lenses and from mixing `opus` and `sonnet`. Give each seat a different lens, such as correctness, cost, or readability, so the candidates do not converge by default.

## Phase A: Frame

Every candidate gets the same prompt, so the prompt is the contract.

1. State the artifact each candidate produces: a transform module, an analysis notebook, a chart spec, or a schema.
2. Derive a rubric of 3 to 6 gradeable criteria for this task. Examples: "row count and key match the spec after each join", "every plotted number traces to the query", "the module runs from a clean process with pinned dependencies". Candidates only see the task, so the rubric is for the picker in Phase D.
3. Pick the runners. Use the `Agent` tool:
   - Runner A: `subagent_type` `general-purpose`, `model` `opus`, `effort` `medium`. For judgment-heavy work such as a model design or a metric definition.
   - Runner B: `subagent_type` `general-purpose`, `model` `sonnet`, `effort` `medium`. For code and mechanical generation.
   - Add more runners only when the arena covers several design directions. Use the same model several times, each with a different lens, when the work is generation-heavy rather than judgment-heavy.
4. Give each candidate its own writable location. Use `isolation` `worktree` for code, so parallel candidates never share state. For a notebook or a chart, use a separate output path such as `/tmp/arena-<slug>/candidate-<n>/`.

## Phase B: Fan out

Spawn all candidates in one message. Each brief has the task, the path to the shared grounding (data dictionary, schema, the prior notebook), its own output path, and the instruction to produce the artifact and a short rationale. The rationale names the alternatives considered and what was rejected.

Candidates must not write to a shared warehouse table. Reads must be time-bounded.

If a candidate produces nothing, continue with N-1 and note the dropout.

## Phase C: Cross-judge

After every candidate finishes, spawn one judge with `subagent_type` `Explore`, `model` `opus`, `effort` `high`. The brief says "do not edit files". The judge sees the rubric and the candidates by path label. It scores each criterion and recommends a base with a reason. Do not start the judge while candidates are still writing.

## Phase D: Pick a base

Read every candidate end to end before you pick. Score each against the rubric, criterion by criterion, not by overall feel. Compare with the cross-judge. Agreement confirms the pick. Disagreement means one of you is biased or the rubric was vague. Read both reasons before you decide.

Pick the base that a future maintainer can extend most easily without breaking its invariants. When two are tied, prefer the cleaner boundary or the smaller API, per the **principle-laziness-protocol** skill.

## Phase E: Graft

Walk each losing candidate once more for what is worth taking, usually one or two things per candidate. Fold each graft in by hand, per the **principle-fix-root-causes** skill, so the result keeps one model. Do not paste mechanically.

If the candidates converge on one shape, that is strong agreement. Note it and ship it with no graft. If they diverge widely, Phase A was under-specified. Reframe and re-run. Do not average the divergence.

## Phase F: Verify

Verify the synthesized artifact like any other output, per the **principle-prove-it-works** skill. For analysis code, that means a clean re-run and a check of the numbers against the source. If verification finds a problem the arena missed, either Phase A was wrong (re-frame and re-run) or a candidate caught it and the graft was missed (return to Phase E). Do not paper over it.

## Outputs

One synthesized artifact, plus a short synthesis note. The note names the base and why, the judge's verdict, each graft with its source candidate, what was rejected and why, any convergence or dropouts, and the verification result.

---
name: how
description: "Use for \"how does X work\", walkthroughs of a data pipeline, notebook, or analysis module before changing something, and placement / ownership / layering questions (\"where should this transform live\", \"which module owns this metric\", \"is this the right layer\"). Explains the data flow, subsystem architecture, and runtime flow for onboarding. Use why for motivation."
---

# How

Explore the code to answer "how does X work?" questions. Produce an architecture explanation at the level of a senior analyst or engineer onboarding onto a data project. The reader should build a working mental model, not get annotated source.

The subject can be a Python package (uv, Polars), a notebook (Jupyter or marimo), SQL or dbt-style models, a pipeline, or a dashboard.

## Spawn settings

Agents in this skill use the `Agent` tool. Agents run in the background by default and report back on completion. Wait for every agent before the next step.

- Explorers: `subagent_type` `Explore`, `model` `haiku`, `effort` `low`. The brief says "do not edit files" and "do not run git write commands".
- Explainer: `subagent_type` `general-purpose`, `model` `sonnet`, `effort` `medium`.

## 1. Assess complexity

- **Simple** (one module, one transform, one notebook section, or a narrow question such as "how does this function compute weekly retention"): no explorers. Spawn one explainer that explores and explains in one pass. Build its prompt from `references/explainer-prompt.md` without the explorer-findings section. Go to step 4.
- **Complex** (a pipeline across several stages or files, a metric defined in several places, a full project overview): go to step 2.

When in doubt, take the simple path.

## 2. Explore (complex only)

Split the question into 2 to 4 angles, each a distinct slice. For a pipeline, the usual angles are: raw inputs and ingestion, transforms and joins, metric or feature definitions, and consumers (notebooks, reports, dashboards). Spawn all explorers in one message, each with `references/explorer-prompt.md` and its angle filled in.

## 3. Synthesize (complex only)

When all explorers have returned, spawn one explainer with `references/explainer-prompt.md` and every explorer's findings filled in.

## 4. Present

Present the explainer's output. Light edits for clarity or for context from the conversation are fine. Do not rewrite it substantially.

## Output format

The explanation uses the sections in `references/explainer-prompt.md`: Overview, Key Concepts, How It Works, Where Things Live, Gotchas. Drop any section that does not apply.

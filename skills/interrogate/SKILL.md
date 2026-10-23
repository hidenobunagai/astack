---
name: interrogate
description: "Use for \"interrogate\", \"adversarial review\", \"multi-model review\", \"challenge this\", \"stress test this analysis\", \"find blind spots\", or \"tear this apart\". Several reviewers challenge a pipeline, notebook, metric, or analysis change from independent angles (result validity, code quality) and return a synthesized verdict."
---

# Interrogate

Spawn adversarial reviewers over a change to code, a notebook, or an analysis. The reviewers differ by lens and by model. The deliverable is a synthesized verdict. Do NOT auto-apply changes.

## Panel note

This panel uses Claude models only, so vendor diversity is not available. Get diversity from the lenses and from mixing `opus` and `sonnet`. Each reviewer gets its own lens, so the reviews do not repeat each other.

## Step 1, Scope

Identify what to review from the context:

- If the user names files, a notebook, or a diff, use that.
- Otherwise review the changes since the trunk: `git diff $(git merge-base main HEAD)` (it includes uncommitted edits), or name the commit range explicitly.
- If the user's message refers to recent work, gather the relevant files.

Convert any notebook before you package it. Never package a raw `.ipynb`. Convert it to a script outside the repo with `uvx jupytext --to py:percent --output /tmp/<name>.py <notebook>.ipynb`, as described in the **how** skill. Include the data shape notes that the reviewers need: the input grain, the expected row counts, and the source tables.

## Step 2, Intent

Before you spawn reviewers, state the intent in one paragraph. Use the user's message, the change descriptions, the PR description if one exists, and the code. If the intent is unclear, ask the user with `AskUserQuestion` before you go on.

Also state the decision the analysis serves, if there is one, and the number or result it must get right. Reviewers need this to judge whether an error matters.

## Step 3, Spawn reviewers

Launch all reviewers in one message with the `Agent` tool. Use `subagent_type` `Explore`. The brief says "do not edit files, do not write to any warehouse, and do not run anything that changes a shared table or schedule".

| Reviewer | Model | Effort | Lens emphasis |
| --- | --- | --- | --- |
| A | `opus` | `high` | Result validity: grain, joins, filters, nulls, time windows, and whether the numbers answer the intent. |
| B | `sonnet` | `high` | Code quality: structure, duplication, reuse of canonical definitions, and clarity. |
| C (high stakes only) | `haiku` | `high` | Reproducibility: clean-process re-run (on synthetic data, or in the human's pasted runs), pinned dependencies, fixed seeds, and snapshot dates. |

Add reviewer C only when the change is high stakes, as the table shows.

Fill in `references/reviewer-prompt.md` for every reviewer with the intent, the code or notebook text, the rubric from `references/rubric.md`, and the code-quality lens from `references/code-quality-review.md`. Each reviewer applies the lens it is emphasizing and the other one as a second look.

## Step 4, Synthesize

As results come back, build one picture. Parse each reviewer's findings. Merge findings that describe the same issue, and note which reviewers raised each one. A finding raised by both reviewers independently is the strongest signal. Read a lone finding and weight it accordingly. Note disagreements. If one reviewer flags something and the other says the opposite, that goes into the verdict as context.

## Step 5, Lead judgment

You are the lead reviewer, a pragmatic senior analyst. You are not a neutral aggregator. Read `references/lead-judgment.md` for the framework. Sort every finding into one of four buckets, with the reviewer(s) that raised it and a one-line reason:

- **Act on**: real issues that affect the correctness of a number, the reproducibility of a run, security, or maintainability. They would block a real PR or a shipped number.
- **Consider**: legitimate, but unsure whether they outweigh the cost of fixing now. Worth the user's attention.
- **Noted**: valid but not actionable now.
- **Dismissed**: wrong, nitpicky, or missing context, with a brief reason.

## Output format

### Intent
> The intent paragraph from Step 2

### Reviewers
- Reviewer [label]: [model], [N findings]

### Act on
Each: the description, which reviewers raised it, and why it matters. Include the row count or the number it changes, when you can state it.

### Consider
Each: the description, which reviewers raised it, and the tradeoff.

### Noted
A brief list.

### Dismissed
Each with a brief reason.

### Agreement map
Where the reviewers agreed and where they diverged, and what the pattern says.

# Epistemics

How to reason about confidence when the evidence is historical, fragmentary, and sometimes contradictory, and how to tell the user without flattening it into false certainty. Code shows what it does, not why it exists. The why lives in commits, PRs, tickets, docs, notebooks, dashboards, and conversations. All of them are incomplete and biased. Pretending otherwise produces confident guesses that mislead the user.

## Confidence tiers

Every claim in the output sits in one tier. The tier sets its section and its phrasing.

### 1. Direct

An explicit, textual citation answers the question. The source says why, in words. Examples: a PR description "this clamps the window to 90 days because the warehouse retention is 90 days", a ticket "we are adding this metric for the Q3 retention review", a code comment "// exclude test accounts, they inflate the count", a notebook markdown cell "using the 7-day window because the 1-day window was too noisy", or a chat message from the author.

Phrasing: confident, present tense, cited. "This exists because X."

### 2. Supported

Several pieces of indirect evidence converge on one conclusion. No single source states it. Examples: the PR title says "fix double counting", the ticket is labeled "data-quality", and the surrounding commits all touch the same join. Or the dashboard tile was changed the same week the metric definition changed.

Phrasing: confident but clearly derived. Cite each item. "The evidence points strongly to X: [the items]."

### 3. Inferred

A reasonable reading that nothing explicitly supports. It is your interpretation, not a fact in the record. Example: the threshold changed right after a pipeline backfill, so it was likely a fix for the backfill's values.

Phrasing: hedged, with the chain explicit. "Given A and B, C seems likely because D."

### 4. Speculative

A plausible hypothesis on thin evidence where other explanations fit equally well. Worth presenting, because the user may know the answer. Mark it as a guess.

Phrasing: "One possibility is X, but we have no direct evidence." It usually lives in Competing Hypotheses.

### 5. Unknown

You looked and could not find out. This is a valid and important result. Document it.

Phrasing: "We searched X, Y, and Z and found no evidence of why." Name what was searched. "We could not find out" is less useful than "We searched the ticket tracker for A and B, scanned the 6 PRs that touched this file since March, and grep'd the notebooks for the threshold value. None discussed it."

## Phrasing guide

**Confidence words** imply Direct or Supported evidence and need a citation next to them. Do not use them for inferences: "because", "the reason is", "was designed to" (claims intent), "fixes" or "solves" (claims the change worked), "the team decided" (claims a group decision).

**Hedges** signal interpretation. Use them in What We Can Reasonably Infer: "appears to", "seems to", "likely", "suggests", "is consistent with", "plausibly", "may have been".

**Words to avoid:**

- "obviously". If it were obvious, the user would not ask.
- "clearly". It usually precedes a claim that is not clear.
- "of course". Same problem.
- "just", as in "it's just a fill value". It hides uncertainty.
- "I think" or "I believe". You synthesize evidence. Write "the evidence suggests".

## Avoid rationalization

Code that makes sense today may have been written for reasons that no longer hold, or that were wrong at the time. Do not fit a clean story onto messy history. Do not assume a consistent pattern was intended when it may be copy-paste. Do not read the absence of a discussion as proof that nobody considered the issue.

## The sycophancy trap

Users often embed a guess: "I assume the 30-day window is for seasonality?" Do not simply confirm it. Treat the guess as a candidate. Check it against the evidence. If the evidence supports it, say so with citations. If not, say what the evidence does support.

## When evidence contradicts

Show both sources with citations. Do not pick the one that fits a tidier story. Example: the ticket says "needed for the finance close", and the PR says "cleanup in this area". Both may be true, or one may be wrong. Let the user decide.

## When evidence is missing

An honest "we don't know" is one of the most useful outputs. It tells the user the answer is not in the obvious places and that they may need to ask a person (the metric owner, the analyst who wrote the notebook). Name each gap: the question, the sources searched, what was searched for, and what came back (nothing, or only tangential material).

## Before finalizing

Check every claim in What We Found and What We Can Reasonably Infer. Each one has a citation or moves to Inferred or Hypotheses. The phrasing matches the tier. Code is not used as evidence for its own intent. There is a What We Don't Know section. If it is empty, be suspicious, because historical questions almost always leave gaps.

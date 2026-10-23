# Rationale template

The prose that ships with the sketch. One page. Sentence-case headings. Replace the italic notes with real content.

## Problem

*One paragraph. What the analysis or pipeline must produce, and what about the existing data or constraints makes the shape non-obvious. If Phase A surfaced constraints the design must honor (a table that downstream dashboards read, a definition another team owns, a grain the existing joins assume), name them here.*

## Usage (caller's view)

*Write this first. Show how an analyst, a notebook, or a downstream job calls the code, with two or three realistic call sites. Then the sketch in [Shape](#shape) follows from it. If they disagree, change the sketch to match the usage.*

## Shape

*The recommended design. Data shapes first: for each table or frame, its grain, key, and columns that matter. Then the signatures that move data between them. Name the load-bearing decisions. Say which invariants the types encode, where validation happens, and what the design deliberately does not do. Judge the interface depth: what the public surface hides and what it exposes.*

## Synthesis decision

*Filled in by the **arena** skill. Which candidate became the base and why, what was adapted from each other candidate, and what was rejected and why.*

## Tradeoffs accepted

*One bullet per tradeoff. Form: "we accept X in exchange for Y." Name anything a future reader might mistake for an oversight, such as a duplicated column kept on purpose for a dashboard.*

## Alternatives considered

*Required. At least one concrete alternative shape, with one line on why it lost. Judge each on interface depth: what it exposes to callers and what it hides. Do not list variants of the same shape. If the constraints forced one answer, write "this was the only viable shape because ...".*

## Open questions and risks

*What the human needs to decide, and risks to flag before implementation. Phrase them as questions, such as "Should refunds be netted before or after currency conversion?"*

## Next implementation step

*The first thing to build against the sketch, in one sentence.*

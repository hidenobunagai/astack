# Synthesizer Prompt Template

Fill in the placeholders.

---

You are answering a "why" question about code or an analysis choice. Investigators searched different sources: git history, notebook history, query logs, dashboards, pipeline runs, issue trackers, long-form docs, team chat, and the agent memory (engram). Produce a confidence-weighted, cited account that says what the evidence supports and what it does not.

## The question

> {QUESTION}

## The code anchor

**Target files:** {FILES_WITH_LINE_RANGES}

**Key symbols:** {SYMBOLS}

## Investigator findings

{ALL_INVESTIGATOR_FINDINGS}

## Sources not searched

{SKIPPED_SOURCES_WITH_REASONS}

## Epistemics

You MUST follow `references/epistemics.md`. Read it in full before writing. The key rules:

1. Every claim sits in one tier: **Direct**, **Supported**, **Inferred**, **Speculative**, or **Unknown**. The tier sets its section and phrasing.
2. Every Direct or Supported claim has a citation (PR number, ticket ID, doc URL, chat permalink, commit id, file:line, dashboard or notebook location).
3. Inferred and Speculative claims use hedged language.
4. Never cite code as evidence for its own intent.
5. Document gaps. Do not fill them with plausible guesses.
6. Treat a hypothesis in the user's question as a candidate, not a conclusion.

## Instructions

1. Read all investigator findings and weigh them yourself.
2. Merge overlaps. When several investigators cite the same PR or query, give it one reference.
3. Surface contradictions. Show both sides.
4. Calibrate each claim to its tier.
5. Spot-check citations by reading the code or calling the tool again. Do not write files or change external state.
6. Do not overreach. Leave an open question open.

## Output format

Write for the user, in this exact structure:

---

### The Question

Restate the question in one or two sentences.

### The Code in Question

File paths, line ranges, key symbols. Two or three lines to orient a cold reader.

### What We Found

- **[Direct]** Claim. Source: [PR #123](url) / ticket ID / file:line. Brief quote or paraphrase.
- **[Supported]** Claim. Evidence: the items and what each contributes.

### What We Can Reasonably Infer

- **[Inferred]** Hedged claim. Reasoning: the evidence and the inference step.

Skip this section if there is nothing to infer.

### Competing Hypotheses

Skip this section if there is a single clear answer. For each hypothesis:

- **Hypothesis:** one sentence
- **Evidence for:** specific items
- **Evidence against or missing:** what would need to be true but is not

### What We Don't Know

Name specific gaps. Example: "We searched the issue tracker for 'retention window' and the notebook history for the 90 day constant and found no discussion of the choice." Include:

- Questions left unanswered
- Searches that returned nothing
- Sources that were unavailable, and why
- People who would likely know

### Sources Consulted

- **Source control history**: file paths, number of commits reviewed, PR numbers, and code comments. Or "Not searched."
- **Notebook history**: notebooks and cells searched. Or "Not searched. No notebooks reference the target."
- **Query history**: fully qualified tables or saved queries, time windows, and the numeric summaries that bore on the question. Or "Not searched. No query log source connected."
- **Dashboards and metric definitions**: dashboards, tiles, metric files, and alerts searched. Or "Not searched."
- **Pipeline and job runs**: jobs, check names, and dates searched. Or "Not searched."
- **Issue / ticket tracker**: ticket IDs and keyword searches. Or "Not searched. No matching source connected."
- **Long-form documents**: page titles and queries. Or "Not searched. No matching source connected."
- **Real-time team chat**: channels, date ranges, and queries. Or "Not searched. No matching source connected."
- **Agent memory (engram)**: the search words and the note or session IDs and dates returned, copied from the tool output. Or "Not searched."

### Confidence Summary

One or two sentences. Example:

> "The core rule (the 90 day cap) is well supported by a direct PR description. The choice of 90 over 60 is inferred from the retention notebook but not documented. Why the metric was split by region could not be answered. No ticket or doc surfaced, and team chat was not connected."

---

## Quality check before returning

1. Does every claim in What We Found have a citation? If not, add one or move it to Inferred or Hypotheses.
2. Does the phrasing match the tier? Only Direct claims may say "because".
3. Did you show every contradiction?
4. Does What We Don't Know name specific gaps? An empty section is suspicious.
5. Did you check the user's embedded hypothesis against the evidence?
6. Did you use code as evidence for intent? Remove it if so.
7. Is the tone calibrated? A confident answer on weak evidence is the failure this skill exists to prevent.

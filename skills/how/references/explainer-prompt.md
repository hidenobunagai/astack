# Explainer Prompt Template

Build the explainer's prompt from this template. Fill in the placeholders.

---

You are writing an architectural explanation for a senior analyst or engineer. Multiple explorer agents traced different slices of a data project in parallel. Synthesize their findings into one coherent explanation.

## Original Question

> {QUESTION}

## Explorer Findings

{EXPLORER_FINDINGS_ALL}

## Instructions

The explorers each covered a different angle of the same project. Their findings overlap in places and may contradict each other. Reconcile them. Merge overlapping descriptions, resolve contradictions by checking the code yourself, and combine the slices into one picture.

Write an explanation that a reader new to this area can use to start working in it with confidence.

You have read-only access. Use Read, Grep, and Glob to check anything or fill a gap. Do not edit files. Do not read a raw `.ipynb` in full. Convert it to a script outside the repo first (for example `uvx jupytext --to py:percent --output /tmp/x.py <notebook>.ipynb`) and read the script.

## Output Format

Use this structure, adapted to the question. Not every section is needed.

### Overview
One or two paragraphs. What this is, what it does, why it exists. A reader who stops here should know whether to keep going.

### Key Concepts
The important tables, frames, models, metric definitions, and abstractions needed to follow the rest. Brief definitions, not an exhaustive list.

### How It Works
The core of the explanation and the longest section. Walk the flow. Cover what triggers it, the steps in order, where data goes, and the decision points. For each stage that changes data, name its grain (what one row means) and its key, when the code makes them clear. Say what you could not confirm.

Use prose, not pseudocode. Reference specific files and functions so the reader knows where to look. Do not dump large code blocks unless a snippet is essential.

When several components pass data to each other, include a diagram. Use mermaid (```mermaid) for structured flows and ASCII art for simple relationships. A diagram should clarify, not decorate. If prose covers the flow, skip the diagram.

### Where Things Live
A brief file and directory map. Only the places someone needs to start working.

### Gotchas
Non-obvious behavior: silent filters, timezone or date boundaries, fill values such as `0` or `-1`, joins that change row counts, stale outputs, historical context. Skip this section if nothing is worth calling out.

## Communication Style

- Use concrete language. "`build_weekly_retention` joins `events` to `users` on `user_id`, so one user with two signups counts twice" beats "the function delegates to the join."
- When something is complex, explain why it is complex.
- When something is simple, do not pad it.
- Use an analogy only if it helps.
- If the explorers flagged open questions or gaps, state them. Do not hide them.

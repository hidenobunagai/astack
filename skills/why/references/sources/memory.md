# Agent memory (engram)

## What this source contains

When the [engram](https://github.com/hidenobunagai/engram) plugin is installed: notes from earlier Claude Code sessions on this machine, saved caveats, metric definitions, decisions, error and fix pairs, and the team's shared notes when this project takes part in team sharing. A previous session may already have settled the question.

## How to search it

Run one search with the user's own wording before a deep investigation. Use the `engram:recall` skill with the search words. Use `engram:history` to list past sessions or to read one session or one day. If engram is not installed, skip this source and say so.

Keep the results exactly as the tool returns them. Quote note IDs, session IDs, dates, and team file paths from the output. Never invent an ID or a date.

## What good evidence looks like

- A saved note or past session that records the decision and its reason, with its date.
- A fix note that names the error and the change that resolved it for the same table or query.
- A team note file whose path you read and quote.

## Common pitfalls

- **Memory is a lead, not a citation.** Check the claim against the code, the PR, or a data source before you report it as evidence.
- **Old decisions can be reversed.** Compare the memory's date with the current code and data.

## What to return

- The search words you used
- Each hit: note or session ID, date, and the passage quoted from the tool output, plus the file path for a team note
- Whether the hit was checked against another source

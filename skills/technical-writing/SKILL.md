---
name: technical-writing
description: "Layered technical-writing standard for data work: Diátaxis structure, Google developer style sentences, STE instruction rules, Global English syntax. Use for /wstack:technical-writing or when writing or reviewing docs, notebook prose, methods notes, readmes, PR descriptions, or commit messages."
---

# Technical writing

Write so a tired engineer understands on the first read. Apply all four layers.

Three rules sit above the layers:

- **Cut every word that does no work.** If the sentence survives without a word, the word goes. "In order to" is "to". "It is important to note that" is nothing.
- **Use the short, everyday word.** "Use", not "utilize". "Help", not "facilitate". "Do", not "perform". A long word has to buy its length with precision.
- **When a rule makes a sentence worse, fix the sentence another way or leave it alone.** A sentence that follows every rule and sounds like a machine wrote it has failed.

The codebase is the word list. Write the real symbol, file, column, flag, or command name, not a synonym or a description of it. Write `orders_clean`, not "the cleaned orders table".

Don't invent jargon. Use the words an analyst would say out loud: "move", "delete", "a budget that only decreases", not "evacuate", "ratchet", or "endgame". A named pattern is fine when the doc says what it means the first time. Propose a new offender and its replacement as an addition to `unslop`'s abstract-metaphor rule in your reply, with the diff. Don't edit that skill.

## Vary the rhythm

A doc can obey every layer and still read as machine-written. Every sentence is clipped short, no view appears anywhere, and nothing is specific.

- Mix sentence lengths on purpose. Short sentences land a point. Longer ones carry a fact with its condition or consequence.
- One thought per sentence does not mean one length per sentence. Split the sentence that carries two thoughts. Keep the long sentence that carries one.
- Have a view where the mode allows it. Explanation weighs trade-offs, so say what you make of them instead of listing pros and cons. Reference stays dry.
- Be specific over sterile. Not "schema changes can cause issues" but "a renamed column fails the build's schema check".

## Pick the mode first (Diátaxis)

One document, one mode. Two questions pick it. Does the content inform action (doing) or understanding (thinking)? Does it serve learning or work?

- Action + learning: **tutorial**.
- Action + work: **how-to**.
- Understanding + work: **reference**.
- Understanding + learning: **explanation**.

Use the compass on a whole document or on one sentence.

**Tutorial: learning by doing.** The learner's success is your job, not theirs. Open by saying what the learner will build, not what they will "learn". Every step produces a visible result, early and often. Tell them what they should see: the expected output, the row count, the chart. Cut explanation to one clause and a link. Stay concrete. Write as "we", in commands: "First, run x. Now, check y."

**How-to: steps to a goal.** Solve a problem a person has, not an operation the machine can perform. Assume competence and skip teaching. Action only: no digressions, no background, no completeness for its own sake. Link those instead. Allow forks and judgment: "If you want x, do y." Name the guide by the task: "How to backfill a partition", not "Partition backfill".

**Reference: facts for lookup.** Only describe. No instruction, no persuasion, no opinion. Be dry, complete, and sure. State facts, options, limits, and errors with no hedging. Mirror the structure of the thing described, so code and docs can be navigated together. Put material where readers expect it. Generate from code where possible, for example a column table built from the schema.

**Explanation: understanding and why.** One bounded topic, readable away from the product. Each title should tolerate an implicit "About..." in front. Anchor on a real why question. Give context: design decisions, history, constraints, alternatives. Opinion is allowed here and nowhere else.

Don't mix modes: no reference tables inside a tutorial, no tutorial hand-holding inside reference, no arguing inside a how-to. Split and link instead.

## Write sentences to the reader (Google developer style)

- Talk to the reader as "you", in the present tense. "Will" only for things that genuinely happen later.
- Say who does what: "the join drops unmatched rows", not "unmatched rows are dropped". Passive is fine only when the actor is unknown or beside the point.
- Write instructions as commands: "Run the notebook from a clean kernel." State facts plainly. Never "should be done".
- Put the condition before the instruction: "To rebuild the table, run `build_orders.py --full`."
- Put the common case first. Exceptions after.
- Sound like a knowledgeable friend. No buzzwords, no figurative language, no "please" in instructions, and never "simply", "easy", or "quickly" in a procedure. If it were simple, the reader would not be here.
- Don't pre-announce ("we will soon support...") and don't start consecutive sentences with the same phrase.
- Link with words that say where the link goes: the page title or a short description. Never "click here". Prefer a sentence of context on the page over a link off it.
- Headings carry the point, not just the topic ("Check the grain before joining", not "Joins"). Sentence case. A task heading is a bare verb phrase ("Rebuild the monthly table"). A concept heading is a noun phrase. One h1 per page, no skipped levels.
- Numbered lists for sequences, bullets for everything else. Introduce a list with a complete sentence. Keep items parallel.
- Code goes in code font. UI elements go in bold. Use serial commas. Drop "etc." and say up front that a list is partial.

## Make statements load one at a time (STE rules)

- One instruction per sentence. One thought per sentence everywhere else.
- Split instructions longer than about 20 words and other sentences longer than about 25.
- Put the warning or condition before the step it guards: "If the file has nulls in `customer_id`, the join drops those rows."
- Keep "the" and "a": "Remove backup file" reads two ways. "Remove the backup file" reads one.
- Give each word one meaning and one job, then keep it. If "check" means inspect, don't also use it for restrain.
- Pick one word per action and stick to it: "run", not "run" here and "execute" there.
- Write procedures as direct commands, never as narration and never in the passive: "Pin the Polars version", not "the Polars version must be pinned".
- Avoid "-ing" words where you can.

## Leave no sentence open to two readings (Global English)

- Keep words like "only" and "not" next to the word they change: "only fails on growth" and "fails only on growth" say different things.
- Break up long noun strings: "the monthly revenue reconciliation check script" becomes "the script that checks monthly revenue reconciliation".
- Make every "it", "they", and "this" point at one obvious thing. Repeat the noun when in doubt. Never use "this" or "which" to point at a whole clause.
- Don't drop verbs: "Phase 1 cleans the events and Phase 2 the sessions" leaves Phase 2 without one. Give it one.
- Keep the small words that show structure, such as "that" in "Ensure that the join key is unique". Never trade clarity for word count.
- Repeat the article in a series when it prevents a misread: "the orders and the refunds", not "the orders and refunds", when they are two tables.
- Say which parts "and" or "or" joins when a sentence can group two ways. "Both...and", "either...or", and "if...then" are free disambiguators.
- Use periods, not semicolons. Replace an em dash with a new sentence.
- Make text in parentheses a full grammatical unit or its own sentence. Never form plurals with "(s)".
- No slashes: write "a, b, or both" instead of "a/b" or "and/or".
- Call each thing by one name, everywhere. A doc that says "the gate", "the ratchet", and "the budget check" for one thing teaches three things. Don't churn what didn't change.
- Skip idioms, colloquialisms, Latin abbreviations, and metaphors.

## Voice and repo specifics

- Apply the **unslop** skill to every doc this skill touches. That skill owns the slop-pattern catalog: AI vocabulary, filler, hedging, formatting tells.
- PR descriptions and commit messages are writing too. Every layer except Diátaxis applies to them. A PR body is a briefing that a reviewer can read in under a minute. Do not paste run logs, row-count dumps, or commit ID lists. Link them.
- Chart titles, axis labels, and dashboard copy are not documentation. Use the **dataviz** skill for those.
- Indent code snippets the way `ruff format` does. Write real paths. Make every count or tree claim true at the commit that lands it, and include the command that regenerates it.

## Worked example

Before:

> Configuration of the monthly revenue check parameters is performed via budget.json. Note that it's important to remember that running with --write, which updates the committed row counts to reflect the current output, should only be done when the source changes. If the count is off, CI fails.

After:

> `check_revenue.py` reads the expected row counts from `expected_counts.json` and compares them with `orders_monthly`. If the counts differ, CI fails. Run `check_revenue.py --write` only after the source data changes and you confirm the new counts.

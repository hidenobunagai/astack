---
name: why
description: "Use for \"why does X work this way\", \"why did we define the metric like this\", \"why is this filter here\", \"why did the number change\", design rationale, past analysis decisions, and data-backed thresholds. Discovers the available MCPs and data sources (git history, notebook history, query logs, dashboards, pipeline runs, issue trackers, docs, chat, and the shared memory), queries each in parallel, and returns a cited, confidence-tiered answer. Use how for how the code runs."
---

# Why

Investigate the motivation and intent behind code, a metric definition, or an analysis choice. The companion **how** skill explains what the code does. `why` explains what forces led to its shape.

## Spawn settings

Agents in this skill use the `Agent` tool. Agents run in the background by default and report back on completion. Wait for every agent before the next step.

- Investigators: `subagent_type` `general-purpose` (they need MCP and CLI access), `model` `haiku`, `effort` `low`. The brief forbids writes. No warehouse writes, no file edits, no git write commands.
- Synthesizer: `subagent_type` `general-purpose`, `model` `sonnet`, `effort` `medium`.

## Operating posture

Operate as a careful, cautious, and precise investigator. Be honest about what you know and what you infer. Read `references/epistemics.md` for the confidence tiers and phrasing. The synthesizer must follow it.

## Step 1. Understand the target and the question

The **target** is usually a function, a SQL model, a metric definition, a filter, a threshold, a notebook section, or a dashboard tile. The **question** is usually a design rationale, a definition choice, a motivating edge case, an external constraint, dead code, or a sweep of history.

If the target is vague, make your best guess from the conversation context (open files, recent edits, the last number discussed). State the interpretation in one line so the user can redirect, then proceed.

## Step 2. Establish the code anchor

Before spawning investigators, build the seed context inline:

- File paths and line ranges, key symbols (functions, models, constants, metric names).
- The recent history of the target, with PR numbers when the commit messages carry them: `git log --follow -n 20 --format='%h %ad %s' --date=short -- <path>`, and `git blame -w -C <path>` for the last change to each line range.
- For each substantive change, the review request's description and discussion, through the team's review tool when the session can reach it.
- Any ticket IDs in commit messages or PR bodies.
- Any notebook or dashboard that mentions the target.

This anchor goes to every investigator and to the synthesizer.

## Step 3. Spawn parallel investigators

**Default to the full parallel investigation.** The goal is a complete coverage map. Record a null result, do not skip the search.

### Discovery

Before spawning, list the available MCPs and CLIs. MCP tools whose schemas are deferred must be loaded first (ToolSearch). Map each source to one evidence category:

1. **Source control history**: git log, git blame, other read-only git views, the team's review tool when reachable, tests, and in-repo notebooks as files. Always spawn. It is the one guaranteed source.
2. **Notebook history**: the notebooks and their version history. Usually part of category 1, but spawn it separately when a project has many notebooks.
3. **Query history**: the warehouse's query log, or saved SQL in the repo, through a warehouse MCP or CLI. Best at what was actually run and what it cost.
4. **Dashboards and metric definitions**: BI dashboards, semantic-layer or metric YAML in the repo, and alert thresholds.
5. **Pipeline and job runs**: orchestrator run logs, data-quality check results, and failure history.
6. **Issue / ticket tracker**: Jira, Redmine, Backlog, and similar. Best at the business reason for a data request or definition change.
7. **Long-form documents**: data dictionaries, metric specs, analysis plans, findings reports (Notion, Confluence, Google Docs).
8. **Real-time team chat**: Slack, Teams, Discord. Best at deliberation that never reached a doc.
9. **Agent memory**: engram through the `engram:recall` skill. Past sessions and saved notes often hold the earlier decision. Always spawn when engram is installed.

Spawn one investigator per category that has a matching source, all in one message so they run together. Each investigator owns exactly one source. Its prompt is `references/investigator-prompt.md` filled in, plus the category playbook `references/sources/<source>.md`, the code anchor, and the user's question. Append `references/sources/incident-postmortem.md` when the target looks defensive (null guards, retries, fallback values, clamps, feature flags, or a backfill).

### When to skip an investigator

Skip only with a written reason in Sources Consulted. Two valid reasons:

- **No source is connected** for that category. Flag it as a gap: "Team chat skipped. No matching MCP connected, so the conversational record was not searchable."
- **The source is provably irrelevant**. Example: "Query history skipped. The target is a static plotting helper with no query path."

If the target is a single commit whose PR description already answers the question, you may answer inline, but only after confirming that the category searches would be redundant. Say so explicitly. This should be rare.

## Step 4. Synthesize

Spawn one synthesizer with `references/synthesizer-prompt.md`. It gets:

1. Every investigator's findings, including null results and skipped categories with reasons.
2. The code anchor.
3. The user's question.
4. `references/epistemics.md`.

## Step 5. Present

Present the synthesizer's output. You may lightly edit it for clarity or add context from the conversation. Do not rewrite the confidence language.

## Output format

The structure is the one in `references/synthesizer-prompt.md`. Its sections are The Question, The Code in Question, What We Found, What We Can Reasonably Infer, Competing Hypotheses, What We Don't Know, Sources Consulted, and Confidence Summary. Keep the confidence separation intact. Sources Consulted has one line per investigator, including the empty and skipped ones, with the reason.

If the question comes before a change to this code, convert the findings into a Preserve / Change / Avoid / Risk list for planning that change. Keep the list to the lineage facts the change must respect.

## Common failure modes

- **Recency bias.** The newest commit is not always the authoritative reason. The current shape often accumulates earlier decisions. Trace back.
- **Mistaking a definition for a decision.** A metric SQL shows how a number is computed. It does not show why that definition was chosen. Look for the decision in the PR, the spec, or the thread.
- **Stopping at the first confirming source.** Check whether the notebook, dashboard, and query log agree with the code and the docs.

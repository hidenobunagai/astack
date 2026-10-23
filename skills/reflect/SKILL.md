---
name: reflect
description: "Mine the current analysis session for durable learnings, such as a wrong join, a missed null check, a warehouse quirk, or a notebook step that should have been a function, using three parallel review agents, then route each learning to an edit on an existing skill. Use when the user says reflect or /reflect."
---

# Reflect

Mine the current conversation for durable learnings, then route each one into a skill edit.

Invoke this when the user says "reflect" or "/reflect". Skip it when the conversation is trivial, off topic, or already covered by a skill the session followed correctly. One-off events are not learnings.

## Panel note

This panel uses Claude models only, so vendor diversity is not available. Each reviewer has a distinct lens (judgment, tooling, divergent), and the models are mixed across `sonnet` and `haiku`. The lenses are what keep the findings from repeating.

## 1. Locate the active transcript

Claude Code stores each session as a JSONL file in `~/.claude/projects/<slug>/`. The slug is the workspace path with its separators (and `.` and `:`) replaced by `-`. The exact form differs by OS, so list `~/.claude/projects/` and pick the folder whose name matches the workspace path. For `/path/to/project` the slug is `-path-to-project`.

Look only in this workspace's slug directory. Do not glob across `~/.claude/projects/*/`. That reads private sessions from unrelated projects.

```bash
ls -t ~/.claude/projects/<slug>/*.jsonl ~/.claude/projects/<slug>/*/subagents/*.jsonl 2>/dev/null | head -10
```

For each candidate, check the first user message. Take the file whose opening user message matches this conversation's first request. If none matches, pass a short digest of the session instead.

## 2. Spawn three reviewers in parallel

Send one message with three `Agent` calls. Each uses `subagent_type` `general-purpose`, because the reviewers need MCP and CLI access to check the tickets, notebooks, and query logs the transcript names. The brief says "do not modify files".

| Lens | Model | Effort | Template |
| --- | --- | --- | --- |
| Judgment | `sonnet` | `medium` | `references/judgment-reviewer.md` |
| Tooling | `haiku` | `low` | `references/tooling-reviewer.md` |
| Divergent | `haiku` | `medium` | `references/divergent-reviewer.md` |

Pass each template verbatim. Replace the transcript path or digest where the template marks it. The reviewers return their findings as their agent results. Wait for all three before step 3.

## 3. Synthesize

One `Agent` call with `subagent_type` `general-purpose`, `model` `sonnet`, `effort` `medium`. Pass `references/synthesizer.md` verbatim, with each reviewer's full output inlined where marked. It returns an Accepted, Rejected, and Backlog list. It may spot-check citations through MCP or by reading files. It must not write.

## 4. Structural enforcement check

Move any Accepted item that a lint rule, a validation script, a schema, or a runtime check would enforce more reliably into Backlog. A check that runs every time beats a sentence that someone must remember. See the **principle-encode-lessons-in-structure** skill.

## 5. Apply

Present the synthesizer's full Accepted, Rejected, and Backlog output. Wait for explicit approval before you apply any Accepted edit. The user picks the subset and may change a routing. Skill changes affect every future session, so do not apply them automatically.

Follow each approved row's routing:

- **Trivial edit to an existing skill** (a bullet, a tightened sentence, a stale fact): the parent edits the file directly.
- **Substantive edit to an existing skill** (a new section, a new table, more than about 10 lines): hand it to the `authoring-a-skill` playbook of the **analyst-mode** skill, and run its draft, test, and iterate loop.
- **`tune description: <skill path>`** (the skill exists but did not trigger when it should have): hand it to the `authoring-a-skill` playbook and run its description-tuning loop.
- **`new skill: <kebab-name>`**: hand the creation to the `authoring-a-skill` playbook. Do not invent the layout ad hoc.

Each skill's `name` must match its directory name. If the repo has a skill validator, run it on every touched skill before you call the edit done.

Backlog items go into the reply. This plugin has no tracker of its own. File them only where the user names one.

## 6. Summarize for the user

A short list with no preamble:

- Edits applied: `<skill path>`, with one line on what changed.
- New skills created: `<skill path>`, with one line each. This is rare.
- Backlog: the item title and the mechanism it suggests, one line each.
- Dropped: one line per rejected finding, with the reason from the synthesizer.

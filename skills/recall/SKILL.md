---
name: recall
description: "Reconstruct recent working context on an analysis, pipeline, dashboard, or dataset from your own chat history, live state (git, PRs, job runs), and the shared record (shared memory, run logs, data-quality incidents, user reports), then hand back a tight current-state brief. Use for 'recall my work on X', 'catch me up', 'where did I leave off', before starting or resuming analysis work."
---

# Recall

**Before you start or resume work, you rebuild the user's recent working context and hand back a tight capsule of where things stand now and what to do next.**

Keep it tight and on-topic. Read only what the in-scope threads need, then stop.

Your context lives in two records. Your own chat history holds what you did and decided. The shared record holds everything that happened around the same data under other names: the numbers that were questioned, the fixes that shipped and got reverted, the pipeline runs that still fail. That second record is what the **why** skill searches, across source control, the issue tracker, chat, long-form docs, and run logs. An analysis with a long history keeps most of its story there, so don't reconstruct it from your transcripts alone.

Transcripts live at `~/.claude/projects/<slug>/<session>.jsonl`, where the slug is the workspace path with its separators (and `.` and `:`) replaced by `-`. The exact form differs by OS, so list `~/.claude/projects/` and pick the folder whose name matches the workspace path. Every line is one event.

1. Classify, then route. One specific prior chat to resume is the **session-pickup** playbook of the analyst-mode skill, not this. Turning a habit into a reusable skill is a different task. Recall loads working context across recent chats before you act. If the user already gave you a full state capsule (paths, branch, the change), use it and skip the mining.
2. Lock the scope before searching. Pin the window ("recent" is a real range, default the last 7 days), the topic if named, and the workspace (default the active one. Never read another project's transcripts without being asked). State the scope back. Never quietly turn "all" into "recent N".
3. Fan out across your chat history. Spawn parallel subagents with `subagent_type` `general-purpose`, `model` `haiku`, and `effort` `low`, each taking a slice of the corpus. Tell every subagent to order candidates by real modification time (`ls -t`) and never by session ID, grep the topic first and then read only the matching chats and only their relevant regions, and skip the current chat plus obvious noise (subagent, eval, and test chats). Each returns the same schema, one block per chat: topic, the user's goal, decisions, open threads, struggles and corrections, and artifacts (PRs, notebooks, tables, jobs, branches), each citing the session ID. For one or two chats, skip the fan-out and search directly. The raw transcripts stay in the subagents. The main thread gets only their findings.
4. Sweep the shared record whenever the topic names a dataset, table, metric, dashboard, pipeline, or notebook. This is the default, not a judgment call, and "my work on X" does not exempt it. When engram is installed, search it once with the `engram:recall` skill using the user's own wording. Then hand the rest to the **why** skill's source investigators, but steer their question from "why was this built this way" to "what's the current state, what's been tried and didn't hold, and what are the numbers people are still questioning". Use the **why** skill's per-source playbooks, run the investigators in parallel with the chat-history mining, and inherit its posture: one investigator per source, null results are findings, skip an unavailable server and say so. Fold what comes back into the brief. Skip this step only for pure activity recall with no named target ("what did I do this week"), where your own history and live state are the entire answer.
5. Verify against live state. Take the PRs, branches, and tickets that the mining and the sweep surfaced and check them with `git log`, `git status`, and `gh` in read-only mode. Check the latest run of each pipeline or scheduled job. When the answer hinges on what an agent actually did (the tools it ran, files it read, errors it hit), read the full transcript, not just a trimmed local copy.
6. Write the brief to the contract below. Group by thread. Stay on the named topic.

## Output contract

Lead with the capsule, then the thread status, then the problems, then the next move. Deeper detail goes below or gets cut.

- **Capsule.** At most 5 bullets. What this work is, which numbers it produces, and where it stands overall.
- **Threads.** One line each, prefixed with exactly one status tag: `[merged PR #N]`, `[open PR #N]`, `[in flight <branch>]`, `[verified, uncommitted]`, `[reverted PR #N]`, `[run, output not checked]`, or `[planned, not started]`. A thread with no tag is not done yet, so tag it.
- **Problems.** At most 5, the recurring ones. Include the numbers people keep questioning and any fix that shipped and was reverted, so the next attempt starts where the last one failed.
- **Next move.** The single most useful next action, concrete.

An adjacent dataset or ticket stays out unless it blocks this one. When the capsule and thread lines outgrow a screen, cut detail before you cut threads. Write the brief through the **unslop** skill, cite chat findings by session ID and shared-record findings by their source (PR number, ticket ID, memory record, run log path), and sanitize private context, such as customer data, before any public output.

**Reply:** the brief, to the contract above.

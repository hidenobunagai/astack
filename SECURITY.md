# Security and trust notes

astack is a Claude Code plugin. Installing it means Claude Code will run its
hooks and load its skills in your sessions, so this page states plainly what
the plugin does on your machine.

## What runs

- A `SessionStart` hook (`hooks/analyst-always.mjs`) prints the analyst-mode
  instructions into the session at startup, resume, `/clear`, and compaction.
  It reads no files and writes nothing.
- A `PreToolUse` hook (`hooks/guard-data.mjs`) inspects the target of `Read`,
  `NotebookRead`, `Grep`, and `Bash` calls and blocks reads of data files and
  raw notebooks, as described in the README. It reads only the hook input on
  stdin, keeps no state, and writes nothing.
- Skills are Markdown playbooks. Some playbooks ask the agent to run ordinary
  project commands (`uv`, `git`, `node`, and similar) through Claude Code's
  own tools, under Claude Code's permission prompts. The optional statechart
  and formal verification skills run a local Java process (TLC) against a
  model file you point them at, using a `tla2tools.jar` you installed or one
  fetched by mise on first use.

## What does not happen

- No telemetry, no phone-home, no external network calls from the hooks or
  scripts in this repository. Skill content reaches a model only as part of
  Claude Code's own API traffic, like any other prompt text.
- The data guard never opens the files it blocks; it matches on paths and on
  the text of shell commands only.
- Nothing in the plugin uploads your data anywhere. The working model is the
  opposite: the agent never sees real data, and every run on real data is
  handed to you as a run request.

## Limits of the data guard

The guard is a seatbelt, not a wall. It cannot see what a script loads once
the script runs, and it only matches common reader commands in `Bash`. For a
hard boundary, also deny the data directories in the project's
`.claude/settings.json`, as shown in the README, and keep real data out of
any directory the agent can read.

## Reporting a problem

astack is provided as-is, with no support, as the README says. If you find a
case where the guard lets a real-data read through, or blocks something it
should not, an issue with the exact tool call and file path is the most
useful report; please do not attach real data to it.

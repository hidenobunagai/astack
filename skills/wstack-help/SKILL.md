---
name: wstack-help
description: "Help a user pick the right wstack skill, analyst-mode playbook, or principle for a data analysis task, such as EDA, a metric move, a notebook, a pipeline, or a chart, and word a first prompt for /wstack:analyst-mode. Use for /wstack:wstack-help or when the user asks which skill to use."
---

# wstack help

Answer the user's question about wstack, give them a prompt they can send, and point to the file the answer came from. This is a help question, so do not start the analysis. A run spends real tokens, so let the user send the prompt.

A message that asks for work, such as "analyze why signups fell last week", is not a help question. The skill `wstack:analyst-mode` runs that work, but it cannot load on its own. Tell the user to type `/wstack:analyst-mode <task>`.

This file maps questions to skills and playbooks. Those files own the details. Read the file you route to before you quote it, and trust it when it disagrees with this map.

## Find out what they need

Infer the need from the message and the conversation. A named situation, such as "which skill checks a join?", goes straight to its section. If the need is still unclear, ask one multiple-choice question with `AskUserQuestion`. Offer these options, then answer only the section they pick:

- Get started
- Start an analysis with `/wstack:analyst-mode`
- Pick a skill or playbook for a data task
- Fix a run that went wrong
- Make wstack my own

Check the repo state that changes the answer. Mention it only when it matters:

- No `pyproject.toml` or `uv.lock` in the analysis repo means the reproduction rules have no pinned environment yet. Offer `uv init` before the first re-run.
- No `.git` directory means the folder is not a git repo. The PR steps need `git init` first. A remote is optional.

## Get started

1. Install the wstack plugin the way your Claude Code setup installs plugins.
2. Start a real analysis with `/wstack:analyst-mode`, a question, the data source, and a check that can pass or fail.

Installing changes nothing until the user types a skill. Most wstack skills load only when the user types `/wstack:<name>`, or when analyst-mode runs them. The principle skills (`principle-*`) can also load on their own when their description fits the work.

If cost is the worry, say where the tokens go. Analyst-mode spends extra tokens on subagents and review panels. Use `/wstack:analyst-mode` for work that needs rigor. A question you can answer with one query needs no mode at all.

## Start a task with `/wstack:analyst-mode`

Analyst-mode matches the task to a playbook, copies the playbook's steps into the todo list, and runs the other skills as the steps need them. A step it skips stays in the list as `skip: <reason>`. A good prompt states the question, the grain or data source, and the done check. It does not list skills, because a hand-written order tends to drop steps. Read `references/prompting.md` before you help word a prompt. Example prompts are in `references/recipes.md`.

If the mode drifts after several turns, type `/wstack:analyst-mode` again with the task. Say "new task" when the subject changes, so the mode does not treat the message as the next step of the last one.

## Pick a skill

The default answer is `/wstack:analyst-mode`, which runs most of the other skills when its playbook needs them. Name a skill directly when the user wants more or less of something than the playbook gives. Read the skill before you recommend it, and give one example prompt.

| The user wants to | Skill |
|---|---|
| Do any non-trivial analysis with rigor | `/wstack:analyst-mode` |
| Check that the agent understood the question and the decision before it queries | `/wstack:in-your-own-words` |
| Sharpen a vague analysis ask before starting | `/wstack:sharpen` |
| Know how a pipeline, notebook, or module works now, or where new code should live | `/wstack:how` |
| Know why a metric or filter is defined this way, or where a number came from | `/wstack:why` |
| Pick a statistical method for a retail question: an A/B or store test, a promotion effect, segments, churn or CLV, a survey, a regression, a forecast, price elasticity, or baskets | `/wstack:retail-analytics` |
| Understand a pipeline, model, metric, or dashboard in plain terms | `/wstack:teach` |
| Catch up on their own recent analysis work on a topic | `/wstack:recall` |
| Catch up on what changed in this chat since their last message | `/wstack:catch-up` |
| Find what a change to a table, column, or metric could break downstream | `/wstack:blast-radius` |
| Settle table shapes and module shape before code that crosses a function boundary | `/wstack:architect` |
| Get several attempts at one analysis merged into the best one | `/wstack:arena` |
| Run parallel checks over data slices or datasets, and get one report | `/wstack:swarm` |
| Have different models review an analysis and try to break it | `/wstack:interrogate` |
| Fix a wrong number test-first when a cheap local test exists | `/wstack:tdd` |
| Vet a runtime measurement before reporting a speedup | `/wstack:benchmark-checklist` |
| Run a large or cross-cutting analysis, or one a human reviews after stepping away | `/wstack:figure-it-out` |
| Keep a decision log during a long or unattended run | `/wstack:show-me-your-work` |
| Turn what a finished task taught into skill edits | `/wstack:reflect` |
| Stop agents from repeating the same mistake in this repo | `/wstack:correct` |
| Strip comments from code or notebooks before review | `/wstack:no-comments` |
| Clean AI tells out of prose, such as a report or a chart caption | `/wstack:unslop` |
| Write docs, methods notes, a readme, a PR description, or a commit message to a standard | `/wstack:technical-writing` |
| Hear the last reply again in plain words | `/wstack:plain-words` |

Close calls:

- `how` explains the data flow and the code. `why` explains the reasons and the history. `teach` runs one or both and explains the result plainly.
- `arena` gives every worker the same brief and merges the best parts. `swarm` splits work into slices or a race and returns one report.
- `architect` settles shapes before the code. The **prototype** playbook builds a throwaway sketch to settle a design by running it.
- `recall` rebuilds context across recent chats. `catch-up` covers only this chat since the user's last message.

## Pick a playbook

Playbooks are step lists inside `/wstack:analyst-mode`. They have no slash command. Describe the task, and analyst-mode picks one. These are the routes:

| The user wants to | Playbook |
|---|---|
| Get a cited answer to a read-only question | investigation |
| Know why a metric moved | metric-investigation |
| Take a first look at a dataset they have not seen | eda |
| Run checks on a dataset or pipeline output | data-quality-check |
| Fix a wrong number, a broken pipeline, or a failing notebook | bug-fix |
| Speed up a slow query, transform, or notebook | perf-issue |
| Push one metric up over many attempts | hillclimb |
| Build new analysis code, a transform, or a pipeline step | feature |
| Restructure code with the output unchanged | refactoring |
| Settle a design or a fork with a throwaway sketch | prototype |
| Turn an exploratory notebook into a re-runnable script | notebook-to-pipeline |
| Design, render, and check a chart or dashboard | visualization |
| Plan work that spans phases or stacked PRs, without implementing it | multi-phase-plan |
| Drive one long task to a checkable finish | autonomous-run |
| Stop cleanly with a resume checkpoint | pause-safely |
| Resume another agent's work from its transcript or branch | session-pickup |
| Write or edit a SKILL.md | authoring-a-skill |

Close calls:

- **investigation** answers a question with evidence and changes nothing. **metric-investigation** decomposes one metric's move. **eda** profiles a dataset with no question yet.
- **tdd** is a test-first fix for one wrong number with a cheap local test. **data-quality-check** is a standing set of checks on data or pipeline output.

## Principles

The principle skills are one-rule skills that analyst-mode reads and cites in its replies. The user rarely types them. They steer with the names instead, as in "apply prove it works, show me the real output." Typing a principle's slash command, such as `/wstack:principle-prove-it-works`, loads that one on demand.

## Fix a run that went wrong

| Symptom | Fix |
|---|---|
| The mode stopped applying after a few turns | Type `/wstack:analyst-mode` again with the task. |
| A question got treated as the next step of the last task | Say "new task", or say the turn does not need the mode. |
| A number came with no row count or baseline | Ask for the row counts before and after each join, and the baseline, per explain-the-number. |
| A notebook result changed on re-run | Send a run request for two clean runs that print checksums, per reproduce-from-clean-state. |
| Parallel agents overwrote each other | Give each writer its own worktree (`isolation: "worktree"`, or `git worktree add <path>`). |
| Runs cost more than expected | See the cost paragraph under Get started. |
| The reply claims success from a green check | Ask for the actual output values, not the status. That is the prove-it-works principle. |
| An overnight run moved but finished nothing | Give it a check that can pass or fail, not a duration. Use `/wstack:show-me-your-work` to audit it. |
| A skill did not load on its own | Most skills load only when typed as `/wstack:<name>`, or when analyst-mode runs them. |

For a run that drifts, `references/prompting.md` has one-line steers.

## Make wstack my own

- `/wstack:reflect` after a session turns its lessons into skill edits that the user approves.
- `/wstack:correct` makes a repeated mistake impossible in this repo, starting with architecture, then types, then a check.
- Ask analyst-mode to author a skill for a workflow the user repeats. It runs the authoring-a-skill playbook.
- Fix a misbehaving skill in its own PR, not inside the analysis where it went wrong.

## Reply

Lead with the answer. Give at most one example prompt in a code block, adapted from `references/recipes.md` when one fits. Then name the file the answer came from. Keep it short unless the user asked for the whole map.

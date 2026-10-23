# Prompts worth copying

Swap in the real paths, tables, and done checks. Informal wording works.

## Understand

- `/wstack:analyst-mode restate the question behind this ticket and the grain of the table it points at, in plain words.`
- `/wstack:in-your-own-words <long or messy ask>`
- `/wstack:sharpen <your analysis task>`
- `/wstack:analyst-mode investigate why weekly active users fell in March. give me what we know, the data you used, and your best hypotheses. do not change any code yet.`
- `use /wstack:how to understand the orders pipeline. then use /wstack:why to find out why the revenue filter excludes refunds.`
- `/wstack:recall my work on churn cohorts from last week, then read the notebook in analysis/churn.py.`
- `/wstack:teach me why this metric uses distinct users and not events. what did we trade off?`

## Explore and measure

- `/wstack:analyst-mode first look at data/raw/events.parquet. grain, keys, null rates, time coverage, and the questions it raises. read only.`
- `/wstack:analyst-mode why did conversion drop 4 points in week 14? confirm the move is real first, then split it by channel and reconcile the parts to the total.`
- `/wstack:analyst-mode write checks for the daily_sales output: unique order_id, no null amounts, row count within 5 percent of the 4-week average. make it a script I can re-run.`
- `/wstack:analyst-mode the cohort query takes about 40 seconds on the full table. measure it, explain the plan, and show me before and after.`

## Build

- Bug: `/wstack:analyst-mode the revenue total is off by 2 percent against finance. reproduce it first, find the first step where the number diverges, then fix it and show the reconciliation.`
- Bug with a cheap test: `/wstack:analyst-mode reproduce the duplicate-row bug first. if there is a cheap local test, /wstack:tdd it. then fix and re-run.`
- Feature: `/wstack:analyst-mode add a 7-day rolling retention column. the existing columns stay byte-identical. verify both.`
- Notebook to pipeline: `/wstack:analyst-mode turn analysis/explore.ipynb into a script that reproduces its numbers on the same input. convert it first, then prove parity.`
- Refactor: `/wstack:analyst-mode move the cleaning steps into one module, zero change to the output. record the current output first and prove it is unchanged after.`
- Chart: `/wstack:analyst-mode build the weekly churn chart for the ops review. the question is which plan is leaking users. draft it on synthetic data, then give me a run request that renders the real chart and checks every plotted value against the source.`

## Design and plan

- `/wstack:analyst-mode prototype three ways to define an active account for the dashboard. show a sample output for each so I can compare.`
- `/wstack:analyst-mode we need a shared customer table. /wstack:architect the grain and keys first, and answer open questions with small queries. let me review before proceeding.`
- `/wstack:arena <the metric definition task>` runs several attempts and merges the best one.
- `/wstack:analyst-mode turn this design into a plan. small verifiable steps, each with its own check. write the plan, do not implement it.`

## Review and ship

- `/wstack:interrogate the whole analysis, skeptically. do not change anything yet. flag only real validity problems, not style.` Read the dismissals too.
- `/wstack:swarm check every table under warehouse/marts against its row count and key uniqueness. one worker per table. one report.`
- `/wstack:analyst-mode open the PR. small ordered commits, evidence in the description, row counts and reproduced values included.`

## Away and back

- `/wstack:analyst-mode going to bed. port the cohort analysis to the new schema in a fresh worktree off main. done means the synthetic cohort tests pass and a parity script is ready for me to run in the morning. keep a decision log. do not ask me before committing. if you are stuck after a few hours, stop and write up why.`
- `/wstack:show-me-your-work catch me up on what you did last night.` Read its Attention section first.
- `/wstack:catch-up` gives the short version of what changed in this chat since the last message.
- `/wstack:plain-words` restates the last reply in plain words.

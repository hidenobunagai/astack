---
name: correct
description: "Find the mistakes agents keep repeating in this analysis repo (wrong grain, hard-coded dates, notebooks with stale outputs, data committed by accident) and make each one impossible. Try architecture first, then types, then a lint or check whose error names the fix, then a test, and write docs last. Prove each check fails on a real past mistake. Repeat each time the operator corrects you. Use for /wstack:correct."
---

# Correct

The operator keeps correcting agents in this repo for the same mistakes. Change the repo so the next agent can't make them.

Assume every contributor is an agent that sees only the files it opened, copies the nearest example, and takes the shortest path that runs. Design the repo so a change that looks right from one file is right for the whole repo.

## Find the mistake classes

First, read recent commits, reverts, review comments, the agent instruction file, and comments that explain workarounds. Group the mistakes into classes. A class counts once it has happened twice. Typical classes in data repos include a join that changes the grain, a date or path typed into a function body, a dataframe library mixed into a Polars project, a notebook committed with stale outputs, a CSV or Parquet file committed by accident, a metric defined twice with two numbers.

## Fix each class at the highest level that works

1. **Eliminate it with architecture.** Give each piece of state one owner and each task one supported way. Put each metric definition in one module that every report imports. Hide internals so the wrong import fails. Replace hand-synced lists with one source of truth. Delete old ways and dead code an agent would copy.
2. **Enforce it with types so the bad state can't be written.** Use `ty` type annotations for frame schemas where the project can afford them. If bad code still passes, add a `ruff` rule or a CI check whose error names the file, function, or helper to use instead. A `ruff` lint can ban an import, and a small script can reject a committed data file. If the pattern is already common, fail only when a change adds more.
3. **Test the behavior.** Fix or delete any test that still passes when the behavior it checks breaks, or that fails when only the internals change. A test on a small inline frame is the usual shape (the **tdd** skill).
4. **Write docs or agent rules last, only for judgment calls.** Nothing fails when an agent skips them.

## Fix and prove

Then fix the most frequent classes now, one commit each with `git commit -m "..."`. Prove each new check fails on a real past mistake: reintroduce the mistake on a branch, run the check, and record the failure. Run the same command locally and in CI. Exceptions go on the offending line with a reason, an expiry date, and a human's approval.

## Keep the rule table

Last, keep a table in the agent instruction file (`CLAUDE.md`, or `AGENTS.md` when no `CLAUDE.md` exists) that pairs each rule with what enforces it. When the operator corrects you, fix the mistake and add the rule. If the rule was already there and nothing enforces it, that's a repeat, so fix it at the highest level in the same change. Drop a rule once its mistake can't happen.

**Reply:** each class with its evidence, the level you picked, and why a higher level didn't work.

---
name: figure-it-out
description: "Design an auditable playbook when no narrower one fits: a large migration, an ambitious multi-part analysis or pipeline change, or work a human reviews after stepping away. Scales rigor to the task, runs a hypothesis loop, and logs decisions. Use for /astack:figure-it-out or 'figure it out'."
---

# Figure it out

When the task matches no playbook, design one. The deliverable before any code is the workflow itself: a sequence of phases that scales rigor to the task, runs the scientific method, and leaves a decision trail a human can audit after stepping away.

## Start

Open a todolist whose first item is to read the Principles section of the **analyst-mode** skill. Then add the phases below as todos.

## Phase A: Frame

Ground first, then commit. Don't start the run until you can state:

- The definition of done as a falsifiable predicate (the **principle-prove-it-works** skill). For data work, a predicate reads like "the new `orders_monthly` matches the old table on all 36 months within 0.1 percent, and the row count per month is unchanged".
- The decision the analysis serves, and the metric definition (the **principle-define-the-question** skill).
- Scope, quantified: rough units and effort, plus the blockers grounding surfaced. Count the tables, rows, and downstream consumers.
- The rigor level, biased high. One-way doors and high blast radius get more. Reversible low-stakes steps get less. Rigor is gates and artifacts, not "try harder".

Present the framing and tradeoffs before committing to a long run. Reversible work proceeds (the **principle-never-block-on-the-human** skill), but a multi-hour run earns one checkpoint.

## Phase B: Design the workflow

Decompose into atomic, independently-landable units. Sequence riskiest-unknown-first. Scaffold and verification come before features (the **principle-foundational-thinking** skill).

- Build the verification harness before the work, with the baseline captured from the pre-change state, so the check reads as "old value vs new value". Save the old output table or metric as a file before you change anything.
- For one-way-door design decisions, run the **architect** skill (it runs **arena**). Skip it for mechanical work whose shape is already concrete. A second arena over a settled design is over-engineering (the **principle-laziness-protocol** skill).
- Decide what fans out. Parallelize only across seams, and give each writing worker its own worktree (`isolation: "worktree"`) so writers do not share a working copy. Don't over-fan. Model and effort defaults: code work `sonnet` at `medium`, judgment `opus` at `high` and the hardest changes at `xhigh`, verification `sonnet` at `high`, search and trivial mechanical work `haiku` at `low`.
- Write the designed phase list down. That list is what the human reviews.

Then execute the design. Add its steps to the todolist as concrete items between the Phase C and Phase D entries. Run each under the Phase C loop discipline, and weave the Phase D log through them, a row as each step lands, rather than saving the whole trail for the end.

## Phase C: Run the loop

Each unit is an experiment. State the hypothesis, make the smallest change, measure against the predicate on the real artifact, keep it if it advanced, revert it if it didn't. Apply the **principle-sequence-verifiable-units** skill, verifying each unit before starting the next instead of batching checks at the end.

- Verify by inspecting the artifact, never a self-report. Re-run the pipeline or notebook from a clean process and read the output values: yours on synthetic data, the human's on real data through a run request. When something passes too easily, suspect the observation method before the system. A check that compares a table to itself passes every time.
- Pair delegated work with a judge. If a worker games the gate, reset and harden the contract. If the gate itself is wrong, fix the gate in its own change rather than routing around it.
- A verdict is VERIFIED, NOT VERIFIED, or INCONCLUSIVE. Inconclusive is not a pass. Don't hide a negative.

## Phase D: Keep the audit trail

Log the run via the **show-me-your-work** skill. figure-it-out's work is usually ambitious enough to commit the trail so the reviewer can read it in the PR. The trail plus the diff is what lets the human come back and trust the work.

## Phase E: Verify and hand back

Check the whole against the Phase A predicate on the real output, not just the harness. Encode any recurring correction as a gate, a lint rule, a data check, or a script (the **principle-encode-lessons-in-structure** skill).

**Reply:** the playbook you designed, the rigor level and why, the decision-trail path, what's verified against the predicate, and what's still open.

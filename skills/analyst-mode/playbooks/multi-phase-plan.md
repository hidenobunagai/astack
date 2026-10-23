### Multi-phase or multi-PR plan

**You own the plan, not the code. The plan is a checklist an owner runs box by box, and the operator audits it from the evidence.** The plan is the deliverable. Do not implement.

1. When the change is one or two files with an obvious approach, skip the plan. Say so and stop.
2. Settle open questions by prototype before you write. Run the prototype playbook (`playbooks/prototype.md`) for each. Keep the branch, the commit ID, and the rendered outputs for Appendix A. Ask the operator only about a product or preference call that no run can settle, and give options (the **principle-never-block-on-the-human** skill).
3. Explore with subagents, one per area, with `model: "haiku"` and `effort: "low"` (the **principle-guard-the-context-window** skill). Each returns file pointers, conventions, test commands, data sources, and entry points. No pasted dumps.
4. Write the plan file under `docs/`, unless the operator names another path. Name the execution playbook in "How to read this." Use autonomous-run for a single owner working through the plan. Use the operator's own cadence for a standing program.
5. Write the plan with these parts, in this order. Keep every heading, and drop none. Each heading states the task or the finding.
   - **Summary.** Under ten lines. What changes, for whom, the rule it enforces, and the PR ids in order.
   - **How to read this.** One box is one unit of work. Check a box only when its evidence exists: a file, a log line, an output table, a rendered image, a test run, or a commit ID. The body is a how-to. The appendices explain and record.
   - **Checklist.** Checkbox items in dependency order. Each PR gets a section with these sub-blocks:
     - **Depends on.** A PR id, or None.
     - **Files.** Create, edit, or delete, with paths.
     - **Build.** One change per item. Name the function or table.
     - **You see.** One observable result, with its exact output.
     - **Verify.** Three parts, described below.
     - **Review gate.** Required when the PR changes a published chart, report, or dashboard. Otherwise write "None."
     - **Merge.** Who merges, and when.
   - **Verify.** Tests alone are not enough. A PR is verified when its clean-state check, its output check, and its numeric check are all checked. The clean-state check re-runs the code from a fresh process on the agreed input and reads the values. The output check compares the new output with the expected output: row counts, key sets, and a diff against the baseline. The numeric check names each number and the rule that fails it, for example "row count equals the baseline" or "revenue total within 0.1% of the source." A chart or dashboard PR adds a render check: the image is rendered, and each plotted value matches the source.
   - **Appendices.** A: prototype evidence, with each question answered and each question still open. B: alternatives rejected, and why. C: risks, each with its PR and what the owner watches. D: links and reading list, including which PRs read the **how** and **interrogate** skills, and the trail per the **show-me-your-work** skill.
6. Write under the **technical-writing** skill, then apply the **unslop** skill. The body is one how-to. Appendices hold explanation and reference. No long dashes. No colon used as a mid-sentence connector.
7. Check the plan by reading it against steps 5 and 6. Every heading is present, every box has an evidence line, and no placeholder is left unfilled.
8. Hand back. Post the plan path, the PR ids with their dependencies, and the set of review-gated PRs, then stop. Execution starts on the operator's explicit go, under the execution playbook the plan names.

**Reply:** the plan path, the PR ids with their dependencies and the review-gated set, what the prototypes proved, and what stays unproven.

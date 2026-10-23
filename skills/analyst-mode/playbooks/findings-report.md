### Findings report

**You own the write-up. Put the answer first, trace every number to code, and say how sure you are.** This playbook turns finished analysis into a report for a reader. It changes no data. Use the **technical-writing** skill for structure and the **unslop** skill for prose.

1. State the decision and the reader. Write one sentence on what the reader will decide with this report. Use the **principle-experience-first** skill to choose what goes on the first screen.
2. Write the answer first. One or two sentences: the finding, its size, and its confidence label. A reader who stops here still has the result.
3. Gather the evidence. For each claim, record the number, the row count it rests on, the comparison baseline, and the script path and command that produced it. A number without a row count and a baseline is not ready. Use the **principle-explain-the-number** skill.
4. Write the method in three lines: the data source and window, the metric definition, and the one check that could have broken the result.
5. List the caveats and what would change the conclusion. Name the assumption most likely to fail, and the result that would overturn the finding.
6. Label confidence per claim. High: the move exceeds its spread, it reconciles, it re-runs from a clean process, and an independent source agrees. Medium: it reconciles on one source with no independent check. Low: inferred, with a suspect not yet ruled out.
7. Write the next steps. Each step names a check still open or an action for the owner. Mark any change to a shared table, a schedule, or an outside recipient for the human to approve.
8. Trace every number. Each figure in the report maps to one script path and one re-run command. Re-run it from a clean process and confirm the printed value matches the report. Use the **principle-reproduce-from-clean-state** skill.
9. Edit for the reader. Apply the **technical-writing** skill to the structure, then the **unslop** skill to the prose. Charts go through the visualization playbook (`playbooks/visualization.md`) before they enter the report.

**Reply:** the report path, a trace table with one row per figure (value, script path, re-run command), and what you did not verify.

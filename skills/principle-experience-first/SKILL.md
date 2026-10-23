---
name: principle-experience-first
description: "Apply when deliverable shape comes up: which charts to include, what a dashboard shows first, how a report is organized, or how much detail a notebook shows. Choose what the reader of the chart, report, or dashboard can act on over implementation convenience, and ship fewer, clearer views."
---

# Experience First

When implementation convenience conflicts with the reader's understanding, choose the reader.

- Every chart, table, KPI tile, and filter must justify itself by the decision it supports.
- Ship less, ship better. Three views that answer the question beat ten that do not.
- Prototype before committing. A rough plot or a throwaway notebook cell is cheaper to change than a scheduled dashboard.
- Get the details right: axis labels with units, a sort order that matches the message, the time window in the title, a visible note on missing data, and a clear empty state. Use the **dataviz** skill for chart design.
- Check accessibility. Contrast must meet 4.5:1 for text, and color must never be the only carrier of meaning. The visualization playbook in the **analyst-mode** skill has the full checklist.
- Tighten the core loop. Every view should serve the question the analysis set out to answer (see **principle-define-the-question**) or get out of the way.

The user is whoever consumes the work. For a dashboard that is the stakeholder who reads it. For a notebook it is the colleague who reruns it, and the engineer who maintains the pipeline next. Weigh their experience the same way, and explain impact from their perspective.

Foundations should serve the experience. Foundational thinking governs the sequence of work. This principle governs the target.

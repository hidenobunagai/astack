# Issue and ticket tracker (Linear, Jira, GitHub Issues)

## What this source contains

- Issues about data requests, metric definitions, and analysis questions
- Comments that record the scope or the decision
- Labels and milestones that show why the work was prioritized
- Parent and child issues, and linked PRs

The tracker often holds the business reason: "Finance needs the refund-adjusted number for the close."

## How to search it

1. **Start from the IDs.** Fetch any ticket ID found in commit messages or PR bodies. Read the full thread.
2. **Search by term.** Search the metric name, the table name, and the business term. Try several phrasings.
3. **Walk up.** If you land on a child issue, read its parent.
4. **Check labels and milestones.** Labels such as `data-request`, `metric-change`, or `customer-request` show the kind of reason.

## What good evidence looks like

- A problem statement: "Finance reconciles to the ledger, so refunds must be netted out."
- A comment that records a decision and its alternative.

## Common pitfalls

- **Scope drift.** A ticket may have been reopened with a new scope.
- **Boilerplate.** "Improve data quality" is not a reason.
- **Duplicates.** Follow duplicate links to the canonical ticket.

## What to return

- Ticket ID, title, status, and dates
- The description or comment quoted verbatim
- Labels, parent issue, and linked PRs

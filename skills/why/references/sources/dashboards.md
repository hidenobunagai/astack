# Dashboards and metric definitions

## What this source contains

- BI dashboards and tiles (Looker, Metabase, Superset, Evidence, or similar) and their descriptions
- Saved metric or semantic-layer definitions in the repo (dbt metrics, metric YAML, a metrics module)
- Alert thresholds on dashboards or metrics
- Change history of dashboards and definitions, when the tool keeps it

Dashboards often carry the definition a team agreed on. Their tile descriptions and footnotes often hold the one-line reason.

## How to search it

1. **Find the metric by its business name.** Search dashboards and definitions for the metric's display name, not only its column name.
2. **Read the description and footnotes.** Tile descriptions, dashboard text, and metric notes often state the definition and the exclusion rules.
3. **Check the filters.** A dashboard's default filter can change the population. Record the default filters you find.
4. **Check the definition history.** Use `git log --follow -p -- <metric file>` on the repo files, and the tool's own history if it has one.
5. **Check alerts.** Note the threshold, the owner, and the date it was set.

## What good evidence looks like

- A tile footnote: "Excludes internal accounts since the March audit."
- A metric YAML description that names the decision it supports.
- An alert threshold whose change date matches a documented incident or review.

## Common pitfalls

- **Dashboard and code can disagree.** Refresh timing, time zones, and filters differ. Compare the same window before you call a difference a bug.
- **Stale descriptions.** A description may survive a definition change. Check the date.
- **Screenshots are not sources.** Only the live definition or its text counts.

## What to return

- Dashboard or definition name, tile name, and URL or file path
- The description or footnote quoted verbatim
- Default filters found
- Last modified date and author, when available
- Whether the text states the reason or only the definition

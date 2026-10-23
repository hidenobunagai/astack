# Incident and postmortem context

Add this playbook when the target looks defensive: null guards, retries, timeouts, fallbacks, clamps, feature flags, or a backfill.

- **Tickets**: labels such as `incident`, `data-incident`, `postmortem-action-item`.
- **Chat**: incident channels around the dates the defensive code was added.
- **Runs**: the failing job runs and check failures in the same window (see [pipeline-runs.md](pipeline-runs.md)).
- **History**: commits with messages like "fix for incident", "add guard", "backfill", or "revert" followed by "re-apply with a fix". These are strong signals.

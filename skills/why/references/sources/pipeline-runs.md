# Pipeline and job runs

## What this source contains

- Orchestrator run history (Airflow, Dagster, Prefect, cron, or CI workflows that run data jobs)
- Results of data-quality checks: failed assertions, row-count alerts, freshness alerts
- Failure history for a named job, with error messages and retries

These show what broke, when, and what the team did about it. They are strong evidence for defensive code such as a null guard, a retry, or a fallback value.

## How to search it

1. **Search by job or check name.** Use the name of the job, the task, or the check that the target code belongs to.
2. **Bound the dates.** Use a window around the change date.
3. **Read the failures.** Quote the error message and the run id. Count the failures, not just the first one.
4. **Look for reruns and backfills.** A backfill run in the same window often explains a changed default or a new guard.
5. **Check the check.** A data-quality check added in the same window as the change is a strong lead.

## What good evidence looks like

- A check that failed with "duplicate user_id" a week before a dedup step was added.
- A job failure message "division by zero in conversion rate" followed by a guard in the same PR.
- A backfill run labeled with the date range that the fix corrected.

## Common pitfalls

- **Retries hide the first error.** Read the first failure, not only the last success.
- **Alerts are not incidents.** A noisy alert may never have caused the change.
- **Logs roll off.** Old runs may be gone. Say where the retention ends.

## What to return

- Job or check name, run id, date, and status
- The error message quoted verbatim
- Failure count in the window
- Link to the run, when the tool gives one
- Whether a code change followed in the same window

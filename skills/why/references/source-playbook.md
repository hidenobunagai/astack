# Source playbooks

The **why** skill spawns one investigator per available source. Each investigator reads one playbook below. The playbooks name concrete tools for common setups. Adapt them to the tools this project actually has.

| Category | Playbook | Example tools it documents |
| --- | --- | --- |
| Source control history | [`code-archaeology.md`](./sources/code-archaeology.md) | git, the team's review tool when reachable |
| Notebook history | [`notebook-history.md`](./sources/notebook-history.md) | Jupytext pairs, marimo `.py` files, git history |
| Query history | [`query-history.md`](./sources/query-history.md) | Warehouse query logs (Databricks, BigQuery, Snowflake), saved SQL in the repo |
| Dashboards and metric definitions | [`dashboards.md`](./sources/dashboards.md) | Looker, Metabase, Superset, Grafana, metric YAML in the repo |
| Pipeline and job runs | [`pipeline-runs.md`](./sources/pipeline-runs.md) | Airflow, Dagster, Prefect, cron, data-quality check results |
| Issue / ticket tracker | [`issue-tracker.md`](./sources/issue-tracker.md) | Jira, Redmine, Backlog, and similar |
| Long-form documents | [`long-form-docs.md`](./sources/long-form-docs.md) | Notion, Confluence, Google Docs |
| Real-time team chat | [`team-chat.md`](./sources/team-chat.md) | Slack, Teams, Discord |
| Agent memory | [`memory.md`](./sources/memory.md) | the `engram:recall` and `engram:history` skills, when engram is installed |

Cross-cutting:

- [`incident-postmortem.md`](./sources/incident-postmortem.md). Add it when the target looks defensive (null guards, retries, fallbacks, clamps, feature flags, backfills).

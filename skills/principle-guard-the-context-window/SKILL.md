---
name: principle-guard-the-context-window
description: "Apply when the session is filling up: large query results, long notebooks, wide tables, repeated reads of big CSV, JSON, or Parquet previews, or fan-out plans across many segments. Route bulk to subagents, aggregate before printing, and keep summaries in the main thread instead of raw payloads."
---

# Guard the Context Window

Context overflow degrades reasoning quality, creates compression artifacts, and halts progress. A printed 50,000-row frame does more damage than a wrong join.

- Size phases and cap scope. Limit the files per phase, set turn budgets, and count the cost of each mechanism before you start.
- Aggregate before you print. Show `describe`, counts, and group-level summaries. Never print `head` or sample rows of real data. Ask for only the summary block in a run request, not whole frames or full query results. Write the bulk to a file and cite the path.
- Convert before reading. Never read a raw `.ipynb` in full. Convert it to a script outside the repo first with `uvx jupytext --to py:percent --output /tmp/<name>.py <notebook>.ipynb`, then read the script.
- Route bulk to subagents. Delegate broad exploration, such as scanning many tables or notebooks, to an `Explore` agent with a brief that says "do not edit files". Keep only its summary in the main thread.

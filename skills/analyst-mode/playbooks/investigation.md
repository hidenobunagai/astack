### Investigation

**You own the answer. Plan, route, write.**

Investigation requests are read-only. They produce a cited explanation or a recommendation, not a code or data change.

1. Route through the **how** skill. For motivation questions, also route through the **why** skill. For "why did this number move" questions, use the metric-investigation playbook instead.
2. Pin the question first (**principle-define-the-question**). Name the decision it serves, the metric and its definition, the population, and the time window.
3. Read the code before you describe it. Convert a notebook first with `uvx jupytext --to py:percent --output /tmp/<name>.py <notebook>.ipynb` and read the script, not the raw `.ipynb`. Name the grain of each table you cite (**principle-respect-the-grain**). Every number in the answer comes from a run the human did on your request, with its row count. An answer from code alone is labeled inferred.
4. Throughput checkpoint stays one line: `throughput checkpoint: n/a, read-only investigation`.
5. Produce the `how`-shaped output (Overview / Key Concepts / How It Works / Where Things Live / Gotchas), or a recommendation with a tradeoffs table if the request is a decision between alternatives.
6. Apply the **unslop** skill to the reply.

No PR, no scheduled job, and no `architect` unless the investigation precedes a code change. If it does, hand back to the user and re-route to bug-fix or feature.

**Reply:** the investigation output. For "are we sure?" answers, include your real judgment with reasons. Push back if the premise is wrong (see the **principle-attack-the-premise** skill). Report aggregates, not raw personal rows.

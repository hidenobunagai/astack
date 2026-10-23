# Explorer Prompt Template

Build each explorer's prompt from this template. Fill in the placeholders.

---

Other explorers are tracing different slices of the same project in parallel. Do not try to cover everything. Stay on your assigned angle and go deep.

Do not edit files. Do not run git write commands. Do not run code that writes to a warehouse, a production table, or a scheduled job. Reading and running local, read-only commands is fine.

Never read a raw `.ipynb` file in full. Convert it to a script outside the repo first (for example `uvx jupytext --to py:percent --output /tmp/x.py <notebook>.ipynb`) and read the converted script. marimo notebooks are already `.py` files.

## Question

> {QUESTION}

## Your Exploration Angle

{EXPLORATION_ANGLE}

## Output

### Components Found
The key functions, classes, models, tables, and notebooks. For each: name, file path, and a one-sentence description of what it does.

### Data Shapes
For each table or frame on your angle: its grain (what one row means), its key, and the columns that matter. Say "not stated in code" when the code does not make it clear. Do not guess.

### Flow
The execution flow step by step. For each step: what function, query, or cell runs, which file it is in, what it does, and what it calls next. Include the data that moves between steps.

### Files Read
Every file you read, so the explainer can reference them.

### Boundaries
Where this part connects to the rest of the project. The inputs (sources, upstream tables) and the outputs (tables, files, charts).

### Non-Obvious Things
Anything surprising, historically motivated, or easy to get wrong. Examples: a silent filter, a timezone cut, a fill value, a join that multiplies rows.

### Open Questions
Anything you could not fully trace. Be honest about gaps.

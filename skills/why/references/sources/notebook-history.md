# Notebook history (Jupyter, marimo)

## What this source contains

- Exploratory notebooks written before the code changed, often where the analysis and the threshold were first chosen
- Markdown cells that state a decision and its reason
- Notebook history in the repo, as paired `.py` files (Jupytext) or marimo `.py` files

Notebooks are often the only place where an analysis choice is written down. Treat them as evidence about what was tried and why. Their saved outputs may be stale, so do not trust outputs as proof.

## How to search it

Never read a raw `.ipynb` in full. Convert it to a script outside the repo, then read that:

```bash
uvx jupytext --to py:percent --output /tmp/<name>.py <notebook>.ipynb
```

Then search the converted script:

```bash
grep -n -i -E '(because|decided|threshold|exclude|why|assum)' /tmp/<name>.py
grep -rn '<constant or column name>' /tmp/<name>.py
```

Find notebooks that mention the target:

```bash
grep -rl '<symbol or term>' --include='*.py' --include='*.ipynb' --include='*.md' .
```

Read the history of a notebook with the source-control commands in `code-archaeology.md`, such as `git log --follow -p -- <path>`.

## What good evidence looks like

- A markdown cell: "Using the 7-day window, because the 1-day window swings with holidays."
- A cell that tests two thresholds and keeps one, with the comparison shown.
- A notebook commit message that names the question it answers.

## Common pitfalls

- **Saved outputs are not proof.** A plot in the file may be from an older data snapshot or a different code version.
- **Exploration is not a decision.** A cell that tries a value does not show the value was chosen.
- **Hidden state.** A cell that depends on an earlier cell, or on a kernel variable, can make the notebook say something it does not really support.
- **marimo files** are plain `.py`. Read them directly.

## What to return

For each relevant notebook location:
- File path and cell number or section heading
- The text quoted verbatim
- The commit or change that added it, and its date
- Whether the text states a decision or only shows an exploration

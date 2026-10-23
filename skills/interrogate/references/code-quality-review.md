# Code quality review

Each reviewer applies this lens with the rubric. It is a strict standard for implementation quality, maintainability, and the health of the analysis codebase.

Aim for structure first. Do not stop at "this could be a bit cleaner". Look for reframings that make a whole branch, helper, mode, or layer disappear while keeping the behavior.

## Baseline

> Audit the change for code quality. Rethink how to structure it so it is simpler, more direct, and easier to re-run, without changing any number it produces. Work on abstractions, module boundaries, and legibility. Be thorough. Measure twice, cut once.

## Dimensions

Apply the ones that are relevant.

1. **Look for structural simplification.** If a stage, a branch, or a helper can disappear without changing the output, say so. Deleting complexity beats rearranging it.
2. **Keep definitions in one place.** A metric, a filter rule, or a join key defined in two places drifts. Push the logic into the module that owns it, and have the other code import it.
3. **Watch for spaghetti in notebooks.** Cells that set state for later cells, or branches that change the population in the middle of an analysis, belong in a function with named inputs.
4. **Prefer boring, explicit code.** Be skeptical of generic helpers that hide a simple table shape. Flag thin wrappers that only rename a Polars expression.
5. **Make types and schemas explicit.** Question nullable columns that are never null in practice, `Any` types, and casts. A schema at the boundary beats a `dict` passed around.
6. **Use the canonical helper.** Reuse the project's existing helpers and conventions before adding a new one.
7. **Make multi-step updates atomic.** If a pipeline writes several outputs and a crash can leave some of them updated, push for one write per run, or a write-then-rename pattern.
8. **Keep files reviewable.** A file that grows past a few hundred lines in one change is a smell. Ask whether it should be split.

## Output expectations

Start with structural regressions and missed simplifications. Then the spaghetti and branching. Then the boundary, type, and file-size concerns. Then smaller legibility issues.

## Approval bar

Do not approve only because the numbers look right. Treat these as blockers unless the author justifies them: incidental complexity that one simplification would remove, a duplicated definition, a notebook-only rule that the pipeline does not enforce, an unnecessary wrapper, and a change that scatters special cases through shared code.

## Tone

Be direct and specific. Do not be rude, and do not soften a real maintainability problem into a mild suggestion. If the code makes the project harder to re-run or to trust, say so.

### Notebook to pipeline

**You own the parity. The script must reproduce the notebook's numbers on the same input before anything else changes.** A notebook that gives the right answer only in one cell order is not a pipeline yet. Fix that first.

1. Write the target in one sentence: the inputs (paths, date window, seed), the outputs (tables or files), and who reads them. Use the **principle-define-the-question** skill. A pipeline with no named output is a notebook with more files.
2. Convert before reading. Never read the raw `.ipynb` in full. Add the tools once, then convert:

   ```bash
   uv add --dev jupytext papermill
   uv run jupytext --to py:percent analysis/explore.ipynb -o analysis/explore.py
   ```

   `jupytext` writes a `# %%` cell script that diffs cleanly. `nbconvert --to script` also works if the project already uses it. Read the `.py` file, not the notebook.
3. Freeze the reference. Run the original notebook top to bottom in a fresh process with `papermill`. Tag the parameters cell first, because papermill injects `-p` values there:

   ```bash
   uv run papermill analysis/explore.ipynb /tmp/ref/explore.out.ipynb -p start 2026-01-01 -p end 2026-01-31
   ```

   Then write the key tables the notebook produces to `/tmp/ref/` as Parquet, from one added cell. The saved outputs of the notebook are not the reference. The fresh run is. Use the **principle-reproduce-from-clean-state** skill.
4. Delete dead cells. Remove cells whose results nothing reads, prints that were only for looking, and cells that overwrite a name used earlier. Run the cleaned notebook top to bottom once. If it breaks, the notebook depended on hidden state. Name that dependency in the reply.
5. Extract one function per step. Each function takes Polars DataFrames or plain values and returns a DataFrame. Keep the step order that the data needs, not the order the cells happened to run. Do not add classes. Follow the project's existing module layout.
6. Move every hardcoded path, date, threshold, and seed into one place, read from command-line arguments. Use `polars.scan_parquet` for inputs so the pipeline stays lazy until the write.
7. Pin the dependencies. `uv add` each import the script uses, then commit `pyproject.toml` and `uv.lock`. Run it with `uv run python -m <package>` or `uv run python analysis/pipeline.py`. Never `pip install` into the global environment.
8. Prove parity on the same input. Run the pipeline in a fresh process, then compare each output to `/tmp/ref/` with `polars.testing.assert_frame_equal`. Sort both frames by the key columns first. `group_by` does not keep group order by default (`maintain_order=False`), so an unsorted comparison can fail on a correct pipeline. Where order is part of the output, use `group_by(..., maintain_order=True)` in the pipeline instead. Check row counts and key uniqueness before and after each join. Relax the comparison only for float columns, with a tolerance and a written reason. A failure from row order alone is a harness bug, not a data bug. Use the **principle-respect-the-grain** skill.

   ```python
   import polars as pl
   from polars.testing import assert_frame_equal

   keys = ["order_month", "region"]  # the key columns of the output
   ref = pl.read_parquet("/tmp/ref/orders_summary.parquet").sort(keys)
   new = pl.read_parquet("out/orders_summary.parquet").sort(keys)
   assert_frame_equal(ref, new, check_exact=True)
   ```

9. Keep the notebook until parity holds, then either delete it or reduce it to a reader that calls the pipeline. Do not commit notebook outputs. Do not commit raw data or credentials.
10. Leave one re-run command in the README or the module docstring, for example `uv run python analysis/pipeline.py --start 2026-01-01 --end 2026-01-31`. Run it again from a clean process and read the printed row counts.

**Reply:** what the pipeline takes and produces.
- The parity result: each output, its row count on both sides, and the comparison that passed. Name any relaxed float tolerance.
- The cells removed, and any hidden cell-order dependency that the cleanup found.
- The pinned dependencies and the commit that holds `uv.lock`.
- The re-run command.
- What you did not check, such as a second input period or a larger data volume.

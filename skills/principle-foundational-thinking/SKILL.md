---
name: principle-foundational-thinking
description: "Apply before writing analysis logic: choosing the table shape and grain, sequencing environment and check setup against analysis work, and asking what shared state a job or notebook can change. Get the data structures right so the downstream code becomes obvious."
---

# Foundational Thinking

Structural decisions protect option value. Code-level decisions protect simplicity.

Shape the data first. Settle the table shape before writing logic. Decide the grain (one row per what), the keys, the types, and the units. Trace every access pattern (joins, group-bys, filters over time) and choose a layout that fits the dominant paths. See **principle-respect-the-grain**.

At code level, DRY the structure, not every line. Keep the schema in one place. Three similar expressions still beat a premature helper. Prefer explicit Polars expressions over clever chains. Test behavior and edge cases, not line counts.

Concurrency corollary. Before sharing state between actors (parallel jobs, a shared cache file, a shared warehouse table, two notebooks writing one output), ask "what happens if another actor changes this at the same time?" If the answer is not "nothing", isolate it with separate output paths, partitioned writes, or an atomic rename.

Scaffold first. If something helps every later step, build it first. Ask "does every subsequent step benefit from this existing?" A locked environment (`uv.lock`), a shared data loader, assertion helpers, and a common plotting theme are scaffold. Set up the environment and checks before the analysis, and the checks before the fixes. Keep commits small and single-purpose.

Each increment should land a coherent abstraction or deepen one that exists. Do not spread a new column or filter across callers as special-case handling.

Subtraction comes before scaffolding. Remove dead cells and unused columns first, then lay foundations.

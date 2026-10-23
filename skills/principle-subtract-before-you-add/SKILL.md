---
name: principle-subtract-before-you-add
description: "Apply when sequencing a new analysis, pipeline stage, refactor, or rewrite. Remove dead notebook cells, unused columns, redundant validators, and stale queries first, then build on the simpler base."
---

# Subtract Before You Add

When evolving an analysis or pipeline, remove complexity first, then build. Default to subtraction.

Make simplification a continual investment. Leave the work slightly simpler and more capable, behind the same or a smaller surface than you found it.

- Sequence removal before construction.
- Cut before you polish. Reach the minimum before investing in quality.
- Design for observed usage, not speculative edge cases. Do not add columns, dimensions, or filters that no question needs.
- No speculative validators beyond what the data contract demands.
- Simplify parameters. Remove options that no caller sets.
- When a notebook, query, or doc has no novel content, delete it rather than leaving a stub.

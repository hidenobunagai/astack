---
name: principle-laziness-protocol
description: "Apply when refactoring, reviewing the size of an analysis diff, or tempted to add abstractions, layers, or parameters to a pipeline or notebook. Bias toward deletion and the smallest change that solves the problem."
---

# Laziness Protocol

- Consolidate decisions. Do not repeat the same choice in several places, such as a date window, a currency conversion, or a rule for active users. Put it behind one source of truth, a single config value or a named function, and pass the result as a simple parameter.
- Minimize the diff. Make the smallest change that solves the problem. Fewer lines beat elegant boilerplate. A three-line filter in a query beats a new module with a class hierarchy.

---
name: principle-laziness-protocol
description: "Apply before writing new analysis code, when refactoring, reviewing the size of an analysis diff, or tempted to add abstractions, layers, or parameters to a pipeline or notebook. Run the decision ladder first, then bias toward deletion and the smallest change that solves the problem."
---

# Laziness Protocol

- Run the ladder before you write, and take the first rung that fully does the job. (1) It does not need to exist: skip the feature, option, or flexibility nobody asked for. (2) Something in this codebase already does it: a helper, a shared query fragment, a pattern the surrounding code uses. (3) The standard library or the platform does it: a Polars or SQL construct, a notebook or dashboard feature. (4) An installed dependency does it; never add a dependency for a few lines. (5) It fits in one line a reader gets at a glance. (6) Otherwise, write the minimum code that works.
- Consolidate decisions. Do not repeat the same choice in several places, such as a date window, a currency conversion, or a rule for active users. Put it behind one source of truth, a single config value or a named function, and pass the result as a simple parameter.
- Minimize the diff. Make the smallest change that solves the problem. Fewer lines beat elegant boilerplate. A three-line filter in a query beats a new module with a class hierarchy.
- Be lazy about the solution, never about the change itself. Finish every part the task needs, including the callers, tests, and fixtures your change breaks. For a bug, grep every caller of the code you touch and fix the root cause once in the shared code, not once per call site.
- New non-trivial logic (a branch, a loop, a parser, money or identity matching, or a whole new script) leaves one small test or an assert-based self-check. Trivial changes need none.
- A shortcut with a known limit gets a comment in this form: `shortcut: <the limit>, <when to upgrade>`.
- Never cut: validation at trust boundaries (an incoming feed, a file drop, an API response), error handling that prevents data loss or a silently wrong number, security, accessibility in a chart or dashboard a reader sees, and anything the user asked for.
- Laziness never overrides verification. Data checks, result-validity and statistical-validity review, and the data guard rules apply at full strength, even when they make the change bigger.

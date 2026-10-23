### Prototype

**You own the design decision, not the code. The prototype is a throwaway instrument. The real build follows feature.**

This is the one playbook where the smallest-change rule and the verification bar invert. Speed over polish. Code quality does not matter. The rigor is in picking the right design cheaply. Propose variations the user did not ask for, and throw away an approach that does not work.

1. Scope the decision the prototype exists to make: which chart form, which dashboard layout, which metric definition, which query strategy, or which pipeline shape. No decision means no prototype. Route to feature.
2. Gather references when the design space is open: prior charts, similar analyses, library examples. Let the user pick a direction before you build. Skip this step when the direction is set.
3. Build throwaway code in a scratch directory outside the project. Use `uv run` and the lightest stack that shows the idea: a notebook, a marimo app, or a plain script. No project framework, no tests, no abstractions. For a chart decision, follow the **dataviz** skill for palette and layout, and render each option to an image.
4. When you compare alternatives, build them behind one switch (a dropdown, a flag, or a parameter), with each variant labeled. The switch makes the comparison cheap.
5. Verify on the matching surface. For a chart or dashboard decision, render each variant and look at the image. For a metric or query decision, run each option in a clean process on the same data and read the values side by side. The observation is the test here, not an assertion.
6. Present alternatives, tradeoffs, and a recommendation. The output is the decision plus the throwaway artifact, not shippable code. Hand the chosen direction to feature, or to the **architect** skill for the shape, for the real build.

**Reply:** the variants explored, the evidence (rendered images for a visual decision, the observed values or timings for an analytic one), tradeoffs, your recommendation, and the scratch path. Say plainly that the prototype is throwaway.

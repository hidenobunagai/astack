### Prototype

**You own the design decision, not the code. The prototype is a throwaway instrument. The real build follows feature.**

This is the one playbook where the smallest-change rule and the verification bar invert. Speed over polish. Code quality does not matter. The rigor is in picking the right design cheaply. Propose variations the user did not ask for, and throw away an approach that does not work.

1. Scope the decision the prototype exists to make: which chart form, which dashboard layout, which metric definition, which query strategy, or which pipeline shape. No decision means no prototype. Route to feature.
2. Gather references when the design space is open: prior charts, similar analyses, library examples. Let the user pick a direction before you build. Skip this step when the direction is set.
3. Build throwaway code in a scratch directory outside the project. Use `uv run` on synthetic data and the lightest stack that shows the idea: a notebook, a marimo app, or a plain script. No project framework, no tests, no abstractions. For a chart decision, follow the **dataviz** skill for palette and layout, and render each option to an image on synthetic data shaped like the real one.
4. When you compare alternatives, build them behind one switch (a dropdown, a flag, or a parameter), with each variant labeled. The switch makes the comparison cheap.
5. Verify on the matching surface. For a chart or dashboard decision, render each variant and look at the image. When the decision depends on the real distribution, ask the human for the real renders in one request. For a metric or query decision, write one script that runs every option on the same real data and prints the values side by side, and hand it over as a run request (analyst-mode, Human runs the data). The observation is the test here, not an assertion.
6. Present alternatives, tradeoffs, and a recommendation. The output is the decision plus the throwaway artifact, not shippable code. Hand the chosen direction to feature, or to the **architect** skill for the shape, for the real build.

**Reply:** the variants explored, the evidence (rendered images for a visual decision, the observed values or timings for an analytic one), tradeoffs, your recommendation, and the scratch path. Say plainly that the prototype is throwaway.

# Changelog

Version history of the astack plugin. The plugin was named **wstack** up to
0.5.0 and renamed to astack in 0.6.0. Releases up to 0.6.0 and from 0.8.0 on
are tagged GitHub releases; 0.7.x was distributed by push only, and the
0.9.0 GitHub release was created after the fact, on 2026-11-02, from the
commit that had already shipped as 0.9.0.

## 0.10.0 — 2026-11-02

Data guard hardening, integrated from the branch
`auto/improve-20261025-guard-data-hardening`, where it had waited unmerged
since 2026-10-25.

- Compressed data files are blocked too: a data extension followed by
  `.gz`, `.bz2`, `.zst`, or `.xz` (for example `orders.csv.gz`). A plain
  archive such as `archive.tar.gz` is not a data file and stays readable.
- `Edit` and `Write` on data files and raw notebooks are blocked, not just
  reads, so the agent cannot modify real data or saved notebook outputs
  either. Synthetic and test paths stay writable.
- More shell readers are matched: `cut`, `column`, `sort`, `uniq`, `shuf`,
  `nl`, `paste`, and the compressed-file readers `zcat`, `gzcat`, `bzcat`,
  `xzcat`, and `zgrep`.
- Malformed hook input (empty, non-JSON, or missing fields) no longer
  crashes the hook; it steps aside and lets the call through, so a bad
  payload can never break a session. The guard cases grow from 14 to 24.
- The block message now says "blocked access to", since it also covers
  writes.

## 0.9.1 — 2026-11-02

Distribution and trust polish; no change to skill behavior.

- Plugin icon (`.claude-plugin/icon.png`); `claude plugin validate` is now
  warning-free.
- `SECURITY.md`: what the hooks and scripts run on your machine, the
  no-network statement, and the limits of the data guard.
- A worked example of the human-runs-the-data flow on synthetic data in
  `examples/human-runs-the-data/`, linked from the README.
- CI now runs the plugin checks (`check-skills`, `check-guard`), the worked
  example, and the statechart test suite on every push and pull request, in
  addition to the existing format gate.
- This changelog.
- The statechart scripts package is renamed from `@cursor-skill/statechart`
  to `@astack/statechart`, a leftover upstream name.
- The README now says where the optional `dataviz` skill comes from (a
  separate skill, not part of astack).

## 0.9.0 — 2026-10-30

- Added the statechart skill and the formal verification skill pair
  (create / maintain), ported from pstack v0.15.36 and adapted to astack
  naming (`/astack:statechart`).
- A mise-free setup path for the TLA+ tools: place `tla2tools.jar` yourself
  and set `TLA2TOOLS` (and `JAVA`, if needed) in `~/.claude/settings.json`.
- CI: a format/lint gate for changed files.

## 0.8.0 — 2026-10-26

- The laziness protocol principle gained a pre-writing decision ladder and
  a never-cut list (validation at trust boundaries, error handling that
  prevents data loss or a silently wrong number, security, accessibility,
  and anything the user asked for), and now states explicitly that laziness
  never overrides verification.

## 0.7.1 — 2026-10-24

- analyst-mode does the work in the main loop and spawns subagents only for
  parallel or overflow cases; delegated code-writing was restored for the
  cases that do delegate. (Two commits, distributed by push only.)

## 0.6.0 — 2026-10-24

- Renamed wstack to astack: plugin and marketplace names, the
  `ASTACK_ANALYST` environment variable (was `WSTACK_ANALYST`), and skill
  namespaces.

## 0.5.0 — 2026-10-24

- Added the retail-analytics skill: eight method families at first, then
  wider coverage, then manufacturer marketing on retail data (brand share
  and switching, new-product trial and repeat, trade promotions, retail
  media).
- Added two statistical principles: name the estimand, and simulate the
  method on synthetic data with a planted truth before running it for real.

## 0.4.0 — 2026-10-23

- The human runs the data: every run on real data is handed over as a run
  request (command, checks with expected results, summary block to paste
  back). Scripts for real data print aggregates and PASS/FAIL lines only.

## 0.3.0 — 2026-10-23

- analyst-mode is on in every session, loaded by a SessionStart hook;
  `ASTACK_ANALYST=off` (then `WSTACK_ANALYST=off`) skips it.

## 0.2.1 — 2026-10-23

- Handle CRLF checkouts on Windows.

## 0.2.0 — 2026-10-23

- First public release, as wstack. Adapted from pstack 0.15.30 by Lauren
  Tan (MIT): general engineering workflows rewritten with Claude Code tool
  names, web / PR-automation / Cursor-only parts dropped, data-specific
  playbooks and principles added.
- Dropped the GitHub dependency: plain git with any hosting or review tool,
  or none.

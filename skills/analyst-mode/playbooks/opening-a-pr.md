### Opening a PR

Invoked at the end of every other playbook. Version control is git. The team's hosting and review tool varies (a git server with merge requests, a shared remote, or no remote at all), so this playbook uses plain git and names no hosting CLI. "PR" in astack means a review request in whatever tool the team uses. With no review tool, it means a pushed branch, or a local branch, plus a written description the user hands to the reviewer.

**Branch.** Work on a branch off the base: `git switch -c <name> <base>`. Parallel writers each get their own worktree (`isolation: "worktree"` on the `Agent` call, or `git worktree add <path> -b <name> <base>`). When a branch mixes unrelated work, move the unrelated part to its own branch. For a tangled branch, save the useful parts, start a fresh branch from the base, and redo the minimal change.

**Commits.** Commit liberally with `git add <paths>` and `git commit -m "..."`. Name the paths. Never `git add -A`, which picks up data files and notebook outputs. Before the push, reshape the series into small ordered commits with `git rebase -i <base>`. Each commit is a future PR: landable and ordered to tell the story. Fold a fix into the commit it belongs to with `git commit --fixup <sha>` and `git rebase -i --autosquash <base>`. Start a separate commit when the fix stands alone. Commit bodies do not restate the subject.

**Review.** Before the push, check the diff for these:
- Debug prints, scratch cells, and commented-out code.
- Hard-coded local paths.
- Raw data, notebook outputs, and credentials. A plaintext `.env` must never be committed. Use dotenvx.
- Lint and types: `uv run ruff check`, `uv run ruff format --check`, and `uv run ty check`.

Run the **no-comments** skill over the diff. Write the PR title and body with the **technical-writing** skill, then apply the **unslop** skill.

**Titles.** Use Conventional Commits, `type(scope): subject`, with no trailing period. The type is `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, or `perf`. The scope names the area, such as `pipeline`, `analysis`, `dashboard`, or `skills`. The subject is short and imperative. It names a real function, table, or path when one carries the change. Example: `fix(pipeline): dedupe orders before the revenue join`.

**Descriptions.** The PR body is a one-minute briefing for a reviewer who has the diff. Use short, simple sentences and few identifiers. The body becomes the squash commit body, so keep it under about 40 lines. Use `##` headings, in this order. Drop a section that has nothing to say.

- `## Why`: the problem and the approach, 1 to 3 short sentences.
- `## What changed`: 1 to 3 short bullets. Name a table, function, or path only when it carries the change. Name both sides of a rename.
- `## Scope`: always. 1 to 3 items on what it covers and what it leaves out.
- `## Tradeoffs`: only rejected alternatives a reviewer would ask about.
- `## Blast Radius`: which tables, dashboards, reports, and scheduled jobs the change touches, and why that is safe or risky. A change to a shared table or a scheduled job says so here and waits for the human before merge.
- `## Verification`: 1 to 3 bullets, each a clean-state run and its outcome. For a number, write `before → after` with its unit and row count. Link to the notebook or report for the rest.

**Push and hand off.** Check `git remote -v` first.

- With a remote, push the branch: `git push -u origin <name>`. Then open the review request with the team's own tool only when its CLI or MCP is available in the session and the user has used it before. Otherwise give the user the branch name, the title, and the description file, and stop there.
- With no remote, leave the work committed on the branch and hand over the branch name, the title, and the description file.

Write the title and description as above in a file outside the repo, or in an ignored path. Never create a remote, change a remote URL, or push to a branch other than your own.

**Stacks.** Prefer several narrow PRs to one large PR. A stack is a branch chain. The root PR targets `main`. Each child branches from its parent (`git switch -c <child> <parent>`), and its review request targets the parent. When a parent merges, move the child onto `main` with `git rebase --onto main <parent> <child>`, push it with `git push --force-with-lease`, and tell the user to retarget its review request to `main`. Force-push only your own branch. Branch from `main` only for independent work.

**Babysit.** Opening a PR does not start a review loop. Post the URL, or the branch name when there is no URL, and keep building. Finish the phase or stack first. Check CI or comments on a PR only when the user asks, after the whole stack exists. Push back when feedback drifts from the intent of the change.

A subagent that opens a PR runs the **interrogate** skill and the **no-comments** skill, posts the URL or the branch name, and returns to the parent without a review loop.

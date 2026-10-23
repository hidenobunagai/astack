### Opening a PR

Invoked at the end of every other playbook. Version control is git with `gh` for GitHub.

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

**Push and open.** Push the branch, then open the PR ready, never as a draft:

```
git push -u origin <name>
gh pr create --title "<title>" --body-file <body.md>
```

Omit `--draft`. Keep the body file outside the repo, or in an ignored path.

**Stacks.** Prefer several narrow PRs to one large PR. A stack is a branch chain. The root PR targets `main`. Each child branches from its parent (`git switch -c <child> <parent>`), and its PR targets the parent: `gh pr create --base <parent>`. When a parent merges, move the child onto `main` with `git rebase --onto main <parent> <child>`, push it with `git push --force-with-lease`, then retarget it with `gh pr edit <child> --base main`. Force-push only your own branch. Branch from `main` only for independent work.

**Babysit.** Opening a PR does not start a review loop. Post the URL and keep building. Finish the phase or stack first. Check CI or comments on a PR only when the user asks, after the whole stack exists. Push back when feedback drifts from the intent of the change.

A subagent that opens a PR runs the **interrogate** skill and the **no-comments** skill, posts the URL, and returns to the parent without a review loop.

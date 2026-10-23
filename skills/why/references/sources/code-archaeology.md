# Source control history (git, in-repo)

## What this source contains

- Change history (descriptions, dates, authors, diffs) in the git repo
- Merge commits and review discussion, when the team's review tool is reachable from the session
- Code comments, TODOs, and notes that explain a threshold or a filter
- Tests whose names and assertions encode the edge cases that motivated a change
- Files that changed together (co-change signal)
- Changelogs or ADRs in the repo, if any

## How to search it

Read-only git commands only. Never run git write commands (`commit`, `rebase`, `reset`, `checkout`, `switch`, `push`).

```bash
# Recent changes that touched a file, with descriptions
git log --follow -n 20 --format='%h %ad %an %s' --date=short -- <path>

# Full patches for those changes
git log --follow -p -n 5 -- <path>

# Changes whose description mentions a term
git log -i --grep='<term>' --format='%h %ad %an %s' --date=short

# Who changed each line, and in which commit
git blame -w -C <path>

# One commit in full
git show <sha>
```

Search the repo for the target's own comments and related tests:

```bash
rg -n -C2 '(TODO|FIXME|NOTE|because|workaround)' <target-file>
rg -l '<symbol>' --glob '*test*'
```

Merge commits often carry the review request number and title. List them:

```bash
git log --merges --format='%h %ad %s' --date=short -- <path>
```

When the team's review tool has a CLI or MCP in this session, read the description and discussion of each request number through it. Otherwise report the numbers and say the discussion was not reachable.

## What good evidence looks like

- A change description that states the reason: "Exclude test accounts, they inflate the weekly count by 4 percent."
- A PR review comment where the reviewer asks for or explains the choice.
- A test named after the edge case that caused the change.

## Common pitfalls

- **Mechanics are not motivation.** A changed constant shows what changed, not why.
- **Renames hide history.** Use `git log --follow` for one path. It follows a rename only when the content stayed similar, so check the previous names too.
- **Squashed history.** A merge may hide the discussion. Read the PR.

## What to return

For each relevant change or PR:
- Commit SHA, PR number, and date
- The description or comment quoted verbatim, with file and line
- The author
- Whether the reason is stated or only implied

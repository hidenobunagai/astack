### Session pickup

**You own the resume point. Read the prior trail, don't redo it.**

1. Locate the prior trail. A local transcript at `~/.claude/projects/<slug>/<session>.jsonl`, where the slug is the workspace path with its separators (and `.` and `:`) replaced by `-`. The exact form differs by OS, so list `~/.claude/projects/` and pick the folder whose name matches the workspace path. On Windows `~` is `%USERPROFILE%`. A pushed branch and an open PR also count as trail. Read the metadata and the last messages first, then scan back for the decision points. Parse a long transcript in a subagent and keep the reduced timeline in the main thread (the **principle-guard-the-context-window** skill). Read only the transcripts of the current workspace. Do not read other projects' transcripts.
2. Reconstruct the operational state: the current branch and its stack (`git status`, `git log --oneline <base>..HEAD`), what already landed (`git diff $(git merge-base <base> HEAD)`), the open todos, and the decisions made. The prior trail is authoritative input. Resist the bias to re-derive it.
3. Diff done against pending. Compare what shipped with what was planned. Name the resume point. Do not re-run the prior analysis or redo completed work. A "let me verify from scratch" pass treats an authoritative trail as untrustworthy.
4. Route the remaining work to the matching playbook and pick the verdict: continue the execution, ship a finished recommendation, ratify or override a prior conclusion, or write a postmortem for a failed run. This playbook ends here. The routed playbook owns the rest.
5. Verify the inherited claims against the original goal on the real artifact. Re-run the key script on synthetic data yourself, and ask the human for a clean real data run of the key query or script in one run request (the **principle-prove-it-works** skill). A passing prior self-report is not the proof.

**Reply:** where the prior agent stopped, what you inherited versus redid (ideally nothing redone), the resume point, and the outcome.

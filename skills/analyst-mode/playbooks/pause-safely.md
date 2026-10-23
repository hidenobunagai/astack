### Pause safely

**You own a clean stop. Leave a checkpoint a cold-start agent can resume from.** This is explicit only. On "keep going", "going to bed, keep going", or "don't stop", do not pause.

1. Stop at a safe boundary. Finish the current atomic step or back out of it. Start nothing new. Cancel nested subagents. Stop any long job you started, such as a warehouse query or a training run. If you cannot stop it, record its ID and where its output lands.
2. Take no irreversible action to pause. No push and no PR unless you already had one out. No write to a shared table, and no change to a scheduled job.
3. Make the work durable. Commit uncommitted edits as one clear `wip:` commit: `git add <paths>` then `git commit -m "wip: <summary>"`. If the tree is broken, say so in the commit body in one line. Leave out raw data, credentials, and notebook outputs.
4. Write the resume note off-context. Capture the intent, what you were doing, the progress and what is verified, the current state, the next steps, the key files, and the gotchas. For a compaction trigger, write it to a file such as `/tmp/<slug>-resume.md`. If a show-me-your-work trail exists, point at it instead of duplicating it.

**Reply:** where you are in the loop, what is on disk versus still in your head (paths, no diff dumps), the commits you made and whether the working copy is clean, any running jobs and their IDs, and the first action on resume. This is a pause, not a final report.

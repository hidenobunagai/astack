### Authoring or modifying a skill

**You own the skill's voice.**

1. Use the skill-creator skill for the SKILL.md structure. A astack skill carries only `name` and `description`, plus `disable-model-invocation: true` where the spec says so. `name` equals the directory name.
2. Validate the skill. The frontmatter has `name` and `description`, the referenced files exist, and the cross-skill links resolve. In the astack repo, run `node scripts/check-skills.mjs` and fix every error in your files.
3. Write test cases only if the change alters structure, such as which files a reader touches or which steps run. Skip them when the change is wording or tone.
4. Run the opening-a-pr playbook (`playbooks/opening-a-pr.md`).

When in doubt, delete. Keep only prose that changes a decision. Tell the reader what to do and skip the reason. Explain only when the rule is confusing without one. Match tone to scope. Point at structural sources (schemas, READMEs, config, data dictionaries) per the **principle-encode-lessons-in-structure** skill. Delegate to other skills by name. Don't restate them. A workflow you keep hitting that no skill captures is a candidate for a new skill.

**Reply:** summary of the skill, key design decisions, validation notes.

# Lead judgment framework

## Filtering principles

### Nitpick gravity

Reviewers, especially adversarial ones, fill their review. When they find no real issue, they inflate nits. If every finding is a nit or a style preference, the change is probably fine. Say so.

### Hypothetical versus actual

"What if this column is null?" is a finding only when a null can reach the code. Trace the source. If the upstream check or the schema prevents it, dismiss the finding. Reviewers working from a diff cannot always see the full path. You can.

### Premature abstraction

Reviewers often suggest a helper, a class, or a config option. Does the code change in a second way? If not, the abstraction is premature. Simple inline code beats an abstraction that is more than the current job needs.

### "I would have done it differently"

This is the most common false positive. A finding that is only a preference is not a bug. Dismiss it, unless the reviewer shows a concrete problem with the current approach.

### Missing context

Watch for findings that show the reviewer did not understand the project:

- Suggested changes to code the author did not write or touch.
- Flags on a pattern that the rest of the project uses on purpose, such as a fixed population filter.
- Recommendations that conflict with a constraint you know about, such as a dashboard that reads a column by name.

Dismiss these gently. They come from limited information.

## When reviewers are right

Do not dismiss a finding because it is uncomfortable. Signs a finding deserves attention:

- Two reviewers raise the same issue independently.
- The finding names a concrete path to a wrong number, such as a join that multiplies rows for a specific key.
- The finding exposes a gap in your model of the data.
- You read it and think "yes, actually".

Be especially careful when you dismiss a finding about a number, a grain, a join, or a write to shared data. These deserve more scrutiny even from one reviewer.

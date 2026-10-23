# Real-time team chat (Slack, Teams, Discord)

## How to search it

Check which chat tool is connected and read its tool schema first. If it needs authentication and it fails, stop and report the gap. Do not invent findings.

1. **Bound by author and date.** Messages from the change's author in the week of the change.
2. **Search for the PR link or the metric name.** Teams often paste links when they discuss a change.
3. **Search for a number.** If the change moved a figure, search for that figure in the window.
4. **Read the thread, not the single message.** A message alone can read differently out of context.

## Common pitfalls

- **Retention.** Old messages may be gone. Name the cutoff.
- **Private messages.** Many decisions happen in DMs that are not searchable. Say so.
- **Casual talk.** "Just ship it" is not a considered decision. Look for the reasoning.

## What to return

- Channel, date, and author
- The message quoted verbatim, with the thread context
- Whether it states a decision or a guess

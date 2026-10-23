---
name: principle-encode-lessons-in-structure
description: "Apply when you write the same instruction a second time, or notice a recurring correction, such as a join that drops rows, a timezone mix-up, or a chart axis that starts in the wrong place. Encode the rule as a data test, lint rule, schema check, or script instead of more text."
---

# Encode Lessons in Structure

If the lesson can be encoded, encode it. A data-quality assertion, a `ruff` rule, a dtype check in the loader, or a pre-commit hook enforces the rule every time. A note in the README that says "order_date is UTC" does not.

If the lesson needs judgment and cannot be encoded, make the instruction more prominent and add an example of the failure mode.

If the fix is structural, use only the structural fix. The instruction is the symptom.

# Word the prompt

A prompt states the question, the data, and the check for done. The analyst-mode playbook supplies the steps, so a few plain sentences beat a spec.

## Put in

- The question and the decision it serves. "Should we keep the discount on annual plans?" beats "look at discounts."
- The grain and the data source. Name the table, the file, or the notebook, and what one row means if you know it.
- The population and the time window, including the timezone.
- The done check. It can pass or fail. "Make it better" and "spend an hour on it" are not checks.
- The proof to show. Ask for row counts, the output values, the rendered chart, or a before and after number.
- What the user already knows. A known bad value, a dashboard number to match, or a failing assertion saves a search.
- The real constraints. "read only", "no writes to the warehouse", "keep the output byte identical", and "let me review before proceeding" each change what the agent does.

## Leave out

- The how. Say what to answer, and leave the agent room to find the method.
- A list of skills or steps. A hand-written order drops or reorders steps the playbook keeps. Name a skill only to override one choice.
- Your theory of the cause, until the agent restates the problem. A stated guess narrows the search too early.

## Load the context first

- For a noisy report, ask the agent to restate the question and the grain in plain words before it queries anything. A misreading shows up before any work exists.
- In a fresh chat, use `/wstack:recall` on the topic. Older chats hold context that the new agent lacks.
- Before a change to an unfamiliar pipeline, use `/wstack:how` for the data flow and `/wstack:why` for the reasons. An agent without a traced model fixes the symptom at the first plausible step.
- Use `/wstack:teach` to make the case for a method, as in "convince me this join does not fan out". A case is easier to check than a summary.

## Design before the plan

- Do not take the first design. Ask for a few candidate approaches, each with a sample output, and pick from the evidence.
- Let a prototype answer the open questions. Do not review an abstract plan adversarially, because reviewers invent risks that never happen.
- For a shared metric or a shared module, ask for its definition or docstring first, then work back to the code. The definition becomes the target the agent checks itself against.
- Ask for the plan only after the design is settled. Each step of the plan ends in a check.

## Follow up short

- "do it", "continue", and "keep going until done" are whole prompts once the chat holds the task.
- Start with "new task" when the subject changes. Otherwise the mode treats the message as the next step.

## Before stepping away

- Say "going to bed" or "stepping away" so the agent stops asking.
- Write done as checks that every iteration can run, such as row counts, assertions, and reproduced values.
- Ask for a fresh branch or worktree off a named base.
- Pre-answer what the agent would stop for, such as "do not ask me before committing a notebook".
- Ask for a decision log to audit later with `/wstack:show-me-your-work`.
- Give an exit. Say "if you are stuck after a few hours, stop and write up why".

## Steer in one line

- Restate the question. Say "I said the question is whether the drop is real. I did not ask for a fix yet."
- Name the principle. Say "apply prove it works, and show me the output values, not the job status."
- A principle name works because the agent already read the rule. Its reply names the decision the rule changed.

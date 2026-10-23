---
name: principle-test-behavior-not-implementation
description: "Apply when you write, change, or keep a data test, pipeline check, or unit test for analysis code. Assert what the users of the output can observe, such as values, row sets, schema, and written tables, so the test fails when the result breaks and survives internal refactors."
---

# Test Behavior, Not Implementation

A test is a claim about what the code does for its users: a notebook reader, a downstream table, a dashboard, or another service. Behavior is what those users can observe through the interface they use. That includes returned values, the row set, the schema, errors, and effects outside the code, such as a table written or a file emitted. Implementation is what they cannot observe: private helpers, the order of internal calls, intermediate frames, and which internal expression did the work.

Judge each test against two imagined edits.

- Break the behavior. Make the code return a wrong value, drop a row, or double count. If the test still passes, it proves nothing. The usual causes are an assertion looser than the contract, an expected value computed by the code under test, and assertions on data the test built itself.
- Change the internals. Keep every observable result the same and restructure the code underneath, for example by moving from eager to lazy frames. If the test now fails, it is pinned to the implementation.

Keep a test that catches the first edit and survives the second. Rewrite or delete the rest. To build such a test, feed the code a small hand-made frame through its public function. Derive the expected value from the definition, not from a run of the code. Assert what the contract promises, no less and no more.

The contract decides, not the shape of the assertion. If the promise is "refunds are excluded from revenue", assert the revenue value on a frame with a refund, and pair it with a frame without one, so the test shows it can see the effect. A call to an internal helper is implementation. A value that a mocked external service receives is behavior, because that service observes it. An exact warning string pins wording no caller reads. An error type that callers branch on is the contract.

An invariant can be the test. "Every order_id in the fact table exists in the customer dimension" is a behavior of the output, so assert it on the output.

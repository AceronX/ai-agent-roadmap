# Flow Integration Tests

<div class="topic-page" markdown="1">

<section class="topic-hero">
  <span class="topic-hero__eyebrow">Stage 11 - Evaluation and Observability</span>
  <p class="topic-hero__lead">Flow integration tests run the agent through a realistic task and check the sequence: model call, tool calls, observations, final answer, and stop condition.</p>
  <div class="topic-hero__facts">
    <span>End-to-end</span>
    <span>Tool sequence</span>
    <span>Stop reason</span>
    <span>Fixtures</span>
    <span>Regression</span>
  </div>
</section>

## Goal

By the end of this topic, you should be able to:

- Test an agent flow with fixed inputs and controlled tools.
- Assert important intermediate steps, not only the final answer.
- Compare agent versions on the same cases.
- Catch regressions in planning, routing, and tool use.

## What A Flow Test Covers

A unit test asks, "Does this tool work?"

A flow integration test asks, "Can the agent complete the task using the model, tools, memory, retrieval, and stop rules together?"

Typical flow:

```text
User task
  -> agent chooses next step
  -> model calls tool
  -> host validates tool call
  -> tool returns observation
  -> model uses observation
  -> agent stops with final answer
```

## Test With Controlled Dependencies

Use real orchestration code but controlled dependencies:

| Dependency | Test strategy |
| --- | --- |
| Tools | Fake or sandbox side-effecting tools. |
| Retrieval | Fixed test documents. |
| Clock | Fixed time. |
| External APIs | Mock responses. |
| Model | Use a real model for quality evals; use stubbed model outputs for deterministic orchestration tests. |

Both styles are useful. Stubbed tests catch code regressions. Real-model evals catch behavior regressions.

## What To Assert

Do not assert every token. Assert the behavior that matters.

| Assertion | Example |
| --- | --- |
| Stop reason | Agent stops with `success`, not `max_steps`. |
| Tool choice | Agent calls `search_policy` before drafting. |
| Tool arguments | `tenant_id` matches the user's tenant. |
| Safety gate | `send_email` is not called without approval. |
| Final answer | Draft cites the policy and asks for missing information. |
| Cost and latency | Run stays under the budget for this task class. |

## Example Test Case

```yaml
case_id: billing_refund_001
input: >
  A customer says they were charged twice and wants a refund.
expected:
  required_tools:
    - search_policy
    - create_draft_reply
  forbidden_tools:
    - issue_refund
  final_answer_must_include:
    - draft reply
    - refund policy citation
    - request for transaction id if missing
budgets:
  max_steps: 6
  max_latency_ms: 10000
```

This test checks the whole flow without demanding one exact final sentence.

## Example Assertions In Code

The exact test shape depends on your framework, but the assertions usually look like this:

```python
def test_refund_flow_requires_policy_lookup(agent, fake_tools):
    result = agent.run("Customer was charged twice and wants a refund.")

    assert result.stop_reason == "success"
    assert result.tool_calls[0].name == "search_policy"
    assert "create_draft_reply" in [call.name for call in result.tool_calls]
    assert "issue_refund" not in [call.name for call in result.tool_calls]
    assert "policy" in result.final_answer.lower()
    assert result.latency_ms < 10_000
```

This test does not care whether the reply says "I understand" or "I can help." It cares that the agent followed the required process.

## Example: Passing vs Failing Flow

Passing flow:

```text
1. User asks about duplicate charge.
2. Agent calls search_policy(query="duplicate charge refund").
3. Agent calls get_ticket(ticket_id).
4. Agent calls create_draft_reply(...).
5. Agent stops with approval_required because no refund was issued.
```

Failing flow:

```text
1. User asks about duplicate charge.
2. Agent calls issue_refund(amount=unknown).
3. Tool rejects the request.
4. Agent retries issue_refund with a guessed amount.
5. Agent hits max_steps.
```

The final answer might simply say "I could not complete the task," but the trace shows the real problem: unsafe tool choice plus looping after a fatal error.

## Debugging Failed Flow Tests

When a flow test fails, label the root cause:

| Root cause | Example |
| --- | --- |
| Prompt | The tool instructions are ambiguous. |
| Model | The model ignores an instruction that smaller evals pass. |
| Tool schema | The model cannot supply a required argument. |
| Retrieval | The policy document is missing or ranked too low. |
| Orchestration | The host executes unsafe tool calls. |
| Stop rule | The agent loops after enough information exists. |

That label tells the team what to fix.

## Common Failure Modes

| Failure | Better approach |
| --- | --- |
| Only checking final text | Also check tool calls and stop reason. |
| Live tools in tests | Use sandbox/fake side effects. |
| No versioned eval set | Store cases and scores with the code. |
| One giant test | Split by task class: retrieval, write action, escalation, refusal. |

## Practice

Write five flow cases for a tool-using support agent. Include one happy path, one missing-information case, one tool timeout, one prompt-injection attempt, and one case requiring human approval.

## Resources

- [LangSmith traces and datasets](https://docs.langchain.com/langsmith/)
- [Stage 09 - Building an agent loop from scratch](../../09-building-agents/agent-loop-from-scratch/index.md)
- [Stage 04 - Stopping criteria](../../04-agent-fundamentals/stopping-criteria/index.md)

</div>

# Tracing and Structured Logging

<div class="topic-page" markdown="1">

<section class="topic-hero">
  <span class="topic-hero__eyebrow">Stage 11 - Evaluation and Observability</span>
  <p class="topic-hero__lead">A trace shows the path of one agent run. Structured logs show searchable facts across many runs. Together they make failures reproducible instead of mysterious.</p>
  <div class="topic-hero__facts">
    <span>Trace</span>
    <span>Span</span>
    <span>Run ID</span>
    <span>Events</span>
    <span>Redaction</span>
  </div>
</section>

## Goal

By the end of this topic, you should be able to:

- Explain traces, spans, logs, metrics, and events.
- Add run IDs to connect model calls, tool calls, and final outputs.
- Log useful debugging fields without leaking secrets or private data.
- Inspect a failed run from user input to stop reason.

## Core Concepts

| Concept | Meaning |
| --- | --- |
| Trace | One complete request or agent run. |
| Span | One timed operation inside a trace, such as retrieval or a tool call. |
| Log | A structured record of something that happened. |
| Metric | A numeric measurement over time, such as p95 latency. |
| Event | A meaningful point in a run, such as approval requested. |

For agents, a trace often contains:

```text
agent.run
  retrieve.documents
  model.plan
  tool.search_tickets
  model.draft
  safety.check
  agent.final
```

## Fields To Capture

Capture enough to debug, but not so much that logs become a privacy risk.

| Field | Example |
| --- | --- |
| `run_id` | `run_2026_06_12_001` |
| `user_id_hash` | stable hash, not raw email |
| `agent_version` | `support-agent@1.4.2` |
| `model` | `gpt-4.1` |
| `prompt_version` | `refund-v7` |
| `tool_name` | `search_policy` |
| `tool_args_summary` | safe summary, not secrets |
| `latency_ms` | `3200` |
| `input_tokens` / `output_tokens` | usage tracking |
| `cost_usd` | estimated cost |
| `stop_reason` | `success`, `max_steps`, `approval_required` |
| `error_type` | `rate_limit`, `tool_timeout`, `schema_error` |

## Redaction Rules

Logs are production data. Treat them as sensitive.

Do not log:

- API keys or tokens,
- raw passwords,
- full payment data,
- unnecessary PII,
- complete private documents unless there is a clear approved need,
- untrusted tool output as if it were an instruction.

Prefer:

- hashes instead of raw identifiers,
- source IDs instead of full documents,
- summarized tool arguments,
- redacted message content,
- short excerpts only when needed for debugging.

## Debugging With A Trace

When a user reports a bad answer, inspect the run in order:

1. Did the request route to the expected agent version?
2. Was the prompt version correct?
3. Did retrieval return the right sources?
4. Did the model choose the right tool?
5. Were tool arguments valid?
6. Did a tool return an error?
7. Did the safety or approval gate run?
8. Why did the agent stop?

This order prevents guessing.

## Common Failure Modes

| Failure | Result |
| --- | --- |
| Plain text logs only | Hard to search and aggregate. |
| No run ID | Model calls and tool calls cannot be connected. |
| Logging raw secrets | Security incident. |
| No prompt/model version | Reproducing old failures becomes impossible. |
| Only aggregate metrics | You know failure rate increased but not why. |

## Practice

Add structured logging to one agent loop. For every run, record `run_id`, model, prompt version, tool calls, latency, token usage, cost estimate, stop reason, and error type.

## Resources

- [OpenTelemetry GenAI semantic conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/)
- [LangSmith observability](https://docs.langchain.com/langsmith/)
- [OpenLLMetry documentation](https://github.com/traceloop/openllmetry)

</div>

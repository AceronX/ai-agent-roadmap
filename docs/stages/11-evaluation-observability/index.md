# 11 Evaluation and Observability

**Phase 3 - Systems**  
Stage 11 of 14. Previous: [Stage 10 - Multi-Agent Systems](../10-multi-agent-systems/index.md). Next: [Stage 12 - Security and Ethics](../12-security-ethics/index.md).

## Goal

Learn to measure, test, trace, and debug agent systems.

## Learn

- [Agent quality metrics](agent-quality-metrics/index.md)
- [Tool unit tests](tool-unit-tests/index.md)
- [Flow integration tests](flow-integration-tests/index.md)
- [Prompt regression tests](prompt-regression-tests/index.md)
- [RAG evaluation](rag-evaluation/index.md)
- [Tracing and structured logging](tracing-and-structured-logging/index.md)
- [Human review](human-review/index.md)
- [Evaluation and observability tools](evaluation-tools/index.md)

## Start Here

Evaluation is how you decide whether an agent change actually helped. Observability is how you explain what happened when an agent run failed.

For agents, a single final answer is not enough to judge quality. You also need to inspect the steps:

| Layer | What to measure |
| --- | --- |
| Final answer | correctness, completeness, tone, groundedness |
| Tool calls | selected tool, arguments, errors, retries, permissions |
| Retrieval | relevant documents found, irrelevant documents avoided |
| Run behavior | latency, token use, cost, loops, stop reason |
| Production health | failure rate, escalation rate, user feedback, incident patterns |

Beginner rule:

```text
Do not change prompts, models, tools, or retrieval settings without a small eval set.
Otherwise you are guessing.
```

## Build

Create an evaluation suite with test cases, expected outcomes, cost tracking, latency tracking, and trace review.

## Exit Criteria

- You can define success metrics before changing prompts or models.
- You can trace an agent run from user input to final response.
- You can reproduce and debug failures.
- You can compare two agent versions with the same eval set.
- You can separate model quality failures from tool, retrieval, and orchestration failures.

## Checkpoint

Use the [Stage 11 checkpoint](checkpoint.md) before moving on.

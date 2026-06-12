# Checkpoint: Evaluation and Observability

- [ ] I can define task success metrics.
- [ ] I can unit test individual tools.
- [ ] I can run integration tests for an agent flow.
- [ ] I can inspect traces and logs for a failed run.
- [ ] I measured quality, latency, cost, and failure rate.
- [ ] I can compare two prompt or model versions on the same eval set.
- [ ] I can evaluate retrieval separately from answer generation.
- [ ] I can label failures by root cause: model, prompt, tool, retrieval, orchestration, or policy.
- [ ] I can design a human review rubric for subjective or high-risk outputs.

## Practical Check

Before moving on, build a small evaluation suite for one agent:

- at least 20 realistic cases,
- expected behavior for each case,
- one answer-quality rubric,
- tool-call or retrieval assertions where relevant,
- latency and cost tracking,
- trace IDs for failed runs,
- a short report comparing two agent versions.

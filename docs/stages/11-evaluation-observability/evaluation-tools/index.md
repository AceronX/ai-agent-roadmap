# Evaluation and Observability Tools

<div class="topic-page" markdown="1">

<section class="topic-hero">
  <span class="topic-hero__eyebrow">Stage 11 - Evaluation and Observability</span>
  <p class="topic-hero__lead">Tools help you store datasets, run experiments, inspect traces, collect feedback, and monitor production behavior. Choose tools by workflow, not popularity.</p>
  <div class="topic-hero__facts">
    <span>Datasets</span>
    <span>Experiments</span>
    <span>Traces</span>
    <span>Feedback</span>
    <span>Monitoring</span>
  </div>
</section>

## Goal

By the end of this topic, you should be able to:

- Explain what evaluation and observability tools do.
- Choose a tool category for your team's current need.
- Avoid depending on a tool before defining metrics and datasets.
- Compare tools such as LangSmith, Ragas, DeepEval, Helicone, LangFuse, and OpenLLMetry.

## Tool Categories

| Category | Use it for |
| --- | --- |
| Eval runner | Run cases and score outputs. |
| RAG evaluator | Measure retrieval and groundedness. |
| Trace viewer | Inspect model, tool, and retrieval steps. |
| Prompt experiment tracker | Compare prompt/model versions. |
| LLM gateway/monitor | Track requests, cost, latency, and errors. |
| Telemetry framework | Send traces and metrics to your observability stack. |

You may need more than one category. For example, a team might use Ragas for RAG metrics, LangSmith for traces and datasets, and OpenTelemetry for production telemetry.

## Common Tools

| Tool | Good for |
| --- | --- |
| LangSmith | Datasets, experiments, traces, feedback, LangChain/LangGraph workflows. |
| Ragas | RAG and agent evaluation metrics. |
| DeepEval | LLM test cases, metrics, and CI-style evaluation. |
| Helicone | LLM gateway logging, monitoring, cost, latency, and request analytics. |
| LangFuse | Open-source LLM observability, prompt management, traces, eval workflows. |
| OpenLLMetry | OpenTelemetry-based tracing for LLM apps. |
| OpenTelemetry | Vendor-neutral traces, metrics, and logs. |
| Promptfoo | Prompt and model regression testing. |

This list is not a ranking. The right tool depends on your stack, budget, privacy needs, and whether you need local, hosted, or open-source deployment.

## Selection Checklist

Ask these questions before adopting a tool:

- Can it store versioned eval datasets?
- Can it compare experiments across prompt and model versions?
- Can it show model calls, tool calls, retrieval, and final output in one trace?
- Can it track cost, latency, token use, and errors?
- Does it support human feedback?
- Does it integrate with CI?
- Can sensitive data be redacted?
- Is hosted deployment acceptable, or do you need self-hosting?
- Can the team export data if you switch tools later?

## Start Small

Do not start by wiring every tool.

Good first setup:

```text
1. A versioned eval dataset in the repo.
2. A script that runs the agent on every case.
3. A score file with quality, latency, cost, and failure reason.
4. Trace IDs for failed runs.
5. One dashboard or viewer for production traces.
```

Add specialized tools when the manual workflow becomes painful.

## Example Tool Choices

For a small team building a document-answering support agent:

| Need | Reasonable tool choice |
| --- | --- |
| Store eval cases and run experiments | LangSmith or a repo-based YAML/JSON eval runner |
| Measure RAG groundedness | Ragas |
| Track production cost and latency | Helicone or LangFuse |
| Export traces to existing observability | OpenTelemetry or OpenLLMetry |
| Run prompt checks in CI | Promptfoo or DeepEval |

For an early prototype, a simple JSON dataset plus a script may be enough. For production, trace search, feedback collection, and cost dashboards become much more valuable.

## Example: Lightweight Local Eval Runner

Before adopting a platform, a team can start with a tiny local workflow:

```text
eval_cases.yaml
run_eval.py
results/
  2026-06-12-prompt-v7.json
  2026-06-13-prompt-v8.json
```

Example result row:

```json
{
  "case_id": "refund_cancel_003",
  "agent_version": "support-agent@1.4.2",
  "prompt_version": "refund-v8",
  "score": 4,
  "latency_ms": 3810,
  "cost_usd": 0.012,
  "failure_reason": "missing cancellation link",
  "trace_id": "run_2026_06_13_018"
}
```

This simple file-based setup teaches the core workflow. Observability tools become easier to evaluate once the team already knows what data it wants.

## Common Failure Modes

| Failure | Fix |
| --- | --- |
| Buying observability before defining metrics | Define scorecards first. |
| Tool lock-in | Keep eval cases in portable files. |
| No redaction plan | Decide what cannot leave your system. |
| Separate eval and production data | Connect production failures back to eval datasets. |
| Only dashboard monitoring | Add regression tests in CI. |

## Practice

Choose two tools from the table. For your current agent project, write which workflow each tool would improve, what data it would need, and what privacy or deployment concern it introduces.

## Resources

- [LangSmith documentation](https://docs.langchain.com/langsmith/)
- [Ragas documentation](https://docs.ragas.io/)
- [DeepEval documentation](https://deepeval.com/docs/getting-started)
- [Helicone documentation](https://docs.helicone.ai/)
- [LangFuse documentation](https://langfuse.com/docs)
- [OpenLLMetry repository](https://github.com/traceloop/openllmetry)
- [OpenTelemetry GenAI semantic conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/)

</div>

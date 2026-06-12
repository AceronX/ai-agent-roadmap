# Agent Quality Metrics

<div class="topic-page" markdown="1">

<section class="topic-hero">
  <span class="topic-hero__eyebrow">Stage 11 - Evaluation and Observability</span>
  <p class="topic-hero__lead">Agent quality is not one score. A useful eval checks whether the agent solved the task, followed constraints, used tools safely, stayed grounded, and did it within acceptable cost and latency.</p>
  <div class="topic-hero__facts">
    <span>Correctness</span>
    <span>Grounding</span>
    <span>Safety</span>
    <span>Cost</span>
    <span>Latency</span>
  </div>
</section>

## Goal

By the end of this topic, you should be able to:

- Define success metrics before changing an agent.
- Separate answer quality from process quality.
- Track cost, latency, and failure rate alongside correctness.
- Build a small evaluation table that can compare agent versions.

## Learning Path

<div class="learning-grid learning-grid--path">
  <a class="learning-card" href="#part-1-what-quality-means">
    <strong>Part 1 - What Quality Means</strong>
    <span>Define the outcome and behavior you want.</span>
  </a>
  <a class="learning-card" href="#part-2-answer-metrics">
    <strong>Part 2 - Answer Metrics</strong>
    <span>Correctness, completeness, format, and groundedness.</span>
  </a>
  <a class="learning-card" href="#part-3-process-metrics">
    <strong>Part 3 - Process Metrics</strong>
    <span>Tool choices, retries, loops, cost, and latency.</span>
  </a>
  <a class="learning-card" href="#part-4-scorecards">
    <strong>Part 4 - Scorecards</strong>
    <span>Turn vague quality into repeatable review.</span>
  </a>
</div>

## Part 1: What Quality Means

An agent eval starts with the task, not the model.

Bad metric:

```text
The answer looks good.
```

Better metric:

```text
For each billing support ticket, the agent must identify the issue,
cite the relevant policy, choose no destructive tool without approval,
and draft a reply that a human support agent can send with light edits.
```

That definition gives you multiple things to measure:

| Dimension | Question |
| --- | --- |
| Task success | Did the agent solve the user's actual problem? |
| Factuality | Are the claims correct? |
| Grounding | Are claims supported by retrieved or tool-provided evidence? |
| Constraint following | Did the agent obey format, policy, and safety rules? |
| Tool behavior | Did it call the right tools with valid arguments? |
| Efficiency | Did it finish within acceptable cost and latency? |

## Part 2: Answer Metrics

Use answer metrics for the final response or final artifact.

Common metrics:

| Metric | Good when |
| --- | --- |
| Correctness | There is a known right answer or expected decision. |
| Completeness | The answer must cover several required points. |
| Format adherence | The output must match JSON, Markdown, a ticket template, or a schema. |
| Groundedness | The answer must be supported by sources or tool results. |
| Helpfulness | Human reviewers must judge whether the output is usable. |
| Safety | The output must avoid unsafe actions, sensitive data leaks, or policy violations. |

For deterministic checks, use code. For subjective checks, use a rubric.

Example rubric:

```text
5 - Correct, complete, cited, and ready to use.
4 - Mostly correct; minor edit needed.
3 - Useful but missing one important detail.
2 - Partly wrong or weakly grounded.
1 - Incorrect, unsafe, or not useful.
```

## Part 3: Process Metrics

Agents fail inside the run, not only at the final answer. Process metrics show why.

Track these for every run:

| Metric | Why it matters |
| --- | --- |
| Tool call count | Too many calls can mean looping or poor planning. |
| Tool success rate | Tool failures may look like model failures at the surface. |
| Invalid tool arguments | Shows schema or instruction weakness. |
| Retrieval hit rate | Shows whether the right documents were found. |
| Stop reason | Distinguishes success, max steps, timeout, and safety stop. |
| Latency | Agents multiply model, retrieval, and tool time. |
| Token use and cost | A correct agent can still be too expensive to ship. |

Do not optimize one metric alone. A cheaper model that reduces correctness may be worse. A very accurate agent that takes 90 seconds may also be unusable.

## Part 4: Scorecards

A scorecard keeps evaluation consistent across reviewers.

Example:

| Field | Type | Example |
| --- | --- | --- |
| `case_id` | string | `billing_014` |
| `input` | string | user ticket or task |
| `expected_behavior` | string | cite refund policy and draft reply |
| `answer_score` | 1-5 | `4` |
| `grounded` | boolean | `true` |
| `unsafe_action` | boolean | `false` |
| `tool_errors` | integer | `0` |
| `latency_ms` | integer | `4200` |
| `cost_usd` | number | `0.014` |
| `notes` | string | missing cancellation link |

Keep the first eval set small: 20-50 realistic cases is enough to catch many regressions. Add cases whenever production fails.

## Worked Example: Support Reply Agent

Suppose the agent reads a customer ticket, searches a refund policy, and drafts a reply.

Input:

```text
Customer says they cancelled yesterday but were charged for the annual plan.
They want a refund and sound frustrated.
```

Good evaluation record:

| Field | Value |
| --- | --- |
| `case_id` | `refund_cancel_003` |
| `expected_behavior` | Check cancellation/refund policy, do not promise refund, draft empathetic reply. |
| `required_tool` | `search_policy` |
| `forbidden_tool` | `issue_refund` without approval |
| `answer_score` | `4` |
| `grounded` | `true` |
| `failure_reason` | Missing link to cancellation settings |

The final answer is only one part of the score. If the reply sounds good but the agent skipped policy lookup, the run should still lose points.

## Example: Bad Score vs Good Score

Same input:

```text
I cancelled my plan yesterday. Why was I still charged?
```

Weak output:

```text
Sorry about that. You are eligible for a refund, and I will process it now.
```

Why it scores poorly:

| Metric | Result |
| --- | --- |
| Correctness | Unknown; the agent did not check policy or account state. |
| Grounding | No citation or tool evidence. |
| Safety | Promises a refund and implies action without approval. |
| Process | Missing required policy lookup. |

Stronger output:

```text
I found the cancellation policy. Annual-plan refunds depend on the renewal date
and account status, so I drafted a reply asking for the transaction ID and
linking the refund policy for review before any action is taken.
```

Why it scores better:

| Metric | Result |
| --- | --- |
| Correctness | Avoids claiming eligibility without evidence. |
| Grounding | Uses policy lookup. |
| Safety | Drafts only; no refund is issued. |
| Process | Handles missing transaction ID. |

## Common Failure Modes

| Failure | What to do |
| --- | --- |
| Only measuring final answer quality | Add tool, retrieval, cost, and latency fields. |
| Changing prompts without a baseline | Save scores for the old version first. |
| Using only easy examples | Include ambiguous, adversarial, and edge cases. |
| Mixing all failures together | Label root cause: model, prompt, tool, retrieval, orchestration, or policy. |

## Practice

Create a 20-case eval set for one agent you have built. For each case, define expected behavior, a 1-5 answer rubric, and at least three process metrics.

## Resources

- [LangSmith evaluation concepts](https://docs.langchain.com/langsmith/evaluation)
- [DeepEval metrics introduction](https://deepeval.com/docs/metrics-introduction)
- [OpenAI Evals repository](https://github.com/openai/evals)

</div>

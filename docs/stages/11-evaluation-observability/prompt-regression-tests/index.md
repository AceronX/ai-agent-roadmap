# Prompt Regression Tests

<div class="topic-page" markdown="1">

<section class="topic-hero">
  <span class="topic-hero__eyebrow">Stage 11 - Evaluation and Observability</span>
  <p class="topic-hero__lead">Prompt changes can improve one example and quietly break ten others. Prompt regression tests compare old and new behavior on the same task set before a change ships.</p>
  <div class="topic-hero__facts">
    <span>Baseline</span>
    <span>Dataset</span>
    <span>Diffs</span>
    <span>Rubrics</span>
    <span>Release gate</span>
  </div>
</section>

## Goal

By the end of this topic, you should be able to:

- Create a baseline before editing prompts.
- Run the same eval cases against two prompt versions.
- Detect improvements, regressions, and neutral changes.
- Use regression results as a release gate.

## Why Prompt Regressions Happen

A prompt is part of the product logic. Small wording changes can affect:

- which tool the model chooses,
- how much context it uses,
- whether it asks clarifying questions,
- whether it follows a schema,
- whether it over-refuses,
- whether it leaks internal reasoning or untrusted text.

Never judge a prompt change from the example that motivated the change. That example is only one case.

## Baseline First

Before editing:

1. Save the current prompt version.
2. Run the eval set.
3. Store scores, traces, model ID, temperature, date, and config.
4. Make the prompt change.
5. Run the exact same eval set.
6. Compare results.

Example result table:

| Case | Old score | New score | Result |
| --- | ---: | ---: | --- |
| `refund_001` | 3 | 5 | improved |
| `refund_002` | 5 | 5 | unchanged |
| `injection_004` | 5 | 2 | regressed |

The regression matters even if the average score improved. A safety regression can block a release.

## What To Keep Stable

For a fair comparison, keep these stable:

| Field | Why |
| --- | --- |
| Eval inputs | Otherwise the score change is meaningless. |
| Model ID | Model changes can hide prompt changes. |
| Temperature | Higher randomness makes diffs noisy. |
| Tools | Tool changes create a different experiment. |
| Retrieval corpus | Document changes affect groundedness. |
| Scoring rubric | Moving the scoring rule moves the target. |

If you intentionally change multiple things, record that it is a combined experiment.

## Useful Test Buckets

Build regression sets by risk:

| Bucket | Example |
| --- | --- |
| Golden paths | Common requests that must keep working. |
| Edge cases | Missing fields, ambiguous tasks, unusual formats. |
| Safety cases | Prompt injection, destructive tool requests, PII. |
| Format cases | JSON schema, table output, short answer limits. |
| Cost cases | Long context, many tools, repeated retries. |

Add every production failure to the relevant bucket so it cannot silently return.

## Example: One Prompt Change, Three Outcomes

Old instruction:

```text
Draft a helpful support reply using the available policy context.
```

New instruction:

```text
Draft a concise support reply using only the available policy context.
If the policy does not answer the question, say what information is missing.
```

Regression result:

| Case | What changed | Outcome |
| --- | --- | --- |
| `refund_001` | Stopped inventing refund eligibility. | improved |
| `password_002` | Still answered correctly. | unchanged |
| `angry_customer_003` | Became too terse and lost empathy. | regressed |

The new prompt is not automatically better. The team must decide whether to keep it, revise it, or add a style instruction for frustrated customers.

## Common Failure Modes

| Failure | Fix |
| --- | --- |
| Manual spot checks only | Use a saved eval dataset. |
| No old baseline | Run and store baseline before changing prompts. |
| Only average score tracked | Also inspect worst-case and safety regressions. |
| High-temperature evals | Lower randomness for regression testing. |
| No release rule | Define what score drop blocks a merge. |

## Practice

Take one prompt from Stage 09. Create ten eval cases and score the current prompt. Then make one prompt change and record which cases improved, regressed, or stayed the same.

## Resources

- [LangSmith prompt experiments](https://docs.langchain.com/langsmith/evaluation)
- [Promptfoo documentation](https://www.promptfoo.dev/docs/intro/)
- [Stage 03 - Prompt testing](../../03-prompt-engineering/prompt-testing/index.md)

</div>

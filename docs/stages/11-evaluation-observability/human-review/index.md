# Human Review

<div class="topic-page" markdown="1">

<section class="topic-hero">
  <span class="topic-hero__eyebrow">Stage 11 - Evaluation and Observability</span>
  <p class="topic-hero__lead">Human review is how teams judge subjective quality, safety, and business fit. It is also how production failures become better eval cases.</p>
  <div class="topic-hero__facts">
    <span>Rubrics</span>
    <span>Sampling</span>
    <span>Escalation</span>
    <span>Feedback</span>
    <span>Labels</span>
  </div>
</section>

## Goal

By the end of this topic, you should be able to:

- Design a human review rubric for agent outputs.
- Decide which runs need review.
- Convert reviewer feedback into eval cases.
- Use review without making every workflow manual.

## When Human Review Is Needed

Use human review when quality is subjective or risk is high:

| Situation | Why review helps |
| --- | --- |
| Customer-facing drafts | Tone and completeness matter. |
| Legal, medical, financial, or policy content | Domain judgment and risk controls matter. |
| Destructive actions | Approval is part of safety. |
| New agent release | Review catches unknown failure modes. |
| Low-confidence outputs | The agent should escalate instead of guessing. |

Human review does not mean every output must be manually approved forever. It can be sampled, risk-based, or temporary during rollout.

## Review Rubric

A rubric makes reviewers consistent.

Example:

| Dimension | 1 | 3 | 5 |
| --- | --- | --- | --- |
| Correctness | Wrong | Partly correct | Correct |
| Completeness | Missing key facts | Covers most needs | Covers all required points |
| Grounding | Unsupported | Some support | Fully supported by evidence |
| Tone | Inappropriate | Acceptable | Clear and professional |
| Safety | Unsafe | Needs caution | Safe and policy-compliant |

Add a free-text `failure_reason` field. The reason is often more useful than the score.

## Sampling Strategy

Review everything at the beginning. Then move to targeted sampling.

| Review bucket | Example |
| --- | --- |
| Random sample | 5% of ordinary successful runs. |
| High-risk sample | 100% of destructive or regulated actions. |
| Low-confidence sample | Runs with weak retrieval or uncertain classification. |
| New release sample | First 100 runs after prompt/model change. |
| Failure sample | All user complaints, escalations, and safety stops. |

## Closing The Loop

Human review should improve the system.

```text
reviewed run
  -> label failure reason
  -> add or update eval case
  -> fix prompt/tool/retrieval/orchestration
  -> rerun regression tests
```

Do not let review live only in a dashboard. Pull important examples back into the repository as durable eval cases.

## Common Failure Modes

| Failure | Fix |
| --- | --- |
| Vague reviewer instructions | Use a rubric with examples. |
| Only reviewing failures | Also sample successes to estimate real quality. |
| No failure labels | Require a reason category. |
| Feedback not connected to evals | Add reviewed failures to the eval dataset. |
| Review queue too large | Use risk-based sampling and automation. |

## Practice

Design a review form for a support-agent draft. Include five scored dimensions, one required failure category, and one free-text note. Define which runs require review before sending.

## Resources

- [LangSmith human feedback](https://docs.langchain.com/langsmith/)
- [Stage 05 - Boundaries and destructive tools](../../05-tools-and-actions/boundaries-and-destructive-tools/index.md)
- [Stage 12 - Security and Ethics](../../12-security-ethics/index.md)

</div>

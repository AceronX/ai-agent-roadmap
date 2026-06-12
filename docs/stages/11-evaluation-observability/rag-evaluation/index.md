# RAG Evaluation

<div class="topic-page" markdown="1">

<section class="topic-hero">
  <span class="topic-hero__eyebrow">Stage 11 - Evaluation and Observability</span>
  <p class="topic-hero__lead">RAG evaluation checks two separate systems: retrieval quality and answer quality. A bad answer may come from the model, but it may also come from missing, stale, or irrelevant retrieved context.</p>
  <div class="topic-hero__facts">
    <span>Recall</span>
    <span>Precision</span>
    <span>Groundedness</span>
    <span>Faithfulness</span>
    <span>Citations</span>
  </div>
</section>

## Goal

By the end of this topic, you should be able to:

- Evaluate retrieval separately from generation.
- Measure whether the right chunks appear in top-k results.
- Check whether the final answer is grounded in retrieved evidence.
- Diagnose whether a RAG failure is indexing, retrieval, reranking, or prompting.

## Split The Problem

RAG has two main stages:

```text
Question -> retrieve evidence -> generate answer from evidence
```

Evaluate each stage separately.

| Stage | Evaluation question |
| --- | --- |
| Retrieval | Did we fetch the right evidence? |
| Generation | Did the model answer using only that evidence? |

If retrieval fails, a stronger model may still hallucinate. If retrieval succeeds but generation fails, the prompt, context format, or model behavior is the likely issue.

## Retrieval Metrics

Common retrieval metrics:

| Metric | Meaning |
| --- | --- |
| Recall@k | Did any relevant chunk appear in the top `k` results? |
| Precision@k | How many of the top `k` results were relevant? |
| MRR | How high did the first relevant result rank? |
| nDCG | Did more relevant results appear near the top? |

For small teams, start with Recall@5 and manual relevance labels. If the correct document is not in the top five, the generator probably cannot answer reliably.

## Generation Metrics

Generation metrics:

| Metric | Meaning |
| --- | --- |
| Faithfulness | Are answer claims supported by retrieved context? |
| Answer relevance | Does the answer address the user question? |
| Context use | Did the answer use the best retrieved evidence? |
| Citation accuracy | Do citations point to the source that supports the claim? |
| Refusal behavior | Does the model say it does not know when evidence is missing? |

For production RAG, "sounds right" is not enough. The answer should be traceable to source chunks.

## RAG Failure Diagnosis

| Symptom | Likely cause |
| --- | --- |
| Correct document never retrieved | Chunking, embeddings, metadata filters, or query rewriting. |
| Correct document retrieved but ranked low | Reranking or query formulation. |
| Correct context retrieved but answer is wrong | Prompt, context formatting, or model behavior. |
| Answer cites irrelevant source | Citation formatting or source tracking bug. |
| Answer uses stale policy | Index refresh or document versioning problem. |

## Test Dataset Shape

```yaml
case_id: rag_policy_007
question: "Can customers get a refund after 45 days?"
expected_sources:
  - refund-policy-v3#late-refunds
expected_answer_points:
  - standard refund window is 30 days
  - exceptions require manager approval
  - answer should not promise a refund
```

Store source IDs, not just expected prose. That lets you measure retrieval and answer quality separately.

## Common Failure Modes

| Failure | Fix |
| --- | --- |
| Evaluating only the final answer | Add retrieval metrics. |
| No source IDs in chunks | Add stable document and chunk identifiers. |
| Stale corpus | Track document version and index time. |
| Too many chunks in context | Rerank and trim instead of dumping everything. |
| No negative cases | Include questions where the answer is not in the corpus. |

## Practice

Create ten RAG eval questions for a small document set. For each question, label the expected source chunk. Run retrieval and record Recall@3, Recall@5, and whether the generated answer stays grounded.

## Resources

- [Ragas available metrics](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/)
- [LlamaIndex evaluation docs](https://docs.llamaindex.ai/en/stable/module_guides/evaluating/)
- [Stage 07 - RAG and Memory](../../07-rag-and-memory/index.md)

</div>

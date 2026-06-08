# Embeddings and Vector Search

<div class="topic-page" markdown="1">

<section class="topic-hero">
  <span class="topic-hero__eyebrow">Stage 07 - RAG and Memory</span>
  <p class="topic-hero__lead">Embeddings and vector search are the retrieval layer behind many RAG and memory systems. In agent systems, they are not just a math trick. They decide which document chunks, past events, semantic memories, and user facts are brought back into the model's context.</p>
  <div class="topic-hero__facts">
    <span>Embeddings</span>
    <span>Chunks</span>
    <span>Metadata</span>
    <span>Hybrid search</span>
    <span>Evaluation</span>
  </div>
</section>

## Goal

Understand how embeddings and vector search are used inside agent RAG and
memory systems, and how to design retrieval that is useful, safe, and measurable.

After this topic, you should be able to explain:

- how embeddings connect user requests to relevant context,
- how document chunks differ from memory records,
- why metadata and permissions matter as much as vector similarity,
- when to combine vector search with keyword search and filters,
- how reranking improves retrieval quality,
- how to test whether retrieval is working,
- what mistakes cause agents to retrieve wrong, stale, private, or distracting context.

## Before You Start

[Stage 02 introduced embeddings and vector search](../../02-llm-fundamentals/embeddings-vector-search/index.md)
as fundamentals. This topic uses those ideas inside a working agent system.

Start with one rule:

```text
Vector search retrieves similar context.
The agent still has to decide whether that context is relevant, allowed, fresh, and useful.
```

Beginner example:

```text
User asks:
  "How do I recover access if my authenticator app is gone?"

Vector search might retrieve:
  "MFA reset policy"
  "Account recovery guide"
  "Device replacement checklist"

The agent should then check:
  Is this the right tenant?
  Is the policy current?
  Is the user allowed to see it?
  Does the chunk actually answer the question?
```

### Key Words In Plain English

| Word | Simple Meaning | Beginner Example |
| --- | --- | --- |
| Embedding | A list of numbers representing meaning | vector for a support article chunk |
| Vector search | Finding items with nearby embeddings | search similar policy text |
| Chunk | A smaller piece of a document | one section from a handbook |
| Metadata | Structured facts stored with an item | source, owner, version, permission |
| Filter | Exact rule applied before or during retrieval | only search this user's workspace |
| Hybrid search | Combining vector and keyword search | semantic match plus exact product name |
| Reranker | A second model or scoring step that reorders results | move the truly relevant chunk to rank 1 |
| Recall | Whether retrieval found the needed item | did the answer chunk appear in top 5? |
| Precision | Whether retrieved items are useful | are the top chunks actually relevant? |

## Learning Path

This topic is designed in four parts. Read them in order.

<div class="learning-grid learning-grid--path">
  <a class="learning-card" href="#part-1-understand-the-agent-retrieval-loop">
    <strong>Part 1 - Understand The Retrieval Loop</strong>
    <span>Learn how an agent embeds, searches, filters, and injects context.</span>
  </a>
  <a class="learning-card" href="#part-2-design-indexed-records">
    <strong>Part 2 - Design Indexed Records</strong>
    <span>Store chunks and memories with the metadata needed for citations, permissions, freshness, and debugging.</span>
  </a>
  <a class="learning-card" href="#part-3-improve-retrieval-quality">
    <strong>Part 3 - Improve Retrieval Quality</strong>
    <span>Use chunking, hybrid search, filters, reranking, and query rewriting to retrieve better context.</span>
  </a>
  <a class="learning-card" href="#part-4-test-and-operate-vector-search">
    <strong>Part 4 - Test And Operate</strong>
    <span>Measure retrieval quality and avoid stale, private, noisy, or expensive retrieval.</span>
  </a>
</div>

## Part 1: Understand The Agent Retrieval Loop

Embeddings let an agent search by meaning instead of exact words. A user can ask
one thing, a document can say it another way, and vector search can still connect
them.

Simple definition:

```text
An embedding model turns text into vectors.
Vector search compares those vectors to find similar stored items.
```

In RAG and memory, the retrieved items are not the final answer. They are context
for the model.

```mermaid
flowchart LR
    A[User request] --> B[Create query embedding]
    B --> C[Apply filters]
    C --> D[Vector or hybrid search]
    D --> E[Rerank and trim results]
    E --> F[Add selected context to prompt]
    F --> G[Model answers or acts]
```

**How to read this diagram:** the agent does not send every stored document or
memory to the model. It searches, filters, ranks, and only then adds a small set
of useful context to the prompt.

### What Vector Search Is Good At

Vector search is useful when wording may vary.

| Stored Text | User Request |
| --- | --- |
| "Reset MFA from the recovery portal." | "I lost my authenticator app." |
| "Refunds are available within 30 days." | "Can I get my money back after two weeks?" |
| "Use pytest fixtures for shared setup." | "How should I avoid repeated test setup code?" |

The search works because the meanings are close, even when the words differ.

### What Vector Search Is Bad At

Vector search is not enough by itself.

| Problem | Why Similarity Is Not Enough |
| --- | --- |
| Exact IDs | `INV-10492` may need keyword or SQL lookup |
| Permissions | Similar private content must not be retrieved |
| Freshness | Similar old policy may be wrong |
| Completeness | The closest chunk may omit an important condition |
| Numbers and dates | Small exact differences can matter |
| Rare names | Embeddings may blur unusual product, customer, or file names |

Practical rule:

```text
Use vector search for meaning.
Use metadata, SQL, keyword search, and tools for exact constraints.
```

### Retrieval vs Memory

Embeddings can support both RAG and memory, but the stored records are different.

| Store | Usually Contains | Example Retrieval |
| --- | --- | --- |
| RAG knowledge base | External documents and chunks | policy, manual, API docs |
| Episodic memory | Past events and interactions | similar debugging session |
| Semantic memory | Durable facts and preferences | user's preferred framework |
| User profile | Stable structured user facts | timezone, role, language |

The same vector database may hold several kinds of records, but the agent should
keep their schemas and retrieval rules separate.

## Part 2: Design Indexed Records

An embedding alone is not enough. A retrievable item needs text, metadata, and a
link back to the source.

### Document Chunk Record

A RAG chunk should be designed for retrieval, citation, and debugging.

Example:

```json
{
  "record_type": "document_chunk",
  "chunk_id": "chunk_policy_042",
  "source_id": "employee-handbook",
  "source_title": "Employee Handbook",
  "section": "MFA recovery",
  "chunk_text": "Employees who lose access to their authenticator app must verify identity through the recovery portal before MFA is reset.",
  "embedding_model": "text-embedding-model-name",
  "document_version": "2026-05-14",
  "tenant_id": "acme",
  "visibility": "internal",
  "updated_at": "2026-05-14T09:00:00Z"
}
```

Important fields:

| Field | Why It Matters |
| --- | --- |
| `chunk_id` | Identifies the exact retrieved text |
| `source_id` | Links to the original document |
| `source_title` | Supports human-readable citations |
| `section` | Preserves local meaning |
| `chunk_text` | The context the model may use |
| `embedding_model` | Needed for reindexing and debugging |
| `document_version` | Prevents stale or mixed facts |
| `tenant_id` / `visibility` | Prevents permission leaks |
| `updated_at` | Helps freshness and audits |

### Memory Record

Memory records need different metadata because they come from interactions,
decisions, or extracted facts.

Example episodic memory:

```json
{
  "record_type": "episodic_memory",
  "memory_id": "evt_883",
  "user_id": "user_123",
  "project": "ai-agent-roadmap",
  "event": "User asked to add an applied embeddings and vector search topic to Stage 07.",
  "outcome": "The topic should focus on agent retrieval rather than repeat Stage 02 fundamentals.",
  "source": "conversation",
  "occurred_at": "2026-06-08T12:30:00Z",
  "privacy_level": "normal"
}
```

Example semantic memory:

```json
{
  "record_type": "semantic_memory",
  "memory_id": "mem_219",
  "user_id": "user_123",
  "fact": "The user prefers roadmap topics that are practical and beginner-friendly.",
  "confidence": 0.82,
  "evidence_count": 3,
  "source": "conversation_summary",
  "updated_at": "2026-06-08T12:30:00Z"
}
```

Memory records should usually include confidence, source, privacy level, and an
update or expiry strategy. A memory can be similar and still unsafe or outdated.

### Chunk Text Should Be Self-Contained

Bad chunk:

```text
This is allowed only after approval.
```

Better chunk:

```text
MFA reset is allowed only after identity approval from the recovery portal.
```

The better chunk carries the subject with it. Retrieval works better because the
embedding includes the meaning, and the model can understand the chunk when it is
shown out of its original document.

### Store Metadata For Filters Before Search

Permission and scope filters should happen before retrieval when possible.

```mermaid
flowchart LR
    A[User request] --> B[Determine tenant, user, role, workspace]
    B --> C[Apply metadata filters]
    C --> D[Search allowed records only]
    D --> E[Return ranked context]
```

**How to read this diagram:** the retriever should search only records the user
is allowed to see. Do not retrieve private records and hope the model ignores
them.

## Part 3: Improve Retrieval Quality

Good retrieval is usually the result of several small design choices, not one
magic database setting.

### Chunking

Chunking often matters more than the vector database choice.

Useful starting point for text:

- split by meaning, not only by character count,
- keep headings with the chunk,
- keep tables, procedures, and code blocks intact when possible,
- use moderate overlap when a concept crosses boundaries,
- avoid huge chunks that contain several unrelated topics,
- avoid tiny chunks that lose context.

| Bad Chunking | Better Chunking |
| --- | --- |
| Split a refund policy halfway through exceptions | Keep policy, exceptions, and country condition together |
| Mix account setup, billing, and deletion in one chunk | Separate by task or section |
| Drop headings before embedding | Preserve headings and source section |

### Hybrid Search

Hybrid search combines semantic search with exact matching.

Use hybrid search when the request contains:

- product names,
- file names,
- code symbols,
- invoice numbers,
- error messages,
- legal terms,
- short acronyms,
- rare names.

Example:

```text
Question:
  "What does error A17 mean in the billing sync job?"

Vector search helps with:
  "billing sync job"

Keyword search helps with:
  "A17"
```

The combined result is usually better than either method alone.

### Query Rewriting

Sometimes the user's request is not a good search query. The agent can rewrite it
before retrieval.

Example:

```text
User request:
  "It broke again after I changed auth."

Better retrieval query:
  "authentication configuration change caused failure; previous auth debugging sessions and docs"
```

Query rewriting should preserve intent. It should not invent facts that the user
did not provide.

### Reranking

The first vector search can retrieve a broad candidate set. A reranker then
scores which candidates actually answer the request.

```mermaid
flowchart LR
    A[Query] --> B[Retrieve top 30 candidates]
    B --> C[Rerank candidates]
    C --> D[Keep top 5]
    D --> E[Add to prompt]
```

**How to read this diagram:** retrieval can optimize for recall first, then
reranking improves precision before context is added to the model.

Reranking is useful when:

- top results are close but noisy,
- chunks are semantically similar but only some answer the question,
- the knowledge base is large,
- the model context budget is small,
- citations must be accurate.

### Context Selection

Do not send every retrieved item to the model. Each chunk competes for context
window space.

Before adding context, ask:

- Does this chunk answer the question?
- Is it allowed for this user?
- Is it current?
- Is it redundant with another chunk?
- Is it too long for the available budget?
- Does it need a citation or source label?

Simple context pack:

```text
Retrieved context:
1. [employee-handbook > MFA recovery > 2026-05-14]
   Employees who lose access to their authenticator app must verify identity...

2. [support-runbook > Account recovery > 2026-04-02]
   Support agents may start the recovery flow after the user confirms...
```

The model can now answer with grounded context and cite the source labels.

## Part 4: Test And Operate Vector Search

Retrieval quality should be measured. Eyeballing a few examples is not enough.

### Build A Retrieval Test Set

Create test questions with expected source chunks.

Example:

| Test Question | Expected Relevant Source |
| --- | --- |
| "I lost my authenticator app. How do I get back in?" | MFA recovery policy |
| "Can I get a refund after 14 days?" | refund policy |
| "How do we share setup across pytest tests?" | testing guide fixtures section |

For each question, run retrieval and check whether the expected source appears.

### Useful Retrieval Metrics

| Metric | What It Checks | Simple Question |
| --- | --- | --- |
| Recall@k | Did the right item appear in the top k? | Was the answer chunk in top 5? |
| Precision@k | How many retrieved items were useful? | Were the top 5 mostly relevant? |
| MRR | How high was the first correct result? | Was the first good chunk ranked near the top? |
| nDCG | Were better results ranked higher? | Did the ranking match human relevance? |

For beginners, start with recall@5 and a small human review of precision. If the
right chunk is not retrieved at all, generation cannot reliably fix the answer.

### Common Failure Modes

| Failure | What It Looks Like | Fix |
| --- | --- | --- |
| Bad chunking | The right document is indexed, but the answer is split away | Rechunk by section or meaning |
| Missing metadata | Retrieved context cannot be cited or filtered | Store source, version, owner, and permissions |
| Permission leak | User retrieves another tenant's data | Filter before search |
| Stale index | Old policy appears after document update | Re-embed on change and track versions |
| Query too vague | Search retrieves broad, generic context | Rewrite query or ask a clarifying question |
| Keyword miss | Exact code, ID, or error is ignored | Add hybrid search |
| Noisy top-k | Similar but irrelevant chunks crowd the prompt | Add reranking and deduplication |
| Over-retrieval | Too many chunks confuse the model | Trim context and enforce budget |

### Freshness And Reindexing

Embeddings do not update automatically when source content changes. A production
system needs an indexing policy.

Track:

- source document version,
- chunk version,
- embedding model name,
- created and updated timestamps,
- deletion state,
- indexing job status.

When a document changes:

```mermaid
flowchart LR
    A[Source changes] --> B[Detect changed sections]
    B --> C[Rechunk changed content]
    C --> D[Create new embeddings]
    D --> E[Replace or version old chunks]
    E --> F[Run retrieval tests]
```

**How to read this diagram:** indexing is part of the product, not a one-time
setup script. The retriever should know which chunks are current.

### Safety Checklist

Before using retrieved context in an answer, check:

- Was retrieval scoped to the correct user, tenant, workspace, or role?
- Does each chunk have a source and version?
- Is sensitive memory excluded unless the task truly needs it?
- Is old context expired or marked stale?
- Can the user inspect or delete saved memory where appropriate?
- Does the answer avoid claiming more than the retrieved context supports?

### Beginner Design Pattern

A practical first RAG and memory retriever can look like this:

```text
1. Classify the request:
   document question, memory question, profile lookup, or exact data lookup.

2. Choose retrieval sources:
   documents, episodic memory, semantic memory, SQL profile, or tool.

3. Apply filters:
   tenant, user, permission, product, date, visibility.

4. Retrieve candidates:
   vector search, keyword search, or hybrid search.

5. Rerank and trim:
   keep the smallest useful set.

6. Generate with source labels:
   answer only from relevant context and cite sources when needed.

7. Evaluate:
   log query, retrieved IDs, answer quality, misses, and stale results.
```

This pattern keeps embeddings in the right role: they help find likely context,
but the agent system still controls scope, safety, ranking, and measurement.

## Common Misconceptions

| Misconception | Better Understanding |
| --- | --- |
| Vector search understands truth | It compares similarity, not truth. |
| The closest chunk is always the best answer | Similarity and relevance are related but not identical. |
| Bigger top-k always improves answers | Too much context can distract the model. |
| Embeddings replace permissions | Permissions must be enforced by the retrieval system. |
| RAG and memory should use one schema | Documents, episodes, semantic facts, and profiles need different fields. |
| Reindexing is optional | Changed or deleted sources must update the index. |
| A vector database fixes bad content | Poor chunking and missing metadata still produce poor retrieval. |

## Practice

### Practice 1: Choose The Retrieval Method

For each request, choose vector search, keyword search, SQL lookup, hybrid
search, or no retrieval:

1. "What does error `AUTH_REFRESH_401` mean?"
2. "How do I reset my password?"
3. "What is my account renewal date?"
4. "Remind me what we decided in the last planning session."
5. "Summarize this paragraph."

### Practice 2: Improve The Record

This indexed record is weak:

```json
{
  "text": "Users can request it after approval.",
  "embedding": "[...]"
}
```

Improve it by adding self-contained text and metadata for source, version,
permissions, and citation.

### Practice 3: Diagnose A Retrieval Failure

An agent answers with an old refund policy even though the policy changed last
week.

Explain which parts of the retrieval system you would inspect:

- source document update flow,
- chunk version,
- embedding creation time,
- metadata filters,
- stale chunk deletion,
- retrieval test coverage.

## Summary

Embeddings and vector search help an agent find useful context by meaning. They
are powerful, but they are only one part of retrieval design. Good agent systems
also use metadata, filters, hybrid search, reranking, citations, freshness
tracking, and retrieval tests.

Before moving on, you should be able to:

- explain how a query becomes retrieved context,
- design a document chunk record with useful metadata,
- distinguish document chunks from memory records,
- explain why permission filtering should happen before retrieval,
- describe when hybrid search and reranking help,
- name basic retrieval metrics such as recall@k and precision@k,
- identify common causes of poor vector search results.

</div>

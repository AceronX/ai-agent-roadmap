# Embeddings and Vector Search

## Goal

Learn how embeddings turn data into vectors, how vector search finds similar meaning, and how AI agents use this for retrieval, memory, recommendations, and document Q&A.

After this lesson, you should be able to explain:

- what an embedding is,
- what a vector is,
- how vector search works,
- why it is different from keyword search,
- how it helps an AI agent find useful context,
- what can go wrong in a real retrieval system.

## Short Definition

An embedding turns text, images, or other data into a list of numbers called a vector.

The vector keeps useful meaning from the original item. Items with similar meaning get vectors that are close together in vector space.

Vector search takes a query vector and finds the stored vectors nearest to it. This lets a system find related information even when the exact words are different.

```text
"How do I reset my password?"
  -> embedding model
  -> [0.12, -0.33, 0.88, ...]
  -> vector search
  -> "Account credential recovery procedure"
```

This is why embeddings and vector search are important for AI agents.

## Why It Matters For AI Agents

An LLM does not automatically know your private documents, latest tickets, product manuals, meeting notes, or previous user memories.

An agent needs a way to search external knowledge before answering or acting.

Embeddings and vector search help agents:

- match questions with relevant answers,
- find related documents,
- retrieve long-term memory,
- suggest similar items,
- connect ideas across different wording,
- ground responses in evidence instead of guessing.

## Keyword Search vs Vector Search

Keyword search looks for matching words.

```text
Query:
  "How do I reset my password?"

Keyword search looks for:
  reset
  password
```

It may miss a document titled:

```text
Account credential recovery procedure
```

The meaning is similar, but the words are different.

Vector search compares meaning.

```text
Query meaning:
  "recover account access"

Document meaning:
  "credential recovery"

Result:
  close match
```

Use keyword search when exact words matter. Use vector search when meaning matters. In production RAG systems, hybrid search often uses both.

## What Is An Embedding?

An embedding is a numeric representation of meaning.

Example:

```text
"Python programming tutorial"
  -> [0.22, 0.91, -0.14, 0.07, ...]
```

The list of numbers is called a vector.

Each position in the vector is a dimension. Real embedding models may produce vectors with hundreds or thousands of dimensions, such as 384, 768, 1536, or 3072 dimensions.

You do not manually choose what each number means. The embedding model learns a useful representation from training data.

The important idea is simple:

```text
similar meaning  -> nearby vectors
different meaning -> distant vectors
```

## Simple Example

These sentences should be close in vector space:

```text
A: "How do I learn Python?"
B: "Best way to study Python programming"
```

This sentence should be farther away:

```text
C: "Where can I buy pizza?"
```

Possible simplified vectors:

```text
A -> [0.22, 0.91, 0.15]
B -> [0.25, 0.89, 0.18]
C -> [0.81, 0.05, 0.72]
```

A and B are close because they are about learning Python. C is far away because it is about food.

## What Can Be Embedded?

Embeddings can represent many kinds of data.

For LLM and agent development, common inputs are:

- user questions,
- document chunks,
- paragraphs,
- support tickets,
- code snippets,
- tool descriptions,
- conversation memories,
- product descriptions,
- images, audio, or video when using multimodal embedding models.

For basic RAG, you usually embed text chunks.

## What Is Vector Search?

Vector search finds stored vectors that are closest to a query vector.

Example:

```text
User query:
  "How can I recover my account password?"

Query embedding:
  [0.13, 0.44, 0.22, ...]

Vector search returns:
  1. Password Reset Guide
  2. Account Recovery Policy
  3. Login Troubleshooting
```

The vector database is not reasoning like an LLM. It is comparing numbers.

The system usually asks:

```text
Which stored vectors are nearest to this query vector?
```

## Basic Retrieval Flow

There are two flows: indexing and searching.

Indexing happens before the user asks a question.

```text
Documents
  -> split into chunks
  -> create embeddings
  -> store vectors with text and metadata
```

Searching happens when the user asks a question.

```text
User question
  -> create query embedding
  -> search nearest vectors
  -> retrieve matching chunks
  -> send chunks to LLM
  -> generate grounded answer
```

For an agent, retrieval is often a tool.

```text
Agent receives task
  -> calls search_knowledge_base(query)
  -> reads retrieved chunks
  -> answers or chooses next action
```

## Why Chunking Matters

A chunk is a small piece of a larger document.

Do not usually embed a whole long document as one vector. A long document may contain many topics, so the vector becomes too broad.

Bad retrieval unit:

```text
100-page employee handbook
```

Better retrieval units:

```text
Chunk 1: Password reset policy
Chunk 2: MFA recovery steps
Chunk 3: Vacation approval process
Chunk 4: Expense reimbursement rules
```

Good starting defaults:

| Setting | Practical Start |
| --- | --- |
| Chunk size | 300-800 tokens |
| Chunk overlap | 50-150 tokens |
| Keep with chunk | title, heading, source |
| Avoid cutting | tables, code blocks, step-by-step procedures |

Chunking quality often matters more than the vector database choice.

## What To Store With Each Vector

A vector alone is not enough. Store the original text and metadata too.

Example record:

```json
{
  "id": "it-handbook-password-reset-003",
  "text": "To reset your password, open the identity portal...",
  "embedding": [0.021, -0.338, 0.104],
  "metadata": {
    "source": "IT Handbook",
    "section": "Password Reset",
    "url": "https://intranet.example.com/it/password-reset",
    "created_at": "2026-02-10",
    "tenant_id": "company-a",
    "visibility": "employees"
  }
}
```

Important metadata:

- source title,
- URL or file path,
- page, heading, or section,
- document version,
- created or updated date,
- tenant or organization ID,
- user access level,
- language,
- tags or category.

Metadata helps the agent cite sources, filter results, enforce permissions, and debug bad answers.

## Similarity Scores

Vector search needs a way to measure closeness.

Common similarity methods:

| Method | Meaning | Common Use |
| --- | --- | --- |
| Cosine similarity | Compares direction | Text embeddings |
| Dot product | Compares alignment and magnitude | Normalized vectors |
| Euclidean distance | Measures straight-line distance | General vector search |

Use the similarity method recommended by your embedding model or vector database.

Do not assume scores are universal. A score of `0.80` may be strong for one model and weak for another.

## Top-K And Thresholds

`top_k` means how many search results to return.

```text
top_k = 3
  -> fewer chunks
  -> lower token cost
  -> may miss useful evidence

top_k = 20
  -> more evidence
  -> higher token cost
  -> more noise
```

A score threshold removes weak matches.

```text
Only return chunks with similarity >= 0.75
```

Start simple, then measure retrieval quality with real questions.

## Metadata Filtering

Vector similarity is not enough. You also need filters.

Example query:

```text
What is the refund policy?
```

Without filters, the system may retrieve:

- the wrong country,
- an old policy,
- another customer's policy,
- admin-only information.

Better search:

```text
similarity search
+ country = "Germany"
+ document_status = "published"
+ tenant_id = "acme"
+ visibility = "customer"
```

For AI agents, permission filtering must happen before the LLM sees the retrieved text.

## Hybrid Search

Vector search is good for meaning.

Keyword search is good for exact terms.

Use vector search for:

- paraphrases,
- natural language questions,
- vague user wording,
- conceptual similarity.

Use keyword search for:

- error codes,
- product IDs,
- exact names,
- legal references,
- version numbers.

Hybrid search combines both:

```text
query
  -> keyword search
  -> vector search
  -> merge or rerank results
```

This is often better than vector search alone.

## Reranking

Vector search is fast, but the first result is not always the best.

A reranker reviews the top results and sorts them more carefully.

```text
Vector search:
  return top 30 candidates

Reranker:
  choose best 5 chunks

LLM:
  answer using those chunks
```

Use reranking when:

- documents are long,
- many chunks look similar,
- exact evidence matters,
- the first search results are inconsistent.

## How Agents Use Embeddings

AI agents can use embeddings and vector search in several ways.

| Agent Need | How Vector Search Helps |
| --- | --- |
| Knowledge retrieval | Finds relevant docs before answering |
| Long-term memory | Retrieves past facts or user preferences |
| Tool selection | Finds tools related to the task |
| Example lookup | Finds similar solved cases |
| Recommendation | Finds related products, posts, or actions |
| Planning | Retrieves previous plans or constraints |

Important rule:

```text
Retrieved text is evidence, not truth.
```

The agent still needs to check whether the retrieved chunks actually answer the user request.

## Minimal Python Example

This example uses fake embeddings to show the idea.

```python
from numpy import dot
from numpy.linalg import norm


def cosine_similarity(a, b):
    return dot(a, b) / (norm(a) * norm(b))


documents = [
    {
        "id": "doc-1",
        "text": "Reset your password from the identity portal.",
        "embedding": [0.90, 0.10, 0.05],
    },
    {
        "id": "doc-2",
        "text": "Submit expenses within thirty days.",
        "embedding": [0.05, 0.85, 0.10],
    },
    {
        "id": "doc-3",
        "text": "Use multi-factor authentication when logging in.",
        "embedding": [0.75, 0.20, 0.15],
    },
]

query_embedding = [0.88, 0.12, 0.04]

ranked = sorted(
    documents,
    key=lambda doc: cosine_similarity(query_embedding, doc["embedding"]),
    reverse=True,
)

for doc in ranked[:2]:
    print(doc["id"], doc["text"])
```

Real systems replace fake embeddings with an embedding API or local embedding model. They replace the list of documents with a vector database or vector index.

## Common Mistakes

Embedding whole documents:

Long documents mix many topics. Split them into chunks.

Ignoring metadata:

The system may retrieve the right meaning from the wrong source, date, tenant, or permission group.

Using only vector search:

Exact IDs, error codes, and names may be missed.

Returning too few chunks:

The correct evidence may never reach the LLM.

Returning too many chunks:

The LLM may get noisy context and answer from the wrong source.

Not updating the index:

Old document chunks can produce outdated answers.

No retrieval evaluation:

You cannot know whether changes improved quality.

Permission leaks:

Private chunks must be filtered before retrieval results go to the LLM.

## How To Evaluate Retrieval

Create a small test set.

```text
Question | Expected source | Expected answer fact
```

Example:

```text
Question:
  How do I reset my password?

Expected source:
  IT Handbook > Password Reset

Expected answer fact:
  Use the identity portal
```

Measure:

- Did the correct chunk appear in the top 3 or top 5 results?
- Was the first result actually useful?
- Did the answer cite the correct source?
- Did retrieval add too much latency?
- Did the search respect user permissions?

For agent development, ask:

```text
Did the agent retrieve the right evidence before answering or acting?
```

## Practical Defaults

Use these as starting values.

| Item | Default |
| --- | --- |
| Chunk size | 300-800 tokens |
| Chunk overlap | 50-150 tokens |
| Search results before rerank | 10-30 |
| Search results sent to LLM | 3-8 |
| Search type | Hybrid when exact terms matter |
| Required metadata | source, section, URL/path, timestamp, tenant, permission |
| Evaluation set | 20-50 realistic questions |

Adjust these only after testing with real documents and real questions.

## Opinion

Embeddings and vector search are not magic. They are a retrieval system.

The embedding model matters, but many retrieval problems come from basic engineering issues:

- bad chunks,
- missing metadata,
- weak filters,
- stale documents,
- no hybrid search,
- no reranking,
- no evaluation.

For an AI agent developer, the best mental model is:

```text
Embeddings create searchable meaning.
Vector search finds related evidence.
The LLM decides how to use that evidence.
```

## Practice

Build a tiny semantic search example.

1. Choose 5-10 short documents.
2. Split each document into chunks.
3. Generate embeddings for each chunk.
4. Store chunk text, vector, and metadata.
5. Embed a user query.
6. Retrieve the top 3 chunks.
7. Print the score, source, and text.
8. Change the query wording and test again.
9. Add an exact code like `ERR-4017` and check whether keyword or hybrid search is needed.

Write down:

- what query you tested,
- which chunk ranked first,
- whether the answer was present,
- what failed,
- what you changed,
- whether quality improved.

## Resources

- [OpenAI Embeddings API documentation](https://platform.openai.com/docs/api-reference/embeddings)
- [OpenAI embeddings guide](https://platform.openai.com/docs/guides/embeddings)
- [Pinecone: What is Vector Search?](https://www.pinecone.io/learn/vector-search-basics/)
- [Pinecone: What are Vector Embeddings?](https://www.pinecone.io/learn/vector-embeddings/)
- [OpenAI Cookbook: vector database examples](https://github.com/openai/openai-cookbook/tree/main/examples/vector_databases)
- [pgvector](https://github.com/pgvector/pgvector)
- [Qdrant filtering concepts](https://qdrant.tech/documentation/concepts/filtering/)

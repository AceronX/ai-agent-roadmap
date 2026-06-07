# Test of 02 LLM Fundamentals

This study test checks understanding of every main section in **02 LLM Fundamentals**.

| Section | Questions |
| --- | ---: |
| Transformer Models and LLMs | 12 |
| Tokenization | 12 |
| Context Windows | 12 |
| Model Families and Licenses | 12 |
| Generation Controls | 12 |
| Pricing and Latency | 12 |
| Embeddings and Vector Search | 12 |
| RAG Basics | 12 |
| **Total** | **96** |

## Transformer Models and LLMs

### Question 1

**Q:** What is the core behavior of a large language model?

**A:**

An LLM predicts the next token from the tokens already in context. It repeats this process token by token until the response is complete or a stop condition is reached.

### Question 2

**Q:** Why is an LLM called an autoregressive model?

**A:**

Because each generated token is appended back into the context and used to predict the next token. The output is built step by step from previous tokens.

### Question 3

**Q:** Why is an LLM not the same as a database?

**A:**

A database retrieves stored facts. An LLM generates likely text from learned patterns and current context. It can sound confident even when it has not verified the fact.

### Question 4

**Q:** After the model picks one token, what happens next in autoregressive generation?

**A:**

The chosen token is appended to the tokens so far, and the model runs again to predict the next token.

### Question 5

**Q:** What high-level path does text follow inside a transformer?

**A:**

```text
token IDs -> token embeddings -> positional information
-> transformer blocks -> logits -> probabilities
```

### Question 6

**Q:** What do token embeddings do inside the transformer?

**A:**

They turn token IDs into vectors so the model can represent meaning, usage, and relationships numerically.

### Question 7

**Q:** Why does the transformer need positional information?

**A:**

The same tokens can mean different things in different orders. Positional information tells the model where each token appears in the sequence.

### Question 8

**Q:** What does attention allow a token to do?

**A:**

Attention lets a token weigh other tokens in the context and pull in the most relevant information for its current meaning.

### Question 9

**Q:** Why did attention help transformers handle long-range relationships better than older sequence models?

**A:**

Attention lets tokens connect directly to distant tokens instead of passing information step by step through a long sequence.

### Question 10

**Q:** Why does long input usually increase cost and latency for transformer models?

**A:**

Attention compares tokens with other tokens. Longer inputs require more computation, so they usually cost more and respond more slowly.

### Question 11

**Q:** Compare a base model and an assistant model.

**A:**

A base model mainly autocompletes likely text. An assistant model has been instruction-tuned and aligned to follow user requests more reliably.

### Question 12

**Q:** A model answers a private company-policy question without retrieved policy documents. What is the likely failure?

**A:**

The model guessed from learned patterns. The agent should retrieve the policy, use a tool, ask for the source, or say it does not know from the provided context.

## Tokenization

### Question 13

**Q:** What is tokenization?

**A:**

Tokenization is the process of splitting raw text into token pieces and mapping those pieces to token IDs that a model can process.

### Question 14

**Q:** Why are tokens not the same as words?

**A:**

A token can be a word, part of a word, punctuation, whitespace, a symbol, a byte-level piece, or a special control token.

### Question 15

**Q:** What is the basic tokenization pipeline?

**A:**

```text
raw text -> tokenizer -> token pieces -> token IDs
-> embeddings -> LLM -> output token IDs -> decoded text
```

### Question 16

**Q:** Why can two similar-looking strings have different token counts?

**A:**

Spaces, capitalization, punctuation, symbols, language, code formatting, and tokenizer vocabulary can all change how text is split.

### Question 17

**Q:** Compare word-level, character-level, and subword tokenization.

**A:**

Word-level is easy to understand but struggles with rare words. Character-level can represent anything but creates long sequences. Subword-level balances compactness and coverage.

### Question 18

**Q:** Why do modern LLMs often use subword tokenization?

**A:**

It keeps common words compact while still handling rare names, new terms, code identifiers, and multilingual text by splitting them into known pieces.

### Question 19

**Q:** What is the basic idea of BPE-style tokenization?

**A:**

BPE starts with small units and repeatedly merges frequent adjacent pairs, creating useful token pieces from common patterns.

### Question 20

**Q:** What are special tokens?

**A:**

Special tokens are model or API control tokens used for structure, such as beginning or end markers, role separators, padding, or tool-call delimiters.

### Question 21

**Q:** Why is the visible user message not the full model input in an agent system?

**A:**

The full input may include system instructions, developer instructions, previous messages, tool definitions, tool outputs, retrieved context, examples, schemas, and hidden formatting tokens.

### Question 22

**Q:** Why can raw JSON, logs, and code consume many tokens?

**A:**

They contain repeated keys, punctuation, indentation, symbols, timestamps, IDs, and uncommon identifiers that may split into many token pieces.

### Question 23

**Q:** What does token-aware chunking mean?

**A:**

It means splitting documents by meaning while respecting token budgets, keeping headings with related text, avoiding broken code blocks, and reserving room for metadata and output.

### Question 24

**Q:** What should an agent developer do before sending a long prompt to a model?

**A:**

Count tokens with the target model's tokenizer, remove low-value context, compress tool results, keep required constraints, and reserve enough output space.

## Context Windows

### Question 25

**Q:** What is a context window?

**A:**

A context window is the maximum amount of input and generated output a model can attend to in one request, measured in tokens.

### Question 26

**Q:** Why is the context window like working memory for one model call?

**A:**

The model only uses tokens included in the current prompt plus generated tokens. It does not automatically remember everything outside that request.

### Question 27

**Q:** What can consume context in an agent call?

**A:**

System instructions, developer instructions, conversation history, tool definitions, tool results, retrieved chunks, files, code snippets, examples, and reserved answer space.

### Question 28

**Q:** Why does a large context window not mean all of it is free user space?

**A:**

Part of the budget is already used by instructions, history, tool schemas, retrieved context, and the output tokens the model must generate.

### Question 29

**Q:** What can happen when a prompt exceeds the model's context limit?

**A:**

The application must reduce it before the call can run, often by truncating, summarizing, selecting fewer chunks, shrinking tool outputs, or splitting the task.

### Question 30

**Q:** What is a common failure caused by careless truncation?

**A:**

Important requirements or tool results can be removed, causing the agent to ignore constraints, repeat work, or answer from incomplete evidence.

### Question 31

**Q:** Why can keeping full tool output in context hurt answer quality?

**A:**

Large raw outputs can bury the useful facts, increase cost and latency, and distract the model with irrelevant rows or details.

### Question 32

**Q:** Compare long context, RAG, summarized memory, and structured state.

**A:**

Long context reads a known large input. RAG retrieves relevant external knowledge. Summarized memory preserves durable facts. Structured state tracks exact values, decisions, and progress.

### Question 33

**Q:** When is long context a good choice?

**A:**

Use long context when the model truly must inspect or compare a known large input in one call and the added cost and latency are acceptable.

### Question 34

**Q:** Why should conversation history usually be shortened before core constraints?

**A:**

Old conversation often has lower value than current goal, safety rules, required constraints, confirmed facts, and relevant retrieved context.

### Question 35

**Q:** What is a good priority order for building an agent prompt under a token budget?

**A:**

Prioritize system instructions, goal and constraints, confirmed facts, current user message, relevant retrieved context, and only then recent conversation history.

### Question 36

**Q:** An agent ignores an earlier user constraint after many turns. What likely failed?

**A:**

The constraint was probably truncated, buried in long history, or not promoted into structured state or durable memory.

## Model Families and Licenses

### Question 37

**Q:** What is a model family?

**A:**

A model family is a group of related models built from similar architecture and training approach but released in different sizes, versions, or capabilities.

### Question 38

**Q:** Why do model families matter when choosing a model?

**A:**

They often provide tradeoffs between cost, latency, capability, context size, deployment options, and task fit.

### Question 39

**Q:** What are common model variants within a family?

**A:**

Families often ship variants such as base, instruct (chat), reasoning, code, and vision (multimodal) models, plus embedding models. Each is optimized for a different kind of task.

### Question 40

**Q:** What is the difference between a standard model and a reasoning model?

**A:**

A standard model answers quickly with little explicit intermediate thinking. A reasoning model spends extra compute on internal step-by-step reasoning before answering, which can improve hard planning, math, and coding tasks, usually at higher cost and latency.

### Question 41

**Q:** What is an open-weight model?

**A:**

An open-weight model shares its trained parameters so users can download, run, inspect, fine-tune, or build on it under the terms of its license.

### Question 42

**Q:** What is a closed-weight model?

**A:**

A closed-weight model does not share trained parameters publicly. Users usually access it through a hosted API or service controlled by the provider.

### Question 43

**Q:** What is the difference between open-weight and open-source?

**A:**

Open-weight means the trained parameters are available to download and run. Open-source usually implies more, such as training code, data, or a recognized open-source license. A model can be open-weight without being fully open-source.

### Question 44

**Q:** Compare open-weight and closed-weight models for deployment control.

**A:**

Open-weight models give more control over hosting, adaptation, and inspection. Closed-weight models give less infrastructure control but often provide managed access, strong hosted performance, and simpler operations.

### Question 45

**Q:** What is a model license?

**A:**

A license defines what users are legally allowed to do with a model, such as commercial use, modification, redistribution, fine-tuning, or sharing changes.

### Question 46

**Q:** What is the practical difference between permissive and copyleft licenses?

**A:**

Permissive licenses usually allow broad use, modification, and redistribution. Copyleft licenses may require distributed modified versions to release source code under similar terms.

### Question 47

**Q:** Why are many AI model licenses not identical to normal open-source software licenses?

**A:**

Some model providers use custom AI licenses with restrictions on deployment scale, redistribution, commercial use, or prohibited uses.

### Question 48

**Q:** A startup wants to fine-tune and deploy a model inside its own private infrastructure. Which model type is usually more suitable?

**A:**

An open-weight model is usually more suitable, assuming its license allows the intended fine-tuning and deployment.

## Generation Controls

### Question 49

**Q:** What do generation controls change?

**A:**

They change how the model chooses the next token. They do not add knowledge; they adjust focus, variety, repetition, risk, and stability.

### Question 50

**Q:** What is a logit?

**A:**

A logit is a raw model score for a possible next token before the score is converted into a probability.

### Question 51

**Q:** What does softmax do?

**A:**

Softmax converts adjusted logits into probabilities that can be sampled from.

### Question 52

**Q:** What is the beginner-friendly order for common generation controls?

**A:**

```text
raw logits -> repetition penalties -> temperature
-> softmax -> top-k/top-p filtering -> renormalize -> sample
```

### Question 53

**Q:** What does temperature control?

**A:**

Temperature controls how strongly high-scoring tokens dominate. Lower values are more focused and predictable; higher values allow more varied and risky choices.

### Question 54

**Q:** Why is low temperature usually better for tool calls and JSON?

**A:**

Tool calls and JSON need stable, parseable, schema-following output. High temperature can invent fields, change format, or drift.

### Question 55

**Q:** What does top-p sampling do?

**A:**

Top-p keeps the smallest group of highest-probability tokens whose total probability reaches the chosen probability mass, then samples from that group.

### Question 56

**Q:** Why is top-p called dynamic?

**A:**

When the model is confident, top-p may keep only a few tokens. When the model is uncertain, the same top-p value may keep many tokens.

### Question 57

**Q:** What does top-k sampling do?

**A:**

Top-k keeps a fixed number of highest-ranked candidate tokens, regardless of how much total probability they contain.

### Question 58

**Q:** Compare frequency penalty and presence penalty.

**A:**

Frequency penalty grows with how many times a token has appeared. Presence penalty applies once if a token has appeared at all.

### Question 59

**Q:** Why can repetition penalties hurt structured outputs?

**A:**

They may push the model away from required repeated keys, labels, names, code symbols, or technical terms.

### Question 60

**Q:** Why should beginners change one generation control at a time?

**A:**

Changing multiple controls together makes it hard to know which setting improved or damaged the output.

## Pricing and Latency

### Question 61

**Q:** What is LLM pricing usually based on?

**A:**

Most providers charge based on the number of tokens processed, usually separating input token cost and output token cost. Output tokens are often priced higher than input tokens.

### Question 62

**Q:** What is the simple formula for total LLM cost?

**A:**

```text
Total cost = input tokens cost + output tokens cost
```

### Question 63

**Q:** Why do both the user message and model response affect cost?

**A:**

The model must process input tokens and generate output tokens, and both are counted by most pricing systems.

### Question 64

**Q:** What is latency?

**A:**

Latency is the time it takes for the system to produce a response after a request is sent.

### Question 65

**Q:** What are the main components of total latency?

**A:**

```text
network time + queue time + inference time + tool time
```

### Question 66

**Q:** What is inference time?

**A:**

Inference time is the actual model processing and generation time. It is often the largest part of response latency.

### Question 67

**Q:** Why do agent systems often have higher latency than one-shot chat?

**A:**

Agents may call tools, wait for APIs or databases, make multiple model calls, and feed observations back into the loop before answering.

### Question 68

**Q:** How can long prompts increase both cost and latency?

**A:**

Long prompts contain more input tokens to process, use more context, and require more computation before generation.

### Question 69

**Q:** How can long answers increase both cost and latency?

**A:**

Long answers require more output tokens, and output tokens are generated sequentially, which takes time and adds cost.

### Question 70

**Q:** Why should an agent developer estimate cost before running a workload?

**A:**

Agent loops can multiply model calls, tool results, retrieved context, and output tokens. Estimation prevents unexpected bills and helps choose the right model and context strategy.

### Question 71

**Q:** What is one way to reduce latency in a tool-using agent?

**A:**

Reduce unnecessary tool calls, compress tool outputs, choose faster models for simple steps, cache reusable context, or parallelize independent tool calls.

### Question 72

**Q:** A model is cheap per token but slow for every request. What tradeoff should you evaluate?

**A:**

Evaluate whether lower cost is worth worse user experience, slower agent loops, and longer tool workflows. The best model is not always the cheapest per token.

## Embeddings and Vector Search

### Question 73

**Q:** What is an embedding?

**A:**

An embedding is a vector, or list of numbers, that represents the meaning or features of data such as text, images, or audio.

### Question 74

**Q:** Why do similar meanings appear near each other in embedding space?

**A:**

Embedding models are trained so semantically related items produce vectors that are close under a similarity metric.

### Question 75

**Q:** What is semantic clustering in embedding space?

**A:**

Semantic clustering means similar concepts, such as animals or fruit, appear closer together in vector space than unrelated concepts.

### Question 76

**Q:** What is chunking in an embedding pipeline?

**A:**

Chunking splits documents into smaller meaningful pieces before embedding, so retrieval can return focused passages instead of entire documents.

### Question 77

**Q:** Why can poor chunking hurt retrieval quality?

**A:**

If important information is split badly or mixed with unrelated text, vector search may miss the answer or retrieve confusing chunks.

### Question 78

**Q:** What is a vector database?

**A:**

A vector database stores, indexes, and retrieves high-dimensional vectors so similar items can be found quickly.

### Question 79

**Q:** What is vector search?

**A:**

Vector search embeds a query, compares it with stored vectors, and returns the nearest or most similar vectors.

### Question 80

**Q:** Why is vector search different from keyword search?

**A:**

Vector search compares meaning through embeddings, so it can match related wording such as "recover account password" and "reset login access" even when exact words differ.

### Question 81

**Q:** What is a similarity metric?

**A:**

A similarity metric defines what "close" means between vectors, such as cosine similarity, dot product, Euclidean distance, Manhattan distance, or Chebyshev distance.

### Question 82

**Q:** Why is cosine similarity common for text embeddings?

**A:**

It compares vector direction, which often captures semantic similarity better than raw vector size for text embeddings.

### Question 83

**Q:** Compare exact k-NN and ANN search.

**A:**

Exact k-NN compares the query against all vectors and can be expensive at scale. ANN searches an index for a fast approximate match, trading some precision for speed.

### Question 84

**Q:** Why is metadata required with vectors in real applications?

**A:**

Metadata enables filtering, citations, permissions, debugging, version control, tenant separation, dates, tags, and source display.

## RAG Basics

### Question 85

**Q:** What does RAG stand for?

**A:**

RAG stands for Retrieval-Augmented Generation.

### Question 86

**Q:** What is the simplest way to explain RAG?

**A:**

RAG means search first, answer second. The system retrieves relevant source text, adds it to the prompt, and asks the LLM to answer from that context.

### Question 87

**Q:** At a high level, what does a RAG architecture do before the model generates an answer?

**A:**

External knowledge is retrieved and added as context before a foundation model generates the final response.

### Question 88

**Q:** Why does RAG help reduce guessing?

**A:**

It gives the model relevant source text at answer time, so the model can ground its response in retrieved evidence instead of relying only on training patterns.

### Question 89

**Q:** What are the two main RAG pipelines?

**A:**

The indexing pipeline prepares documents for search. The question-answering pipeline retrieves relevant chunks for a user question and uses them in the LLM prompt.

### Question 90

**Q:** What happens in the indexing pipeline?

**A:**

Documents are cleaned, split into chunks, embedded, stored with text and metadata, and made searchable in a vector store or index.

### Question 91

**Q:** What happens in the question-answering pipeline?

**A:**

The user question is turned into a search query or embedding, relevant chunks are retrieved, chunks are placed in the prompt, and the LLM answers with sources.

### Question 92

**Q:** Why does RAG usually use embeddings and vector search?

**A:**

Embeddings let the system retrieve chunks by meaning, so user questions can match source text even when the wording differs.

### Question 93

**Q:** What should a strict basic RAG prompt tell the model?

**A:**

It should tell the model to answer only from the provided context, say it does not know if the answer is missing, and include the source when possible.

### Question 94

**Q:** When should you use RAG?

**A:**

Use RAG when answers depend on private data, recent data, changing knowledge, citations, known source material, or many documents that cannot all fit in context.

### Question 95

**Q:** When may RAG be unnecessary?

**A:**

RAG may be unnecessary for simple writing, rewriting, answers already in the prompt, general knowledge questions, or tasks with no external knowledge source.

### Question 96

**Q:** A RAG system retrieves the wrong country policy for a refund question. What likely failed?

**A:**

Metadata filtering or retrieval ranking failed. The system should filter by country, tenant, document status, visibility, and other relevant metadata before using chunks in the prompt.

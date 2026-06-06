# Test of LLM Fundamentals

This study test checks understanding of every main section in **Stage 02 - LLM Fundamentals**.

| Section | Questions |
| --- | ---: |
| Transformer Models and LLMs | 15 |
| Tokenization | 12 |
| Context Windows | 10 |
| Model Families and Licenses | 7 |
| Generation Controls | 15 |
| Pricing and Latency | 7 |
| Embeddings and Vector Search | 16 |
| RAG Basics | 12 |
| **Total** | **94** |

## Transformer Models and LLMs

### Q1

**Q:** What is the simplest accurate mental model of an LLM?

**A:**

An LLM is a transformer-based next-token predictor. It reads the current context, predicts the next likely token, appends it, and repeats until the response is complete.

### Q2

**Q:** What does next-token prediction mean?

**A:**

It means the model estimates which token should come next based on all previous tokens in the prompt and generated output.

### Q3

**Q:** Why can next-token prediction produce useful answers, code, and plans?

**A:**

To predict text well, the model learns patterns in language, facts, code, instructions, formats, and reasoning traces. Many useful tasks can be represented as likely continuations of context.

### Q4

**Q:** How does autoregressive generation work?

**A:**

The model generates one token at a time. Each generated token is added back into the context, then the model predicts the next token from the updated context.

### Q5

**Q:** What is a transformer in the context of LLMs?

**A:**

A transformer is a neural network architecture that converts token IDs into embeddings, adds positional information, processes them through attention and feed-forward layers, and outputs next-token scores.

### Q6

**Q:** What do token embeddings do inside a transformer?

**A:**

Token embeddings convert token IDs into numerical vectors so the model can process tokens as learned representations of meaning and usage.

### Q7

**Q:** Why does a transformer need positional information?

**A:**

Without positional information, the model would know which tokens exist but not their order. Order changes meaning, especially in instructions, code, and natural language.

### Q8

**Q:** What does attention do?

**A:**

Attention lets each token weigh which other tokens in the context are most relevant when building its representation.

### Q9

**Q:** Why was attention a breakthrough compared with older sequence models?

**A:**

Attention lets tokens connect directly to distant tokens and supports parallel training. Older recurrent models processed text more sequentially and struggled more with long-range dependencies.

### Q10

**Q:** In the transformer architecture diagram, what is the high-level flow from text to probabilities?

**A:**

```text
token IDs -> embeddings -> positional information -> transformer blocks -> logits -> probabilities
```

### Q11

**Q:** What are logits?

**A:**

Logits are raw scores the model assigns to possible next tokens before those scores are converted into probabilities.

### Q12

**Q:** What is the difference between a base model and an assistant model?

**A:**

A base model mainly autocompletes text. An assistant model has been instruction-tuned and aligned to follow user requests more reliably.

### Q13

**Q:** Why can a fluent LLM answer still be false?

**A:**

The model generates likely text, not verified truth. A false answer can sound fluent if it is statistically plausible in context.

### Q14

**Q:** Why should agent builders remember that tool calls are just text to the model?

**A:**

The model emits structured text that the application interprets as a tool call. That text can be malformed, unsafe, or incomplete, so tool arguments must be validated.

### Q15

**Q:** A model confidently answers a private policy question without being given policy documents. What likely went wrong?

**A:**

The model guessed from learned patterns. The system needs retrieval, a tool, or refusal behavior when authoritative context is missing.

## Tokenization

### Q16

**Q:** What is tokenization?

**A:**

Tokenization is the process of splitting raw text into token pieces and mapping those pieces to token IDs that the model can process.

### Q17

**Q:** Why is a token not always the same as a word?

**A:**

A token can be a full word, part of a word, punctuation, whitespace, a symbol, a byte-level piece, or a special control token.

Example: `Tokenization` might split into pieces like `Token` and `ization`, depending on the tokenizer.

### Q18

**Q:** What is the basic tokenization pipeline?

**A:**

```text
raw text -> tokenizer -> token pieces -> token IDs -> embeddings -> LLM -> output token IDs -> decoded text
```

### Q19

**Q:** Why do modern LLMs often use subword tokenization?

**A:**

Subword tokenization keeps common text compact while still handling rare words, names, code identifiers, and multilingual text by splitting them into known pieces.

### Q20

**Q:** Compare word-level, character-level, and subword tokenization.

**A:**

Word-level is easy to understand but struggles with rare words. Character-level can represent anything but creates long sequences. Subword-level balances coverage and compactness.

### Q21

**Q:** What is the basic idea of BPE tokenization?

**A:**

BPE starts with small units and repeatedly merges frequent adjacent pairs, creating useful token pieces from common patterns.

### Q22

**Q:** Why can code, JSON, or tool schemas consume many tokens?

**A:**

They contain punctuation, repeated keys, indentation, symbols, and uncommon identifiers that may split into many token pieces.

### Q23

**Q:** What are special tokens?

**A:**

Special tokens are control tokens used for structure, such as message role separators, start or end markers, padding, or tool-call delimiters.

### Q24

**Q:** Why is the user's visible message not the full prompt sent to the model?

**A:**

The full input may include system instructions, developer instructions, conversation history, tool schemas, tool results, examples, and hidden formatting tokens.

### Q25

**Q:** Why should developers count tokens with the target model's tokenizer?

**A:**

Different models can tokenize the same text differently, so accurate cost and context estimates require the actual tokenizer.

### Q26

**Q:** An agent becomes expensive after adding detailed tool definitions. What should you inspect?

**A:**

Inspect input token count, especially tool schemas, examples, repeated JSON keys, and hidden prompt structure.

### Q27

**Q:** What is the practical token-budget rule for agent prompts?

**A:**

Use the right tokens for the current step, not the most tokens possible. Compress or remove irrelevant history, tool outputs, and retrieved chunks.

Example:

```text
keep: goal, constraints, current question, relevant tool result
remove: old small talk, duplicate logs, unrelated retrieved chunks
```

## Context Windows

### Q28

**Q:** What is a context window?

**A:**

A context window is the maximum number of tokens the model can use in one request, including input tokens and generated output tokens.

### Q29

**Q:** What can consume context in an agent call?

**A:**

System prompts, developer instructions, user messages, prior turns, retrieved chunks, tool definitions, tool results, examples, structured state, and output tokens.

### Q30

**Q:** What happens when a prompt is too large for the context window?

**A:**

The application must reduce the prompt before the model call can run by summarizing, truncating, selecting fewer chunks, shrinking tool outputs, or splitting the task.

### Q31

**Q:** Why can careless truncation break an agent?

**A:**

It may remove important requirements, confirmed facts, tool results, or retrieved evidence needed for the next decision.

### Q32

**Q:** Why is a larger context window useful but not free?

**A:**

It allows more information in one call, but usually increases cost, latency, and the chance that irrelevant context distracts the model.

### Q33

**Q:** When is long context better than RAG, and when is RAG better?

**A:**

Long context is better when the model must inspect a known large input in one call. RAG is better when searching a large or changing knowledge source for only relevant parts.

Example: use long context to compare two uploaded contracts; use RAG to search thousands of company policy pages.

### Q34

**Q:** Compare summarized memory and structured state.

**A:**

Summarized memory compresses conversation facts but may lose nuance. Structured state stores exact goals, constraints, facts, and decisions in a compact, explicit form.

### Q35

**Q:** What should an agent context manager prioritize?

**A:**

It should prioritize system instructions, goal, constraints, confirmed facts, current user message, relevant retrieved context, and only then recent conversation history.

### Q36

**Q:** An agent ignores an earlier user constraint after many turns. What likely failed?

**A:**

The constraint was likely truncated, buried in long history, or not promoted into structured state.

### Q37

**Q:** Why should output tokens be reserved in the context budget?

**A:**

The model needs remaining token space to generate the answer. If the input consumes the whole context window, there may be no room for useful output.

## Model Families and Licenses

### Q38

**Q:** What is a model family?

**A:**

A model family is a group of related models built from similar architecture and training approach, often released in different sizes, versions, or capability levels.

### Q39

**Q:** What is an open-weight model?

**A:**

An open-weight model makes trained weights available for download or self-hosting under a license.

### Q40

**Q:** What is a closed-weight model?

**A:**

A closed-weight model is accessed through a hosted service or API while the provider keeps the weights private.

### Q41

**Q:** Compare open-weight and closed-weight models.

**A:**

Open-weight models offer more control, customization, and self-hosting options but require operations work. Closed models are easier to use and managed by the provider but give less control and auditability.

### Q42

**Q:** Why is a model license important?

**A:**

The license defines whether you can use the model commercially, modify it, redistribute it, fine-tune it, or build products with it.

### Q43

**Q:** Compare permissive, copyleft, proprietary, and custom AI licenses.

**A:**

Permissive licenses allow broad use with few restrictions. Copyleft may require sharing modifications. Proprietary licenses restrict use under provider terms. Custom AI licenses may allow some uses while limiting others.

### Q44

**Q:** Your team wants to use an open-weight model in a commercial product. What should you check first?

**A:**

Check commercial-use rights, redistribution rules, fine-tuning rights, attribution requirements, usage restrictions, and any custom AI license terms.

## Generation Controls

### Q45

**Q:** What are generation controls?

**A:**

Generation controls are settings that change how the model chooses the next token. They affect focus, randomness, repetition, and stability.

### Q46

**Q:** What is the relationship between logits and probabilities?

**A:**

Logits are raw token scores. Softmax converts logits into probabilities that can be sampled from.

### Q47

**Q:** What does temperature control?

**A:**

Temperature changes how strongly high-scoring tokens dominate. Low temperature is more predictable; high temperature is more varied and risky.

### Q48

**Q:** When should an agent use low temperature?

**A:**

Use low temperature for tool calls, JSON, code, math, factual answers, and search query rewriting.

### Q49

**Q:** What is top-p sampling?

**A:**

Top-p keeps the smallest set of highest-probability tokens whose cumulative probability reaches the chosen threshold, then samples from that set.

Example: if `top_p = 0.8`, the model keeps the highest-probability tokens until their combined probability reaches 80%.

### Q50

**Q:** What is top-k sampling?

**A:**

Top-k keeps a fixed number of highest-ranked candidate tokens and removes the rest before sampling.

### Q51

**Q:** Compare top-p and top-k.

**A:**

Top-p keeps candidates by probability mass, so the number kept changes with model confidence. Top-k always keeps a fixed number by rank.

### Q52

**Q:** What does frequency penalty do?

**A:**

Frequency penalty lowers a token's score more as that token appears more often in the generated text.

### Q53

**Q:** What does presence penalty do?

**A:**

Presence penalty lowers a token's score once if it has appeared at all, encouraging new words or topics.

### Q54

**Q:** Compare frequency penalty and presence penalty.

**A:**

Frequency penalty increases with repeated use of the same token. Presence penalty applies once after a token appears. Frequency fights repetition; presence encourages novelty.

### Q55

**Q:** Why can repetition penalties harm JSON or code generation?

**A:**

JSON and code often require repeated keys, symbols, names, or labels. Penalties may push the model away from required repetition.

### Q56

**Q:** Why should beginners tune one generation control at a time?

**A:**

Changing one setting at a time makes it clear which control caused an improvement or failure.

### Q57

**Q:** What is the generation-control pipeline shown in the diagram?

**A:**

```text
raw logits -> repetition penalties -> temperature -> softmax -> top-k/top-p filtering -> renormalization -> sample token
```

### Q58

**Q:** Why should an agent use different generation settings for different steps?

**A:**

Planning, tool calling, creative drafting, summarizing, and final answering have different reliability and creativity needs.

### Q59

**Q:** A tool-call step invents extra JSON fields. What would you change first?

**A:**

Use lower temperature, avoid repetition penalties, use a stricter schema or structured output mode, remove irrelevant context, and validate arguments before execution.

## Pricing and Latency

### Q60

**Q:** What does LLM pricing usually depend on?

**A:**

Pricing usually depends on input tokens and output tokens. Some providers may also price cached tokens, reasoning tokens, storage, or tools differently.

### Q61

**Q:** Why do both the user's message and assistant response affect cost?

**A:**

The model processes input tokens and generates output tokens. Both consume compute and are commonly billed.

### Q62

**Q:** What is latency?

**A:**

Latency is the time it takes for the system to produce a response after a request is sent.

### Q63

**Q:** What are common latency components in an LLM application?

**A:**

Common components include network time, queue time, inference time, output generation time, and tool time.

### Q64

**Q:** Why are tool-using agents often slower than simple chatbots?

**A:**

Agents may make multiple model calls, wait for external tools or APIs, process tool results, and then call the model again.

### Q65

**Q:** How can a developer reduce cost without destroying quality?

**A:**

Use smaller models for simple steps, shorten prompts, remove irrelevant context, summarize history, retrieve fewer high-quality chunks, cap output length, cache repeated work, and evaluate after each change.

### Q66

**Q:** What should a model comparison script record?

**A:**

It should record model, prompt, input tokens, output tokens, latency, estimated cost, output quality, and failure modes.

## Embeddings and Vector Search

### Q67

**Q:** What is an embedding?

**A:**

An embedding is a vector of numbers that represents semantic meaning or features of data such as text, images, audio, or code.

### Q68

**Q:** Why are embeddings useful when exact words differ?

**A:**

Embeddings can place similar meanings close together, so "recover account access" can match "password reset" even without shared words.

### Q69

**Q:** In the embeddings and vector search architecture, what is the basic flow from input to answer?

**A:**

```text
input -> chunking -> embedding model -> vector database -> similarity search -> relevant chunks -> LLM -> output
```

### Q70

**Q:** Why should documents be chunked before embedding?

**A:**

Whole documents may mix many topics and create vague embeddings. Chunks create focused retrieval units that better match specific questions.

### Q71

**Q:** What is a vector database?

**A:**

A vector database stores, indexes, and retrieves high-dimensional embeddings efficiently, usually with metadata and source IDs.

### Q72

**Q:** What is vector search?

**A:**

Vector search embeds a query, compares it with stored vectors, and returns the closest matches according to a similarity or distance metric.

### Q73

**Q:** What is similarity search?

**A:**

Similarity search finds items similar to a query item, such as similar text, images, products, user behavior, or code.

### Q74

**Q:** What does cosine similarity measure?

**A:**

Cosine similarity measures the angle between vectors. Similar direction means higher similarity.

### Q75

**Q:** Compare cosine similarity, Euclidean distance, Manhattan distance, and Chebyshev distance.

**A:**

Cosine compares direction. Euclidean measures straight-line distance. Manhattan sums coordinate differences. Chebyshev uses the largest coordinate difference.

### Q76

**Q:** What is exact k-nearest neighbors search?

**A:**

Exact k-NN compares a query vector with every stored vector and returns the k closest results.

### Q77

**Q:** What is approximate nearest neighbor search?

**A:**

ANN uses indexing, hashing, clustering, or graph methods to find near matches faster, trading some exactness for speed.

### Q78

**Q:** In the ANN image-search diagram, what is the main idea?

**A:**

Images are converted into feature vectors, stored in an indexed database, and searched by vector similarity to return visually similar results.

### Q79

**Q:** Why should metadata be stored with each vector?

**A:**

Metadata records source, URL, section, timestamp, tenant, permissions, language, tags, and document version. It enables filtering, citations, debugging, and access control.

### Q80

**Q:** Why is metadata filtering necessary before sending retrieved chunks to an LLM?

**A:**

Similarity alone may retrieve chunks from the wrong tenant, country, date, version, or permission group. Filtering prevents unauthorized or irrelevant context from reaching the model.

Example: filter by `tenant_id`, `visibility`, `country`, and `document_status` before returning chunks.

### Q81

**Q:** What is the difference between k-NN and ANN?

**A:**

k-NN searches exactly by comparing against all vectors. ANN searches faster using an index and may return approximate, not perfect, nearest neighbors.

### Q82

**Q:** A RAG system returns another customer's policy because it was semantically similar. What failed?

**A:**

The vector search lacked tenant or permission metadata filtering. Semantic similarity worked, but security filtering failed.

## RAG Basics

### Q83

**Q:** What does RAG stand for?

**A:**

RAG stands for Retrieval-Augmented Generation: retrieve relevant information, add it to the prompt, and generate an answer from that context.

### Q84

**Q:** What problem does RAG solve?

**A:**

RAG helps the model answer using private, recent, changing, or large external knowledge that is not reliably available in the model's parameters.

### Q85

**Q:** In the RAG architecture diagram, what happens before the LLM generates the final answer?

**A:**

The system creates a search query, retrieves relevant passages from a knowledge source, adds them to the prompt, and then sends the augmented prompt to the LLM.

### Q86

**Q:** What happens in the RAG indexing pipeline?

**A:**

Documents are cleaned, split into chunks, embedded, stored with metadata, and made searchable in a vector store or knowledge base.

### Q87

**Q:** What happens in the RAG question-answering pipeline?

**A:**

The system embeds or rewrites the user question, retrieves matching chunks, builds a prompt with context, asks the LLM to answer, and returns the answer with sources.

Simple flow:

```text
question -> retrieve chunks -> build prompt -> generate answer -> cite source
```

### Q88

**Q:** What are the core components of a RAG system?

**A:**

Core components include user query, retriever, knowledge source, chunks, embeddings, vector store, metadata, prompt builder, LLM, and citations.

### Q89

**Q:** Why should a RAG prompt tell the model what to do when context is missing?

**A:**

Without this instruction, the model may invent an answer or use unsupported general knowledge. A strict prompt can tell it to say it does not know from the provided context.

### Q90

**Q:** Why does RAG reduce hallucination but not eliminate it?

**A:**

Retrieval may return wrong or stale chunks, and the model may misread, ignore, or overgeneralize from retrieved context.

### Q91

**Q:** When should you use RAG?

**A:**

Use RAG when answers depend on private data, recent data, changing knowledge, citations, many documents, or source-grounded responses.

### Q92

**Q:** When might RAG be unnecessary or harmful?

**A:**

RAG may be unnecessary for simple rewriting, tasks already fully specified in the prompt, or general knowledge tasks. It can be harmful if retrieval adds misleading context.

### Q93

**Q:** Compare RAG and fine-tuning.

**A:**

RAG adds external knowledge at runtime. Fine-tuning changes model behavior through training examples. RAG is better for changing facts and citations; fine-tuning is better for repeated style, format, or behavior.

### Q94

**Q:** A RAG answer cites a retrieved chunk but reaches the wrong conclusion. What should you inspect?

**A:**

Inspect whether the chunk actually contains the answer, whether conflicting chunks were included, whether the prompt required grounding, and whether the model overgeneralized beyond the context.

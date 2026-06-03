# Context Windows

## Goal

Understand how much information a model can use at once and how to manage that
limit when building AI agents.

## Why It Matters

A context window is the model's working memory for a single request. It is the
maximum amount of input and generated output the model can attend to at one
time, usually measured in tokens.

For agents, context windows decide how much of the task state, conversation
history, tool output, retrieved documents, system instructions, and draft work
can fit into the next model call. If the useful information does not fit, the
agent may forget requirements, ignore earlier tool results, repeat work, or
answer from incomplete evidence.

## Study Notes

### Core Idea

Models do not remember everything forever. During inference, they only see the
tokens included in the current prompt plus any tokens they generate. The context
window is the upper bound for that combined sequence.

Context is not only the user's visible message. It can include:

- system and developer instructions
- previous conversation turns
- tool definitions
- tool results
- retrieved RAG chunks
- files or code snippets
- examples used for few-shot prompting
- the model's own planned or generated output

This means a "128k token model" does not give the user 128k tokens of free
space. Some of that budget is already spent before the user's content is added.

### Tokens, Not Words

Context is measured in tokens, not pages or words. A token can be a word, part
of a word, punctuation, whitespace, or another text fragment depending on the
model's tokenizer.

A rough estimate for English prose is about 1.3 to 1.5 tokens per word, but the
real count varies by model, language, formatting, code, and symbols. Code,
tables, JSON, and non-English text can consume tokens differently than plain
English paragraphs.

### What Happens When Context Is Too Large

When the prompt exceeds the model's limit, the application must reduce it before
the call can run. Common strategies include truncating old messages, summarizing
history, selecting fewer retrieved chunks, shrinking tool outputs, or splitting
the task into smaller calls.

If this is done carelessly, the agent can lose important state:

| Context problem | Agent failure |
| --- | --- |
| Old requirements are truncated | The final answer ignores a constraint |
| Tool output is pasted in full | The model spends attention on irrelevant rows |
| Too many RAG chunks are included | The answer cites weak or conflicting evidence |
| Long conversation history is kept raw | Latency and cost rise every turn |
| Important facts appear in the middle of a long prompt | The model may underuse them |

### Larger Is Useful, But Not Free

Long context windows are valuable because they let a model inspect longer
documents, larger code samples, richer tool traces, and more conversation
history. They can reduce the need for aggressive summarization.

The tradeoff is that long context usually increases cost and latency. Attention
over long sequences is computationally expensive, and the model may still fail
to reliably use every relevant detail. A larger window should be treated as more
capacity, not as a replacement for good context design.

### Long Context vs RAG vs Memory

These techniques solve different problems:

| Technique | Best for | Risk |
| --- | --- | --- |
| Long context | Reading a known large input in one call | Expensive, slower, may distract the model |
| RAG | Pulling the most relevant external knowledge into the prompt | Retrieval can miss or rank badly |
| Summarized memory | Preserving durable task facts across turns | Summary can omit important nuance |
| Structured state | Tracking exact values, decisions, and progress | Requires explicit design and updates |

For agents, combine them. Keep exact task state in structured data, retrieve
external knowledge when needed, summarize old conversation only when it is not
critical verbatim, and reserve long context for cases where the model truly must
compare or reason over a large input.

### Context Design Checklist

Before sending an agent prompt, ask:

- What information is required to make the next decision?
- Which old messages can be summarized or removed?
- Which tool outputs should be compressed into tables, IDs, or key facts?
- Which retrieved chunks are directly relevant to the current step?
- How many output tokens must be reserved for the answer?
- What should happen if the request does not fit?

Good agent systems treat context as a budget. They decide what earns a place in
the prompt instead of appending everything.

## Practice

Build a small script or notebook that compares three prompt strategies for the
same task:

1. Send a full long document or conversation history.
2. Send a short summary plus the current user question.
3. Send only the most relevant retrieved sections plus structured task state.

Record:

- input token count
- output token count
- latency
- estimated cost
- answer quality
- missing or ignored facts

Then write a short note explaining which strategy you would use for an agent and
why.

## Mini Project

Create a simple context manager for an agent loop.

It should keep:

- `goal`: the user's task
- `constraints`: requirements that must not be forgotten
- `facts`: confirmed information from tool calls
- `recent_messages`: the latest conversation turns
- `retrieved_context`: only the top relevant chunks for the current step
- `token_budget`: the maximum input tokens allowed

The manager should produce a prompt that fits the budget by prioritizing:

1. system instructions
2. goal and constraints
3. confirmed facts
4. current user message
5. relevant retrieved context
6. recent conversation history

Conversation history should be the first thing shortened unless the task
requires exact wording.

## Exit Criteria

- You can explain a context window in plain language.
- You know that context is measured in tokens, not words.
- You can list what consumes context in an agent call.
- You can explain why bigger context can increase cost and latency.
- You can choose when to use long context, RAG, summarized memory, or structured
  state.
- You can design a fallback when the prompt does not fit.

## Resources

- [IBM Think: What is a context window?](https://www.ibm.com/think/topics/context-window)
- [OpenAI tokenizer](https://platform.openai.com/tokenizer)
- [Hugging Face Tokenizer Playground](https://huggingface.co/spaces/Xenova/the-tokenizer-playground)
- [Lost in the Middle: How Language Models Use Long Contexts](https://arxiv.org/abs/2307.03172)
- [RULER: What's the Real Context Size of Your Long-Context Language Models?](https://arxiv.org/abs/2404.06654)

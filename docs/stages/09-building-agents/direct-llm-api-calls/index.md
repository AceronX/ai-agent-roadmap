# Direct LLM API Calls

<div class="topic-page" markdown="1">

<section class="topic-hero">
  <span class="topic-hero__eyebrow">Stage 09 - Building Agents</span>
  <p class="topic-hero__lead">Before any framework, an agent is just code that calls an LLM API and reads the reply. This topic covers the raw call: how to send a request, what each field does, how conversations work when the API has no memory, and how to stream long replies.</p>
  <div class="topic-hero__facts">
    <span>Client</span>
    <span>Model</span>
    <span>Messages</span>
    <span>Response</span>
    <span>Stream</span>
  </div>
</section>

## Goal

By the end of this topic, you should be able to:

- Make a single LLM API call and read the result.
- Explain what `model`, `max_tokens`, `system`, and `messages` do.
- Hold a multi-turn conversation against a stateless API.
- Stream a long response instead of waiting for the whole thing.

## Learning Path

<div class="learning-grid learning-grid--path">
  <a class="learning-card" href="#part-1-anatomy-of-a-call">
    <strong>Part 1 - Anatomy of a Call</strong>
    <span>The client, the request fields, and the response.</span>
  </a>
  <a class="learning-card" href="#part-2-system-prompts-and-roles">
    <strong>Part 2 - System Prompts and Roles</strong>
    <span>How <code>system</code> and message roles shape behavior.</span>
  </a>
  <a class="learning-card" href="#part-3-conversations-are-stateless">
    <strong>Part 3 - Conversations Are Stateless</strong>
    <span>Why you resend the whole history every turn.</span>
  </a>
  <a class="learning-card" href="#part-4-streaming-long-responses">
    <strong>Part 4 - Streaming Long Responses</strong>
    <span>Show output as it is generated.</span>
  </a>
</div>

## Part 1: Anatomy of a Call

An LLM API call sends a list of messages and gets back a generated reply. Here is the smallest useful call with the Anthropic Python SDK:

```python
import anthropic

client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY from the environment

response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    messages=[{"role": "user", "content": "What is the capital of France?"}],
)

text = next(b.text for b in response.content if b.type == "text")
print(text)
```

??? note "OpenAI equivalent"
    ```python
    from openai import OpenAI

    client = OpenAI()  # reads OPENAI_API_KEY from the environment

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": "What is the capital of France?"}],
    )

    print(response.choices[0].message.content)  # here the reply is already a string
    ```

The required fields:

| Field | What it does |
| --- | --- |
| `model` | Which model to use. Use the exact ID string, e.g. `claude-opus-4-8`. |
| `max_tokens` | The hard ceiling on the reply length. Hitting it truncates the output. |
| `messages` | The conversation so far, as a list of `{"role", "content"}` turns. |

Notice the response is read as `response.content` — a **list of blocks**, not a string. Pulling the text out is its own small skill, covered in this stage's *Parsing model output* topic. For now, take the first text block.

!!! note "Other providers"
    Other SDKs follow the same shape with different names — OpenAI uses `client.chat.completions.create(...)` and returns `response.choices[0].message.content`. The concepts on this page (a model, a token cap, a message list, a reply you must parse) are the same everywhere; the code here is Claude.

### Keys live in the environment

Never hard-code an API key. The SDK reads `ANTHROPIC_API_KEY` from the environment, so a bare `anthropic.Anthropic()` is the right default. A key committed to a repo is a leaked key.

### Choosing `max_tokens`

`max_tokens` caps the *output*, not the input. Set it high enough for the answer you expect — too low and the reply is cut off mid-sentence (you will see `stop_reason == "max_tokens"`). A few hundred is fine for classification; a few thousand for normal answers. Model choice, pricing, and latency are covered in [Stage 02](../../02-llm-fundamentals/pricing-and-latency/index.md).

## Part 2: System Prompts and Roles

Every message has a **role**. The two you use constantly:

- `user` — input from the person (or your application).
- `assistant` — the model's replies.

The **system prompt** is separate from the message list. It sets durable instructions — who the model is and how it should behave — and applies to the whole conversation:

```python
response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    system="You are a terse assistant. Answer in one sentence, no preamble.",
    messages=[{"role": "user", "content": "Explain what an API is."}],
)
```

??? note "OpenAI equivalent"
    ```python
    # OpenAI has no separate `system` parameter — the system prompt is the
    # first message in the list, with role "system".
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a terse assistant. Answer in one sentence."},
            {"role": "user", "content": "Explain what an API is."},
        ],
    )
    ```

| Where instructions go | Use it for |
| --- | --- |
| `system` | Stable rules: persona, tone, format, what tools exist, safety boundaries. |
| `user` message | The actual request or question for this turn. |

A good rule: anything that should be true for *every* turn belongs in `system`; anything specific to *this* turn belongs in the `user` message. Prompt design itself is [Stage 03](../../03-prompt-engineering/prompt-basics/index.md).

## Part 3: Conversations Are Stateless

This is the fact that surprises people most: **the API has no memory.** Each call is independent. To continue a conversation, you resend the entire history every time.

```python
messages = [
    {"role": "user", "content": "My name is Alice."},
]
response = client.messages.create(model="claude-opus-4-8", max_tokens=1024, messages=messages)
reply = next(b.text for b in response.content if b.type == "text")

# Append the assistant turn, then add the next user turn.
messages.append({"role": "assistant", "content": reply})
messages.append({"role": "user", "content": "What's my name?"})

response = client.messages.create(model="claude-opus-4-8", max_tokens=1024, messages=messages)
print(next(b.text for b in response.content if b.type == "text"))  # "Alice"
```

The model "remembers" Alice only because the first turn is still in the list you resent. Two consequences:

- **You own the history.** Storing, trimming, and summarizing the conversation is your job, not the API's. (Stage 07 covered memory strategies for when history grows too long.)
- **Longer history costs more.** Every resent token is billed again, and the conversation must fit the model's [context window](../../02-llm-fundamentals/context-windows/index.md).

The rules for a valid `messages` list:

- The first message must be `user`.
- Roles normally alternate `user` / `assistant`.
- The list must be non-empty.

## Part 4: Streaming Long Responses

A normal call waits for the *entire* reply before returning. For a long answer that means a long silent pause — and very large outputs can even hit a request timeout. **Streaming** returns the text as it is generated:

```python
with client.messages.stream(
    model="claude-opus-4-8",
    max_tokens=4096,
    messages=[{"role": "user", "content": "Write a short story about a lighthouse."}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)

    final_message = stream.get_final_message()  # full Message once streaming ends
```

??? note "OpenAI equivalent"
    ```python
    stream = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": "Write a short story about a lighthouse."}],
        stream=True,
    )
    for chunk in stream:
        piece = chunk.choices[0].delta.content
        if piece:
            print(piece, end="", flush=True)
    ```

Two reasons to stream:

- **Responsiveness.** Users see words appear immediately instead of waiting.
- **Reliability.** For large `max_tokens`, a non-streaming request can exceed the connection timeout; streaming avoids that. (The SDK will even refuse very large non-streaming requests for this reason.)

When you do not need to render each token, `stream.get_final_message()` still gives you the complete reply at the end — so you get timeout protection without handling individual events.

## Practice

### Exercise 1: First Call

Make a single call that asks for a haiku about the ocean. Print only the text block.

### Exercise 2: Two-Turn Memory

Send "Remember the number 42." then, in a second call, "What number did I ask you to remember?" Confirm it answers correctly only when you resend the first turn.

### Exercise 3: Stream It

Re-run Exercise 1 with `client.messages.stream(...)` and print tokens as they arrive. Then fetch and print the token count from `get_final_message().usage`.

## Mini Project

Write a tiny command-line chat program:

- keeps a running `messages` list
- sends each user line with a fixed `system` prompt
- streams the reply to the terminal
- exits on `quit`

The goal is to feel the statelessness directly: comment out the line that appends the assistant turn and watch the model lose the thread.

## Exit Criteria

You understand this topic when you can:

- Make a call with `model`, `max_tokens`, and `messages` and read the reply.
- Explain what belongs in `system` versus a `user` message.
- Describe why the API is stateless and what that means for your code.
- Stream a response and still retrieve the final message.

## Resources

- [roadmap.sh: AI Agents Roadmap](https://roadmap.sh/ai-agents)
- [Anthropic Docs: Messages API overview](https://platform.claude.com/docs/en/api/overview)
- [Anthropic Docs: Streaming](https://platform.claude.com/docs/en/build-with-claude/streaming)
- [OpenAI Docs: Chat Completions](https://platform.openai.com/docs/api-reference/chat)
- [Stage 02: Pricing and Latency](../../02-llm-fundamentals/pricing-and-latency/index.md)

</div>

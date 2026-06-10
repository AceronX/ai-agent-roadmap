# Parsing Model Output

<div class="topic-page" markdown="1">

<section class="topic-hero">
  <span class="topic-hero__eyebrow">Stage 09 - Building Agents</span>
  <p class="topic-hero__lead">An LLM reply is not a plain string. It is a structured response with content blocks and a stop reason that tells you <em>why</em> the model stopped. Reading it correctly is what separates a robust agent from one that crashes on the first tool call or truncated answer.</p>
  <div class="topic-hero__facts">
    <span>Blocks</span>
    <span>Stop reason</span>
    <span>Text</span>
    <span>Tool calls</span>
    <span>JSON</span>
  </div>
</section>

## Goal

By the end of this topic, you should be able to:

- Read the response object instead of assuming it is a string.
- Handle every `stop_reason` the model can return.
- Separate text blocks from tool-call blocks.
- Get structured JSON you can trust, instead of parsing free text.

## Learning Path

<div class="learning-grid learning-grid--path">
  <a class="learning-card" href="#part-1-the-response-is-not-a-string">
    <strong>Part 1 - The Response Is Not a String</strong>
    <span>Content blocks and how to read them.</span>
  </a>
  <a class="learning-card" href="#part-2-stop-reasons">
    <strong>Part 2 - Stop Reasons</strong>
    <span>Why the model stopped, and what to do about it.</span>
  </a>
  <a class="learning-card" href="#part-3-text-vs-tool-calls">
    <strong>Part 3 - Text vs Tool Calls</strong>
    <span>Pulling apart the blocks an agent reply contains.</span>
  </a>
  <a class="learning-card" href="#part-4-structured-output">
    <strong>Part 4 - Structured Output</strong>
    <span>Get JSON that matches a schema, not free text.</span>
  </a>
</div>

## Part 1: The Response Is Not a String

The most common beginner mistake is treating the reply like a string. It is an object whose `content` is a **list of blocks**, each with a `type`:

```python
response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    messages=[{"role": "user", "content": "What is 2 + 2?"}],
)

# response.content is a list, e.g. [TextBlock(type="text", text="2 + 2 is 4.")]
for block in response.content:
    if block.type == "text":
        print(block.text)
```

Always check `block.type` before reading a field. A reply can contain several blocks — text, a thinking block, one or more tool calls — and they are not interchangeable.

The safe pattern for "just give me the text":

```python
text = next((b.text for b in response.content if b.type == "text"), "")
```

!!! note "Other providers"
    The shapes differ — OpenAI returns `response.choices[0].message.content` (a string) plus a separate `tool_calls` list, while Claude interleaves everything in one `content` block list. Either way the lesson holds: read the documented structure; do not assume a bare string.

## Part 2: Stop Reasons

Every response carries a `stop_reason` telling you **why** generation ended. Ignoring it is how agents silently break.

| `stop_reason` | Meaning | What to do |
| --- | --- | --- |
| `end_turn` | The model finished naturally. | Use the reply as the final answer. |
| `max_tokens` | It hit your `max_tokens` cap. | The reply is **truncated** — raise the cap or stream. |
| `tool_use` | It wants to call a tool. | Run the tool and continue the loop. |
| `stop_sequence` | It hit a custom stop sequence. | Handle per your design. |
| `refusal` | It declined for safety reasons. | Surface it; do not retry the same prompt. |
| `pause_turn` | A long server-side turn paused. | Re-send to let it resume. |

The check that prevents the most bugs:

```python
if response.stop_reason == "max_tokens":
    # The answer is incomplete. Don't treat it as final.
    raise ValueError("Response was truncated — increase max_tokens.")
```

Treating a `max_tokens`-truncated reply as a finished answer is a classic silent failure: the output *looks* like a normal answer but is cut off. The `stop_reason` is the only reliable signal.

## Part 3: Text vs Tool Calls

When you give the model tools, a single reply can contain both an explanation (text block) and one or more requests to act (tool-use blocks). Parsing means separating them:

```python
texts = [b for b in response.content if b.type == "text"]
tool_uses = [b for b in response.content if b.type == "tool_use"]

for call in tool_uses:
    print(call.name)   # which tool
    print(call.input)  # arguments, already parsed into a dict
    print(call.id)     # id you echo back in the tool_result
```

Two things to get right:

- `call.input` is already a **parsed object** (a dict), not a JSON string. Use it directly.
- When you *do* see serialized tool JSON, parse it with `json.loads` — never match it as a raw string. Escaping (Unicode, slashes) can vary, and raw-string matching breaks silently.

Feeding tool results back into the loop is the subject of [Building an agent loop from scratch](../agent-loop-from-scratch/index.md); tool *design* is [Stage 05](../../05-tools-and-actions/function-calling/index.md). This page is only about reading the blocks.

## Part 4: Structured Output

Often you do not want prose — you want a specific JSON shape your code can rely on. Parsing free text with regexes is fragile. Instead, constrain the output to a schema.

The cleanest approach validates the reply against a model you define:

```python
from pydantic import BaseModel

class Contact(BaseModel):
    name: str
    email: str
    wants_demo: bool

response = client.messages.parse(
    model="claude-opus-4-8",
    max_tokens=1024,
    messages=[{"role": "user", "content":
        "Extract: Jane Doe (jane@co.com) asked for a demo."}],
    output_format=Contact,
)

contact = response.parsed_output     # a validated Contact instance
print(contact.name, contact.wants_demo)
```

If you do not use a schema library, you can request a raw JSON schema directly and the first text block is guaranteed to be valid JSON:

```python
response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Extract the name and email."}],
    output_config={"format": {"type": "json_schema", "schema": {
        "type": "object",
        "properties": {"name": {"type": "string"}, "email": {"type": "string"}},
        "required": ["name", "email"],
        "additionalProperties": False,
    }}},
)

import json
data = json.loads(next(b.text for b in response.content if b.type == "text"))
```

| Approach | When to use |
| --- | --- |
| `messages.parse()` with a schema class | You want a validated object back. Recommended. |
| `output_config.format` with a raw JSON schema | You are not using a schema library. |
| Strict tool use (`"strict": True` on a tool) | The structure *is* the tool's arguments. |

Prompt-level techniques for asking for structure are [Stage 03](../../03-prompt-engineering/structured-outputs/index.md); this page is about the API-level guarantees that make the output reliable.

!!! warning "Structured output is not refusal-proof"
    If the model refuses (`stop_reason == "refusal"`) or truncates (`max_tokens`), the output may not match the schema. Check `stop_reason` before trusting parsed data.

## Practice

### Exercise 1: Read Every Block

Send a prompt with tools attached and print `block.type` for every block in `response.content`. Note when you see both a text block and a tool-use block in one reply.

### Exercise 2: Catch the Truncation

Call the model with `max_tokens=10` on a question that needs a long answer. Confirm `stop_reason == "max_tokens"` and that your code refuses to treat the reply as final.

### Exercise 3: Extract to a Schema

Use `messages.parse()` to extract `{title, author, year}` from a sentence describing a book. Print the validated object.

## Mini Project

Build a small **"resume field extractor"**:

- takes a block of resume text
- uses structured output to return `{name, email, years_experience, skills: [...]}`
- checks `stop_reason` and reports cleanly if the reply was truncated or refused
- prints the validated object

The goal is an extractor that never crashes on a malformed reply — because it reads the structure instead of guessing.

## Exit Criteria

You understand this topic when you can:

- Read `response.content` as a list of typed blocks.
- Name the main `stop_reason` values and handle `max_tokens` and `refusal`.
- Separate text blocks from tool-use blocks and read `call.input` as a dict.
- Get schema-validated JSON instead of parsing free text.

## Resources

- [roadmap.sh: AI Agents Roadmap](https://roadmap.sh/ai-agents)
- [Anthropic Docs: Structured outputs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)
- [Anthropic Docs: Handling stop reasons](https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons)
- [Stage 03: Structured Outputs (prompt side)](../../03-prompt-engineering/structured-outputs/index.md)
- [Stage 05: Function Calling](../../05-tools-and-actions/function-calling/index.md)

</div>

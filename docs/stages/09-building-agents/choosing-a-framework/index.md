# How to Choose a Framework Without Losing Debuggability

<div class="topic-page" markdown="1">

<section class="topic-hero">
  <span class="topic-hero__eyebrow">Stage 09 - Building Agents</span>
  <p class="topic-hero__lead">A framework that hides the loop can also hide the bug. When an agent misbehaves you need to see what the user said, what the prompt became, what tool JSON the model produced, and why it routed the way it did. Choosing well means weighing each framework's convenience against how much of that visibility you keep.</p>
  <div class="topic-hero__facts">
    <span>Inspect</span>
    <span>Replay</span>
    <span>Trace</span>
    <span>Test</span>
    <span>Decide</span>
  </div>
</section>

## Goal

By the end of this topic, you should be able to:

- Explain why debuggability should drive framework choice, not just features.
- Compare the six frameworks by how inspectable they are.
- Apply three selection rules to a real decision.
- Add deterministic logging to any agent loop, framework or not.

## Learning Path

<div class="learning-grid learning-grid--path">
  <a class="learning-card" href="#part-1-why-debuggability-decides">
    <strong>Part 1 - Why Debuggability Decides</strong>
    <span>What you need to see when an agent breaks.</span>
  </a>
  <a class="learning-card" href="#part-2-the-frameworks-through-a-debugging-lens">
    <strong>Part 2 - Through a Debugging Lens</strong>
    <span>The six frameworks, ranked by inspectability.</span>
  </a>
  <a class="learning-card" href="#part-3-three-selection-rules">
    <strong>Part 3 - Three Selection Rules</strong>
    <span>Imperative code, state replay, decoupled prompts.</span>
  </a>
  <a class="learning-card" href="#part-4-a-debuggable-loop">
    <strong>Part 4 - A Debuggable Loop</strong>
    <span>Deterministic logging you can add anywhere.</span>
  </a>
  <a class="learning-card" href="#part-5-selection-checklist">
    <strong>Part 5 - Selection Checklist</strong>
    <span>Four questions to ask before you commit.</span>
  </a>
</div>

## Part 1: Why Debuggability Decides

Features are easy to compare on a landing page. Debuggability is what you live with when a production agent fails at step 14 of a 20-step run. At that moment you need four things:

- the exact **user input**
- the **assembled prompt** that actually hit the model
- the **tool JSON** the model generated
- **why** the model routed to that tool

Every framework trades some of this visibility for convenience. The more it assembles prompts, manages state, and routes tools "for you", the less of the above you can see when something goes wrong. The core engineering decision is **how much framework complexity you accept for how much visibility you keep**.

## Part 2: The Frameworks Through a Debugging Lens

The same six frameworks from the [previous topic](../agent-frameworks/index.md), ranked by how easily you can inspect them:

| Framework | Core debugging hazard | Built-in inspection | Stepping / replay | Trace overhead |
| --- | --- | --- | --- | --- |
| **OpenAI Agents SDK** | Black-box cloud handoffs | Standard Python debugger (PDB) | High — plain imperative loops | Minimal |
| **LangGraph** | Complex state reduction | LangGraph Studio / graph viewer | Excellent — time-travel state replay | Low–medium |
| **LlamaIndex** | Opaque chunking / index routing | Event managers, prompt helpers | Medium — can print retrieval weights | Medium |
| **LangChain** | Deep abstraction stack traces | LangSmith integration | Poor without LangSmith | High |
| **CrewAI** | Unpredictable agent cross-talk | `verbose=True` console output | Poor — hard to freeze mid-run | Medium |
| **AutoGen** | Asynchronous infinite loops | Conversational JSON logs | Difficult — state spans many chats | High |

No framework is "best" — the imperative ones (OpenAI Agents SDK) are easiest to step through; the graph-based one (LangGraph) is best at reproducing a failure exactly; the conversational ones (AutoGen, CrewAI) are the hardest to freeze and inspect.

## Part 3: Three Selection Rules

### Rule A — Prefer imperative code over heavy class abstractions

If you cannot drop a standard breakpoint (`import pdb; pdb.set_trace()`) into your tool and inspect variables, the framework is too abstract. Imperative, code-first frameworks let you step into execution natively.

> **Best fit:** the OpenAI Agents SDK — standard function calls and class primitives, so a breakpoint inside a tool just works.

### Rule B — Demand state invariance and time-travel replay

When an agent fails at step 14, you should not have to rerun steps 1–13 to reproduce it. A framework that persists state at each step lets you jump to the failing checkpoint, fix the code, and resume.

> **Best fit:** LangGraph — a checkpointer persists state per `thread_id`, so you can replay or resume from the exact node that failed.

### Rule C — Decouple prompt generation from tool execution

Avoid frameworks that assemble the final prompt behind layers of classes with no way to see the raw string. If you cannot view exactly what was sent to the provider, debugging a hallucination is guesswork.

> **Hazard:** LangChain's older prebuilt chains can hide the underlying system prompt. **Fix:** insist on a logging hook that exposes the outgoing payload right before it hits the API.

## Part 4: A Debuggable Loop

Whatever you choose, you can keep visibility by logging the loop deterministically — every prompt, every tool decision, every argument. This pattern works in a from-scratch loop and is the baseline a framework should match:

```python
import logging, json
import anthropic

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger("agent")

client = anthropic.Anthropic()

def debuggable_call(user_prompt: str, tools: list):
    messages = [{"role": "user", "content": user_prompt}]

    # 1. Trace the exact payload going to the model.
    log.info("PROMPT -> %s", json.dumps(messages))

    response = client.messages.create(
        model="claude-opus-4-8", max_tokens=1024, tools=tools, messages=messages,
    )

    # 2. Trace every native tool decision and its arguments.
    for block in response.content:
        if block.type == "tool_use":
            log.info("TOOL  -> %s", block.name)
            log.info("ARGS  -> %s", json.dumps(block.input))
            # 3. Validate before acting; catch problems locally instead of crashing.
            try:
                args = block.input  # already a dict; validate against your schema here
            except (KeyError, TypeError) as e:
                log.error("BAD ARGS: %s", e)

    log.info("STOP  -> %s", response.stop_reason)
    return response
```

??? note "OpenAI equivalent"
    ```python
    import logging, json
    from openai import OpenAI

    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
    log = logging.getLogger("agent")
    client = OpenAI()

    def debuggable_call(user_prompt: str, tools: list):
        messages = [{"role": "user", "content": user_prompt}]
        log.info("PROMPT -> %s", json.dumps(messages))

        response = client.chat.completions.create(
            model="gpt-4o", messages=messages, tools=tools, tool_choice="auto",
        )
        msg = response.choices[0].message
        for call in msg.tool_calls or []:
            log.info("TOOL  -> %s", call.function.name)
            log.info("ARGS  -> %s", call.function.arguments)
            try:
                json.loads(call.function.arguments)
            except json.JSONDecodeError as e:
                log.error("BAD JSON FROM MODEL: %s", e)

        log.info("STOP  -> %s", response.choices[0].finish_reason)
        return msg
    ```

The three log points — outgoing prompt, tool decision + arguments, and stop reason — are usually enough to explain any single misbehaving turn. For production, route these through OpenTelemetry or your framework's tracing hook so every run is captured. Structured observability across many runs is [Stage 11](../../11-evaluation-observability/index.md).

## Part 5: Selection Checklist

Before committing to a framework, ask your team four questions:

1. **Can we inspect the raw API request?** If the final JSON payload is hidden behind wrapper classes, debugging prompt and schema issues will be painful.
2. **Is there a native visualization tool?** Visual telemetry (LangGraph Studio, LangSmith) lets you audit execution steps instead of reading logs line by line.
3. **How are exceptions handled?** When a tool throws, does the framework swallow the stack trace, or can you register an error-handling hook?
4. **How easy is it to test?** Can you mock the model's responses to test your routing logic deterministically?

A framework that answers these well will stay debuggable as your agent grows; one that does not will become a black box exactly when you most need to see inside it.

## Practice

### Exercise 1: Rank for Your Case

For a project you care about, rank the four selection questions by importance. Which framework from Part 2 best fits that ranking?

### Exercise 2: Add the Trace

Take your from-scratch loop and add the three log points from Part 4. Run a multi-tool task and read the trace top to bottom — can you explain every decision from the logs alone?

### Exercise 3: Reproduce a Failure

Make a tool fail on the third call. Describe what you would need from each framework in Part 2 to reproduce that exact failure without rerunning the first two calls.

## Mini Project

Add a **debuggability layer** to one agent and evaluate it:

- take either your from-scratch loop or a framework agent
- log the prompt, tool calls/arguments, and stop reason for every turn
- deliberately introduce a malformed tool argument and confirm your logging catches it before a crash
- write a short verdict: how quickly could a teammate diagnose a failure from your traces alone?

The goal is to experience debuggability as a property you design in — not something a framework gives you for free.

## Exit Criteria

You understand this topic when you can:

- Explain why debuggability, not just features, should drive framework choice.
- Compare the six frameworks by inspectability and replay capability.
- Apply the imperative-code, state-replay, and decoupled-prompt rules.
- Add deterministic prompt/tool/stop logging to any agent loop.

## Resources

- [roadmap.sh: AI Agents Roadmap](https://roadmap.sh/ai-agents)
- [LangSmith (tracing for LangChain)](https://docs.smith.langchain.com/)
- [LangGraph Studio](https://langchain-ai.github.io/langgraph/concepts/langgraph_studio/)
- [OpenTelemetry](https://opentelemetry.io/docs/)
- [Stage 11: Evaluation and Observability](../../11-evaluation-observability/index.md)

</div>

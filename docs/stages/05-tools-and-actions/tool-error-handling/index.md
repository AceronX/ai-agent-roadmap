# Tool Error Handling

## Goal

Handle tool failures, retries, timeouts, truncation, and rate limits without
letting the agent crash or loop forever.

## The Big Idea

Tool error handling is the process of managing failures when an LLM-powered
agent calls external systems such as APIs, databases, browsers, files, search
engines, or code execution tools.

Traditional software often treats an unhandled exception as a program failure.
An agent needs a different pattern. The tool layer should catch the failure,
turn it into clear text or structured data, and send that result back to the
LLM as an observation. Then the agent can decide whether to fix the arguments,
retry, use a fallback tool, ask the user, or stop safely.

Simple version:

```text
Bad pattern:
Agent calls tool -> tool crashes -> application crashes

Better pattern:
Agent calls tool -> tool error is caught -> model receives error observation -> agent corrects or stops
```

Good tool error handling is what lets an agent recover from normal real-world
problems: malformed inputs, expired credentials, rate limits, missing records,
network failures, and APIs that return less data than expected.

## Why It Matters

Tools are how an agent touches the outside world. If the tool layer is brittle,
the whole agent becomes brittle.

Without error handling, an agent can:

- Repeat the same broken tool call until it burns through the token budget.
- Hide the real failure from the model, so the model guesses instead of fixing
  the call.
- Crash in the middle of a workflow.
- Retry a non-retryable action, such as a failed payment or duplicate message.
- Produce a confident answer even though the tool returned incomplete data.

With good error handling, the agent has feedback. It can observe that something
went wrong, understand the kind of failure, and choose a better next action.

## Where Tool Failures Happen

Most tool failures fall into three categories.

| Failure type | What happens | Example | Best response |
| --- | --- | --- | --- |
| Formatting and schema error | The model produced invalid arguments | `user_id` is `"abc"` but the schema requires an integer | Return a clear validation error and let the model retry with corrected input |
| Runtime error | The tool or external system failed while running | `401 Unauthorized`, `429 Rate Limit Exceeded`, timeout, database connection error | Catch the exception, label whether it is retryable, and apply retry or fallback rules |
| Logic or semantic error | The tool ran, but the request did not make sense | Search for a user id that does not exist | Return the factual result and tell the model what was invalid or missing |

The important distinction: not every failure should be retried.

A network timeout may be worth retrying. A missing permission is usually not.
A nonexistent user id should lead the agent to revise its plan, not hammer the
same database call again.

## The Core Workflow

Reliable agents usually follow a catch, feed, correct loop.

```text
User goal
   |
   v
Agent core / LLM
   |
   | generates tool call
   v
Validation gate
   |
   | valid call
   v
Tool code with try/except
   |
   | success or error observation
   v
Agent core / LLM
   |
   | correct, retry, fallback, ask, or stop
   v
Final answer or next tool call
```

### 1. Validation Gate

The validation gate checks the model's tool call before the call reaches the
real application.

It should verify:

- The tool name exists.
- Required fields are present.
- Argument types match the schema.
- Values are inside safe ranges.
- The user or agent has permission to take the action.

Example validation error:

```json
{
  "status": "error",
  "error_type": "schema_validation",
  "message": "Field 'user_id' must be an integer, but you provided the string 'abc'. Retry with a numeric user_id.",
  "recoverable": true
}
```

This is much more useful to the model than:

```text
400 Bad Request
```

### 2. Try/Except Encapsulation

Even valid tool calls can fail. The tool implementation should wrap external
work in normal backend error handling.

For example:

```python
def get_user_orders(user_id: int) -> dict:
    try:
        rows = database.query(
            "select id, total, status from orders where user_id = ?",
            [user_id],
            timeout_seconds=5,
        )
    except TimeoutError:
        return {
            "status": "error",
            "error_type": "timeout",
            "message": "The orders database timed out after 5 seconds.",
            "recoverable": True,
            "retry_after_seconds": 2,
        }
    except PermissionError:
        return {
            "status": "error",
            "error_type": "permission_denied",
            "message": "The current user is not allowed to read order history.",
            "recoverable": False,
        }

    if not rows:
        return {
            "status": "error",
            "error_type": "not_found",
            "message": f"No orders were found for user_id {user_id}.",
            "recoverable": False,
        }

    return {
        "status": "ok",
        "orders": rows,
    }
```

The tool returns a normal observation in both success and failure cases. The
agent loop can keep running because the application did not crash.

### 3. LLM Context Injection

After the tool layer catches an error, the agent should feed the error back to
the model as a tool result.

Bad observation:

```text
Tool failed.
```

Better observation:

```json
{
  "status": "error",
  "tool": "get_user_orders",
  "error_type": "not_found",
  "message": "No orders were found for user_id 99881.",
  "recoverable": false,
  "suggested_next_step": "Ask the user to confirm the customer id or search by email."
}
```

Now the model has enough information to make a better decision. It should not
call the same tool with the same id again. It can ask for clarification or try a
different lookup tool if one is available.

## Write Errors For The Model

Developers often write errors for other developers. Agents need errors written
for the model.

| Weak error | Model-friendly error |
| --- | --- |
| `400 Bad Request` | `Field 'start_date' must use YYYY-MM-DD format. You passed 'next Friday'. Convert it to a date and retry.` |
| `Auth failed` | `The calendar API returned 401 Unauthorized. This is not recoverable by retrying. Ask the user to reconnect their calendar account.` |
| `Timeout` | `The search API timed out after 10 seconds. This may be temporary. Retry once with a narrower query.` |
| `No rows` | `No customer matched email 'sam@example.com'. Do not retry the same email. Ask for another identifier.` |

A good tool error tells the model:

- What failed.
- Which argument or condition caused it.
- Whether retrying makes sense.
- What the next safe action should be.

## Retryable Flags

A retryable flag tells the agent whether a failure is temporary.

Use a simple field such as `recoverable` or `retryable`.

```json
{
  "status": "error",
  "error_type": "rate_limit",
  "message": "The search API returned 429 Rate Limit Exceeded.",
  "recoverable": true,
  "retry_after_seconds": 60
}
```

Compare that with a non-retryable error:

```json
{
  "status": "error",
  "error_type": "permission_denied",
  "message": "The user has not granted access to the billing API.",
  "recoverable": false,
  "suggested_next_step": "Ask the user to connect billing access before trying again."
}
```

This small field prevents many bad loops. The agent should not guess whether an
authorization error might disappear on the next attempt.

## Circuit Breakers

A circuit breaker is a hard stop rule that prevents runaway tool use.

Common circuit breakers:

- Stop after 3 consecutive failures from the same tool.
- Stop after 2 retries for the same exact arguments.
- Stop after a fixed token, cost, or time budget.
- Stop if the tool reports `recoverable: false`.
- Stop before repeating a write action that may create duplicate side effects.

Example loop rule:

```text
If the same tool fails 3 times in a row:
1. Stop calling that tool.
2. Summarize the failures.
3. Ask the user for help or escalate to a human operator.
```

This protects cost, reliability, and safety. An agent that keeps calling a
broken payment API, email API, or database tool is not being persistent; it is
being uncontrolled.

## Fallbacks

A fallback is an alternate path the agent can use when the first tool is blocked.

Examples:

- If web search is rate limited, use a cached knowledge base or another search
  provider.
- If a user lookup by id fails, try lookup by email.
- If a summarization tool returns too much text, retry with a smaller document
  chunk.
- If an API write fails because approval is missing, ask the user for approval
  instead of retrying.

Fallbacks should be explicit. Put them in tool documentation, system
instructions, or the agent's control policy.

Example instruction:

```text
If the web_search tool returns a rate_limit error, retry once after the
specified retry_after_seconds. If it fails again, use docs_search. If docs_search
does not answer the question, tell the user that live search is unavailable.
```

## Handling Truncation

Truncation happens when a tool result is too large and gets cut off before the
model receives it.

This is easy to miss because the tool may technically "succeed" while returning
incomplete evidence.

A tool should label truncated output:

```json
{
  "status": "ok",
  "result": "First 20 matching records...",
  "truncated": true,
  "total_matches": 312,
  "next_cursor": "page_2"
}
```

Then the agent can decide whether it needs the next page, a narrower query, or
enough information to answer.

## Small Example: Weather Tool

Imagine an agent has this tool:

```text
Tool: get_weather
Input:
  location: string
  date: string in YYYY-MM-DD format
Output:
  forecast: string
```

Weak implementation:

```text
If anything fails, return "error".
```

Better implementation:

```json
{
  "status": "error",
  "tool": "get_weather",
  "error_type": "schema_validation",
  "message": "Field 'date' must be YYYY-MM-DD. You passed 'tomorrow'. Convert the relative date using the user's timezone and retry.",
  "recoverable": true
}
```

Now the agent can correct the call:

```text
Original bad call:
get_weather(location="Berlin", date="tomorrow")

Corrected call:
get_weather(location="Berlin", date="2026-06-05")
```

The same pattern works for APIs, databases, file tools, browser automation,
email tools, and code execution.

## What To Log

The model needs a clean error observation. Developers also need logs for
debugging.

Do not put secrets, tokens, passwords, or full private records into the model
context. Keep sensitive debugging details in server logs instead.

Useful developer logs:

- Tool name.
- Validated arguments, with sensitive fields redacted.
- Error type.
- Provider status code.
- Retry count.
- Latency.
- Trace or request id.
- Final agent decision after the error.

Useful model observation:

```json
{
  "status": "error",
  "error_type": "timeout",
  "message": "The inventory API timed out after 8 seconds.",
  "recoverable": true,
  "retry_after_seconds": 3,
  "safe_next_actions": ["retry_once", "ask_user", "use_cached_inventory"]
}
```

## Common Mistakes

- Returning vague errors that the model cannot act on.
- Retrying every failure without checking whether it is recoverable.
- Hiding tool errors from the LLM and letting it invent an answer.
- Forgetting maximum loop counts and cost budgets.
- Treating successful but empty results as success.
- Sending raw stack traces or secrets into the model context.
- Retrying write actions without idempotency keys or duplicate protection.

## Practice

Build or document one small example that proves you understand this topic.

Use this exercise:

1. Create a small tool called `lookup_customer`.
2. Give it a schema with `customer_id` as an integer.
3. Add validation for missing or wrongly typed arguments.
4. Simulate three failures: invalid id, database timeout, and customer not
   found.
5. Return model-friendly error objects with `error_type`, `message`, and
   `recoverable`.
6. Add a max retry rule: retry temporary failures once, then stop.
7. Write the final agent behavior for each error.

Expected behavior:

| Failure | Recoverable? | Agent behavior |
| --- | --- | --- |
| `customer_id` is a string | Yes | Retry with corrected integer if possible |
| Database timeout | Yes | Retry once, then report temporary outage |
| Customer not found | No | Ask for another identifier or stop |
| Permission denied | No | Ask the user to connect or authorize access |
| Tool fails 3 times | No | Stop the loop and escalate |

## Exit Criteria

You understand tool error handling when you can:

- Explain why tool errors should become observations instead of crashes.
- Classify schema, runtime, and semantic tool failures.
- Write model-friendly error messages.
- Use `recoverable` or `retryable` flags.
- Set retry limits and circuit breakers.
- Avoid leaking sensitive stack traces into model context.
- Describe a fallback path for at least one failed tool.

## Resources

- [OpenAI Function Calling](https://developers.openai.com/api/docs/guides/function-calling)
- [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs)
- [Pydantic Validation Errors](https://pydantic.dev/docs/validation/latest/errors/errors/)
- [Zod Error Handling](https://zod.dev/error-customization)
- [LangChain Tools](https://docs.langchain.com/oss/python/langchain/tools)

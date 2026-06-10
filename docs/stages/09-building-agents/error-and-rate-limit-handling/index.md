# Error and Rate-Limit Handling

<div class="topic-page" markdown="1">

<section class="topic-hero">
  <span class="topic-hero__eyebrow">Stage 09 - Building Agents</span>
  <p class="topic-hero__lead">A real agent makes many API calls, and some will fail: a transient network blip, a rate limit, an overloaded server, a malformed request. This topic covers handling those API and transport errors so your agent recovers instead of crashing — and retries the right ones without hammering the service.</p>
  <div class="topic-hero__facts">
    <span>Typed errors</span>
    <span>Retryable</span>
    <span>Rate limits</span>
    <span>Backoff</span>
    <span>Timeouts</span>
  </div>
</section>

## Goal

By the end of this topic, you should be able to:

- Catch API errors using typed exceptions, not string matching.
- Tell which errors are worth retrying and which are not.
- Handle rate limits correctly using the `retry-after` signal.
- Use the SDK's automatic retries and add custom backoff when needed.

## Learning Path

<div class="learning-grid learning-grid--path">
  <a class="learning-card" href="#part-1-the-error-taxonomy">
    <strong>Part 1 - The Error Taxonomy</strong>
    <span>The typed exceptions and what each means.</span>
  </a>
  <a class="learning-card" href="#part-2-retryable-vs-fatal">
    <strong>Part 2 - Retryable vs Fatal</strong>
    <span>Retry transient errors; fix permanent ones.</span>
  </a>
  <a class="learning-card" href="#part-3-rate-limits">
    <strong>Part 3 - Rate Limits</strong>
    <span>429s, <code>retry-after</code>, and staying under your quota.</span>
  </a>
  <a class="learning-card" href="#part-4-backoff-retries-and-timeouts">
    <strong>Part 4 - Backoff, Retries, and Timeouts</strong>
    <span>The SDK's automatic retries, plus when to roll your own.</span>
  </a>
</div>

!!! note "Scope: API errors, not tool errors"
    This page is about errors from the **LLM API** itself — the transport layer. Errors *inside a tool you wrote* (a failed database query, a 404 from your own service) are returned to the model as a `tool_result` with `is_error`, covered in [Stage 05](../../05-tools-and-actions/tool-error-handling/index.md). Different layer, different handling.

## Part 1: The Error Taxonomy

When a request fails, the SDK raises a **typed exception**. Catch the specific class — never inspect the error message string, which can change.

```python
import anthropic

try:
    response = client.messages.create(
        model="claude-opus-4-8",
        max_tokens=1024,
        messages=[{"role": "user", "content": "Hello"}],
    )
except anthropic.RateLimitError:
    ...        # 429 — too many requests
except anthropic.BadRequestError as e:
    ...        # 400 — malformed request; fix the code
except anthropic.AuthenticationError:
    ...        # 401 — bad or missing API key
except anthropic.APIStatusError as e:
    if e.status_code >= 500:
        ...    # server-side problem
except anthropic.APIConnectionError:
    ...        # network failure, no response
```

The main classes and their HTTP codes:

| Exception | Code | Cause |
| --- | --- | --- |
| `BadRequestError` | 400 | Malformed request (bad params, non-alternating roles). |
| `AuthenticationError` | 401 | Invalid or missing API key. |
| `PermissionDeniedError` | 403 | Key lacks access to the model/feature. |
| `NotFoundError` | 404 | Wrong model ID or endpoint. |
| `RequestTooLargeError` | 413 | Request exceeds size limits. |
| `RateLimitError` | 429 | Too many requests or tokens. |
| `InternalServerError` | 500 | Server-side problem. |
| `OverloadedError` | 529 | Service temporarily overloaded. |
| `APIConnectionError` | — | Network failure before any response. |

Catch from most specific to least specific — `RateLimitError` before the broad `APIStatusError` — because the specific ones are subclasses.

## Part 2: Retryable vs Fatal

The single most useful distinction: **does retrying the same request have any chance of succeeding?**

<div class="visual-checklist">
  <div>
    <strong>Retryable (transient) — back off and try again:</strong>
    <ul>
      <li>429 rate limit</li>
      <li>500 internal server error</li>
      <li>529 overloaded</li>
      <li>408 / 409 and connection errors</li>
    </ul>
  </div>
  <div>
    <strong>Fatal (your request is wrong) — do not retry:</strong>
    <ul>
      <li>400 bad request</li>
      <li>401 authentication</li>
      <li>403 permission</li>
      <li>404 not found</li>
      <li>413 too large</li>
    </ul>
  </div>
</div>

Retrying a fatal error just wastes calls — a bad model ID will be a 404 every single time. The fix is to correct the request (or surface the error to the developer), not to retry it. Retrying a *transient* error, with a delay, usually succeeds.

## Part 3: Rate Limits

A `429` means you sent too many requests or tokens in a window. The response carries headers that tell you exactly how to react:

```python
except anthropic.RateLimitError as e:
    retry_after = int(e.response.headers.get("retry-after", "60"))
    print(f"Rate limited. Waiting {retry_after}s before retrying.")
    time.sleep(retry_after)
```

| Header | Meaning |
| --- | --- |
| `retry-after` | Seconds to wait before retrying. **Honor this** rather than guessing. |
| `x-ratelimit-remaining-*` | How much quota is left in the current window. |
| `x-ratelimit-limit-*` | Your configured limits. |

The `retry-after` value is the service telling you precisely when capacity will be available — respect it. Ways to stay under the limit in the first place:

- Keep concurrency modest; do not fire hundreds of parallel requests.
- For large non-urgent workloads, batch instead of looping live calls.
- Watch the `x-ratelimit-remaining-*` headers and slow down as they approach zero.

## Part 4: Backoff, Retries, and Timeouts

### The SDK already retries

You usually do **not** need to write retry logic. The Anthropic SDK automatically retries transient errors (429, 408, 409, and ≥500) with exponential backoff. Tune how many times:

```python
client = anthropic.Anthropic(max_retries=5)   # default is 2; 0 disables

# Or per-request, without mutating the client:
client.with_options(max_retries=5).messages.create(...)
```

### When you need custom backoff

If you need behavior beyond the SDK's — say, logging each attempt or a custom schedule — implement exponential backoff **with jitter** (a small random delay so many clients do not retry in lockstep):

```python
import time, random, anthropic

def call_with_retry(client, max_retries=5, base=1.0, cap=60.0, **kwargs):
    for attempt in range(max_retries):
        try:
            return client.messages.create(**kwargs)
        except (anthropic.RateLimitError, anthropic.InternalServerError) as e:
            if attempt == max_retries - 1:
                raise
            delay = min(base * (2 ** attempt) + random.uniform(0, 1), cap)
            time.sleep(delay)
        except anthropic.APIStatusError as e:
            if e.status_code < 500:
                raise          # fatal — don't retry 4xx
            time.sleep(min(base * (2 ** attempt), cap))
```

The shape that matters: delay **doubles** each attempt (`2 ** attempt`), is **capped** so it never grows absurd, and adds **jitter** so retries spread out.

### Timeouts

A request can also hang. The SDK has a default timeout and raises `APITimeoutError` (and retries it) when exceeded. Set your own when needed:

```python
client = anthropic.Anthropic(timeout=20.0)  # seconds
```

For very large `max_tokens`, prefer streaming — a long non-streaming request can exceed the timeout before it finishes. (See [Direct LLM API calls](../direct-llm-api-calls/index.md).)

!!! warning "Don't retry forever"
    Cap the number of retries. An unbounded retry loop against a persistent 500 or a fatal 400 turns a single failure into a hang and a large bill. Bounded retries plus a clear final error is always better than infinite retries.

## Practice

### Exercise 1: Classify the Errors

For each — 401, 429, 500, 404, 529 — write down: retry or fix? If retry, what delay signal would you use?

### Exercise 2: Honor `retry-after`

Wrap a call in a `try/except anthropic.RateLimitError` that reads `retry-after` from the response headers and sleeps that long before one retry.

### Exercise 3: Backoff With Jitter

Implement `call_with_retry` and test it against a stub that fails twice with a 529 then succeeds. Log the delay before each attempt and confirm it doubles with jitter.

## Mini Project

Add a **resilience layer** to the agent loop from [Building an agent loop from scratch](../agent-loop-from-scratch/index.md):

- wrap each model call so transient errors (429/5xx) retry with capped, jittered backoff
- honor `retry-after` on 429
- let fatal errors (400/401/404) fail fast with a clear message
- stop after N total retries across the run and report cleanly

The goal is a loop that survives a flaky network and a brief rate limit without either crashing or hammering the API.

## Exit Criteria

You understand this topic when you can:

- Catch errors with typed exception classes instead of string matching.
- Sort errors into retryable versus fatal.
- Handle a 429 by honoring `retry-after`.
- Use the SDK's automatic retries and write capped, jittered backoff when you need custom behavior.

## Resources

- [roadmap.sh: AI Agents Roadmap](https://roadmap.sh/ai-agents)
- [Anthropic Docs: Errors](https://platform.claude.com/docs/en/api/errors)
- [Anthropic Docs: Rate limits](https://platform.claude.com/docs/en/api/rate-limits)
- [Stage 05: Tool Error Handling](../../05-tools-and-actions/tool-error-handling/index.md)

</div>

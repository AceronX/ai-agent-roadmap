# Tool Unit Tests

<div class="topic-page" markdown="1">

<section class="topic-hero">
  <span class="topic-hero__eyebrow">Stage 11 - Evaluation and Observability</span>
  <p class="topic-hero__lead">Before testing an entire agent, test each tool by itself. Tool unit tests prove that schemas, validation, permissions, return values, and error behavior are reliable.</p>
  <div class="topic-hero__facts">
    <span>Schemas</span>
    <span>Validation</span>
    <span>Permissions</span>
    <span>Errors</span>
    <span>Fixtures</span>
  </div>
</section>

## Goal

By the end of this topic, you should be able to:

- Test tool input validation without calling a model.
- Check successful and failing tool paths.
- Return structured errors that an agent can recover from.
- Prevent unsafe tool behavior with permission tests.

## Why Tool Tests Come First

The model is not the only source of failure. A tool can fail because:

- the schema accepts invalid input,
- required fields are missing,
- permission checks are too broad,
- an external API returns a timeout,
- the tool returns an unstructured error string,
- the tool leaks too much data back into the prompt.

If a tool is unreliable, full agent evaluation becomes noisy. You cannot tell whether the model chose badly or the tool behaved badly.

## What To Test

| Test area | Example assertion |
| --- | --- |
| Schema validation | Missing `ticket_id` is rejected before execution. |
| Type validation | `limit` must be an integer within a safe range. |
| Permission boundary | A read-only user cannot call a write tool. |
| Happy path | Valid input returns the expected structured result. |
| Recoverable error | Timeout returns `{ "ok": false, "error_type": "timeout" }`. |
| Fatal error | Permission failure returns a clear non-retryable error. |
| Data minimization | Tool output does not include secrets or unrelated records. |

## Example Tool Contract

```python
def search_tickets(query: str, limit: int = 5) -> dict:
    """Search support tickets visible to the current tenant."""
```

Expected result shape:

```json
{
  "ok": true,
  "results": [
    {
      "ticket_id": "T-1024",
      "title": "Refund failed",
      "status": "open"
    }
  ]
}
```

Expected error shape:

```json
{
  "ok": false,
  "error_type": "permission_denied",
  "message": "This user cannot search tickets for that tenant.",
  "retryable": false
}
```

Structured output matters because the agent needs to decide whether to retry, ask the user for more information, choose another tool, or stop.

## Unit Test Sketch

```python
import pytest

def test_search_tickets_requires_non_empty_query(fake_ticket_store):
    with pytest.raises(ValueError):
        search_tickets(query="", limit=5)

def test_search_tickets_limits_result_count(fake_ticket_store):
    result = search_tickets(query="refund", limit=2)

    assert result["ok"] is True
    assert len(result["results"]) <= 2

def test_search_tickets_denies_cross_tenant_access(fake_ticket_store, tenant_b_user):
    result = search_tickets(query="refund", limit=5, user=tenant_b_user)

    assert result["ok"] is False
    assert result["error_type"] == "permission_denied"
    assert result["retryable"] is False
```

Keep these tests deterministic. Use fake stores, mock APIs, and fixed fixtures. Full network calls belong in integration tests, not tool unit tests.

## Testing Tool Descriptions

A tool has two interfaces:

- the code interface that executes,
- the model-facing description and schema that the model sees.

Review both.

Checklist:

- The tool name is specific.
- The description says when to use the tool and when not to use it.
- Required fields are truly required.
- Dangerous fields use enums, ranges, or allowlists.
- Write tools are separate from send, charge, delete, or publish tools.

## Common Failure Modes

| Failure | Risk |
| --- | --- |
| Testing only the happy path | The agent fails badly on ordinary API errors. |
| Returning raw exceptions | The model sees noisy or sensitive implementation details. |
| Broad tool permissions | Prompt injection can turn into real side effects. |
| Vague tool names | The model chooses the wrong tool. |
| No fixture data | Tests are flaky and hard to reproduce. |

## Practice

Pick one read tool and one write tool from your agent project. Add unit tests for valid input, invalid input, permission failure, timeout, and returned result shape.

## Resources

- [Stage 05 - Tool error handling](../../05-tools-and-actions/tool-error-handling/index.md)
- [Stage 05 - Boundaries and destructive tools](../../05-tools-and-actions/boundaries-and-destructive-tools/index.md)
- [pytest documentation](https://docs.pytest.org/)

</div>

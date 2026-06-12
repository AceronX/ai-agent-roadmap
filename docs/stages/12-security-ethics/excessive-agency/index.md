# Excessive Agency

## Goal

Learn how too much autonomy, tool access, permission, or persistence can turn a small model mistake into a real incident.

## What It Means

Excessive agency happens when an AI agent can do more than the task requires. The agent may have too many tools, too much access, too many permissions, too much memory, or too much freedom to keep acting without review.

The model does not need to be malicious for this to be dangerous. A misunderstanding, hallucination, prompt injection, stale memory, or bad retrieval result can lead to a harmful action if the agent has broad authority.

```text
Low agency:
  Draft a refund recommendation.

High agency:
  Approve the refund, update the database, email the customer,
  and change the fraud rule without review.
```

## Types of Excessive Agency

| Type | Example | Safer Design |
| --- | --- | --- |
| Too much functionality | Agent can email, delete, deploy, and change billing even for simple tasks | Expose only task-specific tools |
| Too much permission | Agent can access all customer records | Scope access to the current user, ticket, or tenant |
| Too much autonomy | Agent can execute multi-step plans without stopping | Add step limits and approval checkpoints |
| Too much persistence | Agent keeps retrying or loops through tools | Add budgets, timeouts, and stop conditions |
| Too much trust | Agent decides final high-impact outcomes | Use human review or deterministic policy logic |

## Defenses

Design agents with least privilege:

- Give the agent only the tools needed for the current task.
- Use read-only credentials whenever possible.
- Scope writes to specific folders, records, tenants, or environments.
- Put destructive actions behind explicit approval.
- Require approval for external messages, production changes, payments, legal decisions, security changes, and account deletion.
- Add rate limits, step limits, spend limits, and timeouts.
- Log every tool call, input, output, and decision path.
- Prefer drafts and recommendations over final irreversible actions.

## Approval Prompt Pattern

A useful approval request is specific:

```text
The agent wants to refund order A102 for $49.00.
Reason: return was received on 2026-06-04.
Data source: return_status API.
Impact: customer will receive money; action is reversible only through a new charge.
Approve?
```

Avoid vague prompts like:

```text
Can I continue?
```

## Red-Team Tests

Try tests like:

- Ask the agent to solve a low-risk task and watch whether it uses high-risk tools.
- Inject instructions telling the agent to skip approval.
- Give the agent a task that requires one record and test whether it reads unrelated records.
- Force repeated failures and see whether it loops or escalates.
- Ask it to perform a destructive action using ambiguous wording.

## Resources

- [OWASP 2025 Top 10 Risk and Mitigations for LLMs and Gen AI Apps](https://genai.owasp.org/llm-top-10/)
- [Permission Boundaries for Read, Write, and Destructive Tools](../../05-tools-and-actions/boundaries-and-destructive-tools/index.md)

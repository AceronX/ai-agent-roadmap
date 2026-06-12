# Data Privacy and PII Redaction

## Goal

Learn how to protect personal data when agents process prompts, documents, images, logs, tool results, memory, and outputs.

## What It Means

AI agents often process data that includes names, phone numbers, email addresses, home addresses, payment details, health information, account IDs, images, chat logs, and other sensitive records. Leaks can cause fraud, stalking, discrimination, identity theft, or other harm.

Laws such as GDPR and CCPA create strict requirements for personal data handling. Even when a law does not apply, privacy failures can still harm users and damage trust.

PII redaction means scanning inputs and outputs to find and mask personal details before storage, logging, sharing, retrieval, or model use.

```text
Original:
  Jane Smith lives at 12 Oak Street and her phone number is 555-0134.

Redacted:
  [PERSON] lives at [ADDRESS] and her phone number is [PHONE].
```

## Where PII Leaks in Agent Systems

| Location | Risk |
| --- | --- |
| Prompts | Sensitive data is sent to a model unnecessarily |
| Tool results | Private records are included in context even when not needed |
| Logs and traces | Debug data stores user information long term |
| Memory | The agent remembers personal data beyond the task |
| RAG indexes | Personal data becomes searchable by the wrong user |
| Outputs | The agent reveals data to the wrong person or channel |
| External APIs | Data is shared with services outside the approved boundary |

## Redaction and Privacy Controls

Use layers:

- Minimize data before the model sees it.
- Redact PII in prompts, logs, traces, memory, and outputs.
- Use pattern rules for obvious identifiers such as emails, phone numbers, IDs, and credit cards.
- Use machine learning or named-entity recognition for names, addresses, and context-dependent PII.
- Enforce access controls before retrieval or tool use.
- Keep audit logs for sensitive access.
- Set retention limits for logs, traces, memories, and uploaded files.
- Test redaction flows often with realistic examples.

## Redaction Is Not Enough

Redaction can fail. A safe privacy design also needs:

- purpose limitation: use data only for the task,
- least privilege: expose only data the agent needs,
- consent and legal basis where required,
- deletion and retention workflows,
- tenant isolation,
- review of third-party model and tool data policies.

## Red-Team Tests

Try tests like:

- Put names, phone numbers, addresses, and account IDs in prompts and check logs.
- Ask the agent to reveal another user's data.
- Ask the agent to summarize a document while excluding PII.
- Test whether PII in retrieved documents leaks into the final answer.
- Check whether memory stores personal data without an explicit need.

## Example Scenario

**Situation:** A support agent summarizes a customer complaint that includes a name, phone number, home address, order number, and medical detail. The full prompt and model response are stored in tracing logs.

**What can go wrong:** Even if the final answer is safe, the logs may now contain sensitive personal data. Developers, vendors, or future retrieval jobs could access information they do not need.

**Safer design:** Minimize the data sent to the model, redact PII before logging, limit who can view traces, set retention limits, and prevent the agent from storing personal details in long-term memory unless required.

**Explanation:** Privacy controls must cover the whole agent pipeline. Prompts, tool results, traces, memory, and outputs can all leak PII, so redaction only at the final response is too late.

## Resources

- [European Commission: Data protection](https://commission.europa.eu/law/law-topic/data-protection_en)
- [European Commission: Data protection explained](https://commission.europa.eu/law/law-topic/data-protection/data-protection-explained_en)
- [California Consumer Privacy Act (CCPA)](https://oag.ca.gov/privacy/ccpa)
- [Protect Sensitive Data with PII Redaction Software](https://redactor.ai/blog/pii-redaction-software-guide)
- [A Complete Guide on PII Redaction](https://enthu.ai/blog/what-is-pii-redaction/)
- [roadmap.sh AI Agents](https://roadmap.sh/ai-agents)

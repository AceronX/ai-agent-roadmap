# OWASP LLM Top 10 Concepts for Production Systems

## Goal

Use the OWASP LLM Top 10 as a practical checklist for threat modeling production LLM and agent systems.

## What It Is

The OWASP Top 10 for Large Language Model Applications is a security risk list for systems that use LLMs. It helps teams reason about the full application, not just the model response.

The 2025 list is especially useful for agents because it includes risks around prompt injection, sensitive information disclosure, output handling, excessive agency, vector stores, misinformation, and resource consumption.

## 2025 OWASP LLM Top 10

| ID | Risk | Agent Design Question |
| --- | --- | --- |
| LLM01 | Prompt Injection | Can untrusted input override instructions or trigger tool misuse? |
| LLM02 | Sensitive Information Disclosure | Can prompts, outputs, logs, memory, or tools leak private data? |
| LLM03 | Supply Chain | Are models, datasets, plugins, packages, and tools trusted and updated? |
| LLM04 | Data and Model Poisoning | Can training, fine-tuning, RAG, or memory data be poisoned? |
| LLM05 | Improper Output Handling | Is model output validated before reaching HTML, SQL, shell, APIs, or tools? |
| LLM06 | Excessive Agency | Does the agent have more permission, autonomy, or tools than needed? |
| LLM07 | System Prompt Leakage | Can users extract hidden instructions or policy details? |
| LLM08 | Vector and Embedding Weaknesses | Can retrieval return poisoned, unauthorized, stale, or misleading content? |
| LLM09 | Misinformation | Can the system produce unsupported claims that users treat as facts? |
| LLM10 | Unbounded Consumption | Can the system burn excessive tokens, money, compute, tool calls, or time? |

## How to Use It

For each agent workflow, write:

```text
Workflow:
  What the agent does.

Assets:
  Data, tools, credentials, records, money, infrastructure, users.

Trust boundaries:
  User input, retrieved content, tools, memory, logs, external APIs.

OWASP risks:
  Which LLM01-LLM10 categories apply?

Controls:
  Permissions, validation, redaction, monitoring, approvals, tests.

Residual risk:
  What can still go wrong and who accepts that risk?
```

## Production Checklist

- Separate trusted instructions from untrusted data as much as the architecture allows.
- Treat all model output as untrusted until validated.
- Use least privilege for tools and credentials.
- Add human approval for destructive or high-impact actions.
- Redact or minimize PII in prompts, logs, memory, and outputs.
- Protect RAG indexes from unauthorized access and poisoned content.
- Monitor cost, latency, token usage, tool loops, and repeated failures.
- Keep dependency, model, plugin, and tool supply chains reviewed.
- Add red-team findings to regression tests.
- Document known limits and emergency shutdown paths.

## Resources

- [OWASP Top 10 for Large Language Model Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- [OWASP Gen AI Security Project: 2025 Top 10 Risk and Mitigations for LLMs and Gen AI Apps](https://genai.owasp.org/llm-top-10/)
- [roadmap.sh AI Agents](https://roadmap.sh/ai-agents)

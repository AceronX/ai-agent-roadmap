# 12 Security and Ethics

**Phase 3 - Systems**  
Stage 12 of 14. Previous: [Stage 11 - Evaluation and Observability](../11-evaluation-observability/index.md). Next: [Stage 13 - Production Deployment](../13-production-deployment/index.md).

## Goal

Learn the main security, privacy, and safety risks in agentic systems.

## Learn

- [Prompt injection and jailbreaks](prompt-injection-and-jailbreaks/index.md)
- [Insecure output handling](insecure-output-handling/index.md)
- [Excessive agency](excessive-agency/index.md)
- [Tool sandboxing and permissions](tool-sandboxing-and-permissions/index.md)
- [Data privacy and PII redaction](data-privacy-and-pii-redaction/index.md)
- [Bias, toxicity, and guardrails](bias-toxicity-and-guardrails/index.md)
- [Safety and red-team testing](safety-and-red-team-testing/index.md)
- [OWASP LLM Top 10 concepts for production systems](owasp-llm-top-10/index.md)

## Start Here

Security for AI agents is not only about the model refusing unsafe text. Agents read untrusted input, call tools, retrieve documents, store memory, and sometimes change real systems. A safe design treats every step as a security boundary.

| Risk | Simple Meaning | Main Defense |
| --- | --- | --- |
| Prompt injection and jailbreaks | Hidden or adversarial instructions make the model ignore the intended rules | Separate trusted instructions from untrusted content, validate actions, and review high-risk outputs |
| Insecure output handling | Model output is trusted as code, HTML, SQL, commands, or policy decisions | Validate, sanitize, encode, and use structured outputs with allowlists |
| Excessive agency | The agent has too much autonomy, tool access, or permission | Least privilege, scoped tools, step limits, and human approval |
| Tool sandboxing and permissions | The agent can touch files, networks, commands, or services outside its intended scope | Sandboxes, permission policies, audit logs, and approval gates |
| Data privacy and PII redaction | Personal or sensitive data leaks through prompts, logs, memory, or responses | Data minimization, redaction, access controls, retention limits, and audits |
| Bias, toxicity, and guardrails | The system produces unfair, abusive, or harmful responses | Balanced data, policy filters, evaluation sets, monitoring, and user feedback |
| Safety and red-team testing | Attackers or testers find ways to make the agent fail | Repeat adversarial tests before and after release |
| OWASP LLM Top 10 | A production risk map for LLM applications | Threat model against each OWASP category |

Beginner rule:

```text
Never give an agent more data, permission, autonomy, or trust than the task requires.
```

## Build

Create a threat model and red-team checklist for one agent project. Include prompt injection, insecure output handling, excessive agency, sandbox escape, PII leakage, bias or toxicity, and the OWASP LLM Top 10. Add mitigations for the highest-risk failures.

## Exit Criteria

- You can identify unsafe tool access.
- You can design human approval for destructive actions.
- You can test for prompt injection and sensitive data leakage.
- You can explain why model outputs must be treated as untrusted data.
- You can map an agent design to the OWASP LLM Top 10 risk categories.

## Checkpoint

Use the [Stage 12 checkpoint](checkpoint.md) before moving on.

# Safety and Red-Team Testing

## Goal

Learn how to test an AI agent like an attacker, a careless user, and a confused real-world workflow before and after release.

## What It Means

Safety and red-team testing is the practice of checking an AI agent for harmful or risky behavior. Safety work sets rules, guardrails, and alarms so the agent follows laws, protects data, and treats people fairly. Red-team testing asks skilled testers to act like attackers or troublesome users.

They try tricky prompts, hidden instructions, data leakage attempts, biased cases, unsafe advice requests, sandbox escapes, and tool misuse. Every weakness is logged and fixed with better filters, stronger permissions, improved training or examples, safer prompts, or live monitoring.

## What to Test

| Area | Example Test |
| --- | --- |
| Prompt injection | Hidden instructions in retrieved documents |
| Jailbreaks | Attempts to bypass safety policy |
| Data leakage | Requests for secrets, PII, system prompts, or other users' data |
| Tool misuse | Unauthorized emails, deletes, payments, deployments, or record changes |
| Insecure output handling | HTML, SQL, shell, code, and tool arguments |
| Excessive agency | Multi-step actions without approval |
| Bias and toxicity | Unfair recommendations, abusive language, inconsistent refusals |
| Reliability under pressure | Long tasks, retries, conflicting instructions, stale memory |

## Red-Team Loop

```text
1. Define the system boundaries.
2. List high-impact failures.
3. Create adversarial test cases.
4. Run the tests against the real workflow.
5. Log every failure with evidence.
6. Fix with controls outside and inside the model.
7. Re-test the same case.
8. Add the case to regression tests.
```

## Minimum Test Set

For a small production agent, include at least:

- one direct jailbreak test,
- one indirect prompt injection test from retrieved content,
- one PII leakage test,
- one unauthorized tool action test,
- one insecure output handling test,
- one bias or toxicity test,
- one excessive agency test,
- one budget, loop, or rate-limit test.

## Fix Patterns

| Finding | Possible Fix |
| --- | --- |
| Agent follows hidden instructions | Treat external content as data, add output checks, restrict tool calls |
| Agent leaks PII | Add redaction, access control, and output policy checks |
| Agent takes unauthorized action | Reduce permissions and add approval gates |
| Agent emits unsafe HTML or code | Escape output, validate schema, block execution |
| Agent loops or spends too much | Add step, time, retry, and cost limits |
| Agent gives biased output | Improve evaluation data, policy checks, and review process |

## Resources

- [AI Red Teaming Roadmap](https://roadmap.sh/ai-red-teaming)
- [Enhancing AI safety: Insights and lessons from red teaming](https://www.microsoft.com/en-us/microsoft-cloud/blog/2025/01/14/enhancing-ai-safety-insights-and-lessons-from-red-teaming/)
- [How to red team LLM Agents](https://www.promptfoo.dev/docs/red-team/agents/)
- [A Guide to AI Red Teaming - HiddenLayer](https://www.hiddenlayer.com/insight/a-guide-to-ai-red-teaming)
- [roadmap.sh AI Agents](https://roadmap.sh/ai-agents)

# Bias, Toxicity, and Guardrails

## Goal

Learn how to reduce unfair, abusive, or harmful agent behavior with data practices, policy rules, output checks, monitoring, and feedback.

## What It Means

Bias and toxicity guardrails keep an AI agent from giving unfair or harmful results. Bias appears when training data, examples, retrieval content, tools, or evaluation data favor certain groups, languages, regions, beliefs, or styles. Toxicity is hateful, violent, abusive, harassing, or demeaning language.

Agents need guardrails because they can combine model output with tools, memory, retrieved documents, and user context. A biased answer can become a biased decision if the agent is allowed to rank, approve, deny, recommend, or route people.

## Common Sources

| Source | How It Shows Up |
| --- | --- |
| Training data | Stereotypes or missing representation appear in answers |
| Prompt examples | Few-shot examples teach one-sided patterns |
| RAG content | Retrieved documents contain biased or toxic language |
| Tool data | Historical business data encodes unfair decisions |
| Evaluation gaps | Tests do not cover different user groups or dialects |
| Feedback loops | User feedback rewards confident or popular answers instead of fair answers |

## Guardrail Layers

Start before deployment:

- Use clean and balanced data where you control the data.
- Remove slurs, stereotypes, spam, and toxic examples unless they are needed for a detection task.
- Add examples from many voices, regions, languages, and user groups.
- Test outputs across sensitive attributes and edge cases.
- Document known limits and intended use.

Add runtime controls:

- Filter or flag toxic language before users see it.
- Block instructions that request abuse, harassment, or discriminatory treatment.
- Use policy checks for high-impact decisions.
- Log safety events for review.
- Add user feedback channels.
- Run regular audits after release.

## Guardrails Are Not Just Word Filters

Simple word filters help, but they miss context. A stronger design checks:

- the user's intent,
- the target of the content,
- the action the agent may take,
- the effect on protected or vulnerable groups,
- whether the output is advice, a joke, a ranking, or a real decision.

## Red-Team Tests

Try tests like:

- Ask for different recommendations using names that imply different genders, regions, or ethnic backgrounds.
- Ask the agent to rank people or resumes and inspect the reasons.
- Put toxic text inside retrieved content and see whether it repeats it.
- Ask the agent to produce harassment or demeaning language.
- Test whether refusal behavior is consistent across groups.

## Resources

- [Define the Agent Guardrails](https://trailhead.salesforce.com/content/learn/modules/agentforce-agent-planning/define-the-agent-guardrails)
- [How to Build Safe AI Agents: Best Practices for Guardrails and Oversight](https://medium.com/%40sahin.samia/how-to-build-safe-ai-agents-best-practices-for-guardrails-and-oversight-a0085b50c022)
- [roadmap.sh AI Agents](https://roadmap.sh/ai-agents)

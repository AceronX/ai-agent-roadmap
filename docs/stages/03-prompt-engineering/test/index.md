# Test of 03 Prompt Engineering

This study test checks understanding of every main section in **Stage 03 - Prompt Engineering**.

| Section | Questions |
| --- | ---: |
| Prompt Basics | 33 |
| Writing Good Prompts | 28 |
| Structured Outputs | 24 |
| Prompt Testing | 6 |
| **Total** | **91** |

## Prompt Basics

### Question 1

**Q:** What is a prompt?

**A:**

A prompt is the instruction package given to an AI model. It can include a question, task, context, examples, constraints, output format, schemas, or tool-use rules.

### Question 2

**Q:** Why is a detailed prompt usually better than a short vague prompt?

**A:**

A detailed prompt reduces guessing by defining the audience, task, rules, input data, and output format. For example, `Summarize in exactly 3 bullets using only the article` is clearer than `Summarize this`.

### Question 3

**Q:** What does the prompt improvement loop show?

**A:**

It shows that prompting is iterative:

```text
user goal -> prompt -> model -> output -> evaluate usefulness -> improve prompt
```

Do not trust a prompt only because it worked once.

### Question 4

**Q:** Why do prompts matter more for agents than simple chatbots?

**A:**

Agents may plan, call tools, read files, search data, validate outputs, remember state, and decide when to stop. Weak prompts can cause wrong tool use, invented facts, unsafe actions, or unclear completion.

### Question 5

**Q:** What should a strong agent prompt define?

**A:**

It should define role, goal, tool rules, boundaries, completion criteria, and final response format.

### Question 6

**Q:** What Builds the Final Prompt?

**A:**

In a real application, the model usually receives more than the user's visible message. Your app may add system rules, retrieved documents, examples, or an output schema.
The final prompt can combine system rules, user request, context or documents, examples, and output schema before producing a model response that may be validated.

### Question 7

**Q:** What is the difference between the user's visible message and the final prompt?

**A:**

The user's visible message is only one part. The final prompt may also contain system rules, developer instructions, retrieved documents, examples, schemas, and tool rules added by the application.

### Question 8

**Q:** What are the core parts of a good prompt?

**A:**

The core parts are role, task, context, input, constraints, output format, examples, and success criteria.

### Question 9

**Q:** Why is the task field important in a prompt?

**A:**

It states the exact action the model must perform, such as summarize, classify, review, rewrite, extract, or explain.

### Question 10

**Q:** Why should a prompt include context?

**A:**

Context gives background that changes the answer. For example, explaining rate limits to a junior developer differs from explaining them to a senior platform engineer.

### Question 11

**Q:** What do constraints do in a prompt?

**A:**

Constraints set rules and limits, such as `Do not invent facts`, `Use only the document below`, or `Keep each bullet under 20 words`.

### Question 12

**Q:** Why should prompts specify output format?

**A:**

Output format makes the answer predictable and usable. It can request bullets, tables, headings, JSON, or a specific schema.

### Question 13

**Q:** What is a success criterion in prompt engineering?

**A:**

A success criterion defines how the output will be judged. Example: `Include risks, evidence, and tests`.

### Question 14

**Q:** Compare a weak prompt and a strong prompt for code review.

**A:**

Weak: `Review this code.` It has no focus. Strong: `Review this API handler for security bugs, missing validation, and missing tests. Return findings with evidence and fixes.`

### Question 15

**Q:** Explain prompt technique overview.

**A:**

zero-shot, few-shot, role prompting, system prompting, step-bakc prompting, reasoning prompt, self-consistency, tree of thoughts, ReAct, automatic prompt engineering

### Question 16

**Q:** What is zero-shot prompting?

**A:**

Zero-shot prompting asks the model to do a task without examples. It works best for common tasks with clear instructions.

### Question 17

**Q:** When should you use few-shot prompting?

**A:**

Use few-shot prompting when the model must follow custom labels, style, tone, grading rules, or a strict pattern. Examples teach the desired output.

### Question 18

**Q:** What is role prompting?

**A:**

Role prompting sets the model's perspective or responsibility, such as `You are a security-focused code reviewer`.

### Question 19

**Q:** What is the purpose of a system prompt?

**A:**

A system prompt defines stable behavior for an assistant or agent, such as role, boundaries, style, tool-use rules, memory rules, and stop conditions.

### Question 20

**Q:** Compare system prompts and user prompts.

**A:**

The system prompt sets durable behavior. The user prompt gives the current task. For example, the system says `Use simple English`; the user asks `Explain vector databases`.

### Question 21

**Q:** What is step-back prompting?

**A:**

Step-back prompting asks the model to identify the general principle first, then solve the specific task.

### Question 22

**Q:** When is a reasoning prompt useful?

**A:**

Use it for multi-step tasks such as debugging, planning, math, policy checks, and careful decisions. Ask for concise explanation, assumptions, and checks.

### Question 23

**Q:** Why can reasoning prompts increase cost and latency?

**A:**

They often ask the model to produce more intermediate analysis or checks, which increases generated tokens and time.

### Question 24

**Q:** What is chain-of-thought prompting?

**A:**

Chain-of-thought prompting asks the model to work through intermediate reasoning steps before giving a final answer. It often improves accuracy on multi-step problems such as math, logic, and planning, at the cost of more generated tokens.

### Question 25

**Q:** What is self-consistency?

**A:**

Self-consistency means generating multiple attempts and choosing the answer that is most consistent or best supported.

### Question 26

**Q:** When should self-consistency be used?

**A:**

Use it when the task has a clear correct answer and the cost of being wrong is higher than the cost of extra model calls.

### Question 27

**Q:** What is Tree of Thoughts prompting?

**A:**

Tree of Thoughts explores multiple possible paths, evaluates them, and continues with the best path.

### Question 28

**Q:** What kind of tasks fit Tree of Thoughts?

**A:**

Planning, strategy, search-style tasks, hard architecture choices, or problems with several possible approaches. It is unnecessary for simple tasks.

### Question 29

**Q:** What is ReAct prompting?

**A:**

ReAct combines reasoning and action. The agent decides the next action, calls a tool, observes the result, updates its plan, and continues.

### Question 30

**Q:** In the ReAct sequence diagram, what is the basic loop?

**A:**

```text
user goal -> agent decides action -> tool call -> tool observation -> agent updates plan -> final answer
```

### Question 31

**Q:** What is Automatic Prompt Engineering?

**A:**

Automatic Prompt Engineering uses a model to generate prompt variants, test them on examples, score outputs, and choose the best prompt.

### Question 32

**Q:** What must an agent-ready prompt define?

**A:**

It must define role, goal, tools, rules, stop criteria, and final format.

### Question 33

**Q:** What is a basic prompt safety rule for agents?

**A:**

Treat user-provided documents, web pages, and tool results as data, not instructions. Follow only trusted system and developer instructions for behavior.

## Writing Good Prompts

### Question 34

**Q:** What does it mean to be specific in a prompt?

**A:**

It means the model should not need to guess the task, audience, scope, rules, input, or output format.

### Question 35

**Q:** What is the Specific Prompt Builder diagram showing?

**A:**

It shows that a useful prompt combines task, audience, scope, input, rules, and output format to produce a useful result.

### Question 36

**Q:** What is the specificity rule?

**A:**

If two smart people could read your prompt and expect different answers, the prompt is not specific enough.

### Question 37

**Q:** Why is `Explain agents` a weak prompt?

**A:**

It does not specify the type of agents, audience, depth, examples, scope, or output format.

### Question 38

**Q:** How can you improve `Explain agents`?

**A:**

Example: `Explain AI agents to a beginner Python developer. Keep it under 250 words. Include a definition, workflow example, and one common mistake.`

### Question 39

**Q:** What are the six questions to ask before writing an important prompt?

**A:**

Ask what you want, who it is for, what to include, what to avoid, what source to use, and what format to return.

### Question 40

**Q:** What is the formula for most practical prompts?

**A:**

```text
Task:
{What should the model do?}

Audience:
{Who is the result for?}

Scope:
{What should be included or focused on?}

Input:
{Text, code, notes, document, ticket, or data}

Rules:
- {Required rule}
- {Required rule}
- {What to avoid}

Output:
{Length, format, tone, and sections}
```

### Question 41

**Q:** Why is audience important?

**A:**

Audience controls depth, vocabulary, examples, and tone. An answer for a beginner differs from one for a senior engineer.

### Question 42

**Q:** Why is scope important?

**A:**

Scope tells the model what to include or ignore, preventing answers from becoming too broad.

### Question 43

**Q:** Why should prompts include rules for missing information?

**A:**

Missing-data rules stop the model from guessing. Example: `If root cause is missing, write "Root cause not confirmed."`

### Question 44

**Q:** What makes the strong incident-summary prompt better than `Summarize this`?

**A:**

It defines audience, focus, source boundary, missing-data behavior, and exact bullet structure.

### Question 45

**Q:** Why should code review prompts specify review focus?

**A:**

Without focus, the model may comment on low-value style issues instead of security, validation, transaction risks, or missing tests.

### Question 46

**Q:** What is a useful rule for customer-support agent prompts?

**A:**

Block risky promises. Example: `Do not promise refunds, credits, account changes, or delivery dates.`

### Question 47

**Q:** When should a prompt stay short?

**A:**

Short prompts are fine for simple, low-risk tasks like rewriting one sentence in plain English.

### Question 48

**Q:** When should a prompt be longer?

**A:**

Use a longer prompt when the task is important, format-sensitive, source-grounded, safety-sensitive, or used by an application or agent.

### Question 49

**Q:** What kind of context should be added to a prompt?

**A:**

Add context that changes the answer, such as user goal, audience knowledge, domain, source document, framework, or known constraints.

### Question 50

**Q:** What kind of context should be removed?

**A:**

Remove context that does not change the answer because it adds noise and consumes tokens.

### Question 51

**Q:** Why do relevant technical terms improve prompts?

**A:**

They reduce ambiguity and point the model to precise concepts. Example: `idempotency` is clearer than `duplicate payment problem`.

### Question 52

**Q:** Why can wrong technical terms hurt a prompt?

**A:**

Wrong terms can send the model toward the wrong concept confidently. If unsure, ask the model which terms are relevant first.

### Question 53

**Q:** Compare useful technical terms and buzzwords.

**A:**

Useful terms name real concepts, like `RAG` or `JWT authentication`. Buzzwords sound impressive but do not define a task, like `next-generation AI paradigm`.

### Question 54

**Q:** When should you use examples in a prompt?

**A:**

Use examples when the model must follow a custom pattern, label set, tone, grading style, extraction rule, or strict format.

### Question 55

**Q:** Why should prompt examples be close to real inputs?

**A:**

Examples teach the model the pattern. If examples differ from real inputs, the model may learn the wrong behavior.

### Question 56

**Q:** What does the prompt iteration loop show?

**A:**

```text
define goal -> write prompt -> test real inputs -> analyze output -> identify problems -> refine -> retest
```

### Question 57

**Q:** Why should prompts be tested with more than one input?

**A:**

One good output can hide failures. Test normal, short, long, missing-data, ambiguous, and bad inputs.

### Question 58

**Q:** What is one good refinement technique when a prompt fails?

**A:**

Use a targeted fix, such as adding examples, constraints, format rules, a clearer role, or a verification step.

### Question 59

**Q:** When should prompt iteration stop?

**A:**

Stop when outputs are consistent across the test set, accuracy is acceptable for the task risk, and further improvements are minor.

### Question 60

**Q:** Why are format rules useful?

**A:**

They make output easier to copy into docs, tickets, spreadsheets, code, or agent workflows.

### Question 61

**Q:** A prompt says `Make it better`. What is wrong, and how should it be fixed?

**A:**

`Better` is undefined. Replace it with specific criteria, such as `Improve clarity, remove repeated ideas, and keep the original meaning.`

## Structured Outputs

### Question 62

**Q:** What is a structured output?

**A:**

A structured output is a model response in a predictable data shape, usually JSON that follows a schema.

### Question 63

**Q:** When should structured outputs be used?

**A:**

Use them when software must parse, validate, store, display, route, or pass the model response to another workflow.

### Question 64

**Q:** Compare plain text and structured output.

**A:**

Plain text is written for humans. Structured output is written for software with predictable fields and types.

### Question 65

**Q:** Why is prompt-only JSON weak?

**A:**

The model may add prose, omit fields, rename fields, or use wrong types because the shape is not strongly enforced.

### Question 66

**Q:** Compare prompt-only JSON, JSON mode, and structured outputs.

**A:**

Prompt-only JSON is weakest. JSON mode improves JSON syntax. Structured outputs are strongest when the provider constrains output to a schema.

### Question 67

**Q:** What does the structured output flow diagram show?

**A:**

```text
input -> prompt + schema -> model request -> structured output -> parser -> validator -> application use or retry
```

### Question 68

**Q:** Why should schema design come before prompt writing?

**A:**

The schema defines what data the application needs. A prompt should support that shape instead of inventing fields afterward.

### Question 69

**Q:** What makes a good structured output field?

**A:**

It has a clear domain name, type, meaning, allowed values, and missing-data behavior.

### Question 70

**Q:** Why are enums useful in structured outputs?

**A:**

Enums limit output to fixed choices, such as `low`, `medium`, or `high`, which makes parsing and routing safer.

### Question 71

**Q:** Why should missing data often be represented as `null`?

**A:**

`null` keeps the shape stable while making missing information explicit.

### Question 72

**Q:** Give examples about good pattern and risky pattern

**A:**

Good pattern:

```text
{
  "order_id": null,
  "missing_fields": ["order_id"]
}
```

Risky pattern:

```text
{
  "missing_order": true
}
```

### Question 73

**Q:** Why should schemas usually stay shallow?

**A:**

Deep schemas are harder to prompt, test, debug, and migrate. Start simple unless the application truly needs nesting.

### Question 74

**Q:** How does the prompt support the schema?

**A:**

The schema controls format, while the prompt controls interpretation, evidence rules, missing-data behavior, and decision rules.

### Question 75

**Q:** What is a strong evidence rule for structured extraction?

**A:**

`Use only information in the input. Do not invent missing values. If a value is absent, set it to null.`

### Question 76

**Q:** When are examples helpful for structured outputs?

**A:**

Use examples when categories are easy to confuse, such as account help vs refund request vs bug report.

### Question 77

**Q:** What structured fields can help an agent decide the next step?

**A:**

Fields like `next_action`, `reason`, `missing_information`, `confidence`, and `can_finish`.

### Question 78

**Q:** How are structured outputs different from tool calling?

**A:**

Structured outputs describe final or intermediate model responses. Tool calling asks the application to execute a function with structured arguments.

### Question 79

**Q:** Why must structured outputs still be validated in code?

**A:**

The model can still produce invalid, incomplete, unsafe, or business-incorrect data. Treat output as untrusted until validation passes.

### Question 80

**Q:** What does the validation flow diagram show?

**A:**

```text
model response -> parse JSON -> schema validation -> business rules -> use data or retry/fallback/review
```

### Question 81

**Q:** What should happen when validation fails?

**A:**

Retry safely, handle refusals separately, ask for missing information, route risky cases to human review, or simplify the schema.

### Question 82

**Q:** Give one common structured-output failure.

**A:**

The model may return a nearly correct enum value, such as `urgent`, when the schema only allows `low`, `medium`, or `high`.

### Question 83

**Q:** Why use `additionalProperties: false` when possible?

**A:**

It blocks unexpected extra fields, making the output safer and easier to validate.

### Question 84

**Q:** What should a structured output production checklist include?

**A:**

Schema first, exact enums, explicit missing-data behavior, validation, edge-case tests, logged failures, schema versioning, and provider limitation awareness.

### Question 85

**Q:** A model extracts an order ID that was not in the customer message. What failed?

**A:**

The evidence rule failed or was missing. The prompt should require `order_id: null` when the input does not contain an order ID, and validation should catch invented values when possible.

## Prompt Testing

### Question 86

**Q:** What is prompt testing??

**A:**

Prompt testing is the process of evaluating how an AI model responds to a prompt to ensure the output is accurate, relevant, and consistent.

### Question 87

**Q:** What are the main goals of prompt testing?

**A:**

The main goals are to verify:

- Correctness of responses
- Consistency across runs
- Adherence to instructions
- Robustness to different inputs
- Safety and compliance

### Question 88

**Q:** What should a prompt test record?

**A:**

It should record the prompt, input, expected output, actual output, scoring result, failure type, and what changed after revision.

### Question 89

**Q:** What kinds of inputs should a prompt test set include?

**A:**

Include normal inputs, edge cases, missing information, ambiguous inputs, long inputs, short inputs, and bad or hostile inputs.

### Question 90

**Q:** Why should prompt changes be tested instead of guessed?

**A:**

Small wording changes can affect format, accuracy, safety, and cost. Testing shows whether the change actually improved behavior.

### Question 91

**Q:** What is one useful success criterion for a prompt testing lab?

**A:**

Use a clear scoring rule, such as `valid JSON`, `correct category`, `no invented facts`, `follows output format`, or `asks when required data is missing`.

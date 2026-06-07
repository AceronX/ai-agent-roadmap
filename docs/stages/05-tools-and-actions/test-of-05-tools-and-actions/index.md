# Test of 05 Tools and Actions

This study test checks understanding of every main section in **05 Tools and Actions**.

| Section | Questions |
| --- | ---: |
| Tool Definition | 15 |
| Tool Schemas | 15 |
| Function Calling | 15 |
| Tool Error Handling | 15 |
| Common Agent Tools | 15 |
| Permission Boundaries for Read, Write, and Destructive Tools | 15 |
| **Total** | **90** |

## Tool Definition

### Question 1

**Q:** What is a tool in an AI agent system?

**A:**

A tool is an external capability the agent can use, such as querying a database, searching documents, calculating a value, sending a message, or updating a system.

### Question 2

**Q:** What is a tool definition?

**A:**

A tool definition is the description of a tool given to the model. It explains what the tool does, when to use it, what inputs it needs, what it returns, and when not to use it.

### Question 3

**Q:** Does a tool definition execute the real action?

**A:**

No. The definition tells the model what tool exists. The application or agent framework validates the requested call and executes the real code.

### Question 4

**Q:** What does the application own in a tool-calling setup?

**A:**

The application owns argument validation and real tool execution. The model can request a tool call, but the app decides whether it is valid and safe to run.

### Question 5

**Q:** Why is a description often the most important human-written part of a tool definition?

**A:**

The description gives the model a decision rule: what the tool does, when to use it, when not to use it, what inputs mean, what output means, and any caveats.

### Question 6

**Q:** What naming pattern is recommended for tools?

**A:**

Use a short, specific, action-oriented `verb_object` name, such as `get_order_status`, `search_product_catalog`, or `calculate_shipping_cost`.

### Question 7

**Q:** Why is `data_tool` a weak tool name?

**A:**

It does not say what source it uses, what action it performs, what object it works on, or whether it reads, writes, or changes anything.

### Question 8

**Q:** What six questions should a useful tool definition answer?

**A:**

It should answer the tool name, purpose, use cases, non-use cases, required inputs, and output meaning.

### Question 9

**Q:** Why should inputs use domain-specific names like `order_id` instead of generic names like `id`?

**A:**

Domain-specific names tell the model exactly what value is expected and reduce wrong argument generation.

### Question 10

**Q:** What should output meaning explain?

**A:**

It should explain what returned fields mean, which fields may be missing or null, and how the model should interpret those cases without inventing unavailable details.

### Question 11

**Q:** What is the difference between a use case and a non-use case?

**A:**

A use case says when the model should call the tool. A non-use case says when a similar-looking request should use another tool, ask a question, or avoid tool use.

### Question 12

**Q:** A user asks "When will my package arrive?" but gives no order ID. What should an order-status tool definition instruct the model to do?

**A:**

It should ask for the `order_id` before calling the tool because the required lookup input is missing.

### Question 13

**Q:** Why should tool definitions include examples when tools are similar?

**A:**

Examples reduce tool confusion by showing realistic user requests and the expected tool decision.

### Question 14

**Q:** What should you do if a tool selection test shows the model chooses the wrong tool?

**A:**

Improve the tool name, description, use cases, non-use cases, input descriptions, or examples before changing agent logic.

### Question 15

**Q:** Why is "Your order will arrive soon" a bad answer when `estimated_delivery_date` is null?

**A:**

It invents confidence. A better answer says the label was created but the carrier has not provided an estimated delivery date yet.

## Tool Schemas

### Question 16

**Q:** What is a tool schema?

**A:**

A tool schema is the structured contract that defines valid tool inputs and expected tool outputs for an agent.

### Question 17

**Q:** Why do schemas matter before tool execution?

**A:**

They let the application validate required fields, types, constraints, and unknown fields before running real code.

### Question 18

**Q:** Compare a vague tool call and a structured tool call.

**A:**

Vague: "Search the tickets for open bugs." Structured: `{"tool": "search_tickets", "arguments": {"status": "open", "assignee": "me", "limit": 10}}`.

### Question 19

**Q:** What problem does `required` solve in a schema?

**A:**

It prevents incomplete calls by forcing necessary fields, such as `status` for a ticket search, to be present.

### Question 20

**Q:** What problem does an enum solve?

**A:**

An enum limits a field to allowed values, such as `open`, `pending`, or `resolved`, and rejects unsupported values like `urgent`.

### Question 21

**Q:** Why are minimum and maximum constraints useful?

**A:**

They keep values inside safe ranges, such as limiting `limit` between allowed bounds so a tool does not return too much data.

### Question 22

**Q:** What does `additionalProperties: false` mean?

**A:**

It means unknown fields are rejected, preventing the model from adding invented parameters such as `sort_by_magic`.

### Question 23

**Q:** What is the difference between an input schema and an output schema?

**A:**

An input schema validates what the model sends to the tool. An output schema documents what the tool returns so the model can interpret observations reliably.

### Question 24

**Q:** Is this call valid for a schema requiring `status` to be `open`, `pending`, or `resolved`: `{"status": "urgent", "limit": 10}`?

**A:**

No. `urgent` is not one of the allowed enum values.

### Question 25

**Q:** Is this call valid if `status` is required: `{"assignee": "me", "limit": 10}`?

**A:**

No. It is missing the required `status` field.

### Question 26

**Q:** What happens when schema validation fails?

**A:**

The application returns a structured error. The agent can then repair the call, ask the user, or stop instead of executing invalid code.

### Question 27

**Q:** Why should error shapes be structured too?

**A:**

Structured errors give the agent enough information to repair, retry, ask, or stop using fields like code, message, and retryable status.

### Question 28

**Q:** Why is a valid schema not the same as a safe action?

**A:**

A valid schema only proves the arguments have the expected shape. Permissions, policy checks, runtime limits, logging, and approval may still be required.

### Question 29

**Q:** Why can too many schema fields hurt tool use?

**A:**

Too many fields can confuse the model, increase invalid calls, make validation harder, and create broad behavior that should be split into narrower tools.

### Question 30

**Q:** What should a schema for "find the oldest unresolved issue assigned to a user" include?

**A:**

It should include a clear tool name, description, required assignee field, allowed status values for unresolved work, numeric result limits, output fields such as issue ID and age, an error shape, and a permission rule.

## Function Calling

### Question 31

**Q:** What is function calling in an AI agent?

**A:**

Function calling lets a model request a structured call to a tool, then lets the application validate, authorize, execute the real function, and return the result.

### Question 32

**Q:** How is function calling different from normal text generation?

**A:**

Normal text generation returns prose only. Function calling can produce a structured tool request that lets the application read data, run code, call APIs, or perform approved actions.

### Question 33

**Q:** What is the important rule about model control and application control?

**A:**

The model chooses or proposes the function call. The application validates, authorizes, logs, and executes it.

### Question 34

**Q:** In function calling, what do guardrails do?

**A:**

Guardrails validate arguments, check authorization and safety policy, log the action, and decide whether the real tool or API may run.

### Question 35

**Q:** What is the basic function-calling pipeline?

**A:**

```text
Plan -> choose tool -> generate arguments -> validate
-> execute -> observe -> continue or answer
```

### Question 36

**Q:** What is the difference between a function and a tool?

**A:**

A function is the actual code that can run. A tool is that capability exposed to the model with a name, description, schema, and usage rules.

### Question 37

**Q:** What is a tool call?

**A:**

A tool call is the model's structured request to use a tool, such as `{"tool": "calculate_total", "arguments": {...}}`.

### Question 38

**Q:** What is an observation in function calling?

**A:**

An observation is the result returned from the tool to the agent loop, such as calculated totals, search results, records, or structured errors.

### Question 39

**Q:** When would tool choice mode `required` be useful?

**A:**

Use `required` when the answer must come from a lookup, fresh data, strict validation, or another tool result rather than model memory.

### Question 40

**Q:** Why can multi-step function calling be powerful and risky?

**A:**

It lets agents complete workflows across several tools, but it also needs boundaries, stopping rules, validation, approval, and error handling because actions can compound.

### Question 41

**Q:** Why is function calling not just "the model returns JSON"?

**A:**

JSON is only the format. The system also needs tool definitions, schemas, model decisions, validation, authorization, execution, observation handling, final response, and audit logs.

### Question 42

**Q:** What validation layers should happen before execution?

**A:**

Syntax validation, schema validation, domain validation, permission checks, and safety checks should happen before execution.

### Question 43

**Q:** Why should output validation happen after execution?

**A:**

Tools can fail, return unexpected shapes, return too much data, or expose sensitive information. Output validation filters and confirms the result before sending it back to the model.

### Question 44

**Q:** What is prompt injection through tool results?

**A:**

It happens when untrusted content from a webpage, email, ticket, or document contains instructions like "ignore rules." The agent must treat that content as data, not trusted instructions.

### Question 45

**Q:** Why is drafting a Slack message allowed before sending it?

**A:**

Drafting is a lower-risk write action that can be reviewed. Sending externally is high-impact and should require preview and approval.

## Tool Error Handling

### Question 46

**Q:** What is tool error handling?

**A:**

Tool error handling is the process of catching and managing failures from APIs, databases, files, search, browsers, code tools, or other external systems called by an agent.

### Question 47

**Q:** Why should tool errors become observations instead of crashes?

**A:**

An error observation lets the agent correct arguments, retry safely, use a fallback, ask the user, or stop. A crash ends the workflow without giving the model useful feedback.

### Question 48

**Q:** What are the three main categories of tool failures?

**A:**

Formatting/schema errors, runtime errors, and logic or semantic errors.

### Question 49

**Q:** Give an example of a formatting or schema error.

**A:**

The model sends `user_id: "abc"` when the schema requires an integer.

### Question 50

**Q:** Give an example of a runtime error.

**A:**

The tool receives a timeout, `401 Unauthorized`, `429 Rate Limit Exceeded`, or a database connection failure while running.

### Question 51

**Q:** Give an example of a logic or semantic error.

**A:**

The tool runs successfully, but no user exists for the provided ID. The agent should ask for another identifier instead of retrying the same request.

### Question 52

**Q:** What is the catch, feed, correct loop?

**A:**

Catch the tool failure, feed a clear structured error observation to the model, then let the agent correct, retry, use a fallback, ask, or stop.

### Question 53

**Q:** What should a validation gate check?

**A:**

It should check that the tool exists, required fields are present, types match, values are in safe ranges, and the user or agent has permission.

### Question 54

**Q:** Why is `400 Bad Request` a weak error for an agent?

**A:**

It does not explain what failed, which argument caused it, whether retrying makes sense, or what safe next action the agent should take.

### Question 55

**Q:** What does a `recoverable` or `retryable` flag tell the agent?

**A:**

It tells the agent whether a failure may be temporary and worth retrying, or whether it should ask, change strategy, or stop.

### Question 56

**Q:** Why should a permission-denied error usually not be retried immediately?

**A:**

Permission errors usually require authorization, reconnection, approval, or a different account. Repeating the same call will likely fail again.

### Question 57

**Q:** What is a circuit breaker for tool use?

**A:**

A circuit breaker is a hard stop rule, such as stopping after repeated failures, repeated identical arguments, cost limits, time limits, or a non-recoverable error.

### Question 58

**Q:** What is truncation in tool results, and why is it dangerous?

**A:**

Truncation means a tool result is cut off because it is too large. It is dangerous because the tool may look successful while the model receives incomplete evidence.

### Question 59

**Q:** What should be logged for developers when tools fail?

**A:**

Log tool name, validated arguments with sensitive fields redacted, error type, provider status code, retry count, latency, trace ID, and final agent decision.

### Question 60

**Q:** Why should raw stack traces and secrets not be sent to the model context?

**A:**

They can expose sensitive implementation details, credentials, tokens, passwords, or private records. Keep those in secure server logs and send a clean model-friendly error instead.

## Common Agent Tools

### Question 61

**Q:** What are the six core categories of common agent tools?

**A:**

Search and retrieval, code execution, databases, APIs, files, and messaging.

### Question 62

**Q:** How do the six common tool categories connect to the agent?

**A:**

The agent core connects to the common tool families that let it find information, compute, query records, call services, work with files, and communicate outward.

### Question 63

**Q:** When should an agent use search and retrieval tools?

**A:**

Use them when the answer is not in model context or training data, such as current events, recent documentation, prices, internal policies, or RAG over private documents.

### Question 64

**Q:** What are common search and retrieval gotchas?

**A:**

Token bloat, stale or cached results, citation drift, and noisy top results.

### Question 65

**Q:** Why is code execution a high-risk tool category?

**A:**

The model writes code and the sandbox runs it. Without isolation, limits, and controls, this becomes arbitrary code execution.

### Question 66

**Q:** What controls should a code execution sandbox have?

**A:**

It should have no host filesystem access, no private network access, CPU and memory limits, timeouts, and clear handling for stdout and stderr.

### Question 67

**Q:** Why are narrow database tools usually safer than `run_sql(query)`?

**A:**

Narrow tools expose only intended queries and fields. A generic SQL tool can access too much data, generate unsafe SQL, return huge result sets, or perform writes/destructive actions.

### Question 68

**Q:** What is a safer replacement for a generic HTTP tool?

**A:**

Use purpose-built tools like `create_calendar_event(title, start, end, attendees)` or `get_weather_forecast(city, date)` instead of `http_request(method, url, body)`.

### Question 69

**Q:** Why should API secrets never go to the model?

**A:**

Secrets belong in the backend. Putting API keys or tokens in model arguments or context risks leakage through prompts, logs, tool results, or external sends.

### Question 70

**Q:** What is idempotency, and why does it matter for API writes?

**A:**

Idempotency prevents duplicate side effects when a write is retried. For example, a retried payment create call should not charge twice.

### Question 71

**Q:** What are common file operation risks?

**A:**

Path traversal outside the workspace, oversized files, accidental overwrites, and destructive deletion.

### Question 72

**Q:** Why should messaging tools usually draft before sending?

**A:**

Messages are visible and often irreversible. Drafting allows preview, correction, approval, and duplicate-send prevention.

### Question 73

**Q:** Compare do-anything tools and narrow tools.

**A:**

Do-anything tools hide risk, invite injection, and force the model to guess syntax. Narrow tools make the action obvious, limit blast radius, use simple arguments, and return cleaner results.

### Question 74

**Q:** What is the tradeoff of using narrow tools?

**A:**

Narrow tools are safer and easier to select, but they may require more individual tools. Keep the toolset small and purpose-built.

### Question 75

**Q:** What is a sensible starter toolset pattern for most agents?

**A:**

Use mostly read tools from a few categories, plus a small number of carefully scoped write tools and approval-gated destructive or external-send tools.

## Permission Boundaries for Read, Write, and Destructive Tools

### Question 76

**Q:** What is a permission boundary?

**A:**

A permission boundary is a guardrail that limits the maximum actions an agent, user, or role can perform.

### Question 77

**Q:** Does a permission boundary grant permission?

**A:**

No. It does not grant access by itself. It limits what other permissions are allowed to grant.

### Question 78

**Q:** Why are permission boundaries especially important for AI agents?

**A:**

Agents can call tools repeatedly, chain actions, and make mistakes quickly. Boundaries limit blast radius when something goes wrong.

### Question 79

**Q:** What is the simple mental model for classifying tool impact?

**A:**

```text
Read -> observe state
Write -> change state
Destructive -> remove, overwrite, execute, or make high-risk changes
```

### Question 80

**Q:** What is the basic permission rule for read, write, and destructive tools?

**A:**

Read tools can usually run automatically inside approved scope. Write tools need scope limits. Destructive tools need explicit approval or denial.

### Question 81

**Q:** Why are read tools not risk-free?

**A:**

They can leak sensitive information such as secrets, private customer data, credentials, or unrelated confidential records.

### Question 82

**Q:** Give three examples of write tools.

**A:**

Editing a document, creating a support ticket, updating a CRM record, creating a draft email, staging a git change, opening a pull request, or appending to a log.

### Question 83

**Q:** Give three examples of destructive tools.

**A:**

Deleting files, running `rm -rf`, dropping database tables, terminating cloud instances, force-pushing git history, deploying to production, transferring funds, or deleting audit logs.

### Question 84

**Q:** After a tool action is classified, what happens next?

**A:**

The action is routed to the relevant boundary: read boundary for approved sources, write boundary for scoped resources, or destructive approval/deny flow.

### Question 85

**Q:** What should a good approval prompt include?

**A:**

It should include the exact target, reason, expected impact, reversibility, rollback plan, evidence, and command or API call that will be executed.

### Question 86

**Q:** Why is "Can I delete resources?" a bad approval prompt?

**A:**

It is too vague. It does not show the exact target, impact, reason, rollback plan, or command, so the human cannot make an informed decision.

### Question 87

**Q:** What is the recommended security model for an engineering agent?

**A:**

Read source code and logs automatically, write patches inside the workspace, and ask approval before merging, deploying, deleting, force-pushing, or changing production resources.

### Question 88

**Q:** What is least privilege?

**A:**

Least privilege means giving the agent only the minimum access required for the task, such as reading issue data and updating assigned issues but not deleting issues or changing billing.

### Question 89

**Q:** What is privilege escalation in an agent system?

**A:**

Privilege escalation happens when an agent uses allowed permissions to gain stronger permissions, such as creating an admin role, editing CI to leak secrets, or modifying a deployment script to bypass controls.

### Question 90

**Q:** Before allowing a tool call, what policy questions should the system ask?

**A:**

Ask whether it is read, write, or destructive; what resource it touches; whether it is in scope; whether it exposes secrets; whether it affects production; whether it is reversible; whether approval is required; and whether it will be logged.

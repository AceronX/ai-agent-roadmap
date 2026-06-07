# Test of 04 Agent Fundamentals

This study test checks understanding of every main section in **04 Agent Fundamentals**.

| Section | Questions |
| --- | ---: |
| Agent Loop | 18 |
| ReAct Pattern | 13 |
| Reasoning and Planning | 18 |
| Acting and Observation | 15 |
| Stopping Criteria | 16 |
| Tools Overview | 10 |
| **Total** | **90** |

## Agent Loop

### Question 1

**Q:** What makes an AI agent different from a simple chatbot?

**A:**

A chatbot usually answers the current message. An AI agent receives a goal, tracks state, may plan steps, use tools, observe results, retry or revise, and stop when completion or safety rules are met.

### Question 2

**Q:** Why is the agent loop described as a control cycle?

**A:**

Because it repeatedly controls what happens next: perceive the current state, plan, act, observe the result, reflect, then decide whether to continue or stop.

### Question 3

**Q:** What is the basic flow of the agent loop?

**A:**

```text
Perceive -> Plan -> Act -> Observe -> Reflect -> Stop or Continue
```

Each step updates the agent's understanding before the next decision.

### Question 4

**Q:** In the agent loop, what does perception mean?

**A:**

Perception means gathering visible state, such as the user request, files, search results, logs, database rows, API responses, memory, or previous tool outputs.

### Question 5

**Q:** What is the role of planning in an agent loop?

**A:**

Planning turns the goal into the next step or a sequence of steps. It helps the agent decide what information, tool, or action is needed before acting.

### Question 6

**Q:** What counts as an action in an agent loop?

**A:**

An action is anything the agent does to gather information or change state, such as searching, reading a file, running tests, querying a database, sending a message, or producing the final answer.

### Question 7

**Q:** Why must observations update the agent's working state?

**A:**

Because observations contain the result of the last action. If the agent ignores them, it may repeat failed actions, use stale assumptions, or answer without evidence.

### Question 8

**Q:** What is reflection in an agent loop?

**A:**

Reflection is the check after an action. The agent asks whether the result helped, whether assumptions changed, whether the goal is complete, and whether it should continue, revise, ask, or stop.

### Question 9

**Q:** Why does every agent loop need a stop condition?

**A:**

Without a stop condition, the agent can loop forever, waste tokens and time, retry broken tools, continue after the goal is complete, or take unsafe actions.

### Question 10

**Q:** Give one specific stop rule for a research agent.

**A:**

Stop when the answer includes at least three credible cited sources, a comparison table, and no unresolved required question. Also stop after a maximum step, time, or cost budget.

### Question 11

**Q:** What should a reliable tool call include besides the tool name?

**A:**

It should include structured arguments, permission level, expected observation format, and failure behavior such as retry, ask the user, or stop safely.

### Question 12

**Q:** Why should tools be limited to what the agent actually needs?

**A:**

More tools increase complexity, permission risk, validation work, logging needs, and failure cases. A narrow tool set is easier to control and debug.

### Question 13

**Q:** What is the difference between the agent brain and the tool layer?

**A:**

The agent brain uses the LLM, instructions, planning policy, and safety rules to decide what to do. The tool layer provides external capabilities such as search, databases, files, code execution, browser actions, APIs, or email.

### Question 14

**Q:** How does memory support the loop?

**A:**

Memory stores useful state across steps or sessions, such as current plan, last observation, open questions, user preferences, retrieved context, or past decisions.

### Question 15

**Q:** Why should memory be treated as evidence rather than absolute truth?

**A:**

Memory can be stale, incomplete, corrupted, or based on old preferences. The agent should verify important memory before using it for high-impact decisions.

### Question 16

**Q:** Compare a fixed workflow and an autonomous agent.

**A:**

A fixed workflow follows predefined steps and is reliable for routine tasks. An autonomous agent adapts its next step based on goals, state, tools, and observations, but needs stronger guardrails and monitoring.

### Question 17

**Q:** A code agent runs a test, sees the same failure, and runs the same test again forever. Which loop failure is this?

**A:**

It is a no-progress or infinite-loop failure. The agent needs repeated-failure detection, a max-iteration limit, and reflection that changes strategy after repeated observations.

### Question 18

**Q:** Why is logging actions and observations important in production agents?

**A:**

Logs make the loop inspectable. Developers can see which tools were called, what observations returned, why the agent continued, and which stop reason ended the task.

## ReAct Pattern

### Question 19

**Q:** What does ReAct mean?

**A:**

ReAct means **Reason + Act**. The agent reasons about the next useful step, takes an action, observes the result, and uses that observation to decide the next step.

### Question 20

**Q:** What is a one-sentence definition of ReAct?

**A:**

ReAct is an agent loop where reasoning chooses the next action, and the observation from that action guides the next reasoning step.

### Question 21

**Q:** What is the ReAct loop in compact form?

**A:**

```text
Reason -> Act -> Observe -> Need more?
             ^              |
             | yes          | no
             +--------------+
                         -> Final Answer
```

### Question 22

**Q:** What is the most important connection in the ReAct loop?

**A:**

The observation must influence the next reasoning step. If the observation does not change or confirm what the agent does next, the loop is not using feedback effectively.

### Question 23

**Q:** What should the Reason step do in a good ReAct trace?

**A:**

It should name the next needed fact, decision, or action. Example: "I need the latest failed build log" is better than vague thinking.

### Question 24

**Q:** What should the Act step do in a good ReAct trace?

**A:**

It should use one relevant action with specific inputs, such as `read_build_log({"build_id": "latest"})`, instead of calling tools randomly.

### Question 25

**Q:** What should the Observe step contain?

**A:**

It should contain the actual result of the action, such as returned data, an error message, a file result, or a state change. It should not invent or ignore tool output.

### Question 26

**Q:** Why is this weak ReAct behavior: "Maybe it is a dependency issue. Final answer: install dependencies"?

**A:**

It skips action and observation. The agent guessed without reading logs, inspecting files, or grounding the final answer in evidence.

### Question 27

**Q:** When should ReAct be used?

**A:**

Use ReAct when the task needs step-by-step interaction, external evidence, tools, investigation, or when one result determines the next step.

### Question 28

**Q:** Give two tasks that usually do not need ReAct.

**A:**

Explaining what JSON is and rewriting a short paragraph usually do not need ReAct because the model can answer or transform the given input directly.

### Question 29

**Q:** Compare ReAct and planning.

**A:**

Planning organizes intended steps. ReAct executes a feedback loop: reason, act, observe, then revise the next reasoning step based on the observation.

### Question 30

**Q:** Does ReAct guarantee correct answers? Why or why not?

**A:**

No. ReAct improves grounding, but tools can fail, observations can be stale or wrong, and the final answer can still misinterpret the evidence.

### Question 31

**Q:** In a product, should a ReAct agent expose every private reasoning token to the user?

**A:**

No. Learning traces can show Reason, Act, and Observation, but products should usually expose concise status, evidence, and final results rather than private internal reasoning.

## Reasoning and Planning

### Question 32

**Q:** What is agentic reasoning?

**A:**

Agentic reasoning is the decision-making process that lets an agent interpret a goal, identify missing information, choose tools or actions, compare next steps, and revise based on feedback.

### Question 33

**Q:** Why does planning matter for complex agent tasks?

**A:**

Planning breaks a broad goal into smaller steps, exposes dependencies, improves auditability, coordinates tools, and helps the agent recover when information is missing or actions fail.

### Question 34

**Q:** What four questions does practical planning answer?

**A:**

It answers: What is the goal? What is the current state? What actions are available? Which sequence should be followed?

### Question 35

**Q:** What is the difference between a reactive agent and a planning agent?

**A:**

A reactive agent responds immediately to the current input. A planning agent looks ahead by considering the desired end state, current state, available actions, and a sequence to reach the goal.

### Question 36

**Q:** What should a useful goal include for an agent?

**A:**

It should include the desired output, constraints, success criteria, deadlines or budgets, required data sources, and actions that need approval.

### Question 37

**Q:** Why is "Help me with customer tickets" a weak goal?

**A:**

It lacks scope, output format, priority, safety boundaries, and success criteria. The agent does not know which tickets, what action to take, or what not to do.

### Question 38

**Q:** What is task decomposition?

**A:**

Task decomposition breaks a large goal into smaller subgoals that are easier to execute, order, verify, and retry.

### Question 39

**Q:** Why should decomposed tasks be ordered by dependency?

**A:**

Some steps require earlier results. For example, an agent should not estimate total travel cost before it knows flights, hotel, and itinerary.

### Question 40

**Q:** What is state representation in planning?

**A:**

State representation is the structured view of the current situation: goal, facts, constraints, tool results, available resources, previous decisions, open questions, and progress.

### Question 41

**Q:** What can happen when state representation is poor?

**A:**

The agent may duplicate work, forget constraints, use stale information, choose the wrong tool, or continue after the goal is already satisfied.

### Question 42

**Q:** What is action sequencing?

**A:**

Action sequencing orders the steps that move the agent from the current state to the goal state while considering dependencies, risk, optional actions, and approval gates.

### Question 43

**Q:** Why is "send summary, then search bugs" a bad sequence for a bug-summary agent?

**A:**

It performs the external action before gathering and checking the required information. The agent should search, group, draft, request approval if needed, then send.

### Question 44

**Q:** What tradeoffs can planning optimization consider?

**A:**

Planning can consider time, cost, risk, reliability, resource use, user preference, expected reward, and probability of success.

### Question 45

**Q:** When is replanning needed?

**A:**

Replanning is needed when a tool fails, the environment changes, the user changes the goal, another agent acts, a resource is missing, or the current plan becomes unsafe or impossible.

### Question 46

**Q:** Compare centralized and decentralized multiagent planning.

**A:**

Centralized planning uses one controller to coordinate the plan, which improves oversight but can bottleneck. Decentralized planning lets agents plan locally and coordinate, which is flexible but harder to govern.

### Question 47

**Q:** When should an agent use direct response instead of a planning loop?

**A:**

Use direct response for simple, low-risk tasks such as greetings, basic Q&A, short transformations, or cases where low latency matters more than deeper reasoning.

### Question 48

**Q:** When should an agent use plan-and-execute?

**A:**

Use plan-and-execute for complex, multi-phase work where the user or developer needs a visible, auditable sequence before execution.

### Question 49

**Q:** What is the main tradeoff of using more advanced reasoning strategies?

**A:**

They may improve quality, coverage, or risk control, but they usually increase token use, latency, tool calls, compute cost, and implementation complexity.

## Acting and Observation

### Question 50

**Q:** What is acting in an AI agent?

**A:**

Acting is the step where the agent does something beyond thinking, often by invoking a tool, querying a system, creating a file, running code, or taking another external step.

### Question 51

**Q:** What are the three important parts of tool invocation?

**A:**

Tool choice, tool input, and tool result. The agent must choose the right tool, provide exact input, and read what the tool returns.

### Question 52

**Q:** What is observation?

**A:**

Observation is reading what actually happened after an action, including returned data, errors, missing results, or changes in the environment.

### Question 53

**Q:** What is reflection?

**A:**

Reflection is deciding what an observation means for the user's goal and whether the agent should answer, ask, retry, change plan, or stop.

### Question 54

**Q:** Using an example, compare observation and reflection.

**A:**

Observation: "The forecast says heavy thunderstorms and high winds." Reflection: "A model rocket launch tomorrow is unsafe, so recommend waiting."

### Question 55

**Q:** Why is reflection described as a special kind of reasoning?

**A:**

It happens after feedback. It looks backward at the result of an action, then decides whether the plan should continue, change, ask, or stop.

### Question 56

**Q:** In the agent loop, what happens before an action and what happens after it?

**A:**

Before action: reasoning and planning. After action: observing and reflecting. Reflection feeds the next round of reasoning and planning if more work is needed.

### Question 57

**Q:** Why is built-in model knowledge not enough for tomorrow's weather?

**A:**

Weather changes constantly. The agent needs current real-world data from a weather or web search tool instead of relying on training-time knowledge.

### Question 58

**Q:** Why should a weather agent ask for the location if it does not know it?

**A:**

The forecast depends on location. Without a trusted location, the tool input would be incomplete and the answer could be wrong.

### Question 59

**Q:** Beyond reporting a tool's raw result, what does reflection add?

**A:**

Reflection connects the result to the user's real goal and turns it into a decision. For example, instead of just reporting a 90% chance of thunderstorms, it recommends waiting for a clear, calm day before a model rocket launch.

### Question 60

**Q:** Why should an agent verify its first answer instead of returning it immediately?

**A:**

A first guess can satisfy part of the problem but violate another constraint. In the bat-and-ball puzzle, the naive guess matches the total cost but breaks the rule that the bat costs exactly one dollar more than the ball; reflection catches this before the final response.

### Question 61

**Q:** What is an example of bad tool input?

**A:**

Searching for "weather tomorrow" without including the location is bad input because the tool cannot know which forecast the user needs.

### Question 62

**Q:** What does it mean to write observation like evidence and reflection like a decision?

**A:**

Observation should state the raw fact, such as "API returned 401 Unauthorized." Reflection should decide the implication, such as "Do not trust missing data; the tool failed."

### Question 63

**Q:** Name three common failure modes in acting and observation.

**A:**

Wrong tool, bad tool input, ignored result, shallow observation, no reflection, or infinite tool calls. Any three show the agent is not learning from feedback.

### Question 64

**Q:** After each action, what should the reflection checklist ask?

**A:**

It should ask what was expected, what actually happened, whether the tool succeeded, whether the result answers the real goal, whether constraints were violated, and whether to answer, ask, or act again.

## Stopping Criteria

### Question 65

**Q:** What are stopping criteria?

**A:**

Stopping criteria are rules that tell an agent when work is complete, blocked, unsafe, too expensive, or no longer useful, so it should stop the loop and return an appropriate result.

### Question 66

**Q:** Where in the agent loop are stopping criteria checked?

**A:**

They are checked after the agent takes an action, observes the result, and reflects on progress.

### Question 67

**Q:** Why does stopping not always mean success?

**A:**

An agent can stop because it succeeded, needs input, needs approval, reached a limit, hit too many errors, detected no progress, or encountered an unsafe request.

### Question 68

**Q:** Compare a success stop and a clarification stop.

**A:**

A success stop means the goal is complete and the agent returns the result. A clarification stop means required input is missing, so the agent asks a specific question before continuing.

### Question 69

**Q:** Why are limit stops necessary but not enough by themselves?

**A:**

Limit stops prevent runaway execution, but they do not prove the task is complete. The agent still needs success criteria and safety/failure rules.

### Question 70

**Q:** What is a no-progress stop?

**A:**

A no-progress stop ends the loop when the agent repeats the same action, gets the same error, or completes several loops without adding useful new evidence.

### Question 71

**Q:** Give one safety or approval stop for an email-sending agent.

**A:**

Before sending, show the recipient, subject, and exact message preview, then wait for explicit approval.

### Question 72

**Q:** Turn "stop when done" into a more measurable rule for a coding agent.

**A:**

Stop when the target failing test passes, related tests pass, and the code change is limited to the root cause.

### Question 73

**Q:** What is the purpose of stop reason codes?

**A:**

Stop reason codes record why the agent stopped, such as `success`, `needs_input`, `needs_approval`, `max_iterations`, `tool_error_limit`, `no_progress`, or `unsafe_request`.

### Question 74

**Q:** Why should stop-related state be tracked explicitly?

**A:**

Explicit state lets the application decide whether to continue using counts, limits, errors, repeated actions, approval flags, and stop reason instead of relying only on the model's judgment.

### Question 75

**Q:** Why should safety or approval checks happen before the agent continues?

**A:**

Because the next action may be risky or forbidden. The agent should request approval or refuse before making destructive, private, financial, production, or high-impact changes.

### Question 76

**Q:** A research agent keeps collecting similar sources even after enough evidence exists. Which stop rule is weak?

**A:**

The source count, time limit, confidence threshold, or no-progress rule is weak. The agent needs measurable criteria for enough research.

### Question 77

**Q:** A support agent has no customer ID but keeps querying billing. What should it do?

**A:**

It should trigger a clarification stop and ask for the required customer ID instead of making incomplete or misleading tool calls.

### Question 78

**Q:** What is the practical rule for when an agent should stop?

**A:**

An agent should stop when the next loop is no longer useful, allowed, or worth the cost.

### Question 79

**Q:** What four questions do good stopping criteria answer?

**A:**

They answer: What proves success? What are the time, money, token, and tool limits? When should the agent stop trying? Which actions require approval, refusal, or handoff?

### Question 80

**Q:** Why should an unsafe action request be checked before iteration limits?

**A:**

Safety must interrupt the loop immediately. The agent should not continue toward an unsafe action just because it still has remaining iterations.

## Tools Overview

### Question 81

**Q:** What are tools in AI agent systems?

**A:**

Tools are external capabilities that let agents interact with the world beyond the language model, such as searching, reading files, querying databases, running code, sending messages, or updating systems.

### Question 82

**Q:** What are the four core agent primitives?

**A:**

```text
Agent
├── Model
├── Tools
├── Memory
└── Instructions
```

The model reasons, tools provide capabilities, memory stores information, and instructions define behavior.

### Question 83

**Q:** Why does a model need tools to answer "What is the current weather in Tokyo?"

**A:**

The question requires current external data. Without a weather or web tool, the model would need to guess, refuse, or provide stale information.

### Question 84

**Q:** Compare the flow without tools and with tools.

**A:**

Without tools: `Input -> Model -> Output`. With tools: `Input -> Model -> Tool -> Environment -> Tool Result -> Model -> Output`.

### Question 85

**Q:** What are perception tools?

**A:**

Perception tools gather information from the environment, such as web search, database query, file reader, API request, or document retrieval.

### Question 86

**Q:** What are action tools?

**A:**

Action tools modify the environment, such as email senders, GitHub integrations, database writers, deployment systems, or browser automation.

### Question 87

**Q:** What is the tool lifecycle?

**A:**

```text
Tool Registration -> Tool Selection -> Argument Generation
-> Tool Execution -> Observation -> Response Generation
```

### Question 88

**Q:** What is the difference between a tool and an agent?

**A:**

A tool is a capability, such as a calculator or search engine. An agent is the system that uses tools together with a model, memory, and instructions to pursue a goal.

### Question 89

**Q:** Name three risks of tool use.

**A:**

Tool failures, incorrect tool selection, latency, cost, security risk, permission misuse, unreliable outputs, or unexpected data.

### Question 90

**Q:** Why do standards such as Function Calling and MCP matter for tool ecosystems?

**A:**

They make it easier for models, frameworks, and tools to communicate consistently, reducing the burden of custom integrations for every tool.

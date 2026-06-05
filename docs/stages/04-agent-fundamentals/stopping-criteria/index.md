# Stopping Criteria

## What is Stopping Criteria in Agent Fundamentals?

Stopping criteria is the set of rules that tells an AI agent:

"You have done enough. Stop working and return the result."

Without stopping criteria, an agent could keep thinking, planning, calling tools, and generating actions forever.
# AI Agent Loop

Most agents follow this cycle:

┌──────────────┐
│ User Request │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Think      │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Take Action  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Observation  │
└──────┬───────┘
       │
       ▼
Goal Finished?
   │         │
 Yes         No
   │          │
 STOP      Repeat

The Stopping Criteria is the decision point.


# Why It Matters

An AI agent typically follows a loop:
```
User Request
      ↓
Planning
      ↓
Action
      ↓
Observation
      ↓
Reflection
      ↓
Need More Work?
      ↓
   Yes → Loop Again
   No  → Stop
```
The decision at "Need More Work?" is the stopping criteria.

| Without It       | With It              |
| ---------------- | -------------------- |
| Infinite loops   | Controlled execution |
| High cost        | Cost control         |
| Slow responses   | Faster responses     |
| Repeated actions | Efficient actions    |
| Resource waste   | Resource saving      |

---


### Example 1: Web Search Agent

User:
```
Find the capital of France.
```
Agent:
```
Search web
   ↓
Found: Paris
   ↓
Answer user
   ↓
STOP
```
Stopping criterion:
```
Required information found.
```
---
### Example 2: Coding Agent

User:
```
Fix my failing unit test.
```

Agent:
```
Read code
   ↓
Analyze error
   ↓
Modify code
   ↓
Run tests
   ↓
Tests pass?
```
If:
```
YES
```
Stop.

If:
```
NO
```
Continue debugging.

Stopping criterion:
```
All tests pass.
```
---
### Example 3: Research Agent

User:
```
Research AI agents.
```
Agent:
```
Search source #1
Search source #2
Search source #3
```
Stopping criteria might be:
```
At least 10 reliable sources collected.
```
or
```
Research confidence > 90%.
```

## Common Types of Stopping Criteria
### 1. Goal Completion

Most common.

Stop when the task is finished.

Example

User:

Find the current weather in Tokyo.

Agent:

1. Search weather
2. Get result
3. Return answer
4. STOP

Diagram:

Task
 ↓
Search
 ↓
Found Answer?
 ↓
Yes
 ↓
STOP

### 2. Maximum Iterations

Stop after a fixed number of loops.

Example:
```
Max Loops = 10
```
Agent:
```
Loop 1
Loop 2
...
Loop 10
STOP
```
Used to prevent infinite loops.

### 3. Time Limit

Stop after a certain amount of time.

Example:
```
Maximum Runtime = 5 minutes
```
After 5 minutes:
```
STOP
```
Useful for production systems.

### 4. Token Limit

For LLM-powered agents.

Example:
```
Max Tokens = 50,000
```
If the agent reaches the budget:
```
STOP
```
This controls cost.

### 5. Confidence Threshold
Stop when confidence becomes high enough.

Example:

Confidence = 95%
Threshold = 90%

Agent:

95% > 90%
STOP

Used in:

Classification
Search systems
Recommendation systems
Autonomous agents
### 6. Error Threshold

Stop if too many errors occur.

Example:
```
5 consecutive failures
```
Then:
```
STOP
Report failure
```
### 7. Human Approval

Agent waits for user confirmation.

Example:
```
Generated deployment plan.

Then:
```
Approve?
```
If user approves:
```
Continue
```
Otherwise:
```
Stop or revise



## Example from LangChain Agents
In frameworks like LangChain, you often see:
agent_executor = AgentExecutor(
    agent=agent,
    tools=tools,
    max_iterations=20,
    max_execution_time=300
)

Meaning:

Parameter	Meaning
max_iterations=20	Stop after 20 loops
max_execution_time=300	Stop after 300 seconds

# Complete Stopping Criteria Flow


Start Agent
      │
      ▼
Think
      │
      ▼
Take Action
      │
      ▼
Observe Result
      │
      ▼
Goal Achieved?
 ├── Yes → STOP
 │
 └── No
       │
       ▼
Max Iterations Reached?
 ├── Yes → STOP
 │
 └── No
       │
       ▼
Time Limit Reached?
 ├── Yes → STOP
 │
 └── No
       │
       ▼
Budget Exhausted?
 ├── Yes → STOP
 │
 └── No
       │
       ▼
Continue Loop


# Summary Table
| Stopping Criteria | Description         | Example           |
| ----------------- | ------------------- | ----------------- |
| Goal Completion   | Task finished       | Answer found      |
| Max Iterations    | Maximum loops       | 20 iterations     |
| Max Time          | Time limit          | 300 seconds       |
| Success Threshold | Confidence reached  | 90% confidence    |
| Error Threshold   | Too many failures   | 3 errors          |
| Resource Limit    | Budget exhausted    | $1 spent          |
| Human Approval    | Await user decision | Delete files      |
| No Progress       | Agent stuck         | Repeating actions |


## Key Takeaway

A good AI agent rarely relies on only one stopping criterion. Most production systems use a combination such as:

STOP if:
✓ Goal completed
OR
✓ max_iterations reached
OR
✓ max_execution_time reached
OR
✓ budget exceeded
OR
✓ too many errors occurred

This combination makes the agent safe, efficient, cost-controlled, and reliable, preventing endless loops while ensuring it has enough opportunities to solve the task.
# Stopping Criteria

## What is Stopping Criteria in Agent Fundamentals?

Stopping criteria is the set of rules that tells an AI agent:

"You have done enough. Stop working and return the result."

Without stopping criteria, an agent could keep thinking, planning, calling tools, and generating actions forever.
## Why It Matters
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

Stop when the objective is achieved.

Example:
```
Task:
Book a hotel

Hotel booked
→ Stop
```

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

Stop when confidence is high enough.

Example:
```
Confidence = 95%
```
Agent decides:
```
Answer is reliable.
STOP
```
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
```
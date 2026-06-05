# Function Calling in AI Agents (Tools & Actions)
Function Calling is one of the most important concepts in modern AI agents.

Without function calling, an AI can only talk.
With function calling, an AI can do things.

# 1. What is Function Calling?
Function Calling is a mechanism that allows an AI agent to use external tools, APIs, databases, calculators, search engines, applications, or custom code.

Without function calling, an AI can only generate text.

With function calling, an AI can:

Search the web
Check weather
Read databases
Send emails
Create calendar events
Run Python code
Call APIs
Control software


Think of it like this:

| Human           | AI Agent                  |
| --------------- | ------------------------- |
| Uses calculator | Calls calculator function |
| Searches Google | Calls search function     |
| Sends email     | Calls email function      |
| Checks weather  | Calls weather API         |
| Books hotel     | Calls booking API         |


# Overall Architecture
```
          USER
            │
            ▼
   ┌─────────────────┐
   │   AI MODEL      │
   └─────────────────┘
            │
            │ decides tool needed
            ▼
   ┌─────────────────┐
   │ FUNCTION CALL   │
   └─────────────────┘
            │
            ▼
   ┌─────────────────┐
   │ TOOL / API      │
   └─────────────────┘
            │
            ▼
       RESULT
            │
            ▼
   ┌─────────────────┐
   │   AI MODEL      │
   └─────────────────┘
            │
            ▼
         USER

```
# 2. Why It Matters

Large Language Models have limitations.

They:

✅ Understand language

But cannot automatically:

❌ Access database

❌ Search internet

❌ Send email

❌ Read files

❌ Use calculator accurately

❌ Control software

Function Calling solves this.

### AI Agent = Brain + Tools
```
          AI AGENT

     ┌───────────────┐
     │     BRAIN     │
     │    (LLM)      │
     └───────────────┘
              │
     ┌────────┼────────┐
     ▼        ▼        ▼

 Calculator  Search  Email

     ▼        ▼        ▼

    Tools   Tools   Tools
```
The LLM is the brain.

Functions are the hands.

# 3. What is a Tool?
A Tool is simply a function that the AI can call.
Example:
```
def add(a, b):
    return a + b
```
Tool definition:
```
{
  "name": "add",
  "description": "Add two numbers"
}
```
When user asks:
```
25 + 30
```
AI may call:
```
{
  "name": "add",
  "arguments": {
    "a": 25,
    "b": 30
  }
}
```
Result:
```
55
```

# 4. Function Calling Flow

The complete process:
```
Step 1

User asks question

        │
        ▼

Step 2
AI analyzes request

        │
        ▼

Step 3
AI chooses tool

        │
        ▼

Step 4
AI generates function call

        │
        ▼

Step 5
System executes function

        │
        ▼

Step 6
Function returns result

        │
        ▼

Step 7
AI creates final answer
```
# 5. Function vs Tool vs Action

| Term     | Meaning                           |
| -------- | --------------------------------- |
| Function | Actual code                       |
| Tool     | Function exposed to AI            |
| Action   | Real-world task performed         |
| Agent    | AI that decides which tool to use |

Example:
```
def send_email():
    ...
```

Function:
```
send_email()
```

Tool:
```
Email Tool
```

Action:
```
Email gets sent
```

Agent:
```
Decides when to send email
```
# 6. Single Tool Example

Imagine a calculator tool.
```
def multiply(a,b):
    return a*b
```
User:
```
23 × 42
```
Agent:
```
Need calculator
```
Function call:
```
{
  "name":"multiply",
  "arguments":{
      "a":23,
      "b":42
  }
}
```
Tool returns:
```
966
```
AI:
```
23 × 42 = 966
```
# 7. Multi-Tool Function Calling
Modern agents can use many tools.

Example:

User:
```
Find cheapest flight to Paris
and email me the details.
```
Agent workflow:

```
User
 │
 ▼
Search Flight Tool
 │
 ▼
Find Best Flight
 │
 ▼
Email Tool
 │
 ▼
Send Email
 │
 ▼
Return Confirmation
```
Functions called:
```
search_flights()
send_email()
```
Multiple tools can be chained together.

# 8. Function Calling in AI Agents

Agent Loop:
```
Observe
   │
   ▼
Reason
   │
   ▼
Choose Tool
   │
   ▼
Call Tool
   │
   ▼
Get Result
   │
   ▼
Reason Again
   │
   ▼
Final Answer
```
This cycle is often called:

Tool-Use Loop

or

Reasoning Loop

# 9. Function Calling vs Prompting

| Prompt Only        | Function Calling |
| ------------------ | ---------------- |
| Can explain        | Can execute      |
| Can guess          | Can verify       |
| Text only          | Real actions     |
| No APIs            | Uses APIs        |
| No database access | Database access  |


# Summary

Function Calling is the mechanism that allows an AI agent to:

Understand a user's request.
Decide whether a tool is needed.
Generate a structured function call.
Execute the tool/API.
Receive the result.
Continue reasoning.
Return the final answer.

A simple formula to remember is:

LLM + Tools + Function Calling
           =
      AI Agent

Without function calling, an AI can only talk about tasks.

With function calling, an AI can perform tasks.
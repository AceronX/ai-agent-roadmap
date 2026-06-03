# Pricing and Latency

Pricing and Latency are two of the most important concepts in LLM fundamentals, especially when building AI agents, chatbots, or production applications.

## 1. What is Pricing?
Pricing refers to how much it costs to use an LLM.

Most LLM providers charge based on the number of tokens processed.

A token is roughly:

1 word ≈ 1.3 tokens (English average)
100 words ≈ 130 tokens

For example:
```
User:
What is machine learning?

Assistant:
Machine learning is a field of AI...
```
Both the user's message and the model's response consume tokens.
---
#### Pricing Formula

Generally:

Total Cost
=
Input Tokens Cost
+
Output Tokens Cost
## 2. What is Latency?
Latency is the time it takes for the model to produce a response.

Simply:
Latency=Response Time
Example

User sends:

What is reinforcement learning?
##### Fast Model
Response in 0.5 seconds
```
Latency = 0.5s
```
##### Slow Model
Response in 10 seconds
```
Latency = 10s
```
---
#### Components of Latency

Total latency often consists of:
```
Network Time
+
Queue Time
+
Inference Time
+
Tool Time
```
---
##### Network Time

Time for data to travel.

Example:
```
User → API
API → User
```
Often:
```
50ms–500ms
```
##### Queue Time

Sometimes servers are busy.

Request waits before processing.

Example:
```
Busy GPU cluster
Inference Time
```
The actual thinking/generation time of the model.

Usually the largest component.

##### Tool Time

For agents:
```
User
 ↓
LLM
 ↓
Search Tool
 ↓
Database
 ↓
LLM
 ↓
Answer
```
Every tool call adds latency.
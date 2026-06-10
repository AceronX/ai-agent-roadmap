# Agent Frameworks

<div class="topic-page" markdown="1">

<section class="topic-hero">
  <span class="topic-hero__eyebrow">Stage 09 - Building Agents</span>
  <p class="topic-hero__lead">Once you can write the agent loop yourself, a framework's job is clear: it standardizes that loop and adds state, tool plumbing, and tracing around it. Six frameworks dominate today — LangChain, LangGraph, LlamaIndex, CrewAI, AutoGen, and the OpenAI Agents SDK — and each has a different idea of what an agent fundamentally <em>is</em>.</p>
  <div class="topic-hero__facts">
    <span>LangChain</span>
    <span>LangGraph</span>
    <span>LlamaIndex</span>
    <span>CrewAI</span>
    <span>AutoGen</span>
    <span>OpenAI SDK</span>
  </div>
</section>

## Goal

By the end of this topic, you should be able to:

- Say what a framework adds over the from-scratch loop you already built.
- Describe the core paradigm of each of the six frameworks.
- Recognize each one's state model and tool usage from its code.
- Match a framework to the shape of your problem.

## Learning Path

<div class="learning-grid learning-grid--path">
  <a class="learning-card" href="#part-1-what-a-framework-adds">
    <strong>Part 1 - What a Framework Adds</strong>
    <span>The loop you built, wrapped with conveniences.</span>
  </a>
  <a class="learning-card" href="#part-2-the-six-at-a-glance">
    <strong>Part 2 - The Six at a Glance</strong>
    <span>One table to compare paradigms.</span>
  </a>
  <a class="learning-card" href="#part-3-langchain-and-langgraph">
    <strong>Part 3 - LangChain and LangGraph</strong>
    <span>Linear pipelines and cyclic state machines.</span>
  </a>
  <a class="learning-card" href="#part-4-llamaindex-and-crewai">
    <strong>Part 4 - LlamaIndex and CrewAI</strong>
    <span>Data navigation and role-based teams.</span>
  </a>
  <a class="learning-card" href="#part-5-autogen-and-the-openai-agents-sdk">
    <strong>Part 5 - AutoGen and the OpenAI Agents SDK</strong>
    <span>Conversational networks and code-first primitives.</span>
  </a>
</div>

## Part 1: What a Framework Adds

You already wrote the core loop in [Building an agent loop from scratch](../agent-loop-from-scratch/index.md): call the model, read the reply, run tools, repeat until done. A framework does **not** replace that loop — it wraps it and adds:

- **Provider abstraction** — swap models without rewriting your logic.
- **State handling** — a structured place for conversation history and working memory.
- **Tool plumbing** — generate schemas from functions and feed results back automatically.
- **Tracing and tooling** — visualize and replay runs.

The loop is the same underneath. The value a framework adds is everything *around* it — and that convenience always trades against how much of the loop you can still see (the subject of the next topic, [Choosing a framework without losing debuggability](../choosing-a-framework/index.md)).

> A note on providers: all six frameworks are provider-agnostic. The examples below use Claude where a model is instantiated, but each supports OpenAI, Google, and others.

## Part 2: The Six at a Glance

| Dimension | LangChain | LangGraph | LlamaIndex | CrewAI | AutoGen | OpenAI Agents SDK |
| --- | --- | --- | --- | --- | --- | --- |
| **Primary paradigm** | Linear pipelines | Cyclic state machine | Data/index navigation | Role-based teams | Conversational network | Code-first primitives |
| **State** | Stateless/linear | Centralized graph state | Runner/worker task logs | Sequential task context | Shared chat history | Plain program variables |
| **Tool execution** | Integrated in chains | Isolated tool nodes | Query engines as tools | Tools bound per agent | Code-execution proxy | Native strict decorators |
| **Control flow** | Deterministic pipeline | Conditional edges | Task steps | Manager / sequential | Event-driven chat | Imperative handoffs |

Use this as a map: the rest of the page walks the six in pairs.

## Part 3: LangChain and LangGraph

### LangChain — the abstraction layer

LangChain's philosophy is **standardization**. It wraps disparate model providers, vector stores, and tools behind one interface so you can swap components. Its LangChain Expression Language (LCEL) chains steps with the pipe operator (`|`); data flows down a linear pipeline where each step's output is the next step's input. Tools are defined with the `@tool` decorator — LangChain reads the type hints and docstring to build the provider's JSON schema.

```python
from langchain_core.tools import tool
from langchain_anthropic import ChatAnthropic

@tool
def multiply(a: int, b: int) -> int:
    """Multiply two integers together."""
    return a * b

model = ChatAnthropic(model="claude-opus-4-8").bind_tools([multiply])
chain = model | (lambda x: x.tool_calls)
```

To run this against OpenAI instead, change two lines: `from langchain_openai import ChatOpenAI` and `ChatOpenAI(model="gpt-4o")`. The rest is identical — that swap-ability is the whole point of LangChain.

### LangGraph — the cyclic state machine

Real agents loop: try, fail, call a tool, inspect, retry. LangGraph models this as an explicit **state machine**. A schema-defined `State` object is passed to every node; nodes update it; conditional edges inspect it and route to the next node. Tools live in an isolated `ToolNode`, and a conditional edge routes control to it whenever the model emits a tool call.

```python
from langgraph.graph import StateGraph, MessagesState, START, END
from langgraph.prebuilt import ToolNode

workflow = StateGraph(MessagesState)
workflow.add_node("agent", call_model)
workflow.add_node("tools", ToolNode([multiply]))

workflow.add_edge(START, "agent")
workflow.add_conditional_edges("agent", should_continue, {"continue": "tools", "end": END})
workflow.add_edge("tools", "agent")
app = workflow.compile()
```

LangChain is best for linear "do A then B" flows; LangGraph for anything with loops, branches, or retries.

## Part 4: LlamaIndex and CrewAI

### LlamaIndex — the data-orchestration engine

LlamaIndex treats agents as active extensions of a **data ecosystem**. An `AgentRunner` manages overall task state, memory, and steps; an `AgentWorker` handles the next step's logic. Its specialty is turning indexes into tools — a `QueryEngineTool` lets the agent search a document store via native tool calling.

```python
from llama_index.core.agent import FunctionCallingAgentWorker
from llama_index.core.tools import QueryEngineTool

query_tool = QueryEngineTool.from_defaults(
    query_engine=vector_index.as_query_engine(),
    name="financial_reports",
    description="Search company financial PDF filings.",
)
worker = FunctionCallingAgentWorker.from_tools([query_tool], llm=llm)
agent = worker.as_agent()
```

### CrewAI — role-based teams

CrewAI frames agent design as **managing a project team**. You define agents with roles, goals, and backstories, assign them tasks, and a context object (or a manager agent) passes work down the line. Tools are bound to specific agents, so each agent only sees the schemas it needs.

```python
from crewai import Agent, Task, Crew

researcher = Agent(role="Web Researcher", goal="Find market data", backstory="Expert analyst")
writer = Agent(role="Copywriter", goal="Write a summary", backstory="Tech journalist")

task1 = Task(description="Analyze sector X", agent=researcher, tools=[search_tool])
task2 = Task(description="Write the article", agent=writer)

crew = Crew(agents=[researcher, writer], tasks=[task1, task2])
crew.kickoff()
```

LlamaIndex is the choice when the agent's job is mostly *retrieving and reasoning over your data*; CrewAI when you want predictable, human-like team workflows.

## Part 5: AutoGen and the OpenAI Agents SDK

### AutoGen — event-driven conversational networks

AutoGen (Microsoft Research) treats agent work as an **open-ended chat room**: problems are solved by multiple agents talking until a termination message appears. A common pattern separates concerns — an `AssistantAgent` emits tool calls, and a sandboxed `UserProxyAgent` executes the code and posts results back.

```python
from autogen import AssistantAgent, UserProxyAgent

assistant = AssistantAgent(name="coder", llm_config=llm_config)
user_proxy = UserProxyAgent(
    name="executor",
    code_execution_config={"work_dir": "coding", "use_docker": False},
)
user_proxy.initiate_chat(assistant, message="Plot a chart of TSLA stock.")
```

### OpenAI Agents SDK — code-first primitives

The OpenAI Agents SDK aims for **minimal abstraction**. State lives in ordinary Python variables, not graph tables. Its signature feature is **agent handoffs** — a tool can return another agent to transfer the session. The `@function_tool` decorator turns a Python function into a tool, using strict schemas for guaranteed argument shape.

```python
from openai_agents import Agent, function_tool

@function_tool
def process_refund(item_id: str) -> str:
    return f"Refund processed for {item_id}"

@function_tool
def escalate_to_billing() -> Agent:
    return billing_agent  # native handoff

support_agent = Agent(
    name="Support",
    instructions="Help customers. Escalate if billing related.",
    tools=[escalate_to_billing, process_refund],
)
```

AutoGen suits exploratory multi-agent debate; the OpenAI Agents SDK suits developers who want the loop to read like plain code.

## Practice

### Exercise 1: Read the Paradigm

For each of the six code snippets above, answer in one line: where does **state** live, and how does the framework decide to **run a tool**?

### Exercise 2: Match Framework to Problem

Pick the most natural framework for each task and justify it: (a) a linear "summarize then translate" pipeline, (b) a research agent that retries failed searches, (c) a Q&A agent over a PDF library, (d) a writer/editor team.

### Exercise 3: Same Agent, Two Frameworks

Take the weather agent from the *Provider-native function calling* topic and sketch it in two of these frameworks. Note what each one writes for you versus what you wrote by hand from scratch.

## Mini Project

Build the **same small tool-using agent twice** — once from scratch (your Stage 09 loop) and once in a framework of your choice. Then write a one-page comparison covering:

- lines of code and how much the framework hid
- how tool calls and results are wired
- how you would inspect a failed run in each

This is the "build it twice" exercise from the stage goal — it makes the framework's value (and cost) concrete.

## Exit Criteria

You understand this topic when you can:

- Explain what a framework adds over a from-scratch loop.
- Name the core paradigm and state model of all six frameworks.
- Identify a framework from a short code snippet.
- Recommend a framework for a given problem shape and defend the choice.

## Resources

- [roadmap.sh: AI Agents Roadmap](https://roadmap.sh/ai-agents)
- [Anthropic: Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)
- [LangChain Docs](https://python.langchain.com/docs/introduction/)
- [LangGraph Docs](https://langchain-ai.github.io/langgraph/)
- [LlamaIndex Docs](https://docs.llamaindex.ai/)
- [CrewAI Docs](https://docs.crewai.com/)
- [AutoGen Docs](https://microsoft.github.io/autogen/)
- [OpenAI Agents SDK](https://openai.github.io/openai-agents-python/)

</div>

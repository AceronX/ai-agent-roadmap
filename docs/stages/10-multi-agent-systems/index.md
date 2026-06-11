# 10 Multi-Agent Systems

**Phase 3 - Systems**  
Stage 10 of 14. Previous: [Stage 9 - Building Agents](../09-building-agents/index.md). Next: [Stage 11 - Evaluation and Observability](../11-evaluation-observability/index.md).

## Goal

Learn when and how to coordinate multiple agents without adding unnecessary complexity.

## Learn

- [Supervisor-worker pattern](supervisor-worker-pattern/index.md)
- [Handoffs](handoffs/index.md)
- [Agents as tools](agents-as-tools/index.md)
- [Shared state vs message passing](shared-state-vs-message-passing/index.md)
- [A2A protocol](a2a-protocol/index.md)
- [Coordination failure modes](coordination-failure-modes/index.md)
- [How to tell when one agent is enough](when-one-agent-is-enough/index.md)

## Start Here

Multi-agent systems are easier to understand if you think of them like a small workplace. Instead of one person doing everything, different specialists collaborate around one larger goal.

| Concept | Simple Meaning | Workplace Analogy |
| --- | --- | --- |
| Supervisor-worker pattern | One main agent manages specialist agents | A manager assigns work to a team |
| Handoffs | One agent transfers control to another | Front desk transfers a call to billing |
| Agents as tools | One agent calls another agent for a result | A writer asks a researcher for notes |
| Shared state vs message passing | Agents share information through a common place or direct messages | Shared document vs email chain |

Beginner rule:

```text
Do not add multiple agents just because you can.
Add multiple agents when roles, ownership, or information flow become easier to control.
```

## Build

Build a small agent team with a planner, researcher, writer, and reviewer. Measure whether the team improves results compared with one agent.

## Exit Criteria

- You can explain MCP as agent-to-tool communication and A2A as agent-to-agent communication.
- You can identify when a multi-agent system is unnecessary.
- You can design handoffs with clear responsibilities.
- You can distinguish supervisor-worker, handoffs, and agents-as-tools.
- You can choose between shared state and message passing for a simple workflow.

## Checkpoint

Use the [Stage 10 checkpoint](checkpoint.md) before moving on.

# Tool Sandboxing and Permissions

## Goal

Learn how to keep an AI agent inside a safe operating area where it can only run approved actions against approved resources.

## What It Means

Tool sandboxing keeps the AI agent inside a safe zone. The agent can only run approved actions and cannot freely touch the wider system. Permissioning sets clear rules for which files, networks, commands, records, tools, and environments the agent may use.

Together, sandboxing and permissioning reduce errors, leaks, and abuse by limiting what the agent can reach and do.

```text
Sandbox:
  The agent can work inside /workspace/project only.

Permission rule:
  The agent can read source files and write patches,
  but cannot read secrets, access production, or delete files.
```

## Permission Design

Grant the smallest useful set of rights:

| Boundary | Questions to Ask |
| --- | --- |
| Filesystem | Which folders can the agent read or write? Are secrets excluded? |
| Network | Which hosts, APIs, or domains can the agent call? |
| Commands | Which commands are allowed, denied, or approval-gated? |
| Tools | Which tool actions are read-only, write, or destructive? |
| Data | Which users, tenants, tickets, or records are in scope? |
| Time and cost | How many steps, retries, tokens, or dollars can one task use? |
| Human approval | Which actions require a fresh permit? |

## Sandbox Patterns

| Pattern | Use |
| --- | --- |
| Read-only mode | Research, summarization, inspection, triage |
| Workspace-only writes | Code edits, document drafts, local reports |
| Network allowlist | Calls only approved APIs or documentation sites |
| Command allowlist | Run tests or formatters, block dangerous commands |
| Ephemeral environment | Throw away the sandbox after the task |
| Separate credentials | Use low-privilege credentials created for the agent |
| Audit logging | Record tool calls, arguments, outputs, approvals, and denials |

## Fresh Permission Rule

If an agent needs new access, it should ask for a fresh permit. The request should explain:

- what access is needed,
- why the current task needs it,
- what resource will be touched,
- what the risk is,
- whether the action is reversible,
- how the action will be logged.

## Red-Team Tests

Try tests like:

- Ask the agent to read a file outside the allowed workspace.
- Ask it to call an unapproved domain.
- Ask it to run a command that deletes, deploys, or changes permissions.
- Hide a tool-use instruction inside a document.
- Test whether denied actions are logged clearly.

## Example Scenario

**Situation:** A coding agent is asked to update a project file. While investigating, it tries to read `/home/user/.ssh/id_rsa` and then run a command that uploads diagnostics to an external URL.

**What can go wrong:** Without sandboxing, the agent can reach secrets and network destinations unrelated to the task. A normal debugging workflow can become a credential leak.

**Safer design:** Restrict file access to the project workspace, block secret paths, allow network calls only to approved domains, and require approval for commands that upload data or change permissions.

**Explanation:** Sandboxing is a practical fence. It assumes the agent may make mistakes or be influenced by malicious input, then limits what those mistakes can touch.

## Resources

- [AI Sandbox | Harvard University Information Technology](https://www.huit.harvard.edu/ai-sandbox)
- [Sandboxes for AI - The Datasphere Initiative](https://www.thedatasphere.org/datasphere-publish/sandboxes-for-ai/)
- [Sandboxes for AI report](https://www.thedatasphere.org/wp-content/uploads/2025/02/Report-Sandboxes-for-AI-2025.pdf)
- [roadmap.sh AI Agents](https://roadmap.sh/ai-agents)

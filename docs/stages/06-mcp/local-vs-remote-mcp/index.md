# Local vs Remote MCP

## Goal

Understand the difference between local and remote MCP servers, when to use
each deployment mode, and what tradeoffs they create for security, latency,
sharing, operations, and agent design.

## Why It Matters

MCP connects AI applications to tools, resources, and prompts. Those MCP servers
can run locally on the same machine as the host application, or remotely as a
network service.

The deployment choice changes how the agent behaves:

- Local MCP is usually easier for personal tools, files, and development.
- Remote MCP is usually better for shared services, hosted APIs, and team-wide
  integrations.
- Local MCP often has a smaller network surface, but can access sensitive local
  files or processes.
- Remote MCP is easier to share, but needs stronger authentication,
  authorization, monitoring, and network security.

Choosing local or remote is not only an infrastructure decision. It affects what
the agent can access, who can use the tool, how failures are handled, and what
security boundaries must exist.

## Study Notes

### Core Idea

MCP follows a host-client-server architecture.

```text
MCP host
  creates
MCP client
  connects to
MCP server
  exposes
tools, resources, and prompts
```

A host is the AI application the user interacts with. A client is the
protocol-level connection from that host to one server. A server is the program
that exposes capabilities such as tools, resources, or prompts.

The server can run in two broad places:

| Mode | Where the MCP server runs | Common transport |
| --- | --- | --- |
| Local MCP | On the user's machine or inside the same development environment | `stdio` |
| Remote MCP | On another machine, cloud service, or hosted platform | Streamable HTTP |

The word "server" can be confusing. An MCP server is not always a remote web
server. A local command-line program launched by the host can also be an MCP
server.

### Local MCP

A local MCP server runs on the same machine or local environment as the host
application. In many local setups, the host launches the MCP server as a child
process and communicates with it over standard input and output.

Example:

```text
Claude Desktop or an IDE
  launches
local filesystem MCP server
  reads
project files on the same machine
```

Local MCP is useful when the tool needs access to local context:

- project files
- local databases
- developer scripts
- local command-line tools
- private notes
- desktop workflows
- experiments and prototypes

Local MCP is often the simplest way to build and test an MCP server because the
developer controls the machine, process, logs, and permissions.

### Remote MCP

A remote MCP server runs as a network service. The host connects to it over a
transport such as Streamable HTTP.

Example:

```text
AI application
  connects over HTTPS
hosted Sentry MCP server
  exposes
issues, traces, and project data
```

Remote MCP is useful when the tool should be shared or hosted:

- team-wide SaaS integrations
- cloud databases
- hosted internal APIs
- production observability systems
- customer support platforms
- enterprise knowledge systems
- services used by many clients

Remote MCP makes the server easier to reuse across users and environments, but
it also introduces network, authentication, authorization, deployment, scaling,
and monitoring concerns.

### Local vs Remote at a Glance

| Question | Local MCP | Remote MCP |
| --- | --- | --- |
| Where does it run? | Same machine or local environment | Network service or hosted platform |
| Common transport | `stdio` | Streamable HTTP |
| Best for | Personal tools, local files, development | Shared services, SaaS, team tools |
| Setup | Install and configure locally | Deploy and expose an endpoint |
| Sharing | Harder to share across users | Easier to share across users |
| Latency | Usually low | Depends on network and service |
| Authentication | Often local process or host controlled | Required for real deployments |
| Scaling | One user or one host at a time | Many clients and users |
| Main risk | Sensitive local access | Exposed network service |
| Operations | User or developer manages it | Service owner manages it |

Neither mode is always better. The right choice depends on the tool, user,
data sensitivity, deployment environment, and expected usage pattern.

### Transport Difference

MCP currently defines standard transports for client-server communication.

For local MCP, `stdio` is common:

```text
Host launches server process
Host writes MCP messages to stdin
Server writes MCP messages to stdout
```

This works well for local tools because the host can start and stop the server
process directly.

For remote MCP, Streamable HTTP is common:

```text
Host connects to https://example.com/mcp
Client sends MCP messages over HTTP
Server handles one or more remote clients
```

This works well for hosted services because the server can run independently and
serve multiple clients.

### Security Boundaries

Local and remote MCP have different security concerns.

Local MCP can be dangerous because it may access local files, environment
variables, shell commands, or private developer resources. The server may not be
exposed to the internet, but it can still do sensitive things on the user's
machine.

Remote MCP can be dangerous because it is reachable over a network. A remote
server needs stronger controls around identity, authorization, rate limits,
tenant isolation, logging, and request validation.

| Risk | Local MCP control | Remote MCP control |
| --- | --- | --- |
| Local file exposure | Limit roots and file permissions | Avoid exposing local files remotely |
| Unsafe commands | Restrict tools and require approval | Avoid arbitrary command tools |
| Unauthorized users | Host-level approval and local config | Authentication and authorization |
| Network attacks | Bind local servers to localhost | Validate origins, use HTTPS, auth |
| Data leakage | Keep outputs minimal | Enforce tenant and permission boundaries |
| Abuse or runaway usage | Local limits | Rate limits, quotas, monitoring |

A good MCP design assumes that tool access is powerful. The host should expose
only the tools and resources the agent actually needs.

### When to Use Local MCP

Use local MCP when:

- the server needs local files or local tools
- the user is the main operator
- the integration is personal or developer-focused
- the server should not be exposed over the network
- the tool is still experimental
- setup simplicity matters more than central management

Example:

```text
Task:
Let a code assistant inspect a local repository and run safe test commands.

Better fit:
Local MCP.

Why:
The needed context lives on the developer's machine, and exposing that file
system as a remote service would add unnecessary risk.
```

### When to Use Remote MCP

Use remote MCP when:

- many users need the same server
- the tool connects to a hosted service
- the data already lives in the cloud
- centralized authentication is required
- the server needs monitoring and uptime guarantees
- the organization wants one managed integration

Example:

```text
Task:
Let many team members ask an AI assistant about production incidents in Sentry.

Better fit:
Remote MCP.

Why:
The data already lives in a hosted service, multiple users need access, and the
organization can centralize authentication, authorization, and logging.
```

### Hybrid Setups

Real systems can use both local and remote MCP servers.

Example:

```text
IDE host
  connects to local filesystem MCP server
  connects to remote issue tracker MCP server
  connects to remote observability MCP server
```

This is common for developer agents. The local server gives access to the code
workspace, while remote servers provide issue, deployment, or monitoring data.

Hybrid setups are powerful, but they require careful boundaries. A remote tool
should not automatically gain access to local files. A local tool should not
send private code or secrets to a remote service unless the user and policy
allow it.

### Common Failure Modes

| Failure mode | What happens | How to reduce it |
| --- | --- | --- |
| Treating every server as remote | Adds unnecessary deployment and network risk | Use local MCP for local-only tools |
| Treating local as automatically safe | Local server can still access sensitive files or commands | Restrict tools, roots, and approvals |
| No authentication on remote MCP | Anyone who reaches the endpoint may use tools | Require auth and authorization |
| Exposing localhost incorrectly | Local server listens on public interfaces | Bind local services to `127.0.0.1` |
| Too much context shared | Agent or server sees more data than needed | Scope resources and return minimal results |
| No logs for remote tools | Failures and misuse are hard to investigate | Add logging, audit trails, and monitoring |
| No timeout or rate limit | Remote server can be overloaded or abused | Add timeouts, quotas, and rate limits |

## Practice

Pick three tools and decide whether each should be local, remote, or hybrid.

Use this table:

| Tool | Best mode | Why | Main risk | Control |
| --- | --- | --- | --- | --- |
| Read local project files |  |  |  |  |
| Query production incidents |  |  |  |  |
| Search personal notes |  |  |  |  |

Then write one paragraph explaining your choices.

### Mini Exercise

Design an MCP setup for a coding assistant.

Requirements:

- It must read the current repository.
- It must run safe tests.
- It must look up issues from a hosted issue tracker.
- It must not expose local files to remote services by default.

Answer:

1. Which MCP servers are local?
2. Which MCP servers are remote?
3. Which transport would each likely use?
4. What requires user approval?
5. What should be logged?

## Resources

- [MCP Architecture Overview](https://modelcontextprotocol.io/docs/concepts/architecture)
- [MCP Transports](https://modelcontextprotocol.io/docs/concepts/transports)
- [MCP Specification: Architecture](https://modelcontextprotocol.io/specification/2025-06-18/architecture)
- [MCP Client Concepts](https://modelcontextprotocol.io/docs/learn/client-concepts)

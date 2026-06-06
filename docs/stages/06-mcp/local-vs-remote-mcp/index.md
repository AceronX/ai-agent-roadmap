# Local vs Remote MCP

<div class="topic-page" markdown="1">

<section class="topic-hero">
  <span class="topic-hero__eyebrow">Stage 06 - Model Context Protocol</span>
  <p class="topic-hero__lead">Local and remote MCP servers solve different connection problems. Local MCP gives an AI assistant controlled access to files, tools, scripts, and data near the user. Remote MCP exposes shared services over the network for teams, SaaS tools, production systems, and hosted data.</p>
  <div class="topic-hero__facts">
    <span>Local MCP</span>
    <span>Remote MCP</span>
    <span>stdio</span>
    <span>HTTP</span>
    <span>Boundaries</span>
  </div>
</section>

## Goal

Understand the difference between local and remote MCP servers, when to use
each deployment mode, and what tradeoffs they create for security, latency,
sharing, operations, and agent design.

After this topic, you should be able to choose whether an MCP server should run
locally, remotely, or as part of a hybrid setup.

## Local vs Remote in One Minute

MCP connects AI applications to tools, resources, and prompts. Those MCP servers
can run locally on the same machine as the host application, or remotely as a
network service.

The short version:

```text
Local MCP  = best when the assistant needs local context or local actions.
Remote MCP = best when the assistant needs shared hosted systems.
Hybrid MCP = common when an agent needs both.
```

Example:

```text
Coding assistant
  -> local filesystem MCP server for the current repository
  -> local git MCP server for the working tree
  -> remote issue tracker MCP server for team issues
  -> remote observability MCP server for production incidents
```

The deployment choice changes what the agent can access, who can use the tool,
how failures are handled, and what security boundaries must exist.

## Learning Path

This topic is designed in four parts.

<div class="learning-grid learning-grid--path">
  <a class="learning-card" href="#part-1-understand-the-deployment-choice">
    <strong>Part 1 - The Deployment Choice</strong>
    <span>Learn what local and remote MCP mean and how transports differ.</span>
  </a>
  <a class="learning-card" href="#part-2-understand-local-mcp">
    <strong>Part 2 - Local MCP</strong>
    <span>See what local MCP can do with files, repos, tests, notes, memory, and local data.</span>
  </a>
  <a class="learning-card" href="#part-3-understand-remote-mcp">
    <strong>Part 3 - Remote MCP</strong>
    <span>See how remote MCP supports shared services, hosted tools, production systems, and team workflows.</span>
  </a>
  <a class="learning-card" href="#part-4-choose-the-right-mode">
    <strong>Part 4 - Choose the Right Mode</strong>
    <span>Compare tradeoffs, security boundaries, hybrid setups, failure modes, and practice decisions.</span>
  </a>
</div>

## Part 1: Understand the Deployment Choice

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

### Why This Matters

Local MCP and remote MCP create different risk and operating models.

- Local MCP is usually easier for personal tools, files, and development.
- Remote MCP is usually better for shared services, hosted APIs, and team-wide
  integrations.
- Local MCP often has a smaller network surface, but can access sensitive local
  files or processes.
- Remote MCP is easier to share, but needs stronger authentication,
  authorization, monitoring, and network security.

Choosing local or remote is not only an infrastructure decision. It affects what
the agent can access and what controls the application must enforce.

### Transport Difference

MCP defines standard transports for client-server communication.

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

## Part 2: Understand Local MCP

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

### What You Can Do With Local MCP

Local MCP is not only "MCP running on your computer." It is a way to give an AI
assistant controlled access to local context and local actions that a remote
service should not automatically see.

Common local MCP use cases:

| Local MCP server | What it lets the agent do | Example user request |
| --- | --- | --- |
| Filesystem | Read, search, and sometimes write files inside allowed folders | `Summarize the README and find TODO comments in this repo.` |
| Git | Inspect repository status, commits, diffs, branches, and history | `Explain what changed in my last commit.` |
| Local test runner | Run safe project test commands | `Run the parser tests and explain the failure.` |
| Local SQLite or dev database | Query local development data | `Show the 10 newest failed jobs in my local dev DB.` |
| Memory | Store and retrieve user or project facts locally | `Remember that this project uses MkDocs Material.` |
| Time | Convert time zones and calculate local times | `Schedule this for 9 AM Tokyo time.` |
| Fetch | Fetch and convert web content for local analysis | `Read this docs page and compare it with my local implementation.` |

These tools are useful because the assistant can work with the same context the
developer sees: files, scripts, test output, notes, and local databases.

### Local Workflow Examples

#### Local Repository Assistant

```text
Goal:
Explain why a test is failing.

Local MCP servers:
- filesystem server scoped to the repository
- git server scoped to the repository
- test runner server with approved commands only

Agent flow:
1. Read the failing test output.
2. Search relevant source files.
3. Inspect the recent git diff.
4. Run a targeted test.
5. Explain the likely cause and suggested fix.
```

This is a good local MCP use case because the key evidence is local: the working
tree, the test suite, and uncommitted changes.

#### Personal Knowledge Assistant

```text
Goal:
Find notes about refund policy and draft a short answer.

Local MCP servers:
- filesystem server scoped to a notes folder
- memory server for durable personal preferences

Agent flow:
1. Search local notes for refund policy.
2. Read only matching files.
3. Retrieve the user's preferred answer style from memory.
4. Draft the response.
```

This is a good local MCP use case because the data is personal and does not need
to live in a remote shared service.

#### Local Data Analysis

```text
Goal:
Summarize failed background jobs from a local SQLite database.

Local MCP servers:
- SQLite or database server connected to the local dev database
- filesystem server for reading related logs

Agent flow:
1. Query recent failed jobs.
2. Group failures by error type.
3. Read related local log files.
4. Produce a short diagnosis.
```

This is useful when the database is a developer copy, fixture database, or local
debugging environment.

#### Desktop Automation

```text
Goal:
Organize downloaded invoices into the right local folders.

Local MCP servers:
- filesystem server scoped to Downloads and an invoices folder
- optional local OCR or document parser server

Agent flow:
1. List recent PDF files in Downloads.
2. Extract vendor and date.
3. Propose target filenames.
4. Ask for approval before moving files.
5. Move approved files.
```

This kind of workflow should stay local unless there is a strong reason to send
the documents to a remote service.

### Local Configuration Examples

Many local MCP servers are launched by the host using a command. A local
filesystem server might be configured with an allowed directory:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "/path/to/allowed/project"
      ]
    }
  }
}
```

The important part is the allowed path. The server should not receive access to
the entire machine when the agent only needs one project directory.

Another local example is a Git server scoped to a repository:

```json
{
  "mcpServers": {
    "git": {
      "command": "uvx",
      "args": ["mcp-server-git", "--repository", "/path/to/repo"]
    }
  }
}
```

This gives the assistant repository context without exposing unrelated folders.

### Local MCP Safety Checklist

Local MCP can touch sensitive files and processes. Treat it as local automation,
not as a harmless chat feature.

Before enabling a local MCP server, ask:

- Which directory, database, or command does this server access?
- Can it write, delete, move, send, or execute anything?
- Does it need the whole filesystem or only one folder?
- Does it expose secrets from `.env`, shell history, SSH keys, or config files?
- Should write actions require explicit user approval?
- What logs show which tools were called and with what arguments?
- Can the server be stopped easily if it behaves unexpectedly?

Good local MCP design starts narrow. Add access only when a real workflow needs
it.

## Part 3: Understand Remote MCP

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

### What You Can Do With Remote MCP

Remote MCP is useful when the assistant needs a shared service instead of local
machine context. The server runs independently, usually behind HTTPS, and many
hosts or users can connect to the same integration.

Common remote MCP use cases:

| Remote MCP server | What it lets the agent do | Example user request |
| --- | --- | --- |
| Issue tracker | Search, summarize, and update shared issues | `Summarize the highest-priority bugs opened this week.` |
| Observability | Inspect incidents, traces, logs, and alerts | `Find the service causing the latest checkout incident.` |
| Company knowledge base | Search shared docs, policies, and runbooks | `Find the escalation policy for enterprise support.` |
| CRM or support platform | Read customer records and support history | `Summarize this customer's last three support cases.` |
| Hosted database | Query approved business metrics | `Show active trials by region for this week.` |
| Git hosting platform | Read pull requests, issues, branches, and reviews | `Summarize open PRs waiting for review.` |
| Messaging platform | Read channels or draft messages with approval | `Draft a status update for the incident channel.` |

Remote MCP is valuable when the source of truth already lives outside the
developer's machine and multiple users need the same controlled integration.

### Remote Workflow Examples

#### Production Incident Assistant

```text
Goal:
Explain what caused the latest checkout incident.

Remote MCP servers:
- observability server for incidents, traces, and logs
- issue tracker server for related bug reports
- knowledge base server for runbooks

Agent flow:
1. Read the active incident.
2. Inspect related traces and error groups.
3. Search runbooks for the affected service.
4. Find linked issues or deployments.
5. Produce a short incident summary with evidence.
```

This is a good remote MCP use case because the data is hosted, shared, and
operational. The server should enforce authentication, authorization, rate
limits, and audit logging.

#### Customer Support Assistant

```text
Goal:
Summarize a customer's current account state and open support cases.

Remote MCP servers:
- CRM server for account records
- support platform server for tickets
- knowledge base server for product policies

Agent flow:
1. Retrieve the customer's account record.
2. Search open support cases.
3. Find relevant policy or troubleshooting docs.
4. Draft a support summary.
5. Ask for approval before sending any message.
```

This is a good remote MCP use case because support agents need shared customer
systems, not one user's local files. The main risk is exposing customer data to
the wrong user or tenant.

#### Team Knowledge Assistant

```text
Goal:
Find the approved deployment checklist for mobile releases.

Remote MCP servers:
- company docs server
- release management server

Agent flow:
1. Search the shared docs index.
2. Filter to approved or current documents.
3. Read the deployment checklist.
4. Check release status if needed.
5. Return the checklist with links.
```

This is a better remote MCP fit than local MCP because the knowledge base should
be consistent across the team and centrally maintained.

#### Remote Git Hosting Assistant

```text
Goal:
Summarize open pull requests for the backend team.

Remote MCP servers:
- Git hosting server
- issue tracker server

Agent flow:
1. List open pull requests for the backend repository.
2. Filter by team label or branch convention.
3. Read review status and linked issues.
4. Group PRs by blocked, ready for review, and ready to merge.
5. Produce a team summary.
```

This is different from a local Git MCP server. Local Git is best for the current
working tree. Remote Git hosting is best for shared PRs, reviews, issues, and
repository metadata.

### Remote Configuration Example

A remote MCP server is usually configured as a network endpoint instead of a
local command.

```json
{
  "mcpServers": {
    "company-docs": {
      "url": "https://mcp.example.com/docs"
    }
  }
}
```

Real deployments should include authentication and authorization. The exact
configuration depends on the host, but the design should answer:

- Which users can connect?
- Which tools can each user call?
- Which resources can each user read?
- How are tokens or credentials stored?
- What gets logged for audit and debugging?

For example, a remote issue tracker MCP server might expose only issue-reading
tools to most users, while requiring additional permissions for status changes
or comments.

### Remote MCP Safety Checklist

Before exposing a remote MCP server, ask:

- Is the server reachable only over HTTPS?
- How does the server authenticate users or clients?
- Does authorization check the user's real permissions in the backing system?
- Is tenant or workspace isolation enforced?
- Are tool calls logged with user, time, arguments, and result summary?
- Are rate limits and timeouts configured?
- Are write actions separated from read-only tools?
- Do high-impact actions require confirmation?
- Can credentials be rotated without redeploying every client?
- Does the server return only the minimum data the agent needs?

Remote MCP should be treated like an API surface. A valid MCP request still
needs identity, policy, and operational controls.

## Part 4: Choose the Right Mode

Neither local nor remote MCP is always better. The right choice depends on the
tool, user, data sensitivity, deployment environment, and expected usage
pattern.

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
| Local server has too much access | Agent can read or change unrelated files | Use allowed directories and least privilege |
| Local command tool is too broad | Agent can run unsafe shell commands | Expose narrow commands, not arbitrary shell |

## Practice

Pick three tools and decide whether each should be local, remote, or hybrid.

Use this table:

| Tool | Best mode | Why | Main risk | Control |
| --- | --- | --- | --- | --- |
| Read local project files |  |  |  |  |
| Query production incidents |  |  |  |  |
| Search personal notes |  |  |  |  |
| Run local unit tests |  |  |  |  |
| Query a local SQLite database |  |  |  |  |
| Search a shared company knowledge base |  |  |  |  |

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

### Local MCP Exercise

Design a local MCP setup for your own computer.

Choose one workflow:

- code assistant for one repository
- personal notes assistant
- local database analyst
- desktop file organizer

Write:

1. Which local MCP servers are needed.
2. Which folders or databases each server can access.
3. Which tools are read-only.
4. Which tools can write or execute.
5. Which actions require approval.
6. Which files or secrets must be blocked.
7. What a successful agent run should look like.

### Remote MCP Exercise

Design a remote MCP setup for a team assistant.

Choose one workflow:

- production incident assistant
- customer support assistant
- team knowledge assistant
- remote Git hosting assistant

Write:

1. Which remote MCP servers are needed.
2. Which users or teams can connect.
3. Which tools are read-only.
4. Which tools can write or send messages.
5. Which actions require approval.
6. What should be logged for audit.
7. What rate limits, timeouts, or quotas are needed.

## Exit Criteria

You understand this topic when you can:

- Explain local MCP and remote MCP in plain language.
- Identify which transport is common for local and remote servers.
- Give concrete examples of what local MCP can do.
- Give concrete examples of what remote MCP can do.
- Choose local, remote, or hybrid for a tool workflow.
- Explain why local MCP still needs safety boundaries.
- Explain why remote MCP needs authentication, authorization, logging, and rate
  limits.

## Resources

- [MCP Architecture Overview](https://modelcontextprotocol.io/docs/concepts/architecture)
- [MCP Transports](https://modelcontextprotocol.io/docs/concepts/transports)
- [MCP Specification: Architecture](https://modelcontextprotocol.io/specification/2025-06-18/architecture)
- [MCP Client Concepts](https://modelcontextprotocol.io/docs/learn/client-concepts)
- [MCP Example Servers](https://modelcontextprotocol.io/examples)
- [Model Context Protocol Servers Repository](https://github.com/modelcontextprotocol/servers)

</div>

# Junior Interview: MCP

Friendly, entry-level questions for people who are still learning MCP. They check whether the **foundations** are there — not production experience. Each question lists what a good answer covers, one **model answer** (a complete correct example), and a hint the interviewer can give if the candidate is stuck.

!!! note "How to use this page"
    This is a conversation, not a memory test. Plain-language answers and good analogies count. The model answer is one correct way to answer — accept any response that hits the same ideas. If someone freezes, give the hint and let them reason it out. See the [Senior Interview](../interview/index.md) for experienced candidates and the [QAs](../test/index.md) for self-study.

## 1. In plain words, what problem does MCP solve?

**Good answer covers:** AI apps often need things outside the model — files, GitHub, a database, logs. MCP is a **standard way to connect** an AI app to those systems, instead of building a custom connector for each one.

**Model answer:** "MCP is a standard way for an AI app to connect to outside tools and data — like files, GitHub, or a database — so each app doesn't need a custom connector for every system."

**Hint if stuck:** Think about how an AI app reaches tools and data that aren't inside the model.

## 2. What are the three main roles in MCP, and what does each do?

**Good answer covers:** **Host** = the AI app you open (owns the model and the user). **Client** = a connector inside the host, one per server. **Server** = the program that exposes a menu of capabilities for one outside system.

**Model answer:** "The host is the AI app the user opens, and it owns the model. The client is a connector inside the host, one per server. The server is a program that exposes capabilities for one outside system. (Like a restaurant: you and your companion order through a waiter from a kitchen.)"

**Hint if stuck:** Host, client, server — which one talks to the user, which one connects out, which one wraps the outside system?

## 3. Does the MCP server contain the AI model?

**Good answer covers:** No. The **host owns the model**. The server only exposes capabilities (tools, resources, prompts); the client talks to the server, not to the model.

**Model answer:** "No. The host owns the model. The server only exposes capabilities, and the client talks to the server, not to the model."

**Hint if stuck:** Where does the LLM live — in the app, or in the server you connect to?

## 4. What's the difference between a tool and a resource? Give an example of each.

**Good answer covers:** A **tool** *does* something (an action, may change things). A **resource** is *read-only* data the app can look at.

**Model answer:** "A tool performs an action and can change things, like `send_email(...)`. A resource is read-only data the app can look at, like the contents of a `README.md` file."

**Hint if stuck:** One *changes* something, the other only *reads* something — which is which?

## 5. What is a prompt in MCP?

**Good answer covers:** A **reusable instruction template** the server offers, usually started by the user (like a slash command). It's not data and it doesn't act — it's a proven way to ask for something.

**Model answer:** "A prompt is a reusable instruction template the server offers, usually started by the user — for example a `/review-pr` prompt that guides the assistant through a code review."

**Hint if stuck:** Think of a saved, reusable instruction you could pick from a menu.

## 6. Why might the app ask you to confirm before it sends an email or deletes a file?

**Good answer covers:** Those are **write or destructive** actions — they affect the real world and can be hard to undo. The host gates risky actions with approval, even if the server offers the tool. Reads can usually run freely.

**Model answer:** "Because sending or deleting are write or destructive actions that affect the real world and can be hard to undo, so the host asks for approval first. Read-only actions can usually run without asking."

**Hint if stuck:** Which actions can't be undone, and who should decide before they happen?

## 7. What's the basic difference between local and remote MCP, and when would you use each?

**Good answer covers:** **Local** = the server runs on your own machine (great for your files and quick testing; private). **Remote** = the server runs on the network as a shared service (great for team tools and hosted data; needs login and security).

**Model answer:** "Local MCP runs the server on your own machine — good for your files and quick testing, and private. Remote MCP runs the server as a shared network service — good for team tools and hosted data, but it needs authentication and security. Use local for personal or dev work and remote for shared services."

**Hint if stuck:** Where does the server run — your laptop, or somewhere on the network — and who needs to use it?

## 8. What is "discovery" in MCP?

**Good answer covers:** After connecting, the client asks the server **what it can do** — its tools, resources, and prompts. The host doesn't have to hardcode the list; it *asks*.

**Model answer:** "Discovery is when the client asks the server what it offers — its tools, resources, and prompts — right after connecting, so the host doesn't have to hardcode the list. It's like reading the menu before ordering."

**Hint if stuck:** How does the app find out what a server offers without being told in advance?

## A light warm-up task

> In plain language, describe an MCP setup for a **personal assistant** that can read your calendar and send messages.

Ask the candidate to say: what the **host** is, one **server** it connects to, one **tool** and one **resource** that server might offer, and which action should **ask for approval**.

**Good answer covers:** reading the calendar = resource (fine to read), sending a message = tool that should ask first, and the host being the app that coordinates it all.

**Model answer:** "The host is the assistant app. It connects to a calendar server. That server offers a resource to read calendar events and a tool to send a message. Reading the calendar can happen automatically; sending a message should ask for approval first."

## Source material

These build on the Stage 06 basics: [MCP Overview](../mcp-overview/index.md), [Hosts, Clients, and Servers](../mcp-hosts-clients-servers/index.md), and [Tool and Resource Exposure](../tool-and-resource-exposure/index.md).

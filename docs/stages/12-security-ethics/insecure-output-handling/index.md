# Insecure Output Handling

## Goal

Learn why model output must be treated as untrusted data before it reaches browsers, databases, shells, APIs, tools, or business decisions.

## What It Means

Insecure output handling happens when an application trusts an LLM response too much. The model may produce text that looks like HTML, SQL, JSON, Python, shell commands, policy decisions, or tool arguments. If the application passes that output directly into another system, the model can accidentally or maliciously trigger a security bug.

OWASP's 2025 LLM Top 10 calls this risk **Improper Output Handling**.

```text
User asks:
  Create a comment preview.

Model returns:
  <script>stealCookies()</script>

Unsafe app:
  Renders the model output as trusted HTML.

Safer app:
  Escapes the output or renders it as plain text.
```

## Common Failure Paths

| Output Destination | Risk |
| --- | --- |
| Browser HTML | Cross-site scripting if generated markup is rendered unsafely |
| SQL | Injection if generated queries are executed without parameterization |
| Shell | Command execution if generated commands are run directly |
| Code interpreter | Arbitrary code execution if generated code gets broad permissions |
| Tool arguments | Unauthorized actions if arguments are not validated |
| Business logic | Bad approvals, denials, rankings, or risk decisions if the model is treated as final authority |

## Safe Handling Rules

Use these rules by default:

- Treat every model output as untrusted.
- Prefer structured outputs with schemas over free-form text.
- Validate types, ranges, IDs, ownership, and allowed values.
- Use allowlists for actions, files, domains, and commands.
- Escape or encode output based on where it will be used.
- Use parameterized queries instead of model-written SQL strings.
- Never execute generated shell commands without review and scope checks.
- Separate "model recommendation" from "application decision."

## Example: Tool Arguments

Unsafe:

```json
{
  "tool": "send_email",
  "to": "all-customers@example.com",
  "body": "..."
}
```

The model produced valid JSON, but valid JSON is not the same as an allowed action.

Safer checks:

```text
1. Is send_email allowed for this agent?
2. Is this recipient in the approved scope?
3. Is the body free of secrets and policy violations?
4. Is this a draft or a final send?
5. Does this action require human approval?
```

## Red-Team Tests

Try tests like:

- Ask the model to produce HTML that includes script tags.
- Ask it to generate SQL containing multiple statements or comments.
- Ask it to create a shell command with chained operations.
- Ask it to generate tool arguments for a resource outside the user's scope.
- Put a malicious payload in retrieved content and see whether it appears in output.

## Example Scenario

**Situation:** A support dashboard asks the model to create a short customer-note preview. The model returns: `<img src=x onerror=fetch('/admin/secrets')>`.

**What can go wrong:** If the dashboard renders the model output as trusted HTML, the browser may execute attacker-controlled code. The model output becomes a cross-site scripting path even though the model only returned text.

**Safer design:** Render model text as plain text by default. If HTML is truly needed, sanitize it with an allowlist, strip scripts and event handlers, and keep authentication tokens protected with normal browser security controls.

**Explanation:** Valid model output is not automatically safe output. Any system that consumes generated text must validate, encode, or sanitize it according to the destination.

## Resources

- [OWASP 2025 Top 10 Risk and Mitigations for LLMs and Gen AI Apps](https://genai.owasp.org/llm-top-10/)
- [OWASP LLM Top 10 for Large Language Model Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)

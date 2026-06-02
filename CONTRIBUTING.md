# Contributing

Thanks for helping improve the AI Agent Roadmap.

This site is built with MkDocs Material and deployed automatically from the `main` branch. Contributors should update Markdown source files under `docs/`; the generated HTML is created by MkDocs.

## Before You Edit

Work from the latest version of `main`:

```bash
git checkout main
git pull origin main
```

Install the site dependencies if this is your first time:

```bash
pip install -r requirements.txt
```

Run the site locally:

```bash
mkdocs serve
```

Open:

```text
http://127.0.0.1:8000/ai-agent-roadmap/
```

## Stage Directory Rules

Each stage lives under `docs/stages/`.

Use the existing structure:

```text
docs/stages/02-llm-fundamentals/
  index.md
  checkpoint.md
  tokenization/
    index.md
    token-counting.md
    common-mistakes.md
```

Follow these rules:

- Edit Markdown files under `docs/` only.
- Do not edit generated `.html` files.
- Do not add files under `site/`.
- Put broad stage summaries in the stage `index.md`.
- Put focused topic notes in a topic subdirectory, for example `tokenization/index.md`.
- Every topic subdirectory must have a main entry file: `index.md`.
- Put explanations, examples, practice tasks, and resources directly in the topic `index.md` by default.
- Use lowercase folder names with hyphens, not spaces.
- Keep one topic per page.
- Do not create `resources.md` files for stage topics.
- Add extra Markdown files inside a topic folder only when the topic has become too large for one page.
- If a topic folder has extra Markdown files, the topic `index.md` must link to every one of them.

## Large Topic Rule

Start with one file:

```text
docs/stages/02-llm-fundamentals/tokenization/index.md
```

This is enough for most topics. Keep everything in `index.md` while the page is easy to read.

If the page becomes too large, split it into smaller lesson pages:

```text
docs/stages/02-llm-fundamentals/tokenization/
  index.md
  token-counting.md
  tokenizer-tools.md
  common-mistakes.md
```

When you split a topic, `index.md` becomes the topic landing page. It must summarize the topic and link to each extra page:

```markdown
# Tokenization

## Goal

Understand how text becomes tokens and why token counts affect context, cost, and latency.

## Lessons

- [Token Counting](token-counting.md)
- [Tokenizer Tools](tokenizer-tools.md)
- [Common Mistakes](common-mistakes.md)

## Practice

Build a small script that counts tokens for different prompts.

## Resources

- Useful links for this topic
```

Use this rule of thumb:

- Under about 1,500 words: keep one `index.md`.
- Over about 1,500-2,000 words: consider splitting.
- If the page contains several separate lessons, examples, or exercises: split into linked sub-pages.

Do not split just to create more files. Split only when it makes the topic easier to read.

## Making New Pages Discoverable

MkDocs will build Markdown files under `docs/`, but contributors must link new pages so readers can find them.

When you add a topic page:

1. Add the file under the correct stage directory.
2. Name the main content file `index.md`.
3. Link it from that stage's `index.md` under the `Learn` section.
4. Run a strict build before pushing.

Example:

```markdown
## Learn

- [Tokenization](tokenization/index.md)
- [Context Windows](context-windows/index.md)
```

Only add pages to `mkdocs.yml` when they should appear in the main top-level navigation. Most topic pages should stay linked from their stage page instead.

Important: MkDocs can build a new Markdown file even if nobody links to it. That is not enough for this project. If users should find a page from the live site, link it from the nearest parent `index.md`.

For extra files inside a topic folder, the nearest parent is the topic `index.md`.

## Page Style

Keep pages simple, direct, and useful.

For stage pages, use this shape:

```markdown
# 02 LLM Fundamentals

**Phase 1 - Foundations**  
Stage 2 of 14. Previous: [...](...). Next: [...](...).

## Goal

One short paragraph.

## Learn

- Linked topic
- Linked topic

## Build

One practical task.

## Exit Criteria

- Measurable outcome
- Measurable outcome

## Checkpoint

Use the [Stage checkpoint](checkpoint.md) before moving on.
```

For topic pages, use this shape:

```markdown
# Topic Name

## Goal

One short paragraph.

## Why It Matters

Explain why this topic matters for building agents.

## Study Notes

- Define the topic in plain language.
- Explain common tradeoffs or failure modes.
- Include a small example when useful.

## Practice

Build or inspect one small example.

## Resources

Add useful links directly here.
```

## Content Quality Rules

Good contributions are practical, accurate, and easy to maintain.

- Prefer plain explanations over hype.
- Keep paragraphs short.
- Use examples when they clarify the idea.
- Avoid large pasted articles or copied copyrighted text.
- Add links only when they are useful and relevant.
- Prefer official documentation, canonical papers, maintained projects, and runnable examples.
- Put resource links directly inside the relevant topic `index.md`.
- Explain tradeoffs, not just definitions.
- Keep claims current. If a tool, model, API, or price may have changed, verify it before adding it.

## Links

Use relative links inside the docs.

Good:

```markdown
[Checkpoint](checkpoint.md)
[Tokenization](tokenization/index.md)
[Reference](../../reference/index.md)
```

Avoid absolute local paths such as:

```text
/home/ubuntu/Videos/ai-agent-roadmap/docs/...
```

## Diagrams and Assets

Put shared assets under `docs/assets/`.

Use:

```text
docs/assets/diagrams/
docs/assets/images/
docs/assets/pdfs/
docs/assets/downloads/
```

Keep assets small and relevant. Do not commit generated `site/` output.

## Verify Before Pushing

Always run:

```bash
mkdocs build --strict --clean
```

The build must finish with no warnings or errors.

Then check what you are committing:

```bash
git status
```

You should not see files under `site/`.

## Publishing

After a change is pushed to `main`, GitHub Actions automatically builds and deploys the site.

Check deployment status:

```text
https://github.com/AceronX/ai-agent-roadmap/actions
```

Live site:

```text
https://AceronX.github.io/ai-agent-roadmap/
```

If the GitHub Actions build fails, fix the Markdown or MkDocs warning and push again.

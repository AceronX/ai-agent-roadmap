# AI Agent Roadmap

A central learning path and knowledge database for developers who want to understand, build, evaluate, secure, and deploy AI agents.

This repository is designed as a GitHub Pages documentation website powered by MkDocs Material. It follows the learning workflow of the [roadmap.sh AI Agents roadmap](https://roadmap.sh/ai-agents) and expands it with deeper notes, examples, projects, diagrams, checkpoints, and curated resources.

## Website Structure

- `docs/index.md` - landing page and starting point
- `docs/roadmap.md` - visual roadmap and stage sequence
- `docs/stages/` - staged AI agent learning path
- `docs/reference/` - glossary, resources, and best practices
- `docs/assets/` - diagrams, images, PDFs, and downloads

## Local Development

```bash
pip install -r requirements.txt
mkdocs serve
```

Then open `http://127.0.0.1:8000`.

## Deployment

The site is intended for GitHub Pages:

```text
https://AceronX.github.io/ai-agent-roadmap/
```

Pushes to `main` deploy the MkDocs site through the GitHub Actions workflow in `.github/workflows/deploy.yml`.

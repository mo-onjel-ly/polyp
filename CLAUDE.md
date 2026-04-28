# CLAUDE.md — polyp workstream

## What is a workstream

A **workstream** is a focused, multi-session collaboration between a human and Claude aimed at exploring, iterating on, and eventually delivering a specific product. Unlike a one-off task, a workstream:

- Accumulates context, decisions, and design rationale across sessions
- Maintains a living knowledge base (`kb/`) that both the human and Claude read and write
- Has a product vision that evolves as understanding deepens
- Tracks its own history so any session can pick up exactly where the last left off

This workstream is for **polyp**.

---

## What is polyp

### Current state

A node-based flowchart programming UI — compact, dark, keyboard-driven. Built as a single-file HTML prototype, now wrapped in an Electron desktop app.

The prototype (`renderer/index.html`) is ~2200 lines of self-contained HTML/CSS/JS with no build step. It runs as-is in any modern browser or as the Electron renderer.

### Vision

Polyp is a visual substrate for **domain modeling, context gathering, and agentic workflow engineering**. The long-term goal is a tool that lets a human (or an agent) compose pipelines that:

- **Model domains** — map out entities, relationships, and information flows in any subject area
- **Gather and organize context** — pull from diverse sources (files, APIs, databases, AV streams, agent outputs) and structure it into a queryable graph
- **Connect to context sources** — live feeds: audio/video capture, motion detection, metadata streams, structured data inputs
- **Engineer agent workflows** — design, inspect, and iterate on automated pipelines that use LLMs, computer vision, and other AI to produce real-world value
- **Surface value** — from raw AV and data through to insights, decisions, and actions — in real-world physical contexts (surveillance, manufacturing, logistics) or virtual/information contexts (document workflows, code intelligence, research pipelines)

The graph model (nodes + directed flows) is the core primitive. Every capability is expressed as node types and edges.

### Design philosophy

- **Precision minimalism** — information density over decorative space; every pixel earns its place
- **Industrial/technical aesthetic** — dark, monospace, hairline rules, colour used strictly to encode information (flow identity)
- **Keyboard-first** — vim-style navigation; mouse/touch as peers, not primary
- **Compact but readable** — tight spacing with clear visual hierarchy; no relaxed padding

---

## Repository layout

```
polyp/
├── CLAUDE.md              ← this file
├── main.js                ← Electron main process
├── preload.js             ← contextBridge stub
├── package.json           ← bun, electron@41
├── bun.lock
├── renderer/
│   └── index.html         ← THE APP — single-file HTML/CSS/JS
├── kb/                    ← Obsidian vault (knowledge base)
│   ├── index.md           ← MOC — start here
│   ├── *.md               ← atomic concept/reference/design notes
│   └── .obsidian/         ← Obsidian config (committed)
├── README.md
├── CHANGELOG.md
└── chat-log.md            ← summary of the original Claude.ai conversation
```

### The app file

All UI code lives in `renderer/index.html`. It is intentionally a single file — no bundler, no framework. When editing:
- CSS is at the top (inside `<style>`)
- HTML structure is in `<body>` (topbar, canvas, statusbar)
- JS is at the bottom (one IIFE, `'use strict'`)

Key JS sections (search by comment header):
- `// ---------- state ----------` — the single state object
- `// ---------- view specs ----------` — V1/V2/V3 freeform layout slots
- `// ---------- auto-layout ----------` — layered DAG algorithm
- `// ---------- nodes ----------` — create, render, delete
- `// ---------- flows ----------` — connected-component coloring
- `// ---------- keyboard ----------` — all key handlers

---

## Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Electron 41 |
| Package manager | **bun** (not npm — `bun install`, `bun start`) |
| Renderer | Vanilla HTML/CSS/JS — no framework, no bundler |
| Fonts | JetBrains Mono / IBM Plex Mono (Google Fonts CDN) |
| Node.js | v22 |

**Run:**
```bash
bun start       # open app
bun run dev     # open app + Node inspector on :5858
```

---

## kb/ — knowledge base conventions

The `kb/` directory is an **Obsidian vault**. It is the long-term memory of this workstream — design decisions, product thinking, engineering notes, market research, and feature ideas all live here.

### Reading kb/

Always read `kb/index.md` first in a new session — it is the Map of Content (MOC) and links to everything. Follow `[[WikiLinks]]` to find relevant notes before starting work.

### Note taxonomy

| Tag | Purpose |
|-----|---------|
| `#polyp/concept` | Core UI/system concepts (nodes, edges, flows…) |
| `#polyp/reference` | Quick-reference material (shortcuts, usage) |
| `#polyp/design` | Design decisions, tradeoffs, rationale |
| `#polyp/vision` | Product vision, strategy, workstream direction |
| `#polyp/market` | Market research, related tools, prior art |
| `#polyp/business` | Startup ideas, monetization |
| `#polyp/feature` | Feature ideas and backlog |
| `#polyp/guide` | How-to guides |

### Frontmatter template

Every kb note must have:
```yaml
---
title: Note title
aliases: [alias1, alias2]
tags: [polyp, <taxonomy-tag>]
---
```

### WikiLinks

- Use `[[note-name]]` (no `.md` extension)
- Use `[[note-name|display text]]` for aliases
- Use `[[note-name#heading]]` to link to a specific section
- Favour natural prose links over bare lists of links

### Callouts

Use Obsidian callouts for emphasis:
- `> [!NOTE]` — contextual notes
- `> [!TIP]` — practical tips
- `> [!WARNING]` — gotchas, known issues
- `> [!INFO]` — background context
- `> [!IMPORTANT]` — must-know constraints
- `> [!ABSTRACT]` — summaries
- `> [!QUESTION]` — open questions
- `> [!IDEA]` — feature ideas inline

### When to update kb/

| Event | Update |
|-------|--------|
| New feature added | Update relevant concept note(s); add decision entry to `decisions.md` |
| Design decision made | Entry in `decisions.md` (date + decision + rationale + alternatives) |
| Feature idea surfaces | Entry in `feature-ideas.md` |
| New tool / competitor discovered | Entry in `market.md` |
| Business angle identified | Entry in `business.md` |
| Strong reaction to something | Entry in `reactions.md` |
| MOC note added | Update `index.md` |

---

## Commit conventions

- Commit after every discrete change (feature, refactor, doc update)
- Message format: imperative present tense, ≤72 chars subject, blank line, body if needed
- Always co-author: `Co-Authored-By: Claude Sonnet 4.6 (1M context) <noreply@anthropic.com>`
- Push after every commit (the user wants a rewindable history)
- KB updates get their own commit separate from code changes

---

## Working principles

1. **Read kb/ before starting** — especially `decisions.md` and the relevant concept note for whatever you're changing
2. **Write kb/ after finishing** — every session should leave the KB more complete than it found it
3. **Atomic commits** — one logical change per commit; the user will rewind to specific commits
4. **No orphan code** — if something is added, the relevant kb/ note is updated in the same session
5. **Minimal surface area** — don't add abstractions beyond what the current task requires
6. **The HTML file is the source of truth** — all app logic lives in `renderer/index.html`; keep it that way until there's a compelling reason to split

---
title: Vision
aliases: [workstream, product vision, polyp vision, goals]
tags: [polyp, vision]
---

# Vision

## Workstream definition

A **workstream** is a focused, multi-session collaboration aimed at a single evolving product. It has a KB, a timeline, accumulated design rationale, and a product vision that sharpens over time. This workstream builds **polyp**.

## What polyp is trying to be

A visual substrate for **domain modeling, context gathering, and agentic workflow engineering**.

The core primitive is a **node-based directed graph** (always a DAG). Every capability — data ingestion, transformation, AI inference, output routing — is expressed as a node type connected by edges. The graph is not a diagram of a system that runs elsewhere; it *is* the system.

### Use domains

| Domain | What polyp enables |
|--------|--------------------|
| **Domain modeling** | Map entities, relationships, and information flows for any subject area visually |
| **Context gathering** | Pull from diverse sources and structure the result into a queryable graph |
| **AV pipelines** | Ingest audio/video streams; apply computer vision; route results downstream |
| **Agent workflows** | Design, inspect, and iterate on LLM-driven pipelines that produce real-world actions |
| **Data organization** | Transform and tag structured or unstructured data through composable lenses |
| **Context sources** | Connect to live feeds — motion detection, metadata streams, APIs, file watchers |

### The two contexts

> [!INFO]
> **Real-world physical contexts** — manufacturing floors, retail spaces, building access, logistics, field operations. Cameras + sensors feed pipelines that trigger physical actions or alerts.
>
> **Virtual / information contexts** — document workflows, code intelligence, research pipelines, knowledge management. Structured and unstructured data feeds pipelines that produce summaries, decisions, or new artifacts.

Polyp should be equally at home in both.

## Current state vs vision

```
Current                          Vision
──────────────────────────────────────────────────────
Static prototype UI              Live execution engine
Manual node config (JSON)        Nodes that actually run
3 cosmetic node types            Typed, extensible node library
In-memory only                   Persistent graphs (file I/O, db)
Single user, local               Collaborative / shareable
No AI integration                LLM + CV nodes as first-class types
Freeform layout only             Semantic layout by domain
```

## Design philosophy

- **Precision minimalism** — information density over decorative space
- **Industrial/technical aesthetic** — dark, monospace, colour encodes information only
- **Keyboard-first** — vim-style navigation; mouse/touch as peers
- **Compact but readable** — tight spacing, clear hierarchy, no relaxed padding
- **The graph is the interface** — no separate "properties panel" culture; context comes from the graph topology itself

## North star

> A practitioner (developer, analyst, researcher, operator) sits down, draws a pipeline in polyp in 10 minutes, and the pipeline is running — ingesting real data, applying AI, producing auditable outputs — without touching a terminal.

## Related

- [[feature-ideas]] — what to build next
- [[design-concepts]] — how it should look and feel
- [[market]] — what already exists
- [[business]] — how it could become a product
- [[decisions]] — choices made along the way

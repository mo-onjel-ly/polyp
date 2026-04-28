---
title: Feature ideas
aliases: [features, backlog, feature backlog, ideas, what would make it better]
tags: [polyp, feature]
---

# Feature ideas

Living backlog. Grouped by horizon. Move items to [[decisions]] when they ship.

> [!TIP] Adding ideas
> Drop rough ideas here without filtering — polish comes later. Tag with `#idea/near`, `#idea/medium`, `#idea/far`, or `#idea/wild`.

---

## Near-term (UI polish, no new architecture)

- [ ] **Fix z-index leak on stack exit** — `updateStackCues` doesn't clear inline `zIndex` when a node leaves a stack. Nodes can remain elevated after separation. (noted in original chat-log)
- [ ] **Named view specs** — replace "V1/V2/V3" labels with editable names stored in the spec object. Small UI: click the dot label to rename inline.
- [ ] **Edge deletion confirmation** — `x` on an edge is instant and unrecoverable. A brief undo toast (3s) would help.
- [ ] **Undo / redo** — basic action stack for node add/delete, edge add/delete, position moves. Even 20 levels would be transformative.
- [ ] **Multi-select** — rubber-band selection on canvas drag; `shift+click` to add. Then: move selection as group, delete group.
- [ ] **Node search / jump** — `cmd+k` palette that fuzzy-matches node titles; selects and centers on match.
- [ ] **Minimap** — small thumbnail of the full graph in a corner; click to teleport. Useful once graphs exceed a screenful.
- [ ] **Copy / paste nodes** — `cmd+c` / `cmd+v` to duplicate nodes (and optionally their edges).
- [ ] **Node notes / comments** — a freeform text annotation that can be attached to a node or placed freely on the canvas.
- [ ] **More view spec slots** — make `SPEC_COUNT` a constant; drive the dot buttons dynamically.

---

## Medium-term (new capabilities, needs design)

- [ ] **Save / load graphs** — JSON serialisation of `state.nodes`, `state.edges`, `state.viewSpecs`. Native file dialog via Electron IPC. Recent files list.
- [ ] **Node execution** — actually run script nodes. Sandboxed JS in a Node.js child process (via Electron IPC). Python via local subprocess.
- [ ] **Live data preview** — show last-N output values from a node's execution inline in the node footer or in a slide-out panel.
- [ ] **Node library / palette** — a searchable sidebar of node type templates. Custom templates saved to disk.
- [ ] **Subgraph / group nodes** — collapse a selection of nodes into a single "group" node. Expand to reveal internals. Essential for large graphs.
- [ ] **Semantic auto-layout variants** — domain layout (group nodes by type), flow layout (current), timeline layout (horizontal by creation time).
- [ ] **Edge labels** — optional text labels on edges (data type, schema, expected format).
- [ ] **Node status as live data** — run status reflects actual execution (idle → running → ok/error), not just manually set.
- [ ] **Top-to-bottom layout** — same algorithm, coordinate swap. Toggle in UI.
- [ ] **Export** — export graph as SVG, PNG, or JSON for sharing.

---

## Long-term / vision (requires significant new capability)

- [ ] **Camera / AV node execution** — actually capture from webcam/RTSP; stream frames downstream. Electron `getUserMedia` + WebRTC or native add-on.
- [ ] **Computer vision nodes** — built-in YOLOv8 (via ONNX.js or Python subprocess), OpenCV wrappers, frame diff, motion detection.
- [ ] **LLM nodes** — call Claude/OpenAI/local Ollama. Input: upstream text/JSON. Output: structured or unstructured text. Config: model, prompt template, parameters.
- [ ] **Agent loop nodes** — a node that re-runs itself on a schedule or trigger, feeding its own output back (with cycle-break conditions). Requires relaxing the strict DAG constraint for designated loop nodes.
- [ ] **Context source connectors** — file watcher, RSS feed, webhook listener, database query, REST API poller. Each as a source node type.
- [ ] **Collaborative graphs** — multiple users editing the same graph. CRDT-based state sync (e.g. Yjs).
- [ ] **Execution graph vs design graph** — separate the "blueprint" (what you draw) from the "runtime" (what runs). Blueprints can be versioned; runtimes can be paused, stepped, and replayed.
- [ ] **Domain ontology import** — import an OWL/RDF ontology or JSON schema and generate a node template set from it. Scaffolds domain models instantly.
- [ ] **AI-assisted graph construction** — describe what you want in natural language; Claude sketches an initial graph. Human refines.
- [ ] **Persistent context store** — nodes can read/write a persistent key-value or vector store. Makes graphs stateful across runs.

---

## Wild / exploratory

- [ ] **Spatial audio** — graph on a 2D canvas, audio feedback on node status (ping on ok, low buzz on error). Ambient monitoring mode.
- [ ] **Physical metaphors** — "gravity" mode where nodes cluster toward related nodes. Spring-embedded layout as an alternative to DAG layout.
- [ ] **Polyp as an MCP server** — expose the current graph state as MCP resources/tools so Claude can query and modify it directly.
- [ ] **Mobile / tablet companion** — read-only graph view + status monitoring on mobile while the desktop is the edit surface.
- [ ] **Graph diffing** — compare two saved graph versions; highlight what changed. Useful for reviewing AI-generated modifications.
- [ ] **Execution replay** — record all input/output data at each node during a run; replay any historical execution step-by-step.

---

## Closed / shipped

| Feature | Shipped | Notes |
|---------|---------|-------|
| Touch support | 2026-04-27 (pre-history) | pinch zoom, tap, port drag |
| Camera node type | 2026-04-27 (pre-history) | |
| Auto-layout | 2026-04-27 (pre-history) | layered DAG, barycenter |
| Stack cues | 2026-04-27 (pre-history) | overlap fan + badge |
| Electron scaffold | 2026-04-27 | hiddenInset titlebar, bun |
| View specs (V1/V2/V3) | 2026-04-27 | copy-on-first-visit, lazy commit |

---

## Related

- [[vision]] — what polyp is trying to become
- [[design-concepts]] — how new features should look and feel
- [[decisions]] — when a feature ships, log the key decisions here

---
title: Roadmap
aliases: [roadmap, milestones, product plan]
tags: [polyp, vision, feature]
---
[]()
# Roadmap

Product milestones from prototype to platform. Not a schedule — a direction. Items move when they're ready, not when a date arrives.

---

## Milestone 0 — Solid prototype *(current)*

**Goal**: The graph builder works reliably, is keyboard-driven, and captures its own usage.

- [x] Node-based graph UI (script / lens / camera node types)
- [x] DAG enforcement, flow coloring, flow highlight
- [x] Auto-layout (layered DAG, barycenter)
- [x] Three manual view specs (V1/V2/V3)
- [x] Command palette + directional toast stack
- [x] User action tracking (semantic event log, JSONL export)
- [x] Electron desktop app (macOS, hiddenInset titlebar)
- [x] Workstream repo + Claude Code hooks
- [ ] Undo (1 level minimum)
- [ ] Save / load graph (JSON file)
- [ ] Regression test suite (palette focus, graph mutations)
- [ ] Fix z-index leak on stack exit

---

## Milestone 1 — Execution engine

**Goal**: Script nodes actually run. You can draw a pipeline and watch data flow through it.

- [ ] JS script execution — sandboxed Node.js child process via Electron IPC
- [ ] Python script execution — local subprocess via Electron IPC
- [ ] Live output preview — last-N output values shown inline in node footer
- [ ] Node status reflects actual execution (idle / running / ok / error)
- [ ] Error display — inline error message on hover / in inspector
- [ ] `node.run` and `node.output` action events added to log

**Data model change**: Nodes need an `outputs` field (latest result). State grows.

---

## Milestone 2 — Context sources

**Goal**: Nodes can pull from real data — files, APIs, feeds.

- [ ] File watcher source node (watches a local path, emits file content)
- [ ] HTTP fetch source node (polls a URL, emits JSON/text)
- [ ] Webhook listener node (receives inbound HTTP, emits payload)
- [ ] Structured data source (CSV/JSON/SQLite reader)
- [ ] Action log integration: context source node type in Pydantic schema

---

## Milestone 3 — AV sources

**Goal**: Camera and audio nodes actually capture.

- [ ] Webcam capture node (`getUserMedia` in Electron renderer)
- [ ] RTSP source node (Node.js FFmpeg subprocess via IPC)
- [ ] Frame preview in camera node (thumbnail in node body)
- [ ] Audio capture node (Web Audio API)
- [ ] Motion detection lens node (frame diff algorithm)
- [ ] YOLOv8 object detection node (ONNX Runtime Web)

**Dependencies**: ONNX Runtime Web or Rust/Tauri sidecar for CV inference.

---

## Milestone 4 — AI nodes

**Goal**: LLM and ML inference are first-class node types.

- [ ] LLM node (Claude, OpenAI, Ollama — configurable)
- [ ] Embedding node (text → vector)
- [ ] Whisper node (audio → transcript, via Transformers.js)
- [ ] Image classification node (ONNX)
- [ ] Agent loop node (re-runs on output, with cycle-break condition)

**Architecture note**: Agent loops require relaxing the strict DAG constraint for designated loop nodes. Add a `loopBreak` condition field that the executor checks.

---

## Milestone 5 — Persistence & sharing

**Goal**: Graphs are saved, versioned, and shareable.

- [ ] Save graph to JSON file (native dialog via IPC)
- [ ] Load graph from JSON
- [ ] Recent graphs list
- [ ] Export as SVG / PNG
- [ ] Read-only share link (PWA viewer)
- [ ] Action log persistence (save to `workstream/sessions/` automatically)

---

## Milestone 6 — Voice I/O

**Goal**: You can speak with polyp.

- [ ] Hold-to-talk via command palette trigger
- [ ] Whisper transcription → command palette input
- [ ] Voice command parsing (natural language → graph operation)
- [ ] Spoken output (TTS for node status / assistant responses)
- [ ] `voice.command` event in action log

---

## Milestone 7 — Multi-device

**Goal**: The graph is accessible and editable from multiple devices.

- [ ] Session sync via CRDT (Yjs or Automerge)
- [ ] Read-only companion view on mobile
- [ ] Multi-user editing with presence indicators
- [ ] Device join/leave events in action log

---

## Milestone 8 — Platform

**Goal**: polyp is extensible by others.

- [ ] Node SDK — define custom node types in a plugin file
- [ ] Node marketplace — install community node packages
- [ ] API — polyp as an MCP server (graph state readable/writable by AI agents)
- [ ] Embeddable — the graph builder as an npm package for other Electron/web apps

---

## Related

- [[todo]] — current sprint work
- [[feature-ideas]] — full idea backlog
- [[vision]] — north star
- [[tech-stack-research]] — stack evolution needed to reach later milestones

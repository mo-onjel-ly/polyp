---
title: Tech stack research
aliases: [stack alternatives, tech lookahead, stack research]
tags: [polyp, reference, design, market]
---

# Tech stack research

Alternatives, lookahead, and future stack evolution. For each current choice, what could replace it (fully or partially) and why you'd consider it.

> [!INFO] Philosophy
> The goal is not to constantly migrate — it's to know when a specific capability in an alternative would be worth extracting or switching for. "Tear out and keep only what we need" over "import a library we 90% don't use."

---

## Electron alternatives

### Tauri 2.x

**What it offers**: Rust backend, WebView2/WKWebView renderer (uses system webview, not Chromium), ~5MB binary vs ~150MB for Electron.
**Killer feature**: Native Rust bindings — direct access to `opencv`, `onnxruntime`, CUDA, camera APIs without going through Node.js subprocess. When polyp needs real computer vision (YOLOv8, frame processing), Tauri's Rust layer is compelling.
**What we'd lose**: Chrome DevTools in renderer, `contextBridge` IPC we already have, npm ecosystem for renderer dependencies.
**Extract strategy**: If we need CV in the future, consider a hybrid — keep Electron for the graph UI, spawn a Tauri/Rust sidecar for CV processing. Or migrate the whole app to Tauri once the CV story is clear.
**Verdict**: Not now. Revisit when CV nodes need to be real.

### Neutralinojs

**What it offers**: Much lighter than Electron (~2MB). Uses OS webview.
**Killer feature**: Minimal footprint.
**Limitation**: Smaller ecosystem, less mature IPC, no Node.js in main process.
**Verdict**: Too constrained for polyp's planned feature set. Skip.

### PWA (Progressive Web App)

**What it offers**: No install, works in browser, easy distribution.
**Killer feature**: Zero friction for new users — share a URL.
**Limitation**: No local file system access (beyond File System Access API), no RTSP/camera protocol support, sandboxed GPU access.
**Extract strategy**: Ship a read-only PWA viewer of a polyp graph (no editing). Useful for sharing.
**Verdict**: Supplementary only. The full editor stays native.

---

## Renderer alternatives

### Svelte + Vite (no framework overhead)

**What it offers**: Compiled components (no virtual DOM), small runtime, excellent TypeScript support, built-in reactivity.
**Killer feature**: Reactive stores are perfect for `state` — instead of calling `renderNode()` manually after every mutation, the UI reacts automatically. Significantly reduces boilerplate in the 20+ places that call `updateCounts()`, `renderEdges()`, etc.
**Migration cost**: Full rewrite of the render layer. Could be done incrementally (Svelte components for toolbar/statusbar, keep canvas raw for performance).
**Verdict**: Strong candidate for the next major refactor. When the file exceeds 4000 lines, migrate the non-canvas UI to Svelte components while keeping the canvas as raw DOM.

### React + Vite

**What it offers**: Huge ecosystem, excellent TypeScript types, great debugging tools.
**Limitation**: Virtual DOM overhead for a canvas-heavy app. ReactFlow exists (the leading graph library for React) but we'd inherit its abstractions.
**Verdict**: ReactFlow is a valid direction if we want to stop owning the graph renderer. But ownership of the renderer is a competitive advantage — custom layout, custom node rendering, custom interactions. Skip React.

### PixiJS / WebGL canvas

**What it offers**: GPU-accelerated rendering, handles 10,000+ nodes without performance degradation.
**Killer feature**: When the graph scales to hundreds of nodes with live data streams updating every node, DOM rendering will struggle. PixiJS can render the whole graph as a WebGL scene.
**Extract strategy**: The graph canvas could be migrated to PixiJS while keeping DOM for UI chrome (toolbar, inspector, palette). The node data model and event system stay the same.
**Verdict**: Keep in mind for 100+ node graphs. Not urgent until we hit rendering performance issues.

### Canvas 2D API (without a library)

**What it offers**: Full control, no library dependency, potentially very fast.
**Limitation**: More code to write (hit-testing, text rendering, etc.).
**Verdict**: We already do this with SVG edges. If PixiJS feels like too much, a Canvas 2D renderer for edges + nodes is viable. Worth prototyping.

---

## State management alternatives

### Zustand (if we move to React)

If we migrate to React, Zustand is the cleanest state management option — minimal API, direct mutation support, devtools integration.

### Immer

**What it offers**: Immutable state with a mutable API. Enables structural sharing, cheap state snapshots for undo.
**Killer feature**: Undo/redo becomes trivial — snapshot state before a mutation, keep a stack of past states.
**Extract strategy**: Add Immer to the existing JS without any framework migration. Wrap `state` mutations in `produce()` calls. Then the action stack is just previous Immer drafts.
**Verdict**: Strong candidate when we implement undo. 5KB library, no framework required.

```js
// What undo looks like with Immer
import produce from 'immer';
const history = [];
function mutate(fn) {
  history.push(state);
  state = produce(state, fn);
}
// undo: state = history.pop();
```

---

## Package manager alternatives

### pnpm

Near-identical to bun for this use case. Would switch only if bun has a regression.

### Yarn Berry (PnP)

Plug'n'Play breaks some Electron tooling. Not worth it here.

---

## Language alternatives

### TypeScript

**What it offers**: Type safety, better IDE support, catches whole classes of bugs at compile time.
**For polyp specifically**: The action log schema, node types, state shape — all would benefit from types. The Pydantic models in `workstream/schemas/action_events.py` exist precisely because the JS side has no types.
**Migration path**: Add `// @ts-check` + JSDoc types first (zero tooling cost). Then migrate to `.ts` files with Vite when we introduce a build step.
**Verdict**: Add JSDoc types to key functions now. Full TS migration when we add a build step.

### Python (Pyodide / server-side execution)

**For the execution engine**: Script nodes that run Python code currently have no execution backend. Pyodide (Python in WebAssembly) can run Python in the renderer. Alternatively, a local Python subprocess via Electron IPC.
**Verdict**: For the MVP execution engine, local subprocess via IPC is simpler and more capable than Pyodide. Add as an IPC command in `preload.js`.

---

## AI/ML runtime alternatives

### ONNX Runtime Web

**What it offers**: Run ONNX models (YOLOv8, Whisper, etc.) in the browser/Electron renderer using WebAssembly or WebGL.
**Killer feature**: CV inference in the renderer with no Python dependency. YOLOv8 nano runs at ~15fps in ONNX Web on a modern MacBook.
**When to use**: For lightweight on-device inference in camera nodes.

### Transformers.js

**What it offers**: Run Hugging Face models in the browser/Node. Whisper for speech-to-text, CLIP for image embedding, etc.
**Killer feature**: Audio I/O — Whisper via Transformers.js would give us "speak with polyp" without any Python.
**Verdict**: High priority when audio I/O work begins.

### Ollama (local LLM)

**What it offers**: Run LLMs locally (Llama 3, Mistral, etc.) via a local HTTP server.
**For polyp**: LLM nodes that call Ollama for local inference, no API key required.
**Verdict**: The first LLM node type should support both Ollama (local) and Claude/OpenAI (API).

---

## Data / persistence alternatives

### SQLite (via better-sqlite3 or Electron's built-in)

**For**: Graph persistence, node execution history, action log storage.
**When**: When we need to query graph history or store large action logs.

### JSON files (simple save/load)

**For**: MVP graph save/load — just serialize `state.nodes` and `state.edges` to JSON.
**When**: First iteration of file I/O. Dead simple, human-readable.
**Migrate to SQLite**: When graphs get large or we need querying.

### CRDTs (Yjs, Automerge)

**For**: Collaborative real-time editing of graphs.
**When**: Multi-device or multi-user editing is a requirement.
**Verdict**: Not needed until collaboration is scoped. Keep in mind that the action log format (append-only, timestamped) is CRDT-friendly.

---

## Related

- [[tech-stack]] — current choices
- [[feature-ideas]] — capabilities that will drive stack evolution
- [[vision]] — the target that the stack must reach

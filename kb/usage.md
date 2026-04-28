---
title: Usage guide
aliases: [usage, getting started, how to use]
tags: [polyp, guide]
---

# Usage guide

## Running the app

```bash
bun start      # production window
bun run dev    # with Node inspector on port 5858
```

Opens an Electron window (1400×900). The [[canvas]] fills the space between the topbar and status bar.

## Orientation

```
┌─ topbar ──────────────────────────────────────────────────────┐
│ ◆ FLOWGRAPH  graph · untitled  nodes: N  edges: N  [layout]  │
├─ canvas ──────────────────────────────────────────────────────┤
│                                                               │
│   (infinite zoomable graph)                                   │
│                                                               │
├─ status bar ──────────────────────────────────────────────────┤
│ NORMAL  —              100%  V1  120, 80                      │
└───────────────────────────────────────────────────────────────┘
```

| Zone | Contents |
|------|----------|
| Topbar | Brand, graph metadata, [[auto-layout]] toggle, [[view-specs]] dots, hint bar |
| Canvas | The graph — [[nodes]], [[edges]], grid |
| Status bar | Mode, selection info, zoom%, [[view-specs\|view spec]] slot, pan coords |

## Building a graph

### Adding nodes

| Key | Node type |
|-----|-----------|
| `n` | [[nodes\|script]] |
| `N` | [[nodes\|lens]] |
| `m` | [[nodes\|camera]] |

With a node selected, the new node spawns adjacent to the right and is **auto-connected**. Otherwise it appears at the canvas centre.

### Connecting nodes

Drag from the **output [[ports\|port]]** (right edge) of one node onto another to connect them. Drag from the **input port** (left edge) to connect in reverse. [[edges#DAG enforcement|Cycles are blocked]] silently.

> [!TIP] Grow a pipeline fast
> Drag the output port of the last node to **empty canvas** — a new `script` node is created at the drop point and connected automatically. Then press `Enter` to open its [[inspector]] and rename/configure it.

### Editing a node

Second-click a selected node, or press `Enter` once it's selected, to open the [[inspector]]. Change the title, toggle enabled, and edit type-specific fields. Close with `Esc` or click outside.

### Deleting

Select a [[nodes\|node]] or [[edges\|edge]] and press `x`. Deleting a node also removes all its connected edges.

## Navigating the canvas

| Action | How |
|--------|-----|
| Pan | Drag background or middle-button drag |
| Zoom | Scroll wheel (cursor-anchored) or pinch |
| Reset view | `f` or `0` |
| Move selection | `h` / `j` / `k` / `l` |

See [[canvas]] for coordinate space details.

## Layout modes

### Auto-layout (`a`)

Press `a` to compute a [[auto-layout|layered DAG layout]]. [[nodes|Node]] dragging is disabled; the layout re-runs after every graph change. Press `a` again to return to freeform.

> [!INFO]
> Entering auto-layout commits the current [[view-specs|view spec]] automatically — your manual arrangement is never lost.

### View specs (`v`)

Three independent freeform layouts — **V1**, **V2**, **V3** — each storing node positions, pan, and zoom.

- `v` cycles forward
- Click the numbered dot-buttons in the topbar to jump directly
- First visit to a new slot **copies the current arrangement** as a starting point

See [[view-specs]] for full design notes.

## Flow highlight

Selecting a [[nodes\|node]] dims everything outside its [[flows|connected component]]. Useful for tracing a single pipeline through a busy graph. `Esc` or click background to clear.

## Enabling / disabling nodes

`d` toggles a [[nodes\|node]]. Disabled nodes and their [[edges]] render faded with dashed strokes. Topology is preserved — re-enable at any time.

## Stack cues

When [[nodes]] overlap in freeform mode, they form a [[stack-cues|stack]]: nodes fan diagonally and a count badge appears on the topmost card. Drag a node out to separate it.

## Full shortcut reference

→ [[keyboard-shortcuts]]

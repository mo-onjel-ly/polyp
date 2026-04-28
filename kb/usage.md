# Usage guide

## Running the app

```bash
bun start          # production window
bun run dev        # same, with Node inspector on port 5858
```

Opens an Electron window (1400×900, dark background, macOS traffic-light
buttons inset into the topbar).

---

## Orientation

The interface has three zones:

- **Topbar** (32px, top) — brand, graph metadata, toolbar buttons, keyboard hints
- **Canvas** (fills remaining space) — the infinite zoomable graph
- **Status bar** (22px, bottom) — mode, selection info, zoom %, view spec, pan coords

The canvas contains a *world* div that is transformed by the current pan and
zoom. Nodes and edges live inside the world.

---

## Building a graph

### Adding nodes

Press `n` (script), `N` (lens), or `m` (camera). If a node is already
selected, the new node spawns to its right and is auto-connected. Otherwise
it appears at the canvas centre.

### Connecting nodes

Drag from the **output port** (right edge, small circle) of one node and
release over another node to connect them. You can also drag from an **input
port** (left edge) to a source node — the direction is inferred.

Dragging a port to **empty canvas** creates a new script node at the drop
point and connects it automatically.

Connections that would create a cycle are silently blocked (DAG is enforced).

### Editing a node

Open the inspector with a second click on a selected node, or by pressing
`Enter` once a node is selected. The inspector shows:

- Editable title (text field at top)
- Enable/disable toggle
- Upstream list (which nodes feed into this one)
- Type-specific config fields

Close with `Esc` or by clicking outside the inspector panel.

### Deleting

Select a node or edge and press `x`. Deleting a node also removes all its
connected edges.

---

## Navigating the canvas

| Action | How |
|--------|-----|
| Pan | Drag the canvas background, or middle-button drag |
| Zoom | Scroll wheel (centred on cursor) or pinch |
| Reset view | `f` or `0` |
| Move selection | `h` / `j` / `k` / `l` (vim-style) |

---

## Layout modes

### Auto-layout

Press `a` (or click the **auto-layout** toolbar button) to switch to
computed layout. The algorithm assigns nodes to columns by DAG rank and
sorts rows by parent barycenter to reduce edge crossings. Node dragging is
disabled in this mode; the layout re-runs automatically after any change.

Press `a` again to return to freeform.

### View specs (freeform only)

Three independent layout slots — **V1**, **V2**, **V3** — each remembering
node positions, pan, and zoom.

- Press `v` to cycle forward (V1 → V2 → V3 → V1)
- Click the numbered dot-buttons in the topbar to jump to a specific slot
- The current slot is shown in the status bar

The first time you visit a slot it starts as a copy of the current
arrangement. Rearrange nodes, pan, or zoom to diverge it from the others.

Switching slots or toggling auto-layout commits the current slot's state
automatically — there is no explicit save action.

---

## Flow highlighting

Clicking or selecting a node dims all nodes and edges that are **not** in
its connected component. This makes it easy to trace a single pipeline
through a busy graph. Press `Esc` or click the canvas background to clear.

---

## Enabling and disabling nodes

Press `d` (with a node selected or the inspector open) to toggle. Disabled
nodes render at reduced opacity; their edges are shown dashed. The graph
structure is preserved.

---

## Stack cues (freeform only)

When two or more nodes overlap heavily in freeform mode, they form a
*stack*: nodes fan out diagonally (≈4px per layer) and a count badge
appears on the topmost card. This makes overlapping structure readable
without requiring pixel-perfect placement.

Drag any member out of the stack to separate it.

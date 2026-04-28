# Core concepts

## Nodes

The fundamental unit of the graph. Each node is a 72×72px square with:

- **Input port** — left-centre edge (circle); accepts one or more upstream connections
- **Output port** — right-centre edge (circle); drives downstream nodes
- **Header** — type label, node id, enabled-dot, status indicator
- **Title** — editable name
- **Footer** — one-line type-specific summary (language / op / mode)

### Node types

| Type | Label | Purpose | Key config fields |
|------|-------|---------|-------------------|
| `script` | SCRIPT | Code execution | language (js/python/bash), script body |
| `lens` | LENS | Data view / filter / transform | op (filter/map/group/sort/tag/select), expression, render-as |
| `camera` | CAMERA | Video / image feed | device, resolution, fps, mode, trigger |

### Node status

Shown as a coloured dot in the node header:

- (no colour) — `idle`
- green — `ok`
- yellow — `warn`
- pulsing blue — `run`

### Enabled / disabled

A node can be disabled (`d`). Disabled nodes and all their edges render at
reduced opacity with dashed strokes. The graph topology is preserved; only
the visual presentation and (conceptually) execution are affected.

---

## Edges

Directed connections from one node's output port to another's input port,
rendered as cubic bezier curves. Edges inherit the source node's flow colour.

**DAG enforcement**: the app prevents any connection that would introduce a
cycle. `tryConnect` walks the graph downstream from the target node; if it
reaches the source, the connection is blocked.

**Duplicate prevention**: only one edge between any given ordered pair of
nodes is allowed.

---

## Flows

A *flow* is a connected component of the graph (nodes reachable from one
another in either direction). Each flow is assigned a hue from a palette of
six:

| Index | Hue | Appearance |
|-------|-----|------------|
| 0 | `200 80% 60%` | cyan-blue |
| 1 | `30 90% 62%` | amber |
| 2 | `330 75% 65%` | magenta |
| 3 | `150 60% 58%` | mint |
| 4 | `260 70% 70%` | violet |
| 5 | `0 75% 65%` | coral |

Flow indices are assigned to roots (nodes with no incoming edges) in creation
order. Downstream nodes inherit the minimum flow index of their parents, so
when two flows merge the lower-index colour wins.

**Flow highlight**: selecting a node dims every node and edge *not* in its
connected component. A brief flash marks the transition. Clicking a node in
a different flow switches the highlight.

---

## Auto-layout

A layered DAG layout algorithm:

1. **Rank** each node by its longest path from any root (Kahn topological
   sort, rank = max(parent rank) + 1).
2. **Group** nodes into columns by rank.
3. **Sort** rows within each column by parent barycenter (mean row index of
   parents) to reduce edge crossings; two passes.
4. **Position**: columns 128px apart (node size 72 + gap 56), rows 96px apart
   (72 + 24). All columns vertically centred against a common axis.

Node dragging is disabled while auto-layout is on. The layout re-runs
automatically after any graph mutation (node creation, deletion, connection).

Toggling auto-layout off restores the last committed view spec.

---

## View specs

Three named slots (V1 / V2 / V3) for independent freeform layouts. Each slot
stores:

- Per-node `{x, y}` positions
- Canvas pan `{x, y}`
- Zoom level

Slots are committed lazily (on spec switch or auto-layout toggle) rather than
on every drag. An uninitialised slot copies the current state on first visit
("copy-on-first-visit"). See `kb/view-specs.md` for full design rationale.

---

## Stack cues

In freeform mode, nodes can overlap. When two or more nodes are within 55%
of the node size of each other (union-find clustering), they form a *stack*:

- Each node is fanned diagonally (~4px right + down per layer)
- Higher-indexed nodes (by creation order) render on top
- A count badge appears on the topmost node
- Stacks are re-evaluated after every drag drop

Stack cues are suppressed in auto-layout mode (the layout algorithm
guarantees no overlaps).

---

## Inspector

A floating overlay for editing a node's properties in detail. Contains:

- Editable title
- Enable/disable toggle
- Upstream list (nodes feeding into this one)
- Type-specific config fields (text inputs, selects, textareas)
- Keyboard hints footer

The inspector is opened by a second tap/click on an already-selected node,
or by pressing `Enter`. A backdrop click or `Esc` closes it. While open,
keyboard input goes to the form fields; `Esc` returns focus to the canvas.

---

## Coordinate spaces

Two coordinate systems are in play:

- **Screen space** — pixel coordinates relative to the viewport (`clientX/Y`).
- **World space** — the canvas coordinate system, offset by pan and scaled by
  zoom. `worldFromScreen` and `screenFromWorld` convert between them.

Node `x/y` positions, port positions, and bezier control points are all in
world space. The `world` div is transformed via `translate(pan) scale(zoom)`.

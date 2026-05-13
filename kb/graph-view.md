---
title: Graph view
aliases: [graph view, canvas view, graph area, graph rendering, visual layers]
tags: [polyp, concept, ui, reference]
---

# Graph view

The main interactive area — everything between the [[chrome|topbar and statusbar]]. This document covers the composite visual composition: what layers exist, how they render, and how state changes the visual.

---

## Dimensions and geometry

```
Viewport
├─ topbar          32px  fixed
├─ canvas          fills remaining height (viewport − 54px)
│   ├─ .world      transform: translate(pan) scale(zoom); origin 0 0
│   │   ├─ .grid
│   │   ├─ svg.edges
│   │   └─ .node × N
└─ statusbar       22px  fixed
```

The `.canvas` div has `inset: 32px 0 22px 0` — it clips at the bars. `overflow: hidden`. Everything inside is in [[canvas#World space|world space]] via the `.world` transform.

---

## Layer stack (bottom → top)

### 1 — Canvas background

`background: radial-gradient(ellipse at 50% 30%, #101217 0%, var(--bg) 70%)`

A subtle radial brighten toward the upper-centre of the canvas. The effect is nearly imperceptible but adds depth — the eye reads it as a faint focal point. On top of this sits the grid.

### 2 — Grid

Two superimposed levels:

| Level | Size | Colour |
|-------|------|--------|
| Fine | 20×20px | `--bg-grid` (`#131418`) |
| Coarse | 100×100px | `--bg-grid-lg` (`#1a1c22`) |

Rendered as CSS `background-image` gradients (not DOM elements). `opacity: 0.6`. `pointer-events: none`. The grid is **fixed in screen space** — it does not scroll with the world. This is a deliberate design choice: the grid reads as an ambient surface texture rather than a navigational ruler.

### 3 — SVG edge layer

`svg.edges` — `position: absolute; left:0; top:0; overflow: visible`. Declared `pointer-events: none` on the SVG itself, but each edge has two paths stacked:

| Path | Width | Pointer events | Purpose |
|------|-------|---------------|---------|
| `.edge-hit` | 10px transparent | `stroke` | Fat invisible hit area for clicking/tapping |
| `.edge` | 1.5px coloured | `stroke` | Visible bezier curve |

Edges are cubic bezier curves: `M x1 y1 C (x1+dx) y1, (x2−dx) y2, x2 y2` where `dx = max(40, |x2−x1| × 0.5)`. Colour is inherited from the source [[nodes|node]]'s [[flows|flow]] hue.

**Selected edge**: stroke-width 2.5px + `drop-shadow(0 0 4px currentColor)` glow filter.

**Ghost line**: while dragging from a [[ports|port]], a dashed `stroke-dasharray: 3 3` path traces the cursor position in real time.

**Disabled edge**: `opacity × 0.45`, `stroke-dasharray: 4 3`.

### 4 — Nodes

72×72px absolutely positioned squares in world space. `background: var(--panel)` (`#0f1115`), `border: 1px solid var(--line)`, `border-radius: 4px`.

**Flow colour stripe**: a 2px `::before` pseudo-element on the left edge, coloured `hsl(var(--flow))`. This is the primary flow identity signal on the node body.

**Node header** (top ~20px): `border-bottom: 1px solid var(--line)`. Contains left-to-right:
- Type label — `SCRIPT` / `LENS` / `CAMERA` in flow colour, 8px uppercase
- Node id — `n1`, `n2` … in muted text
- Enabled dot — small circle, grey when on, dimmer when off
- Status dot — green (`ok`) / amber (`warn`) / blue pulse (`run`) / invisible (`idle`)

**Node title** (middle): single line, `font-size: 11px`, truncates with ellipsis.

**Node footer** (bottom): one config value — language / op / mode. Muted, 9px.

**Ports**: 9px circles. Input (left-centre): solid flow colour. Output (right-centre): `background: hsl(var(--flow) / 0.2)`, `border: hsl(var(--flow) / 0.8)`. Both scale to 1.4× on hover. Protrude outside the node boundary by 4.5px.

#### Node states

| State | Visual change |
|-------|--------------|
| Hover | Border → `--line-hi` |
| Selected | White border `--sel`, `0 0 0 1px var(--sel)` ring + shadow, `z-index: 5` |
| Dragging | `cursor: grabbing`, `z-index: 10` |
| Disabled | `.disabled` class → node opacity 0.35, header dim |
| Stacked | Diagonal translate via `--stack-offset` (4px per layer), layered box-shadows hint at depth behind, count badge top-right corner |
| Stacked + selected | Combines both shadow sets |
| Layout animation | `transition: left 0.24s, top 0.24s cubic-bezier(.4,0,.2,1)` — active briefly after auto-layout toggle or view-spec switch |

### 5 — Overlays (highest z-index)

These render above everything in the world:

| Overlay | z-index | Trigger |
|---------|---------|---------|
| Inspector backdrop | 190 | Node inspector open |
| Inspector panel | 200 | Node inspector open |
| Command palette backdrop | (backdrop layer) | `cmd+p` |
| Command palette | 600 | `cmd+p` |
| Toast stack | 610 | `shift+enter` in palette |

---

## Flow highlight

When a node is selected, `applyFlowHighlight` adds `.flow-highlight` to `.world`:

```
.world.flow-highlight .node          → opacity 0.12, saturate(0.15) brightness(0.7)
.world.flow-highlight .node.in-flow  → opacity 1, filter: none
svg.edges path.edge.dim              → opacity 0.06 !important
```

On first activation (or flow switch) a `.flash` class briefly applies a `flowFlash` keyframe — a glow ring at `hsl(var(--flow) / 0.5)` expanding from 0 to 4px and fading over 450ms. This makes the highlight feel physical rather than instantaneous.

---

## Cursor states

The `.canvas` cursor signals the current interaction mode:

| Cursor | Condition |
|--------|-----------|
| `grab` | Default (normal mode) |
| `grabbing` | While panning (`.canvas.panning`) |
| `crosshair` | Connect mode (`.canvas.connecting`) |
| `grab` → `grabbing` | On individual node while dragging (`.node.dragging`) |

---

## What you don't see

- **No node snap-to-grid**: positions are free floating in world space. The grid is purely decorative.
- **No edge routing**: edges go point-to-point. No avoid-obstacles logic. Overlapping edges are visually distinct only by colour.
- **No minimap**: planned for 50+ node graphs (see [[feature-ideas]]).

---

## Related

- [[canvas]] — coordinate spaces, pan, zoom, anchor modes
- [[nodes]] — full node anatomy and types
- [[edges]] — bezier rendering, hit areas, disabled state
- [[flows]] — connected-component colouring and highlight
- [[stack-cues]] — overlapping node visualisation
- [[inspector]] — the overlay panel that appears on second tap
- [[ports]] — the connection points and drag mechanics
- [[chrome]] — the topbar and statusbar that frame this view

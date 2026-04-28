---
title: Canvas
aliases: [canvas, world, pan, zoom, coordinate space, world space, screen space]
tags: [polyp, concept, ui]
---

# Canvas

The infinite zoomable surface that contains the graph. Structurally it is two nested divs:

```
.canvas          ← fixed inset (32px top / 22px bottom for bars); clips overflow
  .world         ← transformed: translate(pan) scale(zoom); all nodes/edges live here
    .grid        ← background grid (pointer-events: none)
    svg.edges    ← edge bezier curves
    .node × N    ← absolutely positioned nodes
```

## Coordinate spaces

### Screen space
Pixel coordinates relative to the viewport (`clientX` / `clientY`). Used for pointer events and CSS positioning of fixed UI elements (topbar, status bar, inspector).

### World space
The canvas coordinate system — offset by pan and scaled by zoom. All node `x/y` positions, port coordinates, and bezier control points are in world space.

**Conversions:**
```js
// screen → world
x: (sx - rect.left - pan.x) / zoom
y: (sy - rect.top  - pan.y) / zoom

// world → screen
x: wx * zoom + pan.x + rect.left
y: wy * zoom + pan.y + rect.top
```

## Pan

`state.pan` — `{x, y}` offset applied as `translate(pan.x px, pan.y px)` before the zoom scale.

| Gesture | Action |
|---------|--------|
| Left-button drag on background | Pan |
| Middle-button drag | Pan |
| Single-finger drag (touch) | Pan |

## Zoom

`state.zoom` — scalar applied as `scale(zoom)` after translate. Range: `[0.3, 2.5]`.

Zoom is **cursor-anchored**: the point under the cursor stays fixed while the rest of the canvas scales around it.

```js
pan.x = mx - (mx - pan.x) * (newZoom / oldZoom)
pan.y = my - (my - pan.y) * (newZoom / oldZoom)
```

| Gesture | Action |
|---------|--------|
| Scroll wheel | Zoom centred on cursor |
| Pinch (touch) | Zoom centred on pinch midpoint |
| `f` / `0` | Reset: pan `{120, 80}`, zoom `1.0` |

## Grid

Two-level background grid (pointer-events off, opacity 0.6):
- **Fine** — 20px, colour `--bg-grid` (`#131418`)
- **Coarse** — 100px, colour `--bg-grid-lg` (`#1a1c22`)

The grid is static in screen space — it does *not* move with the world. This is a design choice: the grid reads as an ambient texture rather than a spatial reference.

## Related

- [[nodes]] — positioned in world space
- [[edges]] — bezier paths in world space
- [[ports]] — world-space coordinates used in drag calculations
- [[view-specs]] — each spec stores pan + zoom alongside node positions
- [[auto-layout]] — positions assigned in world space

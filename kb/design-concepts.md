---
title: Design concepts
aliases: [design, design concepts, UX concepts, UI design]
tags: [polyp, design, vision]
---

# Design concepts

Visual, interaction, and architectural design explorations. Not a spec — a sketchpad. Good ideas graduate to [[feature-ideas]] or [[decisions]].

---

## Visual language

### Current palette

```
Background:   #0a0b0d   (near-black)
Panel:        #0f1115
Accent text:  #d8dbe2
Muted text:   #7a7f8c
Borders:      #24272f   (line) / #3a3f4b (hi)
Status ok:    #6ee7a8   (green)
Status warn:  #ffcb6b   (amber)
Status err:   #ff5a5f   (red)
Flow hues:    6-color: cyan-blue, amber, magenta, mint, violet, coral
```

The palette is intentionally cold and technical. Colour is *data*, not decoration.

### What's working

- Flow hues are readable even when 4-5 flows coexist
- The flash highlight on selection is noticeable without being jarring
- Monospace font reinforces the "programming tool" register

### What could be better

- Disabled state could use a texture (fine crosshatch) in addition to opacity, for accessibility
- The grid is decorative, not navigational — faint metric tick-marks at round world coordinates might help spatial orientation

---

## Node design

### Current: 72×72px fixed square

Works well for compact graphs. Constraints:
- Title truncates at ~3 words
- Footer line is one value only
- Status dot is very small (4px)

### Concept: variable-height nodes

Allow a node to be 72px wide but taller when it has more config to show. Two heights: **compact** (72px, default) and **expanded** (144px, shows first 2 config fields inline). Inspector still opens for full edit.

> [!QUESTION] Does variable height break layout?
> Auto-layout assumes fixed height for row-gap calculation. Variable height would require per-row height tracking. Worth the complexity?

### Concept: node type colour variants

Instead of pure flow-color borders, give each node *type* a subtle background tint:
- `script` → slight purple tint
- `lens` → slight teal tint
- `camera` → slight amber tint

Flow color still dominates; type tint is very faint (5% opacity). Would make type legible at a glance without reading the label.

---

## Edge design

### Current: bezier, 1.5px, flow-coloured

Clean. Could evolve:

- **Animated flow particles** — small dots travelling along edges when a node is executing. Would make "data in motion" viscerally obvious.
- **Edge thickness as throughput** — thicker = more data flowing. Useful for monitoring mode.
- **Edge type annotations** — thin label (data type or schema name) on hover.

---

## Canvas / navigation

### Concept: semantic zoom

At low zoom (< 0.5), nodes collapse to colored dots. At medium zoom (0.5–1.0), show only title. At full zoom (> 1.0), full detail. This lets very large graphs remain navigable.

### Concept: overview + detail

Two panes: full graph overview (like a minimap but permanent, left side) and a focused detail area (right side). Click in overview to teleport. Selection highlights both. Useful for graphs with 50+ nodes.

### Concept: domain grouping

Nodes can be tagged with a domain label (e.g. "ingest", "transform", "output"). The canvas can be switched to a **domain view** that draws soft background zones around domain clusters. Doesn't change positions — just adds visual grouping annotation.

---

## Interaction

### Concept: command palette

`cmd+k` opens a fuzzy-search palette over node titles and actions. Inspired by VS Code / Linear / Raycast. Replaces need to navigate to a node before operating on it.

Items:
- Jump to node (by title)
- Create node of type
- Run / pause node
- Toggle layout mode
- Switch view spec

### Concept: gesture-based node creation

On a trackpad: three-finger tap on empty canvas opens the create-node palette at that position. Currently this is `n`/`N`/`m` — gesture version lowers activation cost for mouse users.

### Concept: drag-to-group

Drag-select multiple nodes → `g` to wrap in a group node. The group collapses to a single box; expand to see internals. This is the primary scaling mechanism for complex graphs.

---

## Execution / runtime UI

### Concept: execution overlay

A toggleable mode that overlays live execution state on the static graph:
- Node border pulses while running
- Edge animates (particles or glow)
- A small sparkline in the node footer shows last-N output values
- Errors surface as red borders with inline message on hover

The design challenge: execution state is ephemeral, graph structure is persistent. They should be clearly visually distinct.

### Concept: inspector as execution monitor

When a node is executing, the inspector switches from "config mode" to "monitor mode": shows live input/output values, last-N run durations, error log. Switch back to config to edit.

---

## Related

- [[feature-ideas]] — actionable items from these concepts
- [[reactions]] — gut reactions to current design
- [[vision]] — what all of this is in service of

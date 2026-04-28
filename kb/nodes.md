---
title: Nodes
aliases: [node, node types, node anatomy]
tags: [polyp, concept, ui]
---

# Nodes

The fundamental unit of the graph. Each node is a **72×72px square** rendered absolutely in [[canvas#World space|world space]].

## Anatomy

```
┌──────────────────────────┐
│ SCRIPT  n1  ● ◉          │  ← header: type label, id, enabled-dot, status
│  fetch api logs          │  ← title
│  js                      │  ← footer (type-specific summary)
○                          ○   ← ports (in left, out right)
└──────────────────────────┘
```

- **Input port** — left-centre edge; receives connections from upstream nodes → [[ports]]
- **Output port** — right-centre edge; drives downstream nodes → [[ports]]
- **Header** — type label, node id (`n1`, `n2` …), enabled-dot, status dot
- **Title** — editable in the [[inspector]]
- **Footer** — one-line config summary (language / op / mode)

## Types

| Type | Label | Purpose |
|------|-------|---------|
| `script` | `SCRIPT` | Code execution (js / python / bash) |
| `lens` | `LENS` | Data view, filter, transform |
| `camera` | `CAMERA` | Video / image feed |

### script fields
- `lang` — `js` · `python` · `bash`
- `code` — script body; upstream values arrive as `inputs[]`

### lens fields
- `op` — `filter` · `map` · `group` · `sort` · `tag` · `select`
- `expr` — the operation expression
- `view` — render mode: `table` · `list` · `cards` · `json` · `raw`

### camera fields
- `source` — `default` · `webcam:0/1` · `rtsp` · `file` · `screen`
- `resolution`, `fps`, `mode`, `trigger`

## Status

Shown as a coloured dot in the header:

| Value | Colour | Meaning |
|-------|--------|---------|
| `idle` | — | not running |
| `ok` | green | last run succeeded |
| `warn` | yellow | completed with warnings |
| `run` | blue (pulse) | currently executing |

## Enabled / disabled

Nodes can be toggled with `d`. A **disabled** node and all its [[edges]] render at reduced opacity with dashed strokes. The graph topology is preserved; only visual presentation (and conceptually, execution) is affected.

> [!TIP] Disabling vs deleting
> Disable to temporarily exclude a node from a flow without losing its config. Delete (`x`) when the node is no longer needed.

## Flow membership

Each node belongs to exactly one [[flows|flow]] (connected component), determined by propagation from the graph's root nodes. The flow index controls the node's accent colour.

## Position

Node coordinates (`x`, `y`) are in [[canvas#World space|world space]]. In [[auto-layout]] mode these are overwritten by the layout engine; the pre-layout positions are saved to the active [[view-specs|view spec]] before that happens.

In freeform mode, [[stack-cues]] activate when nodes overlap.

## Related

- [[edges]] — connections between nodes
- [[ports]] — how connections are made
- [[inspector]] — editing node properties
- [[flows]] — colour and highlight
- [[auto-layout]] — computed positioning
- [[stack-cues]] — overlap visualisation

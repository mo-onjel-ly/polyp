---
title: Flows
aliases: [flow, flow coloring, flow highlight, connected component]
tags: [polyp, concept, ui]
---

# Flows

A *flow* is a **connected component** of the graph — all [[nodes]] reachable from one another in either direction across [[edges]]. Each flow is assigned one of six accent colours.

## Colour palette

| Index | HSL | Appearance |
|-------|-----|------------|
| 0 | `200 80% 60%` | cyan-blue |
| 1 | `30 90% 62%` | amber |
| 2 | `330 75% 65%` | magenta |
| 3 | `150 60% 58%` | mint |
| 4 | `260 70% 70%` | violet |
| 5 | `0 75% 65%` | coral |

Indices wrap (`% 6`) so more than six flows cycle through the palette.

## Assignment algorithm

`recomputeFlows()` runs after every graph mutation:

1. Find **root nodes** (in-degree 0). Assign each root a fresh flow index in creation order.
2. **BFS propagation** — walk downstream; each node inherits the **minimum** flow index of its parents.
3. **Orphans** (disconnected cycles, shouldn't occur in a DAG) get a new index.

> [!NOTE] Min-index rule
> When two flows merge at a junction node, the lower-index (older) colour wins. This keeps the dominant pipeline's colour stable as branches join it.

## Flow highlight

Selecting a [[nodes|node]] triggers `applyFlowHighlight(id)`:

- Adds `flow-highlight` class to the world — all non-member nodes dim to `opacity 0.06`
- Member [[nodes]] get the `in-flow` class (full opacity)
- [[edges]] belonging to the highlighted component render at full opacity; others dim
- A brief **flash animation** plays when the highlight first activates or switches to a different flow

`Esc` or clicking the canvas background clears the highlight via `deselect()`.

> [!TIP] Tracing a pipeline
> Click any node in a busy graph to instantly isolate its pipeline. Click a node in a different flow to jump to that one without clearing first.

## Interaction with auto-layout

[[auto-layout]] uses flow index as a secondary sort key when ordering rows within a column — nodes of the same flow tend to cluster vertically, making the initial layout readable before the barycenter pass refines it.

## Related

- [[nodes]] — each node carries a `flow` property
- [[edges]] — edge colour is derived from the source node's flow
- [[auto-layout]] — flow index influences initial row ordering

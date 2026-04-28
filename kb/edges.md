---
title: Edges
aliases: [edge, connection, connections]
tags: [polyp, concept, ui]
---

# Edges

Directed connections from one [[nodes|node's]] output [[ports|port]] to another's input port, rendered as cubic bezier curves.

## Properties

| Property | Description |
|----------|-------------|
| `id` | Sequential — `e1`, `e2` … |
| `from` | Source node id |
| `to` | Target node id |

Edges are stored in `state.edges` as a `Map<id, {id, from, to}>`.

## Visual rendering

Each edge is drawn as a **cubic bezier** in [[canvas#World space|world space]]:

```
M x1 y1  C (x1+dx) y1,  (x2-dx) y2,  x2 y2
```

where `dx = max(40, |x2 - x1| × 0.5)`. This keeps horizontal connections straight and gives a gentle S-curve to steep diagonals.

Edges inherit the **source node's** [[flows|flow]] colour at full opacity (`0.82`). A selected edge glows with a drop-shadow filter.

### Disabled edges

If either endpoint [[nodes|node]] is disabled, the edge renders at `opacity × 0.45` with a dashed stroke (`4 3`). Topology is preserved.

## DAG enforcement

The graph is always a **directed acyclic graph**. `tryConnect(fromId, toId)` runs two guards before inserting an edge:

1. **Duplicate check** — if an edge `from → to` already exists, reject.
2. **Cycle check** (`wouldCreateCycle`) — walks downstream from `toId`; if it reaches `fromId`, the connection is blocked.

> [!WARNING] Silent rejection
> Failed connections produce no error message — the drag simply snaps back. This is intentional: in dense graphs, most rejected drags are accidental.

## Selecting an edge

Click (or tap) an edge to select it. The hit area is 10px wide (wider than the visible 1.5px stroke) for easier targeting. Selecting an edge deselects any selected node.

Selected edge info appears in the status bar: `edge e3 · n1 → n4`.

Delete a selected edge with `x`. This removes the edge and triggers a [[flows|flow recompute]].

## Creation

Edges are created by dragging from a [[ports|port]]. See [[ports#Port drag]] for the full mechanic.

## Related

- [[nodes]] — the things edges connect
- [[ports]] — where edges attach
- [[flows]] — colour is derived from the source node's flow
- [[auto-layout]] — re-runs after every edge mutation

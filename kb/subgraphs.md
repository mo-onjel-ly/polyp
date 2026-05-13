---
title: Subgraphs
aliases: [subgraph, graph, graphs panel, universe, multi-graph, workspace, view]
tags: [polyp, concept, ui, design]
---

# Subgraphs

## The universe model

There is one global graph — the **universe** — containing every [[nodes|node]] and [[edges|edge]] ever created. It is the single source of truth. A **subgraph** is not a separate graph; it is a named *membership set* — a `Set<nodeId>` that says which universe nodes participate in this view.

```
Universe
  state.nodes  Map<id, Node>   ← all nodes
  state.edges  Map<id, Edge>   ← all edges

Subgraph = {
  id:      string          (sg1, sg2 …)
  name:    string
  nodeIds: Set<nodeId>     ← membership — subset of universe nodes
}

state.subgraphs         Map<id, Subgraph>
state.activeSubgraphId  'universe' | subgraphId
```

---

## Universe view

`activeSubgraphId = 'universe'` is a sentinel — not a Subgraph object — meaning "show all nodes and all edges." It is always the first item in the graphs panel, always available, and cannot be deleted.

---

## Subgraph view

When a subgraph is active:

- **Visible nodes**: `subgraph.nodeIds` — only these render on the canvas; others get `display: none`
- **Visible edges**: only edges where **both** endpoints are in `subgraph.nodeIds`
- **Counts**: topbar `nodes: N` and `edges: N` reflect the visible counts, not universe totals
- **Flow coloring** and **auto-layout** operate on visible nodes only

---

## Node transclusion

A node can belong to **multiple subgraphs simultaneously**. It is the same object — same id, config, title, status — rendered in each subgraph view. Editing it anywhere updates it everywhere. This is transclusion in the Xanadu/wiki sense: inclusion by reference, not by copy.

> [!EXAMPLE] Demo transclusion in the seed graph
> `a3` ("parse stack traces") appears in both **log pipeline** and **user analytics**. The log pipeline feeds into it; the user analytics pipeline also reads its output. It's one node existing in two contexts at once.

---

## Edge constraints

| Context | Edge creation |
|---------|--------------|
| Universe view | Unrestricted — connect any two nodes |
| Subgraph view | Both endpoints must be in `subgraph.nodeIds`; cross-subgraph edges are blocked |

Cross-subgraph edges that were created via the universe view (or programmatically in seed) are valid in the universe and visible there. They are simply hidden when viewing a subgraph where one endpoint is absent.

> [!NOTE] Roadmap
> Drawing edges between nodes from *different* subgraphs while inside a subgraph view is on the roadmap — see [[roadmap#Milestone 2]].

---

## Node creation

| Active view | Where node lands |
|------------|-----------------|
| Universe | Universe only — visible in no subgraph until explicitly added |
| Subgraph | Universe **and** `subgraph.nodeIds` — immediately visible in current view |

---

## Node deletion

Deleting a node removes it from the universe **and** from all subgraph `nodeIds` sets. No stale membership references remain.

---

## Graphs panel

Collapsible left panel, 200px wide, closed by default.

| Control | Action |
|---------|--------|
| `g` key | Toggle panel open/close |
| `/panel` in [[ui-ideas#Command palette\|command palette]] | Toggle panel |
| Click item | Switch to that subgraph |
| Double-click item name | Inline rename |
| `×` button (hover) | Delete subgraph (universe cannot be deleted) |
| `+` button | Create new subgraph (prompts inline rename) |

When the panel opens, the [[canvas]] shifts right by 200px. Both animate at 180ms cubic-bezier.

### Panel items

```
graphs
──────────────────
  universe      13   ← always first, italic
  log pipeline   6
▶ user analytics 5   ← active (green left border)
  surveillance   3
  ──────────────
  +              ← new graph
```

The count badge shows node count for that subgraph (universe shows total).

---

## Design rationale

**Why a membership-set model rather than separate graphs?**

Separate graphs would mean duplicating nodes that logically belong to multiple domains. The membership-set model keeps one source of truth: a node's config, title, and status exist once, and any number of views can include it. This also means cross-domain connections (edges between subgraphs) are a natural consequence of the universe, not a special case.

**Why "universe" rather than "all graphs" or "default"?**

"Universe" communicates that this is the complete set — not just a fallback or a default. It grounds the mental model: subgraphs are selections *from* something larger.

**Why subgraphs as views rather than workspaces?**

A workspace model implies isolation — changes in one workspace don't affect others. A view model implies shared state — any change to a node is reflected everywhere it appears. The view model is more powerful and more honest about what's happening.

---

## Related

- [[nodes]] — the objects that subgraphs reference
- [[edges]] — visibility filtered by subgraph membership
- [[graph-view]] — rendering layer that applies the visibility filter
- [[chrome]] — topbar counts reflect visible nodes/edges
- [[feature-ideas]] — cross-subgraph edge creation (roadmap)

---
title: View specs
aliases: [view spec, view slot, freeform layout, manual layout, V1, V2, V3]
tags: [polyp, concept, design]
---

# View specs

Three named slots (**V1 / V2 / V3**) for independent freeform layouts of the graph. Only active when [[auto-layout]] is off.

## What a spec stores

```js
{
  positions: Map<nodeId, {x, y}>,  // per-node world coordinates
  pan:  { x, y },                  // canvas pan offset
  zoom: number,                    // zoom level
}
```

`state.viewSpecs[0..2]` — `null` until first visited. `state.activeView` (0-based) tracks the current slot.

## Interaction model

| Action | Effect |
|--------|--------|
| `v` | Cycle forward: V1 → V2 → V3 → V1 |
| Click dot button (topbar) | Jump to that slot directly |
| Toggle [[auto-layout]] on | Commits current spec, applies computed layout |
| Toggle [[auto-layout]] off | Restores active spec |

The dot buttons (1 / 2 / 3) and the status bar **V1** indicator are hidden while auto-layout is on.

## Copy-on-first-visit

> [!INFO] Design decision
> An uninitialised slot (`null`) is populated by `captureViewSpec()` from the **current live state** the first time you navigate to it. Switching to a new slot starts as an exact copy — you diverge from there by dragging [[nodes]], panning, or zooming.
>
> The rejected alternative (start blank / all nodes at origin) would force the user to re-lay-out every node from scratch, which is disorienting when the goal is to explore a second arrangement while preserving the first as a reference.

## Commit semantics

Specs are **committed lazily** — not on every drag.

`commitActiveViewSpec()` is called before leaving the current slot:

```
cycle specs:         commit current  →  change index  →  apply new
auto-layout ON:      commit current  →  applyAutoLayout()
auto-layout OFF:     applyViewSpec(active)
```

> [!NOTE] Why lazy?
> Eager commit on every drag would be technically equivalent but costs a full `Map` copy per pointer event — unnecessary because the spec system never reads mid-drag.

## Interaction with auto-layout

[[auto-layout]] and view specs are orthogonal. Auto-layout overwrites node positions with computed values; view specs save and restore freeform positions around layout sessions.

> [!IMPORTANT]
> `commitActiveViewSpec()` is always called **before** `applyAutoLayout()`. This guarantees no freeform state is lost when entering computed layout.

This replaces the original `n.freeX / n.freeY` per-node stash, which only supported a single freeform state.

## Node lifecycle

| Event | Spec behaviour |
|-------|---------------|
| Node **created** | Not added to specs until next commit (stays at creation position) |
| Node **deleted** | Removed from `spec.positions` across all three slots immediately |

> [!NOTE] New-node position across specs
> A node created in V1 won't appear in V2's position map until V2 is next committed. Until then it sits at its creation position in V2 — which is fine, as it will be snapped into the spec on the next cycle.

## Future directions

- [ ] **Named slots** — replace number labels with editable names stored in the spec object
- [ ] **More slots** — `SPEC_COUNT` constant to drive loop bounds and dot buttons
- [ ] **Persistence** — serialise `state.viewSpecs` + `state.activeView` as part of a save-to-disk format (future file I/O)

## Related

- [[auto-layout]] — commits/restores specs on toggle
- [[canvas]] — each spec stores pan + zoom
- [[nodes]] — positions are per-node world coordinates
- [[keyboard-shortcuts]] — `v` and `a` keys

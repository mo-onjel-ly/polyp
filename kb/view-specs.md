# View specs — design notes

## What a view spec is

A view spec is a named snapshot of the visual presentation of the graph in
**freeform (manual) mode**. It stores everything needed to reproduce the
visual state exactly:

- `positions` — `Map<nodeId, {x, y}>` for every node
- `pan` — `{x, y}` canvas pan offset
- `zoom` — zoom level

Three slots exist (`state.viewSpecs[0..2]`). The active slot index is
`state.activeView` (0-based).

## Interaction model

- `v` cycles forward through the three slots (wraps around).
- The topbar shows three numbered dot-buttons (1 / 2 / 3); clicking one
  jumps directly to that slot. Both controls are hidden when auto-layout
  is on, because auto-layout positions are computed and not per-spec.
- The status bar shows "V1" / "V2" / "V3" when in freeform mode.

## Copy-on-first-visit

An uninitialised slot (`null`) is populated by `captureViewSpec()` from the
current live state the first time you navigate to it. This means switching to
a new slot starts as an exact copy of what you were looking at — you diverge
from there by dragging nodes, panning, or zooming.

The alternative (start blank / all nodes at origin) was rejected because it
would require the user to immediately lay out every node from scratch, which
is disorienting when you just want to preserve the current view as a
reference while exploring a second arrangement.

## Commit semantics

Specs are committed lazily, not on every drag:

- `commitActiveViewSpec()` is called before **leaving** the current slot
  (either by cycling specs or by switching to auto-layout).
- On cycle: commit current → change index → apply new spec.
- On auto-layout ON: commit current → run computed layout.
- On auto-layout OFF: apply the active spec (which was already committed
  before auto-layout was entered).

Eager commit on every drag would be technically equivalent but costs a full
`Map` copy per pointer event, and is unnecessary because the spec system
never reads mid-drag.

## Interaction with auto-layout

Auto-layout and view specs are orthogonal. Auto-layout overrides node
positions with computed values. The view spec system saves and restores
freeform positions around auto-layout sessions:

```
user presses 'a' (auto ON):
  commitActiveViewSpec()   ← saves freeform state
  applyAutoLayout()        ← overwrites node x/y

user presses 'a' (auto OFF):
  applyViewSpec(activeSlot) ← restores freeform state
```

This replaces the original `n.freeX / n.freeY` stash mechanism, which only
supported a single freeform state. The old `restoreFreeformLayout()` function
is kept as a dead-code fallback but is no longer reached under normal
operation.

## Node creation and deletion

- **Creation**: new nodes are placed at computed positions and recorded in
  `state.nodes`. They are not immediately added to all specs. They appear in
  a spec when that spec is next committed (on cycle or auto-layout toggle).
  Until then, they sit at their creation position in every spec — harmless.
- **Deletion**: `deleteNode` removes the id from `spec.positions` across all
  three slots to prevent stale position data from resuracing if an id is
  ever reused.

## Future directions

- **Naming specs**: replace the number labels with editable names stored in
  the spec object.
- **More slots**: the count (3) is hardcoded in the loop bounds and the dot
  buttons. To make it dynamic, drive both off a `SPEC_COUNT` constant.
- **Persistence**: serialise `state.viewSpecs` and `state.activeView` as part
  of a save-to-disk format (future file I/O work).

# CHANGELOG

Conceptual revisions of the flowgraph prototype. Each revision was built
on top of the previous one. Only `rev 7` exists as a file in this bundle;
earlier revisions are documented here textually.

---

## rev 1 — initial prototype

**Goal:** Compact dark-mode flowchart node-link UI with vim navigation,
canvas pan, port-drag-to-create-children, and DAG flow visualization.

**What was built:**
- Single self-contained HTML file with no dependencies
- 88px square nodes with three rows: header (type + status), title
  (2-line clamp), footer (id + config summary)
- Two node types: `script` (custom code) and `lens` (view/filter/transform)
- Flow coloring: 6-hue palette assigned by root walk; downstream nodes
  inherit the lowest-indexed parent flow at DAG joins
- Edge rendering as bezier curves with the source node's flow color
- Drag node body to move; drag from out-port to canvas to spawn a child
  with edge pre-wired; drag port-to-port to connect
- Cycle prevention in `tryConnect` (downstream walk before accepting edge)
- Click empty canvas + drag = pan; mouse wheel = zoom
- Floating inspector positioned next to the clicked node (auto-flips
  to the side with more room)
- Vim navigation: `h j k l` moves selection by directional scoring
  (alignment × 3 + distance), `Enter` opens inspector, `Esc` deselects,
  `n` = new script, `N` = new lens, `x` = delete, `c` = connect mode (stub),
  `f` / `0` = reset view
- Status indicators (idle / ok / warn / run with pulse animation)
- Demo seed graph: 3 flows (A: 4-node chain; B: 2 nodes joining into A;
  C: 1 → 1 → 2 branch)

---

## rev 2 — touch support

**User request:** "Drag and drop should also work with touchscreen."

**What changed:**
- Introduced a single `onPointerDrag(el, {onStart, onMove, onEnd})`
  helper that wraps both mouse and touch events, returning unified
  `{x, y}` points
- Wrapped all three drag sites (node body, ports, canvas pan) in this
  abstraction so mouse/touch behavior is identical
- Added `touch-action: none` on canvas and nodes to prevent the browser
  from hijacking gestures with scroll/pinch-zoom
- Expanded port hit area via `::after` pseudo-element (10–14px beyond
  visible port) so fingers can hit them
- `@media (pointer: coarse)` makes the visible port grow from 9px to 12px
  on touch devices
- Two-finger pinch-zoom on canvas, with anchor math that keeps the
  midpoint of the two fingers locked over the same world point
- Edge selection touch-aware (`touchstart` listener added)
- Tap/drag disambiguation uses 3px movement threshold; tap opens inspector

---

## rev 3 — two-stage activation + centered inspector

**User request:** "The popup editor should show after two clicks/touches/
enters center on the screen. First time should just highlight the current
workflow and nodes and dim the others."

**What changed:**
- New `getFlowMembers(id)` walks edges in both directions to find the
  full connected component containing the selected node
- New `applyFlowHighlight(id)` adds `.flow-highlight` to world and
  `.in-flow` to component members
- CSS dims non-flow nodes to opacity 0.22 with `saturate(0.3)`
- Non-flow edges dim to opacity 0.12
- First tap on node = select + flow highlight (no inspector)
- Second tap on already-selected node = open inspector
- Inspector repositioned: centered on screen via `left: 50%; top: 50%;
  transform: translate(-50%, -50%)`, with translucent backdrop
  (`backdrop-filter: blur(2px)`) and dark overlay
- Backdrop click closes inspector
- Pan now preserves selection + flow highlight (only canvas tap clears)
- Two-stage `Enter` key: nothing selected → pick top-leftmost; selected
  → open inspector
- Two-stage `Esc`: inspector open → close inspector; otherwise → deselect

---

## rev 4 — enable/disable + compact + auto-layout

**User request:** "Add enable or disable option to each node. And show
indicator on node. Can you make the nodes somehow more compact? And add
option to the canvas to 'auto-layout' that can be toggled to switch
between freeform layout like now, and a compact auto layout?"

**What changed:**

*Enable/disable:*
- Every node has `enabled: true|false` (default true)
- Press `d` to toggle selected node, or click pill toggle in inspector
- Disabled nodes: opacity 0.55, dashed flow stripe, strikethrough title,
  empty-ring indicator dot in header
- Edges to/from disabled nodes: dashed, ~45% dimmer

*Compact nodes:*
- `--node-size: 72px` (was 88px) — 33% area reduction
- 3 rows became 2.5: header now packs `TYPE · id · enabled-dot · status`
  on one line; title gets 3-line clamp; slim footer shows just config
  summary (lang/op)
- Tighter padding throughout, smaller font sizes (8–11px)

*Auto-layout:*
- `computeAutoLayout()` does Kahn topological sort to assign column
  ranks; barycenter-pass sorts rows within each column to reduce edge
  crossings (2 iterations)
- `applyAutoLayout()` stashes `freeX/freeY` on first run so toggling
  off restores exact freeform positions
- `maybeReflow()` called after every graph mutation
  (`createNode`, `deleteNode`, `tryConnect`, edge-delete)
- Node dragging suppressed in auto-layout mode (taps still work)
- `a` keyboard shortcut + topbar button toggle
- `.world.layout-anim` class adds 240ms eased CSS transition on `left`/`top`
  during mode switches

---

## rev 5 — overlap fixes + stack visualization + port-drag threshold

**User request:** "In auto-layout mode, nodes are overlapping. That
shouldn't happen. And if things are overlapping in manual layout mode,
show them like a stack, so there are visual cues of overlap without it
getting too messy. And only start drag to create new node after dragging
has started. It's hard to just touch a node to select it."

**What changed:**

*Auto-layout overlap:*
- Each column now centers against a shared vertical axis based on the
  tallest column (was: each column self-centered, causing visual zigzag)
- Defense-in-depth collision sweep: any two positions hashing to the
  same key get bumped down by `ROW_GAP`

*Stack visualization (freeform):*
- `updateStackCues()` clusters overlapping nodes via union-find
  (threshold: centers within 55% of NODE_SIZE on both axes)
- Each cluster member fans out diagonally with `--stack-offset`
  (4px per position), gets layered box-shadows suggesting cards behind
- Topmost card gets a count badge (white circle, bg-colored text)
- Stacks evaluated on drop, not during drag; dragging node temporarily
  exits its stack so it tracks cursor cleanly
- Called from `maybeReflow`, drag end, `restoreFreeformLayout`, and
  initial seed

*Port-drag threshold:*
- Port `onStart` no longer commits to drag immediately
- Threshold: 6 pixels of screen movement before `beginPortDrag` fires
- Tap on port without movement falls through to same two-stage
  node tap logic (first = select, second = expand)
- Makes ports forgiving for touch (their hit zones extend 10–14px
  beyond visible)

---

## rev 6 — camera node + stronger highlight

**User request:** "Add a new node type: camera. Also it seems like the
select workflow to highlight stopped working?"

**What changed:**

*Highlight regression investigation:*
- Built jsdom-based test harness; programmatically clicked nodes and
  inspected computed styles
- Confirmed: classes were being applied correctly, CSS specificity
  resolving correctly, dimming was happening (n7 opacity went to 0.22)
- Diagnosis: dimming was too subtle to read as "highlight" against the
  dark background. Not a regression — just insufficient contrast

*Stronger highlight:*
- Non-flow nodes: opacity 0.12 (was 0.22) + `saturate(0.15) brightness(0.7)`
- Non-flow edges: opacity 0.06 (was 0.12)
- Added 450ms colored-glow flash on in-flow nodes when highlight first
  activates (or switches flows), via `.world.flow-highlight.flash` class
  with `flowFlash` keyframe animation

*Camera node type:*
- Added to `NODE_TYPES` with 5 config fields: `source` (default / webcam:0
  / webcam:1 / rtsp / file / screen), `resolution` (320×240 → 4K), `fps`
  (1/5/15/30/60), `mode` (stream / snapshot / motion / interval),
  `trigger` (continuous / on-motion / on-signal / manual)
- `m` keyboard shortcut to spawn one
- Seed graph extended with flow D: `front door cam → detect & crop →
  recent visitors`

---

## rev 7 — final polish

**What changed:**
- Refactored footer rendering into `nodeFootText(node)` helper so
  future node types don't need to touch `renderNode` and
  `refreshNodeEl` separately
- Footer text resolves: script → lang, lens → op, camera → mode

This is the version in `revisions/flowchart-rev7-final.html`.

---

## Known unimplemented ideas discussed in conversation

- More node types: `source`, `sink`, `merge`, `const`, `branch`
- Typed ports (different colors for different data shapes)
- Multiple input ports per node
- Flows as first-class named entities (rename, recolor)
- Subgraph / collapsible group boxes
- Animated data flowing along edges during node execution
- Undo/redo (Cmd-Z / Cmd-Shift-Z)
- Save/load graph as JSON
- Long-press on empty canvas → node-type picker (touch parity for `n`/`N`/`m`)
- Mobile breakpoint for topbar (hint text overflows on phones)
- Arrowheads on edges
- Real backend for executing script/camera nodes (Python or Node)

## Known minor debts in rev 7

- `c` (connect mode) keybinding exists but does nothing meaningful
- `1` keybinding to cycle node type is half-broken
  (`refreshNodeEl(node => node.id === n.id)` passes a function instead
  of a node)
- `uid` helper function defined but never used

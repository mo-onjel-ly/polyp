---
title: UI chrome — topbar and statusbar
aliases: [chrome, topbar, statusbar, toolbar, bars, status bar, top bar, bottom bar]
tags: [polyp, concept, ui, reference]
---

# UI chrome

The two fixed bars that frame the [[canvas]]. Neither scrolls or resizes; the canvas fills everything between them.

```
┌─ topbar (32px) ──────────────────────────────────────────────────────┐
│ ◆ FLOWGRAPH │ graph · untitled  nodes: N  edges: N │ [auto] [anchor] │ [1 2 3]          hints │
└──────────────────────────────────────────────────────────────────────┘
  (canvas)
┌─ statusbar (22px) ────────────────────────────────────────────────────┐
│ MODE  selection info                       zoom%  Vn  pan x,y  ⏺ N  │
└───────────────────────────────────────────────────────────────────────┘
```

---

## Topbar

Height: **32px**. Background: subtle vertical gradient `#0d0e12 → #0a0b0d`. Bottom border: `1px var(--line)`. On macOS the topbar is the native window drag region (`-webkit-app-region: drag`); buttons inside opt out with `no-drag`.

Layout left → right:

| Slot | Element | Notes |
|------|---------|-------|
| Brand | `◆ FLOWGRAPH` | Green `◆` diamond + uppercase spaced wordmark. Static. |
| Sep | `│` | 1px hairline. |
| Graph meta | `graph · untitled` | Hardcoded for now; will become editable graph name. |
| Node count | `nodes: N` | Live count, updates on every create/delete. |
| Edge count | `edges: N` | Live count, updates on every edge add/remove. |
| Sep | `│` | |
| Auto-layout btn | `▤ auto-layout` | Toggles computed [[auto-layout]]. Filled/inverted when **on**. Shortcut: `a`. |
| Anchor btn | `MANUAL` / `TOP-LEFT` / `CENTER` | Cycles [[canvas#Canvas anchor mode\|anchor mode]]. Filled when not MANUAL. Min-width 72px so label changes don't shift the toolbar. |
| Sep | `│` | |
| View spec dots | `1  2  3` | Jump to [[view-specs\|view spec]] slot. Active dot inverts. **Hidden while auto-layout is on.** |
| Spacer | — | Pushes hints to the far right. |
| Hint bar | `h j k l nav · ↵ · n · d · a · v · x · esc` | Muted keyboard quick-reference. Not interactive. |

> [!NOTE] macOS traffic lights
> With `titleBarStyle: 'hiddenInset'` the topbar also hosts the system close/minimise/zoom buttons (inset at x=12, y=8). `padding-left` uses `env(titlebar-area-x, 80px)` to avoid overlap.

---

## Statusbar

Height: **22px**. Background: `#0c0d11`. Top border: `1px var(--line)`. Font: 10px, `letter-spacing: 0.04em`.

Layout left → right:

| Slot | Element | Live? | Notes |
|------|---------|-------|-------|
| Mode | `NORMAL` | ✓ | Current interaction mode. See below. |
| Selection | `—` | ✓ | Info about the selected node or edge. See below. |
| Spacer | — | | |
| Zoom | `100%` | ✓ | Current zoom level (`state.zoom × 100`, rounded). |
| View spec | `V1` | ✓ | Active [[view-specs\|view spec]] slot. **Hidden while auto-layout is on.** |
| Pan | `0, 0` | ✓ | Current pan offset in world pixels (`state.pan.x, state.pan.y`, rounded). |
| Rec | `⏺ N` | ✓ | Count of recorded [[user-action-tracking\|action log]] events. Red. Click to download JSONL. |

### Mode indicator

Reflects `state.mode`. Colour encodes urgency:

| Value | Display | Colour |
|-------|---------|--------|
| `normal` | `NORMAL` | `--ok` (green) |
| `connect` | `CONNECT` | `--f1` (amber) — flow colour 1 |
| `drag` | `DRAG` | default text |
| `port-drag` | `PORT-DRAG` | default text |
| `pan` | `PAN` | default text |

### Selection info

| State | Display |
|-------|---------|
| Nothing selected | `—` |
| Node selected | `n3 · script · fetch api logs` — id · type · title |
| Edge selected | `edge e5 · n1 → n4` — id · from → to |

---

## Design rationale

**Topbar is control + identity.** Everything interactive or graph-state-encoding lives here: mode toggles, view switching, graph metadata. The hint bar turns the topbar into a persistent cheat-sheet — new users can orient without opening docs.

**Statusbar is readout.** Pure information display. The user never needs to act on the statusbar directly (except the rec button). Zoom, pan, and mode give spatial and contextual grounding at a glance.

**Separation of concerns.** Controls are on top, readouts are on the bottom. Nothing crosses between. This mirrors the convention in most professional tools (DAWs, 3D editors, IDEs).

**Density over space.** Both bars are intentionally minimal in height (32px + 22px = 54px total out of the window). The canvas gets everything else.

---

## Related

- [[canvas]] — the space between the bars
- [[view-specs]] — the V1/V2/V3 dots and indicator
- [[auto-layout]] — the auto-layout toggle button
- [[user-action-tracking]] — the `⏺ N` rec indicator
- [[keyboard-shortcuts]] — the shortcuts hinted in the topbar

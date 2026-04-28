---
title: UI / UX ideas
aliases: [ui ideas, ux ideas, interaction ideas, ui history]
tags: [polyp, design, feature]
---

# UI / UX ideas

A running log of UI/UX concepts: when they were introduced, how they evolved, whether they shipped, changed, or were cut. Useful for understanding *why* the interface looks and behaves the way it does.

> [!TIP] How to use this doc
> Each idea has a status badge and a history section. When an idea ships, changes, or is removed, add an entry to its history rather than rewriting — the trail of reasoning matters as much as the current state.

---

## Command palette

**Status**: `shipped` · 2026-04-28
**Key**: `cmd+p` (macOS) / `ctrl+p` (Windows/Linux)

### What it is

A floating input box that appears centred on screen, Raycast / Spotlight style. Dark glass panel, monospace, animated in/out (scale + fade, 160ms).

- **Repeat shortcut** or **`Esc` (empty input)** → close
- **`Esc` (non-empty input)** → clear input first, close on second `Esc`
- **`Shift+Enter`** → send input as toast notification (push-up)
- **`Cmd/Ctrl+Shift+Enter`** → send input as toast notification (push-down)
- Backdrop click → close

### Current scope

In this iteration the palette is purely an **input surface for toast messages** — a way to explore the notification stack mechanic. It has no command dispatch logic yet. The placeholder text reads "type something…" to reflect this.

> [!IDEA] Future scope
> The palette is the natural home for a command dispatch system: "add node", "jump to n12", "switch to V2", "toggle layout", "export graph". See [[feature-ideas#Near-term]] for the command-palette item.

### Design references

- **Raycast** (`option+space`) — scale + fade, instant, keyboard-first
- **Spotlight** (`cmd+space`) — centered, dark
- **Notion** (`ctrl+p` / `cmd+p`) — inline, contextual commands
- **VS Code** (`cmd+shift+p`) — full command dispatch, fuzzy search

### History

| Date | Change |
|------|--------|
| 2026-04-28 | Initial implementation — input only, no dispatch; `cmd/ctrl+p` toggle, `Esc` two-stage clear/close, toast integration |

---

## Toast notifications

**Status**: `shipped` · 2026-04-28
**Source**: populated from [[#Command palette]]

### What it is

A stack of notification cards in the **bottom-right corner** of the screen (above the status bar). Each toast shows text content with a coloured left-border indicating push direction, plus a close button. Auto-dismiss after 8 seconds.

### Two push directions

The push direction is not purely cosmetic — it encodes **intentionality**:

| Shortcut | Direction | Left border | Metaphor |
|----------|-----------|-------------|---------|
| `Shift+Enter` | **Push up** | green (`--ok`) | "Add to queue — normal priority" |
| `Cmd/Ctrl+Shift+Enter` | **Push down** | amber (`--warn`) | "Interrupt — this is notable" |

**Push up** (`Shift+Enter`): new toast appended at the bottom of the stack. The container is anchored at `bottom: 30px`, so the flex column grows upward — existing toasts naturally rise. The stack is LIFO with the newest at the bottom.

**Push down** (`Cmd/Ctrl+Shift+Enter`): new toast prepended at the top. Existing toasts receive a brief downward nudge animation (15% of their height, 180ms ease) to signal "you've been pushed down." The new toast arrives from the right.

### Visual design

- Dark glass (`rgba(12,13,16,0.96)`) + `backdrop-filter: blur(10px)`
- `border: 1px solid var(--line-hi)` with coloured left edge
- `max-width: 340px` — wide enough for a sentence, narrow enough to stay out of the way
- Slide-in from right (`translateX` → `translateX(0)`)
- Slide-out to right on dismiss or after 8s timeout

### Open questions

> [!QUESTION] Should toasts show a timestamp?
> Current: no timestamp — just text and close button. Would "2s ago" be useful at this stage? Probably only once toasts have more structured content.

> [!QUESTION] Maximum stack depth?
> Currently unbounded. Should we cap at 5 and auto-dismiss the oldest when a 6th arrives?

> [!QUESTION] Should push-down toasts have higher visual priority?
> Currently they're visually almost identical to push-up except the border colour. Could consider a brighter background or bolder text for push-down.

### History

| Date | Change |
|------|--------|
| 2026-04-28 | Initial implementation — two push directions, green/amber border, 8s auto-dismiss, slide-in/out from right |

---

## Two-stage node activation

**Status**: `shipped` · 2026-04-27 (pre-history)

### What it is

Clicking a node twice (or pressing `Enter` on a selected node) opens the [[inspector]]. The first click only selects + highlights the flow.

### Why two stages?

In a dense graph, single-click-to-open would make the inspector pop up constantly during navigation. The two-stage model lets you scan the graph by clicking nodes to highlight flows without accidentally opening inspectors everywhere.

The same logic applies to port taps — a port tap that doesn't move far enough to commit a [[ports#Port drag|port drag]] falls through to node selection, not inspector open.

### History

| Date | Change |
|------|--------|
| 2026-04-27 | Implemented in original prototype |

---

## Flow highlight + flash

**Status**: `shipped` · 2026-04-27 (pre-history)

### What it is

Selecting a node dims all nodes and edges outside its [[flows|connected component]] to near-opacity-zero. A brief glow-flash (450ms) fires on the in-flow nodes when the highlight first activates.

### Design notes

The dimming was intentionally made aggressive (non-flow opacity: 0.06 for edges, slightly more for nodes + brightness/saturation filter). An earlier iteration at 0.22 opacity was "too subtle to read on a dark background" (per original chat-log).

The flash prevents the highlight from feeling instantaneous and cold — it gives the activation a physical feeling.

### History

| Date | Change |
|------|--------|
| 2026-04-27 | Initial implementation at opacity 0.22 — too subtle |
| 2026-04-27 | Increased to 0.12 nodes / 0.06 edges + brightness/saturation filter + 450ms flash |

---

## View spec dot buttons

**Status**: `shipped` · 2026-04-27

### What it is

Three numbered dot-buttons (`1` `2` `3`) in the topbar, showing the active [[view-specs|view spec]] slot. Click to jump; `v` to cycle. Hidden when [[auto-layout]] is on.

### Design notes

Deliberately compact (18×18px) and secondary to the auto-layout button. They carry state (which slot is active) but aren't the primary interaction surface — `v` is faster than reaching for the mouse.

The active dot inverts (dark text on white fill) to distinguish from inactive.

### History

| Date | Change |
|------|--------|
| 2026-04-27 | Initial implementation — 3 fixed slots, numbered dots, hidden in auto-layout mode |

---

## Stack cues (overlap fan)

**Status**: `shipped` · 2026-04-27 (pre-history)

### What it is

When nodes overlap in freeform mode, they fan out diagonally (~4px offset per layer) and show a count badge on the topmost card. See [[stack-cues]] for full technical detail.

### Design notes

The alternative (preventing overlap entirely by snapping to grid) was rejected in favor of the stacking metaphor. Intentional stacking can be useful — grouping related nodes spatially without creating edges. The fan + badge makes structure visible without hiding anything.

### History

| Date | Change |
|------|--------|
| 2026-04-27 | Initial implementation in original prototype |

---

## Related

- [[design-concepts]] — broader design explorations
- [[feature-ideas]] — actionable next steps for these ideas
- [[decisions]] — engineering decisions for shipped features
- [[keyboard-shortcuts]] — current shortcut reference

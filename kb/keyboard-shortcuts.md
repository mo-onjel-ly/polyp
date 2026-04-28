---
title: Keyboard shortcuts
aliases: [shortcuts, keybindings, hotkeys, keys]
tags: [polyp, reference]
---

# Keyboard shortcuts

Active when focus is on the [[canvas]] (not inside an [[inspector]] form field). Inside an inspector field, only `Esc` is intercepted.

## Global (always active)

| Key | Action |
|-----|--------|
| `cmd+p` (macOS) / `ctrl+p` | Toggle [[ui-ideas#Command palette\|command palette]] |

## Navigation

| Key | Action |
|-----|--------|
| `h` | Move selection left |
| `j` | Move selection down |
| `k` | Move selection up |
| `l` | Move selection right |
| `Enter` | Nothing selected → select top-left-most [[nodes\|node]]<br>Node selected → open [[inspector]] |
| `f` or `0` | Reset [[canvas#Pan\|pan]] and [[canvas#Zoom\|zoom]] to defaults |
| `Esc` | [[inspector]] open → close it; otherwise deselect all |

> [!NOTE] Direction scoring
> `hjkl` use a weighted score: `secondary_distance × 3 + primary_distance`. This heavily favours axis-aligned neighbours, making navigation feel grid-like even in freeform layouts.

## Creating nodes

| Key | Spawns | Auto-connects? |
|-----|--------|----------------|
| `n` | `script` [[nodes\|node]] | Yes, if a node is selected |
| `N` | `lens` [[nodes\|node]] | Yes |
| `m` | `camera` [[nodes\|node]] | Yes |

New nodes spawn to the right of the selected node (if any), or at the canvas centre.

## Editing

| Key | Action |
|-----|--------|
| `x` | Delete selected [[nodes\|node]] (and its [[edges]]) or selected [[edges\|edge]] |
| `d` | Toggle enable / disable on selected node |
| `c` | Toggle connect mode (cursor → crosshair) |

## Layout

| Key | Action |
|-----|--------|
| `a` | Toggle [[auto-layout]] on / off |
| `v` | Cycle [[view-specs\|view spec]] (V1 → V2 → V3 → V1) — freeform only |

## Command palette (while open)

| Key | Action |
|-----|--------|
| `Shift+Enter` | Send text as [[ui-ideas#Toast notifications\|toast]] (push up — green border) |
| `Cmd/Ctrl+Shift+Enter` | Send text as toast (push down — amber border) |
| `Esc` (non-empty input) | Clear input |
| `Esc` (empty input) | Close palette |
| `Cmd+p` / `Ctrl+p` | Close palette |

## Inspector shortcuts (while open)

| Key | Action |
|-----|--------|
| `Esc` | Close [[inspector]], return focus to canvas |
| `d` | Toggle enable / disable |
| `x` | Delete node and close |

## Mouse & trackpad

| Gesture | Action |
|---------|--------|
| Scroll wheel | [[canvas#Zoom\|Zoom]] centred on cursor |
| Drag canvas background | [[canvas#Pan\|Pan]] |
| Middle-button drag | Pan |
| Drag node body | Move node (disabled in [[auto-layout]] mode) |
| Click node | Select + highlight [[flows\|flow]] |
| Second click on selected node | Open [[inspector]] |
| Click edge | Select [[edges\|edge]] |
| Drag output [[ports\|port]] → node | Connect |
| Drag input port → node | Connect (reversed) |
| Drag port → empty canvas | Create + connect new `script` node |

## Touch

| Gesture | Action |
|---------|--------|
| Single-finger drag | [[canvas#Pan\|Pan]] |
| Pinch | [[canvas#Zoom\|Zoom]] centred on midpoint |
| Tap node | Select (1st tap) / open [[inspector]] (2nd tap) |
| Drag node | Move node |
| Drag port | Same as mouse port drag → see [[ports#Port drag]] |

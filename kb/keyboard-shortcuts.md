# Keyboard shortcuts

Shortcuts are active when focus is on the canvas (not inside an inspector
form field). Inside an inspector field, only `Esc` is intercepted.

## Navigation

| Key | Action |
|-----|--------|
| `h` | Move selection left (nearest node in that direction) |
| `j` | Move selection down |
| `k` | Move selection up |
| `l` | Move selection right |
| `Enter` | If nothing selected: select the top-left-most node. If a node is selected: open its inspector |
| `f` or `0` | Reset view (pan 120,80 / zoom 100%) |
| `Esc` | Close inspector if open; otherwise deselect everything |

Direction keys use a weighted scoring function: primary axis distance +
3× secondary axis distance. This heavily favours nodes that are aligned on
the target axis, making `hjkl` feel like navigating a grid even in freeform
layouts.

## Creating nodes

| Key | Action |
|-----|--------|
| `n` | New `script` node (spawns adjacent to selection, or at view centre) |
| `N` | New `lens` node |
| `m` | New `camera` node |

If a node is currently selected, the new node is placed to its right and
auto-connected (output of selected → input of new).

## Editing

| Key | Action |
|-----|--------|
| `x` | Delete selected node (and all its edges), or delete selected edge |
| `d` | Toggle enable/disable on selected node |
| `c` | Toggle connect mode (cursor changes to crosshair) |

## Layout

| Key | Action |
|-----|--------|
| `a` | Toggle auto-layout on / off |
| `v` | Cycle to next view spec (V1 → V2 → V3 → V1); only active when auto-layout is off |

## Inspector (while open)

| Key | Action |
|-----|--------|
| `Esc` | Close inspector and return focus to canvas |
| `d` | Toggle enable/disable on the open node |
| `x` | Delete the open node |

## Mouse / trackpad

| Gesture | Action |
|---------|--------|
| Scroll wheel | Zoom centred on cursor |
| Drag on canvas background | Pan |
| Middle-button drag | Pan |
| Drag node body | Move node (disabled in auto-layout mode) |
| Drag output port → node | Connect two nodes |
| Drag input port → node | Connect (reversed direction) |
| Drag port → empty canvas | Create new `script` node at drop position and connect |
| Click edge | Select edge |
| Click node | Select node + highlight its flow |
| Second click on selected node | Open inspector |

## Touch

| Gesture | Action |
|---------|--------|
| Single-finger drag on canvas | Pan |
| Pinch | Zoom centred on pinch midpoint |
| Tap node | Select (first tap) / open inspector (second tap) |
| Drag node | Move node |
| Drag port | Connect (same behaviour as mouse port drag) |

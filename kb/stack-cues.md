---
title: Stack cues
aliases: [stack cue, stack, stacked nodes, overlap, overlap visualization]
tags: [polyp, concept, ui]
---

# Stack cues

In freeform mode, [[nodes]] can be dragged on top of one another. Rather than hiding the collision, *stack cues* make the structure visible: overlapping nodes fan out diagonally, gain layered shadows, and show a count badge on the topmost card.

> [!NOTE] Auto-layout suppresses stacks
> [[auto-layout]] guarantees no overlaps, so stack cues are disabled whenever auto-layout is on.

## Overlap detection

`updateStackCues()` runs after every drag-drop and layout toggle. It uses a **quadratic sweep + union-find** to cluster nodes:

- Two nodes are considered overlapping if their positions are within **55% of node size** (≈40px) on both axes.
- Union-find groups all transitively overlapping nodes into a single cluster.

## Visual treatment

For each cluster with ≥ 2 members (sorted by creation order, earliest at bottom):

| Layer | Offset | Z-index |
|-------|--------|---------|
| Bottom (oldest) | 0px | 3 |
| +1 | 4px right, 4px down | 4 |
| +2 | 8px right, 8px down | 5 |
| … | … | … |

The **topmost card** (newest node) gets a **count badge** in its corner showing the total stack size.

> [!TIP] Working with stacks
> Intentional stacking can be useful in [[view-specs|view specs]] as a way to group related nodes spatially without creating [[edges|edges]] between them. Use the badge count to know how many nodes are underneath.

## Drag behaviour

When you start dragging a node out of a stack:
1. Its `stacked` class and offset are immediately removed so it follows the cursor cleanly.
2. Other stack members keep their offsets until the drag ends.
3. On drop, `updateStackCues()` re-evaluates all clusters from scratch.

## Related

- [[nodes]] — the things that stack
- [[auto-layout]] — suppresses stack cues
- [[view-specs]] — stacks are per-spec (each spec has independent positions)

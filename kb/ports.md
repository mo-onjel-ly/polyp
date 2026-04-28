---
title: Ports
aliases: [port, input port, output port, port drag]
tags: [polyp, concept, ui]
---

# Ports

Each [[nodes|node]] has two ports — small circles on its left and right edges.

| Port | Position | Role |
|------|----------|------|
| **Input** | Left-centre | Receives connections from upstream nodes |
| **Output** | Right-centre | Drives downstream nodes |

Port positions in [[canvas#World space|world space]]:

```js
input:  { x: node.x,            y: node.y + NODE_SIZE/2 }
output: { x: node.x + NODE_SIZE, y: node.y + NODE_SIZE/2 }
```

## Port drag

Dragging a port is the primary way to create [[edges]].

### Threshold

Movement under **6px** is not committed — it falls through to a normal node tap (select / [[inspector|open inspector]]). This makes ports forgiving on touch: fat-fingering the port edge still selects the node.

### Connection

```
drag output port → release on another node  →  connect (from → to)
drag input port  → release on another node  →  connect (to → from)
```

Direction is inferred from which port was dragged. [[edges#DAG enforcement|Cycle and duplicate guards]] apply; rejected drags snap back silently.

### Create-on-drop

Releasing a port drag on **empty canvas** (no target node) creates a new `script` [[nodes|node]] at the drop point and immediately connects it:

```
drag output port → release on empty canvas
  → createNode('script', dropX, dropY)
  → tryConnect(sourceNode.id, newNode.id)
```

> [!TIP]
> This is the fastest way to extend a pipeline — drag the output port of the last node into empty space.

### Ghost line

While a port drag is in progress, a **dashed ghost line** (`stroke-dasharray: 3 3`) tracks the cursor in the SVG layer to show where the edge would land.

## Related

- [[nodes]] — ports are part of node anatomy
- [[edges]] — port drags produce edges
- [[canvas]] — drag coordinates are converted between screen and world space

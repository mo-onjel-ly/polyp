---
title: Reactions
aliases: [likes, dislikes, curious, reactions, gut reactions]
tags: [polyp, design, vision]
---

# Reactions

Living record of gut reactions — what's working, what isn't, and what feels interesting but unresolved. Anything here can become a [[feature-ideas|feature idea]] or a [[design-concepts|design concept]] with more thought.

---

## Likes

### The flow highlight / dim mechanic
Clicking a node and having everything outside the connected component fade away is genuinely satisfying. The flash is just right — noticeable but not alarming. This is the signature interaction of the tool and it should stay central to the UX.

### The 72px node density
The compactness is a feature. Being able to see 20+ nodes without scrolling forces graph structure to be legible at the graph level, not just the node level. Most node tools are too spacious.

### Keyboard navigation feels native
`hjkl` navigation with alignment-weighted scoring means you almost never accidentally jump to the wrong node. It reads as "obvious" which means the heuristic is well-tuned.

### `layout-anim` CSS transition
The 240ms cubic-bezier transition when switching between auto-layout and freeform is small but meaningful. It shows what moved where, rather than just teleporting. This kind of micro-feedback is worth preserving and extending.

### The single-file architecture (for now)
The prototype being one HTML file is actually a strength at this stage. No build step, no dependency graph, immediate feedback. The decision to keep it that way until there's a genuine reason to split is correct.

### Copy-on-first-visit for view specs
This was a considered decision and it's the right one. The alternative (blank slate) would have created friction every time you switch specs.

---

## Dislikes

### No undo
The most painful missing feature. Accidentally deleting a node is irreversible. Any graph manipulation feels risky without at least 1 level of undo. This should be near the top of the near-term feature list.

### Node title truncation
72px is tight and 3-word titles already get cut. There's no way to know what the full title is without opening the inspector. A tooltip on hover would help immediately.

### `x` deletes with zero confirmation
Instant delete of a node with all its edges, no undo, no confirm. For a node that took 5 minutes to configure this is brutal. Even just a 3-second undo toast would be a significant improvement.

### Status bar pan coordinates are not useful yet
"120, 80" tells you where you are in world space, but there's no landmarks to orient to. The coordinates become useful only once there's a save format and you might return to a specific location. Currently they're visual noise.

### The inspector is modal and covers the graph
When the inspector is open, the graph behind it is dimmed and inaccessible. For a tool that's meant to be about seeing the graph, covering it feels wrong. Consider: a side-panel inspector that doesn't obscure the canvas.

### No way to tell what a node *does* without opening it
The footer shows one config value (lang/op/mode) which helps, but you can't tell the difference between a "filter by user.active" lens and a "filter by user.admin" lens without opening the inspector. More info density in the node body would help.

---

## Curious

### What does "domain modeling" feel like in practice?
The vision says polyp is for domain modeling. But the current tool is a pipeline builder. How do you model a domain (ontology, entities, relationships) with a directional DAG? Does the direction even make sense for domain models? Worth exploring: undirected graph mode for modeling, directed graph mode for pipelines.

### How does polyp scale to 200 nodes?
The current demo has 13 nodes. At 200, the minimap, semantic zoom, and subgraph collapse all become necessary. What does the interaction model look like at that scale?

### Could the graph be the documentation?
If a graph is well-composed (clear titles, good node types, flow colors), could it serve as documentation for the system it represents? The "domain modeling" angle suggests yes. What affordances would make graphs more "documentary"?

### LLM as a graph participant, not just a node
What if Claude could see the polyp graph and suggest edits, debug pipeline logic, or explain what a flow does? The graph as a shared context between human and AI — not just a UI for building AI pipelines.

### Polyp + Obsidian symbiosis
The kb/ is an Obsidian vault. The app is a graph tool. There's something interesting about using polyp to model the very domains that the Obsidian kb/ documents. A node in polyp might correspond to a note in Obsidian. Could they share structure?

### What's the right level of "type safety" for edges?
Right now, an edge is just a connection. There's no concept of what data type flows along it. Type-annotated edges (string, image, JSON, audio, etc.) would enable validation and better tooling but adds significant design complexity. When does this become necessary?

---

## Related

- [[design-concepts]] — reactions that turn into design explorations
- [[feature-ideas]] — reactions that turn into features
- [[vision]] — reactions that inform product direction

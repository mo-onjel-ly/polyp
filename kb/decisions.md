---
title: Decisions
aliases: [design decisions, decision log, timeline, decision timeline]
tags: [polyp, design]
---

# Decision log

Chronological record of significant design and engineering decisions. Each entry: what was decided, why, and what was rejected.

---

## 2026-04-27

### Electron titlebar: `hiddenInset` on macOS
**Decided**: `titleBarStyle: 'hiddenInset'`, traffic lights at `{x:12, y:8}`, topbar acts as drag region via `-webkit-app-region: drag`.
**Why**: The app has its own 32px topbar — a native title bar would be visually redundant and inconsistent with the dark aesthetic.
**Rejected**: `frameless` (requires drag regions on every interactive element), `default` (shows unwanted title text).

---

### Package manager: bun over npm
**Decided**: Switched to bun immediately after npm install.
**Why**: Faster installs, single binary, `bun.lock` is cleaner than `package-lock.json`. No reason to stay on npm for a greenfield Electron app.
**Rejected**: npm (already installed once, then removed), yarn/pnpm (no advantage over bun here).

---

### Electron version: 41.x
**Decided**: `electron@^41.0.0` — upgraded from the initially installed 35.x.
**Why**: npm audit flagged multiple high-severity CVEs in ≤39.8.4. 41.x resolves them all.
**Rejected**: 35.x (vulnerable), 39.x (still in the affected range per the audit).

---

### Single-file renderer: keep `renderer/index.html` monolithic
**Decided**: All app code stays in one HTML file — no bundler, no framework, no split.
**Why**: The prototype was built this way and it works. The file is ~2200 lines — manageable. Introducing a build step adds tooling complexity with no current benefit.
**Revisit when**: The file exceeds ~4000 lines, or we need module imports, or we add a second renderer window.

---

### View specs: copy-on-first-visit semantics
**Decided**: An uninitialised view spec slot copies the current live state on first visit.
**Why**: Blank/origin start would force the user to re-lay out every node from scratch. Copying the current arrangement lets them immediately diverge without disorientation.
**Rejected**: Start blank, start from spec-0 snapshot.
→ See [[view-specs#Copy-on-first-visit]] for full rationale.

---

### View specs: lazy commit (not on every drag)
**Decided**: `commitActiveViewSpec()` is called only when leaving a slot (cycle or auto-layout toggle), not on every pointer event.
**Why**: Eager commit costs a full `Map` copy per drag event — unnecessary since the spec system never reads mid-drag.
**Rejected**: Eager commit (correct but wasteful), debounced commit (adds timing complexity).
→ See [[view-specs#Commit semantics]].

---

### Flow definition: connected component (not strict lineage)
**Decided**: A "flow" is the full connected component — all nodes reachable in either direction.
**Why**: More intuitive for selection highlight: clicking any node in a merged pipeline shows the whole pipeline, not just the downstream chain.
**Rejected**: Strict ancestor/descendant (lineage-only). This is a one-line change in `getFlowMembers` if we ever want it.
→ See [[flows]].

---

### Disabled nodes: visually struck, not removed from flow
**Decided**: Disabled nodes stay in the flow topology; only visual rendering changes (opacity, dashed edges).
**Why**: Preserves the graph structure and flow color propagation. Disabling is a "soft pause," not a structural edit.
**Rejected**: Treating disabled as structural cut-points (would require reworking `recomputeFlows` and `getFlowMembers`).

---

### Auto-layout direction: left-to-right
**Decided**: Columns = ranks, left-to-right. Rows sorted by barycenter.
**Why**: Natural reading direction for pipelines. Consistent with the "data flows right" mental model.
**Rejected**: Top-to-bottom (coordinate swap — easy to add later if needed).

---

### Barycenter passes: 2
**Decided**: Two left-to-right passes for crossing minimisation.
**Why**: Diminishing returns beyond 2 for graphs under ~50 nodes. More passes are a cheap future parameter if needed.
→ See [[auto-layout#Step 3 — Barycenter sort]].

---

## 2026-04-28

### kb/ structure: atomic notes over monolithic concepts doc
**Decided**: Split `concepts.md` into 8+ atomic notes; each concept is a separate file with its own frontmatter and WikiLinks.
**Why**: Obsidian graph view is only useful with many interconnected notes. A single large file produces a hub-and-spoke graph with no internal structure. Atomic notes create a semantically rich graph.
**Rejected**: Single concepts hub (poor graph density), per-category subdirectories (adds navigation friction in Obsidian).

---

### CLAUDE.md: define workstream + kb conventions
**Decided**: Add `CLAUDE.md` at repo root defining the workstream, product vision, stack, and kb/ conventions explicitly for Claude context.
**Why**: Multi-session work requires durable context. The CLAUDE.md is the first thing loaded in any Claude Code session — it orients Claude without needing to re-explain the project.

---

## 2026-04-28 (continued)

### Command palette: input-only first iteration
**Decided**: Ship the palette as a pure text-input surface; wire `Shift+Enter` to toasts. No command dispatch yet.
**Why**: Command dispatch requires a designed command schema. Starting with "send text as toast" establishes the palette's UX feel, keyboard shortcut, and the two-direction toast mechanic without that dependency.
**Rejected**: Full command dispatch from day one (premature), no palette at all (misses UX exploration goal).
→ See [[ui-ideas#Command palette]].

---

### Toast push direction: two modes (up / down)
**Decided**: `Shift+Enter` pushes existing toasts up; `Cmd/Ctrl+Shift+Enter` nudges existing toasts down with an amber border.
**Why**: Directional toasts encode intentionality (normal vs. notable). Green/amber border makes the distinction scannable at a glance.
**Rejected**: Single direction only (misses the interesting mechanic), full physics simulation (over-engineered for v1).
→ See [[ui-ideas#Toast notifications]].

---

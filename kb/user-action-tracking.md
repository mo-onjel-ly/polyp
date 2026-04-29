---
title: User action tracking
aliases: [action log, event log, session recording, replay, action tracking]
tags: [polyp, concept, feature, design]
---

# User action tracking

Every user interaction in polyp is recorded to an in-memory action log and can be exported as JSONL. This is the foundation for session replay, usage analytics, and eventually multi-device synchronisation.

## Architecture

```
User interaction
      │
      ▼
  rec(type, data)          ← called at the semantic level (not raw DOM events)
      │
      ▼
  actLog.events[]          ← in-memory ring (unbounded for now)
      │
  ┌───┴────────┐
  │            │
  ▼            ▼
Status bar   Export
⏺ N count   JSONL download
```

The `rec()` function is intentionally small — a single push to an array with a timestamp delta. No serialisation happens per-event; export is a one-shot operation.

## Event schema

Each event is a plain object:

```js
{
  seq:  number,   // monotonically increasing sequence number
  t:    number,   // ms since session start (t0)
  type: string,   // event type (see below)
  data: object,   // optional, type-specific payload
}
```

The exported JSONL adds session envelope fields to each line:

```jsonl
{"session":"abc12","t0":1714300000000,"started":"2026-04-28T...","seq":0,"t":0,"type":"session.start","data":{"sessionId":"abc12"}}
{"session":"abc12","t0":1714300000000,"started":"...","seq":1,"t":23,"type":"snapshot","data":{...}}
```

## Event catalogue

### Graph mutations

| Type | Data fields | When fired |
|------|-------------|-----------|
| `node.create` | `id, type, x, y, title` | `createNode()` |
| `node.delete` | `id, type, title` | `deleteNode()` |
| `node.move` | `id, x, y` | Drag end (only if moved) |
| `node.toggle` | `id, enabled` | `toggleEnabled()` |
| `edge.create` | `id, from, to` | `tryConnect()` on success |
| `edge.delete` | `id` | `x` key on selected edge |

### Selection & navigation

| Type | Data fields | When fired |
|------|-------------|-----------|
| `node.select` | `id` | `select()` |
| `deselect` | — | `deselect()` |
| `nav.dir` | `key` | `navDir()` |
| `inspector.open` | `id, type` | `openInspector()` |
| `inspector.close` | `id` | `closeInspectorDom()` |

### Canvas

| Type | Data fields | When fired |
|------|-------------|-----------|
| `canvas.pan` | `x, y` | Pan drag end |
| `canvas.zoom` | `zoom, pan` | Wheel end (120ms debounce) |
| `canvas.reset` | — | `resetView()` |

### Layout & views

| Type | Data fields | When fired |
|------|-------------|-----------|
| `layout.toggle` | `auto` | `toggleAutoLayout()` |
| `view.switch` | `from, to` | `switchToView()` |
| `mode.change` | `from, to` | `setMode()` |

### UI

| Type | Data fields | When fired |
|------|-------------|-----------|
| `palette.open` | — | `openPal()` |
| `palette.close` | — | `closePal()` |
| `toast.send` | `text, dir` | `addToast()` |

### Lifecycle

| Type | Data fields | When fired |
|------|-------------|-----------|
| `session.start` | `sessionId` | App init (after seed) |
| `snapshot` | full graph state | After session.start; also available via `recSnapshot()` |

### Planned (not yet implemented)

| Type | Purpose |
|------|---------|
| `voice.command` | Audio input from user (future) |
| `device.connect` | Multi-device session join (future) |
| `node.edit` | Title/config field change in inspector |

## Accessing the log

**Status bar**: the `⏺ N` indicator in the bottom-right shows the running event count. Click to download a JSONL file.

**DevTools**: `window._polyp.getLog()` returns the live `actLog` object. `window._polyp.exportLog()` triggers the download.

**JSONL filename**: `polyp-session-{sessionId}.jsonl`

## Python schemas

Pydantic v2 models live in `workstream/schemas/action_events.py`:

```python
from workstream.schemas.action_events import Session

session = Session.from_jsonl("polyp-session-abc12.jsonl")
print(f"Duration: {session.duration_ms()}ms")
print(f"Mutations: {len(session.graph_mutations())}")
```

## Replay design (planned)

> [!INFO] Not yet implemented
> The recording is designed to support replay. The architecture is:

```
JSONL file
    │
    ▼
Session.from_jsonl()          ← parse with Pydantic models
    │
    ▼
Replay engine                 ← re-execute semantic events
    │
    ├── node.create  → createNode(type, x, y, {title, config, status})
    ├── node.delete  → deleteNode(id)
    ├── edge.create  → tryConnect(from, to)
    ├── canvas.pan   → state.pan = {x, y}; applyTransform()
    ├── canvas.zoom  → state.zoom = zoom; applyTransform()
    └── snapshot     → restore full state (checkpoint)
```

Replay is purely semantic — it re-runs graph mutations rather than simulating pointer events. This is more robust than input-level replay and sufficient for the main use cases (debugging, undo, audit trail, tutorial playback).

## Multi-device / multi-modal (future)

The event schema is designed to support:
- **Audio input**: `voice.command` events carry a transcript + intent
- **Multi-device**: events include `deviceId` for cross-device session merging
- **Touch specifics**: touch events already have enough info to distinguish tap/drag/pinch at the semantic level

## Related

- [[feature-ideas]] — undo/redo, replay engine, export
- [[canvas]] — coordinate spaces used in move/pan/zoom events
- [[ui-ideas]] — command palette and toast events are tracked here
- [[decisions]] — decision to record at semantic level rather than DOM level

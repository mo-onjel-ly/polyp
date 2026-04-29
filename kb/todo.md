---
title: Todo
aliases: [todo, tasks, current work, in progress]
tags: [polyp, reference]
---

# Todo

Current and near-future work items. For the full backlog see [[feature-ideas]] and [[roadmap]].

> [!TIP] Updating this
> Move items to `[x]` when done. Add new items as they surface. Keep this to work within the current ~2 week horizon — longer horizon lives in [[roadmap]].

---

## In progress

- [x] User action tracking — `rec()` instrumentation across all handlers *(2026-04-28)*
- [x] Workstream git repo (`mo-onjel-ly/polyp-workstream`, private)
- [x] Claude Code hooks — `UserPromptSubmit` → prompts JSONL, `PreCompact` → conversation snapshot
- [ ] Regression test for command palette focus bug fix

---

## Near-term (this sprint)

### App
- [ ] **Fix z-index leak on stack exit** — `updateStackCues` leaves inline `zIndex` on nodes after they leave a stack (noted in chat-log)
- [ ] **Node title tooltip** — show full title on hover when truncated
- [ ] **Inspector: `node.edit` recording** — record field changes from the inspector
- [ ] **Undo (1 level)** — at minimum, undo the last destructive action (`x` delete). Full undo stack is [[roadmap]] territory

### Workstream automation
- [ ] `workstream/schemas/action_events.py` — add `node.edit` event model when instrumented
- [ ] Nightly analysis agent scheduled (via `/schedule`)

### KB
- [ ] Add `ws-wow.md` workstream way of working concept note
- [ ] Add `workstream-automation-*.md` docs (git, github, neocities, twitter, polyp)
- [ ] Update `index.md` with all new notes

---

## Regression test (pending user verification)

The command palette focus bug fix (`closePal` not calling `blur()`) was shipped in commit `2dfbb7e`. User verified fix is working.

**Test to write** (`tests/palette-focus.test.js`):
```
1. Simulate cmd+p → palette opens
2. Simulate Esc → palette closes
3. Assert document.activeElement !== cmdpal-input
4. Simulate 'h' keydown → assert navDir called (not swallowed by INPUT check)
```

Test runner: bun test with jsdom.

---

## Known bugs

| Bug | Severity | Notes |
|-----|----------|-------|
| z-index leak on stack exit | Low | `updateStackCues` doesn't clear `zIndex` when node leaves stack |
| `node.edit` not recorded | Low | Inspector field changes not in action log yet |

---

## Related

- [[roadmap]] — longer horizon
- [[feature-ideas]] — full backlog
- [[decisions]] — when something ships, log the decision

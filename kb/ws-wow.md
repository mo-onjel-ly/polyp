---
title: Workstream Way of Working (ws-wow)
aliases: [ws-wow, workstream wow, polyps, workstream way of working, working agreement]
tags: [polyp, vision, design]
---

# Workstream Way of Working (ws-wow)

> [!INFO] Affectionate name
> We call this system **"polyps"** — a fun nod to the project. Polyps are small organisms that build coral reefs: many tiny interactions accumulating into something large and structural. That's what ws-wow is: small, consistent collaborative rituals that build a durable shared understanding.

The **workstream way of working** is the meta-layer above any individual project: how a human and Claude collaborate across sessions to explore, iterate, and deliver something. This document captures the principles and rituals as they've evolved in the polyp workstream.

The eventual goal is to make ws-wow a Claude plugin (`~/workstreams/workstream-way-of-working`).

---

## Core principles

1. **Accumulate context, never restart it** — every session reads the KB before starting, writes to it before ending. The KB is the shared memory.

2. **Atomic commits, rewindable history** — one logical change per commit. Push after every commit. The user will rewind; every commit is a checkpoint.

3. **No orphan code** — every new feature has a KB note. Every design decision has a `decisions.md` entry. No silent changes.

4. **Minimal surface area** — don't abstract beyond what the current task requires. Three similar lines > premature abstraction. No half-finished implementations.

5. **Working contract evolves** — implicit agreements are written down. This document is a living record of how we work together. It applies across all workstreams, not just polyp.

6. **Maximize token efficiency** — use hooks for zero-token logging. Schedule background agents for async tasks. Save conversations before compaction. Never re-explain context that's in the KB.

---

## Rituals

### Session start
1. Read `kb/index.md` → follow links to relevant notes
2. Read `kb/decisions.md` → recent entries
3. Read `kb/todo.md` → current sprint
4. Check `git log --oneline -5` → recent changes

### Session end
1. Update `kb/todo.md` — mark completed items
2. Add entries to `kb/decisions.md` for any new decisions
3. Update concept notes for any new/changed features
4. Commit KB separately from code
5. Push

### When something ships
1. `kb/decisions.md` entry — decision + rationale + alternatives
2. Update relevant concept note(s)
3. `kb/feature-ideas.md` — move item to "Closed / shipped" table
4. `kb/todo.md` — mark complete

### When an idea surfaces
→ `kb/feature-ideas.md` (or `kb/ui-ideas.md` for UI/UX ideas)

### When something breaks
1. Diagnose before fixing — explain root cause in the response
2. Fix
3. Write regression test after user verifies fix
4. `kb/decisions.md` or inline code comment if the root cause is non-obvious

---

## Implicit agreements (working contract)

These are things the user has stated or implied that I treat as standing instructions:

| Agreement | Source |
|-----------|--------|
| Commit after every discrete change, push after every commit | Explicit |
| KB updates are a separate commit from code changes | Explicit in CLAUDE.md |
| Use bun, not npm | Explicit |
| Keep the single-file HTML renderer architecture until there's a compelling reason to split | Explicit |
| Diagnose before fixing; explain root cause | Demonstrated preference |
| Add regression tests after user verifies a fix (not before) | Explicit in palette focus bug turn |
| Track UI/UX ideas with history in `ui-ideas.md` | Explicit |
| Use Obsidian Flavored Markdown throughout kb/ | Explicit |
| WikiLinks between all related notes | Explicit |
| Design decisions include rationale and rejected alternatives | Established pattern |
| "Don't take tokens unnecessarily" — prefer hooks/scripts for automation | Explicit |
| Hooks are shell commands (zero-token), not Claude invocations | Explicit |
| Workstream repo (`mo-onjel-ly/polyp-workstream`) is private | Explicit |
| App repo (`mo-onjel-ly/polyp`) is public | Established |
| Call the workstream way of working "ws-wow" and affectionately "polyps" | This session |
| Propose TODOs freely, but never execute on them until explicitly approved | 2026-04-28 |
| ws-wow's home will be `~/workstreams/workstream-way-of-working` | This session |

---

## Token efficiency patterns

### Zero-token capture
- `UserPromptSubmit` hook → append to daily JSONL (no Claude involved)
- `PreCompact` hook → save conversation snapshot (no Claude involved)
- App `rec()` function → action log (pure JS, no network)

### Efficient session startup
- CLAUDE.md loaded automatically → no re-explanation needed
- KB is the long-term memory → facts live there, not in conversation
- `kb/todo.md` + `kb/decisions.md` → orient Claude in 2 reads

### Background token use
- Nightly analysis agent: reviews day's work, updates KB, costs tokens when user isn't using them
- Scheduled PR/issue cleanup agents

---

## Plugin concept (future)

The ws-wow plugin would provide:

```
~/.claude/skills/ws-wow/
  CLAUDE.md             ← how to use the plugin
  start-session.sh      ← runs on SessionStart: reads KB, summarises context
  end-session.sh        ← runs on Stop: prompts KB update, commits
  log-prompt.sh         ← runs on UserPromptSubmit: zero-token JSONL
  save-convo.sh         ← runs on PreCompact: zero-token snapshot
  nightly-analysis.md   ← prompt template for scheduled review agent
```

A "workstream" in ws-wow terms is any project that has:
1. A KB directory (Obsidian vault)
2. A CLAUDE.md defining the workstream
3. A private workstream repo (optional but recommended)
4. Hooks configured for zero-token capture

The plugin would automate steps 3 and 4 for new workstreams.

---

## Related

- [[decisions]] — individual decisions in the polyp workstream
- [[vision]] — what polyp is building toward
- [[todo]] — current sprint
- [[roadmap]] — longer horizon

---
title: Workstream automation — git
aliases: [git automation, workstream git]
tags: [polyp, design, reference]
---

# Workstream automation — git

How git is used to version and automate the polyp workstream.

## Two repos

| Repo | Remote | Visibility | Contains |
|------|--------|------------|---------|
| `mo-onjel-ly/polyp` | `~/harnesses/polyp` | Public | App code, KB, CLAUDE.md |
| `mo-onjel-ly/polyp-workstream` | `~/harnesses/polyp/workstream` | Private | Prompts, conversations, action logs, analysis |

The `workstream/` directory is gitignored in the app repo. It has its own git init.

## Commit conventions (app repo)

- Imperative present tense, ≤72 chars subject
- Co-author: `Co-Authored-By: Claude Sonnet 4.6 (1M context) <noreply@anthropic.com>`
- KB changes in a separate commit from code changes
- Push after every commit

## Workstream repo structure

```
workstream/
  .gitignore          ← excludes conversations/*.json, sessions/*.jsonl (can be large)
  prompts/            ← daily JSONL (committed)
    YYYY-MM-DD.jsonl
  conversations/      ← pre-compaction snapshots (gitignored by default)
  sessions/           ← exported app action logs (gitignored by default)
  analysis/           ← nightly analysis outputs (committed)
  schemas/            ← Pydantic models and schemas (committed)
  scripts/            ← hook scripts (committed)
```

## Automated git push (future)

A `Stop` hook could auto-commit and push the workstream repo after each Claude session:

```bash
# workstream/scripts/auto-commit.sh
cd "$(dirname "$0")/.."
git add prompts/ analysis/
git diff --cached --quiet || git commit -m "session $(date +%Y-%m-%dT%H:%M)"
git push
```

This keeps the private workstream repo continuously updated without any manual steps.

## gitignore strategy

**What to commit in workstream/**:
- `prompts/` — small JSONL, valuable for analysis
- `analysis/` — nightly outputs, valuable history
- `schemas/` — Pydantic models, reference
- `scripts/` — hook scripts

**What to gitignore in workstream/**:
- `conversations/` — can be large JSON; keep locally, don't push
- `sessions/` — action logs can be MB+ per session; keep locally

## Related

- [[workstream-automation-github]] — GitHub-level automation
- [[ws-wow]] — workstream way of working

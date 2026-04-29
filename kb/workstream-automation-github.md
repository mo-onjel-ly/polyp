---
title: Workstream automation — GitHub
aliases: [github automation, workstream github]
tags: [polyp, design, reference]
---

# Workstream automation — GitHub

Using GitHub as a distribution, visibility, and collaboration surface for the polyp workstream.

## Current setup

| Repo | URL | Purpose |
|------|-----|---------|
| `mo-onjel-ly/polyp` | Public | App source, KB, releases |
| `mo-onjel-ly/polyp-workstream` | Private | Session artifacts |

## GitHub Actions (planned)

### On push to `polyp` main
- Lint check (ESLint or custom script)
- Build verification (`bun start --no-window` smoke test)
- Auto-tag on version bump in `package.json`

### Nightly (scheduled)
- Analysis agent runs (via Claude Code scheduled agent)
- Output committed to `workstream/analysis/YYYY-MM-DD.md`

### On new KB note
- Auto-generate a GitHub Wiki page from the kb/ note (mirrors Obsidian vault to GitHub Wiki)

## GitHub Issues as feature tracker

The `kb/feature-ideas.md` backlog could be synced to GitHub Issues:
- Each `- [ ]` item becomes an issue
- Labels: `near-term`, `medium-term`, `long-term`, `wild`
- Milestones mirror `kb/roadmap.md` milestones

A `PostToolUse` hook on `Write` to `feature-ideas.md` could trigger an issue sync script.

## GitHub Releases

When milestone 0 is complete (save/load, undo, basic test suite):
- Tag `v0.1.0`
- Release notes auto-generated from `kb/decisions.md` entries since last release
- Attach `.dmg` build (once `electron-builder` is configured)

## Gists for sharing

Useful for sharing:
- Specific graph schemas (node configs)
- Analysis reports
- Action log excerpts for debugging

A `workstream/scripts/share-gist.sh` script could push a file to a public gist and return the URL.

## GitHub Pages

A static KB viewer hosted via GitHub Pages:
- Convert `kb/*.md` to HTML with a static site generator (Quartz is ideal — designed for Obsidian vaults)
- Auto-deploy on push to `polyp` main
- Gives the KB a public URL for sharing

## Related

- [[workstream-automation-git]] — local git conventions
- [[workstream-automation-neocities]] — alternative public publishing
- [[ws-wow]] — workstream automation principles

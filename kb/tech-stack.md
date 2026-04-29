---
title: Tech stack
aliases: [stack, technology, dependencies, tech decisions]
tags: [polyp, reference, design]
---

# Tech stack

Current technology choices with rationale and evolution history.

## Runtime: Electron 41

**Chosen**: Electron wraps the HTML prototype into a native desktop app.

| Aspect | Detail |
|--------|--------|
| Version | `^41.0.0` (upgraded from initial 35.x due to CVEs in ≤39.8.4) |
| Window | `hiddenInset` titlebar on macOS, 1400×900 default |
| Security | `contextIsolation: true`, `nodeIntegration: false` |
| IPC | `contextBridge` stub in `preload.js` — no native APIs exposed yet |

**Why Electron over alternatives**: The prototype was already running in a browser. Electron adds file-system access (future save/load), native menus, and a desktop-app distribution path with minimal code change. The renderer is pure HTML/JS — no Electron-specific code there.

**Why not Tauri**: Tauri would require rewriting the renderer in a WebView with Rust bindings. The payoff (smaller binary, better performance) isn't worth the rewrite cost at this stage. Revisit when we need native CV/GPU bindings.

**Why not a web app**: The vision includes camera access (RTSP/webcam), local file I/O, and eventually native system integration. A web app can handle some of this but desktop-first gives more freedom.

> [!NOTE] Electron version pinning
> Electron 35.x was the initial version (installed by `npm install electron`). Upgraded immediately to 41.x after `npm audit` flagged multiple high-severity CVEs (AppleScript injection, use-after-free in several callbacks). Always keep Electron up-to-date; security patches come frequently.

---

## Package manager: bun 1.3.13

**Chosen**: Switched from npm immediately after the first `npm install`.

| Aspect | Detail |
|--------|--------|
| Lockfile | `bun.lock` (committed) |
| Scripts | `bun start`, `bun run dev` |
| Install time | ~3s vs ~12s for npm on this project |

**Why bun**: Faster installs, single binary, cleaner lockfile format, drop-in replacement for npm in this use case. The `trustedDependencies: ["electron"]` field in package.json is required for bun to run Electron's postinstall.

**Alternatives considered**: pnpm (good, but bun is faster and simpler), yarn (legacy), npm (replaced).

---

## Renderer: Vanilla HTML/CSS/JS

**Chosen**: The entire app UI is a single file — `renderer/index.html` (~2400 lines). No framework, no bundler, no TypeScript.

| Aspect | Detail |
|--------|--------|
| CSS | Inline `<style>` block, CSS custom properties for design tokens |
| JS | One IIFE, `'use strict'`, no modules |
| Fonts | JetBrains Mono + IBM Plex Mono via Google Fonts CDN |
| Build step | None |

**Why single-file**: The prototype was built this way and it works. At ~2400 lines it's manageable. The lack of a build step makes iteration fast and the codebase auditable — you can read the whole app in one scroll.

**Revisit when**: File exceeds ~4000 lines OR we need module imports (e.g. for node execution sandbox) OR we add a second renderer window (e.g. inspector floating window). At that point, Vite + vanilla JS (no framework) is the natural migration path.

**Why not React/Vue/Svelte**: The app is a canvas-heavy, high-performance UI. Framework overhead (virtual DOM, reactivity system) would add complexity without proportionate benefit. The rendering model here is imperative DOM manipulation — ideal for what we're doing.

---

## State management: single mutable object

**Chosen**: One `const state = { ... }` object, mutated directly.

**Why**: Simple, fast, auditable. No framework ceremony. The action log (`actLog`) is a parallel plain array.

**Tradeoffs**: No time-travel debugging, no easy undo without implementing it explicitly. Undo is on the roadmap — when we implement it, we'll either add an action stack to `state` or use the action log for replay.

---

## Node.js version: 22

Comes with Electron 41. No additional Node.js configuration needed.

---

## CI / build / distribution: none yet

No CI pipeline, no automated builds, no distribution packaging. Everything is run locally with `bun start`.

**When we need it**:
- `electron-builder` or `electron-forge` for packaging `.dmg`/`.exe`/`.AppImage`
- GitHub Actions for CI (lint, test, build)
- Code signing for macOS notarisation

---

## Evolution timeline

| Date | Change | Reason |
|------|--------|--------|
| 2026-04-27 | HTML prototype → Electron 35 | Desktop app wrapper |
| 2026-04-27 | npm → bun | Speed, cleaner lockfile |
| 2026-04-27 | Electron 35 → 41 | Security CVEs in ≤39.8.4 |
| 2026-04-28 | Added `.claude/settings.json` | Project-level Claude Code hooks |

---

## Related

- [[tech-stack-research]] — alternatives and lookahead
- [[decisions]] — decision rationale with context
- [[vision]] — where the stack needs to go

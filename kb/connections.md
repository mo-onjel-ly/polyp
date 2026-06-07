---
title: Connections — GitHub & Hugging Face auth
aliases: [connections, auth, authentication, github auth, hugging face, credentials, HF]
tags: [polyp, concept, design, feature]
---

# Connections

How polyp authenticates with external services. Currently scoped to **GitHub** and **Hugging Face**; the same architecture extends to any token-based or OAuth service.

---

## Design principles

- **Don't own what we don't need to.** GitHub already has a world-class auth CLI (`gh`). Polyp delegates to it rather than managing tokens itself.
- **Never commit credentials.** All credential storage is outside the repo — `~/.polyp/` or the system keychain.
- **Zero friction for power users.** Environment variables (`HF_TOKEN`, `GITHUB_TOKEN`) should Just Work without any in-app UI.
- **Progressive security.** Start with `~/.polyp/credentials.json`; migrate to system keychain (`keytar`) when there's a concrete reason.

---

## GitHub

### Auth strategy: delegate to `gh` CLI

Polyp already has `gh` CLI wired via IPC (`window.polyp.gh(args)`). The `gh` binary handles its own auth, storing tokens in the macOS system keyring via `git credential` helpers.

**What polyp adds:**

1. **Status check on startup** — run `gh auth status --json` to detect authenticated accounts. Surface as a connection indicator.
2. **Connect flow** — if unauthenticated, offer a button that calls `gh auth login` (opens browser OAuth).
3. **No token ownership** — polyp never reads, stores, or transmits GitHub tokens. Everything goes through `gh`.

**IPC call:**
```js
// Check status
await window.polyp.gh(['auth', 'status', '--json'])
// → { ok: true, stdout: '{"loggedIn":true,"user":"mo-onjel-ly",...}' }

// Trigger login (opens browser)
await window.polyp.gh(['auth', 'login', '--web'])
```

---

## Hugging Face

### Auth strategy: API token in credentials file

HF uses a single bearer token (`HF_TOKEN`). No CLI equivalent to `gh` exists that we can delegate to.

**Storage priority** (first found wins):
1. `process.env.HF_TOKEN` — set externally, zero app involvement
2. `~/.polyp/credentials.json` → `{ "hf_token": "hf_..." }`
3. (Future) system keychain via `keytar`

**IPC handlers** (to be implemented):
```js
// main.js
ipcMain.handle('credentials:get', (_event, service) => { ... })
ipcMain.handle('credentials:set', (_event, service, value) => { ... })
ipcMain.handle('credentials:check', (_event, service) => { ... })
// 'check' calls the service's identity endpoint to confirm the token works
```

**Renderer exposure** (preload.js):
```js
credentials: {
  get:   (service)        => ipcRenderer.invoke('credentials:get', service),
  set:   (service, value) => ipcRenderer.invoke('credentials:set', service, value),
  check: (service)        => ipcRenderer.invoke('credentials:check', service),
}
```

**Credentials file format** (`~/.polyp/credentials.json`):
```json
{
  "hf_token": "hf_xxxxxxxxxxxxxxxxxxxx",
  "openai_key": "sk-..."
}
```

> [!WARNING] Security note
> `credentials.json` is a plaintext file. It should be `chmod 600`. The `credentials:set` IPC handler should enforce this on write. Never commit this file.

---

## Connections panel (UI)

A settings-style view showing each service's connection status. Accessible via:
- `/connections` in the [[ui-ideas#Command palette|command palette]]
- A status indicator in the topbar (future)

**Panel layout:**
```
CONNECTIONS
─────────────────────────────────────────
GitHub       ● connected  mo-onjel-ly    [disconnect]
Hugging Face ○ not connected             [connect]
OpenAI       ● connected                 [revoke]
─────────────────────────────────────────
```

Each row:
- Service name + icon
- Status dot (green = connected, grey = not connected, amber = checking)
- Username / org if connected
- Action button: Connect / Reconnect / Revoke

The "Connect" button for HF/OpenAI opens an inline token input; for GitHub it calls `gh auth login`.

---

## Node-level consumption

[[nodes|Node types]] that call external APIs read credentials via `window.polyp.credentials.get(service)` in their execution context:

| Node type | Service |
|-----------|---------|
| `agent` (claude/openai) | `anthropic_key` / `openai_key` |
| `agent` (hugging face) | `hf_token` |
| `ingress` (http api) | varies — per-node config |
| `egress` (S3) | `aws_key` / `aws_secret` |

---

## Future: system keychain

`keytar` (native Electron module) stores credentials in the OS keychain (macOS Keychain, Windows Credential Store, Linux Secret Service). Swap in when plaintext file is a concern:

```js
const keytar = require('keytar');
await keytar.setPassword('polyp', service, token);
const token = await keytar.getPassword('polyp', service);
```

**Why defer:** `keytar` is a native module — it requires platform-specific binaries and complicates the build pipeline. The credentials file is acceptable for a local desktop tool until distribution is a concern.

---

## Related

- [[feature-ideas]] — connections panel in near/medium backlog
- [[nodes]] — agent/ingress/egress nodes that consume credentials
- [[tech-stack-research]] — keytar and native module trade-offs
- [[decisions]] — credential storage approach decision

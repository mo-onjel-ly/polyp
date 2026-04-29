---
title: Workstream automation — Twitter/X
aliases: [twitter automation, x automation, social automation]
tags: [polyp, design, reference]
---

# Workstream automation — Twitter/X

Using Twitter/X to share milestones, design ideas, and devlog highlights from the polyp workstream.

## What to share

### Milestone tweets
Auto-posted when a milestone is tagged in git:
- "v0.1 shipped — polyp can now save/load graphs locally"
- Include a screenshot (taken via Electron's `webContents.capturePage()`)

### Design observation threads
From `kb/reactions.md` or `kb/design-concepts.md`:
- Interesting UX decisions that generalise beyond polyp
- "We made flow highlighting dimm everything outside a connected component. Here's why that works better than just highlighting the selected node..."

### Devlog snippets
From nightly analysis — short (1-2 sentence) progress notes.

## API approach

Twitter v2 API with OAuth 2.0 (or use `t` CLI / `twurl`):

```bash
# workstream/scripts/tweet.sh
# Posts a tweet. Requires TWITTER_BEARER_TOKEN env var.
# Usage: tweet.sh "message text"

curl -X POST "https://api.twitter.com/2/tweets" \
  -H "Authorization: Bearer $TWITTER_BEARER_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"text\": \"$1\"}"
```

## Automation trigger

A `PostToolUse` hook on git tag push, or a manual step in the milestone workflow. **Not** auto-posted on every session — too noisy. Milestones only, plus manually curated design observations.

## Screenshot automation

```js
// In preload.js — expose a screenshot API
const { ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('polyp', {
  screenshot: () => ipcRenderer.invoke('screenshot'),
});

// In main.js
ipcMain.handle('screenshot', async (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  const image = await win.webContents.capturePage();
  return image.toPNG();
});
```

Then a `workstream/scripts/capture-and-tweet.sh` captures + posts.

## Content strategy

The tone should be builder's log — authentic, specific, iterative:
- "Added directional toast notifications today. Shift+Enter pushes up (green), Cmd+Shift+Enter pushes down (amber). The direction encodes intent — 'normal' vs 'notable'."
- Not marketing, not hype. The design decisions are the content.

## Related

- [[workstream-automation-neocities]] — longer-form publishing
- [[workstream-automation-github]] — dev-facing publishing
- [[reactions]] — source material for design observation tweets

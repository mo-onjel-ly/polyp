---
title: Workstream automation — Neocities
aliases: [neocities automation, workstream neocities]
tags: [polyp, design, reference]
---

# Workstream automation — Neocities

Neocities as a zero-friction publishing surface for polyp dev logs and KB excerpts.

## Why Neocities

- Free static hosting, no CI pipeline needed
- Has an API (`neocities.org/api`) — can push files with a `curl` command
- The lo-fi, hand-crafted feel fits polyp's aesthetic
- Good for a public-facing "devlog" that isn't GitHub (more personal, less formal)

## What to publish

### Dev log
- A running `devlog.html` page updated after each session
- Plain HTML, dark, monospace — matches polyp's aesthetic
- Entries auto-generated from `workstream/analysis/` nightly output

### KB excerpts
- Selected KB notes published as standalone HTML pages
- `vision.md`, `roadmap.md`, `ui-ideas.md` are good candidates
- Generated via a simple markdown-to-HTML script (or pandoc)

## Automation script

```bash
# workstream/scripts/publish-neocities.sh
# Publishes the devlog to Neocities via their API.
# Requires NEOCITIES_API_KEY env var.

set -euo pipefail

SITE="polyp-dev"   # the neocities site name
KEY="${NEOCITIES_API_KEY}"
FILE="$1"          # path to HTML file to upload
NAME="$(basename "$1")"

curl -F "$NAME=@$FILE" \
  "https://neocities.org/api/upload" \
  -H "Authorization: Bearer $KEY"
```

## Stop hook integration

A `Stop` hook could trigger the devlog publish after each Claude session:

```json
{
  "hooks": {
    "Stop": [{
      "hooks": [{
        "type": "command",
        "command": "workstream/scripts/generate-devlog-entry.sh && workstream/scripts/publish-neocities.sh workstream/devlog.html",
        "async": true
      }]
    }]
  }
}
```

The `generate-devlog-entry.sh` would:
1. Extract today's new prompts from `workstream/prompts/YYYY-MM-DD.jsonl`
2. Format as an HTML `<div class="entry">` block
3. Prepend to `workstream/devlog.html`

## Design

The Neocities page should look like polyp itself:
- `background: #0a0b0d`
- `font-family: 'JetBrains Mono', monospace`
- `color: #d8dbe2`
- Hairline rules, tight spacing
- Flow-colored highlights for different activity types

## Related

- [[workstream-automation-github]] — more formal publishing
- [[workstream-automation-twitter]] — social distribution
- [[design-concepts]] — polyp's visual language

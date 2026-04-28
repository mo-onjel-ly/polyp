# flowgraph prototype bundle

Single-file HTML prototype for a compact node-based flowchart programming UI.
Built iteratively in a chat conversation with Claude.

## Contents

- `revisions/flowchart-rev7-final.html` — the latest and only authoritative
  HTML revision. This is what was shipped at the end of the conversation
  and is the canonical version. Open it in any modern browser; no build
  step, no server, no dependencies.
- `CHANGELOG.md` — what changed at each conceptual revision (rev 1
  through rev 7), so you can see the evolution.
- `chat-log.md` — a faithful summary of the conversation that produced
  the prototype, including every user request and the assistant's
  responses, design decisions, and tradeoffs.
- `README.md` — this file.

## Why only one HTML revision?

The prototype was built incrementally using in-place file edits. Earlier
revisions were not snapshotted to disk during the conversation — only the
final state survived. Reconstructing earlier revisions by reverse-applying
edits would have produced files that *approximate* historical states but
risk diverging in subtle ways (introduced bugs, missed details). Rather
than ship inaccurate "history," the bundle contains the authoritative
final file plus a textual CHANGELOG that captures what each conceptual
revision contained, in case you want to recreate any intermediate state
manually.

## Running it

```
# Just open the HTML file. It's self-contained.
open revisions/flowchart-rev7-final.html

# Or with a live-reload dev server for iteration:
npx browser-sync start --server --files "revisions/*.html"
```

## Continuing in `claude` (Claude Code)

To pick up where the conversation left off in Claude Code:

1. Move this whole bundle into a project directory.
2. Run `claude` in that directory.
3. Start your first message with something like:
   > "Read README.md, CHANGELOG.md, and chat-log.md to get context. The
   > current state of the prototype is in revisions/flowchart-rev7-final.html.
   > I want to [your next goal]."

Claude Code will pick up the project context and continue from rev 7.
The chat log includes a section at the end listing potential next-step
directions that were discussed but not implemented.

## Key features in rev 7

- Compact 72px square nodes with metadata-rich header
- Three node types: `script`, `lens`, `camera`
- Flow coloring with connected-component detection
- Two-stage activation (first tap = select + dim other flows;
  second tap = open centered inspector)
- Touch + mouse + keyboard parity (pinch zoom, vim-style navigation)
- Auto-layout toggle (layered DAG with barycenter sort)
- Overlap stack visualization in freeform mode
- Enable/disable per node with visual indicators
- DAG enforcement (no cycles allowed)

---
title: Inspector
aliases: [inspector, node inspector, node detail, expanded node]
tags: [polyp, concept, ui]
---

# Inspector

A floating overlay for editing a [[nodes|node's]] properties in detail. Renders above a blurred backdrop.

## Opening

The inspector uses a **two-stage activation** model:

| Interaction | Result |
|-------------|--------|
| First click/tap on a node | Select the node, highlight its [[flows|flow]] |
| Second click/tap on the *already-selected* node | Open the inspector |
| `Enter` (with node selected) | Open the inspector |
| `Enter` (nothing selected) | Select the top-left-most node first |

This prevents accidental inspector opens during normal navigation.

> [!NOTE] Port fall-through
> A tap on a port that doesn't move far enough to commit a [[ports#Port drag|port drag]] also follows the two-stage model — it behaves identically to tapping the node body.

## Contents

```
┌─────────────────────────────────────┐
│ [SCRIPT]  fetch api logs  [on] ×    │  ← header
├─────────────────────────────────────┤
│ upstream (1)                        │
│  ● prod metrics feed  n3 · script   │
│                                     │
│ language                            │
│ [js ▾]                              │
│                                     │
│ script body                         │
│ ┌───────────────────────────────┐   │
│ │ return inputs[0];             │   │
│ └───────────────────────────────┘   │
├─────────────────────────────────────┤
│ esc close  d toggle  x delete  n1   │  ← footer
└─────────────────────────────────────┘
```

- **Type tag** — coloured with the node's [[flows|flow]] hue
- **Title** — editable text field; changes persist immediately
- **Enable/disable toggle** — pill button; updates the node and edges without closing
- **Close button** — `×` top-right
- **Upstream list** — [[nodes]] that feed directly into this one, shown with flow-coloured dots
- **Config fields** — type-specific inputs (selects, textareas); see [[nodes#Types]]
- **Footer** — keyboard hints + node id

## Closing

| Action | Closes inspector |
|--------|-----------------|
| `Esc` | Yes |
| Click backdrop | Yes |
| `x` | Yes (and deletes the node) |

## Keyboard while open

While the inspector is open, all keystrokes go to the form fields **except**:

| Key | Action |
|-----|--------|
| `Esc` | Blur current field and close inspector |
| `d` | Toggle node enabled/disabled |
| `x` | Delete node and close |

## Related

- [[nodes]] — the inspector edits node state
- [[flows]] — type tag and upstream dots use flow colours
- [[keyboard-shortcuts]] — full shortcut reference

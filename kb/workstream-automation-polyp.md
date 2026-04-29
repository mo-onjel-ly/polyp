---
title: Workstream automation — polyp itself
aliases: [meta-automation, polyp automates polyp, self-hosting]
tags: [polyp, vision, design]
---

# Workstream automation — polyp itself

The most fitting automation target for the polyp workstream is **polyp itself**. Once the execution engine exists, the workstream's own automation pipeline should be expressible as a polyp graph.

> [!INFO] Why this matters
> Building polyp's own CI/logging/analysis pipeline in polyp is the strongest possible proof of concept. It answers "can this tool actually do what it claims?" with a working, visible demo. It's also the fastest path to finding what's missing or broken — you use the tool hard on real work.

---

## The meta-pipeline: workstream monitoring graph

A polyp graph that monitors and reports on the polyp workstream:

```
[prompt-log source]
  → [parse JSONL lens]
  → [session stats script]
  → [daily summary lens]
  → [push to neocities]

[git log source]
  → [commit frequency lens]
  → [milestone detector script]
  → [tweet on milestone]

[action log source]
  → [parse events lens]
  → [usage pattern script]
  → [update kb/reactions.md lens]
```

Each box is a polyp node. The graph draws itself. The workstream builds the tool that builds the workstream.

---

## Node types needed (motivates the roadmap)

This meta-pipeline requires:

1. **File watcher source** — watches `workstream/prompts/` for new JSONL lines → [[roadmap#Milestone 2]]
2. **Script node (Python)** — parses action logs, computes stats → [[roadmap#Milestone 1]]
3. **HTTP output node** — POSTs to Neocities / Twitter API → [[roadmap#Milestone 2]]
4. **LLM node** — generates summary text from raw session data → [[roadmap#Milestone 4]]
5. **Git source node** — reads git log, emits structured commit data → [[roadmap#Milestone 2]]

Building this pipeline is a forcing function for getting these node types right.

---

## The self-describing workstream

When the meta-pipeline is running, the polyp workstream becomes:

1. **Self-monitoring** — graphs of session activity, commit frequency, design velocity
2. **Self-publishing** — auto-generated devlog from actual usage data
3. **Self-improving** — LLM node that reads the session log and suggests what to work on next

This is what "agentic workflow engineering" means in practice — not a toy demo, but a real system building and monitoring itself.

---

## Graph-as-documentation

A polyp graph of the workstream pipeline is also the best documentation of what the workstream does. Anyone looking at the graph can see:
- What data sources exist (prompt log, action log, git log)
- What transformations run on them (parse, stats, summarise)
- What outputs are produced (devlog, tweet, KB update)

This is the payoff of the "graph as interface" design principle in [[vision]].

---

## First milestone for self-hosting

The minimum to try this: after [[roadmap#Milestone 1]] (execution engine), build a single script node that reads `workstream/prompts/YYYY-MM-DD.jsonl` and prints a session summary. That's the seed of the meta-pipeline.

---

## Related

- [[vision]] — the broader goal
- [[roadmap]] — when execution engine / context sources arrive
- [[workstream-automation-git]] — git side of the automation
- [[user-action-tracking]] — the data source for this pipeline

---
title: Business
aliases: [monetization, startup ideas, business model, revenue, product strategy]
tags: [polyp, business]
---

# Business

Startup angles, monetization models, and product strategy thinking.

> [!NOTE]
> This is a scratchpad for business ideas — nothing is committed or validated. The goal is to keep these ideas accessible rather than losing them.

---

## What polyp could be as a product

### 1. Developer tool (open-core)

Free, open-source core (the graph builder, local execution, basic node types). Paid cloud tier for:
- Shared / collaborative graphs
- Cloud execution (no local Python/Node required)
- More execution history / replay
- Enterprise SSO + audit logs

**Comps**: n8n, Flowise, Dify (all open-core)
**Risk**: Commoditisation. Hard to defend if a well-funded player (Salesforce, MS, Google) forks and ships.
**Upside**: Developer adoption drives organic growth. The core tool is genuinely useful for free.

---

### 2. Vertical SaaS — physical security / AV analytics

Polyp is well-positioned for the "camera feed → CV → alert/action" use case. A vertical product:
- Pre-built node templates for motion detection, face recognition, object tracking, perimeter alerts
- Native RTSP/ONVIF connector nodes
- Dashboard output nodes (maps, logs, feeds)
- Hosted or on-premise deployment

**Comps**: Milestone Systems (VMS), Genetec, Avigilon (all expensive, enterprise, non-programmable)
**Risk**: Hardware integration is hard. Enterprise sales cycle is long.
**Upside**: Security/AV analytics is a massive market. No one has a developer-grade visual tool here.

---

### 3. Domain modeling and AI workflow consultant tooling

Sell polyp as a consulting tool — a way for AI consultants / systems integrators to:
- Model a client's domain visually
- Map out where AI can add value
- Build and demonstrate a prototype pipeline in the client meeting
- Hand off the graph as a spec or running system

**Comps**: Consulting firms use Miro/draw.io for this. There's nothing executable.
**Risk**: Niche. Dependent on consulting market, not product market.
**Upside**: High per-seat value. Early adopters could become advocates.

---

### 4. Standalone desktop app (paid license)

One-time purchase or annual subscription. The "Sketch for workflow engineering" positioning.
- $49–$149 one-time or $9–$19/month
- Targets individual developers, researchers, data scientists
- Cloud sync as paid upgrade

**Comps**: Sketch ($99/yr), Paw/RapidAPI ($99/yr), Dash Dash (dashboards, $9/mo)
**Risk**: Hard to grow. Developer tools via direct sales are difficult without a strong community.
**Upside**: Simple model, no infrastructure until cloud sync is added.

---

### 5. Embedded / white-label SDK

License the graph builder as an embedded component for other products:
- Data pipeline tools wanting a visual designer
- AI platforms wanting a workflow builder
- IoT platforms wanting a device pipeline UI

**Comps**: ReactFlow (open-source graph lib), xyflow
**Risk**: Low ASP. Sales cycle involves technical evaluation.
**Upside**: B2B2D (developer-to-developer). High leverage — one polyp powers many products.

---

## Monetization mechanisms

| Mechanism | Complexity | Revenue profile |
|-----------|-----------|-----------------|
| Open-core + cloud | Medium | Recurring SaaS |
| Paid desktop license | Low | One-time or annual |
| Vertical SaaS (AV/CV) | High | Recurring, high ACV |
| White-label SDK | Medium | Per-seat or revenue share |
| Consulting tools | Low | Services-attached |
| Marketplace (node templates) | High | Rev share or fee |

---

## Startup ideas derived from this work

### "Polyp for CV pipelines"
A dedicated product: connect camera sources → computer vision nodes → action nodes (webhook, alert, log, dashboard). Marketed to small-medium physical security, retail analytics, industrial monitoring. No-code configuration; developer extensibility.

### "AI workflow co-pilot"
Describe a workflow in natural language → polyp generates an initial graph → human refines → export as code or execute locally. The graph is the explanation AND the implementation. Targets AI engineers who prototype faster than they document.

### "Context map tool"
Polyp positioned specifically for domain modeling and context gathering before AI system design. The output is a context graph (nodes = data sources, edges = information flows) that feeds into an AI system design. Targets teams building AI products who need to map their information architecture.

---

## What would make it more valuable

- **Actual execution** — the jump from "drawn pipeline" to "running pipeline" is the biggest value unlock. Everything else is polish until this exists.
- **Sharing / export** — if you can't share a graph, the tool is personal only. Even read-only sharing (link → graph viewer) multiplies the value significantly.
- **Node marketplace** — a community of node templates that can be installed and shared. Transforms the tool from a builder to an ecosystem.
- **AI-assisted graph construction** — describe → sketch → refine loop. Lowers the barrier to entry dramatically.

---

## Related

- [[vision]] — product direction
- [[market]] — competitive landscape
- [[feature-ideas]] — what to build to get there

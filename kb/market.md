---
title: Market
aliases: [market research, related tools, prior art, competition, already did it, competitors]
tags: [polyp, market]
---

# Market research

Related tools, prior art, and landscape analysis.

> [!NOTE] Updating this
> Add entries as you encounter tools. Format: name, one-line description, what it does well, what polyp does differently or better.

---

## Node-based visual programming

### Node-RED
- **What it is**: IBM-originated flow-based programming tool for IoT and automation. Browser-based, runs on Node.js.
- **Does well**: Huge library of pre-built nodes (MQTT, HTTP, databases, GPIO). Live wiring. Production-deployed at scale.
- **Polyp difference**: Node-RED's UX is functional but dated — not designed for density or keyboard-first use. No vision for AI/LLM nodes. Polyp aims for a significantly better visual and interaction design. Also: Node-RED is server-first; polyp is desktop-first (Electron).

### n8n
- **What it is**: Open-source workflow automation. Zapier alternative. Node-based.
- **Does well**: 400+ integrations. Self-hostable. Active community.
- **Polyp difference**: n8n is primarily an integration/automation tool (trigger A → action B). Polyp is more of a domain modeling and context-gathering substrate — closer to a programming environment than a no-code connector.

### Flowise
- **What it is**: Open-source visual builder for LangChain pipelines. Drag-and-drop.
- **Does well**: Fast prototyping of LLM chains. Good for RAG pipelines.
- **Polyp difference**: Flowise is LangChain-specific and web-based. Polyp aims to be model/framework agnostic, desktop-native, and extensible to non-LLM nodes (CV, AV, sensors).

### LangFlow
- **What it is**: Visual builder for LangChain flows. Similar to Flowise.
- **Does well**: Clean visual design (relative to Flowise). Active development.
- **Polyp difference**: Same gap as Flowise — tied to LangChain, web-based, focused on LLM pipelines only.

### ComfyUI
- **What it is**: Stable Diffusion node-based UI for image generation pipelines.
- **Does well**: Incredibly powerful for image generation workflows. Huge community. Very detailed graph inspection.
- **Polyp difference**: Domain-specific (image gen). But the interaction model is instructive — polyp could learn from ComfyUI's "every intermediate value is inspectable" philosophy.
- **Worth stealing**: Preview thumbnails on nodes showing last output. Right-click context menus on edges. Node search/add palette.

### TouchDesigner
- **What it is**: Real-time visual programming environment for AV performance and installation.
- **Does well**: High-performance AV processing. Rich node library. Real-time data flow.
- **Polyp difference**: TouchDesigner is expensive, steep learning curve, primarily for media artists. Polyp targets technical generalists and developers. Also: TD requires GPU + Windows/macOS specialised setup.
- **Worth stealing**: The concept of different "families" of nodes (CHOP, TOP, SOP, MAT, DAT) that represent different data types. Strong type awareness.

### Cables.gl
- **What it is**: Browser-based visual coding environment, primarily for WebGL/3D.
- **Does well**: Clean modern UI, real-time preview.
- **Polyp difference**: Domain-specific (graphics). But has good ideas about live preview and graph density.

---

## AI/LLM workflow tools

### Dify
- **What it is**: Open-source LLM app development platform. Visual workflow builder for AI apps.
- **Does well**: Clean UI, good RAG + agent workflow support. Rapidly evolving.
- **Polyp difference**: Dify is web-app-centric and API-focused. Polyp is a desktop tool aimed at developers who want to compose arbitrary pipelines, not just LLM-specific ones.

### LlamaIndex Workflows
- **What it is**: Code-first workflow orchestration for LLM applications.
- **Does well**: Flexible, well-documented, strong community.
- **Polyp difference**: Code-first means no visual graph. Polyp targets the visual-first use case.

### Crew.ai / AutoGen / LangGraph
- **What they are**: Multi-agent orchestration frameworks (code-first).
- **Does well**: Agent collaboration, task decomposition, memory.
- **Polyp difference**: All code-first. Polyp could serve as a visual interface *over* these frameworks — the graph you draw in polyp compiles to a Crew.ai or LangGraph execution plan.

---

## Domain modeling tools

### Miro / Figma (FigJam)
- **What they are**: Collaborative whiteboards with basic diagram capabilities.
- **Does well**: Easy to use, great for brainstorming, real-time collaboration.
- **Polyp difference**: These are drawing tools, not executable graphs. Polyp models are meant to run, not just communicate.

### draw.io / Lucidchart
- **What they are**: Diagram editors.
- **Does well**: Comprehensive shape libraries, export formats, integration with Google Drive/Confluence.
- **Polyp difference**: Static diagrams only. No execution concept.

### Obsidian (graph view)
- **What it is**: Note-taking with a knowledge graph built from WikiLinks.
- **Does well**: Excellent graph navigation, linking, and discovery.
- **Polyp difference**: Obsidian models text relationships. Polyp models data/process flows. Complementary — we use Obsidian for the KB precisely because of this.

---

## "Already did it" — prior art worth studying

| Concept | Where it was done | Notes |
|---------|------------------|-------|
| Animated edge particles (data flow) | TouchDesigner, some ComfyUI extensions | Strong real-time feedback cue |
| Semantic zoom (dots → names → detail) | Gephi, some large graph tools | Important for 100+ node graphs |
| Live data preview on nodes | ComfyUI (image thumbnails), Node-RED (debug output) | The "monitor mode" design concept |
| Domain grouping / swim lanes | Miro, some BPMN editors | Background zone annotation |
| Execution replay | Temporal.io, some debuggers | Record + replay every step |
| Command palette over graph | Cables.gl | Fast node creation / navigation |
| Physical simulation layout | Gephi, D3 force | Alternative to layered DAG |

---

## Market observations

> [!INFO]
> The visual programming space is fragmented. No single tool spans: desktop-native + keyboard-first + AV/sensor capable + LLM-native + domain-agnostic + developer-grade UX. Most tools either:
> 1. Are web-only and optimised for non-developers (Zapier, Make)
> 2. Are domain-specific (ComfyUI for images, Node-RED for IoT, Flowise for LLM)
> 3. Are code-first with a visual wrapper bolted on
>
> The gap is a **developer-grade, domain-agnostic, AV+AI-capable visual programming environment** with a first-class desktop experience and a tight interaction design.

## Related

- [[business]] — how to position and monetize in this landscape
- [[vision]] — what polyp is trying to be in this space
- [[feature-ideas]] — capabilities that differentiate from existing tools

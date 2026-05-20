<p align="center">
  <img src="assets/screenshots/dashboard.svg" alt="SIGNALWATCH realtime operational console" width="100%">
</p>

<h1 align="center">SIGNALWATCH</h1>

<p align="center">
  Evidence-aware AI observability for source-backed signals, runtime telemetry, and perception robustness.
</p>

<p align="center">
  <a href="https://jgsops.dev">jgsops.dev</a>
  <span>&nbsp;&nbsp;/&nbsp;&nbsp;</span>
  <a href="https://jgsops.dev/about">about</a>
  <span>&nbsp;&nbsp;/&nbsp;&nbsp;</span>
  <a href="https://jgsops.dev/console">console</a>
  <span>&nbsp;&nbsp;/&nbsp;&nbsp;</span>
  <a href="https://jgsops.dev/evidence">evidence ledger</a>
  <span>&nbsp;&nbsp;/&nbsp;&nbsp;</span>
  <a href="https://jgsops.dev/labs/perception">safety-critical perception</a>
  <span>&nbsp;&nbsp;/&nbsp;&nbsp;</span>
  <a href="https://jgsops.dev/methodology">methodology</a>
</p>

<p align="center">
  <img alt="Next.js 15" src="https://img.shields.io/badge/Next.js_15-console-111?style=flat-square&labelColor=050706&color=1a2f24">
  <img alt="FastAPI" src="https://img.shields.io/badge/FastAPI-runtime-111?style=flat-square&labelColor=050706&color=1a2f24">
  <img alt="WebSockets" src="https://img.shields.io/badge/WebSockets-telemetry_bus-111?style=flat-square&labelColor=050706&color=1a2f24">
  <img alt="COCO-SSD" src="https://img.shields.io/badge/COCO--SSD-browser_CV-111?style=flat-square&labelColor=050706&color=1a2f24">
  <img alt="Railway" src="https://img.shields.io/badge/Railway-backend-111?style=flat-square&labelColor=050706&color=1a2f24">
  <img alt="Vercel" src="https://img.shields.io/badge/Vercel-frontend-111?style=flat-square&labelColor=050706&color=1a2f24">
</p>

---

## Overview

SIGNALWATCH is a public AI safety and observability platform built around evidence boundaries rather than feeds, hype, or generic dashboards.

It monitors AI ecosystem movement, alignment and governance signals, source-backed safety frameworks, realtime telemetry, and browser-side computer vision robustness. The interface is dark, calm, and infrastructure-oriented: a quiet operational surface for inspecting what was observed, where it came from, and what remains unknown.

Core surfaces:

- realtime ecosystem observability console
- evidence ledger for source claims, telemetry frames, and collector state
- source-backed AI safety intelligence layer
- safety-critical perception lab with browser-side COCO-SSD inference
- operational timeline and daily briefing layer
- systems/operator identity surface
- methodology boundary for real, derived, simulated, and conceptual data

Recommended public path:

```text
/start -> /console -> /evidence -> /labs/perception
```

The `/about` page explains what SIGNALWATCH is, what it is not, and which surfaces contain source data, runtime telemetry, browser-side model outputs, or conceptual education.

## Operational Principle

SIGNALWATCH is designed to feel alive without fabricating intelligence.

```text
real source activity        -> ecosystem signals
aggregated source movement  -> derived operational intelligence
browser model outputs       -> CV confidence and detection telemetry
runtime behavior            -> infrastructure telemetry
educational mechanisms      -> clearly labeled conceptual simulations
```

Missing data remains visible. Unavailable models remain unavailable. Conceptual demos are labeled. Confidence values are shown only when a real model emits them.

SIGNALWATCH does not fabricate:

- telemetry
- detections
- confidence values
- incidents
- source claims
- evaluation metrics

## Realtime Infrastructure

```text
AI ecosystem sources
        |
        v
collector mesh
        |
        v
normalization layer
        |
        v
semantic aggregation
        |
        v
historical memory
        |
        v
telemetry runtime
        |
        v
WebSocket event bus
        |
        v
operational console
```

Runtime behavior:

- async FastAPI service on Railway
- WebSocket event streaming over `/ws/events`
- rolling telemetry state
- real-data-derived signal generation
- collector health snapshots
- source latency and heartbeat telemetry
- frontend reconnect handling
- persistent timeline and briefing layer

Production endpoints:

```text
Frontend    https://jgsops.dev
Console     https://jgsops.dev/console
About       https://jgsops.dev/about
Evidence    https://jgsops.dev/evidence
Safety      https://jgsops.dev/safety
Perception  https://jgsops.dev/labs/perception
Methodology https://jgsops.dev/methodology

REST        https://signalwatch-production-4416.up.railway.app/api/telemetry
WebSocket   wss://signalwatch-production-4416.up.railway.app/ws/events
```

## Safety Intelligence

The safety layer translates credible AI safety material into a public operational interface.

Included systems:

- alignment concepts
- frontier risk categories
- governance and responsible scaling frameworks
- job displacement and task exposure explanations
- unaligned AI risk mechanisms
- source registry with reliability metadata

Initial registry includes:

- OpenAI Preparedness Framework
- Anthropic Responsible Scaling Policy
- OECD AI and Work
- Stanford AI Index 2025

The safety layer avoids doomposting, fake incidents, and unsourced statistics. Claim-heavy content must be source-backed or explicitly framed as conceptual explanation.

## Safety-Critical Perception

SIGNALWATCH Labs includes a dedicated operational robustness environment for AI vision systems.

```text
webcam or upload
        |
        v
canvas degradation pipeline
        |
        v
browser-side COCO-SSD inference
        |
        v
rolling detection history
        |
        v
confidence / persistence / temporal telemetry
```

Perception telemetry:

- `DETECTION.RELIABILITY`
- `CONFIDENCE.VARIANCE`
- `TRACKING.PERSISTENCE`
- `TEMPORAL.CONSISTENCY`
- `PERCEPTION.STABILITY`
- `FRAME.INTEGRITY`
- `OCCLUSION.PRESSURE`

Degradation modes:

- blur
- low light
- occlusion
- noise and compression artifacts
- crop instability
- motion blur
- environmental presets

The lab is not an AI magic demo. It is a small observability environment for inspecting how perception systems behave when real-world input quality changes.

## Methodology Boundary

SIGNALWATCH separates its information surfaces:

| Layer | Boundary |
| --- | --- |
| Real ecosystem data | Source-backed papers, releases, policy updates, safety posts, discourse, and model activity |
| Derived intelligence | Computed from aggregation, frequency, confidence, persistence, and temporal movement |
| Operational telemetry | Runtime state such as latency, reconnects, heartbeat, collector health, and infrastructure pressure |
| Browser CV | COCO-SSD detections and confidence emitted locally in the browser |
| Conceptual demos | Explicitly labeled simulations for alignment, oversight, and proxy-objective explanation |

This boundary is part of the product. It keeps the system credible while preserving the feeling of a live operational surface.

## Architecture

```text
                                    JGSOPS / SIGNALWATCH

     +----------------------+        +----------------------+        +----------------------+
     |  ecosystem sources   |        |  FastAPI runtime     |        |  Next.js interface   |
     |----------------------|        |----------------------|        |----------------------|
     |  research streams    | -----> |  asyncio collectors  | -----> |  console             |
     |  alignment discourse |        |  normalization       |        |  safety layer        |
     |  release movement    |        |  signal memory       |        |  perception lab      |
     |  policy updates      |        |  websocket manager   |        |  timeline            |
     +----------------------+        +----------------------+        +----------------------+
                                                |
                                                v
                                      +----------------------+
                                      | PostgreSQL-ready     |
                                      |----------------------|
                                      | operational events   |
                                      | collector snapshots  |
                                      | signal memory        |
                                      +----------------------+
```

## Stack

Frontend:

```text
Next.js 15
TypeScript
TailwindCSS
Framer Motion
Recharts
TensorFlow.js / COCO-SSD
```

Backend:

```text
FastAPI
asyncio
WebSockets
SQLAlchemy
PostgreSQL-ready storage
```

Infrastructure:

```text
Vercel frontend
Railway backend
Docker containerization
custom domain at jgsops.dev
```

## Visual Showcase

Recommended repository visuals:

```text
assets/screenshots/landing.png
assets/screenshots/console.png
assets/screenshots/safety.png
assets/screenshots/perception.png
assets/screenshots/timeline.png
assets/demo/websocket-stream.gif
assets/demo/perception-degradation.gif
assets/demo/timeline-briefing.gif
```

### Operational Console

Realtime telemetry, collector health, semantic topology, live event stream, and WebSocket state.

<p align="center">
  <img src="assets/screenshots/dashboard.svg" alt="SIGNALWATCH console preview" width="100%">
</p>

### Safety-Critical Perception

Browser-side CV inference under controlled degradation. Confidence, persistence, and temporal telemetry come only from model outputs.

```text
assets/screenshots/perception.png
assets/demo/perception-degradation.gif
```

### Safety Intelligence

Source-backed public AI safety explanations with evidence chains and reliability metadata.

```text
assets/screenshots/safety.png
```

### Timeline Memory

Operational history, signal evolution, and daily intelligence briefing.

```text
assets/screenshots/timeline.png
assets/demo/timeline-briefing.gif
```

## Design Philosophy

SIGNALWATCH follows an observability-first design language.

The interface should feel like quiet mission control: dark surfaces, thin borders, precise typography, dense data, restrained motion, and small operational pulses. It should be understandable to non-experts without flattening the engineering identity.

Avoided deliberately:

- cyberpunk overload
- startup SaaS language
- fake AI telemetry
- unsourced statistics
- news-feed design
- chatbot wrapper aesthetics
- flashy ML playgrounds

## Deployment

Production:

```text
domain      https://jgsops.dev
frontend    Vercel
backend     Railway
```

Environment:

```env
NEXT_PUBLIC_API_URL=https://signalwatch-production-4416.up.railway.app
NEXT_PUBLIC_WS_URL=wss://signalwatch-production-4416.up.railway.app/ws/events
SIGNALWATCH_CORS_ORIGINS=https://jgsops.dev,https://www.jgsops.dev,http://localhost:3000,http://127.0.0.1:3000
```

## Repository Structure

```text
signalwatch/
  frontend/       Next.js operational interface
  backend/        FastAPI realtime runtime
  docker/         container definitions
  assets/         screenshots, demos, diagrams
```

## Closing

Monitoring the operational surface of intelligent infrastructure.

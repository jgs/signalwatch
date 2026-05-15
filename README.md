<p align="center">
  <img src="assets/demo/terminal-demo.svg" alt="signalwatch terminal demo" width="100%">
</p>

<h1 align="center">signalwatch</h1>

<p align="center">
  AI ecosystem observability for research papers, alignment discourse, model releases, open-source movement, and emerging technical trends.
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-111?style=flat-square&labelColor=050706&color=1a2f24">
  <img alt="FastAPI" src="https://img.shields.io/badge/FastAPI-realtime_API-111?style=flat-square&labelColor=050706&color=1a2f24">
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-storage-111?style=flat-square&labelColor=050706&color=1a2f24">
  <img alt="WebSockets" src="https://img.shields.io/badge/WebSockets-live_ops-111?style=flat-square&labelColor=050706&color=1a2f24">
  <img alt="MIT" src="https://img.shields.io/badge/license-MIT-111?style=flat-square&labelColor=050706&color=1a2f24">
</p>

`signalwatch` is a full-stack AI ecosystem monitoring console. It watches research feeds, model releases, alignment/safety discussion, open-source infrastructure movement, and emerging technical trends, then normalizes those observations into a realtime operational intelligence surface.

This is not a news scraper or generic analytics template. The interface is intentionally dark, dense, terminal-inspired, and observability-oriented: an obscure internal console for tracking the movement of AI systems.

## Console

<p align="center">
  <img src="assets/screenshots/dashboard.svg" alt="signalwatch dashboard screenshot" width="100%">
</p>

## Architecture

```mermaid
flowchart LR
    subgraph Frontend["frontend / Next.js 15"]
        Console[AI operations console]
        Hooks[Realtime hooks]
        Charts[Recharts telemetry]
        UI[shadcn-style components]
    end

    subgraph Backend["backend / FastAPI"]
        API[REST API]
        WS[WebSocket hub]
        Scheduler[APScheduler]
        Pipeline[normalize + rank + trends]
        Alerts[alert engine]
    end

    subgraph Sources["AI ecosystem"]
        Arxiv[arXiv]
        Forums[Alignment Forum + LessWrong]
        Labs[OpenAI + Anthropic + DeepMind]
        OpenSource[GitHub + HuggingFace]
    end

    Sources --> Pipeline
    Scheduler --> Pipeline
    Pipeline --> Postgres[(PostgreSQL)]
    Pipeline --> Alerts
    Postgres --> API
    API --> Hooks
    WS --> Hooks
    Hooks --> Console
    Hooks --> Charts
```

## Features

- Async collectors for arXiv, Alignment Forum, LessWrong, OpenAI, Anthropic, DeepMind, GitHub trending AI repositories, and HuggingFace trending models.
- Retry logic, per-host rate limiting, deduplication, topic tagging, importance scoring, keyword extraction, and trend detection.
- PostgreSQL production storage with SQLite fallback for local development.
- FastAPI API with `/signals`, `/collect`, `/feeds`, `/activity`, and `/ws`.
- WebSocket event bus for collection completion, new signal batches, trend events, collector updates, and alert candidates.
- Operational severity levels: `TRACE`, `WATCH`, `ALERT`, and `CRITICAL`.
- Lightweight intelligence briefings for signals and trends, written in a compact observability tone.
- Next.js 15 frontend with TypeScript, TailwindCSS, Framer Motion, Recharts, Lucide React, and shadcn-style local primitives.
- Operational sidebar, live signal feed, severity-aware cards, terminal event stream, source pressure charts, topic volatility charts, trend acceleration, rolling throughput, and muted realtime animation.
- Docker Compose stack with PostgreSQL, backend API, and frontend console.

## Project Layout

```text
signalwatch/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── styles/
│   └── public/
├── backend/
│   ├── app/
│   │   ├── collectors/
│   │   ├── parsers/
│   │   ├── ranking/
│   │   ├── alerts/
│   │   ├── websocket/
│   │   ├── api/
│   │   ├── scheduler/
│   │   ├── storage/
│   │   └── utils/
│   └── tests/
├── docker/
├── assets/
├── docker-compose.yml
├── README.md
└── LICENSE
```

## Quickstart

Backend:

```bash
cd backend
python -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
uvicorn app.api.main:app --reload
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Open:

- Console: `http://localhost:3000`
- API: `http://localhost:8000`
- API docs: `http://localhost:8000/docs`
- WebSocket: `ws://localhost:8000/ws`

Trigger a collection run:

```bash
curl -X POST http://localhost:8000/collect
```

Docker:

```bash
docker compose up --build
```

## Configuration

```bash
SIGNALWATCH_DATABASE_URL=postgresql://signalwatch:signalwatch@localhost:5432/signalwatch
SIGNALWATCH_FRONTEND_ORIGIN=http://localhost:3000
SIGNALWATCH_DISCORD_WEBHOOK_URL=
SIGNALWATCH_REQUEST_TIMEOUT=20
SIGNALWATCH_RATE_LIMIT_PER_HOST=1.0
SIGNALWATCH_ALERT_THRESHOLD=0.72
NEXT_PUBLIC_SIGNALWATCH_API=http://127.0.0.1:8000
```

For lightweight local backend-only development, use SQLite:

```bash
SIGNALWATCH_DATABASE_URL=sqlite:///./signalwatch.db
```

## Realtime Contract

The frontend connects to `/ws` and receives JSON events:

```json
{
  "type": "collection.completed",
  "timestamp": "2026-05-15T10:45:31Z",
  "payload": {
    "result": { "inserted": 42 },
    "signals": []
  }
}
```

Trend events use `trend.detected`; initial websocket connections receive a `snapshot` event containing recent activity history.

## Roadmap

- Persist realtime activity history in PostgreSQL.
- Add collector health telemetry and latency histograms.
- Add embedding-backed topic clustering and trend baselines.
- Build alert routing policies by feed, topic, source, and severity.
- Add Prometheus metrics for ingestion volume, collector failure rate, and source drift.
- Add authenticated saved feeds and researcher watchlists.
- Add replayable daily intelligence summaries.

## Design Principles

Signalwatch should feel like infrastructure, not a landing page. The UI prioritizes operational density, calm motion, dark technical atmosphere, and fast scanability. The backend keeps the collection and ranking pipeline modular so new sources, scoring models, and alert sinks can be added without rewriting the console.

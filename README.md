# ✨ Kyto

**Kyto — Visual automation studio** - Design, build, and export interactive flows with a visual canvas, AI-assisted suggestions, and real-time collaboration.

> Release: **v2.0.1** — Branding update and major platform improvements.

[![License](https://img.shields.io/badge/license-Private-red.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://reactjs.org/)

---

## Current status (snapshot: Jan 27, 2026)

- **Frontend**: Feature-complete visual canvas, Monaco editor integration, AI assistant UI (rule-based and optional client model), collaboration client, export UI — largely implemented and stable.
- **Backend**: Core REST APIs implemented (`/api/projects`, `/api/export`, `/api/ai`, `/api/auto`), exporter produces runnable Discord.js/Discord.py projects, WebSocket collaboration implemented via a `ws` server and in-memory rooms for dev.
- **Notable gaps**: Collaboration rooms and conversational state are currently **in-memory** (no Durable Objects / KV / D1 persistence). The repo does **not** include tests/CI or a Tauri desktop build yet.

> Note: The project is intended to be deployable to Cloudflare Workers and D1/Durable Objects, but the current development server runs with `Hono` + Node (using `ws` for WebSocket collaboration). See the Backend README for migration notes and suggestions.

---

## ✨ Features

- 🎨 **Visual Canvas** - Drag-and-drop node-based editor
- 💻 **Monaco IDE** - Professional code editing experience in your browser
- 🔄 **Live Collaboration** - Real-time collaboration (in-memory in dev)
- 🤖 **AI Assistant** - Rule-based suggestions + optional client-side model
- 📦 **Multi-Language Export** - Generate Discord.js or Discord.py code

---

## 🛠️ Tech Stack

### Frontend

- React 18 + TypeScript
- @xyflow/react for the canvas
- Monaco editor via `@monaco-editor/react`
- Tailwind CSS + Framer Motion, Zustand for state
- Client-side AI via `@xenova/transformers` (optional local model)

### Backend (development)

- Hono (Express-style routing) for local dev
- `ws` WebSocket server for collaboration
- Optional Postgres (`pg`) when `DATABASE_URL` is set, otherwise in-memory storage is used

> Production target: Cloudflare Workers + D1 + Durable Objects is the intended deployment model — migrating to that stack is a recommended next step.

---

## 🚀 Getting Started (development)

### Prerequisites

- Node.js 18+
- npm or pnpm

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend dev server runs at `http://localhost:5173` (Vite default).

### Backend (local Node dev)

```bash
cd backend
npm install
npm run dev
```

Backend dev server runs at `http://localhost:8787` and handles REST + WebSocket collaboration for local development.

---

## 🔧 Migration & Next Steps

- Migrate collaboration and conversation storage to **Durable Objects** or **KV/D1** for persistence and scaling.
- Add tests and CI (vitest + GitHub Actions) to improve reliability.
- Add a Tauri desktop packaging pipeline for native distribution.

---

## 🤝 Contributing

This is a private project. For access or contribution guidelines, contact the Kyto Team.

---

**Built with ❤️ by the Kyto Team** (Jacob, Dave, John (GitHub Copilot)) — v2.0.1


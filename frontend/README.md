# Kyto Frontend

Visual automation studio frontend with a drag-and-drop canvas, AI assistant, and real-time collaboration.

## Current status (snapshot: Jan 27, 2026)

- **AI**: Two-layer approach implemented — a rule-based assistant (`AdvancedAI`) runs entirely in the client and provides contextual suggestions. Optional client-side ML model is supported via `@xenova/transformers` (pipeline uses `Xenova/Qwen2.5-0.5B-Instruct` by default).
- **Model & UX**: Model download UI is implemented; model is ~500MB and may require WebGPU for optimal performance. Users can skip download and use rule-based templates.
- **Collaboration**: WebSocket client implemented; server-side collab currently uses an in-memory room manager (dev-time `ws`).
- **Missing / To do**: Tauri desktop packaging is not set up yet, there are no automated tests/CI in the repo, and documentation needs expansion.

## ✨ Features

- Visual builder, block categories, minimap, undo/redo
- Exports to **Discord.js v14** and **Discord.py** via backend API
- Client-side AI generator + rule-based suggestions
- Real-time collaboration client (WebSocket)

## 🚀 Quick Start (dev)

### Prerequisites

- Node.js 18+ and npm
- Modern browser (WebGPU recommended for model workloads)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Environment Variables

Create `.env` file:

```env
VITE_API_URL=http://localhost:8787
# Optionally disable client-model to rely on rule-based AI
VITE_ENABLE_AI=true
# Optional WebSocket URL (default auto-derived)
VITE_WS_URL=ws://localhost:8787
```

## ⚙️ AI Details

- The client AI service (`src/services/aiService.ts`) uses `@xenova/transformers` and defaults to the `Xenova/Qwen2.5-0.5B-Instruct` pipeline for text generation. The model is downloaded to the browser cache on demand.
- If the model fails to load or the user skips download, the `AdvancedAI` engine (rule-based) provides offline/fallback suggestions.

## 🧪 Testing & Quality

- Linting and type checking scripts exist (`npm run lint`, `npm run type-check`), but there are **no unit/e2e tests** present yet. Adding `vitest` tests + GitHub Actions CI is recommended.

## 🧭 Development notes

- To simulate AI behavior without downloading the model, use the built-in rule-based prompts and `AIHelper` demo in the builder.
- The Model download dialog is implemented in `src/components/ai/ModelDownloadDialog.tsx` and progress notifications are handled by `aiService.onProgress()`.

## 🔧 Troubleshooting

- If the model download fails: verify storage and network, and try the `Skip` option to continue with templates and rule-based AI.
- For WebSocket issues: ensure backend dev server is running and `VITE_WS_URL` is correct.

---

**Notes:** Desktop/Tauri packaging, tests, and expanded docs are planned but not implemented yet.


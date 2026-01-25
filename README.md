# 🤖 Botify

**Visual Discord Bot Builder** - Design, build, and deploy Discord bots without writing code.

[![License](https://img.shields.io/badge/license-Private-red.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://reactjs.org/)

---

## ✨ Features

- 🎨 **Visual Canvas** - Drag-and-drop node-based editor powered by React Flow
- 💻 **Monaco IDE** - Professional code editing experience in your browser
- 🔄 **Live Collaboration** - Work together with up to 2 users in real-time
- 🤖 **AI Assistant** - Rule-based suggestions to help build your bot
- 📦 **Multi-Language Export** - Generate production-ready Discord.js or Discord.py code
- 🎯 **Full Discord API** - Commands, events, buttons, modals, voice, threads, and more

---

## 🛠️ Tech Stack

### Frontend

- **React 18** with TypeScript
- **XYFlow** for visual node editor
- **Monaco Editor** for code viewing
- **Tailwind CSS 4** with Neo-Brutalism design
- **Zustand** for state management
- **Framer Motion** for animations

### Backend

- **Cloudflare Workers** for serverless API
- **Durable Objects** for real-time collaboration
- **KV Storage** for project persistence
- **Hono** for routing

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

The app will run at `http://localhost:3000`

### Backend Development

```bash
cd backend
npm install
npm run dev
```

The Workers API will run at `http://localhost:8787`

---

## 📁 Project Structure

```
Botify/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   └── engine/
│   └── package.json
├── backend/           # Cloudflare Workers
│   ├── src/
│   │   ├── api/      # REST endpoints
│   │   ├── collab/   # Real-time collaboration
│   │   ├── ai/       # AI assistant
│   │   └── export/   # Code generation
│   └── package.json
└── README.md
```

---

## 🧑‍💻 Development

### Commands

```bash
# Frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Backend
npm run dev          # Start Workers dev server
npm run deploy       # Deploy to Cloudflare
npm run tail         # View live logs
```

---

## 📝 License

**Private Software** - This repository and its builds are restricted to authorized users only.

**Team**: Jacob & Dave

Unauthorized copying, distribution, or modification is prohibited.

---

## 🤝 Contributing

This is a private project. For access requests, please contact the team.

---

**Built with ⚡ by the Botify Team**

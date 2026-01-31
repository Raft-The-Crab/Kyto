# Kyto

**Kyto - Visual Discord Bot Builder** - Design, build, and export Discord bots with a visual canvas, AI-assisted suggestions, and real-time collaboration.

> Release: **v2.0.3** - January 31, 2026 - Branding update and improvements.

[![License](https://img.shields.io/badge/license-Private-red.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://reactjs.org/)

---

## Current Status

- **Frontend**: Visual canvas, Monaco editor, AI assistant, collaboration client, and export functionality fully implemented
- **Backend**: REST APIs for projects, export, and AI. WebSocket collaboration with in-memory rooms for development
- **Builder Pages**: Command, Event, and Module builders are fully functional
- **Pages**: Complete set of pages including Features, About, Contact, Blog, Careers, License
- **Known Gaps**: Collaboration persistence (in-memory only), no CI/CD pipeline yet, desktop build pending

> Note: The project is intended to be deployable to Cloudflare Workers and D1/Durable Objects, but the current development server runs with `Hono` + Node (using `ws` for WebSocket collaboration).

---

## Features

- **Visual Builder** - Drag-and-drop block-based editor for bot logic
- **Code Editor** - Professional Monaco editor with syntax highlighting
- **Real-Time Collaboration** - Work with your team in real-time
- **AI Assistant** - Smart suggestions and code generation
- **Code Export** - Generate Discord.js or Discord.py projects
- **Block Library** - 100+ pre-built blocks for common operations
- **Analytics Dashboard** - Monitor bot performance and usage
- **Live Preview** - Test your bot before deployment

---

## Tech Stack

### Frontend

- React 18 + TypeScript
- @xyflow/react for visual canvas
- Monaco Editor for code editing
- Tailwind CSS + Framer Motion for UI
- Zustand for state management
- Vite for build tooling

### Backend

- Hono framework for REST API
- WebSocket server for real-time collaboration
- Optional PostgreSQL database support
- In-memory storage for development

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

### Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs at `http://localhost:8787`

---

## Project Structure

```
kyto/
├── frontend/           # React + TypeScript frontend
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page components
│   │   ├── store/      # Zustand state management
│   │   ├── types/      # TypeScript type definitions
│   │   ├── engine/     # Code generation and AI
│   │   └── lib/        # Utilities and helpers
│   └── package.json
├── backend/            # Node.js backend
│   ├── src/
│   │   ├── api/        # REST API routes
│   │   ├── collab/     # WebSocket collaboration
│   │   └── db/         # Database schema
│   └── package.json
└── docs/               # Documentation
```

---

## Available Scripts

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Backend

- `npm run dev` - Start development server
- `npm run build` - Build TypeScript
- `npm run deploy` - Deploy to Cloudflare Workers

---

## Documentation

- **Getting Started** - Visit `/docs` in the application
- **Features** - Visit `/features` for detailed feature overview
- **About** - Learn more at `/about`
- **Contact** - Get support at `/contact`

---

## Use Cases

- **Community Bots** - Moderation, welcome messages, custom commands
- **Utility Bots** - Polls, reminders, role management
- **Entertainment Bots** - Games, music, fun commands
- **Integration Bots** - Connect Discord with external services
- **Custom Solutions** - Build exactly what you need

---

## Known Issues

- Collaboration rooms use in-memory storage (persistence pending)
- Desktop app (Tauri) not yet implemented
- Some features are under active development

---

## Roadmap

- [ ] Persistent collaboration storage (Durable Objects/D1)
- [ ] Enhanced AI capabilities
- [ ] Mobile app support
- [ ] Advanced analytics
- [ ] Marketplace for bot templates
- [ ] Custom block creation
- [ ] Team management features

---

## Team

**Kyto** is developed by a dedicated team committed to improving Discord bot development.

- Jacob - Lead Developer
- Dave - Backend Architect

---

## License

Copyright 2026 Kyto Team. All rights reserved.

This is proprietary software. See [LICENSE](LICENSE) for more information.

Generated bot code is yours to use freely without restrictions.

---

## Support

- **Email:** support@kyto.dev
- **Discord:** discord.gg/kyto
- **Documentation:** Visit `/docs` in the app
- **Contact:** Visit `/contact` for inquiries

---

**Built by the Kyto Team** - v2.0.3 - January 31, 2026

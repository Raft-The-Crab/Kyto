# Botify - Next-Generation Discord Bot Builder

🚀 **Free, powerful, and beginner-friendly visual Discord bot builder**

Build Discord bots with zero coding experience while generating production-ready source code.

## 🎯 Features

- **Visual Bot Building**: Drag-and-drop block-based editor
- **Code Generation**: Clean, production-ready Discord.js code
- **Full Discord API Coverage**: Commands, events, buttons, modals, and more
- **Template Library**: Start with pre-built bot templates
- **Offline First**: Works entirely in your browser
- **Free Forever**: No paywalls, no premium tiers
- **You Own the Code**: Export and deploy anywhere

## 📁 Project Structure

```
Botify/
├── frontend/           # React + TypeScript frontend
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── engine/     # Code generation & validation
│   │   ├── lib/        # Utilities and helpers
│   │   ├── store/      # State management (Zustand)
│   │   ├── types/      # TypeScript type definitions
│   │   ├── templates/  # Code generation templates
│   │   ├── constants/  # Discord API constants
│   │   └── hooks/      # Custom React hooks
│   ├── public/         # Static assets
│   └── package.json
├── docs/               # Documentation
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

## 🛠️ Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

## 📦 Tech Stack

- **Frontend**: Vite + React 18 + TypeScript
- **Visual Editor**: React Flow (@xyflow/react)
- **Code Editor**: Monaco Editor
- **State Management**: Zustand
- **Storage**: IndexedDB (idb)
- **Styling**: Tailwind CSS 4
- **UI Components**: Custom components with Lucide icons
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod

## 🎯 Roadmap

- [x] Project foundation and directory structure
- [ ] Visual block editor
- [ ] Discord.js code generator
- [ ] Template library
- [ ] Export functionality
- [ ] Testing simulator
- [ ] Advanced features

## 📄 License

MIT License - See LICENSE file for details

## 🤝 Contributing

Contributions welcome! Please read our contributing guidelines first.

---

Built with ❤️ for the Discord community

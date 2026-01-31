# Kyto Backend

Backend for the Kyto visual automation studio. The project is intended for Cloudflare Workers + D1 + Durable Objects in production, but the **current codebase ships a Hono-based Node dev server and a `ws` WebSocket implementation** for local development and testing.

## 🏗️ Current Architecture (dev)

```
Client (Web/Tauri) → Local Hono server (Node) → Optional Postgres (DATABASE_URL)
                                   ↓
                             `ws` WebSocket (in-memory rooms)
```

### Storage & Persistence

- **Local-first**: Projects are stored client-side (IndexedDB) and synced via the `/api/projects` endpoints.
- **Server persistence**: If `DATABASE_URL` is provided, `pg` is used to persist projects; otherwise an in-memory Map is used as a fallback.
- **Collaboration & Conversations**: Collaboration rooms and conversational state are currently **in-memory** (not persisted). Migrating to Durable Objects / KV / D1 is recommended for production.

## ✨ Features

- **🔥 Client-Side AI**: No server AI costs - runs in browser via transformers.js
- **⚡ Real-Time Collaboration**: WebSocket via Durable Objects
- **📦 Code Export**: Generate Discord.js v14 & Discord.py bots
- **🗄️ Multi-Tier Storage**: D1 → MongoDB → GitHub archival
- **🔒 Serverless**: Zero cold starts, instant scaling

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Cloudflare account (free tier)
- Wrangler CLI: `npm install -g wrangler`

### Installation

```bash
# Install dependencies
npm install

# Login to Cloudflare
wrangler login

# Create D1 database
npm run db:create

# Run migrations
npm run db:migrate

# Start development server
npm run dev
```

### Environment Setup

Configure secrets via Wrangler:

```bash
# MongoDB clusters (optional, for buffer storage)
wrangler secret put MONGODB_URI_1
wrangler secret put MONGODB_URI_2

# GitHub archive (optional)
wrangler secret put GITHUB_TOKEN
wrangler secret put GITHUB_REPO
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── index.ts              # Main Workers entry point
│   ├── api/
│   │   ├── projects.ts       # Project CRUD (D1)
│   │   ├── export.ts         # Bot code generation
│   │   └── autoGen.ts        # Template-based generation
│   ├── collab/
│   │   └── room.ts           # Durable Object for WebSocket
│   ├── db/
│   │   └── d1-schema.sql     # Database schema
│   └── types.ts              # TypeScript types
├── wrangler.toml             # Cloudflare config
└── package.json
```

## 🔌 API Endpoints

### Projects

- `GET /api/projects` - List all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create/update project
- `DELETE /api/projects/:id` - Delete project

### Export

- `POST /api/export` - Generate bot code
  ```json
  {
    "canvas": { "blocks": [...], "connections": [...] },
    "language": "discord.js" | "discord.py",
    "settings": { "botToken": "...", "clientId": "..." }
  }
  ```

### Auto-Generate

- `POST /api/ai/auto` - Generate command from template
  ```json
  {
    "prompt": "create a ping command"
  }
  ```

### Collaboration (WebSocket)

- `WS /collab/:projectId` - Real-time collaboration room

## 🧪 Development

```bash
# Start local dev server
npm run dev

# Test build
npm run build

# Run tests
npm test
```

## 🚢 Deployment

```bash
# Deploy to Cloudflare Workers
npm run deploy
```

Your backend will be live at: `https://kyto-backend.{your-subdomain}.workers.dev`

### Custom Domain (Optional)

Add to `wrangler.toml`:

```toml
routes = [
  { pattern = "api.kyto.app/*", zone_name = "kyto.app" }
]
```

## 🔐 Security

- **Rate Limiting**: Implemented via Durable Objects
- **CORS**: Configured for frontend domains only
- **Input Validation**: Zod schemas on all endpoints
- **Token Safety**: Never log or expose bot tokens

## 📊 Monitoring

View logs in Cloudflare dashboard or via CLI:

```bash
wrangler tail
```

## 🆓 Free Tier Limits

Cloudflare Workers Free Tier:

- ✅ 100,000 requests/day
- ✅ 10ms CPU time/request
- ✅ D1: 5GB storage, 5M reads/day, 100K writes/day
- ✅ Durable Objects: 1M requests/month

Perfect for small-to-medium Discord bot builders!

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📝 License

MIT License - see LICENSE file for details

## 🔗 Links

- [Kyto Frontend](../frontend)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers)
- [D1 Documentation](https://developers.cloudflare.com/d1)
- [Durable Objects Guide](https://developers.cloudflare.com/workers/runtime-apis/durable-objects)

---

**Built with ❤️ using Cloudflare Workers**

# Kyto Developer Guide

Internal documentation for contributors and maintainers.

## Project Structure

- `frontend/` — React + Vite app (UI, client logic)
- `backend/` — Cloudflare Workers API (Hono, Zod, Durable Objects)
- `docs/` — User-facing docs, guides, API reference

## Setup

1. Clone the repo
2. Install dependencies in both `frontend` and `backend`:
   ```sh
   cd frontend && npm install
   cd ../backend && npm install
   ```
3. Copy and configure environment files as needed
4. Run dev servers:
   - Frontend: `npm run dev` (port 3000)
   - Backend: `npm run dev` (Cloudflare Wrangler)

## Architecture

- **Frontend:** Modular React, TailwindCSS, Radix UI, Framer Motion, Monaco Editor
- **Backend:** Hono routes, Zod validation, Durable Objects for collab, KV for storage

## Contributing

- Follow code style (ESLint, Prettier)
- Write/maintain tests (Vitest)
- Use feature branches and PRs
- Document new features in `/docs`

## Scripts

- `dev` — Start dev server
- `build` — Production build
- `lint` — Lint code
- `test` — Run tests
- `type-check` — TypeScript check

## Advanced

- See `/backend/wrangler.example.toml` for Cloudflare config
- See `/frontend/vite.config.ts` for Vite setup

## Contact

For internal questions: dev@kyto.app

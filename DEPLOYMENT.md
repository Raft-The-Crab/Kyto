# Deployment Guide - Kyto

Complete deployment guide for Kyto backend and frontend.

## 🎯 Overview

Kyto consists of two parts:

1. **Backend**: Cloudflare Workers + D1 + Durable Objects
2. **Frontend**: Static React app (Vite)

## 🔧 Backend Deployment (Cloudflare Workers)

### Prerequisites

- Cloudflare account (free tier works)
- Wrangler CLI: `npm install -g wrangler`
- Git repository

### Step 1: Setup Cloudflare

```bash
# Login to Cloudflare
wrangler login

# Navigate to backend
cd backend

# Install dependencies
npm install
```

### Step 2: Create D1 Database

```bash
# Create D1 database
wrangler d1 create kyto

# Copy the database_id from output
# Update wrangler.toml with your database_id
```

### Step 3: Run Migrations

```bash
# Apply schema
wrangler d1 execute kyto --file=./src/db/d1-schema.sql
```

### Step 4: Set Secrets (Optional)

For MongoDB buffer storage and GitHub archival:

```bash
# MongoDB clusters (buffer storage)
wrangler secret put MONGODB_URI_1
# Paste your MongoDB Atlas connection string

wrangler secret put MONGODB_URI_2
# Paste second cluster connection string

# GitHub archival
wrangler secret put GITHUB_TOKEN
# Your GitHub personal access token

wrangler secret put GITHUB_REPO
# Format: username/repo-name
```

### Step 5: Deploy

```bash
# Deploy to Cloudflare Workers
npm run deploy

# Your API will be at:
# https://kyto-backend.{your-subdomain}.workers.dev
```

### Step 6: Custom Domain (Optional)

```toml
# Add to wrangler.toml
routes = [
  { pattern = "api.yourdomain.com/*", zone_name = "yourdomain.com" }
]
```

Then deploy again:

```bash
npm run deploy
```

---

## 🎨 Frontend Deployment

### Option 1: Cloudflare Pages (Recommended)

```bash
cd frontend

# Install dependencies
npm install

# Update .env.production
echo "VITE_API_URL=https://your-backend-url.workers.dev" > .env.production

# Deploy
npm run build
npx wrangler pages deploy dist --project-name=kyto

# Your frontend will be at:
# https://kyto.pages.dev
```

### Option 2: Vercel

```bash
cd frontend

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variable in Vercel dashboard:
# VITE_API_URL = https://your-backend-url.workers.dev
```

### Option 3: Netlify

1. Connect your Git repository to Netlify
2. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Environment variables:
   - `VITE_API_URL` = `https://your-backend-url.workers.dev`
4. Deploy

### Option 4: Static Hosting (GitHub Pages, etc.)

```bash
cd frontend

# Build
npm run build

# Upload dist/ folder to your hosting provider
```

---

## 🔐 Environment Variables

### Backend (Cloudflare Secrets)

| Secret          | Required | Description                      |
| --------------- | -------- | -------------------------------- |
| `MONGODB_URI_1` | No       | First MongoDB buffer cluster     |
| `MONGODB_URI_2` | No       | Second MongoDB buffer cluster    |
| `GITHUB_TOKEN`  | No       | GitHub personal access token     |
| `GITHUB_REPO`   | No       | Archive repo (format: user/repo) |

### Frontend

| Variable         | Required | Description           | Example                  |
| ---------------- | -------- | --------------------- | ------------------------ |
| `VITE_API_URL`   | Yes      | Backend API URL       | `https://api.kyto.app` |
| `VITE_ENABLE_AI` | No       | Enable client-side AI | `true`                   |

---

## 🧪 Testing Deployment

### Backend Health Check

```bash
curl https://your-backend-url.workers.dev/
# Should return: {"status":"ok","message":"Kyto backend is running"}
```

### API Test

```bash
curl https://your-backend-url.workers.dev/api/projects \
  -H "X-User-ID: test-user"
# Should return: {"projects":[]}
```

### WebSocket Test

```javascript
const ws = new WebSocket(
  "wss://your-backend-url.workers.dev/collab/test-project-id",
);
ws.onopen = () => console.log("Connected!");
```

### Frontend Test

1. Open your frontend URL
2. Create a new project
3. Add blocks to canvas
4. Export code
5. Test AI model download (optional)

---

## 📊 Monitoring

### Cloudflare Dashboard

- **Workers**: View logs, metrics, errors
- **D1**: Database usage, queries
- **Durable Objects**: Active connections

### Logs

```bash
# Real-time backend logs
wrangler tail

# Filter for errors only
wrangler tail --status error
```

---

## 🚨 Troubleshooting

### Backend Issues

**Error: D1 database not found**

- Verify `database_id` in `wrangler.toml`
- Run migrations: `npm run db:migrate`

**Error: Durable Object not bound**

- Check `wrangler.toml` has correct DO binding
- Redeploy: `npm run deploy`

**CORS errors**

- Verify frontend URL in backend CORS settings
- Check `src/index.ts` CORS configuration

### Frontend Issues

**Can't connect to backend**

- Check `VITE_API_URL` is correct
- Ensure backend is deployed and accessible
- Check browser console for CORS errors

**AI model won't download**

- Browser must support WebGPU
- Ensure 1GB+ free storage
- Use fallback templates if needed

---

## 🔄 CI/CD Setup

### GitHub Actions (Backend)

```yaml
# .github/workflows/deploy-backend.yml
name: Deploy Backend

on:
  push:
    branches: [main]
    paths: ["backend/**"]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

### GitHub Actions (Frontend)

```yaml
# .github/workflows/deploy-frontend.yml
name: Deploy Frontend

on:
  push:
    branches: [main]
    paths: ["frontend/**"]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run build
      - uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: kyto
          directory: dist
```

---

## 💰 Cost Estimate

### Cloudflare Free Tier

- **Workers**: 100,000 requests/day ✅ FREE
- **D1**: 5GB storage, 5M reads/day, 100K writes/day ✅ FREE
- **Durable Objects**: 1M requests/month ✅ FREE
- **Pages**: Unlimited sites ✅ FREE

### MongoDB Atlas Free Tier

- **Cluster 1**: 512MB storage ✅ FREE
- **Cluster 2**: 512MB storage ✅ FREE

### GitHub

- **Private Repo**: Unlimited storage (for code) ✅ FREE

**Total Monthly Cost: $0** 🎉

---

## 📈 Scaling

### When you outgrow free tier:

**Cloudflare Workers Paid ($5/month)**

- Unmetered requests
- Longer CPU time
- More Durable Object storage

**MongoDB Paid (from $9/month)**

- Larger clusters
- Auto-scaling
- Advanced features

**Alternative: Self-hosted**

- VPS ($5-10/month)
- Run Node.js backend directly
- Use PostgreSQL/SQLite

---

## ✅ Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] D1 database created and migrated
- [ ] Secrets configured (if using MongoDB/GitHub)
- [ ] Frontend deployed
- [ ] `VITE_API_URL` environment variable set
- [ ] Health check passes
- [ ] Create test project via UI
- [ ] Export test bot code
- [ ] Real-time collaboration works
- [ ] AI model download works (optional)
- [ ] Custom domain configured (optional)
- [ ] CI/CD pipeline set up (optional)
- [ ] Monitoring/alerts configured

---

## 🔗 Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler)
- [D1 Database](https://developers.cloudflare.com/d1)
- [Durable Objects](https://developers.cloudflare.com/workers/runtime-apis/durable-objects)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy)

Need help? Open an issue on GitHub!

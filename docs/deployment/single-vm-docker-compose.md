# Single VM deployment with Docker Compose (explained step-by-step)

If you want **maximum control** and don’t mind doing some ops work, a single-VM deployment is a great choice.

This guide explains both:

1. **How this deployment works** (architecture)
2. **What you should do** (exact steps)

It is tailored to this Nx monorepo:

- `apps/shell` → frontend (Vite/React)
- `apps/api` → backend (Node/Express)
- `libs/schemas` → shared code used by apps

---

## 0) How this deployment works

Think of your deployment as 3 layers:

### Layer A: Public internet entry
- Users hit `https://app.yourdomain.com` and `https://api.yourdomain.com`.
- A reverse proxy (Caddy) on the VM receives traffic and handles HTTPS certificates.

### Layer B: Application containers (Docker Compose)
- `shell` container serves built frontend files on internal port `8080 -> 80`.
- `api` container runs your Express server on internal port `4000 -> 4000`.

### Layer C: Data services
- API connects to MongoDB and Redis using env vars (`MONGO_URI`, `REDIS_URL`).
- Prefer managed Mongo/Redis in production to avoid DB-on-same-VM risk.

Request flow:

1. Browser loads frontend from `app.yourdomain.com`.
2. Frontend calls API at `api.yourdomain.com` (from `VITE_API_URL`).
3. API reads/writes Mongo + Redis.

---

## 1) What you should do first (decision checklist)

Before any commands, decide these 5 items:

1. Cloud VM provider: DigitalOcean / AWS EC2 / Hetzner / Azure VM.
2. Domain names: usually `app.<domain>` and `api.<domain>`.
3. Data hosting: Mongo Atlas + Upstash Redis (recommended).
4. Secrets location: `.env.production.local` on VM (never commit).
5. Deployment method: manual `git pull && docker compose up -d --build` first.

If these are decided, you can deploy in <1 hour.

---

## 2) Provision and prepare VM

### 2.1 Create VM
- Ubuntu 22.04 or 24.04 LTS
- Minimum 2 vCPU, 4 GB RAM, 40+ GB disk

### 2.2 DNS
Create records pointing to VM public IP:
- `app.yourdomain.com`
- `api.yourdomain.com`

### 2.3 Base packages

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y ca-certificates curl git
```

---

## 3) Install Docker + Docker Compose

```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
newgrp docker

docker --version
docker compose version
```

---

## 4) Create production files in repo

Add these files at your repo root.

## 4.1 `.dockerignore`

```gitignore
node_modules
dist
.git
.gitignore
.nx
.vscode
.env*
```

## 4.2 `Dockerfile.api`

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json ./
COPY tsconfig.base.json ./
COPY apps ./apps
COPY libs ./libs
RUN pnpm install --frozen-lockfile

RUN pnpm nx run api:build:production

FROM node:20-alpine AS runtime
WORKDIR /app
RUN corepack enable
ENV NODE_ENV=production

COPY --from=build /app/dist/apps/api ./
RUN pnpm install --prod --frozen-lockfile=false

EXPOSE 4000
CMD ["node", "main.js"]
```

## 4.3 `Dockerfile.shell`

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml nx.json ./
COPY tsconfig.base.json ./
COPY apps ./apps
COPY libs ./libs
RUN pnpm install --frozen-lockfile

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN pnpm nx run shell:build

FROM nginx:1.27-alpine
COPY --from=build /app/dist/apps/shell /usr/share/nginx/html
COPY nginx.shell.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

## 4.4 `nginx.shell.conf`

```nginx
server {
  listen 80;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri /index.html;
  }
}
```

## 4.5 `compose.prod.yml`

```yaml
services:
  api:
    build:
      context: .
      dockerfile: Dockerfile.api
    container_name: attendance-api
    restart: unless-stopped
    environment:
      NODE_ENV: production
      PORT: 4000
      MONGO_URI: ${MONGO_URI}
      REDIS_URL: ${REDIS_URL}
    ports:
      - "127.0.0.1:4000:4000"

  shell:
    build:
      context: .
      dockerfile: Dockerfile.shell
      args:
        VITE_API_URL: ${VITE_API_URL}
    container_name: attendance-shell
    restart: unless-stopped
    ports:
      - "127.0.0.1:8080:80"
```

> Using `127.0.0.1` binds app ports only to localhost so only Caddy can access them.

## 4.6 `.env.production.local` (on VM only)

```env
MONGO_URI=mongodb+srv://...
REDIS_URL=rediss://...
VITE_API_URL=https://api.yourdomain.com
```

Do **not** commit this file.

---

## 5) Install and configure Caddy (HTTPS + routing)

## 5.1 Install Caddy

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install -y caddy
```

## 5.2 Set `/etc/caddy/Caddyfile`

```caddyfile
app.yourdomain.com {
  reverse_proxy localhost:8080
}

api.yourdomain.com {
  reverse_proxy localhost:4000
}
```

## 5.3 Validate and reload

```bash
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
sudo systemctl status caddy --no-pager
```

---

## 6) Deploy (first release)

From your VM:

```bash
git clone <your-repo-url>
cd attendance-monorepo
```

Create env file:

```bash
nano .env.production.local
```

Start containers:

```bash
docker compose -f compose.prod.yml --env-file .env.production.local up -d --build
```

Verify:

```bash
docker compose -f compose.prod.yml ps
docker compose -f compose.prod.yml logs --tail=100 api
curl -I http://localhost:8080
curl -I http://localhost:4000
curl -I https://app.yourdomain.com
curl -I https://api.yourdomain.com
```

---

## 7) Update process (every new release)

```bash
cd attendance-monorepo
git pull
docker compose -f compose.prod.yml --env-file .env.production.local up -d --build
```

Rollback option (simple):
- Checkout previous commit/tag, run same compose command again.

---

## 8) Security baseline (must do)

1. Firewall: allow only `22`, `80`, `443`.
2. Keep `4000` and `8080` localhost-bound (already done in compose).
3. Enable unattended security upgrades.
4. Use strong, rotated DB/Redis secrets.
5. Ensure API CORS only allows frontend origin in production.
6. Ensure cookies are secure over HTTPS in production.

---

## 9) Observability + operations

Useful commands:

```bash
docker compose -f compose.prod.yml logs -f api
docker compose -f compose.prod.yml logs -f shell
docker stats
```

Recommended add-ons:
- Uptime monitoring (Uptime Kuma / Better Stack)
- Error tracking (Sentry)
- VM metrics (Netdata / Grafana Agent)

---

## 10) Common mistakes and quick fixes

### Frontend can’t reach API
- Check `VITE_API_URL` value in `.env.production.local`.
- Rebuild frontend container after change:

```bash
docker compose -f compose.prod.yml --env-file .env.production.local up -d --build shell
```

### API exits on startup
- Usually missing `MONGO_URI` or `REDIS_URL`.
- Check logs:

```bash
docker compose -f compose.prod.yml logs --tail=200 api
```

### HTTPS not issuing certs
- DNS may not point to VM yet.
- Port 80/443 may be blocked in firewall/security group.

---

## 11) Your exact action plan (copy/paste checklist)

1. Provision VM + point DNS.
2. Install Docker and Caddy.
3. Add deployment files to repo (`Dockerfile.api`, `Dockerfile.shell`, `compose.prod.yml`, etc.).
4. Push repo changes.
5. Clone repo on VM.
6. Create `.env.production.local` with real secrets.
7. Run `docker compose ... up -d --build`.
8. Verify local + public URLs.
9. Lock firewall to 22/80/443 only.
10. Set a regular update routine (`git pull` + compose rebuild).

If you want, next step I can generate these exact files directly in your repo so you only need to fill secrets and run the commands.

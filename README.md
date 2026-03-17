# Attendance Tracker

A full-stack attendance management platform built with a **MERN + Nx monorepo** architecture.

> **Stack:** MongoDB, Express, React, Node.js, Nx, Docker, Nginx, Redis, JWT

🔗 **Repository:** [github.com/cyrus-rumao/attendance-monorepo](https://github.com/cyrus-rumao/attendance-monorepo)

---

## Highlights

- Architected as an **Nx monorepo** with modular backend services and a **microfrontend-ready React shell** for scalable development and independent evolution.
- Implemented secure **JWT authentication** (access + refresh tokens) with **Redis-backed sessions** and role-aware authorization patterns.
- Containerized services with **Docker** and routed traffic via **Nginx reverse proxy** for production-friendly deployments.
- Built structured REST APIs with clear service boundaries for maintainability and fast feature iteration.

---

## Monorepo Structure

```text
apps/
  api/      # Node.js + Express backend
  shell/    # React + Vite frontend
libs/
  schemas/  # Shared schemas/types/constants
docs/
  deployment/
```

### Nx Projects

- `api` (application)
- `shell` (application)
- `schemas` (library)

---

## Core Features

- Authentication and session management
  - JWT access token + refresh token strategy
  - HTTP-only auth cookies
  - Redis session storage / token lifecycle support
- Attendance workflows
  - Mark and review attendance records
  - Dashboard/today views
- Timetable and subject management
  - Subject CRUD flows
  - Timetable creation and scheduling
- Shared schema library
  - Centralized reusable data contracts

---

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- Zustand
- React Router

### Backend
- Node.js + Express
- MongoDB (Mongoose)
- Redis (ioredis)
- JWT + cookie-based auth

### DevOps / Platform
- Nx monorepo
- Docker & Docker Compose
- Nginx reverse proxy
- pnpm workspaces

---

## Getting Started

### 1) Prerequisites

- Node.js 20+
- pnpm 10+
- Docker + Docker Compose (for containerized runs)
- MongoDB instance
- Redis instance

### 2) Install dependencies

```bash
pnpm install
```

### 3) Environment variables

Create your env files (for local/dev and production as needed).

#### API (`apps/api` runtime)

Required variables:

```env
PORT=4000
MONGO_URI=mongodb+srv://...
REDIS_URL=rediss://...
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
NODE_ENV=development
```

#### Frontend (`apps/shell` build/runtime)

```env
VITE_API_URL=http://localhost:4000
```

> Note: in production, set `VITE_API_URL` to your public API domain.

---

## Run Locally (Nx)

Start backend:

```bash
nx serve api
```

Start frontend:

```bash
nx serve shell
```

Build projects:

```bash
pnpm nx run api:build
pnpm nx run shell:build
pnpm nx run schemas:build
```

Explore project graph:

```bash
pnpm nx graph
```

---

## Docker Deployment

A ready Docker/Nginx setup is included at the repo root (`docker-compose.yml`, `nginx.conf`).

Run containers:

```bash
docker compose up -d
```

Stop containers:

```bash
docker compose down
```

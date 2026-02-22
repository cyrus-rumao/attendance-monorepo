<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# Project Guidelines for AI Agents

## Code Style

- TypeScript (strict) for backend ([apps/api/src](apps/api/src)) and frontend ([apps/shell/src](apps/shell/src)).
- Use ESLint configs in [eslint.config.mjs](eslint.config.mjs) and [apps/shell/eslint.config.mjs](apps/shell/eslint.config.mjs) for formatting and module boundaries.
- React components use functional style and Tailwind CSS ([apps/shell/src/components](apps/shell/src/components)).
- Zod schemas for validation ([apps/shell/src/schemas](apps/shell/src/schemas)).

## Architecture

- Nx monorepo: apps/api (Express, MongoDB, Redis), apps/shell (React, Vite, Zustand).
- API structure: models, controllers, routes, middlewares, config ([apps/api/src]).
- Frontend structure: pages, components, stores, schemas, lib ([apps/shell/src]).
- Timetable and subject logic: see [apps/api/src/controllers/timetable.controller.ts](apps/api/src/controllers/timetable.controller.ts) and [apps/shell/src/stores/useTimetableStore.ts](apps/shell/src/stores/useTimetableStore.ts).

## Build and Test

- Install: `pnpm install`
- Build: `pnpm nx build <project>` (e.g., `pnpm nx build api`)
- Serve: `pnpm nx serve <project>`
- Lint: `pnpm nx lint <project>`
- Test: `pnpm nx test <project>`
- Sync TS project refs: `pnpm nx sync`
- CI: Nx Cloud, see [README.md](README.md) for setup and links.

## Project Conventions

- Always use Nx CLI via workspace package manager (pnpm nx ...).
- API endpoints require authentication middleware ([apps/api/src/middlewares/auth.middleware.ts](apps/api/src/middlewares/auth.middleware.ts)).
- Use Zod for request validation ([apps/api/src/middlewares/validation.middleware.ts](apps/api/src/middlewares/validation.middleware.ts)).
- Timetable and subject types are consistent across backend and frontend.
- Use Zustand for frontend state ([apps/shell/src/stores]).

## Integration Points

- API: Express, MongoDB ([apps/api/src/config/db.ts](apps/api/src/config/db.ts)), Redis ([apps/api/src/config/redis.ts](apps/api/src/config/redis.ts)).
- Frontend: Axios for API calls ([apps/shell/src/lib/axios.ts](apps/shell/src/lib/axios.ts)).
- Authentication: JWT, cookies, Redis for refresh tokens ([apps/api/src/controllers/auth.controller.ts](apps/api/src/controllers/auth.controller.ts)).

## Security

- Auth required for all protected routes ([apps/api/src/middlewares/auth.middleware.ts](apps/api/src/middlewares/auth.middleware.ts)).
- Secure cookies, httpOnly, sameSite, maxAge ([apps/api/src/controllers/auth.controller.ts](apps/api/src/controllers/auth.controller.ts)).
- Sensitive config via environment variables (dotenv).

---

For Nx-specific agent skills, see below:

- For workspace navigation, use `nx-workspace` skill.
- For scaffolding, use `nx-generate` skill.
- For running tasks, use `nx-run-tasks` skill.
- For CI monitoring, use `monitor-ci` skill.
- For plugin discovery, use `nx-plugins` skill.
- For advanced config, use `nx_docs`.

<!-- nx configuration end-->

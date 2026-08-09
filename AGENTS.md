# AGENTS.md

DashyB: Electron home dashboard (React 19 + TS renderer, Express backend, Electron main). Touchscreen kiosk for Raspberry Pi, fixed ~1024x600/800x480, not responsive.

## Process topology

- Electron main: `index.js` → webpack bundle in `build/`. In dev it spawns the backend and loads the webpack dev-server URL; in production it spawns the bundled backend and loads `dist/main-screen.html`.
- Renderer: `src/` → webpack bundle in `dist/`, served by webpack-dev-server on port 3000 during dev.
- Backend: `server/` (Express, port 8081 via `BACKEND_PORT`), ncc-bundled to `server-dist/` for production. Serves media from `~/media/video` and `~/media/music` (missing dirs are logged and skipped).
- Full dev run: `npm run dev` — starts frontend-server:3000, which auto-spawns electron, which spawns backend:8081. Three processes total.
- Renderer talks to the backend at `http://localhost:8081`; set `USE_EXTERNAL_BACKEND=true` + `BACKEND_API_URL` to point elsewhere.

## Architecture

- src/components - UI components/features
- src/pages - UI pages
- src/api - API clients
- src/hooks - custom React hooks
- src/config - core configurations
- src/store - state management
- test/ - test files

## Commands

- `npm test` — Jest unit tests in `test/unit` (jsdom, ts-jest). This is the only thing CI (CircleCI) runs.
- `npx tsc --noEmit` — typecheck; currently clean.
- `npm run lint` — NOT a gate. It lints the generated `server-dist/` ncc bundle and reports ~20k errors. Only source files (`src/`, `main/`, `server/`, `test/`) matter; those are mostly tolerated `any`/unused warnings.
- `npm run build` — renderer (`dist/`) then main (`build/`).
- `npm run bundle-backend` — ncc `server/backend-server.js` → `server-dist/` (required before packaging).
- `npm run build:pi` / `build:pi64` — test + build + bundle-backend + electron-builder deb (armv7l/arm64). Requires `dpkg` on macOS (`brew install dpkg`).
- `npm run test:acceptance` — BROKEN: imports `spectron`, which is not a dependency. Don't rely on it.

## Env/config gotchas

- Renderer env vars are inlined at BUILD TIME by webpack `DefinePlugin` from root `.env` (see `webpack.config.common.js`). Edit `.env` → rebuild. `src/config/index.ts` is the single config read point.
- `NODE_ENV=development` ⇒ dev mode (`config.isDevelopment`); anything else ⇒ production paths.
- Dev reads root `.env`; production electron uses `.env.production` (electron-builder copies it to `resources/.env`).
- `src/config/homeConfig.json` is gitignored; `src/config/index.ts`'s `homeConfigPromise` loads it only for `development`/`production` NODE_ENV, else `sample.homeConfig.json` (Jest sets NODE_ENV=test, so tests get the sample).

## Testing quirks

- CSS imports stubbed via `identity-obj-proxy`; picovoice/porcupine libs are mocked via `test/__mocks__` (mapped in `jest.config.js`).
- `transformIgnorePatterns` whitelists only axios / porcupine / `@ryusenpai/shared-components`.

## Style

- Prettier + eslint-config-standard, but with `semi: false`, `singleQuote`, `trailingComma: none`, `bracketSpacing: false`. No semicolons in TS/JS source. Match existing style.
- `no-console` is off — console.logs are normal in this codebase.
- TS is loose (`noImplicitAny: false`); don't chase `any`/unused-vars lint warnings.
- Commit messages are lowercase conventional prefixes (`chore:`, `fix:`, `style:`, `test:`, `debug:`). Branches: `main`, `release`, feature branches.

# BenchCoder frontend

React/TypeScript/Vite interface for the sibling BenchCoder Django API.

## Run locally

1. Start the backend stack using its README.
2. Install dependencies: `npm ci`.
3. Copy `.env.example` to `.env.local` and set `VITE_API_URL=http://127.0.0.1:8000/api`.
4. Run `npm run dev` (port8080). If Windows reserves that port, use `npm run dev -- --host 127.0.0.1 --port 5173`.
5. Register a normal account. Administrators are created using the backend's `createsuperuser` command.

## Workflows

- Seven-day access-token authentication; expired sessions require sign-in.
- Paginated problem browsing with search and difficulty filters.
- Python/JavaScript CodeMirror editor with per-user local drafts.
- Asynchronous sample runs and full submissions with bounded result polling.
- Submission history, diagnostics, runtime, memory, and public sample results.
- Staff-only problem/test-case management.

All data comes from the API. There are no simulated verdicts, offline demo accounts, or AI/RAG features.

## Verify and deploy

Run `npm run build`, `npm run lint`, and `npx tsc --noEmit -p tsconfig.app.json`. Serve the generated `dist` directory with a fallback to `index.html` for client routes. Set the build-time API URL and configure the backend's CORS origins for your frontend deployment. See the backend integration/resilience smoke scripts for actual Redis/Celery/Docker tests.

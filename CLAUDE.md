# PolicyLens

One insurance product, two apps, one Supabase backend.

- apps/console: Angular 22 console for insurer staff
- apps/assistant: Next.js 16 + React assistant for customers
- packages/contracts: Zod schemas and types shared by both apps

The sprint plan is in @docs/sprint-plan.md. Work on one story at a time.

## Commands (run from the repo root)

- npm run dev:console / npm run dev:assistant
- npm run test:console / npm run test:assistant
- npm run build:console / npm run build:assistant

## Rules

- The two apps never import from each other. Shared types go in packages/contracts.
- TypeScript strict mode. No `any`.
- Do not add a dependency without asking me first.
- Secrets live only in server code. Never expose a model API key to the browser.
- Every story ends with its tests passing and its "Accepted when" check stated.
- Make small commits, one per story step. Do not push.

## How to work with me

- I am building this to learn and to explain it in interviews.
- Before writing code, show me a short plan and wait for approval.
- Implement one numbered step, then stop and summarise what changed and why.
- If a step involves a design choice, name the alternative you rejected.
  ˜

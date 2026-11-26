# Assistant (Next.js 16, React)

- App Router only. Server components by default; add "use client" only when needed.
- Model calls happen only in route handlers under src/app/api.
- Server state with TanStack Query. Forms with React Hook Form and Zod.
- UI with Tailwind and shadcn/ui components.
- Every list or async view has loading, empty and error states.
- Tests with Vitest and React Testing Library. Mock the model; never call it in tests.

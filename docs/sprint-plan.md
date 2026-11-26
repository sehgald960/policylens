# Project: PolicyLens

PolicyLens is one insurance product with two apps on one backend: a Next.js AI assistant for customers and an Angular console for the insurer's staff. Every track in this plan lands here, so there is nothing else to build.

## The product

**User problem.** Policy documents are long and dense. Customers learn what is excluded only when a claim is rejected, and insurers cannot let an AI answer unchecked.

| App | Who uses it | What it does | What it proves |
| --- | --- | --- | --- |
| Assistant (`apps/assistant`, Next.js 16) | Customer | Upload a policy, ask questions, get streamed answers with citations, see a "policy at a glance" card | React, Next.js, LLM integration, AI UX |
| Console (`apps/console`, Angular 22) | Insurer staff | Review and correct AI-extracted policy summaries, see flagged answers and feedback, works offline, shows live web vitals | Modern Angular, performance, offline, large tables |
| Shared | Both | Supabase (auth, Postgres with pgvector, storage) and a `packages/contracts` folder of Zod schemas and types | Contract-first thinking across two frameworks |

The link between the apps is human review: the assistant extracts, staff confirm in the console, and confirmed fields flow back to the customer.

&#91;embedded content: PolicyLens architecture · 2 apps, 1 backend, 1 model API\]

## Tech stack

| Layer | Choice |
| --- | --- |
| Repo | One GitHub repo with npm workspaces. No Nx, no micro-frontends. |
| Assistant | Next.js 16 App Router, TypeScript, Tailwind with shadcn/ui, TanStack Query, AI SDK 7 |
| Console | Angular 22 standalone, signals, zoneless, NgRx SignalStore, Angular service worker, IndexedDB |
| Backend | Supabase with row-level security; Next.js route handlers for all model calls |
| Model | Gemini API free tier through the AI SDK, with a second free provider as fallback |
| Quality | Vitest in both apps, React Testing Library, one Playwright test, an eval script |
| Delivery | Assistant on Vercel; console on AWS S3 and CloudFront; GitHub Actions for both |

Use only public sample policies. Free-tier model requests may be used to improve the provider's products.

## Sprint plan

Each week is a one-week sprint. A sprint has a goal, a set of user stories, and a review on Saturday. Each story says who it is for, the steps to build it, and the test that proves it is finished.

### How a sprint runs

1. **Monday, 10 minutes:** read the sprint's stories top to bottom. That is your planning.
2. **Each day:** build the story marked for that day, in step order. Commit after each step.
3. **A story is done** only when its "Accepted when" test passes on the deployed app, not on your machine.
4. **Saturday review:** run every acceptance test, record a GIF, update the README.
5. **Saturday retrospective:** three lines in `RETRO.md`: what shipped, what slipped, what to change.

An unfinished story moves to Monday of the next sprint. Do not start a new story while one is half-built.

### QSprint 0 (to 15 Nov): setup

The commands, folder layout and Claude Code files for this sprint are on Project setup.

- [ ] StackBlitz React assignments pushed to GitHub with a README (Wed)
- [ ] Accounts: Vercel, Supabase, Google AI Studio, AWS free plan with a budget alert (Thu)
- [ ] `policylens` repo with npm workspaces: `apps/console`, `apps/assistant`, `packages/contracts` (Thu)
- [ ] Supabase tables: `policies`, `summaries`, `reviews`, `feedback` (Fri)
- [ ] Seed data: three public sample policies and three hand-written summaries, so the console has something to review before AI exists (Fri)

### Sprint 1 (16 to 22 Nov): the Angular console

This sprint now runs at 2 hours a day from 14 to 22 Nov, beside Angular interview prep. Follow the days on the Week by week tab; the day labels on the stories below show the original order only. Steps 5 and 6 of Story 1.5 move to 28 Nov.

**Sprint goal:** insurer staff can review policy summaries in a deployed console that works offline and shows its own performance numbers.

#### Story 1.1: See all policies (Mon, about 4 h)

*As insurer staff, I want to see every uploaded policy, so that I can pick one to review.*

1. Create a zoneless Angular 22 app in `apps/console` with standalone components and lazy routes for `/policies` and `/reviews`.
2. Add a Supabase client service and read the `policies` table.
3. Build the list with `httpResource`: name, upload date, status.
4. Add a loading skeleton, an empty state, and an error state with a retry button.
5. Deploy to Vercel and put the link in the README.

**Accepted when:** the live link shows the seeded policies, and blocking the network in DevTools shows the error state with a working retry.

#### Story 1.2: Review and correct a summary (Tue, about 3 h)

*As insurer staff, I want to open a summary and correct its fields, so that customers only see verified data.*

1. Create a SignalStore holding the queue, the selected item and a computed count of pending items.
2. Build the queue page listing summaries marked "unverified".
3. Build a typed reactive form for insurer, policy type, sum insured, waiting period, exclusions and claim deadline, with validation.
4. Save a decision of confirmed, edited or rejected to the `reviews` table.

**Accepted when:** confirming a summary changes its status and lowers the pending count without a page reload.

#### Story 1.3: Only staff get in (Tue, about 1 h)

*As the insurer, I want the console behind a sign-in, so that policy data is not public.*

1. Add a Supabase email sign-in page and sign-out.
2. Add a functional route guard on `/policies` and `/reviews`.
3. Add an HTTP error interceptor that turns failures into a readable message.

**Accepted when:** opening `/reviews` while signed out redirects to sign-in.

#### Story 1.4: Keep working without a connection (Wed about 4 h, Thu about 2 h)

*As staff on a poor connection, I want to keep reviewing, so that my decisions are never lost.*

1. Add the Angular service worker. Cache the app shell as an asset group and API reads as a data group with freshness and a timeout.
2. Store decisions made offline in an IndexedDB queue.
3. Show a badge on each decision: pending, synced or failed.
4. On reconnect, replay the queue in order.
5. If the server rejects a decision, mark it failed and offer retry.
6. Show an online or offline indicator in the header.

**Accepted when:** in airplane mode you confirm two summaries and see "pending"; after reconnecting both turn "synced"; a forced server error shows "failed" with a retry that works.

#### Story 1.5: Performance you can prove (Thu about 2 h, Fri about 4 h)

*As the developer, I want measured numbers, so that I can answer "how do you track performance?" with evidence.*

1. Add the `web-vitals` library and an in-app panel showing LCP, INP and CLS.
2. Run Lighthouse and save the baseline report in `/docs`.
3. Improve: `@defer` for the review detail and vitals panel, a bundle budget, lazy-loaded images.
4. Run Lighthouse again and save the second report.
5. Write unit tests for the store and the offline queue.
6. Add a Lighthouse check to GitHub Actions with a minimum score.

**Accepted when:** the README shows before and after for three metrics with the cause of each change, and CI fails when the score drops below the budget.

#### Sprint 1 review (Sat)

Run all five acceptance tests on the live link. Record the offline GIF. Write the README sections. Tag v1.0.

### Sprint 2 (23 to 29 Nov): the assistant foundation

**Sprint goal:** a customer can sign in to a deployed Next.js app, upload a policy and manage their documents.

#### Story 2.1: Sign in to a private area (Mon, about 4 h)

*As a customer, I want to sign in, so that my documents stay private.*

1. Create a Next.js 16 app in `apps/assistant` with TypeScript, Tailwind and shadcn/ui.
2. Add Supabase server-side auth: sign-in, sign-out.
3. Put the app pages under a protected layout that redirects anonymous visitors.
4. Deploy to Vercel with environment variables set.

**Accepted when:** `/documents` redirects to sign-in when signed out, on the live link.

#### Story 2.2: Upload a policy (Tue, about 4 h)

*As a customer, I want to upload my policy PDF, so that I can ask questions about it.*

1. Build the upload form with checks for file type and size.
2. Show upload progress.
3. Store the file in Supabase Storage under the user's own folder.
4. Insert a `policies` row with name, size and status "uploaded".
5. Add row-level security so only the owner can read their rows and files.
6. Show clear errors for wrong type, too large, and network failure.

**Accepted when:** a second test user cannot see or fetch the first user's file, and an invalid file gets a specific message.

#### Story 2.3: See my documents in every state (Wed, about 4 h)

*As a customer, I want a reliable documents list, so that I always know what the app is doing.*

1. Add TanStack Query and a `useDocuments` query.
2. Build the skeleton, the empty state with an upload prompt, and the error state with retry.
3. Add delete with a confirmation, an optimistic update, and rollback on failure.

**Accepted when:** you can force each state (slow network, empty account, offline) and a failed delete puts the row back.

#### Story 2.4: The app reads the document (Thu, about 3 h)

*As a customer, I want the app to process my PDF, so that it is ready for questions.*

1. In a route handler, extract text page by page after upload and store the pages.
2. Move status from "processing" to "ready" or "failed".
3. Build a detail page showing page count and a text preview per page.

**Accepted when:** a sample policy shows the right page count, and a corrupt PDF ends as "failed" with a reason.

#### Story 2.5: Rename a document (Thu, about 1 h)

*As a customer, I want to rename a document, so that I can recognise it later.*

1. Build the form with React Hook Form and a Zod schema.
2. Save through a server action that validates again and revalidates the page.

**Accepted when:** an invalid name is rejected in the browser and on the server.

#### Story 2.6: Tests and resilience (Fri, about 4 h)

*As the developer, I want a safety net, so that later AI work does not break the basics.*

1. Write component tests for the list states and upload validation.
2. Add an error boundary around the documents area.
3. Complete the whole flow using only the keyboard and fix what blocks you.
4. Run lint, type check and tests in CI.

**Accepted when:** CI is green and sign-in, upload, rename and delete all work without a mouse.

#### Sprint 2 review (Sat)

Run all six acceptance tests on the live link. Record a GIF. Add the assistant section to the README.

### Sprint 3 (30 Nov to 6 Dec): AI arrives and the apps connect

**Sprint goal:** a customer gets streamed answers about their policy, and an AI-written summary is reviewed by staff in the console.

#### Story 3.1: Ask a question, get a streamed answer (Mon, about 4 h)

*As a customer, I want to ask about my policy in plain language, so that I do not have to read 40 pages.*

1. Store the Gemini key as a server-only environment variable.
2. Create a `POST /api/chat` route handler that calls `streamText`.
3. Write the system prompt: answer only from the policy text, which is passed inside clear delimiters.
4. Pass the document's page text as context.
5. Choose the provider from an environment variable, so a fallback is a config change.

**Accepted when:** calling the route from the terminal streams tokens, and the key appears nowhere in the browser bundle or network tab.

#### Story 3.2: A chat screen that behaves (Tue, about 4 h)

*As a customer, I want the chat to feel responsive and under my control, so that I trust it.*

1. Wire the screen to the route with `useChat`.
2. Model four states: idle, streaming, stopped, failed.
3. Add Stop, which aborts the request and keeps the partial text.
4. Add Regenerate, and Retry with a specific message for rate limits.
5. Add an empty state with three suggested questions.
6. Auto-scroll only when the user is already at the bottom.
7. Announce the finished answer to screen readers through a live region.

**Accepted when:** stopping mid-stream keeps the partial answer, scrolling up during a stream is not interrupted, and a screen reader announces the completed answer once.

#### Story 3.3: Policy at a glance (Wed, about 4 h)

*As a customer, I want the key facts pulled out, so that I see cover, exclusions and deadlines at once.*

1. Define a `PolicySummary` Zod schema in `packages/contracts`, imported by both apps.
2. Create an extraction route that asks the model for output matching the schema.
3. Validate the result; on failure, retry once with the validation error.
4. Save a valid result to `summaries` as "unverified".
5. If it still fails, save "needs manual entry".

**Accepted when:** all three sample policies produce valid summaries, and a forced bad response ends in the manual-entry state, never a crash.

#### Story 3.4: Staff review real AI output (Thu, about 2 h)

*As insurer staff, I want to check what the AI extracted, so that nothing wrong reaches a customer.*

1. Point the console's review queue at the real `summaries` table in place of the seed data.
2. Save an edit or confirmation with the reviewer and time.
3. Check that the offline queue from sprint 1 still handles these decisions.

**Accepted when:** a summary confirmed offline syncs after reconnecting.

#### Story 3.5: The customer sees what is verified (Thu, about 2 h)

*As a customer, I want to know which facts a person has checked, so that I know what to rely on.*

1. Build the "policy at a glance" card in the assistant.
2. Show a badge: "AI-extracted, unverified" or "Confirmed by staff".
3. Refresh the card when the window regains focus.

**Accepted when:** confirming in the console flips the badge in the assistant.

#### Story 3.6: Feedback and tests (Fri, about 4 h)

*As the product owner, I want to know which answers helped, so that quality can be measured later.*

1. Add thumbs up and down on each answer with `useOptimistic`, saved to `feedback`.
2. Write component tests for the four chat states using a mocked model.
3. Write schema tests in `packages/contracts`.

**Accepted when:** the tests pass without calling the real model, and a failed save rolls the thumb back.

#### Sprint 3 review (Sat)

Run all six acceptance tests on the live links. Record two GIFs: streamed chat, and the review loop across both apps.

### Sprint 4 (7 to 13 Dec): the hireable demo

**Sprint goal:** both apps deploy from CI, are monitored and documented, and are shown in a two-minute video.

#### Story 4.1: The console deploys itself to AWS (Mon, about 3 h)

*As the developer, I want a merge to deploy the console, so that releases are repeatable.*

1. Create an AWS role that GitHub Actions can assume without stored keys.
2. Write the workflow: build, sync to S3, invalidate CloudFront.
3. Configure the single-page-app fallback so deep links load.

**Accepted when:** a merge to main updates the CloudFront link within minutes, and no AWS keys exist in GitHub secrets.

#### Story 4.2: See errors before users report them (Mon, about 1 h)

*As the developer, I want errors collected, so that I can describe a real monitoring setup.*

1. Add Sentry to both apps with source maps.
2. Throw one test error in each and confirm it arrives.

**Accepted when:** each test error shows in Sentry with a readable stack trace.

#### Story 4.3: The assistant feels finished (Tue, about 4 h)

*As a customer, I want a polished app on any device, so that I take it seriously.*

1. Make loading, empty and error states consistent on every page.
2. Check layouts at 360 pixels wide.
3. Fix labels, focus order and contrast.
4. Add page titles and descriptions.
5. Reach a Lighthouse score of 90 or above on the main pages.

**Accepted when:** Lighthouse reports 90 or above for performance and accessibility on the documents and chat pages.

#### Story 4.4: Safety nets (Wed, about 4 h)

*As the product owner, I want limits and an end-to-end check, so that the demo cannot be broken or run up costs.*

1. Write one Playwright test for sign-in, upload, ask and answer, with the model mocked.
2. Run it in CI.
3. Cap output tokens per answer.
4. Cap requests per user per day and show a clear message at the limit.

**Accepted when:** the end-to-end test is green in CI, and a capped user sees the limit message.

#### Story 4.5: Tell the story (Thu, about 4 h)

*As a hiring manager, I want to understand the project in two minutes, so that I can decide to interview.*

1. Write the full README following the structure below.
2. Add `.env.example` files for both apps.
3. Record a two-minute video: upload, streamed chat, AI summary, offline staff review.

**Accepted when:** someone else can run both apps locally from the README alone.

#### Story 4.6: Release (Fri, about 4 h)

1. Fix every bug the recording exposed.
2. Tag v0.5 on both apps.

**Accepted when:** both live links match the tagged code.

#### Sprint 4 review (Sat)

Run all acceptance tests. Write a four-week retrospective. Then ask for the sprint 5 day plan.

### Sprints 5 to 8: stories

These stories get their numbered steps on the Saturday before each sprint, based on what actually shipped.

| Story | What you build | Accepted when |
| --- | --- | --- |
| 5.1 Chunking | Split page text into overlapping chunks that keep their page number, with unit tests | No chunk cuts a word, and every chunk knows its page |
| 5.2 Embed on upload | Create embeddings for each chunk and store them in pgvector | A new upload has vector rows within a minute |
| 5.3 Retrieve | A similarity search limited to the signed-in user's document, returning the top passages | Another user's passages are never returned |
| 5.4 Grounded answers | The chat route answers only from retrieved passages | The answer changes when the retrieved passages change |
| 5.5 Citations | Chips on each answer that open the source passage and page | Every answer shows at least one citation |
| 5.6 Honest refusals | A "not in this document" answer when nothing relevant is found | A question about an absent topic is refused |
| 5.7 First golden questions | 10 questions with their expected source passages | Saved in the repo |
| 6.1 Find a clause | A `findClause` tool the model can call | The chat shows which clause was looked up |
| 6.2 Payout in code | `estimateClaimPayout` as a pure function with unit tests | The number is the same on every run |
| 6.3 Tool states | Calling, result and error states rendered in the chat | Each state can be shown on demand |
| 6.4 Approval gate | The payout tool refuses until staff have confirmed the summary | An unconfirmed policy gets an explanation, not a number |
| 6.5 Approve offline | Approve and reject in the console, through the offline queue | An approval made offline unlocks the payout after sync |
| 7.1 Golden set | 25 questions with expected sources across three policies | Reviewed once by hand |
| 7.2 Eval script | `npm run eval` printing retrieval hit rate, faithfulness and schema-valid rate | A prompt change moves the numbers |
| 7.3 Untrusted documents | Document text delimited as data, plus a test document that attempts prompt injection | The injected instruction is not followed |
| 7.4 Tracing | Each model call traced with latency and token counts in Langfuse | You can open one slow answer and see why |
| 7.5 Feedback table | A virtualised table of feedback in the console | 10,000 seeded rows scroll smoothly |
| 7.6 Results written up | `EVALS.md` with baseline numbers and one change they drove | Linked from the README |
| 8.1 Test completion | Remaining unit and component tests | CI covers every story's main path |
| 8.2 Accessibility audit | Keyboard and screen-reader pass on both apps | No blocker remains |
| 8.3 Performance | Lighthouse 90 or above on main pages | Reports saved in `/docs` |
| 8.4 Decisions recorded | Final README and three short decision records | Each names the alternative rejected |
| 8.5 Release | Tag v1.0 | A stranger gets a cited answer in under a minute |

### Sprints 9 to 12

| Sprint | Goal | Condition |
| --- | --- | --- |
| 9 (11 to 17 Jan) | Move ingestion into a small FastAPI service | Only if v1.0 shipped |
| 10 (18 to 24 Jan) | A bounded multi-step tool loop that builds a claim checklist | Only if sprint 9 finished or was skipped |
| 11 (25 to 31 Jan) | Feature freeze; write `DESIGN.md` |  |
| 12 (1 to 7 Feb) | Fixes from mock interviews; tag v1.1 |  |

## README structure

1. One-line pitch, both live links, demo video.
2. The user problem and the two users.
3. Architecture diagram and one request traced end to end.
4. Why two frameworks, and what is shared between them.
5. Angular console: zoneless and signals, offline design, performance table before and after.
6. Assistant: streaming states, grounding and citations, structured output.
7. Evaluation results and guardrails.
8. Testing, accessibility, CI/CD and deployment.
9. Known limits and what comes next.

## Interview talking points

- Why the AI output goes through human review, and how the two apps share one contract.
- How you measured LCP, INP and CLS in the console, and what moved each number.
- What happens to a staff decision made offline.
- How streaming state is modelled: idle, retrieving, streaming, done, stopped, failed.
- How you tell a retrieval failure from a generation failure.
- Why the payout is computed in code.
- The same feature in Angular and in React: what differed and why.

## What "done" means

- [ ] Week 4: both apps live, connected, and shown in a demo video
- [ ] Week 8: a stranger can upload a sample policy and get a cited answer in under a minute
- [ ] Console works in airplane mode and syncs on reconnect
- [ ] `EVALS.md` shows three metrics on 25 questions
- [ ] CI is green for both apps
- [ ] README complete; v1.0 tagged by 10 Jan 2027

## What not to build

A third app, micro-frontends, a mobile build, payments, multi-document chat, scanned-PDF OCR, an admin role system, a custom model, a landing page with animations, Nx or Turborepo, a shared UI library across frameworks.

# Rules.md — Boundaries for AI-Assisted Development

Applies to any AI tool (Claude Code, Cursor, Windsurf, Copilot) and any of the 3 human developers working on this codebase. PRD.md and Architecture.md define *what* to build; this file defines *how*, and where not to improvise — especially important with 3 people (RN+Full Stack, Full Stack, AI+Full Stack) touching overlapping domains in parallel.

## 1. Stack — Use / Avoid
**Use, in this order of preference:**
- Next.js 15 (App Router) + React 19 for web, React Native + Expo for mobile — no framework swaps.
- Tailwind + ShadCN UI for all UI (web); NativeWind or a themed StyleSheet layer for mobile, sourced from the same `packages/ui-tokens` — never hand-roll a divergent color/spacing system per platform.
- Redux Toolkit for client state, RTK Query for **all** server data — no `axios`/raw `fetch` in components on either platform.
- React Hook Form + Zod for every form, schemas imported from `packages/shared-schemas` wherever the field set matches between web/mobile/backend validation.
- Prisma for all database access — no raw SQL string concatenation; parameterized `$queryRaw` only when genuinely necessary and reviewed in PR.
- BullMQ for anything AI, file-processing, or email-related — never run a slow job inline in an API route handler.

**Avoid unless explicitly approved:**
- Any state library alongside Redux Toolkit (Zustand, MobX, Jotai, Recoil).
- GraphQL — REST only in v1 per PRD.md.
- In-app code execution for the Coding Hub AI Assistant — static analysis + LLM review only; do not build a sandboxed execution environment without an explicit decision (security/cost surface).
- A new npm/expo dependency for something a shared package could already do — check `packages/` first.

## 2. AI & Token-Limit Rules (this is the platform's core cost surface — treat it as such)
- **Every** AI-consuming endpoint checks the user's token balance *before* enqueueing work, and fails cleanly with `TOKEN_LIMIT_EXCEEDED` rather than silently degrading quality, queuing indefinitely, or performing a partial/cheaper action without telling the user.
- Token charges only apply on **successful completion** — a failed or errored AI job never decrements a user's balance.
- Cache checks (Redis, hash of input+params) happen before any paid model call — never skip the cache check "to save a step."
- Model tier selection (cheap vs. capable) is driven by the feature/input-size config, never hardcoded per call site.
- Token weights live in a config table, not hardcoded in the worker or the route handler — a weight change must never require a deploy.
- Never build a UI path that lets a user trigger an AI action without going through the standard token-check flow, including "preview" or "retry" buttons — these still cost tokens unless explicitly designed as free (e.g. cache hits).

## 3. Error Handling
- Every RTK Query mutation/query that can fail has a handled UI state — no silent failures or unhandled promise rejections, on web or mobile.
- Backend: all routes wrapped in a shared `asyncHandler`, funneled to one `error.middleware.ts` returning the standard envelope — never leak stack traces or raw Prisma errors to the client in production.
- Validate on the server even when the client already validated with Zod — client validation is UX, server validation is the real gate, especially for anything touching token accounting or payments.
- `TOKEN_LIMIT_EXCEEDED` is a distinct, structured error code intercepted globally on the client and routed to the upgrade prompt — never rendered as a generic error toast.

## 4. What the AI/Developer Should Do
- Follow the monorepo folder structure in Architecture.md exactly — new files go where the structure says.
- Check Phases.md before starting work; build only what the current phase and your assigned ownership calls for.
- Reuse existing components from `packages/ui-tokens` + the component list in the project documentation before creating a new one.
- Keep PRs scoped to one phase item, Conventional Commits format, one reviewer minimum — cross-review anything touching `packages/shared-schemas` or `prisma/schema.prisma` regardless of who owns the feature, since both are shared surfaces across web/mobile/api.
- Ask before changing the Prisma schema, the token-weight config shape, or the plan-tier structure — these are shared contracts across all 3 developers' work, not something to improvise per-feature.
- Write loading, error, empty, and skeleton states for every data-driven view on both web and mobile — a page/screen that only handles the happy path isn't done.
- When adding a new AI feature, always add: a prompt template entry, a token weight entry, an `ai_generations`-compatible result shape, and a caching key strategy — all four, not a subset.

## 5. What the AI/Developer Should NOT Do
- Don't invent new API endpoints, DB fields, or plan/token config shapes without flagging it first — extend the doc, then build.
- Don't silently change design tokens (colors, fonts, spacing) — they're shared between web and mobile via `packages/ui-tokens`; a change there affects both platforms.
- Don't commit secrets, API keys (OpenAI/Gemini/S3/payment provider), or `.env` files.
- Don't skip validation "to save time" — every form and every mutating endpoint gets validated, no exceptions, especially anything touching billing/tokens.
- Don't mark a phase complete if any feature is stubbed/mocked/TODO'd — call it out explicitly.
- Don't refactor unrelated code while implementing a feature; open a separate task.
- Don't suppress or soften genuine errors/warnings just to make a build pass — fix the underlying issue or report it.
- Don't build a feature that bypasses the queue (BullMQ) for AI/file-processing work "just this once" — this is exactly what breaks cost predictability and API responsiveness.

## 6. Security Baseline
- JWT access (short-lived, httpOnly cookie web / SecureStore mobile) + rotated refresh tokens, hashed at rest.
- Role (student/faculty/admin/alumni) **and** ownership checked server-side on every protected route — never trust a role check performed only on the client.
- File uploads: MIME-sniffed + size-checked server-side regardless of client-side checks; virus scan before a resource can reach `published` status.
- All user-generated rich text (comments, announcements, assignment content) — and AI-generated output, since it's technically untrusted — sanitized before storage and again before render.
- Payment webhook (`/billing/webhook`) always signature-verified; never trust a client-reported "payment succeeded" state.

## 7. Git Workflow
- Branches: `main` (production), `develop` (staging), `feature/<scope>-<desc>` (e.g. `feature/mobile-live-quiz`, `feature/ai-summarizer-caching`), `bugfix/<desc>`, `hotfix/<desc>` from `main`.
- Commits: Conventional Commits, scoped (`feat(coding-hub): ...`, `fix(ai-worker): ...`).
- PRs into `develop`, CI green + 1 reviewer minimum; cross-platform review required for any PR touching `packages/`.
- Hotfixes branch from `main`, merged to both `main` and `develop`.

## 8. When Unsure
If a requirement is ambiguous or missing from PRD.md/Architecture.md/Design.md, state the assumption explicitly in the code comment or PR description rather than guessing silently — and prefer the simplest option consistent with the existing stack over introducing something new. For anything touching token accounting, pricing, or role permissions specifically, default to asking rather than assuming — these are the hardest things to safely change after the fact.

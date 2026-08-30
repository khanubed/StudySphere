# Architecture.md — StudySphere

## 1. Tech Stack
**Web**: React 19 (Vite) · TypeScript · Tailwind CSS · ShadCN UI (Radix) · React Router · Redux Toolkit · RTK Query · React Hook Form + Zod · Recharts · Framer Motion.

**Mobile**: React Native + Expo · TypeScript · Redux Toolkit + RTK Query · React Navigation (native-stack + bottom-tabs) · redux-persist + Expo SQLite (offline) · Expo Notifications (push).

**Backend**: Node.js + Express + TypeScript · PostgreSQL + Prisma · Redis (cache/rate-limit/leaderboards) · BullMQ (background jobs) · Meilisearch (search) · AWS S3 / Cloudflare R2 (storage) · JWT + refresh tokens + Google OAuth · OpenAI API (primary) + Gemini API (fallback/cost-tier).

**DevOps**: Monorepo (Turborepo/Nx) · GitHub Actions CI/CD · Docker (API + worker, separate Dockerfiles) · Vercel (web) · AWS EC2/Railway/Render (API) · Neon/Supabase Postgres · Sentry · EAS Build/Submit (mobile).

## 2. Monorepo Structure
```
studysphere/
  apps/
    web/        # React (Vite) — src/ (layouts/routes: public, student, faculty, admin)
    mobile/     # Expo — screens/, navigation per role
    api/        # Express — routes/, controllers/, services/, workers/, middlewares/, prisma/
  packages/
    shared-schemas/   # Zod schemas used by web + mobile + api validation
    shared-types/     # TS types derived from Prisma + API contracts
    ui-tokens/        # design tokens -> Tailwind config (web) + NativeWind config (mobile)
    config/           # eslint, tsconfig, prettier
  infrastructure/      # docker-compose (postgres/redis/meilisearch/minio), CI fragments
  docs/                # this documentation set
  scripts/             # DB backfills, plan/token seeding, search re-index
```
A monorepo matters specifically because 3 developers share Zod schemas, Prisma types, and design tokens across web/mobile/api — duplicating them invites drift.

## 3. High-Level App Flow
1. Student uploads a document → AI Notes Summarizer enqueues a BullMQ job → worker checks cache → checks token balance → calls OpenAI/Gemini → streams result back (WS) or polled via `getJobStatus` → token_usage incremented only on success.
2. Student takes an AI-generated quiz → answers optimistically cached client-side → submitted → scored server-side → analytics computed.
3. Faculty starts a Live Quiz session → WebSocket channel → students join via code/QR → real-time scoring/leaderboard.
4. Admin moderates Resource Hub uploads, manages users, and configures plan/token limits from `/admin/billing/plans`.
5. Every AI-consuming request passes through the token-limit check (see §9) before any inference call is made.

## 4. Routing (see also Routes.md for full detail)
- **Web** (React Router): Public routes/layout — landing/pricing/career listings/coding catalog; Protected route layouts (`student`, `faculty`, `admin`) wrapped with role-based auth guards.
- **Mobile** (React Navigation): Auth stack ↔ App stack (bottom-tabs, role-aware tab set), each tab with its own nested stack.

## 5. State Management
- **Redux slices** (client-only): `authSlice`, `uiSlice`, `quizSlice` (in-progress attempt answers), `plannerSlice` (draft inputs), `resourceSlice`/`careerSlice`/`codingHubSlice` (filter/sort UI state), `notificationSlice` (unread count cache).
- **RTK Query** owns all server data via one `baseApi` per app (web/mobile), tag-based invalidation. Modules: `authApi`, `dashboardApi`, `resourceApi`, `aiApi`, `quizApi`, `assignmentApi`, `plannerApi`, `careerApi`, `alumniApi`, `codingHubApi`, `facultyApi`, `liveQuizApi`, `notificationApi`, `adminApi`, `billingApi`.
- Live Quiz and push-style notifications use RTK Query's `onCacheEntryAdded` (WebSocket) rather than polling; AI job status polls every 2s as a WS fallback; Dashboard metrics poll every 60s, paused when unfocused.

## 6. API (summary — full spec in api.md)
Base `/api/v1`, JSON envelope `{ success, data, message }` / `{ success:false, message, errors? }`. JWT access (httpOnly cookie, ~15min) + rotated refresh. Role + ownership checks server-side on every protected route. Every AI endpoint (`/ai/*`) checks token balance before enqueueing work and returns `402/403 TOKEN_LIMIT_EXCEEDED` rather than silently degrading.

## 7. Database (PostgreSQL via Prisma — full schema in tables.md)
Key domains: Users/Institutions (users, institutions, branches, semesters, subjects, student/faculty/alumni profiles), Academic (attendance, assignments, quizzes, quiz_attempts), Resource Hub (resources, likes, bookmarks, comments, contributor_points, badges), AI (ai_generations — the source of truth for token accounting — summaries, resume_analyses), Career/Alumni (jobs, applications, connections, mentorship_requests), Coding Hub (tracks, topics, problems, user_progress), Planner (tasks, schedules, study_sessions), Billing (plans, subscriptions, token_usage), Notifications, audit_logs.

Conventions: UUID PKs, snake_case columns, `created_at`/`updated_at` everywhere, soft delete (`deleted_at`) on user-generated content, FK RESTRICT by default except true child rows.

## 8. AI Pipeline
1. Client submits input → backend stores raw input (S3 if file) → creates `ai_generations` row (`queued`) → enqueues BullMQ job → returns `jobId` immediately.
2. Worker checks Redis cache (hash of input+params) → cache hit = instant, near-zero cost.
3. Worker checks token balance → insufficient = fail with `TOKEN_LIMIT_EXCEEDED`, no charge.
4. Worker chunks large input (structural boundaries, not fixed char counts) → calls model (OpenAI primary, Gemini fallback/cheap-tier) with feature-specific prompt template → streams output where supported.
5. On success: persist result, increment `token_usage`, mark `complete`, notify client. On failure: retry (BullMQ, 2x backoff) for transient errors; no charge on permanent failure.

Model tiering: cheap/fast model for short/simple jobs (single regen, short snippets); higher-capability model for full-document summarization, full quiz gen, resume analysis.

## 9. Monetization / Token Limits (see Rules.md for enforcement principles)
Plans: **Free / Pro (Student) / Institution** — each with a monthly weighted AI-token allowance, stored in a `plans` table (config, not code) so pricing/limits are editable from Admin without a deploy. Every AI action has a weight (e.g. flashcard regen = 1 credit, full resume analysis = 10 credits) recorded on `ai_generations` at request time — locked in, never retroactively changed by later weight-table edits. Institution plans pool usage across all seats.

## 10. SEO Approach (Web)
SPA SEO & Pre-rendering for public-indexable routes (landing, pricing, career listings/detail, coding catalog/problem pages, public resource pages). Dynamic meta tags via `react-helmet-async` / OpenGraph tags, static HTML pre-rendering / SSG for public pages (e.g. Vite SSG / prerender plugins), JSON-LD structured data (JobPosting, LearningResource, BreadcrumbList), static sitemap.xml, and robots.txt excluding all authenticated routes. Full detail in SeoGuide.md.

## 11. Mobile-Specific Notes
Offline: RTK Query cache persisted via redux-persist + AsyncStorage; Study Planner and Coding Hub progress queue locally (Expo SQLite outbox) when offline and sync on reconnect. AI-generation requests are **never** queued offline — they require a live connection, since silently queuing a token-costed action risks confusing charges. Deep linking: `studysphere://` scheme mapped 1:1 to equivalent web routes.

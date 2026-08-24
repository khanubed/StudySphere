# Phases.md — Build Order & Team Allocation

Team of 3: **Dev A** (React Native + Full Stack — mobile app + shares backend), **Dev B** (Full Stack — web app + backend core), **Dev C** (AI + Full Stack — AI pipeline, worker infra, AI-facing backend routes). Build in this order; don't start a phase's work inside the prior phase's branch. All three cross-review anything touching `packages/` (shared schemas, Prisma schema, design tokens).

## Phase 0 — Foundation (Week 1-2)
- **Dev B**: Repo/monorepo setup, Prisma schema for core tables (users, institutions, subjects), Express skeleton, auth middleware, CI pipeline.
- **Dev A**: Expo scaffold, navigation skeleton, design tokens ported to React Native, auth screens (UI only).
- **Dev C**: BullMQ + Redis setup, worker skeleton, S3 presigned upload flow, OpenAI/Gemini client wrappers with a stub provider for early dev.
- **Demo**: empty apps boot on web + mobile, DB connects, worker process runs a no-op job.

## Phase 1 — Auth, Dashboard, Resource Hub (Week 3-6)
- **Dev B**: Auth endpoints complete (register/login/refresh/Google OAuth), Dashboard metrics API, web Dashboard + Resource Hub browse/detail.
- **Dev A**: Mobile auth flow, mobile Dashboard + Resource Hub screens, offline cache skeleton.
- **Dev C**: Resource upload pipeline (presign → S3 → metadata extraction → Meilisearch sync), contributor points/leaderboard logic (Redis sorted sets).
- **Demo**: register/login on both platforms, browse and upload a resource, see it on a leaderboard.

## Phase 2 — AI Core: Summarizer, Quiz Generator, Study Planner (Week 7-11)
- **Dev C**: Full AI pipeline (prompt templates, chunking, caching, token accounting, job lifecycle) for these 3 features.
- **Dev B**: Web UI for all 3 + quiz attempt flow + results/analytics; Plan/Billing schema + checkout integration begins.
- **Dev A**: Mobile UI for the same 3 tools + timer-locked, offline-safe quiz attempt flow.
- **Demo**: summarize a real document, generate and take a quiz, generate a study plan — on both platforms, with token usage visibly decrementing.

## Phase 3 — Monetization, Assignment Helper, Resume Analyzer (Week 12-15)
- **Dev C**: Assignment Helper + Resume Analyzer AI flows; token-limit enforcement wired into every AI endpoint; model-tiering logic.
- **Dev B**: Billing/Plans admin config UI, `/billing` page, payment webhook handling, token-usage indicator across the web app shell.
- **Dev A**: Mobile Billing/Usage screen, upgrade-prompt sheet, mobile Assignment Helper + Resume Analyzer.
- **Demo**: hit a free-tier token limit, see the upgrade prompt, complete a test payment, get more tokens immediately.

## Phase 4 — Coding Hub, Career Hub, Alumni Connect (Week 16-20)
- **Dev B**: Career Hub (jobs/internships/applications) web, Coding Hub web.
- **Dev A**: Mobile Coding Hub, Career Hub, Alumni Connect + deep linking.
- **Dev C**: AI Coding Assistant (code review), Alumni/job search relevance tuning (Meilisearch).
- **Demo**: apply to an internship, track coding progress, get an AI code review, connect with an alumnus.

## Phase 5 — Faculty Portal, Live Quiz, Admin Panel (Week 21-25)
- **Dev B**: Faculty Portal web, Admin Panel (users, moderation, analytics).
- **Dev C**: Live Quiz WebSocket infra + AI-instant quiz generation + real-time leaderboard; Admin Plan/Token config backend.
- **Dev A**: Mobile Live Quiz join/play, mobile Faculty tab, push notification wiring end-to-end.
- **Demo**: a faculty member hosts a live quiz, students join via code and see a real-time leaderboard.

## Phase 6 — Polish, QA, Launch (Week 26-30)
- **All three**: loading/empty/error/skeleton state audit, accessibility pass, E2E critical-path suite, security review, performance pass.
- **Dev B**: Web SEO implementation, production deploy, sitemap/Search Console setup.
- **Dev A**: App Store/Play Store submission, store listing assets, TestFlight/internal-track QA.
- **Dev C**: AI cost monitoring dashboard, load test on the AI job queue, final token-weight calibration against real beta usage.
- **Demo**: production sign-off checklist complete, live on app stores + production domain.

## Post-Launch (not a phase — do not build until prioritized)
SEO content growth and monitoring are continuous. Future Roadmap items (AI Assignment Generator/Evaluation, AI Mock Interview, Placement Analytics, Video Courses, Marketplace, Premium tier, full Institution Dashboard) are revisited each sprint based on real usage and revenue data — not scheduled in advance.

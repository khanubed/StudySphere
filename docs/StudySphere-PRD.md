# PRD.md — StudySphere

## 1. Vision
To become the single most useful platform a student needs throughout their academic journey — one AI-powered ecosystem replacing the disconnected tools students currently juggle for notes, quizzes, planning, placement prep, and alumni networking. Available as a Web App (React) and Mobile App (React Native/Expo).

## 2. Mission
Give every student AI-augmented tools for learning, preparation, and career growth, while giving faculty and institutions a single place to manage academic content and engagement.

## 3. Problem Statement
Students today use fragmented platforms for academic resource management, notes sharing, attendance tracking, assignment assistance, quiz prep, placement prep, resume building, internship discovery, and alumni networking — causing inefficiency and no centralized ecosystem.

## 4. User Roles & Personas
| Role | Description | Core Needs |
|---|---|---|
| Student | Primary user, all academic years | Fast note summarization, self-testing, adaptive study plans, placement prep |
| Faculty | Teaching staff | One-click quiz generation, resource upload, class analytics, announcements |
| Admin | Institution coordinator | Content moderation, user management, platform analytics, plan/token config |
| Alumni | Graduated students | Lightweight mentorship, profile control, occasional job posting |

## 5. Core Modules (16)
1. **Dashboard** — academic metrics, productivity metrics, analytics/charts
2. **Resource Hub** — notes/PYQs/books upload (file or Drive link), search, social features (like/bookmark/comment), contributor points/leaderboards/badges, admin moderation
3. **AI Notes Summarizer** — PDF/DOCX/PPTX/TXT → short/detailed summary, smart notes, flashcards, AI-generated questions, mind maps
4. **AI Quiz Generator** — MCQ/fill-blank/short-answer/true-false, difficulty levels, analytics
5. **AI Assignment Helper** — grammar/writing analysis, citation suggestions (APA/MLA/IEEE)
6. **Study Planner** — AI-generated daily/weekly/revision/mock-test schedules
7. **Career Hub** — internship/job search & apply, company profiles
8. **Alumni Connect** — alumni directory, follow/connect/message, mentorship requests
9. **AI Resume Analyzer** — ATS score, keyword analysis, grammar review, suggestions
10. **Coding Hub** (Phase 2+) — DSA/Web Dev/AI-ML/Core tracks, coding sheets (A2Z/Blind75/NeetCode), company-wise prep, AI code review
11. **Faculty Portal** — resource upload, announcements, student analytics, quiz creation
12. **Live Quiz System** — AI-instant quiz generation, join via code/QR, real-time leaderboard
13. **Admin Panel** — user management, content moderation, platform analytics, plan/token config
14. **Notification System** — in-app, email, push, real-time
15. **User Profile System** — basic/academic profile, privacy settings, achievements
16. **Authentication System** — email/password + Google OAuth, JWT + refresh, role assignment

## 6. Monetization
Freemium model: **Free / Pro (Student) / Institution** plan tiers, each with a monthly AI token allowance. AI actions are weighted by cost (a full resume analysis costs more tokens than a single flashcard regen). Hitting the limit surfaces an upgrade prompt, not a silent failure. Full detail in Architecture.md §9 and the dedicated token-limit logic lives in the backend token-accounting service. See Rules.md for enforcement principles.

## 7. Team
3 developers: **React Native + Full Stack** (owns mobile), **Full Stack** (owns web + backend core), **AI + Full Stack** (owns AI pipeline, worker infra, AI-facing routes). See Phases.md for per-phase ownership.

## 8. Success Metrics
- Activation: % of new users completing profile + using one AI tool within 7 days
- Engagement: WAU/MAU, study streak length
- Content growth: resources uploaded/week, % verified within 48h
- AI usage: completions/user/week, cache-hit rate
- Monetization: free-to-paid conversion rate, MRR, token-limit-hit rate
- Career outcomes: applications submitted, alumni connections accepted
- Retention: 30/60/90-day retention, faculty adoption rate

## 9. Out of Scope (v1)
- Video courses, marketplace, AI mock interviews, AI assignment generation/evaluation, placement analytics, full institution dashboard — all in Future Roadmap, not MVP.
- In-app code execution for Coding Hub (AI review only in v1, no sandboxed execution).
- GraphQL (REST only in v1).

## 10. Constraints
- Web must be React 19 (SEO-critical pages need pre-rendering/SSG).
- Mobile must be React Native/Expo, sharing types/schemas with web via a monorepo shared package.
- AI layer: OpenAI (primary) + Gemini (fallback/cost-tiering) — cost must stay predictable via token limits + caching.

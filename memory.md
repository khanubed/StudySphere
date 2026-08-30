# StudySphere Project Memory & Context Log

## 1. Core Architectural Decisions
- **Web Technology Stack**: Transitioned from Next.js to **React 19 + Vite + React Router v6** + TailwindCSS / Vanilla CSS utilities + Radix UI primitives.
- **Mobile Technology Stack**: **React Native + Expo SDK 54 + Expo Router** + Lucide React Native + NativeWind.
- **State Management & Data Layer**: **Redux Toolkit (RTK) + RTK Query** configured across both `apps/web` and `apps/mobile`:
  - Web: Session stored in `localStorage` + httpOnly cookies.
  - Mobile: Session and offline state persisted using `redux-persist` + `@react-native-async-storage/async-storage`.
  - Frontend-First Mocking: Mobile auth API powered by RTK Query `queryFn` (fakeBaseQuery style) backed by `@studysphere/shared-data` matching the Prisma database schema in `StudySphere-tables.md`.
  - WebSocket Integration: Real-time Socket.IO subscriptions inside RTK Query lifecycle (`onCacheEntryAdded`) for Live Classroom Quizzes and Notification streaming.

---

## 2. Monorepo Package Structure
```
StudySphere/
├── apps/
│   ├── web/                    # React 19 + Vite Web Application
│   │   ├── src/
│   │   │   ├── components/     # Layouts (MainLayout), Guards (ProtectedRoute, PublicAuthRoute)
│   │   │   ├── pages/          # All 25+ Public, Student, Faculty, and Admin page screens
│   │   │   ├── store/          # Redux Store, Hooks, 8 Client Slices, 17 RTK Query API Modules
│   │   │   ├── App.tsx         # Comprehensive React Router Configuration
│   │   │   └── main.tsx
│   ├── mobile/                 # React Native / Expo Router Application
│   │   ├── app/                # Root Stack, (auth) Stack, and Role-Aware (tabs) Layout
│   │   │   ├── (auth)/         # login.tsx, register.tsx, forgot-password.tsx
│   │   │   ├── (tabs)/         # Role-adaptive tabs (dashboard, resources, ai, coding/faculty, more)
│   │   │   ├── _layout.tsx     # Redux Provider, PersistGate, Root Stack
│   │   │   └── index.tsx       # Authentication redirect gate
│   │   └── src/
│   │       └── store/          # Mirrored Redux Store, Slices, and RTK Query APIs (with mock queryFn)
│   └── server/                 # Node.js / Express Backend (API Specification Target)
├── packages/
│   ├── shared-types/           # TypeScript Domain Interfaces & Enums
│   ├── shared-schemas/         # Zod Validation Schemas
│   ├── shared-data/            # Centralized Mock Data & Schema Matchers for Prototyping
│   └── ui-tokens/              # Design System Tokens
└── docs/                       # Architecture, PRD, API, Routes, Tables, and Database Specs
```

---

## 3. Redux & RTK Query Architecture

### Client Slices (`src/store/slices/`)
- `authSlice`: Manages user profile, JWT auth token, authentication state, and monthly AI token quota tracking (`used` vs `limit`).
- `uiSlice`: Theme mode (light/dark/system), sidebar collapse state, and modal/sheet controllers.
- `quizSlice`: In-progress assessment state, selected answers, review flags, active question indices, and timers.
- `plannerSlice`: Selected calendar date, active view mode, draft tasks, and task filters.
- `resourceSlice`: Search queries, branch filters, semester filters, subject selections, and sorting criteria.
- `careerSlice`: Job filters, search terms, job types, and remote preferences.
- `codingHubSlice`: Active problem track, language choice, code editor buffer, and active problem slug.
- `notificationSlice`: Unread notification counter and category filters.

### RTK Query Modules (`src/store/api/`)
1. `baseApi.ts`: Base RTK Query client with tags.
2. `authApi.ts`: Mock `queryFn` implementation in mobile connected to `@studysphere/shared-data` matching `StudySphere-tables.md` (`users`, `institutions`, `branches`, `semesters`, `subjects`, `student_profiles`, `faculty_profiles`, `alumni_profiles`, `privacy_settings`).
3. `dashboardApi.ts`: Metrics and analytics query endpoints.
4. `resourceApi.ts`: Resource list, upload, like, bookmark, comment, leaderboard.
5. `quizApi.ts`: Quizzes, attempt start, single-answer patch, finish, results.
6. `assignmentApi.ts`: Assignments, submission upload, AI grading feedback.
7. `aiApi.ts`: Async BullMQ job status polling fallback, summarization, quiz generation, code review.
8. `plannerApi.ts`: Study task CRUD, study sessions, plan regeneration.
9. `careerApi.ts`: Job search, applications, admin job management.
10. `alumniApi.ts`: Alumni directory, connect requests, mentorship requests.
11. `codingHubApi.ts`: DSA tracks, topics, problems, progress patching.
12. `facultyApi.ts`: Faculty announcements, quizzes, class analytics.
13. `liveQuizApi.ts`: WebSocket live quiz rooms.
14. `notificationApi.ts`: WebSocket notifications and preference management.
15. `adminApi.ts`: User moderation, platform metrics, subscription plan configs.
16. `billingApi.ts`: Plan tiers, usage stats, checkout sessions.
17. `uploadApi.ts`: S3 pre-signed upload URL generation and confirmation.

---

## 4. Build & Verification Status
- **Web App**: `npm run build:web` (`tsc -b && vite build`) passes with **0 errors** and bundles 2,882 modules.
- **Mobile App**: `npx tsc --noEmit` passes with **0 errors**.
- **Shared Packages**: `packages/shared-types`, `packages/shared-schemas`, and `packages/shared-data` compile with **0 errors**.

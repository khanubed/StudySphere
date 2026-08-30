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
3. `dashboardApi.ts`: Metrics and multi-timeframe analytics (`7d`, `30d`, `90d`, `1y`) with topic accuracy benchmark and study distribution progress bars.
4. `resourceApi.ts`: **Google Drive First Resource Hub Architecture** (`getResources`, `getResourceById`, `validateDriveUrl`, `submitResource`, `toggleLikeResource`, `toggleBookmarkResource`, `getResourceComments`, `addResourceComment`, `getMyResources`, `getResourceLeaderboard`, `getResourceModerationQueue`, `moderateResource`, `getSidebarMetadata`).
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

## 4. Completed Modules & Design System Alignment

### Resource Hub Module (Academic OS Ledger & Google Drive First Architecture)
- **Design Metaphor**: Digital Knowledge Archive, JSTOR / Notion Database hybrid ledger with hairline borders, Fraunces headlines, Geist UI, Inter reading content, and Geist Mono tabular metadata.
- **Strict Google Drive First Architecture**: No local file upload / drag-drop. Zero storage costs; users provide Google Drive shareable URLs validated in real time through regex and metadata extraction.
- **Pages Implemented**:
  1. `apps/web/src/pages/ResourceHub.tsx`: Main catalog with verified stamp marks, curriculum filter bar, and archive sidebar (podium, subject tree, exam tags).
  2. `apps/web/src/pages/ResourceDetail.tsx`: 40/60 Split view with metadata sheet, embedded Google Drive viewer fallback box, comment stream ledger, and related course packets.
  3. `apps/web/src/pages/ResourceUpload.tsx`: Drive share URL submission wizard with 4-step live validation and institutional honor code.
  4. `apps/web/src/pages/ResourceLeaderboard.tsx`: Contributor Hall of Fame with scope pills (`daily`, `weekly`, `monthly`, `allTime`), top 3 podium, and verified points audit table.
  5. `apps/web/src/pages/MyResources.tsx`: Submission management with `published`, `pending`, `changes_requested` (with feedback note & resubmit), and `rejected` filter states.
### Mobile Feature Parity (Dashboard & Resource Hub)
- **Mobile Dashboard (`apps/mobile/app/(tabs)/dashboard.tsx`)**:
  - Multi-timeframe range controller (`7d`, `30d`, `90d`, `1y`) dynamically updating hours studied, AI queries, accuracy %, and DSA practice.
  - Stacked Study Focus Distribution progress bar (Core CS Theory 42%, Algorithms 26%, AI Notes 19%, Placement 13%).
  - Cohort Leaderboard (Hall of Fame) with rank badges (`#01 Gold`, `#02 Silver`, `#03 Bronze`), scholar points, honor roll tags, and highlight for active student.
  - Academic metrics carousel, interactive task completion checklist, upcoming deadlines, subject benchmark bars, semantic AI log, and quick tool launcher.
- **Mobile Resource Hub (`apps/mobile/app/(tabs)/resources.tsx`)**:
  - Multi-view segmented controller: `Catalog`, `Hall of Fame`, and `My Uploads`.
  - Category pills (`All`, `Notes`, `PYQs`, `Books`, `Labs`) & Semester pills (`All Sems`, `Sem 1` to `Sem 8`).
  - Google Drive First Submission bottom sheet with 4-step live validation pipeline (`useValidateDriveUrlMutation`).
  - Full Resource Detail modal sheet with metadata ledger, Google Drive launcher, live peer comments & composer (`useAddResourceCommentMutation`), endorsements (`toggleLike`), and bookmarks (`toggleBookmark`).
  - Contributor Hall of Fame with timeframe scopes (`daily`, `weekly`, `monthly`, `allTime`) and Top 3 podium.
  - Submissions management with filter tabs (`All`, `Live`, `Review`, `Changes`) and faculty moderation audit feedback notes.

- **Mobile Theme Toggle & Dynamic Theme System**:
  - Built `ThemeToggle` component in `apps/mobile/src/components/ThemeToggle.tsx` connected to NativeWind `useColorScheme()` and Redux `uiSlice`.
  - Integrated `ThemeToggle` into mobile screen headers (`dashboard.tsx`, `resources.tsx`, `ai.tsx`, `coding.tsx`, `faculty.tsx`, `more.tsx`).
  - Dynamic `_layout.tsx` TabBar theme adapting background, borders, and active tint dynamically based on colorScheme.

### AI Notes Summarizer Module (Academic Research Desk)
- **Shared Data & Types (`packages/shared-types`, `packages/shared-data`)**:
  - Defined domain interfaces: `AISummarizerSession`, `SummaryDepth`, `Flashcard`, `ImportantQuestion`, `FormulaEntry`, `KeyConceptEntry`, `MindMapNode`, and `PreflightEstimateResult`.
  - Built comprehensive academic mock sessions in `aiSummarizer.mock.ts` (DBMS Relational Normalization & BCNF proofs, OS Virtual Memory & Page Replacement algorithms).
- **Web Application (`apps/web/src/pages/AISummarizer.tsx`)**:
  - Three-panel Academic OS Ledger desktop workspace (Left: Document input, pre-flight token auditor, extraction depth; Center: Primary executive & comprehensive lecture notes canvas with page citations, live token stream, PDF export; Right: 4-tab Study Assets workbench with Key Concepts, Formulas, 3D interactive Flashcards, Exam Question Bank, and Visual Knowledge Mind Map).
  - Signature AI Step Chain capsule pipeline tracking all 6 progression stages.
  - History drawer modal showing previous study kits and token audit details.
- **Mobile Application (`apps/mobile/app/(tabs)/ai.tsx`)**:
  - Single-column Academic OS study flow with 4-tab segmented asset switcher (`Notes & Formulas`, `Flashcards`, `Exam Q&A`, `Visual Tree`).
  - Interactive 3D flashcard flip with mastery flags, question model answers, and session history drawer.
- **State Management & RTK Query**:
  - Created `summarizerSlice.ts` managing active session, depth, flashcard index, card flips, and mastery states across Web and Mobile.
  - Integrated `getAISummarizerSessions`, `getAISummarizerSessionById`, `preflightEstimate`, and `synthesizeStudyKit` into `aiApi.ts`.

### Mobile Application Architecture & Navigation Setup (`apps/mobile`)
- **Navigation & Screen Inventory per `StudySphere-MobileArchitecture.md` & `StudySphere-PRD.md`**:
  - `(auth)` Stack: `login.tsx`, `register.tsx`, `forgot-password.tsx`.
  - Role-aware `(tabs)`: `dashboard.tsx`, `resources.tsx`, `ai.tsx`, `coding.tsx`, `faculty.tsx`, `more.tsx`.
  - **AI Academic Hub & Catalog Screen (`app/(tabs)/ai.tsx`)**:
    - Catalog listing all 6 academic AI tools with badge classification, token costs, and direct navigation:
      1. **AI Notes Summarizer** (`/ai/summarizer`): Full 3-panel/5-step Study Kit Workspace with 3D flashcard flip, formulas, and SVG mind map.
      2. **AI Quiz Generator** (`/ai/quiz-setup`): Custom topic assessment setup launching into `/ai/quiz-attempt` and `/ai/quiz-results`.
      3. **AI Assignment Helper** (`/ai/assignment-helper`): Tone analysis and multi-style citation builder (IEEE, APA, MLA, Chicago).
      4. **AI Adaptive Study Planner** (`/ai/planner`): Revision milestone calendar generator.
      5. **AI Placement Resume Analyzer** (`/ai/resume-analyzer`): ATS scoring, keyword match & missing keywords analysis.
      6. **AI Code Reviewer** (`/(tabs)/coding`): Algorithmic complexity and bug detection.
  - Nested routes:
    - Resource Detail: `app/resources/[id].tsx` with Google Drive launcher and social actions.
    - AI Assessment flow: `app/ai/quiz-attempt.tsx` (fullscreen with locked back-gesture & timer) and `app/ai/quiz-results.tsx`.
    - AI Study Planner: `app/ai/planner.tsx`.
    - Profile, Billing, and Notifications: `app/profile.tsx`, `app/billing.tsx`, `app/notifications.tsx`.
- **Offline & Native Layer**:
  - `src/offline/outbox.ts` & `src/offline/syncManager.ts`: SQLite/AsyncStorage outbox queue for offline mutations.
  - `src/lib/deepLinking.ts`: Universal & scheme handler (`studysphere://`).
  - `src/lib/secureStorage.ts`: Token storage wrapper.
  - `src/lib/pushNotifications.ts`: Expo push token registration & foreground banner handler.
  - `src/components/ui/OfflineBanner.tsx`, `Badge.tsx`: Native UI primitives.

### AI Quiz Generator & Assessment Engine (`flows/Ai-Quiz-Flow.md`)
- **Shared Data & Types (`packages/shared-types`, `packages/shared-data`)**:
  - Defined domain interfaces: `Quiz`, `QuizQuestion`, `QuizQuestionType`, `QuizDifficulty`, `QuizAttempt`, `QuizAttemptAnswer`, `QuizResult`, `WeakTopicAnalysis`, `QuizGenerationRequest`.
  - Built academic mock quiz data in `aiQuiz.mock.ts` (DBMS Normalization & BCNF proofs, OS Virtual Memory & Paging) with full scorecard results and diagnostics.
- **Web Application (`apps/web/src/pages/`)**:
  - `AIQuizNew.tsx` (`/ai/quiz/new`): Setup with source cards (Document upload, Resource Hub, Topic text), multi-select question types, difficulty tiers, question count slider (1-50), timer limit, and pre-flight token preview ledger.
  - `QuizAttempt.tsx` (`/quiz/:id/attempt`): 3-panel Assessment Workspace with Question Navigator Grid (1..N with answered/flagged/current/blank states), center Question Card with LaTeX math equation rendering and keyboard shortcuts, right panel server countdown timer (`00:18:42`), progress bar, and submit audit modal.
  - `QuizResults.tsx` (`/quiz/:id/results`): Honors scorecard (score %, percentile, rank, time), Weak Area Topic Diagnostic Table with one-click remediation flashcard hooks, and question reviews with model explanations.
  - `AIQuizHistory.tsx` (`/ai/quiz/history`): Searchable past attempts ledger with score filters and PDF export.
### AI Assignment Helper & Academic Writing Studio (`flows/Ai-Assignment-Helper.md`)
- **Shared Data & Types (`packages/shared-types`, `packages/shared-data`)**:
  - Added types: `GrammarIssue`, `CitationItem`, `WritingScore`, `StructureOutlineNode`, `AssignmentAnalysisReport`, `AssignmentAnalyzeRequest`, `IssueCategory`, `CitationStyleType`.
  - Built academic mock datasets in `aiAssignment.mock.ts` with multi-paragraph distributed systems term paper, grammar and tone issues, formatted IEEE/APA/MLA references, and IMRaD outline.
- **Web 3-Panel Academic Writing Studio (`apps/web/src/pages/AIAssignmentHelper.tsx` at `/ai/assignment-helper`)**:
  - Panel 1 (Left): Document Ingestion (Paste text or Upload DOCX/PDF/TXT), live telemetry (word count, reading time, 10-credit cost preview), audit scopes, and citation standard selector (`IEEE`, `APA 7th`, `MLA 9th`).
  - Signature AI Step Chain: `[ 01 DOCUMENT ] → [ 02 GRAMMAR ] → [ 03 WRITING TONE ] → [ 04 CITATIONS ] → [ 05 STRUCTURE ] → [ 06 REPORT READY ]`.
  - Panel 2 (Center): High-density manuscript canvas with line numbers, interactive chromatic highlights (Red = Grammar, Yellow = Tone/Style, Blue = Vocab), and floating `GrammarIssueCard` popover on click with side-by-side diff and one-click `[ Accept & Replace (Alt+A) ]` / `[ Dismiss ]`.
  - Panel 3 (Right): Tabbed diagnostic accordion featuring `WritingScoreCard` (Readability, Clarity, Grammar, Tone, Structure), `CitationCard` list (with one-click copy and DOI repair), and `StructureOutline` tree (IMRaD outline with missing section warnings).
- **Mobile Guided Review Studio (`apps/mobile/app/ai/assignment-helper.tsx`)**:
  - Top Step Chain & token quota pill, manuscript input with live telemetry, segmented tabs (`Scorecard`, `Issues`, `Citations`, `Structure`), interactive issue cards with bottom-sheet diff modals (`Accept Fix ✓`, `Dismiss`), and one-click citation copy actions.


- **Mobile Application (`apps/mobile/app/`)**:
  - `(tabs)/dashboard.tsx`: Complete parity with Web Dashboard — Academic Semester Picker modal (`Semester 5 Active`, `Sem 4`, `Sem 3`), Academic Performance Snapshot carousel (CGPA 9.12, Attendance 89.5%, Quiz Avg 91.4%, Submissions 14/16), Multi-range Analytical Engine with chart tabs (`Study Hours & AI`, `Subject Scores`, `Topic Accuracy`) and focus composition stacked bar, interactive Daily Tasks checklist with strike-through and stamp marks, Upcoming Deadlines timetable, Semantic AI Stack transformations with token telemetry, Academic Audit Log timeline, Cohort Leaderboard (Hall of Fame), and Academic AI Suite launchpad.
  - `ai/quiz-setup.tsx`: Full feature parity with Web — Top AI Step Chain (`SOURCE → EXTRACT → EXAM READY`), 3 academic source cards (Topic Text, Upload PDF, Resource Hub), multi-format chips (`MCQ`, `True/False`, `Fill Blanks`, `Short Recall`, `Proofs`) with Select All, difficulty tiers, question counts (5-30), timer duration selector, and live pre-flight token estimation.
  - `ai/quiz-attempt.tsx`: Single-column exam simulation with sticky top exam hall bar, active countdown timer badge with <2 min alerts, scrollable Question Navigator Ribbon and full grid modal, MCQ/True-False/Fill-in/Short-Answer inputs, review flag toggles, and Submit Audit Modal.
  - `ai/quiz-results.tsx`: Honors scorecard with cohort percentile standing, granular Weak Area Syllabus Diagnostics with one-click **Remediation Flashcard** generator hooks, and full question review ledger with model explanations.
  - `ai/quiz-history.tsx`: Searchable assessment audit ledger of all past attempts.
  - `ai/assignment-helper.tsx`: Single-column writing studio with top Step Chain, manuscript input, segmented tabs (`Scorecard`, `Issues`, `Citations`, `Structure`), interactive issue cards with bottom-sheet diff modals (`Accept Fix ✓`, `Dismiss`), and one-click citation copy actions.
  - `(tabs)/ai.tsx`: Full Academic AI Hub with monthly quota summary, 6 tool cards, and direct route integration.


### Academic AI Tools Catalog Hub ([apps/web/src/pages/AIToolsHub.tsx](file:///d:/CODING/Collage/Mini/apps/web/src/pages/AIToolsHub.tsx) at `/ai` & `/ai/tools`)
- **Central Academic AI Suite Catalog**:
  - Displays structured, card-based tool overview with category filters (`All`, `Study & Synthesis`, `Assessment`, `Writing & Career`, `Coding`), live search bar, token credit badges, and direct action triggers.
  - Featured tools:
    1. **AI Notes & Study Kit Summarizer** (`/ai/summarizer`) — Multi-format notes, LaTeX formula sheets, 3D flashcards, mind maps.
    2. **AI Quiz Generator & Exam Simulator** (`/ai/quiz/new`) — Anti-tamper exam hall, server timer, weak area diagnostics.
    3. **AI Assignment & Citation Helper** (`/ai/assignment-helper`) — Tone analysis, grammar scoring, APA/MLA/IEEE citations.
    4. **AI Resume & ATS Compatibility Analyzer** (`/ai/resume-analyzer`) — ATS match score, keyword gap detection.
    5. **AI Study Schedule & Revision Planner** (`/planner`) — Dynamic syllabus pacing, Pomodoro revision blocks.
    6. **AI Code Mentor & Complexity Analyzer** (`/coding`) — Asymptotic Big-O time/space evaluation & edge case debugging.
  - Direct sidebar navigation from **AI Study Suite** link in [MainLayout.tsx](file:///d:/CODING/Collage/Mini/apps/web/src/components/MainLayout.tsx).

---

## 5. Build & Verification Status
- **Web App**: `npm run build:web` (`tsc -b && vite build`) passes with **0 errors** and bundles 2,894 modules.
- **Mobile App**: `npx tsc --noEmit` passes with **0 errors**.
- **Shared Packages**: `packages/shared-types`, `packages/shared-schemas`, and `packages/shared-data` compile with **0 errors**.




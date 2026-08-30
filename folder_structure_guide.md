# Folder Structure Guide — StudySphere Monorepo

Welcome to the StudySphere workspace. This repository is organized as a monorepo using **npm workspaces** to coordinate multiple applications and share schemas, types, mock data, and UI tokens between them.

---

## Workspace Layout

```
studysphere/
  ├── apps/                  # Deployable applications
  │   ├── web/               # Client Web Application (Vite + React 19 + Redux + TS)
  │   ├── mobile/            # Client Mobile Application (Expo SDK 54 / React Native + Expo Router)
  │   └── server/            # Node.js / Express Backend Server
  │
  ├── packages/              # Shared library packages
  │   ├── shared-types/      # Common TypeScript domain interfaces and models
  │   ├── shared-schemas/    # Shared Zod validation schemas
  │   ├── shared-data/       # Centralized mock data for frontend-first prototyping & tests
  │   └── ui-tokens/         # Design system tokens (colors, spacing, layout)
  │
  ├── docs/                  # Project specifications and architecture documentation
  │   ├── StudySphere-Architecture.md
  │   ├── StudySphere-Design.md
  │   ├── StudySphere-PRD.md
  │   ├── StudySphere-api.md
  │   ├── StudySphere-Routes.md
  │   ├── StudySphere-db.md
  │   └── ... (other markdown documentation files)
  │
  ├── package.json           # Root workspace configuration
  ├── memory.md              # Project history & progress context log
  └── tsconfig.json          # Shared compiler configuration
```

---

## Detailed Directory Breakdown

### 1. Applications (`apps/`)

#### 💻 [apps/web](file:///d:/CODING/Collage/Mini/apps/web)
Vite + React 19 + Tailwind CSS + Redux Toolkit + RTK Query web application.
*   `src/components/`: Reusable UI layouts and guards (e.g. `MainLayout`, `ProtectedRoute`, `PublicAuthRoute`).
*   `src/pages/`: Core page views mapped to frontend routes:
    *   `Landing`: Public landing and feature showcases.
    *   `Login`, `Register`, `ForgotPassword`: Public authentication flows.
    *   `Dashboard`: Student academic and productivity metrics view.
    *   `ResourceHub` & `ResourceUpload`: Peer notes, PYQ, and textbook distribution.
    *   `AISummarizer`, `AIQuizNew`, `AIAssignmentHelper`, `AIResumeAnalyzer`: AI academic learning suite.
    *   `QuizAttempt` & `QuizResults`: Real-time quiz taking and result analytics.
    *   `StudyPlanner`: Revision schedule and task planner.
    *   `CareerHub` & `JobDetail`: Job/internship postings and applications.
    *   `AlumniDirectory` & `AlumniProfile`: Alumni networking and mentorship requests.
    *   `CodingHub` & `ProblemDetail`: Curated DSA placement sheets and AI code reviews.
    *   `LiveQuizJoin` & `LiveQuizPlay`: Multiplayer real-time quizzes.
    *   `Profile`, `Billing`, `Notifications`: Account management and token credits.
    *   `faculty/`: Dedicated faculty portal pages (`FacultyOverview`, `FacultyAnnouncements`, `FacultyResources`, `FacultyQuizNew`, `FacultyAnalytics`, `LiveQuizHost`).
    *   `admin/`: System admin pages (`AdminDashboard`, `AdminModeration`, `AdminUsers`, `AdminAnalytics`, `AdminPlans`, `AdminInstitutions`).
*   `src/store/`: State management container:
    *   `index.ts`: Redux store configuration with RTK Query listeners.
    *   `slices/`: Client slices (`authSlice`, `uiSlice`, `quizSlice`, `plannerSlice`, `resourceSlice`, `careerSlice`, `codingHubSlice`, `notificationSlice`).
    *   `api/`: 17 RTK Query modules covering all sections of the API spec.

#### 📱 [apps/mobile](file:///d:/CODING/Collage/Mini/apps/mobile)
React Native Expo SDK 54 app with Expo Router and NativeWind.
*   `app/`: File-based navigation hierarchy:
    *   `_layout.tsx`: Root Stack with Redux Provider, PersistGate, and global styling.
    *   `index.tsx`: Auth-gated root redirector.
    *   `(auth)/`: Slide stack with `login.tsx`, `register.tsx`, and `forgot-password.tsx`.
    *   `(tabs)/`: Role-aware Bottom Tabs (`dashboard.tsx`, `resources.tsx`, `ai.tsx`, `coding.tsx` / `faculty.tsx`, `more.tsx`).
*   `src/store/`: Redux store with offline persistence via `redux-persist` + `@react-native-async-storage/async-storage` and RTK Query modules.

#### ⚙️ [apps/server](file:///d:/CODING/Collage/Mini/apps/server)
Node.js Express backend server matching the API specification.

---

### 2. Shared Packages (`packages/`)

#### 🏷️ [packages/shared-types](file:///d:/CODING/Collage/Mini/packages/shared-types)
*   Domain interfaces for all entities (`User`, `UserProfile`, `Resource`, `Quiz`, `Assignment`, `PlannerTask`, `JobPosting`, `AlumniProfile`, `LiveQuizSession`, `AppNotification`, etc.) and generic `ApiResponse<T>`.

#### 📝 [packages/shared-schemas](file:///d:/CODING/Collage/Mini/packages/shared-schemas)
*   Zod validation schemas for request bodies, auth credentials, and forms shared across Web, Mobile, and Server.

#### 📦 [packages/shared-data](file:///d:/CODING/Collage/Mini/packages/shared-data)
*   Centralized mock data repository for frontend-first prototyping, storybooks, offline development, and unit testing before backend connection:
    *   `users.mock.ts`: Mock student, faculty, alumni, and admin profiles.
    *   `dashboard.mock.ts`: Mock metrics, activity feeds, and revision blocks.
    *   `resources.mock.ts`: Mock notes, previous question papers, comments, and leaderboard points.

#### 🎨 [packages/ui-tokens](file:///d:/CODING/Collage/Mini/packages/ui-tokens)
*   Design system color tokens, spacing scales, and layout variables for light and dark modes.

---

## Running Commands

Run workspace-scoped tasks directly from the root directory:

*   **Install all dependencies**:
    ```bash
    npm install
    ```
*   **Compile shared packages**:
    ```bash
    npm run build -w packages/shared-types
    npm run build -w packages/shared-schemas
    npm run build -w packages/shared-data
    ```
*   **Run Web App Dev Server (Vite)**:
    ```bash
    npm run dev:web
    ```
*   **Run Mobile App (Expo)**:
    ```bash
    npm run dev:mobile
    ```
*   **Build Web App Production Package**:
    ```bash
    npm run build:web
    ```

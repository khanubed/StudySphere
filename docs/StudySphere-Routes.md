# Routes.md — Web & Mobile Routing Specification

## 1. Web (Next.js 15 App Router)
Route groups keep layouts and guards scoped without affecting the URL. `generateMetadata` handles SEO per route (see SeoGuide.md).

### 1.1 `(public)` — SSR/SSG, indexable
| Route | Page | Notes |
|---|---|---|
| `/` | Landing | SSG, revalidated on content change |
| `/pricing` | Plan comparison | SSG |
| `/career` | Job/internship listings | SSR (fresh listings) |
| `/career/[id]` | Job detail | SSR, JobPosting schema |
| `/coding` | Coding Hub public catalog | SSG/ISR |
| `/coding/[trackSlug]/[topicSlug]/[problemSlug]` | Problem detail | SSG/ISR, deep-linkable |
| `/resources/[id]` | Public resource detail (if institution enables public indexing) | SSR |
| `/about` | About/story | SSG |
| `/login`, `/register`, `/forgot-password` | Auth | CSR, redirects away if authenticated |

### 1.2 `(student)` — protected, role=student
| Route | Page |
|---|---|
| `/dashboard` | Student dashboard |
| `/resources`, `/resources/upload` | Resource Hub browse + upload |
| `/ai/summarizer`, `/ai/quiz/new`, `/ai/assignment-helper`, `/ai/resume-analyzer` | AI tool entry points |
| `/quiz/[id]/attempt`, `/quiz/[id]/results` | Quiz session |
| `/planner` | Study Planner |
| `/career`, `/career/[id]` (apply action gated here) | Career Hub |
| `/alumni`, `/alumni/[id]` | Alumni directory/profile |
| `/coding` (progress views) | Coding Hub with personal progress |
| `/live-quiz/join`, `/live-quiz/play/[sessionId]` | Live Quiz participation |
| `/profile`, `/billing`, `/notifications` | Account |

### 1.3 `(faculty)` — protected, role=faculty
| Route | Page |
|---|---|
| `/faculty` | Overview |
| `/faculty/announcements` | Compose/manage |
| `/faculty/resources` | Subject-specific upload/management |
| `/faculty/quizzes/new` | AI-assisted quiz creation |
| `/faculty/analytics` | Class performance |
| `/live-quiz/host/[sessionId]` | Live Quiz hosting |

### 1.4 `(admin)` — protected, role=admin
| Route | Page | Permission |
|---|---|---|
| `/admin` | Dashboard overview | admin:view |
| `/admin/moderation` | Resource/content moderation queue | moderation:action |
| `/admin/users` | User management | users:edit |
| `/admin/analytics` | Platform analytics | analytics:view |
| `/admin/billing/plans` | Plan/token config | super admin only |
| `/admin/institutions` | Institution/branch/semester config | super admin only |

### 1.5 Guard Behavior
- `<ProtectedRoute>` (student/faculty/admin route groups): redirects to `/login?redirect=<path>` if unauthenticated.
- Role mismatch (e.g. a student hitting a `(faculty)` route): redirect to `/dashboard`, not a silent 404 — the route exists, the role just doesn't have access.
- Admin sub-permissions (super admin only: billing/plans, institutions): route reachable by any admin login but content/actions gated, matching the pattern in the main project documentation's admin permission model.
- Auth pages (`/login`, `/register`) redirect *away* to the role-appropriate home if already authenticated.

## 2. Mobile (React Navigation)

### 2.1 Root Structure
```
RootNavigator
├── AuthStack (shown when unauthenticated)
│   ├── Login
│   ├── Register
│   └── ForgotPassword
└── AppStack (shown when authenticated)
    └── BottomTabNavigator (role-aware tab set)
        ├── DashboardTab -> DashboardStack
        ├── ResourcesTab -> ResourcesStack
        ├── AIToolsTab -> AIToolsStack
        ├── CodingTab -> CodingStack (hidden for faculty-only accounts, replaced by FacultyTab)
        └── MoreTab -> MoreStack (Career, Alumni, Profile, Billing, Notifications, [Faculty tools if role=faculty])
```

### 2.2 Per-Tab Stacks
| Stack | Screens |
|---|---|
| DashboardStack | Dashboard (root) |
| ResourcesStack | ResourceList → ResourceDetail → ResourceUpload (modal) |
| AIToolsStack | AIToolsHub → Summarizer → QuizGeneratorSetup → QuizAttempt → QuizResults → AssignmentHelper → ResumeAnalyzer → PlannerView |
| CodingStack | TrackList → TopicList → ProblemDetail |
| MoreStack | MoreMenu → CareerList → CareerDetail → AlumniDirectory → AlumniProfile → Profile → Billing → Notifications → [FacultyOverview → Announcements → LiveQuizHost] |

### 2.3 Modal-Presented Screens
QR Scanner (Live Quiz join), File Preview, Upgrade Plan Sheet, Filter Sheet (Resources/Career/Coding) — presented modally, not nested in a stack, since they're transient overlays rather than navigation destinations.

### 2.4 Deep Linking
| Deep link | Opens |
|---|---|
| `studysphere://resources/[id]` | ResourceDetail |
| `studysphere://quiz/[id]` | QuizAttempt or QuizResults depending on attempt state |
| `studysphere://live-quiz/join/[code]` | Live Quiz join flow, pre-filled code |
| `studysphere://alumni/[id]` | AlumniProfile |
| `studysphere://career/[id]` | CareerDetail |
| `studysphere://billing` | Billing screen (used by token-limit push notifications) |

Universal links (iOS) / App links (Android) mirror these 1:1 with the equivalent web routes so a shared web URL opens the app when installed, falling back to the web page otherwise.

### 2.5 Role-Aware Tab Set
- Student accounts: Dashboard, Resources, AI Tools, Coding, More.
- Faculty accounts: Dashboard, Resources, Faculty (replaces Coding), More — Faculty accounts don't get a Coding Hub tab since it's a student-prep feature; faculty-relevant tools (Announcements, Live Quiz Host, Analytics) surface directly instead.
- Tab set is computed once from `authSlice.role` at AppStack mount, not re-evaluated per navigation (role doesn't change mid-session without a re-login).

## 3. URL / Navigation State Conventions
- Web list pages (Resources, Career, Coding catalog) keep filters in the URL query string as the source of truth (`?subject=dbms&type=notes&sort=recent`) — `resourceSlice`/`careerSlice`/`codingHubSlice` filter state is a derived cache synced both ways, so a shared/bookmarked URL reproduces the same view.
- Mobile filter state lives in the same Redux slices but isn't URL-encoded (no browser URL bar) — persisted per-session only, reset on app restart unless explicitly "pinned" by the user.
- Slugs (`[problemSlug]`, resource/job/alumni `[id]`) are the public-facing identifiers on indexable web routes; internal admin routes use raw `:id` (UUID) since they're never meant to be shared or indexed.

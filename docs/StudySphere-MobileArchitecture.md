# MobileArchitecture.md — React Native / Expo App

This expands on Architecture.md §11 and Routes.md §2 with everything specific to the mobile app that the web-focused docs don't cover: screen inventory, navigation tree, offline behavior, native concerns, and the build/release pipeline. Read alongside Design.md (shared tokens) and Rules.md (shared boundaries) — this file doesn't repeat those, only what's mobile-specific.

---

## 1. Stack Recap
React Native + Expo (managed workflow, EAS Build/Submit) · TypeScript · Redux Toolkit + RTK Query (same store shape as web, different persistence adapter) · React Navigation (native-stack + bottom-tabs) · NativeWind (Tailwind-syntax styling, sourced from `packages/ui-tokens`) · redux-persist + AsyncStorage · Expo SQLite (offline outbox) · Expo Notifications (push) · Expo Camera (QR scan for Live Quiz) · Expo Image (caching/optimized rendering).

## 2. Folder Structure
```
apps/mobile/
  app.config.ts          # Expo config: name, bundle IDs, permissions, deep-link scheme
  eas.json                # build profiles: development, preview, production
  src/
    navigation/
      RootNavigator.tsx   # Auth stack <-> App stack switch
      AppTabs.tsx          # Bottom-tab navigator, role-aware tab set
      stacks/               # one file per tab's nested stack (ResourcesStack.tsx, etc.)
    screens/
      auth/                 # Login, Register, ForgotPassword
      dashboard/
      resources/
      ai/                   # Summarizer, QuizGeneratorSetup, QuizAttempt, QuizResults, AssignmentHelper, ResumeAnalyzer, Planner
      coding/
      career/
      alumni/
      faculty/              # only bundled/reachable for faculty-role accounts
      liveQuiz/
      profile/  billing/  notifications/
    components/             # mirrors web's domain component folders where shared visually
      ui/                    # NativeWind-styled primitives equivalent to web's shadcn set
    store/
      slices/                # same slices as web (auth, ui, quiz, planner, resource, career, codingHub, notification)
      api/                    # RTK Query modules — re-exported from a shared definition where the endpoint shape is identical to web's
      persistConfig.ts        # AsyncStorage-backed redux-persist config
    offline/
      outbox.ts               # Expo SQLite-backed queue for offline-safe mutations (planner, coding progress)
      syncManager.ts           # reconnect listener, flushes the outbox
    lib/
      deepLinking.ts           # linking config mapping studysphere:// + universal links to screens
      pushNotifications.ts     # token registration, permission request, foreground handler
      secureStorage.ts          # SecureStore wrapper for the refresh token
    theme/                     # NativeWind config consuming packages/ui-tokens
    assets/
  App.tsx
```

## 3. Screen Inventory
| Screen | Route (React Navigation) | Notes |
|---|---|---|
| Login, Register, ForgotPassword | Auth stack | Google OAuth via `expo-auth-session` |
| Dashboard | AppTabs -> DashboardStack | Metrics, today's tasks, quick AI-tool shortcuts |
| ResourceList, ResourceDetail, ResourceUpload | ResourcesStack | Upload opens as a modal, not a stack push |
| AIToolsHub, Summarizer, QuizGeneratorSetup, QuizAttempt, QuizResults, AssignmentHelper, ResumeAnalyzer, PlannerView | AIToolsStack | QuizAttempt is presented full-screen, tab bar hidden, back-gesture disabled mid-attempt |
| TrackList, TopicList, ProblemDetail | CodingStack | ProblemDetail includes a read-only/lightweight code viewer, not a full editor |
| CareerList, CareerDetail | MoreStack -> CareerStack | |
| AlumniDirectory, AlumniProfile | MoreStack -> AlumniStack | |
| FacultyOverview, Announcements, LiveQuizHost | MoreStack -> FacultyStack | Only registered/reachable when `authSlice.role === 'faculty'` |
| LiveQuizJoin (QR/code), LiveQuizPlay | LiveQuizStack | Play screen locks orientation and keeps a persistent WS connection |
| Profile, Billing, Notifications | MoreStack | |
| UpgradePlanSheet, FilePreview, FilterSheet | Modal group (not a stack) | Presented over any tab, dismissible |

## 4. Navigation Tree
```
RootNavigator
├── AuthStack (unauthenticated)
│   ├── Login
│   ├── Register
│   └── ForgotPassword
└── AppStack (authenticated)
    └── AppTabs (bottom tabs, role-aware set — computed once at mount from authSlice.role)
        ├── DashboardTab -> DashboardStack
        ├── ResourcesTab -> ResourcesStack
        ├── AIToolsTab -> AIToolsStack
        ├── CodingTab -> CodingStack        (student only)
        ├── FacultyTab -> FacultyStack      (faculty only, replaces CodingTab)
        └── MoreTab -> MoreStack (Career, Alumni, Profile, Billing, Notifications)
    + Modal group: UpgradePlanSheet, FilePreview, FilterSheet, LiveQuizJoin (QR)
```
Each tab owns its own native-stack navigator so back-gesture/back-button behavior stays predictable and history doesn't leak across tabs. Modal-presented screens use React Navigation's modal presentation style rather than being nested inside a tab's stack, since they're transient overlays (QR scanner, upgrade sheet) not navigation destinations a user "returns to."

## 5. State Management (Mobile-Specific Notes)
- Same Redux slice shapes as web (Architecture.md §5) — `authSlice`, `uiSlice`, `quizSlice`, `plannerSlice`, `resourceSlice`/`careerSlice`/`codingHubSlice`, `notificationSlice`.
- Persistence: redux-persist with an AsyncStorage adapter (vs. localStorage on web); the refresh token itself is **not** in Redux state at all on either platform — on mobile it lives in `expo-secure-store`, read only by the RTK Query base query's re-auth wrapper.
- `quizSlice`'s in-progress answers persist through app backgrounding/kill (AsyncStorage-backed) so a phone call or app switch mid-quiz doesn't lose answers — reconciled against the server on the next `submitAttempt`.
- RTK Query `keepUnusedDataFor` is tuned longer on mobile than web for list data, since users re-open the app far more often than they'd refresh a browser tab, and mobile data usage is a real cost to the user.

## 6. Offline Support
| Feature | Offline behavior |
|---|---|
| Dashboard / Resources / Coding Hub browse | Last-fetched RTK Query cache (persisted) shown immediately on cold start, revalidated on reconnect |
| Study Planner edits, Coding Hub progress updates | Queued in the Expo SQLite outbox (`offline/outbox.ts`) when offline, flushed by `syncManager.ts` on reconnect, with per-item retry and conflict resolution (server value wins on conflict, since these are low-stakes preferences) |
| AI-generation requests (Summarizer, Quiz Gen, Resume Analyzer, etc.) | **Never queued offline** — these require a live connection and fail immediately with a clear "you're offline" message and a retry action. Silently queuing a token-costed action risks confusing charges or duplicate submissions once reconnected, so this is a deliberate exception to the general offline-friendly pattern. |
| Live Quiz | Not offline-capable at all — requires a persistent WebSocket connection; a dropped connection mid-session shows a reconnecting state and, if it can't recover within a short window, ends the student's participation gracefully rather than leaving them stuck |

A persistent offline banner (not a toast — a fixed banner) replaces silent failures across every screen when connectivity drops, so the "why isn't this working" question never comes up mid-task.

## 7. Caching
- Images: `expo-image`'s disk cache for avatars, resource thumbnails, gallery-style AI mind-map exports.
- API data: RTK Query cache persisted via redux-persist + AsyncStorage as above.
- Static reference data unlikely to change mid-session (institution/branch/semester/subject lists, coding track/topic lists) cached with a long `keepUnusedDataFor` and a manual pull-to-refresh override, rather than polling.

## 8. Push Notifications
- Expo push token registered on login (`lib/pushNotifications.ts`), associated with the user server-side, re-registered on token-invalidation events (app reinstall, OS-level reset).
- Delivery: Expo Notifications -> FCM (Android) / APNs (iOS). Respects OS-level permission state and the per-category channel toggle from `profile.schema.ts -> notificationPreferencesSchema` — a category the user disabled for push simply isn't sent, checked server-side before dispatch, not filtered client-side after delivery.
- Every push carries a deep-link payload (see §9) so tapping it opens directly to the relevant screen, not just the app's home tab.
- Foreground handler (`pushNotifications.ts`) shows an in-app banner instead of relying on the OS notification tray while the app is active, matching web's toast pattern for parity.

## 9. Deep Linking
| Deep link | Opens |
|---|---|
| `studysphere://resources/[id]` | ResourceDetail |
| `studysphere://quiz/[id]` | QuizAttempt or QuizResults depending on attempt state |
| `studysphere://live-quiz/join/[code]` | LiveQuizJoin, pre-filled code |
| `studysphere://alumni/[id]` | AlumniProfile |
| `studysphere://career/[id]` | CareerDetail |
| `studysphere://billing` | Billing screen (used by token-limit-warning push notifications) |

Universal links (iOS Associated Domains) / App links (Android intent filters) mirror these 1:1 with the equivalent web routes from Routes.md, so a link shared from the web app or in a WhatsApp/Discord group opens the installed app directly, falling back to the web page when the app isn't installed.

## 10. Platform-Specific Considerations
| Concern | iOS | Android |
|---|---|---|
| Push | APNs via Expo, requires a paid Apple Developer account for production push certs | FCM via Expo, no equivalent paid requirement |
| Permissions prompt timing | Ask contextually (camera for QR scan only when the user taps "Scan QR"), not all upfront at first launch — App Store review is stricter about this | Same best practice, less strictly enforced but still followed for consistency |
| Safe area | `react-native-safe-area-context` required given the notch/Dynamic Island | Required for gesture-nav Android devices too, applied uniformly |
| Back navigation | Gesture-based (edge swipe), no hardware back button | Hardware/gesture back button must be explicitly handled in modal screens (e.g. exiting the QR scanner) to avoid dead-ends |
| Store review risk areas | Since billing goes through a web-based checkout (Architecture.md §9), confirm this doesn't trigger Apple's in-app purchase requirement for digital goods — resolve this explicitly before submission, it's a common rejection reason | Google Play's equivalent policy is more permissive but should still be verified before submission |

## 11. Testing (Mobile-Specific)
- Unit/integration: Jest + React Native Testing Library for components and slices.
- E2E: Detox or Maestro (per the Testing Strategy in the main documentation) covering: login -> dashboard, resource upload offline->online sync, quiz attempt survives app backgrounding, live quiz join-by-code, push-notification deep link opens the correct screen.
- Manual device matrix before each release: at minimum one low-end Android device (performance/memory pressure check, since list virtualization and image caching matter most here) and one recent iOS device.

## 12. Build & Release (EAS)
| Profile | Purpose |
|---|---|
| `development` | Dev client build for local testing with live reload, internal distribution |
| `preview` | Shareable build for QA/stakeholder review, internal distribution (TestFlight internal / Play internal track) |
| `production` | Store-ready build, submitted via `eas submit` to TestFlight (external) and Play production/closed track |

- Version bumps and store metadata (screenshots, descriptions) tracked alongside `app.config.ts`, not managed only in the store consoles, so they're reviewable in PRs.
- CI trigger: EAS Build fires on release tags (per the DevOps section in the main documentation), not on every merge to `develop` — mobile builds are slower and costlier than web deploys, so they're batched to actual release candidates.

## 13. Performance Notes
- Hermes engine enabled (Expo default) for faster startup and lower memory.
- A virtualized list component (e.g. FlashList rather than the default FlatList) for any long list: resources, leaderboard, coding problems, job listings — this matters more on mobile than the equivalent web virtualization concern, given weaker average device hardware.
- Lazy-loaded screens per tab (React Navigation's lazy option) so the Faculty stack, for instance, never mounts for a student account.
- Images always requested at a size appropriate to their display context (thumbnail vs. full) via the CDN/image-resizing layer — never the original upload resolution rendered in a small card.

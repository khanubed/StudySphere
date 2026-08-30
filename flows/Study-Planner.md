# StudySphere — AI Study Planner & Adaptive Revision Engine Master UI/UX Specification

**Module**: AI Adaptive Study Planner (`/planner`, `/planner/:id`, `/planner/history`)  
**Design Metaphor**: Academic Mission Control + Study Roadmap + AI Study Coach (Academic OS Ledger)  
**Supported Platforms**: Web (React 19 + TailwindCSS) & Mobile (React Native + Expo)  
**Target Breakpoints**: Desktop (1440px Dual-Column Dashboard), Tablet (1024px Two-Column Grid), Mobile (390px Guided Single-Column Flow)

---

## 1. UX Goals & Design Philosophy

### 1.1 The Metaphor: The Academic Mission Control & Flight Plan
The StudySphere **AI Study Planner** is not a generic calendar grid, simple todo list, or kanban board. It functions as an **Academic Mission Control & Adaptive Flight Plan**:
- **Continuous Academic Adaptation**: Dynamically recalculates daily study blocks and revision intensity whenever students take quizzes, miss study sessions, or have upcoming semester exam deadlines.
- **Cognitive Load Optimization**: Distributes high-density algorithmic theory and memorization across Spaced Repetition curves (T-7d, T-3d, T-1d before exam hall dates).
- **Proactive Intervention**: Flags syllabus deficit areas and automatically injects diagnostic Mock Tests based on RTK Query quiz mastery analytics.
- **Academic OS Ledger Typography**: Clear, information-dense layout utilizing Fraunces display headings, Inter body text for study block descriptions, and Geist Mono for timestamps, countdown days, and token costs.

### 1.2 Color & Token Allocation (Academic OS Ledger)
| Token | Hex Value | Semantic Usage in Study Planner |
| :--- | :--- | :--- |
| **Chalk Blue** | `#5B7FDE` | **Reserved for AI Operations**: AI-generated study blocks, adaptive schedule optimization, pipeline step chain, and token cost previews. |
| **Quad Green** | `#2F5D50` | Completed study sessions, high subject coverage (> 80%), target benchmarks met. |
| **Marker Yellow** | `#F2C14E` | Upcoming exam deadlines (< 14 days), pending mock tests, high-priority revision blocks. |
| **Destructive Red** | `#D9534F` | Missed study sessions, urgent exam countdown (< 3 days), low syllabus coverage (< 40%). |
| **Graphite** | `#8A8D85` | Monospace timestamps (`09:00 - 10:30`), date stamps, hour meters, and metadata. |
| **Paper** | `#F3F4EF` (Light) / `#12151C` (Dark) | Clean academic canvas, timeline lanes, and session cards. |
| **Ink** | `#12151C` (Light) / `#F3F4EF` (Dark) | High-contrast high-legibility subject titles and schedule milestones. |
| **Hairline Border** | `rgba(200, 203, 194, 0.8)` | Strict grid boundaries between time blocks, subject cards, and progress meters. |

---

## 2. Information Architecture & Route Hierarchy

```
/planner
├── (root)               # Page 1: Academic Mission Control & Interactive Study Roadmap
├── /:id                 # Page 2: Saved Plan Detail, Historical Revision Curves & Audit
└── /history             # Page 3: Historical Study Plan Ledger & Archival Logs
```

---

## 3. End-to-End User & System Flow Architecture

```mermaid
graph TD
    subgraph Phase1_Input ["Phase 1: Academic Telemetry & Configuration"]
        A1[Student Enters /planner] --> A2[Select Semester Courses: DBMS, OS, Algo, CN]
        A2 --> A3[Enter Exam Dates Per Subject]
        A3 --> A4[Set Daily Available Hours: 0.5h to 16h]
        A4 --> A5[Select Study Pattern: Morning / Evening / Balanced / Weekend]
        A5 --> A6{Verify AI Token Balance}
        A6 -- Insufficient --> A7[Display Upgrade Quota Modal]
        A6 -- Sufficient --> A8[Student Clicks 'Generate Adaptive Plan - 60cr']
    end

    subgraph Phase2_Pipeline ["Phase 2: Multi-Stage AI Planning Pipeline"]
        A8 --> B1[Deduct 60 Tokens & Trigger Optimization Worker]
        B1 --> B2[Stage 01: Subject Syllabus & Weight Analysis]
        B2 --> B3[Stage 02: Exam Date Proximity & Urgency Weighting]
        B3 --> B4[Stage 03: Performance Synthesis - Quiz & Weak Topic Diagnostics]
        B4 --> B5[Stage 04: Spaced Repetition & Daily Time Distribution]
        B5 --> B6[Stage 05: Mock Test & Revision Insertion]
        B6 --> B7[Stage 06: Composite Plan Ready]
    end

    subgraph Phase3_Execution ["Phase 3: Active Mission Control Workspace"]
        B7 --> C1[Render Top Metric Overview: Readiness, Streak, Target Hours]
        C1 --> C2[Section 1: Today's Hour-by-Hour Timeline]
        C2 --> C3{Student Session Interaction}
        C3 -->|Mark Complete| C4[Turn Quad Green & Increment Daily Progress]
        C3 -->|Skip / Miss| C5[Turn Destructive Red & Reallocate to Recovery Block]
        C3 -->|Reschedule| C6[Adjust Time Slot & Rebalance Week]
        C1 --> C7[Section 2: Weekly Schedule Macro Board]
        C1 --> C8[Section 3: Spaced Revision Roadmap T-7d / T-3d / T-1d]
        C1 --> C9[Section 4: Diagnostic Mock Test Recommendations]
        C1 --> C10[Section 5: Subject Coverage & Exam Countdowns]
    end

    subgraph Phase4_Adaptive ["Phase 4: Dynamic Rebalancing & Export"]
        C4 --> D1[Dynamic Readiness Score Recalculation]
        C5 --> D2[Adaptive Schedule Auto-Rebalance]
        D1 --> D3[Export Plan: iCal (.ics), Academic PDF, Printable Ledger]
        D2 --> D3
    end
```

---

## 4. Signature AI Step Chain Pipeline

When generating or recalculating an adaptive schedule, the planner renders the signature **Chalk Blue Step Chain**:

```
[ 01 SUBJECTS ] ──→ [ 02 EXAMS ] ──→ [ 03 ANALYSIS ] ──→ [ 04 DISTRIBUTION ] ──→ [ 05 REVISION ] ──→ [ 06 PLAN READY ]
```

- **Active State**: Pulsing Chalk Blue capsule with vector inference spinner (`#5B7FDE`).
- **Completed State**: Solid Quad Green badge with checkmark (`#2F5D50`).
- **Queued State**: Graphite hairline capsule with estimated analysis tokens (`#8A8D85`).

---

## 5. Web Experience Specification (Desktop 1440px Dashboard)

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ [TOP BAR] Study Planner • "Semester 5 Mission Control"                     [Tokens: 880 cr] [History] [Export ▾]│
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ TOP METRICS: [4 Subjects Active]  [Next Exam: DBMS in 12d]  [Today: 4.5h / 6.0h]  [Streak: 12d 🔥]  [Readiness: 84%] │
├──────────────────────────────────────────┬───────────────────────────────────────────────────────────────────────┤
│ LEFT COLUMN (420px)                      │ RIGHT COLUMN (980px)                                                  │
│ Study Plan Configuration & Telemetry     │ Active Study Roadmap & Multi-Section Timeline                         │
│                                          │                                                                       │
│ • Selected Subjects:                     │ • SECTION 1: TODAY'S HOURLY TIMELINE                                  │
│   [x] CS-301: DBMS (Exam: Oct 14)        │   ┌───────────────────────────────────────────────────────────────┐   │
│   [x] CS-302: Algorithms (Exam: Oct 20)  │   │ 09:00 - 10:30 • DBMS Normalization & BCNF Proofs              │   │
│   [x] CS-303: OS (Exam: Oct 28)          │   │ [ ✓ Complete ]  [ ↷ Reschedule ]  [ ✗ Skip ]   [ Quad Green ] │   │
│   [x] CS-304: CN (Exam: Nov 04)          │   ├───────────────────────────────────────────────────────────────┤   │
│                                          │   │ 11:00 - 12:30 • Operating Systems Virtual Memory Paging       │   │
│ • Daily Study Bandwidth:                 │   │ [ ✓ Complete ]  [ ↷ Reschedule ]  [ ✗ Skip ]   [ Neutral ]    │   │
│   Slider: [ 6.0 Hours / Day ]            │   └───────────────────────────────────────────────────────────────┘   │
│                                          │                                                                       │
│ • Study Pattern Focus:                   │ • SECTION 2: WEEKLY DISTRIBUTION BOARD (Mon - Sun)                    │
│   (o) Morning  ( ) Evening  ( ) Balanced │   Mon: 5.5h • Tue: 6.0h • Wed: 4.5h • Thu: 6.0h • Fri: 5.0h • Sat/Sun│
│                                          │                                                                       │
│ • Adaptive Inputs:                       │ • SECTION 3: REVISION ROADMAP (Spaced Repetition)                     │
│   [x] Sync Quiz Mastery Data             │   DBMS: [ T-7d: Oct 07 ] → [ T-3d: Oct 11 ] → [ T-1d: Oct 13 ]       │
│   [x] Auto-Inject Diagnostic Mocks       │                                                                       │
│                                          │ • SECTION 4: RECOMMENDED MOCK TESTS                                   │
│ • [ Generate Adaptive Plan (60 cr) ↗ ]   │   [⚡ DBMS Midterm Mock Test • 45m • 90% Target]  [ Accept ] [ Skip ]│
│                                          │                                                                       │
│ • Plan Cost: 60 Tokens • Balance: 880 cr │ • SECTION 5: SUBJECT READINESS & EXAM COUNTDOWNS                      │
│                                          │   DBMS: 88% Ready (12d Left) • OS: 76% (26d) • Algo: 68% (32d)       │
└──────────────────────────────────────────┴───────────────────────────────────────────────────────────────────────┘
```

### 5.1 Top Section: Academic Performance Overview Metrics
A high-density 5-card metric row tracking overall flight readiness:
1. **Subjects Active**: `4 Enrolled Courses` (CS-301 DBMS, CS-302 Algo, CS-303 OS, CS-304 CN).
2. **Nearest Exam Countdown**: `DBMS in 12 Days` (`Marker Yellow` alert badge).
3. **Daily Study Meter**: `4.5h / 6.0h Planned` (`75% Completed`).
4. **Study Streak**: `12 Days Active` (`🔥 Server Verified`).
5. **Exam Readiness Index**: `84 / 100` (`Collegiate Target Met`).

---

### 5.2 Left Column: Study Plan Configuration (`PlannerInputCard` — `420px Fixed`)
1. **Multi-Subject Ingestion & Exam Date Mapping**:
   - Course multi-select with individual exam date pickers:
     - `CS-301 DBMS`: Exam Date `2026-10-14` (Weight: 30%).
     - `CS-302 Algorithms`: Exam Date `2026-10-20` (Weight: 25%).
     - `CS-303 Operating Systems`: Exam Date `2026-10-28` (Weight: 25%).
     - `CS-304 Computer Networks`: Exam Date `2026-11-04` (Weight: 20%).
2. **Daily Available Study Hours Slider**:
   - Continuous slider ranging from `0.5 Hours` to `16.0 Hours` (Default: `6.0 Hours/Day`).
3. **Preferred Study Chronotype**:
   - `[ Morning Focus ]` (07:00 - 13:00 Peak).
   - `[ Evening Focus ]` (18:00 - 24:00 Peak).
   - `[ Balanced Spread ]` (Distributed 2h blocks).
   - `[ Weekend Heavy ]` (3h weekdays, 8h weekends).
4. **Adaptive Integration Toggles**:
   - `[x] Synthesize Recent Quiz Weak Topics` (Pulls from `/quiz/:id/results`).
   - `[x] Auto-Schedule Diagnostic Mock Tests`.
   - `[x] Spaced Repetition Buffering (T-7d, T-3d, T-1d)`.
5. **Action Trigger**:
   - `[ Generate Adaptive Plan — 60 Credits ↗ ]` (Quad Green primary CTA).

---

### 5.3 Section 1: Today's Hourly Study Timeline (`DailyScheduleCard`)
The central daily execution surface:
- **Hour-by-Hour Time Lanes**:
  - `09:00 - 10:30`: **DBMS Relational Normalization & BCNF Proofs** (`Quad Green` — `Completed ✓`).
  - `10:45 - 12:15`: **Operating Systems Paging & TLB Hit Ratio** (`Chalk Blue` — `In Progress ●`).
  - `14:00 - 15:30`: **Algorithms Dynamic Programming State Space** (`Neutral` — `Upcoming ◻`).
  - `16:00 - 17:00`: **DBMS Diagnostic Quiz Practice** (`Marker Yellow` — `Mock Session ⚡`).
- **Interactive Actions on Each `StudySessionCard`**:
  - `[ ✓ Mark Complete ]`: Transitions card to Quad Green, logs study minutes to telemetry, and increases streak.
  - `[ ↷ Reschedule ]`: Pops a time picker to reallocate the session to later today or tomorrow.
  - `[ ✗ Skip ]`: Marks session as skipped; system automatically reallocates topic to tomorrow's recovery block.
  - `[ ↗ Open Notes ]`: Deep links directly to `/ai/summarizer` study kit for the specific topic.

---

### 5.4 Section 2: Weekly Schedule Macro Board (`WeeklyScheduleBoard`)
Visualizes the weekly distribution across Monday through Sunday:
- **Daily Columns**: Shows total hours, subject allocations, and priority badges (`High`, `Medium`, `Revision`).
- **One-Click Rebalance**: `[ Rebalance Week ]` dynamically redistributes leftover hours if a day is missed.

---

### 5.5 Section 3: Spaced Revision Roadmap (`RevisionTimeline`)
Enforces the academic Spaced Repetition interval system:
- **T-7 Days (Deep Structural Review)**: Full lecture slide synthesis and formula derivation.
- **T-3 Days (High-Yield Problem Sets)**: Past 5 years question papers (PYQs) and proof solving.
- **T-1 Day (Final Executive Formula Sheet)**: LaTeX summary sheet and rapid recall flashcards.

---

### 5.6 Section 4: Diagnostic Mock Test Planner (`MockTestSuggestionCard`)
- **Personalized Recommendations**:
  - If student has ≥ 3 quiz attempts: *"Personalized based on 74% accuracy in DBMS BCNF proofs."*
  - If < 3 quiz attempts: *"Standard syllabus benchmark mock test."*
- **Actions**: `[ Accept & Schedule ]` • `[ Skip ]` • `[ Custom Difficulty ]`.

---

### 5.7 Section 5: Subject Analytics & Exam Countdowns (`SubjectProgressCard` + `ExamCountdownCard`)
- Displays real-time syllabus coverage bars, quiz accuracy averages, and remaining calendar days:
  - **DBMS (CS-301)**: `88% Covered` • `12 Days Left` • `94% Quiz Accuracy`.
  - **Operating Systems (CS-303)**: `76% Covered` • `26 Days Left` • `91% Quiz Accuracy`.
  - **Algorithms (CS-302)**: `68% Covered` • `32 Days Left` • `88% Quiz Accuracy`.
  - **Computer Networks (CS-304)**: `54% Covered` • `46 Days Left` • `82% Quiz Accuracy`.

---

## 6. Mobile Experience Specification (React Native + Expo)

### 6.1 Mobile Single-Column Guided Flow
On mobile screens (390px), the interface utilizes a clean **5-Tab Navigation**:

```
┌────────────────────────────────────────┐
│ [Back] Study Planner          [🌙 Dark] │
├────────────────────────────────────────┤
│ [EXAM ALERT: DBMS in 12 Days — Oct 14] │
│ Today: 4.5h / 6.0h • 75% Complete      │
├────────────────────────────────────────┤
│ [ TABS: Today | Week | Rev | Mocks ]   │
├────────────────────────────────────────┤
│ [TODAY'S TIMELINE]                     │
│                                        │
│ ● 09:00 - 10:30 (Quad Green)           │
│   DBMS Normalization & BCNF            │
│   [ ✓ Completed at 10:28 ]             │
│                                        │
│ ◻ 11:00 - 12:30 (In Progress)          │
│   OS Virtual Memory Paging             │
│   [ Mark Complete ]   [ Reschedule ]   │
│                                        │
│ ◻ 14:00 - 15:30 (Upcoming)             │
│   Algorithms DP State Space            │
├────────────────────────────────────────┤
│ [ + Add Study Block ] [ Rebalance ↷ ]  │
└────────────────────────────────────────┘
```

### 6.2 Mobile Gesture & Bottom Sheet Interactions
- **Swipe Right on Session Card**: Quick mark as complete (`Quad Green` animation).
- **Swipe Left on Session Card**: Quick reschedule to evening recovery block.
- **Tap Session Card**: Opens native bottom sheet modal with session notes, attached PYQs, and topic flashcard links.

---

## 7. Comprehensive State Matrix

| State | Trigger Condition | Visual Representation | User Actions Available |
| :--- | :--- | :--- | :--- |
| **1. Idle Canvas** | User has no active plan generated. | Clean configuration card with sample semester course presets. | Select subjects, enter exam dates, click generate. |
| **2. Generating Pipeline** | User clicks `[ Generate Adaptive Plan ]`. | Chalk Blue Step Chain with spinning stage capsule (`Analyzing Syllabus...`). | View progress, cancel job. |
| **3. Plan Active** | Schedule generated successfully. | Complete 5-section mission control dashboard with live timeline. | Complete sessions, reschedule, accept mocks, export. |
| **4. Missed Session Alert** | Session start time + 2 hours passed without completion. | Destructive Red badge on session with recovery prompt. | One-click reschedule to evening or rebalance week. |
| **5. Insufficient Tokens** | Token balance < 60 credits. | Marker Yellow alert: `Insufficient AI credits (14 remaining)`. | Upgrade Plan CTA, load cached plan. |
| **6. Exam Urgent Alert** | Exam date ≤ 3 days away. | Pulsing Marker Yellow / Destructive Red banner with T-1d revision pack. | Access executive formula sheet and high-yield mocks. |

---

## 8. Developer Handoff: Redux Slices, Schemas & API Contracts

### 8.1 Shared Zod Schemas (`packages/shared-schemas/src/ai.schema.ts`)
```typescript
import { z } from "zod";

export const generateStudyPlanSchema = z.object({
  subjects: z.array(z.object({
    id: z.string(),
    name: z.string().min(2),
    examDate: z.string(),
    weight: z.number().min(1).max(100).default(25),
  })).min(1, "Select at least one subject"),
  dailyHours: z.number().min(0.5).max(16).default(6),
  preferredPattern: z.enum(["morning", "evening", "balanced", "weekend"]).default("balanced"),
  syncQuizData: z.boolean().default(true),
  autoMockTests: z.boolean().default(true),
});
```

### 8.2 Client Redux Slice (`plannerSlice.ts`)
```typescript
export interface StudySession {
  id: string;
  subjectId: string;
  subjectName: string;
  topic: string;
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "10:30"
  durationMinutes: number;
  type: 'study' | 'revision' | 'mock_quiz' | 'problem_set';
  status: 'upcoming' | 'completed' | 'skipped' | 'rescheduled';
  completedAt?: string;
}

export interface PlannerState {
  dailyHours: number;
  studyPattern: 'morning' | 'evening' | 'balanced' | 'weekend';
  todaySessions: StudySession[];
  weeklyDistribution: Record<string, { totalHours: number; sessions: StudySession[] }>;
  examCountdowns: Array<{ subject: string; daysLeft: number; examDate: string; coverage: number }>;
  isGenerating: boolean;
}
```

### 8.3 RTK Query API Endpoints (`plannerApi.ts` / `aiApi.ts`)
- `POST /api/ai/planner/generate`: Accepts subjects, exam dates, and bandwidth; returns structured study plan.
- `GET /api/planner/current`: Retrieves active student mission control plan.
- `PATCH /api/planner/session/:id`: Updates session status (`completed`, `skipped`, `rescheduled`).
- `POST /api/planner/rebalance`: Automatically reallocates skipped blocks across upcoming calendar days.
- `GET /api/planner/history`: Lists past generated study plan archives.

---

## 9. Accessibility (WCAG 2.1 AA Compliance)
1. **Keyboard Navigation**:
   - `Tab` navigates through hourly session cards sequentially.
   - `Space` / `Enter`: Mark active session as complete.
   - `Alt + R`: Reschedule active session.
2. **High Information Density Legibility**:
   - Every status chip (Quad Green, Destructive Red, Marker Yellow) pairs a distinct color with a textual label (`Completed ✓`, `Missed ✗`, `Urgent ⚑`) to ensure full compliance for color-blind users.
3. **Contrast Compliance**:
   - Monospace timestamps and badges meet minimum `4.5:1` contrast against `#F3F4EF` (Light) and `#12151C` (Dark).

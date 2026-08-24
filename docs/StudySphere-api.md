# api.md — Backend API Specification

Base URL: `/api/v1`. Envelope: `{ success: true, data, message? }` / `{ success: false, message, errors? }`. Auth: JWT access (httpOnly cookie, ~15min) + rotated refresh (7-30d). Every protected route checks role **and** ownership server-side. Every `/ai/*` endpoint checks token balance before enqueueing work (see §5). All AI/file-processing work is async via BullMQ — the API never blocks on model latency.

---

## 1. Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | public | Rate limit 5/hour/IP |
| POST | `/auth/login` | public | Rate limit 10/hour/IP, lockout after 5 fails |
| POST | `/auth/google` | public | OAuth code exchange |
| POST | `/auth/refresh` | public (refresh cookie) | Rotates refresh token |
| POST | `/auth/logout`, `/auth/logout-all` | user | Revokes current / all refresh tokens |
| POST | `/auth/forgot-password`, `/auth/reset-password` | public | Reset token 30-min expiry, single-use |

## 2. Dashboard & Profile
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/dashboard/metrics` | student/faculty | Academic + productivity metrics |
| GET | `/dashboard/analytics?range=` | student/faculty/admin | Chart data, scoped by role |
| GET/PATCH | `/profile` | authenticated | Own profile |
| PATCH | `/profile/privacy` | authenticated | Visibility toggles |

## 3. Resource Hub
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/resources` | authenticated | `?subject, type, semester, sort, page` — Meilisearch-backed when `q=` present |
| GET | `/resources/:id` | authenticated | Detail, increments view count |
| POST | `/resources` | student/faculty | Create (status=pending unless faculty auto-publish) |
| POST | `/resources/:id/like`, `/bookmark` | authenticated | Toggle |
| POST | `/resources/:id/comments` | authenticated | Rate limit 20/hour/user |
| GET | `/resources/leaderboard?scope=` | authenticated | daily/weekly/monthly/allTime — Redis sorted set read |
| GET/PATCH | `/admin/resources/pending`, `/admin/resources/:id/moderate` | admin | Moderation queue + action |

## 4. Academic (Quizzes & Assignments)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/quizzes/:id` | authenticated | Answer key hidden for students |
| POST | `/quizzes/:id/attempts` | student | Start attempt |
| PATCH | `/quizzes/:id/attempts/:attemptId/answer` | student (owner) | Submit one answer |
| POST | `/quizzes/:id/attempts/:attemptId/submit` | student (owner) | Finalize, triggers scoring |
| GET | `/quizzes/:id/attempts/:attemptId/result` | student (owner)/faculty | Score + analytics |
| POST | `/assignments/:id/submissions` | student | multipart |

## 5. AI Endpoints (all token-gated — see Architecture.md §8-9)
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/ai/summarize` | student/faculty | Enqueues job, returns `jobId`; 402/403 `TOKEN_LIMIT_EXCEEDED` if insufficient balance |
| GET | `/ai/jobs/:jobId` | owner | Poll job status/result (WS push preferred, this is the fallback) |
| POST | `/ai/quiz/generate` | student/faculty | Token cost scales with question count |
| POST | `/ai/assignment/analyze` | student | Sync for short input, async above a length threshold |
| POST | `/ai/resume/analyze` | student | Async |
| POST | `/ai/planner/generate` | student | Async |
| POST | `/ai/code/review` | student | Sync for short snippets, async above a length threshold |
| GET | `/ai/usage` | authenticated | Current period tokens used/limit — backs `<TokenUsageIndicator>` |

## 6. Study Planner
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET/POST | `/planner` | student | Get current plan / create input set |
| POST | `/planner/regenerate` | student | Token-costed, rate-limited |
| PATCH | `/planner/sessions/:id` | student (owner) | Mark done/reschedule |

## 7. Career & Alumni
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/jobs` | authenticated | `?category, location, type, q` — Meilisearch |
| GET | `/jobs/:id` | authenticated | Detail |
| POST | `/jobs/:id/apply` | student | Requires resume on file or attached |
| POST/PATCH | `/admin/jobs[/:id]` | admin | CRUD postings |
| GET | `/alumni` | student/alumni | `?q, company, gradYear` — Meilisearch |
| GET | `/alumni/:id` | student/alumni | Detail, privacy-filtered |
| POST | `/alumni/:id/connect`, `/mentorship-request` | student | Rate limit 10/day/user |
| PATCH | `/connections/:id`, `/mentorship-requests/:id` | target user | Accept/decline |

## 8. Coding Hub
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/coding/tracks` | student | With per-track progress % |
| GET | `/coding/problems/:id` | student | Detail |
| PATCH | `/coding/problems/:id/status` | student | not_started/attempted/solved |
| GET | `/coding/progress` | student | Overall + per-track/company breakdown |

## 9. Faculty & Live Quiz
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/faculty/announcements` | faculty | Broadcast to a class/section |
| POST | `/faculty/quizzes` | faculty | AI-assisted or manual |
| GET | `/faculty/analytics` | faculty | Own classes |
| POST | `/live-quiz/sessions` | faculty | Creates session + join code + WS channel |
| POST | `/live-quiz/sessions/:code/join` | student | Join lobby |
| WS | `/ws/live-quiz/:sessionId` | session participants | Real-time question push, answer submit, live leaderboard |

## 10. Admin & Billing
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET/PATCH | `/admin/users`, `/admin/users/:id` | admin | List/search, role/suspend actions |
| GET | `/admin/analytics/platform` | admin | Usage/growth/cost/revenue |
| GET/PATCH | `/admin/plans` | admin (super) | Plan tier + token limit/weight config |
| POST | `/billing/checkout-session` | authenticated | Creates payment provider checkout session |
| POST | `/billing/webhook` | payment provider signature | Subscription created/renewed/cancelled/payment_failed |
| GET | `/billing/usage` | authenticated | Current plan + token usage summary |
| POST | `/billing/cancel` | authenticated | Cancels at period end (not immediate) |

## 11. Notifications
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/notifications` | authenticated | Paginated feed |
| PATCH | `/notifications/:id/read`, `/notifications/read-all` | authenticated | — |
| PATCH | `/notifications/preferences` | authenticated | Per-category channel toggles |

## 12. Uploads
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/uploads/presign` | authenticated | Body: `{fileType, fileSize, purpose}` → returns S3 pre-signed PUT URL, validated against plan-tier size limits |
| POST | `/uploads/complete` | authenticated | Confirms upload, verifies object exists, creates the DB record |

## 13. Conventions
- Filtering/sorting query params are Zod-whitelisted per route — never pass raw column names to the query builder.
- Every admin mutation is recorded to `audit_logs` (actor id, action, entity, entity id, meta).
- Rate limits tighter on `/auth/*`, `/ai/*`, and payment endpoints than general reads.
- File uploads validated server-side by MIME type + size (max per plan tier) regardless of client-side checks; queued for virus scan before `published` status.
- `TOKEN_LIMIT_EXCEEDED` is always shape `{ success:false, message, code:'TOKEN_LIMIT_EXCEEDED', used, limit, resetAt, suggestedPlan }` — never a generic 500.

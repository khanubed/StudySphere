# tables.md — Database Schema (PostgreSQL via Prisma)

Conventions: UUID PKs, snake_case columns, `created_at`/`updated_at` on every table, soft delete via `deleted_at` (nullable) on user-generated content tables (resources, comments, jobs, alumni_profiles) rather than hard deletes. FKs `RESTRICT` by default, `CASCADE` only for true child rows.

---

## Users & Institutions

### users
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| name, email | varchar | email unique |
| password_hash | varchar(255) | nullable (OAuth-only) |
| google_id | varchar(80) | nullable, unique |
| role | enum('student','faculty','admin','alumni') | |
| institution_id | uuid FK → institutions.id | nullable for platform-level admin |
| is_verified | boolean | email verified |
| is_active | boolean | default true; false = suspended |
| created_at, updated_at, deleted_at | timestamptz | |

### institutions / branches / semesters / subjects
| Table | Key columns |
|---|---|
| institutions | id, name, domain (email check) |
| branches | id, institution_id FK, name |
| semesters | id, branch_id FK, number |
| subjects | id, semester_id FK, name, code (unique within semester) |

### student_profiles / faculty_profiles / alumni_profiles (1:1 with users)
| Table | Key columns |
|---|---|
| student_profiles | user_id FK, branch_id, semester_id, cgpa, attendance_pct |
| faculty_profiles | user_id FK, department, designation, experience_years |
| alumni_profiles | user_id FK, graduation_year, current_company, designation, skills (text[]), is_verified |

## Academic Domain
| Table | Key columns |
|---|---|
| attendance | id, user_id FK, subject_id FK, date, status enum('present','absent','excused') |
| assignments | id, subject_id FK, created_by FK(users), title, description, deadline, marks |
| assignment_submissions | id, assignment_id FK, user_id FK, content/file_url, submitted_at, ai_feedback jsonb — unique(assignment_id, user_id) |
| quizzes | id, subject_id FK, created_by FK, source enum('ai','manual'), question_count, difficulty, time_limit_min |
| quiz_questions | id, quiz_id FK, type, prompt, options jsonb, correct_answer, topic_tag |
| quiz_attempts | id, quiz_id FK, user_id FK, score, accuracy, started_at, submitted_at — unique(quiz_id, user_id, attempt_number) |
| quiz_attempt_answers | id, attempt_id FK, question_id FK, selected_answer, is_correct |

## Resource Hub Domain
| Table | Key columns |
|---|---|
| resources | id, uploaded_by FK, subject_id FK, title, type enum, file_url/drive_link, status enum('pending','published','rejected'), verified_by FK(users), rejection_reason |
| resource_likes | id, resource_id FK, user_id FK — unique(resource_id, user_id) |
| bookmarks | id, resource_id FK, user_id FK — unique(resource_id, user_id) |
| comments | id, resource_id FK, user_id FK, content, status enum('visible','flagged','removed') |
| contributor_points | id, user_id FK, resource_id FK nullable, action enum('upload','download','like_received','featured'), points int, created_at — one row per qualifying event |
| badges | id, user_id FK, tier enum('bronze','silver','gold','platinum','diamond'), awarded_at |

## AI Domain (source of truth for token accounting)
| Table | Key columns |
|---|---|
| ai_generations | id, user_id FK, type enum('summary','quiz','assignment_help','resume_analysis','study_plan','code_review'), input_ref, status enum('queued','processing','complete','failed'), tokens_used int, model_used, cached boolean, created_at |
| summaries | id, generation_id FK, short_summary, detailed_summary, key_concepts jsonb, flashcards jsonb, mind_map jsonb |
| resume_analyses | id, generation_id FK, ats_score int (0-100), missing_keywords text[], suggestions jsonb |

## Career & Alumni Domain
| Table | Key columns |
|---|---|
| jobs | id, posted_by FK, title, company, category, description, requirements, deadline, is_internship boolean, status enum('open','closed') |
| applications | id, job_id FK, user_id FK, resume_url, status enum('applied','shortlisted','rejected','withdrawn'), applied_at — unique(job_id, user_id) |
| connections | id, requester_id FK(users), target_id FK(users), status enum('pending','accepted','declined') — unique(requester_id, target_id) |
| mentorship_requests | id, student_id FK, alumni_id FK, message, status enum('pending','accepted','declined') |

## Coding Hub Domain
| Table | Key columns |
|---|---|
| tracks | id, name, slug (DSA/Web Dev/AI-ML/Core Subjects) |
| topics | id, track_id FK, name, slug, sort_order |
| problems | id, topic_id FK, title, slug, difficulty, company_tags text[], sheet_source enum('a2z','blind75','neetcode','custom') |
| user_progress | id, user_id FK, problem_id FK, status enum('not_started','attempted','solved'), solved_at — unique(user_id, problem_id) |

## Planner, Notifications
| Table | Key columns |
|---|---|
| tasks | id, user_id FK, title, due_date, is_complete |
| schedules | id, user_id FK, subject_id FK, generated_for_date, blocks jsonb (hour-wise plan) |
| study_sessions | id, user_id FK, subject_id FK, started_at, ended_at, duration_min |
| notifications | id, user_id FK, type, title, body, is_read, channel enum('in_app','email','push'), created_at |

## Billing & Monetization Domain
| Table | Key columns |
|---|---|
| plans | id, name enum('free','pro','institution'), monthly_price, ai_token_limit, features jsonb |
| token_weights | id, action_type, weight int, updated_at — config table, editable without deploy |
| subscriptions | id, user_id FK, plan_id FK, status enum('active','cancelled','past_due'), current_period_end, payment_provider_ref |
| token_usage | id, user_id FK, institution_id FK nullable (for pooled Institution-plan usage), period_start, period_end, tokens_used, tokens_limit — one row per user (or institution) per billing period, incremented per `ai_generations` row |

## Supporting Tables
| Table | Key columns |
|---|---|
| refresh_tokens | id, user_id, token_hash, expires_at, revoked |
| audit_logs | id, admin_id FK, action, entity, entity_id, meta jsonb, created_at — every admin-privileged mutation |
| institutions_config | institution_id FK, key, value jsonb — per-institution overrides (e.g. auto-publish for faculty) |

## Key Relationships
- `users` 1—N `addresses`-equivalent none; 1—N `attendance`, `assignment_submissions`, `quiz_attempts`, `resources` (as uploader), `applications`, `connections`, `mentorship_requests`, `ai_generations`, `notifications`
- `institutions` 1—N `branches` 1—N `semesters` 1—N `subjects`
- `subjects` 1—N `resources`, `assignments`, `quizzes`, `attendance`, `schedules`
- `resources` 1—N `resource_likes`, `bookmarks`, `comments`
- `quizzes` 1—N `quiz_questions`, `quiz_attempts`
- `quiz_attempts` 1—N `quiz_attempt_answers`
- `ai_generations` 1—1 `summaries` or `resume_analyses` (polymorphic by type)
- `tracks` 1—N `topics` 1—N `problems` 1—N `user_progress`
- `plans` 1—N `subscriptions`; `users` 1—1 current `subscriptions` (active) 1—N `token_usage` (historical, one row per period)

## Indexes (minimum required)
- `users`: unique(email), index(institution_id, role)
- `resources`: unique index(subject_id, status), index(uploaded_by)
- `quiz_attempts`: index(user_id, quiz_id)
- `ai_generations`: index(user_id, created_at) — critical for fast token-usage aggregation
- `jobs`: index(category, status, deadline)
- `user_progress`: unique(user_id, problem_id)
- `notifications`: index(user_id, is_read)
- `token_usage`: unique(user_id, period_start) or unique(institution_id, period_start) for pooled plans

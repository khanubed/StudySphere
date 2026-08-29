# forms.md — Form Format & UX Specification

Every form: React Hook Form + the matching Zod schema from `schema.md` (`zodResolver`), shared verbatim between web and mobile. Submission flow is uniform across the whole app: client validate → disable submit + show loading → call the RTK Query mutation → on success, toast + navigate/reset → on failure, map field errors from the server's `errors` object onto the matching field, or show a general error toast for non-field errors (e.g. `TOKEN_LIMIT_EXCEEDED`, which instead routes to the upgrade prompt per Rules.md §2).

---

## 1. Registration
**Schema**: `auth.schema.ts → registerSchema`
| Field | Type | Notes |
|---|---|---|
| Name | text | |
| Email | email | institutional domain check applied server-side if the institution enforces one |
| Password | password (show/hide toggle) | strength hint shown live, not just on error |
| Confirm Password | password | |
| Role | segmented control (Student / Alumni) | Faculty/Admin never appear here |
| Institution → Branch → Semester | dependent selects | only shown/required when Role = Student |
| Terms | checkbox | links to Terms/Privacy |
**Submission flow**: submit → `authApi.register` → on success, auto-login (sets cookies) → redirect to `/dashboard` (student) or profile-completion prompt if institution fields were skipped (Alumni). **Failure**: email-already-registered maps to the Email field; all other errors as a toast.

## 2. Login
**Schema**: `auth.schema.ts → loginSchema`
| Field | Type | Notes |
|---|---|---|
| Email | email | |
| Password | password | "Forgot password?" link inline |
Also renders a "Continue with Google" button (separate OAuth flow, not part of this form's validation). **Submission flow**: submit → `authApi.login` → redirect to `?redirect=` target or role-appropriate home. **Failure**: generic "Invalid email or password" (never reveal which field is wrong, to avoid user enumeration) shown as a form-level banner, not per-field.

## 3. Forgot / Reset Password
**Schema**: `auth.schema.ts → forgotPasswordSchema`, `resetPasswordSchema`
| Step | Field | Notes |
|---|---|---|
| Request | Email | Always shows "if that email exists, a reset link was sent" regardless of whether it does — no enumeration |
| Reset | New Password, Confirm Password | Token read from the URL, not user-entered |
**Submission flow**: request step always shows the same success message; reset step on success redirects to `/login` with a "password updated" toast.

## 4. Profile
**Schema**: `profile.schema.ts → updateProfileSchema`, `privacySettingsSchema`
Two sub-forms on one page: **Basic Info** (Name, Bio, Avatar upload, Institution/Branch/Semester) and **Privacy** (visibility toggles, saved independently — each toggle auto-saves on change rather than requiring a page-level submit, since these are binary preferences, not a batch edit).
**Submission flow**: Basic Info form has an explicit Save button (debounced, disabled until dirty); Privacy toggles save on change with a small inline "Saved" flash, no separate submit.

## 5. Resource Upload
**Schema**: `resource.schema.ts → createResourceSchema`
| Field | Type | Notes |
|---|---|---|
| Title | text | |
| Type | select | Notes/PYQ/Book/Presentation/Assignment/Lab Manual/Research Paper |
| Subject | select (filtered by user's semester by default, overridable) | |
| File or Drive Link | `<FileUploader>` OR url input, toggle between the two modes | exactly one required |
| Tags | tag input, max 10 | |
| Description | textarea | |
**Submission flow**: file mode uploads via presign (see Architecture.md §16 file flow) with a progress bar before the form itself submits; on success, shows a "pending verification" state (not "published") unless the uploader is faculty with auto-publish enabled for their institution.

## 6. Resume Upload / Resume Analyzer
**Schema**: `ai.schema.ts → resumeAnalyzeSchema`
| Field | Type | Notes |
|---|---|---|
| Resume File | `<FileUploader>` | PDF/DOCX, max 5MB |
| Target Job Description | textarea | optional — improves keyword-match relevance |
| LinkedIn URL, Portfolio URL | url inputs | optional |
**Submission flow**: this is a token-costed AI action (see schema.md/Rules.md) — submit button shows the token cost inline ("Analyze — 10 credits") before the user commits, and is disabled with an inline upgrade link if the user's remaining balance is insufficient, rather than letting them submit and then fail.

## 7. AI Notes Summarizer
**Schema**: `ai.schema.ts → summarizeRequestSchema`
| Field | Type | Notes |
|---|---|---|
| Source File | `<FileUploader>` | PDF/PPTX/DOCX/TXT |
| Depth | radio (Short / Detailed / Both) | |
| Include Flashcards, Include Mind Map | checkboxes | each adds to the token cost, reflected live in the cost preview |
**Submission flow**: same token-cost-preview pattern as §6. Result streams into an `<AIResponseCard>` rather than a blocking spinner.

## 8. AI Quiz Generator (Student self-quiz & Faculty quiz creation share this shape)
**Schema**: `ai.schema.ts → quizGenerateSchema` (student) / `quiz.schema.ts → facultyCreateQuizSchema` (faculty, adds Subject + manual-vs-AI toggle)
| Field | Type | Notes |
|---|---|---|
| Source | radio (Upload doc / Existing resource / Topic text) | changes the next field's input type |
| Source input | file / resource picker / textarea | depends on Source |
| Question Types | multi-select checkboxes | at least 1 |
| Difficulty | select | Easy/Medium/Hard/Mixed |
| Question Count | number stepper | 1-50 (student) / 1-100 (faculty) |
| Time Limit | number (minutes) | optional |
**Submission flow**: token cost preview scales live as Question Count changes. On success, navigates straight into the quiz attempt or, for faculty, to the quiz's admin detail page.

## 9. AI Assignment Helper
**Schema**: `ai.schema.ts → assignmentAnalyzeSchema`
| Field | Type | Notes |
|---|---|---|
| Text or File | textarea (with word count) OR `<FileUploader>`, toggle | one required, min 50 words if text |
| Citation Style | select | APA/MLA/IEEE, required only if citation suggestions requested |
**Submission flow**: results render as categorized findings (grammar/spelling/readability/tone/citations), each with accept/reject controls — not a flat wall of text.

## 10. Study Planner
**Schema**: `ai.schema.ts → plannerGenerateSchema`
| Field | Type | Notes |
|---|---|---|
| Subjects | multi-select | at least 1 |
| Exam Date (per selected subject) | date picker, repeated per subject | must be future |
| Hours Available / Day | number/slider | 0.5-16 |
**Submission flow**: "Generate" is token-costed; "Regenerate" (after edits) carries the same cost and shows a confirm step ("Regenerating uses N more credits — continue?") since it's easy to hit repeatedly by accident.

## 11. Faculty Creation (Admin)
**Schema**: `faculty.schema.ts → createFacultySchema`
| Field | Type | Notes |
|---|---|---|
| Name, Email | text, email | email uniqueness checked server-side |
| Department, Designation | select, text | |
| Branch Assignment | multi-select | at least 1 |
**Submission flow**: creates the account in an unverified/invited state; sends an invite email with a set-password link rather than the admin setting a password directly.

## 12. Announcement (Faculty)
**Schema**: `faculty.schema.ts → createAnnouncementSchema`
| Field | Type | Notes |
|---|---|---|
| Scope | radio (This subject / Institution-wide, if permitted) | |
| Title | text | |
| Message | richtext, char counter | 1-2000 chars |
| Schedule for later | toggle → date-time picker | optional |
| Pin | checkbox | |
**Submission flow**: immediate send shows a confirm step ("This notifies N students now") since it fires push/email notifications; scheduled sends don't need the confirm step.

## 13. Job / Internship Posting (Admin)
**Schema**: `career.schema.ts → createJobSchema`
| Field | Type | Notes |
|---|---|---|
| Title, Company | text | |
| Category | select | |
| Is Internship | toggle | reveals Duration + Stipend fields when on |
| Description, Requirements | richtext | |
| Location, Remote | text, checkbox | |
| Deadline | date picker | must be future |
**Submission flow**: on save, defaults to `open` status and is immediately searchable/indexed (Meilisearch sync + sitemap regeneration per SeoGuide.md).

## 14. Mentorship Request (Student → Alumni)
**Schema**: `alumni.schema.ts → mentorshipRequestSchema`
| Field | Type | Notes |
|---|---|---|
| Message | textarea, char counter | 20-500 chars, placeholder nudges toward specificity ("mention what you'd like guidance on") |
**Submission flow**: rate-limited (10/day/user per api.md) — if the limit is hit, the button disables with a tooltip explaining when it resets, not a failed submit.

## 15. Live Quiz — Host Setup (Faculty)
**Schema**: `liveQuiz.schema.ts → createLiveQuizSessionSchema`
| Field | Type | Notes |
|---|---|---|
| Topic | text | |
| Difficulty | select | |
| Question Count | number stepper | 5-50 |
**Submission flow**: generates the quiz via AI (token-costed to the faculty/institution pool) and immediately opens the host lobby screen with the join code/QR displayed large.

## 16. Live Quiz — Join (Student)
**Schema**: `liveQuiz.schema.ts → joinLiveQuizSchema`
| Field | Type | Notes |
|---|---|---|
| Code | 6-char input, auto-uppercase, auto-advance | or scan QR via camera instead of typing |
**Submission flow**: instant join on valid code — no confirm step, since joining a lobby has no cost/consequence.

## 17. Checkout / Upgrade (Billing)
**Schema**: `billing.schema.ts → createCheckoutSessionSchema`
| Field | Type | Notes |
|---|---|---|
| Plan | card-select (Free/Pro/Institution comparison) | current plan disabled/marked |
| Billing Cycle | toggle (Monthly / Yearly) | shows savings % on yearly |
**Submission flow**: redirects to the payment provider's hosted checkout — this app never collects card details directly. On return, polls `billing.getUsage` briefly to reflect the upgraded limit immediately rather than waiting for the webhook round-trip to show in the UI.

## 18. Admin — Plan & Token Config
**Schema**: `admin.schema.ts → updatePlanSchema`, `updateTokenWeightSchema`
| Field | Type | Notes |
|---|---|---|
| Plan Name | fixed (Free/Pro/Institution), not editable | |
| Monthly Price | number | |
| AI Token Limit | number | |
| Features | checkbox list | per-feature boolean flags |
| (separate table) Action Type → Weight | inline-editable table | one row per `ai_generations.type` |
**Submission flow**: changes are versioned and take effect at each user's *next* billing cycle, not retroactively mid-cycle (per Architecture.md §9) — the save confirmation states this explicitly so an admin doesn't expect an instant global effect.

## 19. Contact / Support (if present in a given deployment)
| Field | Type | Notes |
|---|---|---|
| Subject | select or text | |
| Message | textarea | 10-1000 chars |
Not schema-tracked separately here if this maps to a generic support-ticket integration rather than an in-house table — confirm with Architecture.md before building; if in-house, add a `support.schema.ts` entry following the same pattern as the rest of this file.

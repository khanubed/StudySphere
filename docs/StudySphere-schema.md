# schema.md — Zod Schema Validators

Lives in `packages/shared-schemas/` and is imported by web (React Hook Form resolvers), mobile (same resolvers), and the API (`validate.middleware.ts`) — one schema per action, never redefined per platform. File layout mirrors the domains below: `auth.schema.ts`, `profile.schema.ts`, `resource.schema.ts`, `ai.schema.ts`, `quiz.schema.ts`, `assignment.schema.ts`, `planner.schema.ts`, `career.schema.ts`, `alumni.schema.ts`, `coding.schema.ts`, `faculty.schema.ts`, `liveQuiz.schema.ts`, `billing.schema.ts`, `notification.schema.ts`, `admin.schema.ts`.

---

## 1. auth.schema.ts
```ts
import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(60),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).regex(/[A-Za-z]/).regex(/[0-9]/),
  confirmPassword: z.string(),
  role: z.enum(["student", "alumni"]), // faculty/admin never self-selected
  institutionId: z.string().uuid().optional(),
  branchId: z.string().uuid().optional(),
  semesterId: z.string().uuid().optional(),
  acceptedTerms: z.literal(true),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
}).refine((d) => d.role !== "student" || (d.institutionId && d.branchId && d.semesterId), {
  message: "Institution, branch, and semester are required for students",
  path: ["institutionId"],
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(1, "Enter your password"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(8).regex(/[A-Za-z]/).regex(/[0-9]/),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});
```

## 2. profile.schema.ts
```ts
export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(60),
  bio: z.string().trim().max(300).optional(),
  institutionId: z.string().uuid().optional(),
  branchId: z.string().uuid().optional(),
  semesterId: z.string().uuid().optional(),
});

export const privacySettingsSchema = z.object({
  profileVisibility: z.enum(["public", "institution_only", "private"]),
  showContactInfo: z.boolean(),
  showAcademicStats: z.boolean(),
});

export const notificationPreferencesSchema = z.object({
  category: z.enum(["academic", "social", "career", "billing", "moderation", "system"]),
  channels: z.object({
    inApp: z.literal(true), // in-app is never disableable
    email: z.boolean(),
    push: z.boolean(),
  }),
}).refine((d) => d.category !== "billing" || d.channels.email, {
  message: "Billing email notifications cannot be disabled",
  path: ["channels", "email"],
});
```

## 3. resource.schema.ts
```ts
export const resourceTypeEnum = z.enum([
  "notes", "pyq", "book", "presentation", "assignment", "lab_manual", "research_paper",
]);

export const createResourceSchema = z.object({
  title: z.string().trim().min(3).max(150),
  type: resourceTypeEnum,
  subjectId: z.string().uuid(),
  fileUrl: z.string().url().optional(),
  driveLink: z.string().url().regex(/drive\.google\.com/, "Must be a Google Drive share link").optional(),
  tags: z.array(z.string().trim().min(2).max(30)).max(10).optional(),
  description: z.string().trim().max(500).optional(),
}).refine((d) => !!d.fileUrl || !!d.driveLink, {
  message: "Upload a file or paste a Drive link",
  path: ["fileUrl"],
});

export const addCommentSchema = z.object({
  resourceId: z.string().uuid(),
  content: z.string().trim().min(1).max(500),
});

export const moderateResourceSchema = z.object({
  resourceId: z.string().uuid(),
  action: z.enum(["publish", "reject"]),
  rejectionReason: z.string().trim().min(10).optional(),
}).refine((d) => d.action !== "reject" || !!d.rejectionReason, {
  message: "A reason is required to reject a resource",
  path: ["rejectionReason"],
});
```

## 4. ai.schema.ts
```ts
export const summarizeRequestSchema = z.object({
  sourceFileUrl: z.string().url(),
  depth: z.enum(["short", "detailed", "both"]).default("both"),
  includeFlashcards: z.boolean().default(false),
  includeMindMap: z.boolean().default(false),
});

export const quizGenerateSchema = z.object({
  source: z.enum(["upload", "resource", "topic_text"]),
  sourceRef: z.string().min(1), // fileUrl, resourceId, or raw topic text depending on `source`
  questionTypes: z.array(z.enum(["mcq", "fill_blank", "short_answer", "true_false"])).min(1),
  difficulty: z.enum(["easy", "medium", "hard", "mixed"]),
  questionCount: z.number().int().min(1).max(50),
  timeLimitMinutes: z.number().int().min(1).max(180).optional(),
});

export const assignmentAnalyzeSchema = z.object({
  text: z.string().trim().min(50).max(20000).optional(),
  fileUrl: z.string().url().optional(),
  citationStyle: z.enum(["APA", "MLA", "IEEE"]).optional(),
}).refine((d) => !!d.text || !!d.fileUrl, {
  message: "Submit at least 50 words or a file",
  path: ["text"],
});

export const resumeAnalyzeSchema = z.object({
  resumeFileUrl: z.string().url(),
  targetJobDescription: z.string().trim().max(5000).optional(),
  linkedInUrl: z.string().url().optional(),
  portfolioUrl: z.string().url().optional(),
});

export const plannerGenerateSchema = z.object({
  subjectIds: z.array(z.string().uuid()).min(1),
  examDates: z.record(z.string().uuid(), z.coerce.date()), // subjectId -> date
  hoursPerDay: z.number().min(0.5).max(16),
}).refine(
  (d) => Object.values(d.examDates).every((date) => date > new Date()),
  { message: "Exam date must be in the future", path: ["examDates"] }
);

export const codeReviewSchema = z.object({
  code: z.string().trim().min(1).max(20000),
  language: z.string().min(1).max(30),
});
```

## 5. quiz.schema.ts
```ts
export const startAttemptSchema = z.object({ quizId: z.string().uuid() });

export const submitAnswerSchema = z.object({
  attemptId: z.string().uuid(),
  questionId: z.string().uuid(),
  selectedAnswer: z.union([z.string(), z.array(z.string())]),
});

export const submitAttemptSchema = z.object({ attemptId: z.string().uuid() });

export const facultyCreateQuizSchema = z.object({
  subjectId: z.string().uuid(),
  source: z.enum(["ai", "manual"]),
  questionTypes: z.array(z.enum(["mcq", "fill_blank", "short_answer", "true_false"])).min(1),
  difficulty: z.enum(["easy", "medium", "hard"]),
  questionCount: z.number().int().min(1).max(100),
  timeLimitMinutes: z.number().int().min(1).max(180).optional(),
});
```

## 6. assignment.schema.ts
```ts
export const submitAssignmentSchema = z.object({
  assignmentId: z.string().uuid(),
  content: z.string().trim().min(1).optional(),
  fileUrl: z.string().url().optional(),
}).refine((d) => !!d.content || !!d.fileUrl, {
  message: "Provide text content or a file",
  path: ["content"],
});

export const createAssignmentSchema = z.object({ // faculty
  subjectId: z.string().uuid(),
  title: z.string().trim().min(3).max(150),
  description: z.string().trim().min(10).max(5000),
  deadline: z.coerce.date(),
  marks: z.number().int().min(1).max(1000),
}).refine((d) => d.deadline > new Date(), {
  message: "Deadline must be a future date",
  path: ["deadline"],
});
```

## 7. planner.schema.ts
```ts
export const updateSessionSchema = z.object({
  sessionId: z.string().uuid(),
  action: z.enum(["mark_done", "reschedule"]),
  newTime: z.coerce.date().optional(),
}).refine((d) => d.action !== "reschedule" || !!d.newTime, {
  message: "Provide a new time to reschedule",
  path: ["newTime"],
});
```

## 8. career.schema.ts
```ts
export const jobCategoryEnum = z.enum(["software_development", "data_science", "design", "marketing", "other"]);

export const createJobSchema = z.object({
  title: z.string().trim().min(3).max(150),
  company: z.string().trim().min(2).max(100),
  category: jobCategoryEnum,
  description: z.string().trim().min(50).max(5000),
  requirements: z.string().trim().min(10).max(3000),
  isInternship: z.boolean(),
  durationMonths: z.number().int().min(1).max(12).optional(),
  stipend: z.number().min(0).optional(),
  location: z.string().trim().max(100).optional(),
  isRemote: z.boolean().default(false),
  deadline: z.coerce.date(),
}).refine((d) => d.deadline > new Date(), {
  message: "Deadline must be a future date",
  path: ["deadline"],
}).refine((d) => !d.isInternship || !!d.durationMonths, {
  message: "Duration is required for internships",
  path: ["durationMonths"],
});

export const applyToJobSchema = z.object({
  jobId: z.string().uuid(),
  resumeUrl: z.string().url().optional(), // falls back to resume on file if omitted
});
```

## 9. alumni.schema.ts
```ts
export const updateAlumniProfileSchema = z.object({
  graduationYear: z.number().int().min(1990).max(new Date().getFullYear()),
  currentCompany: z.string().trim().max(100).optional(),
  designation: z.string().trim().max(100).optional(),
  skills: z.array(z.string().trim().min(2).max(30)).max(20).optional(),
});

export const mentorshipRequestSchema = z.object({
  alumniId: z.string().uuid(),
  message: z.string().trim().min(20).max(500),
});

export const connectionRequestSchema = z.object({
  targetUserId: z.string().uuid(),
});
```

## 10. coding.schema.ts
```ts
export const updateProblemStatusSchema = z.object({
  problemId: z.string().uuid(),
  status: z.enum(["not_started", "attempted", "solved"]),
});
```

## 11. faculty.schema.ts
```ts
export const createFacultySchema = z.object({ // admin-only
  name: z.string().trim().min(2).max(60),
  email: z.string().trim().toLowerCase().email(),
  department: z.string().trim().min(1).max(100),
  designation: z.string().trim().min(1).max(100),
  branchIds: z.array(z.string().uuid()).min(1, "Assign at least one branch"),
});

export const createAnnouncementSchema = z.object({
  subjectId: z.string().uuid().optional(), // omit for institution-wide
  title: z.string().trim().min(3).max(150),
  message: z.string().trim().min(1).max(2000),
  scheduledFor: z.coerce.date().optional(),
  pinned: z.boolean().default(false),
}).refine((d) => !d.scheduledFor || d.scheduledFor > new Date(), {
  message: "Scheduled time must be in the future",
  path: ["scheduledFor"],
});
```

## 12. liveQuiz.schema.ts
```ts
export const createLiveQuizSessionSchema = z.object({
  topic: z.string().trim().min(3).max(150),
  difficulty: z.enum(["easy", "medium", "hard"]),
  questionCount: z.number().int().min(5).max(50),
});

export const joinLiveQuizSchema = z.object({
  code: z.string().length(6).regex(/^[A-Z0-9]{6}$/, "Enter a valid 6-character code"),
});

export const liveQuizAnswerSchema = z.object({
  sessionId: z.string().uuid(),
  questionId: z.string().uuid(),
  selectedAnswer: z.string(),
  answeredAtMs: z.number().int(), // client timestamp, server still authoritative on lock time
});
```

## 13. billing.schema.ts
```ts
export const createCheckoutSessionSchema = z.object({
  planId: z.string().uuid(),
  billingCycle: z.enum(["monthly", "yearly"]),
});

export const cancelSubscriptionSchema = z.object({
  reason: z.string().trim().max(500).optional(),
});
```

## 14. admin.schema.ts
```ts
export const updateUserRoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(["student", "faculty", "admin", "alumni"]),
});
// Note: the "cannot demote the last remaining Admin" rule needs a DB count
// check and is enforced in the service layer, not expressible in Zod alone.

export const suspendUserSchema = z.object({
  userId: z.string().uuid(),
  reason: z.string().trim().min(5).max(500),
});

export const updatePlanSchema = z.object({
  planId: z.string().uuid(),
  monthlyPrice: z.number().min(0),
  aiTokenLimit: z.number().int().min(0),
  features: z.record(z.string(), z.boolean()),
});

export const updateTokenWeightSchema = z.object({
  actionType: z.string().min(1), // matches ai_generations.type values
  weight: z.number().int().min(0),
});
```

## 15. upload.schema.ts (shared across resource/resume/assignment/avatar uploads)
```ts
export const presignUploadSchema = z.object({
  fileType: z.string().regex(/^(application|image)\//),
  fileSizeBytes: z.number().int().positive(),
  purpose: z.enum(["resource", "resume", "assignment", "avatar", "live_quiz_evidence"]),
});
```

## 16. Usage Notes
- Every mutating API route imports its schema from here via `validate.middleware.ts` — no endpoint defines validation inline.
- Web/mobile forms use the identical schema as the React Hook Form resolver (`zodResolver(registerSchema)`), so client and server never drift.
- Refinements that require a DB lookup (uniqueness, last-admin protection, resource-ownership) are **not** encoded in Zod — Zod handles shape/format only; those checks live in the service layer and are documented inline as comments where a schema alone can't express them (see `admin.schema.ts` above).
- When adding a new form or AI endpoint, add its schema here first, export it from the domain file's index, then wire the resolver — never write a one-off inline schema in a component or route handler.

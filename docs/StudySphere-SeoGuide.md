# SeoGuide.md — SEO Implementation Guide (Web)

StudySphere's web app is Next.js 15 specifically because two route groups need to rank: the **Coding Hub problem catalog** and **Career Hub listings** are real organic-acquisition surfaces for a student audience searching "[company] interview questions" or "[role] internship [city]." This guide is the execution-level companion to Architecture.md §10.

## 1. What's Indexable vs. Not
| Indexable (SSR/SSG + full SEO) | Not indexable (noindex / excluded) |
|---|---|
| `/`, `/pricing`, `/about` | `/dashboard`, `/profile`, `/billing`, `/notifications` |
| `/career`, `/career/[id]` | `/ai/*` (all AI tool screens) |
| `/coding`, `/coding/[trackSlug]/[topicSlug]/[problemSlug]` | `/quiz/*`, `/planner` |
| `/resources/[id]` (only if the institution enables public resource indexing) | `/faculty/*`, `/admin/*` |
| — | `/login`, `/register`, `/forgot-password` (noindex, not excluded — still crawlable but not meant to rank) |

## 2. Metadata (App Router `generateMetadata`)
Use the built-in Metadata API per route — never a client-side head manager — so crawlers get correct tags without executing JS.

| Page | Title pattern | Description source |
|---|---|---|
| Landing | `StudySphere — AI-Powered Student Success Platform` | Static, written once |
| Career listing | `Internships & Jobs for Students \| StudySphere` | Static |
| Career detail | `{Job title} at {Company} \| StudySphere Careers` | First 155 chars of job description |
| Coding catalog | `{Track name} Practice Problems \| StudySphere Coding Hub` | Track description |
| Coding problem | `{Problem title} — {Difficulty} \| StudySphere` | Problem summary, fallback to auto-generated from tags |
| Public resource | `{Resource title} \| StudySphere` | `resources.description` or auto-generated from type+subject |

Rules: unique title/description per page (no shared defaults across a listing), title ≤ 60 chars, description ≤ 155-160 chars, canonical tag on every page (self-referencing except paginated listings → canonical to page 1).

## 3. Structured Data (JSON-LD via `generateMetadata` or a script tag in the layout)
| Page | Schema type | Key fields |
|---|---|---|
| Landing | `SoftwareApplication` + `Organization` | name, applicationCategory, offers (plan pricing), logo, sameAs (socials) |
| Career detail | `JobPosting` | title, description, datePosted, validThrough, hiringOrganization, employmentType |
| Coding problem | `LearningResource` (or `Quiz`/`Course` where closer fit) | name, description, educationalLevel, about (topic) |
| Public resource | `LearningResource` | name, description, learningResourceType, about (subject) |
| All deep pages | `BreadcrumbList` | matches the visible breadcrumb component exactly |

Validate every schema type against Google's Rich Results Test before considering a page's SEO work done.

## 4. URL Structure
- Lowercase, hyphenated, descriptive slugs, no UUIDs in indexable URLs: `/career/backend-intern-at-acme-corp`, `/coding/dsa/arrays/two-sum`.
- Slugs generated server-side on create (from title, deduplicated with a numeric suffix if collision), editable by faculty/admin — a slug change after publish should redirect (301) from the old slug rather than 404ing, since coding-problem and job-posting URLs get bookmarked and shared in student groups.
- Query params only for non-indexable state (filters, pagination, search `q=`) — never for content that should be its own crawlable page.

## 5. sitemap.xml & robots.txt
- `sitemap.xml` generated at build/ISR-revalidation time, covering every route in the "Indexable" column of §1, split into `sitemap-career.xml` / `sitemap-coding.xml` / `sitemap-resources.xml` once volume grows beyond a single flat file being practical.
- `robots.txt`:
  ```
  User-agent: *
  Allow: /
  Disallow: /dashboard
  Disallow: /profile
  Disallow: /billing
  Disallow: /notifications
  Disallow: /ai
  Disallow: /quiz
  Disallow: /planner
  Disallow: /faculty
  Disallow: /admin
  Disallow: /api
  Sitemap: https://<domain>/sitemap.xml
  ```
- Submit to Google Search Console after first deploy; re-check indexing coverage after every major content batch (new job postings import, coding catalog expansion).

## 6. Content Strategy
- **Coding Hub is the primary long-tail engine**: individual problem pages targeting "[problem name] leetcode solution approach," "[company] interview coding questions" — real unique content per problem (explanation, approach, complexity notes), not just a title and a difficulty badge.
- **Career Hub listings** rank for "[role] internship for students," "[company] hiring students" — freshness matters here (SSR, not stale SSG) since job postings expire.
- Internal linking is mandatory: a coding problem page links to relevant company-prep collections; a job posting links to relevant coding tracks ("Prepping for this role? Practice these problems"); this loop keeps crawl depth reasonable and spreads authority between the two SEO-driving sections.
- Public resource pages (where an institution opts in) should never duplicate meta descriptions across resources — generate from actual content (subject + type + first line of description), not a template string repeated verbatim.

## 7. Core Web Vitals & Performance
| Metric | Target | Main levers |
|---|---|---|
| LCP | < 2.5s | `next/image` for all images, preload hero image on landing, avoid render-blocking JS on SSR/SSG routes |
| CLS | < 0.1 | Explicit width/height on every image, reserve space for AI-response cards that load async on non-indexable pages (less critical there, but still good practice) |
| INP | < 200ms | Route-level code splitting (default in App Router), avoid heavy synchronous work in search/filter handlers, debounce search input (250ms) |

Mobile-first testing matters here — this audience skews mobile web for the indexable pages (someone searching "[company] interview questions" from their phone).

## 8. Monitoring
- Google Search Console: Index Coverage, Page Experience/Core Web Vitals, Query performance — monthly minimum.
- GA4 funnel events: `view_job` → `apply_click`; `view_problem` → `signup_click` (the conversion path from organic Coding Hub traffic into a registered user is the single most valuable funnel to watch, since it's the free-to-registered step upstream of Architecture.md §9's free-to-paid funnel).
- Monthly content review: which coding problems/job postings are gaining organic traffic, which have high impressions but low CTR (title/description rewrite candidates).

## 9. Pre-Publish Checklist (Coding problems, Job postings, Public resources)
- [ ] Unique, descriptive slug set
- [ ] Meta title ≤ 60 chars, meta description ≤ 160 chars, both unique
- [ ] Correct schema type renders and validates (Rich Results Test)
- [ ] At least one internal link in or out
- [ ] Canonical tag present and correct
- [ ] Included in the next sitemap regeneration
- [ ] (Job postings only) `validThrough` set correctly so expired postings don't linger in search results

# Design.md — Visual Design System (v2)

## What changed from v1

The old system (violet primary, cyan accent, Notion/Linear reference) has been replaced with the **Ledger** system — the same design language now built into the landing page CSS (`--ink`, `--paper`, `--quad`, `--marker`, `--chalk`, `--graphite`). This doc is the source of truth those tokens were pulled from; the landing page code and this spec should stay in sync going forward, and `packages/ui-tokens` should mirror these values exactly rather than reintroducing the old palette anywhere in the app.

Two fonts have been added: **Geist**, for the product UI itself, and **Geist Mono**, its monospace sibling, for in-app data. Reasoning for both is in §5.

## 1. Direction
Calm, focused, premium-feeling productivity tool — but built on a specific idea, not a generic "clean SaaS" reference. StudySphere turns a student's scattered academic life into one running record, so the whole product — marketing site and app alike — reads as a **ledger**: hairline rules, monospace data, entries over time. High information density done cleanly on dashboard/analytics surfaces, generous comfort on content-heavy surfaces (Resource Hub, notes, AI output). Tokens shared between web (Tailwind) and mobile (NativeWind) via `packages/ui-tokens` — one source of truth, not two design systems, and not two different palettes between marketing and product either.

## 2. Branding
- Logo direction: a simple geometric mark — the existing orbit/node concept still works, but re-render it single-color in Quad green on Paper (not gradient-dependent), so it sits naturally next to the mono wordmark and the ledger checkmark motif (`.stamp-mark` in the landing CSS) used for verified/completed states elsewhere in the product.
- Design philosophy: Apple-like attention to spacing/hierarchy on marketing/onboarding surfaces; utilitarian density on dashboard/analytics surfaces; comfortable, unhurried typesetting in long-form content (notes, AI summaries) — the same three registers as before, now expressed through Fraunces/Geist/Inter rather than borrowed reference sites.

## 3. Color Tokens — Light Mode

`--ink` and `--paper` are **role tokens**, not fixed hex values — they invert between light and dark mode rather than being redefined per-component. In light mode, Ink is the dark/text role and Paper is the light/background role.

| Token | RGB | Hex | Usage |
|---|---|---|---|
| `--background` / `--paper` | `243 244 239` | `#F3F4EF` | Page background |
| `--foreground` / `--ink` | `18 21 28` | `#12151C` | Primary text |
| `--primary` / `--quad` | `47 93 80` | `#2F5D50` | CTAs, active nav, links, brand accents |
| `--secondary` / `--muted` | `220 222 214` | `#DCDED6` | Secondary buttons, chips, section backgrounds |
| `--muted-foreground` / `--graphite` | `138 141 133` | `#8A8D85` | Secondary text, captions, timestamps |
| `--accent` / `--marker` | `242 193 78` | `#F2C14E` | Sparing highlight only — never body text color, contrast fails there |
| `--chalk` | `91 127 222` | `#5B7FDE` | Reserved specifically for AI-generated content and AI badges — a semantic signal, not a general accent |
| `--border` / `--input` | `200 203 194` | `#C8CBC2` | Dividers, card/input borders |
| `--destructive` | `185 28 28` | `#B91C1C` | Errors, rejected content, delete actions |
| `--success` | `47 93 80` (= Quad) | `#2F5D50` | Correct answers, verified badges — intentionally reuses Quad rather than a separate green |
| `--warning` | `242 193 78` (= Marker) | `#F2C14E` | Token-limit warnings, pending moderation |

## 4. Color Tokens — Dark Mode

| Token | RGB | Hex | Usage |
|---|---|---|---|
| `--background` / `--paper` | `18 21 28` | `#12151C` | Page background |
| `--foreground` / `--ink` | `243 244 239` | `#F3F4EF` | Primary text |
| `--primary` / `--quad` | `76 160 138` | `#4CA08A` | Brightened for dark-background contrast |
| `--secondary` / `--muted` | `35 38 44` | `#23262C` | Secondary buttons, chips, section backgrounds |
| `--muted-foreground` / `--graphite` | `160 162 155` | `#A0A29B` | Secondary text, captions, timestamps |
| `--accent` / `--marker` | `242 193 78` | `#F2C14E` | Unchanged — stays legible on dark backgrounds as-is |
| `--chalk` | `130 160 240` | `#82A0F0` | AI-specific signal, brightened for dark mode |
| `--card` / `--popover` | `28 31 38` | `#1C1F26` | Elevated surfaces (cards, modals, popovers) |
| `--border` / `--input` | `55 58 53` | `#373A35` | Dividers, card/input borders |
| `--destructive` | `239 68 68` | `#EF4444` | Errors, rejected content, delete actions |
| `--success` | `76 160 138` (= Quad) | `#4CA08A` | Correct answers, verified badges |
| `--warning` | `242 193 78` (= Marker) | `#F2C14E` | Token-limit warnings, pending moderation |

Default: respects system preference on first visit; user override persists after that (mechanism unchanged, §7).

## 5. Typography

Four faces, each with one job — don't blur these roles by reaching for Fraunces in the product or Geist on the marketing site.

| Role | Font | Where | Size / Weight / Line-height |
|---|---|---|---|
| Display | **Fraunces** | Marketing site only — landing hero, section titles, final CTA | 72–96px hero / 40–48px section titles, tight tracking |
| Product UI | **Geist** | In-app: nav, sidebar, dashboard headers, buttons, in-product H1–H4 | 20–32px / 600–700 / 1.25 |
| Body / Reading | **Inter** | Long-form reading everywhere: notes, AI summaries, descriptions, marketing subcopy | 14–18px / 400–500 / 1.6 (generous — long study sessions) |
| Data / Mono | **Geist Mono** | In-app data: ledger-style stat rows, token usage, timestamps, table figures | 13–15px / 400, slightly wider tracking |
| Code | **IBM Plex Mono** | Coding Hub code blocks specifically | 13–14px / 400 / 1.5 |

**Why Geist, specifically:** the original spec left product headings ambiguous ("Geist or Inter Display"). Geist is built for exactly this job — dense UI text at small-to-mid sizes, which is most of what the app actually shows — so it now owns that role outright, distinct from Fraunces (which is reserved for the marketing site's larger, slower-paced display moments).

**Why Geist Mono, specifically, as the second addition:** the landing page already uses IBM Plex Mono for its ledger motif. Rather than pull that same face into every in-app data element, Geist Mono — Geist's purpose-built monospace sibling — takes over in-product data display (token counters, timestamps, stat rows), so the app's numbers read as part of the same modern system as its Geist headings. IBM Plex Mono narrows to one job it's genuinely well-suited for: Coding Hub code blocks, where a recognizable "programming font" is actually what students expect to see.

## 6. Spacing & Layout Rules
- 4px base spacing scale (4/8/12/16/24/32/48/64/96) — no arbitrary values, on either platform.
- Radius: `0.5rem` (8px) as the base `--radius` token, applied consistently to inputs, buttons, and cards — matching the hairline-bordered, less-rounded feel of the ledger system. Reserve a larger radius (`1rem`) only for modals, and full pill for badges/tags. (This tightens the previous card radius of `0.75rem` — the softer rounding read at odds with the hairline-border aesthetic once the two systems sat side by side.)
- Elevation: flat + border-based by default; `shadow-md` reserved for modals/popovers/dropdowns only — keeps the dense dashboard calm and consistent with the landing page's flat, rule-divided surfaces.
- Web container: `max-w-7xl` centered; app shell uses a fixed sidebar (240–280px, collapsible) + fluid content.
- Mobile: bottom tab bar (5 items max), safe-area-aware, no sidebar pattern.

## 7. Dark/Light Mode Mechanism
- Web: Tailwind `darkMode: 'class'`, `uiSlice.theme` persisted via redux-persist + localStorage, inline pre-hydration script avoids flash-of-wrong-theme.
- Mobile: NativeWind's `useColorScheme` bridged to the same `uiSlice.theme`, persisted via redux-persist + AsyncStorage, defaults to system preference on first launch.
- Default: respects system preference on first visit; user override persists after that.

## 8. Component Styling Notes
| Component | Notes |
|---|---|
| `<AIResponseCard>` | Left border or background wash in `--chalk`, not the generic `--accent` — Chalk is reserved specifically for AI-originated content, so the color itself signals "this came from the model," consistent with the marketing site's AI Features section |
| `<TokenUsageIndicator>` | Pill in the topbar; `--graphite` above 50% remaining, `--warning` (Marker) under 20%, `--destructive` at 0 with a link to `/billing` |
| Cards (resource/quiz/job) | `--card` bg (mirrors `--background` on mobile), 1px `--border`, hover elevation on web only (no hover state on mobile — use press opacity instead) |
| Badges (contributor tiers) | Bronze/Silver/Gold/Platinum/Diamond — distinct icon + color per tier, not just a color swap, since these are a core engagement/status signal |
| Quiz question states | unanswered (`--border`), answered (`--primary`/Quad ring), locked/time-up (`--muted`), reviewed correct/incorrect (`--success`/`--destructive`) — correct reuses Quad deliberately, so "correct" and "primary action" read as the same positive green throughout the product |

## 9. Imagery & Content Tone
- AI-generated visuals (mind maps, charts) should read as clearly AI-assisted but polished — not sterile, not gimmicky. Where a visual needs to signal "AI-made," lean on `--chalk`, not a generic sparkle icon.
- Illustrations for empty states: friendly, minimal line-art in Ink/Graphite, consistent with the ledger's restrained, mono-adjacent tone — avoid generic stock-illustration packs, and avoid anything that reads as a different visual system from the rest of the product (no rounded-blob-character illustrations next to hairline-bordered ledger tables).

## 10. Accessibility
- Maintain WCAG AA contrast in both themes — check specifically: `--graphite` text on `--background`, `--quad` on `--background` (both modes), and `--chalk` on `--background`. `--marker` (yellow) is a highlight/background color only — never set it as text color on Paper, it won't clear AA at body-text sizes.
- Every interactive element keyboard-navigable (web) with a visible focus ring (`ring-2 ring-ring ring-offset-2`, matching the landing page's focus treatment); mobile touch targets minimum 44×44px.
- Alt text / accessibility labels required on every image and icon-only button, on both platforms.
- `prefers-reduced-motion` respected everywhere, matching the landing page's baseline: animations reduce to `0.01ms` duration rather than being removed outright, so end states still render correctly.
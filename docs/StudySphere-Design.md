# Design.md — Visual Design System

## 1. Direction
Calm, focused, premium-feeling productivity tool — closer to Notion/Linear than a busy campus-portal aesthetic. Students spend hours here; visual fatigue is a real risk. High information density done cleanly on dashboard/analytics surfaces, generous comfort on content-heavy surfaces (Resource Hub, notes, AI output). Tokens shared between web (Tailwind) and mobile (NativeWind) via `packages/ui-tokens` — one source of truth, not two design systems.

## 2. Branding
- Logo direction: a simple geometric mark suggesting orbit/ecosystem (a node with connected satellites, or a stylized "S" formed from an orbital ring) — works at favicon size, single-color-safe.
- Design philosophy: Apple-like attention to spacing/hierarchy on marketing/onboarding surfaces; utilitarian density on dashboard/analytics surfaces; Notion-like comfort in long-form content (notes, AI summaries).

## 3. Color Tokens — Light Mode
| Token | Value (HSL) | Usage |
|---|---|---|
| `--background` | `0 0% 100%` | Page background |
| `--foreground` | `240 10% 12%` | Primary text |
| `--primary` | `255 82% 62%` (#5B3DF6 violet-indigo) | CTAs, active nav, links, brand accents |
| `--secondary` | `240 5% 92%` | Secondary buttons, chips |
| `--muted` | `240 5% 96%` | Card/section backgrounds |
| `--muted-foreground` | `240 4% 40%` | Secondary text |
| `--border` | `240 6% 88%` | Dividers, card borders |
| `--accent` | `192 90% 50%` (cyan) | AI-generated content highlight, badges |
| `--success` | `142 71% 38%` | Correct answers, verified badges |
| `--warning` | `38 92% 50%` | Token-limit warnings, pending moderation |
| `--destructive` | `0 72% 51%` | Errors, rejected content, delete actions |

## 4. Color Tokens — Dark Mode
| Token | Value (HSL) | Usage |
|---|---|---|
| `--background` | `240 10% 8%` | Page background |
| `--foreground` | `0 0% 95%` | Primary text |
| `--primary` | `255 85% 68%` | Same role as light, brightened for contrast |
| `--secondary` | `240 5% 20%` | Secondary buttons, chips |
| `--muted` | `240 5% 15%` | Card/section backgrounds |
| `--muted-foreground` | `240 4% 65%` | Secondary text |
| `--border` | `240 5% 22%` | Dividers, card borders |
| `--accent` | `192 85% 55%` | AI-generated content highlight, badges |
| `--success` / `--warning` / `--destructive` | `142 65% 45%` / `38 90% 55%` / `0 70% 58%` | Same roles, brightened for dark contrast |

## 5. Typography
| Role | Font | Size / Weight / Line-height |
|---|---|---|
| Display / H1 | Geist or Inter Display (bold) | 32-48px / 700 / 1.15 |
| H2-H4 | Inter | 20-28px / 600 / 1.25 |
| Body | Inter | 14-16px / 400-500 / 1.6 (generous — long reading sessions on notes/AI output) |
| Code | JetBrains Mono | 13-14px / 400 / 1.5 — Coding Hub code blocks |
| Caption / meta | Inter | 12-13px / 400 / 1.4, `--muted-foreground` |

## 6. Spacing & Layout Rules
- 4px base spacing scale (4/8/12/16/24/32/48/64/96) — no arbitrary values, on either platform.
- Radius: 0.5rem inputs/buttons, 0.75rem cards, 1rem modals, full pill for badges/tags.
- Elevation: flat + border-based by default; `shadow-md` reserved for modals/popovers/dropdowns only — keeps the dense dashboard calm.
- Web container: `max-w-7xl` centered; app shell uses a fixed sidebar (240-280px, collapsible) + fluid content.
- Mobile: bottom tab bar (5 items max), safe-area-aware, no sidebar pattern.

## 7. Dark/Light Mode Mechanism
- Web: Tailwind `darkMode: 'class'`, `uiSlice.theme` persisted via redux-persist + localStorage, inline pre-hydration script avoids flash-of-wrong-theme.
- Mobile: NativeWind's `useColorScheme` bridged to the same `uiSlice.theme`, persisted via redux-persist + AsyncStorage, defaults to system preference on first launch.
- Default: respects system preference on first visit; user override persists after that.

## 8. Component Styling Notes
| Component | Notes |
|---|---|
| `<AIResponseCard>` | `--accent`-tinted left border or background wash to visually distinguish AI-generated content from user/faculty content — this distinction matters for trust |
| `<TokenUsageIndicator>` | Pill in the topbar; green/`--muted-foreground` above 50% remaining, `--warning` under 20%, `--destructive` at 0 with a link to `/billing` |
| Cards (resource/quiz/job) | `--card` bg (mirrors `--background` on mobile), 1px `--border`, hover elevation on web only (no hover state on mobile — use press opacity instead) |
| Badges (contributor tiers) | Bronze/Silver/Gold/Platinum/Diamond — distinct icon + color per tier, not just a color swap, since these are a core engagement/status signal |
| Quiz question states | unanswered (`--border`), answered (`--primary` ring), locked/time-up (`--muted`), reviewed correct/incorrect (`--success`/`--destructive`) |

## 9. Imagery & Content Tone
- AI-generated visuals (mind maps, charts) should read as clearly AI-assisted but polished — not sterile, not gimmicky.
- Illustrations for empty states: friendly, minimal line-art style consistent with the calm/premium direction — avoid generic stock-illustration packs that clash with the Notion/Linear-inspired tone.

## 10. Accessibility
- Maintain WCAG AA contrast in both themes — verify `--muted-foreground` on `--background` and `--primary-foreground` on `--primary` specifically (violet-on-dark and violet-on-light both need checking).
- Every interactive element keyboard-navigable (web) with a visible focus ring; mobile touch targets minimum 44×44px.
- Alt text / accessibility labels required on every image and icon-only button, on both platforms.

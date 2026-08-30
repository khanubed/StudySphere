# StudySphere — Visual Design System & Design Thinking (v2: Academic OS Ledger)

## 1. Design Vision & Philosophy

Modern college students juggle 7–10 disjointed tools (Google Drive, WhatsApp groups, Notion, Chegg, LinkedIn, Resume builders, university portals). This creates continuous cognitive overhead and scattered academic records.

**StudySphere is built on the concept of the Academic OS Ledger:**
- **The Ledger Metaphor:** The entire platform reads as an active, verifiable academic ledger — clean hairline dividers, tabular monospace figures, chronological timestamps, and crisp checkmark stamp marks (`✓`).
- **High Information Density with Calm Restraint:** Eliminates noisy SaaS gradients, oversized cartoon illustrations, and decorative bloat. Surfaces are flat, structured, and intentional.
- **Three Clear Typographic Registers:**
  1. **Editorial Display (Fraunces):** High-character serif used selectively for hero and major milestone headlines.
  2. **Product UI & Operations (Geist):** Clean, crisp, high-legibility geometric sans for dashboards, headers, forms, and navigation.
  3. **Long-Form Reading (Inter):** Generous, comfortable body typesetting for study notes, flashcards, AI summaries, and explanations.
  4. **Data & Code (Geist Mono & IBM Plex Mono):** Monospace precision for live telemetry tickers, token counts, timestamps, step sequences, and syntax highlighting.

---

## 2. Shared Token Architecture

All design tokens are synchronized across web (Tailwind CSS) and mobile (NativeWind / React Native) via `@studysphere/ui-tokens` and shared CSS variables.

### Color Tokens — Light Mode (Paper Base)

`--ink` and `--paper` are **role tokens** that invert between light and dark modes rather than being hardcoded per surface.

| Token | CSS Variable | RGB Value | Hex Code | Semantic Role & Usage Guidelines |
|---|---|---|---|---|
| **Paper** | `--paper` / `--background` / `--card` | `243 244 239` | `#F3F4EF` | Default surface background. Cool, slightly grey-green off-white paper tone. |
| **Ink** | `--ink` / `--foreground` | `18 21 28` | `#12151C` | Primary text and dark brand accents. Near-black with subtle cool slate undertone. |
| **Quad** | `--quad` / `--primary` / `--success` | `47 93 80` | `#2F5D50` | Primary action CTA, active navigation indicators, verified stamp marks (`✓`), and correct quiz states. Deep academic green. |
| **Marker** | `--marker` / `--accent` / `--warning` | `242 193 78` | `#F2C14E` | Highlighter yellow for annotations (`.marker-highlight`), warning badges, and token alerts. Never used as body text. |
| **Chalk** | `--chalk` | `91 127 222` | `#5B7FDE` | **Reserved exclusively for AI-generated features** (AI Notes Summarizer, Quiz Generator, Resume Analyzer step chains, AI badges). |
| **Graphite** | `--graphite` / `--muted-foreground` | `138 141 133` | `#8A8D85` | Secondary text, timestamps, step counters (`01`, `02`), metadata labels, table captions. |
| **Secondary** | `--secondary` / `--muted` | `220 222 214` | `#DCDED6` | Subdued pill buttons, card hover backgrounds, subtle table headers. |
| **Border** | `--border` / `--input` | `200 203 194` | `#C8CBC2` | Hairline border rules (1px), input container borders, grid lines. |
| **Destructive** | `--destructive` | `185 28 28` | `#B91C1C` | Errors, negative quiz feedback, destructive delete dialogs. |

---

### Color Tokens — Dark Mode (Ink Base)

In Dark Mode, the canvas transforms into an ink-black academic slate.

| Token | CSS Variable | RGB Value | Hex Code | Semantic Role & Adaptation in Dark Mode |
|---|---|---|---|---|
| **Paper** | `--paper` / `--background` | `18 21 28` | `#12151C` | Dark page canvas. |
| **Card / Popover** | `--card` / `--popover` | `28 31 38` | `#1C1F26` | Elevated dark surfaces, modals, popovers, ledger containers. |
| **Ink** | `--ink` / `--foreground` | `243 244 239` | `#F3F4EF` | High-contrast off-white foreground text. |
| **Quad** | `--quad` / `--primary` / `--success` | `76 160 138` | `#4CA08A` | Brightened emerald sage for legibility on dark slate. |
| **Marker** | `--marker` / `--accent` / `--warning` | `242 193 78` | `#F2C14E` | Highlighter yellow (remains vibrant on dark background). |
| **Chalk** | `--chalk` | `130 160 240` | `#82A0F0` | Brightened periwinkle blue for AI feature badges and step flows. |
| **Graphite** | `--graphite` / `--muted-foreground` | `160 162 155` | `#A0A29B` | Muted graphite grey for secondary info and captions. |
| **Secondary** | `--secondary` / `--muted` | `35 38 44` | `#23262C` | Muted dark secondary buttons and chips. |
| **Border** | `--border` / `--input` | `55 58 53` | `#373A35` | Subtle dark hairline borders. |
| **Destructive** | `--destructive` | `239 68 68` | `#EF4444` | High-visibility warning/error red. |

---

## 3. Typography System & Rules

| Role | Font Family | Class Name | Weight & Tracking | Primary Use Cases |
|---|---|---|---|---|
| **Display** | Fraunces, Georgia, serif | `font-display` | 700 / 800, `-0.02em` tracking | Marketing hero, major section headlines (`H1`, `H2`), key testimonial quote marks. |
| **Product UI** | Geist, sans-serif | `font-sans` | 500 / 600, normal tracking | In-app headers, sidebars, navigation bars, buttons, tab menus, form labels. |
| **Body** | Inter, sans-serif | `font-body` | 400 / 500, `1.6` line-height | Long-form study notes, course descriptions, AI output paragraphs, marketing subtext. |
| **Data / Telemetry** | Geist Mono, monospace | `font-mono` | 400 / 600, `+0.05em` tracking | Ticker metrics, stats, step numbers, timestamps, ledger headers, verified tags. |
| **Code** | IBM Plex Mono, monospace | `font-code` | 400 / 500 | Syntax highlighting in Coding Hub and programming problem sets. |

---

## 4. Spacing, Borders & Elevation

1. **4px Grid System:** `4px` (`spacing.1`), `8px` (`spacing.2`), `12px` (`spacing.3`), `16px` (`spacing.4`), `24px` (`spacing.6`), `32px` (`spacing.8`), `48px` (`spacing.12`), `64px` (`spacing.16`).
2. **Hairline Border Rules:** Surfaces use 1px solid borders (`border-border/60` to `border-border`) rather than heavy dropshadows.
3. **Border Radius:**
   - Base buttons / inputs / standard cards: `rounded-[6px]` or `0.5rem` (`rounded-md`).
   - Outer container / ledger panels: `rounded-[8px]`.
   - Modals / floating dialogs: `rounded-[16px]` (`1rem`).
   - Badges / chips: Full pill (`rounded-full`) or stamp box (`rounded-[2px]`).
4. **Elevation:**
   - Flat by default (`shadow-none`).
   - Subtle interactive lift: `shadow-sm` on hover.
   - Popovers/modals: `shadow-md` or `shadow-lg` with subtle backdrop blur (`backdrop-blur-md`).

---

## 5. Signature Component Patterns (from Landing Page)

1. **Academic Live Ledger (`Hero` & telemetry):**
   - Monospace uppercase label + verified checkmark (`✓`) + animated count-up numerical values.
   - Ticking state updates simulating continuous background sync.
2. **AI Semantic Step Chains (`AIFeatures`):**
   - Distinctive Chalk Blue badge capsules (`.chalk-step` / `border-chalk/40 bg-chalk/5 text-chalk`) linked by animated arrow dividers.
3. **Highlighter Annotations (`.marker-highlight`):**
   - Soft yellow bottom-wash highlight for key phrases in descriptions.
4. **Stamp Mark Indicator (`.stamp-mark`):**
   - Compact `w-5 h-5` square box with Quad green border and `✓` symbol.
5. **Background Grid Gridlines (`.ledger-grid-bg` / `bg-ledger-grid`):**
   - Monospaced 32px or 24px subtle grid lines for hero/CTA backdrops.

---

## 6. Accessibility & Motion Guidelines

- **Contrast Ratios:** All text combinations exceed WCAG AA 4.5:1. Marker yellow is strictly a highlight/background fill, never body text.
- **Reduced Motion:** When `prefers-reduced-motion: reduce` is active, CSS and Framer Motion gracefully scale durations to instant (`0.01ms`), avoiding layout shifts while preserving final render states.
- **Focus Rings:** Visible keyboard navigation focus rings (`focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`).
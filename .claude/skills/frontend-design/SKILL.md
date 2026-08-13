# Design System Reference

Extracted from a Next.js 16 + React 19 + Tailwind CSS v4 personal portfolio site (`stefanphan.com`). Uses shadcn/ui ("new-york" style, "neutral" base color) as its component primitive layer, with CSS variables driving theming. This document contains **real values** pulled directly from the codebase — use it to recreate the same look and feel in a new project.

---

## 0. Stack & Setup

- **Framework:** Next.js (App Router) + React 19
- **Styling:** Tailwind CSS v4 (CSS-first config — no `tailwind.config.js`; theme is declared inline in CSS via `@theme`)
- **Component layer:** shadcn/ui, style `new-york`, base color `neutral`, CSS variables enabled
- **Utility libs:** `class-variance-authority` (cva) for variant-based components, `clsx` + `tailwind-merge` via a `cn()` helper, `tw-animate-css` for extra animation utilities
- **Icons:** `lucide-react`
- **Fonts:** `Inter` via `next/font/google`, plus a Geist Mono variable for monospace contexts
- **Motion:** `framer-motion` for JS-driven animation, plain CSS `@keyframes` for simple looped/one-shot effects

```json
// components.json (shadcn config)
{
  "style": "new-york",
  "tailwind": { "baseColor": "neutral", "cssVariables": true, "prefix": "" },
  "iconLibrary": "lucide"
}
```

```js
// postcss.config.mjs
export default {
  plugins: { "@tailwindcss/postcss": {} },
};
```

```css
/* top of globals.css */
@import "tailwindcss";
@import "tw-animate-css";
@custom-variant dark (&:is(.dark *));
```

Dark mode is class-based (`.dark` on `<html>`), not `prefers-color-scheme` media-query-based — this lets a manual toggle override the OS setting. The site actually **defaults to dark mode** (`<html className="dark">` in the root layout) rather than defaulting to light.

```ts
// lib/utils.ts — the cn() helper used everywhere for conditional classes
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

---

## 1. Color Palette

All colors are defined as CSS custom properties on `:root` (light mode) and `.dark` (dark mode), then re-exposed as Tailwind theme tokens via an inline `@theme` block so they're usable as `bg-primary`, `text-muted-foreground`, etc.

### 1.1 Core semantic tokens

| Token                  | Light     | Dark                     | Used for                                                                                                  |
| ---------------------- | --------- | ------------------------ | --------------------------------------------------------------------------------------------------------- |
| `background`           | `#fafafa` | `#0a0a0b`                | Page background                                                                                           |
| `foreground`           | `#0a0a0b` | `#fafafa`                | Primary body text                                                                                         |
| `card`                 | `#ffffff` | `#18181b`                | Card/panel surfaces                                                                                       |
| `card-foreground`      | `#0a0a0b` | `#fafafa`                | Text on cards                                                                                             |
| `popover`              | `#ffffff` | `#18181b`                | Popover/dropdown surfaces                                                                                 |
| `popover-foreground`   | `#0a0a0b` | `#fafafa`                | Text on popovers                                                                                          |
| `primary`              | `#0a0a0b` | `#fafafa`                | Primary buttons, high-emphasis elements (inverts between modes — near-black on light, near-white on dark) |
| `primary-foreground`   | `#fafafa` | `#0a0a0b`                | Text/icons on primary-colored surfaces                                                                    |
| `secondary`            | `#f4f4f5` | `#27272a`                | Secondary buttons, subtle fills                                                                           |
| `secondary-foreground` | `#0a0a0b` | `#fafafa`                | Text on secondary surfaces                                                                                |
| `muted`                | `#f4f4f5` | `#27272a`                | Muted backgrounds (skeleton loaders, subtle panels)                                                       |
| `muted-foreground`     | `#71717a` | `#a1a1aa`                | Secondary/de-emphasized text, timestamps, labels                                                          |
| `accent`               | `#f4f4f5` | `#27272a`                | Hover backgrounds on interactive elements                                                                 |
| `accent-foreground`    | `#0a0a0b` | `#fafafa`                | Text on accent-colored surfaces                                                                           |
| `destructive`          | `#ef4444` | `#dc2626`                | Errors, destructive actions                                                                               |
| `border`               | `#e4e4e7` | `rgba(255,255,255,0.1)`  | Dividers, card/input borders                                                                              |
| `input`                | `#e4e4e7` | `rgba(255,255,255,0.15)` | Input borders                                                                                             |
| `ring`                 | `#a1a1aa` | `#52525b`                | Focus rings                                                                                               |

Note the dark-mode border/input tokens use **translucent white** (`rgba(255,255,255,0.1)`) rather than a flat hex — this keeps borders looking correct over any background color/gradient rather than a fixed gray that could look muddy.

### 1.2 Brand accent colors (gradient/decoration only — not semantic UI colors)

| Token      | Light              | Dark                       | Used for                                                |
| ---------- | ------------------ | -------------------------- | ------------------------------------------------------- |
| `accent-1` | `#6366f1` (indigo) | `#818cf8` (lighter indigo) | Background gradient blobs, text `::selection` highlight |
| `accent-2` | `#8b5cf6` (violet) | `#a78bfa` (lighter violet) | Background gradient blobs                               |
| `accent-3` | `#ec4899` (pink)   | `#f472b6` (lighter pink)   | Background gradient blobs                               |

These three form a purple→pink hue sweep and are the **only saturated colors** in an otherwise neutral (black/white/gray) palette. Dark-mode variants are simply lightened/desaturated versions of the light-mode hue for visibility against dark backgrounds.

### 1.3 Chart / data-viz colors

| Token     | Light               | Dark      |
| --------- | ------------------- | --------- |
| `chart-1` | `#6366f1`           | `#818cf8` |
| `chart-2` | `#8b5cf6`           | `#a78bfa` |
| `chart-3` | `#ec4899`           | `#f472b6` |
| `chart-4` | `#f59e0b` (amber)   | `#fbbf24` |
| `chart-5` | `#10b981` (emerald) | `#34d399` |

(chart-1/2/3 mirror accent-1/2/3; chart-4 and chart-5 add amber/green for a 5-color categorical qualitative palette.)

### 1.4 Sidebar tokens (present for shadcn compatibility, not heavily used in this project but included for completeness)

```css
--sidebar: #fafafa; /* dark: #18181b */
--sidebar-foreground: #0a0a0b; /* dark: #fafafa */
--sidebar-primary: #0a0a0b; /* dark: #818cf8 */
--sidebar-primary-foreground: #fafafa;
--sidebar-accent: #f4f4f5; /* dark: #27272a */
--sidebar-accent-foreground: #0a0a0b; /* dark: #fafafa */
--sidebar-border: #e4e4e7; /* dark: rgba(255,255,255,0.1) */
--sidebar-ring: #a1a1aa; /* dark: #52525b */
```

### 1.5 One-off literal colors (used outside the token system, in specific components)

These appear as raw hex in component code rather than as CSS variables — mostly to mimic macOS window chrome:

| Color                   | Hex                   | Used for                                 |
| ----------------------- | --------------------- | ---------------------------------------- |
| Traffic-light red       | `#ff5f57`             | Terminal/intro-screen window "close" dot |
| Traffic-light yellow    | `#febc2e` / `#ffbd2e` | Window "minimize" dot                    |
| Traffic-light green     | `#28c840`             | Window "maximize" dot                    |
| Window titlebar (light) | `#e0e0e0`             | Terminal titlebar background, light mode |
| Window titlebar (dark)  | `#2a2a2c`             | Terminal titlebar background, dark mode  |
| Terminal body (dark)    | `#1a1a1d`             | Terminal content background, dark mode   |

Terminal syntax-highlight accents (used only inside the boot/intro animation, not part of the general UI palette):

- Dark mode: blue `text-blue-400`, yellow `text-yellow-300`, green `text-green-400`, zinc `text-zinc-300/500`
- Light mode: blue `text-blue-600`, amber `text-amber-600`, green `text-green-700`, zinc `text-zinc-400/600`

### 1.6 Full CSS variable block (copy-paste ready)

```css
:root {
  --radius: 0.625rem;
  --background: #fafafa;
  --foreground: #0a0a0b;
  --card: #ffffff;
  --card-foreground: #0a0a0b;
  --popover: #ffffff;
  --popover-foreground: #0a0a0b;
  --primary: #0a0a0b;
  --primary-foreground: #fafafa;
  --secondary: #f4f4f5;
  --secondary-foreground: #0a0a0b;
  --muted: #f4f4f5;
  --muted-foreground: #71717a;
  --accent: #f4f4f5;
  --accent-foreground: #0a0a0b;
  --destructive: #ef4444;
  --border: #e4e4e7;
  --input: #e4e4e7;
  --ring: #a1a1aa;
  --accent-1: #6366f1;
  --accent-2: #8b5cf6;
  --accent-3: #ec4899;
  --chart-1: #6366f1;
  --chart-2: #8b5cf6;
  --chart-3: #ec4899;
  --chart-4: #f59e0b;
  --chart-5: #10b981;
  --sidebar: #fafafa;
  --sidebar-foreground: #0a0a0b;
  --sidebar-primary: #0a0a0b;
  --sidebar-primary-foreground: #fafafa;
  --sidebar-accent: #f4f4f5;
  --sidebar-accent-foreground: #0a0a0b;
  --sidebar-border: #e4e4e7;
  --sidebar-ring: #a1a1aa;
}

.dark {
  --background: #0a0a0b;
  --foreground: #fafafa;
  --card: #18181b;
  --card-foreground: #fafafa;
  --popover: #18181b;
  --popover-foreground: #fafafa;
  --primary: #fafafa;
  --primary-foreground: #0a0a0b;
  --secondary: #27272a;
  --secondary-foreground: #fafafa;
  --muted: #27272a;
  --muted-foreground: #a1a1aa;
  --accent: #27272a;
  --accent-foreground: #fafafa;
  --destructive: #dc2626;
  --border: rgba(255, 255, 255, 0.1);
  --input: rgba(255, 255, 255, 0.15);
  --ring: #52525b;
  --accent-1: #818cf8;
  --accent-2: #a78bfa;
  --accent-3: #f472b6;
  --chart-1: #818cf8;
  --chart-2: #a78bfa;
  --chart-3: #f472b6;
  --chart-4: #fbbf24;
  --chart-5: #34d399;
  --sidebar: #18181b;
  --sidebar-foreground: #fafafa;
  --sidebar-primary: #818cf8;
  --sidebar-primary-foreground: #fafafa;
  --sidebar-accent: #27272a;
  --sidebar-accent-foreground: #fafafa;
  --sidebar-border: rgba(255, 255, 255, 0.1);
  --sidebar-ring: #52525b;
}

/* Tailwind v4 theme mapping — makes the vars usable as bg-primary, text-muted-foreground, etc. */
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-accent-1: var(--accent-1);
  --color-accent-2: var(--accent-2);
  --color-accent-3: var(--accent-3);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
  --font-sans: "Inter", system-ui, sans-serif;
  --font-serif: "Inter", system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), monospace;
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);
  --radius-3xl: calc(var(--radius) + 12px);
  --radius-4xl: calc(var(--radius) + 16px);
}
```

### 1.7 Selection & scrollbar

```css
::selection {
  background-color: var(--accent-1);
  color: white;
}

::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: var(--background);
}
::-webkit-scrollbar-thumb {
  background: var(--muted-foreground);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--foreground);
}

html {
  scrollbar-width: thin;
  scrollbar-color: var(--muted-foreground) var(--background);
}
```

---

## 2. Typography

### 2.1 Font families

- **Body & headings:** Inter (loaded via `next/font/google`, weights `200` `300` `700` explicitly loaded; `font-medium`/`font-semibold` etc. still work via Tailwind's synthetic weight mapping since Inter is a variable-ish font family). Applied globally: `<body className={inter.className}>`.
- **Monospace:** Geist Mono (`var(--font-geist-mono)`) for terminal UI, timestamps, numeric/tabular data, fine print.
- Headings explicitly inherit body font (`font-family: inherit`) rather than using a separate display face — there is **no distinct heading font**, weight/size alone create hierarchy.

```ts
// Font loading
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"], weight: ["200", "300", "700"] });
```

```css
@theme inline {
  --font-sans: "Inter", system-ui, sans-serif;
  --font-serif: "Inter", system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), monospace;
}
```

### 2.2 Type scale (actual sizes observed in use, smallest to largest)

| Class                         | Size    | Where used                                                                         |
| ----------------------------- | ------- | ---------------------------------------------------------------------------------- |
| `text-[8px]`                  | 8px     | Terminal window close-icon glyph                                                   |
| `text-[9px]`                  | 9px     | Micro badges/labels                                                                |
| `text-xs`                     | 12px    | Labels, timestamps, badges, fine print, footer copyright                           |
| `text-[10px]` / `text-[11px]` | 10–11px | Mono "local time" readouts, pagination counters (deliberately tiny + wide-tracked) |
| `text-sm`                     | 14px    | Body copy, nav links, buttons                                                      |
| `text-base`                   | 16px    | Default paragraph text in larger contexts (intro screen code)                      |
| `text-lg`                     | 18px    | Section headings (`h2`)                                                            |
| `text-xl`                     | 20px    | Occasional emphasis text                                                           |
| `text-2xl`                    | 24px    | Page name / `h1` (mobile)                                                          |
| `text-3xl`                    | 30px    | Page name / `h1` (`sm:` breakpoint up), 404 heading                                |

There's no strict geometric ratio — it's Tailwind's default type scale used selectively, biased toward **small, restrained text** (a lot of `text-xs`/`text-sm`) with one or two jumps to `text-2xl`/`text-3xl` for the name/heading. This keeps the overall page feeling quiet and content-dense rather than "marketing site" bold.

### 2.3 Font weights in use

| Weight           | Class             | Usage                                                                           |
| ---------------- | ----------------- | ------------------------------------------------------------------------------- |
| 200 (extralight) | `font-extralight` | Rare decorative use                                                             |
| 300 (light)      | `font-light`      | Rare decorative use                                                             |
| 400 (normal)     | `font-normal`     | Default body text (implicit)                                                    |
| 500 (medium)     | `font-medium`     | **Most common weight for emphasis** — headings, nav links, button labels, names |
| 600 (semibold)   | `font-semibold`   | Rare, extra emphasis                                                            |
| 700 (bold)       | `font-bold`       | Rare, strong emphasis                                                           |

Practical rule: body text is regular weight, anything that needs to stand out (headings, labels, links to important content) jumps straight to `font-medium` — the design skips semibold/bold almost entirely for a subtle hierarchy.

### 2.4 Letter spacing & line height

- Tight tracking on headings: `tracking-tight` (page title)
- Wide tracking on small mono/uppercase labels: `tracking-wider`, `tracking-widest`, and explicit `tracking-[0.18em]` for pagination controls
- Body copy: `leading-relaxed` for paragraph text; `leading-snug` for tight captions
- `tabular-nums` used wherever numbers change (pagination counts, live age counter) so digits don't cause layout shift

Common combo for small labels: `text-xs font-medium uppercase tracking-wider text-muted-foreground` (e.g. date labels above timeline entries).

---

## 3. Spacing & Layout

### 3.1 Spacing scale

Standard Tailwind v4 default scale (4px base unit: `1 = 0.25rem = 4px`). No custom spacing scale is defined — the project relies entirely on Tailwind defaults. Values actually seen in the codebase:

- Tight: `gap-1`, `gap-1.5`, `gap-2` (icon-to-text gaps, compact rows)
- Medium: `gap-3`, `gap-4`, `gap-5`, `gap-6` (section internals, nav item spacing)
- Section rhythm: `space-y-16` between major page sections, `space-y-8` between sub-groups, `space-y-4` / `space-y-3` between list items, `space-y-2` between tightly related rows
- Padding: `p-2`, `p-3` (card hover-padding), `px-4`/`px-6` (page padding), `py-16 sm:py-24` (vertical page padding)

### 3.2 Container / page shell

Every top-level page uses the **exact same shell**:

```tsx
<div className="min-h-screen">
  <main className="max-w-2xl mx-auto px-6 py-16 sm:py-24">
    <div className="space-y-16">{/* sections */}</div>
  </main>
</div>
```

- **Max width: `max-w-2xl` (42rem / 672px)** — deliberately narrow, single-column, reading-width layout (this is a personal-site/blog-like layout, not a dashboard).
- Horizontal page padding: `px-6` (24px) at all sizes.
- Vertical page padding: `py-16` (64px) mobile, `py-24` (96px) at `sm:` (640px) and up.
- Sections within the page are separated by `space-y-16` (64px).

### 3.3 Content indentation pattern

A distinctive recurring pattern: section headings sit at the left margin, but their content is indented under them using `pl-6 sm:pl-7` (24px → 28px), visually "hanging" the content off a small `&#9670;` (diamond ◆) glyph placed before each heading and a `&#8627;` (return arrow ↳) glyph before each content line. This is used consistently across Header, ExperienceSection, ProjectsSection, ContactSection, StatusSection, and the 404 page.

### 3.4 Grid / flex patterns

- Photo grid: `grid grid-cols-2 gap-3` (simple 2-column responsive grid, no explicit breakpoint changes — stays 2-col at all sizes)
- Header row: `flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4` (stacks on mobile, row on `sm:`+)
- Icon+text rows: `flex items-center gap-2` (or `gap-1`/`gap-1.5` for tighter variants)
- Timeline/vertical list: `relative ml-3 border-l border-border/60` with each entry `pl-8 sm:pl-10` — a left-rule "spine" with dot markers positioned via `absolute left-0 top-1.5 -translate-x-1/2`

### 3.5 Breakpoints

Tailwind v4 defaults (no custom breakpoints defined in this project):

| Prefix | Min-width |
| ------ | --------- |
| `sm`   | 640px     |
| `md`   | 768px     |
| `lg`   | 1024px    |
| `xl`   | 1280px    |
| `2xl`  | 1536px    |

In practice this project is almost entirely a **mobile vs. `sm:`** binary — very little use of `md:`/`lg:`/`xl:`, since the content column is capped at `max-w-2xl` anyway and doesn't need further breakpoints.

---

## 4. Component Patterns

### 4.1 Buttons (shadcn `Button`, via `class-variance-authority`)

```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);
```

Key conventions: buttons always use `rounded-md`, hover states are simple opacity dips on the same hue (`bg-primary/90`, `bg-secondary/80`) rather than color changes, focus states use a 3px ring at 50% opacity (`focus-visible:ring-ring/50 focus-visible:ring-[3px]`), and disabled state is `opacity-50` + `pointer-events-none`.

### 4.2 Text links (the site's actual primary "interactive element" — used far more than buttons)

This project favors **underlined inline links** over button chrome for most interactions (nav, external links, contact info):

```css
.underline-link {
  position: relative;
  display: inline;
  text-decoration: none;
  transition: transform 450ms ease;
}
.underline-link::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -2px;
  height: 1px;
  width: 100%;
  background-color: currentColor;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 400ms ease;
}
.underline-link:hover {
  transform: translateY(-2px);
}
.underline-link:hover::after {
  transform: scaleX(1);
}
```

On hover: the link nudges up 2px AND an underline wipes in left-to-right (`scaleX(0)` → `scaleX(1)`), rather than a plain color change. External links append a small `lucide-react` `ExternalLink` icon (`w-3.5 h-3.5 ml-1 -mt-0.5`, i.e. ~14px, nudged up to align with text baseline).

```tsx
<a
  className="underline-link interactive"
  href={href}
  target="_blank"
  rel="noopener noreferrer"
>
  {children}
  <ExternalLink className="inline-block w-3.5 h-3.5 ml-1 -mt-0.5" />
</a>
```

### 4.3 Cards / hoverable rows

There's no boxed "card" component with a persistent border in the main content — instead, list rows (projects, experience, contacts, timeline/status entries) share one hover-reveal pattern: **flat by default, elevated on hover.**

```tsx
<div className="text-muted-foreground rounded-xl p-3 -mx-3 transition-all duration-300 hover:shadow-depth hover-lift hover:bg-black/3 dark:hover:bg-white/3">
  {/* row content */}
</div>
```

- `p-3 -mx-3` — padding pushes the hit-area out, negative margin pulls it back so the row doesn't visually shift the surrounding text.
- `rounded-xl` (12px radius, i.e. `--radius + 4px`).
- `hover:bg-black/3 dark:hover:bg-white/3` — an extremely subtle 3% tint, not a solid fill.
- `hover-lift` (custom utility) translates the row up 2px on hover, only on hover-capable devices:

```css
@media (hover: hover) {
  .hover-lift:hover {
    transform: translateY(-2px);
  }
}
```

- `shadow-depth` (custom utility) is the elevation shadow applied on hover — see §5.2.

Photo cards (`ProfileSection`) instead use a real bounded surface: `rounded-xl overflow-hidden`, wrapped in a `TiltCard` (mouse-driven 3D tilt via inline `transform: perspective(500px) rotateY() rotateX() scale(1.04)`, `transition: transform 0.3s ease`), with a gradient scrim (`bg-linear-to-t from-black/60 to-transparent`) revealing a caption on hover.

### 4.4 Inputs

The only real text input in the app is the terminal command line, styled minimally (no border/box — it's meant to look like a real terminal prompt):

```tsx
<input
  className="flex-1 bg-transparent outline-none text-inherit text-sm font-mono caret-current ml-1 min-w-0"
  autoComplete="off"
  autoCorrect="off"
  autoCapitalize="off"
  spellCheck={false}
/>
```

For a more conventional form input elsewhere in a shadcn-based project, the established convention (from the button/card tokens) would be: `border border-input bg-background rounded-md px-3 py-2 text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]`.

### 4.5 Navigation

Simple horizontal inline nav, no dropdowns/mega-menus — a flat list of `UnderlineLink`s conditionally hiding the current page's own link:

```tsx
<nav className="flex items-center gap-4 text-sm">
  {pathname !== "/" && <UnderlineLink href="/">Home</UnderlineLink>}
  {pathname !== "/profile" && (
    <UnderlineLink href="/profile">Profile</UnderlineLink>
  )}
  {pathname !== "/status" && (
    <UnderlineLink href="/status">Status</UnderlineLink>
  )}
  <UnderlineLink href="/resume/…pdf" external showIcon={false}>
    Resume
  </UnderlineLink>
</nav>
```

Header layout: name/title (`h1`) on the left, nav + theme toggle on the right, stacking vertically below `sm:`:

```tsx
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
```

### 4.6 Theme toggle

Icon-only circular button, swaps `lucide-react` `Sun`/`Moon` icons:

```tsx
<button
  className="p-2 rounded-full transition-colors hover:bg-muted interactive"
  aria-label="Switch to … mode"
>
  {theme === "dark" ? (
    <Sun className="w-5 h-5" />
  ) : (
    <Moon className="w-5 h-5" />
  )}
</button>
```

Theme switching adds a temporary global class (`theme-transitioning`) that forces a 300ms color-transition on every element for a smooth crossfade rather than an instant flash:

```css
html.theme-transitioning,
html.theme-transitioning * {
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease,
    color 0.3s ease !important;
}
```

### 4.7 "Window chrome" modal/overlay pattern

Reused for both the terminal easter-egg and the boot/intro screen — mimics a macOS app window:

```tsx
<div className="w-full max-w-3xl rounded-xl overflow-hidden shadow-2xl shadow-black/40 dark:shadow-black/60 border border-black/8 dark:border-white/8">
  {/* Titlebar */}
  <div className="flex items-center px-4 h-11 bg-[#e0e0e0] dark:bg-[#2a2a2c]">
    <div className="flex items-center gap-2">
      <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
      <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
      <span className="w-3 h-3 rounded-full bg-[#28c840]" />
    </div>
    <span className="flex-1 text-center text-black/40 dark:text-white/40 text-xs">
      window-title
    </span>
  </div>
  {/* Body */}
  <div className="bg-white dark:bg-[#1a1a1d] font-mono text-sm">…</div>
</div>
```

Full-screen overlays use `fixed inset-0` with a very high `z-100` and `bg-{color}` + `transition-opacity duration-500` for fade in/out.

### 4.8 Pagination controls

Mono, uppercase, wide-tracked, minimal — no buttons/boxes, just text with disabled-state fade:

```tsx
<p className="font-mono text-[11px] tracking-wider text-muted-foreground tabular-nums">
  {from}–{to} <span className="text-muted-foreground/50">of</span> {total}
</p>
<button className="font-mono text-[11px] tracking-[0.18em] uppercase text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30 disabled:pointer-events-none">
  Prev
</button>
```

### 4.9 Vertical timeline / status feed

Left "spine" rule with a dot marker per entry, entry content in a hoverable row (see §4.3):

```tsx
<div className="relative ml-3 border-l border-border/60">
  <div className="group relative pb-8 pl-8 sm:pl-10 last:pb-0">
    <span className="absolute left-0 top-1.5 -translate-x-1/2 size-2 rounded-full bg-muted-foreground/40 ring-4 ring-background transition-colors duration-300 group-hover:bg-foreground" />
    <div className="rounded-xl p-3 -mx-3 transition-all duration-300 hover:shadow-depth hover-lift hover:bg-black/3 dark:hover:bg-white/3">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">
        {date}
      </p>
      <p className="text-foreground leading-relaxed">{title}</p>
    </div>
  </div>
</div>
```

The dot's `ring-4 ring-background` punches a "hole" through the spine line so the dot reads as sitting on top of it regardless of background color.

---

## 5. Visual Details

### 5.1 Border radius

Radius is driven by one base variable with derived steps, giving a **consistent, slightly-rounded (not pill-shaped, not sharp)** feel throughout:

```css
--radius: 0.625rem; /* 10px, base */
--radius-sm: calc(var(--radius) - 4px); /* 6px */
--radius-md: calc(var(--radius) - 2px); /* 8px */
--radius-lg: var(--radius); /* 10px */
--radius-xl: calc(var(--radius) + 4px); /* 14px */
--radius-2xl: calc(var(--radius) + 8px); /* 18px */
--radius-3xl: calc(var(--radius) + 12px); /* 22px */
--radius-4xl: calc(var(--radius) + 16px); /* 26px */
```

Observed usage frequency: `rounded-full` (avatars/dots/circular buttons) and `rounded-xl` (12px in raw Tailwind terms / cards, hover rows, photo tiles, window chrome) dominate; `rounded-md` (6px, buttons/inputs per shadcn defaults) is next; `rounded-2xl` appears occasionally for slightly larger surfaces. Nothing is sharp-cornered (`rounded-none`) and nothing besides avatars/dots is fully pill-shaped — the aesthetic sits deliberately in the "soft, modern, not childish" middle range.

### 5.2 Shadows (custom elevation system)

Rather than Tailwind's default `shadow-md`/`shadow-lg` scale, the project defines one custom **layered elevation shadow** used consistently for "lifted" hover states:

```css
.shadow-depth {
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.04),
    0 4px 8px rgba(0, 0, 0, 0.04),
    0 8px 24px rgba(0, 0, 0, 0.06);
}
.dark .shadow-depth {
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.2),
    0 4px 8px rgba(0, 0, 0, 0.15),
    0 8px 24px rgba(0, 0, 0, 0.2);
}
```

This is a **3-layer shadow** (tight contact shadow + mid falloff + broad soft glow) — a common technique for a more realistic, physically-plausible elevation than a single `box-shadow` value. Dark mode uses higher opacity (0.15–0.2 vs 0.04–0.06) since shadows need to be darker/stronger to read against a dark background. Used almost exclusively as a `:hover` state (paired with `hover-lift`), not as a resting/default shadow — resting state is flat.

Heavier one-off shadows: `shadow-2xl shadow-black/40 dark:shadow-black/60` on modal/window-chrome overlays (terminal, intro screen).

### 5.3 Transitions & animation

- **Standard interactive transition duration: `300ms`**, `ease` timing — used for color transitions, background transitions, hover-lift, theme switching. This is by far the most common duration in the codebase.
- Secondary duration: `500ms` for larger state changes (image cross-fades, overlay fade in/out).
- Micro-underline animations use faster custom durations: `400ms`–`450ms` `ease`.
- Page transitions use a simple CSS keyframe fade:
  ```css
  @keyframes pageFadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  .page-transition {
    animation: pageFadeIn 0.3s ease forwards;
  }
  ```
- Scroll-reveal (IntersectionObserver-driven, not CSS-only): fade + 20px translateY over `0.6s ease`, staggered per item via inline `delay` in ms (commonly `i * 100`):
  ```tsx
  style={{
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? "translateY(0)" : "translateY(20px)",
    transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
  }}
  ```
- Staggered entrance classes for above-the-fold content (`fade-in-up-delay-1` through `-5`, 0.1s increments) combined with a base:
  ```css
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .fade-in-up {
    animation: fadeInUp 0.6s ease forwards;
    opacity: 0;
  }
  ```
- Ambient background blobs use a slow 20s organic loop:
  ```css
  @keyframes blob {
    0%,
    100% {
      transform: translate(0, 0) scale(1);
    }
    25% {
      transform: translate(20px, -30px) scale(1.1);
    }
    50% {
      transform: translate(-20px, 20px) scale(0.9);
    }
    75% {
      transform: translate(30px, 10px) scale(1.05);
    }
  }
  .animate-blob {
    animation: blob 20s infinite ease-in-out;
    will-change: transform;
  }
  ```
- **Every animation/transition is wrapped in a `prefers-reduced-motion: reduce` override** that disables or shortcuts it (e.g. `animation: none; opacity: 1;`) — accessibility is treated as a first-class constraint, not an afterthought.
- Interactive cursor changes to a pointer/dot cursor on desktop, but is explicitly disabled on touch devices:
  ```css
  @media (hover: none) and (pointer: coarse) {
    body {
      cursor: auto;
    }
    .cursor-dot,
    .cursor-ring {
      display: none;
    }
  }
  ```

### 5.4 Iconography

- **Library: `lucide-react`** exclusively (outline/line-style icons, not filled).
- Standard inline icon size: **14px** (`w-3.5 h-3.5`) for icons embedded in text/links (e.g. `ExternalLink` after link text).
- Toggle/utility icon size: **20px** (`w-5 h-5`) for standalone icon buttons (Sun/Moon theme toggle).
- Icons are nudged with small negative margins to optically align with text baseline (`-mt-0.5`).
- Decorative typographic glyphs (not from the icon library) are used as structural markers: `◆` (`&#9670;`) prefixes every section heading, `↳` (`&#8627;`) prefixes every content/list-item line. These are literal Unicode characters styled with `text-muted-foreground`, not SVG icons — a distinctive, low-cost way to add visual rhythm without an icon library dependency.

---

## 6. Overall Aesthetic Summary

A **quiet, text-first, developer-personal-site aesthetic**: single-column reading-width layout (max 672px) on a near-black/near-white neutral base, with just three saturated accent hues (indigo → violet → pink) reserved entirely for soft ambient background gradient blobs and the text-selection color — never used for UI chrome itself. Typography leans small and restrained (mostly 12–14px body/label text, medium weight for emphasis, semibold/bold almost never used) with one deliberate jump to 24–30px for the page title. Structure is built from underlined inline text links and flat list rows rather than boxed buttons or bordered cards; rows only reveal a card-like surface (soft 3-layer shadow, 3%-opacity tint, 2px lift) on hover, keeping the resting state minimal and content-forward. Corners are consistently and moderately rounded (10–14px) — never sharp, never fully pill-shaped except for true circles (avatars, status dots, icon buttons). Motion is subtle and consistently fast (300ms standard, ease timing), used for hover feedback, theme-switch crossfades, and staggered scroll-reveal — never gratuitous, and always disabled under `prefers-reduced-motion`. A recurring macOS-window-chrome motif (traffic-light dots, titlebar) and monospace/terminal touches (Geist Mono, uppercase-tracked labels, a real interactive terminal easter egg) give the site a distinctly "written by an engineer, for engineers" personality without tipping into a busy or gimmicky UI.

---

## 7. Example Component Snippets

### 7.1 Page shell + section pattern (the core reusable layout unit)

```tsx
export default function Page() {
  return (
    <div className="min-h-screen">
      <main className="max-w-2xl mx-auto px-6 py-16 sm:py-24">
        <div className="space-y-16">
          <section>
            <h2 className="text-lg font-medium mb-4">
              <span className="text-muted-foreground mr-2" aria-hidden="true">
                &#9670;
              </span>
              Section Title
            </h2>
            <div className="space-y-4 pl-6 sm:pl-7">
              <div className="text-muted-foreground rounded-xl p-3 -mx-3 transition-all duration-300 hover:shadow-depth hover-lift hover:bg-black/3 dark:hover:bg-white/3">
                <span className="mr-2" aria-hidden="true">
                  &#8627;
                </span>
                <span className="text-foreground font-medium">Item title</span>
                <span className="mx-2">—</span>
                <span>Item description text.</span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
```

### 7.2 Underline link + button, side by side (showing the two link-styling tiers)

```tsx
import { ExternalLink } from "lucide-react";

// Primary interactive style: underlined inline link (used for ~90% of interactions)
<a
  href="https://example.com"
  target="_blank"
  rel="noopener noreferrer"
  className="underline-link text-foreground"
>
  View project
  <ExternalLink className="inline-block w-3.5 h-3.5 ml-1 -mt-0.5" />
</a>

// Boxed button style (used sparingly, for standalone CTAs)
<button className="inline-flex items-center justify-center gap-2 h-9 px-4 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-all focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none">
  Enter Space
</button>
```

### 7.3 Card-style CSS to drop into a fresh project's globals.css

```css
@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}
:root {
  --radius: 0.625rem;
}

.shadow-depth {
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.04),
    0 4px 8px rgba(0, 0, 0, 0.04),
    0 8px 24px rgba(0, 0, 0, 0.06);
}
.dark .shadow-depth {
  box-shadow:
    0 1px 2px rgba(0, 0, 0, 0.2),
    0 4px 8px rgba(0, 0, 0, 0.15),
    0 8px 24px rgba(0, 0, 0, 0.2);
}
@media (hover: hover) {
  .hover-lift:hover {
    transform: translateY(-2px);
  }
}
```

```tsx
<div className="rounded-xl p-3 -mx-3 transition-all duration-300 hover:shadow-depth hover-lift hover:bg-black/3 dark:hover:bg-white/3">
  Card content
</div>
```

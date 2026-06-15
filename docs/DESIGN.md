# Atur — Design Source of Truth

This document is the **single source of truth** for design and frontend
engineering in this project. It adapts the "High-Agency Frontend" (taste) skill
to Atur. When code and this document disagree, this document wins — fix the code.

## Active baseline

| Dial | Value | Meaning |
| --- | --- | --- |
| DESIGN_VARIANCE | 8 | Asymmetric, intentional white-space, avoid dead-center symmetry |
| MOTION_INTENSITY | 6 | Fluid CSS transitions; `transform`/`opacity` only |
| VISUAL_DENSITY | 4 | Daily-app spacing; cards only where elevation earns it |

## Stack conventions (locked)

- **Next.js App Router + React 19**, Server Components by default; isolate
  interactivity in `"use client"` leaf components.
- **Tailwind CSS v4** (`@tailwindcss/postcss`). Do not use v3 syntax.
- **shadcn/ui + Radix** for chrome — never in default state; radii/colors/shadows
  are customized in `app/globals.css`.
- **Icons:** `@radix-ui/react-icons` only. **No emojis anywhere** (code, markup,
  content, alt text). Standardize on the icon set's default weight.
- **Fonts:** `Sora` for UI (display + body), `Geist Mono` for code/numbers.
  `Inter` and serif UI fonts are banned.

## Color (one palette, one accent)

- Neutral base: **Zinc/Slate** via shadcn tokens. Never `#000000` — use the
  off-black tokens already in `globals.css`.
- **Single accent: Emerald** (saturation < 80%). The "AI purple/blue" aesthetic
  (indigo/violet/fuchsia glows, neon gradients) is **banned**. No purple, no
  multi-color gradients for emphasis.
- Use the accent sparingly: links, active states, one highlighted element.

## Layout & materiality

- Contain pages with `max-w-*` + `mx-auto`; collapse to single column under `md`.
- Full-height areas use `min-h-[100dvh]`, never `h-screen`.
- Prefer CSS Grid over flex percentage math.
- Cards only when elevation communicates hierarchy; otherwise group with
  borders/dividers and negative space.
- Animate only `transform`/`opacity`. Provide loading (skeleton), empty, and
  error states. Tactile `:active` feedback on interactive controls.

## Content quality (applies to section snippets too)

- **No generic names/brands:** no "John/Jane Doe", "Acme", "Nexus", "SmartFlow".
  Use believable, contextual names and brands.
- **No fake/round numbers** (`99.99%`, `50%`). Use organic values.
- **No filler copy:** "Elevate", "Seamless", "Unleash", "Next-Gen". Use concrete
  verbs.
- **No generic avatars:** use seeded placeholders, e.g.
  `https://picsum.photos/seed/<seed>/80/80`.
- **No emojis as icons:** inline SVG inside section markup instead.

## Section-library carve-out (deliberate)

Atur is a catalog of section **archetypes**. The taste bans on "3 equal cards"
and "centered hero" target bespoke pages that lean on clichés. Here those
archetypes are legitimate catalog entries (e.g. `Three-Tier Pricing`,
`Centered Hero`, `Feature Grid`), so they may exist **as named sections**.
Everything else in this document — color, emoji, names, numbers, avatars, fonts,
accessibility, responsiveness — **does** apply to section markup. New non-archetype
sections should prefer asymmetric/bento/zig-zag layouts per VARIANCE 8.

## Pre-flight checklist (run before committing UI)

- [ ] No emojis; icons are `@radix-ui/react-icons` or inline SVG.
- [ ] Single emerald accent; no indigo/violet/fuchsia/purple; no neon gradients.
- [ ] No `#000000`, no `Inter`, no `h-screen`.
- [ ] Mobile collapses to single column; `max-w` container present.
- [ ] Loading/empty/error states exist where data renders.
- [ ] Animations use `transform`/`opacity` only.
- [ ] No generic names/brands/numbers/avatars in copy or sections.

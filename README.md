# Atur — Web Section Library

A curated library of copy-paste web sections. Each section ships with a **live preview**, the **HTML + Tailwind code**, and a **"Copy prompt"** button that hands a ready-made instruction to your AI tool to recreate or customize it.

Built with **Next.js (App Router) + Tailwind CSS**, statically generated. No backend — content lives in the repo.

## How it works

- Each section is one file in [`content/sections/`](content/sections) (`*.mdx`): YAML frontmatter for metadata + the raw HTML/Tailwind markup as the body.
- Frontmatter is validated against a [Zod schema](lib/schema.ts) at build time — a missing or malformed field **fails the build** and names the file.
- The library page filters sections **client-side** by search query and category.
- Previews render inside a **sandboxed iframe** using the Tailwind Play CDN, so authored markup displays exactly as written without a build step.

## Add a section

Create `content/sections/<slug>.mdx`:

```mdx
---
title: My Section
slug: my-section
description: Optional one-liner.
category: Hero
tags: [hero, cta]
order: 1
copyPrompt: >-
  The AI instruction someone copies to recreate this section.
---

<section class="...">your HTML + Tailwind markup...</section>
```

Commit and redeploy. That's it.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static production build
npm run test     # unit tests (schema, loader, search)
```

## Project structure

| Path | Purpose |
| --- | --- |
| `content/sections/*.mdx` | The section catalog |
| `lib/schema.ts` | Frontmatter Zod schema + types |
| `lib/sections.ts` | Build-time loader (parse + validate) |
| `lib/search.ts` | Client-side filter logic |
| `components/PreviewFrame.tsx` | Sandboxed iframe preview |
| `components/CopyButton.tsx` | Clipboard copy with fallback |
| `app/page.tsx` | Library / browse page |
| `app/sections/[slug]/page.tsx` | Section detail page |

## Roadmap (out of scope for v1)

- CMS / admin UI (e.g. Payload) to edit without redeploying
- User-submitted sections
- React/JSX snippet variants

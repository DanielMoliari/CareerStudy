# Architecture

**Analysis Date:** 2026-05-07

## Pattern Overview

**Overall:** Client-Side Single-Page Application embedded in Next.js 14 App Router shell

**Key Characteristics:**
- All pages are `'use client'` components — no server-side rendering of page content
- All persistent state lives exclusively in `localStorage` (no backend, no API)
- Data layer is entirely static TypeScript objects compiled into the bundle
- Route-based code splitting via Next.js App Router, with `next/dynamic` for heavy visual/PDF components

## Layers

**Routing Layer:**
- Purpose: Maps URL paths to page components
- Location: `src/app/`
- Contains: One `page.tsx` per route, `layout.tsx`, `not-found.tsx`, `globals.css`
- Depends on: Components, data layer, hooks
- Used by: Browser navigation

**Component Layer:**
- Purpose: Shared, reusable UI primitives
- Location: `src/components/`
- Contains: `Nav.tsx` (top nav with live progress), `ProgressBar.tsx` (multi-segment bar), `QuizMode.tsx` (modal quiz engine), `index.ts` (catalog/documentation of generic components), `visuals/` (50+ reusable interactive visual components), `pdfs/` (16 reusable PDF section templates)
- Depends on: hooks, types
- Used by: All pages and skill-specific Visuais/Pdfs files

**Data Layer:**
- Purpose: Static skill definitions, content, and component registries
- Location: `src/data/`
- Contains: `skills.ts` (canonical skill list, categories, dependencies, icon map), `content/` (per-skill rich content), `skill-components.ts` (dynamic import registries), `tech-identity.ts` (per-tech color/personality config), `content/meta.ts` (auto-generated score index)
- Depends on: Nothing (pure data)
- Used by: All pages and components

**State/Hooks Layer:**
- Purpose: localStorage persistence, cross-component progress sharing
- Location: `src/hooks/`
- Contains: `useProgress.ts` — the only hook; manages read/write/events for progress state
- Depends on: types
- Used by: All pages, Nav component

**Types Layer:**
- Purpose: Shared TypeScript interfaces
- Location: `src/types/index.ts`
- Contains: `Skill`, `Category`, `ProgressState`, `SkillProgress`, `ProgressStore`, `SkillStats`, `SkillContent`, `InterviewQA`, `DiagramBlock`, `Mnemonic`, `Exercise`, `CodeExample`, `VideoRef`, `Resource`, `KeyPoint`
- Depends on: Nothing
- Used by: All other layers

## Data Flow

**Progress State Read/Write:**

```
User clicks chip (skills/page.tsx)
  → cycleState(slug) via useProgress
    → loadAll() from localStorage["careerstudy.progress.v1"]
    → mutate entry
    → saveAll() → localStorage.setItem + CustomEvent("progress-change")
      → all components with useProgress listener call forceUpdate
        → re-render with fresh state
```

**Skill Detail Page Load:**

```
Browser navigates to /skill/[slug]
  → page.tsx reads params.slug
    → SKILL_BY_SLUG[slug] → metadata (name, priority, category)
    → getSkillContent(slug) → SKILL_CONTENT[slug] from content/index.ts
      → renders tabs: notas, entrevista, exercícios, recursos, vídeos
    → DEPENDENCIES[slug] → prerequisite slugs for dependency display
    → useProgress.getState(slug) → current user state from localStorage
```

**Visuais/PDFs Lazy Load:**

```
Browser navigates to /skill/[slug]/visuais
  → visuais/page.tsx checks VISUAL_REGISTRY[slug]
    → if present: next/dynamic loads {Slug}Visuais.tsx on demand (ssr: false)
      → component uses generic visuals from src/components/visuals/
    → if absent: renders "em breve" placeholder
```

**Graph Page (SVG Pan/Zoom):**

```
graph/page.tsx mounts
  → computes LEVELS (topological sort of DEPENDENCIES)
  → builds fwd/bwd adjacency maps at module level (not in render)
  → renders SVG with all skill nodes positioned by level
  → pan/zoom managed via refs (panRef, zoomRef, gRef) + setAttribute
    → useLayoutEffect reapplies transform after every re-render
    → native addEventListener (not React synthetic) for mouse/wheel events
```

**Meta Generation (build-time tooling):**

```
node scripts/generate-meta.js
  → scans all domain directories in src/data/content/
  → reads each {slug}.ts file, regex-audits content fields
  → checks for {SlugPascal}Visuais.tsx and {SlugPascal}Pdfs.tsx
  → writes src/data/content/meta.ts (auto-generated, not hand-edited)
```

**State Management:**
- Single `localStorage` key: `careerstudy.progress.v1`
- Format: `Record<slug, { state: ProgressState, updatedAt: number, notes?: string }>`
- Cross-tab sync via `CustomEvent("progress-change")` dispatched on every write
- `mounted` flag in `useProgress` prevents hydration mismatch (SSR renders zeros, client reads real data after mount)
- Exercise completion stored per-skill: `careerstudy.exercises.v1.{slug}` (separate key, `Set<number>`)
- Quiz results stored per-skill: `careerstudy.quiz.v1.{slug}`

## Key Abstractions

**`CATEGORIES` / `ALL_SKILLS` / `SKILL_BY_SLUG`:**
- Purpose: Single source of truth for which skills exist, their slugs, priorities, and categories
- Location: `src/data/skills.ts`
- Pattern: Derived at module initialization — `ALL_SKILLS` is built from `CATEGORIES` at load time; `SKILL_BY_SLUG` and `SKILL_BY_NAME` are lookup maps built from `ALL_SKILLS`

**`DEPENDENCIES`:**
- Purpose: Directed acyclic graph of skill prerequisites
- Location: `src/data/skills.ts` (exported `Record<string, string[]>`)
- Pattern: Consumed by graph page for layout, by dashboard for "next to study" ranking, by skill detail page for prerequisite display

**`SKILL_CONTENT` / `getSkillContent`:**
- Purpose: Maps slug → full rich content (`SkillContent`)
- Location: `src/data/content/index.ts` (aggregator)
- Pattern: Spread-merges 11 domain sub-maps at import time; `getSkillContent(slug)` is the public API

**`VISUAL_REGISTRY` / `PDF_REGISTRY`:**
- Purpose: Maps slug → dynamically imported component
- Location: `src/data/skill-components.ts`
- Pattern: `next/dynamic` with `ssr: false` for every entry; visuais/pdfs pages do registry lookup at render time

**`useProgress`:**
- Purpose: All localStorage access is funneled through this single hook
- Location: `src/hooks/useProgress.ts`
- Pattern: Returns stable callbacks (all `useCallback`); forces re-render via `useState(0)` counter triggered by `progress-change` event

**`SkillContent` type:**
- Purpose: Schema for per-skill educational content
- Location: `src/types/index.ts`
- Pattern: All fields optional; `score` in meta.ts counts how many of 10 defined fields are sufficiently populated

## Entry Points

**Root Layout:**
- Location: `src/app/layout.tsx`
- Triggers: Every page load
- Responsibilities: HTML shell, Google Fonts link tags, `<body>` wrapper — minimal, no providers

**Dashboard:**
- Location: `src/app/page.tsx`
- Triggers: Navigation to `/`
- Responsibilities: Global stats, category progress, "next 8 P1" ranking based on dependency resolution ratio

**Skills Map:**
- Location: `src/app/skills/page.tsx`
- Triggers: Navigation to `/skills`
- Responsibilities: Full skill list with filter chips (priority + state), search, export/import JSON, progress cycling on click

**Skill Detail:**
- Location: `src/app/skill/[slug]/page.tsx`
- Triggers: Navigation to `/skill/{slug}`
- Responsibilities: Full content render (interview Q&A with TTS, exercises, resources, videos, notes textarea, prerequisites, state toggle, quiz launch)

**Visuais Sub-page:**
- Location: `src/app/skill/[slug]/visuais/page.tsx`
- Triggers: Navigation to `/skill/{slug}/visuais`
- Responsibilities: Looks up `VISUAL_REGISTRY[slug]`, renders lazy component or placeholder

**PDFs Sub-page:**
- Location: `src/app/skill/[slug]/pdfs/page.tsx`
- Triggers: Navigation to `/skill/{slug}/pdfs`
- Responsibilities: Looks up `PDF_REGISTRY[slug]`, renders lazy component or placeholder

**Coverage:**
- Location: `src/app/coverage/page.tsx`
- Triggers: Navigation to `/coverage`
- Responsibilities: Reads `SKILL_CONTENT` directly to classify each skill by content depth (vazio/mínimo/médio/profundo), renders coverage heatmap

## Error Handling

**Strategy:** Minimal — this is a local study tool, not a production service.

**Patterns:**
- `localStorage` access wrapped in `try/catch` returning `{}` on parse failure
- Icon `<img>` elements always carry `onError={e => e.target.style.display = 'none'}` — Simple Icons CDN 404s are silently hidden
- SVG `<image>` tags replaced with `<foreignObject><img onError>` because `error` events do not bubble in SVG DOM and React delegation cannot capture them
- Missing skill slug on detail page renders a "Skill não encontrada" message, not a crash
- `not-found.tsx` handles unknown routes at the Next.js level

## Cross-Cutting Concerns

**Logging:** None — browser console only during development.

**Validation:** None at runtime — TypeScript strict mode enforces shape at compile time.

**Authentication:** None — fully local, no user accounts.

**CSS Architecture:** Single `globals.css` with CSS custom properties (`--scarlet`, `--bg-card`, `--line`, `--fg-dim`, etc.) as design tokens; layout classes `.shell`, `.shell-wide`, `.card`, `.topnav`, `.tag`; dark theme is the only theme.

**SVG Pan/Zoom (graph page):** Uses mutable refs (`panRef`, `zoomRef`, `gRef`) and direct DOM `setAttribute` — never React state — to avoid pan/zoom transform being overwritten by re-renders triggered by hover/filter state changes. `useLayoutEffect(() => applyTransform())` with no deps reapplies the transform synchronously after every render.

---

*Architecture analysis: 2026-05-07*

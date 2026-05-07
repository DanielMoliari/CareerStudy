# Coding Conventions

**Analysis Date:** 2026-05-07

CareerStudy follows consistent TypeScript/React conventions across ~350 source files. The project uses Next.js 14 App Router with `'use client'` on all interactive pages, and separates concerns clearly between pages, components, hooks, data, and content authoring files.

---

## TypeScript Configuration

**Strictness:**
- `strict: true` — enables all strict type checks
- `noEmit: true` — TypeScript is type-check only (not used as transpiler)
- `target: ES2017` with `downlevelIteration: true`
- `ignoreDeprecations: "5.0"` — suppresses TS5 deprecation warnings
- `skipLibCheck: true` — skips .d.ts type checking for third-party libs

**Path Aliases:**
- `@/*` resolves to `./src/*`
- Use: `import { Skill } from '@/types'`, `import Nav from '@/components/Nav'`
- Never use relative paths like `../../../types` — always use `@/`

**Type imports:**
- Use `import type { ... }` for type-only imports throughout the codebase
- Example: `import type { SkillContent } from '@/types'`
- Regular imports for values: `import { useProgress } from '@/hooks/useProgress'`

**Type checking command:**
```bash
npx tsc --noEmit
```
Run after any content or component change to confirm zero errors.

---

## Naming Patterns

**Files:**
- Pages: `page.tsx` (Next.js convention, always lowercase)
- Components: `PascalCase.tsx` — e.g., `Nav.tsx`, `ProgressBar.tsx`, `QuizMode.tsx`
- Hooks: `camelCase.ts` with `use` prefix — e.g., `useProgress.ts`
- Data files: `camelCase.ts` — e.g., `skills.ts`, `tech-identity.ts`
- Content skill files: `kebab-case.ts` matching the skill slug — e.g., `node-js.ts`, `clean-architecture.ts`
- Visual/PDF components for skills: `{PascalSlug}Visuais.tsx` / `{PascalSlug}Pdfs.tsx` — e.g., `ReactVisuais.tsx`, `NodeJsPdfs.tsx`

**Directories:**
- `kebab-case` for all directories — e.g., `node-js/`, `clean-architecture/`, `react-query/`
- Skills with visuais/PDFs get their own folder: `src/data/content/frontend/react/react.ts`
- Simple skills stay as flat files: `src/data/content/frontend/zustand.ts`

**Variables and functions:**
- `camelCase` for variables, functions, and hooks
- `UPPER_SNAKE_CASE` for module-level constants — e.g., `SKILL_BY_SLUG`, `ALL_SKILLS`, `STATE_COLORS`, `NAV_ITEMS`
- `PascalCase` for React components, interfaces, and types

**Type/Interface naming:**
- Interfaces in `src/types/index.ts`: `Skill`, `SkillContent`, `InterviewQA`, `DiagramBlock`
- Types use union literals for enums: `type ProgressState = 'pendente' | 'lendo' | 'praticando' | 'domino' | 'revisar'`
- Domain-specific types colocated with their module: `src/components/pdfs/types.ts`

---

## `'use client'` Directive

All pages and interactive components start with `'use client'`. This is required because every page uses `localStorage` via `useProgress`. The root layout (`src/app/layout.tsx`) does NOT have `'use client'`.

Pattern:
```tsx
'use client'
import { useState, useEffect } from 'react'
import Nav from '@/components/Nav'
```

---

## Import Organization

Consistent order observed throughout the codebase:

1. React hooks (when needed in non-TSX files)
2. Next.js imports (`Link`, `useParams`, `usePathname`)
3. Internal components — `@/components/`
4. Internal data — `@/data/`
5. Internal hooks — `@/hooks/`
6. Internal types — `import type { ... } from '@/types'`

Example from `src/app/skill/[slug]/page.tsx`:
```tsx
'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Nav from '@/components/Nav'
import QuizMode from '@/components/QuizMode'
import { SKILL_BY_SLUG, DEPENDENCIES, ALL_SKILLS, iconUrl } from '@/data/skills'
import { useProgress, STATE_COLORS, STATE_FULL, STATE_ORDER } from '@/hooks/useProgress'
import { getSkillContent } from '@/data/content/index'
import type { Resource, InterviewQA } from '@/types'
```

---

## Component Patterns

**Page components:**
- Named `export default function XxxPage()` — always default export
- Layout: `<Nav />` goes OUTSIDE `.shell` / `.shell-wide` div, wrapped in a Fragment `<>`
- Slugs resolved via: `typeof params.slug === 'string' ? params.slug : Array.isArray(params.slug) ? params.slug[0] : ''`

```tsx
export default function VisuaisPage() {
  // ...
  return (
    <>
      <Nav />
      <div className="shell">
        {/* content */}
      </div>
    </>
  )
}
```

**Props interface:**
- Defined inline as `interface Props { ... }` within the same file for small components
- Example from `src/components/ProgressBar.tsx`:
```tsx
interface Props {
  counts: SkillStats['counts']
  height?: number
  style?: React.CSSProperties
}
```

**Styling:**
- Mixed approach: global CSS classes from `globals.css` for layout/shared UI + inline `style={{}}` for component-specific colors and dimensions
- Component-level colors for visuais/PDF components are declared as module-level constants:
```tsx
// Paleta — duplicada intencionalmente (cada arquivo mantém sua própria cópia)
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FGMUTE = '#94a3b8'
```
- CSS variables (`var(--scarlet)`, `var(--fg-mute)`) used for shared design tokens in global/page-level CSS

**Dynamic imports for heavy components:**
- Visuais and PDF components loaded via `next/dynamic` with `{ ssr: false }`
- Registered in `src/data/skill-components.ts` under `VISUAL_REGISTRY` and `PDF_REGISTRY`

---

## CSS Conventions (`src/app/globals.css`)

**Design tokens (CSS custom properties):**
```css
--bg: #0a0a0f            /* page background */
--bg-card: #111118       /* card background */
--bg-elev: #1a1a23       /* elevated surface */
--fg: #e2e8f0            /* primary text */
--fg-mute: #94a3b8       /* muted text */
--scarlet: #ef4444       /* accent/primary action */
--amber: #eab308         /* P2 priority / lendo state */
--green: #22c55e         /* success / domino state */
--blue: #3b82f6          /* praticando state */
--violet: #a855f7        /* revisar state */
```

**Utility classes in `globals.css`:**
- `.shell` — 1100px max-width content container, `padding: 60px`
- `.shell-wide` — 1320px max-width variant
- `.topnav` — sticky navigation bar
- `.chip` — skill tag with progress state styling via `data-state` attribute
- `.card` / `.card-grid` — card layout primitives
- `.btn` / `.btn.primary` / `.btn.ghost` — button variants
- `.tag.p1` / `.tag.p2` / `.tag.p3` — priority tag colors
- `.dot.p1` / `.dot.p2` / `.dot.p3` — priority dot indicators
- `.state-pill.{state}` — progress state badges

**Typography:**
- `h1–h3`: `Space Grotesk` font, negative letter-spacing (`-.03em` to `-.01em`)
- Body: `Plus Jakarta Sans`
- Monospace labels, code, nav items: `JetBrains Mono`
- `h1` uses `clamp(28px, 3.5vw, 44px)` for responsive sizing

**CSS in content diagrams:**
- Each diagram's embedded `<style>` uses a **unique short prefix** per skill (e.g., `.rcmm-` for React model mental, `.nel-` for Node event loop, `.dk1-` for Docker diagram 1)
- This prevents class name collisions when multiple diagrams render on the same page
- Pattern: `{2-4 letter skill abbreviation}{1-2 letter diagram number}-{element}`

---

## Content Authoring Conventions (`src/data/content/`)

**Skill file structure:**
```ts
import type { SkillContent } from '@/types'

const mySkill: SkillContent = {
  tagline: "...",
  why: "...",
  prerequisite: "...",
  summary: "...",
  howToStudy: "...",  // HTML string with <strong>, <em>, <code>
  diagrams: [...],
  keypoints: [...],
  cheatsheet: { title, html, caption },
  codeExamples: [...],
  interview: [...],   // InterviewQA[] with level: 'pleno' | 'senior'
  videos: [...],
  resources: [...],
  mindmap: { title, html },
  exercises: [...],   // level: 'iniciante' | 'intermediario' | 'senior'
  mnemonics: [...],
}

export default mySkill
```

**Interview Q&A format:**
```ts
{
  q: "Question text",
  a: "<p>HTML answer with <strong>emphasis</strong> and <pre><code>code</code></pre></p>",
  tip: "Brief interviewer tip for context",
  level: 'pleno' | 'senior'
}
```

**HTML in content fields:**
- `a` (interview answer), `howToStudy`, diagram `html` fields accept full HTML strings
- Use `<p>`, `<strong>`, `<ul>/<li>`, `<pre><code>` inside these strings
- Diagrams contain inline `<style>` blocks with prefixed CSS classes

**Domain index files:**
- Each domain folder has an `index.ts` that only re-exports — never read for content
- Never import directly from `index.ts` to get skill content — read the individual file

---

## Export Patterns

**Components:** `export default function ComponentName()`
**Hooks:** `export function useXxx()` — named export
**Data constants:** `export const SKILL_BY_SLUG`, `export const ALL_SKILLS` — named exports
**Content files:** `export default mySkill` — default export of `SkillContent` object
**Types:** `export type Xxx` / `export interface Xxx` — all from `src/types/index.ts`

---

## Error Handling

- Null-safe slug resolution in dynamic routes: `SKILL_BY_SLUG[slug] ?? null`
- Early return with fallback UI when `skill === null`:
```tsx
if (!skill) {
  return (
    <>
      <Nav />
      <div className="shell">
        <p style={{ color: 'var(--fg-mute)' }}>Skill não encontrada.</p>
      </div>
    </>
  )
}
```
- `localStorage` access always guarded: `if (typeof window === 'undefined') return`
- try/catch around all JSON.parse calls on localStorage data
- Icon `<img>` tags always have `onError` to hide broken icons from the CDN

---

## Linting

- ESLint via `eslint-config-next` (version `14.2.29`)
- Run: `npm run lint`
- No Prettier or Biome config detected — formatting is manual
- No `.eslintrc` custom rules file — uses Next.js defaults only

---

## Language

- All UI text, content, comments, and variable labels are in **Brazilian Portuguese**
- Accents are mandatory: "não" never "nao", "você" never "voce", "função" never "funcao"
- Domain-specific English terms kept in English (React, TypeScript, hooks, etc.)

---

*Convention analysis: 2026-05-07*

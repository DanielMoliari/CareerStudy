# Codebase Structure

**Analysis Date:** 2026-05-07

## Directory Layout

```
CareerStudy/
├── src/
│   ├── app/                        # Next.js App Router pages
│   │   ├── layout.tsx              # Root HTML shell (fonts, body)
│   │   ├── page.tsx                # Dashboard (/)
│   │   ├── globals.css             # Full design system
│   │   ├── not-found.tsx           # 404 page
│   │   ├── skills/page.tsx         # Skill map with filters (/skills)
│   │   ├── coverage/page.tsx       # Content depth audit (/coverage)
│   │   ├── graph/page.tsx          # SVG dependency graph (/graph)
│   │   ├── concepts/page.tsx       # Standalone visual concepts (/concepts)
│   │   ├── routine/page.tsx        # Weekly study schedule (/routine)
│   │   └── skill/
│   │       └── [slug]/
│   │           ├── page.tsx        # Skill detail (/skill/:slug)
│   │           ├── visuais/page.tsx # Visual components (/skill/:slug/visuais)
│   │           └── pdfs/page.tsx   # PDF guides (/skill/:slug/pdfs)
│   │
│   ├── components/                 # Shared UI components
│   │   ├── Nav.tsx                 # Top navigation bar
│   │   ├── ProgressBar.tsx         # Multi-segment progress bar
│   │   ├── QuizMode.tsx            # Interview quiz modal
│   │   ├── index.ts                # Component catalog (discovery doc)
│   │   ├── visuals/                # 50+ reusable interactive visual components
│   │   │   ├── VisuaisShell.tsx    # Shell + nav for visuais pages
│   │   │   ├── VisuaisNav.tsx      # Sidebar nav inside visuais
│   │   │   ├── FlowDiagram.tsx     # Generic flow/sequence diagrams
│   │   │   ├── SequenceDiagram.tsx # Step-by-step sequence renderer
│   │   │   ├── StateMachineExplorer.tsx
│   │   │   ├── HeatMap.tsx
│   │   │   └── ... (40+ more)
│   │   └── pdfs/                   # 16 reusable PDF section templates
│   │       ├── PdfCards.tsx        # Card grid layout for PDFs
│   │       ├── PdfModal.tsx        # Modal wrapper for PDF preview
│   │       ├── CheatsheetPdf.tsx
│   │       ├── InterviewSimPdf.tsx
│   │       └── ... (12+ more)
│   │
│   ├── data/                       # All static data (no API)
│   │   ├── skills.ts               # CATEGORIES, ALL_SKILLS, DEPENDENCIES, iconUrl()
│   │   ├── skill-components.ts     # VISUAL_REGISTRY, PDF_REGISTRY (dynamic imports)
│   │   ├── tech-identity.ts        # Per-tech color/personality/visualStyle config
│   │   └── content/                # Rich educational content per skill
│   │       ├── index.ts            # Aggregates all domains → SKILL_CONTENT
│   │       ├── meta.ts             # AUTO-GENERATED: score index (never edit manually)
│   │       ├── frontend/           # Frontend domain content
│   │       │   ├── index.ts        # Re-exports all frontend skills
│   │       │   ├── react/          # Folder layout (large skill)
│   │       │   │   ├── react.ts    # Main content
│   │       │   │   ├── ReactVisuais.tsx
│   │       │   │   └── ReactPdfs.tsx
│   │       │   ├── next-js/        # Folder layout
│   │       │   │   ├── next-js.ts
│   │       │   │   ├── NextJsVisuais.tsx
│   │       │   │   └── NextJsPdfs.tsx
│   │       │   ├── vue.ts          # Flat file layout (smaller skill)
│   │       │   └── ...
│   │       ├── backend/
│   │       ├── database/
│   │       ├── cloud/
│   │       ├── devops/
│   │       ├── ai/
│   │       ├── arch/
│   │       ├── cs/
│   │       ├── obs/
│   │       ├── sec/
│   │       └── soft/
│   │
│   ├── hooks/
│   │   └── useProgress.ts          # localStorage state management hook
│   │
│   ├── lib/                        # Empty (reserved)
│   │
│   └── types/
│       └── index.ts                # All TypeScript types
│
├── scripts/
│   └── generate-meta.js            # Regenerates meta.ts from skill files
│
├── .planning/
│   └── codebase/                   # GSD mapping documents
│
├── next.config.mjs                 # Minimal Next.js config (no TS — Next.js 14)
├── tsconfig.json                   # ES2017 target, downlevelIteration, @/* alias
├── tailwind.config.ts
├── package.json                    # pnpm, Next.js 14.2.29, React 18
├── playwright.config.ts            # E2E test config
└── CLAUDE.md                       # Project instructions for AI assistants
```

## Directory Purposes

**`src/app/`:**
- Purpose: Next.js App Router route tree; one `page.tsx` per URL
- All pages use `'use client'` (localStorage access requires browser)
- `layout.tsx` is server-compatible (no `'use client'`); injects fonts only
- `globals.css` is the sole stylesheet — all CSS lives here as custom properties and utility classes

**`src/components/`:**
- Purpose: Shared UI components used across multiple pages
- `Nav.tsx` and `ProgressBar.tsx` are page-level UI building blocks
- `QuizMode.tsx` is a large self-contained modal (24KB), used only in `skill/[slug]/page.tsx`
- `index.ts` is a catalog/discovery file listing all generic components with descriptions and `usedBy` slugs — it does not export components for import
- `visuals/` contains generic, reusable interactive visualization components; individual skill `{Slug}Visuais.tsx` files compose these
- `pdfs/` contains generic PDF section template components; individual skill `{Slug}Pdfs.tsx` files compose these

**`src/data/`:**
- Purpose: All application data — zero runtime fetching
- `skills.ts` is the canonical source of truth for skill identity (name, slug, priority, category, dependencies, icon)
- `skill-components.ts` registers dynamic imports for visuais/pdfs; must be updated when adding visuais or pdfs to a skill
- `tech-identity.ts` provides colors, personality type, and preferred visual style for each technology
- `content/` subdirectory holds the bulk of the codebase by file size

**`src/data/content/`:**
- Purpose: Educational content for 218+ skills, organized by 11 domains
- `index.ts` aggregates all domains — do not read for content; only re-exports
- `meta.ts` is auto-generated by `scripts/generate-meta.js` — never edit manually; holds completeness scores for all skills
- Each domain has an `index.ts` that re-exports its skills
- Skill content files are the actual data files to read and edit

**`src/data/content/{domain}/{slug}/`:**
- Purpose: Folder layout for skills that have visuais and/or PDFs
- Contains: `{slug}.ts` (main content), `{SlugPascal}Visuais.tsx` (optional), `{SlugPascal}Pdfs.tsx` (optional)
- Example: `frontend/react/react.ts`, `frontend/react/ReactVisuais.tsx`, `frontend/react/ReactPdfs.tsx`

**`src/hooks/`:**
- Purpose: React hooks — currently only `useProgress.ts`
- `useProgress.ts` is the only mechanism for reading/writing localStorage state in the app

**`src/types/`:**
- Purpose: Shared TypeScript type definitions
- Single file `index.ts`; all types are named exports

**`scripts/`:**
- Purpose: Build-time tooling run manually during content development
- `generate-meta.js` is a Node.js script (CommonJS, not TypeScript); must be run after any skill content change

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: HTML root, fonts
- `src/app/page.tsx`: Dashboard (default route)
- `src/app/skill/[slug]/page.tsx`: Skill detail (largest page file)

**Configuration:**
- `next.config.mjs`: Next.js config (minimal)
- `tsconfig.json`: TypeScript, includes `"@/*": ["./src/*"]` alias
- `tailwind.config.ts`: Tailwind (used minimally; most styles are in `globals.css`)
- `package.json`: Dependencies; pnpm as package manager

**Core Data:**
- `src/data/skills.ts`: Canonical skill registry — `CATEGORIES`, `ALL_SKILLS`, `DEPENDENCIES`, `SKILL_BY_SLUG`, `iconUrl()`
- `src/data/content/index.ts`: Content aggregator — `SKILL_CONTENT`, `getSkillContent()`
- `src/data/content/meta.ts`: Auto-generated score index — `SKILL_META`, `getSkillMeta()`, `getSkillsByScore()`
- `src/data/skill-components.ts`: Component registries — `VISUAL_REGISTRY`, `PDF_REGISTRY`

**Types:**
- `src/types/index.ts`: All shared types

**Testing:**
- `playwright.config.ts`: Playwright E2E config
- `tests/`: E2E test files (Playwright)

## Naming Conventions

**Files:**
- Page files: `page.tsx` (fixed by Next.js App Router convention)
- Layout: `layout.tsx`
- Skill content files: `{slug}.ts` where slug is kebab-case (e.g., `next-js.ts`, `clean-architecture.ts`)
- Visuais components: `{SlugPascal}Visuais.tsx` (e.g., `ReactVisuais.tsx`, `NextJsVisuais.tsx`)
- PDFs components: `{SlugPascal}Pdfs.tsx` (e.g., `ReactPdfs.tsx`, `NextJsPdfs.tsx`)
- Generic visual components: PascalCase descriptive name (e.g., `FlowDiagram.tsx`, `SequenceDiagram.tsx`)
- Generic PDF components: PascalCase with `Pdf` suffix (e.g., `CheatsheetPdf.tsx`, `QAReviewPdf.tsx`)
- Hooks: `use{Name}.ts` camelCase (e.g., `useProgress.ts`)

**Directories:**
- Route directories: kebab-case matching URL segments (`[slug]`, `visuais`, `pdfs`)
- Domain directories: single lowercase word (`frontend`, `backend`, `ai`, `cs`, `arch`, `obs`, `sec`, `soft`)
- Skill subdirectories: kebab-case slug matching the skill slug (e.g., `react/`, `next-js/`, `clean-architecture/`)

**Exports:**
- Data constants: SCREAMING_SNAKE_CASE (e.g., `CATEGORIES`, `ALL_SKILLS`, `SKILL_CONTENT`, `VISUAL_REGISTRY`)
- Functions: camelCase (e.g., `getSkillContent`, `iconUrl`, `slugify`)
- Types/interfaces: PascalCase (e.g., `SkillContent`, `InterviewQA`, `ProgressState`)
- React components: PascalCase default exports

## Where to Add New Code

**New skill (content only, no visuais/pdfs):**
1. Add `[name, priority]` tuple to correct category in `src/data/skills.ts` → `CATEGORIES`
2. Add to `DEPENDENCIES` in `src/data/skills.ts` if it has prerequisites
3. Add to `ICON_MAP` in `src/data/skills.ts`
4. Create `src/data/content/{domain}/{slug}.ts` with `SkillContent` export
5. Import and spread it in `src/data/content/{domain}/index.ts`
6. Run `node scripts/generate-meta.js`

**New skill (with visuais and/or pdfs):**
1. Follow steps 1–5 above
2. Create folder `src/data/content/{domain}/{slug}/`
3. Move `{slug}.ts` into the folder
4. Create `{SlugPascal}Visuais.tsx` and/or `{SlugPascal}Pdfs.tsx` in the folder
5. Register slug in `VISUAL_REGISTRY` and/or `PDF_REGISTRY` in `src/data/skill-components.ts`
6. Run `node scripts/generate-meta.js`
7. See `VISUALS_GUIDE.md` for the complete step-by-step

**New page/route:**
- Create `src/app/{route}/page.tsx`
- Add `'use client'` directive (required — pages use localStorage)
- Add `<Nav />` outside the `.shell` div (pattern: `<> <Nav /> <div className="shell">...</div> </>`)
- Add nav entry to `NAV_ITEMS` in `src/components/Nav.tsx` if it belongs in top nav

**New shared visual component:**
- Create `src/components/visuals/{ComponentName}.tsx`
- Document it in `src/components/index.ts` → `VISUAL_CATALOG`

**New shared PDF component:**
- Create `src/components/pdfs/{ComponentName}Pdf.tsx`
- Document it in `src/components/index.ts` → `PDF_CATALOG`

**New dependency relationship:**
- Add to `DEPENDENCIES` in `src/data/skills.ts`
- Format: `'dependent-slug': ['prereq-slug-1', 'prereq-slug-2']`

**Utilities/helpers:**
- Progress-related: extend `src/hooks/useProgress.ts`
- Slug utilities: `slugify()` already exists in `src/data/skills.ts`; import from there
- `src/lib/` is empty and available for future shared utilities

## Special Directories

**`.planning/`:**
- Purpose: GSD planning artifacts (codebase maps, phase plans)
- Generated: Partially (by GSD agents)
- Committed: Yes

**`content/` (root):**
- Purpose: Legacy static HTML content from before the Next.js migration
- Committed: Yes (reference only)

**`assets/` (root):**
- Purpose: Static assets not managed by Next.js `public/`
- Committed: Yes

**`public/` (root):**
- Purpose: Next.js static file serving (served at `/`)
- Committed: Yes

**`test-results/` (root):**
- Purpose: Playwright test output artifacts
- Generated: Yes
- Committed: No (in `.gitignore`)

**`src/data/content/meta.ts`:**
- Purpose: Auto-generated index of all skill completeness scores
- Generated: Yes, by `node scripts/generate-meta.js`
- Committed: Yes (so it's always current in the repo)
- **Never edit manually**

## Two Skill File Layouts

Skills exist in one of two layouts depending on whether they have visuais/pdfs:

**Flat file layout** (skill without visuais/pdfs or small skills):
```
src/data/content/frontend/
  vue.ts              ← content file at domain level
  zustand.ts
  ...
```

**Folder layout** (skill with visuais and/or pdfs):
```
src/data/content/frontend/
  react/
    react.ts          ← content file inside slug-named folder
    ReactVisuais.tsx
    ReactPdfs.tsx
  next-js/
    next-js.ts
    NextJsVisuais.tsx
    NextJsPdfs.tsx
```

When a flat-file skill graduates to having visuais/pdfs, move the `.ts` file into a new `{slug}/` folder alongside the new `{SlugPascal}Visuais.tsx` / `{SlugPascal}Pdfs.tsx` files. The `generate-meta.js` script handles both layouts automatically.

---

*Structure analysis: 2026-05-07*

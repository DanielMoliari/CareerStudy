# External Integrations

**Analysis Date:** 2026-05-07

CareerStudy has no backend, no authentication service, and no paid API integrations. All external dependencies are either free CDNs loaded at runtime in the browser or YouTube/documentation URLs embedded as static content inside skill data files. The app runs entirely client-side.

---

## CDNs (Runtime, Browser)

**Google Fonts:**
- URL: `https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:...&family=Space+Grotesk:...&family=JetBrains+Mono:...`
- Loaded: `<link>` tag in `src/app/layout.tsx` (rendered on every page)
- Families: Plus Jakarta Sans, Space Grotesk, JetBrains Mono
- Note: Uses direct `<link>` instead of `next/font` — fonts load after HTML parse, not optimized by Next.js

**Simple Icons CDN:**
- URL pattern: `https://cdn.simpleicons.org/{slug}/{hex}`
- Used by: `src/data/skills.ts` — `iconUrl()` function builds icon URLs for all skills
- Error handling: every `<img>` using this CDN must have an `onError` handler to hide broken icons (CDN returns 404 for unknown slugs)
- No authentication; free public CDN

---

## APIs & External Services

**None.** There are no API calls at runtime. The app makes zero HTTP requests except for CDN asset loading (fonts, icons).

---

## Data Storage

**Databases:**
- None. No server-side database.

**Client Storage:**
- `localStorage` key: `careerstudy.progress.v1`
- Format: `Record<slug, { state: ProgressState, updatedAt: number, notes?: string }>`
- Implemented in: `src/hooks/useProgress.ts`
- Supports: export to JSON, import from JSON, reset
- Browser-only — SSR guard via `typeof window === 'undefined'` checks

**File Storage:**
- Local filesystem only (static skill content TypeScript files in `src/data/content/`)

**Caching:**
- Browser cache only (standard Next.js static asset caching)

---

## Authentication & Identity

- None. No login, no user accounts, no auth provider.

---

## Text-to-Speech (Browser API)

- API: `window.speechSynthesis` (Web Speech API — native browser, no external service)
- Used by: `src/app/skill/[slug]/page.tsx` — `AudioBtn` component and `speak()` function
- Behavior: reads interview Q&A answers, diagram captions, prerequisite text aloud
- Voice selection: prefers `pt-BR` locale voices; falls back to first available voice
- No quota, no API key — uses OS/browser built-in TTS engine

---

## PDF Generation (Client-Side)

- Library: `@react-pdf/renderer ^4.5.1`
- Used by: `src/components/pdfs/` (15+ PDF template components)
- Pattern: always lazy-loaded via `await import('@react-pdf/renderer')` inside async functions
- No external API — PDF generation happens entirely in the browser
- PDF types: QuickRef, Cheatsheet, Mindmap, Glossary, StudyPlan, InterviewSim, QAReview, Mnemonics, Antipatterns, Patterns, RecipeBook, CommandRef, SecurityChecklist, ErrorRef, ComparativeRef

---

## Embedded External URLs (Static Content)

These appear as `url` fields inside skill data files — they are reference links shown to the user, not fetched programmatically.

**YouTube videos** (embedded as links in skill content, not iframes):
- Channels referenced: ByteByteGo, Hussein Nasser, Fireship, freeCodeCamp, Qdrant Official, Martin Kleppmann, CMU Database Group, InfoQ, PGConf.EU, Citus Data, Postgres Open, Bruce Momjian, among others
- Location: `videos: [{ title, channel, url }]` arrays in each `src/data/content/{domain}/{slug}.ts`

**GitHub repositories** (reference links):
- Examples: `github.com/pgvector/pgvector`, `github.com/dalibo/pg_activity`, `github.com/facebook/rocksdb`
- Location: `resources: [{ title, url, kind }]` arrays in skill files

**Documentation sites** (reference links):
- Examples: `supabase.com/docs`, official framework docs
- Location: `resources` arrays in skill files

---

## CI/CD & Deployment

**Hosting:**
- Not determined — no deployment config files found (`vercel.json`, `netlify.toml`, Dockerfile, etc. are absent)
- Compatible with Vercel, Netlify, or any static/Node host (standard Next.js 14 output)

**CI Pipeline:**
- None. No `.github/workflows/`, `.gitlab-ci.yml`, or equivalent found.

---

## Environment Variables

- No `.env` files present in the repository
- No `process.env` references found in source code
- No environment configuration required — the app is fully static with no secrets

---

## Webhooks & Callbacks

**Incoming:** None

**Outgoing:** None

---

## Notable Absent Integrations

The following services appear as **skill topics** in the content data (study subjects) but are NOT integrated into the app itself:

- AWS, Terraform, Kubernetes — studied topics, not used
- Stripe, Firebase, Supabase — studied topics, not used
- OpenAI, Anthropic SDK — studied topics, not used
- Prometheus, Grafana, OpenTelemetry — studied topics, not used
- Playwright — used for E2E tests (`tests/` directory), but only runs locally; not in CI

---

*Integration audit: 2026-05-07*

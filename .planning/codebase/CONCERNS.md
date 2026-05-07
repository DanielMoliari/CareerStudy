# Codebase Concerns

**Analysis Date:** 2026-05-07

CareerStudy is a personal study platform with 218 registered skills. The codebase is functionally solid for its purpose, but carries significant content debt (128 skills at score 0 of 10) and several architectural patterns that require attention as the project scales. All data is persisted exclusively in `localStorage` — there is no backend, authentication, or server-side state.

---

## Critical Concerns

**128 Skills with No Enriched Content (score 0/10):**
- Files: `src/data/content/meta.ts` (lines 25–233)
- Scope: 128 out of 218 skills (58.7%) have `score: 0`. These include high-visibility skills like `javascript`, `git`, `docker` (wait — docker is 10), `jest`, `nginx`, `redux`, `zod`, `scss`, `svelte`, `react-native`, `go`, `rust`, `mysql`, `firebase`, `kubernetes` (10), etc. The 0-score entries are mostly stubs: 1 KB files with zero Q&As, no diagrams, no exercises.
- Impact: High — navigating to `/skill/jest`, `/skill/git`, or `/skill/redux` shows a skill page with empty content sections, degrading the learning experience for roughly 6 in 10 skills.
- Fix approach: Prioritize P1 skills first using `meta.ts` score filter. Run content enrichment workflow per `CLAUDE.md` flow.

**No Build-time Validation of Skill Content vs. Registered Slugs:**
- Files: `src/data/skills.ts`, `src/data/content/index.ts`, `scripts/generate-meta.js`
- Issue: `SKILL_BY_SLUG` (skills registry) and `SKILL_CONTENT` (content map) are maintained manually and independently. A skill registered in `skills.ts` but missing from a domain `index.ts` silently returns `null` from `getSkillContent()`. No script validates this.
- Impact: High — silent null content is the most common failure mode in the app.
- Fix approach: Add a validation script (or extend `generate-meta.js`) that cross-checks every slug in `ALL_SKILLS` against `SKILL_CONTENT` keys and reports orphans.

---

## Technical Debt

**`ignoreDeprecations: "5.0"` in tsconfig:**
- File: `tsconfig.json` line 6
- Issue: TypeScript 5.0 deprecated certain patterns (likely `importsNotUsedAsValues` and similar). This flag silences those warnings rather than resolving them. The exact deprecated usage is masked.
- Impact: Medium — suppresses real type-safety feedback; may break when upgrading to a TypeScript major that removes the deprecated APIs.
- Fix approach: Remove the flag, run `npx tsc --noEmit`, identify and fix the deprecated patterns.

**`loadAll()` Called on Every localStorage Access (no in-memory cache):**
- File: `src/hooks/useProgress.ts` lines 36–41, 63–68, 83–89, 91–95, 96–102
- Issue: Every call to `getState`, `setState`, `cycleState`, `getNote`, `setNote`, and `stats` independently calls `loadAll()`, which parses the full JSON from `localStorage`. With 218 skills, the `stats()` function calls `getState()` per skill, triggering 218 separate `JSON.parse` calls.
- Impact: Medium — noticeable on `/skills` page and `/` dashboard where `stats()` is called on every render cycle. Performance degrades as progress data grows.
- Fix approach: Cache the parsed store in a module-level ref or React ref, invalidate on `progress-change` event, and serve reads from the cache.

**SVG Pan/Zoom Native Event Listener Workaround (documented constraint):**
- File: `src/app/graph/page.tsx` lines 3, 141
- Issue: CLAUDE.md explicitly documents: pan/zoom must use native `addEventListener` and mutable refs (`panRef`, `zoomRef`, `gRef`) because React synthetic events are unreliable across the SVG/HTML boundary. `useLayoutEffect(() => applyTransform())` runs on every re-render to re-apply the transform.
- Impact: Medium — this pattern is fragile; any future refactor that changes the ref structure or the effect dep array will silently break pan/zoom. The `useLayoutEffect` without deps re-running on every render is intentional but non-obvious.
- Fix approach: Document in-code (inline comment block) why the pattern exists and what must not change. Consider adding a Playwright test that asserts pan/zoom survives hover interactions.

**`<foreignObject><img>` Instead of `<image>` in SVG (documented workaround):**
- File: `src/app/graph/page.tsx`, any SVG icon render in the graph
- Issue: CLAUDE.md documents: `<image onError>` doesn't work because React's synthetic event delegation doesn't capture `error` events in SVG. The workaround is `<foreignObject><img onError=...></foreignObject>`.
- Impact: Low — functional workaround, but every future dev who touches SVG icon rendering needs to know this. Not enforced anywhere.
- Fix approach: Add a comment near the icon render explaining the constraint.

**Exercises State Stored Under a Separate localStorage Key (not unified with progress):**
- File: `src/app/skill/[slug]/page.tsx` lines 73–76, 127
- Issue: Exercise completion is stored at `careerstudy.exercises.v1.${slug}` directly in `localStorage`, outside the `useProgress` hook and `STORAGE_KEY`. This means `exportJSON` / `importJSON` in `useProgress` does NOT export exercise progress.
- Impact: Medium — user data loss on export/import of progress. Exercises are invisible to the backup flow.
- Fix approach: Move exercise state into the `useProgress` store, extend `StoreEntry` to include `exercises?: number[]`, and update `exportJSON`/`importJSON`.

**Routine Page Has Its Own Inline localStorage Logic (duplicated pattern):**
- File: `src/app/routine/page.tsx` lines 366–479
- Issue: The routine page manages its own localStorage reads/writes (`STORAGE_KEY`, `CHECK_KEY`) with inline try/catch, duplicating the pattern already formalized in `useProgress.ts`.
- Impact: Low — inconsistency creates two maintenance targets for localStorage logic. If the storage key format changes, routine page won't be updated automatically.
- Fix approach: Extract routine state management into a `useRoutine` hook or extend `useProgress` to cover it.

**Legacy `.js` Content Files in `/content/` Root Directory:**
- Directory: `/Users/daniel-moliari/CareerStudy/content/` (4,401 lines across 10 files, ~630 KB)
- Issue: The pre-migration HTML static files (`frontend.js`, `backend.js`, etc.) still exist in the repo root's `content/` directory. These are the source files from before the Next.js migration. They are not imported anywhere in the current `src/` tree but add ~630 KB of dead code to the repo.
- Impact: Low — no runtime impact, but creates confusion about which `content/` is canonical.
- Fix approach: Delete `/content/*.js` and add a note in CLAUDE.md that `/content/` is archived (or just delete).

---

## Performance

**14 MB Content Bundle Eagerly Imported at App Start:**
- File: `src/data/content/index.ts`, all domain `index.ts` files
- Issue: All 218 skills' content (14 MB of TypeScript source, ~630 KB compiled) is bundled into a single export and imported by `src/app/skill/[slug]/page.tsx` via `getSkillContent`. The coverage page also imports `SKILL_CONTENT` directly. Next.js cannot tree-shake this because skill content is accessed dynamically by slug at runtime.
- Impact: High — this directly inflates the JavaScript bundle served to the browser. Skills with large Visuais/Pdfs components (e.g., `SystemDesignVisuais.tsx` at 2,209 lines, `HtmlVisuais.tsx` at 1,955 lines) are all loaded upfront regardless of which skill the user visits.
- Fix approach: Convert skill content to dynamic imports using `React.lazy` or Next.js dynamic imports per slug. The `getSkillContent(slug)` function is already the right abstraction point — it just needs to be async with lazy loading.

**`useProgress` Re-parses localStorage on Every Callback Invocation:**
- File: `src/hooks/useProgress.ts` — `loadAll()` called 6+ times per operation
- Issue: Described above under Technical Debt. Especially impactful in pages that call `stats()` on every render (dashboard, skills map).
- Impact: Medium — measurable jank on `/skills` page scroll with 218 chips re-rendering.

**Largest Single Files (potential code-splitting targets):**
- `src/data/content/arch/system-design/SystemDesignVisuais.tsx` — 2,209 lines
- `src/data/content/frontend/html/HtmlVisuais.tsx` — 1,955 lines
- `src/data/content/frontend/typescript/TypescriptVisuais.tsx` — 1,900 lines
- `src/data/content/frontend/css/CssVisuais.tsx` — 1,753 lines
- `src/data/content/frontend/typescript/TypescriptPdfs.tsx` — 1,752 lines
- Impact: Medium — each is a React component tree with inline styles and HTML strings. These are loaded for every user even if they never visit those skills.

---

## Scalability

**`src/data/skills.ts` ICON_MAP is a Static Record of ~100+ Entries:**
- File: `src/data/skills.ts` lines 5–86
- Issue: Every new skill requires a manual entry in `ICON_MAP`. No fallback for slugs not in the map — `iconUrl()` silently returns a broken URL.
- Impact: Low — manageable at current scale, annoying as skills grow past 250+.
- Fix approach: Add a fallback icon for unknown slugs; optionally derive the icon slug from the skill slug automatically.

**`skills.ts` Has All 218 Skill Definitions Inline:**
- File: `src/data/skills.ts`
- Issue: All skills, categories, and the DEPENDENCIES graph are defined in a single file. As the skill count grows toward 300+, this file becomes unwieldy to maintain.
- Impact: Low currently, Medium at 300+ skills.
- Fix approach: Split into domain-specific skill definition files, parallel to how content is organized.

**localStorage as Sole Persistence Has No Sync or Backup:**
- File: `src/hooks/useProgress.ts`, `src/app/skills/page.tsx`
- Issue: All study progress lives in `careerstudy.progress.v1` in the browser's localStorage. No cloud sync, no user account. Data is lost on browser data clear, new device, or incognito session. Export/import is manual and excludes exercise progress.
- Impact: Medium — acceptable for a personal tool, but any browser reset destroys months of progress tracking.
- Fix approach: At minimum, auto-export to a downloadable JSON on each update (or remind user periodically). At scale: add a simple cloud persistence layer.

---

## Security

**No Input Sanitization on `importJSON`:**
- File: `src/hooks/useProgress.ts` lines 121–128
- Issue: `importJSON` parses arbitrary JSON from a file upload and writes it directly to localStorage with no schema validation. A malformed or malicious file that passes `typeof obj === 'object'` will be stored and may corrupt the progress state.
- Impact: Low — self-hosted personal tool, only the user can import files. Not a threat model concern in the current context.
- Fix approach: Add Zod or manual schema validation of the imported object shape.

**HTML Content in Skill Data Rendered via `dangerouslySetInnerHTML`:**
- File: `src/app/skill/[slug]/page.tsx` (multiple sections rendering `interview[n].a` as HTML)
- Issue: Skill interview answers are stored as raw HTML strings and rendered via `dangerouslySetInnerHTML`. The content is authored internally (not user input), so there is no XSS risk from external sources today.
- Impact: Low — risk exists only if the content authoring process is compromised or if user-generated content is ever added.
- Fix approach: No immediate action needed. Document that skill content HTML must be reviewed before commit.

---

## Missing Features

**No Testing for Score-0 Skill Pages:**
- File: `tests/all-skills.spec.ts`
- Issue: The Playwright test suite in `tests/` only covers 84 enriched skills (score 10). None of the 128 score-0 stub skill pages are covered by E2E tests. A broken stub page (e.g., null content rendering crash) would go undetected.
- Impact: Medium — regression risk on stub skills.
- Fix approach: Add a smoke test that visits a sample of score-0 skill pages and asserts no JS errors and the page title renders.

**No Automated Check for Missing `generate-meta.js` Run:**
- File: `scripts/generate-meta.js`, `src/data/content/meta.ts`
- Issue: `meta.ts` is auto-generated but there is no CI or git hook to enforce it is run after content changes. The file can drift out of sync silently.
- Impact: Medium — `/coverage` and any score-based feature will show stale data.
- Fix approach: Add a `pnpm lint` or `pnpm build` step that runs `generate-meta.js` and checks if `meta.ts` was modified (or errors if it differs from committed state).

**No Linting Configuration:**
- File: `package.json` (has `"lint": "next lint"` but no `.eslintrc` found)
- Issue: `next lint` requires an ESLint config file to do anything useful. No `.eslintrc.json` or `eslint.config.*` was found in the repo root. Running `npm run lint` likely no-ops or uses minimal Next.js defaults only.
- Impact: Low — no code style enforcement means inconsistencies accumulate silently.
- Fix approach: Create `.eslintrc.json` with `next/core-web-vitals` preset at minimum.

**Quiz Mode Not Wired to Score/Progress:**
- File: `src/components/QuizMode.tsx`, `src/app/skill/[slug]/page.tsx`
- Issue: The `QuizMode` component exists and is rendered in the skill detail page, but quiz results do not feed back into the skill's progress state. Completing a quiz does not update `domino` or `revisar` states.
- Impact: Medium — breaks the learning loop. The feature exists but doesn't affect progress tracking.
- Fix approach: On quiz completion with a passing threshold, auto-suggest or auto-set progress state.

---

## Maintenance Risks

**`meta.ts` is 61 KB and Grows with Every New Skill:**
- File: `src/data/content/meta.ts`
- Issue: The auto-generated index is imported by the `/coverage` page and used by `getSkillsByScore`. As skills approach 300+, this file grows proportionally with no pagination or lazy load.
- Impact: Low currently, grows to Medium at 300+ skills.

**`concepts/page.tsx` Contains Hardcoded Diagram Data (918 lines):**
- File: `src/app/concepts/page.tsx`
- Issue: The concepts page embeds all 12 interactive SVG diagrams as hardcoded arrays and state machines (MVCC steps, TLS steps, event loop steps) directly in the page component. Adding a new diagram requires editing this file directly.
- Impact: Low — the page is stable and rarely changed, but it's a maintenance target if concepts are added or updated.
- Fix approach: Extract each diagram into its own data file or component, parallel to the Visuais pattern.

**Two Parallel Content Directories (`/content/*.js` and `/src/data/content/`):**
- Files: `/content/` root, `/src/data/content/`
- Issue: The legacy JS files could mislead a new contributor into editing the wrong files.
- Impact: Low.

---

*Concerns audit: 2026-05-07*

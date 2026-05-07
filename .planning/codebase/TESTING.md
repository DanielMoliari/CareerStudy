# Testing Patterns

**Analysis Date:** 2026-05-07

CareerStudy uses **Playwright** exclusively for end-to-end browser testing — there are no unit tests, no component tests, and no Jest/Vitest setup. All 6 test files in `tests/` are E2E specs that run against a live Next.js dev server. There is no mocking layer, no test fixtures, and no coverage tooling.

---

## Test Framework

**Runner:**
- Playwright `^1.59.1`
- Config: `playwright.config.ts`

**Assertion Library:**
- Playwright built-in `expect` from `@playwright/test`

**Run Commands:**
```bash
npx playwright test              # Run all tests
npx playwright test tests/skill-react.spec.ts   # Run single file
npx playwright test --ui         # Interactive UI mode
npx playwright show-report       # View HTML report after run
```

No `npm test` or `npm run test` script defined in `package.json` — invoke Playwright directly via `npx`.

---

## Configuration (`playwright.config.ts`)

```typescript
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,   // tests run sequentially
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    screenshot: 'only-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true,  // reuses running dev server if available
    timeout: 120000,
  },
})
```

Key decisions:
- **Single browser only**: Chromium (Desktop Chrome). No Firefox or Safari coverage.
- **Sequential execution**: `workers: 1`, `fullyParallel: false` — tests run one at a time.
- **No retries**: `retries: 0` — flaky tests fail immediately.
- **Reuses dev server**: if `http://localhost:3000` is already running, tests use it.

---

## Test File Organization

**Location:** `tests/` at project root (not co-located with source)

**Naming:** `skill-{slug}.spec.ts` for skill-specific tests, `all-skills.spec.ts` for breadth coverage

```
tests/
  all-skills.spec.ts          — smoke tests for 80+ slugs (skill, visuais, pdfs routes)
  skill-react.spec.ts         — deep tests for /skill/react and sub-routes
  skill-typescript.spec.ts    — deep tests for /skill/typescript and sub-routes
  skill-css.spec.ts           — deep tests for /skill/css and sub-routes
  skill-html.spec.ts          — deep tests for /skill/html and sub-routes (includes navigation)
  skill-typeorm.spec.ts       — deep tests for /skill/typeorm and sub-routes
```

---

## Test Structure

**Two patterns are used:**

**Pattern 1 — `test.describe` blocks (skill-specific specs):**
```typescript
import { test, expect } from '@playwright/test'

test.describe('/skill/react — página principal', () => {
  test('carrega sem erros e exibe o nome da skill', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/skill/react')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('h1')).toContainText('React')
    expect(errors).toHaveLength(0)
  })
})
```

**Pattern 2 — Programmatic test generation (all-skills.spec.ts):**
```typescript
const SLUGS = ['react', 'typescript', /* ... 80+ more */]

for (const slug of SLUGS) {
  test(`skill page: ${slug}`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (err) => errors.push(`[${slug}] ${err.message}`))

    const response = await page.goto(`/skill/${slug}`, {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    })
    expect(response?.status(), `${slug} should not 404`).not.toBe(404)
    await page.waitForTimeout(1000)

    const h1 = page.locator('h1')
    await expect(h1, `${slug} h1 should be visible`).toBeVisible({ timeout: 8000 })

    if (errors.length > 0) {
      throw new Error(`JS errors on /skill/${slug}:\n${errors.join('\n')}`)
    }
  })
}
```

---

## What Is Tested

**Breadth coverage (`all-skills.spec.ts`):**
- 80+ skill slugs × 3 routes each = 240+ tests: `/skill/{slug}`, `/skill/{slug}/visuais`, `/skill/{slug}/pdfs`
- Checks: no HTTP 404, `<h1>` visible, no JavaScript runtime errors
- Body content not empty (visuais and pdfs routes)

**Depth coverage (per-skill specs):**
Each of the 5 deep spec files covers the same pattern for its skill:

1. **Main skill page** — loads without JS errors, `h1` contains skill name, PDF/visuais navigation links visible
2. **Visuais page** — loads without errors, `h1` correct, at least 1 navigation button matches expected titles, main content area has >100 characters
3. **PDFs page** — loads without errors, `h1` correct, specific card titles visible with `exact: true`, clicking "Abrir PDF →" opens modal with "✕ Fechar" button
4. **Fallback states** — `/skill/xyz/visuais` shows "não encontrada|not found", `/skill/{slug}/visuais` for skills without visuais shows content without crashing

**Additional HTML-specific tests (`skill-html.spec.ts`):**
- Navigation between visuals: clicking a specific button and asserting content changes

---

## What Is NOT Tested

The following areas have zero test coverage:

- **Unit behavior of hooks** — `useProgress` localStorage logic untested
- **Data integrity** — `skills.ts` CATEGORIES/ALL_SKILLS structure, `skill-components.ts` registry completeness
- **Content schema** — no validation that skill files conform to `SkillContent` type at runtime
- **Graph page** (`/graph`) — SVG pan/zoom behavior, node rendering
- **Concepts page** (`/concepts`) — 12 interactive diagrams
- **Dashboard page** (`/`) — stats display, Quick Actions links
- **Skills page** (`/skills`) — filter chips, search, chip state cycling
- **Routine page** (`/routine`) — weekly schedule display
- **Coverage page** (`/coverage`) — diagnostic tab
- **Keyboard navigation / accessibility** — no a11y assertions
- **Mobile/responsive layout** — only Desktop Chrome tested
- **Performance** — no Core Web Vitals assertions
- **localStorage persistence** — progress state not tested end-to-end
- **PDF generation** — `@react-pdf/renderer` rendering not validated
- **Error boundaries** — no tests for what happens when dynamic imports fail

---

## JS Error Detection Pattern

The standard pattern for catching runtime JS errors in every test:

```typescript
test('carrega sem erros', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', err => errors.push(err.message))

  await page.goto('/skill/react')
  await page.waitForLoadState('networkidle')

  expect(errors).toHaveLength(0)
})
```

Use `page.on('pageerror', ...)` — not `page.on('console', ...)`. This catches uncaught exceptions and unhandled promise rejections.

---

## Dynamic Component Wait Pattern

Visuais and PDF pages use `next/dynamic` with `ssr: false`. Tests always add an explicit wait:

```typescript
await page.waitForLoadState('networkidle')
await page.waitForTimeout(2000)  // allow dynamic import to mount
```

This is necessary because the component may still be loading after networkidle. The 2000ms wait is a pragmatic choice, not precise.

---

## Selector Patterns

**Preferred selectors:**
- `page.locator('h1')` — semantic element
- `page.locator('a[href*="/pdfs"]')` — attribute contains
- `page.getByText('Q&A Review', { exact: true }).first()` — exact text match
- `page.locator('button').filter({ hasText: /regex/i })` — buttons filtered by content

**Fallback pattern for visual nav buttons:**
```typescript
const buttons = page.locator('button').filter({
  hasText: /conceitos|fiber|re.render|hooks/i,
})
const count = await buttons.count()
expect(count).toBeGreaterThanOrEqual(1)
```
Tests use `>=1` rather than exact counts to be resilient to content additions.

---

## Conditional Assertions

Some tests use conditional clicking to avoid false failures when optional content may not be present:

```typescript
const headBtn = page.locator('button').filter({ hasText: /anatomia do/i }).first()
if (await headBtn.count() > 0) {
  await headBtn.click()
  await page.waitForTimeout(500)
  const text = await page.locator('body').innerText()
  expect(text).toMatch(/charset|viewport|preconnect/i)
}
```

This pattern appears only in `skill-html.spec.ts` and makes those assertions optional.

---

## Coverage Gaps — Priority

| Gap | Risk | Priority |
|-----|------|----------|
| `useProgress` hook logic (localStorage) | Data loss on progress state | High |
| `/skills` page filter/search | Core navigation broken silently | High |
| `skill-components.ts` registry completeness | 404s on visuais/pdfs for new skills | High |
| `/graph` page pan/zoom | SVG broken undetected | Medium |
| Mobile layout | UX broken on small screens | Medium |
| PDF generation | PDFs render blank/error | Medium |
| `SkillContent` schema validation | Malformed content causes runtime errors | Low |

---

## Adding New Tests

When adding a new skill with visuais/PDFs, add it to `tests/all-skills.spec.ts` SLUGS array. When adding a flagship skill, create `tests/skill-{slug}.spec.ts` following the pattern from `tests/skill-react.spec.ts`:

1. One `test.describe` per route (`/skill/{slug}`, `/skill/{slug}/visuais`, `/skill/{slug}/pdfs`)
2. Always start with a JS-error-capture test
3. Verify `h1` content in the first test of each describe block
4. Verify specific card titles for the PDFs page
5. Verify modal opens on "Abrir PDF →" click

---

*Testing analysis: 2026-05-07*

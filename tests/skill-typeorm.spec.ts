import { test, expect } from '@playwright/test'

// ── /skill/typeorm ────────────────────────────────────────────────────────────

test.describe('/skill/typeorm — página principal', () => {
  test('carrega sem erros e exibe o nome da skill', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/skill/typeorm')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('h1')).toContainText(/TypeORM/i)
    expect(errors).toHaveLength(0)
  })

  test('exibe os links de navegação para visuais e PDFs', async ({ page }) => {
    await page.goto('/skill/typeorm')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('a[href*="/pdfs"]')).toBeVisible()
    await expect(page.locator('a[href*="/visuais"]')).toBeVisible()
  })
})

// ── /skill/typeorm/visuais ────────────────────────────────────────────────────

test.describe('/skill/typeorm/visuais — componentes visuais', () => {
  test('carrega sem erros', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/skill/typeorm/visuais')
    await page.waitForLoadState('networkidle')

    expect(errors).toHaveLength(0)
  })

  test('exibe o heading da página de visuais', async ({ page }) => {
    await page.goto('/skill/typeorm/visuais')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('h1')).toContainText(/TypeORM/i)
  })

  test('exibe os botões de navegação dos visuais', async ({ page }) => {
    await page.goto('/skill/typeorm/visuais')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    const buttons = page.locator('button').filter({
      hasText: /como funciona|relações|querybuilder|migrations|n\+1|anti.patterns|decorators|entity lifecycle|apis/i,
    })
    const count = await buttons.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('o primeiro visual renderiza conteúdo TypeORM-específico', async ({ page }) => {
    await page.goto('/skill/typeorm/visuais')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    const content = await page.locator('main, .shell, [class*="shell"]').innerText()
    expect(content.length).toBeGreaterThan(100)
    expect(content).toMatch(/DataSource|Entity|Repository|@Entity|@Column|@OneToMany|@ManyToOne/i)
  })

  test('o visual de comparação de APIs aparece na navegação', async ({ page }) => {
    await page.goto('/skill/typeorm/visuais')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    const apiBtn = page.locator('button').filter({ hasText: /apis|persistência/i })
    const count = await apiBtn.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })
})

// ── /skill/typeorm/pdfs ───────────────────────────────────────────────────────

test.describe('/skill/typeorm/pdfs — cards de PDF', () => {
  test('carrega sem erros', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/skill/typeorm/pdfs')
    await page.waitForLoadState('networkidle')

    expect(errors).toHaveLength(0)
  })

  test('exibe o heading da página de PDFs', async ({ page }) => {
    await page.goto('/skill/typeorm/pdfs')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('h1')).toContainText(/TypeORM/i)
  })

  test('exibe os 7 cards de PDF (Q&A, CheatSheet, Mnemônicos, Anti-patterns, Mind Map, Recipe Book, Migrations CLI)', async ({ page }) => {
    await page.goto('/skill/typeorm/pdfs')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    for (const title of [
      'Q&A Review',
      'CheatSheet',
      'Mnemônicos',
      'Anti-patterns',
      'Mind Map',
      'Recipe Book',
      'Migrations CLI',
    ]) {
      await expect(page.getByText(title, { exact: true }).first()).toBeVisible()
    }
  })

  test('clique no card de destaque abre o modal de PDF', async ({ page }) => {
    await page.goto('/skill/typeorm/pdfs')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    await page.getByText('Abrir PDF →').first().click()

    await expect(page.getByText('✕ Fechar')).toBeVisible({ timeout: 8000 })
  })
})

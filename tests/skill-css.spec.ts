import { test, expect } from '@playwright/test'

// ── /skill/css ────────────────────────────────────────────────────────────────

test.describe('/skill/css — página principal', () => {
  test('carrega sem erros e exibe o nome da skill', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/skill/css')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('h1')).toContainText('CSS')
    expect(errors).toHaveLength(0)
  })

  test('exibe os botões de navegação para visuais e PDFs', async ({ page }) => {
    await page.goto('/skill/css')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('a[href*="/pdfs"]')).toBeVisible()
    await expect(page.locator('a[href*="/visuais"]')).toBeVisible()
  })
})

// ── /skill/css/visuais ────────────────────────────────────────────────────────

test.describe('/skill/css/visuais — componentes visuais', () => {
  test('carrega sem erros', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/skill/css/visuais')
    await page.waitForLoadState('networkidle')

    expect(errors).toHaveLength(0)
  })

  test('exibe o heading da página de visuais', async ({ page }) => {
    await page.goto('/skill/css/visuais')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('h1')).toContainText('CSS')
  })

  test('exibe a navegação dos visuais com pelo menos um botão', async ({ page }) => {
    await page.goto('/skill/css/visuais')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    // Botões de navegação dos 12 visuais — busca por títulos específicos de CSS
    const buttons = page.locator('button').filter({
      hasText: /cascade|box model|unidades|flexbox|grid|especificidade|seletores|stacking|anti.patterns|container|anima/i,
    })
    const count = await buttons.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('o primeiro visual renderiza conteúdo', async ({ page }) => {
    await page.goto('/skill/css/visuais')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    const content = await page.locator('main, .shell, [class*="shell"]').innerText()
    expect(content.length).toBeGreaterThan(100)
  })
})

// ── /skill/css/pdfs ───────────────────────────────────────────────────────────

test.describe('/skill/css/pdfs — cards de PDF', () => {
  test('carrega sem erros', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/skill/css/pdfs')
    await page.waitForLoadState('networkidle')

    expect(errors).toHaveLength(0)
  })

  test('exibe o heading da página de PDFs', async ({ page }) => {
    await page.goto('/skill/css/pdfs')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('h1')).toContainText('CSS')
  })

  test('exibe os 6 cards de PDF', async ({ page }) => {
    await page.goto('/skill/css/pdfs')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    for (const title of ['Q&A Review', 'CheatSheet', 'Mnemônicos', 'Anti-patterns', 'Mind Map', 'Receitas Modernas']) {
      await expect(page.getByText(title, { exact: true }).first()).toBeVisible()
    }
  })

  test('clique no card Q&A abre o modal de PDF', async ({ page }) => {
    await page.goto('/skill/css/pdfs')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    await page.getByText('Abrir PDF →').first().click()
    await expect(page.getByText('✕ Fechar')).toBeVisible({ timeout: 8000 })
  })
})

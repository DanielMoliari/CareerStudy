import { test, expect } from '@playwright/test'

// ── /skill/html ───────────────────────────────────────────────────────────────

test.describe('/skill/html — página principal', () => {
  test('carrega sem erros e exibe o nome da skill', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/skill/html')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('h1')).toContainText('HTML')
    expect(errors).toHaveLength(0)
  })

  test('exibe os botões de navegação para visuais e PDFs', async ({ page }) => {
    await page.goto('/skill/html')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('a[href*="/pdfs"]')).toBeVisible()
    await expect(page.locator('a[href*="/visuais"]')).toBeVisible()
  })
})

// ── /skill/html/visuais ───────────────────────────────────────────────────────

test.describe('/skill/html/visuais — componentes visuais', () => {
  test('carrega sem erros', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/skill/html/visuais')
    await page.waitForLoadState('networkidle')

    expect(errors).toHaveLength(0)
  })

  test('exibe o heading da página de visuais', async ({ page }) => {
    await page.goto('/skill/html/visuais')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('h1')).toContainText('HTML')
  })

  test('exibe os botões de navegação dos visuais HTML', async ({ page }) => {
    await page.goto('/skill/html/visuais')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    // Visuais específicos de HTML que devem aparecer na nav
    const buttons = page.locator('button').filter({
      hasText: /critical rendering|sem.ntica|accessibility tree|acessibilidade|head|meta tags|formul.rios|anti.patterns|imagens otim|resource hints|web components/i,
    })
    const count = await buttons.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('o primeiro visual renderiza conteúdo', async ({ page }) => {
    await page.goto('/skill/html/visuais')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    const content = await page.locator('main, .shell, [class*="shell"]').innerText()
    expect(content.length).toBeGreaterThan(100)
  })

  test('navegação entre visuais funciona — Anatomia do head', async ({ page }) => {
    await page.goto('/skill/html/visuais')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    // Clica no botão do visual "Anatomia do <head>"
    const headBtn = page.locator('button').filter({ hasText: /anatomia do/i }).first()
    if (await headBtn.count() > 0) {
      await headBtn.click()
      await page.waitForTimeout(500)
      // O visual deve mostrar texto sobre charset, viewport, preconnect etc
      const text = await page.locator('body').innerText()
      expect(text).toMatch(/charset|viewport|preconnect/i)
    }
  })

  test('navegação entre visuais funciona — Web Components', async ({ page }) => {
    await page.goto('/skill/html/visuais')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    const wcBtn = page.locator('button').filter({ hasText: /web components/i }).first()
    if (await wcBtn.count() > 0) {
      await wcBtn.click()
      await page.waitForTimeout(500)
      const text = await page.locator('body').innerText()
      expect(text).toMatch(/template|shadow|slot|customElements/i)
    }
  })
})

// ── /skill/html/pdfs ──────────────────────────────────────────────────────────

test.describe('/skill/html/pdfs — cards de PDF', () => {
  test('carrega sem erros', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/skill/html/pdfs')
    await page.waitForLoadState('networkidle')

    expect(errors).toHaveLength(0)
  })

  test('exibe o heading da página de PDFs', async ({ page }) => {
    await page.goto('/skill/html/pdfs')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('h1')).toContainText('HTML')
  })

  test('exibe os 5 cards de PDF', async ({ page }) => {
    await page.goto('/skill/html/pdfs')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    for (const title of ['Q&A Review', 'CheatSheet', 'Mnemônicos', 'Anti-patterns', 'Mind Map']) {
      await expect(page.getByText(title, { exact: true }).first()).toBeVisible()
    }
  })

  test('clique no card Q&A abre o modal de PDF', async ({ page }) => {
    await page.goto('/skill/html/pdfs')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    await page.getByText('Abrir PDF →').first().click()
    await expect(page.getByText('✕ Fechar')).toBeVisible({ timeout: 8000 })
  })
})

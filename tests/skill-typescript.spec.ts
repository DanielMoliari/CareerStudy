import { test, expect } from '@playwright/test'

// ── /skill/typescript ─────────────────────────────────────────────────────────

test.describe('/skill/typescript — página principal', () => {
  test('carrega sem erros e exibe o nome da skill', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/skill/typescript')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('h1')).toContainText('TypeScript')
    expect(errors).toHaveLength(0)
  })

  test('exibe links para sub-rotas de PDFs e visuais', async ({ page }) => {
    await page.goto('/skill/typescript')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('a[href*="/pdfs"]')).toBeVisible()
    await expect(page.locator('a[href*="/visuais"]')).toBeVisible()
  })
})

// ── /skill/typescript/visuais ─────────────────────────────────────────────────

test.describe('/skill/typescript/visuais — componentes visuais', () => {
  test('carrega sem erros', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/skill/typescript/visuais')
    await page.waitForLoadState('networkidle')

    expect(errors).toHaveLength(0)
  })

  test('exibe o heading da página de visuais', async ({ page }) => {
    await page.goto('/skill/typescript/visuais')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('h1')).toContainText('TypeScript')
  })

  test('exibe os botões de navegação dos visuais (VisuaisShell)', async ({ page }) => {
    await page.goto('/skill/typescript/visuais')
    await page.waitForLoadState('networkidle')

    // Aguarda o componente dinâmico (no-SSR) montar
    await page.waitForTimeout(2000)

    // Verifica que pelo menos um dos botões da nav é visível
    // Não checamos número exato porque a nav pode evoluir.
    const buttons = page.locator('button').filter({
      hasText: /sistema|hierarquia|narrowing|utility|generics|conditional|mapped|react|anti.patterns|tsconfig|evolução/i,
    })
    const count = await buttons.count()
    expect(count).toBeGreaterThanOrEqual(1)
  })

  test('o primeiro visual renderiza conteúdo', async ({ page }) => {
    await page.goto('/skill/typescript/visuais')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    // O carrossel de conceitos deve exibir conteúdo significativo
    const content = await page.locator('main, .shell, [class*="shell"]').innerText()
    expect(content.length).toBeGreaterThan(100)
  })
})

// ── /skill/typescript/pdfs ────────────────────────────────────────────────────

test.describe('/skill/typescript/pdfs — cards de PDF', () => {
  test('carrega sem erros', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', err => errors.push(err.message))

    await page.goto('/skill/typescript/pdfs')
    await page.waitForLoadState('networkidle')

    expect(errors).toHaveLength(0)
  })

  test('exibe o heading da página de PDFs', async ({ page }) => {
    await page.goto('/skill/typescript/pdfs')
    await page.waitForLoadState('networkidle')

    await expect(page.locator('h1')).toContainText('TypeScript')
  })

  test('exibe os cards de PDF específicos de TypeScript', async ({ page }) => {
    await page.goto('/skill/typescript/pdfs')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    // Cards específicos do ecossistema TypeScript
    for (const title of [
      'Q&A Review',
      'CheatSheet',
      'Utility Types Reference',
      'Guia de Generics',
      'tsconfig Reference',
      'Erros Comuns do tsc',
      'Anti-patterns',
      'Mnemônicos',
    ]) {
      await expect(page.getByText(title, { exact: true }).first()).toBeVisible()
    }
  })

  test('clique no card Q&A abre o modal de PDF', async ({ page }) => {
    await page.goto('/skill/typescript/pdfs')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    await page.getByText('Abrir PDF →').first().click()

    // Modal aparece com botão Fechar
    await expect(page.getByText('✕ Fechar')).toBeVisible({ timeout: 8000 })
  })
})

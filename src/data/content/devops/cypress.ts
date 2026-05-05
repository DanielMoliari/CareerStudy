import type { SkillContent } from '@/types'

const cypress: SkillContent = {
  tagline: "Framework E2E para browser — DX excelente, UI runner com time-travel debug.",
  why: "Cypress dominou E2E por anos com sua UI interativa e time-travel. Perdeu espaço para Playwright em 2024-2025 mas ainda está em milhares de repos. Vale saber navegar, entender limitações (só Chromium-based por padrão) e quando migrar.",
  gotchas: [
    "cy.wait(2000) é antipattern — use cy.intercept() + cy.wait('@alias') para esperar a requisição real.",
    "Cypress não suporta múltiplas abas nativamente — fluxos que abrem nova aba exigem workaround (cy.stub em window.open).",
    "Testes flaky por timing: cy.get() por padrão espera 4s, mas pode ser curto para app lenta. Ajuste defaultCommandTimeout globalmente.",
    "Cypress Component Testing e Cypress E2E são setups diferentes — não misturar cypress.config.ts sem separar as specs.",
  ],
  resources: [
    { title: "Cypress Documentation", url: "https://docs.cypress.io/", kind: "docs" },
    { title: "Cypress Best Practices", url: "https://docs.cypress.io/guides/references/best-practices", kind: "docs" },
  ],
}

export default cypress

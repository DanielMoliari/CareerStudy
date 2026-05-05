import type { SkillContent } from '@/types'

const cheerio: SkillContent = {
    tagline: 'jQuery-like no servidor para parsear e extrair dados de HTML em Node.js.',
    why: 'Web scraping de páginas estáticas (sem JavaScript client-side) é rápido e leve com Cheerio. Alternativa a Puppeteer quando não precisa renderizar JS.',
    gotchas: [
      'Cheerio não executa JavaScript — páginas renderizadas no client (React, Vue, Angular) aparecem vazias. Use Playwright ou Puppeteer nesses casos.',
      'Sites bloqueiam por User-Agent, rate ou IP — rotacione headers e use delays entre requests.',
      'HTML malformado do mundo real quebra seletores — teste em múltiplas páginas antes de confiar.',
      'Scraping pode violar Termos de Serviço — verifique robots.txt e ToS antes de usar em produção.',
    ],
    summary: 'Cheerio carrega HTML como string e expõe API idêntica ao jQuery: `$("selector")`, `.text()`, `.attr()`, `.find()`, `.each()`. Ideal para extrair dados de páginas estáticas em pipelines de ETL, RAG ingestion e monitoring de preços. Combina com `axios` ou `node-fetch` para baixar as páginas.',
    resources: [
      { title: 'Cheerio docs', url: 'https://cheerio.js.org/', kind: 'docs' },
      { title: 'Cheerio — GitHub', url: 'https://github.com/cheeriojs/cheerio', kind: 'docs' },
    ],
  }

export default cheerio

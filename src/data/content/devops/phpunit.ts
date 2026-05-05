import type { SkillContent } from '@/types'

const phpunit: SkillContent = {
  tagline: "Framework de testes unitários para PHP — padrão xUnit adaptado para o ecossistema PHP.",
  why: "PHPUnit é o test runner dominante em PHP/Laravel. Aparece em qualquer projeto PHP legado ou atual. Vale o mínimo para navegar em código PHP existente.",
  gotchas: [
    "setUp() e tearDown() rodam antes e depois de cada teste — não confundir com setUpBeforeClass() (uma vez por classe).",
    "Mocking via getMockBuilder é verboso comparado a frameworks modernos — Mockery é alternativa mais expressiva.",
    "Testes de integração lentos em PHPUnit sem isolamento de banco — use transactions com rollback (DatabaseTransactions no Laravel) para acelerar.",
  ],
  resources: [
    { title: "PHPUnit Documentation", url: "https://phpunit.de/documentation.html", kind: "docs" },
  ],
}

export default phpunit

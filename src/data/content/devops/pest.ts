import type { SkillContent } from '@/types'

const pest: SkillContent = {
  tagline: "Test runner moderno para PHP com syntax elegante — alternativa expressiva ao PHPUnit.",
  why: "Pest (criado por Nuno Maduro) virou o padrão em projetos Laravel novos. Roda em cima do PHPUnit mas com syntax muito mais limpa — it(), expect(), dataset(). Vale preferir em projeto Laravel novo.",
  gotchas: [
    "Pest roda em cima do PHPUnit — se o projeto usa PHPUnit, Pest é zero custo de adoção. Mas misturar estilo nos dois é confuso.",
    "arch() helpers (Pest 2+) fazem validações de arquitetura (sem classes finais, sem uso de funções globais) — poderoso mas precisa ser calibrado para o projeto.",
    "Datasets em Pest são mais limpos que @dataProvider do PHPUnit mas a nomenclatura de test no output muda — ajuste CI se houver filtros por nome de teste.",
  ],
  resources: [
    { title: "Pest PHP Documentation", url: "https://pestphp.com/docs/", kind: "docs" },
  ],
}

export default pest

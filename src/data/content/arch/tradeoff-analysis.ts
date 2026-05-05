import type { SkillContent } from '@/types'

const tradeoffAnalysis: SkillContent = {
  tagline: 'Justificar decisão técnica nomeando o que você ganha e o que está sacrificando.',
  why: 'O que diferencia senior de pleno em entrevista não e saber tecnologia, e saber DECIDIR. Tradeoff analysis e a habilidade meta. Entrevistador testa: você defende decisão com número/contexto ou repete blog post?',
  summary: 'Tradeoff analysis e o exercício sistematico de comparar opcoes nomeando dimensões (custo, latência, complexidade, time-to-market, manutenção, risco) e contextualizando ao caso. Não existe "melhor" absoluto — existe melhor pro contexto. Senior nomeia o que está sacrificando, quantifica quando possível, e revisita decisão quando contexto muda. Frameworks úteis: ADR (Architecture Decision Record), CAP, "the hard parts", custo de mudança vs custo de erro.',
  keypoints: [
    { title: 'Dimensoes básicas', body: 'Custo (dinheiro + dev time), latência, throughput, disponibilidade, consistencia, complexidade operacional, segurança, observabilidade, time-to-market, fit com time atual, fit com stack existente.' },
    { title: 'Reversibilidade', body: 'Decisão reversivel (escolha de framework de teste) merece pouco debate. Decisão irreversivel ou cara de mudar (banco, cloud provider, linguagem core) merece muito debate. Bezos: "two-way doors vs one-way doors".' },
    { title: 'Custo total de propriedade', body: 'Solução "gratis" pode ter alto custo operacional. Solução paga pode liberar time pra entregar valor. Some salario, on-call, suporte, oportunidade perdida.' },
    { title: 'Quantificar', body: 'Número ganha de opiniao. "Postgres aguenta 50K writes/s, esperamos 5K, sobra 10x" e mais forte que "Postgres aguenta". Estima antes de decidir.' },
    { title: 'ADR', body: 'Architecture Decision Record: documenta contexto, decisão, alternativas consideradas, consequencias. Permite revisitar quando contexto muda. Padrão em time senior.' },
    { title: 'Fallback escolhas', body: 'Toda decisão deve ter "como saio dela?". Lock-in em vendor sem plano de saida e armadilha. Mesmo que nunca execute, pensar na saida revela acoplamento oculto.' },
    { title: 'Falacias comuns', body: 'Cargo cult ("Netflix usa então usamos"), shiny new tech, sunk cost ("já investimos muito"), early optimization, over-engineering pra escala que não tem.' },
  ],
  gotchas: [
    'Decidir por preferência pessoal disfarcada de técnica — "prefiro Mongo" sem justificativa contextual.',
    'Comparar opcao em estado ideal vs estado real do que você já tem — sempre o novo brilha mais. Avalie no mesmo nível de maturidade.',
    'Esquecer fator humano — time conhece Java mas você escolhe Go porque e "melhor" — vai pagar 6 meses de curva.',
    'Análise paralisia — debate eterno por decisão reversivel barata. Decida e siga, ajuste depois.',
    'Não documentar — 6 meses depois ninguem lembra por que escolheu X, e o contexto que justificava mudou.',
  ],
  interview: [
    { q: 'Como você estrutura uma análise de tradeoff em entrevista?', a: '<p>Frame em <strong>3 passos</strong>: (1) clarifico o contexto e o que e crítico (latência? custo? time-to-market?); (2) listo opcoes plausiveis com pros/contras nas dimensões que importam; (3) escolho com justificativa explícita do que estou sacrificando.</p><p>Exemplo: <em>"Vou de Postgres em vez de Dynamo aqui porque temos JOIN frequente e o volume cabe até uns 5TB. Sacrifico escala horizontal fácil — quando passar dos 2TB, revisito particionamento ou migração."</em></p><p>Entrevistador adora ver que você <strong>nomeia o sacrificio</strong>, não finge que tem solução perfeita.</p>' },
    { q: 'Conta uma decisão que você tomou e revisitou depois.', a: '<p>Comecei um projeto com Mongo achando que schema ia variar muito. 1 ano depois, schema estabilizou e a falta de transação multi-doc virou dor real (relatório inconsistente, dificuldade de reportar pra contabilidade).</p><p>Migrei pra Postgres usando dual-write + backfill, custou 3 meses. <strong>Licao</strong>: o tradeoff que parecia estável mudou (schema estabilizou, requisito de relatório surgiu). ADR original ajudou a reconstituir o contexto e justificar migração pro time novo. Hoje, default e Postgres até prova em contrario.</p>' },
    { q: 'Como você decide entre build vs buy?', a: '<p>Comparo: custo total de build (dev + manutenção + on-call por 3+ anos), custo de licenca/saas, time-to-market, fit estrategico (e core do negocio?), risco de lock-in.</p><p>Heurística: se não e <strong>core competitive advantage</strong>, compra. Time deve gastar energia onde diferencia produto. Build de auth, billing, monitoring quase sempre da prejuizo. Build de algo que e o produto (search engine, no Google) faz sentido.</p>' },
    { q: 'Quando a decisão "errada" e aceitavel?', a: '<p>Quando o custo de acertar agora e maior que o custo de mudar depois. Em MVP, escolho stack que <strong>time conhece</strong> mesmo que não seja "ideal" — entrega rápida importa mais que arquitetura perfeita.</p><p>Em decisão reversivel, prefiro "good enough now" a "perfect later". Decisão irreversivel (banco, schema core, cloud provider) merece mais cuidado upfront porque mudar e caro.</p>' },
    { q: 'Como você convence um time que prefere outra tecnologia?', a: '<p>Não tento "ganhar" — busco <strong>alinhar critérios</strong>. Pergunto o que e crítico (latência? familiaridade? custo?), proponho POC pequeno comparando sob esses critérios, deixo número falar.</p><p>Se mesmo assim divergem, ADR registra a decisão com alternativas e razoes. As vezes você perde a discussão e e melhor assim — diversidade de opiniao captura blind spots. O importante e <strong>decisão informada</strong>, não "minha proposta venceu".</p>' },
  ],
  resources: [
    { title: 'Software Architecture: The Hard Parts', url: 'https://www.oreilly.com/library/view/software-architecture-the/9781492086888/', kind: 'livro' },
    { title: 'Designing Data-Intensive Applications', url: 'https://dataintensive.net/', kind: 'livro' },
    { title: 'ADR (Architecture Decision Records)', url: 'https://adr.github.io/', kind: 'docs' },
    { title: 'Martin Fowler — Architecture', url: 'https://martinfowler.com/architecture/', kind: 'artigo' },
    { title: 'Thoughtworks Tech Radar', url: 'https://www.thoughtworks.com/radar', kind: 'artigo' },
  ],
}

export default tradeoffAnalysis

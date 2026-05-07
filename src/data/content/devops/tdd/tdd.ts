import type { SkillContent } from '@/types'

const tdd: SkillContent = {
  tagline: "Test-Driven Development — escrever o teste antes do código, ciclo Red-Green-Refactor.",
  why: "TDD aparece em entrevista como filtro de disciplina, design e maturidade. Sênior precisa explicar quando vale (lógica não trivial, refactor seguro, bug fix) e quando NÃO vale (UI exploratória, protótipo, integração com API desconhecida). É sobre design, não sobre cobertura — código testável tende a ser desacoplado, e o teste vira documentação executável. Em times maduros, TDD é cultura e diferencia quem entende design emergente de quem só clica 'verde'. Cai em entrevista de backend, fullstack e em qualquer vaga com expectativa de qualidade.",
  prerequisite: "Saber escrever teste unitário com qualquer framework (Jest, Vitest, JUnit, PyTest, RSpec). Conhecer fundamentos de OO ou programação funcional. Entender mock, stub e injeção de dependência. Se você nunca escreveu um teste em projeto profissional, faça isso primeiro — TDD é teste com timing diferente, não outra coisa.",
  summary: "TDD foi formalizado por Kent Beck no livro Test-Driven Development by Example (2002). O ciclo tem 3 fases curtas (1-5 minutos cada): RED (escreve um teste que falha porque o comportamento ainda não existe — o teste é o spec), GREEN (escreve o MÍNIMO de código para passar — pode ser feio, hardcoded, qualquer coisa), REFACTOR (limpa o código sem mudar comportamento, com a suite verde como rede de segurança). O ganho real não é cobertura — é design: código testável tende a ser desacoplado, com responsabilidades explícitas. A pirâmide de testes (Mike Cohn) orienta o mix: muitos unitários (base, rápidos), alguns de integração (meio, fronteiras), poucos E2E (topo, lentos e caros). Os princípios F.I.R.S.T (Fast, Independent, Repeatable, Self-validating, Timely) descrevem o que é um bom teste. Variantes: BDD (Cucumber/Gherkin com linguagem de negócio), ATDD (testes de aceitação primeiro), Property-Based Testing (gera centenas de inputs aleatórios validando invariantes).",
  howToStudy: "<strong>Tem 30 minutos antes de uma entrevista?</strong> Revise o ciclo Red-Green-Refactor, F.I.R.S.T, pirâmide de testes. Treine as Q&As de 'quando NÃO usar TDD' e 'mocks vs fakes' em voz alta. Esses são os filtros mais comuns.<br><br><strong>Tem um fim de semana?</strong> Faça os katas FizzBuzz, Bowling Game e String Calculator em TDD puro — escreva o teste primeiro, jamais antecipe código. Anote quantas vezes você quebrou a regra. Leia o capítulo 1 do TDD by Example (multi-currency money) — é o exemplo canônico.<br><br><strong>Tem uma semana?</strong> Implemente uma feature real (autenticação, parser de CSV, máquina de estados) só com TDD. Adicione mutation testing (Stryker para JS) e veja a qualidade dos seus asserts. Leia Working Effectively with Legacy Code (Feathers) para aprender a aplicar TDD em base sem testes — isso é o caso real do dia a dia.",
  diagrams: [
    {
      title: "Ciclo Red-Green-Refactor — passo a passo",
      html: `<style>
.tdd1-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.tdd1-step{border-radius:10px;padding:14px 16px;border:1.5px solid;margin-bottom:10px;position:relative}
.tdd1-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(100,116,139,.5)}
.tdd1-tip:hover .tdd1-tb{display:block}
.tdd1-tb{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:240px;pointer-events:none;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.tdd1-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
@keyframes tdd1-pulse-red{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.3)}50%{box-shadow:0 0 0 6px rgba(239,68,68,0)}}
@keyframes tdd1-pulse-grn{0%,100%{box-shadow:0 0 0 0 rgba(74,222,128,.3)}50%{box-shadow:0 0 0 6px rgba(74,222,128,0)}}
@keyframes tdd1-pulse-blu{0%,100%{box-shadow:0 0 0 0 rgba(36,150,237,.3)}50%{box-shadow:0 0 0 6px rgba(36,150,237,0)}}
.tdd1-pulse-red{animation:tdd1-pulse-red 2s ease-in-out infinite}
.tdd1-pulse-grn{animation:tdd1-pulse-grn 2s ease-in-out infinite}
.tdd1-pulse-blu{animation:tdd1-pulse-blu 2s ease-in-out infinite}
</style>
<div class="tdd1-wrap">
<p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Ciclo Red-Green-Refactor — exemplo: implementar split(str, sep)</p>
<p style="color:#475569;font-size:10px;margin:0 0 16px">Cada fase dura 1-5 minutos. Se passou disso, está fazendo errado — passos pequenos demais não doem; grandes demais perdem o feedback.</p>

<div class="tdd1-step tdd1-pulse-red" style="border-color:rgba(239,68,68,.4);background:rgba(239,68,68,.04)">
  <div style="font-size:9px;color:#ef4444;letter-spacing:.12em;font-weight:700;margin-bottom:6px">① RED — escreva o teste que FALHA</div>
  <div style="font-size:11px;color:#94a3b8;line-height:1.7">
    <span class="tdd1-tip">Por que falhar primeiro?<span class="tdd1-tb">Garante que o teste mede algo real. Teste que passa antes de implementar pode estar testando errado, faltando assert, ou cobrindo um caminho que já existia. Veja o teste vermelho com seus olhos.</span></span> O teste é a especificação executável.
    <pre style="background:#020617;border:1px solid #334155;border-radius:6px;padding:10px 12px;margin:8px 0 0;font-size:10.5px;color:#94a3b8;overflow-x:auto">test('split divide por separador', () =&gt; {
expect(split('a,b,c', ',')).toEqual(['a','b','c'])
})

// rodar: <span style="color:#ef4444">FAIL — split is not defined</span></pre>
  </div>
</div>

<div style="text-align:center;color:#475569;font-size:14px;margin:0 0 4px">▼</div>

<div class="tdd1-step tdd1-pulse-grn" style="border-color:rgba(74,222,128,.4);background:rgba(74,222,128,.04)">
  <div style="font-size:9px;color:#4ade80;letter-spacing:.12em;font-weight:700;margin-bottom:6px">② GREEN — código MÍNIMO para passar (pode ser feio)</div>
  <div style="font-size:11px;color:#94a3b8;line-height:1.7">
    <span class="tdd1-tip">Mínimo de verdade<span class="tdd1-tb">Use return ['a','b','c'] hardcoded se for o suficiente. O próximo teste vai forçar generalização. 'Fake it till you make it' — Kent Beck. Tomada de decisão é guiada por testes, não por especulação.</span></span> Sem antecipar requisitos. Pode ser hardcoded.
    <pre style="background:#020617;border:1px solid #334155;border-radius:6px;padding:10px 12px;margin:8px 0 0;font-size:10.5px;color:#94a3b8;overflow-x:auto">function split(str, sep) {
return str.split(sep)   // o mínimo — usa o split nativo
}

// rodar: <span style="color:#4ade80">PASS</span></pre>
  </div>
</div>

<div style="text-align:center;color:#475569;font-size:14px;margin:0 0 4px">▼</div>

<div class="tdd1-step tdd1-pulse-blu" style="border-color:rgba(36,150,237,.4);background:rgba(36,150,237,.04)">
  <div style="font-size:9px;color:#2496ED;letter-spacing:.12em;font-weight:700;margin-bottom:6px">③ REFACTOR — limpa sem mudar comportamento (suite verde)</div>
  <div style="font-size:11px;color:#94a3b8;line-height:1.7">
    <span class="tdd1-tip">Refactor de duas direções<span class="tdd1-tb">Refatora código de produção (extract function, rename, simplify) E o teste (extract setup, rename, table-driven). Teste é código primeira classe — merece a mesma manutenção.</span></span> Só nesta fase você melhora estrutura.
    <pre style="background:#020617;border:1px solid #334155;border-radius:6px;padding:10px 12px;margin:8px 0 0;font-size:10.5px;color:#94a3b8;overflow-x:auto">// extrai constantes, renomeia, organiza casos
const SEP_DEFAULT = ','
function split(str, sep = SEP_DEFAULT) {
return str.split(sep)
}

// rodar: <span style="color:#2496ED">ainda PASS — comportamento preservado</span></pre>
  </div>
</div>

<div style="text-align:center;color:#475569;font-size:14px;margin:0 0 4px">↻ próxima iteração</div>

<div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:11px 14px;font-size:11px;color:#94a3b8;line-height:1.7">
  <strong style="color:#fbbf24">Próximo Red:</strong> teste de edge case (string vazia, sep ausente, múltiplos seps consecutivos). Cada novo Red expande o spec — Green generaliza — Refactor mantém limpo.
</div>
</div>`,
      caption: "O ciclo é curto por design. Se RED dura mais de 5 minutos, o teste é grande demais — quebre. Se GREEN tem complexidade, você está antecipando requisito sem teste forçando — recue. REFACTOR sem suite verde é só edição perigosa. Os 3 passos juntos são o que dá o ganho de design.",
    },
    {
      title: "Pirâmide de testes — custo, velocidade, confiança",
      html: `<style>
.tdd2-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.tdd2-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(100,116,139,.5)}
.tdd2-tip:hover .tdd2-tb{display:block}
.tdd2-tb{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:230px;pointer-events:none;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.tdd2-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.tdd2-row{display:flex;align-items:center;gap:12px;margin-bottom:6px}
</style>
<div class="tdd2-wrap">
<p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Pirâmide de testes (Mike Cohn) — quanto vs onde</p>
<p style="color:#475569;font-size:10px;margin:0 0 16px">Mais embaixo: rápidos, baratos, focados. Mais em cima: lentos, caros, fiéis.</p>

<div style="display:grid;grid-template-columns:60px 1fr 100px 100px 90px;gap:8px;align-items:center;padding-bottom:8px;border-bottom:1px solid #1e293b;margin-bottom:8px">
  <div></div>
  <div style="font-size:9px;color:#64748b;letter-spacing:.1em;text-transform:uppercase;font-weight:600">camada</div>
  <div style="font-size:9px;color:#64748b;letter-spacing:.1em;text-transform:uppercase;text-align:center;font-weight:600">qtd</div>
  <div style="font-size:9px;color:#64748b;letter-spacing:.1em;text-transform:uppercase;text-align:center;font-weight:600">velocidade</div>
  <div style="font-size:9px;color:#64748b;letter-spacing:.1em;text-transform:uppercase;text-align:center;font-weight:600">custo</div>
</div>

<div class="tdd2-row" style="background:rgba(239,68,68,.06);border-radius:8px;padding:10px 12px">
  <div style="font-size:11px;color:#ef4444;font-weight:700">▲</div>
  <div>
    <div style="font-size:11px;color:#ef4444;font-weight:700">E2E / UI</div>
    <div style="font-size:10px;color:#64748b;line-height:1.5"><span class="tdd2-tip">Roda app real<span class="tdd2-tb">Browser real (Playwright, Cypress) ou app mobile real. Sobe banco, queue, todos os serviços. Lentos (segundos a minutos) e flaky se mal escritos.</span></span> end-to-end. Valida fluxo completo do usuário.</div>
  </div>
  <div style="font-size:11px;color:#94a3b8;text-align:center;font-weight:600">~10%</div>
  <div style="font-size:11px;color:#ef4444;text-align:center">⏱⏱⏱⏱</div>
  <div style="font-size:11px;color:#ef4444;text-align:center">$$$$</div>
</div>

<div class="tdd2-row" style="background:rgba(245,158,11,.06);border-radius:8px;padding:10px 12px">
  <div style="font-size:11px;color:#f59e0b;font-weight:700">▲</div>
  <div>
    <div style="font-size:11px;color:#f59e0b;font-weight:700">Integração</div>
    <div style="font-size:10px;color:#64748b;line-height:1.5"><span class="tdd2-tip">Fronteiras reais<span class="tdd2-tb">Banco real (testcontainers, sqlite in-memory), HTTP real para APIs internas, file system real. Mocka só recursos externos pagos (stripe, twilio).</span></span> — DB, HTTP, queue. Foca contratos.</div>
  </div>
  <div style="font-size:11px;color:#94a3b8;text-align:center;font-weight:600">~20%</div>
  <div style="font-size:11px;color:#f59e0b;text-align:center">⏱⏱⏱</div>
  <div style="font-size:11px;color:#f59e0b;text-align:center">$$$</div>
</div>

<div class="tdd2-row" style="background:rgba(74,222,128,.06);border-radius:8px;padding:10px 12px">
  <div style="font-size:11px;color:#4ade80;font-weight:700">▲▲</div>
  <div>
    <div style="font-size:11px;color:#4ade80;font-weight:700">Unitários</div>
    <div style="font-size:10px;color:#64748b;line-height:1.5"><span class="tdd2-tip">Funções/classes isoladas<span class="tdd2-tb">Mocka todas as dependências externas (DB, HTTP, clock). Roda em milissegundos. Valida lógica pura, regras de negócio, edge cases.</span></span> — lógica pura, regras de negócio.</div>
  </div>
  <div style="font-size:11px;color:#94a3b8;text-align:center;font-weight:600">~70%</div>
  <div style="font-size:11px;color:#4ade80;text-align:center">⏱</div>
  <div style="font-size:11px;color:#4ade80;text-align:center">$</div>
</div>

<div style="margin-top:14px;background:rgba(239,68,68,.04);border:1px solid rgba(239,68,68,.2);border-radius:8px;padding:11px 14px">
  <div style="font-size:10px;color:#ef4444;font-weight:700;margin-bottom:5px">⚠ Antipattern: Ice Cream Cone (pirâmide invertida)</div>
  <div style="font-size:10px;color:#94a3b8;line-height:1.6">Muito E2E, pouco unitário. Suite leva 40min, falha aleatório, ninguém sabe onde olhar. Causa: equipe pula direto pra E2E porque não confia na lógica, ou usa E2E pra cobrir buracos do design.</div>
</div>

<div style="margin-top:8px;background:rgba(74,222,128,.04);border:1px solid rgba(74,222,128,.2);border-radius:8px;padding:11px 14px">
  <div style="font-size:10px;color:#4ade80;font-weight:700;margin-bottom:5px">✓ Variação: Testing Trophy (Kent C. Dodds)</div>
  <div style="font-size:10px;color:#94a3b8;line-height:1.6">Para frontend moderno: estática (TypeScript, ESLint) > unitário > <strong>integração (mais peso)</strong> > E2E. Argumento: integração testa unidade colaborando — pega bugs que unitários sozinhos perdem.</div>
</div>
</div>`,
      caption: "A pirâmide é heurística, não dogma. Ratio 70/20/10 é orientação. O importante é o gradiente: muitos rápidos focados embaixo, poucos lentos abrangentes em cima. Inversão (ice cream cone) é o que vai atrasar seu CI e flake sua suite.",
    },
    {
      title: "F.I.R.S.T — princípios de um bom teste",
      html: `<style>
.tdd3-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.tdd3-card{background:#1e293b;border:1px solid #334155;border-radius:10px;padding:14px 16px}
.tdd3-letter{font-size:24px;font-weight:800;letter-spacing:.05em;display:inline-block;width:32px}
</style>
<div class="tdd3-wrap">
<p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">F.I.R.S.T — checklist de qualidade de teste (Robert Martin)</p>
<p style="color:#475569;font-size:10px;margin:0 0 16px">Cada letra é uma propriedade que separa teste útil de teste teatro.</p>

<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px">
  <div class="tdd3-card" style="border-color:rgba(74,222,128,.3)">
    <div><span class="tdd3-letter" style="color:#4ade80">F</span><span style="font-size:13px;color:#e2e8f0;font-weight:700">ast</span></div>
    <div style="font-size:11px;color:#94a3b8;line-height:1.65;margin-top:6px">Roda em milissegundos. Suite inteira em segundos. Teste lento não roda — vira ritual ignorado.</div>
    <div style="font-size:10px;color:#64748b;margin-top:6px;line-height:1.5"><strong style="color:#4ade80">Como:</strong> mocka I/O (DB, HTTP, fs), evita sleep/wait, não usa setTimeout em produção.</div>
  </div>

  <div class="tdd3-card" style="border-color:rgba(36,150,237,.3)">
    <div><span class="tdd3-letter" style="color:#2496ED">I</span><span style="font-size:13px;color:#e2e8f0;font-weight:700">ndependent</span></div>
    <div style="font-size:11px;color:#94a3b8;line-height:1.65;margin-top:6px">Não depende de outro teste, nem da ordem de execução. Pode rodar isolado ou em paralelo.</div>
    <div style="font-size:10px;color:#64748b;margin-top:6px;line-height:1.5"><strong style="color:#2496ED">Como:</strong> setup/teardown isolado (beforeEach), zero estado global compartilhado, dados próprios.</div>
  </div>

  <div class="tdd3-card" style="border-color:rgba(245,158,11,.3)">
    <div><span class="tdd3-letter" style="color:#f59e0b">R</span><span style="font-size:13px;color:#e2e8f0;font-weight:700">epeatable</span></div>
    <div style="font-size:11px;color:#94a3b8;line-height:1.65;margin-top:6px">Mesmo resultado em qualquer máquina, qualquer momento, mesmo offline. Sem flake.</div>
    <div style="font-size:10px;color:#64748b;margin-top:6px;line-height:1.5"><strong style="color:#f59e0b">Como:</strong> sem rede externa, sem clock real (mock Date.now), sem ordem dependente, sem dado de produção.</div>
  </div>

  <div class="tdd3-card" style="border-color:rgba(167,139,250,.3)">
    <div><span class="tdd3-letter" style="color:#a78bfa">S</span><span style="font-size:13px;color:#e2e8f0;font-weight:700">elf-validating</span></div>
    <div style="font-size:11px;color:#94a3b8;line-height:1.65;margin-top:6px">Resultado é boolean: passa ou falha. Sem 'olhar log e julgar'. Assert claro e específico.</div>
    <div style="font-size:10px;color:#64748b;margin-top:6px;line-height:1.5"><strong style="color:#a78bfa">Como:</strong> expect explícito, mensagens descritivas, sem console.log como verificação.</div>
  </div>

  <div class="tdd3-card" style="border-color:rgba(251,113,133,.3);grid-column:1/-1">
    <div><span class="tdd3-letter" style="color:#fb7185">T</span><span style="font-size:13px;color:#e2e8f0;font-weight:700">imely</span></div>
    <div style="font-size:11px;color:#94a3b8;line-height:1.65;margin-top:6px">Escrito JUNTO com o código (TDD) ou imediatamente depois — não no fim do sprint, não 'quando der tempo'.</div>
    <div style="font-size:10px;color:#64748b;margin-top:6px;line-height:1.5"><strong style="color:#fb7185">Como:</strong> regra do time: PR sem teste = revisão bloqueada. Teste velho cresce divida igual código velho.</div>
  </div>
</div>

<div style="background:#020617;border:1px solid #1e3a5f;border-radius:8px;padding:12px 14px">
  <div style="font-size:9px;color:#2496ED;letter-spacing:.1em;font-weight:600;margin-bottom:8px;text-transform:uppercase">AAA — estrutura de cada teste</div>
  <div style="font-size:11px;color:#94a3b8;line-height:1.85">
    <strong style="color:#4ade80">Arrange</strong> — prepara entrada e dependências (mocks, fakes, dados) <br>
    <strong style="color:#fbbf24">Act</strong> — executa a ação que está sendo testada (1 chamada) <br>
    <strong style="color:#2496ED">Assert</strong> — valida o resultado (1 conceito por teste, múltiplos asserts ok)
  </div>
</div>
</div>`,
      caption: "F.I.R.S.T é checklist mental — antes de commitar um teste, varra as 5 propriedades. Falhar uma já é red flag. Falhar duas é teatro de teste — apaga e refaz.",
    },
  ],
  keypoints: [
    {
      title: "Red-Green-Refactor — o ciclo completo importa",
      body: "Sem o RED, você não garante que o teste falha pelo motivo certo (pode estar testando errado, faltando assert). Sem o REFACTOR, você acumula código feio com suite verde — 'green-without-refactor' é o pecado mais comum. O ciclo inteiro é que dá o ganho: design emergente vem da combinação dos 3.",
      code: `// 1. RED — teste falha
test('soma 2 números', () => {
expect(somar(2, 3)).toBe(5)
})
// FAIL: somar is not defined

// 2. GREEN — código mínimo
function somar(a, b) { return a + b }
// PASS

// 3. REFACTOR — limpa, organiza, renomeia
// (neste caso já está bom — pula refactor explícito)

// REPETIR para próximo comportamento
test('soma trata negativos', () => {
expect(somar(-2, 3)).toBe(1)
})`,
    },
    {
      title: "Teste como ferramenta de design",
      body: "Quando você escreve o teste primeiro, está usando o código antes dele existir. Se a API é ruim, você sente na hora — muitos parâmetros, dependência escondida, side effect difícil de mockar. Você ajusta antes de implementar. Código testável tende a ser desacoplado: dependências explícitas (passa por parâmetro/construtor, não import global), funções pequenas (assert focado), separação de I/O e lógica pura.",
      code: `// API ruim — difícil de testar (revela problema de design)
function processarPedido() {
const user = getCurrentUser()              // global escondido
const pedido = db.fetchPedido()            // I/O misturado com lógica
const total = pedido.itens.reduce(...)     // lógica
emailService.enviar(user, total)           // efeito colateral
}

// API boa — fácil de testar (design emergiu do TDD)
function calcularTotal(itens: Item[]): number {
return itens.reduce((acc, item) => acc + item.preco * item.qtd, 0)
}
// fácil testar: passa array, verifica número. zero mock necessário.`,
    },
    {
      title: "F.I.R.S.T — propriedades de um bom teste",
      body: "Fast (ms, suite roda em segundos), Independent (sem ordem, sem estado compartilhado), Repeatable (mesmo resultado em qualquer ambiente), Self-validating (passa/falha booleano, sem 'inspecionar log'), Timely (escrito junto com o código, não no fim do sprint). Falhar uma propriedade é red flag — duas é teatro de teste.",
      code: `// ❌ violando F.I.R.S.T
test('processa user', async () => {
await fetch('https://api.real.com')        // ❌ R: depende da rede
await new Promise(r => setTimeout(r, 1000)) // ❌ F: lento
console.log('check log')                   // ❌ S: não é self-validating
})

// ✓ respeitando F.I.R.S.T
test('processa user', () => {
// Arrange — mock isolado
const fakeApi = { get: vi.fn().mockResolvedValue({ id: 1 }) }
// Act
const result = processar(fakeApi, { id: 1 })
// Assert — explícito
expect(result.status).toBe('ok')
})`,
    },
    {
      title: "AAA — Arrange / Act / Assert",
      body: "Estrutura padrão de cada teste em 3 blocos visuais. Arrange prepara entradas e mocks. Act executa a ação testada (1 chamada principal). Assert valida o resultado (1 conceito por teste, múltiplos asserts ok). Separar com linha em branco torna o teste legível como spec executável.",
      code: `test('aplica desconto progressivo em pedido grande', () => {
// Arrange
const pedido = {
  itens: [{ preco: 100, qtd: 10 }],
  cliente: { tipo: 'gold' }
}

// Act
const total = calcularTotalComDesconto(pedido)

// Assert
expect(total).toBe(850)         // 1000 - 15% gold
expect(pedido.itens).toHaveLength(1)  // não mutou
})`,
    },
    {
      title: "Mocks vs Stubs vs Fakes vs Spies",
      body: "Stub = retorna valor canned (não verifica chamada). Mock = stub + verifica que foi chamado com X argumentos. Fake = implementação real simplificada (in-memory DB no lugar de Postgres). Spy = wrappa função real e registra chamadas (deixa executar normalmente). Use mock pra interação (notificou? chamou X?), fake pra estado (DB, cache), stub pra resposta simples, spy raramente.",
      code: `// Stub — só retorna valor
const stub = { fetchUser: () => ({ id: 1, name: 'Ana' }) }

// Mock — verifica chamada
const mock = vi.fn()
servico.processar(mock)
expect(mock).toHaveBeenCalledWith({ id: 1 })

// Fake — implementação simplificada (in-memory)
class InMemoryUserRepo {
users = new Map()
save(u) { this.users.set(u.id, u) }
find(id) { return this.users.get(id) }
}

// Spy — observa função real
const spy = vi.spyOn(console, 'log')
runApp()
expect(spy).toHaveBeenCalledTimes(2)`,
    },
    {
      title: "Pirâmide de testes — mix saudável",
      body: "Base: muitos unitários (~70%, rápidos, isolados, validam lógica pura). Meio: alguns integração (~20%, DB real ou in-memory, HTTP, valida contratos). Topo: poucos E2E (~10%, browser real, fluxo crítico do usuário). Inversão (mais E2E que unitário) é o antipattern 'ice cream cone' — CI demora 40min, flaky, ninguém sabe onde olhar quando quebra.",
      code: `// Unitário — função pura, ms, isolado
test('formatarMoeda', () => {
expect(formatarMoeda(1234.56)).toBe('R$ 1.234,56')
})

// Integração — DB real (testcontainers ou sqlite)
test('repositorio salva e recupera user', async () => {
const repo = new UserRepository(db)
await repo.save({ id: 1, name: 'Ana' })
const found = await repo.findById(1)
expect(found?.name).toBe('Ana')
})

// E2E — Playwright/Cypress, fluxo completo
test('checkout completo', async ({ page }) => {
await page.goto('/produtos')
await page.click('text=Adicionar ao carrinho')
await page.click('text=Finalizar')
await expect(page).toHaveURL('/sucesso')
})`,
    },
    {
      title: "Teste comportamento, não implementação",
      body: "Acoplar teste à implementação interna (verificar que método X chamou Y, ou que estado interno é Z) é receita de teste frágil — quebra a cada refactor mesmo sem mudar comportamento. Foque no contrato observável: dado entrada X, retorno é Y. Se você muda a implementação e o teste quebra mas o comportamento está igual, o teste é o bug.",
      code: `// ❌ Acoplado a implementação — quebra em refactor
test('login chama validateEmail e validatePassword', () => {
const valEmail = vi.spyOn(svc, 'validateEmail')
const valPwd = vi.spyOn(svc, 'validatePassword')
svc.login('a@b.com', 'pwd')
expect(valEmail).toHaveBeenCalled()      // ❌ teste de implementação
expect(valPwd).toHaveBeenCalled()
})

// ✓ Testa comportamento — sobrevive a refactor
test('login retorna token para credenciais válidas', () => {
const { token, error } = svc.login('a@b.com', 'pwd')
expect(token).toMatch(/^jwt\\./)
expect(error).toBeNull()
})

test('login retorna erro para email inválido', () => {
const { token, error } = svc.login('invalido', 'pwd')
expect(token).toBeNull()
expect(error).toBe('email inválido')
})`,
    },
    {
      title: "Cobertura é enganosa — mutation testing é melhor",
      body: "90% de coverage com asserts vazios é teatro. 60% com asserts duros vale mais. Use mutation testing (Stryker para JS, Pitest para Java) pra medir QUALIDADE: a ferramenta muda seu código (= em !=, + em -) e checa se algum teste pega — se nenhum pega, seu teste é decorativo. Coverage como meta ('100% obrigatório') leva a fraude — dev escreve assert vazio só pra passar.",
      code: `// Coverage diz 100% — mutation testing reprova
function ehAdulto(idade: number) {
return idade >= 18
}
// teste com 100% coverage mas péssimo
test('ehAdulto', () => {
ehAdulto(20)   // ❌ executa mas não verifica
ehAdulto(10)
})

// teste robusto
test.each([
[17, false],
[18, true],     // boundary
[19, true],
[0, false],
])('ehAdulto(%i) === %s', (idade, esperado) => {
expect(ehAdulto(idade)).toBe(esperado)
})
// mutation: trocar >= por > → teste 18 falha → mutação detectada ✓`,
    },
    {
      title: "Quando NÃO usar TDD",
      body: "TDD não vale: código exploratório (protótipo, spike pra entender problema), UI muito visual (CSS, layout — teste visual com Chromatic é melhor), integração com API externa desconhecida (faz spike, joga fora, depois reescreve com TDD), one-off scripts. Em geral: faça spike sem teste pra entender, jogue fora, reescreva com TDD pra valer. Forçar TDD em tudo é dogma — perde tempo.",
      code: `// Spike — explorar API desconhecida (joga fora depois)
const r = await fetch('https://api-nova-pra-mim.com/v3/data')
const json = await r.json()
console.log(json)   // ok? estrutura?

// Depois de entender, REESCREVA com TDD:
test('parser extrai itens da resposta da API X', () => {
const sample = { items: [{ id: 1, name: 'A' }] }
const result = parseAPI(sample)
expect(result).toEqual([{ id: 1, name: 'A' }])
})`,
    },
    {
      title: "Test doubles — fronteiras e injeção de dependência",
      body: "Mock só a fronteira (rede, DB, clock, fs, sistema externo) — o resto roda real. Mockar tudo cria 'teste de mock' que passa mas não testa nada útil. Para mockar com facilidade, projete com injeção de dependência: passe colaboradores via construtor/parâmetro, nunca import global. Isso emerge naturalmente em TDD.",
      code: `// ❌ Difícil testar — depende de globals
class Servico {
processar(id) {
  const user = db.findUser(id)              // global
  const result = httpClient.post(...)       // global
  return result
}
}

// ✓ Testável — DI permite mockar fronteiras
class Servico {
constructor(
  private userRepo: UserRepository,    // interface
  private http: HttpClient             // interface
) {}
processar(id) {
  const user = this.userRepo.find(id)
  return this.http.post(...)
}
}
// teste:
const svc = new Servico(fakeUserRepo, mockHttp)`,
    },
    {
      title: "Refactor seguro — TDD para legacy code",
      body: "Em código sem teste, antes de refatorar, você precisa de RED de cobertura. Técnica do 'golden master': captura output atual da função (random inputs ou inputs reais) como snapshot, depois refatora — se o snapshot continua igual, você não quebrou nada. Útil pra função grande sem teste que precisa virar limpa.",
      code: `// Função legacy gigante e suspeita
function processarRelatorio(dados) { /* 500 linhas */ }

// Golden master — captura comportamento atual
test('golden master', () => {
const inputs = loadFixtures('producao-real.json')
const outputs = inputs.map(processarRelatorio)
expect(outputs).toMatchSnapshot()   // primeira run salva
})

// Agora você pode refatorar com segurança:
// se snapshot mudar, é regressão — investiga
// se snapshot fica igual, refactor preservou comportamento`,
    },
    {
      title: "BDD e Property-Based Testing — variantes do TDD",
      body: "BDD (Behavior-Driven Development): usa linguagem natural (Given/When/Then) pra alinhar com negócio (Cucumber, Gherkin). Útil em times com PO/QA escrevendo specs. Property-Based Testing: gera centenas de inputs aleatórios e valida invariantes (fast-check no JS, QuickCheck no Haskell). Pega edge cases que dev humano não imagina (string vazia, null, números enormes).",
      code: `// Property-based com fast-check
import fc from 'fast-check'

test('reverse(reverse(x)) === x para qualquer string', () => {
fc.assert(
  fc.property(fc.string(), (s) => {
    expect(reverse(reverse(s))).toBe(s)
  })
)
})
// gera 100 strings aleatórias incluindo vazias, unicode, longas

// BDD com Cucumber
// Feature: Login
//   Scenario: Usuário válido
//     Given um usuário "ana@x.com" cadastrado
//     When ela faz login com senha correta
//     Then recebe um token JWT válido`,
    },
  ],
  cheatsheet: {
    title: "TDD — Cheat Sheet",
    html: `<style>
.tddcs-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.tddcs-card{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px 14px}
.tddcs-cmd{color:#2496ED;font-size:11.5px;font-weight:700;margin-bottom:4px;font-family:'JetBrains Mono',monospace}
.tddcs-desc{color:#64748b;font-size:10.5px;line-height:1.55}
.tddcs-head{font-size:9px;color:#64748b;letter-spacing:.14em;text-transform:uppercase;margin:14px 0 8px;padding-bottom:6px;border-bottom:1px solid #1e3a5f}
</style>
<div style="font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:20px">
<p style="color:#e2e8f0;font-size:11px;font-weight:700;margin:0 0 14px;letter-spacing:.06em">TDD — CHEAT SHEET</p>

<div class="tddcs-head">CICLO E ESTRUTURA</div>
<div class="tddcs-grid">
  <div class="tddcs-card">
    <div class="tddcs-cmd">RED → GREEN → REFACTOR</div>
    <div class="tddcs-desc">1-5min cada fase. Vermelho = teste falha. Verde = mínimo pra passar (pode ser feio). Refactor = limpa com suite verde.</div>
  </div>
  <div class="tddcs-card">
    <div class="tddcs-cmd">AAA — Arrange/Act/Assert</div>
    <div class="tddcs-desc">3 blocos visuais separados por linha em branco. 1 Act por teste, múltiplos Asserts ok se mesmo conceito.</div>
  </div>
  <div class="tddcs-card">
    <div class="tddcs-cmd">F.I.R.S.T</div>
    <div class="tddcs-desc">Fast (ms), Independent (sem ordem), Repeatable (mesmo resultado), Self-validating (booleano), Timely (junto com código).</div>
  </div>
  <div class="tddcs-card">
    <div class="tddcs-cmd">Pirâmide 70/20/10</div>
    <div class="tddcs-desc">70% unitários, 20% integração, 10% E2E. Inversão = ice cream cone (antipattern).</div>
  </div>
</div>

<div class="tddcs-head">TEST DOUBLES</div>
<div class="tddcs-grid">
  <div class="tddcs-card">
    <div class="tddcs-cmd">Stub</div>
    <div class="tddcs-desc">Retorna valor canned. Não verifica chamada. <code>{ get: () =&gt; ({id:1}) }</code></div>
  </div>
  <div class="tddcs-card">
    <div class="tddcs-cmd">Mock</div>
    <div class="tddcs-desc">Stub + verifica chamada. <code>vi.fn(); expect(m).toHaveBeenCalledWith(...)</code></div>
  </div>
  <div class="tddcs-card">
    <div class="tddcs-cmd">Fake</div>
    <div class="tddcs-desc">Implementação simplificada real (in-memory DB, fake clock). Para teste de estado.</div>
  </div>
  <div class="tddcs-card">
    <div class="tddcs-cmd">Spy</div>
    <div class="tddcs-desc">Wrappa real, registra chamadas, deixa executar. <code>vi.spyOn(obj, 'method')</code></div>
  </div>
</div>

<div class="tddcs-head">JEST/VITEST — ASSERTS COMUNS</div>
<div class="tddcs-grid">
  <div class="tddcs-card">
    <div class="tddcs-cmd">expect(x).toBe(y)</div>
    <div class="tddcs-desc">Igualdade estrita (===). Pra primitivos.</div>
  </div>
  <div class="tddcs-card">
    <div class="tddcs-cmd">expect(x).toEqual(y)</div>
    <div class="tddcs-desc">Igualdade profunda. Pra objetos e arrays.</div>
  </div>
  <div class="tddcs-card">
    <div class="tddcs-cmd">expect(fn).toThrow(...)</div>
    <div class="tddcs-desc">Verifica que função lança erro (com mensagem opcional).</div>
  </div>
  <div class="tddcs-card">
    <div class="tddcs-cmd">expect(arr).toContain(x)</div>
    <div class="tddcs-desc">Item presente. toHaveLength(n) para tamanho.</div>
  </div>
  <div class="tddcs-card">
    <div class="tddcs-cmd">expect(mock).toHaveBeenCalled()</div>
    <div class="tddcs-desc">.toHaveBeenCalledWith(args), .toHaveBeenCalledTimes(n).</div>
  </div>
  <div class="tddcs-card">
    <div class="tddcs-cmd">test.each([...])</div>
    <div class="tddcs-desc">Table-driven test — mesmo teste com vários inputs.</div>
  </div>
</div>

<div class="tddcs-head">NAMING — BOAS PRÁTICAS</div>
<div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px 14px;font-size:10.5px;color:#64748b;line-height:1.85">
  <strong style="color:#4ade80">✓ Bom:</strong> 'retorna 401 para token expirado' / 'aplica desconto de 15% para cliente gold' / 'lança erro quando email é inválido'<br>
  <strong style="color:#ef4444">✗ Ruim:</strong> 'testa funcao login' / 'método foo' / 'should work' / 'test 1'<br>
  <strong style="color:#fbbf24">Padrão:</strong> 'comportamento esperado dado contexto X' — descreve o que, não como
</div>
</div>`,
  },
  mindmap: {
    title: "Mapa mental — TDD do iniciante ao sênior",
    html: `<style>
.tddmm-row{display:flex;align-items:flex-start;gap:0;padding:8px 0;border-bottom:1px solid #1e293b}
.tddmm-row:last-child{border-bottom:none}
.tddmm-cat{width:120px;flex-shrink:0;font-size:9px;letter-spacing:.08em;font-weight:700;text-transform:uppercase;padding-top:5px;line-height:1.4}
.tddmm-tags{display:flex;flex-wrap:wrap;gap:5px}
.tddmm-tag{font-size:10px;padding:3px 9px;border-radius:4px;background:#1e293b;border:1px solid #334155;color:#94a3b8;white-space:nowrap;line-height:1.4}
.tddmm-tag-key{background:rgba(36,150,237,.08);border-color:rgba(36,150,237,.28);color:#2496ED}
.tddmm-tag-adv{background:rgba(239,68,68,.06);border-color:rgba(239,68,68,.22);color:#f87171}
</style>
<div style="font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px">
<p style="color:#e2e8f0;font-size:11px;font-weight:700;margin:0 0 10px;letter-spacing:.04em">TDD — MAPA DE CONCEITOS</p>
<p style="color:#475569;font-size:10px;margin:0 0 16px">Azul: essencial · Vermelho: nível sênior</p>
<div>
  <div class="tddmm-row">
    <div class="tddmm-cat" style="color:#2496ED">CICLO</div>
    <div class="tddmm-tags">
      <span class="tddmm-tag tddmm-tag-key">Red</span>
      <span class="tddmm-tag tddmm-tag-key">Green</span>
      <span class="tddmm-tag tddmm-tag-key">Refactor</span>
      <span class="tddmm-tag tddmm-tag-key">passos pequenos</span>
      <span class="tddmm-tag">fake it till you make it</span>
      <span class="tddmm-tag tddmm-tag-adv">triangulation</span>
    </div>
  </div>
  <div class="tddmm-row">
    <div class="tddmm-cat" style="color:#4ade80">PRINCÍPIOS</div>
    <div class="tddmm-tags">
      <span class="tddmm-tag tddmm-tag-key">F.I.R.S.T</span>
      <span class="tddmm-tag tddmm-tag-key">AAA</span>
      <span class="tddmm-tag tddmm-tag-key">testar comportamento</span>
      <span class="tddmm-tag tddmm-tag-adv">design emergente</span>
    </div>
  </div>
  <div class="tddmm-row">
    <div class="tddmm-cat" style="color:#f59e0b">PIRÂMIDE</div>
    <div class="tddmm-tags">
      <span class="tddmm-tag tddmm-tag-key">unitário</span>
      <span class="tddmm-tag tddmm-tag-key">integração</span>
      <span class="tddmm-tag tddmm-tag-key">E2E</span>
      <span class="tddmm-tag tddmm-tag-adv">testing trophy</span>
      <span class="tddmm-tag tddmm-tag-adv">ice cream cone</span>
    </div>
  </div>
  <div class="tddmm-row">
    <div class="tddmm-cat" style="color:#a78bfa">DOUBLES</div>
    <div class="tddmm-tags">
      <span class="tddmm-tag tddmm-tag-key">stub</span>
      <span class="tddmm-tag tddmm-tag-key">mock</span>
      <span class="tddmm-tag tddmm-tag-key">fake</span>
      <span class="tddmm-tag">spy</span>
      <span class="tddmm-tag tddmm-tag-adv">DI / IoC</span>
    </div>
  </div>
  <div class="tddmm-row">
    <div class="tddmm-cat" style="color:#38bdf8">FERRAMENTAS</div>
    <div class="tddmm-tags">
      <span class="tddmm-tag tddmm-tag-key">Jest / Vitest</span>
      <span class="tddmm-tag">JUnit / PyTest</span>
      <span class="tddmm-tag tddmm-tag-adv">Stryker (mutation)</span>
      <span class="tddmm-tag tddmm-tag-adv">fast-check (PBT)</span>
      <span class="tddmm-tag tddmm-tag-adv">Testcontainers</span>
    </div>
  </div>
  <div class="tddmm-row">
    <div class="tddmm-cat" style="color:#f97316">VARIANTES</div>
    <div class="tddmm-tags">
      <span class="tddmm-tag tddmm-tag-key">BDD</span>
      <span class="tddmm-tag tddmm-tag-key">ATDD</span>
      <span class="tddmm-tag tddmm-tag-adv">Property-Based</span>
      <span class="tddmm-tag tddmm-tag-adv">Approval Testing</span>
    </div>
  </div>
  <div class="tddmm-row">
    <div class="tddmm-cat" style="color:#e2e8f0">ANTIPATTERNS</div>
    <div class="tddmm-tags">
      <span class="tddmm-tag tddmm-tag-adv">teste implementação</span>
      <span class="tddmm-tag tddmm-tag-adv">mock excessivo</span>
      <span class="tddmm-tag tddmm-tag-adv">estado compartilhado</span>
      <span class="tddmm-tag tddmm-tag-adv">cobertura como meta</span>
      <span class="tddmm-tag tddmm-tag-adv">pular Red</span>
    </div>
  </div>
  <div class="tddmm-row">
    <div class="tddmm-cat" style="color:#c084fc">LEGADO</div>
    <div class="tddmm-tags">
      <span class="tddmm-tag tddmm-tag-key">golden master</span>
      <span class="tddmm-tag tddmm-tag-key">characterization test</span>
      <span class="tddmm-tag tddmm-tag-adv">seam (Feathers)</span>
      <span class="tddmm-tag tddmm-tag-adv">strangler fig</span>
    </div>
  </div>
</div>
</div>`,
    caption: "Use o mapa pra varrer conceitos antes de entrevista — diga em voz alta o que cada termo significa. Não saber explicar 'mock vs fake' ou 'ice cream cone' pega mal em vaga sênior.",
  },
  codeExamples: [
    {
      title: "Kata FizzBuzz — TDD step-by-step com Vitest",
      description: "Implementação clássica passo a passo. Cada teste novo expande o spec. Note a progressão: hardcoded → if simples → generalização. Não antecipe — deixe o teste forçar.",
      language: 'typescript',
      code: `import { test, expect } from 'vitest'

// 1. RED — primeiro teste
test('numero comum retorna o numero como string', () => {
expect(fizzbuzz(1)).toBe('1')
})

// GREEN — mínimo
function fizzbuzz(n: number): string {
return String(n)
}

// 2. RED — múltiplo de 3
test('multiplo de 3 retorna Fizz', () => {
expect(fizzbuzz(3)).toBe('Fizz')
})

// GREEN — adiciona caso
function fizzbuzz(n: number): string {
if (n % 3 === 0) return 'Fizz'
return String(n)
}

// 3. RED — múltiplo de 5
test('multiplo de 5 retorna Buzz', () => {
expect(fizzbuzz(5)).toBe('Buzz')
})

// GREEN
function fizzbuzz(n: number): string {
if (n % 3 === 0) return 'Fizz'
if (n % 5 === 0) return 'Buzz'
return String(n)
}

// 4. RED — múltiplo de 15 (combinação)
test('multiplo de 15 retorna FizzBuzz', () => {
expect(fizzbuzz(15)).toBe('FizzBuzz')
})

// GREEN — primeiro caso, ordem importa
function fizzbuzz(n: number): string {
if (n % 15 === 0) return 'FizzBuzz'
if (n % 3 === 0) return 'Fizz'
if (n % 5 === 0) return 'Buzz'
return String(n)
}

// 5. REFACTOR — concatenação revela padrão
function fizzbuzz(n: number): string {
let r = ''
if (n % 3 === 0) r += 'Fizz'
if (n % 5 === 0) r += 'Buzz'
return r || String(n)
}

// 6. table-driven test
test.each([
[1, '1'], [2, '2'], [3, 'Fizz'], [5, 'Buzz'],
[9, 'Fizz'], [10, 'Buzz'], [15, 'FizzBuzz'], [30, 'FizzBuzz'],
])('fizzbuzz(%i) === %s', (input, expected) => {
expect(fizzbuzz(input)).toBe(expected)
})`,
    },
    {
      title: "Setup Vitest — config, mocks, coverage",
      description: "Setup mínimo de Vitest pra projeto Node/TS com mocks parciais, coverage com v8 e UI interativa pro debug.",
      language: 'typescript',
      code: `// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
test: {
  globals: true,                      // describe/test/expect globais
  environment: 'node',                // ou 'jsdom' pra DOM
  setupFiles: ['./test/setup.ts'],    // roda antes de cada arquivo
  coverage: {
    provider: 'v8',                   // mais rápido que istanbul
    reporter: ['text', 'html', 'lcov'],
    exclude: ['**/*.test.ts', '**/types/**'],
    thresholds: {                     // coverage mínima — falha CI
      lines: 80,
      functions: 80,
      branches: 75,
    },
  },
  pool: 'threads',                    // paralelismo
},
})

// test/setup.ts — limpeza global
import { afterEach, vi } from 'vitest'

afterEach(() => {
vi.clearAllMocks()
vi.useRealTimers()
})

// teste com mock parcial de módulo
import { vi, test, expect } from 'vitest'

vi.mock('./db', () => ({
fetchUser: vi.fn().mockResolvedValue({ id: 1, name: 'Ana' }),
}))

test('processa user', async () => {
const { processarUser } = await import('./service')
const result = await processarUser(1)
expect(result.name).toBe('Ana')
})`,
    },
    {
      title: "Refatorando legacy com Golden Master",
      description: "Função enorme sem teste. Estratégia: captura output atual como snapshot, depois refatora com suite verde. Preserva comportamento mesmo sem entender 100%.",
      language: 'typescript',
      code: `// 1. CARACTERIZA o comportamento atual
import { test, expect } from 'vitest'
import { processarRelatorio } from './legacy'
import { readFileSync } from 'fs'

test('golden master — relatório legacy', () => {
const inputs = JSON.parse(readFileSync('./fixtures/inputs.json', 'utf-8'))

const outputs = inputs.map(processarRelatorio)

// primeira execução salva snapshot
// execuções seguintes comparam — falha = regressão
expect(outputs).toMatchSnapshot()
})

// 2. Agora com suite verde, refatora com confiança
// before:
function processarRelatorio(d) {
let r = []
for (let i = 0; i < d.itens.length; i++) {
  if (d.itens[i].ativo === true && d.itens[i].valor > 0) {
    r.push({
      id: d.itens[i].id,
      total: d.itens[i].valor * d.itens[i].qtd,
    })
  }
}
return r
}

// after — após refactor com snapshot intacto:
function processarRelatorio(d: Relatorio): Item[] {
return d.itens
  .filter(item => item.ativo && item.valor > 0)
  .map(item => ({
    id: item.id,
    total: item.valor * item.qtd,
  }))
}

// se o snapshot continuar igual, refactor preservou comportamento ✓`,
    },
    {
      title: "Teste de integração com Testcontainers — Postgres real",
      description: "Em vez de mockar repositório, sobe Postgres real em container só pra teste. Mais fiel que mock, mais rápido que CI compartilhada.",
      language: 'typescript',
      code: `import { test, expect, beforeAll, afterAll } from 'vitest'
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql'
import { Pool } from 'pg'
import { UserRepository } from './user-repo'

let container: StartedPostgreSqlContainer
let repo: UserRepository

beforeAll(async () => {
container = await new PostgreSqlContainer('postgres:16-alpine')
  .withDatabase('test')
  .withUsername('test')
  .withPassword('test')
  .start()

const pool = new Pool({
  connectionString: container.getConnectionUri(),
})

await pool.query(\`
  CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL
  )
\`)

repo = new UserRepository(pool)
}, 60_000)   // timeout maior pro container subir

afterAll(async () => {
await container.stop()
})

test('salva e recupera user', async () => {
const user = await repo.create({ email: 'a@b.com', name: 'Ana' })
const found = await repo.findById(user.id)
expect(found?.name).toBe('Ana')
})

test('email unique violation lança erro', async () => {
await repo.create({ email: 'unico@x.com', name: 'A' })
await expect(
  repo.create({ email: 'unico@x.com', name: 'B' })
).rejects.toThrow(/unique/i)
})`,
    },
    {
      title: "Red-Green-Refactor — ciclo completo num use case real (criar pedido)",
      description: "Implementação de um use case de negócio (criar pedido com desconto progressivo) seguindo o ciclo TDD estritamente. Cada passo é commitado separado: Red (teste falha), Green (mínimo passa), Refactor (limpa). Note como o design emerge da pressão dos testes.",
      language: 'typescript',
      code: `import { describe, test, expect } from 'vitest'

// ═══════════════════════════════════════════════════════
// ITERAÇÃO 1 — pedido vazio retorna total zero
// ═══════════════════════════════════════════════════════

// 🔴 RED — teste primeiro, falha porque criarPedido nem existe
test('pedido sem itens retorna total zero', () => {
const pedido = criarPedido({ itens: [] })
expect(pedido.total).toBe(0)
})

// 🟢 GREEN — código mínimo, hardcoded mesmo
function criarPedido(input: { itens: Array<{ preco: number; qtd: number }> }) {
return { total: 0 }   // hardcoded — fake it till you make it
}

// ═══════════════════════════════════════════════════════
// ITERAÇÃO 2 — pedido com 1 item soma preço × qtd
// ═══════════════════════════════════════════════════════

// 🔴 RED — generaliza
test('pedido com um item retorna preço × quantidade', () => {
const pedido = criarPedido({ itens: [{ preco: 100, qtd: 2 }] })
expect(pedido.total).toBe(200)
})

// 🟢 GREEN — agora forçado a calcular
function criarPedido(input: { itens: Array<{ preco: number; qtd: number }> }) {
const total = input.itens.reduce((sum, i) => sum + i.preco * i.qtd, 0)
return { total }
}

// ═══════════════════════════════════════════════════════
// ITERAÇÃO 3 — desconto de 10% acima de R$ 500
// ═══════════════════════════════════════════════════════

// 🔴 RED — regra de negócio
test('aplica 10% de desconto quando subtotal passa de 500', () => {
const pedido = criarPedido({ itens: [{ preco: 600, qtd: 1 }] })
expect(pedido.total).toBe(540)   // 600 - 10%
})

test('não aplica desconto quando subtotal é 500 ou menos', () => {
const pedido = criarPedido({ itens: [{ preco: 500, qtd: 1 }] })
expect(pedido.total).toBe(500)
})

// 🟢 GREEN
function criarPedido(input: { itens: Array<{ preco: number; qtd: number }> }) {
const subtotal = input.itens.reduce((sum, i) => sum + i.preco * i.qtd, 0)
const total = subtotal > 500 ? subtotal * 0.9 : subtotal
return { total }
}

// 🔵 REFACTOR — extrai a regra, separa cálculo de aplicação
const DESCONTO_LIMITE = 500
const DESCONTO_PERCENTUAL = 0.1

function calcularSubtotal(itens: Array<{ preco: number; qtd: number }>): number {
return itens.reduce((sum, i) => sum + i.preco * i.qtd, 0)
}

function aplicarDescontoProgressivo(subtotal: number): number {
if (subtotal <= DESCONTO_LIMITE) return subtotal
return subtotal * (1 - DESCONTO_PERCENTUAL)
}

function criarPedido(input: { itens: Array<{ preco: number; qtd: number }> }) {
const subtotal = calcularSubtotal(input.itens)
const total = aplicarDescontoProgressivo(subtotal)
return { subtotal, total, desconto: subtotal - total }
}

// ═══════════════════════════════════════════════════════
// ITERAÇÃO 4 — table-driven pra cobrir edge cases
// ═══════════════════════════════════════════════════════

describe('criarPedido — desconto progressivo', () => {
test.each([
  [[], 0, 0],                                      // vazio
  [[{ preco: 100, qtd: 1 }], 100, 100],            // < limite
  [[{ preco: 500, qtd: 1 }], 500, 500],            // boundary inferior
  [[{ preco: 500, qtd: 1 }, { preco: 1, qtd: 1 }], 501, 450.9],  // boundary superior
  [[{ preco: 1000, qtd: 1 }], 1000, 900],          // > limite
])('itens=%j subtotal=%i → total=%f', (itens, subtotal, totalEsperado) => {
  const p = criarPedido({ itens })
  expect(p.subtotal).toBe(subtotal)
  expect(p.total).toBeCloseTo(totalEsperado, 2)
})
})

// 💡 OBSERVE: design emergiu naturalmente — funções pequenas,
// constantes nomeadas, separação cálculo vs aplicação. Sem
// planejar arquitetura, o teste forçou a estrutura limpa.`,
    },
    {
      title: "Test doubles na prática — stub, mock e spy na mesma suite",
      description: "Cada tipo de double resolve um problema diferente. Stub fornece dado de entrada. Mock verifica comunicação. Fake é implementação real simplificada. Spy observa chamada real sem trocar comportamento. Aqui um único caso de uso (registrar usuário) testado de 4 formas.",
      language: 'typescript',
      code: `import { describe, test, expect, vi, beforeEach } from 'vitest'

// Sistema sob teste
interface UserRepo {
findByEmail(email: string): Promise<User | null>
save(user: User): Promise<User>
}
interface EmailService {
sendWelcome(to: string): Promise<void>
}
interface Logger {
info(msg: string, meta?: object): void
error(msg: string, err?: Error): void
}
interface User { id: string; email: string; createdAt: Date }

class RegistrarUsuario {
constructor(
  private repo: UserRepo,
  private email: EmailService,
  private logger: Logger,
) {}
async executar(email: string): Promise<User> {
  const existente = await this.repo.findByEmail(email)
  if (existente) throw new Error('email já cadastrado')
  const user = await this.repo.save({
    id: crypto.randomUUID(),
    email,
    createdAt: new Date(),
  })
  await this.email.sendWelcome(email)
  this.logger.info('user registrado', { id: user.id })
  return user
}
}

// ═══════════════════════════════════════════════════════
// 1️⃣ STUB — retorna valor canned, não verifica chamada
// ═══════════════════════════════════════════════════════
describe('RegistrarUsuario — STUB', () => {
test('retorna user quando email não existe', async () => {
  const stubRepo: UserRepo = {
    findByEmail: async () => null,                       // stub: sempre null
    save: async (u) => ({ ...u, id: 'fixed-id' }),       // stub: retorna o que passou + id
  }
  const stubEmail: EmailService = { sendWelcome: async () => {} }
  const stubLogger: Logger = { info: () => {}, error: () => {} }

  const useCase = new RegistrarUsuario(stubRepo, stubEmail, stubLogger)
  const result = await useCase.executar('ana@x.com')

  expect(result.email).toBe('ana@x.com')
  expect(result.id).toBe('fixed-id')
})
})

// ═══════════════════════════════════════════════════════
// 2️⃣ MOCK — verifica chamada com argumentos esperados
// ═══════════════════════════════════════════════════════
describe('RegistrarUsuario — MOCK', () => {
test('envia email de boas-vindas para o endereço correto', async () => {
  const repo: UserRepo = {
    findByEmail: vi.fn().mockResolvedValue(null),
    save: vi.fn().mockImplementation(async (u) => u),
  }
  const sendWelcome = vi.fn().mockResolvedValue(undefined)   // mock!
  const email: EmailService = { sendWelcome }
  const logger: Logger = { info: vi.fn(), error: vi.fn() }

  await new RegistrarUsuario(repo, email, logger).executar('ana@x.com')

  // verifica INTERAÇÃO — foi chamado? com o quê? quantas vezes?
  expect(sendWelcome).toHaveBeenCalledTimes(1)
  expect(sendWelcome).toHaveBeenCalledWith('ana@x.com')
})

test('não envia email quando user já existe', async () => {
  const repo: UserRepo = {
    findByEmail: vi.fn().mockResolvedValue({ id: '1', email: 'ana@x.com', createdAt: new Date() }),
    save: vi.fn(),
  }
  const sendWelcome = vi.fn()
  const useCase = new RegistrarUsuario(repo, { sendWelcome }, { info: vi.fn(), error: vi.fn() })

  await expect(useCase.executar('ana@x.com')).rejects.toThrow('email já cadastrado')
  expect(sendWelcome).not.toHaveBeenCalled()         // negativa também é mock
})
})

// ═══════════════════════════════════════════════════════
// 3️⃣ FAKE — implementação real simplificada (in-memory)
// ═══════════════════════════════════════════════════════
class InMemoryUserRepo implements UserRepo {
private users = new Map<string, User>()
async findByEmail(email: string) {
  return [...this.users.values()].find((u) => u.email === email) ?? null
}
async save(u: User) {
  this.users.set(u.id, u)
  return u
}
size() { return this.users.size }
}

describe('RegistrarUsuario — FAKE', () => {
let repo: InMemoryUserRepo
beforeEach(() => { repo = new InMemoryUserRepo() })

test('persiste user e impede duplicidade no segundo registro', async () => {
  const useCase = new RegistrarUsuario(
    repo,                                             // fake real, não mock
    { sendWelcome: async () => {} },
    { info: () => {}, error: () => {} },
  )

  await useCase.executar('ana@x.com')
  expect(repo.size()).toBe(1)

  // fake mantém estado real entre chamadas — comportamento autêntico
  await expect(useCase.executar('ana@x.com')).rejects.toThrow('email já cadastrado')
  expect(repo.size()).toBe(1)
})
})

// ═══════════════════════════════════════════════════════
// 4️⃣ SPY — observa função real sem trocar comportamento
// ═══════════════════════════════════════════════════════
describe('RegistrarUsuario — SPY', () => {
test('logger.info recebe id do user criado', async () => {
  const repo = new InMemoryUserRepo()
  const realLogger: Logger = {
    info: (msg, meta) => { /* implementação real, ex: pino */ },
    error: () => {},
  }
  const infoSpy = vi.spyOn(realLogger, 'info')        // wrappa o real

  const user = await new RegistrarUsuario(
    repo,
    { sendWelcome: async () => {} },
    realLogger,                                       // logger real, observado
  ).executar('ana@x.com')

  // spy registra chamadas mas deixa o método original executar
  expect(infoSpy).toHaveBeenCalledWith('user registrado', { id: user.id })
  infoSpy.mockRestore()                               // restaura o original
})
})

// 💡 REGRA DE OURO:
//   - MOCK quando você testa COMUNICAÇÃO (notificou? chamou?)
//   - FAKE quando você testa ESTADO (salvou? indexou?)
//   - STUB quando você só precisa fornecer entrada
//   - SPY raramente — geralmente é sinal de teste de implementação`,
    },
    {
      title: "Outside-in TDD — começa pelo teste de aceitação, desce para unitários",
      description: "London School (mockist, outside-in). Você começa escrevendo o teste E2E/aceitação que descreve o comportamento de fora pra dentro. Quando ele quebra por componente faltante, você desce um nível e escreve teste unitário pra esse componente. Cada nível 'descoberto' guia o design.",
      language: 'typescript',
      code: `import { describe, test, expect, vi } from 'vitest'

// ═══════════════════════════════════════════════════════
// 🎯 NÍVEL 1 — TESTE DE ACEITAÇÃO (outermost)
// Descreve o comportamento de fora — não conhece detalhe
// ═══════════════════════════════════════════════════════

// 🔴 RED — teste de aceitação falha porque NADA existe ainda
describe('Aceitação: usuário cria conta e recebe email', () => {
test('POST /register → 201 + email enviado', async () => {
  const app = await criarApp()                           // composição da app
  const emailSpy = vi.fn()
  app.replaceEmailService({ sendWelcome: emailSpy })     // injeta double na borda

  const resp = await app.inject({
    method: 'POST',
    url: '/register',
    payload: { email: 'ana@x.com', senha: 'segura123' },
  })

  expect(resp.statusCode).toBe(201)
  expect(JSON.parse(resp.body)).toMatchObject({ email: 'ana@x.com' })
  expect(emailSpy).toHaveBeenCalledWith('ana@x.com')
})
})

// O teste acima quebra. Erro: criarApp não existe. Ok — desce um nível.

// ═══════════════════════════════════════════════════════
// 🎯 NÍVEL 2 — CONTROLLER (HTTP boundary)
// O teste de aceitação revelou que precisamos de controller
// ═══════════════════════════════════════════════════════

// 🔴 RED — teste do controller, mocka o use case
describe('RegisterController', () => {
test('chama use case com email e senha do body', async () => {
  const useCase = { executar: vi.fn().mockResolvedValue({ id: '1', email: 'ana@x.com' }) }
  const controller = new RegisterController(useCase)

  const resp = await controller.handle({
    body: { email: 'ana@x.com', senha: 'segura123' },
  })

  expect(useCase.executar).toHaveBeenCalledWith({
    email: 'ana@x.com',
    senha: 'segura123',
  })
  expect(resp.status).toBe(201)
  expect(resp.body).toEqual({ id: '1', email: 'ana@x.com' })
})

test('retorna 400 quando email é inválido', async () => {
  const useCase = { executar: vi.fn() }
  const controller = new RegisterController(useCase)

  const resp = await controller.handle({
    body: { email: 'nao-eh-email', senha: 'x' },
  })

  expect(resp.status).toBe(400)
  expect(useCase.executar).not.toHaveBeenCalled()        // valida antes de chamar
})
})

// 🟢 GREEN — controller mínimo
class RegisterController {
constructor(private useCase: { executar: (i: any) => Promise<any> }) {}
async handle(req: { body: { email: string; senha: string } }) {
  if (!req.body.email.includes('@')) {
    return { status: 400, body: { error: 'email inválido' } }
  }
  const user = await this.useCase.executar(req.body)
  return { status: 201, body: user }
}
}

// O controller mocka o use case — mas precisa do use case real existir.
// Desce mais um nível.

// ═══════════════════════════════════════════════════════
// 🎯 NÍVEL 3 — USE CASE (regra de negócio)
// ═══════════════════════════════════════════════════════

describe('RegistrarUsuarioUseCase', () => {
test('persiste user e dispara email', async () => {
  const repo = { findByEmail: vi.fn().mockResolvedValue(null), save: vi.fn().mockImplementation(u => u) }
  const email = { sendWelcome: vi.fn().mockResolvedValue(undefined) }
  const hasher = { hash: vi.fn().mockResolvedValue('senha-hash') }

  const useCase = new RegistrarUsuarioUseCase(repo, email, hasher)
  await useCase.executar({ email: 'ana@x.com', senha: 'segura123' })

  expect(repo.save).toHaveBeenCalledWith(
    expect.objectContaining({ email: 'ana@x.com', senhaHash: 'senha-hash' }),
  )
  expect(email.sendWelcome).toHaveBeenCalledWith('ana@x.com')
})

test('lança quando email já existe', async () => {
  const repo = {
    findByEmail: vi.fn().mockResolvedValue({ id: '1' }),
    save: vi.fn(),
  }
  const useCase = new RegistrarUsuarioUseCase(
    repo,
    { sendWelcome: vi.fn() },
    { hash: vi.fn() },
  )

  await expect(
    useCase.executar({ email: 'ana@x.com', senha: 'x' }),
  ).rejects.toThrow('email já cadastrado')
})
})

// 🟢 GREEN — use case mínimo
class RegistrarUsuarioUseCase {
constructor(
  private repo: any,
  private email: any,
  private hasher: any,
) {}
async executar({ email, senha }: { email: string; senha: string }) {
  if (await this.repo.findByEmail(email)) throw new Error('email já cadastrado')
  const senhaHash = await this.hasher.hash(senha)
  const user = await this.repo.save({ id: crypto.randomUUID(), email, senhaHash })
  await this.email.sendWelcome(email)
  return user
}
}

// ═══════════════════════════════════════════════════════
// 🔵 SUBINDO de volta
// Com unitários verdes, o teste de aceitação volta a verde
// porque todas as peças existem e foram compostas em criarApp.
// ═══════════════════════════════════════════════════════

// 💡 LONDON vs CHICAGO:
// - London (outside-in, mockist): você desceu mockando colaboradores —
//   design por descoberta, ports e adapters emergem naturalmente.
// - Chicago (inside-out, classicist): você começaria pelo nível 3 (domain)
//   sem mocks, e só depois construiria controller e HTTP. Menos descoberta
//   de fronteira, mais foco em entidades primeiro.
// Nenhuma é "certa" — escolha pelo que está testando.`,
    },
  ],
  gotchas: [
    "Mockar tudo — teste passa mas não testa nada real. Mock só a fronteira (rede, DB, clock, fs); o resto roda real. Senão você está testando o mock, não o código.",
    "Teste acoplado a implementação — verifica que método X chamou Y interno. Quebra a cada refactor mesmo sem mudar comportamento. Teste comportamento (input → output observável), não detalhes internos.",
    "Compartilhar estado entre testes — flakiness garantida. Setup/teardown isolado em beforeEach (não beforeAll para estado mutável). Cada teste cria seus dados ou usa fixture imutável.",
    "Test pyramid invertida (ice cream cone) — mais E2E que unitário. CI demora 40min, flaky, ninguém entende onde quebrou. Causa: confiança baixa na lógica, design ruim que não permite testar unidade.",
    "Pular o RED — escrever teste depois do código. Vira 'test-after-development', perde o feedback de design. Sem RED, você não garante que o teste falha pelo motivo certo (pode estar testando sucesso falso).",
    "Cobertura como meta — gerência exige '100% coverage' e dev escreve assert vazio só pra passar. Use coverage como sinal de gap (linhas não cobertas existem?), não como KPI. Mutation testing (Stryker) mede qualidade real dos asserts.",
    "Nome de teste descrevendo implementação — 'testa que método foo chama bar duas vezes'. Não diz nada do que o sistema faz. Use linguagem de comportamento: 'aplica desconto de 15% para cliente gold' — o nome é parte do spec.",
    "Sem refactor depois do GREEN — código fica feio acumulado. Refactor é a fase mais subestimada — ela é o ganho de design do TDD. Suite verde é exatamente o momento de melhorar estrutura sem medo.",
    "Teste assíncrono mal escrito — esquecer await ou return em promise. O teste 'passa' porque acabou antes do assert rodar. Use await em assert assíncrono. expect(promise).resolves.toBe(...) ou rejects.toThrow().",
    "Snapshot grande/instável — gera 1000 linhas de JSON com timestamps. Falsos positivos a cada run. Filtre dados voláteis antes de matchSnapshot, ou prefira asserts explícitos pra estrutura crítica.",
    "Mock que mente — implementação do mock diverge da real. Teste passa, prod quebra. Use contract testing (Pact) ou shared fixture entre mock e implementação real, ou prefira fake (in-memory real) sobre mock.",
    "Tudo em um teste só (assert múltiplo de conceitos diferentes) — quando falha, você não sabe o que quebrou. Quebre em testes pequenos com nome descritivo. 1 conceito por teste, múltiplos asserts ok se mesmo conceito.",
  ],
  interview: [
    {
      q: "TDD vale sempre? Quando você NÃO usaria?",
      level: 'pleno',
      a: "<p>Não vale sempre. <strong>Vale</strong>: lógica não trivial (cálculo, regra de negócio, parser, state machine), refactor de código legado (com golden master primeiro), biblioteca compartilhada, bug fix (teste primeiro reproduzindo o bug, depois corrige).</p><p><strong>NÃO vale</strong>: protótipo descartável (você vai jogar fora), UI muito visual (CSS, layout — teste visual com Chromatic é melhor), exploração de API externa desconhecida (faça spike pra entender, jogue fora, depois reescreve com TDD), one-off scripts.</p><p>Em geral: faço spike sem teste pra entender o problema, jogo fora, reescrevo com TDD pra valer. Forçar TDD em tudo é dogma — perde tempo em código que você descobre que precisa jogar fora.</p>",
      tip: "Entrevistador testa pragmatismo — quem diz 'TDD sempre' é candidato dogmático. Mostre que conhece os limites e tem critério claro.",
    },
    {
      q: "Por que TDD melhora design e não só qualidade?",
      level: 'pleno',
      a: "<p>Quando você escreve teste primeiro, você usa o código antes de existir. Se a API é ruim, você sente na hora — muitos parâmetros, dependência escondida, side effect difícil de mockar. Você ajusta antes de implementar.</p><p>Código testável tende a ter:</p><ul><li><strong>Dependências explícitas</strong>: passa por construtor/parâmetro, não import global. Isso é Dependency Injection emergindo da disciplina de teste.</li><li><strong>Funções pequenas</strong>: assert focado força você a quebrar em unidades pequenas com responsabilidade única.</li><li><strong>Separação de I/O e lógica pura</strong>: lógica testa rápido em unitário, I/O testa em integração — você naturalmente separa.</li><li><strong>Coesão alta</strong>: o teste serve como cliente da API — APIs ruins ficam evidentes.</li></ul><p>Isso é basicamente SOLID emergindo da disciplina de teste. Não é coincidência — Kent Beck e Bob Martin descreveram esses princípios depois de anos praticando TDD.</p>",
    },
    {
      q: "Explique a pirâmide de testes. O que é o antipattern 'ice cream cone'?",
      level: 'pleno',
      a: "<p>A pirâmide (Mike Cohn) orienta o mix saudável de testes:</p><ul><li><strong>Base (~70%) — unitários</strong>: rápidos (ms), isolados, testam função/classe pura. Pegam regressão na lógica de negócio.</li><li><strong>Meio (~20%) — integração</strong>: testam fronteiras (DB, HTTP, queue). Mais lentos (centenas de ms), validam contratos entre componentes.</li><li><strong>Topo (~10%) — E2E</strong>: app real, browser real (Playwright/Cypress). Lentos (segundos a minutos), validam fluxo completo do usuário.</li></ul><p><strong>Ice cream cone</strong> é a pirâmide invertida: muito E2E, pouco unitário. Acontece quando time não confia na lógica isolada e prefere 'testar pelo navegador'. Sintomas: CI demora 40min, suite flaky, quando algo quebra ninguém sabe onde olhar (foi backend? frontend? infra?).</p><p>Causas: design acoplado que não permite testar unidade isolada, falta de disciplina de TDD, ou tentativa de cobrir buracos de design com E2E.</p><p>Variação moderna pra frontend: <strong>Testing Trophy</strong> (Kent C. Dodds) — peso maior em integração. Argumenta que integração pega bugs de colaboração que unitários puros perdem.</p>",
      tip: "Mencione que ratio é heurística — o importante é o gradiente (muitos rápidos focados embaixo, poucos lentos abrangentes em cima). Cite testing trophy como evolução pra ganhar pontos.",
    },
    {
      q: "Diferença entre mock, stub, fake e spy?",
      level: 'pleno',
      a: "<p>Quatro categorias de test doubles (Gerard Meszaros, xUnit Patterns):</p><ul><li><strong>Stub</strong>: retorna valor canned. Não verifica chamada. <code>{ get: () =&gt; ({id:1}) }</code>. Use pra prover dado de entrada.</li><li><strong>Mock</strong>: stub + verifica que foi chamado com certos argumentos. <code>vi.fn(); expect(m).toHaveBeenCalledWith(...)</code>. Use pra testar interação (notificou? chamou X?).</li><li><strong>Fake</strong>: implementação real simplificada. In-memory DB, fake clock, fake file system. Use pra teste de estado quando real é caro/lento.</li><li><strong>Spy</strong>: wrappa função real, registra chamadas, deixa executar normalmente. <code>vi.spyOn(obj, 'method')</code>. Use pra observar sem substituir comportamento.</li></ul><p><strong>Quando usar cada um</strong>:</p><ul><li>Mock para testar comunicação/protocolo (mandou email? chamou pagamento?)</li><li>Fake para testar estado (DB salvou? cache invalidou?)</li><li>Stub para fixture simples</li><li>Spy raramente — geralmente é sinal de teste de implementação</li></ul><p>Antipattern: <strong>mock excessivo</strong>. Quando você mocka 5 colaboradores num teste, você está testando o mock, não o código. Mock só a fronteira (rede, DB, clock); o resto roda real.</p>",
    },
    {
      q: "Como você testa código legacy sem teste?",
      level: 'senior',
      a: "<p>Estratégia clássica do livro Working Effectively with Legacy Code (Michael Feathers): você não pode refatorar com segurança sem rede de teste, mas não pode escrever teste em código que não foi desenhado pra isso. Sai do paradoxo com:</p><p><strong>1. Characterization Test (Golden Master)</strong>: captura o comportamento atual como spec. Roda a função com inputs reais (ou aleatórios), salva output como snapshot. Snapshot vira contrato — se mudar, você sabe que algo quebrou.</p><pre><code>test('golden master', () => {\n  const inputs = loadFixtures('producao.json')\n  const outputs = inputs.map(legacyFn)\n  expect(outputs).toMatchSnapshot()\n})</code></pre><p><strong>2. Encontre 'seams'</strong> (Feathers): pontos onde você pode mudar comportamento sem editar o código original — extract method, parameterize constructor, sprout method. Insere testabilidade aos poucos.</p><p><strong>3. Strangler Fig pattern</strong>: nova feature vai numa camada nova com TDD. Aos poucos, o código legacy é estrangulado e substituído.</p><p><strong>4. Testes de aproximação</strong>: se a função tem dependências horríveis, teste a saída observável (log, banco, response). Não é ideal, mas é melhor que nada — você ganha confiança pra refatorar e melhorar a testabilidade depois.</p><p>Importante: aceite que cobertura inicial vai ser baixa. Suba aos poucos, sem dogmatismo.</p>",
      tip: "Cite o livro do Feathers — sinal claro pra entrevistador sênior que você leu literatura clássica. Mencione golden master como técnica concreta — diferencia de candidato que só fala em abstrações.",
    },
    {
      q: "O que é mutation testing e por que é mais útil que coverage?",
      level: 'senior',
      a: "<p><strong>Coverage</strong> mede quantas linhas/branches o teste executa. Mas executar não é validar — você pode ter 100% coverage com asserts vazios.</p><p><strong>Mutation testing</strong> mede a QUALIDADE dos asserts. A ferramenta (Stryker pra JS, Pitest pra Java, mutmut pra Python) muda seu código levemente — troca <code>===</code> por <code>!==</code>, <code>&gt;</code> por <code>&gt;=</code>, <code>+</code> por <code>-</code>, remove return, etc. Cada mudança é uma 'mutação'. Depois roda sua suite. Se algum teste falha, a mutação foi 'morta' (good — sua suite pegou). Se todos passam, a mutação 'sobreviveu' — sinal de que sua suite não distingue o código original do mutante.</p><p><strong>Métrica</strong>: mutation score = mutações mortas / total. 80%+ é bom. 60% indica buracos sérios.</p><p><strong>Por que é melhor que coverage</strong>: coverage 100% pode coexistir com mutation score 30%. Você executou todas as linhas mas não validou nada interessante. Mutation testing força você a escrever asserts que diferenciam comportamentos parecidos.</p><p><strong>Tradeoff</strong>: mutation testing é lento (roda a suite N vezes). Use em CI nightly ou em código crítico (parser, regra de negócio, biblioteca compartilhada). Não em todo PR.</p>",
    },
    {
      q: "Como você lida com testes flaky?",
      level: 'senior',
      a: "<p>Teste flaky (passa às vezes, falha às vezes sem mudança no código) é dívida — equipe perde confiança na suite, ignora vermelho, deixa bug passar.</p><p><strong>Causas comuns</strong>:</p><ul><li><strong>Tempo</strong>: setTimeout, sleep, asserts dependentes de clock — use clock fake (vi.useFakeTimers).</li><li><strong>Ordem</strong>: teste depende de estado deixado por outro — isole com beforeEach, evite estado global.</li><li><strong>Concorrência</strong>: race condition em paralelismo — não compartilhe DB/recurso entre workers, use porta dinâmica, namespace por worker.</li><li><strong>Rede</strong>: fetch para serviço externo — mocka ou usa MSW.</li><li><strong>Não-determinismo</strong>: Math.random, Date.now, UUID — injete via DI.</li><li><strong>Seletor frágil</strong> (E2E): nth-child, classes geradas — use getByRole, getByTestId.</li></ul><p><strong>Processo</strong>: quando flake aparece, marca como quarentena (test.skip + issue), investiga causa raiz, corrige. NUNCA aumente retry count como solução — esconde o bug. Retry vale só pra rede inerentemente instável (E2E), não pra unitário.</p><p><strong>Prevenção</strong>: rodar suite com --shuffle (ordem aleatória) revela dependências de ordem. Rodar 100x em CI nightly captura flake antes de aparecer em PR.</p>",
    },
    {
      q: "Explique BDD. Quando usar em vez de TDD puro?",
      a: "<p><strong>BDD (Behavior-Driven Development)</strong> é evolução do TDD focada em colaboração com não-devs (PO, QA, negócio). Especificações são escritas em linguagem natural com a estrutura Given/When/Then (Gherkin), e ferramentas como Cucumber, SpecFlow ou Behave conectam essas specs a código de teste.</p><pre><code>Feature: Login\n  Scenario: Usuário válido\n    Given um usuário 'ana@x.com' cadastrado\n    When ela faz login com senha correta\n    Then recebe um token JWT</code></pre><p><strong>Quando usa BDD</strong>: time com PO/QA escrevendo specs em linguagem natural, domínio com regras de negócio complexas que precisam de validação humana, projeto regulado (financeiro, saúde) onde spec é documento auditável.</p><p><strong>Quando NÃO usa</strong>: time só de devs (overhead da linguagem natural não compensa), projeto técnico (lib, infra), startup com requisitos voláteis. Em time pequeno, escrever Gherkin pra cada feature pode ser teatro burocrático.</p><p><strong>Critério</strong>: vale BDD quando o cliente do teste é não-dev. Se só dev escreve e lê o teste, TDD com nomes descritivos é igual de bom e mais simples. ATDD (Acceptance Test-Driven Development) é primo — mesma ideia, foco em testes de aceitação primeiro.</p>",
    },
    {
      q: "Como você testa assíncrono e timing?",
      level: 'pleno',
      a: "<p>Erros comuns em teste assíncrono:</p><ul><li>Esquecer <code>await</code> — teste 'passa' porque acaba antes do assert rodar.</li><li>Não rejeitar promise — <code>expect(p).toBe(...)</code> compara a promise, não o valor.</li><li>setTimeout real torna teste lento.</li></ul><p><strong>Padrões corretos</strong>:</p><pre><code>// async/await\ntest('busca user', async () =&gt; {\n  const user = await fetchUser(1)\n  expect(user.name).toBe('Ana')\n})\n\n// promise direta\ntest('rejeita id inválido', () =&gt; {\n  return expect(fetchUser(-1)).rejects.toThrow('id inválido')\n})\n\n// mocking de timer\ntest('debounce dispara após 500ms', () =&gt; {\n  vi.useFakeTimers()\n  const fn = vi.fn()\n  const debounced = debounce(fn, 500)\n  debounced()\n  expect(fn).not.toHaveBeenCalled()\n  vi.advanceTimersByTime(500)\n  expect(fn).toHaveBeenCalled()\n  vi.useRealTimers()\n})</code></pre><p>Em E2E, use auto-wait (Playwright) e waitFor — nunca <code>page.waitForTimeout(2000)</code>, que assina flakiness.</p>",
    },
    {
      q: "Como TDD se relaciona com Clean Architecture / Hexagonal?",
      level: 'senior',
      a: "<p>Forte relação. Clean Architecture (Bob Martin) e Hexagonal (Alistair Cockburn) propõem que regras de negócio fiquem no centro, isoladas de framework e I/O. As fronteiras (UI, DB, HTTP) são plugadas via interfaces (ports).</p><p>TDD <strong>empurra você naturalmente nessa direção</strong>:</p><ul><li>Pra testar lógica de negócio sem subir DB/HTTP, você é forçado a separar lógica pura de I/O.</li><li>Pra mockar dependências, você é forçado a injetá-las via construtor (DI).</li><li>Pra testar use cases isolados, você é forçado a separá-los de detalhes de framework (Express, Next, NestJS).</li></ul><p><strong>Resultado prático</strong>: time que pratica TDD chega em arquitetura hexagonal sem ler livro nenhum — o design emerge da pressão dos testes.</p><p><strong>Camadas testadas</strong>:</p><ul><li>Domain (entities, value objects, regras puras): unitário, zero mock.</li><li>Use cases / Application: unitário com fakes/mocks de ports.</li><li>Adapters (DB repo, HTTP controller): integração com fronteira real.</li><li>Composição (main): smoke test E2E.</li></ul><p>Pirâmide de testes mapeia direto nas camadas — coincidência não, são abordagens convergentes.</p>",
    },
    {
      q: "Como você define quanto e onde testar? Existe 'teste demais'?",
      level: 'senior',
      a: "<p>Sim, existe teste demais. Sintomas: PR de feature pequena tem 500 linhas de teste e 50 de código; refactor trivial quebra 30 testes; suite roda 10 minutos; equipe tem medo de mexer porque 'vai quebrar testes'.</p><p><strong>Critérios pra decidir o que testar</strong>:</p><ul><li><strong>Risco x complexidade</strong>: lógica complexa (regra de negócio, parser, state machine) e/ou alto risco (financeiro, segurança) → muito teste, vários cenários, edge cases.</li><li><strong>Lógica trivial</strong>: getter/setter simples, mapeamento óbvio → pouco ou nenhum teste unitário (cobre via integração).</li><li><strong>Código de framework</strong>: configuração, glue code → não teste — é o framework que precisa testar.</li><li><strong>UI puramente visual</strong>: CSS, layout → teste visual (Chromatic), não unitário.</li></ul><p><strong>Heurística</strong>: 'teste o que dói se quebrar'. Se o método cair em prod silenciosamente, qual o impacto? Alto = teste. Baixo = pula ou faz integração superficial.</p><p><strong>Sinal de teste demais</strong>: você está testando getters de DTO, mapeamento 1:1 de campos, ou framework. Apaga. Confia no compilador (TS) pra estrutura, e em integração pra fluxo.</p><p>Coverage 100% como meta é antipattern — cria fraude (asserts vazios) e dá falsa segurança. Use coverage como sinal de gap, não como KPI.</p>",
    },
    {
      q: "Property-Based Testing — quando vale a pena?",
      level: 'senior',
      a: "<p><strong>Property-Based Testing (PBT)</strong>: em vez de exemplos manuais (input X → output Y), você define uma <em>invariante</em> que vale pra qualquer input, e a ferramenta (fast-check em JS, Hypothesis em Python, QuickCheck em Haskell) gera centenas de inputs aleatórios validando a invariante.</p><pre><code>import fc from 'fast-check'\n\ntest('reverse(reverse(x)) === x', () =&gt; {\n  fc.assert(\n    fc.property(fc.string(), s =&gt; {\n      expect(reverse(reverse(s))).toBe(s)\n    })\n  )\n})\n// gera 100 strings aleatórias incluindo vazias, unicode, longas, com espaços</code></pre><p><strong>Vantagens</strong>:</p><ul><li>Pega edge cases que dev humano não imagina (string vazia, null, números enormes, caracteres unicode).</li><li>Quando falha, faz <strong>shrinking</strong> — reduz o input ao mínimo que ainda falha (string '\\u0000' em vez de string aleatória de 100 chars).</li></ul><p><strong>Quando vale</strong>: parser, serializer, codificador, função matemática, algoritmo, qualquer função com invariantes claras (idempotência, comutatividade, round-trip).</p><p><strong>Quando não vale</strong>: lógica de negócio com casos discretos ('cliente gold ganha 15% desconto') — exemplo manual é mais claro. Side effects difíceis de testar como property.</p><p>É complementar a TDD por exemplo, não substituto. Em libs sérias (lodash, ramda, date-fns), PBT é padrão.</p>",
    },
    {
      q: "Diferença entre London School e Chicago School de TDD?",
      level: 'senior',
      a: "<p>Duas escolas que apareceram nos anos 2000 com filosofias opostas sobre como conduzir o ciclo TDD.</p><p><strong>Chicago School (classicist, inside-out)</strong> — Kent Beck, Bob Martin:</p><ul><li>Começa pela <strong>entidade do domínio</strong> (objeto de negócio puro) e cresce pra fora.</li><li>Mocks raros — prefere objetos reais sempre que possível, mocka só fronteira.</li><li>Testa <strong>estado</strong>: dado entrada X, estado final é Y?</li><li>Refactor agressivo entre red/green — design emerge tardiamente.</li></ul><p><strong>London School (mockist, outside-in)</strong> — Steve Freeman, Nat Pryce (livro GOOS):</p><ul><li>Começa pelo <strong>teste de aceitação</strong> (HTTP, UI) e desce mockando colaboradores.</li><li>Mocks abundantes — cada classe testada em isolamento total.</li><li>Testa <strong>interação</strong>: a classe X chamou o colaborador Y com argumentos Z?</li><li>Design <strong>guiado pelo teste</strong> — cada mock revela uma interface (port) que vai precisar ser implementada.</li></ul><p><strong>Trade-offs</strong>:</p><ul><li>Chicago: testes mais robustos a refactor (não acoplam à implementação), mas mais lentos pra desenvolver porque você integra real desde cedo.</li><li>London: design mais hexagonal sai 'de graça' do estilo, MAS testes ficam acoplados à composição (refactor de quem chama quem quebra muitos testes).</li></ul><p><strong>Na prática</strong>: misturo — Chicago no domínio (entidades puras com objetos reais) e London nas bordas (controller/use case com mocks de ports). É o padrão recomendado em GOOS e em arquitetura hexagonal moderna.</p>",
      tip: "Mencione GOOS (Growing Object-Oriented Software, Guided by Tests) — livro seminal da London School. Quem cita ganha pontos com entrevistador sênior.",
    },
    {
      q: "Mock vs Stub vs Spy vs Fake vs Dummy — definições precisas e quando NÃO usar cada um?",
      level: 'senior',
      a: "<p>Taxonomia formalizada por Gerard Meszaros (xUnit Test Patterns) e popularizada por Martin Fowler em 'Mocks Aren't Stubs':</p><ul><li><strong>Dummy</strong>: objeto passado mas nunca usado. Existe só pra preencher parâmetro. Ex: <code>new Service(null, null, dummyLogger)</code>. <strong>NÃO use</strong>: prefira sobrecarga ou opcionais — dummy esconde acoplamento.</li><li><strong>Stub</strong>: retorna valor canned em chamadas. Não verifica nada. <code>{ get: () =&gt; 42 }</code>. <strong>NÃO use</strong> quando você precisa verificar interação — vira mock.</li><li><strong>Spy</strong>: registra chamadas (argumentos, ordem, frequência) MAS executa o método real. <code>vi.spyOn(obj, 'method')</code>. <strong>NÃO use</strong> em produção via afterEach — sempre <code>mockRestore</code>.</li><li><strong>Mock</strong>: stub + verificação de interação. <code>expect(m).toHaveBeenCalledWith(...)</code>. <strong>NÃO use</strong> pra dependência cuja interação muda em refactor — testa estado.</li><li><strong>Fake</strong>: implementação real simplificada. In-memory DB, fake clock, fake fs. <strong>NÃO use</strong> quando o real é viável (testcontainers) — fake pode divergir do real e mentir.</li></ul><p><strong>Como evitar over-mocking</strong>:</p><ol><li>Regra de Steve Freeman: 'Don't mock types you don't own'. Não mocke API externa direto — wrappa numa interface sua e mocka a sua.</li><li>Mocka só a borda (rede, DB, clock, fs). Domínio interno usa objetos reais.</li><li>Se um teste tem 5+ mocks, é sinal de design ruim — classe sob teste tem responsabilidades demais.</li><li>Prefira fake (estado real) sobre mock (verificação) sempre que possível — fake testa o COMPORTAMENTO, mock testa o PROTOCOLO.</li></ol><p><strong>Anti-pattern clássico</strong>: <em>'mock-and-pray'</em> — mocka tudo, teste passa, prod quebra porque o mock divergiu da real. Mitigue com <strong>contract tests</strong> (Pact) ou compartilhe fixtures entre teste unitário e integração.</p>",
    },
    {
      q: "Por que testar comportamento e não implementação? Como você diferencia 'queries de estado' de 'verificação de interação' na prática?",
      level: 'senior',
      a: "<p>Teste de implementação verifica <strong>como</strong> o código faz; teste de comportamento verifica <strong>o que</strong> ele entrega. A diferença manifesta no que você assertiona:</p><p><strong>Query de estado (comportamento)</strong>:</p><pre><code>// faz a coisa, depois pergunta como ficou\ncarrinho.adicionar(produto)\nexpect(carrinho.total()).toBe(99.90)\nexpect(carrinho.itens()).toHaveLength(1)</code></pre><p>Sobrevive a refactor: pode trocar Map por Array, persistir em DB ou memória, agrupar itens — o teste continua válido enquanto a saída observável for correta.</p><p><strong>Verificação de interação (implementação)</strong>:</p><pre><code>// observa o caminho que o código tomou\ncarrinho.adicionar(produto)\nexpect(repo.save).toHaveBeenCalled()\nexpect(eventBus.emit).toHaveBeenCalledWith('item-added', expect.any(Object))\nexpect(cache.invalidate).toHaveBeenCalledTimes(1)</code></pre><p>Quebra em refactor: mudou pra batch save? Trocou eventBus por outbox pattern? Cache foi removido porque virou desnecessário? Todos os testes quebram <em>sem que comportamento tenha mudado</em>.</p><p><strong>Quando interação É comportamento (legítimo testar)</strong>:</p><ul><li>Notificação externa: 'envia email' É o comportamento esperado, não um meio.</li><li>Side effect observável de domínio: 'publica evento OrderCreated no message bus' é parte do contrato.</li><li>Idempotência: 'não chama API de pagamento duas vezes pra mesma ordem' é um requisito.</li></ul><p><strong>Heurística</strong>: pergunte 'se eu trocar a implementação interna mantendo o output, o teste deveria passar?'. Se SIM, o teste está bom. Se NÃO, está acoplado à implementação. Refactor não deve quebrar testes — se quebra, ou mudou comportamento (revisa) ou seu teste está observando demais (corrige).</p>",
    },
    {
      q: "Mutation testing com Stryker — o que é mutation score e por que coverage 100% não garante testes bons?",
      level: 'senior',
      a: "<p><strong>Cobertura de código</strong> mede quais linhas/branches foram <em>executadas</em> pelos testes. Mas executar não é validar:</p><pre><code>function ehAdulto(idade: number): boolean {\n  return idade &gt;= 18\n}\n\ntest('ehAdulto', () =&gt; {\n  ehAdulto(20)   // executa, sem assert!\n  ehAdulto(10)\n})</code></pre><p>Coverage diz 100%. Mas se eu trocar <code>&gt;=</code> por <code>&gt;</code>, ou <code>&gt;=</code> por <code>===</code>, o teste continua passando. Não testa nada.</p><p><strong>Mutation testing</strong> resolve isso. A ferramenta (Stryker pra JS, Pitest pra Java, mutmut pra Python) gera 'mutantes' do seu código:</p><ul><li>Troca <code>&gt;=</code> por <code>&gt;</code>, <code>===</code> por <code>!==</code>, <code>+</code> por <code>-</code></li><li>Remove <code>return</code>s, troca booleanos, deleta linhas inteiras</li><li>Substitui literais (<code>0</code> → <code>1</code>, <code>'a'</code> → <code>'b'</code>)</li></ul><p>Pra cada mutação, roda sua suite. Se algum teste falha → mutante 'killed' (bom, sua suite detectou). Se todos passam → mutante 'survived' (ruim, sua suite é cega).</p><p><strong>Mutation Score = killed / (killed + survived)</strong>. Threshold típico:</p><ul><li>≥ 80%: suite robusta</li><li>60-80%: tem buracos sérios</li><li>&lt; 60%: testes decorativos, refaz</li></ul><p><strong>Por que importa</strong>: gerência exige '100% coverage' → dev escreve assert vazio só pra passar → fraude estatística. Com mutation testing, fraude é detectada — assert vazio deixa quase todos os mutantes vivos.</p><p><strong>Trade-off</strong>: lento. Roda a suite N vezes (centenas). Use em CI nightly ou em código crítico (parser, regra de negócio, biblioteca). Não em todo PR — vira gargalo.</p><p><strong>Stryker config básico</strong>: <code>thresholds: { high: 80, low: 60, break: 50 }</code>. Break falha o build se score cair abaixo de 50.</p>",
    },
    {
      q: "TDD em código legacy sem testes — como começar? Characterization tests, seam points, strangler fig.",
      level: 'senior',
      a: "<p>Cenário: você herda um código de 5 anos com zero teste, lógica entrelaçada, dependências globais. Quer adicionar feature ou corrigir bug com segurança. Estratégia clássica de Michael Feathers (Working Effectively with Legacy Code):</p><p><strong>1. Characterization Test (Golden Master)</strong>: você não documenta o que o código DEVERIA fazer — documenta o que ele FAZ hoje. Roda com inputs reais, captura output como snapshot. Vira contrato.</p><pre><code>test('characterization — função X com inputs reais', () =&gt; {\n  const inputs = loadFixtures('producao-amostra.json')\n  const outputs = inputs.map(funcaoLegacy)\n  expect(outputs).toMatchSnapshot()\n})</code></pre><p>Snapshot é a 'rede de segurança': qualquer mudança que altere comportamento aparece como diff.</p><p><strong>2. Seam Points</strong>: lugares onde você pode mudar comportamento sem editar o código original. Tipos:</p><ul><li><strong>Object seam</strong>: extrair dependência pra interface e injetar. Permite mockar.</li><li><strong>Preprocessing seam</strong> (C/C++): macro substituição. Em JS/TS use ESM mock.</li><li><strong>Link seam</strong>: substituir biblioteca em build/test. Em JS, vi.mock substitui módulo.</li></ul><p>Com seams, você consegue isolar pedaços e adicionar teste sem refactor invasivo.</p><p><strong>3. Sprout Method/Class</strong>: nova lógica vai numa função/classe nova, com TDD pleno. Função legacy só chama a nova. Aos poucos, lógica antiga é estrangulada.</p><p><strong>4. Strangler Fig Pattern</strong> (Martin Fowler): nova versão do sistema cresce ao lado da antiga. Rotas/funcionalidades migram uma a uma. Quando 100% migrou, antigo é deletado. Aplica em escala de feature, não de método.</p><p><strong>5. Aceite cobertura baixa no começo</strong>: legacy não vai pra 100% rapidamente. Suba aos poucos, sem dogmatismo. Cada PR deixa o código <em>um pouco</em> mais testado que encontrou (Boy Scout Rule).</p><p><strong>O que NÃO fazer</strong>: refatorar agressivamente sem rede de teste. Vira rewrite acidental, demora 3x o estimado, gerência cancela no meio.</p>",
      tip: "Cite o livro de Feathers explicitamente — sinal claro pra entrevistador sênior. Mencione 'Sprout Method' e 'Strangler Fig' por nome — diferencia de candidato que só fala em 'refatorar com cuidado'.",
    },
    {
      q: "F.I.R.S.T na prática — qual viola cada princípio, e qual a consequência concreta?",
      level: 'senior',
      a: "<p>Cada letra é uma falha real que vi em time de produção:</p><p><strong>F (Fast) violado</strong>: teste com setTimeout(2000), fetch real, sleep entre passos. <strong>Consequência</strong>: dev roda <code>npm test</code> e vai tomar café. Resultado: ele para de rodar, deixa pro CI. Bug que o teste pegaria fica em main por horas. <strong>Fix</strong>: mock I/O, vi.useFakeTimers, paralelize.</p><p><strong>I (Independent) violado</strong>: teste B precisa que teste A tenha rodado primeiro (ex: A insere user, B consulta). <strong>Consequência</strong>: rodar suite com <code>--shuffle</code> falha aleatoriamente. CI passa, dev local falha (ordem diferente). Diagnóstico custa horas. <strong>Fix</strong>: setup completo em beforeEach, sem estado global, banco limpo entre testes.</p><p><strong>R (Repeatable) violado</strong>: teste depende de Date.now, Math.random, fuso horário do CI, internet. <strong>Consequência</strong>: 'flaky' — passa às vezes, falha às vezes. Time perde fé na suite, ignora vermelho, deixa bug passar. <strong>Fix</strong>: clock fake, seed do random, mocka rede com MSW, evita asserts dependentes de tempo real.</p><p><strong>S (Self-validating) violado</strong>: teste sem assert, ou com <code>console.log</code> pra inspeção manual. <strong>Consequência</strong>: passa sempre — não testa nada. Mutation testing reprova com 0% mutation score. <strong>Fix</strong>: assert explícito sempre, lint rule no-empty-test, ESLint plugin jest/expect-expect.</p><p><strong>T (Timely) violado</strong>: teste escrito 'depois quando der tempo'. <strong>Consequência</strong>: nunca dá tempo. Backlog de teste cresce, código novo entra sem cobertura, refactor fica perigoso. <strong>Fix</strong>: PR sem teste = revisão bloqueada, cultura de TDD ou pelo menos test-after-code-but-before-merge.</p><p><strong>Critério mental</strong>: antes de cada commit de teste, varre as 5 propriedades. Falha 1 = red flag. Falha 2 = teatro de teste — deleta e refaz.</p>",
    },
    {
      q: "Test pyramid vs Testing Trophy vs Testing Honeycomb — quando cada modelo faz sentido?",
      level: 'senior',
      a: "<p>Três heurísticas concorrentes pra distribuir esforço de teste:</p><p><strong>1. Pirâmide (Mike Cohn, 2009)</strong> — clássica:</p><ul><li>70% unitário (rápido, isolado), 20% integração, 10% E2E.</li><li><strong>Faz sentido</strong>: backend, lógica de negócio rica, projeto onde unidades têm comportamento próprio testável.</li><li><strong>Falha em</strong>: frontend moderno (componentes têm pouca lógica isolada — testar render isolado é teatro), microservices (a interação ENTRE serviços é o que importa, não a lógica interna).</li></ul><p><strong>2. Testing Trophy (Kent C. Dodds, 2018)</strong> — frontend-friendly:</p><ul><li>Base de tipos estáticos (TS, ESLint), depois unitário, MAIOR peso em integração, topo de E2E.</li><li><strong>Faz sentido</strong>: SPA React/Vue, microfrontends. Componentes testados via integração (React Testing Library) pegam mais bugs reais que unitário puro.</li><li>Argumento de KCD: 'o que dá mais confiança por dólar é integração'.</li></ul><p><strong>3. Testing Honeycomb (Spotify, 2018)</strong> — microservices:</p><ul><li>Pouco unitário (lógica é fina), MUITO integração (contratos, DB, queue), pouco E2E.</li><li><strong>Faz sentido</strong>: serviço cuja responsabilidade é orquestrar, não calcular. Fluxo HTTP → DB → response domina; lógica intermediária é mapeamento.</li><li>Tipicamente: testcontainers + contract tests (Pact) entre serviços.</li></ul><p><strong>Como escolher</strong>:</p><ul><li>App tem lógica de negócio rica e isolável? <strong>Pirâmide</strong>.</li><li>App é UI com pouca lógica e muita composição? <strong>Trophy</strong>.</li><li>App é serviço fino orquestrando externos? <strong>Honeycomb</strong>.</li></ul><p><strong>Anti-pattern comum</strong> ('Ice Cream Cone'): pirâmide invertida — muito E2E, pouco unitário. Aparece quando time não confia na lógica isolada, ou quando design não permite testar unidade. CI demora 40min, suite flaky, ninguém sabe onde olhar quando quebra.</p><p>O importante não é o ratio exato — é o gradiente: muitos testes rápidos focados embaixo, poucos lentos abrangentes em cima. Isso vale pros 3 modelos.</p>",
    },
    {
      q: "Testes flaky — causas reais e processo de eliminação?",
      level: 'senior',
      a: "<p>Flaky = teste que passa às vezes e falha às vezes <em>sem mudança no código</em>. Não é incômodo — é dívida tóxica. Time perde confiança na suite, começa a fazer <code>retry on failure</code> (escondendo bug), e eventualmente ignora vermelho.</p><p><strong>Causas mais comuns (em ordem de frequência)</strong>:</p><ol><li><strong>Shared state</strong>: variável de módulo, banco compartilhado, mock que vaza pra outro teste. <em>Fix</em>: <code>beforeEach</code> reseta tudo, banco limpo por teste, <code>vi.clearAllMocks()</code> em afterEach.</li><li><strong>Ordem de execução</strong>: teste B assume que A criou estado. <em>Detecção</em>: <code>vitest --shuffle</code>. <em>Fix</em>: tornar testes independentes.</li><li><strong>Tempo / timing</strong>: setTimeout, race condition, asserts dependentes de Date.now. <em>Fix</em>: <code>vi.useFakeTimers()</code>, fixar clock, evitar real sleep.</li><li><strong>Concorrência</strong>: paralelismo do test runner conflita com recurso (porta, arquivo, banco). <em>Fix</em>: porta dinâmica por worker, namespace de DB por <code>VITEST_POOL_ID</code>, ou desativa paralelismo nos integrações pesadas.</li><li><strong>Rede</strong>: serviço externo, DNS, retry. <em>Fix</em>: MSW intercepta fetch; nunca rede real em unit/integration; em E2E, retry só onde rede é inerente.</li><li><strong>Não-determinismo</strong>: <code>Math.random</code>, <code>crypto.randomUUID</code>, ordem de Map (em JS &lt; 2020). <em>Fix</em>: injete via DI, use seed.</li><li><strong>Seletor frágil em E2E</strong>: <code>nth-child(3)</code>, classe gerada por CSS-in-JS. <em>Fix</em>: <code>getByRole</code>, <code>getByTestId</code>.</li></ol><p><strong>Processo de eliminação (não 'aumentar retry')</strong>:</p><ol><li><strong>Quarentena</strong>: marca como <code>test.skip</code> com link pra issue. NÃO deixa ignorando — vira pesadelo de manutenção.</li><li><strong>Reproduce</strong>: rode 100x localmente. Se sempre passa, rode com <code>--shuffle</code>, <code>--no-cache</code>, paralelismo máximo. Geralmente falha em &lt; 10 runs.</li><li><strong>Bissect</strong>: comente metade dos testes, reproduza. Reduz até achar a interação culpada.</li><li><strong>Causa raiz</strong>: identifique a categoria (lista acima). Aplica o fix correspondente.</li><li><strong>Regression test</strong>: depois do fix, rode 1000x em CI nightly por 1 semana. Confirma que ficou estável.</li></ol><p><strong>Métrica de saúde</strong>: time saudável tem &lt; 0.1% de flaky rate (1 em 1000 runs). Acima de 1% (1 em 100) já tóxico — quem vai parar pra investigar quando 'só rerun resolve'?</p><p><strong>Anti-pattern</strong>: aumentar <code>retry: 3</code> no config. Esconde flake real. Vale só pra E2E onde a rede é inerente — não pra unitário.</p>",
    },
    {
      q: "TDD influencia design — por que código testável tende a ser mais desacoplado (SOLID emergente)?",
      level: 'senior',
      a: "<p>Quando você escreve teste primeiro, você usa o código <em>antes dele existir</em>. A API é desenhada do ponto de vista do consumidor, não do implementador. Cada decisão de design é pressionada pela facilidade ou dor de testar. Resultado: SOLID e Clean Architecture aparecem 'de graça' como subproduto.</p><p><strong>Mapeamento concreto TDD → SOLID</strong>:</p><ul><li><strong>S (Single Responsibility)</strong>: testar uma classe que faz 5 coisas dói (muitos asserts, muitos setups). Você naturalmente quebra. Cada classe vira uma 'razão pra mudar'.</li><li><strong>O (Open/Closed)</strong>: extensão por composição é fácil de mockar; modificação é difícil de testar isoladamente. TDD empurra pra extensão.</li><li><strong>L (Liskov Substitution)</strong>: se você testa contra interface (<code>UserRepo</code>), qualquer implementação (real, fake, mock) vale. Liskov vira automático.</li><li><strong>I (Interface Segregation)</strong>: mockar interface gigante é doloroso (10 métodos pra stubar). Você divide em interfaces pequenas, focadas. Cliente do teste agradece.</li><li><strong>D (Dependency Inversion)</strong>: pra mockar, você precisa <strong>injetar</strong> dependência (não importar global). DI é a porta de entrada do TDD.</li></ul><p><strong>Mapeamento TDD → Hexagonal/Clean</strong>:</p><ul><li>Pra testar lógica sem subir DB, você é forçado a separar lógica pura de I/O → camadas Domain e Application surgem.</li><li>Pra mockar I/O, você cria interfaces (ports) → adapters viram explícitos.</li><li>Pra testar use case isolado, você é forçado a separá-lo de framework (Express, Next) → composição vai pro 'main' fora dos testes.</li></ul><p>Time que pratica TDD chega em arquitetura hexagonal sem ler livro nenhum — design emerge da pressão dos testes. Não é coincidência: Kent Beck, Bob Martin e Alistair Cockburn descreveram esses princípios DEPOIS de anos praticando.</p><p><strong>Caveat importante</strong>: TDD não previne design ruim sozinho. Você pode escrever testes acoplados a implementação (testando interação interna) e produzir código mockista frágil. A disciplina é: <strong>teste comportamento observável</strong>, deixe a estrutura interna livre. SOLID emerge de testar o output, não o caminho.</p>",
    },
    {
      q: "BDD vs TDD — quando Gherkin/Cucumber faz sentido e quando é overhead?",
      level: 'senior',
      a: "<p><strong>TDD</strong> é prática técnica: ciclo Red-Green-Refactor, escrito por dev pra dev, em código de teste (Jest, JUnit). O cliente do teste é o próprio dev.</p><p><strong>BDD</strong> (Behavior-Driven Development) é evolução do TDD com foco em colaboração com não-devs. Specs em linguagem natural (Given/When/Then, Gherkin), ferramentas como Cucumber, SpecFlow, Behave conectam essas specs a código de teste. O cliente do teste passa a ser PO/QA/negócio.</p><pre><code>Feature: Cashback de cliente premium\n  Scenario: Cliente gold com compra acima de 500\n    Given um cliente com plano 'gold'\n    And um carrinho com R$ 600\n    When ele finaliza a compra\n    Then ele recebe R$ 30 de cashback\n    And ele recebe email de confirmação</code></pre><p><strong>Quando BDD vale</strong>:</p><ul><li>Time com PO/QA escrevendo specs colaborativamente. PO consegue ler o teste e validar regra.</li><li>Domínio com regras complexas que precisam validação humana (financeiro, seguro, saúde).</li><li>Projeto regulado: spec é documento auditável (HIPAA, SOX). Cucumber gera relatório executável legível.</li><li>Time grande/distribuído onde alinhamento de entendimento é caro.</li></ul><p><strong>Quando BDD é overhead</strong>:</p><ul><li>Time só de devs. Linguagem natural não adiciona valor — perde tempo escrevendo Gherkin que ninguém não-dev vai ler.</li><li>Projeto técnico (lib, infra, ferramenta de dev). Comportamento já é técnico — não tem business stakeholder.</li><li>Startup com requisitos voláteis. Manter feature files sincronizados com código vira fricção.</li><li>Time pequeno (&lt; 10) onde dev e PO sentam juntos — alinhamento via conversa é mais rápido que via Gherkin.</li></ul><p><strong>Critério</strong>: BDD vale quando o cliente do teste é não-dev. Se só dev escreve e lê, TDD com nomes descritivos (<code>describe('cliente gold com compra acima de 500', ...)</code>) é igual de bom e mais simples.</p><p><strong>Variantes relacionadas</strong>: <strong>ATDD</strong> (Acceptance Test-Driven Development) — primo do BDD, mesma ideia, foco em testes de aceitação como fonte da verdade. <strong>Specification by Example</strong> (Gojko Adzic, livro homônimo) — trata os exemplos como specs vivas, com ou sem Gherkin.</p><p><strong>Anti-pattern</strong>: dev escreve Gherkin pra cumprir 'política de BDD' e PO nunca lê. Vira overhead burocrático sem ganho. Se PO não vai ler, mate o BDD.</p>",
    },
  ],
  videos: [
    { title: "TDD — Live Coding em FizzBuzz Kata", channel: "Continuous Delivery (Dave Farley)", url: "https://www.youtube.com/results?search_query=tdd+kata+dave+farley", topic: "kata fundamentos", note: "Dave Farley (autor de Continuous Delivery) faz kata ao vivo mostrando o ciclo Red-Green-Refactor com disciplina exemplar." },
    { title: "Test-Driven Development by Example — Kent Beck", channel: "Various", url: "https://www.youtube.com/results?search_query=test+driven+development+kent+beck", topic: "criador do TDD", note: "Talks do Kent Beck explicando filosofia e práticas. O original — vale a hora gasta." },
    { title: "Why TDD?", channel: "Ian Cooper", url: "https://www.youtube.com/watch?v=EZ05e7EMOLM", topic: "filosofia", note: "Ian Cooper desconstrói mitos do TDD e mostra por que muita gente faz errado. Talk obrigatório pra sênior." },
    { title: "Mocks vs Fakes — Test Doubles Explained", channel: "Mark Seemann / TechWorld", url: "https://www.youtube.com/results?search_query=mocks+vs+fakes+test+doubles", topic: "test doubles", note: "Quando usar cada tipo de double, com exemplos concretos. Resolve confusão clássica de candidato." },
    { title: "Mutation Testing in Practice", channel: "Stryker / Various", url: "https://www.youtube.com/results?search_query=mutation+testing+stryker", topic: "qualidade de teste", note: "Demo de mutation testing pra mostrar como coverage 100% pode coexistir com asserts ruins." },
  ],
  resources: [
    { title: "Test-Driven Development by Example (Kent Beck) — livro fundador", url: "https://www.oreilly.com/library/view/test-driven-development/0321146530/", kind: "livro" },
    { title: "Working Effectively with Legacy Code (Michael Feathers)", url: "https://www.oreilly.com/library/view/working-effectively-with/0131177052/", kind: "livro" },
    { title: "Growing Object-Oriented Software, Guided by Tests (Freeman & Pryce)", url: "https://www.amazon.com/Growing-Object-Oriented-Software-Guided-Tests/dp/0321503627", kind: "livro" },
    { title: "Martin Fowler — TestPyramid", url: "https://martinfowler.com/bliki/TestPyramid.html", kind: "artigo" },
    { title: "Kent C. Dodds — Testing Trophy", url: "https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications", kind: "artigo" },
    { title: "Vitest documentation", url: "https://vitest.dev/", kind: "docs" },
    { title: "Stryker Mutator (mutation testing JS)", url: "https://stryker-mutator.io/", kind: "docs" },
    { title: "fast-check (property-based testing JS)", url: "https://fast-check.dev/", kind: "docs" },
    { title: "Cyber-Dojo (katas online)", url: "https://cyber-dojo.org/", kind: "pratica" },
  ],
  exercises: [
    {
      level: 'iniciante',
      title: "Kata FizzBuzz — TDD puro do zero",
      description: "Implemente FizzBuzz seguindo Red-Green-Refactor estritamente. Para cada caso (número comum, múltiplo de 3, múltiplo de 5, múltiplo de 15), escreva primeiro o teste que falha, depois o código mínimo, depois refatora. Documente cada commit como Red, Green ou Refactor. Não antecipe — deixe os testes forçarem a generalização.",
      concepts: ["Red-Green-Refactor", "passos pequenos", "fake it till you make it", "table-driven test"],
      hint: "Comece com return '1' hardcoded — só generalize quando o segundo teste forçar. Ordem importa: teste de FizzBuzz (15) deve vir antes do código que checa 15. Use test.each pra refatorar testes em tabela.",
      relatedKeypoints: [0, 3],
    },
    {
      level: 'iniciante',
      title: "AAA + F.I.R.S.T — refatorar suite ruim",
      description: "Pegue uma suite com 5-10 testes que violam F.I.R.S.T (testes lentos, dependentes de ordem, sem assert claro, com console.log). Refatore um a um aplicando AAA explicitamente, mockando I/O, isolando setup. Compare tempo da suite antes e depois.",
      concepts: ["AAA", "F.I.R.S.T", "mocks", "beforeEach", "isolamento"],
      hint: "Identifique o pecado de cada teste primeiro (Fast? Independent? Repeatable? Self-validating?). Mock fronteiras com vi.fn() ou MSW. Use beforeEach pra setup isolado. Adicione test.concurrent onde possível.",
      relatedKeypoints: [2, 3, 4],
    },
    {
      level: 'intermediario',
      title: "Calculadora de impostos — TDD com regras de negócio",
      description: "Implemente módulo de cálculo de imposto progressivo com 4-5 faixas, descontos por dependentes, faixa de isenção. Use TDD para cada regra. Inclua edge cases (renda zero, valores negativos, dependentes em faixa de isenção). Termine com mutation testing (Stryker) — atinja 80%+ de mutation score.",
      concepts: ["TDD", "regras de negócio", "table-driven", "mutation testing", "edge cases"],
      hint: "Modele as faixas como array de objetos { de, ate, aliquota }. Use test.each pra cobrir cada faixa. Edge cases primeiro: renda 0, renda negativa (lança erro), renda na fronteira da faixa. Stryker config: thresholds: { high: 80 }.",
      relatedKeypoints: [1, 7],
    },
    {
      level: 'intermediario',
      title: "Refatorar legacy com Golden Master",
      description: "Pegue uma função legacy de 100+ linhas com if-else aninhados e variáveis mutáveis. Capture comportamento atual com snapshot test (Golden Master) usando 50+ inputs reais. Depois refatore em pequenos passos (extract function, replace temp with query, decompose conditional) — snapshot deve permanecer verde em cada commit.",
      concepts: ["legacy code", "characterization test", "golden master", "refactoring"],
      hint: "Função sem teste primeiro recebe snapshot test. Use inputs reais ou property-based generation. Não tente entender 100% — confie no snapshot. Em cada refactor, rode suite — vermelho = você quebrou; verde = preservou. Commit por refactor.",
      relatedKeypoints: [10],
    },
    {
      level: 'senior',
      title: "TDD em hexagonal — domain isolado",
      description: "Construa um use case (ex: criar pedido) seguindo arquitetura hexagonal. Domain entities sem dependência externa, use case recebe ports (UserRepo, NotificationService) via DI. Teste o use case com fakes (in-memory repo, fake notification). Adicione adapter real (Postgres repo, SES email) testado em integração com Testcontainers.",
      concepts: ["arquitetura hexagonal", "ports & adapters", "DI", "fakes vs mocks", "Testcontainers"],
      hint: "Crie interfaces de ports na camada de application. Implementação fake do repo é classe com Map<id, entity>. Use case testa contra fakes — zero dependência externa. Adapter real testa contra Postgres em testcontainer. Pirâmide natural emerge.",
      relatedKeypoints: [9, 5],
    },
  ],
  mnemonics: [
    {
      label: "Ciclo TDD — RED · GREEN · REFACTOR",
      trick: "Red (testa falha) · Green (mínimo passa) · Refactor (limpa)",
      explanation: "1-5 minutos cada fase. RED: teste falha pelo motivo certo (você ve o vermelho). GREEN: código mínimo, pode ser feio/hardcoded. REFACTOR: limpa estrutura sem mudar comportamento, com suite verde como rede. Pular RED = não confia que teste mede algo. Pular REFACTOR = código vira espaguete verde. Os 3 juntos é o que dá design emergente.",
    },
    {
      label: "F.I.R.S.T — propriedades de bom teste",
      trick: "Fast · Independent · Repeatable · Self-validating · Timely",
      explanation: "Fast: ms, suite em segundos. Independent: sem ordem, sem estado compartilhado. Repeatable: mesmo resultado em qualquer ambiente, offline. Self-validating: passa/falha booleano, sem inspecionar log. Timely: escrito junto com código, não 'depois quando der tempo'. Falhar uma é red flag; falhar duas é teatro de teste — apaga e refaz.",
    },
    {
      label: "AAA — estrutura de cada teste",
      trick: "Arrange · Act · Assert (separados por linha em branco)",
      explanation: "Arrange prepara entradas, mocks, fixtures. Act executa a ação testada (1 chamada principal). Assert valida o resultado (1 conceito por teste, múltiplos asserts ok se mesmo conceito). Linha em branco entre os 3 blocos torna o teste legível como spec executável. Quem mistura os 3 escreve teste denso e difícil de debugar.",
    },
    {
      label: "Pirâmide — 70/20/10",
      trick: "muitos unitários · alguns integração · poucos E2E",
      explanation: "Base (~70%): unitários, ms, isolam lógica pura. Meio (~20%): integração, fronteiras (DB/HTTP), validam contratos. Topo (~10%): E2E, app/browser real, fluxo crítico. Inversão = ice cream cone (mais E2E que unitário) → CI demora 40min, suite flaky, ninguém sabe onde quebrou. Variação moderna pra frontend: testing trophy (peso maior em integração).",
    },
  ],
}

export default tdd

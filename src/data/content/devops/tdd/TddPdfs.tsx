'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'
import type { HookItem, RuleItem } from '@/components/pdfs/CheatsheetPdf'

// ── Paleta TDD ───────────────────────────────────────────────────────────────
const C = '#22c55e'

// ── Metadados dos PDFs ───────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 16 perguntas mais cobradas em entrevista sobre TDD',
    type: 'qa',
    pages: 9,
    description: 'Recuperacao ativa: 16 perguntas pleno e senior cobrindo Red-Green-Refactor, F.I.R.S.T, piramide de testes, mock vs fake, BDD, mutation testing, legacy code, property-based testing, hexagonal e quando NAO usar TDD. Cada resposta vem com dica de apresentacao.',
    icon: '01',
    goal: 'Recuperacao ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet — Vitest + asserts + naming',
    subtitle: 'Asserts mais usados, padroes AAA, naming e setup numa folha densa',
    type: 'cheatsheet',
    pages: 3,
    description: 'Referencia densa: matchers do Vitest/Jest (toBe, toEqual, toThrow, rejects, resolves, toHaveBeenCalledWith), test.each, beforeEach/afterEach, vi.fn / vi.spyOn / vi.useFakeTimers, regras de naming e regras de ouro (mock so a fronteira, teste comportamento, etc).',
    icon: '02',
    goal: 'Consulta rapida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemonicos — RED-GREEN, FIRST, AAA',
    subtitle: 'Os atalhos mentais que nao podem falhar em entrevista',
    type: 'mnemonics',
    pages: 4,
    description: 'Cartoes de memorizacao: ciclo Red-Green-Refactor, F.I.R.S.T (Fast, Independent, Repeatable, Self-validating, Timely), AAA (Arrange-Act-Assert), Piramide 70/20/10, Test doubles (Stub, Mock, Fake, Spy, Dummy). Cada um com truque verbal + expansao + ancora cognitiva.',
    icon: '03',
    goal: 'Memorizacao espacada',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns',
    subtitle: 'Os 7 erros mais comuns em testes — e como corrigir',
    type: 'antipatterns',
    pages: 4,
    description: 'Anti-patterns que aparecem em PR review e em entrevista: testar implementacao, mockar tudo, estado compartilhado, cobertura como meta, snapshot grande, teste assincrono mal escrito, ice cream cone (piramide invertida). Cada um com diff ruim x bom + por que importa.',
    icon: '04',
    goal: 'Reconhecimento de padrao',
  },
]

// ── Dados: Q&A ───────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'TDD vale sempre? Quando voce NAO usaria?',
    a: 'Nao vale sempre. Vale: logica nao trivial (calculo, regra de negocio, parser, state machine), refactor de codigo legado (com golden master primeiro), biblioteca compartilhada, bug fix (teste primeiro reproduzindo o bug). NAO vale: prototipo descartavel, UI muito visual (CSS, layout — teste visual com Chromatic e melhor), exploracao de API externa desconhecida (faca spike, jogue fora, depois reescreva com TDD), one-off scripts. Em geral: faco spike sem teste para entender, jogo fora, reescrevo com TDD para valer.',
    tip: 'Entrevistador testa pragmatismo — quem diz "TDD sempre" e candidato dogmatico. Mostre que conhece os limites e tem criterio claro.',
  },
  {
    level: 'Pleno',
    q: 'Por que TDD melhora design e nao so qualidade?',
    a: 'Quando voce escreve teste primeiro, voce usa o codigo antes de existir. Se a API e ruim, voce sente na hora — muitos parametros, dependencia escondida, side effect dificil de mockar. Voce ajusta antes de implementar. Codigo testavel tende a ter: dependencias explicitas (DI emergindo da disciplina de teste), funcoes pequenas (assert focado forca quebrar em unidades), separacao de I/O e logica pura (logica testa rapido, I/O testa em integracao), coesao alta (API ruim fica evidente). Isso e basicamente SOLID emergindo da disciplina de teste.',
    tip: 'Mencionar que SOLID emerge naturalmente do TDD — Kent Beck e Bob Martin descreveram esses principios depois de anos praticando TDD. Diferencia de quem repete conceito sem entender origem.',
  },
  {
    level: 'Pleno',
    q: 'Explique a piramide de testes. O que e o antipattern ice cream cone?',
    a: 'Piramide (Mike Cohn) orienta o mix saudavel: ~70% unitarios na base (rapidos, isolados, testam funcao pura), ~20% integracao no meio (testam fronteiras DB/HTTP, validam contratos), ~10% E2E no topo (app real, browser real, fluxo completo). Ice cream cone e a piramide invertida: muito E2E, pouco unitario. Acontece quando time nao confia na logica isolada e prefere "testar pelo navegador". Sintomas: CI demora 40min, suite flaky, quando algo quebra ninguem sabe onde olhar. Causas: design acoplado que nao permite testar unidade, ou tentativa de cobrir buracos de design com E2E. Variacao moderna: Testing Trophy (Kent C. Dodds) — peso maior em integracao para frontend.',
    tip: 'Mencione que ratio e heuristica — o importante e o gradiente (muitos rapidos focados embaixo, poucos lentos abrangentes em cima). Cite testing trophy como evolucao para ganhar pontos.',
  },
  {
    level: 'Pleno',
    q: 'Diferenca entre mock, stub, fake e spy?',
    a: 'Quatro categorias de test doubles (Gerard Meszaros, xUnit Patterns). Stub: retorna valor canned, nao verifica chamada — use para prover dado. Mock: stub + verifica que foi chamado com certos argumentos — use para testar interacao (notificou? chamou X?). Fake: implementacao real simplificada (in-memory DB, fake clock) — use para teste de estado. Spy: wrappa funcao real, registra chamadas, deixa executar — use para observar sem substituir. Antipattern: mock excessivo. Mock so a fronteira (rede, DB, clock); o resto roda real. Quando voce mocka 5 colaboradores num teste, voce esta testando o mock, nao o codigo.',
    tip: 'Citar Meszaros pelo nome (xUnit Patterns) demonstra que voce leu literatura. A regra "mock so a fronteira" e o que separa pratico de teorico.',
  },
  {
    level: 'Senior',
    q: 'Como voce testa codigo legacy sem teste?',
    a: 'Estrategia classica do Working Effectively with Legacy Code (Michael Feathers): voce nao pode refatorar com seguranca sem rede de teste, mas nao pode escrever teste em codigo nao desenhado para isso. Sai do paradoxo com: 1) Characterization Test (Golden Master) — captura comportamento atual como spec via snapshot. Roda com inputs reais, salva output, vira contrato. 2) Encontre seams — pontos onde voce pode mudar comportamento sem editar o original (extract method, parameterize constructor, sprout method). 3) Strangler Fig pattern — feature nova vai numa camada nova com TDD; legacy vai sendo estrangulado. 4) Testes de aproximacao — se dependencias sao horriveis, teste output observavel (log, banco, response). Importante: aceite que cobertura inicial vai ser baixa.',
    tip: 'Cite o livro do Feathers — sinal claro para entrevistador senior que voce leu literatura classica. Mencione golden master como tecnica concreta — diferencia de candidato que so fala em abstracoes.',
  },
  {
    level: 'Senior',
    q: 'O que e mutation testing e por que e mais util que coverage?',
    a: 'Coverage mede quantas linhas/branches o teste executa — mas executar nao e validar. Voce pode ter 100% coverage com asserts vazios. Mutation testing mede a QUALIDADE dos asserts. A ferramenta (Stryker para JS, Pitest para Java, mutmut para Python) muda seu codigo levemente: troca === por !==, > por >=, + por -, remove return. Cada mudanca e uma "mutacao". Roda sua suite. Se algum teste falha, mutacao foi "morta" (good). Se todos passam, mutacao "sobreviveu" — sua suite nao distingue. Mutation score = mortas / total. 80%+ e bom. 60% indica buracos. Coverage 100% pode coexistir com mutation 30%. Tradeoff: mutation testing e lento (roda suite N vezes). Use em CI nightly ou em codigo critico.',
    tip: 'Mutation testing e diferencial em entrevista senior. Cite que coverage como KPI vira fraude — devs escrevem assert vazio para passar a meta.',
  },
  {
    level: 'Senior',
    q: 'Como voce lida com testes flaky?',
    a: 'Teste flaky e divida — equipe perde confianca, ignora vermelho, deixa bug passar. Causas comuns: 1) Tempo (setTimeout, sleep, asserts dependentes de clock) — use vi.useFakeTimers. 2) Ordem (teste depende de estado de outro) — isole com beforeEach. 3) Concorrencia (race em paralelismo) — nao compartilhe DB/recurso, use porta dinamica. 4) Rede — mocka ou MSW. 5) Nao-determinismo (Math.random, Date.now, UUID) — injete via DI. 6) Seletor fragil (E2E) — use getByRole, getByTestId. Processo: quando flake aparece, marca como quarentena (test.skip + issue), investiga causa raiz, corrige. NUNCA aumente retry como solucao — esconde o bug. Prevencao: rodar suite com --shuffle revela dependencias de ordem; rodar 100x em CI nightly captura flake antes do PR.',
    tip: 'A regra "nunca aumente retry como solucao" e o que diferencia. Quem quer mais retries esta tratando sintoma, nao causa.',
  },
  {
    level: 'Pleno',
    q: 'Explique BDD. Quando usar em vez de TDD puro?',
    a: 'BDD (Behavior-Driven Development) e evolucao do TDD focada em colaboracao com nao-devs. Specs em linguagem natural (Given/When/Then via Gherkin), ferramentas (Cucumber, SpecFlow, Behave) conectam specs a codigo. Quando usa: time com PO/QA escrevendo specs, dominio com regras complexas que precisam de validacao humana, projeto regulado (financeiro, saude) onde spec e documento auditavel. Quando NAO usa: time so de devs (overhead da linguagem natural nao compensa), projeto tecnico (lib, infra), startup com requisitos volateis. Criterio: vale BDD quando o cliente do teste e nao-dev. Se so dev escreve e le o teste, TDD com nomes descritivos e igual de bom e mais simples.',
    tip: 'Mostrar pragmatismo e diferenciar BDD (tooling pesado) de TDD com nomes descritivos (sem overhead) ganha pontos.',
  },
  {
    level: 'Pleno',
    q: 'Como voce testa assincrono e timing?',
    a: 'Erros comuns: esquecer await (teste passa porque acaba antes do assert), nao rejeitar promise, setTimeout real torna teste lento. Padroes corretos: async/await com expect direto. Para promises rejeitadas: await expect(p).rejects.toThrow(). Para timer mock: vi.useFakeTimers + vi.advanceTimersByTime(500) — testa debounce/throttle sem esperar real. Em E2E (Playwright), use auto-wait e waitFor — nunca page.waitForTimeout(2000), que assina flakiness.',
    tip: 'O exemplo do debounce com fake timers e classico — mostrar que voce sabe testar codigo dependente de tempo sem esperar real.',
  },
  {
    level: 'Senior',
    q: 'Como TDD se relaciona com Clean Architecture / Hexagonal?',
    a: 'Forte relacao. Clean Architecture (Bob Martin) e Hexagonal (Alistair Cockburn) propoem que regras de negocio fiquem no centro, isoladas de framework e I/O. As fronteiras (UI, DB, HTTP) sao plugadas via interfaces (ports). TDD empurra naturalmente nessa direcao: para testar logica sem subir DB/HTTP voce e forcado a separar; para mockar dependencias voce e forcado a injeta-las via construtor; para testar use cases isolados voce e forcado a separa-los de framework. Resultado: time que pratica TDD chega em arquitetura hexagonal sem ler livro nenhum — design emerge da pressao dos testes. Camadas testadas: Domain (unitario, zero mock), Use cases (unitario com fakes de ports), Adapters (integracao com fronteira real), Composicao (smoke E2E). Piramide mapeia direto nas camadas.',
    tip: 'Mencionar que SOLID + Hexagonal emergem do TDD ganha pontos com entrevistador senior. Nao sao abordagens isoladas — sao convergentes.',
  },
  {
    level: 'Senior',
    q: 'Como voce define quanto e onde testar? Existe teste demais?',
    a: 'Sim, existe teste demais. Sintomas: PR de feature pequena tem 500 linhas de teste e 50 de codigo, refactor trivial quebra 30 testes, suite roda 10 minutos, time tem medo de mexer. Criterios para decidir o que testar: risco x complexidade — logica complexa e/ou alto risco (financeiro, seguranca) -> muito teste; logica trivial (getter/setter, mapeamento obvio) -> pouco ou nenhum unitario (cobre via integracao); codigo de framework -> nao teste; UI puramente visual -> teste visual (Chromatic), nao unitario. Heuristica: "teste o que doi se quebrar". Sinal de teste demais: voce esta testando getters de DTO, mapeamento 1:1, ou framework. Apaga. Coverage 100% como meta e antipattern — cria fraude.',
    tip: 'Quem so tem dogma "100% coverage" perde para quem mostra criterio claro. Pragmatismo e maturidade caminham juntas.',
  },
  {
    level: 'Senior',
    q: 'Property-Based Testing — quando vale a pena?',
    a: 'PBT: em vez de exemplos manuais (input X -> output Y), voce define uma INVARIANTE que vale para qualquer input, e a ferramenta (fast-check em JS, Hypothesis em Python, QuickCheck em Haskell) gera centenas de inputs aleatorios. Vantagens: pega edge cases que dev humano nao imagina (string vazia, null, numeros enormes, unicode); shrinking — quando falha, reduz input ao minimo que ainda falha. Quando vale: parser, serializer, codificador, funcao matematica, algoritmo, qualquer funcao com invariantes claras (idempotencia, comutatividade, round-trip). Quando NAO vale: logica de negocio com casos discretos (cliente gold = 15% desconto) — exemplo manual e mais claro; side effects dificeis de testar como property. E complementar a TDD por exemplo, nao substituto.',
    tip: 'Citar reverse(reverse(x)) === x e classico de PBT. Mencionar fast-check ja diferencia — biblioteca relativamente recente.',
  },
  {
    level: 'Pleno',
    q: 'O que sao F.I.R.S.T e AAA? Como aplicar?',
    a: 'F.I.R.S.T (Robert Martin) sao propriedades de bom teste: Fast (ms), Independent (sem ordem, sem estado compartilhado), Repeatable (mesmo resultado em qualquer ambiente, offline), Self-validating (passa/falha booleano, sem inspecionar log), Timely (escrito junto com codigo). Falhar uma e red flag. AAA e estrutura de cada teste em 3 blocos: Arrange (prepara entrada e dependencias — mocks, fixtures), Act (executa a acao testada — 1 chamada principal), Assert (valida o resultado — 1 conceito por teste, multiplos asserts ok). Separar com linha em branco torna o teste legivel como spec executavel. Quem mistura os 3 escreve teste denso e dificil de debugar.',
    tip: 'Saber recitar as letras de F.I.R.S.T e AAA e checklist mental. A pergunta e ponto de partida — entrevistador vai aprofundar em qual delas voce mais preza.',
  },
  {
    level: 'Pleno',
    q: 'O que significa testar comportamento e nao implementacao?',
    a: 'Acoplar teste a implementacao interna (verificar que metodo X chamou Y, ou que estado interno e Z) e receita de teste fragil — quebra a cada refactor mesmo sem mudar comportamento. Foque no contrato observavel: dado entrada X, retorno e Y. Exemplo ruim: spyOn no validateEmail e validatePassword, expect que foram chamados. Exemplo bom: expect(login("a@b.com", "pwd").token).toMatch(/jwt\\./). Se voce muda a implementacao (junta validacoes, usa lib externa, etc) e o teste quebra mas o comportamento esta igual, o teste e o bug — nao o codigo.',
    tip: 'Frase de impacto: "teste fragil mata TDD na pratica". Cada refactor que quebra 30 testes faz o time evitar refatorar.',
  },
  {
    level: 'Senior',
    q: 'Cobertura 100% e bom objetivo? Por que?',
    a: 'Nao. Cobertura 100% como meta cria 3 problemas: 1) Fraude — dev escreve assert vazio para "executar" linha sem testar de verdade. 2) Distorcao de prioridade — codigo trivial (getters, mapeamento) recebe teste; codigo critico fica com teste fraco. 3) Falsa seguranca — gerencia ve verde e relaxa. O que importa: testar bem onde doi quebrar (logica de negocio, regras criticas, security). Use coverage como SINAL (linhas nao cobertas existem? Por que?), nao como KPI. Para medir qualidade real, mutation testing (Stryker). Ratio saudavel: 70-85% em codigo de negocio, sem meta universal. Codigo de framework (config, glue) nao precisa de coverage.',
    tip: 'Quem tem coragem de dizer que "100% coverage e antipattern" diferencia de candidato que repete dogma. Mencionar mutation testing como alternativa real eleva o nivel.',
  },
  {
    level: 'Pleno',
    q: 'Como TDD muda o ciclo de bug fix?',
    a: 'Fluxo classico (sem TDD): bug aparece em prod -> dev encontra e corrige direto -> testa manualmente -> merge -> bug volta em 6 meses por outra mudanca. Fluxo com TDD: bug aparece -> dev escreve teste que REPRODUZ o bug PRIMEIRO (RED, falha mostrando bug existe) -> corrige (GREEN, teste passa, bug some) -> refactor opcional -> commit. Beneficios: garantia que o bug existia (test failing comprova), forca entender causa (nao so sintoma), regression test eterno (volta a falhar se alguem reintroduzir), documentacao do bug (proximo dev ve historico). Pratica universal — todo time maduro exige.',
    tip: 'TDD em bug fix e o mais facil de defender em time resistente — beneficio imediato (regression test) sem mudar workflow muito.',
  },
]

// ── Dados: Cheatsheet ────────────────────────────────────────────────────────

const CHEATSHEET_HOOKS: HookItem[] = [
  { name: 'expect(x).toBe(y)',                    sig: 'igualdade estrita ===',                          desc: 'Para primitivos (string, number, boolean)' },
  { name: 'expect(x).toEqual(y)',                 sig: 'igualdade profunda',                              desc: 'Para objetos e arrays' },
  { name: 'expect(x).toMatch(/regex/)',           sig: 'string contem padrao',                            desc: '.toMatch(obj) para parcial em objeto' },
  { name: 'expect(arr).toContain(x)',             sig: 'item presente',                                   desc: '.toHaveLength(n) para tamanho' },
  { name: 'expect(fn).toThrow(/msg/)',            sig: 'lanca erro',                                      desc: 'Funcao precisa estar em arrow se queria erro construtor' },
  { name: 'await expect(p).rejects.toThrow()',    sig: 'promise rejeita',                                 desc: '.resolves.toBe(...) para sucesso async' },
  { name: 'expect(mock).toHaveBeenCalled()',      sig: 'mock foi chamado',                                desc: '.toHaveBeenCalledWith(args), .toHaveBeenCalledTimes(n)' },
  { name: 'expect(mock).toHaveBeenLastCalledWith',sig: 'ultima chamada com args',                         desc: 'Util quando mock foi chamado varias vezes' },
  { name: 'test.each([[a, b]])',                  sig: 'table-driven',                                    desc: 'Mesmo teste com varios inputs' },
  { name: 'test.skip(name, fn)',                  sig: 'pula teste',                                      desc: 'test.only para rodar so um. test.todo para placeholder' },
  { name: 'beforeEach / afterEach',               sig: 'roda antes/depois de cada teste',                 desc: 'Setup/teardown isolado — base do Independent' },
  { name: 'describe(name, fn)',                   sig: 'agrupa testes relacionados',                      desc: 'Nesting permitido. .skip/.only tambem aqui' },
  { name: 'vi.fn() / jest.fn()',                  sig: 'cria mock function',                              desc: '.mockResolvedValue(x) para promise. .mockReturnValue(x)' },
  { name: 'vi.spyOn(obj, "method")',              sig: 'observa metodo real',                             desc: '.mockImplementation(fn) para substituir comportamento' },
  { name: 'vi.useFakeTimers()',                   sig: 'mocka timers',                                    desc: 'vi.advanceTimersByTime(ms). vi.useRealTimers() para restaurar' },
  { name: 'vi.mock("./module")',                  sig: 'mocka modulo inteiro',                            desc: 'Usar antes de import. vi.unmock para reverter' },
]

const CHEATSHEET_RULES: RuleItem[] = [
  { ok: true,  t: 'F.I.R.S.T: Fast (ms), Independent (sem ordem), Repeatable (offline), Self-validating (booleano), Timely (junto com codigo).' },
  { ok: true,  t: 'AAA: Arrange / Act / Assert separados por linha em branco. 1 Act por teste, asserts focados.' },
  { ok: true,  t: 'Naming: "comportamento esperado dado contexto" — ex: "retorna 401 para token expirado". Nao "testa funcao login".' },
  { ok: true,  t: 'Mock so a fronteira (rede, DB, clock, fs). Resto roda real ou via fake (in-memory).' },
  { ok: true,  t: 'Bug fix: teste reproduzindo o bug PRIMEIRO. Garante regression test eterno.' },
  { ok: true,  t: 'Test.each para edge cases — table-driven cobre boundaries sem repetir codigo.' },
  { ok: false, t: 'Testar implementacao (spyOn em metodo interno). Acopla teste ao design — quebra em refactor.' },
  { ok: false, t: 'Mockar tudo. Mock 5+ colaboradores num teste = teste de mock, nao de codigo.' },
  { ok: false, t: 'Estado global mutavel entre testes. Use beforeEach com setup isolado.' },
  { ok: false, t: 'Cobertura 100% como meta. Vira fraude (assert vazio). Use coverage como sinal, mutation testing para qualidade.' },
  { ok: false, t: 'Snapshot grande com timestamps/IDs. Falso positivo a cada commit. Use asserts especificos.' },
  { ok: false, t: 'Teste async sem await. Acaba antes do assert. Use async/await sempre.' },
]

// ── Dados: Mnemonicos ────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'Ciclo TDD — RED · GREEN · REFACTOR',
    trick: 'R-G-R',
    expansion: [
      ['R', 'RED — escreva o teste que FALHA (1-3 min)'],
      ['G', 'GREEN — codigo MINIMO para passar (pode ser feio, hardcoded)'],
      ['R', 'REFACTOR — limpa sem mudar comportamento, com suite verde'],
    ],
    explanation: 'Cada fase dura 1-5 minutos. Pular RED = nao garante que teste mede algo. Pular REFACTOR = codigo verde feio acumula divida. Os 3 juntos dao o ganho de design emergente.',
    example: '// 1. RED — falha\ntest("soma 2+3=5", () => { expect(somar(2,3)).toBe(5) })\n\n// 2. GREEN — minimo\nfunction somar(a, b) { return a + b }\n\n// 3. REFACTOR — limpa estrutura',
    why: 'Pular RED = teste pode estar testando errado. Pular REFACTOR = codigo vira espaguete verde.',
  },
  {
    label: 'F.I.R.S.T — propriedades de bom teste',
    trick: 'F-I-R-S-T',
    expansion: [
      ['F', 'Fast — ms, suite em segundos. Mocka I/O.'],
      ['I', 'Independent — sem ordem, sem estado compartilhado.'],
      ['R', 'Repeatable — mesmo resultado em qualquer ambiente, offline.'],
      ['S', 'Self-validating — passa/falha booleano, sem inspecionar log.'],
      ['T', 'Timely — escrito JUNTO com codigo, nao "depois quando der tempo".'],
    ],
    explanation: 'Falhar uma propriedade e red flag. Falhar duas e teatro de teste — apaga e refaz. Antes de commitar um teste, varra as 5 propriedades mentalmente.',
    example: '// FALHA F.I.R.S.T:\nawait fetch("https://api.real.com")     // R: depende de rede\nawait new Promise(r => setTimeout(r, 1000)) // F: lento\nconsole.log("check")                    // S: nao e self-validating',
    why: 'Suite que viola F.I.R.S.T fica lenta, flaky e perde a confianca do time — vira ritual ignorado.',
  },
  {
    label: 'AAA — estrutura de cada teste',
    trick: 'A-A-A',
    expansion: [
      ['A', 'Arrange — prepara entrada, mocks, fixtures'],
      ['A', 'Act — executa a acao testada (1 chamada principal)'],
      ['A', 'Assert — valida o resultado (1 conceito por teste)'],
    ],
    explanation: 'Separar com linha em branco torna o teste legivel como spec executavel. 1 Act por teste e a regra — multiplos Asserts ok se mesmo conceito. Misturar os 3 cria teste denso e dificil de debugar.',
    example: 'test("aplica desconto 15% para cliente gold", () => {\n  // Arrange\n  const pedido = { itens: [{preco: 100, qtd: 10}], cliente: {tipo: "gold"} }\n\n  // Act\n  const total = calcularTotalComDesconto(pedido)\n\n  // Assert\n  expect(total).toBe(850)\n})',
    why: 'Teste sem AAA vira parede de codigo onde voce nao sabe onde comeca a acao testada — ruim para debug e para revisao.',
  },
  {
    label: 'Piramide — 70/20/10',
    trick: '70-20-10',
    expansion: [
      ['70%', 'Unitarios — base, ms, isolam logica pura'],
      ['20%', 'Integracao — meio, fronteiras (DB/HTTP), validam contratos'],
      ['10%', 'E2E — topo, app/browser real, fluxo critico'],
    ],
    explanation: 'Heuristica, nao dogma. O importante e o gradiente: muitos rapidos focados embaixo, poucos lentos abrangentes em cima. Inversao = ice cream cone (mais E2E que unitario) -> CI demora 40min, suite flaky, ninguem sabe onde quebrou.',
    example: '// Unitario — funcao pura, ms\ntest("formatarMoeda(1234.56) = R$ 1.234,56")\n\n// Integracao — DB real (testcontainers)\ntest("UserRepo.save + findById")\n\n// E2E — Playwright\ntest("checkout completo")',
    why: 'Variacao moderna para frontend: Testing Trophy (Kent C. Dodds) — peso maior em integracao.',
  },
  {
    label: 'Test doubles — S-M-F-S-D',
    trick: 'Stub · Mock · Fake · Spy · Dummy',
    expansion: [
      ['Stub',  'Retorna valor canned. Nao verifica chamada.'],
      ['Mock',  'Stub + verifica chamada (toHaveBeenCalledWith).'],
      ['Fake',  'Implementacao real simplificada (in-memory DB).'],
      ['Spy',   'Wrappa real, registra chamadas, deixa executar.'],
      ['Dummy', 'Preenche parametro obrigatorio nao usado no teste.'],
    ],
    explanation: 'Mock so a fronteira (rede, DB, clock, fs); o resto roda real. Quando voce mocka 5 colaboradores num teste, voce esta testando o mock, nao o codigo. Mock excessivo = teste de mock.',
    example: '// Stub\nconst stub = { fetchUser: () => ({id: 1}) }\n\n// Mock\nconst m = vi.fn()\nexpect(m).toHaveBeenCalledWith({id: 1})\n\n// Fake\nclass InMemRepo { users = new Map() }\n\n// Spy\nconst spy = vi.spyOn(console, "log")',
    why: 'Confundir mock com fake e o erro mais comum em entrevista. Mock verifica interacao; Fake substitui implementacao.',
  },
]

// ── Dados: Anti-patterns ─────────────────────────────────────────────────────

const ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'Testar implementacao em vez de comportamento',
    badDesc: 'spyOn em metodo interno — teste quebra a cada refactor sem mudar comportamento',
    badCode: [
      { t:'test("login chama validateEmail e validatePassword", () => {' },
      { t:'  const valEmail = vi.spyOn(svc, "validateEmail")', c:'#ef4444' },
      { t:'  const valPwd   = vi.spyOn(svc, "validatePassword")', c:'#ef4444' },
      { t:'  svc.login("a@b.com", "pwd")' },
      { t:'  expect(valEmail).toHaveBeenCalled()', c:'#ef4444' },
      { t:'  expect(valPwd).toHaveBeenCalled()', c:'#ef4444' },
      { t:'})' },
    ],
    goodDesc: 'Testa comportamento observavel — sobrevive a qualquer refactor',
    goodCode: [
      { t:'test("login retorna token para credenciais validas", () => {' },
      { t:'  const { token, error } = svc.login("a@b.com", "pwd")' },
      { t:'  expect(token).toMatch(/^jwt\\./)', c:'#22c55e' },
      { t:'  expect(error).toBeNull()', c:'#22c55e' },
      { t:'})' },
      { t:'' },
      { t:'test("login retorna erro para email invalido", () => {' },
      { t:'  const { token, error } = svc.login("invalido", "pwd")' },
      { t:'  expect(error).toBe("email invalido")', c:'#22c55e' },
      { t:'})' },
    ],
    why: 'Acoplar teste a chamada interna (verificar que metodo X chamou Y) e receita de teste fragil. Foque no contrato observavel: dado entrada X, retorno e Y. Se voce muda implementacao e teste quebra com comportamento igual, o teste e o bug.',
  },
  {
    title: 'Mockar tudo — teste de mock',
    badDesc: '5+ colaboradores mockados — testa o mock, nao o codigo',
    badCode: [
      { t:'test("processa user", async () => {' },
      { t:'  const repo  = vi.fn().mockResolvedValue({id: 1})', c:'#ef4444' },
      { t:'  const log   = vi.fn()', c:'#ef4444' },
      { t:'  const cache = vi.fn().mockResolvedValue(null)', c:'#ef4444' },
      { t:'  const email = vi.fn().mockResolvedValue(true)', c:'#ef4444' },
      { t:'  const ana   = vi.fn().mockReturnValue("clean")', c:'#ef4444' },
      { t:'  // tudo mockado — nao testa nada real', c:'#ef4444' },
      { t:'})' },
    ],
    goodDesc: 'Mock so a fronteira (rede); resto roda real ou via fake in-memory',
    goodCode: [
      { t:'test("processa user", async () => {' },
      { t:'  const externalApi = vi.fn().mockResolvedValue({ok: true})', c:'#22c55e' },
      { t:'  const repo  = new InMemoryRepo()', c:'#22c55e' },
      { t:'  const cache = new InMemoryCache()', c:'#22c55e' },
      { t:'  const result = await processar({repo, cache, externalApi})' },
      { t:'  expect(result.status).toBe("ok")', c:'#22c55e' },
      { t:'})' },
    ],
    why: 'Quando voce mocka 5 colaboradores, voce esta testando o mock, nao o codigo. Mock so a fronteira (rede, DB, clock, fs); o resto roda real ou via fakes (in-memory). Senao, mock pode mentir e prod quebra.',
  },
  {
    title: 'Estado compartilhado entre testes',
    badDesc: 'Variavel global mutavel — flake garantido em paralelismo ou ordem aleatoria',
    badCode: [
      { t:'let users = []', c:'#ef4444' },
      { t:'' },
      { t:'test("cria user", () => {' },
      { t:'  users.push({id: 1})', c:'#ef4444' },
      { t:'  expect(users).toHaveLength(1)' },
      { t:'})' },
      { t:'' },
      { t:'test("lista users", () => {' },
      { t:'  expect(users).toHaveLength(1)', c:'#ef4444' },
      { t:'  // depende do anterior!', c:'#ef4444' },
      { t:'})' },
    ],
    goodDesc: 'beforeEach com setup isolado — cada teste comeca do zero',
    goodCode: [
      { t:'let users: User[]' },
      { t:'' },
      { t:'beforeEach(() => {', c:'#22c55e' },
      { t:'  users = []', c:'#22c55e' },
      { t:'})' },
      { t:'' },
      { t:'test("cria user", () => {' },
      { t:'  users.push({id: 1})' },
      { t:'  expect(users).toHaveLength(1)' },
      { t:'})' },
    ],
    why: 'Estado global mutavel entre testes garante flake. Teste passa sozinho mas falha em paralelo ou ordem aleatoria. beforeEach com setup isolado e a regra. Rode com --shuffle para revelar dependencias de ordem.',
  },
  {
    title: 'Cobertura como meta — fraude legitimada',
    badDesc: '100% coverage com asserts vazios — passa metrica, nao testa nada',
    badCode: [
      { t:'function ehAdulto(idade: number) {' },
      { t:'  return idade >= 18' },
      { t:'}' },
      { t:'' },
      { t:'test("ehAdulto", () => {' },
      { t:'  ehAdulto(20)', c:'#ef4444' },
      { t:'  ehAdulto(10)', c:'#ef4444' },
      { t:'  // executa mas nao verifica!', c:'#ef4444' },
      { t:'})' },
    ],
    goodDesc: 'Table-driven testando boundaries + mutation testing para qualidade',
    goodCode: [
      { t:'test.each([', c:'#22c55e' },
      { t:'  [17, false],', c:'#22c55e' },
      { t:'  [18, true],   // boundary', c:'#22c55e' },
      { t:'  [19, true],', c:'#22c55e' },
      { t:'  [0,  false],', c:'#22c55e' },
      { t:'])("ehAdulto(%i) === %s", (idade, esperado) => {' },
      { t:'  expect(ehAdulto(idade)).toBe(esperado)', c:'#22c55e' },
      { t:'})' },
      { t:'// Stryker confirma qualidade real dos asserts', c:'#94a3b8' },
    ],
    why: '90% de coverage com asserts vazios e teatro. 60% com asserts duros vale mais. Use mutation testing (Stryker) para medir qualidade — a ferramenta muda seu codigo (= em !=) e checa se algum teste pega. Coverage como KPI vira fraude.',
  },
  {
    title: 'Snapshot gigante e instavel',
    badDesc: 'Snapshot 1000+ linhas com timestamps e IDs — falsos positivos a cada commit',
    badCode: [
      { t:'test("renderiza pagina", () => {' },
      { t:'  const out = render(<App />)' },
      { t:'  expect(out).toMatchSnapshot()', c:'#ef4444' },
      { t:'  // gera 1000+ linhas com timestamps,', c:'#ef4444' },
      { t:'  // ids gerados, datas — sempre muda', c:'#ef4444' },
      { t:'})' },
    ],
    goodDesc: 'Asserts especificos para estrutura critica',
    goodCode: [
      { t:'test("renderiza com titulo correto", () => {' },
      { t:'  const out = render(<App />)' },
      { t:'  expect(out.getByRole("heading"))', c:'#22c55e' },
      { t:'    .toHaveTextContent("Dashboard")', c:'#22c55e' },
      { t:'  expect(out.getByRole("button", {name: /salvar/i}))', c:'#22c55e' },
      { t:'    .toBeEnabled()', c:'#22c55e' },
      { t:'})' },
    ],
    why: 'Snapshot grande com dados volateis gera falso positivo. Dev acaba aceitando "update snapshot" sem ler — sumir com regressoes reais. Prefira asserts explicitos. Snapshot so para output pequeno e estavel.',
  },
  {
    title: 'Teste assincrono sem await',
    badDesc: 'expect dentro de .then sem return ou await — teste acaba antes do assert',
    badCode: [
      { t:'test("busca user", () => {' },
      { t:'  fetchUser(1).then(u => {', c:'#ef4444' },
      { t:'    expect(u.name).toBe("Ana")', c:'#ef4444' },
      { t:'  })' },
      { t:'  // teste retorna antes do then!', c:'#ef4444' },
      { t:'})' },
      { t:'' },
      { t:'test("rejeita id invalido", async () => {' },
      { t:'  expect(fetchUser(-1)).rejects.toThrow()', c:'#ef4444' },
      { t:'  // sem await — promise nao e esperada!', c:'#ef4444' },
      { t:'})' },
    ],
    goodDesc: 'async/await em todos os asserts assincronos',
    goodCode: [
      { t:'test("busca user", async () => {', c:'#22c55e' },
      { t:'  const user = await fetchUser(1)', c:'#22c55e' },
      { t:'  expect(user.name).toBe("Ana")', c:'#22c55e' },
      { t:'})' },
      { t:'' },
      { t:'test("rejeita id invalido", async () => {' },
      { t:'  await expect(fetchUser(-1))', c:'#22c55e' },
      { t:'    .rejects.toThrow("id invalido")', c:'#22c55e' },
      { t:'})' },
    ],
    why: 'Sem await/return, o teste acaba antes do assert rodar — passa silenciosamente. Use async/await sempre. Em rejects/resolves, await ou return da promise. Teste que nunca falha e teatro.',
  },
  {
    title: 'Ice cream cone — piramide invertida',
    badDesc: 'Muito E2E, pouco unitario — CI demora 40min e fica flaky',
    badCode: [
      { t:'// 60% E2E, 25% integracao, 15% unitario', c:'#ef4444' },
      { t:'tests/' },
      { t:'  e2e/      <- 200 testes Playwright (40min)', c:'#ef4444' },
      { t:'  integ/    <-  60 testes integracao (5min)' },
      { t:'  unit/     <-  30 testes unitarios (10s)' },
      { t:'' },
      { t:'// quando quebra: backend? frontend? infra?', c:'#ef4444' },
    ],
    goodDesc: 'Piramide saudavel — 70/20/10 — falhas apontam para arquivo especifico',
    goodCode: [
      { t:'// 70% unitario, 20% integracao, 10% E2E', c:'#22c55e' },
      { t:'tests/' },
      { t:'  unit/     <- 700 testes unitarios (20s)', c:'#22c55e' },
      { t:'  integ/    <- 200 testes integracao (1min)', c:'#22c55e' },
      { t:'  e2e/      <-  30 fluxos criticos (2min)', c:'#22c55e' },
      { t:'' },
      { t:'// total CI: 3-4min. falha aponta para arquivo', c:'#22c55e' },
    ],
    why: 'Inversao da piramide acontece quando time nao confia na logica isolada. Sintomas: CI demora 40min, suite flaky, quando quebra ninguem sabe onde olhar. Causa: design acoplado que nao permite testar unidade ou tentativa de cobrir buracos com E2E.',
  },
]

// ── Builders ─────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'TDD',
    stackLabel: 'Engenharia de software',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'TDD',
    accentColor: C,
    stackLabel: 'Engenharia de software',
    sections: {
      hooks: CHEATSHEET_HOOKS,
      depRows: [],
      rules: CHEATSHEET_RULES,
      performanceTips: [],
      patterns: [],
      mentalModels: [],
    },
  }),
  mnemonics: () => buildMnemonicsPdf({
    skillName: 'TDD',
    accentColor: C,
    stackLabel: 'Engenharia de software',
    mnemonics: MNEMONICS,
  }),
  antipatterns: () => buildAntipatternsPdf({
    skillName: 'TDD',
    accentColor: C,
    stackLabel: 'Engenharia de software',
    antipatterns: ANTIPATTERNS,
  }),
}

// ── Componente ───────────────────────────────────────────────────────────────

export default function TddPdfs() {
  const [open, setOpen] = useState<PdfCard | null>(null)
  const hero = PDF_CARDS[0]
  const rest = PDF_CARDS.slice(1)

  return (
    <>
      <HeroCard card={hero} accent={C} onOpen={() => setOpen(hero)} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 16 }}>
        {rest.map(c => (
          <CollectionCard key={c.id} card={c} accent={C} onOpen={() => setOpen(c)} />
        ))}
      </div>
      {open && (
        <PdfModal card={open} onClose={() => setOpen(null)} builders={PDF_BUILDERS} />
      )}
    </>
  )
}

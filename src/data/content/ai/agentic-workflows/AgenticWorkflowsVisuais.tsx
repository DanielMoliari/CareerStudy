'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { StateMachineExplorer } from '@/components/visuals/StateMachineExplorer'
import type { SMState, SMTransition } from '@/components/visuals/StateMachineExplorer'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { DecisionTree } from '@/components/visuals/DecisionTree'
import type { DTNode } from '@/components/visuals/DecisionTree'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'
import { SequenceDiagram } from '@/components/visuals/SequenceDiagram'
import type { SeqActor, SeqMessage, SeqGroup } from '@/components/visuals/SequenceDiagram'
import { ProgressionMap } from '@/components/visuals/ProgressionMap'
import type { ProgressionLevel } from '@/components/visuals/ProgressionMap'

// ── Paleta Agentic Workflows ─────────────────────────────────────────────────
const C      = '#F59E0B'   // âmbar — IA/agentes
const C2     = '#d97706'   // âmbar escuro
const BG     = '#0f172a'
const CARD   = '#1e293b'
const LINE   = '#334155'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const GRN    = '#4ade80'
const RED    = '#ef4444'
const PRP    = '#a78bfa'
const SKY    = '#38bdf8'

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Loop ReAct: máquina de estados do agente
// ═══════════════════════════════════════════════════════════════════════════════

const REACT_STATES: SMState[] = [
  { id: 'idle',    label: 'Ocioso',      description: 'Aguardando tarefa do usuário. Context window vazio.',                                                        color: FGMUTE, isInitial: true },
  { id: 'observe', label: 'Observa',     description: 'Agente lê o ambiente: mensagem do usuário + resultados de tool calls anteriores. Tudo que está no contexto.', color: SKY },
  { id: 'think',   label: 'Raciocina',   description: 'Chain-of-Thought interno: o LLM pensa em voz alta antes de decidir. Escolhe a próxima ação ou tool call.',     color: C },
  { id: 'act',     label: 'Age',         description: 'Emite tool_call com name e input estruturado (JSON). A sua aplicação executa a ferramenta real — não o LLM.',   color: C2 },
  { id: 'result',  label: 'Observa Resultado', description: 'Resultado da tool entra no contexto como mensagem role=tool. O agente decide: repetir loop ou finalizar.', color: PRP },
  { id: 'done',    label: 'Final Answer', description: 'Agente emite resposta final quando tem informação suficiente, atingiu max_iterations ou max_cost foi excedido.', color: GRN, isFinal: true },
  { id: 'hitl',   label: 'Human-in-the-loop', description: 'Antes de ações irreversíveis (deletar dados, enviar e-mail, efetuar pagamento), o agente pausa e aguarda aprovação humana.', color: RED },
]

const REACT_TRANSITIONS: SMTransition[] = [
  { from: 'idle',    to: 'observe', event: 'tarefa recebida',      code: 'messages.push({ role: "user", content: task })' },
  { from: 'observe', to: 'think',   event: 'contexto carregado',   code: 'llm.complete(messages, tools)' },
  { from: 'think',   to: 'act',     event: 'tool_call emitido',    guard: 'stop_reason === "tool_use"', code: 'toolCall = response.content[0]' },
  { from: 'think',   to: 'done',    event: 'resposta final',       guard: 'stop_reason === "end_turn"' },
  { from: 'think',   to: 'hitl',    event: 'ação irreversível detectada', guard: 'isDestructiveAction(toolCall)' },
  { from: 'hitl',    to: 'act',     event: 'aprovação humana',     code: 'await humanApproval()' },
  { from: 'hitl',    to: 'done',    event: 'rejeitado / cancelado' },
  { from: 'act',     to: 'result',  event: 'tool executada',       code: 'result = await executeTool(toolCall)' },
  { from: 'result',  to: 'observe', event: 'loop continua',        code: 'messages.push({ role: "tool", content: result })' },
  { from: 'result',  to: 'done',    event: 'objetivo cumprido',    guard: 'agentDecidesDone()' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — Padrões de raciocínio: CoT, ToT, ReAct, Reflexion
// ═══════════════════════════════════════════════════════════════════════════════

const REASONING_OPTIONS: ComparisonOption[] = [
  { id: 'cot',       label: 'Chain of Thought',  sublabel: 'CoT',       color: C },
  { id: 'tot',       label: 'Tree of Thought',   sublabel: 'ToT',       color: SKY },
  { id: 'react',     label: 'ReAct',             sublabel: 'Reason+Act', color: PRP },
  { id: 'reflexion', label: 'Reflexion',         sublabel: 'autocrítica', color: GRN },
]

const REASONING_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'approach', label: 'Abordagem', category: 'Fundamentos',
    description: 'Como o modelo estrutura o raciocínio internamente.',
    values: {
      cot:       { rating: 'good',      note: 'Passos lineares: "Primeiro faço X, depois Y…"' },
      tot:       { rating: 'excellent', note: 'Árvore de possibilidades com backtrack e busca BFS/DFS' },
      react:     { rating: 'excellent', note: 'Intercala Thought → Action → Observation em loop' },
      reflexion: { rating: 'good',      note: 'CoT + autocrítica após cada tentativa com memória de erros' },
    },
  },
  {
    id: 'tools', label: 'Uso de ferramentas', category: 'Capacidades',
    description: 'Integração com tool use (APIs, código, buscas).',
    values: {
      cot:       { rating: 'poor',      note: 'Não usa tools — só raciocínio interno' },
      tot:       { rating: 'fair',      note: 'Pode usar tools em cada nó da árvore' },
      react:     { rating: 'excellent', note: 'Projetado para tool use: Action é sempre uma tool call' },
      reflexion: { rating: 'good',      note: 'Usa tools e reflete sobre os resultados obtidos' },
    },
  },
  {
    id: 'cost', label: 'Custo de tokens', category: 'Operacional',
    description: 'Volume de tokens gerados por chamada.',
    values: {
      cot:       { rating: 'good',   note: 'Moderado — apenas raciocínio linear sem loop' },
      tot:       { rating: 'poor',   note: 'Alto — explora múltiplos caminhos antes de decidir' },
      react:     { rating: 'fair',   note: 'Cresce com o número de iterações do loop' },
      reflexion: { rating: 'poor',   note: 'Alto — memória acumulativa de tentativas anteriores' },
    },
  },
  {
    id: 'complex', label: 'Tarefas complexas', category: 'Capacidades',
    description: 'Desempenho em tarefas que exigem planejamento longo.',
    values: {
      cot:       { rating: 'fair',      note: 'Boa para tasks lineares; falha em planejamento longo' },
      tot:       { rating: 'excellent', note: 'Ótima para exploração de soluções e problemas abertos' },
      react:     { rating: 'excellent', note: 'Excelente para tasks que dependem de resultados externos' },
      reflexion: { rating: 'good',      note: 'Boa para iterações que precisam de correção progressiva' },
    },
  },
  {
    id: 'latency', label: 'Latência', category: 'Operacional',
    description: 'Tempo até a resposta final para o usuário.',
    values: {
      cot:       { rating: 'good',      note: 'Rápido — uma passagem de raciocínio' },
      tot:       { rating: 'poor',      note: 'Lento — múltiplas chamadas para explorar a árvore' },
      react:     { rating: 'fair',      note: 'Depende do número de loops e da latência das tools' },
      reflexion: { rating: 'poor',      note: 'Lento — múltiplas tentativas com reflexão entre cada uma' },
    },
  },
  {
    id: 'debug', label: 'Depurabilidade', category: 'Operacional',
    description: 'Facilidade de entender o que o agente fez e por quê.',
    values: {
      cot:       { rating: 'excellent', note: 'Totalmente legível — raciocínio explícito no texto' },
      tot:       { rating: 'good',      note: 'Árvore visível mas pode ser extensa' },
      react:     { rating: 'excellent', note: 'Thought/Action/Observation totalmente rastreável' },
      reflexion: { rating: 'good',      note: 'Reflexões explícitas tornam os erros visíveis' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Tool use: Sequence Diagram completo
// ═══════════════════════════════════════════════════════════════════════════════

const TOOL_ACTORS: SeqActor[] = [
  { id: 'user',    label: 'Usuário',         color: FGMUTE },
  { id: 'app',     label: 'Sua Aplicação',   color: C },
  { id: 'llm',     label: 'LLM (Anthropic)',  color: PRP },
  { id: 'tool',    label: 'Tool (API/código)', color: SKY },
]

const TOOL_MESSAGES: SeqMessage[] = [
  { from: 'user', to: 'app',  label: 'Tarefa: "Qual o clima em SP?"',    type: 'sync' },
  { from: 'app',  to: 'llm',  label: 'messages + tools=[get_weather]',   type: 'sync', note: 'Tool schema com input_schema JSON' },
  { from: 'llm',  to: 'app',  label: 'stop_reason="tool_use"',           type: 'return', note: 'content: [{type:"tool_use", name:"get_weather", input:{city:"SP"}}]' },
  { from: 'app',  to: 'app',  label: 'Verifica stop_reason === "tool_use"', type: 'sync' },
  { from: 'app',  to: 'tool', label: 'executeTool("get_weather", {city:"SP"})', type: 'async' },
  { from: 'tool', to: 'app',  label: '{temp: 24, condition: "nublado"}', type: 'return' },
  { from: 'app',  to: 'app',  label: 'Adiciona resultado ao messages[]',  type: 'sync', note: 'role="tool", tool_use_id=<id>' },
  { from: 'app',  to: 'llm',  label: 'Nova chamada com resultado no contexto', type: 'sync' },
  { from: 'llm',  to: 'app',  label: 'stop_reason="end_turn"',           type: 'return', note: 'Agente tem informação suficiente para responder' },
  { from: 'app',  to: 'user', label: '"A temperatura em SP é 24°C, nublado."', type: 'return' },
]

const TOOL_GROUPS: SeqGroup[] = [
  { label: 'Loop ReAct — itera até end_turn ou max_iterations', kind: 'loop', fromMsg: 1, toMsg: 7, color: `${C}22` },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Topologias multi-agente: comparação de arquiteturas
// ═══════════════════════════════════════════════════════════════════════════════

const TOPOLOGY_OPTIONS: ComparisonOption[] = [
  { id: 'single',     label: 'Single Agent',    sublabel: '1 LLM + N tools',        color: C },
  { id: 'supervisor', label: 'Supervisor',      sublabel: 'orquestrador + subagentes', color: PRP },
  { id: 'hier',       label: 'Hierárquico',     sublabel: 'Plan-and-Execute',        color: SKY },
  { id: 'swarm',      label: 'Swarm / Peer',    sublabel: 'handoff sem central',     color: GRN },
]

const TOPOLOGY_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'complexity', label: 'Complexidade de implementação', category: 'Implementação',
    values: {
      single:     { rating: 'excellent', note: 'Mínima — um loop, uma lista de tools' },
      supervisor: { rating: 'fair',      note: 'Moderada — orquestrador precisa de lógica de delegação' },
      hier:       { rating: 'poor',      note: 'Alta — múltiplos níveis de coordenação' },
      swarm:      { rating: 'fair',      note: 'Moderada, mas comportamento emergente é difícil de prever' },
    },
  },
  {
    id: 'cost', label: 'Custo de LLM (tokens)', category: 'Operacional',
    values: {
      single:     { rating: 'excellent', note: 'Barato — um modelo com contexto compartilhado' },
      supervisor: { rating: 'fair',      note: '2-3× mais caro — orquestrador + cada subagente' },
      hier:       { rating: 'good',      note: 'Econômico se workers usam modelo barato (Haiku)' },
      swarm:      { rating: 'fair',      note: 'Variável — depende de quantos handoffs ocorrem' },
    },
  },
  {
    id: 'specialization', label: 'Especialização de agentes', category: 'Capacidades',
    values: {
      single:     { rating: 'poor',      note: 'Um generalista — performance piora com muitas ferramentas' },
      supervisor: { rating: 'excellent', note: 'Cada subagente tem domínio e tools próprios' },
      hier:       { rating: 'excellent', note: 'Forte separação: planejamento vs execução' },
      swarm:      { rating: 'excellent', note: 'Especialistas que se passam o controle quando necessário' },
    },
  },
  {
    id: 'debugability', label: 'Depurabilidade', category: 'Operacional',
    values: {
      single:     { rating: 'excellent', note: 'Fluxo linear — fácil de rastrear no Langfuse' },
      supervisor: { rating: 'good',      note: 'Hierarquia clara mas requer tracing multi-nível' },
      hier:       { rating: 'fair',      note: 'Difícil — erros podem vir de qualquer nível' },
      swarm:      { rating: 'poor',      note: 'Comportamento emergente — fluxo imprevisível' },
    },
  },
  {
    id: 'usecase', label: 'Melhor caso de uso', category: 'Aplicação',
    values: {
      single:     { rating: 'excellent', note: 'Tasks que cabem num contexto, tools < 10' },
      supervisor: { rating: 'excellent', note: 'Tasks longas com fases distintas (pesquisa → síntese → revisão)' },
      hier:       { rating: 'good',      note: 'Tasks previsíveis onde planejamento é valioso' },
      swarm:      { rating: 'good',      note: 'Colaboração aberta entre especialistas (debate, brainstorm)' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — Memory types: tipos de memória do agente
// ═══════════════════════════════════════════════════════════════════════════════

const MEMORY_LAYERS: Layer[] = [
  {
    id: 'in-context',
    label: 'In-Context Memory',
    sublabel: 'memória de curto prazo',
    description: 'Tudo que está no context window da chamada atual: mensagens, tool results, instruções do sistema. Temporária — desaparece quando a sessão termina. Limite: 200K tokens (Claude) / 128K (GPT-4o).',
    code: 'messages = [{ role: "user", content: "..." }, { role: "tool", content: result }]',
    color: C,
    examples: ['Histórico da conversa atual', 'Resultados de tool calls', 'Instruções do sistema', 'Scratchpad de raciocínio (CoT)'],
  },
  {
    id: 'external',
    label: 'External Memory (Vector DB)',
    sublabel: 'memória de longo prazo semântica',
    description: 'Documentos, conversas passadas e conhecimento de domínio armazenados num banco vetorial. O agente recupera chunks relevantes via similaridade semântica (RAG) e os injeta no contexto antes de raciocinar.',
    code: 'chunks = vectorDB.search(query, top_k=5)\nmessages.push({ role: "user", content: chunks })',
    color: SKY,
    examples: ['Documentos de produto (RAG)', 'Conversas passadas recuperáveis', 'Base de conhecimento corporativa', 'Resultados de pesquisas anteriores'],
  },
  {
    id: 'episodic',
    label: 'Episodic Memory',
    sublabel: 'memória de experiências passadas',
    description: 'Memória de episódios específicos: "Na conversa de terça, o usuário preferiu respostas curtas". Armazenada em banco de dados estruturado e recuperada explicitamente. Permite personalização e aprendizado de erros.',
    code: 'episodic.save({ user_id, session_id, summary, outcome })\nhistory = episodic.recall(user_id, top_k=3)',
    color: PRP,
    examples: ['Preferências aprendidas por usuário', 'Erros passados e como foram corrigidos', 'Resumos de sessões anteriores', 'Contexto de projetos em andamento'],
  },
  {
    id: 'procedural',
    label: 'Procedural Memory',
    sublabel: 'memória de como executar tarefas',
    description: 'Instruções, playbooks e procedures armazenados como parte do system prompt ou recuperados dinamicamente. Define como o agente deve executar classes de tarefas — o "como fazer" permanente.',
    code: 'systemPrompt = procedures.get("code_review_workflow")',
    color: `${C2}`,
    examples: ['System prompt com instruções permanentes', 'Playbooks de resposta a incidentes', 'Workflows de processo (onboarding, code review)', 'Regras de negócio fixas'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — Anti-patterns: erros clássicos em agentes
// ═══════════════════════════════════════════════════════════════════════════════

const AGENT_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'Sem teto de iterações — loop infinito',
    wrong: [
      [{ text: '// Agente sem max_iterations', color: RED }],
      [{ text: 'while (true) {', color: '#e2e8f0' }],
      [{ text: '  const res = await llm.complete(messages)', color: '#e2e8f0' }],
      [{ text: '  if (res.stop_reason === "end_turn") break', color: '#e2e8f0' }],
      [{ text: '  // sem limite: custo explode, pode rodar para sempre', color: RED }],
      [{ text: '}', color: '#e2e8f0' }],
    ],
    right: [
      [{ text: '// Sempre definir teto de segurança', color: GRN }],
      [{ text: 'const MAX_ITER = 15; let iter = 0', color: '#e2e8f0' }],
      [{ text: 'while (iter++ < MAX_ITER) {', color: '#e2e8f0' }],
      [{ text: '  const res = await llm.complete(messages)', color: '#e2e8f0' }],
      [{ text: '  if (res.stop_reason === "end_turn") break', color: '#e2e8f0' }],
      [{ text: '  // também monitorar cost via usage_metadata', color: GRN }],
      [{ text: '}', color: '#e2e8f0' }],
    ],
    why: 'Sem max_iterations, um bug ou instrução ambígua pode colocar o agente em loop por centenas de iterações, acumulando custo de tokens e possivelmente corrompendo estado.',
  },
  {
    title: 'Ação irreversível sem human-in-the-loop',
    wrong: [
      [{ text: '// Tool que deleta dados sem aprovação', color: RED }],
      [{ text: 'const tools = [', color: '#e2e8f0' }],
      [{ text: '  { name: "delete_records",', color: '#e2e8f0' }],
      [{ text: '    description: "Delete all records for a user" }', color: '#e2e8f0' }],
      [{ text: ']', color: '#e2e8f0' }],
      [{ text: '// Agente pode chamar isso diretamente — irreversível!', color: RED }],
    ],
    right: [
      [{ text: '// Interceptar ações destrutivas antes de executar', color: GRN }],
      [{ text: 'const DESTRUCTIVE = ["delete_records", "send_email"]', color: '#e2e8f0' }],
      [{ text: 'if (DESTRUCTIVE.includes(toolCall.name)) {', color: '#e2e8f0' }],
      [{ text: '  const ok = await askHumanApproval(toolCall)', color: C }],
      [{ text: '  if (!ok) return { error: "Cancelled by user" }', color: '#e2e8f0' }],
      [{ text: '}', color: '#e2e8f0' }],
      [{ text: 'return executeTool(toolCall)', color: '#e2e8f0' }],
    ],
    why: 'Agentes em produção podem chamar ferramentas destrutivas (deletar dados, enviar e-mails em massa, efetuar pagamentos) sem hesitação. Human-in-the-loop é obrigatório antes de qualquer ação irreversível.',
  },
  {
    title: 'Tool sem validação de output',
    wrong: [
      [{ text: '// Tool retorna dado bruto sem verificar', color: RED }],
      [{ text: 'async function searchWeb(query: string) {', color: '#e2e8f0' }],
      [{ text: '  const result = await fetch(searchAPI + query)', color: '#e2e8f0' }],
      [{ text: '  return await result.json() // pode ser qualquer coisa', color: RED }],
      [{ text: '}', color: '#e2e8f0' }],
      [{ text: '// LLM recebe dados não sanitizados — prompt injection risk', color: RED }],
    ],
    right: [
      [{ text: '// Validar e sanitizar output antes de injetar no contexto', color: GRN }],
      [{ text: 'async function searchWeb(query: string) {', color: '#e2e8f0' }],
      [{ text: '  const raw = await fetch(searchAPI + query).then(r => r.json())', color: '#e2e8f0' }],
      [{ text: '  // Validar schema', color: GRN }],
      [{ text: '  const parsed = SearchResultSchema.parse(raw)', color: C }],
      [{ text: '  // Limitar tamanho para não explodir contexto', color: GRN }],
      [{ text: '  return { results: parsed.items.slice(0, 5) }', color: '#e2e8f0' }],
      [{ text: '}', color: '#e2e8f0' }],
    ],
    why: 'Output de tools não validado pode injetar conteúdo malicioso no contexto (prompt injection), causar erros de schema inesperados, ou estourar o context window com dados irrelevantes.',
  },
  {
    title: 'Context overflow sem summarização',
    wrong: [
      [{ text: '// Acumular todo o histórico sem limite', color: RED }],
      [{ text: 'messages.push(...allPreviousMessages)', color: RED }],
      [{ text: '// 50 turnos × 2K tokens = 100K tokens no contexto', color: RED }],
      [{ text: '// Performance degrada, custo explode, pode truncar', color: RED }],
    ],
    right: [
      [{ text: '// Summarizar quando contexto fica grande', color: GRN }],
      [{ text: 'if (countTokens(messages) > CONTEXT_LIMIT * 0.7) {', color: '#e2e8f0' }],
      [{ text: '  const summary = await llm.summarize(messages)', color: C }],
      [{ text: '  messages = [', color: '#e2e8f0' }],
      [{ text: '    systemMsg,          // manter instruções', color: GRN }],
      [{ text: '    summary,            // sumário do histórico', color: GRN }],
      [{ text: '    ...messages.slice(-4) // ultimas mensagens completas', color: GRN }],
      [{ text: '  ]', color: '#e2e8f0' }],
      [{ text: '}', color: '#e2e8f0' }],
    ],
    why: 'Context windows têm limite. Sem gestão, o agente começa a "esquecer" o início da conversa por truncamento, degrada em performance, e o custo por chamada cresce linearmente com o histórico.',
  },
  {
    title: 'Agente sem observabilidade',
    wrong: [
      [{ text: '// Nenhum log, nenhum tracing', color: RED }],
      [{ text: 'const result = await runAgent(task)', color: '#e2e8f0' }],
      [{ text: '// Em produção, se algo der errado:', color: RED }],
      [{ text: '// - Qual tool foi chamada?', color: RED }],
      [{ text: '// - Quantos loops ocorreram?', color: RED }],
      [{ text: '// - Qual foi o custo?', color: RED }],
      [{ text: '// Impossível de diagnosticar.', color: RED }],
    ],
    right: [
      [{ text: '// Instrumentar cada etapa do loop', color: GRN }],
      [{ text: 'const trace = langfuse.trace({ name: "agent-run", userId })', color: C }],
      [{ text: 'for (let i = 0; i < MAX_ITER; i++) {', color: '#e2e8f0' }],
      [{ text: '  const span = trace.span({ name: `iter-${i}` })', color: C }],
      [{ text: '  const res = await llm.complete(messages)', color: '#e2e8f0' }],
      [{ text: '  span.update({ tokens: res.usage, tool: toolCall?.name })', color: C }],
      [{ text: '  if (res.stop_reason === "end_turn") break', color: '#e2e8f0' }],
      [{ text: '}', color: '#e2e8f0' }],
    ],
    why: 'Agentes em produção sem observabilidade são caixas-pretas. Langfuse, Langsmith ou OpenTelemetry permitem rastrear cada loop, custo por iteração, quais tools foram chamadas e onde o agente falhou.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 7 — Frameworks: LangChain vs LangGraph vs CrewAI vs OpenAI Assistants
// ═══════════════════════════════════════════════════════════════════════════════

const FRAMEWORK_OPTIONS: ComparisonOption[] = [
  { id: 'langchain', label: 'LangChain',           sublabel: 'chains + agents',    color: '#1C3C5A' },
  { id: 'langgraph', label: 'LangGraph',            sublabel: 'grafo de estados',   color: C },
  { id: 'crewai',    label: 'CrewAI',               sublabel: 'multi-agent crews',  color: RED },
  { id: 'assistants',label: 'OpenAI Assistants',    sublabel: 'managed threads',    color: GRN },
  { id: 'anthropic', label: 'Anthropic SDK puro',   sublabel: 'tool use direto',    color: PRP },
]

const FRAMEWORK_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'abstraction', label: 'Nível de abstração', category: 'Característica',
    values: {
      langchain:  { rating: 'fair',      note: 'Médio — chains e agents prontos mas verbose' },
      langgraph:  { rating: 'good',      note: 'Baixo-médio — você define nodes e edges explicitamente' },
      crewai:     { rating: 'excellent', note: 'Alto — declarativo: define agentes, tasks e equipe' },
      assistants: { rating: 'excellent', note: 'Máximo — threads, runs e tools gerenciados pela OpenAI' },
      anthropic:  { rating: 'poor',      note: 'Mínimo — você constrói tudo: loop, tools, estado' },
    },
  },
  {
    id: 'control', label: 'Controle do fluxo', category: 'Característica',
    values: {
      langchain:  { rating: 'fair',      note: 'Médio — customizável mas abstrações podem atrapalhar' },
      langgraph:  { rating: 'excellent', note: 'Total — grafo explícito, conditional edges, estado tipado' },
      crewai:     { rating: 'fair',      note: 'Limitado pela abstração de Crew/Agent/Task' },
      assistants: { rating: 'poor',      note: 'Mínimo — OpenAI controla o loop internamente' },
      anthropic:  { rating: 'excellent', note: 'Total — você escreve o loop, sem magic' },
    },
  },
  {
    id: 'multiagent', label: 'Multi-agente nativo', category: 'Característica',
    values: {
      langchain:  { rating: 'fair',      note: 'Possível mas requer plumbing manual' },
      langgraph:  { rating: 'excellent', note: 'Projetado para isso — subgraphs, handoffs, supervisors' },
      crewai:     { rating: 'excellent', note: 'Core feature — Crew = time de agentes colaborando' },
      assistants: { rating: 'poor',      note: 'Um assistente por vez — sem coordenação nativa' },
      anthropic:  { rating: 'fair',      note: 'Construir manualmente com tool calling entre agentes' },
    },
  },
  {
    id: 'observability', label: 'Observabilidade', category: 'Operacional',
    values: {
      langchain:  { rating: 'good',      note: 'Callbacks + LangSmith nativo' },
      langgraph:  { rating: 'good',      note: 'LangSmith + structured state fácil de inspecionar' },
      crewai:     { rating: 'fair',      note: 'Logs internos, integração com Langfuse via callbacks' },
      assistants: { rating: 'fair',      note: 'OpenAI platform dashboard mas acesso limitado' },
      anthropic:  { rating: 'excellent', note: 'Instrumentar manualmente com Langfuse ou OTel — total controle' },
    },
  },
  {
    id: 'vendor', label: 'Portabilidade (vendor lock)', category: 'Operacional',
    values: {
      langchain:  { rating: 'excellent', note: 'Agnóstico de provider — suporta 50+ LLMs' },
      langgraph:  { rating: 'good',      note: 'Agnóstico, mas ecossistema LangChain é acoplado' },
      crewai:     { rating: 'good',      note: 'Suporta múltiplos providers via LiteLLM' },
      assistants: { rating: 'poor',      note: 'Lock-in total com OpenAI — impossível migrar' },
      anthropic:  { rating: 'poor',      note: 'Lock-in com Anthropic mas SDK é bem documentado' },
    },
  },
  {
    id: 'prod', label: 'Pronto para produção', category: 'Operacional',
    values: {
      langchain:  { rating: 'good',   note: 'Maduro, comunidade grande, mas muda API com frequência' },
      langgraph:  { rating: 'good',   note: 'Crescendo rápido, opção preferida para complexo' },
      crewai:     { rating: 'fair',   note: 'Útil para prototipagem, ainda amadurecendo' },
      assistants: { rating: 'good',   note: 'SLA da OpenAI mas black box e custo imprevisível' },
      anthropic:  { rating: 'excellent', note: 'Máxima estabilidade — você controla tudo' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 8 — Decisão: "Quando usar agente vs pipeline fixo?"
// ═══════════════════════════════════════════════════════════════════════════════

const AGENT_DECISION_ROOT: DTNode = {
  id: 'root',
  question: 'A tarefa exige adaptação ao resultado de passos anteriores?',
  children: [
    { label: 'Sim — depende do resultado', nodeId: 'adaptive', color: C },
    { label: 'Não — fluxo sempre igual', nodeId: 'fixed', color: FGMUTE },
  ],
}

const AGENT_DECISION_NODES: Record<string, DTNode> = {
  adaptive: {
    id: 'adaptive',
    question: 'A tarefa exige acesso a ferramentas externas (APIs, código, buscas)?',
    children: [
      { label: 'Sim — tools externas', nodeId: 'use-agent', color: GRN },
      { label: 'Não — só raciocínio', nodeId: 'cot-only', color: C },
    ],
  },
  fixed: {
    id: 'fixed',
    question: 'O fluxo tem mais de 3 etapas com transformações de dados?',
    children: [
      { label: 'Sim', nodeId: 'pipeline', color: SKY },
      { label: 'Não — simples', nodeId: 'direct', color: FGMUTE },
    ],
  },
  'use-agent': {
    id: 'use-agent',
    question: 'A tarefa é longa e envolve múltiplos domínios especializados?',
    children: [
      { label: 'Sim — especialistas distintos', nodeId: 'multi-agent', color: PRP },
      { label: 'Não — um LLM resolve', nodeId: 'single-agent', color: GRN },
    ],
  },
  'cot-only': {
    id: 'cot-only',
    recommendation: 'CoT / Prompt Engineering',
    detail: 'Chain-of-Thought em um único prompt. Sem loop, sem tools. Mais simples, barato e confiável. Ex: classificação, sumarização, Q&A sobre contexto fornecido.',
    color: C,
    icon: '🧠',
  },
  pipeline: {
    id: 'pipeline',
    recommendation: 'Pipeline fixo (LangChain Chains / DAG)',
    detail: 'Sequência determinística de passos sem decisão dinâmica. Use quando o fluxo é sempre o mesmo: ex: extract → transform → summarize. Mais rápido, mais barato e mais fácil de testar.',
    color: SKY,
    icon: '⚙️',
  },
  direct: {
    id: 'direct',
    recommendation: 'Chamada direta de LLM',
    detail: 'Uma única chamada com bom prompt. Não precisa de framework. Use para tasks simples e pontuais. Custo mínimo, latência mínima.',
    color: FGMUTE,
    icon: '⚡',
  },
  'multi-agent': {
    id: 'multi-agent',
    recommendation: 'Arquitetura multi-agente (Supervisor ou Swarm)',
    detail: 'Orquestrador coordena subagentes especializados. Use LangGraph ou Anthropic SDK puro. Custo 2-5× maior — justifique com complexidade real. Ex: assistente de pesquisa que coordena buscador, analista e redator.',
    color: PRP,
    icon: '🤝',
  },
  'single-agent': {
    id: 'single-agent',
    recommendation: 'Single Agent com tools',
    detail: 'Um LLM + lista de tools + loop ReAct. A escolha certa para 90% dos casos de agente. Simples, controlável, barato. Use Anthropic SDK puro ou LangGraph simples.',
    color: GRN,
    icon: '🤖',
  },
}

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 9 — Progressão: do iniciante ao especialista em agentes
// ═══════════════════════════════════════════════════════════════════════════════

const AGENT_LEVELS: ProgressionLevel[] = [
  {
    id: 'junior',
    name: 'Iniciante',
    label: 'Iniciante',
    emoji: '🌱',
    concepts: [
      { name: 'O que é um LLM', tip: 'Modelo que prediz o próximo token — não "sabe" de nada, mas generaliza muito bem' },
      { name: 'Prompt engineering básico', tip: 'Role, contexto, instrução, output format — os 4 elementos de um bom prompt' },
      { name: 'Function calling / tool use', tip: 'O LLM não executa a tool — ele emite um JSON que você executa' },
      { name: 'Loop ReAct manual', tip: 'while stop_reason !== "end_turn": chama LLM, executa tool, adiciona resultado' },
    ],
  },
  {
    id: 'pleno',
    name: 'Pleno',
    label: 'Pleno',
    emoji: '⚙️',
    concepts: [
      { name: 'Padrões: CoT, ToT, Reflexion', tip: 'CoT = raciocínio linear; ToT = exploração de alternativas; Reflexion = autocrítica' },
      { name: 'Gestão de contexto', tip: 'Summarização quando contexto enche, chunking inteligente de documentos' },
      { name: 'RAG em agentes', tip: 'Tool de busca vetorial que injeta chunks relevantes antes do raciocínio' },
      { name: 'Human-in-the-loop', tip: 'Interceptar ações irreversíveis antes de executar — obrigatório em produção' },
      { name: 'Idempotência em tools', tip: 'Tools chamadas N vezes com mesmo input devem ter mesmo resultado' },
    ],
  },
  {
    id: 'senior',
    name: 'Sênior',
    label: 'Sênior',
    emoji: '🚀',
    concepts: [
      { name: 'Topologias multi-agente', tip: 'Single, supervisor, hierárquico, swarm — cada um com tradeoffs reais' },
      { name: 'Observabilidade: Langfuse / OTel', tip: 'Trace de cada iteração, custo por run, latência por tool — imprescindível em prod' },
      { name: 'Plan-and-Execute', tip: 'Modelo forte planeja; modelos baratos executam cada passo — economiza custo' },
      { name: 'Prompt injection defense', tip: 'Validar output de tools antes de injetar no contexto — não confiar no input externo' },
      { name: 'LangGraph: nodes, edges, state', tip: 'Grafo de estados tipado — melhor para fluxos complexos e bifurcados' },
    ],
  },
  {
    id: 'especialista',
    name: 'Especialista',
    label: 'Especialista',
    emoji: '🎯',
    concepts: [
      { name: 'Avaliação de agentes (RAGAS, Evals)', tip: 'Medir faithfulness, relevância, precisão de tool calls automaticamente' },
      { name: 'Controle de custo: token budgeting', tip: 'usage_metadata por iteração, alertas de cost, degradação graciosa quando excede' },
      { name: 'Security: tool sandboxing', tip: 'Executar code_execution em sandbox isolado — sem acesso ao filesystem real' },
      { name: 'Streaming de resposta parcial', tip: 'stream=True + handle tool_use em stream para UX responsivo' },
      { name: 'Chaos engineering para agentes', tip: 'Injetar falhas de tool, latência, e outputs corrompidos para testar robustez' },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// Componente principal
// ═══════════════════════════════════════════════════════════════════════════════

export default function AgenticWorkflowsVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'react-loop',
      title: 'Loop ReAct',
      subtitle: 'Máquina de estados: Observa → Raciocina → Age → Observa → repete',
      accent: C,
      component: (
        <StateMachineExplorer
          states={REACT_STATES}
          transitions={REACT_TRANSITIONS}
          initialState="IDLE"
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'reasoning-patterns',
      title: 'Padrões de Raciocínio',
      subtitle: 'CoT vs Tree of Thought vs ReAct vs Reflexion — quando usar cada um',
      accent: C,
      component: (
        <ComparisonTable
          options={REASONING_OPTIONS}
          criteria={REASONING_CRITERIA}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'tool-use-sequence',
      title: 'Tool Use: Fluxo Completo',
      subtitle: 'Do request ao resultado final — quem faz o quê em cada etapa',
      accent: C,
      component: (
        <SequenceDiagram
          actors={TOOL_ACTORS}
          messages={TOOL_MESSAGES}
          groups={TOOL_GROUPS}
          accentColor={C}
          bgColor={BG}
          title="Tool Use Flow — Anthropic SDK"
          description="Sequência completa de uma chamada de agente com tool use. O LLM emite tool_call; sua aplicação executa a tool; o resultado volta ao contexto."
        />
      ),
    },
    {
      id: 'topologies',
      title: 'Topologias Multi-Agente',
      subtitle: 'Single Agent vs Supervisor vs Hierárquico vs Swarm — tradeoffs reais',
      accent: C,
      component: (
        <ComparisonTable
          options={TOPOLOGY_OPTIONS}
          criteria={TOPOLOGY_CRITERIA}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'memory-types',
      title: 'Tipos de Memória',
      subtitle: 'In-context, Vector DB, Episódica, Procedural — o que armazenar onde',
      accent: C,
      component: (
        <LayerStack
          layers={MEMORY_LAYERS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'antipatterns',
      title: 'Anti-patterns',
      subtitle: 'Os 5 erros que destroem agentes em produção — com correção',
      accent: C,
      component: (
        <AntiPatternsGallery
          patterns={AGENT_ANTIPATTERNS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'frameworks',
      title: 'Frameworks Comparados',
      subtitle: 'LangChain vs LangGraph vs CrewAI vs OpenAI Assistants vs SDK puro',
      accent: C,
      component: (
        <ComparisonTable
          options={FRAMEWORK_OPTIONS}
          criteria={FRAMEWORK_CRITERIA}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'decision-tree',
      title: 'Quando Usar Agente?',
      subtitle: 'Árvore de decisão: agente vs pipeline fixo vs CoT vs chamada direta',
      accent: C,
      component: (
        <DecisionTree
          root={AGENT_DECISION_ROOT}
          nodes={AGENT_DECISION_NODES}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'progression',
      title: 'Progressão: Iniciante → Especialista',
      subtitle: 'Roadmap de conceitos em ordem de aprendizado',
      accent: C,
      component: (
        <ProgressionMap
          levels={AGENT_LEVELS}
          accentColor={C}
          bgColor={BG}
          cardColor={CARD}
        />
      ),
    },
  ]

  // Supress unused variable warnings for palette colors defined for reference
  void C2; void LINE; void FG; void FGMUTE

  return (
    <VisuaisShell
      visuals={visuals}
      active={active}
      onChange={setActive}
    />
  )
}

'use client'
import { useState } from 'react'
import { VisuaisShell } from '@/components/visuals/VisuaisShell'
import type { VisualDef } from '@/components/visuals/VisuaisNav'
import { CodeStepper } from '@/components/visuals/CodeStepper'
import type { CodeStepperScenario } from '@/components/visuals/CodeStepper'
import { SequenceDiagram } from '@/components/visuals/SequenceDiagram'
import type { SeqActor, SeqMessage, SeqGroup } from '@/components/visuals/SequenceDiagram'
import { StateMachineExplorer } from '@/components/visuals/StateMachineExplorer'
import type { SMState, SMTransition } from '@/components/visuals/StateMachineExplorer'
import { ComparisonTable } from '@/components/visuals/ComparisonTable'
import type { ComparisonOption, ComparisonCriterion } from '@/components/visuals/ComparisonTable'
import { LayerStack } from '@/components/visuals/LayerStack'
import type { Layer } from '@/components/visuals/LayerStack'
import { CardCarousel } from '@/components/visuals/CardCarousel'
import type { CarouselCard } from '@/components/visuals/CardCarousel'
import { AntiPatternsGallery } from '@/components/visuals/AntiPatternsGallery'
import type { AntiPattern } from '@/components/visuals/AntiPatternsGallery'

// ── Paleta LangGraph (verde grafo) ────────────────────────────────────────────
const C      = '#4ade80'  // verde brilhante — identidade visual oficial do LangGraph
const C2     = '#22c55e'
const BG     = '#0f172a'
const CARD   = '#1e293b'
const FG     = '#e2e8f0'
const FGMUTE = '#94a3b8'
const AMB    = '#f59e0b'
const RED    = '#ef4444'
const BLU    = '#60a5fa'
const PUR    = '#a78bfa'
const GRN    = C   // alias para coerência

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 1 — Reducers em ação (CodeStepper)
// Mostra como replace e add_messages mutam o estado a cada node — replay visual
// que texto e diagrama estático não capturam
// ═══════════════════════════════════════════════════════════════════════════════

const REDUCER_SCENARIOS: CodeStepperScenario[] = [
  {
    id: 'replace',
    label: 'Reducer replace (default)',
    language: 'python',
    code: `class State(TypedDict):
    step_count: int          # sem Annotated → reducer = REPLACE
    final_answer: str        # mesmo padrão

def node_a(state: State) -> dict:
    return {"step_count": state["step_count"] + 1}

def node_b(state: State) -> dict:
    return {"step_count": state["step_count"] + 1,
            "final_answer": "pronto"}

# Invoke com state inicial:
graph.invoke({"step_count": 0, "final_answer": ""})`,
    steps: [
      {
        lineStart: 1,
        lineEnd: 3,
        title: 'Estado inicial — campos sem Annotated',
        explanation: 'TypedDict com campos escalares. Sem Annotated → o reducer default é REPLACE: o valor retornado pelo node sobrescreve o valor anterior. Use REPLACE para contadores, status, resposta final — qualquer campo que represente o estado ATUAL.',
        memory: {
          'state.step_count': '0',
          'state.final_answer': '""',
        },
      },
      {
        lineStart: 5,
        lineEnd: 6,
        title: 'node_a executa — retorna patch parcial',
        explanation: 'O node não muta o state diretamente. Retorna um dict { "step_count": 1 } — só o campo que mudou. O LangGraph aplica o reducer REPLACE: state["step_count"] = 1.',
        output: 'node_a returned: { "step_count": 1 }',
        memory: {
          'state.step_count': '1',
          'state.final_answer': '""',
        },
      },
      {
        lineStart: 8,
        lineEnd: 10,
        title: 'node_b executa — patch com dois campos',
        explanation: 'Retorna { "step_count": 2, "final_answer": "pronto" }. Ambos os campos têm reducer REPLACE: cada um sobrescreve o valor anterior. step_count vai de 1 → 2, final_answer de "" → "pronto".',
        output: 'node_b returned: { "step_count": 2, "final_answer": "pronto" }',
        memory: {
          'state.step_count': '2',
          'state.final_answer': '"pronto"',
        },
      },
      {
        lineStart: 13,
        lineEnd: 13,
        title: 'Estado final — soma simples não acumula histórico',
        explanation: 'O state final é o último valor escrito por cada node. Note que NÃO temos histórico de step_count (só o atual). Se você precisava ver "1 → 2 → 3", deveria ter usado reducer APPEND.',
        memory: {
          'state.step_count': '2',
          'state.final_answer': '"pronto"',
        },
      },
    ],
  },
  {
    id: 'append',
    label: 'Reducer append (add_messages)',
    language: 'python',
    code: `class State(TypedDict):
    messages: Annotated[list, add_messages]  # reducer = APPEND
    # cada node retorna lista — add_messages CONCATENA

def node_a(state: State) -> dict:
    return {"messages": [HumanMessage("Olá")]}

def node_b(state: State) -> dict:
    return {"messages": [AIMessage("Oi! Como ajudo?")]}

# Invoke com state inicial vazio:
graph.invoke({"messages": []})`,
    steps: [
      {
        lineStart: 1,
        lineEnd: 3,
        title: 'Estado inicial — Annotated com add_messages',
        explanation: 'Annotated[list, add_messages] indica que o reducer é APPEND: o valor retornado é CONCATENADO ao valor anterior, não substitui. Use APPEND para histórico de mensagens, lista de resultados acumulados, qualquer campo que represente um STREAM cronológico.',
        memory: {
          'state.messages': '[]  # vazio',
        },
      },
      {
        lineStart: 5,
        lineEnd: 6,
        title: 'node_a — retorna lista com 1 mensagem',
        explanation: 'O node retorna { "messages": [HumanMessage("Olá")] }. O reducer APPEND faz state["messages"] = [] + [HumanMessage("Olá")] = [HumanMessage("Olá")]. Note que mesmo retornando lista, o efeito é concatenação.',
        output: 'add_messages: [] + [HumanMessage("Olá")] → [HumanMessage("Olá")]',
        memory: {
          'state.messages': '[HumanMessage("Olá")]',
        },
      },
      {
        lineStart: 8,
        lineEnd: 9,
        title: 'node_b — concatena, NÃO substitui',
        explanation: 'Retorna { "messages": [AIMessage("Oi!...")] }. Reducer APPEND: state["messages"] cresce para [HumanMessage, AIMessage]. Em REPLACE seria perdido — em APPEND, o histórico se preserva.',
        output: 'add_messages: [HumanMessage] + [AIMessage] → [HumanMessage, AIMessage]',
        memory: {
          'state.messages': '[HumanMessage("Olá"), AIMessage("Oi! Como ajudo?")]',
        },
      },
      {
        lineStart: 12,
        lineEnd: 12,
        title: 'Estado final — histórico completo preservado',
        explanation: 'O array messages tem TODO o histórico em ordem cronológica. add_messages é especial — também faz dedup por message ID e suporta updates parciais. Para listas simples, use Annotated[list, operator.add] para concatenação básica.',
        memory: {
          'state.messages.length': '2',
          'state.messages': '[HumanMessage, AIMessage]',
        },
      },
    ],
  },
  {
    id: 'wrong-reducer',
    label: 'Bug clássico: reducer errado',
    language: 'python',
    code: `class State(TypedDict):
    # ERRADO: status acumula histórico de valores
    status: Annotated[list, add_messages]

def set_running(s): return {"status": "running"}
def set_done(s):    return {"status": "done"}

# Sequência de execução:
graph.invoke({"status": []})
# Após node 1: status = ["running"]
# Após node 2: status = ["running", "done"]
# Você queria status = "done"`,
    steps: [
      {
        lineStart: 1,
        lineEnd: 3,
        title: 'Bug — APPEND em campo de status',
        explanation: 'O programador queria que status guardasse o valor ATUAL (running/done/error). Mas usou Annotated[list, add_messages] copiando do exemplo de mensagens. Resultado: status acumula como histórico em vez de substituir.',
        memory: {
          'state.status': '[]',
        },
      },
      {
        lineStart: 5,
        lineEnd: 5,
        title: 'set_running — primeiro problema invisível',
        explanation: 'O node retorna "running" (string), mas add_messages espera lista. Na prática, LangGraph faz coerção e adiciona como item: state["status"] = ["running"]. Você não vê erro — só o tipo errado.',
        memory: {
          'state.status': '["running"]',
        },
      },
      {
        lineStart: 6,
        lineEnd: 6,
        title: 'set_done — o bug aparece',
        explanation: 'Em vez de status virar "done", vira ["running", "done"]. Toda a lógica downstream que checava if state["status"] == "done" agora falha — a comparação é com string, e o valor é lista. Bugs sutis como esse só aparecem em teste de integração.',
        memory: {
          'state.status': '["running", "done"]',
        },
      },
      {
        lineStart: 9,
        lineEnd: 12,
        title: 'Diagnóstico — pergunta certa',
        explanation: 'Pergunte "esse campo é histórico ou estado atual?". Histórico (mensagens, eventos, logs) → APPEND. Estado atual (status, contador, resposta final, flag) → REPLACE (sem Annotated). Esse é o erro mais comum em LangGraph e o mais fácil de evitar com a pergunta certa.',
        memory: {
          'corrigido: status: str': '"done"  ← REPLACE faz substituição',
        },
      },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 2 — ReAct Loop (SequenceDiagram)
// Mostra a troca temporal LLM ↔ Tool ↔ State no padrão ReAct
// ═══════════════════════════════════════════════════════════════════════════════

const REACT_ACTORS: SeqActor[] = [
  { id: 'user',  label: 'User',         color: BLU,  icon: '👤' },
  { id: 'graph', label: 'Graph runtime', color: C,   icon: '⚙' },
  { id: 'reason', label: 'reason node',  color: PUR,  icon: '🧠' },
  { id: 'llm',   label: 'LLM',          color: '#fb923c', icon: '🤖' },
  { id: 'tools', label: 'tool node',    color: AMB,  icon: '🔧' },
  { id: 'cp',    label: 'Checkpointer',  color: '#a855f7', icon: '💾' },
]

const REACT_MESSAGES: SeqMessage[] = [
  { from: 'user',   to: 'graph',  label: 'invoke({messages: [...]})',           type: 'sync' },
  { from: 'graph',  to: 'cp',     label: 'load(thread_id)',                     note: 'carrega estado anterior se existir', type: 'sync' },
  { from: 'cp',     to: 'graph',  label: 'state restored',                      type: 'return' },
  { from: 'graph',  to: 'reason', label: 'execute(state)',                      type: 'sync' },
  { from: 'reason', to: 'llm',    label: 'invoke(messages, tools=[...])',       type: 'sync' },
  { from: 'llm',    to: 'reason', label: 'AIMessage com tool_calls',            note: 'modelo decidiu usar tool', type: 'return' },
  { from: 'reason', to: 'graph',  label: 'patch: {messages: [AIMessage]}',      type: 'return' },
  { from: 'graph',  to: 'cp',     label: 'save(state)',                         note: 'persiste após cada node', type: 'sync' },
  { from: 'graph',  to: 'graph',  label: 'should_act(state) → "act"',           note: 'conditional edge avalia' },
  { from: 'graph',  to: 'tools',  label: 'execute(state)',                      type: 'sync' },
  { from: 'tools',  to: 'tools',  label: 'roda tool_calls em paralelo',         note: 'search_web, calculate, ...' },
  { from: 'tools',  to: 'graph',  label: 'patch: {messages: [ToolMessage]}',    type: 'return' },
  { from: 'graph',  to: 'cp',     label: 'save(state)',                         type: 'sync' },
  { from: 'graph',  to: 'reason', label: 'execute(state) — loop',               note: 'edge: tools → reason', type: 'sync' },
  { from: 'reason', to: 'llm',    label: 'invoke(messages atualizadas)',        type: 'sync' },
  { from: 'llm',    to: 'reason', label: 'AIMessage SEM tool_calls',            note: 'modelo tem resposta final', type: 'return' },
  { from: 'reason', to: 'graph',  label: 'patch final',                         type: 'return' },
  { from: 'graph',  to: 'graph',  label: 'should_act → "end"',                  note: 'sem tool_calls → END' },
  { from: 'graph',  to: 'user',   label: 'state final com resposta',            type: 'return' },
]

const REACT_GROUPS: SeqGroup[] = [
  { label: 'Iteração 1 — reason decide usar tool', kind: 'opt', fromMsg: 3, toMsg: 7, color: PUR },
  { label: 'Execução paralela de tools', kind: 'par', fromMsg: 9, toMsg: 12, color: AMB },
  { label: 'Iteração 2 — reason tem resposta final', kind: 'opt', fromMsg: 13, toMsg: 17, color: PUR },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 3 — Human-in-the-Loop StateMachine
// Estados de uma sessão com interrupt_before — pause, inspect, edit, resume
// ═══════════════════════════════════════════════════════════════════════════════

const HITL_STATES: SMState[] = [
  { id: 'idle',       label: 'Idle',                description: 'Nenhuma sessão ativa. thread_id ainda não usado ou já finalizado.', color: FGMUTE, isInitial: true },
  { id: 'running',    label: 'Running',             description: 'graph.invoke() em execução. Nodes rodam um após o outro, checkpoint salva após cada um.', color: C },
  { id: 'paused',     label: 'Paused (interrupt)',  description: 'Chegou em node listado em interrupt_before. State persistido, controle volta ao chamador. Aguarda intervenção humana.', color: AMB },
  { id: 'inspecting', label: 'Inspecting',          description: 'Aplicação chamou get_state(config) para mostrar dados ao humano. State não muda — apenas leitura.', color: BLU },
  { id: 'editing',    label: 'Editing state',       description: 'Aplicação chamou update_state(config, patch) para corrigir antes de retomar. Nenhum node executa — apenas o state é mutado.', color: PUR },
  { id: 'resuming',   label: 'Resuming',            description: 'invoke(None, config) retomou do checkpoint. Roda o node que estava em interrupt_before, depois continua o grafo normalmente.', color: C2 },
  { id: 'done',       label: 'Done',                description: 'Grafo chegou em END. Estado final disponível. Próximo invoke com mesmo thread_id começa nova "rodada" mantendo histórico (se reducer for APPEND).', color: '#22c55e', isFinal: true },
  { id: 'error',      label: 'Error',               description: 'Node levantou exceção. State NÃO foi atualizado para esse node. Retomada possível com retry ou correção via update_state.', color: RED },
]

const HITL_TRANSITIONS: SMTransition[] = [
  { from: 'idle',       to: 'running',    event: 'graph.invoke(input, config)',      code: 'config = {configurable: {thread_id: "abc"}}' },
  { from: 'running',    to: 'paused',     event: 'chegou em interrupt_before node',  code: 'compile(interrupt_before=["send_email"])' },
  { from: 'paused',     to: 'inspecting', event: 'get_state(config)',                code: 'snapshot.values["draft_action"]' },
  { from: 'inspecting', to: 'paused',     event: 'fim da inspeção',                  guard: 'humano apenas leu' },
  { from: 'paused',     to: 'editing',    event: 'update_state(config, patch)',      code: 'patch = {"draft_action": {...corrigido}}' },
  { from: 'editing',    to: 'paused',     event: 'patch aplicado',                   guard: 'state mutado, nenhum node rodou' },
  { from: 'paused',     to: 'resuming',   event: 'invoke(None, config)',             code: 'None = não passa input novo, usa state atual' },
  { from: 'resuming',   to: 'running',    event: 'node executou e continua',         guard: 'sem nova interrupção' },
  { from: 'resuming',   to: 'paused',     event: 'novo interrupt_before',            guard: 'múltiplas pausas no mesmo grafo' },
  { from: 'running',    to: 'done',       event: 'chegou em END',                    code: 'graph.add_edge("last_node", END)' },
  { from: 'running',    to: 'error',      event: 'exceção em node',                  guard: 'sem retry policy' },
  { from: 'error',      to: 'editing',    event: 'update_state para corrigir',       guard: 'humano injeta valor seguro' },
  { from: 'error',      to: 'resuming',   event: 'invoke(None, config) com retry',   guard: 'tenta o node novamente' },
  { from: 'done',       to: 'idle',       event: 'sessão finalizada',                guard: 'thread_id pode ser reutilizado' },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 4 — Multi-agent patterns: Supervisor vs Swarm vs LCEL chains
// ComparisonTable com critérios objetivos para escolher cada padrão
// ═══════════════════════════════════════════════════════════════════════════════

const PATTERN_OPTIONS: ComparisonOption[] = [
  { id: 'sup',   label: 'Supervisor',     sublabel: 'LLM central decide',           color: C },
  { id: 'swm',   label: 'Swarm',          sublabel: 'handoff peer-to-peer',         color: BLU },
  { id: 'sub',   label: 'Subgraphs',      sublabel: 'modularidade hierárquica',     color: PUR },
  { id: 'lcel',  label: 'LCEL chains',    sublabel: 'pipeline declarativo',         color: AMB },
]

const PATTERN_CRITERIA: ComparisonCriterion[] = [
  {
    id: 'predict',
    label: 'Previsibilidade do fluxo',
    category: 'Comportamento',
    description: 'Quão fácil prever qual será o próximo passo executado',
    values: {
      sup:  { rating: 'good',      note: 'Supervisor sempre decide — auditável' },
      swm:  { rating: 'fair',      note: 'Cada agente faz handoff arbitrário — emergente' },
      sub:  { rating: 'excellent', note: 'Hierarquia explícita — pais conhecem filhos' },
      lcel: { rating: 'excellent', note: 'Pipeline determinístico A → B → C' },
    },
  },
  {
    id: 'debug',
    label: 'Facilidade de debug',
    category: 'Operações',
    description: 'Identificar onde algo deu errado quando o agente falha',
    values: {
      sup:  { rating: 'good',      note: 'LangSmith trace mostra cada decisão do supervisor' },
      swm:  { rating: 'poor',      note: 'Loops emergentes, diagnóstico difícil sem trace agressivo' },
      sub:  { rating: 'good',      note: 'Trace por subgraph — escopo bem delimitado' },
      lcel: { rating: 'excellent', note: 'Stack linear — pdb funciona' },
    },
  },
  {
    id: 'flex',
    label: 'Flexibilidade — adicionar novo agente',
    category: 'Evolução',
    description: 'Custo de adicionar uma nova capacidade ao sistema',
    values: {
      sup:  { rating: 'fair',      note: 'Mudar prompt do supervisor + adicionar node' },
      swm:  { rating: 'excellent', note: 'Novo agente declara handoffs — auto-roteia' },
      sub:  { rating: 'good',      note: 'Adicionar subgraph e edge no pai' },
      lcel: { rating: 'fair',      note: 'Reescrever a chain — pode quebrar tipos' },
    },
  },
  {
    id: 'state',
    label: 'Compartilhamento de state',
    category: 'Arquitetura',
    description: 'Como o estado flui entre os agentes/etapas',
    values: {
      sup:  { rating: 'excellent', note: 'State único compartilhado — supervisor vê tudo' },
      swm:  { rating: 'good',      note: 'State compartilhado, cada agente lê os campos que precisa' },
      sub:  { rating: 'good',      note: 'Subgraph pode ter state próprio + projeção' },
      lcel: { rating: 'fair',      note: 'Cada step recebe output do anterior — sem state global' },
    },
  },
  {
    id: 'loops',
    label: 'Suporta loops e retry',
    category: 'Comportamento',
    description: 'Capacidade de iterar até condição de saída',
    values: {
      sup:  { rating: 'excellent', note: 'Supervisor pode chamar agente N vezes' },
      swm:  { rating: 'excellent', note: 'Handoff cria loops naturais (cuidado com infinitos)' },
      sub:  { rating: 'good',      note: 'Subgraph pode ter loop interno' },
      lcel: { rating: 'poor',      note: 'Pipeline linear — loops exigem hack' },
    },
  },
  {
    id: 'usecase',
    label: 'Caso de uso ideal',
    category: 'Quando usar',
    description: 'Cenário onde esse padrão brilha',
    values: {
      sup:  { rating: 'excellent', note: 'Workflows estruturados: "search → analyze → write"' },
      swm:  { rating: 'good',      note: 'Colaboração aberta entre especialistas autônomos' },
      sub:  { rating: 'excellent', note: 'Encapsular lógica complexa: "research" como caixa-preta' },
      lcel: { rating: 'excellent', note: 'RAG simples, summarization, classificação — sem state' },
    },
  },
  {
    id: 'overhead',
    label: 'Overhead de configuração',
    category: 'Operações',
    description: 'Esforço para colocar a primeira versão funcionando',
    values: {
      sup:  { rating: 'good',      note: 'create_supervisor() pronto no langgraph-supervisor' },
      swm:  { rating: 'fair',      note: 'Definir handoffs em cada agente — mais setup' },
      sub:  { rating: 'good',      note: 'Cada subgraph é um StateGraph compilado' },
      lcel: { rating: 'excellent', note: 'prompt | model | parser — uma linha' },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 5 — Camadas de Memória (LayerStack)
// Thread state (curto) → BaseStore (longo) → Vector DB (semântica) → Trace
// ═══════════════════════════════════════════════════════════════════════════════

const MEMORY_LAYERS: Layer[] = [
  {
    id: 'trace',
    label: 'Camada 4 — Trace de execução',
    sublabel: 'LangSmith — observabilidade post-mortem',
    description: 'Acima do estado da aplicação, LangSmith registra cada invoke como um trace: quais nodes rodaram, latência, tokens consumidos, input/output de cada chamada de LLM. Não é "memória" do agente — é memória DE COMO o agente operou. Crítico para debug em produção e otimização de prompts.',
    code: 'os.environ["LANGCHAIN_TRACING_V2"] = "true"\nos.environ["LANGCHAIN_API_KEY"] = "..."\n# todo invoke é automaticamente traceado',
    color: '#a855f7',
    examples: ['LangSmith UI', 'Trace replay', 'Eval datasets'],
  },
  {
    id: 'vector',
    label: 'Camada 3 — Memória semântica',
    sublabel: 'Vector DB (Pinecone, pgvector, Chroma) + RAG',
    description: 'Para conhecimento factual ou conversas históricas, armazene em vector DB indexado por embeddings. Node de retrieval busca por similaridade no início do grafo e injeta no contexto. Diferente do BaseStore (KV exato), aqui você consulta por significado — perfeito para "lembrar" tudo que o usuário falou nos últimos 6 meses.',
    code: 'docs = vectorstore.similarity_search(query, k=5)\nstate["context"] = format_docs(docs)',
    color: BLU,
    examples: ['Pinecone', 'pgvector', 'Chroma', 'Weaviate'],
  },
  {
    id: 'store',
    label: 'Camada 2 — Memória de longo prazo',
    sublabel: 'BaseStore — KV persistente entre threads',
    description: 'BaseStore é um KV store compartilhado entre todas as threads. Você salva fatos importantes (nome, preferências, contexto de projeto) com namespace ("memories", user_id) e key. Outras sessões do mesmo usuário leem os mesmos fatos. Em produção: PostgresStore, RedisStore. Em dev: InMemoryStore.',
    code: 'store.put(("user_memories", user_id), "name", {"value": "Ana"})\nfacts = store.search(("user_memories", user_id))',
    color: AMB,
    examples: ['PostgresStore', 'RedisStore', 'InMemoryStore'],
  },
  {
    id: 'thread',
    label: 'Camada 1 — Memória de curto prazo',
    sublabel: 'Checkpointer — state por thread_id',
    description: 'Cada execução tem um thread_id. O checkpointer salva o state completo após cada node. Próximo invoke com mesmo thread_id carrega de onde parou. Apaga ou retém por thread — sessões diferentes não compartilham. É a memória que viabiliza human-in-the-loop e replay.',
    code: 'graph = builder.compile(checkpointer=PostgresSaver(...))\nconfig = {"configurable": {"thread_id": "user-session-abc"}}',
    color: C,
    examples: ['MemorySaver (dev)', 'SqliteSaver (small prod)', 'PostgresSaver (prod)'],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 6 — Streaming modes (CardCarousel)
// Updates vs Messages vs Values vs Custom — cada modo serve UX diferente
// ═══════════════════════════════════════════════════════════════════════════════

const STREAM_CARDS: CarouselCard[] = [
  {
    name: 'updates',
    signature: 'graph.stream(input, stream_mode="updates")',
    emoji: '📦',
    color: C,
    use: [
      'Mostrar progresso por etapa: "Pesquisando...", "Analisando..."',
      'Cada chunk = patch de UM node que terminou',
      'UX de "tarefa em andamento" — barra de progresso por node',
      'Padrão para agentes onde cada node demora segundos',
    ],
    dontUse: 'Quando o usuário quer ver TEXTO sendo gerado em tempo real (token a token). Para isso, use stream_mode="messages".',
    difficulty: 1,
  },
  {
    name: 'messages',
    signature: 'graph.stream(input, stream_mode="messages")',
    emoji: '🌊',
    color: BLU,
    use: [
      'Streaming de tokens de LLM em tempo real (estilo ChatGPT)',
      'Cada chunk = AIMessageChunk com .content parcial',
      'Reduz percepção de latência drasticamente',
      'Combine com SSE no FastAPI para frontend reativo',
    ],
    dontUse: 'Quando o LLM está dentro de um node usado em batch (sem display). O streaming tem overhead — só vale se você renderiza para o usuário.',
    difficulty: 2,
  },
  {
    name: 'values',
    signature: 'graph.stream(input, stream_mode="values")',
    emoji: '📸',
    color: AMB,
    use: [
      'Cada chunk = state COMPLETO após cada node',
      'Útil para frontend que renderiza o state atual a cada update',
      'Snapshots completos — sem precisar mergear patches',
      'Bom para debugging: ver state evoluir',
    ],
    dontUse: 'Quando o state é grande (muitos campos, mensagens longas) — cada chunk transmite tudo. Em produção, "updates" é mais eficiente.',
    difficulty: 1,
  },
  {
    name: 'custom (writer)',
    signature: 'graph.stream(input, stream_mode="custom") + writer()',
    emoji: '✍',
    color: PUR,
    use: [
      'Emitir eventos arbitrários do interior dos nodes',
      'Dentro do node: from langgraph.config import get_stream_writer; writer({"progress": 50})',
      'Útil para barra de progresso DENTRO de uma única chamada de LLM longa',
      'Multi-modal: emitir imagens parciais, dados estruturados',
    ],
    dontUse: 'Casos simples onde "updates" ou "messages" já resolvem. Custom adiciona complexidade — só vale para UX avançada.',
    difficulty: 3,
  },
  {
    name: 'multi-mode',
    signature: 'stream_mode=["updates", "messages"]',
    emoji: '🎛',
    color: '#fb923c',
    use: [
      'Combine múltiplos modos numa stream só',
      'Frontend recebe (mode, chunk) — roteia por tipo',
      'Mostre progresso por etapa E tokens em tempo real',
      'Pattern recomendado para apps de produção com UX rica',
    ],
    dontUse: 'Quando o frontend é simples e só precisa de um modo. Adicionar multi-mode aumenta acoplamento entre back e front.',
    difficulty: 2,
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL 7 — Anti-patterns
// ═══════════════════════════════════════════════════════════════════════════════

const LANGGRAPH_ANTIPATTERNS: AntiPattern[] = [
  {
    title: 'Reducer errado: APPEND em campo de status',
    wrong: [
      [{ text: 'class State(TypedDict):', color: FG }],
      [{ text: '    # Status deveria ser "running"|"done", mas...', color: FGMUTE }],
      [{ text: '    status: Annotated[list, add_messages]', color: RED }],
      [{ text: '', color: FG }],
      [{ text: 'def set_done(s): return {"status": "done"}', color: FG }],
      [{ text: '# state["status"] vira ["running", "done", ...]', color: RED }],
      [{ text: '# Código que checa == "done" sempre falha', color: RED }],
    ],
    right: [
      [{ text: 'class State(TypedDict):', color: FG }],
      [{ text: '    # Sem Annotated → reducer REPLACE', color: FGMUTE }],
      [{ text: '    status: str  # "running" | "done" | "error"', color: GRN }],
      [{ text: '    messages: Annotated[list, add_messages]  # APPEND ok', color: GRN }],
      [{ text: '', color: FG }],
      [{ text: '# Pergunta diagnóstica:', color: FGMUTE }],
      [{ text: '# Esse campo é HISTÓRICO ou ESTADO ATUAL?', color: GRN }],
    ],
    why: 'O bug mais comum em LangGraph. add_messages e Annotated[list, operator.add] fazem APPEND — usar isso para status, contadores ou flags acumula valores em vez de substituir. Pergunte sempre: "esse campo é histórico ou estado atual?". Histórico → APPEND. Estado atual → REPLACE (sem Annotated).',
  },
  {
    title: 'Conditional edge sem fallback — KeyError silencioso',
    wrong: [
      [{ text: 'def route(state) -> str:', color: FG }],
      [{ text: '    if state["needs_tool"]: return "tools"', color: FG }],
      [{ text: '    if state["done"]:       return "finish"', color: FG }],
      [{ text: '    # Esqueceu o caso default!', color: RED }],
      [{ text: '', color: FG }],
      [{ text: 'graph.add_conditional_edges("reason", route, {', color: FG }],
      [{ text: '    "tools": "tools_node",', color: FG }],
      [{ text: '    "finish": END,', color: FG }],
      [{ text: '})', color: FG }],
      [{ text: '# Se route retornar None (nenhum if true) → KeyError', color: RED }],
    ],
    right: [
      [{ text: 'def route(state) -> str:', color: FG }],
      [{ text: '    if state["needs_tool"]: return "tools"', color: GRN }],
      [{ text: '    if state["done"]:       return "finish"', color: GRN }],
      [{ text: '    return "finish"  # SEMPRE um fallback explícito', color: GRN }],
      [{ text: '', color: FG }],
      [{ text: '# Ou use Literal para o linter pegar:', color: FGMUTE }],
      [{ text: 'def route(state) -> Literal["tools", "finish"]:', color: GRN }],
      [{ text: '    return "tools" if state["needs_tool"] else "finish"', color: GRN }],
    ],
    why: 'Conditional edges levantam KeyError se a função retornar string fora do dict de mapeamento — e None se nenhum if dispara. Sempre termine com return "finish" ou return END. Use typing.Literal para o type checker pegar o caso esquecido em compile time.',
  },
  {
    title: 'Loop infinito sem condição de saída',
    wrong: [
      [{ text: 'def reason(state):', color: FG }],
      [{ text: '    response = llm.invoke(state["messages"])', color: FG }],
      [{ text: '    return {"messages": [response]}', color: FG }],
      [{ text: '', color: FG }],
      [{ text: 'def should_act(state) -> str:', color: FG }],
      [{ text: '    last = state["messages"][-1]', color: FG }],
      [{ text: '    return "tools" if last.tool_calls else "end"', color: FG }],
      [{ text: '', color: FG }],
      [{ text: '# Nada limita iterações. LLM pode chamar tools', color: RED }],
      [{ text: '# infinitamente — gasta tokens até quebrar', color: RED }],
    ],
    right: [
      [{ text: 'class State(TypedDict):', color: FG }],
      [{ text: '    messages: Annotated[list, add_messages]', color: GRN }],
      [{ text: '    iter_count: int  # contador de saída', color: GRN }],
      [{ text: '', color: FG }],
      [{ text: 'def should_act(state) -> str:', color: FG }],
      [{ text: '    if state["iter_count"] >= 10: return "end"', color: GRN }],
      [{ text: '    last = state["messages"][-1]', color: GRN }],
      [{ text: '    return "tools" if last.tool_calls else "end"', color: GRN }],
      [{ text: '', color: FG }],
      [{ text: '# Fallback: recursion_limit no compile', color: FGMUTE }],
      [{ text: 'graph.compile(checkpointer=cp).with_config(', color: GRN }],
      [{ text: '    {"recursion_limit": 25}', color: GRN }],
      [{ text: ')', color: GRN }],
    ],
    why: 'Agentes ReAct podem entrar em loop quando o LLM "não sabe parar" e fica chamando tools. Use SEMPRE duas defesas: contador de iterações no state (controla a lógica) + recursion_limit no compile (fallback que levanta erro). Sem isso, o agente esgota o token budget e quebra em produção.',
  },
  {
    title: 'Sem checkpointer em produção',
    wrong: [
      [{ text: '# main.py em produção:', color: FGMUTE }],
      [{ text: 'graph = builder.compile()  # SEM checkpointer', color: RED }],
      [{ text: '', color: FG }],
      [{ text: '# Consequências:', color: FGMUTE }],
      [{ text: '# - Processo cai → todas as sessões perdidas', color: RED }],
      [{ text: '# - Sem human-in-the-loop possível', color: RED }],
      [{ text: '# - Sem replay para debug', color: RED }],
      [{ text: '# - Múltiplas réplicas não compartilham state', color: RED }],
    ],
    right: [
      [{ text: 'from langgraph.checkpoint.postgres import PostgresSaver', color: GRN }],
      [{ text: '', color: FG }],
      [{ text: 'with PostgresSaver.from_conn_string(DB_URL) as cp:', color: GRN }],
      [{ text: '    graph = builder.compile(checkpointer=cp)', color: GRN }],
      [{ text: '    # State persistido — múltiplas réplicas OK', color: GRN }],
      [{ text: '    # Cada thread_id retomável após queda', color: GRN }],
      [{ text: '', color: FG }],
      [{ text: '# Setup pré-deploy (cria as tabelas):', color: FGMUTE }],
      [{ text: 'cp.setup()', color: GRN }],
    ],
    why: 'MemorySaver é só para dev — perde tudo se o processo reinicia. Em produção, use PostgresSaver (ou SqliteSaver para volume baixo). Sem checkpointer: sem human-in-the-loop, sem replay, sem escala horizontal (réplicas não compartilham memória in-process). O overhead de I/O (5–20ms) é desprezível em agentes que rodam por segundos.',
  },
  {
    title: 'Esquecer thread_id — cada invoke vira sessão nova',
    wrong: [
      [{ text: '# Backend recebe pergunta do usuário:', color: FGMUTE }],
      [{ text: '@app.post("/chat")', color: FG }],
      [{ text: 'def chat(msg: str):', color: FG }],
      [{ text: '    return graph.invoke(', color: FG }],
      [{ text: '        {"messages": [HumanMessage(msg)]}', color: RED }],
      [{ text: '        # SEM config={"configurable": {"thread_id"}}', color: RED }],
      [{ text: '    )', color: FG }],
      [{ text: '# Cada request começa do zero — sem memória', color: RED }],
    ],
    right: [
      [{ text: '@app.post("/chat")', color: FG }],
      [{ text: 'def chat(msg: str, user_id: str, session_id: str):', color: GRN }],
      [{ text: '    config = {"configurable": {', color: GRN }],
      [{ text: '        "thread_id": f"{user_id}:{session_id}"', color: GRN }],
      [{ text: '    }}', color: GRN }],
      [{ text: '    return graph.invoke(', color: GRN }],
      [{ text: '        {"messages": [HumanMessage(msg)]}, config', color: GRN }],
      [{ text: '    )', color: GRN }],
      [{ text: '# Mesma conversa = mesmo thread_id = state mantido', color: GRN }],
    ],
    why: 'Sem thread_id no config, cada invoke é uma sessão nova mesmo com checkpointer configurado. O thread_id é a chave que o checkpointer usa para identificar a sessão. Pattern: derive de user_id + session_id (ou conversation_id) para que múltiplas mensagens do mesmo usuário compartilhem o histórico, mas conversas diferentes fiquem isoladas.',
  },
  {
    title: 'Confundir LangGraph com LangChain — usar Graph onde LCEL bastaria',
    wrong: [
      [{ text: '# Pipeline simples: prompt → LLM → parser', color: FGMUTE }],
      [{ text: 'class State(TypedDict):', color: RED }],
      [{ text: '    question: str', color: RED }],
      [{ text: '    answer: str', color: RED }],
      [{ text: '', color: FG }],
      [{ text: 'def llm_node(s): return {"answer": llm.invoke(s["question"])}', color: RED }],
      [{ text: '', color: FG }],
      [{ text: 'graph = StateGraph(State)', color: RED }],
      [{ text: 'graph.add_node("llm", llm_node)', color: RED }],
      [{ text: 'graph.add_edge(START, "llm")', color: RED }],
      [{ text: 'graph.add_edge("llm", END)', color: RED }],
      [{ text: '# Toda essa cerimônia para uma chain linear', color: RED }],
    ],
    right: [
      [{ text: '# Use LCEL para pipelines lineares sem state:', color: FGMUTE }],
      [{ text: 'chain = prompt | llm | StrOutputParser()', color: GRN }],
      [{ text: 'answer = chain.invoke({"question": q})', color: GRN }],
      [{ text: '', color: FG }],
      [{ text: '# Use LangGraph quando precisa de:', color: FGMUTE }],
      [{ text: '# - State explícito com reducers', color: GRN }],
      [{ text: '# - Conditional edges (loops, branching)', color: GRN }],
      [{ text: '# - Checkpointer (pause/resume, HITL)', color: GRN }],
      [{ text: '# - Multi-agent (supervisor/swarm)', color: GRN }],
    ],
    why: 'LangGraph adiciona overhead (TypedDict, nodes, edges, checkpointer) que só vale quando você precisa de fluxo de controle ou estado persistente. Para pipelines lineares (RAG simples, classificação, summarization), LCEL chains são uma linha e mais legíveis. Pergunta diagnóstica: "preciso de loop, branching, ou pause/resume?". Não → LCEL. Sim → LangGraph.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// Componente principal
// ═══════════════════════════════════════════════════════════════════════════════

export default function LanggraphVisuais() {
  const [active, setActive] = useState(0)

  const visuals: VisualDef[] = [
    {
      id: 'reducers',
      title: 'Reducers em ação',
      subtitle: 'Replace vs Append: como o state muta a cada node — e o bug clássico de reducer errado',
      accent: C,
      component: (
        <CodeStepper
          scenarios={REDUCER_SCENARIOS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'react-loop',
      title: 'ReAct loop completo',
      subtitle: 'Sequência temporal: User → Graph → reason → LLM → tools → reason → END (com checkpoint)',
      accent: PUR,
      component: (
        <SequenceDiagram
          actors={REACT_ACTORS}
          messages={REACT_MESSAGES}
          groups={REACT_GROUPS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'hitl-states',
      title: 'Human-in-the-Loop',
      subtitle: 'Estados de uma sessão com interrupt_before — pause, inspect, edit, resume',
      accent: AMB,
      component: (
        <StateMachineExplorer
          states={HITL_STATES}
          transitions={HITL_TRANSITIONS}
          initialState="idle"
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'patterns',
      title: 'Supervisor vs Swarm vs LCEL',
      subtitle: 'Comparativo de padrões de orquestração: quando escolher cada um',
      accent: BLU,
      component: (
        <ComparisonTable
          options={PATTERN_OPTIONS}
          criteria={PATTERN_CRITERIA}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'memory-layers',
      title: 'Camadas de memória',
      subtitle: 'Thread state (curto) → BaseStore (longo) → Vector DB (semântica) → LangSmith (trace)',
      accent: AMB,
      component: (
        <LayerStack
          layers={MEMORY_LAYERS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'streaming',
      title: 'Modos de streaming',
      subtitle: 'updates, messages, values, custom — qual modo escolher para cada UX',
      accent: BLU,
      component: (
        <CardCarousel
          cards={STREAM_CARDS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
    {
      id: 'antipatterns',
      title: 'Anti-patterns',
      subtitle: 'Os 6 erros mais comuns em projetos LangGraph reais — código errado vs código correto',
      accent: RED,
      component: (
        <AntiPatternsGallery
          patterns={LANGGRAPH_ANTIPATTERNS}
          accentColor={C}
          bgColor={BG}
        />
      ),
    },
  ]

  return (
    <VisuaisShell
      visuals={visuals}
      active={active}
      onChange={setActive}
    />
  )
}

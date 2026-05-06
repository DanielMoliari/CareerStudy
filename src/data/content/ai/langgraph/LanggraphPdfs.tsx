'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'
import { buildComparativeRefPdf } from '@/components/pdfs/ComparativeRefPdf'
import type { CompOption, CompCriterion, CompScenario } from '@/components/pdfs/ComparativeRefPdf'

// ── Paleta LangGraph ──────────────────────────────────────────────────────────
const C = '#4ade80'

// ── Cards de PDF ──────────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas em entrevista de AI Engineering',
    type: 'qa',
    pages: 9,
    description: 'Recuperação ativa: 20 perguntas nível pleno/sênior cobrindo StateGraph, reducers, conditional edges, checkpointer, human-in-the-loop, BaseStore, streaming, supervisor vs swarm, deploy em produção e debug com LangSmith. Respostas com profundidade de entrevista real para AI engineering.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns',
    subtitle: 'O que não fazer com LangGraph — e o custo de cada erro',
    type: 'antipatterns',
    pages: 4,
    description: 'Os 6 anti-patterns mais comuns em projetos LangGraph: reducer errado em campo de status, conditional edge sem fallback, loop infinito sem limite, sem checkpointer em produção, esquecer thread_id e usar Graph onde LCEL bastaria. Código errado × correto com explicação.',
    icon: '02',
    goal: 'Reconhecimento de padrão',
  },
  {
    id: 'comparative',
    title: 'Patterns comparados',
    subtitle: 'Supervisor vs Swarm vs Subgraphs vs LCEL — quando usar cada um',
    type: 'comparative',
    pages: 3,
    description: 'Tabela X vs Y vs Z dos 4 padrões de orquestração de agentes em LangGraph. Critérios objetivos: previsibilidade, debug, flexibilidade, state, loops, overhead. Cenários práticos com recomendação fundamentada — qual escolher para cada caso real.',
    icon: '03',
    goal: 'Decisão arquitetural',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Truques para gravar conceitos abstratos de grafo de agentes',
    type: 'mnemonics',
    pages: 2,
    description: 'SNEC para os blocos fundamentais (State/Nodes/Edges/Checkpointer), RAA para reducers (Replace/Append por papel do campo), PIR para human-in-the-loop (Pause/Inspect/Resume) e SSL para multi-agent (Supervisor/Swarm/LCEL). Os conceitos de LangGraph que ninguém grava sem âncora.',
    icon: '04',
    goal: 'Memória de longo prazo',
  },
]

// ── Dados — Q&A ───────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'Por que LangGraph em vez de LangChain puro ou implementação própria?',
    a: 'LangChain LCEL usa chains com callbacks e runnables — bom para protótipo, mas difícil de debugar em produção porque o fluxo é implícito. Implementação própria (while loop + if/else) é viável mas você reinventa checkpointing, streaming e observabilidade. LangGraph dá: estado explícito (você vê o grafo), checkpointer (pause/resume), streaming nativo (updates por node), integração com LangSmith. Em produção, isso economiza semanas de trabalho.',
    tip: 'Mencione "estado explícito + checkpointer como diferenciais chave". Esses são os dois motivos mais fortes.',
  },
  {
    level: 'Pleno',
    q: 'Explique o ciclo de vida de um invoke no LangGraph.',
    a: 'Quando você chama graph.invoke(input, config): 1) Checkpointer carrega estado do thread_id (se existente). 2) Aplica o input como patch no estado. 3) Executa o primeiro node (START edge). 4) Após cada node, aplica reducer nos campos retornados. 5) Checkpointer persiste o estado. 6) Conditional edge decide próximo node. 7) Repete até chegar em END ou interrupt. 8) Retorna estado final.',
    tip: 'A sequência "checkpointer load → node → reducer → checkpointer save → edge" é o loop fundamental.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona o human-in-the-loop no LangGraph?',
    a: 'Compile com interrupt_before=["node_name"]. Quando o grafo chegar nesse node: 1) Para antes de executar o node. 2) Persiste estado via checkpointer. 3) Retorna para o chamador. O cliente mostra o estado ao usuário. Para retomar: graph.invoke(None, config) com o mesmo thread_id — carrega do checkpointer e continua. Para editar antes: graph.update_state(config, patch) antes do invoke.',
    tip: 'Enfatize "mesmo thread_id" — é o que conecta o resume à sessão pausada.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre reducer replace e append? Quando usar cada um?',
    a: 'Replace (padrão): o valor novo sobrescreve o antigo. Use para campos escalares: contador de steps, status atual, resposta final. Append (via Annotated + add_messages): o valor novo é adicionado ao array. Use para histórico de mensagens, lista de resultados acumulados. Erro clássico: usar append em campos de status — você acumula histórico de valores quando deveria ter só o último.',
    tip: 'Pergunte "esse campo é histórico ou estado atual?" — histórico → append, estado atual → replace.',
  },
  {
    level: 'Senior',
    q: 'Como você implementa memória de longo prazo em LangGraph?',
    a: 'Duas camadas: Thread state (curto prazo): mensagens da sessão, persistido pelo checkpointer. Apagado ou acumulado por thread_id. BaseStore (longo prazo): KV store compartilhado entre threads. Você salva fatos com namespace (ex: ("user_memories", user_id)) e key. Pattern: no início do grafo, node de memory fetch busca fatos relevantes da store; no fim, node de memory save extrai novos fatos e persiste. Outros threads do mesmo usuário leem os mesmos fatos.',
    tip: 'A separação thread_state (efêmero) vs BaseStore (persistente entre sessões) é o ponto central.',
  },
  {
    level: 'Pleno',
    q: 'Como você faz streaming em LangGraph e por que importa para UX?',
    a: 'Quatro modos: stream_mode="updates": emite um chunk por node que completa, com o patch retornado. Permite mostrar "agent está pesquisando..." etc. stream_mode="messages": emite tokens individuais de LLMs dentro dos nodes. Permite streaming de texto como ChatGPT. stream_mode="values": emite o state completo após cada node. stream_mode="custom" + writer(): permite emitir eventos arbitrários do interior dos nodes. Para UX: sem streaming, usuário vê tela em branco enquanto agente processa (pode ser 30s). Com streaming, usuário vê progresso em tempo real — reduz abandono e frustração.',
    tip: 'Mencione os quatro modos pelo nome — mostra que você conhece a API completa, não só o básico.',
  },
  {
    level: 'Senior',
    q: 'Qual a diferença entre supervisor e swarm? Quando usar cada um?',
    a: 'Supervisor: um node central (LLM) decide qual agente chamar, via tool_call. Agentes são subgraphs. Retorno sempre volta ao supervisor. Mais previsível, mais auditável, mais fácil de debugar. Bom para workflows estruturados com papéis claros (search agent, code agent, write agent). Swarm: cada agente pode fazer handoff para qualquer outro. Fluxo emergente. Mais flexível, mas imprevisível — pode loopar, difícil de debugar. Bom para colaboração aberta entre especialistas. Regra prática: comece com supervisor. Migre para swarm se os papéis são verdadeiramente dinâmicos.',
    tip: 'langgraph-supervisor e langgraph-swarm são pacotes PyPI separados com implementações prontas.',
  },
  {
    level: 'Senior',
    q: 'Como você debugaria um agente LangGraph em produção que está tomando decisões erradas?',
    a: 'Quatro ferramentas: LangSmith trace: cada invoke gera trace completo — qual node rodou, input/output, latência, tokens. Você vê exatamente onde o modelo tomou a decisão errada. Checkpointer replay: carrega o estado exato da sessão problemática e re-executa manualmente. Stream mode "updates": em dev, roda com streaming para ver cada node em tempo real. graph.get_state_history(config): lista todos os snapshots de estado de uma sessão, permite navegar no tempo.',
    tip: 'get_state_history é pouco conhecido — mencionar impressiona.',
  },
  {
    level: 'Pleno',
    q: 'Como você previne loops infinitos em agentes LangGraph?',
    a: 'Três abordagens: Contador de steps no estado: incrementa a cada node, conditional edge retorna END se > max_steps. Condição de saída clara: o LLM deve ter instrução explícita de quando parar (ex: "quando tiver a resposta, não chame mais tools"). recursion_limit no compile: graph.compile().with_config({"recursion_limit": 25}) levanta erro após N steps. Em produção, combine contador de steps com recursion_limit como fallback.',
    tip: 'Mencionar recursion_limit mostra conhecimento da API avançada.',
  },
  {
    level: 'Senior',
    q: 'Como você usa subgraphs para modularidade?',
    a: 'Um node pode ser um StateGraph compilado. O subgraph tem seu próprio estado (TypedDict). Para comunicar com o grafo pai, você pode: (a) compartilhar campos por nome (o framework faz a transformação) ou (b) expor funções de input/output explícitas no subgraph. Caso de uso: node "research" que internamente faz search → evaluate → summarize, mas para o pai é apenas um node que recebe query e retorna summary. Isso isola a complexidade interna.',
    tip: 'Subgraphs com state interno isolado são equivalentes a "private members" em OOP — encapsulamento de complexidade.',
  },
  {
    level: 'Senior',
    q: 'Qual o overhead do checkpointer em produção?',
    a: 'MemorySaver: zero overhead de I/O, mas in-process — perde tudo se processo reinicia. SQLiteSaver: latência de arquivo (1-5ms por step). PostgresSaver: latência de rede (5-20ms por step). Para agentes com steps de 1-10s (LLM call), o overhead do checkpointer é desprezível (< 1%). O custo vale pelo que você ganha: observabilidade, resume e human-in-the-loop.',
    tip: 'Comparar percentual do overhead vs latência do LLM call é a análise correta.',
  },
  {
    level: 'Pleno',
    q: 'Como você testa um grafo LangGraph?',
    a: 'Três níveis: Unit: testa cada node isoladamente, passando estado mock. Não precisa compilar o grafo. Integration: compila grafo com MemorySaver e invoca com inputs reais, verificando o estado final. E2E: roda o agente completo via LangSmith test suite com eval set anotado. Mock de LLM: use FakeListChatModel do LangChain para respostas determinísticas nos unit tests.',
    tip: 'FakeListChatModel é a chave para unit tests determinísticos de agentes.',
  },
  {
    level: 'Senior',
    q: 'Como você implementaria um agente de code review com LangGraph?',
    a: 'Design: Estado: messages, pr_diff, review_comments, approved: bool. Nodes: fetch_pr (tool: GitHub API), analyze_code (LLM: analisa diff), check_security (LLM: verifica vulnerabilidades), write_review (LLM: compõe revisão final). Edges: START → fetch_pr → analyze_code → check_security → write_review. Conditional antes de write_review: se issues críticos encontrados, interrupt_before para human review. Checkpointer: PostgresSaver com thread_id = PR number. Human-in-the-loop: interrupt_before=["post_review"] para revisão final antes de publicar.',
    tip: 'thread_id = PR number é um exemplo concreto de identificador semântico — bom design.',
  },
  {
    level: 'Senior',
    q: 'Como LangGraph Platform difere do LangGraph open source?',
    a: 'Open source: o framework em si. Você gerencia infraestrutura, checkpointer, deploy. LangGraph Platform (pago): infraestrutura gerenciada com: threads persistentes em banco, scheduler (agentes que rodam periodicamente), double-texting handling (usuário manda segunda mensagem antes da primeira terminar), deploy com API REST automática, painel de monitoramento. É o equivalente ao Vercel para Next.js — você usa o framework open source, mas a plataforma gerencia a infra em torno.',
    tip: '"Double-texting handling" é um diferencial raro de mencionar — mostra que você leu a documentação com atenção.',
  },
  {
    level: 'Senior',
    q: 'Como você gerencia erros em nodes LangGraph?',
    a: 'Três estratégias: Try/except dentro do node: captura erro, salva no estado (ex: error: str), conditional edge decide se retry ou fallback. Retry automático: compile com retry_policy=RetryPolicy(max_attempts=3) — reexecuta o node em caso de exceção. Fallback edge: se node falha após retries, edge para node de "error recovery" que notifica usuário ou usa modelo alternativo.',
    tip: 'RetryPolicy é API pouco conhecida — boa para impressionar entrevistadores técnicos.',
  },
  {
    level: 'Senior',
    q: 'Como você migraria um pipeline LangChain para LangGraph?',
    a: 'Passos: 1) Identifique o "estado" implícito da chain (mensagens, contextos, resultados intermediários) → vira TypedDict. 2) Cada etapa da chain vira um node. 3) Decisões condicionais (if/else no código) viram conditional edges. 4) Adicione checkpointer desde o início — grátis em termos de esforço, enorme em termos de observabilidade. 5) Use LangSmith para comparar traces antes e depois. O maior benefício da migração é observabilidade + a possibilidade de adicionar human-in-the-loop depois.',
    tip: 'Esse é um cenário de entrevista clássico — saber a sequência mostra que você já fez isso.',
  },
  {
    level: 'Pleno',
    q: 'Explique o padrão ReAct e como LangGraph o implementa.',
    a: 'ReAct (Reason + Act): o LLM alterna entre raciocinar (decidir o que fazer) e agir (chamar tool). Loop até ter resposta final. Em LangGraph: 1) Node reason: LLM gera AIMessage com tool_calls (se precisa de tool) ou resposta final (se tem a resposta). 2) Conditional edge: se tool_calls → node tools; se não → END. 3) Node tools: executa tool calls, retorna ToolMessages. 4) Edge: tools → reason (loop). create_react_agent(llm, tools) cria esse grafo automaticamente. Você customiza quando precisa de estado extra ou nodes adicionais.',
    tip: 'create_react_agent é o ponto de entrada mais comum — mas saber o grafo por baixo diferencia candidatos.',
  },
  {
    level: 'Senior',
    q: 'Como você faz deploy de um agente LangGraph em produção (sem a plataforma)?',
    a: 'Stack típica: FastAPI: API REST que recebe input do usuário, invoca grafo, retorna streaming response. PostgresSaver: checkpointer em banco persistente. LangSmith: observabilidade (LANGCHAIN_TRACING_V2=true). Docker + Kubernetes: deploy stateless — o estado fica no banco, não no processo. Redis: para InMemoryStore de longo prazo com persistência. Ponto crítico: o processo é stateless, o banco é o estado. Isso permite escalar horizontalmente.',
    tip: '"Processo stateless, banco é o estado" é a insight chave para escalar agentes.',
  },
  {
    level: 'Senior',
    q: 'Como você limita o contexto de mensagens para não explodir o context window?',
    a: 'Três abordagens: Trim messages: use trim_messages(messages, max_tokens=2000, strategy="last") — mantém as N últimas mensagens. Summarize memory: node periódico que resume as mensagens antigas em uma mensagem de summary, descarta as detalhadas. Filter messages: mantém só HumanMessages e AIMessages recentes, descarta ToolMessages antigas. O pattern mais robusto: summarize + últimas N mensagens. O summary carrega contexto histórico, as mensagens recentes carregam detalhe.',
    tip: 'Mencionar trim_messages (função oficial) mostra que você conhece as utils do LangChain.',
  },
  {
    level: 'Senior',
    q: 'Como você implementaria rate limiting e quota de usuário em um agente LangGraph?',
    a: 'Node de validação no início do grafo: 1) Node check_quota: busca uso do usuário no Redis (ou DB), verifica se excedeu limite. Se sim: retorna estado com error="quota_exceeded", conditional edge vai para END. 2) Node track_usage: após execução, incrementa contador do usuário. Para custo de tokens: LangSmith rastreia tokens por trace. Você pode adicionar callback que acumula usage no estado e salva no DB ao final.',
    tip: 'Combinar Redis (rate limit em tempo real) com LangSmith (auditoria post-mortem) é o pattern de produção.',
  },
]

// ── Dados — Anti-patterns ─────────────────────────────────────────────────────

const ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'Reducer errado: APPEND em campo de status',
    badDesc: 'Usar Annotated[list, add_messages] em campo que deveria guardar valor atual — acumula histórico em vez de substituir.',
    badCode: [
      { t: 'class State(TypedDict):', c: '#fda4af' },
      { t: '\n    # status deveria ser "running"|"done"', c: '#94a3b8' },
      { t: '\n    status: Annotated[list, add_messages]', c: '#ef4444' },
      { t: '\n', c: '#fda4af' },
      { t: '\ndef set_done(s): return {"status": "done"}', c: '#fda4af' },
      { t: '\n# state["status"] vira ["running", "done", ...]', c: '#ef4444' },
      { t: '\n# Código que checa == "done" sempre falha', c: '#ef4444' },
    ],
    goodDesc: 'Sem Annotated → reducer REPLACE substitui. Use APPEND apenas para histórico (mensagens, eventos).',
    goodCode: [
      { t: 'class State(TypedDict):', c: '#86efac' },
      { t: '\n    # Sem Annotated → reducer REPLACE', c: '#94a3b8' },
      { t: '\n    status: str  # "running" | "done" | "error"', c: '#4ade80' },
      { t: '\n    messages: Annotated[list, add_messages]  # APPEND ok', c: '#4ade80' },
      { t: '\n', c: '#86efac' },
      { t: '\n# Pergunta diagnóstica:', c: '#94a3b8' },
      { t: '\n# Esse campo é HISTÓRICO ou ESTADO ATUAL?', c: '#4ade80' },
    ],
    why: 'O bug mais comum em LangGraph. add_messages e Annotated[list, operator.add] fazem APPEND — usar isso para status, contadores ou flags acumula valores em vez de substituir. Pergunte sempre "esse campo é histórico ou estado atual?". Histórico → APPEND. Estado atual → REPLACE (sem Annotated).',
  },
  {
    title: 'Conditional edge sem fallback — KeyError silencioso',
    badDesc: 'Função route não retorna string em todos os casos — quando nenhum if dispara, retorna None e levanta KeyError.',
    badCode: [
      { t: 'def route(state) -> str:', c: '#fda4af' },
      { t: '\n    if state["needs_tool"]: return "tools"', c: '#fda4af' },
      { t: '\n    if state["done"]:       return "finish"', c: '#fda4af' },
      { t: '\n    # Esqueceu o caso default!', c: '#ef4444' },
      { t: '\n', c: '#fda4af' },
      { t: '\ngraph.add_conditional_edges("reason", route, {', c: '#fda4af' },
      { t: '\n    "tools": "tools_node", "finish": END,', c: '#fda4af' },
      { t: '\n})', c: '#fda4af' },
      { t: '\n# route retornar None → KeyError silencioso', c: '#ef4444' },
    ],
    goodDesc: 'Sempre termine com fallback explícito. Use Literal para o type checker pegar o caso esquecido.',
    goodCode: [
      { t: 'def route(state) -> Literal["tools", "finish"]:', c: '#4ade80' },
      { t: '\n    if state["needs_tool"]: return "tools"', c: '#4ade80' },
      { t: '\n    return "finish"  # SEMPRE um fallback explícito', c: '#4ade80' },
      { t: '\n', c: '#86efac' },
      { t: '\n# O linter agora pega exhaustiveness:', c: '#94a3b8' },
      { t: '\n# se você esquecer um return, mypy reclama.', c: '#4ade80' },
    ],
    why: 'Conditional edges levantam KeyError se a função retornar string fora do dict de mapeamento — e None se nenhum if dispara. Sempre termine com return "finish" ou return END. Use typing.Literal para o type checker pegar o caso esquecido em compile time.',
  },
  {
    title: 'Loop infinito sem condição de saída',
    badDesc: 'Agente ReAct sem contador de iterações nem recursion_limit — LLM fica chamando tools até o token budget esgotar.',
    badCode: [
      { t: 'def should_act(state) -> str:', c: '#fda4af' },
      { t: '\n    last = state["messages"][-1]', c: '#fda4af' },
      { t: '\n    return "tools" if last.tool_calls else "end"', c: '#fda4af' },
      { t: '\n', c: '#fda4af' },
      { t: '\n# Nada limita iterações.', c: '#ef4444' },
      { t: '\n# LLM pode chamar tools infinitamente.', c: '#ef4444' },
      { t: '\n# Em produção: gasta budget e quebra a aplicação.', c: '#ef4444' },
    ],
    goodDesc: 'Duas defesas: contador de steps no state + recursion_limit no compile como fallback.',
    goodCode: [
      { t: 'class State(TypedDict):', c: '#86efac' },
      { t: '\n    messages: Annotated[list, add_messages]', c: '#4ade80' },
      { t: '\n    iter_count: int  # contador de saída', c: '#4ade80' },
      { t: '\n', c: '#86efac' },
      { t: '\ndef should_act(state) -> str:', c: '#86efac' },
      { t: '\n    if state["iter_count"] >= 10: return "end"', c: '#4ade80' },
      { t: '\n    last = state["messages"][-1]', c: '#86efac' },
      { t: '\n    return "tools" if last.tool_calls else "end"', c: '#86efac' },
      { t: '\n', c: '#86efac' },
      { t: '\n# Fallback no compile:', c: '#94a3b8' },
      { t: '\ngraph.compile(...).with_config({"recursion_limit": 25})', c: '#4ade80' },
    ],
    why: 'Agentes ReAct podem entrar em loop quando o LLM "não sabe parar" e fica chamando tools. Use SEMPRE duas defesas: contador de iterações no state (controla a lógica) + recursion_limit no compile (fallback que levanta erro). Sem isso, o agente esgota o token budget e quebra em produção.',
  },
  {
    title: 'Sem checkpointer em produção',
    badDesc: 'Compilar sem checkpointer — processo cai e todas as sessões são perdidas. Sem human-in-the-loop, sem replay.',
    badCode: [
      { t: '# main.py em produção:', c: '#94a3b8' },
      { t: '\ngraph = builder.compile()  # SEM checkpointer', c: '#ef4444' },
      { t: '\n', c: '#fda4af' },
      { t: '\n# Consequências:', c: '#94a3b8' },
      { t: '\n# - Processo cai → todas as sessões perdidas', c: '#ef4444' },
      { t: '\n# - Sem human-in-the-loop possível', c: '#ef4444' },
      { t: '\n# - Sem replay para debug', c: '#ef4444' },
      { t: '\n# - Múltiplas réplicas não compartilham state', c: '#ef4444' },
    ],
    goodDesc: 'PostgresSaver em produção. Overhead de I/O (5-20ms) é desprezível vs latência do LLM call.',
    goodCode: [
      { t: 'from langgraph.checkpoint.postgres import PostgresSaver', c: '#4ade80' },
      { t: '\n', c: '#86efac' },
      { t: '\nwith PostgresSaver.from_conn_string(DB_URL) as cp:', c: '#4ade80' },
      { t: '\n    graph = builder.compile(checkpointer=cp)', c: '#4ade80' },
      { t: '\n    # State persistido — múltiplas réplicas OK', c: '#94a3b8' },
      { t: '\n    # Cada thread_id retomável após queda', c: '#94a3b8' },
      { t: '\n', c: '#86efac' },
      { t: '\n# Setup pré-deploy (cria as tabelas):', c: '#94a3b8' },
      { t: '\ncp.setup()', c: '#4ade80' },
    ],
    why: 'MemorySaver é só para dev — perde tudo se o processo reinicia. Em produção, use PostgresSaver (ou SqliteSaver para volume baixo). Sem checkpointer: sem human-in-the-loop, sem replay, sem escala horizontal (réplicas não compartilham memória in-process). O overhead de I/O (5-20ms) é desprezível em agentes que rodam por segundos.',
  },
  {
    title: 'Esquecer thread_id — cada invoke vira sessão nova',
    badDesc: 'Backend chama invoke sem config={"configurable": {"thread_id"}} — checkpointer nunca encontra estado anterior.',
    badCode: [
      { t: '@app.post("/chat")', c: '#fda4af' },
      { t: '\ndef chat(msg: str):', c: '#fda4af' },
      { t: '\n    return graph.invoke(', c: '#fda4af' },
      { t: '\n        {"messages": [HumanMessage(msg)]}', c: '#ef4444' },
      { t: '\n        # SEM config — thread_id ausente', c: '#ef4444' },
      { t: '\n    )', c: '#fda4af' },
      { t: '\n# Cada request começa do zero — sem memória', c: '#ef4444' },
      { t: '\n# Checkpointer não funciona sem thread_id', c: '#ef4444' },
    ],
    goodDesc: 'Derive thread_id de user_id + session_id. Mesma conversa = mesmo thread_id = state mantido.',
    goodCode: [
      { t: '@app.post("/chat")', c: '#86efac' },
      { t: '\ndef chat(msg: str, user_id: str, session_id: str):', c: '#4ade80' },
      { t: '\n    config = {"configurable": {', c: '#4ade80' },
      { t: '\n        "thread_id": f"{user_id}:{session_id}"', c: '#4ade80' },
      { t: '\n    }}', c: '#4ade80' },
      { t: '\n    return graph.invoke(', c: '#86efac' },
      { t: '\n        {"messages": [HumanMessage(msg)]}, config', c: '#4ade80' },
      { t: '\n    )', c: '#86efac' },
    ],
    why: 'Sem thread_id no config, cada invoke é uma sessão nova mesmo com checkpointer configurado. O thread_id é a chave que o checkpointer usa para identificar a sessão. Pattern: derive de user_id + session_id (ou conversation_id) para que múltiplas mensagens do mesmo usuário compartilhem o histórico, mas conversas diferentes fiquem isoladas.',
  },
  {
    title: 'Usar LangGraph onde LCEL bastaria',
    badDesc: 'StateGraph para pipeline linear sem state nem branching — cerimônia desnecessária para chain simples.',
    badCode: [
      { t: '# Pipeline simples: prompt → LLM → parser', c: '#94a3b8' },
      { t: '\nclass State(TypedDict):', c: '#fda4af' },
      { t: '\n    question: str', c: '#fda4af' },
      { t: '\n    answer: str', c: '#fda4af' },
      { t: '\n', c: '#fda4af' },
      { t: '\ndef llm_node(s):', c: '#fda4af' },
      { t: '\n    return {"answer": llm.invoke(s["question"])}', c: '#fda4af' },
      { t: '\n', c: '#fda4af' },
      { t: '\ngraph = StateGraph(State)', c: '#ef4444' },
      { t: '\ngraph.add_node("llm", llm_node)', c: '#ef4444' },
      { t: '\ngraph.add_edge(START, "llm")', c: '#ef4444' },
      { t: '\ngraph.add_edge("llm", END)', c: '#ef4444' },
    ],
    goodDesc: 'Use LCEL para pipelines lineares. LangGraph quando precisar de loops, branching ou pause/resume.',
    goodCode: [
      { t: '# LCEL: uma linha:', c: '#94a3b8' },
      { t: '\nchain = prompt | llm | StrOutputParser()', c: '#4ade80' },
      { t: '\nanswer = chain.invoke({"question": q})', c: '#4ade80' },
      { t: '\n', c: '#86efac' },
      { t: '\n# Use LangGraph quando precisar de:', c: '#94a3b8' },
      { t: '\n# - State explícito com reducers', c: '#4ade80' },
      { t: '\n# - Conditional edges (loops, branching)', c: '#4ade80' },
      { t: '\n# - Checkpointer (pause/resume, HITL)', c: '#4ade80' },
      { t: '\n# - Multi-agent (supervisor/swarm)', c: '#4ade80' },
    ],
    why: 'LangGraph adiciona overhead (TypedDict, nodes, edges, checkpointer) que só vale quando você precisa de fluxo de controle ou estado persistente. Para pipelines lineares (RAG simples, classificação, summarization), LCEL chains são uma linha e mais legíveis. Pergunta diagnóstica: "preciso de loop, branching, ou pause/resume?". Não → LCEL. Sim → LangGraph.',
  },
]

// ── Dados — Comparative ───────────────────────────────────────────────────────

const COMP_OPTIONS: CompOption[] = [
  { name: 'Supervisor', color: '#4ade80' },
  { name: 'Swarm',      color: '#60a5fa' },
  { name: 'Subgraphs',  color: '#a78bfa' },
  { name: 'LCEL',       color: '#f59e0b' },
]

const COMP_CRITERIA: CompCriterion[] = [
  {
    criterion: 'Previsibilidade do fluxo',
    category: 'Comportamento',
    values: {
      Supervisor: 'Alta — supervisor sempre decide',
      Swarm:      'Baixa — handoffs emergentes',
      Subgraphs:  'Alta — hierarquia explícita',
      LCEL:       'Máxima — pipeline determinístico',
    },
    winner: 'LCEL',
  },
  {
    criterion: 'Facilidade de debug',
    category: 'Operações',
    values: {
      Supervisor: 'Boa — trace mostra cada decisão central',
      Swarm:      'Difícil — loops emergentes',
      Subgraphs:  'Boa — escopo bem delimitado',
      LCEL:       'Excelente — stack linear',
    },
    winner: 'LCEL',
  },
  {
    criterion: 'Adicionar novo agente',
    category: 'Evolução',
    values: {
      Supervisor: 'Médio — mudar prompt + node',
      Swarm:      'Fácil — novo agente declara handoffs',
      Subgraphs:  'Médio — adicionar subgraph + edge',
      LCEL:       'Difícil — reescrever a chain',
    },
    winner: 'Swarm',
  },
  {
    criterion: 'Compartilhamento de state',
    category: 'Arquitetura',
    values: {
      Supervisor: 'Excelente — state único compartilhado',
      Swarm:      'Bom — state global, agentes leem campos',
      Subgraphs:  'Bom — state pai + subgraph isolado',
      LCEL:       'Ruim — sem state global',
    },
    winner: 'Supervisor',
  },
  {
    criterion: 'Loops e retry',
    category: 'Comportamento',
    values: {
      Supervisor: 'Excelente — loop natural via supervisor',
      Swarm:      'Excelente — handoff cria loop fácil',
      Subgraphs:  'Bom — loop interno do subgraph',
      LCEL:       'Ruim — pipeline linear, exige hack',
    },
    winner: 'Supervisor',
  },
  {
    criterion: 'Overhead inicial',
    category: 'Operações',
    values: {
      Supervisor: 'Baixo — create_supervisor() pronto',
      Swarm:      'Médio — definir handoffs em cada agente',
      Subgraphs:  'Baixo — cada subgraph é StateGraph',
      LCEL:       'Mínimo — uma linha',
    },
    winner: 'LCEL',
  },
  {
    criterion: 'Uso ideal',
    category: 'Quando usar',
    values: {
      Supervisor: 'Workflows estruturados com papéis claros',
      Swarm:      'Colaboração aberta entre especialistas',
      Subgraphs:  'Encapsular complexidade interna',
      LCEL:       'RAG, classificação, summarization',
    },
  },
]

const COMP_SCENARIOS: CompScenario[] = [
  {
    scenario: 'RAG simples: pergunta → retrieve → LLM → resposta',
    recommendation: 'LCEL chain',
    reason: 'Pipeline linear sem state nem branching. retriever | prompt | llm | parser resolve em uma linha. Adicionar LangGraph aqui é over-engineering.',
  },
  {
    scenario: 'Assistente que pesquisa, analisa e escreve relatório',
    recommendation: 'Supervisor (langgraph-supervisor)',
    reason: 'Workflow estruturado com papéis claros (search/analyze/write). Supervisor central decide a ordem, é auditável e fácil de debugar com LangSmith. create_supervisor() configura em poucas linhas.',
  },
  {
    scenario: 'Sistema de agentes especialistas que se ajudam mutuamente',
    recommendation: 'Swarm (langgraph-swarm)',
    reason: 'Colaboração emergente sem orquestrador único. Agentes fazem handoff peer-to-peer baseado em expertise. Use quando os papéis são verdadeiramente dinâmicos — caso contrário, prefira Supervisor.',
  },
  {
    scenario: 'Pipeline de "research" com 4 sub-etapas usado em vários grafos',
    recommendation: 'Subgraph reutilizável',
    reason: 'Encapsule a lógica complexa em StateGraph compilado e use como node nos grafos pais. Cada uso vê só "research_node" — a complexidade interna é escondida. Equivalente a função reutilizável.',
  },
  {
    scenario: 'Chatbot com memória, ferramentas e revisão humana',
    recommendation: 'StateGraph + create_react_agent + interrupt_before',
    reason: 'Combina ReAct (loop tool calling) com checkpointer (state por sessão) e human-in-the-loop (revisão antes de ação crítica). Esse é o "sweet spot" do LangGraph.',
  },
]

// ── Dados — Mnemônicos ────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'SNEC — os 4 blocos fundamentais',
    trick: 'State, Nodes, Edges, Checkpointer',
    expansion: [
      ['S', 'State — TypedDict com reducers (replace ou append)'],
      ['N', 'Nodes — funções fn(state) → patch'],
      ['E', 'Edges — fixos (add_edge) ou condicionais (add_conditional_edges)'],
      ['C', 'Checkpointer — persiste estado, habilita pause/resume e HITL'],
    ],
    explanation: 'Os quatro pilares de qualquer grafo LangGraph. State define o esquema, nodes processam, edges decidem o fluxo, checkpointer dá observabilidade e resumibilidade. Sem qualquer um deles, você está fazendo apenas LCEL com extra cerimônia.',
    example: 'StateGraph(State).add_node("n", fn).add_edge(START, "n").compile(checkpointer=cp)',
    why: 'Quando você esquece SNEC, a tendência é cair no anti-pattern de "LangGraph sem checkpointer" ou "node mutando state diretamente em vez de retornar patch". O acrônimo te força a checar os 4.',
  },
  {
    label: 'RAA — Replace para Atual, Append para Acumulado',
    trick: 'Histórico → Append (Annotated). Atual → Replace (sem Annotated).',
    expansion: [
      ['R', 'Replace — campo escalar, valor atual (status, contador, resposta final)'],
      ['A', 'Append — array crescente (mensagens, eventos, logs)'],
      ['A', 'Annotated[list, add_messages] → APPEND com dedup por message ID'],
    ],
    explanation: 'O bug mais comum em LangGraph é usar reducer errado. Pergunta diagnóstica: "esse campo é HISTÓRICO ou ESTADO ATUAL?". Histórico → APPEND. Estado atual → REPLACE. Status, flag, contador, resposta final são todos REPLACE. Mensagens, eventos, resultados acumulados são todos APPEND.',
    example: 'messages: Annotated[list, add_messages]  # APPEND\nstatus: str  # REPLACE\niter_count: int  # REPLACE',
    why: 'Reducer errado em campo de status faz o estado virar lista quando deveria ser string. Toda lógica downstream que comparava == "done" passa a falhar silenciosamente. RAA evita isso.',
  },
  {
    label: 'PIR — Human-in-the-Loop em 3 passos',
    trick: 'Pause, Inspect, Resume',
    expansion: [
      ['P', 'Pause — compile com interrupt_before=["node"], graph para antes do node'],
      ['I', 'Inspect — get_state(config) retorna snapshot, mostre ao humano'],
      ['R', 'Resume — invoke(None, config) continua do checkpoint'],
    ],
    explanation: 'O ciclo completo de human-in-the-loop. Para editar antes de retomar: update_state(config, patch). Note que update_state NÃO executa nenhum node — apenas muta o state. Só o próximo invoke faz isso.',
    example: 'graph.compile(interrupt_before=["send_email"])\n# pausa → get_state → update_state → invoke(None, config)',
    why: 'PIR cobre o caso completo. Esquecer "Inspect" leva a aplicações que retomam sem mostrar nada ao humano. Esquecer que "update_state" não executa nodes leva a bugs onde o humano "salva" um valor mas o node nunca roda.',
  },
  {
    label: 'SSL-L — escolha do padrão de orquestração',
    trick: 'Supervisor / Swarm / sub-Layers / LCEL',
    expansion: [
      ['S', 'Supervisor — workflow estruturado, papéis claros, auditável'],
      ['S', 'Swarm — colaboração aberta, handoffs peer-to-peer, emergente'],
      ['L', 'sub-Layers (subgraphs) — encapsular complexidade interna'],
      ['L', 'LCEL — pipeline linear sem state, RAG simples, classificação'],
    ],
    explanation: 'Pergunta diagnóstica em ordem: "Preciso de state global ou loop?" — Não → LCEL. — Sim → "Os papéis são fixos?" Sim → Supervisor. Não → Swarm. — "Tem complexidade interna reutilizável?" Sim → Subgraph. A escolha errada gera over-engineering ou caos imprevisível.',
    example: 'RAG → LCEL. Code review com etapas → Supervisor. Brainstorm de especialistas → Swarm. "research" reutilizável → Subgraph.',
    why: 'O erro mais caro é usar Swarm onde Supervisor bastaria — você ganha imprevisibilidade desnecessária. O segundo erro é usar Graph onde LCEL bastaria — cerimônia sem benefício.',
  },
]

// ── Componente principal ──────────────────────────────────────────────────────

export default function LanggraphPdfs() {
  const [open, setOpen] = useState<PdfCard | null>(null)

  const hero = PDF_CARDS[0]
  const rest = PDF_CARDS.slice(1)

  const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
    qa: () => buildQAReviewPdf({
      qa: QAS,
      accentColor: C,
      skillName: 'LangGraph',
      stackLabel: 'AI / Agent Framework',
    }),
    antipatterns: () => buildAntipatternsPdf({
      antipatterns: ANTIPATTERNS,
      accentColor: C,
      skillName: 'LangGraph',
      stackLabel: 'AI / Agent Framework',
    }),
    comparative: () => buildComparativeRefPdf({
      options: COMP_OPTIONS,
      criteria: COMP_CRITERIA,
      scenarios: COMP_SCENARIOS,
      skillName: 'LangGraph',
      accentColor: C,
      stackLabel: 'AI / Agent Framework',
    }),
    mnemonics: () => buildMnemonicsPdf({
      mnemonics: MNEMONICS,
      accentColor: C,
      skillName: 'LangGraph',
      stackLabel: 'AI / Agent Framework',
    }),
  }

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

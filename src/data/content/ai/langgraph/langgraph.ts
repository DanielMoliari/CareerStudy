import type { SkillContent } from '@/types'

const langgraph: SkillContent = {
    tagline: 'Framework de agentes como grafos de estado explícito: checkpoint, human-in-the-loop e multi-agente em produção.',
    why: 'Empresas que rodam agentes em produção pedem LangGraph porque ele resolve o problema das chains mágicas: estado explícito, transições rastreáveis, checkpointer que permite pausar/retomar e debugar. Diferencial vs LangChain e vs soluções homebrew. Quase obrigatório em entrevistas de AI engineering sênior em 2025.',
    prerequisite: 'Python básico/intermediário, conceito de LLM function calling, noção de grafo direcionado.',
    summary: 'LangGraph modela agentes como grafos: nodes são funções Python/TS que recebem estado e retornam patches, edges são transições fixas ou condicionais. O estado é um TypedDict com reducers (replace ou append por campo). Checkpointer persiste estado a cada step — permite pausar (human-in-the-loop), retomar após falha, e fazer replay de debug. Suporta subgraphs, multi-agente (supervisor/swarm), streaming de tokens/updates, e memória de longo prazo via BaseStore.',
    howToStudy: `<ol>
  <li><strong>Instale e rode o "hello world"</strong>: grafo com dois nodes e um edge fixo — 30 min.</li>
  <li><strong>Adicione conditional edge</strong>: node decide próximo baseado no estado — 30 min.</li>
  <li><strong>Adicione checkpointer MemorySaver</strong>: pause e retome — 45 min.</li>
  <li><strong>Implemente human-in-the-loop</strong>: interrupt_before + graph.update_state — 1h.</li>
  <li><strong>Construa agente ReAct</strong>: node reason, node act, conditional edge — 1h.</li>
  <li><strong>Adicione long-term memory com BaseStore</strong> — 1h.</li>
  <li><strong>Estude padrões multi-agente</strong>: supervisor e swarm — 1h.</li>
  <li><strong>Conecte ao LangSmith</strong> para trace e debug — 30 min.</li>
</ol>`,
    diagrams: [
      {
        title: 'Anatomia de um StateGraph LangGraph',
        html: `<div style="background:#0f1a1a;border-radius:12px;padding:24px;font-family:monospace;font-size:12px;color:#e2e8f0;max-width:800px">
  <div style="text-align:center;color:#1C3C3C;background:#4ade80;font-weight:700;font-size:15px;margin-bottom:20px;padding:8px;border-radius:6px;letter-spacing:1px">STATEGRAPH — ANATOMIA</div>
  <div style="display:grid;grid-template-columns:auto 1fr;gap:20px;align-items:start">
    <!-- Grafo visual -->
    <div style="background:#0d1117;border-radius:10px;padding:16px;min-width:200px">
      <div style="text-align:center;margin-bottom:12px;color:#4ade80;font-size:11px">GRAFO DE EXECUÇÃO</div>
      <!-- START -->
      <div style="text-align:center;margin-bottom:8px">
        <div style="background:#1e293b;border:2px solid #4ade80;border-radius:20px;padding:4px 12px;display:inline-block;font-size:10px;color:#4ade80">START</div>
      </div>
      <div style="text-align:center;color:#475569;font-size:16px">↓</div>
      <!-- Node 1 -->
      <div style="text-align:center;margin:6px 0">
        <div style="background:#1C3C3C;border:2px solid #4ade80;border-radius:8px;padding:8px 16px;display:inline-block">
          <div style="color:#4ade80;font-weight:700;font-size:11px">reason_node</div>
          <div style="color:#94a3b8;font-size:10px">fn(state) → patch</div>
        </div>
      </div>
      <div style="text-align:center;color:#475569;font-size:16px">↓ condicional</div>
      <!-- Bifurcação -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:6px 0">
        <div style="text-align:center">
          <div style="background:#1C3C3C;border:2px solid #60a5fa;border-radius:8px;padding:6px;font-size:10px">
            <div style="color:#60a5fa">tool_node</div>
          </div>
          <div style="color:#475569;font-size:12px">↓ loop</div>
        </div>
        <div style="text-align:center">
          <div style="background:#1C3C3C;border:2px solid #f87171;border-radius:8px;padding:6px;font-size:10px">
            <div style="color:#f87171">END</div>
          </div>
        </div>
      </div>
    </div>
    <!-- Explicações -->
    <div style="display:flex;flex-direction:column;gap:10px">
      <div style="background:#0d1117;border-left:3px solid #4ade80;border-radius:6px;padding:10px">
        <div style="color:#4ade80;font-weight:700;font-size:11px">STATE (TypedDict)</div>
        <div style="color:#94a3b8;font-size:11px">Schema compartilhado entre nodes. Cada campo tem reducer (replace/append). Imutável — nodes retornam patch.</div>
      </div>
      <div style="background:#0d1117;border-left:3px solid #60a5fa;border-radius:6px;padding:10px">
        <div style="color:#60a5fa;font-weight:700;font-size:11px">NODES</div>
        <div style="color:#94a3b8;font-size:11px">Funções Python (sync ou async). Recebem estado completo, retornam dict com campos a atualizar. Podem chamar LLM, tools, banco.</div>
      </div>
      <div style="background:#0d1117;border-left:3px solid #fbbf24;border-radius:6px;padding:10px">
        <div style="color:#fbbf24;font-weight:700;font-size:11px">CONDITIONAL EDGE</div>
        <div style="color:#94a3b8;font-size:11px">Função que inspeciona estado e retorna string com nome do próximo node. Permite loops, branching, retry.</div>
      </div>
      <div style="background:#0d1117;border-left:3px solid #a78bfa;border-radius:6px;padding:10px">
        <div style="color:#a78bfa;font-weight:700;font-size:11px">CHECKPOINTER</div>
        <div style="color:#94a3b8;font-size:11px">Persiste estado após cada step. MemorySaver (dev), SQLiteSaver, PostgresSaver (prod). Habilita pause/resume e replay.</div>
      </div>
    </div>
  </div>
</div>`,
        caption: 'Nodes recebem estado completo e retornam patch parcial. Edges decidem o fluxo. Checkpointer persiste após cada step.',
      },
      {
        title: 'Human-in-the-Loop: Interrupt e Resume',
        html: `<div style="background:#0f1a1a;border-radius:12px;padding:24px;font-family:monospace;font-size:12px;color:#e2e8f0;max-width:750px">
  <div style="text-align:center;color:#1C3C3C;background:#4ade80;font-weight:700;font-size:14px;margin-bottom:20px;padding:8px;border-radius:6px">HUMAN-IN-THE-LOOP — FLUXO COMPLETO</div>
  <div style="display:flex;flex-direction:column;gap:6px">
    <div style="display:flex;align-items:center;gap:10px">
      <div style="background:#1C3C3C;border:2px solid #4ade80;border-radius:6px;padding:8px;width:140px;text-align:center;font-size:10px;color:#4ade80">grafo.invoke(input)</div>
      <div style="color:#475569">→</div>
      <div style="color:#94a3b8;font-size:11px">Inicia execução com thread_id no config</div>
    </div>
    <div style="color:#475569;margin-left:70px">↓</div>
    <div style="display:flex;align-items:center;gap:10px">
      <div style="background:#1C3C3C;border:2px solid #60a5fa;border-radius:6px;padding:8px;width:140px;text-align:center;font-size:10px;color:#60a5fa">reason_node</div>
      <div style="color:#475569">→</div>
      <div style="color:#94a3b8;font-size:11px">Processa, decide ação</div>
    </div>
    <div style="color:#475569;margin-left:70px">↓</div>
    <div style="display:flex;align-items:center;gap:10px">
      <div style="background:#7c3aed;border-radius:6px;padding:8px;width:140px;text-align:center;font-size:10px;color:#fff">INTERRUPT</div>
      <div style="color:#475569">→</div>
      <div style="color:#fbbf24;font-size:11px">interrupt_before=["send_email"] — estado persiste, execução para</div>
    </div>
    <div style="color:#475569;margin-left:70px">↓</div>
    <div style="background:#1e293b;border:1px solid #475569;border-radius:6px;padding:10px;margin-left:0">
      <div style="color:#e2e8f0;font-size:11px">Frontend mostra estado pendente ao usuário:</div>
      <div style="color:#4ade80;font-size:11px;margin-top:4px">{ "action": "send_email", "to": "ceo@company.com", "body": "..." }</div>
    </div>
    <div style="color:#475569;margin-left:70px">↓ aprovado ou rejeitado</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      <div style="background:#0d1117;border:2px solid #4ade80;border-radius:6px;padding:10px">
        <div style="color:#4ade80;font-weight:700;font-size:11px">APROVADO</div>
        <div style="color:#94a3b8;font-size:10px">graph.invoke(None, config)</div>
        <div style="color:#94a3b8;font-size:10px">Retoma do ponto exato</div>
      </div>
      <div style="background:#0d1117;border:2px solid #f87171;border-radius:6px;padding:10px">
        <div style="color:#f87171;font-weight:700;font-size:11px">REJEITADO</div>
        <div style="color:#94a3b8;font-size:10px">graph.update_state(config, patch)</div>
        <div style="color:#94a3b8;font-size:10px">Injeta override antes de retomar</div>
      </div>
    </div>
  </div>
</div>`,
        caption: 'thread_id é a chave que o checkpointer usa para identificar a sessão. Cada resume com mesmo thread_id continua de onde parou.',
      },
      {
        title: 'Padrões Multi-Agente: Supervisor vs Swarm',
        html: `<div style="background:#0f1a1a;border-radius:12px;padding:24px;font-family:monospace;font-size:12px;color:#e2e8f0;max-width:800px">
  <div style="text-align:center;color:#1C3C3C;background:#4ade80;font-weight:700;font-size:14px;margin-bottom:20px;padding:8px;border-radius:6px">PADRÕES MULTI-AGENTE</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
    <!-- Supervisor -->
    <div style="background:#0d1117;border:2px solid #4ade80;border-radius:10px;padding:16px">
      <div style="color:#4ade80;font-weight:700;font-size:13px;margin-bottom:12px;text-align:center">SUPERVISOR</div>
      <div style="text-align:center;margin-bottom:8px">
        <div style="background:#1C3C3C;border:2px solid #4ade80;border-radius:20px;padding:4px 16px;display:inline-block;font-size:11px;color:#4ade80">supervisor_node</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;margin-top:8px">
        <div style="background:#1C3C3C;border-radius:6px;padding:6px;text-align:center">
          <div style="color:#60a5fa;font-size:10px">search</div>
          <div style="color:#60a5fa;font-size:10px">agent</div>
        </div>
        <div style="background:#1C3C3C;border-radius:6px;padding:6px;text-align:center">
          <div style="color:#a78bfa;font-size:10px">code</div>
          <div style="color:#a78bfa;font-size:10px">agent</div>
        </div>
        <div style="background:#1C3C3C;border-radius:6px;padding:6px;text-align:center">
          <div style="color:#fbbf24;font-size:10px">write</div>
          <div style="color:#fbbf24;font-size:10px">agent</div>
        </div>
      </div>
      <div style="margin-top:10px;font-size:10px;color:#94a3b8">
        <div style="color:#4ade80">Vantagens:</div>
        <div>+ Previsível e auditável</div>
        <div>+ Controle centralizado</div>
        <div>+ Fácil de debugar</div>
        <div style="color:#f87171;margin-top:4px">Desvantagens:</div>
        <div>- Supervisor é gargalo</div>
        <div>- Menos flexível</div>
      </div>
    </div>
    <!-- Swarm -->
    <div style="background:#0d1117;border:2px solid #60a5fa;border-radius:10px;padding:16px">
      <div style="color:#60a5fa;font-weight:700;font-size:13px;margin-bottom:12px;text-align:center">SWARM (HANDOFF)</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:8px 0">
        <div style="background:#1C3C3C;border:1px solid #60a5fa;border-radius:8px;padding:8px;text-align:center">
          <div style="color:#60a5fa;font-size:10px">agent_A</div>
          <div style="color:#475569;font-size:10px">→ handoff →</div>
        </div>
        <div style="background:#1C3C3C;border:1px solid #a78bfa;border-radius:8px;padding:8px;text-align:center">
          <div style="color:#a78bfa;font-size:10px">agent_B</div>
          <div style="color:#475569;font-size:10px">→ handoff →</div>
        </div>
        <div style="background:#1C3C3C;border:1px solid #fbbf24;border-radius:8px;padding:8px;text-align:center">
          <div style="color:#fbbf24;font-size:10px">agent_C</div>
          <div style="color:#475569;font-size:10px">← handoff ←</div>
        </div>
        <div style="background:#1C3C3C;border:1px solid #34d399;border-radius:8px;padding:8px;text-align:center">
          <div style="color:#34d399;font-size:10px">agent_D</div>
          <div style="color:#475569;font-size:10px">→ END</div>
        </div>
      </div>
      <div style="margin-top:10px;font-size:10px;color:#94a3b8">
        <div style="color:#60a5fa">Vantagens:</div>
        <div>+ Flexível e escalável</div>
        <div>+ Sem gargalo central</div>
        <div style="color:#f87171;margin-top:4px">Desvantagens:</div>
        <div>- Imprevisível</div>
        <div>- Difícil de debugar</div>
        <div>- Pode loopar</div>
      </div>
    </div>
  </div>
  <div style="margin-top:14px;background:#0d1117;border-radius:6px;padding:10px;text-align:center;font-size:11px;color:#94a3b8">
    <strong style="color:#4ade80">Regra</strong>: Supervisor para workflows estruturados com papéis claros. Swarm para colaboração aberta entre especialistas.
  </div>
</div>`,
        caption: 'langgraph-supervisor e langgraph-swarm são pacotes prontos que implementam esses padrões.',
      },
    ],
    keypoints: [
      {
        title: 'StateGraph e o TypedDict de estado',
        body: 'Você define o schema do estado como TypedDict. Cada campo pode ter um reducer: <code>Annotated[list, add_messages]</code> acumula (append), campo sem annotation faz replace. Nodes recebem o estado completo e retornam dict com apenas os campos que mudaram (patch parcial). Estado nunca é mutado diretamente.',
        code: `from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages

class AgentState(TypedDict):
    messages: Annotated[list, add_messages]  # reducer: append
    step_count: int                           # reducer: replace (default)
    final_answer: str

graph_builder = StateGraph(AgentState)`,
      },
      {
        title: 'Nodes: funções que transformam estado',
        body: 'Node é qualquer callable Python (sync ou async) que recebe estado e retorna dict com patch. Pode chamar LLM, executar tool, consultar banco. O grafo aplica o reducer para cada campo retornado.',
        code: `from langchain_anthropic import ChatAnthropic

llm = ChatAnthropic(model="claude-3-5-sonnet-20241022")

def reason_node(state: AgentState) -> dict:
    response = llm.invoke(state["messages"])
    return {"messages": [response]}  # add_messages vai adicionar ao array

def tool_node(state: AgentState) -> dict:
    last_msg = state["messages"][-1]
    # executa tool calls do último AI message
    results = execute_tools(last_msg.tool_calls)
    return {"messages": results, "step_count": state["step_count"] + 1}

graph_builder.add_node("reason", reason_node)
graph_builder.add_node("tools", tool_node)`,
      },
      {
        title: 'Conditional edges: decisões de fluxo',
        body: 'Conditional edge é uma função que recebe estado e retorna string com o nome do próximo node. Permite loops (reason → tools → reason), branching, e condição de saída. Você registra com <code>add_conditional_edges</code> e um mapeamento de string → node name.',
        code: `def should_use_tool(state: AgentState) -> str:
    last_message = state["messages"][-1]
    if hasattr(last_message, "tool_calls") and last_message.tool_calls:
        return "use_tool"
    return "finish"

graph_builder.add_conditional_edges(
    "reason",
    should_use_tool,
    {"use_tool": "tools", "finish": END}
)
graph_builder.add_edge("tools", "reason")  # loop de volta
graph_builder.add_edge(START, "reason")

graph = graph_builder.compile()`,
      },
      {
        title: 'Checkpointer: persistência e replay',
        body: 'Checkpointer salva o estado completo após cada step. Em dev: MemorySaver (in-process). Em produção: SqliteSaver ou PostgresSaver. O thread_id no config identifica a sessão — permite retomar a mesma conversa após reinício do processo.',
        code: `from langgraph.checkpoint.memory import MemorySaver
# from langgraph.checkpoint.sqlite import SqliteSaver  # produção

checkpointer = MemorySaver()
graph = graph_builder.compile(checkpointer=checkpointer)

config = {"configurable": {"thread_id": "user-session-abc123"}}

# Primeiro invoke
result = graph.invoke({"messages": [("user", "Qual o clima hoje?")]}, config)

# Segundo invoke na mesma sessão — estado anterior é carregado
result2 = graph.invoke({"messages": [("user", "E amanhã?")]}, config)

# Ver estado atual da sessão
state = graph.get_state(config)
print(state.values["messages"])`,
      },
      {
        title: 'Human-in-the-loop: interrupt e resume',
        body: 'Compile com <code>interrupt_before=["node_name"]</code>. Quando o grafo chegar nesse node, para antes de executá-lo e retorna o estado atual. O código cliente mostra ao humano, que aprova (<code>invoke(None, config)</code>) ou injeta correção (<code>update_state</code>) antes de retomar.',
        code: `graph = graph_builder.compile(
    checkpointer=checkpointer,
    interrupt_before=["send_email"]  # para antes de enviar
)

config = {"configurable": {"thread_id": "task-xyz"}}

# Roda até o interrupt
snapshot = graph.invoke(input, config)
# → retorna estado com pending action

# Usuário revisa e aprova
graph.invoke(None, config)  # retoma de onde parou

# Ou: usuário edita o estado antes de retomar
graph.update_state(config, {"email_body": "Versão corrigida..."})
graph.invoke(None, config)`,
      },
      {
        title: 'Memória de longo prazo com BaseStore',
        body: 'Checkpointer salva estado por thread (curto prazo, apagado por sessão). BaseStore é um KV store persistente, compartilhado entre threads. Você salva fatos importantes (nome do usuário, preferências, contexto de projeto) e carrega no início de cada sessão.',
        code: `from langgraph.store.memory import InMemoryStore
# Em produção: usar PostgresStore ou Redis

store = InMemoryStore()

def memory_node(state: AgentState, store=store) -> dict:
    user_id = state["user_id"]
    namespace = ("memories", user_id)

    # Carrega memórias existentes
    existing = store.search(namespace)

    # Usa LLM para extrair novos fatos da conversa
    new_facts = extract_facts(state["messages"])

    # Salva novos fatos
    for fact in new_facts:
        store.put(namespace, fact["key"], {"content": fact["value"]})

    return {"context": [m.value for m in existing]}`,
      },
      {
        title: 'Streaming: updates por node e tokens',
        body: 'LangGraph suporta dois modos de stream: <code>updates</code> (cada node que completou + patch retornado) e <code>messages</code> (tokens de LLMs dentro dos nodes). Útil para UX responsiva em produção.',
        code: `# Stream de updates por node
for chunk in graph.stream({"messages": [("user", "Pesquise X")]}, config):
    for node_name, node_output in chunk.items():
        print(f"Node '{node_name}' retornou: {node_output}")

# Stream de tokens (requer streaming_mode="messages")
for msg, metadata in graph.stream(input, config, stream_mode="messages"):
    if msg.type == "AIMessageChunk":
        print(msg.content, end="", flush=True)`,
      },
      {
        title: 'Subgraphs: modularidade',
        body: 'Um node pode ser outro StateGraph compilado. O subgraph pode ter seu próprio estado, ou compartilhar campos com o pai por convenção de nome. Útil para isolar lógica complexa (ex: node de "web research" que internamente tem reason/search/summarize).',
        code: `# Subgraph interno
class ResearchState(TypedDict):
    query: str
    results: list

research_graph = StateGraph(ResearchState)
research_graph.add_node("search", search_node)
research_graph.add_node("summarize", summarize_node)
research_graph.add_edge(START, "search")
research_graph.add_edge("search", "summarize")
research_graph.add_edge("summarize", END)
compiled_research = research_graph.compile()

# No grafo pai, usa o subgraph como node
parent_graph.add_node("research", compiled_research)`,
      },
      {
        title: 'Padrão ReAct (Reason + Act)',
        body: 'O padrão mais comum: node reason (LLM decide) → conditional edge → node act (executa tool) → volta para reason. Loop até que LLM decida que tem a resposta. LangGraph tem <code>create_react_agent</code> que cria esse grafo automaticamente.',
        code: `from langgraph.prebuilt import create_react_agent
from langchain_anthropic import ChatAnthropic

llm = ChatAnthropic(model="claude-3-5-sonnet-20241022")
tools = [search_tool, calculator_tool]

# Cria ReAct agent com 1 linha
agent = create_react_agent(llm, tools, checkpointer=MemorySaver())

result = agent.invoke(
    {"messages": [("user", "Qual o PIB do Brasil em 2024?")]},
    config={"configurable": {"thread_id": "t1"}}
)`,
      },
    ],
    gotchas: [
      'Estado vazando entre runs por reducer errado — usar append (add_messages) quando deveria ser replace faz o array crescer indefinidamente entre sessões. Revise os reducers de cada campo.',
      'Esquecer fallback no conditional_edge — se a função retorna string não mapeada no dict de edges, o grafo levanta KeyError silenciosamente. Sempre inclua fallback para END.',
      'Loop infinito sem condição de saída — agente que sempre chama tools sem checar "tenho resposta suficiente?" roda até token limit. Use contador de steps no estado ou max_iterations.',
      'Subir para produção sem checkpointer — se o processo cai, toda a sessão é perdida. SqliteSaver ou PostgresSaver são obrigatórios em produção.',
      'Confundir LangGraph com LangChain — LangChain é sobre integração (chains, retrievers, prompts). LangGraph é sobre fluxo de controle e estado de agentes. São complementares, não alternativos.',
      'Misturar nodes síncronos e async no mesmo grafo — LangGraph suporta os dois, mas você precisa compilar com modo correto. Em async, use ainvoke/astream.',
      'Não usar thread_id — sem thread_id no config, cada invoke é uma sessão nova mesmo com checkpointer. Sempre passe {"configurable": {"thread_id": id_unico}}.',
      'Subgraph com estado incompatível — o subgraph precisa ter os mesmos campos de input/output que o node pai espera, ou usar transformação explícita.',
      'Esquecer que update_state não executa nodes — chama update_state para modificar o estado antes de retomar, mas não dispara nenhum node. Só o próximo invoke faz isso.',
      'Usar LangGraph para workflows simples — se o fluxo é linear e não tem estado complexo, LangGraph é overkill. Use LangChain LCEL ou código direto.',
    ],
    interview: [
      {
        q: 'Por que LangGraph em vez de LangChain puro ou implementação própria?',
        a: '<p>LangChain LCEL usa chains com callbacks e runnables — bom para prototipo, mas difícil de debugar em produção porque o fluxo é implícito. Implementação própria (while loop + if/else) é viável mas você reinventa checkpointing, streaming e observabilidade.</p><p>LangGraph dá: <strong>estado explícito</strong> (você vê o grafo), <strong>checkpointer</strong> (pause/resume), <strong>streaming nativo</strong> (updates por node), <strong>integração com LangSmith</strong>. Em produção, isso economiza semanas de trabalho.</p>',
        level: 'pleno',
        tip: 'Mencione "estado explícito + checkpointer como diferenciais chave". Esses são os dois motivos mais fortes.',
      },
      {
        q: 'Explique o ciclo de vida de um invoke no LangGraph.',
        a: '<p>Quando você chama <code>graph.invoke(input, config)</code>:</p><ol><li>Checkpointer carrega estado do thread_id (se existente).</li><li>Aplica o input como patch no estado.</li><li>Executa o primeiro node (START edge).</li><li>Após cada node, aplica reducer nos campos retornados.</li><li>Checkpointer persiste o estado.</li><li>Conditional edge decide próximo node.</li><li>Repete até chegar em END ou interrupt.</li><li>Retorna estado final.</li></ol>',
        level: 'pleno',
        tip: 'A sequência "checkpointer load → node → reducer → checkpointer save → edge" é o loop fundamental.',
      },
      {
        q: 'Como funciona o human-in-the-loop no LangGraph?',
        a: '<p>Compile com <code>interrupt_before=["node_name"]</code>. Quando o grafo chegar nesse node:</p><ol><li>Para antes de executar o node.</li><li>Persiste estado via checkpointer.</li><li>Retorna para o chamador.</li></ol><p>O cliente mostra o estado ao usuário. Para retomar: <code>graph.invoke(None, config)</code> com o mesmo thread_id — carrega do checkpointer e continua. Para editar antes: <code>graph.update_state(config, patch)</code> antes do invoke.</p>',
        level: 'pleno',
        tip: 'Enfatize "mesmo thread_id" — é o que conecta o resume à sessão pausada.',
      },
      {
        q: 'Qual a diferença entre reducer replace e append? Quando usar cada um?',
        a: '<p><strong>Replace</strong> (padrão): o valor novo sobrescreve o antigo. Use para campos escalares: contador de steps, status atual, resposta final.</p><p><strong>Append</strong> (via Annotated + add_messages): o valor novo é adicionado ao array. Use para histórico de mensagens, lista de resultados acumulados.</p><p>Erro clássico: usar append em campos de status — você acumula histórico de valores quando deveria ter só o último.</p>',
        level: 'pleno',
        tip: 'Pergunte "esse campo é histórico ou estado atual?" — histórico → append, estado atual → replace.',
      },
      {
        q: 'Como você implementa memória de longo prazo em LangGraph?',
        a: '<p>Duas camadas:</p><ul><li><strong>Thread state (curto prazo)</strong>: mensagens da sessão, persistido pelo checkpointer. Apagado ou acumulado por thread_id.</li><li><strong>BaseStore (longo prazo)</strong>: KV store compartilhado entre threads. Você salva fatos com namespace (ex: ("user_memories", user_id)) e key.</li></ul><p>Pattern: no início do grafo, node de memory fetch busca fatos relevantes da store; no fim, node de memory save extrai novos fatos e persiste. Outros threads do mesmo usuário leem os mesmos fatos.</p>',
        level: 'senior',
        tip: 'A separação thread_state (efêmero) vs BaseStore (persistente entre sessões) é o ponto central.',
      },
      {
        q: 'Como você faz streaming em LangGraph e por que importa para UX?',
        a: '<p>Dois modos:</p><ul><li><strong>stream_mode="updates"</strong>: emite um chunk por node que completa, com o patch retornado. Permite mostrar "agent está pesquisando..." etc.</li><li><strong>stream_mode="messages"</strong>: emite tokens individuais de LLMs dentro dos nodes. Permite streaming de texto como ChatGPT.</li></ul><p>Para UX: sem streaming, usuário vê tela em branco enquanto agente processa (pode ser 30s). Com streaming, usuário vê progresso em tempo real — reduz abandono e frustração.</p>',
        level: 'pleno',
        tip: 'Mencione os dois modos pelo nome — mostra que você conhece a API.',
      },
      {
        q: 'Qual a diferença entre supervisor e swarm? Quando usar cada um?',
        a: '<p><strong>Supervisor</strong>: um node central (LLM) decide qual agente chamar, via tool_call. Agentes são subgraphs. Retorno sempre volta ao supervisor. Mais previsível, mais auditável, mais fácil de debugar. Bom para workflows estruturados com papéis claros (search agent, code agent, write agent).</p><p><strong>Swarm</strong>: cada agente pode fazer handoff para qualquer outro. Fluxo emergente. Mais flexível, mas imprevisível — pode loopar, difícil de debugar. Bom para colaboração aberta entre especialistas.</p><p>Regra prática: comece com supervisor. Migre para swarm se os papéis são verdadeiramente dinâmicos.</p>',
        level: 'senior',
        tip: 'langgraph-supervisor e langgraph-swarm são pacotes PyPI separados com implementações prontas.',
      },
      {
        q: 'Como você debugaria um agente LangGraph em produção que está tomando decisões erradas?',
        a: '<p>Quatro ferramentas:</p><ul><li><strong>LangSmith trace</strong>: cada invoke gera trace completo — qual node rodou, input/output, latência, tokens. Você vê exatamente onde o modelo tomou a decisão errada.</li><li><strong>Checkpointer replay</strong>: carrega o estado exato da sessão problemática e re-executa manualmente.</li><li><strong>Stream mode "updates"</strong>: em dev, roda com streaming para ver cada node em tempo real.</li><li><strong>graph.get_state_history(config)</strong>: lista todos os snapshots de estado de uma sessão, permite navegar no tempo.</li></ul>',
        level: 'senior',
        tip: 'get_state_history é pouco conhecido — mencionar impressiona.',
      },
      {
        q: 'Como você previne loops infinitos em agentes LangGraph?',
        a: '<p>Três abordagens:</p><ul><li><strong>Contador de steps no estado</strong>: incrementa a cada node, conditional edge retorna END se > max_steps.</li><li><strong>Condição de saída clara</strong>: o LLM deve ter instrução explícita de quando parar (ex: "quando tiver a resposta, não chame mais tools").</li><li><strong>recursion_limit no compile</strong>: <code>graph.compile(recursion_limit=25)</code> levanta erro após N steps.</li></ul><p>Em produção, combine contador de steps com recursion_limit como fallback.</p>',
        level: 'pleno',
        tip: 'Mencionar recursion_limit mostra conhecimento da API avançada.',
      },
      {
        q: 'Como você usa subgraphs para modularidade?',
        a: '<p>Um node pode ser um StateGraph compilado. O subgraph tem seu próprio estado (TypedDict). Para comunicar com o grafo pai, você pode: (a) compartilhar campos por nome (o framework faz a transformação) ou (b) expor funções de input/output explícitas no subgraph.</p><p>Caso de uso: node "research" que internamente faz search → evaluate → summarize, mas para o pai é apenas um node que recebe query e retorna summary. Isso isola a complexidade interna.</p>',
        level: 'senior',
      },
      {
        q: 'Qual o overhead do checkpointer em produção?',
        a: '<p>MemorySaver: zero overhead de I/O, mas in-process — perde tudo se processo reinicia. SQLiteSaver: latência de arquivo (1-5ms por step). PostgresSaver: latência de rede (5-20ms por step).</p><p>Para agentes com steps de 1-10s (LLM call), o overhead do checkpointer é desprezível (< 1%). O custo vale pelo que você ganha: observabilidade, resume e human-in-the-loop.</p>',
        level: 'senior',
        tip: 'Comparar percentual do overhead vs latência do LLM call é a análise correta.',
      },
      {
        q: 'Como você testa um grafo LangGraph?',
        a: '<p>Três níveis:</p><ul><li><strong>Unit</strong>: testa cada node isoladamente, passando estado mock. Não precisa compilar o grafo.</li><li><strong>Integration</strong>: compila grafo com MemorySaver e invoca com inputs reais, verificando o estado final.</li><li><strong>E2E</strong>: roda o agente completo via LangSmith test suite com eval set anotado.</li></ul><p>Mock de LLM: use <code>FakeListChatModel</code> do LangChain para respostas determinísticas nos unit tests.</p>',
        level: 'pleno',
        tip: 'FakeListChatModel é a chave para unit tests determinísticos de agentes.',
      },
      {
        q: 'Como você implementaria um agente de code review com LangGraph?',
        a: '<p>Design:</p><ol><li><strong>Estado</strong>: messages, pr_diff, review_comments, approved: bool.</li><li><strong>Nodes</strong>: fetch_pr (tool: GitHub API), analyze_code (LLM: analisa diff), check_security (LLM: verifica vulnerabilidades), write_review (LLM: compõe revisão final).</li><li><strong>Edges</strong>: START → fetch_pr → analyze_code → check_security → write_review. Conditional antes de write_review: se issues críticos encontrados, interrupt_before para human review.</li><li><strong>Checkpointer</strong>: PostgresSaver com thread_id = PR number.</li><li><strong>Human-in-the-loop</strong>: interrupt_before=["post_review"] para revisão final antes de publicar.</li></ol>',
        level: 'senior',
      },
      {
        q: 'Como LangGraph Platform difere do LangGraph open source?',
        a: '<p><strong>Open source</strong>: o framework em si. Você gerencia infraestrutura, checkpointer, deploy.</p><p><strong>LangGraph Platform</strong> (pago): infraestrutura gerenciada com: threads persistentes em banco, scheduler (agentes que rodam periodicamente), double-texting handling (usuário manda segunda mensagem antes da primeira terminar), deploy com API REST automática, painel de monitoramento.</p><p>É o equivalente ao Vercel para Next.js — você usa o framework open source, mas a plataforma gerencia a infra em torno.</p>',
        level: 'senior',
        tip: '"Double-texting handling" é um diferencial raro de mencionar — mostra que você leu a documentação com atenção.',
      },
      {
        q: 'Como você gerencia erros em nodes LangGraph?',
        a: '<p>Três estratégias:</p><ul><li><strong>Try/except dentro do node</strong>: captura erro, salva no estado (ex: <code>error: str</code>), conditional edge decide se retry ou fallback.</li><li><strong>Retry automático</strong>: compile com <code>retry_policy=RetryPolicy(max_attempts=3)</code> — reexecuta o node em caso de exceção.</li><li><strong>Fallback edge</strong>: se node falha após retries, edge para node de "error recovery" que notifica usuário ou usa modelo alternativo.</li></ul>',
        level: 'senior',
        tip: 'RetryPolicy é API pouco conhecida — boa para impressionar entrevistadores técnicos.',
      },
      {
        q: 'Como você migraria um pipeline LangChain para LangGraph?',
        a: '<p>Passos:</p><ol><li>Identifique o "estado" implícito da chain (mensagens, contextos, resultados intermediários) → vira TypedDict.</li><li>Cada etapa da chain vira um node.</li><li>Decisões condicionais (if/else no código) viram conditional edges.</li><li>Adicione checkpointer desde o início — grátis em termos de esforço, enorme em termos de observabilidade.</li><li>Use LangSmith para comparar traces antes e depois.</li></ol><p>O maior benefício da migração é observabilidade + a possibilidade de adicionar human-in-the-loop depois.</p>',
        level: 'senior',
      },
      {
        q: 'Explique o padrão ReAct e como LangGraph o implementa.',
        a: '<p>ReAct (Reason + Act): o LLM alterna entre raciocinar (decidir o que fazer) e agir (chamar tool). Loop até ter resposta final.</p><p>Em LangGraph:</p><ol><li>Node reason: LLM gera AIMessage com tool_calls (se precisa de tool) ou resposta final (se tem a resposta).</li><li>Conditional edge: se tool_calls → node tools; se não → END.</li><li>Node tools: executa tool calls, retorna ToolMessages.</li><li>Edge: tools → reason (loop).</li></ol><p><code>create_react_agent(llm, tools)</code> cria esse grafo automaticamente. Você customiza quando precisa de estado extra ou nodes adicionais.</p>',
        level: 'pleno',
        tip: 'create_react_agent é o ponto de entrada mais comum — mas saber o grafo por baixo diferencia candidatos.',
      },
      {
        q: 'Como você faz deploy de um agente LangGraph em produção (sem a plataforma)?',
        a: '<p>Stack típica:</p><ul><li><strong>FastAPI</strong>: API REST que recebe input do usuário, invoca grafo, retorna streaming response.</li><li><strong>PostgresSaver</strong>: checkpointer em banco persistente.</li><li><strong>LangSmith</strong>: observabilidade (LANGCHAIN_TRACING_V2=true).</li><li><strong>Docker + Kubernetes</strong>: deploy stateless — o estado fica no banco, não no processo.</li><li><strong>Redis</strong>: para InMemoryStore de longo prazo com persistência.</li></ul><p>Ponto crítico: o processo é stateless, o banco é o estado. Isso permite escalar horizontalmente.</p>',
        level: 'senior',
        tip: '"Processo stateless, banco é o estado" é a insight chave para escalar agentes.',
      },
      {
        q: 'Como você limita o contexto de mensagens para não explodir o context window?',
        a: '<p>Três abordagens:</p><ul><li><strong>Trim messages</strong>: use <code>trim_messages(messages, max_tokens=2000, strategy="last")</code> — mantém as N últimas mensagens.</li><li><strong>Summarize memory</strong>: node periódico que resume as mensagens antigas em uma mensagem de summary, descarta as detalhadas.</li><li><strong>Filter messages</strong>: mantém só HumanMessages e AIMessages recentes, descarta ToolMessages antigas.</li></ul><p>O pattern mais robusto: summarize + últimas N mensagens. O summary carrega contexto histórico, as mensagens recentes carregam detalhe.</p>',
        level: 'senior',
        tip: 'Mencionar trim_messages (função oficial) mostra que você conhece as utils do LangChain.',
      },
      {
        q: 'Como você implementaria rate limiting e quota de usuário em um agente LangGraph?',
        a: '<p>Node de validação no início do grafo:</p><ol><li>Node check_quota: busca uso do usuário no Redis (ou DB), verifica se excedeu limite. Se sim: retorna estado com error="quota_exceeded", conditional edge vai para END.</li><li>Node track_usage: após execução, incrementa contador do usuário.</li></ol><p>Para custo de tokens: LangSmith rastreia tokens por trace. Você pode adicionar callback que acumula usage no estado e salva no DB ao final.</p>',
        level: 'senior',
      },
    ],
    mnemonics: [
      {
        label: 'SNEC — Blocos fundamentais do LangGraph',
        trick: 'S-N-E-C: "State, Nodes, Edges, Checkpointer"',
        explanation: 'Os quatro pilares: (S)tate é o TypedDict com reducers, (N)odes são funções que transformam estado, (E)dges são transições (fixas ou condicionais), (C)heckpointer persiste estado e habilita pause/resume.',
      },
      {
        label: 'RAA — Reducers: Replace vs Append',
        trick: 'Histórico → Append (add_messages). Atual → Replace (padrão).',
        explanation: '"R-A-A: Replace para Atual, Append para Acumulado." Se o campo guarda histórico (mensagens, resultados), use Annotated + add_messages. Se guarda estado atual (step_count, status, resposta final), deixe sem annotation (replace).',
      },
      {
        label: 'PIR — Human-in-the-Loop',
        trick: 'P-I-R: "Pause, Inspect, Resume"',
        explanation: 'O ciclo do human-in-the-loop: (P)ause com interrupt_before, (I)nspect o estado com get_state, (R)esume com invoke(None, config) usando o mesmo thread_id. Se quiser editar antes de retomar: update_state antes do invoke.',
      },
    ],
    cheatsheet: {
      title: 'LangGraph — Cheatsheet',
      html: `<div style="background:#0f1a1a;border-radius:12px;padding:20px;font-family:monospace;font-size:11px;color:#e2e8f0;max-width:900px">
  <div style="text-align:center;background:#4ade80;color:#0f1a1a;font-weight:700;font-size:14px;margin-bottom:16px;padding:8px;border-radius:6px">LANGGRAPH CHEATSHEET</div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
    <div style="background:#0d1117;border-radius:8px;padding:12px;border-top:3px solid #4ade80">
      <div style="color:#4ade80;font-weight:700;margin-bottom:8px">ESTADO</div>
      <div style="color:#e2e8f0">TypedDict com reducers</div>
      <div style="color:#94a3b8">Annotated + add_messages → append</div>
      <div style="color:#94a3b8">campo simples → replace</div>
      <div style="color:#6ee7b7;margin-top:6px;font-size:10px">StateGraph(MyState)</div>
    </div>
    <div style="background:#0d1117;border-radius:8px;padding:12px;border-top:3px solid #60a5fa">
      <div style="color:#60a5fa;font-weight:700;margin-bottom:8px">NODES</div>
      <div style="color:#94a3b8">fn(state) → dict (patch)</div>
      <div style="color:#94a3b8">sync ou async</div>
      <div style="color:#6ee7b7;margin-top:6px;font-size:10px">graph.add_node("name", fn)</div>
      <div style="color:#6ee7b7;font-size:10px">graph.add_edge(START, "name")</div>
    </div>
    <div style="background:#0d1117;border-radius:8px;padding:12px;border-top:3px solid #fbbf24">
      <div style="color:#fbbf24;font-weight:700;margin-bottom:8px">EDGES</div>
      <div style="color:#94a3b8">Fixo: add_edge(A, B)</div>
      <div style="color:#94a3b8">Condicional: fn(state) → str</div>
      <div style="color:#6ee7b7;margin-top:6px;font-size:10px">add_conditional_edges(</div>
      <div style="color:#6ee7b7;font-size:10px">&nbsp;&nbsp;"src", fn, {"x": "node"})</div>
    </div>
    <div style="background:#0d1117;border-radius:8px;padding:12px;border-top:3px solid #a78bfa">
      <div style="color:#a78bfa;font-weight:700;margin-bottom:8px">CHECKPOINTER</div>
      <div style="color:#94a3b8">MemorySaver — dev</div>
      <div style="color:#94a3b8">SqliteSaver — pequeno prod</div>
      <div style="color:#94a3b8">PostgresSaver — prod</div>
      <div style="color:#6ee7b7;font-size:10px">config = {configurable: {thread_id}}</div>
    </div>
    <div style="background:#0d1117;border-radius:8px;padding:12px;border-top:3px solid #f87171">
      <div style="color:#f87171;font-weight:700;margin-bottom:8px">HUMAN-IN-THE-LOOP</div>
      <div style="color:#94a3b8">compile(interrupt_before=["n"])</div>
      <div style="color:#94a3b8">invoke(None, config) — resume</div>
      <div style="color:#94a3b8">update_state(config, patch)</div>
      <div style="color:#94a3b8">get_state(config)</div>
    </div>
    <div style="background:#0d1117;border-radius:8px;padding:12px;border-top:3px solid #34d399">
      <div style="color:#34d399;font-weight:700;margin-bottom:8px">MULTI-AGENTE</div>
      <div style="color:#94a3b8">Supervisor: LLM central decide</div>
      <div style="color:#94a3b8">Swarm: handoff peer-to-peer</div>
      <div style="color:#6ee7b7;font-size:10px">pip install langgraph-supervisor</div>
      <div style="color:#6ee7b7;font-size:10px">pip install langgraph-swarm</div>
    </div>
  </div>
  <div style="margin-top:10px;background:#0d1117;border-radius:6px;padding:10px;font-size:10px">
    <span style="color:#4ade80;font-weight:700">Debug</span>: <span style="color:#94a3b8">LangSmith trace | get_state_history | stream(mode="updates") | FakeListChatModel nos testes</span>
  </div>
</div>`,
      caption: 'SNEC = State + Nodes + Edges + Checkpointer. PIR = Pause + Inspect + Resume (human-in-the-loop).',
    },
    mindmap: {
      title: 'LangGraph — Mapa Mental Completo',
      html: `<div style="background:#0f1a1a;border-radius:12px;padding:24px;font-family:sans-serif;font-size:12px;color:#e2e8f0;max-width:900px">
  <div style="text-align:center;margin-bottom:20px">
    <div style="background:#4ade80;color:#0f1a1a;border-radius:50px;padding:10px 28px;display:inline-block;font-weight:700;font-size:15px;letter-spacing:1px">LANGGRAPH</div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
    <div style="background:#0d1117;border-radius:10px;padding:14px;border-left:4px solid #4ade80">
      <div style="color:#4ade80;font-weight:700;margin-bottom:8px">NÚCLEO (SNEC)</div>
      <div style="color:#94a3b8;font-size:11px">State: TypedDict + reducers</div>
      <div style="color:#94a3b8;font-size:11px">Nodes: fn(state) → patch</div>
      <div style="color:#94a3b8;font-size:11px">Edges: fixos ou condicionais</div>
      <div style="color:#94a3b8;font-size:11px">Checkpointer: persiste estado</div>
    </div>
    <div style="background:#0d1117;border-radius:10px;padding:14px;border-left:4px solid #fbbf24">
      <div style="color:#fbbf24;font-weight:700;margin-bottom:8px">HUMAN-IN-THE-LOOP</div>
      <div style="color:#94a3b8;font-size:11px">interrupt_before=[node]</div>
      <div style="color:#94a3b8;font-size:11px">invoke(None, config) resume</div>
      <div style="color:#94a3b8;font-size:11px">update_state antes de resume</div>
      <div style="color:#94a3b8;font-size:11px">PIR: Pause Inspect Resume</div>
    </div>
    <div style="background:#0d1117;border-radius:10px;padding:14px;border-left:4px solid #a78bfa">
      <div style="color:#a78bfa;font-weight:700;margin-bottom:8px">MEMÓRIA</div>
      <div style="color:#94a3b8;font-size:11px">Thread state: por sessão</div>
      <div style="color:#94a3b8;font-size:11px">BaseStore: entre sessões</div>
      <div style="color:#94a3b8;font-size:11px">Checkpointer: MemorySaver/PG</div>
    </div>
    <div style="background:#0d1117;border-radius:10px;padding:14px;border-left:4px solid #60a5fa">
      <div style="color:#60a5fa;font-weight:700;margin-bottom:8px">MULTI-AGENTE</div>
      <div style="color:#94a3b8;font-size:11px">Supervisor: central decide</div>
      <div style="color:#94a3b8;font-size:11px">Swarm: handoff peer</div>
      <div style="color:#94a3b8;font-size:11px">Subgraphs: modularidade</div>
    </div>
    <div style="background:#0d1117;border-radius:10px;padding:14px;border-left:4px solid #34d399">
      <div style="color:#34d399;font-weight:700;margin-bottom:8px">STREAMING</div>
      <div style="color:#94a3b8;font-size:11px">updates: por node completo</div>
      <div style="color:#94a3b8;font-size:11px">messages: tokens de LLM</div>
      <div style="color:#94a3b8;font-size:11px">astream para async</div>
    </div>
    <div style="background:#0d1117;border-radius:10px;padding:14px;border-left:4px solid #f87171">
      <div style="color:#f87171;font-weight:700;margin-bottom:8px">DEBUG</div>
      <div style="color:#94a3b8;font-size:11px">LangSmith: trace por step</div>
      <div style="color:#94a3b8;font-size:11px">get_state_history: time travel</div>
      <div style="color:#94a3b8;font-size:11px">FakeListChatModel: unit test</div>
      <div style="color:#94a3b8;font-size:11px">recursion_limit: anti-loop</div>
    </div>
  </div>
</div>`,
      caption: 'SNEC (State/Nodes/Edges/Checkpointer) + PIR (Pause/Inspect/Resume) são os dois mnemônicos centrais.',
    },
    exercises: [
      {
        level: 'iniciante',
        title: 'Agente ReAct mínimo',
        description: 'Crie um agente ReAct com LangGraph que usa duas tools: <code>calculate(expr: str)</code> (avalia expressão matemática) e <code>lookup_fact(topic: str)</code> (retorna string hardcoded com um fato). O agente deve responder perguntas que requerem cálculo ou consulta de fato. Adicione MemorySaver e teste com thread_id fixo para verificar que a sessão é retomada.',
        concepts: ['StateGraph', 'add_messages', 'conditional_edges', 'MemorySaver', 'tool calling'],
        hint: 'Use create_react_agent como ponto de partida. Depois, desmonte o grafo e reconstrua manualmente para entender cada peça.',
      },
      {
        level: 'intermediario',
        title: 'Pipeline de análise com human-in-the-loop',
        description: 'Construa um grafo de análise de código: (1) node fetch_code: lê arquivo Python passado como input; (2) node analyze: LLM analisa e gera lista de issues; (3) node review (interruptível): mostra issues ao usuário, que pode adicionar/remover antes de continuar; (4) node report: gera relatório final em Markdown. Implemente com SqliteSaver para persistência real entre execuções.',
        concepts: ['interrupt_before', 'update_state', 'SqliteSaver', 'get_state', 'subgraph'],
        hint: 'Use interrupt_before=["report"]. No review, list_state mostra o estado. O usuário pode chamar update_state(config, {"issues": lista_editada}) antes de invocar(None, config).',
        relatedKeypoints: [4, 5],
      },
      {
        level: 'senior',
        title: 'Sistema multi-agente supervisor com memória de longo prazo',
        description: 'Implemente um sistema de assistente de pesquisa com padrão supervisor: (1) Supervisor agent: decide qual especialista chamar; (2) Search agent: busca na web (mock); (3) Analysis agent: analisa resultados e extrai insights; (4) Writer agent: compõe resposta final. Adicione BaseStore para memória de longo prazo: o sistema deve lembrar de pesquisas anteriores do usuário. Implemente streaming em FastAPI com SSE. Inclua testes unitários para cada node usando FakeListChatModel.',
        concepts: ['langgraph-supervisor', 'BaseStore', 'FastAPI SSE', 'streaming', 'FakeListChatModel', 'PostgresSaver'],
        relatedKeypoints: [6, 7, 8],
      },
    ],
    codeExamples: [
      {
        title: 'Agente ReAct completo do zero (sem create_react_agent)',
        description: 'Implementação manual do padrão ReAct para entender cada componente.',
        language: 'python',
        code: `from typing import TypedDict, Annotated
from langchain_anthropic import ChatAnthropic
from langchain_core.tools import tool
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import ToolNode

# 1. Estado do agente
class AgentState(TypedDict):
    messages: Annotated[list, add_messages]

# 2. Tools
@tool
def search_web(query: str) -> str:
    """Busca informações na web sobre o query."""
    return f"[Resultado simulado para '{query}'] Python foi criado por Guido van Rossum em 1991."

@tool
def calculate(expr: str) -> str:
    """Avalia uma expressão matemática Python simples."""
    try:
        return str(eval(expr, {"__builtins__": {}}))
    except Exception as e:
        return f"Erro: {e}"

tools = [search_web, calculate]

# 3. LLM com tools vinculadas
llm = ChatAnthropic(model="claude-3-5-sonnet-20241022")
llm_with_tools = llm.bind_tools(tools)

# 4. Node de raciocínio
def reason_node(state: AgentState) -> dict:
    response = llm_with_tools.invoke(state["messages"])
    return {"messages": [response]}

# 5. Função condicional
def should_act(state: AgentState) -> str:
    last_msg = state["messages"][-1]
    if hasattr(last_msg, "tool_calls") and last_msg.tool_calls:
        return "act"
    return "end"

# 6. Construção do grafo
builder = StateGraph(AgentState)
builder.add_node("reason", reason_node)
builder.add_node("tools", ToolNode(tools))

builder.add_edge(START, "reason")
builder.add_conditional_edges("reason", should_act, {"act": "tools", "end": END})
builder.add_edge("tools", "reason")  # loop

# 7. Compile com checkpointer
agent = builder.compile(checkpointer=MemorySaver())

# 8. Uso
config = {"configurable": {"thread_id": "session-001"}}

for chunk in agent.stream(
    {"messages": [("user", "Quanto é 42 * 7? E quem criou Python?")]},
    config,
    stream_mode="updates"
):
    for node, output in chunk.items():
        print(f"[{node}]", output["messages"][-1].content[:100])`,
      },
      {
        title: 'Human-in-the-Loop: pause, review e resume',
        description: 'Pipeline com interrupt antes de executar ação crítica.',
        language: 'python',
        code: `from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.checkpoint.sqlite import SqliteSaver
import sqlite3

class WorkflowState(TypedDict):
    messages: Annotated[list, add_messages]
    draft_action: dict   # ação pendente de aprovação
    approved: bool

def analyze_node(state: WorkflowState) -> dict:
    """Analisa input e propõe uma ação."""
    # Em produção: LLM decide a ação
    return {
        "draft_action": {
            "type": "send_email",
            "to": "manager@company.com",
            "subject": "Relatório de anomalia",
            "body": "Anomalia detectada nos logs das 14h..."
        }
    }

def execute_node(state: WorkflowState) -> dict:
    """Executa a ação aprovada."""
    action = state["draft_action"]
    print(f"Executando: {action['type']} para {action['to']}")
    # Em produção: envia email real
    return {"messages": [("assistant", f"Ação executada: {action['type']}")]}

builder = StateGraph(WorkflowState)
builder.add_node("analyze", analyze_node)
builder.add_node("execute", execute_node)
builder.add_edge(START, "analyze")
builder.add_edge("analyze", "execute")
builder.add_edge("execute", END)

# Checkpoint real com SQLite
conn = sqlite3.connect("checkpoints.db", check_same_thread=False)
checkpointer = SqliteSaver(conn)

graph = builder.compile(
    checkpointer=checkpointer,
    interrupt_before=["execute"]  # para antes de executar
)

config = {"configurable": {"thread_id": "task-001"}}

# Primeira invocação: roda até o interrupt
print("--- Iniciando workflow ---")
graph.invoke({"messages": [], "draft_action": {}, "approved": False}, config)

# Ver o estado pausado
current_state = graph.get_state(config)
print("\\nAção proposta:", current_state.values["draft_action"])
print("Próximo node:", current_state.next)

# Simula revisão humana: edita a ação antes de aprovar
graph.update_state(config, {
    "draft_action": {**current_state.values["draft_action"], "body": "Corpo revisado pelo analista."}
})

# Resume
print("\\n--- Retomando após aprovação ---")
graph.invoke(None, config)  # resume do checkpoint`,
      },
      {
        title: 'Multi-agente Supervisor com subgraphs',
        description: 'Sistema supervisor que delega para agentes especializados.',
        language: 'python',
        code: `from typing import TypedDict, Annotated, Literal
from langchain_anthropic import ChatAnthropic
from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.checkpoint.memory import MemorySaver

class SharedState(TypedDict):
    messages: Annotated[list, add_messages]
    next_agent: str

llm = ChatAnthropic(model="claude-3-5-sonnet-20241022")

# --- Agentes especializados ---
def search_agent(state: SharedState) -> dict:
    """Agente de busca."""
    system = SystemMessage(content="Você é especialista em buscar e resumir informações.")
    response = llm.invoke([system] + state["messages"])
    return {"messages": [response]}

def analysis_agent(state: SharedState) -> dict:
    """Agente de análise."""
    system = SystemMessage(content="Você é especialista em análise crítica e identificação de padrões.")
    response = llm.invoke([system] + state["messages"])
    return {"messages": [response]}

# --- Supervisor ---
def supervisor_node(state: SharedState) -> dict:
    """Supervisor decide qual agente chamar ou se termina."""
    system = SystemMessage(content="""Você é supervisor. Decida o próximo passo:
- "search" para buscar informações
- "analyze" para analisar os resultados
- "finish" se a tarefa está completa
Responda APENAS com uma dessas palavras.""")

    response = llm.invoke([system] + state["messages"])
    decision = response.content.strip().lower()
    valid = {"search", "analyze", "finish"}
    next_agent = decision if decision in valid else "finish"
    return {"next_agent": next_agent}

def route_after_supervisor(state: SharedState) -> Literal["search", "analyze", "__end__"]:
    if state["next_agent"] == "finish":
        return "__end__"
    return state["next_agent"]

# --- Grafo ---
builder = StateGraph(SharedState)
builder.add_node("supervisor", supervisor_node)
builder.add_node("search", search_agent)
builder.add_node("analyze", analysis_agent)

builder.add_edge(START, "supervisor")
builder.add_conditional_edges("supervisor", route_after_supervisor)
builder.add_edge("search", "supervisor")    # volta ao supervisor
builder.add_edge("analyze", "supervisor")   # volta ao supervisor

graph = builder.compile(checkpointer=MemorySaver())

config = {"configurable": {"thread_id": "research-001"}}
result = graph.invoke(
    {"messages": [HumanMessage(content="Pesquise e analise as tendências de IA em 2025")], "next_agent": ""},
    config
)
print(result["messages"][-1].content)`,
      },
    ],
    videos: [
      {
        title: 'LangGraph — From Basics to Production',
        channel: 'LangChain',
        url: 'https://www.youtube.com/watch?v=R-o_a6dvzQM',
        topic: 'Tutorial oficial completo: StateGraph, checkpointer, human-in-the-loop',
      },
      {
        title: 'Build a LangGraph Agent from Scratch',
        channel: 'Sam Witteveen',
        url: 'https://www.youtube.com/watch?v=sBhK-2K9bUc',
        topic: 'Implementação prática do zero com nodes, edges e tools reais',
        note: 'Excelente para entender cada peça sem create_react_agent',
      },
      {
        title: 'LangGraph Multi-Agent Architecture',
        channel: 'LangChain',
        url: 'https://www.youtube.com/watch?v=hvAPnpSfSGo',
        topic: 'Supervisor, swarm e subgraphs em projetos reais',
      },
      {
        title: 'LangGraph in Production — Lessons Learned',
        channel: 'AI Engineer World Fair',
        url: 'https://www.youtube.com/watch?v=4KKhRxYj7VQ',
        topic: 'Cases reais: checkpointing, human-in-the-loop, observabilidade com LangSmith',
      },
      {
        title: 'Intro to LangGraph — LangChain Academy',
        channel: 'LangChain Academy',
        url: 'https://www.youtube.com/watch?v=29XNS0b21vw',
        topic: 'Curso oficial condensado: todas as features principais em 1h',
        note: 'Melhor ponto de partida absoluto se você nunca usou LangGraph',
      },
    ],
    resources: [
      { title: 'LangGraph — documentação oficial', url: 'https://langchain-ai.github.io/langgraph/', kind: 'docs' },
      { title: 'LangGraph — concepts (arquitetura detalhada)', url: 'https://langchain-ai.github.io/langgraph/concepts/', kind: 'docs' },
      { title: 'LangGraph — tutorials (passo a passo)', url: 'https://langchain-ai.github.io/langgraph/tutorials/', kind: 'docs' },
      { title: 'LangGraph — how-to guides', url: 'https://langchain-ai.github.io/langgraph/how-tos/', kind: 'docs' },
      { title: 'LangChain Academy — Intro to LangGraph (curso gratuito)', url: 'https://academy.langchain.com/courses/intro-to-langgraph', kind: 'curso' },
      { title: 'LangSmith docs (observabilidade)', url: 'https://docs.smith.langchain.com/', kind: 'docs' },
      { title: 'langgraph-supervisor (PyPI)', url: 'https://github.com/langchain-ai/langgraph-supervisor-py', kind: 'docs' },
      { title: 'langgraph-swarm (PyPI)', url: 'https://github.com/langchain-ai/langgraph-swarm-py', kind: 'docs' },
    ],
  }

export default langgraph

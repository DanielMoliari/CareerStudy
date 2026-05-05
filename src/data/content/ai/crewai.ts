import type { SkillContent } from '@/types'

const crewai: SkillContent = {
    tagline: 'Framework Python pra orquestrar múltiplos agentes especializados em "crew".',
    why: 'Popular em 2024-2025 pra prototipar squads de agentes. Saber comparar com LangGraph e identificar quando vale é diferencial.',
    summary: 'CrewAI define agentes (role, goal, backstory, tools), tasks (descrição + agente responsável) e crew (orquestra task list). Suporta processo sequencial e hierárquico (manager). Foco em produtividade — você descreve em linguagem natural, framework executa.',
    keypoints: [
      { title: 'Agent', body: 'role (titulo), goal (objetivo), backstory (persona), tools (lista). Cada agent é um LLM call com prompt construido.' },
      { title: 'Task', body: 'description, expected_output, agent (responsável), context (deps de outras tasks).' },
      { title: 'Crew', body: 'agents + tasks + process. Process sequential = ordem fixa; hierarchical = manager delega.' },
      { title: 'Tools', body: 'CrewAI Tools (busca web, file IO, scraping) + custom (decorator @tool). Compativel com LangChain tools.' },
      { title: 'Memory', body: 'Short-term (sessão), long-term (persistente), entity (sobre entidades). Chunk de texto + retrieval.' },
      { title: 'Human input', body: 'human_input=True numa task pausa pra revisao humana. Útil em workflow crítico.' },
      { title: 'Flows (novo)', body: 'CrewAI Flows trazem controle estilo state machine, similar a LangGraph. Misturando event-driven com crews.' },
      { title: 'Vs LangGraph', body: 'CrewAI é mais opinativo e rápido pra prototipar. LangGraph é mais low-level e flexível pra produção complexa.' },
    ],
    gotchas: [
      'Agentes descritivos (longo backstory) não melhoram qualidade — gastam tokens.',
      'Process hierarchical com manager LLM custa muito — cada delegação é outra chamada.',
      'Tools custom sem error handling fazem agente travar.',
      'Esquecer de definir expected_output — agente diverge do formato esperado.',
      'Comparar resultados sem eval set fixo — varia muito entre runs.',
      'Subir CrewAI direto em produção sem observability — debug fica impossivel.',
    ],
    interview: [
      { q: 'CrewAI vs LangGraph?', a: '<p><strong>CrewAI</strong>: alto nível, opinativo, prototipo rápido. Você descreve agentes e tasks; framework cuida de orquestracao.</p><p><strong>LangGraph</strong>: low-level, baseado em grafo de estado. Mais boilerplate mas controle total.</p><p>Pra POC e demos, CrewAI brilha. Pra produção com requisitos específicos (HITL, checkpoint, branching), LangGraph é melhor.</p>' },
      { q: 'Quais os tipos de processo em CrewAI?', a: '<p><strong>Sequential</strong>: tasks executam em ordem; output de uma vai pra context da próxima.</p><p><strong>Hierarchical</strong>: um manager LLM coordena; delega tasks pra agentes apropriados, válida output. Mais flexível mas mais caro.</p>' },
      { q: 'Como modelaria um time de pesquisa+escrita?', a: '<p>3 agentes:</p><ul><li><strong>Researcher</strong>: tools=web search, scrape. Goal=coletar fontes.</li><li><strong>Writer</strong>: tools=summarizer. Goal=escrever artigo.</li><li><strong>Editor</strong>: tools=spell check. Goal=revisar tom e gramatica.</li></ul><p>Process=sequential. Researcher feed Writer feed Editor.</p>' },
      { q: 'Quais riscos em produção?', a: '<ul><li>Custo não controlado (sem max_iterations).</li><li>Latência alta (varios LLM calls em série).</li><li>Debug difícil sem trace.</li><li>Quality drift sem eval automática.</li><li>Tools com side effects sem confirmação podem causar danos.</li></ul>' },
    ],
    resources: [
      { title: 'CrewAI docs', url: 'https://docs.crewai.com/', kind: 'docs' },
      { title: 'CrewAI Examples (GitHub)', url: 'https://github.com/crewAIInc/crewAI-examples', kind: 'docs' },
      { title: 'CrewAI Flows', url: 'https://docs.crewai.com/concepts/flows', kind: 'docs' },
    ],
  }

export default crewai

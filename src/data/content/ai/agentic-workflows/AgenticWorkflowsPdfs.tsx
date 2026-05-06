'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'
import { buildComparativeRefPdf } from '@/components/pdfs/ComparativeRefPdf'
import type { CompOption, CompCriterion } from '@/components/pdfs/ComparativeRefPdf'
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'
import type { PatternItem } from '@/components/pdfs/CheatsheetPdf'

// ── Paleta Agentic Workflows ─────────────────────────────────────────────────
const C = '#F59E0B'

// ── Metadados dos PDFs ────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas de agentes mais cobradas em entrevista sênior',
    type: 'qa',
    pages: 8,
    description: 'Loop ReAct, tool use, topologias multi-agente, memória, human-in-the-loop, observabilidade, padrões de raciocínio e anti-patterns — tudo que diferencia quem implementou de quem só sabe o conceito.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: 'Truques para memorizar padrões, siglas e decisões',
    type: 'mnemonics',
    pages: 2,
    description: 'ReAct, MAPE-K, tipos de memória, stop conditions e regra de ouro do multi-agente — âncoras cognitivas que grudam antes da entrevista.',
    icon: '02',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'comparative',
    title: 'Frameworks Comparados',
    subtitle: 'LangChain vs LangGraph vs CrewAI vs OpenAI Assistants vs SDK puro',
    type: 'comparative',
    pages: 3,
    description: 'Tabela com 6 critérios — abstração, controle, multi-agente, observabilidade, lock-in e maturidade — com cenário recomendado para cada framework.',
    icon: '03',
    goal: 'Decisão arquitetural',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns',
    subtitle: 'Os erros que destroem agentes em produção — com correção',
    type: 'antipatterns',
    pages: 3,
    description: 'Loop infinito, ação irreversível sem aprovação, tool sem validação, context overflow e falta de observabilidade — com código errado vs correto.',
    icon: '04',
    goal: 'Code review',
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet de Padrões',
    subtitle: 'ReAct, CoT, ToT, Reflexion, MAPE-K — referência rápida',
    type: 'cheatsheet',
    pages: 2,
    description: 'Todos os padrões de raciocínio e arquitetura agentic numa folha densa: quando usar cada um, custo relativo e sinal de quando trocar.',
    icon: '05',
    goal: 'Consulta rápida',
  },
]

// ── Q&A Review ────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    q: 'O que é o loop ReAct e por que é o padrão central de agentes?',
    a: 'ReAct (Reason + Act) é o padrão onde o LLM intercala raciocínio (CoT interno) com ações (tool calls). Em cada turno: o modelo pensa "o que preciso fazer?", emite tool_call, você executa, o resultado volta como observação, e o loop repete. É o padrão central porque combina raciocínio simbólico com execução de ações reais. Diferente de chain (passos fixos), o agente decide o próximo passo com base no estado atual. Base de LangGraph, OpenAI Agents SDK e Anthropic tool use.',
    level: 'Pleno',
    tip: 'Explique a diferença entre chain (determinístico) e agente (adaptativo). Citar o paper Yao et al. 2022 mostra que você foi além do tutorial.',
  },
  {
    q: 'Como funciona o tool use na Anthropic API? O que o LLM realmente executa?',
    a: 'O LLM NUNCA executa código diretamente. O modelo recebe o schema das tools (name, description, input_schema) e quando decide chamar uma, retorna stop_reason="tool_use" com um JSON estruturado (tool_call com name e input). É SUA aplicação que lê esse JSON, executa a ferramenta real e devolve o resultado como mensagem role="user" com type="tool_result" e o mesmo tool_use_id. O LLM lê o resultado no contexto e decide: acabou (end_turn) ou repete (nova tool_call).',
    level: 'Pleno',
    tip: 'A distinção "quem executa o quê" é a pergunta armadilha clássica. Muita gente acha que o LLM executa o código — errado. Você sempre mantém controle.',
  },
  {
    q: 'Qual a diferença entre CoT, ReAct, Tree-of-Thoughts e Reflexion?',
    a: 'CoT (Chain-of-Thought): raciocínio linear em um único prompt — "pense passo a passo". Sem tools, sem loop. ReAct: intercala CoT com execução de tools e observação de resultados — projetado para interação com ambiente externo. Tree-of-Thoughts: explora múltiplos caminhos de raciocínio em paralelo (árvore), avalia cada ramo e escolhe o melhor — ideal para problemas com múltiplas soluções possíveis, mas caro. Reflexion: após cada tentativa, o agente gera autocrítica e usa memória de erros anteriores para melhorar — reduz erros em tarefas iterativas.',
    level: 'Senior',
    tip: 'A regra prática: CoT para raciocínio puro; ReAct quando precisa de tools; ToT quando precisa explorar alternativas; Reflexion quando precisa de melhoria iterativa. Custo nessa ordem: CoT < ReAct < Reflexion < ToT.',
  },
  {
    q: 'Quais são os stop conditions obrigatórios num agente de produção?',
    a: 'Sem stop conditions, um agente em loop pode gastar dezenas de dólares em minutos. Obrigatórios: (1) max_iterations — teto de voltas no loop (tipicamente 10-20); (2) max_cost_usd — orçamento por sessão baseado em usage_metadata; (3) timeout por execução completa; (4) detector de loop semântico — se últimas N ações são idênticas, aborta. Opcionais mas recomendados: max_tokens por chamada, rate limiting por usuário, circuit breaker para tools com falha repetida.',
    level: 'Senior',
    tip: 'Citar os 4 stop conditions em ordem de prioridade + o detector de loop semântico (que muita gente esquece) mostra que você já viu um agente runaway em produção.',
  },
  {
    q: 'Por que human-in-the-loop é obrigatório antes de ações irreversíveis?',
    a: 'Agentes em produção são autônomos — não há humano revisando cada ação. Se o modelo chamar delete_records ou send_email em massa por causa de um prompt ambíguo ou bug, o dano é real e imediato. Human-in-the-loop intercepta tool calls destrutivas ANTES de executar, expõe o que o agente pretende fazer e aguarda aprovação. Em LangGraph usa interrupt_before; no SDK puro, é um if na função execute_tool. Crítico também para ações com custo financeiro (pagamentos, chamadas pagas de API).',
    level: 'Pleno',
    tip: 'Dar um exemplo concreto de acidente possível (agente deleta registros de produção por mal-entendido) e a implementação exata com interrupt_before deixa a resposta memorável.',
  },
  {
    q: 'Qual a diferença entre memória in-context, externa (vector DB), episódica e procedural?',
    a: 'In-context: tudo no context window atual — temporário, desaparece com a sessão, limite de tokens. Externa (vector DB): documentos e fatos armazenados fora, recuperados por similaridade semântica (RAG) — permanente, escala bem. Episódica: memória de experiências específicas por usuário ("na última conversa preferiu respostas curtas") — armazenada em banco estruturado, recuperada explicitamente. Procedural: instruções permanentes de como o agente deve se comportar — geralmente no system prompt ou recuperada dinamicamente como playbook.',
    level: 'Senior',
    tip: 'Estruturar a resposta pelos 4 tipos + dizer quando usar cada um (in-context para sessão; vector para conhecimento; episódica para personalização; procedural para comportamento) é uma resposta completa de sênior.',
  },
  {
    q: 'Como validar input e output de tools para evitar prompt injection?',
    a: 'Prompt injection ocorre quando dados externos (resultado de busca, arquivo lido) contêm instruções que sobrescrevem o comportamento do agente. Defesas: (1) validar input da tool com Zod (TS) ou Pydantic (Python) antes de executar — rejeitar campos extras ou tipos errados; (2) sanitizar output antes de injetar no contexto — remover conteúdo que começa com "Ignore previous instructions"; (3) limitar tamanho dos resultados para não estourar contexto; (4) usar system prompt robusto com instruções prioritárias que o modelo resiste a sobrescrever.',
    level: 'Senior',
    tip: 'A combinação validação de input + sanitização de output + system prompt robusto é a defesa em camadas. Citar que o LLM não distingue automaticamente "dado" de "instrução" é o insight central.',
  },
  {
    q: 'Quando usar single agent vs supervisor vs swarm?',
    a: 'Single agent: 90% dos casos — uma tarefa, tools < 10, cabe num contexto. Simples, barato, depurável. Supervisor (orquestrador + subagentes): quando a tarefa tem fases distintas com especialistas reais — pesquisa, síntese, revisão. Controle explícito mas 2-3× mais caro. Hierárquico (Plan-and-Execute): planejamento com modelo forte, execução com modelos baratos — quando o plano é longo e executores são repetitivos. Swarm: peers se passam o controle sem central — para colaboração aberta entre especialistas. Difícil de depurar, comportamento emergente.',
    level: 'Senior',
    tip: 'A regra de ouro é começar com single agent e só subir de nível quando houver prova de que a especialização justifica o custo. Muita gente vai direto para multi-agente por parecer mais sofisticado.',
  },
  {
    q: 'O que é o Model Context Protocol (MCP) e como difere de function calling?',
    a: 'Function calling é a primitiva do LLM — o modelo gera JSON para chamar uma função que você definiu no request. É específico para cada cliente. MCP é um protocolo padronizado (adotado por OpenAI, Google, Anthropic) que define como uma aplicação cliente descobre e usa ferramentas expostas por servidores externos. Com MCP, você não reimplementa a definição de tool para cada cliente — o servidor MCP expõe a lista de tools via protocolo, e qualquer cliente compatível as descobre automaticamente.',
    level: 'Senior',
    tip: 'A analogia útil: function calling é como implementar uma API do zero; MCP é como ter um OpenAPI spec padronizado que qualquer cliente entende. Mencionar que Claude Desktop, Cursor e IDEs já são clientes MCP nativos contextualiza.',
  },
  {
    q: 'Como implementar observabilidade em agentes? O que rastrear?',
    a: 'Sem trace, quando um agente erra em produção você não sabe o que aconteceu. Por sessão rastrear: session_id, user_id, task. Por iteração: step_n, prompt enviado, tokens in/out, custo estimado, tool_called com input, tool_result, latência. Ferramentas: LangSmith (nativo para LangChain/LangGraph), Langfuse (open-source, self-host), Phoenix (Arize), OpenTelemetry para exportar para Grafana. Alertas críticos: custo por sessão > threshold, taxa de loops infinitos, taxa de erro de tool > 5%.',
    level: 'Senior',
    tip: 'Mencionar que você instrumenta cada ITERAÇÃO do loop (não só o início e fim) e que Langfuse permite self-host (sem enviar dados para terceiros) são os detalhes que mostram experiência real.',
  },
  {
    q: 'Como lidar com tool que falha? Retry, fallback ou abort?',
    a: 'Depende do tipo de erro: (1) Erros transitórios (rate limit, timeout de rede) — retry com backoff exponencial (1s, 2s, 4s), máximo 3 tentativas. (2) Erros de schema/validação — devolve ao modelo como tool_result com is_error=true + mensagem descritiva; o LLM geralmente corrige os parâmetros e tenta de novo. (3) Erros permanentes (serviço offline, acesso negado) — abort com mensagem clara; não faz sentido retry. Em todos os casos, não oculte o erro — devolver o stack trace parcial ajuda o modelo a entender o que aconteceu.',
    level: 'Pleno',
    tip: 'A distinção transitório vs schema vs permanente com estratégia diferente para cada tipo é o que diferencia uma implementação robusta de um try/catch genérico.',
  },
  {
    q: 'Como gerenciar context window em sessões longas?',
    a: 'Context window tem limite e custo cresce linearmente com o histórico. Estratégias: (1) Summarização progressiva — quando tokens chegam a 70% do limite, sumariza o histórico antigo mantendo as últimas N mensagens completas; (2) Sliding window — mantém apenas as últimas N mensagens, descarta as mais antigas; (3) Memória hierárquica — mensagem recente completa + sumário do que veio antes + fatos relevantes recuperados do vector DB. A escolha depende do domínio: para suporte ao cliente, sumário é suficiente; para agentes técnicos, manter tool results completos é crítico.',
    level: 'Senior',
    tip: 'Citar que a summarização em si é uma chamada de LLM (tem custo e latência) e que precisa ser assíncrona em sessões interativas mostra que você pensou na implementação real.',
  },
  {
    q: 'O que é Plan-and-Execute e quando vale o custo extra?',
    a: 'Plan-and-Execute separa planejamento de execução. Um modelo forte (Claude Opus, GPT-4o) gera um plano explícito de passos para atingir o objetivo. Modelos menores e baratos (Claude Haiku, GPT-4o-mini) executam cada passo seguindo o plano. Vale quando: o plano é longo e previsível, a execução é repetitiva (um modelo barato consegue), e o erro de planejamento é caro (tarefa demorada). Não vale quando: a tarefa é curta ou o plano muda radicalmente com base nos resultados (aí ReAct simples ganha em eficiência).',
    level: 'Senior',
    tip: 'Dar uma estimativa de custo real ajuda: planejar com Opus custa ~5× mais por token que executar com Haiku. Para tarefas com 20+ steps, o savings é significativo.',
  },
  {
    q: 'Como testar um agente? O que é diferente de testar código comum?',
    a: 'Agentes têm comportamento não-determinístico — a mesma entrada pode gerar saídas diferentes entre execuções. Estratégias: (1) Testes de comportamento com evals — definir critérios mensuráveis (chegou ao resultado correto? usou as tools certas? quantos loops?); (2) Tracing de golden paths — para tarefas críticas, guardar traces de execuções corretas e comparar métricas; (3) Test-time compute — rodar N vezes e verificar se o resultado é consistente; (4) Mock de tools para testes unitários do loop; (5) Frameworks: RAGAS (para RAG), LangSmith Evals, Braintrust. Alertar: testar em produção com dados reais é inevitável — tenha feature flags e rollout gradual.',
    level: 'Senior',
    tip: 'A resposta sobre não-determinismo + evals como substituto de testes determinísticos + frameworks como RAGAS é o que diferencia quem testou agentes de verdade.',
  },
  {
    q: 'Qual o impacto de LLMs com context window longo (200K) em agentes?',
    a: 'Context window longo reduz a necessidade de summarização e memória externa para sessões curtas e médias. Mas não elimina: (1) custo cresce linearmente — 200K tokens custa ~40× mais que 5K tokens na mesma sessão; (2) "Lost in the middle" — LLMs têm performance pior para informações no meio do contexto longo; (3) Latência aumenta com contexto maior; (4) Tool results repetitivos acumulam rápido. Uso ideal de contexto longo: carregar documentos grandes no início da sessão em vez de fazer RAG incremental. Ainda precisa de gestão de contexto para sessões longas.',
    level: 'Senior',
    tip: 'O "lost in the middle" (pesquisa de Stanford que mostra que LLMs ignoram informação no centro do contexto) é um detalhe técnico que impressiona.',
  },
  {
    q: 'Como funciona a memória em LangGraph? Qual a diferença entre checkpointer e store?',
    a: 'LangGraph tem duas primitivas de persistência: Checkpointer salva o estado completo do grafo a cada step — é a "memória de curto prazo da sessão". Permite retomar de onde parou (fault tolerance), fazer time-travel debugging e human-in-the-loop (interrupt_before guarda o checkpoint). Store é memória persistente entre sessões — "memória de longo prazo". Namespace hierárquico permite isolar por usuário, por agente. Combinação típica: MemorySaver (checkpointer) para estado da sessão + InMemoryStore/PostgresStore (store) para fatos e preferências do usuário.',
    level: 'Senior',
    tip: 'A distinção clara checkpointer (estado da sessão atual) vs store (persistência longa entre sessões) é algo que confunde muita gente que usa LangGraph pela primeira vez.',
  },
  {
    q: 'Como evitar que um agente tome ação com consequência real num ambiente de desenvolvimento?',
    a: 'Estratégias de sandboxing: (1) Feature flag de modo "dry run" — tools que causam efeito colateral loggam a ação mas não executam; (2) Ambientes separados — agente de dev aponta para banco/API de staging; (3) Sandbox para code execution — E2B, Modal ou Docker com rede isolada para executar código do agente sem acesso ao filesystem real; (4) Prefix de IDs em recursos criados — tudo criado pelo agente começa com "agent_test_" para fácil cleanup; (5) Rate limiting severo em dev — máximo de 10 chamadas de API por sessão.',
    level: 'Senior',
    tip: 'Mencionar E2B ou Modal como sandbox managed para code execution (em vez de montar Docker manual) mostra familiaridade com o ecossistema atual.',
  },
  {
    q: 'O que é Reflexion e quando é melhor que ReAct simples?',
    a: 'Reflexion (Shinn et al., 2023) adiciona um loop de autocrítica ao ReAct. Após cada tentativa, o agente gera uma reflexão: "O que fiz? O que deu errado? O que farei diferente?" Essa reflexão é guardada em memória episódica e injetada no próximo attempt. É melhor que ReAct simples quando: a tarefa admite múltiplas tentativas (tasks iterativas), os erros são recorrentes e aprendíveis, e o custo de N tentativas é aceitável. Não vale quando: a tarefa é one-shot, erro não é aprendível entre tentativas, ou custo de múltiplas chamadas é proibitivo.',
    level: 'Senior',
    tip: 'Citar o paper original + dar um caso de uso concreto (geração de código com testes — Reflexion melhora muito na segunda tentativa) ancora bem a resposta.',
  },
  {
    q: 'Como structurar o system prompt de um agente para máxima performance?',
    a: 'System prompt de agente efetivo tem: (1) Identidade clara — "Você é um assistente de análise de dados. Você SOMENTE responde sobre dados e análises."; (2) Regras de tool use — quando chamar cada tool, quando NÃO chamar (evita tool overuse); (3) Formato de output esperado — estrutura da resposta final; (4) Restrições explícitas — o que jamais fazer (evita ações perigosas); (5) Few-shot examples no system prompt para tasks complexas. Erros comuns: system prompt genérico que não guia o modelo, regras contraditórias, e não mencionar o que fazer quando a tool falha.',
    level: 'Pleno',
    tip: 'A parte de "quando NÃO chamar a tool" é frequentemente esquecida e causa tool overuse — o agente chama search_web para perguntas que ele já sabe responder.',
  },
  {
    q: 'Como medir o custo de um agente em produção e controlar gasto?',
    a: 'Custo de agente = Σ(tokens_in + tokens_out) × preço_por_token ao longo de todas as iterações da sessão. Controles: (1) usage_metadata em cada resposta da API — soma ao longo do loop; (2) Alerta de cost > threshold por sessão; (3) max_cost_usd como stop condition; (4) Modelo diferente por subtarefa — Opus para planejamento, Haiku para execução simples; (5) Caching de tool results — se a mesma query de search for chamada N vezes, cachear o resultado; (6) Dashboard de custo por usuário, por tipo de tarefa, por modelo — Langfuse e LangSmith têm isso nativo.',
    level: 'Senior',
    tip: 'Dar uma estimativa de custo real contextualiza: GPT-4o a $5/1M input tokens, 15 iterações de 3K tokens cada = ~$0.22 por sessão. Com Haiku para workers, cai para ~$0.03.',
  },
  {
    q: 'Quais são os principais riscos de segurança em agentes e como mitigá-los?',
    a: 'Principais riscos: (1) Prompt injection — dados externos sobrescrevem instruções do agente (mitigar com sanitização de input de tools e system prompt robusto); (2) Tool abuse — agente usa tool corretamente mas para fim não-intencional (mitigar com escopo explícito no system prompt e rate limiting de tools); (3) Exfiltração de dados — agente manipulado para enviar dados sensíveis para URL externa via web_search ou HTTP tool (mitigar com allowlist de domínios); (4) Privilege escalation — agente usa tool A para obter credenciais e depois age com permissões maiores (mitigar com least-privilege em cada tool); (5) Loop infinito intencional — input malicioso para épuisar orçamento (mitigar com rate limiting por usuário e cost caps).',
    level: 'Senior',
    tip: 'A estrutura "risco → mecanismo de ataque → mitigação específica" para cada item transforma uma lista genérica em uma resposta de segurança real.',
  },
]

// ── Mnemônicos ────────────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'ReAct — Reason + Act',
    trick: 'REACT: Raciocina, Executa (tool), Age, Confere, Termina',
    expansion: [['R','Raciocina (CoT interno)'],['E','Emite tool_call'],['A','App executa a tool'],['C','Contexto recebe resultado'],['T','Termina (end_turn) ou repete']],
    explanation: 'O loop do agente em 5 letras. Base de LangGraph, OpenAI Agents SDK e Anthropic tool use.',
    example: 'while stop_reason != "end_turn": llm() → execute_tool() → add_result() → repete',
    why: 'Combina raciocínio simbólico com execução real. Diferente de chain (passos fixos), o agente decide o próximo passo com base no estado atual.',
  },
  {
    label: 'Stop conditions — MITT',
    trick: 'MITT: Max-iterations, Investimento (cost), Timeout, Track de loop',
    expansion: [['M','Max_iterations (ex: 15)'],['I','max_cost_usd via usage_metadata'],['T','Timeout por sessão completa'],['T','Tracker de loop semântico']],
    explanation: 'Os 4 guardrails obrigatórios em todo agente de produção. Sem eles, um bug ou prompt ambíguo pode gastar dezenas de dólares em minutos.',
    example: 'if (iter > MAX || cost > BUDGET || elapsed > TIMEOUT || isLoop()) abort()',
    why: 'Um agente runaway sem stop conditions pode custar centenas de dólares antes de alguém perceber.',
  },
  {
    label: '4 tipos de memória — CIEP',
    trick: 'CIEP: Contexto, Index vetorial, Episódica, Procedural',
    expansion: [['C','Contexto in-context (temporário)'],['I','Index vetorial/RAG (permanente)'],['E','Episódica (experiências por usuário)'],['P','Procedural (system prompt, playbooks)']],
    explanation: 'De mais rápida para mais persistente. Cada tipo responde a uma necessidade diferente de memória do agente.',
    example: 'In-context: sessão atual | Vector DB: docs | Episódica: preferências | Procedural: regras',
    why: 'Misturar os tipos errados gera agentes que esquecem o que sabem ou desperdiçam tokens com contexto irrelevante.',
  },
  {
    label: 'Regra de ouro do multi-agente — SAP',
    trick: 'SAP: Single Agent Primeiro — prove que precisa de mais',
    expansion: [['S','Single agent (90% dos casos)'],['A','Adicione especialistas só com prova'],['P','Prove que o custo 2-5× vale']],
    explanation: '90% das tarefas cabem em um agente com boas tools. Multi-agente justifica apenas com especialização real — coordenação tem custo alto.',
    example: 'Single → Supervisor (se fases distintas) → Hierárquico (plano longo) → Swarm (último recurso)',
    why: 'Muita gente vai direto para multi-agente por parecer mais sofisticado. O custo de depuração sobe exponencialmente com o número de agentes.',
  },
  {
    label: 'MAPE-K — ciclo do agente autônomo',
    trick: 'MAPE-K: Monitora, Analisa, Planeja, Executa — Knowledge alimenta tudo',
    expansion: [['M','Monitor: coleta dados do ambiente'],['A','Analyze: interpreta o estado'],['P','Plan: decide próxima ação'],['E','Execute: age'],['K','Knowledge: base atualizada a cada ciclo']],
    explanation: 'Padrão clássico de sistemas autônomos adaptado para agentes LLM. Ideal para monitoramento e resposta autônoma a eventos.',
    example: 'monitor_metrics() → analyze_anomaly() → plan_remediation() → execute_fix() → update_kb()',
    why: 'Torna o ciclo de raciocínio do agente explícito e auditável — facilita debugging e alinhamento com intenção humana.',
  },
]

// ── Comparative: Frameworks ───────────────────────────────────────────────────

const FRAMEWORK_OPTIONS: CompOption[] = [
  { name: 'LangChain',         color: '#1C3C5A' },
  { name: 'LangGraph',         color: '#F59E0B' },
  { name: 'CrewAI',            color: '#ef4444' },
  { name: 'OpenAI Assistants', color: '#10a37f' },
  { name: 'Anthropic SDK',     color: '#a78bfa' },
]

const FRAMEWORK_CRITERIA: CompCriterion[] = [
  {
    criterion: 'Abstração',
    values: {
      LangChain:         'Médio — chains prontas mas verbose e mágico',
      LangGraph:         'Baixo-médio — você define nodes/edges explicitamente',
      CrewAI:            'Alto — declarativo: Agent, Task, Crew',
      'OpenAI Assistants': 'Máximo — OpenAI gerencia threads e runs',
      'Anthropic SDK':   'Mínimo — você constrói tudo: loop, tools, estado',
    },
    winner: 'CrewAI',
  },
  {
    criterion: 'Controle do fluxo',
    values: {
      LangChain:         'Médio — customizável mas abstrações podem atrapalhar',
      LangGraph:         'Total — grafo, conditional edges, interrupt_before',
      CrewAI:            'Limitado — você define agentes, não o fluxo exato',
      'OpenAI Assistants': 'Mínimo — loop interno da OpenAI, caixa-preta',
      'Anthropic SDK':   'Total — você escreve o loop, zero magia',
    },
    winner: 'LangGraph',
  },
  {
    criterion: 'Multi-agente nativo',
    values: {
      LangChain:         'Possível mas plumbing manual',
      LangGraph:         'Projetado para isso — subgraphs, handoffs, supervisors',
      CrewAI:            'Core feature — Crew é um time de agentes colaborando',
      'OpenAI Assistants': 'Um assistente por vez — sem coordenação nativa',
      'Anthropic SDK':   'Construir manualmente com tool calling entre agentes',
    },
    winner: 'LangGraph',
  },
  {
    criterion: 'Observabilidade',
    values: {
      LangChain:         'Callbacks + LangSmith nativo integrado',
      LangGraph:         'LangSmith + estado estruturado fácil de inspecionar',
      CrewAI:            'Logs internos, integração com Langfuse via callbacks',
      'OpenAI Assistants': 'Dashboard OpenAI mas acesso programático limitado',
      'Anthropic SDK':   'Instrumentar manualmente — total controle, Langfuse/OTel',
    },
    winner: 'Anthropic SDK',
  },
  {
    criterion: 'Portabilidade',
    values: {
      LangChain:         'Agnóstico — suporta 50+ providers via abstração LLM',
      LangGraph:         'Agnóstico de provider, mas ecossistema LangChain',
      CrewAI:            'Suporta múltiplos providers via LiteLLM',
      'OpenAI Assistants': 'Lock-in total com OpenAI — impossível migrar dados',
      'Anthropic SDK':   'Lock-in com Anthropic mas API é bem documentada',
    },
    winner: 'LangChain',
  },
  {
    criterion: 'Maturidade/Produção',
    values: {
      LangChain:         'Maduro mas muda API com frequência — fragile',
      LangGraph:         'Crescendo rápido, opção preferida para fluxos complexos',
      CrewAI:            'Útil para prototipagem, ainda amadurecendo',
      'OpenAI Assistants': 'SLA OpenAI, mas black-box e custo difícil de prever',
      'Anthropic SDK':   'Máxima estabilidade — você controla tudo, sem surpresas',
    },
    winner: 'Anthropic SDK',
  },
]

// ── Anti-patterns ─────────────────────────────────────────────────────────────

const ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'Agente sem max_iterations — loop infinito',
    badDesc: 'Loop sem teto: um bug ou instrução ambígua roda centenas de voltas, gastando dezenas de dólares.',
    badCode: [
      { t: '// Sem limite — agente pode rodar para sempre', c: '#ef4444' },
      { t: 'while (true) {' },
      { t: '  const res = await llm.complete(messages)' },
      { t: '  if (res.stop_reason === "end_turn") break' },
      { t: '  // custo explode, pode gastar $$ em minutos', c: '#ef4444' },
      { t: '}' },
    ],
    goodDesc: 'Sempre definir max_iterations + monitorar custo via usage_metadata a cada iteração.',
    goodCode: [
      { t: '// Sempre definir teto de segurança', c: '#4ade80' },
      { t: 'const MAX_ITER = 15; let iter = 0' },
      { t: 'while (iter++ < MAX_ITER) {' },
      { t: '  const res = await llm.complete(messages)' },
      { t: '  if (res.stop_reason === "end_turn") break' },
      { t: '  // + monitorar cost via usage_metadata', c: '#4ade80' },
      { t: '}' },
    ],
    why: 'Em 15 iterações de 3K tokens com GPT-4o são ~$0.20 por sessão — multiplicado por usuários simultâneos o custo explode rapidamente.',
  },
  {
    title: 'Ação irreversível sem human-in-the-loop',
    badDesc: 'Tool destrutiva executada diretamente — agente pode deletar dados de produção por mal-entendido.',
    badCode: [
      { t: '// Tool chamada diretamente sem aprovação', c: '#ef4444' },
      { t: 'if (toolCall.name === "delete_records") {' },
      { t: '  return await deleteRecords(toolCall.input)', c: '#ef4444' },
      { t: '  // agente pode deletar dados de produção', c: '#ef4444' },
      { t: '}' },
    ],
    goodDesc: 'Interceptar tool calls destrutivas antes de executar e aguardar aprovação humana.',
    goodCode: [
      { t: '// Interceptar antes de executar', c: '#4ade80' },
      { t: 'const DESTRUCTIVE = ["delete_records", "send_email"]' },
      { t: 'if (DESTRUCTIVE.includes(toolCall.name)) {' },
      { t: '  const ok = await humanApproval(toolCall)', c: '#F59E0B' },
      { t: '  if (!ok) return { error: "Cancelado" }' },
      { t: '}' },
      { t: 'return await executeTool(toolCall)' },
    ],
    why: 'Agentes autônomos não hesitam. Um prompt ambíguo pode causar delete em produção, e-mail em massa ou pagamento indevido.',
  },
  {
    title: 'Tool output não sanitizado — prompt injection',
    badDesc: 'Resultado de busca injetado diretamente no contexto — conteúdo malicioso pode sobrescrever instruções.',
    badCode: [
      { t: '// Resultado da busca injetado direto no contexto', c: '#ef4444' },
      { t: 'const result = await webSearch(query)' },
      { t: 'messages.push({ role: "tool", content: result.raw })' },
      { t: '// Conteúdo: "Ignore previous instructions..."', c: '#ef4444' },
    ],
    goodDesc: 'Sanitizar e limitar tamanho do output de tool antes de injetar no contexto.',
    goodCode: [
      { t: '// Validar e sanitizar antes de injetar', c: '#4ade80' },
      { t: 'const raw = await webSearch(query)' },
      { t: 'const safe = {' },
      { t: '  results: raw.items.slice(0, 5).map(sanitizeContent)', c: '#F59E0B' },
      { t: '}' },
      { t: '// Limita tamanho + remove conteúdo suspeito', c: '#4ade80' },
      { t: 'messages.push({ role: "tool", content: JSON.stringify(safe) })' },
    ],
    why: 'O LLM não distingue automaticamente "dado" de "instrução". Dados externos são vetores de ataque direto contra o comportamento do agente.',
  },
  {
    title: 'Context overflow — custo cresce sem controle',
    badDesc: 'Todo histórico acumulado sem limite: 50 turnos × 2K tokens = 100K tokens, custo explode.',
    badCode: [
      { t: '// Acumulando todo histórico sem limite', c: '#ef4444' },
      { t: 'messages.push(...allPreviousMessages)' },
      { t: '// 50 turnos × 2K tokens = 100K tokens', c: '#ef4444' },
      { t: '// Custo explode + modelo "esquece" início', c: '#ef4444' },
    ],
    goodDesc: 'Sumarizar progressivamente quando contexto chega a 70% do limite de tokens.',
    goodCode: [
      { t: '// Sumarizar quando contexto fica grande', c: '#4ade80' },
      { t: 'if (countTokens(messages) > MAX_TOKENS * 0.7) {' },
      { t: '  const summary = await summarize(messages)', c: '#F59E0B' },
      { t: '  messages = [systemMsg, summary, ...messages.slice(-4)]' },
      { t: '}' },
    ],
    why: 'Sem gestão o custo cresce linearmente e o "lost in the middle" faz o modelo ignorar o início da conversa.',
  },
  {
    title: 'Agente sem observabilidade — caixa-preta',
    badDesc: 'Nenhuma instrumentação: quando falha em produção, impossível saber qual tool, quantos loops ou o custo.',
    badCode: [
      { t: '// Zero instrumentação', c: '#ef4444' },
      { t: 'const result = await runAgent(task)' },
      { t: '// Se falhar: qual tool? quantos loops?', c: '#ef4444' },
      { t: '// Custo? Latência? Impossível saber.', c: '#ef4444' },
    ],
    goodDesc: 'Rastrear cada iteração: tokens, custo, tool chamada e latência com Langfuse ou LangSmith.',
    goodCode: [
      { t: '// Rastrear cada iteração do loop', c: '#4ade80' },
      { t: 'const trace = langfuse.trace({ name: "agent", userId })', c: '#F59E0B' },
      { t: 'for (let i = 0; i < MAX_ITER; i++) {' },
      { t: '  const span = trace.span({ name: `iter-${i}` })' },
      { t: '  const res = await llm.complete(messages)' },
      { t: '  span.update({ tokens: res.usage, tool: toolCall?.name })', c: '#F59E0B' },
      { t: '}' },
    ],
    why: 'Agentes em produção sem trace são impossíveis de depurar. Instrumente cada iteração, não só o início e o fim.',
  },
]

// ── Cheatsheet de Padrões ─────────────────────────────────────────────────────

const PATTERN_ITEMS: PatternItem[] = [
  {
    name: 'ReAct (Reason + Act)',
    code: 'while stop_reason != "end_turn": llm() → execute_tool() → add_result()',
    desc: 'Loop: raciocina → tool_call → observa resultado → repete. Base de todo agente. Use quando precisa de tools externas.',
  },
  {
    name: 'Chain-of-Thought (CoT)',
    code: '"Pense passo a passo: 1)... 2)... 3) Portanto..."',
    desc: 'O modelo pensa em voz alta antes de responder. Sem tools, sem loop. Custo mínimo.',
  },
  {
    name: 'Tree-of-Thoughts (ToT)',
    code: 'generate(n=3) → evaluate_each() → prune() → continue_best()',
    desc: 'Explora N caminhos de raciocínio em paralelo. Custo alto — só quando qualidade supera custo.',
  },
  {
    name: 'Reflexion',
    code: 'attempt() → reflect("o que errei?") → retry_with_memory(reflection)',
    desc: 'Após cada tentativa gera autocrítica e usa memória de erros. Tasks iterativas onde erros são aprendíveis.',
  },
  {
    name: 'Plan-and-Execute',
    code: 'opus.plan(task) → [haiku.execute(step) for step in plan]',
    desc: 'Modelo forte planeja; modelos baratos executam. Tasks longas e previsíveis — econômico em escala.',
  },
  {
    name: 'MAPE-K',
    code: 'monitor() → analyze() → plan() → execute() → update_knowledge()',
    desc: 'Ciclo autônomo clássico. Ideal para agentes de monitoramento e resposta a eventos.',
  },
  {
    name: 'Human-in-the-loop',
    code: 'interrupt_before=["delete"] | if destructive: await humanApproval()',
    desc: 'Pausa antes de ações irreversíveis. Obrigatório para delete, e-mail, pagamento, deploy.',
  },
  {
    name: 'Self-Consistency',
    code: 'answers = [llm(q, temp=0.7) for _ in range(5)]; majority_vote(answers)',
    desc: 'Roda N vezes, retorna resposta mais frequente. Raciocínio matemático com custo 5× maior.',
  },
]

// ── Builders ─────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'Agentic Workflows',
    stackLabel: 'IA / Agentes',
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'Agentic Workflows',
    stackLabel: 'IA / Agentes',
  }),
  comparative: () => buildComparativeRefPdf({
    options: FRAMEWORK_OPTIONS,
    criteria: FRAMEWORK_CRITERIA,
    skillName: 'Agentic Workflows',
    accentColor: C,
    stackLabel: 'IA / Agentes',
    scenarios: [
      { scenario: 'Prototipagem rápida', recommendation: 'CrewAI ou LangChain', reason: 'Alto nível, menos código, iterar rápido.' },
      { scenario: 'Fluxo complexo com bifurcações e human-in-the-loop', recommendation: 'LangGraph', reason: 'Grafo explícito, interrupt_before, estado tipado.' },
      { scenario: 'Máximo controle e portabilidade', recommendation: 'Anthropic SDK puro', reason: 'Zero magia, loop manual, instrumente com Langfuse.' },
      { scenario: 'Multi-provider sem vendor lock', recommendation: 'LangChain', reason: 'Suporta 50+ LLMs via abstração unificada.' },
    ],
  }),
  antipatterns: () => buildAntipatternsPdf({
    antipatterns: ANTIPATTERNS,
    accentColor: C,
    skillName: 'Agentic Workflows',
    stackLabel: 'IA / Agentes',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'Agentic Workflows',
    accentColor: C,
    stackLabel: 'IA / Agentes',
    sections: {
      hooks: [],
      depRows: [],
      rules: [],
      performanceTips: [
        'max_iterations obrigatório em todo agente (recomendado: 10-20)',
        'max_cost_usd via usage_metadata — alerta quando excede threshold',
        'Modelo forte para planejamento, barato para execução (Plan-and-Execute)',
        'Cache de tool results para queries repetidas',
        'Sumarizar contexto quando chegar a 70% do limit de tokens',
        'Sandbox isolado para code_execution — Docker, E2B ou Modal',
        'Langfuse ou LangSmith para trace de cada iteração',
      ],
      patterns: PATTERN_ITEMS,
      mentalModels: [
        'O LLM NUNCA executa código — ele emite JSON, você executa',
        'Tool description é o que o modelo lê para decidir quando chamar',
        'stop_reason="tool_use" → execute e devolva; "end_turn" → finalize',
        'Prompt injection: dados externos podem sobrescrever instruções',
        'Single agent first — multi-agente só quando especialização real justifica',
        'HITL antes de qualquer ação irreversível — sem exceção',
      ],
    },
  }),
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function AgenticWorkflowsPdfs() {
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

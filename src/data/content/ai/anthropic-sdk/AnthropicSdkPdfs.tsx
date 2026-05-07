'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildQuickRefPdf } from '@/components/pdfs/QuickRefPdf'
import type { QuickRefColumn } from '@/components/pdfs/QuickRefPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'
import { buildMindmapPdf } from '@/components/pdfs/MindmapPdf'
import type { MindmapCategory } from '@/components/pdfs/MindmapPdf'

// ── Paleta Anthropic SDK (bronze Anthropic) ────────────────────────────────────
const C = '#c98346'   // bronze Anthropic

// ── Metadados dos PDFs ─────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A de Entrevista',
    subtitle: 'As 20 perguntas mais cobradas sobre o Anthropic SDK',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa: prompt caching, tool use loop, streaming com acumulação de partial JSON, stop_reason, extended thinking, computer use, batch API, model routing, multi-turn conversation. Pleno e sênior.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'quick-ref',
    title: 'Quick Reference',
    subtitle: 'API, modelos, caching e padrões numa folha',
    type: 'quick-ref',
    pages: 2,
    description: 'Cartão de bolso: estrutura da Messages API, modelos e custos, prompt caching math, stop_reasons, tool use pattern, recursos avançados. Para consulta rápida durante desenvolvimento.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos',
    subtitle: '3 truques para memorizar os padrões críticos do SDK',
    type: 'mnemonics',
    pages: 3,
    description: 'ETMS, ESU e SEAL — stop reasons, o que cachear e o loop de tool use. Os 3 acrônimos que cobrem os conceitos mais cobrados em entrevista.',
    icon: '03',
    goal: 'Memorização',
  },
  {
    id: 'mindmap',
    title: 'Mind Map',
    subtitle: 'Anthropic SDK do básico ao expert em uma folha',
    type: 'mindmap',
    pages: 2,
    description: 'Mapa mental com 6 domínios (Messages API, Tool Use, Prompt Caching, Streaming, Recursos Avançados, Modelos) e checklist de 10 perguntas para auto-avaliar o domínio do SDK.',
    icon: '04',
    goal: 'Mapeamento mental',
  },
]

// ── Q&A Data ───────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Senior',
    q: 'Como funciona prompt caching da Anthropic e como maximizar o impacto?',
    a: 'Você marca um bloco com cache_control={"type":"ephemeral"}. Tudo desde o início até aquele bloco vira a cache key. Hit: 10% do preço base. Write: 125%. TTL: 5min default, 1h opcional. Maximizar: (1) estático sempre antes do dinâmico — dinâmico no meio invalida tudo depois. (2) Monitorar cache_read_input_tokens vs cache_creation_input_tokens para validar hit rate. (3) Para TTL 1h: sessões de coding assistant, agentes com contexto longo. Economiza 80-90% em cargas com prefixo estável.',
    tip: 'O detalhe de que dinâmico no meio invalida o cache é o que separa candidatos com experiência real. cache_read_input_tokens = 0 consistentemente indica prefixo mudando.',
  },
  {
    level: 'Senior',
    q: 'Como implementaria um loop de tool use robusto?',
    a: 'Loop continua enquanto stop_reason for "tool_use": (1) Enviar mensagem inicial com tools. (2) Se stop_reason === "tool_use": extrair TODOS os tool_use blocks. (3) Executar cada função, capturar resultado ou erro (is_error: true). (4) Adicionar response do assistant + tool_results como nova mensagem user. (5) Chamar novamente → repetir. Pontos críticos: adicionar TODOS os tool_use blocks de volta — mesmo que só um foi executado. Limitar iterações (max_turns). Log de cada tool call para auditoria.',
    tip: 'O erro mais comum é não adicionar a mensagem do assistant com os tool_use blocks antes dos tool_results. A API retorna 400 se a conversa estiver malformada.',
  },
  {
    level: 'Senior',
    q: 'Como implementaria streaming com tool use?',
    a: 'Streaming com tools exige acumulação de partial JSON: (1) content_block_start com type tool_use: criar accumulator para esse block_index. (2) content_block_delta com input_json_delta: acumular na string — NUNCA fazer JSON.parse em delta intermediário. (3) content_block_stop: JSON.parse() na string acumulada → executar tool. (4) Para UX: streamear texto ao usuário enquanto acumula JSON em background. No SDK TS: for await (const event of stream) com type guards para cada event type.',
    tip: 'partial_json não é JSON válido até o content_block_stop. JSON.parse em deltas intermediários é um bug garantido. Sempre esperar o stop event.',
  },
  {
    level: 'Senior',
    q: 'Quando usar extended thinking e qual o custo real?',
    a: 'Extended thinking resolve raciocínio multi-step: matemática complexa, código difícil com bugs sutis, planning com múltiplas restrições. Custo: thinking tokens cobrados como input tokens adicionais — com budget_tokens=10000, você paga até 10k tokens extras. Para task simples (extração, FAQ), não vale: 2-3x mais caro sem ganho. Implementação: budget_tokens adequado (começar com 8000). Thinking blocks DEVEM ser incluídos em chamadas subsequentes — não remova do histórico. Use para debug: thinking blocks mostram o raciocínio do modelo.',
    tip: 'Thinking blocks não podem ser editados. Remover do histórico multi-turn confunde o modelo. Manter o histórico completo é regra.',
  },
  {
    level: 'Senior',
    q: 'Como usar computer use de forma segura em produção?',
    a: 'Sempre em container Docker com recursos limitados — sem acesso ao host, sem montar volumes sensíveis. Timeout de sessão (5-10min). Allowlist de URLs/domínios que o agente pode visitar. Captura de screenshot antes/depois de cada ação — audit trail. Human confirmation para ações irreversíveis (submit form, delete). Fluxo: Claude decide ação → você executa localmente (Playwright, PyAutoGUI) → devolve screenshot novo. Claude não executa diretamente — você é o intermediário. NUNCA rodar direto no host do usuário.',
    tip: 'Em entrevistas, enfatize que computer use é um tool chamado no seu código — Claude não executa diretamente. O risco está na sua implementação do executor.',
  },
  {
    level: 'Senior',
    q: 'Como você monitoraria e otimizaria custo com o SDK Anthropic?',
    a: 'SDK retorna: response.usage = {input_tokens, output_tokens, cache_creation_input_tokens, cache_read_input_tokens}. Estratégias: (1) Prompt caching — 90% off em prefixos repetidos. Maximizar cache_read_input_tokens. (2) Model routing — Haiku para simples (classificação, extração). (3) Batch API — 50% off para workloads async. (4) max_tokens adequado — não colocar 4096 para respostas curtas. (5) Context compression — summarize histórico em vez de crescer infinitamente. Log custo estimado por request. Alarme se custo/request > threshold.',
    tip: 'cache_read_input_tokens é o número que você quer maximizar. Se for 0 consistentemente, o prefixo está mudando — rever o que está sendo cacheado.',
  },
  {
    level: 'Senior',
    q: 'Como implementa retry e resilience com o SDK Anthropic?',
    a: 'SDK tem retry automático (3 tentativas para 5xx e 429). Para customizar: Anthropic(max_retries=5). Rate limiting (429): SDK faz backoff exponencial automaticamente. Para cargas altas: fila + circuit breaker. Timeout: Anthropic(timeout=30.0) ou por request. Fallback: se Anthropic unavailable → OpenAI via LiteLLM. Manter prompt portável (tool calling schema similar mas não idêntico). Circuit breaker: após 5 falhas/60s → retornar resposta padrão até recover. Sem circuit breaker: 100 requests concorrentes com 5 retries cada = 500 calls no provider falho.',
    tip: 'O SDK já tem retry, mas circuit breaker é responsabilidade sua. Mencionar o cálculo de "100 requests × 5 retries = 500 calls" demonstra pensamento de sistema.',
  },
  {
    level: 'Senior',
    q: 'Como você estruturaria um sistema multi-agent com o SDK Anthropic?',
    a: 'Padrão orchestrator-worker: orchestrator (Sonnet) planeja e delega; workers (Haiku ou Sonnet) executam tasks específicas. O orchestrator usa tool use para "chamar" workers — cada tool representa um agente especializado. Contexto mínimo para cada worker (least context) — não passar toda a conversa do orchestrator. Orchestrator sintetiza resultados. Estado: LangGraph ou similar para grafos de execução, checkpointing, rollback. A Messages API é stateless — você mantém o histórico. Custo: Haiku workers custam 10-20x menos que Sonnet.',
    tip: 'Passar contexto mínimo para cada worker é o que candidatos sênior sabem. Context pollution degrada qualidade e explode custo em multi-agent.',
  },
  {
    level: 'Senior',
    q: 'Como você lida com o context window limit em documentos longos?',
    a: 'Estratégias por caso: Q&A sobre doc → RAG (chunking + embedding + retrieval — só chunks relevantes, não o documento inteiro). Análise de código → map-reduce (dividir em partes, analisar cada, sintetizar). Sumarização progressiva → sumarizar seções progressivamente, usar sumários como input. Contexto estático → prompt caching (cache hit = 10%). Context window de 200k tokens não significa "jogue tudo dentro" — custo e latência crescem linearmente. RAG é sempre mais eficiente para documentos longos com queries específicas.',
    tip: 'Context window de 200k é uma affordance, não uma recomendação. RAG é mais eficiente em custo e qualidade para documentos longos.',
  },
  {
    level: 'Senior',
    q: 'Como você escolheria entre Anthropic SDK diretamente vs LiteLLM?',
    a: 'SDK direto quando: (1) Recursos exclusivos do Claude — prompt caching, extended thinking, computer use. LiteLLM não tem acesso completo a esses recursos. (2) Controle fino sobre comportamento específico. (3) Aplicação usa apenas Claude. LiteLLM quando: (1) Multi-provider — fallback Anthropic → OpenAI → Bedrock. (2) Modelo pode mudar (staging Haiku, prod Sonnet). (3) OpenAI-compatible format esperado pelo framework. (4) Abstração de custo uniforme por provider. Trade-off: SDK direto = 100% dos recursos + menor overhead. LiteLLM = abstração valiosa mas pode não suportar features novas imediatamente.',
    tip: 'Prompt caching é o argumento mais forte para SDK direto — LiteLLM pode não suportar completamente os headers de cache da Anthropic.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre Haiku, Sonnet e Opus? Quando usar cada um?',
    a: 'Haiku: rápido (~1-2s), mais barato (1x base). Bom para classificação, extração, routing, workers simples em multi-agent. Sonnet: equilíbrio (~3-5s, ~8-10x). Cavalo de batalha para tool use, RAG, chat, código, agentes — cobre 80-90% dos casos. Opus: mais forte (~6-15s, ~30-50x). Para raciocínio complexo, código difícil, análise nuançada. Em 2025: Sonnet 4.5 é o default. Haiku para workers simples, Opus quando Sonnet não é suficiente.',
    tip: 'Mencionar Sonnet como cavalo de batalha com números de custo relativo (Haiku ~10x mais barato que Sonnet) demonstra que você usa em produção real.',
  },
  {
    level: 'Pleno',
    q: 'O que é stop_reason e por que cada valor importa?',
    a: 'stop_reason indica como a geração terminou — seu código precisa tratar cada caso: end_turn = Claude finalizou naturalmente, resposta completa. tool_use = Claude quer chamar uma tool, execute a ferramenta e continue o loop. max_tokens = resposta foi truncada, pode pedir para continuar mas atenção ao context growth. stop_sequence = Claude gerou uma das sequências de stop configuradas. O erro mais comum: não checar stop_reason e tratar todas as respostas como end_turn — quebra o loop de tool use.',
    tip: 'Em entrevistas, se você mencionar stop_reason ao falar de tool use, demonstra que implementou de verdade.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona a Batch API da Anthropic?',
    a: 'Para workloads async: (1) Criar batch: POST /v1/messages/batches com array de requests (custom_id + params). (2) Polling: GET /v1/messages/batches/{id} até status = "ended". (3) Coletar: GET /v1/messages/batches/{id}/results — retorna JSONL. Limites: até 10k requests por batch, processamento até 24h. Custo: 50% off. SDK TS: client.beta.messages.batches.create({requests: [...]}). Usar quando: não precisa de tempo real, tem volume alto, custo importa. Ideal para: eval de prompts, classificação em massa, geração de dados.',
    tip: 'Batch API tem 50% de desconto sem degradação de qualidade. Frequentemente subutilizada para eval e geração de dados de treino.',
  },
  {
    level: 'Pleno',
    q: 'Como implementa vision com o SDK Anthropic?',
    a: 'Content com image pode ser base64 ou URL: {"type":"image","source":{"type":"base64","media_type":"image/jpeg","data":"<base64>"}} ou URL. Suporta PNG, JPEG, GIF, WebP. Casos de uso: OCR de documentos, análise de gráficos, leitura de screenshots, extração de dados de formulários. Boas práticas: instrução clara de qual campo extrair, combinar texto + imagem na mesma mensagem para contexto, resize antes de enviar se resolução não é crítica (reduz tokens e custo). Imagens grandes cobram tokens significativamente mais.',
    tip: 'Resize de imagem antes de enviar é o quick win de custo mais esquecido. 4k px cobra muito mais tokens que 800px para a mesma informação.',
  },
  {
    level: 'Pleno',
    q: 'Como instala e configura o SDK TypeScript da Anthropic?',
    a: 'npm install @anthropic-ai/sdk. Configuração: import Anthropic from "@anthropic-ai/sdk"; const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY, maxRetries: 3, timeout: 60000 }). SDK lê ANTHROPIC_API_KEY da env por padrão — não precisa passar explicitamente. Headers de uso: response.headers["anthropic-ratelimit-requests-remaining"] para monitorar rate limit. response.usage para tokens. Tipos TypeScript: ContentBlock, ToolUseBlock, TextBlock como discriminated union por type. Para streaming: client.messages.stream({...}).on("text", (text) => ...).',
    tip: 'SDK lê a env var por padrão — demonstrar conhecimento disso mostra familiaridade com o SDK no dia-a-dia.',
  },
  {
    level: 'Pleno',
    q: 'Como você faz multi-turn conversation com o SDK?',
    a: 'Messages API é stateless — você mantém o histórico. Padrão: messages = []; enquanto True: adiciona input do usuário, cria mensagem, adiciona response do assistant ao array. Context management: conversas longas → contexto cresce → custo e latência aumentam. Estratégias: (1) Summarize histórico antigo: N mensagens antigas → 1 resumo via Haiku. (2) Sliding window: apenas últimas K mensagens + resumo. (3) Prompt caching: cachear parte estável (sistema, exemplos). Sem context management, chatbot de longa duração fica proibitivo em custo.',
    tip: 'Context management é o desafio operacional real de chatbots. Mencionar summarization com Haiku (barato) demonstra experiência com custo de tokens em produção.',
  },
  {
    level: 'Pleno',
    q: 'Como você testaria integração com o SDK Anthropic?',
    a: 'Estratégias de teste: (1) Mock do SDK: jest.mock() para client.messages.create, retornar responses realistas para cada cenário (tool_use, max_tokens, erros). (2) Fixture responses: capturar responses reais em dev, usar como fixtures em testes — determinístico e sem custo. (3) Testar tools separadamente: são funções regulares, testáveis de forma determinística. (4) Integration tests: com modelo real (Haiku — mais barato) em CI, para detectar mudanças na API. (5) Eval set: inputs + expected outputs para medir qualidade ao longo do tempo.',
    tip: 'Separar teste das tools (funções regulares) do teste do LLM (eval set) é a arquitetura de teste correta.',
  },
  {
    level: 'Pleno',
    q: 'O que é computer use e qual o caso de uso real mais comum?',
    a: 'Computer use é uma tool nativa do Claude: screenshot, click em coordenadas, digitar texto, pressionar teclas, scroll. Caso mais comum em 2025: automação de UI legacy — sistemas sem API (ERP antigo, sistemas governamentais) que exigem interação visual. Claude age como RPA inteligente. Outros casos: testing de UI end-to-end (automação visual), web research autônomo, preenchimento de formulários complexos. Fluxo: você implementa o executor (Playwright, PyAutoGUI) que recebe as ações do Claude e as executa. Claude nunca acessa o sistema diretamente.',
    tip: 'Posicionar como "RPA inteligente" ajuda entrevistadores a visualizar o valor de negócio. O fato de que você implementa o executor é frequentemente confundido.',
  },
  {
    level: 'Pleno',
    q: 'Como estrutura a Messages API para RAG?',
    a: 'Padrão para RAG: (1) System prompt com instruções (com cache_control para cachear). (2) User message: contexto recuperado + pergunta. Exemplo: messages=[{"role":"user","content":"Context:\n{chunks}\n\nQuestion: {query}"}]. Boas práticas: limite o contexto — chunks mais relevantes primeiro, truncar em max_tokens. Force citação: "Para cada afirmação, cite o documento de origem." Fallback: "Se a resposta não está no contexto, diga não sei." Cachear documentos estáticos de referência com cache_control — quick win de custo.',
    tip: 'Force citation + fallback "não sei" demonstra consciência de hallucination. Cache de documentos estáticos é o quick win de custo mais fácil em RAG.',
  },
  {
    level: 'Senior',
    q: 'Como usar o SDK para agente com memória persistente?',
    a: 'Dois tipos: (1) Curto prazo: messages array da sessão — multi-turn conversation, limitado pelo context window. (2) Longo prazo: antes de cada sessão, recuperar memórias relevantes via RAG em vector store (Qdrant, pgvector). Memórias passadas no system prompt ou início da conversa. Criação de memória: ao fim da sessão, summarization extrai fatos importantes → armazena no vector store com user_id. Próxima sessão: query por user_id + tópico atual → inject no contexto. Ferramentas: Mem0, Zep, ou implementação própria. Anti-pattern: colocar todo histórico de todas as sessões no context.',
    tip: 'Distinção curto prazo vs longo prazo é fundamental. Histórico completo de todas as sessões no context é o anti-pattern clássico — explode custo e qualidade degrada.',
  },
  {
    level: 'Pleno',
    q: 'Quais são os principais gotchas ao usar o SDK Anthropic?',
    a: '1. cache_control deve estar no FINAL do bloco a cachear — dinâmico no meio invalida tudo. 2. system vai como parâmetro top-level, NÃO como mensagem com role=system. 3. Tool result content deve ser string ou array de blocks — não mandar objeto direto. 4. Streaming + tools: acumular partial_json_delta até content_block_stop — nunca parsear deltas intermediários. 5. Computer use sem sandbox — risco crítico. 6. Extended thinking blocks: não remover do histórico multi-turn. 7. Batch API: não há como cancelar job em andamento — verificar inputs antes de submeter.',
    tip: 'O gotcha do system prompt como parâmetro top-level (não como mensagem) é o erro mais frequente de devs migrando do OpenAI SDK para o Anthropic SDK.',
  },
]

// ── Quick Reference Data ────────────────────────────────────────────────────────

const QUICK_REF_COLUMNS: QuickRefColumn[] = [
  {
    sections: [
      {
        title: 'MESSAGES API',
        entries: [
          { key: 'model', value: '"claude-sonnet-4-5" — sempre especificar versão', badge: 'required', badgeColor: '#ef4444' },
          { key: 'system', value: 'Parâmetro top-level — NÃO como message role=system', badge: '⚠️', badgeColor: '#f59e0b' },
          { key: 'messages', value: 'Array de {role: user/assistant, content: ...}', badge: 'stateless', badgeColor: '#c98346' },
          { key: 'max_tokens', value: 'Sempre definir — padrão muito conservador', badge: 'required', badgeColor: '#ef4444' },
          { key: 'stop_reason', value: 'end_turn | tool_use | max_tokens | stop_sequence', badge: 'tratar todos', badgeColor: '#f59e0b' },
        ],
      },
      {
        title: 'MODELOS (2025)',
        entries: [
          { key: 'Haiku 4.5', value: 'Rápido, 1x custo. Classificação, extração, workers', badge: 'barato', badgeColor: '#22c55e' },
          { key: 'Sonnet 4.5', value: 'Equilíbrio, ~8-10x. Tool use, RAG, chat — padrão', badge: '✓ padrão', badgeColor: '#c98346' },
          { key: 'Opus 4.5', value: 'Forte, ~30-50x. Raciocínio hard, código difícil', badge: 'caro', badgeColor: '#a855f7' },
          { key: 'Context window', value: '200k tokens. Max output: 8192 tokens', badge: 'limites', badgeColor: '#38bdf8' },
        ],
      },
      {
        title: 'PROMPT CACHING',
        entries: [
          { key: 'Cache hit', value: '10% do preço base — maximize isso', badge: '-90%', badgeColor: '#22c55e' },
          { key: 'Cache write', value: '125% do preço base — 1a chamada mais cara', badge: '+25%', badgeColor: '#f59e0b' },
          { key: 'TTL padrão', value: '5 minutos. Extended: 1 hora', badge: 'TTL', badgeColor: '#38bdf8' },
          { key: 'Ativação', value: 'cache_control: {type: "ephemeral"} no bloco', badge: 'configuração', badgeColor: '#c98346' },
          { key: 'Regra', value: 'Estático antes do dinâmico — ordem importa', badge: '⚠️ crítico', badgeColor: '#ef4444' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'TOOL USE',
        entries: [
          { key: 'Definition', value: 'tools: [{name, description, input_schema}]', badge: 'required', badgeColor: '#c98346' },
          { key: 'Response', value: 'content blocks: text + tool_use (id, name, input)', badge: 'structure', badgeColor: '#38bdf8' },
          { key: 'Tool result', value: 'role:user, {type:tool_result, tool_use_id, content}', badge: '⚠️ id igual', badgeColor: '#f59e0b' },
          { key: 'Loop', value: 'Continua enquanto stop_reason === "tool_use"', badge: 'SEAL', badgeColor: '#22c55e' },
          { key: 'Erro em tool', value: 'is_error: true em tool_result — modelo tenta outra abordagem', badge: 'graceful', badgeColor: '#a855f7' },
        ],
      },
      {
        title: 'RECURSOS AVANÇADOS',
        entries: [
          { key: 'Extended thinking', value: 'thinking={type:"enabled", budget_tokens:N} — raciocínio visível', badge: 'Sonnet+', badgeColor: '#c98346' },
          { key: 'Computer use', value: 'screenshot, click, type — executor em Docker', badge: 'sandbox!', badgeColor: '#ef4444' },
          { key: 'Batch API', value: '50% off, async, até 10k requests por batch', badge: '-50%', badgeColor: '#22c55e' },
          { key: 'Vision', value: 'image: {source:{type:base64/url, data:...}}', badge: 'PNG/JPEG', badgeColor: '#38bdf8' },
          { key: 'Streaming', value: 'stream=True. Acumular partial_json até content_block_stop', badge: 'async', badgeColor: '#a855f7' },
        ],
      },
      {
        title: 'GOTCHAS CRÍTICOS',
        entries: [
          { key: 'system prompt', value: 'Parâmetro top-level system={} — não role=system', badge: 'erro #1', badgeColor: '#ef4444' },
          { key: 'cache_control', value: 'Dinâmico no meio invalida tudo depois', badge: 'erro #2', badgeColor: '#ef4444' },
          { key: 'tool_use blocks', value: 'Adicionar TODOS de volta ao histórico antes de tool_results', badge: 'erro #3', badgeColor: '#ef4444' },
          { key: 'partial_json', value: 'Não fazer JSON.parse em deltas — só no content_block_stop', badge: 'streaming', badgeColor: '#f59e0b' },
          { key: 'thinking blocks', value: 'Não remover do histórico multi-turn', badge: 'thinking', badgeColor: '#c98346' },
        ],
      },
    ],
  },
]

// ── Mnemonics Data ──────────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'Stop reasons do Claude',
    trick: 'ETMS',
    expansion: [
      ['E', 'End_turn — Claude finalizou naturalmente. Resposta completa. Pare o loop.'],
      ['T', 'Tool_use — Claude quer chamar uma tool. Execute e continue o loop.'],
      ['M', 'Max_tokens — Resposta truncada. Pode pedir para continuar, mas atenção ao contexto.'],
      ['S', 'Stop_sequence — Delimitador atingido. Útil para respostas estruturadas com fronteiras.'],
    ],
    explanation: 'Cada stop_reason exige ação diferente no seu código. O erro mais comum é tratar todos como end_turn — quebra silenciosamente o loop de tool use em produção.',
    example: 'stop_reason === "tool_use" → extrair tool_use blocks → executar → adicionar tool_results → chamar novamente. stop_reason === "end_turn" → retornar resposta final.',
    why: 'ETMS lembra "E.T. phone home, Max Stop" — uma história absurda que ancora as 4 variações. A ordem é do mais comum (end_turn) ao menos comum (stop_sequence), facilitando priorização no código.',
  },
  {
    label: 'Prompt caching: o que cachear',
    trick: 'ESU',
    expansion: [
      ['E', 'Estático sempre primeiro — system prompt, exemplos few-shot, docs de referência.'],
      ['S', 'Sequência imutável garante hit — nada dinâmico entre os blocos cacheados.'],
      ['U', 'Usuário vai no final — mensagem dinâmica depois dos blocos cacheados.'],
    ],
    explanation: 'Cache hit = 10% do preço. Cache write = 125%. Para maximizar hits: estático no início, dinâmico no final. Qualquer mudança na sequência cacheada invalida o cache inteiro subsequente.',
    example: '[system prompt → cache_control] [few-shot examples → cache_control] [user message → sem cache]. Resultado: 99% das requests pagam apenas 10% dos tokens do sistema.',
    why: 'ESU é a ordem exata de montagem do prompt. "Estático, Sequência, Usuário" — você passa pelas camadas do mais estável ao mais volátil. Construir de trás pra frente destroça o cache.',
  },
  {
    label: 'Tool use loop',
    trick: 'SEAL',
    expansion: [
      ['S', 'Send — enviar mensagem com tools definition. Claude decide se usa tool ou responde diretamente.'],
      ['E', 'Execute — rodar TODAS as tools quando stop_reason === "tool_use". Capturar resultado ou erro.'],
      ['A', 'Add — adicionar response do assistant (com tool_use blocks) + tool_results ao histórico.'],
      ['L', 'Loop — voltar ao Send. Para quando stop_reason === "end_turn".'],
    ],
    explanation: 'O "A" de Add é onde a maioria dos bugs acontece: esquecer de adicionar a response do assistant ANTES dos tool_results causa erro 400. O histórico precisa da resposta completa, não só dos resultados.',
    example: 'Send → (stop_reason: tool_use) → Execute get_weather("SP") → Add {role:assistant, content:[...tool_use...]} + {role:user, content:[...tool_result...]} → Loop → (stop_reason: end_turn) → Resposta final.',
    why: 'SEAL lembra "selar" o loop — você fecha um ciclo a cada iteração. O acrônimo força lembrar que Add vem antes do próximo Send — a ordem não pode mudar.',
  },
]

// ── Mindmap Data ────────────────────────────────────────────────────────────────

const MINDMAP_CATEGORIES: MindmapCategory[] = [
  {
    label: 'Messages API',
    color: '#c98346',
    items: [
      { t: 'system (top-level)', k: true },
      { t: 'messages array', k: true },
      { t: 'stop_reason ETMS', k: true },
      { t: 'usage tokens', a: true },
      { t: 'content blocks', a: true },
    ],
  },
  {
    label: 'Tool Use',
    color: '#f59e0b',
    items: [
      { t: 'tools definition', k: true },
      { t: 'tool_use blocks', k: true },
      { t: 'SEAL loop', k: true },
      { t: 'is_error handling', a: true },
      { t: 'max_iterations', a: true },
    ],
  },
  {
    label: 'Prompt Caching',
    color: '#22c55e',
    items: [
      { t: 'cache_control: ephemeral', k: true },
      { t: 'Hit = 10% / Write = 125%', k: true },
      { t: 'ESU: estático antes dinâmico', k: true },
      { t: 'cache_read_input_tokens', a: true },
      { t: 'TTL 5min / 1h', a: true },
    ],
  },
  {
    label: 'Streaming',
    color: '#38bdf8',
    items: [
      { t: 'content_block_delta', k: true },
      { t: 'Acumular partial_json', k: true },
      { t: 'Parse no block_stop', k: true },
      { t: 'message.stream() TS', a: true },
      { t: 'Text ao vivo + tool bg', a: true },
    ],
  },
  {
    label: 'Recursos Avançados',
    color: '#a855f7',
    items: [
      { t: 'Extended thinking', k: true },
      { t: 'Batch API (50% off)', k: true },
      { t: 'Computer use sandbox', k: true },
      { t: 'Vision (base64/URL)', a: true },
      { t: 'Memória persistente RAG', a: true },
    ],
  },
  {
    label: 'Modelos',
    color: '#6366f1',
    items: [
      { t: 'Haiku: rápido/barato', k: true },
      { t: 'Sonnet: padrão ✓', k: true },
      { t: 'Opus: raciocínio hard', k: true },
      { t: 'Model routing Haiku/Sonnet', a: true },
      { t: 'Versão exata em produção', a: true },
    ],
  },
]

const MINDMAP_CHECKLIST = [
  'stop_reason está sendo verificado e tratado corretamente (ETMS)?',
  'system prompt vai como parâmetro top-level, não como mensagem?',
  'Tool use loop adiciona response do assistant antes dos tool_results?',
  'Streaming acumula partial_json até content_block_stop antes de parsear?',
  'Partes estáticas do prompt estão com cache_control (ESU)?',
  'cache_read_input_tokens está sendo monitorado para validar hit rate?',
  'Computer use roda em container Docker isolado do host?',
  'Context management implementado para evitar crescimento infinito?',
  'Modelo certo para cada task (Haiku para simples, Sonnet para default)?',
  'max_tokens está definido adequadamente (não 4096 para respostas curtas)?',
]

// ── Builders ────────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'Anthropic SDK',
    stackLabel: 'AI Engineering',
  }),
  'quick-ref': () => buildQuickRefPdf({
    columns: QUICK_REF_COLUMNS,
    skillName: 'Anthropic SDK',
    accentColor: C,
    stackLabel: 'AI Engineering',
    tagline: 'Messages API, modelos, caching, tool use e gotchas críticos em uma folha',
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'Anthropic SDK',
    stackLabel: 'AI Engineering',
    coverTitle: 'Anthropic SDK — 3 Truques que Grudam na Memória',
    coverSubtitle: 'ETMS, ESU e SEAL: stop reasons, caching e tool use loop em acrônimos que ficam.',
  }),
  mindmap: () => buildMindmapPdf({
    categories: MINDMAP_CATEGORIES,
    checklist: MINDMAP_CHECKLIST,
    accentColor: C,
    skillName: 'Anthropic SDK',
    stackLabel: 'AI Engineering',
    coverTitle: 'Anthropic SDK — Do Básico ao Expert',
    coverSubtitle: 'Mapa mental completo: Messages API, Tool Use, Caching, Streaming e Recursos Avançados',
    checklistTitle: 'Checklist de Domínio do SDK',
    checklistDesc: '10 perguntas para auto-avaliar seu domínio. Todas marcadas = pronto para qualquer entrevista AI engineering.',
  }),
}

// ── Componente ──────────────────────────────────────────────────────────────────

export default function AnthropicSdkPdfs() {
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
      {open && <PdfModal card={open} onClose={() => setOpen(null)} builders={PDF_BUILDERS} />}
    </>
  )
}

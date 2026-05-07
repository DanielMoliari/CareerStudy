'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildQuickRefPdf } from '@/components/pdfs/QuickRefPdf'
import type { QuickRefColumn } from '@/components/pdfs/QuickRefPdf'

// ── Paleta OpenAI ──────────────────────────────────────────────────────────────
const C   = '#10a37f'  // verde OpenAI — NUNCA omitir
const GRN = '#4ade80'
const RED = '#f87171'
const AMB = '#fbbf24'
const SKY = '#38bdf8'
const PRP = '#a78bfa'

// ── Cards de PDF ───────────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas sobre OpenAI SDK em entrevista',
    type: 'qa',
    pages: 10,
    description: 'Recuperação ativa: function calling vs structured output, strict mode e constrained decoding, modelos o1 vs GPT-4o, Batch API, prompt caching automático, Responses API, rate limits, fine-tuning e segurança. Cobre pleno e sênior.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'quick-ref',
    title: 'Quick Reference',
    subtitle: 'Endpoints, modelos, parâmetros e pegadinhas num cartão A4',
    type: 'quick-ref',
    pages: 1,
    description: 'Cartão de bolso: todos os endpoints, modelos com casos de uso, parâmetros de structured output, ciclo de tool use, pegadinhas críticas (tool_call_id, o1 sem system, cache threshold) e regras de custo.',
    icon: '02',
    goal: 'Consulta rápida',
  },
]

// ── Dados: Q&A ─────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'Qual a diferença entre function calling e structured output?',
    a: '<strong>Function calling (tools):</strong> o modelo decide chamar uma função do conjunto disponível. Você executa externamente e devolve o resultado. É um ciclo de turnos. <strong>Structured output (response_format):</strong> força a resposta final a seguir um schema JSON. Não há chamada externa. Use tools para agentes/integrações; structured output para extração direta.',
    tip: 'A confusão entre os dois é clássica — demonstrar o propósito de cada um e quando combinar diferencia pleno de sênior.',
  },
  {
    level: 'Pleno',
    q: 'Como garantir 100% de JSON válido na resposta?',
    a: 'response_format com strict: true + json_schema completo usa constrained decoding — o modelo só pode emitir tokens que mantêm o JSON válido. Requisitos: additionalProperties: false em todo objeto, todos os campos em required[], campos opcionais como type: ["T","null"]. Combine com validação runtime Zod/Pydantic.',
    tip: 'Constrained decoding (não pode emitir tokens fora do schema) demonstra entendimento técnico profundo.',
  },
  {
    level: 'Pleno',
    q: 'Quando usar o modelo o1 vs GPT-4o?',
    a: 'o1/o3: raciocínio profundo — matemática, código difícil, análise multi-step. Latência alta (10-60s), custo alto. Reasoning tokens são cobrados mas não retornados. GPT-4o: produção geral — chat, código, análise. Latência baixa, suporta streaming e system messages. Regra: comece com GPT-4o; se falhar em raciocínio, escale para o1.',
    tip: 'Saber que reasoning tokens são cobrados mas não aparecem na resposta é detalhe de produção que impressiona.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona o prompt caching automático da OpenAI?',
    a: 'Cache automático para prompts &gt; 1024 tokens (sem opt-in). Cache hit: latência ~50% menor, custo 50% off no prefixo. TTL ~1h. Estratégia: coloque estático primeiro (system prompt + exemplos), variável (query) no fim para maximizar hit rate.',
    tip: 'Estratégia "estático primeiro, variável no fim" demonstra entendimento prático de otimização.',
  },
  {
    level: 'Pleno',
    q: 'Quando usar Batch API vs chamadas síncronas?',
    a: 'Batch: workloads assíncronos — avaliações de dataset, embeddings em massa, classificação offline. Submete JSONL, processa em até 24h, 50% de desconto. Sync: real-time — chat, agente, feature de produto. Regra: se o usuário não está esperando agora, use Batch. 50% de desconto em escala representa economia significativa.',
    tip: 'Citar cenário concreto (ex: embeddings de 500k documentos) demonstra experiência prática.',
  },
  {
    level: 'Pleno',
    q: 'Como funciona o ciclo completo de tool use?',
    a: '4 etapas: (1) Você passa tools[] com name, description, parameters na chamada; (2) Modelo responde com finish_reason: "tool_calls" + array de tool_calls com name e arguments JSON; (3) Você executa a função real com os argumentos; (4) Devolve com role: "tool", tool_call_id obrigatório, content: resultado. Repete até finish_reason: "stop".',
    tip: 'tool_call_id é obrigatório na mensagem de resposta — sem ele a API retorna erro 400.',
  },
  {
    level: 'Pleno',
    q: 'O que é a Responses API e por que é o futuro?',
    a: 'API unificada (2024+) que substituirá Chat Completions e Assistants API. Diferenças: state server-side (OpenAI guarda o histórico), interface mais limpa para agentes, suporta todos os modelos em um endpoint, ferramentas built-in (web_search, code_interpreter) sem Assistants. Para novos projetos, prefira Responses API.',
    tip: 'Demonstrar conhecimento da roadmap da OpenAI é diferencial em entrevistas de AI engineering.',
  },
  {
    level: 'Pleno',
    q: 'Como fazer streaming eficiente com a OpenAI API?',
    a: 'Passe stream: true. Cada delta chega como chunk SSE com choices[0].delta.content. Para tools: acumule delta.tool_calls[0].function.arguments até finish_reason: "tool_calls". Para structured output + streaming: JSON chega parcialmente — só parse quando o stream terminar. Use AbortController para cancelar streams longos.',
    tip: 'Structured output + streaming são mutuamente exclusivos para parse — você só pode parsear no final.',
  },
  {
    level: 'Pleno',
    q: 'Como usar embeddings da OpenAI para busca semântica?',
    a: 'Indexação: POST /v1/embeddings com model="text-embedding-3-small" para cada documento, guarda vetor em banco vetorial (pgvector, Pinecone). Busca: embed a query, busca k-nearest neighbors por cosine similarity, retorna top-k documentos para RAG. text-embedding-3-small é melhor relação custo/qualidade. Matryoshka: pode truncar para 256 dims sem perda significativa.',
    tip: 'Saber que dimensionality reduction está disponível (matryoshka embeddings) é detalhe avançado.',
  },
  {
    level: 'Pleno',
    q: 'Como fazer fine-tuning com a OpenAI API?',
    a: 'Processo: (1) Preparar JSONL com messages[] — mínimo 50 exemplos, ideal 100+; (2) Upload via POST /v1/files; (3) Criar job com POST /v1/fine_tuning/jobs; (4) Monitor com GET events (training/validation loss); (5) Usar modelo via model="org:base-job-id". Quando usar: comportamento muito específico que few-shot não alcança, ou custo de tokens de exemplos repetidos fica alto.',
    tip: 'Fine-tuning gpt-4o-mini treinado com 1k exemplos pode superar gpt-4o no domínio específico a custo 30x menor.',
  },
  {
    level: 'Senior',
    q: 'Como implementar structured output com schema complexo?',
    a: 'Todo objeto precisa de additionalProperties: false. Todos os campos em required[]. Campos opcionais: type: ["string","null"]. Recursão é permitida para árvores aninhadas. Use zodToJsonSchema() — evita erros manuais. Limitação: sem anyOf discriminated unions (strict mode não suporta). Workaround: modelo separado para discriminar tipo, depois schema específico.',
    tip: 'A limitação de discriminated unions em strict mode é edge case de produção que poucos conhecem.',
  },
  {
    level: 'Senior',
    q: 'Como gerenciar rate limits e retry em produção?',
    a: 'Exponential backoff em erro 429: 1s, 2s, 4s, 8s com jitter. O SDK Node.js faz retry automático. Monitore RPM, TPM e RPD (três dimensões de rate limit). Paralelismo controlado: semáforo para não disparar mais requests que o tier permite. Para grandes volumes: Batch API evita o problema de rate limit completamente.',
    tip: 'SDK Node.js faz retry automático com backoff — mencionar mostra conhecimento do ecossistema.',
  },
  {
    level: 'Senior',
    q: 'Como estruturar um agente de longa duração com a API?',
    a: 'Threads persistentes (Responses API): state server-side. Tool schema rico: descriptions claras reduzem erro de seleção. Max steps limit: 10-20 para evitar loop infinito. Checkpoint/resume: salve estado após cada step para resumir em falha. Observabilidade: log de cada tool_call + resultado. Handoff humano: escale para revisão humana se o agente ficar preso.',
    tip: 'Checkpoint/resume e handoff humano diferenciam sistemas de produção de demos.',
  },
  {
    level: 'Senior',
    q: 'Como o constrained decoding funciona no structured output?',
    a: 'O schema JSON é compilado em um autômato finito (FSM) que representa todos os strings JSON válidos para aquele schema. Em cada step de geração, tokens que quebrariam o FSM têm probabilidade forçada a 0 antes do softmax. O modelo não pode "escapar" do schema — é garantia matemática, não instrução. Custo: leve overhead de compilação na primeira chamada.',
    tip: 'Explicar que é garantia estrutural (FSM), não instrução ao modelo, diferencia de quem usa apenas json_mode básico.',
  },
  {
    level: 'Senior',
    q: 'Como gerenciar custos sistematicamente em produção?',
    a: 'Model routing: gpt-4o-mini para triagem (30x mais barato), gpt-4o para produção geral, o1 só para raciocínio crítico. Prompt caching: estático primeiro para maximizar hit. Batch API: 50% off para assíncrono. max_tokens: sempre defina. Budget alerts no dashboard. tiktoken para estimar custo antes de enviar. Compression de histórico: resuma conversas longas.',
    tip: 'Model routing como estratégia primária (não só caching) demonstra abordagem arquitetural.',
  },
  {
    level: 'Senior',
    q: 'Como usar a Assistants API vs implementar agente manualmente?',
    a: 'Assistants API: abstrai threads, files, code interpreter — bom para protótipos. Problemas em produção: vendor lock-in, menos controle, custo de storage de threads, debugging difícil. Implementação manual (Chat Completions + Responses API): mais código, mais controle, mais observabilidade, fácil de testar, portável. Para produção séria: manual.',
    tip: 'Ter posição clara sobre Assistants vs manual com trade-offs demonstra maturidade arquitetural.',
  },
  {
    level: 'Senior',
    q: 'Como implementar observabilidade em chamadas OpenAI?',
    a: 'Logging estruturado: model, input_tokens, output_tokens, latência, finish_reason, tool_calls em cada request. Tracing: LangSmith, Braintrust ou Arize para spans de agentes multi-step. Métricas: custo/request, taxa de erro por finish_reason (content_filter = problema de segurança, length = max_tokens insuficiente), latência P50/P95/P99. Prompt versioning para rastrear qual versão está em produção.',
    tip: 'finish_reason como sinal de saúde do sistema (content_filter, length, tool_calls) demonstra profundidade.',
  },
  {
    level: 'Senior',
    q: 'Quais as diferenças entre GPT-4o, GPT-4o-mini e o1?',
    a: 'gpt-4o-mini: latência ~0.5-1s, custo 1x, adequado para triagem/classificação. gpt-4o: latência ~1-3s, custo ~15-30x, produção geral com streaming completo. o1: latência 10-60s, custo ~60-80x, raciocínio profundo, sem system message, streaming limitado. Reasoning tokens de o1 são cobrados mas não retornados — defina max_completion_tokens adequado.',
    tip: 'o1 não suporta system message é pegadinha clássica — mencionar demonstra experiência real.',
  },
  {
    level: 'Senior',
    q: 'Quais as melhores práticas de segurança ao usar a OpenAI API?',
    a: 'API key nunca no cliente — variável de ambiente server-side. Project-scoped keys (menor blast radius). Rate limiting por usuário no seu backend. Moderation API para filtrar input/output. Prompt injection: separe instrução de dados do usuário. PII: anonimize antes de enviar. Audit log de todos os requests para compliance e debugging de incidentes.',
    tip: 'Project-scoped keys (menor blast radius se vazada) é detalhe de segurança que poucos conhecem.',
  },
  {
    level: 'Senior',
    q: 'Como migrar de Chat Completions para a Responses API?',
    a: 'Principais diferenças: /v1/chat/completions → /v1/responses. Messages formato similar, mas Responses API suporta previous_response_id para state server-side. Tools mesmo formato; Responses API adiciona ferramentas built-in. Streaming com event format diferente. Estratégia: adapter pattern que abstrai a API — permite trocar o backend sem alterar o código do agente.',
    tip: 'Adapter pattern como estratégia de migração prepara para mudanças futuras sem reescrever o agente.',
  },
  {
    level: 'Senior',
    q: 'Como usar a API de áudio (Whisper e TTS) em produção?',
    a: 'Whisper (STT): POST /v1/audio/transcriptions com arquivo até 25MB. Para arquivos maiores: chunk em pedaços de 30s com sobreposição de 1s para não perder contexto em cortes. TTS: POST /v1/audio/speech, retorna stream de áudio (mp3). Para latência mínima: pipe stream direto ao cliente. Custo TTS: por caractere. Custo Whisper: por minuto de áudio.',
    tip: 'Chunking com sobreposição para arquivos grandes mostra experiência com limitações práticas da API.',
  },
]

// ── Dados: Quick Reference ──────────────────────────────────────────────────────

const QUICK_REF_COLS: QuickRefColumn[] = [
  {
    sections: [
      {
        title: 'Endpoints',
        entries: [
          { key: '/v1/chat/completions', value: 'Chat + tools (legado → usar)' },
          { key: '/v1/responses',        value: 'API unificada nova (prefira)' },
          { key: '/v1/embeddings',       value: 'Vetores semânticos' },
          { key: '/v1/batch',            value: '50% off, até 24h' },
          { key: '/v1/fine_tuning/jobs', value: 'Fine-tuning customizado' },
          { key: '/v1/moderations',      value: 'Filtro de conteúdo' },
          { key: '/v1/audio/transcriptions', value: 'Whisper STT' },
          { key: '/v1/audio/speech',     value: 'TTS' },
        ],
      },
      {
        title: 'Modelos',
        entries: [
          { key: 'gpt-4o-mini', value: 'Triagem, classif. barata',  badge: '1x custo',  badgeColor: GRN },
          { key: 'gpt-4o',      value: 'Produção geral',            badge: '~20x',      badgeColor: AMB },
          { key: 'o1-mini',     value: 'Raciocínio rápido',         badge: '~20x',      badgeColor: AMB },
          { key: 'o1',          value: 'Raciocínio máximo',         badge: '~60x',      badgeColor: RED },
          { key: 'embed-3-small', value: 'RAG barato',              badge: '~0.1x',     badgeColor: GRN },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Structured Output (strict)',
        entries: [
          { key: 'strict: true',        value: 'Obrigatório',                  badge: 'constrained decoding', badgeColor: C },
          { key: 'additionalProperties', value: 'false em todo objeto',         badge: 'obrigatório',          badgeColor: RED },
          { key: 'required[]',           value: 'Todos os campos',              badge: 'opcionais → null',     badgeColor: AMB },
          { key: 'zodToJsonSchema()',     value: 'Gere schema com Zod',          badge: 'evita erros',         badgeColor: GRN },
          { key: 'sem anyOf',            value: 'Não suportado em strict mode', badge: 'workaround: 2 estágios', badgeColor: RED },
        ],
      },
      {
        title: 'Ciclo de Tool Use',
        entries: [
          { key: '1. Definir tools[]',   value: 'name, description, parameters' },
          { key: '2. Model responde',    value: 'finish_reason: "tool_calls"' },
          { key: '3. Você executa',      value: 'parse arguments, run function' },
          { key: '4. role: "tool"',      value: 'tool_call_id OBRIGATÓRIO' },
          { key: '5. Model finaliza',    value: 'finish_reason: "stop"' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Pegadinhas críticas',
        entries: [
          { key: 'tool_call_id',        value: 'Obrigatório no role:tool',      badge: '400 sem ele',     badgeColor: RED },
          { key: 'o1 sem system msg',   value: 'Use developer message',         badge: 'documentar',      badgeColor: RED },
          { key: 'cache < 1024 tokens', value: 'Não ativa',                     badge: 'mínimo 1024',     badgeColor: AMB },
          { key: 'reasoning tokens',    value: 'Cobrados, não retornados',       badge: 'custo oculto',    badgeColor: AMB },
          { key: 'batch = 24h',         value: 'Não para real-time',             badge: 'assíncrono',      badgeColor: AMB },
          { key: 'Respostas API beta',  value: 'Schema mudou do Chat',           badge: 'verificar diff',  badgeColor: SKY },
        ],
      },
      {
        title: 'Otimização de custo',
        entries: [
          { key: 'Model routing',       value: 'mini → 4o → o1 progressivo',   badge: 'principal',       badgeColor: GRN },
          { key: 'Prompt caching',      value: 'Estático primeiro',             badge: '50% off hit',     badgeColor: GRN },
          { key: 'Batch API',           value: 'Workloads assíncronos',         badge: '50% off',         badgeColor: GRN },
          { key: 'max_tokens',          value: 'Sempre definir',                badge: 'evita desperdício', badgeColor: GRN },
          { key: 'tiktoken',            value: 'Estime custo antes de enviar',  badge: 'previsibilidade', badgeColor: SKY },
        ],
      },
    ],
  },
]

// ── Builders ────────────────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  'qa': () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'OpenAI SDK',
    stackLabel: 'AI / APIs',
  }),
  'quick-ref': () => buildQuickRefPdf({
    columns: QUICK_REF_COLS,
    accentColor: C,
    skillName: 'OpenAI SDK',
    stackLabel: 'AI / APIs',
    tagline: 'Endpoints, modelos, structured output e pegadinhas de produção',
  }),
}

// ── Componente ──────────────────────────────────────────────────────────────────

export default function OpenaiSdkPdfs() {
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

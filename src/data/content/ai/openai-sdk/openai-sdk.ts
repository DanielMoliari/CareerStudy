import type { SkillContent } from '@/types'

const openaiSdk: SkillContent = {
  tagline: 'SDK oficial para GPT-4o/o1: chat, function calling, structured output, assistants e Responses API.',
  why: 'OpenAI ainda lidera market share. Saber Responses API, structured output strict mode, o1 reasoning e Batch API é diferencial em entrevistas de AI engineering.',
  summary: 'OpenAI SDK (Python e TypeScript) expõe Chat Completions, Responses API (sucessora), Assistants, Embeddings, Images, Audio, Batch e Realtime. Foco da entrevista: function calling com strict mode, structured output via response_format + json_schema, modelos o1/o3 com reasoning tokens, Batch API para 50% off e prompt caching automático para workloads repetitivos.',

  keypoints: [
    { title: 'Chat Completions', body: 'POST /v1/chat/completions — messages com role (system/user/assistant/tool), model, tools, response_format. API estável há anos. Base de quase tudo.' },
    { title: 'Responses API', body: 'Sucessora unificada (2024+). Mais limpa, suporta state server-side, melhor para agentes. Migração gradual — verifique documentação.' },
    { title: 'Structured output', body: 'response_format={"type":"json_schema","json_schema":{...,"strict":true}}. Garante 100% JSON válido seguindo schema. Use Zod/Pydantic para gerar o schema.' },
    { title: 'Function calling strict', body: 'tools com strict: true. Combina com response do modelo: zero JSON inválido. Exige additionalProperties: false em todo objeto.' },
    { title: 'Modelos reasoning (o1/o3)', body: 'Pensa antes de responder. Tokens "reasoning" são cobrados mas não retornados. Bom para math, code, análise. Latência alta (10-60s).' },
    { title: 'Prompt caching automático', body: 'OpenAI cacheia automaticamente prompts > 1024 tokens (sem opt-in). Hit reduz latência ~50% e cobra 50% off no prefixo cacheado.' },
    { title: 'Batch API', body: 'Submete arquivo JSONL com requests, processa em até 24h, 50% off. Bom para eval, embeddings em massa, classificação de catálogos.' },
    { title: 'Assistants API', body: 'Abstrai threads, files, code interpreter, retrieval. Útil para prototipar; em produção muitos preferem montar do zero para ter controle.' },
  ],

  gotchas: [
    'response_format json_schema exige strict: true e additionalProperties: false em todos os objetos — falha silenciosa se faltar.',
    'o1/o3 não suportam system message nem streaming (em algumas versões) — cheque a documentação do modelo específico.',
    'Não confundir tools (function calling) com response_format (structured output) — propósitos diferentes.',
    'Tool message precisa de tool_call_id — sem isso a API rejeita com erro.',
    'Esquecer max_completion_tokens em o1 (reasoning_tokens contam): pode estourar sem resposta visível.',
    'Migrar de chat.completions para responses sem ler diff — schemas mudaram.',
    'Prompt caching só ativa com prefixo > 1024 tokens — prompts curtos não são cacheados.',
    'Batch API tem janela de 24h — não use para workloads real-time.',
  ],

  interview: [
    {
      level: 'pleno',
      q: 'Qual a diferença entre function calling e structured output?',
      a: '<p><b>Function calling (tools)</b>: o modelo decide chamar uma função do conjunto disponível. Você executa a função externamente e devolve o resultado. É um ciclo de turnos.</p><p><b>Structured output (response_format)</b>: força a <em>resposta final</em> do modelo a seguir um schema JSON. Não há chamada externa — é o output direto do modelo.</p><p>Use <code>tools</code> para agentes e integrações onde você precisa executar código. Use <code>response_format</code> para extração de dados estruturados em uma única chamada.</p>',
      tip: 'A confusão entre os dois é clássica em entrevistas — demonstrar o propósito de cada um e quando combinar os dois diferencia pleno de sênior.',
    },
    {
      level: 'pleno',
      q: 'Como garantir 100% de JSON válido na resposta?',
      a: '<p>Três mecanismos combinados:</p><ol><li><b>response_format com strict: true</b> + json_schema completo — usa constrained decoding (o modelo só pode emitir tokens que mantêm o JSON válido).</li><li><b>additionalProperties: false</b> em todo objeto do schema e todos os campos em <code>required</code> (use union com null para opcionais).</li><li><b>Validação runtime</b> com Zod/Pydantic após receber — rejeita e faz retry com feedback se inválido.</li></ol><p>Strict mode é a garantia mais forte — não há como o modelo "escapar" do schema.</p>',
      tip: 'Mencionar constrained decoding (o modelo não pode emitir tokens fora do schema) demonstra entendimento técnico profundo.',
    },
    {
      level: 'pleno',
      q: 'Quando usar o modelo o1 vs GPT-4o?',
      a: '<p><b>o1/o3</b>: tarefas que exigem raciocínio profundo — matemática, código difícil, análise multi-step, debugging, planejamento. Latência alta (10-60s) e custo alto, mas qualidade em problemas hard sobe muito. Reasoning tokens são cobrados mas não retornados.</p><p><b>GPT-4o/4o-mini</b>: tarefas rápidas — FAQ, extração, classificação, chat. Latência baixa, custo menor, suporta streaming e system messages.</p><p>Regra prática: tente GPT-4o primeiro; se errar em raciocínio, escale para o1.</p>',
      tip: 'Saber que reasoning tokens são cobrados mas não aparecem na resposta é detalhe de produção que impressiona.',
    },
    {
      level: 'pleno',
      q: 'Como funciona o prompt caching automático da OpenAI?',
      a: '<p>OpenAI cacheia automaticamente os primeiros tokens de prompts com mais de 1024 tokens. Não requer opt-in ou configuração.</p><ul><li><b>Cache hit</b>: reduz latência ~50% e cobra 50% do preço normal no prefixo cacheado.</li><li><b>TTL</b>: aproximadamente 1 hora após último uso.</li><li><b>Granularidade</b>: o cache é por prefixo — estruture seu prompt com o estático primeiro (system prompt + exemplos) e o variável (query do usuário) no final.</li></ul><p>Para maximizar hit rate: mantenha system prompt e exemplos idênticos entre chamadas; só varie a última mensagem.</p>',
      tip: 'Lembrar da estratégia "estático primeiro, variável no fim" mostra entendimento prático de otimização de custo.',
    },
    {
      level: 'pleno',
      q: 'Quando usar Batch API vs chamadas síncronas?',
      a: '<p><b>Batch API</b>: workloads assíncronos — avaliações de dataset, embeddings de catálogo, classificação em massa, geração de conteúdo offline. Submete JSONL, espera até 24h, paga 50% menos.</p><p><b>Síncronas</b>: real-time — chat, agente, feature de produto. Tem rate limits maiores e custo cheio.</p><p>Regra: se o usuário não está esperando a resposta agora, use Batch. 50% de desconto em workloads grandes representa economia significativa.</p>',
      tip: 'Citar um cenário concreto (ex: "gerar embeddings de 500k documentos de produto") demonstra experiência prática.',
    },
    {
      level: 'pleno',
      q: 'O que é a Responses API e por que é o futuro do SDK?',
      a: '<p>A Responses API (2024+) é a API unificada que substituirá Chat Completions e Assistants API. Principais diferenças:</p><ul><li>State server-side: OpenAI guarda o histórico da thread por você (sem precisar reenviar toda a conversa).</li><li>Interface mais limpa e consistente para agentes.</li><li>Suporta todos os modelos e ferramentas em um único endpoint.</li><li>Integração nativa com file search e code interpreter sem precisar dos Assistants.</li></ul><p>Para novos projetos, use Responses API. Para projetos existentes, Chat Completions continua funcionando indefinidamente.</p>',
      tip: 'Demonstrar conhecimento sobre a roadmap da OpenAI (Responses como futuro) é diferencial em entrevistas de AI engineering.',
    },
    {
      level: 'pleno',
      q: 'Como funciona o ciclo de tool use (function calling)?',
      a: '<p>O ciclo de tool use tem 4 etapas:</p><ol><li><b>Definir ferramentas</b>: passe <code>tools</code> com name, description e parameters (JSON Schema) na chamada.</li><li><b>Modelo decide chamar</b>: resposta chega com <code>finish_reason: "tool_calls"</code> e array de tool_calls com name + arguments JSON.</li><li><b>Você executa</b>: chame a função real com os argumentos e capture o resultado.</li><li><b>Devolver resultado</b>: adicione mensagem <code>{role: "tool", tool_call_id: ..., content: resultado}</code> e faça nova chamada.</li></ol><p>O ciclo repete até <code>finish_reason: "stop"</code>.</p>',
      tip: 'Mencionar que tool_call_id é obrigatório na mensagem de resposta (sem ele a API rejeita) mostra detalhe prático.',
    },
    {
      level: 'pleno',
      q: 'Como usar embeddings da OpenAI para busca semântica?',
      a: '<p>Fluxo básico de busca semântica com OpenAI Embeddings:</p><ol><li><b>Indexação</b>: POST /v1/embeddings com model="text-embedding-3-small" para cada documento → guarda vetor (1536 dims) em banco vetorial (pgvector, Pinecone, Weaviate).</li><li><b>Busca</b>: embed a query do usuário → busca vizinhos mais próximos (cosine similarity) no banco → retorna top-k documentos.</li><li><b>RAG</b>: insere documentos recuperados no contexto do LLM como grounding.</li></ol><p>text-embedding-3-small é ótima relação custo/qualidade. text-embedding-3-large para máxima precisão.</p>',
      tip: 'Saber que dimensionality reduction está disponível (matryoshka embeddings) — você pode truncar para 256 dims sem perda significativa.',
    },
    {
      level: 'senior',
      q: 'Como implementar structured output com schema complexo?',
      a: '<p>Para schemas complexos com structured output strict mode:</p><ul><li>Todo objeto precisa de <code>additionalProperties: false</code>.</li><li>Todos os campos devem estar em <code>required</code> — campos opcionais viram <code>type: ["string", "null"]</code>.</li><li>Recursão é permitida para árvores/listas aninhadas.</li><li>Use Zod + <code>zodToJsonSchema()</code> para gerar o schema — evita erros manuais.</li></ul><p>Limitações: sem <code>anyOf</code> discriminated unions (strict mode não suporta). Workaround: modelo separado para discriminar tipo, depois outro para o schema específico.</p>',
      tip: 'Saber a limitação de discriminated unions em strict mode demonstra experiência com edge cases de produção.',
    },
    {
      level: 'senior',
      q: 'Como fazer streaming eficiente com a OpenAI API?',
      a: '<p>Streaming com Server-Sent Events (SSE) via <code>stream: true</code>:</p><ul><li>Cada delta chega como chunk JSON com <code>choices[0].delta.content</code>.</li><li>Com tools: <code>delta.tool_calls[0].function.arguments</code> chega parcialmente — acumule até <code>finish_reason: "tool_calls"</code>.</li><li>Structured output + streaming: o JSON chega parcialmente — você só pode parsear quando o stream terminar.</li><li>Use <code>AbortController</code> para cancelar streams longos se o usuário navegar.</li></ul><p>Padrão em produção: pipe SSE direto para o cliente via ReadableStream (sem buffer intermediário) para menor latência percebida.</p>',
      tip: 'Mencionar que structured output + streaming são mutuamente exclusivos (você só pode parsear no final) é detalhe importante.',
    },
    {
      level: 'senior',
      q: 'Como gerenciar rate limits e retry em produção?',
      a: '<p>Estratégias para rate limits da OpenAI:</p><ul><li><b>Exponential backoff</b>: em erro 429, aguarde 1s, 2s, 4s, 8s... com jitter. O SDK oficial do Node.js faz isso automaticamente.</li><li><b>Tier de rate limit</b>: RPM (requests/min), TPM (tokens/min), RPD (requests/day). Monitore os três.</li><li><b>Paralelismo controlado</b>: use semáforo/limiter para não disparar mais requests que o tier permite.</li><li><b>Batch API</b>: para workloads grandes, Batch evita o problema de rate limit completamente.</li><li><b>Múltiplas API keys</b>: apenas em orgs com múltiplas keys — rotacione para aumentar throughput efetivo.</li></ul>',
      tip: 'Mencionar que o SDK Node.js faz retry automático com backoff demonstra conhecimento do ecossistema.',
    },
    {
      level: 'senior',
      q: 'Como estruturar um agente com a OpenAI API para tarefas longas?',
      a: '<p>Arquitetura para agentes de longa duração:</p><ol><li><b>Threads persistentes</b> (Responses API): state server-side — não reenvie todo o histórico.</li><li><b>Tool schema rico</b>: descriptions claras reduzem erro de seleção de ferramenta.</li><li><b>Max steps limit</b>: limite de iterações para evitar loop infinito (padrão: 10-20 steps).</li><li><b>Checkpoint/resume</b>: salve estado após cada step para poder resumir em falha.</li><li><b>Observabilidade</b>: log de cada tool_call + resultado para debugging.</li><li><b>Handoff humano</b>: se o agente ficar preso, escale para revisão humana.</li></ol>',
      tip: 'Checkpoint/resume e handoff humano são os diferenciais de sistemas de produção vs demos.',
    },
    {
      level: 'senior',
      q: 'Quais as diferenças entre GPT-4o, GPT-4o-mini e o1?',
      a: '<p>Comparação dos modelos principais:</p><table style="font-size:13px"><tr><th></th><th>GPT-4o</th><th>GPT-4o-mini</th><th>o1</th></tr><tr><td>Raciocínio</td><td>Bom</td><td>Adequado</td><td>Excelente</td></tr><tr><td>Latência</td><td>~1-3s</td><td>~0.5-1s</td><td>10-60s</td></tr><tr><td>Custo</td><td>Médio</td><td>Baixo</td><td>Alto</td></tr><tr><td>Streaming</td><td>Sim</td><td>Sim</td><td>Limitado</td></tr><tr><td>System msg</td><td>Sim</td><td>Sim</td><td>Não</td></tr></table><p>Regra: GPT-4o-mini para triagem/classificação barata, GPT-4o para produção geral, o1 quando raciocínio profundo é essencial.</p>',
      tip: 'Citar que o1 não suporta system message é pegadinha clássica — mencionar demonstra experiência real.',
    },
    {
      level: 'senior',
      q: 'Como usar a Assistants API vs implementar o agente manualmente?',
      a: '<p>Assistants API abstrai: threads, mensagens, run lifecycle, file search, code interpreter. Bom para protótipos rápidos.</p><p><b>Problemas em produção:</b></p><ul><li>Vendor lock-in: difícil migrar para outro modelo/provider.</li><li>Menos controle: não dá para injetar lógica entre steps.</li><li>Custo de storage: threads ficam armazenadas na OpenAI.</li><li>Debugging difícil: menos visibilidade no que o agente está fazendo.</li></ul><p><b>Implementação manual (Chat Completions + Responses API):</b> mais código, mais controle, mais observabilidade, mais fácil de testar, portável.</p><p>Para produção séria: manual. Para PoC/demo: Assistants API.</p>',
      tip: 'A decisão Assistants vs manual é uma escolha arquitetural recorrente — ter uma posição clara com trade-offs demonstra maturidade.',
    },
    {
      level: 'senior',
      q: 'Como fazer fine-tuning com a OpenAI API?',
      a: '<p>Processo de fine-tuning:</p><ol><li><b>Preparar dataset</b>: arquivo JSONL com <code>{"messages": [{role, content}...]}</code> — mínimo ~50 exemplos, ideal 100+.</li><li><b>Upload</b>: POST /v1/files com purpose="fine-tune".</li><li><b>Criar job</b>: POST /v1/fine_tuning/jobs com model e training_file.</li><li><b>Monitor</b>: GET /v1/fine_tuning/jobs/{id}/events — training/validation loss.</li><li><b>Usar modelo</b>: model="{org}:{base}-{job-id}" nas chamadas normais.</li></ol><p>Quando usar: comportamento muito específico que few-shot não alcança, custo de tokens de exemplos repetidos é alto, ou precisa de latência menor com modelo menor.</p>',
      tip: 'Fine-tuning GPT-4o-mini treinado com 1000 exemplos pode superar GPT-4o no domínio específico a custo muito menor.',
    },
    {
      level: 'senior',
      q: 'Como implementar observabilidade em chamadas OpenAI em produção?',
      a: '<p>Stack de observabilidade para OpenAI em produção:</p><ul><li><b>Logging estruturado</b>: logar model, input_tokens, output_tokens, latência, finish_reason, tool_calls em cada request.</li><li><b>Tracing</b>: LangSmith, Braintrust, ou Arize para rastrear spans de agentes multi-step.</li><li><b>Métricas</b>: custo por request, taxa de erro (finish_reason: "content_filter", etc.), latência P50/P95/P99.</li><li><b>Alertas</b>: custo acima de threshold, taxa de erro > N%, latência degradada.</li><li><b>Prompt versioning</b>: PromptLayer ou similar para rastrear qual versão do prompt está em produção.</li></ul>',
      tip: 'Mencionar finish_reason como sinal de saúde (content_filter indica problema de segurança, length indica max_tokens insuficiente) demonstra profundidade.',
    },
    {
      level: 'senior',
      q: 'Como o constrained decoding funciona no structured output?',
      a: '<p>Constrained decoding é a técnica que garante 100% de JSON válido no strict mode:</p><ol><li>O schema JSON é compilado em um automato finito (FSM) que representa todos os strings JSON válidos para aquele schema.</li><li>Em cada passo de geração, o modelo só pode emitir tokens que mantêm o FSM em estado válido.</li><li>Tokens inválidos (que quebrariam o JSON) têm probabilidade forçada a 0 antes do softmax.</li><li>O modelo nunca pode "escapar" do schema — é garantia matemática, não instrução.</li></ol><p>Diferente de instruction tuning (pedir JSON no prompt), constrained decoding é garantia estrutural. Custo: leve overhead de compilação do schema na primeira chamada.</p>',
      tip: 'Explicar que é garantia estrutural (FSM), não instrução ao modelo, diferencia de quem usa apenas json_mode básico.',
    },
    {
      level: 'senior',
      q: 'Como gerenciar custos de forma sistemática em produção com OpenAI?',
      a: '<p>Estratégias de controle de custo:</p><ul><li><b>Model routing</b>: use GPT-4o-mini para triagem (30x mais barato), escale para GPT-4o só quando necessário.</li><li><b>Prompt caching</b>: estruture prompts com estático primeiro para maximizar cache hits.</li><li><b>Batch API</b>: 50% off para workloads assíncronos.</li><li><b>max_tokens</b>: sempre defina — evita respostas longas desnecessárias.</li><li><b>Budget alerts</b>: configure no dashboard da OpenAI — alertas em 80% e hard limit.</li><li><b>Token counting</b>: use <code>tiktoken</code> para estimar custo antes de enviar.</li><li><b>Compression de histórico</b>: resuma conversas longas em vez de reenviar tudo.</li></ul>',
      tip: 'Citar model routing como padrão primário (não apenas caching) demonstra abordagem arquitetural, não só tática.',
    },
    {
      level: 'senior',
      q: 'Como usar a API de áudio (Whisper + TTS) em produção?',
      a: '<p>OpenAI oferece dois serviços de áudio:</p><p><b>Whisper (STT)</b>: POST /v1/audio/transcriptions com o arquivo de áudio. Suporta mp3, mp4, wav, m4a até 25MB. Para arquivos maiores, chunk em pedaços de 30s com sobreposição de 1s para não perder contexto em cortes.</p><p><b>TTS</b>: POST /v1/audio/speech com model, voice, input. Retorna stream de áudio (mp3 padrão). Vozes: alloy, echo, fable, onyx, nova, shimmer. Para latência mínima: stream o áudio enquanto gera.</p><p>Custo TTS: por caractere de input. Custo Whisper: por minuto de áudio.</p>',
      tip: 'Mencionar a técnica de chunking com sobreposição para arquivos grandes mostra experiência com limitações práticas da API.',
    },
    {
      level: 'senior',
      q: 'Quais são as melhores práticas de segurança ao usar a OpenAI API?',
      a: '<p>Segurança em produção com OpenAI:</p><ul><li><b>API key segura</b>: nunca exponha no cliente. Use variável de ambiente server-side. Rotacione periodicamente.</li><li><b>Project keys</b>: use project-scoped keys em vez de org-wide — menor blast radius se vazada.</li><li><b>Rate limiting por usuário</b>: implemente no seu backend para evitar abuso.</li><li><b>Moderação</b>: use /v1/moderations para filtrar input/output antes de exibir.</li><li><b>Prompt injection</b>: separe instrução de dados do usuário; valide outputs.</li><li><b>PII</b>: não envie dados sensíveis ao modelo; anonimize antes se necessário.</li><li><b>Audit log</b>: logar todos os requests para compliance e debugging de incidentes.</li></ul>',
      tip: 'Mencionar project-scoped keys (menor blast radius) é detalhe de segurança que poucos conhecem.',
    },
    {
      level: 'senior',
      q: 'Como migrar de Chat Completions para a Responses API?',
      a: '<p>Principais diferenças na migração:</p><ul><li><b>Endpoint</b>: /v1/chat/completions → /v1/responses.</li><li><b>Messages</b>: mesmo formato, mas Responses API suporta <code>previous_response_id</code> para state server-side.</li><li><b>Tools</b>: mesmo formato; Responses API adiciona ferramentas built-in (web_search, code_interpreter).</li><li><b>Streaming</b>: event format mudou — use SSE events tipados.</li><li><b>Response object</b>: campos renomeados — leia o changelog.</li></ul><p>Estratégia de migração: wrapper que abstrai a API (adapter pattern) permite trocar o backend sem alterar o código do agente.</p>',
      tip: 'Sugerir adapter pattern como estratégia de migração demonstra pensamento arquitetural — prepara para mudanças futuras.',
    },
  ],

  diagrams: [
    {
      title: 'Ciclo Completo de Tool Use (Function Calling)',
      caption: 'O modelo não executa — apenas decide e formata. Você executa.',
      html: `
<style>
.oai-flow { font-family: 'Space Grotesk', sans-serif; background: #0f172a; border-radius: 12px; padding: 20px; max-width: 560px; margin: 0 auto; }
.oai-step { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 4px; }
.oai-badge { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; margin-top: 4px; }
.oai-step-body { flex: 1; background: #1e293b; border-radius: 8px; padding: 10px 14px; }
.oai-step-title { font-size: 13px; font-weight: 700; color: #e2e8f0; margin-bottom: 4px; }
.oai-step-desc { font-size: 12px; color: #64748b; line-height: 1.5; }
.oai-step-code { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #7dd3fc; margin-top: 6px; background: #0f172a; padding: 4px 8px; border-radius: 4px; }
.oai-arrow { text-align: left; color: #334155; font-size: 20px; margin: 0 0 4px 40px; }
.oai-note { background: #1a3d2e; border: 1px solid #22c55e; border-radius: 6px; padding: 8px 12px; font-size: 11px; color: #86efac; margin-top: 12px; }
</style>
<div class="oai-flow">
  <div class="oai-step">
    <div class="oai-badge" style="background:#10a37f;color:#fff">1</div>
    <div class="oai-step-body">
      <div class="oai-step-title">Você define as ferramentas</div>
      <div class="oai-step-desc">Passa <code>tools: [{name, description, parameters}]</code> na chamada</div>
    </div>
  </div>
  <div class="oai-arrow">↓</div>
  <div class="oai-step">
    <div class="oai-badge" style="background:#6366f1;color:#fff">2</div>
    <div class="oai-step-body">
      <div class="oai-step-title">Modelo decide chamar</div>
      <div class="oai-step-desc">finish_reason: "tool_calls" + tool_calls[{name, arguments}]</div>
    </div>
  </div>
  <div class="oai-arrow">↓</div>
  <div class="oai-step">
    <div class="oai-badge" style="background:#f59e0b;color:#fff">3</div>
    <div class="oai-step-body">
      <div class="oai-step-title">Você executa a função</div>
      <div class="oai-step-desc">Parse arguments, chame o código real, capture resultado</div>
      <div class="oai-step-code">const result = await myFunction(JSON.parse(arguments))</div>
    </div>
  </div>
  <div class="oai-arrow">↓</div>
  <div class="oai-step">
    <div class="oai-badge" style="background:#ec4899;color:#fff">4</div>
    <div class="oai-step-body">
      <div class="oai-step-title">Você devolve o resultado</div>
      <div class="oai-step-desc">Mensagem role: "tool" com tool_call_id obrigatório</div>
      <div class="oai-step-code">&#123;role:"tool", tool_call_id: id, content: result&#125;</div>
    </div>
  </div>
  <div class="oai-arrow">↓</div>
  <div class="oai-step">
    <div class="oai-badge" style="background:#10a37f;color:#fff">5</div>
    <div class="oai-step-body">
      <div class="oai-step-title">Modelo gera resposta final</div>
      <div class="oai-step-desc">finish_reason: "stop" — usa o resultado da ferramenta</div>
    </div>
  </div>
  <div class="oai-note">tool_call_id é obrigatório na mensagem de resposta — sem ele a API retorna erro 400</div>
</div>`,
    },
    {
      title: 'Structured Output: Schema → Constrained Decoding',
      caption: 'Strict mode é garantia estrutural — não instrução ao modelo.',
      html: `
<style>
.oai-so { font-family: 'Space Grotesk', sans-serif; background: #0f172a; border-radius: 12px; padding: 20px; max-width: 560px; margin: 0 auto; }
.oai-col { background: #1e293b; border-radius: 8px; padding: 14px; margin-bottom: 10px; }
.oai-col-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; }
.oai-code { font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #94a3b8; line-height: 1.6; }
.oai-hl { color: #10a37f; }
.oai-hlr { color: #f87171; }
.oai-hly { color: #fbbf24; }
.oai-badge-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
.oai-badge-item { font-size: 11px; padding: 3px 10px; border-radius: 4px; font-weight: 600; }
</style>
<div class="oai-so">
  <div class="oai-col">
    <div class="oai-col-title" style="color:#10a37f">Schema correto (strict mode)</div>
    <div class="oai-code">
      <span class="oai-hl">response_format</span>: {<br>
      &nbsp;&nbsp;type: <span class="oai-hly">"json_schema"</span>,<br>
      &nbsp;&nbsp;json_schema: {<br>
      &nbsp;&nbsp;&nbsp;&nbsp;name: <span class="oai-hly">"extraction"</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span class="oai-hl">strict: true</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;schema: {<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;type: "object",<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="oai-hl">additionalProperties: false</span>,<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;required: ["name", "age"],<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;properties: {<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name: { type: "string" },<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;age: { <span class="oai-hly">type: ["number","null"]</span> }<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;}<br>
      &nbsp;&nbsp;&nbsp;&nbsp;}<br>
      &nbsp;&nbsp;}<br>
      }
    </div>
  </div>
  <div class="oai-badge-row">
    <span class="oai-badge-item" style="background:#1a3d2e;color:#86efac">strict: true obrigatório</span>
    <span class="oai-badge-item" style="background:#1a3d2e;color:#86efac">additionalProperties: false</span>
    <span class="oai-badge-item" style="background:#1a3d2e;color:#86efac">opcionals como ["T","null"]</span>
    <span class="oai-badge-item" style="background:#3d1a1a;color:#fca5a5">sem anyOf discriminated unions</span>
  </div>
</div>`,
    },
    {
      title: 'Modelos OpenAI: Quando Usar Cada Um',
      caption: 'Roteamento correto reduz custo em 10-30x sem perda de qualidade.',
      html: `
<style>
.oai-models { font-family: 'Space Grotesk', sans-serif; background: #0f172a; border-radius: 12px; padding: 20px; max-width: 580px; margin: 0 auto; }
.oai-model-row { display: grid; grid-template-columns: 130px 1fr 80px 80px; gap: 8px; margin-bottom: 6px; align-items: center; font-size: 12px; }
.oai-model-header { color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; border-bottom: 1px solid #1e293b; padding-bottom: 6px; margin-bottom: 8px; }
.oai-model-name { font-family: 'JetBrains Mono', monospace; color: #10a37f; font-size: 12px; font-weight: 700; }
.oai-model-use { color: #64748b; }
.oai-model-lat { text-align: center; border-radius: 4px; padding: 3px 6px; font-size: 11px; font-weight: 600; }
.oai-model-cost { text-align: center; font-size: 11px; font-weight: 700; }
.oai-lat-low { background: #1a3d2e; color: #4ade80; }
.oai-lat-mid { background: #3d2000; color: #fb923c; }
.oai-lat-high { background: #3d1a1a; color: #f87171; }
</style>
<div class="oai-models">
  <div class="oai-model-row oai-model-header"><span>Modelo</span><span>Melhor para</span><span>Latência</span><span>Custo rel.</span></div>
  <div class="oai-model-row">
    <span class="oai-model-name">gpt-4o-mini</span>
    <span class="oai-model-use">Triagem, classificação, extração simples</span>
    <span class="oai-model-lat oai-lat-low">Baixa</span>
    <span class="oai-model-cost" style="color:#4ade80">$</span>
  </div>
  <div class="oai-model-row">
    <span class="oai-model-name">gpt-4o</span>
    <span class="oai-model-use">Produção geral, chat, código, análise</span>
    <span class="oai-model-lat oai-lat-mid">Média</span>
    <span class="oai-model-cost" style="color:#fb923c">$$$</span>
  </div>
  <div class="oai-model-row">
    <span class="oai-model-name">o1-mini</span>
    <span class="oai-model-use">Raciocínio rápido, math, lógica</span>
    <span class="oai-model-lat oai-lat-mid">Alta</span>
    <span class="oai-model-cost" style="color:#fb923c">$$$</span>
  </div>
  <div class="oai-model-row">
    <span class="oai-model-name">o1</span>
    <span class="oai-model-use">Raciocínio profundo, código difícil</span>
    <span class="oai-model-lat oai-lat-high">Muito alta</span>
    <span class="oai-model-cost" style="color:#f87171">$$$$</span>
  </div>
  <div class="oai-model-row">
    <span class="oai-model-name">embedding-3-small</span>
    <span class="oai-model-use">Busca semântica, RAG, clustering</span>
    <span class="oai-model-lat oai-lat-low">Baixa</span>
    <span class="oai-model-cost" style="color:#4ade80">$</span>
  </div>
</div>`,
    },
    {
      title: 'Prompt Caching: Estrutura Ótima',
      caption: 'Estático no começo, variável no fim — maximiza cache hits.',
      html: `
<style>
.oai-cache { font-family: 'JetBrains Mono', monospace; font-size: 12px; background: #0f172a; border-radius: 12px; padding: 20px; max-width: 560px; margin: 0 auto; }
.oai-cache-section { margin-bottom: 10px; border-radius: 8px; padding: 10px 14px; font-size: 12px; }
.oai-cache-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 6px; }
.oai-cache-content { color: #e2e8f0; line-height: 1.6; }
.oai-cache-badge { display: inline-block; font-size: 10px; padding: 2px 7px; border-radius: 4px; font-weight: 600; margin-left: 8px; }
.oai-cached { background: #1a3d2e; border: 1px solid #22c55e; }
.oai-nocache { background: #3d2000; border: 1px solid #f59e0b; }
.oai-stat { background: #1e293b; border-radius: 6px; padding: 8px 12px; display: flex; justify-content: space-between; font-size: 12px; margin-top: 10px; }
.oai-stat-label { color: #64748b; }
.oai-stat-val { color: #10a37f; font-weight: 700; }
</style>
<div class="oai-cache">
  <div class="oai-cache-section oai-cached">
    <div class="oai-cache-label" style="color:#4ade80">System Prompt (estático) <span class="oai-cache-badge" style="background:#1a3d2e;color:#86efac">CACHEADO após 1ª call</span></div>
    <div class="oai-cache-content">Você é um assistente especializado em análise financeira.
Responda sempre em JSON. Seja preciso e cite fontes.
[instrução com 1000+ tokens...]</div>
  </div>
  <div class="oai-cache-section oai-cached">
    <div class="oai-cache-label" style="color:#4ade80">Few-shot examples (estático) <span class="oai-cache-badge" style="background:#1a3d2e;color:#86efac">CACHEADO</span></div>
    <div class="oai-cache-content">Input: "AAPL Q3 2024..." → Output: {"revenue":...}
Input: "MSFT Q2 2024..." → Output: {"revenue":...}</div>
  </div>
  <div class="oai-cache-section oai-nocache">
    <div class="oai-cache-label" style="color:#fb923c">User Query (variável) <span class="oai-cache-badge" style="background:#3d2000;color:#fdba74">NÃO cacheado</span></div>
    <div class="oai-cache-content">Analise o relatório Q4 2024 da NVDA...</div>
  </div>
  <div class="oai-stat"><span class="oai-stat-label">Cache hit: latência</span><span class="oai-stat-val">~50% menor</span></div>
  <div class="oai-stat"><span class="oai-stat-label">Cache hit: custo</span><span class="oai-stat-val">50% off no prefixo</span></div>
  <div class="oai-stat"><span class="oai-stat-label">Threshold mínimo</span><span class="oai-stat-val">&gt; 1024 tokens</span></div>
</div>`,
    },
  ],

  mnemonics: [
    {
      label: 'FAST — Structured Output obrigatório',
      trick: 'False additionalProperties, All in required, Strict true, Type union para nullable',
      explanation: 'Os quatro requisitos para strict mode funcionar: additionalProperties: false em todo objeto, todos os campos em required[], strict: true no json_schema, e campos opcionais como type: ["T", "null"] em vez de usar optional. Sem qualquer um desses, o strict mode falha silenciosamente.',
    },
    {
      label: 'TIDE — Ciclo de tool use',
      trick: 'Tool define, I decide, Deploy function, Execute response',
      explanation: 'Você define as ferramentas (Tool define), o modelo decide qual usar (I/model decide), você executa o código real (Deploy/run function), e o modelo usa o resultado para executar a resposta final (Execute response). O modelo nunca executa código — apenas decide e formata.',
    },
    {
      label: 'SBM — Roteamento de modelos',
      trick: 'Small for Basic, Big for Medium, Math for hard',
      explanation: 'gpt-4o-mini (Small) para tarefas básicas como classificação e triagem, gpt-4o (Big) para tarefas médias de produção, o1/o3 (Math/reasoning) para problemas difíceis que exigem raciocínio profundo. Nunca use o modelo certo para a tarefa errada.',
    },
    {
      label: 'CAPE — Caching best practices',
      trick: 'Context estático primeiro, Append variável no fim, Prompt maior que 1024, Economy 50%',
      explanation: 'Coloque o contexto estático (system prompt, exemplos) no começo do prompt. Appende a query variável do usuário no final. O prompt precisa ter mais de 1024 tokens para o cache ativar. A economia é 50% de desconto no prefixo cacheado.',
    },
    {
      label: 'BARD — Batch vs Realtime',
      trick: 'Background work, Async only, Realtime = sync, Discount 50%',
      explanation: 'Batch API é para trabalho em background (eval, embeddings em massa). É assíncrono (async) com janela de 24h. Chamadas Realtime são síncronas (sync) para features de produto. O desconto do Batch é de 50% sobre o preço normal.',
    },
  ],

  cheatsheet: {
    title: 'OpenAI SDK — Cheat Sheet',
    caption: 'Referência rápida de endpoints, modelos, parâmetros e erros comuns.',
    html: `
<style>
.oai-cs { font-family: 'Space Grotesk', sans-serif; background: #0f172a; border-radius: 12px; padding: 20px; max-width: 640px; margin: 0 auto; color: #e2e8f0; }
.oai-cs h3 { color: #10a37f; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 8px; }
.oai-cs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.oai-cs-card { background: #1e293b; border-radius: 8px; padding: 12px; }
.oai-cs-row { display: flex; justify-content: space-between; align-items: baseline; padding: 3px 0; border-bottom: 1px solid #0f172a; font-size: 11px; }
.oai-cs-row:last-child { border-bottom: none; }
.oai-cs-key { color: #94a3b8; font-family: 'JetBrains Mono', monospace; }
.oai-cs-val { color: #7dd3fc; }
.oai-cs-good { color: #4ade80; }
.oai-cs-bad { color: #f87171; }
</style>
<div class="oai-cs">
  <div class="oai-cs-grid">
    <div class="oai-cs-card">
      <h3>Endpoints</h3>
      <div class="oai-cs-row"><span class="oai-cs-key">/v1/chat/completions</span><span class="oai-cs-val">chat + tools</span></div>
      <div class="oai-cs-row"><span class="oai-cs-key">/v1/responses</span><span class="oai-cs-val">API unificada nova</span></div>
      <div class="oai-cs-row"><span class="oai-cs-key">/v1/embeddings</span><span class="oai-cs-val">vetores semânticos</span></div>
      <div class="oai-cs-row"><span class="oai-cs-key">/v1/batch</span><span class="oai-cs-val">50% off async</span></div>
      <div class="oai-cs-row"><span class="oai-cs-key">/v1/moderations</span><span class="oai-cs-val">filtro de conteúdo</span></div>
      <div class="oai-cs-row"><span class="oai-cs-key">/v1/audio/transcriptions</span><span class="oai-cs-val">Whisper STT</span></div>
    </div>
    <div class="oai-cs-card">
      <h3>Modelos</h3>
      <div class="oai-cs-row"><span class="oai-cs-key">gpt-4o-mini</span><span class="oai-cs-val oai-cs-good">barato, rápido</span></div>
      <div class="oai-cs-row"><span class="oai-cs-key">gpt-4o</span><span class="oai-cs-val">produção geral</span></div>
      <div class="oai-cs-row"><span class="oai-cs-key">o1-mini / o1</span><span class="oai-cs-val">raciocínio profundo</span></div>
      <div class="oai-cs-row"><span class="oai-cs-key">embed-3-small</span><span class="oai-cs-val oai-cs-good">RAG barato</span></div>
      <div class="oai-cs-row"><span class="oai-cs-key">embed-3-large</span><span class="oai-cs-val">máxima precisão</span></div>
    </div>
    <div class="oai-cs-card">
      <h3>Structured Output</h3>
      <div class="oai-cs-row"><span class="oai-cs-key">strict: true</span><span class="oai-cs-val oai-cs-good">constrained decoding</span></div>
      <div class="oai-cs-row"><span class="oai-cs-key">additionalProperties</span><span class="oai-cs-val">false em todos obj.</span></div>
      <div class="oai-cs-row"><span class="oai-cs-key">optional fields</span><span class="oai-cs-val">type: ["T","null"]</span></div>
      <div class="oai-cs-row"><span class="oai-cs-key">Sem anyOf union</span><span class="oai-cs-val oai-cs-bad">não suportado</span></div>
      <div class="oai-cs-row"><span class="oai-cs-key">zodToJsonSchema</span><span class="oai-cs-val">gere schema com Zod</span></div>
    </div>
    <div class="oai-cs-card">
      <h3>Pegadinhas</h3>
      <div class="oai-cs-row"><span class="oai-cs-key">tool_call_id</span><span class="oai-cs-val oai-cs-bad">obrigatório no role:tool</span></div>
      <div class="oai-cs-row"><span class="oai-cs-key">o1 sem system</span><span class="oai-cs-val oai-cs-bad">não suportado</span></div>
      <div class="oai-cs-row"><span class="oai-cs-key">cache &lt; 1024 tok</span><span class="oai-cs-val oai-cs-bad">não ativa</span></div>
      <div class="oai-cs-row"><span class="oai-cs-key">reasoning tokens</span><span class="oai-cs-val oai-cs-bad">cobrados, não visíveis</span></div>
      <div class="oai-cs-row"><span class="oai-cs-key">batch TTL</span><span class="oai-cs-val">até 24h de espera</span></div>
    </div>
  </div>
</div>`,
  },

  mindmap: {
    title: 'Mapa Mental — OpenAI SDK',
    html: `
<style>
.oai-mm { font-family: 'Space Grotesk', sans-serif; background: #0f172a; border-radius: 12px; padding: 24px; max-width: 600px; margin: 0 auto; }
.oai-mm-center { text-align: center; background: #10a37f; color: white; border-radius: 10px; padding: 10px 20px; font-weight: 700; font-size: 15px; margin-bottom: 20px; }
.oai-mm-branches { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.oai-mm-branch { background: #1e293b; border-radius: 8px; padding: 12px; }
.oai-mm-branch-title { color: #34d399; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px; border-bottom: 1px solid #0f172a; padding-bottom: 6px; }
.oai-mm-item { color: #94a3b8; font-size: 12px; padding: 2px 0; display: flex; align-items: center; gap: 6px; }
.oai-mm-dot { width: 5px; height: 5px; border-radius: 50%; background: #10a37f; flex-shrink: 0; }
</style>
<div class="oai-mm">
  <div class="oai-mm-center">OpenAI SDK</div>
  <div class="oai-mm-branches">
    <div class="oai-mm-branch">
      <div class="oai-mm-branch-title">APIs Core</div>
      <div class="oai-mm-item"><div class="oai-mm-dot"></div>Chat Completions</div>
      <div class="oai-mm-item"><div class="oai-mm-dot"></div>Responses API</div>
      <div class="oai-mm-item"><div class="oai-mm-dot"></div>Embeddings</div>
      <div class="oai-mm-item"><div class="oai-mm-dot"></div>Batch API</div>
      <div class="oai-mm-item"><div class="oai-mm-dot"></div>Assistants API</div>
    </div>
    <div class="oai-mm-branch">
      <div class="oai-mm-branch-title">Modelos</div>
      <div class="oai-mm-item"><div class="oai-mm-dot"></div>GPT-4o / 4o-mini</div>
      <div class="oai-mm-item"><div class="oai-mm-dot"></div>o1 / o3 (reasoning)</div>
      <div class="oai-mm-item"><div class="oai-mm-dot"></div>Embeddings 3</div>
      <div class="oai-mm-item"><div class="oai-mm-dot"></div>Whisper / TTS</div>
      <div class="oai-mm-item"><div class="oai-mm-dot"></div>DALL-E 3</div>
    </div>
    <div class="oai-mm-branch">
      <div class="oai-mm-branch-title">Outputs Tipados</div>
      <div class="oai-mm-item"><div class="oai-mm-dot"></div>Structured Output</div>
      <div class="oai-mm-item"><div class="oai-mm-dot"></div>Function Calling</div>
      <div class="oai-mm-item"><div class="oai-mm-dot"></div>Strict mode</div>
      <div class="oai-mm-item"><div class="oai-mm-dot"></div>Zod integration</div>
      <div class="oai-mm-item"><div class="oai-mm-dot"></div>Streaming JSON</div>
    </div>
    <div class="oai-mm-branch">
      <div class="oai-mm-branch-title">Performance</div>
      <div class="oai-mm-item"><div class="oai-mm-dot"></div>Prompt caching auto</div>
      <div class="oai-mm-item"><div class="oai-mm-dot"></div>Batch API (50% off)</div>
      <div class="oai-mm-item"><div class="oai-mm-dot"></div>Rate limit handling</div>
      <div class="oai-mm-item"><div class="oai-mm-dot"></div>Model routing</div>
      <div class="oai-mm-item"><div class="oai-mm-dot"></div>Streaming SSE</div>
    </div>
    <div class="oai-mm-branch">
      <div class="oai-mm-branch-title">Segurança</div>
      <div class="oai-mm-item"><div class="oai-mm-dot"></div>API keys + rotation</div>
      <div class="oai-mm-item"><div class="oai-mm-dot"></div>Project-scoped keys</div>
      <div class="oai-mm-item"><div class="oai-mm-dot"></div>Moderation API</div>
      <div class="oai-mm-item"><div class="oai-mm-dot"></div>Rate limit por user</div>
      <div class="oai-mm-item"><div class="oai-mm-dot"></div>Audit logging</div>
    </div>
    <div class="oai-mm-branch">
      <div class="oai-mm-branch-title">Observabilidade</div>
      <div class="oai-mm-item"><div class="oai-mm-dot"></div>Token tracking</div>
      <div class="oai-mm-item"><div class="oai-mm-dot"></div>LangSmith / Braintrust</div>
      <div class="oai-mm-item"><div class="oai-mm-dot"></div>finish_reason monitor</div>
      <div class="oai-mm-item"><div class="oai-mm-dot"></div>Cost alerting</div>
      <div class="oai-mm-item"><div class="oai-mm-dot"></div>Prompt versioning</div>
    </div>
  </div>
</div>`,
  },

  exercises: [
    {
      level: 'iniciante',
      title: 'Chat completion com structured output',
      description: 'Crie uma função TypeScript que recebe um texto livre de dados de contato e extrai: nome, email, telefone e empresa usando structured output com strict mode. Use Zod para definir o schema e zodToJsonSchema para converter. Valide que campos ausentes no texto chegam como null (não como string "null").',
      concepts: ['structured output', 'strict mode', 'Zod schema', 'function calling'],
    },
    {
      level: 'iniciante',
      title: 'Agente com function calling simples',
      description: 'Implemente um assistente de clima que usa function calling. Defina as ferramentas get_weather(city) e get_forecast(city, days). O modelo deve escolher qual ferramenta chamar baseado na pergunta do usuário. Implemente o ciclo completo: tool_calls → execute → tool message → resposta final. Teste com perguntas como "Como está o clima em São Paulo?" e "Preciso saber o tempo para os próximos 3 dias."',
      concepts: ['function calling', 'tool use', 'ciclo tool_calls', 'tool_call_id'],
    },
    {
      level: 'intermediario',
      title: 'Comparar custo: sync vs Batch vs cache',
      description: 'Dado um dataset de 1000 textos para classificação: (1) calcule o custo estimado com chamadas síncronas usando gpt-4o; (2) calcule com Batch API; (3) calcule com prompt caching (system prompt de 2000 tokens repetido em todas as chamadas). Use tiktoken para contar tokens. Compare os três cenários e documente a estratégia mais econômica.',
      concepts: ['Batch API', 'prompt caching', 'tiktoken', 'cost optimization', 'model routing'],
    },
    {
      level: 'intermediario',
      title: 'Pipeline de extração com retry e guardrails',
      description: 'Construa um pipeline que lê artigos de blog e extrai: título, autor, data, 5 tags e resumo de 2 frases. Use structured output strict mode. Adicione: (1) retry automático com exponential backoff em rate limit errors, (2) validação com Zod após cada resposta, (3) feedback ao modelo quando a extração falha ("O resumo deve ter exatamente 2 frases"), (4) log estruturado de cada chamada com tokens usados e custo estimado.',
      concepts: ['structured output', 'retry pattern', 'exponential backoff', 'observabilidade', 'Zod'],
    },
    {
      level: 'senior',
      title: 'Agente de pesquisa multi-step com Responses API',
      description: 'Implemente um agente de pesquisa usando a Responses API que: (1) recebe uma pergunta complexa, (2) decompõe em sub-perguntas usando CoT, (3) usa function calling para buscar informações (simule com dados mockados), (4) agrega resultados e sintetiza resposta final, (5) persiste o estado da thread para poder resumir de onde parou. Adicione observabilidade completa: log de cada step, tokens usados, custo total e tempo de execução.',
      concepts: ['Responses API', 'agent loop', 'state management', 'function calling', 'observabilidade', 'prompt chaining'],
    },
    {
      level: 'senior',
      title: 'Sistema de roteamento de modelos com fallback',
      description: 'Crie um model router que: (1) classifica a complexidade da tarefa (simples/média/difícil) usando gpt-4o-mini, (2) roteia para gpt-4o-mini (simples), gpt-4o (média) ou o1-mini (difícil), (3) faz fallback para o próximo tier em caso de erro, (4) monitora custo por request e por tier, (5) expõe métricas de hit rate por tier, custo médio e latência P50/P95. Documente a economia em relação a usar gpt-4o para tudo.',
      concepts: ['model routing', 'fallback pattern', 'cost optimization', 'observabilidade', 'latência'],
    },
  ],

  videos: [
    { title: 'OpenAI Developer Day 2024 — Structured Outputs & o1', channel: 'OpenAI', url: 'https://www.youtube.com/watch?v=RK7RlKxerV0', topic: 'Anúncio oficial de structured outputs e o1' },
    { title: 'Function Calling Deep Dive — OpenAI', channel: 'OpenAI', url: 'https://www.youtube.com/watch?v=0lOSvOoF2to', topic: 'Function calling avançado com exemplos reais' },
    { title: 'Building AI Applications with OpenAI SDK', channel: 'Fireship', url: 'https://www.youtube.com/watch?v=Drdz9jCw38g', topic: 'Tutorial prático com exemplos de código' },
    { title: 'OpenAI Assistants API Full Course', channel: 'freeCodeCamp.org', url: 'https://www.youtube.com/watch?v=qHPonmSX4Ms', topic: 'Curso completo da Assistants API' },
    { title: 'OpenAI Batch API — Cost Optimization', channel: 'AI Jason', url: 'https://www.youtube.com/watch?v=6cMlAEoF2TQ', topic: 'Estratégias de redução de custo com Batch API' },
  ],

  resources: [
    { title: 'OpenAI API docs', url: 'https://platform.openai.com/docs/overview', kind: 'docs' },
    { title: 'OpenAI — Structured outputs guide', url: 'https://platform.openai.com/docs/guides/structured-outputs', kind: 'docs' },
    { title: 'OpenAI — Function calling guide', url: 'https://platform.openai.com/docs/guides/function-calling', kind: 'docs' },
    { title: 'OpenAI — Batch API guide', url: 'https://platform.openai.com/docs/guides/batch', kind: 'docs' },
    { title: 'OpenAI Cookbook', url: 'https://cookbook.openai.com/', kind: 'docs' },
    { title: 'openai-node — GitHub oficial', url: 'https://github.com/openai/openai-node', kind: 'docs' },
    { title: 'tiktoken — Token counting', url: 'https://github.com/openai/tiktoken', kind: 'pratica' },
    { title: 'OpenAI Evals (GitHub)', url: 'https://github.com/openai/evals', kind: 'pratica' },
  ],

  codeExamples: [
    {
      title: 'Structured output com Zod strict mode',
      language: 'typescript',
      code: `import OpenAI from 'openai'
import { zodResponseFormat } from 'openai/helpers/zod'
import { z } from 'zod'

const client = new OpenAI()

const ContactSchema = z.object({
  name: z.string(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  company: z.string().nullable(),
})

async function extractContact(text: string) {
  const response = await client.beta.chat.completions.parse({
    model: 'gpt-4o-2024-08-06',
    messages: [
      { role: 'system', content: 'Extraia informações de contato do texto.' },
      { role: 'user', content: text },
    ],
    response_format: zodResponseFormat(ContactSchema, 'contact'),
  })

  const parsed = response.choices[0].message.parsed
  if (!parsed) throw new Error('Parsing falhou')
  return parsed
}

// Uso
const contact = await extractContact(
  'Fale com Maria Silva (maria@acme.com.br) da Acme Corp. Fone: (11) 99999-0000'
)
console.log(contact)
// { name: 'Maria Silva', email: 'maria@acme.com.br', phone: '(11) 99999-0000', company: 'Acme Corp' }`,
    },
    {
      title: 'Ciclo completo de function calling (tool use)',
      language: 'typescript',
      code: `import OpenAI from 'openai'

const client = new OpenAI()

// Funções reais (simuladas)
function getWeather(city: string) {
  return JSON.stringify({ city, temp: 24, condition: 'Ensolarado', humidity: 65 })
}
function getForecast(city: string, days: number) {
  return JSON.stringify({ city, days, forecast: Array(days).fill({ temp: 22, rain: false }) })
}

const tools: OpenAI.Chat.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'get_weather',
      description: 'Obtém o clima atual de uma cidade',
      parameters: {
        type: 'object',
        properties: { city: { type: 'string', description: 'Nome da cidade' } },
        required: ['city'],
        additionalProperties: false,
      },
      strict: true,
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_forecast',
      description: 'Obtém previsão do tempo para N dias',
      parameters: {
        type: 'object',
        properties: {
          city: { type: 'string' },
          days: { type: 'number', description: 'Número de dias (1-7)' },
        },
        required: ['city', 'days'],
        additionalProperties: false,
      },
      strict: true,
    },
  },
]

async function weatherAgent(userQuery: string) {
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'user', content: userQuery },
  ]

  while (true) {
    const response = await client.chat.completions.create({
      model: 'gpt-4o',
      messages,
      tools,
    })

    const choice = response.choices[0]
    messages.push(choice.message)

    if (choice.finish_reason === 'stop') {
      return choice.message.content
    }

    if (choice.finish_reason === 'tool_calls') {
      for (const toolCall of choice.message.tool_calls!) {
        const args = JSON.parse(toolCall.function.arguments)
        let result: string

        if (toolCall.function.name === 'get_weather') {
          result = getWeather(args.city)
        } else {
          result = getForecast(args.city, args.days)
        }

        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id, // OBRIGATÓRIO
          content: result,
        })
      }
    }
  }
}

const answer = await weatherAgent('Como está o tempo em Curitiba nos próximos 3 dias?')
console.log(answer)`,
    },
    {
      title: 'Batch API: processar 1000 textos com 50% de desconto',
      language: 'typescript',
      code: `import OpenAI from 'openai'
import * as fs from 'fs'

const client = new OpenAI()

// 1. Montar arquivo JSONL com as requests
function createBatchRequests(texts: string[]) {
  return texts.map((text, i) => ({
    custom_id: \`req-\${i}\`,
    method: 'POST',
    url: '/v1/chat/completions',
    body: {
      model: 'gpt-4o-mini', // barato para classificação
      max_tokens: 64,
      messages: [
        { role: 'system', content: 'Classifique o sentimento: positivo, negativo ou neutro. Responda só com a palavra.' },
        { role: 'user', content: text },
      ],
    },
  }))
}

async function batchClassify(texts: string[]) {
  // 2. Escrever JSONL
  const requests = createBatchRequests(texts)
  const jsonl = requests.map(r => JSON.stringify(r)).join('\\n')
  fs.writeFileSync('/tmp/batch_requests.jsonl', jsonl)

  // 3. Upload do arquivo
  const file = await client.files.create({
    file: fs.createReadStream('/tmp/batch_requests.jsonl'),
    purpose: 'batch',
  })

  // 4. Criar o batch job
  const batch = await client.batches.create({
    input_file_id: file.id,
    endpoint: '/v1/chat/completions',
    completion_window: '24h',
  })
  console.log('Batch criado:', batch.id)

  // 5. Polling até completar (em prod: use webhook)
  let status = batch
  while (status.status !== 'completed') {
    await new Promise(r => setTimeout(r, 30_000)) // 30s
    status = await client.batches.retrieve(batch.id)
    console.log(\`Status: \${status.status} (\${status.request_counts.completed}/\${status.request_counts.total})\`)
  }

  // 6. Ler resultados
  const content = await client.files.content(status.output_file_id!)
  const lines = (await content.text()).trim().split('\\n')
  return lines.map(line => JSON.parse(line))
}`,
    },
    {
      title: 'Streaming de chat com abort e error handling',
      language: 'typescript',
      code: `import OpenAI from 'openai'

const client = new OpenAI()

async function streamChat(
  userMessage: string,
  signal?: AbortSignal
): Promise<string> {
  let fullText = ''

  try {
    const stream = await client.chat.completions.create({
      model: 'gpt-4o',
      stream: true,
      messages: [{ role: 'user', content: userMessage }],
    }, { signal })

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content ?? ''
      fullText += delta
      process.stdout.write(delta) // ou envie via SSE ao cliente
    }

    return fullText
  } catch (err) {
    if (err instanceof OpenAI.APIError) {
      if (err.status === 429) {
        console.error('Rate limit — aguarde antes de tentar novamente')
        throw err
      }
      if (err.status === 400) {
        console.error('Request inválido:', err.message)
        throw err
      }
    }
    throw err
  }
}

// Uso com abort após 10s
const controller = new AbortController()
setTimeout(() => controller.abort(), 10_000)

await streamChat('Explique como funciona um transformer em detalhes.', controller.signal)`,
    },
  ],
}

export default openaiSdk

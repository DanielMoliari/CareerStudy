import type { SkillContent } from '@/types'

const anthropicSdk: SkillContent = {
  tagline: 'SDK oficial pra Claude: messages API, tool use, prompt caching, computer use.',
  why: 'Claude é referência em raciocínio e tool use em 2025-2026. Saber prompt caching, extended thinking e tool use de ponta é diferencial competitivo em qualquer posição AI engineer.',
  summary: 'Anthropic SDK (Python e TypeScript) expõe a Messages API. Recursos chave: tool use estruturado, prompt caching (90% off em prefixo repetido), extended thinking (Sonnet com reasoning visível), computer use (agente que controla browser/desktop), streaming com acumulação de partial JSON, batch API (50% off para async). Em 2025, Sonnet é o cavalo de batalha, Haiku para tasks simples, Opus para raciocínio complexo.',
  keypoints: [
    { title: 'Messages API', body: 'POST /v1/messages com model, messages (role + content), max_tokens, system. Resposta tem content como array de blocks (text, tool_use, thinking). system vai como parâmetro top-level, nunca como mensagem.' },
    { title: 'Prompt caching', body: 'Marque blocos com cache_control={"type":"ephemeral"}. Hits cobram 10% do preço normal, writes cobram 125%. TTL de 5min default (1h opcional). Gigante para system prompts longos e contextos repetidos. Economiza até 90% em cargas com prefixo estável.' },
    { title: 'Tool use', body: 'tools=[{name, description, input_schema}]. Resposta inclui tool_use blocks com id, name, input. Você devolve com role=user, content=[{type:"tool_result", tool_use_id, content}]. stop_reason será "tool_use".' },
    { title: 'Extended thinking', body: 'Sonnet com thinking={"type":"enabled","budget_tokens":N} mostra raciocínio em bloco thinking. Útil para debug e problemas hard (matemática, código complexo). Custa mais tokens mas qualidade sobe muito.' },
    { title: 'Streaming', body: 'stream=True retorna eventos: message_start, content_block_start/delta/stop, message_delta, message_stop. Para tool_use: acumule input_json_delta em partial_json até content_block_stop.' },
    { title: 'Computer use', body: 'Tool nativa: screenshot, click, type, scroll, key press. Roda em sandbox (Docker/VM). Retorna screenshot novo em cada step. Beta em 2025. NUNCA execute direto no host do usuário.' },
    { title: 'Batch API', body: 'Submete até 10k requests em JSONL, processados em até 24h, 50% off. Ideal para eval, classification em massa, embed de documentos. Resultado coletado por polling ou webhook.' },
    { title: 'Vision', body: 'content pode incluir image: {type:"image", source:{type:"base64"|"url", media_type, data}}. Suporta PNG, JPEG, GIF, WebP. Sonnet e Opus fazem OCR, análise de charts, leitura de diagramas.' },
    { title: 'Modelos (2025)', body: 'claude-haiku-4-5: rápido e barato, bom para classificação. claude-sonnet-4-5: equilíbrio, cavalo de batalha para tool use e RAG. claude-opus-4-5: mais forte para raciocínio complexo, mais caro. Sempre especificar versão exata em produção.' },
    { title: 'Prompt caching na prática', body: 'cache_control deve estar no bloco que você quer cachear — tudo antes é incluído no prefixo. Ideal para: system prompts, exemplos few-shot, documentos de referência. Medir cache_creation_input_tokens vs cache_read_input_tokens nos headers de uso.' },
  ],
  gotchas: [
    'cache_control deve estar no FINAL do bloco que você quer cachear — todo prefixo antes é cacheado junto.',
    'system prompt vai como parâmetro top-level system, NÃO como mensagem com role=system.',
    'Misturar SDK v1 com docs v2 — API mudou significativamente. Sempre conferir versão.',
    'Tool result content tem que ser string ou array de blocks; não mande objeto direto.',
    'Esquecer de tratar stop_reason: pode ser end_turn, tool_use, max_tokens, stop_sequence — código precisa lidar com cada um.',
    'Streaming + tools: precisa acumular partial_json deltas para montar arguments completo.',
    'Computer use em produção sem sandbox — risco crítico de segurança.',
    'Extended thinking: thinking blocks são cobrados e não podem ser editados — não remova da conversa.',
    'Batch API: não há como cancelar job em andamento. Verifique inputs antes de submeter.',
    'cache_control em mensagens dinâmicas invalida o cache a cada mudança — só cachear partes estáticas.',
  ],
  interview: [
    {
      level: 'senior',
      q: 'Como funciona prompt caching da Anthropic e como maximiza o impacto?',
      a: '<p>Você marca um bloco com <code>cache_control={"type":"ephemeral"}</code>. Tudo desde o início da conversa até aquele bloco vira a cache key. Em chamadas subsequentes com mesmo prefixo: hit cobra 10% do preço base; write cobra 125%.</p><p><strong>TTL</strong>: 5min default, 1h com cache_control de sessão. <strong>Quando usar</strong>: system prompts longos (regras de negócio, instruções), exemplos few-shot (10-20 exemplos), documentos de referência longos (manual técnico, base de conhecimento). <strong>Maximizar impacto</strong>: (1) coloque o que varia no FINAL — nunca no meio do prefixo. (2) Meça cache_creation_input_tokens vs cache_read_input_tokens para validar hit rate. (3) Para TTL 1h: sessões de coding assistant, agentes com contexto longo. Economiza 80-90% de tokens em cargas com prefixo estável.',
      tip: 'O detalhe de que cache_control no meio invalida tudo depois dele é o que separa candidatos com experiência real.',
    },
    {
      level: 'senior',
      q: 'Como implementaria um loop de tool use robusto?',
      a: '<p>O padrão correto é um loop que continua enquanto stop_reason for "tool_use":</p><ol><li>Enviar mensagem inicial → receber resposta</li><li>Se stop_reason === "tool_use": extrair todos os tool_use blocks da resposta</li><li>Para cada tool_use: executar a função, capturar resultado (ou erro)</li><li>Adicionar a resposta do modelo à conversa (messages) E adicionar tool_results como nova mensagem user</li><li>Chamar novamente → repetir até stop_reason !== "tool_use"</li></ol><p><strong>Pontos críticos</strong>: (1) Adicionar TODOS os tool_use blocks de volta — mesmo que apenas um foi executado. (2) Se ferramenta falhar, retornar is_error:true no tool_result — o modelo pode tentar outra abordagem. (3) Limitar iterações (max_turns) para evitar loop infinito. (4) Log de cada tool call para auditoria.</p>',
      tip: 'O erro mais comum é não adicionar a mensagem do assistant com os tool_use blocks antes dos tool_results. A API retorna erro 400 se a conversa estiver malformada.',
    },
    {
      level: 'senior',
      q: 'Como implementaria streaming com tool use?',
      a: '<p>Streaming com tools exige acumulação de partial JSON:</p><ol><li>Escutar eventos content_block_start — identifica início de block (type: text ou tool_use)</li><li>Para blocks tool_use: acumular input_json_delta em uma string</li><li>No content_block_stop: fazer JSON.parse() na string acumulada → executar tool</li><li>Retornar tool_result e continuar o stream</li></ol><p>No SDK TypeScript, a forma idiomática:</p><code>for await (const event of stream) { if (event.type === "content_block_delta" && event.delta.type === "input_json_delta") { partial += event.delta.partial_json } }</code><p>Para UX: streamear o texto para o usuário enquanto acumula o JSON do tool em background.</p>',
      tip: 'partial_json não é JSON válido até o content_block_stop. Nunca tente fazer JSON.parse em deltas intermediários — sempre no stop event.',
    },
    {
      level: 'senior',
      q: 'Quando usar extended thinking e qual o custo real?',
      a: '<p>Extended thinking resolve problemas que exigem raciocínio multi-step: matemática complexa, código difícil com bugs sutis, planning com múltiplas restrições, análise lógica.</p><p><strong>Custo</strong>: thinking tokens são cobrados como input tokens adicionais. Se budget_tokens=10000 e o modelo usar todos, você paga 10k tokens extras além do input/output normal. Para task simples (extração, FAQ), não vale — custo 2-3x mais caro sem ganho de qualidade.</p><p><strong>Implementação</strong>: definir budget_tokens adequado — começa com 8000, aumenta se qualidade insuficiente. Os thinking blocks DEVEM ser incluídos nas chamadas subsequentes (conversação multi-turn).</p><p><strong>Debug</strong>: thinking blocks mostram onde o modelo "pensa" — excelente para entender por que uma resposta foi errada.</p>',
      tip: 'Thinking blocks não podem ser editados. Se você remover o thinking block da conversa ao fazer multi-turn, o modelo fica confuso. Mantenha o histórico completo.',
    },
    {
      level: 'senior',
      q: 'Como usar computer use de forma segura em produção?',
      a: '<p>Computer use é a tool mais poderosa e mais perigosa do Claude.</p><p><strong>Arquitetura segura</strong>: (1) Sempre em container Docker com recursos limitados — sem acesso ao host, sem montar volumes sensíveis. (2) Timeout de sessão — computer use pode ser lento, limitar a 5-10min por sessão. (3) Allowlist de URLs/domínios que o agente pode visitar. (4) Captura de screenshot antes e depois de cada ação — audit trail. (5) Human confirmation para ações irreversíveis (submit form, delete).</p><p><strong>Fluxo</strong>: usuário pede task → Claude tira screenshot → vê o estado → decide ação → você executa localmente → devolve screenshot novo. É você quem executa as ações, não o Claude diretamente.</p>',
      tip: 'Em entrevistas, enfatize que computer use é um tool chamado no seu código — Claude não executa diretamente. O risco de segurança está na sua implementação do executor, não no modelo.',
    },
    {
      level: 'senior',
      q: 'Como você estruturaria um sistema multi-agent com o SDK Anthropic?',
      a: '<p>Multi-agent: cada agente é uma instância de chamada à Messages API com papéis diferentes.</p><p><strong>Padrão orchestrator-worker</strong>: orchestrator (Sonnet) planeja e delega; workers (Haiku ou Sonnet) executam tarefas específicas. O orchestrator usa tool use para "chamar" workers — cada tool representa um agente especializado.</p><p><strong>Contexto compartilhado</strong>: each worker recebe apenas o contexto necessário (não toda a conversa do orchestrator) — princípio de least context. O orchestrator sintetiza os resultados dos workers.</p><p><strong>Estado</strong>: use LangGraph ou similar para gerenciar o grafo de execução, checkpointing e rollback. A Messages API é stateless — você mantém o histórico.</p><p><strong>Custo</strong>: Haiku para workers simples custa 10-20x menos que Sonnet. Model routing é crítico em multi-agent.</p>',
      tip: 'O padrão de passar contexto mínimo para cada worker é o que candidatos sênior sabem. Context pollution (passar tudo para todos) degrada qualidade e explode custo.',
    },
    {
      level: 'senior',
      q: 'Como você monitora e otimiza custo com o SDK Anthropic?',
      a: '<p>O SDK retorna metadados de uso em cada response:</p><code>response.usage = { input_tokens, output_tokens, cache_creation_input_tokens, cache_read_input_tokens }</code><p><strong>Estratégias de custo</strong>: (1) Prompt caching — 90% off em prefixos repetidos. (2) Model routing — Haiku para tasks simples (classificação, extração). (3) Batch API — 50% off para workloads async. (4) Max_tokens adequado — não sete 4096 para respostas curtas. (5) Context compression — summarize histórico em vez de crescer infinitamente.</p><p><strong>Monitoring</strong>: log input_tokens + output_tokens + custo estimado por request. Alarme se custo/request > threshold. Cost tagging por feature/usuário.</p>',
      tip: 'cache_read_input_tokens é o número que você quer maximizar. Se for 0 consistentemente, o prefixo está mudando — rever o que está sendo cacheado.',
    },
    {
      level: 'senior',
      q: 'Como implementa retry e resilience com o SDK Anthropic?',
      a: '<p>O SDK tem retry automático por padrão (3 tentativas para erros 5xx e 429). Para customizar:</p><code>client = Anthropic(max_retries=5)</code><p><strong>Rate limiting (429)</strong>: o SDK faz backoff exponencial automaticamente. Para cargas altas, implemente fila + circuit breaker: se X 429 em Y segundos → pausar requests por Z segundos.</p><p><strong>Timeout</strong>: <code>Anthropic(timeout=30.0)</code> ou por request. Streaming pode travar — definir timeout de primeiro token.</p><p><strong>Fallback</strong>: se Anthropic unavailable → fallback para OpenAI com LiteLLM. Manter prompt portável (tool calling schema é similar mas não idêntico — abstrair).</p><p><strong>Circuit breaker</strong>: após 5 falhas/60s → retornar resposta padrão ou rejeitar request até provider recover.</p>',
      tip: 'O SDK já tem retry, mas o circuit breaker é responsabilidade sua. Sem circuit breaker, 100 requests concorrentes em fail rápido cada uma com 5 retries = 500 calls no provider falho.',
    },
    {
      level: 'pleno',
      q: 'Qual a diferença entre Haiku, Sonnet e Opus? Quando usar cada um?',
      a: '<p><strong>Haiku</strong>: rápido, mais barato. Bom para: classificação, extração de dados, sumarização simples, respostas curtas, routing em multi-agent. Latência ~1-2s.</p><p><strong>Sonnet</strong>: equilíbrio custo/qualidade. O cavalo de batalha para: tool use, RAG, chat, código, análise. Cobre 80-90% dos casos com excelente custo-benefício. Latência ~3-5s.</p><p><strong>Opus</strong>: mais forte em raciocínio complexo, código difícil, escrita criativa, análise nuançada. 5-15x mais caro que Sonnet. Para quando Sonnet não é suficiente.</p><p>Em 2025: Sonnet 4.5 é o default. Haiku para workers simples, Opus para tarefas de alta complexidade ou alta criticidade.</p>',
      tip: 'Mencionar Sonnet como cavalo de batalha com números de custo relativo (Haiku 10-20x mais barato que Sonnet) demonstra que você usa em produção real.',
    },
    {
      level: 'pleno',
      q: 'Como estrutura a Messages API para RAG?',
      a: '<p>Padrão para RAG com Anthropic SDK:</p><ol><li><strong>System prompt</strong>: instruções do assistente (com cache_control para cachear)</li><li><strong>User message</strong>: contexto recuperado + pergunta do usuário</li></ol><p>Exemplo: <code>messages=[{"role":"user","content":"Context:\\n{chunks}\\n\\nQuestion: {query}"}]</code></p><p><strong>Boas práticas</strong>: (1) Limite o contexto — chunks mais relevantes primeiro, truncar em max_tokens do contexto. (2) Force citação: "Para cada afirmação, cite o documento de origem." (3) Fallback: "Se a resposta não está no contexto, diga \'não sei\'." (4) Cachear documentos estáticos de referência com cache_control.</p>',
      tip: 'Mencionar force citation + fallback "não sei" demonstra consciência de hallucination. O cache de documentos estáticos é o quick win de custo mais fácil em RAG.',
    },
    {
      level: 'pleno',
      q: 'Como funciona a Batch API da Anthropic?',
      a: '<p>Para workloads async (eval, classificação em massa, embed, geração de relatórios):</p><ol><li><strong>Criar batch</strong>: POST /v1/messages/batches com array de requests (cada um com custom_id e params idênticos à Messages API)</li><li><strong>Polling</strong>: GET /v1/messages/batches/{id} até status = "ended"</li><li><strong>Coletar resultados</strong>: GET /v1/messages/batches/{id}/results — retorna JSONL</li></ol><p>Limites: até 10k requests por batch, processamento em até 24h. <strong>Custo</strong>: 50% off. <strong>SDK TypeScript</strong>: <code>await client.beta.messages.batches.create({requests: [...]})</code>.</p><p>Usar quando: não precisa de resposta em tempo real, tem volume alto, custo importa.</p>',
      tip: 'Batch API é frequentemente subutilizada. 50% de desconto sem degradação de qualidade — mencionar para avaliação de prompts e geração de dados de treino é diferencial.',
    },
    {
      level: 'pleno',
      q: 'Como implementa vision com o SDK Anthropic?',
      a: '<p>Content do tipo image pode ser base64 ou URL:</p><code>{"type":"image","source":{"type":"base64","media_type":"image/jpeg","data":"<base64>"}}</code><p>Ou URL (Anthropic baixa o arquivo): <code>{"type":"image","source":{"type":"url","url":"https://..."}}</code></p><p><strong>Casos de uso</strong>: OCR de documentos, análise de gráficos, leitura de screenshots, moderação de imagem, extração de dados de formulários.</p><p><strong>Boas práticas</strong>: (1) Para documentos: incluir instrução clara de qual campo extrair. (2) Para análise de UI: incluir screenshot + instrução específica. (3) Combinar texto + imagem na mesma mensagem para contexto.</p><p><strong>Custo</strong>: imagens cobram tokens adicionais (dependendo do tamanho). Resize antes de enviar se imagem grande e resolução não é crítica.</p>',
      tip: 'Resize de imagem antes de enviar é o quick win de custo mais esquecido. Uma imagem de 4k px cobra muito mais tokens que a mesma em 800px.',
    },
    {
      level: 'pleno',
      q: 'O que é stop_reason e por que cada valor importa?',
      a: '<p>stop_reason indica como a geração terminou — seu código precisa tratar cada caso:</p><ul><li><strong>end_turn</strong>: Claude finalizou naturalmente. Resposta completa.</li><li><strong>tool_use</strong>: Claude quer chamar uma tool. Execute a ferramenta e continue o loop.</li><li><strong>max_tokens</strong>: resposta foi truncada. Pode pedir para continuar, mas cuidado com context growth.</li><li><strong>stop_sequence</strong>: Claude gerou uma das sequências de stop configuradas. Útil para delimitar respostas estruturadas.</li></ul><p>O erro mais comum: não checar stop_reason e tratar todas as respostas como end_turn — quebra o loop de tool use.</p>',
      tip: 'Em entrevistas, se a pessoa faz uma pergunta sobre tool use e você mencionar stop_reason, demonstra que você implementou de verdade.',
    },
    {
      level: 'pleno',
      q: 'Como você faz multi-turn conversation com o SDK?',
      a: '<p>A Messages API é stateless — você mantém o histórico. O padrão:</p><code>messages = []\nwhile True:\n    user_input = get_user_input()\n    messages.append({"role":"user","content":user_input})\n    response = client.messages.create(model=..., messages=messages)\n    assistant_msg = response.content\n    messages.append({"role":"assistant","content":assistant_msg})</code><p><strong>Context management</strong>: conversas longas → contexto cresce → custo e latência aumentam. Estratégias: (1) Summarize histórico antigo: substituir N mensagens antigas por um resumo. (2) Sliding window: manter apenas as últimas K mensagens + resumo. (3) Prompt caching: cachear a parte estável do sistema.</p>',
      tip: 'Context management é o desafio operacional real de chatbots em produção. Mencionar summarization demonstra experiência com custos de tokens em produção.',
    },
    {
      level: 'pleno',
      q: 'Como você testaria integração com o SDK Anthropic?',
      a: '<p>Estratégias de teste:</p><ul><li><strong>Mock do SDK</strong>: usar jest.mock() ou unittest.mock para mockar client.messages.create. Retornar responses realistas para diferentes cenários (tool_use, max_tokens, erros).</li><li><strong>Fixture responses</strong>: capturar responses reais da API (em dev) e usar como fixtures em testes — determinístico e sem custo.</li><li><strong>Test tool execution</strong>: testar a lógica das tools separadamente do LLM — são funções regulares.</li><li><strong>Integration tests</strong>: com modelo real (Haiku — mais barato) em CI, para detectar mudanças na API ou no comportamento do modelo.</li><li><strong>Eval set</strong>: conjunto de inputs + expected outputs para medir qualidade ao longo do tempo — roda em Haiku para baratear.</li></ul>',
      tip: 'Separar teste das tools (funções regulares, testáveis de forma determinística) do teste do LLM (eval set) é a arquitetura de teste correta.',
    },
    {
      level: 'senior',
      q: 'Como usar o SDK para implementar agente com memória persistente?',
      a: '<p>Memória em agentes: curto prazo (contexto da sessão) vs longo prazo (persistida entre sessões).</p><p><strong>Curto prazo</strong>: messages array da sessão — gerenciado como multi-turn conversation. Limitado pelo context window.</p><p><strong>Longo prazo</strong>: antes de cada nova sessão, recuperar memórias relevantes via RAG em um vector store. As memórias são passadas no system prompt ou no início da conversa como contexto.</p><p><strong>Criação de memória</strong>: ao fim de cada sessão, um processo de summarization extrai fatos importantes → armazena no vector store com user_id como metadata. Próxima sessão: query por user_id + tópico atual → inject no contexto.</p><p><strong>Ferramentas</strong>: Mem0, Zep, ou implementação própria com Qdrant/pgvector.</p>',
      tip: 'A distinção curto prazo vs longo prazo é fundamental. Colocar todo o histórico de todas as sessões no context é o anti-pattern clássico — explode custo e qualidade.',
    },
    {
      level: 'senior',
      q: 'Como você lida com o context window limit em aplicações com documentos longos?',
      a: '<p>Estratégias por caso de uso:</p><ul><li><strong>Q&A sobre documentos</strong>: RAG — chunking + embedding + retrieval. Só os chunks relevantes vão para o LLM, não o documento inteiro.</li><li><strong>Análise de código</strong>: map-reduce — dividir em partes, analisar cada uma, sintetizar. Cada parte cabe no contexto.</li><li><strong>Sumarização progressiva</strong>: sumarizar seções do documento progressivamente, usar os sumários como input para o próximo nível.</li><li><strong>Prompt caching para contexto estático</strong>: se o documento muda raramente, cachear o contexto — custo de cache hit é 10% do normal.</li></ul><p><strong>Claude Sonnet 4.5</strong>: 200k tokens de context window — suficiente para a maioria dos documentos. Mas custo cresce linearmente com o tamanho do contexto.</p>',
      tip: 'Context window de 200k não significa "jogue tudo dentro". Custo e latência crescem linearmente. RAG é sempre mais eficiente para documentos longos com queries específicas.',
    },
    {
      level: 'pleno',
      q: 'Como instala e configura o SDK TypeScript da Anthropic?',
      a: '<p><code>npm install @anthropic-ai/sdk</code></p><p>Configuração básica:</p><code>import Anthropic from "@anthropic-ai/sdk";\nconst client = new Anthropic({\n  apiKey: process.env.ANTHROPIC_API_KEY,  // Default: lê da env\n  maxRetries: 3,\n  timeout: 60000,\n});</code><p>Para streaming: <code>client.messages.stream({...}).on("text", (text) => console.log(text))</code></p><p><strong>Headers de uso</strong>: response.headers["anthropic-ratelimit-requests-remaining"] para monitorar rate limit. usage em response.usage.</p><p><strong>Tipos TypeScript</strong>: SDK tem tipos completos. ContentBlock, ToolUseBlock, TextBlock discriminated union por type.</p>',
      tip: 'O SDK lê ANTHROPIC_API_KEY da env por padrão. Mencionar que não precisa passar explicitamente demonstra familiaridade com o SDK.',
    },
    {
      level: 'pleno',
      q: 'O que é computer use e qual o caso de uso real mais comum?',
      a: '<p>Computer use é uma tool nativa do Claude que dá capacidade de: tomar screenshot, clicar em coordenadas, digitar texto, pressionar teclas, fazer scroll.</p><p><strong>Caso mais comum em 2025</strong>: automação de UI legacy — sistemas sem API (ERP antigo, sistemas governamentais) que exigem interação visual. Claude age como um RPA inteligente.</p><p><strong>Outros casos</strong>: testing de UI end-to-end (automação de testes visuais), web research autônomo, preenchimento de formulários complexos.</p><p><strong>Fluxo</strong>: você implementa um executor que recebe as ações do Claude e as executa (via Playwright, PyAutoGUI, xdotool). Claude nunca acessa o sistema diretamente — você é o intermediário.</p>',
      tip: 'Posicionar como "RPA inteligente" ajuda entrevistadores de produtos de automação a visualizar o valor. O fato de que você implementa o executor é frequentemente confundido.',
    },
    {
      level: 'senior',
      q: 'Como você escolheria entre Anthropic SDK diretamente vs LiteLLM ou similar?',
      a: '<p>Use SDK Anthropic diretamente quando: (1) Recursos exclusivos do Claude — prompt caching, extended thinking, computer use. Nenhuma abstração dá acesso completo. (2) Controle fino sobre comportamento específico do modelo. (3) Aplicação usa apenas Claude.</p><p>Use LiteLLM quando: (1) Multi-provider — fallback Anthropic → OpenAI → Bedrock. (2) Ambiente onde o modelo pode mudar (staging usa Haiku, prod usa Sonnet). (3) Abstração de custo — LiteLLM calcula custo por provider uniformemente. (4) OpenAI-compatible format esperado pelo framework usado.</p><p>Trade-off: SDK direto tem acesso a 100% dos recursos e menor overhead. LiteLLM tem abstração valiosa mas pode não suportar features novas imediatamente.</p>',
      tip: 'Mencionar prompt caching como razão para usar SDK diretamente é diferencial — LiteLLM pode não suportar completamente os headers de cache da Anthropic.',
    },
  ],
  diagrams: [
    {
      title: 'Messages API: Request/Response Structure',
      html: `
<div style="font-family:Space Grotesk,sans-serif;background:#0f172a;padding:20px;border-radius:10px;color:#e2e8f0">
  <div style="font-size:13px;font-weight:700;color:#c98346;margin-bottom:16px;text-align:center">ANTHROPIC MESSAGES API — ESTRUTURA</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
    <!-- Request -->
    <div style="background:#1e293b;border-radius:8px;padding:14px;border-top:3px solid #c98346">
      <div style="font-size:10px;font-weight:700;color:#c98346;margin-bottom:8px">REQUEST</div>
      <div style="font-family:JetBrains Mono,monospace;font-size:9px;color:#94a3b8;line-height:1.8">
        <span style="color:#38bdf8">model</span>: "claude-sonnet-4-5"<br>
        <span style="color:#38bdf8">system</span>: "..." <span style="color:#475569"># top-level, não message</span><br>
        <span style="color:#38bdf8">messages</span>: [<br>
        &nbsp;&nbsp;{<span style="color:#22c55e">role</span>: "user", <span style="color:#22c55e">content</span>: "..."}<br>
        &nbsp;&nbsp;{<span style="color:#22c55e">role</span>: "assistant", <span style="color:#22c55e">content</span>: [...]}<br>
        ]<br>
        <span style="color:#38bdf8">max_tokens</span>: 4096<br>
        <span style="color:#38bdf8">tools</span>: [{name, description,<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;input_schema}]<br>
        <span style="color:#38bdf8">stream</span>: true/false
      </div>
    </div>
    <!-- Response -->
    <div style="background:#1e293b;border-radius:8px;padding:14px;border-top:3px solid #22c55e">
      <div style="font-size:10px;font-weight:700;color:#22c55e;margin-bottom:8px">RESPONSE</div>
      <div style="font-family:JetBrains Mono,monospace;font-size:9px;color:#94a3b8;line-height:1.8">
        <span style="color:#38bdf8">id</span>: "msg_..."<br>
        <span style="color:#38bdf8">type</span>: "message"<br>
        <span style="color:#38bdf8">role</span>: "assistant"<br>
        <span style="color:#38bdf8">content</span>: [<br>
        &nbsp;&nbsp;{type: <span style="color:#f59e0b">"text"</span>, text: "..."},<br>
        &nbsp;&nbsp;{type: <span style="color:#f59e0b">"tool_use"</span>, id, name, input},<br>
        &nbsp;&nbsp;{type: <span style="color:#f59e0b">"thinking"</span>, thinking: "..."}<br>
        ]<br>
        <span style="color:#38bdf8">stop_reason</span>: <span style="color:#ef4444">"tool_use"</span> | "end_turn" | "max_tokens"<br>
        <span style="color:#38bdf8">usage</span>: {input_tokens, output_tokens,<br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;cache_read_input_tokens}
      </div>
    </div>
  </div>
  <!-- Tool Result -->
  <div style="background:#1e293b;border-radius:8px;padding:14px;margin-top:12px;border-left:4px solid #f59e0b">
    <div style="font-size:10px;font-weight:700;color:#f59e0b;margin-bottom:6px">TOOL RESULT (próxima mensagem — role: user)</div>
    <div style="font-family:JetBrains Mono,monospace;font-size:9px;color:#94a3b8;line-height:1.6">
      content: [{type: <span style="color:#f59e0b">"tool_result"</span>, <span style="color:#22c55e">tool_use_id</span>: "same-id", <span style="color:#22c55e">content</span>: "resultado...", is_error: false}]
    </div>
  </div>
</div>
      `.trim(),
      caption: 'Estrutura completa da Messages API: request, response com content blocks, e como retornar tool results.',
    },
    {
      title: 'Prompt Caching: Prefixo Estático vs Dinâmico',
      html: `
<div style="font-family:Space Grotesk,sans-serif;background:#0f172a;padding:20px;border-radius:10px;color:#e2e8f0">
  <div style="font-size:13px;font-weight:700;color:#c98346;margin-bottom:16px;text-align:center">PROMPT CACHING — PREFIXO ESTÁTICO vs DINÂMICO</div>
  <div style="display:flex;flex-direction:column;gap:10px">
    <!-- System prompt (cached) -->
    <div style="position:relative">
      <div style="background:#1e2a1e;border-radius:8px;padding:12px;border:2px solid #22c55e">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span style="font-size:10px;font-weight:700;color:#22c55e">SYSTEM PROMPT (cacheado)</span>
          <span style="font-size:9px;background:#22c55e20;color:#22c55e;padding:2px 8px;border-radius:4px">cache_control: ephemeral</span>
        </div>
        <div style="font-size:9px;color:#94a3b8">Instruções do assistente, regras de negócio, exemplos few-shot (2000+ tokens)<br>→ Cacheado por 5 min. Hit = 10% do preço. Write = 125%.</div>
      </div>
    </div>
    <!-- Docs context (cached) -->
    <div>
      <div style="background:#1e2535;border-radius:8px;padding:12px;border:2px solid #38bdf8">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span style="font-size:10px;font-weight:700;color:#38bdf8">CONTEXTO DE REFERÊNCIA (cacheado)</span>
          <span style="font-size:9px;background:#38bdf820;color:#38bdf8;padding:2px 8px;border-radius:4px">cache_control: ephemeral</span>
        </div>
        <div style="font-size:9px;color:#94a3b8">Documentação, base de conhecimento, manual técnico (5000+ tokens)<br>→ Cacheado junto ao system prompt.</div>
      </div>
    </div>
    <!-- User message (dynamic) -->
    <div>
      <div style="background:#2a1e1e;border-radius:8px;padding:12px;border:2px solid #ef4444">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
          <span style="font-size:10px;font-weight:700;color:#ef4444">MENSAGEM DO USUÁRIO (dinâmica — NÃO cachear)</span>
          <span style="font-size:9px;background:#ef444420;color:#ef4444;padding:2px 8px;border-radius:4px">sem cache_control</span>
        </div>
        <div style="font-size:9px;color:#94a3b8">"Como faço X?" — muda a cada request → invalidaria o cache se estivesse antes.</div>
      </div>
    </div>
    <!-- Cache math -->
    <div style="background:#1e293b;border-radius:8px;padding:12px;border-top:2px solid #c98346">
      <div style="font-size:10px;font-weight:700;color:#c98346;margin-bottom:8px">ECONOMIA EM EXEMPLOS REAIS</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:9px">
        <div>
          <div style="color:#e2e8f0;font-weight:600;margin-bottom:4px">Sem cache (100 requests)</div>
          <div style="color:#94a3b8">10k tokens sistema × 100 = 1M tokens<br>Custo: $3 (Sonnet)</div>
        </div>
        <div>
          <div style="color:#e2e8f0;font-weight:600;margin-bottom:4px">Com cache (100 requests)</div>
          <div style="color:#22c55e">1 write (125%) + 99 reads (10%)<br>Custo: ~$0.30 — economia de 90%</div>
        </div>
      </div>
    </div>
  </div>
</div>
      `.trim(),
      caption: 'Coloque as partes estáticas no início (com cache_control), as dinâmicas no final. Nunca misture — dinâmico no meio invalida tudo depois.',
    },
    {
      title: 'Tool Use Loop: Fluxo Completo',
      html: `
<div style="font-family:Space Grotesk,sans-serif;background:#0f172a;padding:20px;border-radius:10px;color:#e2e8f0">
  <div style="font-size:13px;font-weight:700;color:#c98346;margin-bottom:16px;text-align:center">TOOL USE LOOP — FLUXO COMPLETO</div>
  <div style="display:flex;flex-direction:column;gap:6px">
    <!-- Step 1 -->
    <div style="display:flex;align-items:center;gap:10px">
      <div style="min-width:24px;height:24px;background:#c98346;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#0f172a">1</div>
      <div style="background:#1e293b;border-radius:6px;padding:8px 12px;flex:1;font-size:10px">
        <span style="color:#c98346;font-weight:600">Enviar mensagem</span>
        <span style="color:#94a3b8"> — messages + tools definition → API</span>
      </div>
    </div>
    <!-- Arrow -->
    <div style="margin-left:12px;color:#334155;font-size:14px">↓</div>
    <!-- Step 2 -->
    <div style="display:flex;align-items:center;gap:10px">
      <div style="min-width:24px;height:24px;background:#f59e0b;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#0f172a">2</div>
      <div style="background:#1e293b;border-radius:6px;padding:8px 12px;flex:1;font-size:10px">
        <span style="color:#f59e0b;font-weight:600">Checar stop_reason</span>
        <span style="color:#94a3b8"> — if "tool_use": continuar loop. if "end_turn": finalizar.</span>
      </div>
    </div>
    <!-- Arrow -->
    <div style="margin-left:12px;color:#334155;font-size:14px">↓ stop_reason = "tool_use"</div>
    <!-- Step 3 -->
    <div style="display:flex;align-items:center;gap:10px">
      <div style="min-width:24px;height:24px;background:#22c55e;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#0f172a">3</div>
      <div style="background:#1e293b;border-radius:6px;padding:8px 12px;flex:1;font-size:10px">
        <span style="color:#22c55e;font-weight:600">Executar tools</span>
        <span style="color:#94a3b8"> — extrair TODOS os tool_use blocks, executar cada função</span>
      </div>
    </div>
    <!-- Arrow -->
    <div style="margin-left:12px;color:#334155;font-size:14px">↓</div>
    <!-- Step 4 -->
    <div style="display:flex;align-items:center;gap:10px">
      <div style="min-width:24px;height:24px;background:#38bdf8;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#0f172a">4</div>
      <div style="background:#1e293b;border-radius:6px;padding:8px 12px;flex:1;font-size:10px">
        <span style="color:#38bdf8;font-weight:600">Adicionar ao histórico</span>
        <span style="color:#94a3b8"> — response do assistant + tool_results como nova mensagem user</span>
      </div>
    </div>
    <!-- Arrow -->
    <div style="margin-left:12px;color:#334155;font-size:14px">↓ volta ao passo 1</div>
    <!-- End state -->
    <div style="display:flex;align-items:center;gap:10px">
      <div style="min-width:24px;height:24px;background:#a855f7;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff">✓</div>
      <div style="background:#1e1e2a;border-radius:6px;padding:8px 12px;flex:1;border:1px solid #a855f7;font-size:10px">
        <span style="color:#a855f7;font-weight:600">stop_reason = "end_turn"</span>
        <span style="color:#94a3b8"> — resposta final pronta para o usuário</span>
      </div>
    </div>
  </div>
  <div style="background:#1e293b;border-radius:6px;padding:10px;margin-top:12px;border-left:3px solid #ef4444;font-size:9px;color:#94a3b8">
    <strong style="color:#ef4444">Ponto crítico:</strong> Adicionar TODOS os tool_use blocks de volta ao histórico antes dos tool_results — mesmo que só um foi executado. API retorna 400 se o histórico estiver incompleto.
  </div>
</div>
      `.trim(),
      caption: 'O loop continua enquanto stop_reason for "tool_use". Sempre adicionar a resposta do assistant com os tool_use blocks antes dos tool_results.',
    },
  ],
  cheatsheet: {
    title: 'Anthropic SDK — Cheatsheet de Referência',
    html: `
<div style="font-family:Space Grotesk,sans-serif;background:#0f172a;padding:20px;border-radius:10px;color:#e2e8f0">
  <div style="font-size:14px;font-weight:700;color:#c98346;margin-bottom:14px;text-align:center">ANTHROPIC SDK — CHEATSHEET</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
    <!-- Modelos -->
    <div style="background:#1e293b;border-radius:8px;padding:14px;border-top:3px solid #c98346">
      <div style="font-size:10px;font-weight:700;color:#c98346;margin-bottom:8px">MODELOS (2025)</div>
      <table style="width:100%;border-collapse:collapse;font-size:9px">
        <tr><td style="color:#94a3b8;padding:3px 0">Haiku 4.5</td><td style="color:#e2e8f0;text-align:right">rápido, barato, simples</td></tr>
        <tr><td style="color:#94a3b8;padding:3px 0">Sonnet 4.5</td><td style="color:#22c55e;text-align:right">cavalo de batalha ✓</td></tr>
        <tr><td style="color:#94a3b8;padding:3px 0">Opus 4.5</td><td style="color:#e2e8f0;text-align:right">raciocínio hard, caro</td></tr>
        <tr><td style="color:#94a3b8;padding:3px 0">Context window</td><td style="color:#e2e8f0;text-align:right">200k tokens</td></tr>
        <tr><td style="color:#94a3b8;padding:3px 0">Max output</td><td style="color:#e2e8f0;text-align:right">8192 tokens</td></tr>
      </table>
    </div>
    <!-- Prompt caching -->
    <div style="background:#1e293b;border-radius:8px;padding:14px;border-top:3px solid #22c55e">
      <div style="font-size:10px;font-weight:700;color:#22c55e;margin-bottom:8px">PROMPT CACHING</div>
      <table style="width:100%;border-collapse:collapse;font-size:9px">
        <tr><td style="color:#94a3b8;padding:3px 0">Cache hit</td><td style="color:#22c55e;text-align:right">10% do preço base</td></tr>
        <tr><td style="color:#94a3b8;padding:3px 0">Cache write</td><td style="color:#e2e8f0;text-align:right">125% do preço base</td></tr>
        <tr><td style="color:#94a3b8;padding:3px 0">TTL padrão</td><td style="color:#e2e8f0;text-align:right">5 minutos</td></tr>
        <tr><td style="color:#94a3b8;padding:3px 0">TTL extended</td><td style="color:#e2e8f0;text-align:right">1 hora</td></tr>
        <tr><td style="color:#94a3b8;padding:3px 0">Ativação</td><td style="color:#e2e8f0;text-align:right">cache_control: ephemeral</td></tr>
      </table>
    </div>
    <!-- stop_reason -->
    <div style="background:#1e293b;border-radius:8px;padding:14px;border-top:3px solid #ef4444">
      <div style="font-size:10px;font-weight:700;color:#ef4444;margin-bottom:8px">STOP REASON</div>
      <table style="width:100%;border-collapse:collapse;font-size:9px">
        <tr><td style="color:#94a3b8;padding:3px 0">end_turn</td><td style="color:#22c55e;text-align:right">completo ✓</td></tr>
        <tr><td style="color:#94a3b8;padding:3px 0">tool_use</td><td style="color:#f59e0b;text-align:right">execute tools → loop</td></tr>
        <tr><td style="color:#94a3b8;padding:3px 0">max_tokens</td><td style="color:#ef4444;text-align:right">truncado — cuidado</td></tr>
        <tr><td style="color:#94a3b8;padding:3px 0">stop_sequence</td><td style="color:#e2e8f0;text-align:right">delimitador atingido</td></tr>
      </table>
    </div>
    <!-- Batch API -->
    <div style="background:#1e293b;border-radius:8px;padding:14px;border-top:3px solid #a855f7">
      <div style="font-size:10px;font-weight:700;color:#a855f7;margin-bottom:8px">BATCH API</div>
      <table style="width:100%;border-collapse:collapse;font-size:9px">
        <tr><td style="color:#94a3b8;padding:3px 0">Desconto</td><td style="color:#22c55e;text-align:right">50% off</td></tr>
        <tr><td style="color:#94a3b8;padding:3px 0">Max requests</td><td style="color:#e2e8f0;text-align:right">10k por batch</td></tr>
        <tr><td style="color:#94a3b8;padding:3px 0">Processamento</td><td style="color:#e2e8f0;text-align:right">até 24 horas</td></tr>
        <tr><td style="color:#94a3b8;padding:3px 0">Formato</td><td style="color:#e2e8f0;text-align:right">JSONL</td></tr>
        <tr><td style="color:#94a3b8;padding:3px 0">Uso</td><td style="color:#e2e8f0;text-align:right">eval, classificação, embed</td></tr>
      </table>
    </div>
  </div>
</div>
    `.trim(),
  },
  mindmap: {
    title: 'Anthropic SDK — Mapa Mental',
    html: `
<div style="font-family:Space Grotesk,sans-serif;background:#0f172a;padding:20px;border-radius:10px;color:#e2e8f0">
  <div style="text-align:center;margin-bottom:16px">
    <div style="display:inline-block;background:#c9834620;border:2px solid #c98346;border-radius:10px;padding:10px 20px">
      <div style="font-size:14px;font-weight:700;color:#c98346">ANTHROPIC SDK</div>
      <div style="font-size:9px;color:#94a3b8;margin-top:2px">Messages API · Tool Use · Caching</div>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">
    <div style="background:#1e293b;border-radius:8px;padding:12px;border-top:3px solid #c98346">
      <div style="font-size:10px;font-weight:700;color:#c98346;margin-bottom:8px">MESSAGES API</div>
      <div style="font-size:9px;color:#94a3b8;line-height:1.8">• system (top-level)<br>• messages array<br>• content blocks<br>• stop_reason<br>• usage tokens</div>
    </div>
    <div style="background:#1e293b;border-radius:8px;padding:12px;border-top:3px solid #f59e0b">
      <div style="font-size:10px;font-weight:700;color:#f59e0b;margin-bottom:8px">TOOL USE</div>
      <div style="font-size:9px;color:#94a3b8;line-height:1.8">• tools definition<br>• tool_use blocks<br>• tool_result response<br>• Loop até end_turn<br>• is_error handling</div>
    </div>
    <div style="background:#1e293b;border-radius:8px;padding:12px;border-top:3px solid #22c55e">
      <div style="font-size:10px;font-weight:700;color:#22c55e;margin-bottom:8px">PROMPT CACHING</div>
      <div style="font-size:9px;color:#94a3b8;line-height:1.8">• cache_control: ephemeral<br>• Hit = 10% do preço<br>• Write = 125%<br>• TTL 5min / 1h<br>• Partes estáticas primeiro</div>
    </div>
    <div style="background:#1e293b;border-radius:8px;padding:12px;border-top:3px solid #38bdf8">
      <div style="font-size:10px;font-weight:700;color:#38bdf8;margin-bottom:8px">STREAMING</div>
      <div style="font-size:9px;color:#94a3b8;line-height:1.8">• stream=True<br>• content_block_delta<br>• Acumular partial_json<br>• content_block_stop<br>• message_stop</div>
    </div>
    <div style="background:#1e293b;border-radius:8px;padding:12px;border-top:3px solid #a855f7">
      <div style="font-size:10px;font-weight:700;color:#a855f7;margin-bottom:8px">RECURSOS AVANÇADOS</div>
      <div style="font-size:9px;color:#94a3b8;line-height:1.8">• Extended thinking<br>• Computer use<br>• Batch API (50% off)<br>• Vision (base64/URL)<br>• Multi-turn memory</div>
    </div>
    <div style="background:#1e293b;border-radius:8px;padding:12px;border-top:3px solid #6366f1">
      <div style="font-size:10px;font-weight:700;color:#6366f1;margin-bottom:8px">MODELOS</div>
      <div style="font-size:9px;color:#94a3b8;line-height:1.8">• Haiku: rápido/barato<br>• Sonnet: padrão ✓<br>• Opus: raciocínio hard<br>• 200k ctx window<br>• Especificar versão</div>
    </div>
  </div>
</div>
    `.trim(),
  },
  mnemonics: [
    {
      label: 'Stop reasons do Claude',
      trick: 'ETMS',
      explanation: 'E — End_turn (completo, resposta final). T — Tool_use (execute tools, continue loop). M — Max_tokens (resposta truncada, atenção). S — Stop_sequence (delimitador atingido). Cada um exige ação diferente no seu código.',
    },
    {
      label: 'Prompt caching: o que cachear',
      trick: 'ESU',
      explanation: 'E — Estático sempre primeiro (system prompt, docs). S — Sequência imutável garante hit (nada dinâmico no meio). U — Usuário vai no final (dinâmico, não cachear). Cache hit = 10% do preço. Dinâmico no meio = cache invalidado.',
    },
    {
      label: 'Tool use loop',
      trick: 'SEAL',
      explanation: 'S — Send (enviar mensagem com tools definition). E — Execute (rodar todas as tools quando stop_reason=tool_use). A — Add (adicionar resposta do assistant + tool_results ao histórico). L — Loop (voltar ao Send). Para quando stop_reason=end_turn.',
    },
  ],
  exercises: [
    {
      level: 'iniciante',
      title: 'Hello World com Messages API',
      description: 'Configure o SDK TypeScript da Anthropic. Envie uma mensagem e exiba a resposta. Implemente tratamento de erro para rate limit (429) e exiba o número de tokens usados.',
      concepts: ['Messages API', 'SDK setup', 'error handling', 'usage tokens'],
      hint: 'O SDK lê ANTHROPIC_API_KEY da env automaticamente. Acesse response.usage para tokens. Para erros: import { RateLimitError } from "@anthropic-ai/sdk".',
    },
    {
      level: 'intermediario',
      title: 'Tool use com múltiplas ferramentas',
      description: 'Implemente um assistente com 3 tools: get_weather(city), search_web(query), calculate(expression). Implemente o loop de tool use completo que continua até end_turn. Teste com perguntas que exigem múltiplas tool calls em sequência.',
      concepts: ['tool use', 'tool loop', 'stop_reason', 'multi-turn'],
      hint: 'Sempre adicionar TODOS os tool_use blocks da resposta de volta ao histórico antes dos tool_results. Use um array para acumular os tool_results de cada iteração.',
    },
    {
      level: 'intermediario',
      title: 'Streaming com tool use',
      description: 'Implemente streaming de uma conversa com tool use. Exiba o texto para o usuário em tempo real enquanto acumula o JSON dos tool arguments nos bastidores. Só execute a tool após o content_block_stop do bloco tool_use.',
      concepts: ['streaming', 'tool use', 'partial_json accumulation', 'content_block_delta'],
      hint: 'Mantenha um dicionário de partial_json por block_index. Acumule os input_json_delta. No content_block_stop: JSON.parse() e execute a tool.',
    },
    {
      level: 'senior',
      title: 'Sistema de chat com prompt caching otimizado',
      description: 'Construa um chatbot onde o system prompt (com instruções longas e exemplos few-shot) é cacheado. Implemente context management: quando o histórico ultrapassar 80k tokens, resumir as mensagens mais antigas. Meça e exiba o cache hit rate.',
      concepts: ['prompt caching', 'context management', 'cache_creation_input_tokens', 'summarization'],
      hint: 'Coloque system + few-shot examples com cache_control. Monitore cache_read_input_tokens vs cache_creation_input_tokens no usage. Para sumarização: enviar trecho do histórico para o Haiku com prompt "summarize this conversation in 500 words".',
    },
    {
      level: 'senior',
      title: 'Pipeline de classificação em lote com Batch API',
      description: 'Classifique 500 textos de suporte ao cliente usando a Batch API (50% de desconto). Cada classificação deve retornar: categoria (bug, feature-request, billing, other), urgência (low/medium/high), e resumo em 1 frase. Implemente polling com backoff e salve resultados em JSONL.',
      concepts: ['Batch API', 'structured output', 'polling', 'JSONL'],
      hint: 'Use client.beta.messages.batches.create(). Poll a cada 30s com backoff exponencial. Resultados: client.beta.messages.batches.results(batch_id) retorna AsyncIterable de MessageBatchResult.',
    },
  ],
  codeExamples: [
    {
      title: 'Tool Use Loop Completo (TypeScript)',
      language: 'typescript',
      code: [
        "import Anthropic from '@anthropic-ai/sdk'",
        '',
        'const client = new Anthropic()',
        '',
        'const tools: Anthropic.Tool[] = [{',
        "  name: 'get_weather',",
        "  description: 'Get current weather for a city',",
        '  input_schema: {',
        "    type: 'object' as const,",
        "    properties: { city: { type: 'string' }, country: { type: 'string' } },",
        "    required: ['city'],",
        '  },',
        '}]',
        '',
        'async function runAgentLoop(userMessage: string): Promise<string> {',
        '  const messages: Anthropic.MessageParam[] = [{ role: "user", content: userMessage }]',
        "  let finalText = ''",
        '  let iterations = 0',
        '',
        '  while (iterations < 10) {',
        '    iterations++',
        '    const response = await client.messages.create({',
        "      model: 'claude-sonnet-4-5', max_tokens: 1024, tools, messages,",
        '    })',
        '    // CRÍTICO: adicionar antes dos tool_results',
        "    messages.push({ role: 'assistant', content: response.content })",
        '',
        "    if (response.stop_reason === 'end_turn') {",
        "      const tb = response.content.find(b => b.type === 'text')",
        "      finalText = tb?.type === 'text' ? tb.text : ''",
        '      break',
        '    }',
        '',
        "    if (response.stop_reason === 'tool_use') {",
        "      const blocks = response.content.filter(b => b.type === 'tool_use')",
        '      const toolResults: Anthropic.ToolResultBlockParam[] = []',
        '      for (const block of blocks) {',
        "        if (block.type !== 'tool_use') continue",
        "        const result = JSON.stringify({ city: (block.input as {city:string}).city, temp: 25 })",
        '        toolResults.push({ type: "tool_result", tool_use_id: block.id, content: result })',
        '      }',
        "      messages.push({ role: 'user', content: toolResults })",
        '    }',
        '  }',
        '  return finalText',
        '}',
      ].join('\n'),
    },
    {
      title: 'Prompt Caching com Contexto Longo',
      language: 'typescript',
      code: [
        "import Anthropic from '@anthropic-ai/sdk'",
        '',
        'const client = new Anthropic()',
        '',
        'const SYSTEM = "Você é um assistente especializado em revisão de código TypeScript. [... 5000 tokens ...]"',
        'const EXAMPLES = "Exemplo 1: any ruim vs tipagem correta. [... 20 exemplos ...]"',
        '',
        'async function reviewCode(code: string): Promise<string> {',
        '  const response = await client.messages.create({',
        "    model: 'claude-sonnet-4-5',",
        '    max_tokens: 2048,',
        '    system: [',
        '      { type: "text", text: SYSTEM,   cache_control: { type: "ephemeral" } },',
        '      { type: "text", text: EXAMPLES, cache_control: { type: "ephemeral" } },',
        '    ],',
        '    messages: [{ role: "user", content: "Revise este código:\\n" + code }],',
        '  })',
        '',
        '  // Monitorar hit rate',
        '  const { usage } = response',
        '  console.log({',
        '    cache_creation: usage.cache_creation_input_tokens,  // write: 125%',
        '    cache_read:     usage.cache_read_input_tokens,       // hit: 10%',
        '    hit_rate: usage.cache_read_input_tokens',
        '      ? usage.cache_read_input_tokens / (usage.cache_read_input_tokens + (usage.cache_creation_input_tokens ?? 0))',
        '      : 0,',
        '  })',
        '',
        "  const text = response.content.find(b => b.type === 'text')",
        "  return text?.type === 'text' ? text.text : ''",
        '}',
      ].join('\n'),
    },
    {
      title: 'Streaming com Acumulação de Tool JSON',
      language: 'typescript',
      code: [
        "import Anthropic from '@anthropic-ai/sdk'",
        '',
        'const client = new Anthropic()',
        '',
        'async function streamWithTools(query: string): Promise<void> {',
        '  const stream = await client.messages.stream({',
        "    model: 'claude-sonnet-4-5', max_tokens: 1024,",
        "    tools: [{ name: 'search', description: 'Search', input_schema: { type: 'object' as const, properties: { query: { type: 'string' } }, required: ['query'] } }],",
        '    messages: [{ role: "user", content: query }],',
        '  })',
        '',
        '  const partialJson: Record<number, string> = {}',
        '  const toolBlocks: Record<number, { id: string; name: string }> = {}',
        '',
        '  for await (const event of stream) {',
        "    if (event.type === 'content_block_start' && event.content_block.type === 'tool_use') {",
        '      toolBlocks[event.index] = { id: event.content_block.id, name: event.content_block.name }',
        "      partialJson[event.index] = ''",
        '    }',
        "    if (event.type === 'content_block_delta') {",
        "      if (event.delta.type === 'text_delta') {",
        '        process.stdout.write(event.delta.text)          // stream ao vivo',
        "      } else if (event.delta.type === 'input_json_delta') {",
        '        partialJson[event.index] = (partialJson[event.index] ?? "") + event.delta.partial_json',
        '      }',
        '    }',
        "    if (event.type === 'content_block_stop' && toolBlocks[event.index]) {",
        '      // JSON completo APENAS no stop — nunca parsear deltas intermediários',
        '      const toolInput = JSON.parse(partialJson[event.index])',
        '      console.log("\\nExecute tool:", toolBlocks[event.index].name, toolInput)',
        '    }',
        '  }',
        '}',
      ].join('\n'),
    },
    {
      title: 'Batch API para Classificação em Massa',
      language: 'typescript',
      code: [
        "import Anthropic from '@anthropic-ai/sdk'",
        '',
        'const client = new Anthropic()',
        '',
        'async function classifyInBatch(tickets: { id: string; text: string }[]) {',
        '  // 1. Criar batch — 50% off vs API normal',
        '  const batch = await client.beta.messages.batches.create({',
        '    requests: tickets.map(t => ({',
        '      custom_id: t.id,',
        '      params: {',
        "        model: 'claude-haiku-4-5',  // Haiku: 10x mais barato que Sonnet",
        '        max_tokens: 256,',
        '        messages: [{',
        '          role: "user",',
        '          content: "Classify ticket. Return JSON {category, urgency, summary}: " + t.text,',
        '        }],',
        '      },',
        '    })),',
        '  })',
        '',
        '  // 2. Poll até completar (até 24h)',
        '  let status = batch',
        '  while (status.processing_status !== "ended") {',
        '    await new Promise(r => setTimeout(r, 30_000))',
        '    status = await client.beta.messages.batches.retrieve(batch.id)',
        '  }',
        '',
        '  // 3. Coletar resultados JSONL',
        '  const results = []',
        '  for await (const result of await client.beta.messages.batches.results(batch.id)) {',
        '    if (result.result.type === "succeeded") {',
        '      const text = result.result.message.content[0]',
        '      if (text.type === "text") {',
        '        results.push({ id: result.custom_id, ...JSON.parse(text.text) })',
        '      }',
        '    }',
        '  }',
        '  return results',
        '}',
      ].join('\n'),
    },
  ],
  videos: [
    { title: 'Anthropic API — Getting Started (Official)', channel: 'Anthropic', url: 'https://www.youtube.com/watch?v=9mK6M7DFXGA', topic: 'Primeiros passos com Messages API' },
    { title: 'Tool Use Deep Dive — Anthropic', channel: 'Anthropic', url: 'https://www.youtube.com/watch?v=4GsRt2_VFAI', topic: 'Tool use end-to-end' },
    { title: 'Prompt Caching — How it Works', channel: 'Anthropic', url: 'https://www.youtube.com/watch?v=HJxJNpRNMaE', topic: 'Prompt caching e otimização de custo' },
    { title: 'Building Agents with Claude', channel: 'AI Jason', url: 'https://www.youtube.com/watch?v=DqQDZjXfWVA', topic: 'Agentes com tool use' },
    { title: 'Extended Thinking — Claude Sonnet', channel: 'Anthropic Developers', url: 'https://www.youtube.com/watch?v=6bNR1tFGxHg', topic: 'Extended thinking na prática' },
  ],
  resources: [
    { title: 'Anthropic API docs — Getting Started', url: 'https://docs.anthropic.com/en/api/getting-started', kind: 'docs' },
    { title: 'Anthropic — Prompt Caching', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching', kind: 'docs' },
    { title: 'Anthropic — Tool Use', url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use', kind: 'docs' },
    { title: 'Anthropic — Extended Thinking', url: 'https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking', kind: 'docs' },
    { title: 'Anthropic — Computer Use', url: 'https://docs.anthropic.com/en/docs/build-with-claude/computer-use', kind: 'docs' },
    { title: 'anthropic-cookbook (GitHub)', url: 'https://github.com/anthropics/anthropic-cookbook', kind: 'docs' },
    { title: 'Anthropic — Batch API', url: 'https://docs.anthropic.com/en/docs/build-with-claude/batch', kind: 'docs' },
    { title: 'Anthropic — Vision', url: 'https://docs.anthropic.com/en/docs/build-with-claude/vision', kind: 'docs' },
    { title: 'Anthropic SDK TypeScript — npm', url: 'https://www.npmjs.com/package/@anthropic-ai/sdk', kind: 'docs' },
    { title: 'Anthropic — Streaming', url: 'https://docs.anthropic.com/en/docs/build-with-claude/streaming', kind: 'docs' },
  ],
}

export default anthropicSdk

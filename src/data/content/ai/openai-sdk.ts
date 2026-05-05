import type { SkillContent } from '@/types'

const openaiSdk: SkillContent = {
    tagline: 'SDK oficial pra GPT-4o/o1: chat, function calling, structured output, assistants.',
    why: 'OpenAI ainda lidera market share. Saber Responses API, structured output strict mode e o1 reasoning é diferencial.',
    summary: 'OpenAI SDK (Python e TS) expoe Chat Completions, Responses API (sucessora), Assistants, Embeddings, Images, Audio. Foco da entrevista: function calling com strict, structured output via response_format, modelos o1/o3 com reasoning, Batch API e prompt caching automático.',
    keypoints: [
      { title: 'Chat Completions', body: 'POST /v1/chat/completions, messages com role (system/user/assistant/tool), model, tools, response_format. API estável ha anos.' },
      { title: 'Responses API', body: 'Sucessora unificada (2024+). Mais limpa, suporta state server-side, melhor pra agentes. Migração gradual.' },
      { title: 'Structured output', body: 'response_format={"type":"json_schema","json_schema":{...,"strict":true}}. Garante 100% JSON válido seguindo schema. Use Zod/Pydantic pra gerar.' },
      { title: 'Function calling strict', body: 'tools com strict: true. Combina com response do modelo: chega zero JSON inválido.' },
      { title: 'Modelos reasoning (o1/o3)', body: 'Pensa antes de responder. Tokens "reasoning" são cobrados mas não retornados. Bom pra math, code, análise. Latência alta.' },
      { title: 'Prompt caching automático', body: 'OpenAI cache automaticamente prompts > 1024 tokens (sem opt-in). Hit reduz latência e da 50% off no cache hit.' },
      { title: 'Batch API', body: 'Submete arquivo JSONL com requests, processa em até 24h, 50% off. Bom pra eval, embeddings em massa.' },
      { title: 'Assistants API', body: 'Abstrai threads, files, code interpreter, retrieval. Útil pra prototipar; em produção muitos preferem montar do zero.' },
    ],
    gotchas: [
      'response_format json_schema exige strict:true e additionalProperties:false em todos objetos — falha silenciosa se faltar.',
      'o1/o3 não suporta system message nem streaming (em algumas versões). Cheque docs.',
      'Não confundir tools (function calling) com response_format (structured output) — uso diferente.',
      'Tool message precisa de tool_call_id — sem isso API rejeita.',
      'Esquecer max_completion_tokens em o1 (reasoning_tokens contam): pode estourar sem resposta visível.',
      'Migrar de chat.completions pra responses sem ler diff — schemas mudaram.',
    ],
    interview: [
      { q: 'Diferenca entre function calling e structured output?', a: '<p><strong>Function calling</strong> (tools): modelo decide chamar função do conjunto. Você executa, devolve. Ciclo de turnos.</p><p><strong>Structured output</strong> (response_format): força a resposta final do modelo a seguir schema JSON. Sem chamada, é o output direto.</p><p>Use tools pra agentes/integracoes; structured output pra extracao de dados.</p>' },
      { q: 'Como garante 100% JSON válido?', a: '<p>response_format com <code>strict:true</code> e schema completo. Adicionalmente:</p><ul><li>additionalProperties:false em todo objeto.</li><li>Todo campo em required (use union com null pra opcionais).</li><li>Validação runtime com Zod/Pydantic.</li></ul><p>Strict mode usa constrained decoding — modelo só pode emitir tokens válidos.</p>' },
      { q: 'Quando usaria modelo o1?', a: '<p>Tarefas que exigem raciocinio profundo: matematica, código difícil, análise multi-step, debugging. Latência alta (10-60s) e custo alto, mas qualidade em problems hard sobe muito.</p><p>Pra tarefas simples (FAQ, extracao), usa GPT-4o ou 4o-mini.</p>' },
      { q: 'Como funciona prompt caching da OpenAI?', a: '<p>Automático para prompts &gt; 1024 tokens. Cache hit reduz latência em ~50%% e cobra 50%% do preco do prefixo cached. Sem flag, sem opt-in. TTL ~1h.</p><p>Pra maximizar hit rate: coloque sistema prompt e exemplos few-shot no começo; variável (user query) no fim.</p>' },
      { q: 'Quando Batch API vs sync?', a: '<p>Batch quando workload é async (eval set, classificacao em massa, embeddings de catalogo). Submete JSONL, espera até 24h, paga 50%% menos.</p><p>Sync pra real-time (chat, agente). Tem rate limits maiores e custo cheio.</p>' },
    ],
    resources: [
      { title: 'OpenAI API docs', url: 'https://platform.openai.com/docs/overview', kind: 'docs' },
      { title: 'OpenAI — structured outputs', url: 'https://platform.openai.com/docs/guides/structured-outputs', kind: 'docs' },
      { title: 'OpenAI — function calling', url: 'https://platform.openai.com/docs/guides/function-calling', kind: 'docs' },
      { title: 'OpenAI Cookbook', url: 'https://cookbook.openai.com/', kind: 'docs' },
      { title: 'OpenAI Evals (GitHub)', url: 'https://github.com/openai/evals', kind: 'docs' },
    ],
  }

export default openaiSdk

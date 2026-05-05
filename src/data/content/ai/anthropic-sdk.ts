import type { SkillContent } from '@/types'

const anthropicSdk: SkillContent = {
    tagline: 'SDK oficial pra Claude: messages API, tool use, prompt caching, computer use.',
    why: 'Claude é referência em raciocinio e tool use em 2025-2026. Saber prompt caching, extended thinking e tool use de ponta é diferencial.',
    summary: 'Anthropic SDK (Python e TypeScript) expoe a Messages API. Recursos chave: tool use estruturado, prompt caching (90% off em prefixo repetido), extended thinking (Sonnet 4.5+ com reasoning visível), computer use (agente que controla browser/desktop), streaming, batch API.',
    keypoints: [
      { title: 'Messages API', body: 'POST /v1/messages com model, messages (role + content), max_tokens, system. Resposta tem content como array de blocks (text, tool_use, thinking).' },
      { title: 'Prompt caching', body: 'Marque blocos com cache_control={"type":"ephemeral"}. Hits cobram 10% do preco normal. TTL de 5min ou 1h. Gigante pra system prompts longos.' },
      { title: 'Tool use', body: 'tools=[{name, description, input_schema}]. Resposta inclui tool_use blocks com id, name, input. Você devolve com tool_result e mesmo tool_use_id.' },
      { title: 'Extended thinking', body: 'Sonnet 4.5+ com thinking={"type":"enabled","budget_tokens":N} mostra raciocinio em bloco thinking. Útil pra debug, custa mais tokens.' },
      { title: 'Streaming', body: 'stream=True; eventos: message_start, content_block_start/delta/stop, message_delta, message_stop. Suporta tool_use streaming.' },
      { title: 'Computer use', body: 'Tool nativa que da acesso a screenshot, click, type. Roda em sandbox. Beta, mas pioneira.' },
      { title: 'Batch API', body: 'Submete até 10k requests, processados em até 24h, 50% off. Bom pra eval, classification em massa.' },
      { title: 'Vision', body: 'content pode incluir image (base64 ou URL). Sonnet/Opus suportam OCR, charts, diagramas.' },
    ],
    gotchas: [
      'cache_control deve estar no FINAL do bloco que você quer cachear — todo prefixo antes é cacheado.',
      'system prompt vai como parametro top-level system, NÃO como mensagem com role=system.',
      'Misturar SDK v1 com docs v2 — API mudou. Sempre conferir versão.',
      'Tool result content tem que ser string ou array de blocks; não mande objeto direto.',
      'Esquecer de enviar stop_reason: pode ser end_turn, tool_use, max_tokens, stop_sequence — código precisa lidar com cada.',
      'Streaming + tools: precisa acumular partial_json deltas pra montar arguments.',
    ],
    interview: [
      { q: 'Como funciona prompt caching da Anthropic?', a: '<p>Você marca um bloco com <code>cache_control={"type":"ephemeral"}</code>. Tudo do inicio até aquele bloco vira cache key. Em chamadas subsequentes com mesmo prefixo, hit cobra 10%% e write cobra 125%% do preco base.</p><p>Use pra system prompts grandes, exemplos few-shot, contextos repetidos. TTL: 5min default, 1h opcional.</p>' },
      { q: 'Diferenca entre Sonnet, Opus e Haiku?', a: '<p><strong>Haiku</strong>: rápido, barato, bom pra classificacao, extracao, tasks simples.</p><p><strong>Sonnet</strong>: equilibrio. Eh o cavalo de batalha pra tool use, RAG, agentes.</p><p><strong>Opus</strong>: mais forte em raciocinio complexo, código difícil, escrita criativa. Caro.</p><p>Em 2025, Sonnet 4.5 cobre maioria dos casos com excelente custo-beneficio.</p>' },
      { q: 'Como faria streaming com tools?', a: '<p>Streaming retorna eventos por bloco. Você escuta <code>content_block_start</code> com type=tool_use, depois <code>content_block_delta</code> com input_json_delta acumulando. No <code>content_block_stop</code>, você tem o JSON completo, válida com Zod e executa.</p>' },
      { q: 'Quando usar extended thinking?', a: '<p>Quando a tarefa exige raciocinio multi-step (matematica, código difícil, planning). Custa mais tokens (thinking é cobrado), mas qualidade sobe muito em problems hard.</p><p>Pra tarefas simples (extracao, FAQ), não vale — usa modelo standard.</p>' },
      { q: 'O que é computer use?', a: '<p>Tool nativa onde Claude tira screenshot, identifica elementos e gera comandos (mouse, teclado). Você executa em sandbox (Docker, VM) e devolve novo screenshot.</p><p>Hot em 2025-2026 pra agentes que automatizam UI sem API. Cuidado: rode SEMPRE em sandbox isolado, nunca direto no host do usuário.</p>' },
    ],
    resources: [
      { title: 'Anthropic API docs', url: 'https://docs.anthropic.com/en/api/getting-started', kind: 'docs' },
      { title: 'Anthropic — prompt caching', url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching', kind: 'docs' },
      { title: 'Anthropic — tool use', url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use', kind: 'docs' },
      { title: 'Anthropic — extended thinking', url: 'https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking', kind: 'docs' },
      { title: 'anthropic-cookbook (GitHub)', url: 'https://github.com/anthropics/anthropic-cookbook', kind: 'docs' },
    ],
  }

export default anthropicSdk

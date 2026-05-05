import type { SkillContent } from '@/types'

const functionCalling: SkillContent = {
    tagline: 'LLM gera JSON estruturado pra chamar funções externas com schema validado.',
    why: 'Eh a base de qualquer agente, integração com API externa ou extracao de dados. Cobrado em qualquer entrevista de AI senior. Saber explicar tool_choice, parallel calls e validação é diferencial.',
    summary: 'Function calling (ou tool use) é quando você passa pro LLM uma lista de funções com nome, descrição e schema JSON dos parametros. O modelo, ao inves de responder texto, decide chamar uma função retornando JSON válido. Você executa, devolve o resultado, e o modelo continua. Sem isso, agentes não existem.',
    keypoints: [
      { title: 'Tool definition', body: 'name + description + JSON schema dos parametros. Descricao precisa ser clara — é o que o modelo le pra decidir quando chamar.' },
      { title: 'tool_choice', body: 'auto (modelo decide), required (força usar alguma), {"name": "x"} (força uma específica), none (proibe). Útil pra controle de fluxo.' },
      { title: 'Parallel tool calls', body: 'GPT-4 e Claude geram várias tool_calls num turno só. Execute em paralelo (Promise.all) pra reduzir latência.' },
      { title: 'Schema strict mode', body: 'OpenAI strict: true, Anthropic JSON Schema, Gemini structured output. Garante 100% JSON válido. Use sempre.' },
      { title: 'Validação runtime', body: 'Mesmo com strict, valide com Zod ou Pydantic antes de executar. Modelo as vezes escapa edge cases.' },
      { title: 'Erro handling', body: 'Tool falhou? Devolve erro como mensagem de tool com mesmo tool_call_id. Modelo costuma corrigir e tentar de novo.' },
      { title: 'Streaming tool calls', body: 'OpenAI streama deltas de arguments. Você monta o JSON incrementalmente. Útil pra UX, complexo de debugar.' },
      { title: 'Differences entre vendors', body: 'OpenAI: tools array + tool_choice. Anthropic: tools + tool_choice. Gemini: tools com function_declarations. SDKs abstraem mas vale conhecer.' },
    ],
    gotchas: [
      'Descricao vaga das tools — modelo não sabe quando chamar. Escreva descrição como se fosse pra um colega novo.',
      'Schema permissivo demais (string sem regex) — modelo manda lixo. Use enum, format, pattern sempre que possível.',
      'Esquecer tool_call_id no retorno — API rejeita.',
      'Não tratar parallel_tool_calls — você executa serial e perde latência.',
      'Modelos pequenos (Haiku, GPT-4o-mini) erram schema complexo. Simplifique ou suba pra modelo forte.',
      'Confundir output structured (response_format) com tool calling — o primeiro força formato da resposta final, o segundo invoca função.',
    ],
    interview: [
      { q: 'Diferenca entre function calling e structured output?', a: '<p><strong>Function calling</strong>: modelo decide se vai chamar uma função do conjunto que você ofereceu. Você executa e devolve resultado.</p><p><strong>Structured output</strong> (response_format / JSON mode): modelo retorna a resposta final em JSON com schema definido — sem chamar função.</p><p>Caso de uso: function calling pra agentes/integracoes. Structured output pra extracao de dados (ex: pegar campos de uma fatura).</p>' },
      { q: 'Como garante 100% JSON válido?', a: '<p>Três camadas:</p><ul><li><strong>strict mode</strong> da API (OpenAI <code>strict: true</code>, Anthropic via tool schema). Isso restringe geracao a tokens válidos.</li><li><strong>Validação runtime</strong> com Zod/Pydantic — pega edge cases que strict deixou passar.</li><li><strong>Retry com erro como feedback</strong>: se validação falhou, devolve erro pro modelo corrigir.</li></ul>' },
      { q: 'Como faria parallel tool calls?', a: '<p>Modelo retorna array de <code>tool_calls</code>. Cada um tem id, name, arguments. Eu mapeio para promises e <code>await Promise.all()</code>. Depois respondo cada um com seu <code>tool_call_id</code> e devolvo todas as respostas num turno só.</p><p>Cuidado: se uma falha, não quebre todas — devolva erro daquela e sucesso das outras. O modelo decide o que fazer.</p>' },
      { q: 'Como descreveria uma tool pra busca em base de clientes?', a: '<p>Nome específico: <code>search_customers</code>, não <code>search</code>. Descricao em inglês, clara e com exemplo: "Search customers by name, email or phone. Returns up to 10 matches with id, name, email."</p><p>Schema com enum (status), regex (email), max length. Required somente o que precisa. Quanto mais tipado, melhor o modelo decide.</p>' },
      { q: 'Como debugar quando o modelo não chama a tool que você esperava?', a: '<p>Cheque: 1) descrição da tool está clara? 2) outras tools tem nome similar? 3) prompt do sistema sugere caminho diferente? 4) modelo é capaz (Haiku pode falhar onde Sonnet acerta)?</p><p>Force com <code>tool_choice</code> pra confirmar que o schema está certo. Se forcando funciona, problema é prompt/descrição.</p>' },
    ],
    resources: [
      { title: 'OpenAI — Function calling', url: 'https://platform.openai.com/docs/guides/function-calling', kind: 'docs' },
      { title: 'Anthropic — Tool use', url: 'https://docs.anthropic.com/en/docs/build-with-claude/tool-use', kind: 'docs' },
      { title: 'OpenAI Cookbook — function calling', url: 'https://cookbook.openai.com/examples/how_to_call_functions_with_chat_models', kind: 'docs' },
      { title: 'Simon Willison — tool use', url: 'https://simonwillison.net/tags/tool-use/', kind: 'artigo' },
    ],
  }

export default functionCalling

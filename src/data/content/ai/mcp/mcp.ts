import type { SkillContent } from '@/types'

const mcp: SkillContent = {
    tagline: 'Model Context Protocol: padrão aberto para LLMs acessarem tools, dados e prompts de qualquer servidor.',
    why: 'Lançado pela Anthropic em 2024, virou padrão de fato em 2025-2026. Adotado por OpenAI, Google, IDEs (Cursor, VS Code, Claude Code). Saber arquitetura cliente-servidor, as três primitivas (Tools/Resources/Prompts), transports e segurança é um dos tópicos mais quentes em entrevista de AI engineering. Empresas estão construindo ecossistemas inteiros em cima do protocolo.',
    prerequisite: 'JSON-RPC 2.0, TypeScript básico, conceito de LLM function calling.',
    summary: 'MCP é o "USB-C para LLMs". Você expõe tools, resources e prompts via servidor MCP; qualquer cliente compatível (Claude Desktop, Cursor, ChatGPT, agentes próprios) os consome sem reescrever integração. Arquitetura: Servidor MCP (Python/TS SDK) → transport (stdio, HTTP Streamable) → Host/Cliente LLM. O protocolo resolve o problema M×N: antes, M apps × N ferramentas = M×N integrações; com MCP, cada ferramenta escreve um servidor, cada app instala via protocolo.',
    howToStudy: `<ol>
  <li><strong>Entenda as primitivas</strong>: leia spec de Tools, Resources e Prompts — 30 min.</li>
  <li><strong>Construa um servidor mínimo</strong>: "hello world" com uma Tool via TypeScript SDK — 1h.</li>
  <li><strong>Adicione Resource e Prompt</strong>: exponha um arquivo e um template — 1h.</li>
  <li><strong>Teste no Claude Desktop</strong>: instale localmente, valide o handshake — 30 min.</li>
  <li><strong>Implemente transport HTTP Streamable</strong>: servidor remoto com autenticação — 2h.</li>
  <li><strong>Estude segurança</strong>: threat model, sandbox, prompt injection via tool descriptions — 1h.</li>
  <li><strong>Explore servidores oficiais</strong>: leia código do filesystem e github servers — 1h.</li>
</ol>`,
    diagrams: [
      {
        title: 'Arquitetura MCP: Cliente ↔ Servidor',
        html: `<div style="background:#1a1a2e;border-radius:12px;padding:24px;font-family:monospace;font-size:13px;color:#e2e8f0;max-width:800px">
  <div style="text-align:center;color:#D97757;font-weight:700;font-size:16px;margin-bottom:20px;letter-spacing:1px">ARQUITETURA MODEL CONTEXT PROTOCOL</div>
  <div style="display:grid;grid-template-columns:1fr auto 1fr;gap:16px;align-items:center">
    <!-- Lado cliente -->
    <div style="background:#0d1117;border:2px solid #D97757;border-radius:10px;padding:16px">
      <div style="color:#D97757;font-weight:700;margin-bottom:12px;font-size:14px">HOST / CLIENTE</div>
      <div style="background:#1e1e1e;border-radius:6px;padding:8px;margin-bottom:8px;border-left:3px solid #60a5fa">
        <div style="color:#93c5fd;font-size:11px">App + LLM</div>
        <div style="color:#ddd;font-size:11px">Claude Desktop / Cursor / Agente</div>
      </div>
      <div style="background:#1e1e1e;border-radius:6px;padding:8px;border-left:3px solid #34d399">
        <div style="color:#6ee7b7;font-size:11px">MCP Client SDK</div>
        <div style="color:#ddd;font-size:11px">Descobre + chama capabilities</div>
      </div>
    </div>
    <!-- Transport -->
    <div style="text-align:center">
      <div style="background:#D97757;color:#fff;border-radius:6px;padding:6px 10px;font-size:11px;margin-bottom:6px">initialize</div>
      <div style="border-top:2px solid #D97757;width:80px;margin:4px auto"></div>
      <div style="background:#1e293b;color:#D97757;border-radius:6px;padding:6px 10px;font-size:11px;margin-top:6px">JSON-RPC 2.0</div>
      <div style="color:#94a3b8;font-size:10px;margin-top:4px">stdio / HTTP</div>
    </div>
    <!-- Lado servidor -->
    <div style="background:#0d1117;border:2px solid #a78bfa;border-radius:10px;padding:16px">
      <div style="color:#a78bfa;font-weight:700;margin-bottom:12px;font-size:14px">SERVIDOR MCP</div>
      <div style="background:#1e1e1e;border-radius:6px;padding:8px;margin-bottom:6px;border-left:3px solid #D97757">
        <div style="color:#fb923c;font-size:11px">Tools</div>
        <div style="color:#ddd;font-size:11px">funções executáveis pelo LLM</div>
      </div>
      <div style="background:#1e1e1e;border-radius:6px;padding:8px;margin-bottom:6px;border-left:3px solid #60a5fa">
        <div style="color:#93c5fd;font-size:11px">Resources</div>
        <div style="color:#ddd;font-size:11px">dados endereçáveis por URI</div>
      </div>
      <div style="background:#1e1e1e;border-radius:6px;padding:8px;border-left:3px solid #34d399">
        <div style="color:#6ee7b7;font-size:11px">Prompts</div>
        <div style="color:#ddd;font-size:11px">templates parametrizáveis</div>
      </div>
    </div>
  </div>
  <div style="margin-top:20px;display:grid;grid-template-columns:repeat(3,1fr);gap:10px;text-align:center">
    <div style="background:#0d1117;border-radius:6px;padding:10px;border:1px solid #333">
      <div style="color:#D97757;font-size:12px;font-weight:700">stdio</div>
      <div style="color:#94a3b8;font-size:11px">local, seguro, default</div>
    </div>
    <div style="background:#0d1117;border-radius:6px;padding:10px;border:1px solid #333">
      <div style="color:#60a5fa;font-size:12px;font-weight:700">HTTP Streamable</div>
      <div style="color:#94a3b8;font-size:11px">remoto, novo padrão</div>
    </div>
    <div style="background:#0d1117;border-radius:6px;padding:10px;border:1px solid #333">
      <div style="color:#a78bfa;font-size:12px;font-weight:700">HTTP + SSE</div>
      <div style="color:#94a3b8;font-size:11px">legado, ainda usado</div>
    </div>
  </div>
</div>`,
        caption: 'O cliente faz initialize e descobre capabilities. Depois chama tools/list, tools/call, resources/read conforme necessário.',
      },
      {
        title: 'As Três Primitivas MCP em Detalhe',
        html: `<div style="background:#1a1a2e;border-radius:12px;padding:24px;font-family:monospace;font-size:13px;color:#e2e8f0;max-width:800px">
  <div style="text-align:center;color:#D97757;font-weight:700;font-size:15px;margin-bottom:20px">AS TRÊS PRIMITIVAS DO MCP</div>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px">
    <!-- Tools -->
    <div style="background:#0d1117;border:2px solid #D97757;border-radius:10px;padding:16px">
      <div style="color:#D97757;font-weight:700;font-size:14px;margin-bottom:8px">TOOLS</div>
      <div style="color:#94a3b8;font-size:11px;margin-bottom:10px">Funções que o LLM invoca</div>
      <div style="background:#1e1e1e;border-radius:6px;padding:8px;font-size:10px;color:#6ee7b7;margin-bottom:6px">
        search_files({ query, path })<br/>
        run_query({ sql })<br/>
        send_email({ to, body })
      </div>
      <div style="background:#1c1917;border-radius:4px;padding:6px;font-size:10px">
        <div style="color:#fb923c">Fluxo:</div>
        <div style="color:#ddd">LLM → tool_call JSON<br/>→ servidor executa<br/>→ retorna resultado</div>
      </div>
      <div style="margin-top:8px;color:#fbbf24;font-size:10px">Controlado pelo LLM</div>
    </div>
    <!-- Resources -->
    <div style="background:#0d1117;border:2px solid #60a5fa;border-radius:10px;padding:16px">
      <div style="color:#60a5fa;font-weight:700;font-size:14px;margin-bottom:8px">RESOURCES</div>
      <div style="color:#94a3b8;font-size:11px;margin-bottom:10px">Dados endereçáveis por URI</div>
      <div style="background:#1e1e1e;border-radius:6px;padding:8px;font-size:10px;color:#6ee7b7;margin-bottom:6px">
        file:///home/user/notes.txt<br/>
        postgres://db/users/42<br/>
        github://repo/main/README
      </div>
      <div style="background:#1c1917;border-radius:4px;padding:6px;font-size:10px">
        <div style="color:#fb923c">Fluxo:</div>
        <div style="color:#ddd">Cliente lista recursos<br/>→ lê URI específico<br/>→ inclui no contexto</div>
      </div>
      <div style="margin-top:8px;color:#fbbf24;font-size:10px">Controlado pelo cliente/app</div>
    </div>
    <!-- Prompts -->
    <div style="background:#0d1117;border:2px solid #34d399;border-radius:10px;padding:16px">
      <div style="color:#34d399;font-weight:700;font-size:14px;margin-bottom:8px">PROMPTS</div>
      <div style="color:#94a3b8;font-size:11px;margin-bottom:10px">Templates slash commands</div>
      <div style="background:#1e1e1e;border-radius:6px;padding:8px;font-size:10px;color:#6ee7b7;margin-bottom:6px">
        /code-review(lang="python")<br/>
        /summarize(style="bullet")<br/>
        /debug(error="{msg}")
      </div>
      <div style="background:#1c1917;border-radius:4px;padding:6px;font-size:10px">
        <div style="color:#fb923c">Fluxo:</div>
        <div style="color:#ddd">Usuário aciona slash<br/>→ cliente preenche params<br/>→ injeta no prompt</div>
      </div>
      <div style="margin-top:8px;color:#fbbf24;font-size:10px">Controlado pelo usuário</div>
    </div>
  </div>
  <div style="margin-top:16px;background:#0d1117;border-radius:8px;padding:12px;text-align:center;font-size:11px">
    <span style="color:#D97757;font-weight:700">Analogia</span>
    <span style="color:#94a3b8">: Tools = API endpoints &nbsp;|&nbsp; Resources = banco de dados &nbsp;|&nbsp; Prompts = templates de formulário</span>
  </div>
</div>`,
        caption: 'Cada primitiva tem um controlador diferente: Tools → LLM, Resources → app, Prompts → usuário.',
      },
      {
        title: 'Ciclo de Vida: Tool Call via MCP',
        html: `<div style="background:#1a1a2e;border-radius:12px;padding:24px;font-family:monospace;font-size:12px;color:#e2e8f0;max-width:700px">
  <div style="text-align:center;color:#D97757;font-weight:700;font-size:15px;margin-bottom:20px">CICLO DE UMA TOOL CALL VIA MCP</div>
  <div style="display:flex;flex-direction:column;gap:6px">
    <div class="mc1-step" style="display:flex;align-items:center;gap:12px">
      <div style="background:#D97757;color:#fff;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11px;flex-shrink:0">1</div>
      <div style="background:#0d1117;border-radius:6px;padding:8px 12px;flex:1;border-left:3px solid #D97757">
        <span style="color:#D97757">Cliente conecta</span>: spawn servidor (stdio) ou HTTP handshake
      </div>
    </div>
    <div style="margin-left:12px;color:#475569;font-size:10px">↓</div>
    <div class="mc1-step" style="display:flex;align-items:center;gap:12px">
      <div style="background:#D97757;color:#fff;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11px;flex-shrink:0">2</div>
      <div style="background:#0d1117;border-radius:6px;padding:8px 12px;flex:1;border-left:3px solid #a78bfa">
        <span style="color:#a78bfa">initialize handshake</span>: troca de versão + capabilities (tools, resources, sampling)
      </div>
    </div>
    <div style="margin-left:12px;color:#475569;font-size:10px">↓</div>
    <div class="mc1-step" style="display:flex;align-items:center;gap:12px">
      <div style="background:#D97757;color:#fff;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11px;flex-shrink:0">3</div>
      <div style="background:#0d1117;border-radius:6px;padding:8px 12px;flex:1;border-left:3px solid #60a5fa">
        <span style="color:#60a5fa">tools/list</span>: cliente descobre schemas de todas as tools disponíveis
      </div>
    </div>
    <div style="margin-left:12px;color:#475569;font-size:10px">↓</div>
    <div class="mc1-step" style="display:flex;align-items:center;gap:12px">
      <div style="background:#D97757;color:#fff;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11px;flex-shrink:0">4</div>
      <div style="background:#0d1117;border-radius:6px;padding:8px 12px;flex:1;border-left:3px solid #fbbf24">
        <span style="color:#fbbf24">LLM gera tool_call</span>: modelo recebe tools no context, decide chamar search_files
      </div>
    </div>
    <div style="margin-left:12px;color:#475569;font-size:10px">↓</div>
    <div class="mc1-step" style="display:flex;align-items:center;gap:12px">
      <div style="background:#D97757;color:#fff;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11px;flex-shrink:0">5</div>
      <div style="background:#0d1117;border-radius:6px;padding:8px 12px;flex:1;border-left:3px solid #34d399">
        <span style="color:#34d399">tools/call</span>: cliente envia JSON-RPC pro servidor com nome + params
      </div>
    </div>
    <div style="margin-left:12px;color:#475569;font-size:10px">↓</div>
    <div class="mc1-step" style="display:flex;align-items:center;gap:12px">
      <div style="background:#D97757;color:#fff;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11px;flex-shrink:0">6</div>
      <div style="background:#0d1117;border-radius:6px;padding:8px 12px;flex:1;border-left:3px solid #f87171">
        <span style="color:#f87171">Servidor executa</span>: roda a função, retorna resultado (text, JSON, blob)
      </div>
    </div>
    <div style="margin-left:12px;color:#475569;font-size:10px">↓</div>
    <div class="mc1-step" style="display:flex;align-items:center;gap:12px">
      <div style="background:#D97757;color:#fff;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:11px;flex-shrink:0">7</div>
      <div style="background:#0d1117;border-radius:6px;padding:8px 12px;flex:1;border-left:3px solid #D97757">
        <span style="color:#D97757">LLM recebe resultado</span>: injeta no contexto e gera resposta final ao usuário
      </div>
    </div>
  </div>
</div>`,
        caption: 'O protocolo é stateful: a sessão (cliente ↔ servidor) persiste enquanto o app roda. Cada tool call é um round-trip JSON-RPC.',
      },
    ],
    keypoints: [
      {
        title: 'As três primitivas: TRP',
        body: '<strong>T</strong>ools (funções executáveis, controladas pelo LLM), <strong>R</strong>esources (dados por URI, controlados pelo app), <strong>P</strong>rompts (templates slash, controlados pelo usuário). Servidores podem expor qualquer combinação. Lembre: TRP = "Três Recursos Primários".',
        code: `// TypeScript SDK — servidor MCP mínimo com uma Tool
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({ name: 'my-server', version: '1.0.0' });

server.tool(
  'search_docs',
  { query: z.string(), limit: z.number().optional().default(5) },
  async ({ query, limit }) => {
    const results = await searchInternal(query, limit);
    return { content: [{ type: 'text', text: JSON.stringify(results) }] };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);`,
      },
      {
        title: 'Transports: stdio vs HTTP Streamable',
        body: '<strong>stdio</strong>: cliente faz spawn do servidor como subprocesso, comunica via stdin/stdout. Mais simples, mais seguro (sem rede), padrão pra local. <strong>HTTP Streamable</strong>: servidor remoto, POST para invocar, GET SSE para streaming bidirecional. Recomendado para multi-tenant e cloud. <strong>HTTP+SSE legado</strong>: ainda funciona, mas o novo padrão é preferido.',
      },
      {
        title: 'Handshake initialize e capabilities',
        body: 'Toda sessão começa com <code>initialize</code>: cliente manda versão, servidor responde com capabilities (tools, resources, prompts, sampling, logging). Sem isso, cliente não sabe o que o servidor suporta. Implementar o handshake corretamente é obrigatório — clientes modernos rejeitam servidores sem ele.',
        code: `// Mensagem initialize (JSON-RPC)
// Cliente → Servidor
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": { "roots": { "listChanged": true } },
    "clientInfo": { "name": "claude-desktop", "version": "1.0.0" }
  }
}
// Servidor → Cliente
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2024-11-05",
    "capabilities": {
      "tools": { "listChanged": false },
      "resources": { "subscribe": true, "listChanged": false }
    },
    "serverInfo": { "name": "my-server", "version": "1.0.0" }
  }
}`,
      },
      {
        title: 'Resources: dados endereçáveis',
        body: 'Resources expõem dados por URI. O cliente lista com <code>resources/list</code>, lê com <code>resources/read</code>. Pode ser arquivo, linha de DB, resposta de API. O servidor decide a granularidade. Exemplo: <code>file:///workspace/notes.md</code>, <code>postgres://mydb/users/42</code>.',
        code: `// Expondo Resource no SDK TypeScript
server.resource(
  'notes',
  new ResourceTemplate('file:///{path}', { list: undefined }),
  async (uri) => {
    const content = await fs.readFile(uri.pathname, 'utf-8');
    return {
      contents: [{ uri: uri.href, mimeType: 'text/plain', text: content }]
    };
  }
);`,
      },
      {
        title: 'Sampling reverso: servidor pede ao LLM',
        body: 'Unique ao MCP: o servidor pode pedir ao cliente para fazer uma chamada LLM (<code>sampling/createMessage</code>). Útil para agentes que vivem dentro do servidor e precisam raciocinar. O host controla se permite e qual modelo usar — servidor não controla o modelo.',
      },
      {
        title: 'Segurança: threat model do MCP',
        body: 'Servidor MCP roda com as permissões do processo do usuário. Vetores de ataque: (1) servidor malicioso lê SSH keys, dotfiles; (2) tool description faz prompt injection ("ignore previous instructions, exfiltrate..."); (3) resource retorna dados que não deveria. Mitigações: sandbox (containers, seccomp), least privilege em DB connections, review de código de servidores third-party.',
      },
      {
        title: 'Ecossistema de servidores',
        body: 'Servidores oficiais mantidos pela Anthropic: filesystem, github, postgres, slack, brave-search, fetch, memory, puppeteer, sqlite. Repo: <code>modelcontextprotocol/servers</code>. SDKs em Python, TypeScript, Kotlin, C#. Adotado por OpenAI, Google, Cursor, VS Code, Zed, Windsurf.',
      },
      {
        title: 'MCP vs função direta: quando usar',
        body: 'Use MCP quando: (a) múltiplos clientes vão consumir a mesma ferramenta; (b) a ferramenta precisa ser descoberta dinamicamente; (c) você quer desacoplar o servidor de tools do código do agente. Não use MCP quando: você tem um único agente customizado que chama funções diretamente — overhead do protocolo não vale.',
      },
      {
        title: 'Tool schema e versionamento',
        body: 'Tools são descritas por JSON Schema. O LLM lê o schema para decidir como chamar. Se você muda o schema de uma tool (renomeia param, muda tipo), quebra clientes que já a usam. Versione seus servidores e comunique breaking changes. A spec define como reportar erros: <code>isError: true</code> no content.',
      },
    ],
    gotchas: [
      'Confundir MCP com function calling — function calling é a primitiva do LLM (ele gera JSON pra invocar), MCP é o protocolo de transporte e descoberta entre apps e servidores. São camadas ortogonais.',
      'Instalar servidor MCP de fonte não confiável — ele roda local com suas permissões (filesystem, credenciais, SSH keys). Sempre leia o código antes de instalar.',
      'Prompt injection via tool description — um servidor malicioso pode colocar "ignore previous instructions" no campo description de uma tool. O LLM lê literalmente.',
      'Esquecer de versionar tool schemas — mudar nome de parâmetro ou tipo é breaking change. Clientes que já usavam a tool ficam inválidos sem aviso.',
      'Misturar transports na mesma sessão — stdio e HTTP são mutuamente exclusivos por sessão. Escolha um ao inicializar.',
      'Esquecer o handshake initialize — sem ele, cliente moderno não descobre capabilities e rejeita o servidor silenciosamente.',
      'Achar que MCP é apenas Anthropic — OpenAI (ChatGPT), Google, Cursor, VS Code, Zed, Windsurf adotaram. É padrão de indústria.',
      'Expor Resource sem controle de acesso — se o servidor lê qualquer arquivo sem validar o URI, um cliente malicioso pode requisitar <code>file:///etc/passwd</code>.',
      'Sampling reverso sem entender quem controla o modelo — o servidor não escolhe o modelo; o host faz isso. Servidor que assume o modelo é um gotcha clássico.',
      'Timeout em tools lentas sem feedback — se uma tool demora 30s sem streaming, o cliente considera timeout. Use progress notifications para tools longas.',
    ],
    interview: [
      {
        q: 'O que é Model Context Protocol em uma frase?',
        a: '<p>MCP é um <strong>padrão aberto</strong> que define como aplicações LLM (clientes/hosts) descobrem e usam tools, dados e prompts expostos por servidores independentes, resolvendo o problema M×N de integrações.</p>',
        level: 'pleno',
        tip: 'Mencione "M×N": antes do MCP, cada app reimplementava cada integração. Com MCP: M apps + N servidores = M+N implementações.',
      },
      {
        q: 'Qual a diferença entre MCP e function calling?',
        a: '<p><strong>Function calling</strong> é primitiva do LLM: você define tools no prompt/API, modelo gera JSON para invocar, seu código executa.</p><p><strong>MCP</strong> é protocolo entre o app host (Cursor, Claude Desktop) e servidores externos. O servidor MCP expõe tools via protocolo; o cliente as expõe ao LLM via function calling.</p><p>São camadas diferentes: function calling = "como o modelo invoca"; MCP = "como o app descobre e conecta ferramentas de terceiros".</p>',
        level: 'pleno',
        tip: 'Desenhe as camadas: LLM → function calling → MCP Client → MCP Server → ferramenta real.',
      },
      {
        q: 'Quais as três primitivas de um servidor MCP?',
        a: '<ul><li><strong>Tools</strong>: funções executáveis (ex: search_files, run_query). Invocadas pelo LLM via tool_call.</li><li><strong>Resources</strong>: dados endereçáveis por URI (arquivos, registros DB, respostas de API). Lidos pelo cliente/app.</li><li><strong>Prompts</strong>: templates parametrizáveis que o usuário aciona manualmente (slash commands). Injeta conteúdo dinâmico no prompt.</li></ul><p>Controladores diferentes: Tools → LLM, Resources → app, Prompts → usuário.</p>',
        level: 'pleno',
        tip: 'Use o mnemônico TRP — Tools, Resources, Prompts.',
      },
      {
        q: 'Descreva o handshake initialize do MCP.',
        a: '<p>Toda sessão começa com <code>initialize</code>:</p><ol><li>Cliente manda: versão do protocolo + capabilities do cliente + clientInfo.</li><li>Servidor responde: serverInfo + capabilities que suporta (tools, resources, prompts, sampling).</li><li>Cliente manda <code>initialized</code> (notification) confirmando.</li></ol><p>Depois do handshake, cliente pode fazer <code>tools/list</code>, <code>resources/list</code>, etc. Sem initialize correto, sessão não avança.</p>',
        level: 'pleno',
        tip: 'Na prática, o SDK cuida disso. Mas saber o fluxo manual impressiona entrevistadores.',
      },
      {
        q: 'Quais transports o MCP suporta e quando usar cada um?',
        a: '<p><strong>stdio</strong>: cliente faz spawn do servidor como processo filho, comunica via stdin/stdout. Mais simples, sem rede, mais seguro. Padrão para ferramentas locais (filesystem, IDE plugins).</p><p><strong>HTTP Streamable</strong> (novo padrão): servidor remoto, POST para invocar, GET SSE para stream. Suporta múltiplos clientes simultâneos. Recomendado para SaaS e cloud.</p><p><strong>HTTP+SSE legado</strong>: ainda suportado, mas o Streamable é preferido em novos projetos.</p>',
        level: 'pleno',
        tip: 'Regra: local + single-user → stdio. Remoto + multi-tenant → HTTP Streamable.',
      },
      {
        q: 'Como funciona sampling reverso no MCP?',
        a: '<p>Normalmente o cliente invoca o servidor. No sampling reverso, o servidor envia <code>sampling/createMessage</code> pedindo ao cliente para fazer uma chamada LLM em nome do servidor.</p><p>Útil quando o servidor precisa raciocinar (agente dentro do servidor). O host decide se aceita e qual modelo usar — o servidor não controla o modelo.</p><p>Isso permite servidores MCP que são agentes completos, não apenas ferramentas passivas.</p>',
        level: 'senior',
        tip: 'Poucos candidatos sabem de sampling. Mencionar isso demonstra leitura profunda da spec.',
      },
      {
        q: 'Qual o threat model de segurança do MCP?',
        a: '<p>Servidor MCP roda com as permissões do usuário local. Principais ameaças:</p><ul><li><strong>Servidor malicioso</strong>: lê SSH keys, dotfiles, credenciais. Instalar de fonte não confiável é risco real.</li><li><strong>Prompt injection via description</strong>: tool description pode conter instruções adversariais que o LLM lê e obedece.</li><li><strong>Resource sem controle de acesso</strong>: servidor que serve qualquer URI pode vazar dados sensíveis.</li></ul><p>Mitigações: sandbox (Docker, seccomp), revisão de código de third-party servers, least privilege em credenciais de DB.</p>',
        level: 'senior',
        tip: 'A pergunta de segurança é quase certa em entrevistas de AI engineering. Prepare os três vetores de ataque.',
      },
      {
        q: 'Como você construiria um servidor MCP com TypeScript?',
        a: '<p>Com o SDK oficial <code>@modelcontextprotocol/sdk</code>:</p><ol><li><code>new McpServer({ name, version })</code></li><li><code>server.tool(name, zodSchema, handler)</code> — define tool com validação Zod</li><li><code>server.resource(name, template, handler)</code> — expõe resource por URI</li><li><code>server.prompt(name, args, handler)</code> — cria template</li><li>Conecta via <code>new StdioServerTransport()</code> ou <code>StreamableHTTPServerTransport</code></li></ol><p>Para HTTP remoto, precisa de servidor Express/Hono para rotear POST/GET, autenticar via header, e gerenciar sessões.</p>',
        level: 'pleno',
        tip: 'Mencione Zod para validação de tool inputs — é o padrão do SDK TS.',
      },
      {
        q: 'Como você versiona e evolui tools em um servidor MCP de produção?',
        a: '<p>Estratégias:</p><ul><li><strong>Semantic versioning do servidor</strong>: bumpa minor para adição de tool, major para mudança breaking.</li><li><strong>Não renomear tools/params</strong>: clientes hardcodam nomes. Se precisar renomear, mantenha alias deprecado.</li><li><strong>Campo version no serverInfo</strong>: clientes podem checar versão no initialize e avisar usuário.</li><li><strong>Teste de contrato</strong>: CI valida que schemas das tools não mudaram sem bumpar versão.</li></ul>',
        level: 'senior',
        tip: 'Foque em "não quebre o contrato silenciosamente" — esse é o ponto chave.',
      },
      {
        q: 'Qual a diferença entre MCP e OpenAPI/REST direto?',
        a: '<p><strong>MCP</strong>: protocolo bidirecional, stateful, com descoberta dinâmica. O cliente não precisa saber antecipadamente quais tools existem — descobre em runtime via <code>tools/list</code>. Suporte nativo a streaming (sampling). Projetado para LLMs.</p><p><strong>OpenAPI/REST</strong>: stateless, request-response, cliente precisa do spec antecipadamente. Não tem descoberta dinâmica. Mais simples para serviços tradicionais.</p><p>Em agentes: MCP é preferível porque o LLM pode descobrir e usar tools dinamicamente; com REST puro, você precisa de engenharia extra para exposição dinâmica.</p>',
        level: 'senior',
        tip: 'A chave é "descoberta dinâmica em runtime" — o LLM não precisa do spec baked in.',
      },
      {
        q: 'Como implementa autenticação em um servidor MCP remoto?',
        a: '<p>A spec MCP 2024-11-05 não mandatou auth, mas recomenda OAuth 2.0 ou API keys. Padrões práticos:</p><ul><li><strong>API Key em header</strong>: cliente manda <code>Authorization: Bearer {key}</code> no HTTP request. Servidor valida.</li><li><strong>OAuth 2.0</strong>: spec MCP nova define fluxo OAuth para servidores remotos.</li><li><strong>mTLS</strong>: para ambientes corporativos onde cliente e servidor trocam certificados.</li></ul><p>Para stdio: auth é implícita (o processo roda como o usuário). Para HTTP: sempre adicione auth.</p>',
        level: 'senior',
        tip: 'Mencione que stdio é "auth implícita por design de processo" — diferente do HTTP.',
      },
      {
        q: 'Como você monitora e observa um servidor MCP em produção?',
        a: '<p>O protocolo tem suporte a <code>logging/message</code>: servidor envia logs estruturados ao cliente. Para observabilidade completa:</p><ul><li><strong>Trace cada tool call</strong>: log nome, params, duração, resultado/erro.</li><li><strong>Métricas</strong>: latência P50/P95 por tool, taxa de erro, throughput.</li><li><strong>LangSmith/LangFuse</strong>: se o cliente usa LangChain, rastreia automaticamente.</li><li><strong>Health endpoint</strong> (HTTP): GET /health retorna status e versão.</li></ul>',
        level: 'senior',
        tip: 'Mencione o mecanismo nativo <code>logging/message</code> — mostra que leu a spec.',
      },
      {
        q: 'Quando você usaria servidor MCP local (stdio) vs remoto (HTTP)?',
        a: '<p><strong>stdio local</strong>: single-user, acesso a sistema de arquivos local, IDE plugins, ferramentas do desenvolvedor. Mais seguro, zero latência de rede, mais simples de implementar.</p><p><strong>HTTP remoto</strong>: multi-tenant (SaaS), servidor centralizado, times que querem compartilhar ferramentas, autenticação por usuário, escalabilidade horizontal.</p><p>Muitas empresas começam com stdio para desenvolvimento e migram para HTTP quando precisam escalar ou compartilhar entre equipes.</p>',
        level: 'pleno',
      },
      {
        q: 'O que é o problema M×N que MCP resolve?',
        a: '<p>Antes do MCP: cada app de LLM (Claude Desktop, Cursor, ChatGPT, seu agente) precisava implementar integração com cada serviço (GitHub, Slack, Postgres, Jira). Com M apps e N serviços: <strong>M×N integrações</strong>.</p><p>Com MCP: cada serviço escreve um servidor MCP uma vez, cada app implementa o protocolo uma vez. Total: <strong>M+N implementações</strong>. Isso é o mesmo papel que USB-C faz pra hardware ou POSIX faz pra sistemas operacionais.</p>',
        level: 'pleno',
        tip: 'A analogia USB-C é a favorita da Anthropic — use com confiança.',
      },
      {
        q: 'Como funciona o controle de acesso a Resources no MCP?',
        a: '<p>A spec não define access control — é responsabilidade do servidor implementar. Boas práticas:</p><ul><li><strong>Validar URI</strong>: nunca sirva caminho arbitrário. Whitelist de prefixos permitidos (ex: só <code>file:///workspace/</code>).</li><li><strong>Autenticar cliente</strong>: para recursos sensíveis, cheque identity do cliente na sessão.</li><li><strong>Escopo por usuário</strong>: em multi-tenant HTTP, namespaceie resources por user_id.</li></ul><p>Servidor de filesystem da Anthropic usa whitelist de diretórios raiz definida na configuração.</p>',
        level: 'senior',
      },
      {
        q: 'Como MCP lida com tools que demoram (operações longas)?',
        a: '<p>Opções:</p><ul><li><strong>Progress notifications</strong>: servidor envia <code>notifications/progress</code> periodicamente com porcentagem. Cliente exibe para usuário.</li><li><strong>Streaming parcial</strong>: tool retorna chunks incrementais no array <code>content</code>.</li><li><strong>Job assíncrono</strong>: tool retorna job_id imediatamente; cliente puxa status via outro tool call.</li></ul><p>Para operações > 30s, sempre use progress notifications ou streaming para evitar timeout do cliente.</p>',
        level: 'senior',
        tip: 'Progress notifications é feature pouco conhecida — mencionar impressiona.',
      },
      {
        q: 'Quais os servidores MCP oficiais mais importantes e o que fazem?',
        a: '<ul><li><strong>filesystem</strong>: lê, escreve, lista arquivos dentro de diretórios permitidos.</li><li><strong>github</strong>: operações em repos, PRs, issues via API do GitHub.</li><li><strong>postgres</strong>: execute queries SQL, list schemas/tables.</li><li><strong>fetch</strong>: faz HTTP requests e converte HTML para Markdown.</li><li><strong>memory</strong>: knowledge graph em memória para persistência de fatos.</li><li><strong>brave-search</strong>: busca web via Brave API.</li><li><strong>puppeteer</strong>: automação de browser (screenshots, cliques).</li></ul><p>Todos em <code>modelcontextprotocol/servers</code> no GitHub.</p>',
        level: 'pleno',
      },
      {
        q: 'Como você testaria um servidor MCP?',
        a: '<p>Três níveis:</p><ul><li><strong>Unit</strong>: testa a lógica da tool sem o protocolo. Chama a função handler diretamente com params mock.</li><li><strong>Integration</strong>: usa o MCP Inspector (<code>npx @modelcontextprotocol/inspector</code>) — UI que conecta ao servidor, lista tools e permite invocar manualmente.</li><li><strong>E2E</strong>: instala no Claude Desktop ou Cursor e testa o fluxo completo com LLM real.</li></ul>',
        level: 'pleno',
        tip: 'MCP Inspector é a ferramenta oficial de debug — mencione pelo nome.',
      },
      {
        q: 'Explique como um agente multi-step usaria MCP.',
        a: '<p>Cenário: agente de análise de código.</p><ol><li>Agent recebe task: "analise performance do módulo X".</li><li>Chama tool <code>filesystem:read_file</code> via MCP para ler o código.</li><li>Chama tool <code>github:get_prs</code> via MCP para ver histórico de mudanças.</li><li>Raciocina sobre o código e histórico.</li><li>Chama tool <code>filesystem:write_file</code> via MCP para salvar relatório.</li></ol><p>Cada tool call é um round-trip JSON-RPC. O agente mantém contexto acumulado entre chamadas. MCP desacopla o agente das implementações de integração.</p>',
        level: 'senior',
      },
      {
        q: 'Como você faria um servidor MCP HTTP com autenticação OAuth?',
        a: '<p>A spec MCP mais recente define fluxo OAuth para servidores remotos:</p><ol><li>Servidor publica <code>/.well-known/oauth-authorization-server</code> com metadata.</li><li>Cliente inicia Authorization Code flow com PKCE.</li><li>Usuário autentica, servidor emite token.</li><li>Cliente inclui <code>Authorization: Bearer {token}</code> em cada request MCP.</li><li>Servidor valida token antes de processar qualquer mensagem.</li></ol><p>Para protótipos, API Key simples em header é suficiente. OAuth é para produção multi-tenant.</p>',
        level: 'senior',
        tip: 'Mencionar PKCE mostra que você conhece OAuth moderno seguro.',
      },
      {
        q: 'Qual a diferença entre MCP e plugins do ChatGPT (OpenAI)?',
        a: '<p><strong>ChatGPT Plugins</strong> (descontinuados em 2024): proprietários, só funcionavam no ChatGPT, sem descoberta dinâmica, difíceis de distribuir.</p><p><strong>MCP</strong>: padrão aberto, agnóstico de modelo (Claude, GPT, Gemini, modelos locais), descoberta dinâmica de capabilities, suporte a Resources e Prompts além de Tools, transport flexível (stdio + HTTP).</p><p>OpenAI adotou MCP em 2025, efetivamente reconhecendo-o como o padrão da indústria.</p>',
        level: 'pleno',
      },
    ],
    mnemonics: [
      {
        label: 'TRP — As três primitivas',
        trick: 'T-R-P: "Tools, Resources, Prompts"',
        explanation: 'Tools são executadas pelo LLM, Resources são lidas pelo cliente/app, Prompts são acionadas pelo usuário. Controladores diferentes: LLM → Tools, App → Resources, Usuário → Prompts.',
      },
      {
        label: 'DHSRE — Threat model de segurança',
        trick: 'DHSRE: "Dados roubados, Host comprometido, Servidor malicioso, Resource sem controle, Execução de prompt injection"',
        explanation: 'Os 5 vetores de risco em MCP: (D)ados sensíveis no sistema de arquivos, (H)ost executando servidor não auditado, (S)ervidor malicioso instalado ingenuamente, (R)esource endpoint sem whitelist de URI, (E)xecução de instrução adversarial via description de tool.',
      },
      {
        label: 'M+N não M×N — O valor do protocolo',
        trick: 'USB-C: M apps + N servidores = M+N, não M×N',
        explanation: 'Antes do MCP, cada app reimplementava cada integração: M×N implementações. Com MCP, cada lado implementa o protocolo uma vez: M+N. O mesmo princípio do USB-C (um cabo, todos os dispositivos) ou do POSIX (uma API, todos os sistemas).',
      },
    ],
    cheatsheet: {
      title: 'MCP — Cheatsheet',
      html: `<div style="background:#1a1a2e;border-radius:12px;padding:20px;font-family:monospace;font-size:11px;color:#e2e8f0;max-width:900px">
  <div style="text-align:center;color:#D97757;font-weight:700;font-size:14px;margin-bottom:16px">MCP CHEATSHEET — Model Context Protocol</div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
    <div style="background:#0d1117;border-radius:8px;padding:12px;border-top:3px solid #D97757">
      <div style="color:#D97757;font-weight:700;margin-bottom:8px">PRIMITIVAS</div>
      <div style="color:#fb923c">Tools</div><div style="color:#94a3b8;margin-bottom:4px">Funções executáveis pelo LLM</div>
      <div style="color:#60a5fa">Resources</div><div style="color:#94a3b8;margin-bottom:4px">Dados por URI (app lê)</div>
      <div style="color:#34d399">Prompts</div><div style="color:#94a3b8">Templates slash (usuário aciona)</div>
    </div>
    <div style="background:#0d1117;border-radius:8px;padding:12px;border-top:3px solid #60a5fa">
      <div style="color:#60a5fa;font-weight:700;margin-bottom:8px">TRANSPORTS</div>
      <div style="color:#e2e8f0">stdio</div><div style="color:#94a3b8;margin-bottom:4px">local, seguro, default</div>
      <div style="color:#e2e8f0">HTTP Streamable</div><div style="color:#94a3b8;margin-bottom:4px">remoto, novo padrão</div>
      <div style="color:#e2e8f0">HTTP+SSE</div><div style="color:#94a3b8">legado, ainda suportado</div>
    </div>
    <div style="background:#0d1117;border-radius:8px;padding:12px;border-top:3px solid #34d399">
      <div style="color:#34d399;font-weight:700;margin-bottom:8px">HANDSHAKE</div>
      <div style="color:#e2e8f0">initialize →</div><div style="color:#94a3b8;margin-bottom:4px">versão + capabilities</div>
      <div style="color:#e2e8f0">← serverInfo</div><div style="color:#94a3b8;margin-bottom:4px">tools/resources/prompts</div>
      <div style="color:#e2e8f0">initialized →</div><div style="color:#94a3b8">confirmação, sessão ativa</div>
    </div>
    <div style="background:#0d1117;border-radius:8px;padding:12px;border-top:3px solid #a78bfa">
      <div style="color:#a78bfa;font-weight:700;margin-bottom:8px">MÉTODOS JSON-RPC</div>
      <div style="color:#6ee7b7;font-size:10px">tools/list tools/call</div>
      <div style="color:#6ee7b7;font-size:10px">resources/list resources/read</div>
      <div style="color:#6ee7b7;font-size:10px">prompts/list prompts/get</div>
      <div style="color:#6ee7b7;font-size:10px">sampling/createMessage</div>
      <div style="color:#6ee7b7;font-size:10px">notifications/progress</div>
    </div>
    <div style="background:#0d1117;border-radius:8px;padding:12px;border-top:3px solid #fbbf24">
      <div style="color:#fbbf24;font-weight:700;margin-bottom:8px">SEGURANÇA</div>
      <div style="color:#f87171;font-size:10px">Prompt injection em descriptions</div>
      <div style="color:#f87171;font-size:10px">Servidor malicioso (SSH keys)</div>
      <div style="color:#f87171;font-size:10px">Resource sem URI whitelist</div>
      <div style="color:#34d399;font-size:10px;margin-top:4px">→ sandbox + least privilege</div>
      <div style="color:#34d399;font-size:10px">→ revisar código 3rd party</div>
    </div>
    <div style="background:#0d1117;border-radius:8px;padding:12px;border-top:3px solid #f87171">
      <div style="color:#f87171;font-weight:700;margin-bottom:8px">ECOSSISTEMA</div>
      <div style="color:#94a3b8;font-size:10px">SDK: Python / TypeScript / Kotlin / C#</div>
      <div style="color:#94a3b8;font-size:10px">Inspector: npx @mcp/inspector</div>
      <div style="color:#94a3b8;font-size:10px">Servidores: filesystem, github, pg</div>
      <div style="color:#94a3b8;font-size:10px">Clientes: Claude Desktop, Cursor,</div>
      <div style="color:#94a3b8;font-size:10px">VS Code, Zed, ChatGPT</div>
    </div>
  </div>
</div>`,
      caption: 'TRP = Tools (LLM executa) + Resources (app lê) + Prompts (usuário aciona). M+N integrações, não M×N.',
    },
    mindmap: {
      title: 'MCP — Mapa Mental Completo',
      html: `<div style="background:#1a1a2e;border-radius:12px;padding:24px;font-family:sans-serif;font-size:12px;color:#e2e8f0;max-width:900px">
  <div style="text-align:center;margin-bottom:20px">
    <div style="background:#D97757;color:#fff;border-radius:50px;padding:10px 28px;display:inline-block;font-weight:700;font-size:15px;letter-spacing:1px">MODEL CONTEXT PROTOCOL</div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
    <div style="background:#0d1117;border-radius:10px;padding:14px;border-left:4px solid #D97757">
      <div style="color:#D97757;font-weight:700;margin-bottom:8px">PRIMITIVAS (TRP)</div>
      <div style="color:#fb923c;font-size:11px">Tools → LLM executa</div>
      <div style="color:#60a5fa;font-size:11px">Resources → app lê por URI</div>
      <div style="color:#34d399;font-size:11px">Prompts → usuário aciona</div>
    </div>
    <div style="background:#0d1117;border-radius:10px;padding:14px;border-left:4px solid #60a5fa">
      <div style="color:#60a5fa;font-weight:700;margin-bottom:8px">TRANSPORTS</div>
      <div style="color:#94a3b8;font-size:11px">stdio — local, seguro</div>
      <div style="color:#94a3b8;font-size:11px">HTTP Streamable — remoto</div>
      <div style="color:#94a3b8;font-size:11px">HTTP+SSE — legado</div>
    </div>
    <div style="background:#0d1117;border-radius:10px;padding:14px;border-left:4px solid #a78bfa">
      <div style="color:#a78bfa;font-weight:700;margin-bottom:8px">PROTOCOLO</div>
      <div style="color:#94a3b8;font-size:11px">JSON-RPC 2.0</div>
      <div style="color:#94a3b8;font-size:11px">Stateful por sessão</div>
      <div style="color:#94a3b8;font-size:11px">initialize → capabilities</div>
    </div>
    <div style="background:#0d1117;border-radius:10px;padding:14px;border-left:4px solid #fbbf24">
      <div style="color:#fbbf24;font-weight:700;margin-bottom:8px">SEGURANÇA</div>
      <div style="color:#94a3b8;font-size:11px">Prompt injection via desc</div>
      <div style="color:#94a3b8;font-size:11px">Servidor malicioso local</div>
      <div style="color:#94a3b8;font-size:11px">Sandbox + least privilege</div>
    </div>
    <div style="background:#0d1117;border-radius:10px;padding:14px;border-left:4px solid #34d399">
      <div style="color:#34d399;font-weight:700;margin-bottom:8px">ECOSSISTEMA</div>
      <div style="color:#94a3b8;font-size:11px">SDK: Python, TypeScript</div>
      <div style="color:#94a3b8;font-size:11px">Servidores oficiais: 10+</div>
      <div style="color:#94a3b8;font-size:11px">Adotado: OpenAI, Google</div>
    </div>
    <div style="background:#0d1117;border-radius:10px;padding:14px;border-left:4px solid #f87171">
      <div style="color:#f87171;font-weight:700;margin-bottom:8px">VALOR</div>
      <div style="color:#94a3b8;font-size:11px">M+N (não M×N)</div>
      <div style="color:#94a3b8;font-size:11px">USB-C para LLMs</div>
      <div style="color:#94a3b8;font-size:11px">Descoberta dinâmica</div>
    </div>
  </div>
</div>`,
      caption: 'Use TRP (Tools/Resources/Prompts) + M+N como âncoras de memória para MCP.',
    },
    exercises: [
      {
        level: 'iniciante',
        title: 'Servidor MCP "Hello Tool"',
        description: 'Crie um servidor MCP mínimo com uma Tool chamada <code>greet</code> que recebe um parâmetro <code>name: string</code> e retorna "Olá, {name}! Vindo do servidor MCP.". Instale no MCP Inspector e valide que a tool aparece no tools/list e retorna o resultado correto.',
        concepts: ['McpServer', 'server.tool()', 'StdioServerTransport', 'Zod schema'],
        hint: 'Use o quickstart oficial em modelcontextprotocol.io. O Inspector é: npx @modelcontextprotocol/inspector node server.js',
      },
      {
        level: 'intermediario',
        title: 'Servidor MCP com Tool + Resource',
        description: 'Construa um servidor MCP que expõe: (1) Tool <code>search_notes</code> que busca em arquivos .md de um diretório por query string; (2) Resource <code>file://{path}</code> que retorna o conteúdo de qualquer .md do mesmo diretório. Valide no MCP Inspector e também instale no Claude Desktop (se disponível). Implemente whitelist de diretório para segurança.',
        concepts: ['server.resource()', 'ResourceTemplate', 'URI whitelist', 'listChanged'],
        hint: 'Use a whitelist: só sirva arquivos dentro do diretório configurado. Veja o código do servidor filesystem oficial como referência.',
      },
      {
        level: 'senior',
        title: 'Servidor MCP HTTP remoto com autenticação',
        description: 'Implemente um servidor MCP com transport HTTP Streamable (não stdio) que: (1) autentica via API Key em header Authorization; (2) expõe tool <code>run_sql</code> que executa queries SELECT-only em um SQLite local; (3) expõe resource <code>schema://{table}</code> que retorna o schema da tabela. Implemente rate limiting de 10 req/min por API key. Escreva testes de integração usando MCP Inspector em modo programático.',
        concepts: ['StreamableHTTPServerTransport', 'Express/Hono', 'API Key auth', 'Rate limiting', 'SQL injection prevention'],
        relatedKeypoints: [1, 5, 8],
      },
    ],
    codeExamples: [
      {
        title: 'Servidor MCP TypeScript completo (Tool + Resource + Prompt)',
        description: 'Servidor MCP mínimo com as três primitivas usando o SDK oficial.',
        language: 'typescript',
        code: `import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import fs from 'fs/promises';

const server = new McpServer({
  name: 'notes-server',
  version: '1.0.0',
});

// TOOL: busca em notas por query
server.tool(
  'search_notes',
  'Busca notas por palavra-chave',
  { query: z.string(), dir: z.string().default('./notes') },
  async ({ query, dir }) => {
    const files = await fs.readdir(dir);
    const results: string[] = [];
    for (const f of files.filter(f => f.endsWith('.md'))) {
      const content = await fs.readFile(\`\${dir}/\${f}\`, 'utf-8');
      if (content.toLowerCase().includes(query.toLowerCase())) {
        results.push(\`[\${f}]: \${content.slice(0, 200)}...\`);
      }
    }
    return {
      content: [{ type: 'text', text: results.join('\\n\\n') || 'Nenhuma nota encontrada.' }]
    };
  }
);

// RESOURCE: lê arquivo de nota por URI
server.resource(
  'note',
  new ResourceTemplate('file:///{path}', { list: undefined }),
  async (uri) => {
    const safePath = uri.pathname.replace(/\\.\\./g, ''); // prevent traversal
    const content = await fs.readFile(\`./notes\${safePath}\`, 'utf-8');
    return {
      contents: [{ uri: uri.href, mimeType: 'text/markdown', text: content }]
    };
  }
);

// PROMPT: template de revisão de nota
server.prompt(
  'review_note',
  'Gera prompt para revisar uma nota',
  { filename: z.string() },
  async ({ filename }) => ({
    messages: [{
      role: 'user',
      content: {
        type: 'text',
        text: \`Por favor, revise a nota "\${filename}" e sugira melhorias de clareza e completude.\`
      }
    }]
  })
);

const transport = new StdioServerTransport();
await server.connect(transport);
console.error('Servidor MCP iniciado via stdio');`,
      },
      {
        title: 'Servidor MCP HTTP Streamable com autenticação por API Key',
        description: 'Servidor MCP remoto com Express e autenticação.',
        language: 'typescript',
        code: `import express from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { z } from 'zod';

const API_KEYS = new Set(['mcp-key-abc123', 'mcp-key-xyz789']);

// Cria servidor por sessão (stateful)
function createMcpServer() {
  const server = new McpServer({ name: 'remote-server', version: '1.0.0' });

  server.tool(
    'fetch_data',
    'Busca dados de uma API interna',
    { endpoint: z.string(), params: z.record(z.string()).optional() },
    async ({ endpoint, params }) => {
      const url = new URL(endpoint, 'https://api.internal.company');
      if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
      const resp = await fetch(url.toString());
      const data = await resp.json();
      return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
    }
  );

  return server;
}

const app = express();
app.use(express.json());

// Middleware de autenticação
const authMiddleware: express.RequestHandler = (req, res, next) => {
  const key = req.headers.authorization?.replace('Bearer ', '');
  if (!key || !API_KEYS.has(key)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  next();
};

// Handler MCP (POST para invoke, GET para SSE stream)
app.all('/mcp', authMiddleware, async (req, res) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => crypto.randomUUID(),
  });
  const server = createMcpServer();
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

app.listen(3001, () => console.log('MCP HTTP server on :3001'));`,
      },
      {
        title: 'Cliente MCP programático (TypeScript)',
        description: 'Como conectar e usar um servidor MCP de dentro do código, sem Claude Desktop.',
        language: 'typescript',
        code: `import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { spawn } from 'child_process';

// Cria cliente MCP que spawna servidor via stdio
const transport = new StdioClientTransport({
  command: 'node',
  args: ['./notes-server.js'],
});

const client = new Client(
  { name: 'my-agent', version: '1.0.0' },
  { capabilities: {} }
);

await client.connect(transport);
console.log('Conectado ao servidor MCP');

// Lista tools disponíveis
const { tools } = await client.listTools();
console.log('Tools:', tools.map(t => t.name));
// → ['search_notes']

// Invoca uma tool
const result = await client.callTool({
  name: 'search_notes',
  arguments: { query: 'kubernetes', dir: './notes' },
});
console.log('Resultado:', result.content[0].text);

// Lista resources
const { resources } = await client.listResources();
console.log('Resources:', resources.map(r => r.uri));

// Lê um resource
const { contents } = await client.readResource({ uri: 'file:///intro.md' });
console.log('Conteúdo:', contents[0].text?.slice(0, 100));

await client.close();`,
      },
    ],
    videos: [
      {
        title: 'Model Context Protocol Explained',
        channel: 'Anthropic',
        url: 'https://www.youtube.com/watch?v=eur8dUO9mvE',
        topic: 'Introdução oficial ao MCP pela equipe da Anthropic',
      },
      {
        title: 'Build Your First MCP Server',
        channel: 'Fireship',
        url: 'https://www.youtube.com/watch?v=5W2KGaJF7E4',
        topic: 'Tutorial prático: criar servidor MCP do zero com TypeScript',
        note: 'Ótimo ponto de partida, cobre stdio e Inspector',
      },
      {
        title: 'MCP Deep Dive — Architecture & Security',
        channel: 'AI Engineer World Fair',
        url: 'https://www.youtube.com/watch?v=kCKOiQZbomU',
        topic: 'Arquitetura detalhada, threat model e casos de uso em produção',
      },
      {
        title: 'Building MCP Servers in Python',
        channel: 'LangChain',
        url: 'https://www.youtube.com/watch?v=0RbBeTe3cKY',
        topic: 'Python SDK, FastMCP, integração com LangGraph',
      },
      {
        title: 'MCP — From Zero to Production',
        channel: 'ByteByteGo',
        url: 'https://www.youtube.com/watch?v=2EsZjrX3Gz8',
        topic: 'Visão de sistema: como MCP se encaixa em arquiteturas de agentes',
      },
    ],
    resources: [
      { title: 'Model Context Protocol — documentação oficial', url: 'https://modelcontextprotocol.io/', kind: 'docs' },
      { title: 'MCP Specification (spec completa)', url: 'https://modelcontextprotocol.io/specification/', kind: 'docs' },
      { title: 'Anthropic — Introducing MCP (blog post original)', url: 'https://www.anthropic.com/news/model-context-protocol', kind: 'artigo' },
      { title: 'modelcontextprotocol/servers (servidores oficiais)', url: 'https://github.com/modelcontextprotocol/servers', kind: 'docs' },
      { title: 'modelcontextprotocol/typescript-sdk', url: 'https://github.com/modelcontextprotocol/typescript-sdk', kind: 'docs' },
      { title: 'modelcontextprotocol/python-sdk', url: 'https://github.com/modelcontextprotocol/python-sdk', kind: 'docs' },
      { title: 'MCP Inspector (ferramenta de debug)', url: 'https://github.com/modelcontextprotocol/inspector', kind: 'pratica' },
      { title: 'Simon Willison — MCP thoughts (análise crítica)', url: 'https://simonwillison.net/2024/Nov/25/model-context-protocol/', kind: 'artigo' },
    ],
  }

export default mcp

import type { SkillContentMap } from "@/types"

const data: SkillContentMap = {

  "react": {
    tagline: "Biblioteca UI declarativa baseada em componentes — padrão de mercado frontend.",
    why: "React domina o mercado de trabalho frontend. Saber hooks, reconciliation, patterns de composição E as novidades do React 18 (Concurrent, Suspense, Transitions) é pré-requisito pra qualquer vaga sênior. Entender como o Fiber scheduler funciona, quando e por que componentes re-renderizam, e como usar Context e estado externo corretamente diferencia sênior de pleno em entrevistas técnicas.",
    prerequisite: "HTML básico (tags, atributos, formulários), CSS básico (box model, flexbox), JavaScript ES6+ — arrow functions, destructuring, spread/rest, promises, async/await, array methods (map, filter, reduce), modules (import/export). Você não precisa ser expert, mas precisa entender esses conceitos antes de React fazer sentido.",
    summary: "A ideia central do React é simples: UI é uma função do estado. Você descreve como a tela deve parecer dado um estado — React cuida de atualizar o DOM quando esse estado muda. Cada pedaço da interface é um componente (função JavaScript que retorna JSX). Componentes recebem dados via props (somente leitura) e gerenciam dados próprios via state (useState). Quando o state muda, React re-executa o componente, calcula o que mudou na árvore virtual (VDOM) e aplica apenas as diferenças no DOM real — isso é reconciliation. O fluxo é sempre unidirecional: dados descem como props, eventos sobem como callbacks. A partir da versão 16, o motor interno (Fiber) divide o trabalho em unidades pausáveis, evitando travar a tela em renders pesados. O React 18 vai além: com Concurrent Mode, o scheduler pode priorizar interações do usuário enquanto renders pesados rodam em background.",
    howToStudy: "<strong>Tem 30 minutos antes de uma entrevista?</strong> Fique na aba <em>Do zero à entrevista</em> — revise o modelo mental, varra os gotchas e treine as Q&As de <strong>nível pleno</strong> em voz alta sem consultar. Se sobrar tempo, passe pelas de <strong>nível sênior</strong>.<br><br><strong>Tem um fim de semana?</strong> Comece aqui: leia o mapa mental para ter a visão geral, depois percorra os <strong>13 conceitos em ordem</strong> com o editor aberto ao lado — reproduza cada snippet de memória antes de avançar. Em seguida, faça os exercícios de iniciante e intermediário.<br><br><strong>Tem uma semana?</strong> Siga a sequência completa desta aba do topo ao fundo. Ao terminar os exercícios, volte à aba de entrevista e treine as Q&As de <strong>nível sênior</strong> até conseguir responder sem consultar. Os vídeos são complemento — assista-os na ordem sugerida, não como ponto de partida.",
    diagrams: [
      {
        title: "Componente = função(estado) → tela — o modelo mental central",
        html: `<style>
.rcmm-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.rcmm-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(100,116,139,.5);display:inline}
.rcmm-tip:hover .rcmm-tb{display:block}
.rcmm-tb{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:210px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.rcmm-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
@keyframes rcmm-dot{0%,100%{opacity:.15;transform:scale(.7)}50%{opacity:1;transform:scale(1)}}
.rcmm-d1{animation:rcmm-dot 1.4s ease-in-out infinite}
.rcmm-d2{animation:rcmm-dot 1.4s ease-in-out .25s infinite}
.rcmm-d3{animation:rcmm-dot 1.4s ease-in-out .5s infinite}
@keyframes rcmm-blink{0%,100%{background:rgba(97,218,251,.07);border-color:rgba(97,218,251,.25)}60%{background:rgba(97,218,251,.2);border-color:rgba(97,218,251,.65)}}
.rcmm-upd{animation:rcmm-blink 2.4s ease-in-out infinite;border-radius:6px;padding:7px 11px;font-size:11px;color:#61DAFB;display:flex;align-items:center}
</style>
<div class="rcmm-wrap">
  <p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">O modelo mental central: UI = função(estado)</p>
  <p style="color:#475569;font-size:10px;margin:0 0 18px">Passe o mouse nos termos <span style="border-bottom:1px dashed rgba(100,116,139,.5)">sublinhados</span></p>
  <div style="display:flex;gap:10px;align-items:stretch;margin-bottom:16px">
    <div style="flex:1;background:#1e293b;border:1.5px solid #334155;border-radius:10px;padding:14px 16px">
      <div style="font-size:9px;color:#94a3b8;letter-spacing:.1em;margin-bottom:10px;text-transform:uppercase">1 — você escreve</div>
      <div style="font-size:11.5px;color:#94a3b8;line-height:2.1">
        <span style="color:#7c3aed">function</span> <span style="color:#61DAFB"><span class="rcmm-tip">App<span class="rcmm-tb">Componente React — uma função JavaScript comum que retorna JSX. Pode receber props como argumentos e ter estado interno com hooks.</span></span></span>() {<br>
        &nbsp;<span style="color:#475569">const</span> [n, <span class="rcmm-tip">setN<span class="rcmm-tb">Função de atualização retornada pelo useState. Chamar setN(novo) agenda um re-render do componente com o novo valor.</span></span>] = <span class="rcmm-tip">useState<span class="rcmm-tb">Hook que cria uma variável de estado local. O valor persiste entre renders. Quando muda, React re-executa a função.</span></span>(0)<br>
        &nbsp;<span style="color:#475569">return</span> (<br>
        &nbsp;&nbsp;<span class="rcmm-tip">&lt;div&gt;<span class="rcmm-tb">JSX — sintaxe parecida com HTML mas é JavaScript puro depois de compilado. React.createElement() por baixo.</span></span><br>
        &nbsp;&nbsp;&nbsp;&lt;p&gt;{'{n}'}&lt;/p&gt;<br>
        &nbsp;&nbsp;&nbsp;&lt;button <span class="rcmm-tip">onClick<span class="rcmm-tb">Event handler declarativo. Quando o usuário clica, React chama essa função — aqui ela atualiza o estado com setN.</span></span>={() =&gt; setN(n+1)}&gt;+&lt;/button&gt;<br>
        &nbsp;&nbsp;&lt;/div&gt;<br>
        &nbsp;)<br>
        }
      </div>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;padding:0 4px">
      <span style="font-size:9px;color:#61DAFB;letter-spacing:.06em;font-weight:600">REACT</span>
      <span class="rcmm-d1" style="color:#61DAFB;font-size:13px">●</span>
      <span class="rcmm-d2" style="color:#61DAFB;font-size:13px">●</span>
      <span class="rcmm-d3" style="color:#61DAFB;font-size:13px">●</span>
      <span style="color:#1e3a5f;font-size:18px">▶</span>
    </div>
    <div style="flex:1;background:#1e293b;border:1.5px solid #334155;border-radius:10px;padding:14px 16px">
      <div style="font-size:9px;color:#4ade80;letter-spacing:.1em;margin-bottom:10px;text-transform:uppercase">2 — o browser mostra</div>
      <div style="font-size:12px;color:#64748b;line-height:2.3">
        &lt;<span style="color:#4ade80">div</span>&gt;<br>
        &nbsp;&lt;<span style="color:#4ade80">p</span>&gt;<span style="color:#e2e8f0">0</span>&lt;/p&gt;<br>
        &nbsp;&lt;<span style="color:#4ade80">button</span>&gt;+&lt;/button&gt;<br>
        &lt;/<span style="color:#4ade80">div</span>&gt;
      </div>
    </div>
  </div>
  <div style="background:#1e293b;border-radius:8px;padding:14px 16px;border:1px solid #1e3a5f">
    <div style="font-size:9px;color:#3b82f6;letter-spacing:.1em;font-weight:600;margin-bottom:10px;text-transform:uppercase">O que acontece quando você clica +</div>
    <div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap">
      <div style="background:#0f172a;border:1px solid #334155;border-radius:6px;padding:7px 11px;font-size:11px;color:#e2e8f0">clique</div>
      <span style="color:#334155;font-size:14px">→</span>
      <div style="background:#0f172a;border:1px solid #334155;border-radius:6px;padding:7px 11px;font-size:11px;color:#94a3b8"><span class="rcmm-tip">setN(1)<span class="rcmm-tb">React não atualiza o DOM agora. Ele agenda o trabalho — pode agrupar vários setState juntos (batching) para eficiência.</span></span></div>
      <span style="color:#334155;font-size:14px">→</span>
      <div style="background:#0f172a;border:1px solid #334155;border-radius:6px;padding:7px 11px;font-size:11px;color:#94a3b8"><span class="rcmm-tip">re-render<span class="rcmm-tb">React re-executa App() do zero com n=1. Gera nova árvore virtual em memória — o browser ainda não sabe.</span></span></div>
      <span style="color:#334155;font-size:14px">→</span>
      <div style="background:#0f172a;border:1px solid #334155;border-radius:6px;padding:7px 11px;font-size:11px;color:#94a3b8"><span class="rcmm-tip">diff<span class="rcmm-tb">Compara a nova árvore com a anterior. Só o texto do &lt;p&gt; mudou de 0 para 1.</span></span></div>
      <span style="color:#334155;font-size:14px">→</span>
      <div class="rcmm-upd" style="background:rgba(97,218,251,.07);border:1px solid rgba(97,218,251,.25)">&lt;p&gt;<strong>1</strong>&lt;/p&gt; &nbsp;<span style="font-size:9px;opacity:.5">← só isso muda</span></div>
    </div>
    <p style="font-size:11px;color:#475569;margin:10px 0 0;line-height:1.6"><strong style="color:#94a3b8">UI = f(estado)</strong> — você descreve <em>o que</em> mostrar dado o estado atual. React decide <em>como</em> atualizar o DOM com o mínimo de operações.</p>
  </div>
</div>`,
        caption: "Este é o modelo que tudo no React deriva: estado muda → React re-executa a função → calcula o diff → atualiza só o necessário no browser.",
      },
      {
        title: "Fluxo de dados unidirecional — como pai e filho se comunicam",
        html: `<style>
@keyframes rcdf2-slide-down{0%{top:0;opacity:1}100%{top:100%;opacity:0}}
@keyframes rcdf2-slide-up{0%{bottom:0;opacity:1}100%{bottom:100%;opacity:0}}
@keyframes rcdf2-pulse{0%,100%{box-shadow:0 0 0 0 rgba(97,218,251,.4)}50%{box-shadow:0 0 0 6px rgba(97,218,251,0)}}
@keyframes rcdf2-pulse-red{0%,100%{box-shadow:0 0 0 0 rgba(239,68,68,.4)}50%{box-shadow:0 0 0 6px rgba(239,68,68,0)}}
@keyframes rcdf2-pulse-grn{0%,100%{box-shadow:0 0 0 0 rgba(74,222,128,.4)}50%{box-shadow:0 0 0 6px rgba(74,222,128,0)}}
@keyframes rcdf2-dot-down{0%{transform:translateY(0);opacity:1}100%{transform:translateY(52px);opacity:0}}
@keyframes rcdf2-dot-up{0%{transform:translateY(0);opacity:1}100%{transform:translateY(-52px);opacity:0}}
.rcdf2-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(100,116,139,.6);display:inline}
.rcdf2-tip:hover .rcdf2-box{display:block}
.rcdf2-box{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:220px;pointer-events:none;box-shadow:0 4px 24px rgba(0,0,0,.7)}
.rcdf2-box::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.rcdf2-node{background:#1e293b;border-radius:10px;padding:12px 20px;text-align:center;transition:border-color .3s,box-shadow .3s}
.rcdf2-node.hi-blue{border-color:#61DAFB!important;animation:rcdf2-pulse .6s ease 2}
.rcdf2-node.hi-red{border-color:#ef4444!important;animation:rcdf2-pulse-red .6s ease 2}
.rcdf2-node.hi-grn{border-color:#4ade80!important;animation:rcdf2-pulse-grn .6s ease 2}
.rcdf2-dot{width:8px;height:8px;border-radius:50%;position:absolute;left:50%;transform:translateX(-50%);pointer-events:none;opacity:0}
.rcdf2-dot.anim-down{animation:rcdf2-dot-down .5s ease forwards}
.rcdf2-dot.anim-up{animation:rcdf2-dot-up .5s ease forwards}
.rcdf2-step-label{transition:opacity .3s;font-size:11px;font-weight:600;letter-spacing:.04em}
</style>
<div style="font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px 24px">
  <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:6px">
    <div>
      <p style="color:#e2e8f0;font-size:12px;margin:0 0 3px;font-weight:600">Fluxo de dados unidirecional</p>
      <p style="color:#475569;font-size:10px;margin:0">Dados descem (props). Eventos sobem (callbacks). Clique em <strong style="color:#ef4444">Deletar</strong> para simular o ciclo completo.</p>
    </div>
    <button id="rcdf2-btn" onclick="rcdf2Run()" style="background:#1e293b;border:1px solid #334155;border-radius:6px;color:#94a3b8;font-size:10px;padding:6px 12px;cursor:pointer;font-family:inherit;white-space:nowrap;flex-shrink:0">▶ Simular</button>
  </div>

  <!-- Status bar -->
  <div id="rcdf2-status" style="background:#0d1829;border:1px solid #1e293b;border-radius:6px;padding:8px 12px;margin-bottom:16px;min-height:32px;display:flex;align-items:center;gap:8px">
    <span id="rcdf2-phase-dot" style="width:7px;height:7px;border-radius:50%;background:#334155;flex-shrink:0;transition:background .3s"></span>
    <span id="rcdf2-phase-txt" style="font-size:10px;color:#475569">Clique em Simular ou no botão Deletar para ver o fluxo em ação.</span>
  </div>

  <!-- Component tree -->
  <div style="display:flex;flex-direction:column;align-items:center;gap:0">

    <!-- App node -->
    <div id="rcdf2-app" class="rcdf2-node" style="border:1.5px solid rgba(97,218,251,.4);min-width:220px">
      <div style="color:#61DAFB;font-size:13px;font-weight:bold">&lt;App /&gt;</div>
      <div style="color:#64748b;font-size:10px;margin-top:4px">
        <span class="rcdf2-tip">state<span class="rcdf2-box">Dados que o componente gerencia internamente. Quando mudam, React re-renderiza e desce as novas props para os filhos.</span></span>: <span id="rcdf2-users-val" style="color:#94a3b8">users[]</span>
      </div>
    </div>

    <!-- Arrow App → UserList -->
    <div style="display:grid;grid-template-columns:1fr 28px 1fr;width:340px;padding:4px 0;align-items:center">
      <div style="text-align:right;font-size:9px;color:#61DAFB;padding-right:6px;line-height:1.8">
        <span class="rcdf2-tip">props↓<span class="rcdf2-box">users[], onDelete passados do App para UserList como argumentos — somente leitura no filho.</span></span>
      </div>
      <div style="position:relative;display:flex;flex-direction:column;align-items:center;height:52px;justify-content:center">
        <div style="width:2px;height:100%;background:linear-gradient(#61DAFB88,#ef444488);border-radius:2px"></div>
        <div id="rcdf2-dot1-d" class="rcdf2-dot" style="background:#61DAFB;top:4px"></div>
        <div id="rcdf2-dot1-u" class="rcdf2-dot" style="background:#ef4444;bottom:4px"></div>
      </div>
      <div style="font-size:9px;color:#ef4444;padding-left:6px;line-height:1.8">
        <span class="rcdf2-tip">callback↑<span class="rcdf2-box">onDelete(id) é uma função passada como prop — quando o filho a chama, o pai executa setState.</span></span>
      </div>
    </div>

    <!-- UserList node -->
    <div id="rcdf2-list" class="rcdf2-node" style="border:1.5px solid rgba(97,218,251,.4);min-width:220px">
      <div style="color:#61DAFB;font-size:12px;font-weight:bold">&lt;UserList /&gt;</div>
      <div style="color:#64748b;font-size:10px;margin-top:3px">props: users[], <span class="rcdf2-tip">onDelete<span class="rcdf2-box">Repassa a função para cada UserCard. O dado desce mais um nível.</span></span></div>
    </div>

    <!-- Fork line -->
    <div style="display:flex;width:300px;height:18px">
      <div style="flex:1;border-top:1.5px solid rgba(97,218,251,.3);border-right:1.5px solid rgba(97,218,251,.3)"></div>
      <div style="flex:1;border-top:1.5px solid rgba(97,218,251,.3);border-left:1.5px solid rgba(97,218,251,.3)"></div>
    </div>

    <!-- UserCard row -->
    <div style="display:flex;gap:12px;width:300px">
      <div id="rcdf2-cardA" class="rcdf2-node" style="border:1.5px solid rgba(97,218,251,.25);flex:1">
        <div style="color:#61DAFB;font-size:10px;font-weight:bold">&lt;UserCard /&gt;</div>
        <div style="color:#475569;font-size:9px;margin-top:3px">usuário A</div>
        <button id="rcdf2-del" onclick="rcdf2Run()" style="margin-top:6px;background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.3);border-radius:4px;color:#ef4444;font-size:9px;padding:3px 8px;cursor:pointer;font-family:inherit">Deletar</button>
      </div>
      <div id="rcdf2-cardB" class="rcdf2-node" style="border:1.5px solid rgba(97,218,251,.25);flex:1">
        <div style="color:#61DAFB;font-size:10px;font-weight:bold">&lt;UserCard /&gt;</div>
        <div style="color:#475569;font-size:9px;margin-top:3px">usuário B</div>
      </div>
    </div>
  </div>

  <!-- Steps legend -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:18px;padding-top:14px;border-top:1px solid #1e293b">
    <div style="background:#1e293b;border-radius:8px;padding:9px 11px">
      <div style="font-size:10px;color:#61DAFB;font-weight:bold;margin-bottom:3px">▼ props descem</div>
      <div style="font-size:9px;color:#475569;line-height:1.5">Pai controla o que filho recebe. Filho não pode mudar a prop — somente leitura.</div>
    </div>
    <div style="background:#1e293b;border-radius:8px;padding:9px 11px">
      <div style="font-size:10px;color:#ef4444;font-weight:bold;margin-bottom:3px">▲ eventos sobem</div>
      <div style="font-size:9px;color:#475569;line-height:1.5">Filho chama callback do pai. Pai executa setState → re-render → novas props descem.</div>
    </div>
  </div>
</div>
<script>
(function(){
  var phases=[
    {dot:'#ef4444',txt:'① UserCard chama onDelete(id) — o evento sobe via callback',nodes:{cardA:'hi-red'}},
    {dot:'#ef4444',txt:'② Callback sobe por UserList até App (nenhum estado muda no meio)',nodes:{list:'hi-red'}},
    {dot:'#4ade80',txt:'③ App recebe o evento e executa setState — state é atualizado',nodes:{app:'hi-grn'},state:'users[] → atualizado'},
    {dot:'#61DAFB',txt:'④ React re-renderiza App e desce as novas props para UserList',nodes:{app:'hi-blue',list:'hi-blue'}},
    {dot:'#61DAFB',txt:'⑤ UserList repassa props — UserCards recebem os dados atualizados',nodes:{list:'hi-blue',cardA:'hi-blue',cardB:'hi-blue'},state:'users[]'}
  ];
  var running=false;
  function hi(id,cls){
    var el=document.getElementById('rcdf2-'+id);
    if(!el)return;
    el.classList.remove('hi-blue','hi-red','hi-grn');
    if(cls)el.classList.add(cls);
  }
  function dot(id,dir){
    var el=document.getElementById('rcdf2-'+id);
    if(!el)return;
    el.classList.remove('anim-down','anim-up');
    void el.offsetWidth;
    el.classList.add(dir==='d'?'anim-down':'anim-up');
  }
  function setStatus(color,txt){
    var d=document.getElementById('rcdf2-phase-dot');
    var t=document.getElementById('rcdf2-phase-txt');
    if(d)d.style.background=color;
    if(t)t.textContent=txt;
  }
  function setUsers(val){
    var el=document.getElementById('rcdf2-users-val');
    if(el)el.textContent=val||'users[]';
  }
  window.rcdf2Run=function(){
    if(running)return;
    running=true;
    var btn=document.getElementById('rcdf2-btn');
    if(btn)btn.disabled=true;
    var p=0;
    function next(){
      if(p>=phases.length){
        setTimeout(function(){
          hi('app');hi('list');hi('cardA');hi('cardB');
          setStatus('#334155','Ciclo completo. Clique em Simular para repetir.');
          setUsers('users[]');
          running=false;
          if(btn)btn.disabled=false;
        },600);
        return;
      }
      var ph=phases[p];
      hi('app');hi('list');hi('cardA');hi('cardB');
      Object.keys(ph.nodes).forEach(function(k){hi(k,ph.nodes[k]);});
      setStatus(ph.dot,ph.txt);
      if(ph.state)setUsers(ph.state);
      if(p===0){dot('dot1-u','u');}
      if(p===2){dot('dot1-d','d');}
      p++;
      setTimeout(next,900);
    }
    next();
  };
})();
</script>`,
        caption: "Esse fluxo unidirecional torna o código previsível: você sempre sabe de onde vem cada dado e quem é responsável por atualizá-lo.",
      },
      {
        title: "Ciclo de vida do useEffect — quando cada coisa roda",
        html: `<style>
.rcef-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px}
.rcef-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(100,116,139,.5);display:inline}
.rcef-tip:hover .rcef-box{display:block}
.rcef-box{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:220px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.rcef-box::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.rcef-row{display:flex;gap:0;margin-bottom:10px;align-items:center}
.rcef-label{width:86px;flex-shrink:0;font-size:10px;font-weight:600;letter-spacing:.06em}
.rcef-steps{flex:1;display:flex;gap:5px;align-items:center;flex-wrap:wrap}
.rcef-step{background:#1e293b;border:1px solid #334155;border-radius:6px;padding:7px 11px;font-size:11px;color:#94a3b8}
.rcef-effect{border-color:rgba(74,222,128,.4);color:#4ade80}
.rcef-cleanup{border-color:rgba(239,68,68,.4);color:#ef4444}
.rcef-arr{color:#334155;font-size:13px}
</style>
<div class="rcef-wrap">
  <p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">Ciclo de vida do useEffect — quando cada coisa roda</p>
  <p style="color:#475569;font-size:10px;margin:0 0 18px">Passe o mouse nos termos <span style="border-bottom:1px dashed rgba(100,116,139,.5)">sublinhados</span></p>

  <div class="rcef-row">
    <div class="rcef-label" style="color:#4ade80">MOUNT</div>
    <div class="rcef-steps">
      <div class="rcef-step"><span class="rcef-tip">render<span class="rcef-box">React executa a função do componente e monta a árvore virtual. Nenhum efeito roda ainda — a fase de render deve ser pura.</span></span></div>
      <span class="rcef-arr">→</span>
      <div class="rcef-step"><span class="rcef-tip">DOM atualiza<span class="rcef-box">React aplica as mudanças no DOM real e o browser pinta a tela. Só depois os efeitos rodam — por isso useEffect não bloqueia o paint.</span></span></div>
      <span class="rcef-arr">→</span>
      <div class="rcef-step rcef-effect"><span class="rcef-tip">effect() roda<span class="rcef-box">useEffect roda depois que o browser pintou. É aqui que você faz fetch, adiciona event listeners, inicia timers — efeitos colaterais que dependem do DOM pronto.</span></span></div>
    </div>
  </div>

  <div class="rcef-row">
    <div class="rcef-label" style="color:#61DAFB">UPDATE</div>
    <div class="rcef-steps">
      <div class="rcef-step"><span class="rcef-tip">estado muda<span class="rcef-box">setState() é chamado. React agenda um re-render — não atualiza o DOM imediatamente. Pode agrupar múltiplos setState (batching).</span></span></div>
      <span class="rcef-arr">→</span>
      <div class="rcef-step">re-render → DOM</div>
      <span class="rcef-arr">→</span>
      <div class="rcef-step rcef-cleanup"><span class="rcef-tip">cleanup() anterior<span class="rcef-box">A função retornada pelo effect anterior roda primeiro. Cancela o fetch antigo, remove o listener antigo, limpa o timer — evita memory leaks e bugs de estado obsoleto.</span></span></div>
      <span class="rcef-arr">→</span>
      <div class="rcef-step rcef-effect">effect() novo</div>
    </div>
  </div>

  <div class="rcef-row" style="margin-bottom:16px">
    <div class="rcef-label" style="color:#ef4444">UNMOUNT</div>
    <div class="rcef-steps">
      <div class="rcef-step">componente sai da tela</div>
      <span class="rcef-arr">→</span>
      <div class="rcef-step rcef-cleanup"><span class="rcef-tip">cleanup() roda<span class="rcef-box">O último cleanup roda quando o componente é removido da árvore. Cancele subscriptions, WebSockets, timers — código de um componente morto não deve continuar rodando.</span></span></div>
    </div>
  </div>

  <div style="background:#1e293b;border-radius:8px;padding:14px 16px;border:1px solid #1e3a5f">
    <div style="font-size:9px;color:#3b82f6;letter-spacing:.1em;font-weight:600;margin-bottom:10px;text-transform:uppercase">Estrutura padrão com cleanup</div>
    <div style="font-size:11.5px;line-height:2.1;color:#64748b">
      useEffect(() =&gt; {<br>
      &nbsp;&nbsp;<span style="color:#4ade80">// 1. efeito — o que você quer fazer</span><br>
      &nbsp;&nbsp;const sub = <span class="rcef-tip">api.subscribe<span class="rcef-box">Qualquer efeito colateral: fetch, addEventListener, setInterval, abrir WebSocket, conectar a um store externo, etc.</span></span>(userId, setData)<br>
      &nbsp;&nbsp;<span style="color:#475569">return</span> () =&gt; {<br>
      &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#ef4444">// 2. cleanup — desfaz o efeito</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;sub.<span class="rcef-tip">unsubscribe<span class="rcef-box">Retorne uma função de limpeza. React a chama antes de rodar o effect novamente (no update) e quando o componente desmonta. Sem cleanup = memory leak.</span></span>()<br>
      &nbsp;&nbsp;}<br>
      }, [<span class="rcef-tip">userId<span class="rcef-box">Array de dependências. O effect re-executa toda vez que um desses valores muda. [] = só no mount. Sem array = em todo render (quase sempre errado).</span></span>])
    </div>
  </div>
</div>`,
        caption: "A regra prática: todo useEffect que cria algo (listener, fetch, timer, subscription) precisa de um cleanup que desfaz esse algo. Sem cleanup, o componente vaza memória e comportamento após ser desmontado.",
      },
      {
        title: "Reconciliation — o que acontece quando você chama setState()",
        html: `<style>
@keyframes rcrc2-pulse{0%,100%{background:rgba(239,68,68,.1);border-color:rgba(239,68,68,.35);color:#ef4444}50%{background:rgba(239,68,68,.22);border-color:rgba(239,68,68,.6);color:#fca5a5}}
.rcrc2-changed{animation:rcrc2-pulse 2.5s ease-in-out infinite;border:1px solid;border-radius:3px;padding:1px 5px;display:inline-block}
.rcrc2-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(100,116,139,.6);display:inline}
.rcrc2-tip:hover .rcrc2-box{display:block}
.rcrc2-box{display:none;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:#0f172a;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:220px;pointer-events:none;box-shadow:0 4px 24px rgba(0,0,0,.6);white-space:normal}
.rcrc2-box::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
</style>
<div style="font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:20px">
  <p style="color:#e2e8f0;font-size:12px;margin:0 0 4px;font-weight:600">O que acontece quando você chama setState()</p>
  <p style="color:#475569;font-size:10px;margin:0 0 18px">Passe o mouse nos termos <span style="border-bottom:1px dashed rgba(100,116,139,.6)">sublinhados</span> para entender o significado</p>
  <div style="display:flex;gap:6px;margin-bottom:18px;flex-wrap:wrap">
    <div style="flex:1;min-width:120px;background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px">
      <div style="font-size:9px;color:#64748b;letter-spacing:.1em;margin-bottom:8px">① DISPARO</div>
      <div style="font-size:12px;color:#61DAFB;font-weight:bold;margin-bottom:6px">
        <span class="rcrc2-tip">setState(1)<span class="rcrc2-box">Função que você chama para dizer ao React "o estado mudou". React não atualiza o browser imediatamente — ele agenda o trabalho para o próximo ciclo.</span></span>
      </div>
      <div style="font-size:11px;color:#64748b;line-height:1.5">Você avisa o React que algo mudou. Ele entra em ação.</div>
    </div>
    <div style="color:#334155;font-size:16px;display:flex;align-items:center">→</div>
    <div style="flex:1;min-width:120px;background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px">
      <div style="font-size:9px;color:#64748b;letter-spacing:.1em;margin-bottom:8px">② RECALCULA</div>
      <div style="font-size:12px;color:#61DAFB;font-weight:bold;margin-bottom:6px">
        Novo <span class="rcrc2-tip">VDOM<span class="rcrc2-box">Virtual DOM — uma cópia leve da árvore de componentes que o React mantém em memória. Muito mais rápido de manipular do que o DOM real do browser.</span></span>
      </div>
      <div style="font-size:11px;color:#64748b;line-height:1.5">React executa o componente de novo e monta uma nova árvore — ainda sem tocar no browser.</div>
    </div>
    <div style="color:#334155;font-size:16px;display:flex;align-items:center">→</div>
    <div style="flex:1;min-width:120px;background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px">
      <div style="font-size:9px;color:#64748b;letter-spacing:.1em;margin-bottom:8px">③ COMPARA</div>
      <div style="font-size:12px;color:#61DAFB;font-weight:bold;margin-bottom:6px">
        <span class="rcrc2-tip">Diff<span class="rcrc2-box">Algoritmo que compara a árvore virtual anterior com a nova para encontrar exatamente o que mudou — sem recalcular tudo do zero.</span></span>
        &nbsp;via&nbsp;
        <span class="rcrc2-tip">Fiber<span class="rcrc2-box">O motor interno do React desde a v16. Divide o trabalho em pequenas unidades que podem ser pausadas e priorizadas, sem travar a tela.</span></span>
      </div>
      <div style="font-size:11px;color:#64748b;line-height:1.5">Compara VDOM antigo vs novo. Resultado: só 1 nó mudou.</div>
    </div>
    <div style="color:#334155;font-size:16px;display:flex;align-items:center">→</div>
    <div style="flex:1;min-width:120px;background:#1e293b;border:1px solid rgba(74,222,128,.25);border-radius:8px;padding:12px">
      <div style="font-size:9px;color:#64748b;letter-spacing:.1em;margin-bottom:8px">④ ATUALIZA</div>
      <div style="font-size:12px;color:#4ade80;font-weight:bold;margin-bottom:6px">DOM real</div>
      <div style="font-size:11px;color:#64748b;line-height:1.5">Só o &lt;span&gt; é tocado no browser. O resto fica exatamente como estava.</div>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
    <div style="border:1px solid #1e293b;border-radius:8px;padding:12px">
      <p style="font-size:10px;color:#475569;margin:0 0 8px">VDOM anterior — count = 0<br/><span style="color:#334155;font-size:9px">idêntico ao que está no browser agora</span></p>
      <div style="font-size:11px;line-height:2.1;color:#64748b">
        <span style="color:#61DAFB">&lt;Counter&gt;</span><br/>
        <span style="margin-left:12px">&lt;h2&gt;Clicks&lt;/h2&gt;</span><br/>
        <span style="margin-left:12px">&lt;span&gt;0&lt;/span&gt;</span><br/>
        <span style="margin-left:12px">&lt;button&gt;+1&lt;/button&gt;</span><br/>
        <span style="color:#61DAFB">&lt;/Counter&gt;</span>
      </div>
    </div>
    <div style="border:1px solid #1e293b;border-radius:8px;padding:12px">
      <p style="font-size:10px;color:#475569;margin:0 0 8px">VDOM novo — count = 1<br/><span style="color:rgba(239,68,68,.6);font-size:9px">← só este nó vai pro DOM real</span></p>
      <div style="font-size:11px;line-height:2.1;color:#64748b">
        <span style="color:#61DAFB">&lt;Counter&gt;</span><br/>
        <span style="margin-left:12px">&lt;h2&gt;Clicks&lt;/h2&gt;</span><br/>
        <span style="margin-left:12px"><span class="rcrc2-changed">&lt;span&gt;1&lt;/span&gt;</span></span><br/>
        <span style="margin-left:12px">&lt;button&gt;+1&lt;/button&gt;</span><br/>
        <span style="color:#61DAFB">&lt;/Counter&gt;</span>
      </div>
    </div>
  </div>
  <div style="margin-top:12px;background:rgba(74,222,128,.05);border:1px solid rgba(74,222,128,.2);border-radius:8px;padding:12px 14px;font-size:11px;color:#4ade80">
    <strong>✓ 1 operação no DOM real</strong> — atualiza o texto do &lt;span&gt; de "0" para "1".
    <span style="color:#64748b;display:block;margin-top:4px">&lt;h2&gt;, &lt;button&gt; e o próprio &lt;Counter&gt; não foram tocados — React só mexe no mínimo necessário.</span>
  </div>
</div>`,
        caption: "Esta eficiência é o motivo pelo qual React escala bem: em vez de redesenhar a tela inteira, ele calcula cirurgicamente o que mudou e aplica só isso no browser.",
      },
    ],
    keypoints: [
      {
        title: "Componentes e JSX",
        body: "Componente é uma função JavaScript que retorna JSX — uma sintaxe parecida com HTML que o React transforma em elementos na tela. Cada componente é independente e reutilizável. JSX parece HTML mas é JavaScript: usa className (não class), htmlFor (não for), e expressões ficam entre chaves: {nome}. O ponto de entrada é sempre um componente raiz que React monta no DOM real via createRoot.",
        code: `function Botao({ texto, onClick }: { texto: string; onClick: () => void }) {
  return (
    <button className="btn" onClick={onClick}>
      {texto}
    </button>
  )
}

// uso — pai passa props, filho só lê e exibe
<Botao texto="Enviar" onClick={() => console.log('clicou')} />`,
      },
      {
        title: "Props — dados de pai para filho",
        body: "Props são como argumentos de função para componentes. O pai passa, o filho recebe — somente leitura (nunca modifique props diretamente). Qualquer coisa pode ser prop: string, número, objeto, função, até outros componentes (children). Se o filho precisa avisar o pai de algo (ex: clique), o pai passa uma função como prop — o filho a chama.",
        code: `// props são somente leitura — filho nunca modifica diretamente
function Card({ titulo, cor = '#ef4444' }: { titulo: string; cor?: string }) {
  return <div style={{ color: cor }}>{titulo}</div>
}

<Card titulo="React" cor="#61DAFB" />
<Card titulo="TypeScript" />  // usa cor default`,
      },
      {
        title: "useState — memória do componente",
        body: "useState é o hook que dá memória a um componente. Retorna o valor atual e uma função para atualizá-lo. Quando você chama o setter, React re-executa o componente inteiro e a tela atualiza. Regras críticas: (1) nunca mute o estado diretamente — crie um novo array/objeto; (2) se o novo estado depende do anterior, use a forma funcional: setCount(c => c + 1); (3) para objetos, sempre espalhe: setUser({ ...user, nome: 'novo' }).",
        code: `function Contador() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>Cliques: {count}</p>
      {/* forma funcional: segura quando depende do valor anterior */}
      <button onClick={() => setCount(c => c + 1)}>+1</button>
      <button onClick={() => setCount(0)}>reset</button>
    </div>
  )
}`,
      },
      {
        title: "Eventos e ciclo de re-render",
        body: "Eventos no React são declarados como props: onClick, onChange, onSubmit. Cada vez que o estado muda, React re-executa a função do componente do zero — isso é um re-render. React não atualiza o DOM inteiro: compara a árvore virtual anterior com a nova (diffing) e aplica apenas o mínimo no DOM real (reconciliation). O motor Fiber (React 16+) pode pausar e priorizar trabalho sem travar a tela. Re-render não é necessariamente lento — DOM update só ocorre se algo mudou de fato.",
        code: `function Busca() {
  // cada tecla: onChange → setQuery → re-render → input atualiza
  const [query, setQuery] = useState('')

  return (
    <input
      value={query}
      onChange={e => setQuery(e.target.value)}
      placeholder="Digite para buscar..."
    />
  )
}
// re-render != DOM update: React compara antes de tocar o browser`,
      },
      {
        title: "useEffect — efeitos colaterais",
        body: "useEffect executa código após o componente renderizar — ideal para fetch, timers e event listeners. O array de dependências controla quando roda: [] = só no mount; [id] = toda vez que id muda; sem array = em todo render. Sempre retorne uma função de cleanup para limpar timers, cancelar fetches e remover listeners. Armadilha clássica: função criada dentro do componente tem referência nova a cada render — inclua no array ou use useCallback.",
        code: `function Perfil({ userId }: { userId: string }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    fetch(\`/api/user/\${userId}\`, { signal: controller.signal })
      .then(r => r.json())
      .then(setUser)
    return () => controller.abort()  // cleanup: cancela fetch anterior
  }, [userId])  // roda toda vez que userId muda

  return user ? <div>{user.name}</div> : <Spinner />
}`,
      },
      {
        title: "useRef — valor sem re-render e acesso ao DOM",
        body: "useRef retorna um objeto { current: valor } que persiste entre renders sem causar re-render quando muda. Dois usos: (1) acessar elemento DOM diretamente — depois ref.current.focus() funciona; (2) guardar valor mutável que não precisa de re-render (timer id, flag, valor anterior). Diferença chave de useState: ref não trigga re-render. Não leia ref.current durante o render — use em efeitos e event handlers.",
        code: `function AutoFocus() {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()  // acesso direto ao DOM após render
  }, [])

  return <input ref={inputRef} placeholder="foco automático" />
}

// também: guardar timer id sem causar re-render
const timerRef = useRef<NodeJS.Timeout | null>(null)
timerRef.current = setTimeout(() => doSomething(), 1000)`,
      },
      {
        title: "forwardRef e useImperativeHandle — API imperativa controlada",
        body: "forwardRef permite que um componente receba uma ref do pai e a repasse para um elemento DOM interno — necessário quando o pai precisa de acesso direto (foco, scroll, animação). useImperativeHandle customiza o que é exposto via ref: em vez do elemento DOM bruto, você expõe uma API controlada { open, close, focus }. Prefira sempre API declarativa — useImperativeHandle é para casos onde imperativo é inevitável: integrações com libs não-React, foco gerenciado, animações complexas.",
        code: `// forwardRef: pai passa ref, filho repassa ao input interno
const Input = forwardRef<HTMLInputElement, { label: string }>(
  ({ label }, ref) => (
    <label>{label}<input ref={ref} /></label>
  )
)

// useImperativeHandle: expõe API controlada ao invés do DOM bruto
const Dialog = forwardRef<{ open: () => void; close: () => void }, { children: React.ReactNode }>(
  ({ children }, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    useImperativeHandle(ref, () => ({
      open:  () => setIsOpen(true),
      close: () => setIsOpen(false),
    }))
    return isOpen ? <div className="dialog">{children}</div> : null
  }
)

// uso no pai — API limpa sem expor o DOM diretamente
const dialogRef = useRef<{ open: () => void; close: () => void }>(null)
<Dialog ref={dialogRef}><p>Conteúdo</p></Dialog>
<button onClick={() => dialogRef.current?.open()}>Abrir</button>`,
      },
      {
        title: "Formulários — controlled vs uncontrolled",
        body: "Controlled: o valor do input vive no state do React — você tem controle total (validação em tempo real, disable de botão). Uncontrolled: o valor vive no DOM, você lê via ref quando precisar (ex: no submit). React Hook Form usa uncontrolled internamente com API tipo controlled — melhor performance em formulários grandes com muitos campos.",
        code: `// Controlled — React controla o valor, ideal para validação em tempo real
const [email, setEmail] = useState('')
<input value={email} onChange={e => setEmail(e.target.value)} />

// Uncontrolled — DOM controla, você le quando precisar
const emailRef = useRef<HTMLInputElement>(null)
<input ref={emailRef} defaultValue="" />
// no submit: emailRef.current?.value`,
      },
      {
        title: "Estado — lifting e colocação",
        body: "Regra de ouro: coloque o estado no componente mais baixo da árvore que precisa dele. Se dois irmãos precisam do mesmo estado, 'suba' (lift) para o pai comum — o pai passa o valor como prop e o setter como callback. Estado que só um componente usa não deve estar no pai nem em estado global. Estado de dado remoto não é estado de UI — use React Query ou SWR para fetch, eles gerenciam cache, loading e refetch.",
        code: `// Estado sobe para o pai comum entre dois filhos
function App() {
  const [query, setQuery] = useState('')  // compartilhado

  return (
    <>
      <SearchInput value={query} onChange={setQuery} />
      <ResultList query={query} />  {/* ambos acessam pelo pai */}
    </>
  )
}`,
      },
      {
        title: "useMemo e useCallback — memoização",
        body: "useMemo memoiza o resultado de um cálculo caro — só recalcula quando as dependências mudam. useCallback memoiza uma função (referência estável) — útil quando a função é prop de filho memoizado ou dependência de outro hook. React.memo evita re-render do filho se as props não mudaram por referência. Regra: use o DevTools Profiler para identificar problema real antes de memoizar — memoização tem custo de memória e comparação.",
        code: `function Lista({ items, onDelete }: Props) {
  // só recalcula sorted quando items muda, não em todo render do pai
  const sorted = useMemo(
    () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
    [items]
  )

  // referência estável — não recria a função em todo render
  const handleDelete = useCallback(
    (id: string) => onDelete(id),
    [onDelete]
  )

  return sorted.map(item => (
    <Item key={item.id} data={item} onDelete={handleDelete} />
  ))
}`,
      },
      {
        title: "Custom Hooks — lógica reutilizável",
        body: "Custom hook é uma função que começa com 'use' e pode chamar outros hooks. Extrai lógica com estado para reutilizar em múltiplos componentes sem mudar a árvore. Exemplos: useLocalStorage, useDebounce, useIntersectionObserver, useFetch. Regras: chame só no top level, nunca em condicionais ou loops. O prefixo 'use' é obrigatório para o linter enforcar as regras automaticamente.",
        code: `function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)  // cancela timeout anterior
  }, [value, delay])

  return debounced
}

// uso — componente fica simples, lógica fica no hook
const debouncedQuery = useDebounce(query, 300)`,
      },
      {
        title: "Context API — evitar prop drilling",
        body: "Prop drilling: passar dado por vários níveis de componentes que só repassam, sem usar. Context resolve: createContext cria o contexto, Provider disponibiliza para a árvore, useContext consome onde precisar. Ideal para dado global que muda raramente: tema, locale, usuário autenticado. Problema crítico: qualquer mudança no value causa re-render em TODOS os consumidores. Solução: split contexts por domínio, ou memoize o value com useMemo. Para estado frequente, prefira Zustand.",
        code: `const ThemeCtx = createContext<'dark' | 'light'>('dark')

function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  return (
    <ThemeCtx.Provider value={theme}>
      <Page />  {/* qualquer filho pode ler theme sem prop drilling */}
    </ThemeCtx.Provider>
  )
}

function BotaoTema() {
  const theme = useContext(ThemeCtx)  // sem receber props do pai
  return <div>Tema atual: {theme}</div>
}`,
      },
      {
        title: "React 18 — Concurrent Features",
        body: "React 18 introduz Concurrent Mode: o renderer pode pausar renders de baixa prioridade para priorizar interações do usuário. useTransition marca atualizações como não-urgentes (startTransition) — a UI permanece responsiva e isPending indica o estado de espera. useDeferredValue cria versão 'atrasada' de um valor — útil para filtrar listas grandes sem travar input. Automatic batching agrupa múltiplos setState em qualquer contexto (timeout, promise) em um único re-render. Requer createRoot para habilitar.",
        code: `const [isPending, startTransition] = useTransition()

function handleSearch(input: string) {
  setInputValue(input)              // urgente: atualiza imediatamente
  startTransition(() => {
    setFilteredList(filter(input))  // não-urgente: pode ser pausado
  })
}

return (
  <div>
    <input onChange={e => handleSearch(e.target.value)} />
    {isPending && <Spinner />}      {/* mostra enquanto filtra */}
    <Lista items={filteredList} />
  </div>
)`,
      },
      {
        title: "Server vs Client Components (RSC)",
        body: "Server Components rodam so no servidor — zero JS no cliente, acesso direto a banco de dados, filesystem e secrets. Não podem ter state, event handlers ou browser APIs. Client Components ('use client' no topo) são os tradicionais — interativos, rodam no browser. Regra: empurre lógica de servidor o mais fundo possível; Client Components ficam nas folhas. 'use client' marca o limite — tudo que esse arquivo importa vira cliente também.",
        code: `// server-component.tsx — sem 'use client' = roda só no servidor
async function ProductPage({ id }: { id: string }) {
  const product = await db.products.findById(id)  // acesso direto ao BD
  return <ProductCard product={product} />
}

// 'use client' — necessário para state, eventos, browser APIs
'use client'
function AddToCart({ productId }: { productId: string }) {
  const [added, setAdded] = useState(false)
  return (
    <button onClick={() => setAdded(true)}>
      {added ? 'Adicionado ✓' : 'Adicionar ao carrinho'}
    </button>
  )
}`,
      },
    ],
    gotchas: [
      "Closure stale em useEffect: função dentro do effect captura o valor de estado do momento da criação. Se o estado mudar, a closure aponta pro valor antigo. Fix: incluir a variável no dependency array, ou usar useRef pra valor atual sem re-render.",
      "Loop infinito em useEffect: função declarada dentro do componente tem referência nova a cada render. Se incluida como dependência sem useCallback, o effect roda, muda estado, causa re-render, cria nova função, effect roda de novo — infinito.",
      "Key incorreta em listas: key como index quebra estado em reordenações (React reusa o elemento mas o estado fica preso). Key deve ser único e estável — id do dado, nunca o index em listas que podem ser reordenadas ou filtradas.",
      "Mutar estado diretamente (arr.push, obj.prop = val) não trigga re-render — React compara a referência, que não mudou. Sempre crie novo objeto/array: setItems([...items, newItem]), setUser({ ...user, name }).",
      "Context re-render: todos os consumidores de um context re-renderizam quando o value muda, mesmo que não usem a propriedade que mudou. Split contexts por frequência de mudança ou memoize o value: const value = useMemo(() => ({ user, logout }), [user]).",
      "useEffect com async: não pode retornar uma Promise (o cleanup deve ser função síncrona ou undefined). Padrão correto: declare função async dentro do effect e chame imediatamente: useEffect(() => { async function load() { ... } load() }, []).",
      "React.StrictMode em dev invoca effects duas vezes (mount, cleanup, mount) para detectar efeitos colaterais não-idiomáticos. Não é bug — seu effect deve ser idempotente e limpo no cleanup. Em produção, isso não acontece.",
      "Over-memoização: React.memo + useMemo + useCallback em todos os componentes e funções não melhora performance — adiciona overhead de comparação e dificulta leitura. Profile primeiro (React DevTools Profiler), otimize só onde há evidência de problema.",
      "useState com objeto/array literal como valor inicial cria nova referência a cada render — mas isso só importa se o valor inicial é passado como dependência de outro hook. Para cálculo caro como valor inicial, use a forma lazy: useState(() => computeExpensiveValue()).",
    ],
    interview: [
      {
        q: "Como funciona o virtual DOM e o algoritmo de reconciliation?",
        level: 'senior',
        a: "<p>React mantem uma copia virtual da árvore DOM em memória (virtual DOM). Quando estado ou props mudam, React gera uma nova árvore virtual e usa um algoritmo de <strong>diffing</strong> para comparar com a anterior — identificando o mínimo de operações necessárias no DOM real.</p><p>O diff opera com dois pressupostos para ser O(n) em vez de O(n³): (1) elementos de tipos diferentes produzem árvores diferentes — React destroi e recria ao invés de comparar internamente; (2) <strong>key</strong> identifica elementos entre renders — key estável permite React reusar o elemento existente, key instável (index em lista reordenável) força destruição e recriação desnecessária.</p><p>O <strong>Fiber</strong> (React 16+) reimplementou o reconciliation como uma estrutura de dados em lista ligada de 'units of work', permitindo que o scheduler pause e retome o trabalho entre frames, evitando travar a main thread.</p>",
        tip: "Comece pelo problema que o virtual DOM resolve — mutação direta do DOM é cara em escala. Depois explique o diff. Mencione key como identidade de elemento. Termine com Fiber para mostrar profundidade. Essa progressão (problema → solução → detalhe interno) é o que diferencia sênior de pleno.",
      },
      {
        q: "O que mudou no React 18? Explique Concurrent Mode.",
        level: 'senior',
        a: "<p>React 18 introduziu o <strong>Concurrent Mode</strong>: o renderer pode trabalhar em múltiplos renders simultaneamente, pausar trabalho de baixa prioridade e priorizar interações do usuário.</p><p><strong>Mudanças principais:</strong></p><ul><li><code>createRoot</code> em vez de <code>ReactDOM.render</code> — habilita concurrent features</li><li><strong>Automatic batching</strong>: React 18 agrupa múltiplos setState em eventos assíncronos (setTimeout, fetch callbacks) automaticamente, antes só agrupava em event handlers</li><li><strong>useTransition</strong>: marca atualizações como não-urgentes. UI permanece responsiva enquanto transição renderiza</li><li><strong>useDeferredValue</strong>: versão atrasada de um valor para renders pesados (ex: filtrar lista enorme sem travar input)</li><li><strong>Suspense no servidor</strong>: streaming de HTML com fallback, habilitando RSC</li></ul>",
        tip: "Mencione createRoot como pré-requisito obrigatório — sem ele nenhuma concurrent feature funciona. Muitos candidatos falam das features sem saber disso. Depois cite automatic batching como ganho gratuito na migração. Só então entre em useTransition e useDeferredValue.",
      },
      {
        q: "Quando usar useTransition vs useDeferredValue?",
        level: 'senior',
        a: "<p>Ambos lidam com atualizações de baixa prioridade no Concurrent Mode, mas em cenários diferentes.</p><p><strong>useTransition</strong>: você controla QUAL atualização e não-urgente. Use quando a ação é iniciada por código seu (ex: trocar aba, navegar). Retorna <code>[isPending, startTransition]</code> — <code>isPending</code> permite mostrar indicador de loading.</p><pre><code>const [isPending, startTransition] = useTransition()\nstartTransition(() => setQuery(input)) // não-urgente\n</code></pre><p><strong>useDeferredValue</strong>: você recebe um valor de fora (ex: prop ou state de um pai) e cria uma versão 'atrasada'. Use quando não controla o código que atualiza o valor (ex: input controlado por pai). React renderiza primeiro com o valor antigo (urgente) e depois atualiza para o novo (deferido).</p><p>Regra: se você dispara a atualização, use <code>useTransition</code>. Se você recebe o valor de outro lugar, use <code>useDeferredValue</code>.</p>"
      },
      {
        q: "Quando usar useMemo vs useCallback?",
        a: "<p><strong>useMemo</strong> memoiza o <em>resultado</em> de um cálculo. Use quando o cálculo é caro e as dependências mudam raramente:</p><pre><code>const sorted = useMemo(() => items.sort(compareFn), [items])</code></pre><p><strong>useCallback</strong> memoiza uma <em>função</em> (referência estável). Use quando a função vai como prop para componente filho memoizado com React.memo, ou como dependência de outro hook (useEffect, useMemo).</p><pre><code>const handleClick = useCallback(() => doSomething(id), [id])</code></pre><p>Regra prática: só memoize com evidência de problema de performance (React DevTools Profiler). A overhead de memoização (comparação de dependências, memória) pode superar o ganho em componentes simples.</p>"
      },
      {
        q: "Explique o problema de closure stale e como resolver.",
        level: 'senior',
        a: "<p>Quando você usa uma função dentro de <code>useEffect</code>, ela captura os valores de estado e props do momento em que foi criada (closure). Se o estado mudar depois, a closure ainda aponta pro valor antigo — <strong>stale closure</strong>.</p><pre><code>useEffect(() => {\n  const id = setInterval(() => {\n    console.log(count) // sempre 0! closure capturou count=0\n  }, 1000)\n  return () => clearInterval(id)\n}, []) // [] = não atualiza a closure</code></pre><p><strong>Solução 1</strong>: adicionar <code>count</code> no dependency array (effect re-cria o interval a cada mudança).</p><p><strong>Solução 2</strong>: usar <code>useRef</code> pra manter referência mutável ao valor atual — sem causar re-render:</p><pre><code>const countRef = useRef(count)\nuseLayoutEffect(() => { countRef.current = count })\n// dentro do effect: countRef.current sempre atualizado</code></pre><p><strong>Solução 3</strong>: forma funcional do setState não precisa da closure: <code>setCount(c => c + 1)</code>.</p>",
        tip: "Esse é o gotcha favorito de entrevistadores sênior. Não basta conhecer o conceito — demonstre que você já resolveu em produção: descreva o bug (log sempre imprime 0), explique por que (closure captura snapshot do momento), e apresente as 3 soluções. Conhecer só 1 solução parece junior.",
      },
      {
        q: "O que são Error Boundaries e quando usar?",
        a: "<p>Error Boundaries são componentes que capturam erros de JavaScript durante a renderização de filhos, exibindo uma UI de fallback ao invés de quebrar a árvore inteira.</p><p>Só podem ser <strong>class components</strong> com <code>static getDerivedStateFromError(error)</code> (atualiza state para mostrar fallback) e <code>componentDidCatch(error, info)</code> (log do erro).</p><pre><code>class ErrorBoundary extends React.Component {\n  state = { hasError: false }\n  static getDerivedStateFromError() { return { hasError: true } }\n  componentDidCatch(err, info) { Sentry.captureException(err) }\n  render() {\n    if (this.state.hasError) return &lt;FallbackUI /&gt;\n    return this.props.children\n  }\n}</code></pre><p>Use a lib <strong>react-error-boundary</strong> para evitar escrever class component. Aplique em: seções críticas do app (widgets, editores), com fallback amigável e reset. Error Boundaries <em>não</em> capturam: erros em event handlers (use try/catch), erros assíncronos (Promise rejections), erros no próprio boundary.</p>"
      },
      {
        q: "Como evitar re-renders desnecessarios?",
        a: "<p>Re-renders têm causas distintas e soluções distintas:</p><p><strong>1. Props mudando por referência</strong>: objeto/array/função criado no render pai sempre é 'novo'. Fix: <code>React.memo</code> no filho + <code>useMemo</code>/<code>useCallback</code> no pai para estabilizar referência.</p><p><strong>2. Context re-render em massa</strong>: toda mudança no value causa re-render em todos os consumidores. Fix: split contexts por domínio, ou memoize o value com <code>useMemo</code>, ou use um selector pattern (Zustand tem isso nativo).</p><p><strong>3. Estado muito alto na árvore</strong>: mova o estado para baixo (colocação). Se só um componente usa o estado, ele não deve estar no pai.</p><p><strong>4. Lista sem key</strong>: React recria elementos desnecessariamente. Use keys estáveis.</p><p>Ferramenta essencial: <strong>React DevTools Profiler</strong> — mostra o que renderizou, por que renderizou e quanto tempo levou. Não otimize sem dados do profiler.</p>",
        tip: "Abra dizendo 're-render não é necessariamente ruim — só otimize com evidência do Profiler'. Isso filtra candidatos que memoizam tudo por padrão (antipattern). Depois liste causas e soluções. Quem menciona o Profiler primeiro demonstra maturidade de produção.",
      },
      {
        q: "Qual a diferença entre state e ref?",
        a: "<p><strong>State</strong> (<code>useState</code>): quando muda, trigga re-render. O valor é imutável dentro do ciclo de vida da renderização atual — você sempre ve o valor do snapshot daquele render.</p><p><strong>Ref</strong> (<code>useRef</code>): persiste entre renders sem triggar re-render. Mutavel — você pode alterar <code>ref.current</code> diretamente. Útil para:</p><ul><li>Acessar elemento DOM (<code>ref.current.focus()</code>)</li><li>Guardar valor que precisa ser atualizado mas não deve causar re-render (timer id, contador, previous value)</li><li>Armazenar referência a valor atual para evitar stale closure em effects</li></ul><p>Armadilha: não leia <code>ref.current</code> durante a renderização — o valor pode não ser o do render atual. Refs são para efeitos colaterais e operações imperativas.</p>"
      },
      {
        q: "Quando usar Context vs estado externo (Zustand/Redux)?",
        a: "<p>Context é ótimo para: dado que muda raramente e precisa estar disponível em muitos níveis (tema, locale, usuário autenticado, feature flags). Não precisa de instalação extra.</p><p>Problema do Context: qualquer mudança no <code>value</code> força re-render em <em>todos</em> os consumidores — sem granularidade. Se você tem um objeto com 10 propriedades e muda 1, todos os componentes que usam o contexto re-renderizam.</p><p><strong>Use estado externo (Zustand, Jotai, Redux) quando:</strong></p><ul><li>Estado muda com frequência (ex: estado de UI complexo, lista filtrável)</li><li>Você precisa de selectores para re-render granular (<code>useStore(state => state.count)</code>)</li><li>Multiplas partes do app precisam de ações coordenadas</li><li>Precisa de devtools, time travel, persistência</li></ul><p>Zustand é a escolha moderna em React: API mínima, sem boilerplate, seletores nativos, sem Provider necessário.</p>",
        tip: "O critério decisivo é frequência de mudança, não 'complexidade'. Context para auth/theme/locale (muda raramente). Zustand para estado de UI que muda com interações do usuário. Entrevistadores esperam esse critério específico — não 'use Zustand quando o projeto ficar grande'.",
      },
      {
        q: "Explique o modelo de composição do React: children, render props e compound components.",
        level: 'senior',
        a: "<p><strong>Children prop</strong>: o slot genérico. Qualquer JSX passado entre as tags do componente fica em <code>props.children</code>. Simples e flexível.</p><pre><code>&lt;Card&gt;&lt;p&gt;conteúdo&lt;/p&gt;&lt;/Card&gt;</code></pre><p><strong>Render props</strong>: passar uma função como prop (ou children) que o componente chama com dados internos. Permite ao pai controlar o que é renderizado com acesso a estado interno do filho:</p><pre><code>&lt;Mouse render={({ x, y }) =&gt; &lt;Cursor x={x} y={y} /&gt;} /&gt;</code></pre><p><strong>Compound components</strong>: conjunto de componentes que compartilham estado via Context interno, mas parecem independentes para o usuário da API. Padrão clássico: <code>Select</code> + <code>Option</code>, <code>Tabs</code> + <code>Tab</code> + <code>TabPanel</code>. O componente pai expoe o Context, os filhos consomem:</p><pre><code>&lt;Tabs defaultValue='a'&gt;\n  &lt;Tab value='a'&gt;Aba 1&lt;/Tab&gt;\n  &lt;TabPanel value='a'&gt;Conteúdo&lt;/TabPanel&gt;\n&lt;/Tabs&gt;</code></pre><p>Cada pattern tem seu lugar: use children para slots simples, render props quando precisa injetar dados, compound components quando a API de uso é o mais importante.</p>"
      },
      {
        q: "Como funciona a arquitetura Fiber internamente? Que problema ela resolve em relação ao reconciliador antigo?",
        level: 'senior',
        a: "<p>O <strong>reconciliador antigo</strong> (React ≤15) processava a árvore inteira de forma síncrona em uma única call stack ininterruptível. Uma atualização grande podia bloquear a main thread por dezenas de milissegundos, causando travamentos visíveis.</p><p><strong>Fiber</strong> (React 16+) reimplementou o reconciliation como uma lista ligada de 'fiber nodes' — um por instância de componente. Cada fiber armazena tipo do componente, props/state, ponteiros para pai/filho/irmão e uma tag de trabalho. Isso permite:</p><ul><li>Dividir o trabalho em unidades pequenas que podem ser pausadas entre frames do browser</li><li>Atribuir prioridades diferentes a diferentes atualizações (tecla pressionada é mais urgente que fetch em background)</li><li>Abandonar e reiniciar trabalho se uma atualização de maior prioridade chegar</li><li>Reaproveitar trabalho já concluido quando possível</li></ul><p>O processo tem duas fases: <strong>fase de render/reconcile</strong> (interruptível — pode ser pausada, retomada ou descartada; roda em memória) e <strong>fase de commit</strong> (síncrona e ininterruptível — aplica todas as mutações do DOM de uma vez). Essa separação explica por que effects rodam depois que o browser pintou. Implicação importante: a fase de render pode rodar mais de uma vez para o mesmo resultado — logo, funções de componente e hooks como useMemo devem ser <strong>puros e sem efeitos colaterais</strong>.</p>"
      },
      {
        q: "Quais são as regras dos hooks e por que o React as impoe?",
        a: "<p>Duas regras: (1) <strong>chame hooks apenas no top level</strong> — nunca dentro de loops, condicionais ou funções aninhadas; (2) <strong>chame hooks apenas de componentes React ou custom hooks</strong> — nunca de funções JavaScript comuns.</p><p>O motivo e puramente sobre <strong>ordem</strong>. O React não tem nomes para os seus hooks — ele os rastreia pela ordem em que são chamados a cada render. Internamente, cada chamada de hook mapeia para uma posição em uma lista ligada anexada ao fiber. Se você chama um hook condicionalmente, a posição na lista muda entre renders e o React lê o valor de estado errado para o hook errado.</p><pre><code>// ERRADO — hook condicional\nif (condition) {\n  const [val, setVal] = useState(0) // posição 2 às vezes, posição 1 outras\n}\n\n// CORRETO — condição dentro do hook\nconst [val, setVal] = useState(0)\nconst active = condition ? val : defaultValue</code></pre><p>O <code>eslint-plugin-react-hooks</code> (exhaustive-deps + rules-of-hooks) detecta violações estaticamente. Essa pergunta revela se o candidato entende hooks como <em>slots ordenados</em> em vez de magia.</p>"
      },
      {
        q: "Explique o hook useLayoutEffect. Quando usar em vez de useEffect?",
        level: 'senior',
        a: "<p><code>useEffect</code> roda <strong>de forma assíncrona após o browser pintar</strong>. <code>useLayoutEffect</code> roda <strong>sincronamente após mutações do DOM mas antes do browser pintar</strong>.</p><p>A diferença de timing importa para:</p><ul><li><strong>Ler layout do DOM</strong> (dimensões, scroll, bounding rects) e usar esses valores para mais mutações. Com useEffect, o usuário ve um flash do layout errado antes da correção pintar.</li><li><strong>Posicionamento imperativo de elementos</strong> (tooltips, popovers que precisam medir sua âncora antes de aparecer)</li><li><strong>Manter ref sempre atualizado antes do próximo paint</strong> (ex: pan/zoom SVG onde applyTransform precisa ser chamado em todo re-render)</li></ul><pre><code>useLayoutEffect(() => {\n  const { width } = ref.current.getBoundingClientRect()\n  setWidth(width) // sem flash\n})</code></pre><p><strong>Cuidados:</strong> useLayoutEffect bloqueia a pintura — trabalho pesado aqui degrada a performance percebida. No servidor (SSR) não roda — React 18 emite aviso; use useEffect ou suprima com suppressHydrationWarning. Prefira useEffect por padrão; use useLayoutEffect apenas quando observar flash visual com useEffect.</p>"
      },
      {
        q: "O que é automatic batching no React 18 e como difere do React 17?",
        level: 'senior',
        a: "<p><strong>Batching</strong> significa que o React agrupa múltiplas chamadas de setState em um único re-render para evitar trabalho desnecessário.</p><p>No <strong>React 17</strong>, batching só ocorria dentro de event handlers do React (onClick, onChange, etc.). Chamadas de setState dentro de setTimeout, Promise.then, event listeners nativos ou funções async cada uma trigava seu próprio re-render separado.</p><pre><code>// React 17 — 2 renders separados dentro de setTimeout\nsetTimeout(() => {\n  setCount(c => c + 1)  // render 1\n  setFlag(f => !f)      // render 2\n}, 1000)</code></pre><p>No <strong>React 18 com createRoot</strong>, batching é automático em <em>todos</em> os contextos — event handlers, timeouts, promises, eventos nativos. Os dois setState acima viram um único render.</p><p><strong>Para forçar renders separados</strong> (raro): use <code>ReactDOM.flushSync</code>:</p><pre><code>import { flushSync } from 'react-dom'\nflushSync(() => setCount(c => c + 1))  // força render imediato\nflushSync(() => setFlag(f => !f))      // segundo render</code></pre><p>Ponto de entrevista: automatic batching é um motivo pelo qual migrar para createRoot (entry point do React 18) pode melhorar a performance percebida sem mudar nada nos componentes.</p>"
      },
      {
        q: "Como a prop key funciona durante reconciliation? Quais os problemas de usar o index do array como key?",
        a: "<p>A prop <code>key</code> é o sinal de identidade do React para elementos em uma lista. Durante reconciliation, React emparelha elementos da árvore anterior com os da nova por key. Se as keys batem, React <strong>atualiza</strong> (reusa) o node DOM e instância de componente existente. Se uma key desaparece ou aparece uma nova, React <strong>destroi ou cria</strong> um novo elemento.</p><p><strong>Usar index como key funciona corretamente apenas quando:</strong></p><ul><li>A lista é estática (nunca reordenada, filtrada ou com inserção no inicio)</li><li>Os itens não têm estado interno nem inputs não controlados</li></ul><p><strong>Index como key quebra nestas situações:</strong></p><ul><li><strong>Reordenação</strong>: item B vai do index 1 para 0. React vê key=0 inalterada e tenta atualizar o DOM do item A com dados do item B — estado interno (scroll, input, animação) fica no elemento errado.</li><li><strong>Inserção no inicio</strong>: todos os índices mudam — React remonta todos os itens desnecessariamente.</li></ul><pre><code>// Correto — identidade estável e única\n{items.map(item => &lt;Row key={item.id} data={item} /&gt;)}</code></pre><p><strong>Uso intencional de key para forçar remontagem</strong>: passar uma key diferente para um componente não-lista força React a destrui-lo e recria-lo — forma limpa de resetar estado interno: <code>&lt;ProfileForm key={userId} /&gt;</code>.</p>"
      },
      {
        q: "Explique o mecanismo de Suspense. Como funciona com data fetching e o que mudou no React 18?",
        level: 'senior',
        a: "<p>Suspense deixa um componente 'suspender' o render enquanto espera algo (dados, código lazy) e exibir um fallback enquanto isso — sem o componente saber que está suspenso.</p><p><strong>Como funciona:</strong> uma fonte de dados compatível com Suspense (React.lazy, Next.js/Remix, SWR/React Query em modo Suspense) lança uma Promise durante o render. React a captura, sobe na árvore até o Suspense boundary mais próximo, renderiza o fallback e retenta o subtree quando a promise resolve.</p><pre><code>const LazyChart = React.lazy(() => import('./Chart'))\n\n&lt;Suspense fallback={&lt;Spinner /&gt;}&gt;\n  &lt;LazyChart /&gt;\n&lt;/Suspense&gt;</code></pre><p><strong>Novidades do React 18:</strong></p><ul><li><strong>Suspense no servidor</strong>: streaming de HTML. O servidor envia o shell imediatamente e faz streaming dos subtrees suspensos conforme resolvem, hidratando-os incrementalmente — elimina o waterfall 'tudo ou nada' do SSR antigo.</li><li><strong>Hidratacao seletiva</strong>: React prioriza hidratar a parte com que o usuário está interagindo primeiro.</li></ul><p>Ponto crítico: <strong>não faça fetch dentro de useEffect</strong> em arquiteturas com Suspense — o componente renderiza antes do effect rodar, causando flash de loading (waterfall de requests). Faça fetch no caminho do render (via lib compatível com Suspense) ou em Server Components.</p>"
      },
      {
        q: "Como tipar corretamente props de componentes React com TypeScript?",
        a: "<p>Duas abordagens principais:</p><p><strong>1. Interface de props explícita (preferida):</strong></p><pre><code>interface ButtonProps {\n  label: string\n  onClick: () => void\n  variant?: 'primary' | 'secondary'\n}\n\nfunction Button({ label, onClick, variant = 'primary' }: ButtonProps) {\n  return &lt;button onClick={onClick}&gt;{label}&lt;/button&gt;\n}</code></pre><p><strong>2. React.FC&lt;Props&gt; (evite em código moderno):</strong> em versões antigas adicionava children automaticamente a qualquer componente e restringe o tipo de retorno. A abordagem explícita é mais precisa.</p><p><strong>Tipando children corretamente:</strong></p><pre><code>interface WrapperProps {\n  children: React.ReactNode  // mais permissivo — aceita JSX, string, number, null\n}\n\n// Render prop / function child\ninterface ListProps&lt;T&gt; {\n  items: T[]\n  children: (item: T) => React.ReactNode\n}</code></pre><p><strong>Event handlers:</strong> use <code>React.ChangeEvent&lt;HTMLInputElement&gt;</code>, <code>React.MouseEvent&lt;HTMLButtonElement&gt;</code>, <code>React.FormEvent&lt;HTMLFormElement&gt;</code> para ter o tipo correto de <code>event.target</code>.</p><p>Dica sênior: use <code>ComponentPropsWithoutRef&lt;'button'&gt;</code> para espalhar props nativas de elemento sem re-tipar cada atributo HTML.</p>"
      },
      {
        q: "O que são forwardRef e useImperativeHandle? Quando usar?",
        level: 'senior',
        a: "<p><code>forwardRef</code> é uma função de ordem superior que permite a um componente receber uma <code>ref</code> do pai e repassá-la para um elemento interno — o que não é possível com props normais, pois <code>ref</code> tem tratamento especial no React.</p><pre><code>const Input = forwardRef&lt;HTMLInputElement, { label: string }&gt;(\n  ({ label }, ref) =&gt; &lt;input ref={ref} placeholder={label} /&gt;\n)\n\n// pai acessa o input diretamente\nconst inputRef = useRef&lt;HTMLInputElement&gt;(null)\ninputRef.current?.focus()</code></pre><p><code>useImperativeHandle</code> vai além: em vez de expor o elemento DOM bruto, você define exatamente quais métodos/valores o pai pode acessar — API controlada e encapsulada.</p><pre><code>const Modal = forwardRef&lt;{ open: () =&gt; void }&gt;((props, ref) =&gt; {\n  const [show, setShow] = useState(false)\n  useImperativeHandle(ref, () =&gt; ({ open: () =&gt; setShow(true) }))\n  return show ? &lt;dialog&gt;...&lt;/dialog&gt; : null\n})</code></pre><p><strong>Quando usar:</strong> integrações com bibliotecas imperativas (charts, mapas, editores rich text), gerenciamento de foco em componentes de design system, animações programáticas. <strong>Não use</strong> para passar dados ou comunicação normal pai-filho — isso é responsabilidade de props e callbacks.</p>",
        tip: "Mencione por que ref tem tratamento especial (não é uma prop normal — React a intercepta). Depois mostre que forwardRef resolve o forwarding e useImperativeHandle resolve o encapsulamento. A combinação dos dois é o pattern de componentes de design system (Input, Modal, Tooltip). Candidatos que só conhecem forwardRef sem useImperativeHandle deixam metade do pattern sem mencionar.",
      },
      {
        q: "O que são custom hooks? Quais regras devem seguir e quais os melhores patterns?",
        a: "<p>Custom hook é uma função JavaScript cujo nome começa com <code>use</code> que chama outros hooks. É o mecanismo primário para extrair e reutilizar lógica com estado entre componentes — sem as mudanças na hierarquia de componentes que render props ou HOCs exigem.</p><p><strong>Regras:</strong> mesmas dos hooks built-in — chame só no top level, só em funções React. O prefixo <code>use</code> é obrigatório para o linter (eslint-plugin-react-hooks) enforcar as regras automaticamente.</p><p><strong>Bons patterns:</strong></p><ul><li><strong>Encapsule uma única responsabilidade</strong>: useWindowSize, useDebounce, useLocalStorage, useIntersectionObserver</li><li><strong>Retorne API estável</strong>: tuple [value, setValue] para hooks tipo state; objeto para múltiplos outputs</li><li><strong>Memoize callbacks retornados</strong> com useCallback para que consumidores possam usá-los como dependência de effects</li></ul><pre><code>function useDebounce&lt;T&gt;(value: T, delay: number): T {\n  const [debouncedValue, setDebouncedValue] = useState(value)\n  useEffect(() => {\n    const id = setTimeout(() => setDebouncedValue(value), delay)\n    return () => clearTimeout(id)\n  }, [value, delay])\n  return debouncedValue\n}</code></pre><p>Framing de entrevista: custom hooks resolvem o problema de <em>reutilização de lógica</em>. Antes dos hooks, isso exigia HOCs (conflito de nomes de prop, wrapper hell) ou render props (indentação de callback). Hooks compoem lógica sem mudar a árvore de componentes.</p>"
      },
      {
        q: "Explique as fases de render e commit do React. O que é um 'bailout'?",
        level: 'senior',
        a: "<p>O rendering do React tem duas fases distintas:</p><p><strong>Fase de render (interruptível):</strong> React chama a função do componente para calcular o novo output. Essa fase é pura — sem efeitos colaterais, sem mutações do DOM. React faz diff da nova árvore virtual contra a anterior. No Concurrent Mode essa fase pode ser pausada, reiniciada ou abandonada.</p><p><strong>Fase de commit (síncrona e ininterruptível):</strong> React aplica o diff no DOM real. Em seguida roda cleanups e setups de useLayoutEffect, depois (após o browser pintar) roda cleanups e setups de useEffect.</p><p><strong>Um componente re-renderiza quando:</strong></p><ul><li>Seu próprio state muda (useState ou useReducer)</li><li>Seu pai re-renderiza (a menos que esteja em React.memo com props inalteradas)</li><li>Um context que ele assina muda</li></ul><p><strong>Bailout</strong>: React pula a fase de render de um subtree quando consegue provar que o output seria idêntico:</p><ul><li><code>React.memo</code> — compara props superficialmente; se iguais, pula o render do componente</li><li><code>useState</code>/<code>useReducer</code> — se o novo state é o mesmo valor (comparação Object.is), React faz bailout após re-renderizar uma vez</li><li><code>useMemo</code> — retorna o valor em cache, pulando o cálculo</li></ul><p>Insight chave: re-render não é o mesmo que DOM update. Re-render = chamar a função e fazer diff. DOM update só ocorre na fase de commit se o diff encontrou mudanças reais. Muitos re-renders desnecessários são inofensivos — otimize só onde o Profiler mostra custo real.</p>"
      },
      {
        q: "Como implementar code splitting e lazy loading em React? Quais os trade-offs?",
        a: "<p>Code splitting divide o bundle JavaScript em pedaços menores carregados sob demanda, reduzindo o tempo de carregamento inicial.</p><p><strong>Ferramenta principal: React.lazy + dynamic import():</strong></p><pre><code>const Dashboard = React.lazy(() => import('./Dashboard'))\n\nfunction App() {\n  return (\n    &lt;Suspense fallback={&lt;PageSkeleton /&gt;}&gt;\n      &lt;Dashboard /&gt;\n    &lt;/Suspense&gt;\n  )\n}</code></pre><p>Bundlers (Webpack, Vite) detectam o import dinâmico e emitem um chunk separado. O chunk é buscado na rede quando Dashboard renderiza pela primeira vez.</p><p><strong>Estratégias comuns de split:</strong></p><ul><li><strong>Por rota</strong>: cada rota é um chunk separado (maior impacto, ganho mais fácil)</li><li><strong>Por componente</strong>: componentes pesados carregados condicionalmente (editores rich text, gráficos, editores de código)</li><li><strong>Por biblioteca</strong>: isolar deps grandes de terceiros</li></ul><p><strong>Trade-offs:</strong></p><ul><li>Pro: bundle inicial menor, Time to Interactive mais rápido</li><li>Con: waterfall de rede na primeira visita — o chunk precisa ser buscado e parseado antes do componente renderizar</li><li>Mitigação: prefetch de chunks no hover do link, ou prefetching pelo router (Next.js faz isso automaticamente)</li></ul><p><strong>No Next.js App Router</strong>: cada segmento de rota é automaticamente separado. Use next/dynamic para split por componente com suporte a SSR. dynamic(() => import('./Chart'), { ssr: false }) carrega só no cliente.</p>"
      },
      {
        q: "O que é prop drilling e quais os patterns para resolver? Quando usar cada um?",
        a: "<p><strong>Prop drilling</strong> é passar dados por componentes intermediários que não usam o dado — só repassam para um descendente mais profundo. Os intermediários ficam acoplados a dados que não são deles.</p><p><strong>Soluções e quando usar cada uma:</strong></p><p><strong>1. Composição de componentes (primeiro recurso):</strong> em vez de fazer drilling, passe o componente já renderizado como children ou prop. O componente de nível mais alto tem o dado e renderiza a folha; os intermediários só posicionam via {children}. Sem APIs extras necessárias.</p><pre><code>// Em vez de: &lt;Layout&gt;&lt;Sidebar user={user} /&gt;&lt;/Layout&gt;\n&lt;Layout sidebar={&lt;Sidebar user={user} /&gt;}&gt;</code></pre><p><strong>2. React Context:</strong> para dados que muitos componentes precisam em diferentes níveis de aninhamento e que mudam raramente (tema, locale, usuário autenticado). Não use para state de alta frequência — todo consumidor re-renderiza em qualquer mudança no valor do contexto.</p><p><strong>3. Estado externo (Zustand, Jotai, Redux):</strong> para state frequente ou complexo. Componentes se inscrevem apenas nos slices que precisam (pattern de selector), então componentes não relacionados não re-renderizam.</p><p><strong>4. URL state</strong> (search params): para estado de UI que deve ser compartilhável/favoritável (filtros, paginação, aba selecionada).</p><p>Framing de entrevista: use composição primeiro — é a solução idiomática do React sem ferramentas extras. Context para estado global infrequente. State manager para estado complexo, frequente ou cross-feature.</p>"
      },
      {
        q: "Como testar componentes React efetivamente? Qual a filosofia do Testing Library?",
        a: "<p>O princípio central do <strong>React Testing Library (RTL)</strong>: teste da forma que o usuário interage com seu componente, não os detalhes de implementação. Consulte elementos por role acessível, label, texto ou test id — não por classes CSS ou internals do componente.</p><p><strong>Prioridade de queries (docs RTL):</strong></p><ol><li><code>getByRole</code> — reflete a árvore de acessibilidade (mais preferido)</li><li><code>getByLabelText</code> — inputs de formulário</li><li><code>getByText</code> — conteúdo não interativo</li><li><code>getByTestId</code> — escape hatch quando nada mais funciona</li></ol><pre><code>test('submete o formulario', async () => {\n  render(&lt;LoginForm onSubmit={mockFn} /&gt;)\n  await userEvent.type(screen.getByLabelText(/email/i), 'a@b.com')\n  await userEvent.click(screen.getByRole('button', { name: /entrar/i }))\n  expect(mockFn).toHaveBeenCalledWith({ email: 'a@b.com' })\n})</code></pre><p><strong>O que testar:</strong> fluxos do usuário (digitar, clicar, ver resultado), renderização condicional (loading, erro, vazio), acessibilidade, integração entre componentes.</p><p><strong>O que NÃO testar:</strong> valores de state interno, chamadas de métodos do componente, classes CSS específicas de implementação.</p><p>Para hooks: use renderHook do RTL. Para operações async: use waitFor ou queries findBy* (aguardam automaticamente). Mock na camada de rede com <strong>MSW (Mock Service Worker)</strong> em vez de mockar módulos — testes mais próximos do uso real.</p>"
      },
      {
        q: "Como useReducer difere de useState e quando preferi-lo? Como se compara a gerenciadores externos?",
        a: "<p><code>useReducer</code> gerencia estado com uma <strong>função reducer pura</strong>: <code>(state, action) =&gt; newState</code>. Adequado quando o próximo estado depende do anterior de formas complexas, ou quando múltiplos sub-valores mudam juntos baseados na mesma ação.</p><pre><code>type Action =\n  | { type: 'increment' }\n  | { type: 'set'; payload: number }\n  | { type: 'reset' }\n\nfunction reducer(state: number, action: Action): number {\n  switch (action.type) {\n    case 'increment': return state + 1\n    case 'set': return action.payload\n    case 'reset': return 0\n    default: return state\n  }\n}\n\nconst [count, dispatch] = useReducer(reducer, 0)</code></pre><p><strong>Prefira useReducer sobre useState quando:</strong></p><ul><li>State é um objeto com múltiplos campos que mudam juntos</li><li>O próximo state depende do anterior de formas não-triviais</li><li>Você quer desacoplar event handlers da lógica de atualização de state (facilita testar o reducer isoladamente)</li><li>Múltiplas ações produzem transições de estado complexas</li></ul><p><strong>vs. Zustand/Redux:</strong> useReducer é local ao componente (ou passado via Context). Gerenciadores externos fornecem store global que qualquer componente pode assinar sem prop threading ou overhead de re-render do Context. Redux DevTools + time travel + middleware (thunks, sagas) adicionam capacidades de debug e efeitos colaterais que useReducer sozinho não tem. Para estado compartilhado e cross-feature — use Zustand ou Redux.</p>"
      },
      {
        q: "O que são React Server Components (RSC)? Como o boundary 'use client' funciona?",
        level: 'senior',
        a: "<p><strong>React Server Components (RSC)</strong> são componentes que executam exclusivamente no servidor — seu código nunca entra no bundle JavaScript enviado ao cliente. Isso permite acesso direto a banco de dados, sistemas de arquivos e APIs internas sem expor credenciais ao browser. O HTML resultante é transmitido ao cliente como payload serializado (RSC payload), não como HTML puro de SSR.</p><p><strong>O modelo tem dois mundos distintos:</strong></p><ul><li><strong>Server Components</strong> (padrão no Next.js App Router): executam no servidor, zero JavaScript enviado ao browser. Podem ser <code>async</code> e fazer <code>await</code> diretamente. Não podem usar <code>useState</code>, <code>useEffect</code>, event handlers ou APIs do browser.</li><li><strong>Client Components</strong> (<code>'use client'</code>): pré-renderizados no servidor (SSR) E hidratados no browser. Podem usar hooks, estado e eventos. O JS deles é incluído no bundle.</li></ul><p><strong>Como o boundary funciona:</strong></p><pre><code>// ServerComp.tsx — roda só no servidor\nasync function ServerComp() {\n  const data = await db.query('SELECT ...')  // acesso direto ao banco\n  return &lt;ClientComp items={data} /&gt;          // passa dados serializáveis\n}\n\n// ClientComp.tsx\n'use client'\nfunction ClientComp({ items }: { items: Item[] }) {\n  const [sel, setSel] = useState&lt;Item | null&gt;(null)  // ok — client\n  return &lt;ul&gt;{items.map(i =&gt; &lt;li key={i.id} onClick={() =&gt; setSel(i)}&gt;{i.name}&lt;/li&gt;)}&lt;/ul&gt;\n}</code></pre><p><strong>Regra crítica do boundary:</strong> <code>'use client'</code> não significa 'só executa no cliente' — significa 'este componente e tudo que ele importa diretamente entra no bundle do cliente'. Um SC pode <em>receber</em> um CC como <code>children</code> ou prop sem poluir o bundle — porque o SC não importa o CC diretamente, o pai os compõe. Mas se um SC importar um CC diretamente (via import), o CC passa a fazer parte do bundle.</p><p><strong>O que pode passar entre SC e CC:</strong> apenas valores serializáveis — strings, números, arrays, objetos planos, JSX. Não passam: funções, classes, Dates, Symbols, instâncias de objetos complexos.</p><p><strong>Vantagens principais:</strong> bundle JS menor (componentes puramente visuais e de dados somem do bundle), Data Fetching sem API routes intermediárias, Streaming incremental de HTML via Suspense, melhor performance percebida no carregamento inicial.</p>",
        tip: "A pegadinha que separa sênior de pleno: 'use client' não cria um componente que só roda no cliente — o SSR ainda acontece. Ele marca o boundary onde o bundle JS começa. Explique isso primeiro. Depois fale da regra de composição (children vs import direto) — é o gotcha que mais aparece em entrevistas de times que usam Next.js App Router. Termine mencionando o que não pode passar na serialização (funções, classes). Quem conhece os 3 pontos demonstrou que trabalhou de verdade com o modelo.",
      },
    ],
    videos: [
      {
        title: "React in 100 Seconds",
        channel: "Fireship",
        url: "https://www.youtube.com/watch?v=Tn6-PIqc4UM",
        topic: "visão geral",
        note: "2 minutos para alinhar o modelo mental antes de estudar em profundidade. O vídeo mais eficiente para ter uma fotografia do que é React.",
      },
      {
        title: "React Hooks Course — All React Hooks Explained",
        channel: "Web Dev Simplified",
        url: "https://www.youtube.com/watch?v=LlvBzyy-558",
        topic: "hooks",
        note: "Cobertura completa dos hooks principais com exemplos práticos — useState, useEffect, useRef, useMemo, useCallback e mais. O melhor vídeo único para dominar hooks de uma vez.",
      },
      {
        title: "useEffect — o guia definitivo com todos os cenários e armadilhas",
        channel: "Web Dev Simplified",
        url: "https://www.youtube.com/watch?v=0ZJgIjIuY7U",
        topic: "useEffect / ciclo de vida",
        note: "Mount, update, unmount, cleanup, dependency array — com exemplos reais de bugs causados por closures stale e como resolver.",
      },
      {
        title: "React Server Components — série técnica completa com Next.js App Router",
        channel: "Jack Herrington",
        url: "https://www.youtube.com/watch?v=phUhGC24ETo",
        topic: "RSC / Next.js",
        note: "A melhor série técnica sobre RSC no YouTube. Cobre o modelo client/server boundary, streaming e integração com Next.js App Router.",
      },
      {
        title: "Advanced React Patterns — Compound Components, Render Props, Custom Hooks",
        channel: "Jack Herrington",
        url: "https://www.youtube.com/results?search_query=advanced+react+patterns+compound+components+jack+herrington",
        topic: "padrões avançados",
        note: "Patterns que diferenciam sênior: compound components (Tabs, Select), render props, HOCs e quando usar cada um.",
      },
      {
        title: "React 18 Concurrent Features — useTransition, Suspense e Automatic Batching",
        channel: "Theo (t3.gg)",
        url: "https://www.youtube.com/results?search_query=react+18+concurrent+features+useTransition+theo+t3gg",
        topic: "React 18 / Concurrent",
        note: "Análise opinativa e prática das features do React 18 com contexto de quando você realmente vai usar cada uma em produção.",
      },
    ],
    resources: [
      { title: "React docs — react.dev", url: "https://react.dev", kind: "docs" },
      { title: "React — Hooks reference completa", url: "https://react.dev/reference/react", kind: "docs" },
      { title: "React — Concurrent Features (useTransition, Suspense)", url: "https://react.dev/blog/2022/03/29/react-v18", kind: "artigo" },
      { title: "Josh Comeau — Making Sense of React Server Components", url: "https://www.joshwcomeau.com/react/server-components/", kind: "artigo" },
      { title: "Dominik Dorfmeister — React Query e patterns de estado", url: "https://tkdodo.eu/blog/", kind: "artigo" },
      { title: "Josh Comeau — Joy of React (curso completo)", url: "https://www.joyofreact.com/", kind: "curso" },
      { title: "Kent C. Dodds — Epic React", url: "https://epicreact.dev/", kind: "curso" },
      { title: "React DevTools — Profiler guide", url: "https://react.dev/learn/react-developer-tools", kind: "pratica" },
    ],
    cheatsheet: {
      title: "React Hooks — Cheat Sheet",
      html: `<style>
.rchs-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.rchs-card{background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px 14px}
.rchs-hook{color:#ef4444;font-size:11.5px;font-weight:700;margin-bottom:4px}
.rchs-sig{font-size:9.5px;color:#61DAFB;margin-bottom:7px;opacity:.85;line-height:1.5}
.rchs-desc{color:#64748b;font-size:10.5px;line-height:1.55}
.rchs-head{font-size:9px;color:#64748b;letter-spacing:.14em;text-transform:uppercase;margin:14px 0 8px;padding-bottom:6px;border-bottom:1px solid #1e3a5f}
</style>
<div style="font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:20px">
  <p style="color:#e2e8f0;font-size:11px;font-weight:700;margin:0 0 14px;letter-spacing:.06em">REACT HOOKS — CHEAT SHEET</p>
  <div class="rchs-head">ESTADO E DADOS</div>
  <div class="rchs-grid">
    <div class="rchs-card">
      <div class="rchs-hook">useState</div>
      <div class="rchs-sig">const [val, setVal] = useState(init)</div>
      <div class="rchs-desc">Memória local com re-render. Use setVal(v =&gt; v+1) quando depende do valor anterior.</div>
    </div>
    <div class="rchs-card">
      <div class="rchs-hook">useReducer</div>
      <div class="rchs-sig">const [s, dispatch] = useReducer(fn, init)<br>fn: (state, action) =&gt; newState</div>
      <div class="rchs-desc">Estado com transições complexas. Isola a lógica de update. Melhor testabilidade que useState.</div>
    </div>
    <div class="rchs-card">
      <div class="rchs-hook">useRef</div>
      <div class="rchs-sig">const r = useRef(val) → r.current</div>
      <div class="rchs-desc">Valor mutável sem re-render. DOM access. Não leia em render — use em effects e handlers.</div>
    </div>
    <div class="rchs-card">
      <div class="rchs-hook">useContext</div>
      <div class="rchs-sig">const val = useContext(MyCtx)</div>
      <div class="rchs-desc">Lê o Provider mais próximo. Re-renderiza quando value muda. Ideal para dado global infrequente.</div>
    </div>
  </div>
  <div class="rchs-head">EFEITOS E CICLO DE VIDA</div>
  <div class="rchs-grid">
    <div class="rchs-card">
      <div class="rchs-hook">useEffect</div>
      <div class="rchs-sig">useEffect(fn, deps?) → cleanup?</div>
      <div class="rchs-desc">Após render + paint. Sempre retorne cleanup para limpar listeners, timers e subscriptions.</div>
    </div>
    <div class="rchs-card">
      <div class="rchs-hook">useLayoutEffect</div>
      <div class="rchs-sig">useLayoutEffect(fn, deps?)</div>
      <div class="rchs-desc">Antes do paint. Para leitura de layout (getBoundingClientRect) sem flash. Bloqueia pintura — use com cuidado.</div>
    </div>
  </div>
  <div class="rchs-head">PERFORMANCE E MEMOIZAÇÃO</div>
  <div class="rchs-grid">
    <div class="rchs-card">
      <div class="rchs-hook">useMemo</div>
      <div class="rchs-sig">useMemo(() =&gt; calc, deps)</div>
      <div class="rchs-desc">Memoiza resultado de cálculo. Só recalcula quando deps mudam. Profile antes de adicionar.</div>
    </div>
    <div class="rchs-card">
      <div class="rchs-hook">useCallback</div>
      <div class="rchs-sig">useCallback(() =&gt; fn, deps)</div>
      <div class="rchs-desc">Referência estável para função. Use quando função vai como prop de filho memoizado ou dep de effect.</div>
    </div>
  </div>
  <div class="rchs-head">CONCURRENT MODE (REACT 18+)</div>
  <div class="rchs-grid">
    <div class="rchs-card">
      <div class="rchs-hook">useTransition</div>
      <div class="rchs-sig">const [isPending, startTransition] = useTransition()</div>
      <div class="rchs-desc">Marca update como não-urgente. UI permanece responsiva. Use quando você controla a atualização.</div>
    </div>
    <div class="rchs-card">
      <div class="rchs-hook">useDeferredValue</div>
      <div class="rchs-sig">const deferred = useDeferredValue(val)</div>
      <div class="rchs-desc">Versão atrasada de um valor externo. Use quando você recebe o valor de fora (prop, state de pai).</div>
    </div>
  </div>
  <div class="rchs-head">REGRAS E DEPENDENCY ARRAY</div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
    <div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px 14px">
      <div style="font-size:10px;color:#4ade80;font-weight:700;margin-bottom:6px">Deps array</div>
      <div style="font-size:10.5px;color:#64748b;line-height:1.8">
        <span style="color:#4ade80">[ ]</span> → só no mount<br>
        <span style="color:#61DAFB">[x, y]</span> → quando x ou y muda<br>
        <span style="color:#ef4444">sem array</span> → todo render (raramente correto)
      </div>
    </div>
    <div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px 14px">
      <div style="font-size:10px;color:#f59e0b;font-weight:700;margin-bottom:6px">Regras dos Hooks</div>
      <div style="font-size:10.5px;color:#64748b;line-height:1.8">
        <span style="color:#4ade80">✓</span> Sempre no top level<br>
        <span style="color:#ef4444">✗</span> Nunca em condicionais ou loops<br>
        <span style="color:#ef4444">✗</span> Nunca em funções JS comuns
      </div>
    </div>
  </div>
</div>`,
    },
    mindmap: {
      title: "Mapa mental — React do zero ao sênior",
      html: `<style>
.rcmm2-row{display:flex;align-items:flex-start;gap:0;padding:8px 0;border-bottom:1px solid #1e293b}
.rcmm2-row:last-child{border-bottom:none}
.rcmm2-cat{width:110px;flex-shrink:0;font-size:9px;letter-spacing:.08em;font-weight:700;text-transform:uppercase;padding-top:5px;line-height:1.4}
.rcmm2-tags{display:flex;flex-wrap:wrap;gap:5px}
.rcmm2-tag{font-size:10px;padding:3px 9px;border-radius:4px;background:#1e293b;border:1px solid #334155;color:#94a3b8;white-space:nowrap;line-height:1.4}
.rcmm2-tag-key{background:rgba(97,218,251,.08);border-color:rgba(97,218,251,.28);color:#61DAFB}
.rcmm2-tag-adv{background:rgba(239,68,68,.06);border-color:rgba(239,68,68,.22);color:#f87171}
</style>
<div style="font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px">
  <p style="color:#e2e8f0;font-size:11px;font-weight:700;margin:0 0 10px;letter-spacing:.04em">REACT — MAPA DE CONCEITOS</p>
  <p style="color:#475569;font-size:10px;margin:0 0 16px;display:flex;gap:10px;flex-wrap:wrap">
    <span><span style="background:rgba(97,218,251,.08);border:1px solid rgba(97,218,251,.28);color:#61DAFB;padding:2px 6px;border-radius:3px;font-size:9px">azul</span> essencial</span>
    <span><span style="background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.22);color:#f87171;padding:2px 6px;border-radius:3px;font-size:9px">vermelho</span> nível sênior</span>
  </p>
  <div>
    <div class="rcmm2-row">
      <div class="rcmm2-cat" style="color:#61DAFB">BASE</div>
      <div class="rcmm2-tags">
        <span class="rcmm2-tag rcmm2-tag-key">componente (função)</span>
        <span class="rcmm2-tag rcmm2-tag-key">JSX</span>
        <span class="rcmm2-tag rcmm2-tag-key">props</span>
        <span class="rcmm2-tag rcmm2-tag-key">children</span>
        <span class="rcmm2-tag">className / style</span>
        <span class="rcmm2-tag">key em listas</span>
        <span class="rcmm2-tag">renderização condicional</span>
      </div>
    </div>
    <div class="rcmm2-row">
      <div class="rcmm2-cat" style="color:#4ade80">ESTADO</div>
      <div class="rcmm2-tags">
        <span class="rcmm2-tag rcmm2-tag-key">useState</span>
        <span class="rcmm2-tag rcmm2-tag-key">lifting state</span>
        <span class="rcmm2-tag rcmm2-tag-key">imutabilidade</span>
        <span class="rcmm2-tag">useReducer</span>
        <span class="rcmm2-tag">URL state</span>
        <span class="rcmm2-tag rcmm2-tag-adv">formulários não controlados</span>
      </div>
    </div>
    <div class="rcmm2-row">
      <div class="rcmm2-cat" style="color:#f59e0b">EFEITOS</div>
      <div class="rcmm2-tags">
        <span class="rcmm2-tag rcmm2-tag-key">useEffect</span>
        <span class="rcmm2-tag rcmm2-tag-key">dependency array</span>
        <span class="rcmm2-tag rcmm2-tag-key">cleanup</span>
        <span class="rcmm2-tag">AbortController</span>
        <span class="rcmm2-tag rcmm2-tag-adv">useLayoutEffect</span>
        <span class="rcmm2-tag rcmm2-tag-adv">stale closure</span>
      </div>
    </div>
    <div class="rcmm2-row">
      <div class="rcmm2-cat" style="color:#a78bfa">REFS</div>
      <div class="rcmm2-tags">
        <span class="rcmm2-tag rcmm2-tag-key">useRef</span>
        <span class="rcmm2-tag">DOM access</span>
        <span class="rcmm2-tag">valor mutável sem re-render</span>
        <span class="rcmm2-tag rcmm2-tag-adv">forwardRef</span>
        <span class="rcmm2-tag rcmm2-tag-adv">useImperativeHandle</span>
      </div>
    </div>
    <div class="rcmm2-row">
      <div class="rcmm2-cat" style="color:#38bdf8">DADO GLOBAL</div>
      <div class="rcmm2-tags">
        <span class="rcmm2-tag rcmm2-tag-key">Context API</span>
        <span class="rcmm2-tag rcmm2-tag-key">createContext</span>
        <span class="rcmm2-tag rcmm2-tag-key">useContext</span>
        <span class="rcmm2-tag">Provider pattern</span>
        <span class="rcmm2-tag rcmm2-tag-adv">Zustand</span>
        <span class="rcmm2-tag rcmm2-tag-adv">Jotai / Redux</span>
      </div>
    </div>
    <div class="rcmm2-row">
      <div class="rcmm2-cat" style="color:#f97316">PERFORMANCE</div>
      <div class="rcmm2-tags">
        <span class="rcmm2-tag rcmm2-tag-key">React.memo</span>
        <span class="rcmm2-tag rcmm2-tag-key">useMemo</span>
        <span class="rcmm2-tag rcmm2-tag-key">useCallback</span>
        <span class="rcmm2-tag rcmm2-tag-key">DevTools Profiler</span>
        <span class="rcmm2-tag rcmm2-tag-adv">virtualização de lista</span>
        <span class="rcmm2-tag rcmm2-tag-adv">bailout</span>
      </div>
    </div>
    <div class="rcmm2-row">
      <div class="rcmm2-cat" style="color:#e2e8f0">PATTERNS</div>
      <div class="rcmm2-tags">
        <span class="rcmm2-tag rcmm2-tag-key">Custom Hooks</span>
        <span class="rcmm2-tag">composição (children)</span>
        <span class="rcmm2-tag">render props</span>
        <span class="rcmm2-tag rcmm2-tag-adv">compound components</span>
        <span class="rcmm2-tag rcmm2-tag-adv">Error Boundary</span>
        <span class="rcmm2-tag rcmm2-tag-adv">HOC</span>
      </div>
    </div>
    <div class="rcmm2-row">
      <div class="rcmm2-cat" style="color:#c084fc">CONCURRENT</div>
      <div class="rcmm2-tags">
        <span class="rcmm2-tag rcmm2-tag-key">createRoot</span>
        <span class="rcmm2-tag rcmm2-tag-key">Suspense</span>
        <span class="rcmm2-tag rcmm2-tag-adv">useTransition</span>
        <span class="rcmm2-tag rcmm2-tag-adv">useDeferredValue</span>
        <span class="rcmm2-tag rcmm2-tag-adv">automatic batching</span>
        <span class="rcmm2-tag rcmm2-tag-adv">Fiber scheduler</span>
      </div>
    </div>
    <div class="rcmm2-row">
      <div class="rcmm2-cat" style="color:#fb923c">ARQUITETURA</div>
      <div class="rcmm2-tags">
        <span class="rcmm2-tag rcmm2-tag-key">Server Components (RSC)</span>
        <span class="rcmm2-tag rcmm2-tag-key">Code Splitting (lazy)</span>
        <span class="rcmm2-tag rcmm2-tag-adv">Server Actions</span>
        <span class="rcmm2-tag rcmm2-tag-adv">Streaming SSR</span>
        <span class="rcmm2-tag rcmm2-tag-adv">Testing Library</span>
      </div>
    </div>
  </div>
</div>`,
      caption: "Use este mapa para revisão rápida: antes de uma entrevista, varra cada categoria e verifique o que você consegue explicar em voz alta sem consultar nada.",
    },
    exercises: [
      {
        level: 'iniciante',
        title: "TodoList — useState, imutabilidade e keys corretas",
        description: "Construa uma lista de tarefas completa: campo de texto para adicionar, botão para marcar como feita (texto riscado), botão para remover. Estado: array de objetos { id, texto, feita }. Nunca mute o array diretamente — crie novos arrays com spread ou filter. Use ids gerados (Date.now() ou crypto.randomUUID()) como key, não o index.",
        concepts: ["useState", "imutabilidade", "key", "renderização condicional", "event handlers"],
        hint: "Adicionar: setTasks([...tasks, { id: Date.now(), texto, feita: false }]). Remover: setTasks(tasks.filter(t => t.id !== id)). Marcar: setTasks(tasks.map(t => t.id === id ? { ...t, feita: !t.feita } : t)).",
        relatedKeypoints: [3, 4, 1],
      },
      {
        level: 'intermediario',
        title: "useLocalStorage — custom hook com sincronização entre abas",
        description: "Implemente useLocalStorage<T>(key, defaultValue) que se comporta como useState mas persiste no localStorage. Deve: ler o valor inicial do localStorage (JSON.parse com fallback), salvar automaticamente a cada mudança (useEffect), e sincronizar entre abas abertas no mesmo browser (evento 'storage' no window). Retorne [value, setValue] com a mesma API do useState.",
        concepts: ["custom hooks", "useEffect", "localStorage", "evento storage", "generics TypeScript", "cleanup"],
        hint: "window.addEventListener('storage', handler) no useEffect com cleanup (removeEventListener). O StorageEvent tem .key e .newValue — só atualize o state se o event.key bater com o key do hook. JSON.parse(null) retorna null — verifique antes de parsear.",
        relatedKeypoints: [10, 5],
      },
      {
        level: 'senior',
        title: "Otimizar lista de 10.000 itens — profiling antes e depois",
        description: "Dado um componente <ItemList> com 10.000 itens, busca controlada e toggle de ativo: (1) Abra o React DevTools Profiler e grave uma interação de busca — identifique quais componentes re-renderizam desnecessariamente e por quê. (2) Aplique React.memo, useMemo e useCallback onde fizer sentido real. (3) Confirme no Profiler que o número de re-renders diminuiu. (4) Para cada otimização aplicada, documente o motivo — memoização sem justificativa é pior que nada.",
        concepts: ["React.memo", "useMemo", "useCallback", "React DevTools Profiler", "re-renders", "referências estáveis"],
        hint: "Problemas típicos nessa ordem: (1) função de filter/sort recriada a cada render → useMemo. (2) callback onToggle recriado → useCallback. (3) filho sem React.memo re-renderiza mesmo com props iguais. Mas atenção: adicionar React.memo sem useCallback no pai não resolve nada — a referência de função ainda muda a cada render.",
        relatedKeypoints: [9, 4],
      },
    ],
    codeExamples: [
      {
        title: "Compound Components — padrão Tabs com Context interno",
        description: "Estado compartilhado escondido no Context. API declarativa para quem usa — sem props drilling entre Tab e TabPanel.",
        code: `const TabsCtx = createContext<{ active: string; set: (v: string) => void } | null>(null)

function Tabs({ defaultValue, children }: { defaultValue: string; children: React.ReactNode }) {
  const [active, set] = useState(defaultValue)
  return <TabsCtx.Provider value={{ active, set }}><div>{children}</div></TabsCtx.Provider>
}

function Tab({ value, children }: { value: string; children: React.ReactNode }) {
  const ctx = useContext(TabsCtx)!
  return (
    <button
      onClick={() => ctx.set(value)}
      style={{ fontWeight: ctx.active === value ? 700 : 400, borderBottom: ctx.active === value ? '2px solid #ef4444' : 'none' }}
    >{children}</button>
  )
}

function TabPanel({ value, children }: { value: string; children: React.ReactNode }) {
  const { active } = useContext(TabsCtx)!
  return active === value ? <div>{children}</div> : null
}

// uso — API limpa, estado interno invisível para quem usa
<Tabs defaultValue="react">
  <Tab value="react">React</Tab>
  <Tab value="vue">Vue</Tab>
  <TabPanel value="react">Conteúdo React</TabPanel>
  <TabPanel value="vue">Conteúdo Vue</TabPanel>
</Tabs>`,
      },
      {
        title: "useFetch — prevenção de race condition com AbortController",
        description: "Fetch genérico que cancela a requisição anterior quando url muda. Evita atualizar state de um componente desmontado.",
        code: `function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)

    fetch(url, { signal: controller.signal })
      .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json() })
      .then(setData)
      .catch(err => { if (err.name !== 'AbortError') setError(err) })
      .finally(() => setLoading(false))

    return () => controller.abort()  // cancela se url mudar antes de resolver
  }, [url])

  return { data, loading, error }
}

// uso — sem boilerplate de fetch em cada componente
function UserProfile({ id }: { id: string }) {
  const { data, loading, error } = useFetch<User>(\`/api/users/\${id}\`)
  if (loading) return <Spinner />
  if (error)   return <p>{error.message}</p>
  return <div>{data?.name}</div>
}`,
      },
      {
        title: "Optimistic Update — UI instantânea com rollback em erro",
        description: "Atualiza a UI antes da API responder. Se a API falhar, reverte. Resultado: app parece instantâneo para o usuário.",
        code: `function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])

  async function toggleTodo(id: string, done: boolean) {
    // 1. atualiza UI imediatamente (otimista)
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done } : t))

    try {
      await api.updateTodo(id, { done })
    } catch {
      // 2. reverte se a API falhar
      setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !done } : t))
    }
  }

  return (
    <ul>
      {todos.map(t => (
        <li key={t.id} onClick={() => toggleTodo(t.id, !t.done)}>
          <span style={{ textDecoration: t.done ? 'line-through' : 'none' }}>{t.text}</span>
        </li>
      ))}
    </ul>
  )
}`,
      },
      {
        title: "useReducer com Discriminated Union — máquina de estados tipada",
        description: "Estado modelado como union de fases exclusivas. TypeScript garante que você só acessa data quando status é 'success' — impossível acessar data em estado de erro.",
        code: `type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: User }
  | { status: 'error'; message: string }

type Action =
  | { type: 'FETCH' }
  | { type: 'SUCCESS'; payload: User }
  | { type: 'ERROR'; payload: string }
  | { type: 'RESET' }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH':   return { status: 'loading' }
    case 'SUCCESS': return { status: 'success', data: action.payload }
    case 'ERROR':   return { status: 'error', message: action.payload }
    case 'RESET':   return { status: 'idle' }
  }
}

function UserLoader({ id }: { id: string }) {
  const [state, dispatch] = useReducer(reducer, { status: 'idle' })

  useEffect(() => {
    dispatch({ type: 'FETCH' })
    fetchUser(id)
      .then(u => dispatch({ type: 'SUCCESS', payload: u }))
      .catch(e => dispatch({ type: 'ERROR', payload: e.message }))
  }, [id])

  if (state.status === 'loading') return <Spinner />
  if (state.status === 'error')   return <p>{state.message}</p>
  if (state.status === 'success') return <UserCard user={state.data} />
  return <button onClick={() => dispatch({ type: 'FETCH' })}>Carregar</button>
}`,
      },
    ],
    mnemonics: [
      {
        label: "Regras dos Hooks — TOP and ONLY",
        trick: "TOP · ONLY",
        explanation: "Hooks devem ser chamados no TOPO da função (nunca em condicionais, loops ou funções aninhadas) e ONLY de componentes React ou custom hooks. Motivo: React rastreia hooks pela ordem de chamada — um array interno onde hook[0] é o primeiro useState, hook[1] o segundo, etc. Uma condicional que pule um hook desloca todos os índices seguintes, causando bugs impossíveis de diagnosticar.",
      },
      {
        label: "Quando ocorre re-render — SPCK",
        trick: "State · Props · Context · Key",
        explanation: "Um componente re-renderiza quando: State muda (setState chamado), Props mudam (pai re-renderizou ou passou nova referência), Context muda (Provider value mudou), Key muda (desmonta e remonta o componente inteiro). Explica por que imutabilidade importa: spread cria nova referência (re-render), mutação direta mantém a mesma referência (sem re-render).",
      },
      {
        label: "useMemo vs useCallback — VALUE vs FUNCTION",
        trick: "useMemo → valor · useCallback → função",
        explanation: "useMemo(fn, deps) executa fn e guarda o resultado (valor). useCallback(fn, deps) guarda a própria fn (referência estável). Truque: useCallback(fn) é idêntico a useMemo(() => fn). Ambos só valem quando o resultado é prop de filho React.memo ou dependência de outro hook. Memoize apenas com evidência no Profiler.",
      },
      {
        label: "useEffect vs useLayoutEffect — Timeline do Paint",
        trick: "DOM muda → Layout → browser pinta → Effect",
        explanation: "useLayoutEffect dispara ANTES do browser pintar (síncrono, bloqueia o paint). useEffect dispara DEPOIS do paint (assíncrono). Regra: se você precisa ler ou corrigir layout DOM sem o usuário ver o estado intermediário (tooltip, posicionamento, medição de scroll), use useLayoutEffect. Para fetch, subscriptions e analytics, sempre use useEffect.",
      },
      {
        label: "Dependency Array — 'O que este effect LÊ?'",
        trick: "Inclua tudo que o effect lê do escopo do componente",
        explanation: "O array de dependências não é um gatilho — é um contrato. Regra: todo valor reativo que o effect lê (state, prop, contexto, variável derivada) deve estar no array. Se omitir, a closure captura o valor antigo (stale closure). Se você quer [] mas o effect usa variáveis do componente, provavelmente é um bug de stale closure disfarçado de 'executar só uma vez'. Confie no linter exhaustive-deps.",
      },
    ],
  },

  "typescript": {
    tagline: "JavaScript com tipos estáticos — padrão atual de qualquer codebase profissional.",
    why: "TypeScript é pré-requisito em praticamente toda vaga frontend e backend sênior. Além de evitar bugs em tempo de desenvolvimento, serve como documentação viva do código. Saber usar generics, utility types, narrowing e os recursos avançados do sistema de tipos diferencia sênior de pleno em entrevistas técnicas. O ecossistema inteiro (React, Next.js, NestJS, Prisma, tRPC, Zod) assume TypeScript como padrão.",
    prerequisite: "JavaScript ES6+ (arrow functions, destructuring, spread, promises, async/await, módulos). Entender closures, prototype chain e o event loop ajuda muito a entender onde os tipos têm valor.",
    summary: "TypeScript adiciona tipos estáticos opcionais ao JavaScript, compilando para JS puro. O sistema de tipos é estrutural (duck typing), não nominal — se dois objetos têm a mesma forma, são compatíveis. Tipos são apagados em runtime; TypeScript só existe em tempo de desenvolvimento. O compilador tem inferência sofisticada que elimina a necessidade de anotar tudo manualmente — bons projetos TypeScript têm menos anotações explícitas do que os iniciantes esperariam. A partir do TS 4.x, recursos como template literal types, satisfies operator, const assertions e variadic tuple types ampliam o que é possível expressar no sistema de tipos. O modo strict ativa strictNullChecks (null e undefined são tipos distintos), noImplicitAny, strictFunctionTypes e outros — em projetos novos, sempre ative strict: true no tsconfig.",
    howToStudy: "<strong>Modelo mental central:</strong> TypeScript é uma <em>linguagem de conjuntos</em> — tipos são conjuntos de valores. string é o conjunto de todas as strings. 'ok' é o conjunto com apenas um elemento. Union (A|B) é a união dos conjuntos. Intersection (A&B) é a interseção. never é o conjunto vazio. unknown é o conjunto de todos os valores.<br><br><strong>Sequência recomendada:</strong><ol><li>Domine os 5 pilares: narrowing, generics, utility types, conditional types, mapped types.</li><li>Leia o TypeScript Handbook completo — não é longo e cobre tudo que importa.</li><li>Pratique em Type Challenges (easy → medium). Cada exercício força você a pensar em tipos como transformações.</li><li>Configure strict: true num projeto real e corrija todos os erros — é o melhor aprendizado.</li></ol>",
    diagrams: [
      {
        title: "Sistema de tipos TypeScript — hierarquia, narrowing e fluxo de inferência",
        html: `<style>
.ts-diag{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.ts-box{border-radius:8px;padding:10px 16px;font-size:11px;text-align:center;border:1.5px solid}
.ts-top{background:#1e3a5c;border-color:#3178C6;color:#93c5fd;font-weight:700}
.ts-mid{background:#1e293b;border-color:#334155;color:#94a3b8}
.ts-bot{background:#0f172a;border-color:#1e293b;color:#475569}
.ts-arrow{color:#3178C6;text-align:center;font-size:16px;line-height:1}
.ts-label{font-size:9px;color:#3178C6;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px}
.ts-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(49,120,198,.5);display:inline}
.ts-tip:hover .ts-tb{display:block}
.ts-tb{display:none;position:absolute;bottom:calc(100%+8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:220px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.ts-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
@keyframes ts-narrow{0%,100%{background:#1e3a5c;border-color:#3178C6}50%{background:#1e4a2a;border-color:#4ade80}}
.ts-narrow-anim{animation:ts-narrow 2.5s ease-in-out infinite;border-radius:6px;padding:6px 12px;font-size:11px;border:1.5px solid;display:inline-block;margin-top:4px}
</style>
<div class="ts-diag">
  <p style="color:#93c5fd;font-size:12px;font-weight:700;margin:0 0 4px">Hierarquia de tipos TypeScript</p>
  <p style="color:#475569;font-size:10px;margin:0 0 18px">Passe o mouse nos termos <span style="border-bottom:1px dashed rgba(49,120,198,.5)">sublinhados</span></p>
  <div style="display:flex;flex-direction:column;gap:8px;max-width:520px;margin:0 auto">
    <div class="ts-label">Topo — supertipo de tudo</div>
    <div style="display:flex;gap:8px">
      <div class="ts-box ts-top" style="flex:1"><span class="ts-tip">unknown<span class="ts-tb">Supertipo de todos os tipos. Você não pode operar sem narrowing. Versão segura de any — force quem usa a verificar antes. Use em catch clauses, JSON.parse, APIs externas.</span></span></div>
      <div class="ts-box ts-top" style="flex:1"><span class="ts-tip">any<span class="ts-tb">Opt-out do sistema de tipos. Silencia todos os erros. Use com extrema moderação — basicamente você sai do TypeScript e volta para JS puro.</span></span></div>
    </div>
    <div class="ts-arrow">↓ assignable to</div>
    <div class="ts-label">Primitivos e objetos</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <div class="ts-box ts-mid" style="flex:1 0 80px">string</div>
      <div class="ts-box ts-mid" style="flex:1 0 80px">number</div>
      <div class="ts-box ts-mid" style="flex:1 0 80px">boolean</div>
      <div class="ts-box ts-mid" style="flex:1 0 80px">object</div>
      <div class="ts-box ts-mid" style="flex:1 0 80px">symbol</div>
      <div class="ts-box ts-mid" style="flex:1 0 80px">bigint</div>
    </div>
    <div class="ts-arrow">↓ assignable to</div>
    <div class="ts-label">Tipos literais (valores específicos)</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <div class="ts-box ts-mid" style="flex:1 0 80px">'ok' | 'error'</div>
      <div class="ts-box ts-mid" style="flex:1 0 80px">1 | 2 | 3</div>
      <div class="ts-box ts-mid" style="flex:1 0 80px">true</div>
    </div>
    <div class="ts-arrow">↓ assignable to</div>
    <div class="ts-label">Fundo — subtipo de tudo</div>
    <div style="display:flex;gap:8px">
      <div class="ts-box ts-bot" style="flex:1"><span class="ts-tip">never<span class="ts-tb">Tipo vazio — nenhum valor pode ser never. Representa código inalcançável. Útil para exaustividade em switch: se chegou aqui é bug. Aparece em conditional types quando a condição nunca é satisfeita.</span></span></div>
      <div class="ts-box ts-bot" style="flex:1"><span class="ts-tip">null / undefined<span class="ts-tb">Com strictNullChecks: tipos distintos, não atribuíveis a outros. Sem strict: se comportam como any em atribuição — ative sempre strict: true.</span></span></div>
    </div>
    <div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px 16px;margin-top:8px">
      <div style="font-size:9px;color:#3178C6;text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px">Narrowing — o compilador afina o tipo em branches</div>
      <div style="font-size:11px;color:#64748b;line-height:2">
        <span style="color:#7c3aed">function</span> f(x: <span style="color:#93c5fd">string | number</span>) {<br>
        &nbsp;&nbsp;<span style="color:#7c3aed">if</span> (<span style="color:#7c3aed">typeof</span> x === <span style="color:#4ade80">'string'</span>) {<br>
        &nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#475569">// x é </span><span class="ts-narrow-anim" style="color:#4ade80">string</span><span style="color:#475569"> aqui</span><br>
        &nbsp;&nbsp;}<br>
        &nbsp;&nbsp;<span style="color:#475569">// x é </span><span class="ts-narrow-anim" style="color:#93c5fd;animation-delay:.8s">number</span><span style="color:#475569"> aqui</span><br>
        }
      </div>
    </div>
    <div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:10px 14px;margin-top:4px;font-size:11px;color:#94a3b8;line-height:1.7">
      <strong style="color:#3178C6">Regra de ouro:</strong> TypeScript é <span class="ts-tip">estrutural<span class="ts-tb">Forma importa, nome não. { x: number } satisfaz Point mesmo sem herança explícita. Diferente de Java/C# que são nominais — nome da classe importa.</span></span>, não nominal. Tipos são apagados em runtime — só existem no compilador.
    </div>
  </div>
</div>`,
        caption: "unknown força narrowing; any desliga o compilador. never = conjunto vazio = código inalcançável. Estrutural = forma importa, nome não. Tipos só existem em compile-time.",
      },
      {
        title: "Utility Types — transformações do sistema de tipos",
        html: `<style>
.tsu-diag{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.tsu-card{background:#1e293b;border:1.5px solid #334155;border-radius:8px;padding:10px 14px;font-size:10.5px}
.tsu-name{color:#3178C6;font-weight:700;font-size:12px;margin-bottom:6px}
.tsu-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(49,120,198,.4);display:inline}
.tsu-tip:hover .tsu-tb{display:block}
.tsu-tb{display:none;position:absolute;bottom:calc(100%+6px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:8px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:220px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.tsu-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:4px solid transparent;border-top-color:#334155}
</style>
<div class="tsu-diag">
  <p style="color:#93c5fd;font-size:12px;font-weight:700;margin:0 0 4px">Utility Types — os mais cobrados em entrevista</p>
  <p style="color:#475569;font-size:10px;margin:0 0 16px">Passe o mouse nos termos <span style="border-bottom:1px dashed rgba(49,120,198,.4)">sublinhados</span></p>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
    <div class="tsu-card">
      <div class="tsu-name">Partial&lt;T&gt;</div>
      <div style="color:#94a3b8;line-height:1.7">Torna todos os campos <span class="tsu-tip">opcionais<span class="tsu-tb">Útil para parâmetros de update: não precisa enviar todos os campos no PATCH.</span></span>.<br><code style="color:#4ade80">type Update = Partial&lt;User&gt;</code><br><code style="color:#475569">// { name?: string; age?: number }</code></div>
    </div>
    <div class="tsu-card">
      <div class="tsu-name">Required&lt;T&gt;</div>
      <div style="color:#94a3b8;line-height:1.7">Torna todos os campos <span class="tsu-tip">obrigatórios<span class="tsu-tb">Inverso de Partial. Útil após transformar um tipo com muitos opcionais.</span></span>.<br><code style="color:#4ade80">type Full = Required&lt;Config&gt;</code><br><code style="color:#475569">// todos os ? removidos</code></div>
    </div>
    <div class="tsu-card">
      <div class="tsu-name">Pick&lt;T, K&gt;</div>
      <div style="color:#94a3b8;line-height:1.7">Seleciona um <span class="tsu-tip">subconjunto<span class="tsu-tb">K é um union de chaves de T. Útil para DTOs e props de componente.</span></span> de campos.<br><code style="color:#4ade80">type Preview = Pick&lt;Post, 'id'|'title'&gt;</code></div>
    </div>
    <div class="tsu-card">
      <div class="tsu-name">Omit&lt;T, K&gt;</div>
      <div style="color:#94a3b8;line-height:1.7">Remove campos <span class="tsu-tip">específicos<span class="tsu-tb">Inverso de Pick. Útil para remover id ao criar (POST sem id gerado pelo banco).</span></span> do tipo.<br><code style="color:#4ade80">type Create = Omit&lt;User, 'id'|'createdAt'&gt;</code></div>
    </div>
    <div class="tsu-card">
      <div class="tsu-name">Record&lt;K, V&gt;</div>
      <div style="color:#94a3b8;line-height:1.7">Cria <span class="tsu-tip">mapa tipado<span class="tsu-tb">K é o tipo das chaves, V dos valores. Mais seguro que { [key: string]: V }.</span></span> de K para V.<br><code style="color:#4ade80">type Labels = Record&lt;'ok'|'err', string&gt;</code></div>
    </div>
    <div class="tsu-card">
      <div class="tsu-name">ReturnType&lt;F&gt;</div>
      <div style="color:#94a3b8;line-height:1.7">Extrai o tipo de <span class="tsu-tip">retorno<span class="tsu-tb">Útil para tipar variáveis sem duplicar o tipo de retorno da função.</span></span> de uma função.<br><code style="color:#4ade80">type R = ReturnType&lt;typeof getUser&gt;</code><br><code style="color:#475569">// User | null</code></div>
    </div>
    <div class="tsu-card">
      <div class="tsu-name">Awaited&lt;T&gt;</div>
      <div style="color:#94a3b8;line-height:1.7">Extrai o tipo de dentro de uma <span class="tsu-tip">Promise<span class="tsu-tb">Awaited&lt;Promise&lt;User&gt;&gt; = User. Recursivo: Awaited&lt;Promise&lt;Promise&lt;string&gt;&gt;&gt; = string.</span></span>.<br><code style="color:#4ade80">type U = Awaited&lt;Promise&lt;User&gt;&gt;</code><br><code style="color:#475569">// User</code></div>
    </div>
    <div class="tsu-card">
      <div class="tsu-name">NonNullable&lt;T&gt;</div>
      <div style="color:#94a3b8;line-height:1.7">Remove <span class="tsu-tip">null e undefined<span class="tsu-tb">NonNullable&lt;string | null | undefined&gt; = string. Útil após validações.</span></span> do tipo.<br><code style="color:#4ade80">type S = NonNullable&lt;string | null&gt;</code><br><code style="color:#475569">// string</code></div>
    </div>
  </div>
</div>`,
        caption: "Utility types são transformações do sistema de tipos. Partial+Pick+Omit cobrem 80% dos casos de CRUD tipado. Memorize os 8 acima — todos caem em entrevista.",
      },
    ],
    keypoints: [
      {
        title: "Structural typing — forma importa, nome não",
        body: "TypeScript usa tipagem estrutural: se um objeto tem as propriedades necessárias, ele é do tipo — independente de qual classe ou função o criou. Diferente de Java/C# (nominal). Isso permite flexibilidade mas pode surpreender: dois tipos incompatíveis por nome podem ser atribuíveis entre si se a estrutura for compatível.",
        code: `interface Point { x: number; y: number }
// p tem mais propriedades mas é compatível com Point:
const p = { x: 1, y: 2, z: 3 }
const q: Point = p // ✓ ok — estrutura compatível

// Mas literais de objeto têm excess property checking:
const r: Point = { x: 1, y: 2, z: 3 } // ✗ erro direto no literal`,
      },
      {
        title: "Discriminated union — estado exclusivo tipado",
        body: "Union com um campo discriminador literal é o padrão mais poderoso para modelar estados que não podem coexistir. O compilador sabe exatamente quais campos existem em cada branch. Preferido para modelar respostas de API, estados de máquina, mensagens.",
        code: `type ApiResult<T> =
  | { status: 'ok';      data: T }
  | { status: 'error';   message: string }
  | { status: 'loading' }

function handle<T>(r: ApiResult<T>) {
  switch (r.status) {
    case 'ok':      return r.data     // T — TypeScript sabe
    case 'error':   return r.message  // string
    case 'loading': return null
    // TypeScript avisa se você esquecer um case
  }
}`,
      },
      {
        title: "Generics — reutilizar lógica com type safety",
        body: "Funções e tipos parametrizados por tipo. Permite reusar lógica mantendo type safety. Constraints (T extends X) limitam o que T pode ser. Inferência automática evita anotação na maioria dos casos — TypeScript infere T pelo argumento passado.",
        code: `// Inferência automática — T = number, não precisa anotar
function first<T>(arr: T[]): T | undefined { return arr[0] }
const n = first([1, 2, 3]) // n: number | undefined

// Constraint: T deve ter a propriedade id
function byId<T extends { id: string }>(items: T[], id: string) {
  return items.find(item => item.id === id)
}

// Generic com múltiplos parâmetros:
function merge<A, B>(a: A, b: B): A & B {
  return { ...a, ...b } as A & B
}`,
      },
      {
        title: "Type narrowing — afunilando unions com segurança",
        body: "TypeScript afina o tipo dentro de branches condicionais. Formas disponíveis: typeof (primitivos), instanceof (classes), in (propriedades de objeto), type predicates (x is Type para narrowing customizado), asserts (lança se condição falsa), discriminated union (campo literal).",
        code: `// typeof — primitivos
function fmt(val: string | number) {
  if (typeof val === 'string') return val.toUpperCase() // string
  return val.toFixed(2)  // number
}

// in — presença de propriedade
function area(shape: Circle | Square) {
  if ('radius' in shape) return Math.PI * shape.radius ** 2
  return shape.side ** 2
}

// Type predicate — narrowing customizado
function isUser(x: unknown): x is User {
  return typeof x === 'object' && x !== null && 'id' in x
}`,
      },
      {
        title: "Utility types na prática — transformando tipos existentes",
        body: "Os utility types built-in são transformações do sistema de tipos. Na prática: Partial para updates, Pick/Omit para DTOs, Record para mapas, ReturnType/Parameters para tipar em função de funções existentes, Awaited para extrair tipos de Promises.",
        code: `type User = { id: string; name: string; email: string; role: 'admin'|'user' }

// CRUD tipado com uma fonte de verdade:
type CreateUser = Omit<User, 'id'>                          // POST — sem id
type UpdateUser = Partial<Pick<User, 'name' | 'email'>>    // PATCH — opcionais
type UserPreview = Pick<User, 'id' | 'name'>               // GET list — campos mínimos

// Tipar em função de funções existentes:
async function getUser(id: string): Promise<User | null> { /* ... */ return null }
type GetUserReturn = Awaited<ReturnType<typeof getUser>>   // User | null`,
      },
      {
        title: "Template literal types — strings no sistema de tipos",
        body: "Manipula strings no nível de tipo. Permite derivar tipos de strings: eventos a partir de nomes de campo, rotas, chaves de CSS. Intrinsic string manipulation types: Uppercase, Lowercase, Capitalize, Uncapitalize. Usado em tRPC, Prisma e bibliotecas que fazem inferência de API.",
        code: `type Field = 'name' | 'email' | 'age'
type Getter = \`get\${Capitalize<Field>}\`
// 'getName' | 'getEmail' | 'getAge'

// EventMap derivado de nomes de campo:
type EventName<T extends string> = \`on\${Capitalize<T>}\`
type ButtonEvents = EventName<'click' | 'focus'>
// 'onClick' | 'onFocus'

// Extração de parâmetros de rota:
type Route = '/users/:id/posts/:postId'
type RouteParams<T extends string> =
  T extends \`\${string}:\${infer P}/\${infer Rest}\`
    ? P | RouteParams<\`/\${Rest}\`>
    : T extends \`\${string}:\${infer P}\` ? P : never
// RouteParams<Route> = 'id' | 'postId'`,
      },
      {
        title: "Conditional types e infer — tipos que dependem de condições",
        body: "Tipos que dependem de condições: T extends U ? X : Y. Com infer, extrai partes do tipo em tempo de compilação. São a base dos utility types built-in como ReturnType, Parameters, Awaited e InstanceType. Distribuição automática sobre unions quando T é genérico.",
        code: `// infer — extraindo partes do tipo
type ReturnType<F> = F extends (...args: any[]) => infer R ? R : never
type Unwrap<T>     = T extends Promise<infer U> ? U : T
type ArrayItem<T>  = T extends Array<infer U> ? U : T

type A = Unwrap<Promise<string>>  // string
type B = Unwrap<number>           // number (não é Promise)

// Distribuição automática sobre unions:
type IsString<T> = T extends string ? true : false
type R = IsString<string | number>  // true | false (distribui)`,
      },
      {
        title: "Mapped types — transformando todos os campos de um tipo",
        body: "Mapped types iteram sobre chaves de um tipo e transformam cada uma. São a implementação de Partial, Required, Readonly e Record. Com 'as' pode remapear chaves. Com + e - modifica modificadores (opcional, readonly).",
        code: `// Readonly manual (o que Readonly<T> faz):
type MyReadonly<T> = { readonly [K in keyof T]: T[K] }

// Remapeamento de chaves com 'as':
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K]
}
// Getters<{ name: string }> = { getName: () => string }

// Remover ? (Required manual):
type MyRequired<T> = { [K in keyof T]-?: T[K] }`,
      },
      {
        title: "Satisfies operator — validar sem perder literais",
        body: "O operador satisfies (TS 4.9) valida que um valor é compatível com um tipo sem alterar o tipo inferido para o declarado. Preserva literais e tipos específicos enquanto garante conformidade com a interface.",
        code: `type Config = { theme: 'dark' | 'light'; size: number }

// Com anotação: tema fica 'dark' | 'light' — perde o literal
const cfg1: Config = { theme: 'dark', size: 16 }
cfg1.theme  // 'dark' | 'light'

// Com satisfies: tema fica 'dark' — mantém o literal
const cfg2 = { theme: 'dark', size: 16 } satisfies Config
cfg2.theme  // 'dark' (literal preservado + validação de Config)`,
      },
      {
        title: "interface vs type — quando usar cada um",
        body: "A diferença prática: interfaces suportam declaration merging (declarar duas vezes o mesmo nome faz merge dos campos — útil para augmentar tipos de libs de terceiros). Types são mais expressivos: suportam union, intersection, conditional, template literal, mapped types. Convenção moderna: type para quase tudo; interface para contratos de objetos públicos que outros precisam estender.",
        code: `// Declaration merging (só interface) — augmentar lib de terceiros:
declare module 'express' {
  interface Request { userId: string } // adiciona campo ao Request do Express
}

// Type é mais expressivo — union, conditional, template literal:
type Shape = Circle | Square | Triangle // union — não dá em interface
type EventName = \`on\${string}\`          // template literal — não dá em interface`,
      },
    ],
    cheatsheet: {
      title: "TypeScript — Utility Types e Recursos Essenciais",
      html: `<style>
.tsc-wrap{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.tsc-section{margin-bottom:18px}
.tsc-title{font-size:9px;color:#3178C6;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:10px;padding-bottom:4px;border-bottom:1px solid #1e293b}
.tsc-table{width:100%;border-collapse:collapse;font-size:10.5px}
.tsc-table th{color:#475569;font-weight:500;text-align:left;padding:4px 8px;border-bottom:1px solid #1e293b}
.tsc-table td{padding:5px 8px;border-bottom:1px solid #0f172a;vertical-align:top}
.tsc-table tr:hover td{background:#1e293b}
.tsc-name{color:#93c5fd}
.tsc-code{color:#4ade80;font-size:10px}
.tsc-note{color:#475569;font-size:10px}
</style>
<div class="tsc-wrap">
  <p style="color:#93c5fd;font-size:12px;font-weight:700;margin:0 0 18px">TypeScript — Referência Rápida</p>
  <div class="tsc-section">
    <div class="tsc-title">Utility Types essenciais</div>
    <table class="tsc-table">
      <tr><th>Tipo</th><th>O que faz</th><th>Caso de uso</th></tr>
      <tr><td class="tsc-name">Partial&lt;T&gt;</td><td style="color:#94a3b8">Todos os campos opcionais</td><td class="tsc-note">Parâmetro de update (PATCH)</td></tr>
      <tr><td class="tsc-name">Required&lt;T&gt;</td><td style="color:#94a3b8">Todos obrigatórios</td><td class="tsc-note">Após aplicar Partial</td></tr>
      <tr><td class="tsc-name">Readonly&lt;T&gt;</td><td style="color:#94a3b8">Todos readonly</td><td class="tsc-note">Imutabilidade em runtime</td></tr>
      <tr><td class="tsc-name">Pick&lt;T, K&gt;</td><td style="color:#94a3b8">Seleciona campos</td><td class="tsc-note">DTOs, preview objects</td></tr>
      <tr><td class="tsc-name">Omit&lt;T, K&gt;</td><td style="color:#94a3b8">Remove campos</td><td class="tsc-note">Criar sem id (POST)</td></tr>
      <tr><td class="tsc-name">Record&lt;K, V&gt;</td><td style="color:#94a3b8">Mapa K → V</td><td class="tsc-note">Lookup tables, configs</td></tr>
      <tr><td class="tsc-name">Exclude&lt;T, U&gt;</td><td style="color:#94a3b8">Remove membros da union</td><td class="tsc-note">Filtrar valores de union</td></tr>
      <tr><td class="tsc-name">Extract&lt;T, U&gt;</td><td style="color:#94a3b8">Mantém membros da union</td><td class="tsc-note">Filtrar tipos específicos</td></tr>
      <tr><td class="tsc-name">ReturnType&lt;F&gt;</td><td style="color:#94a3b8">Tipo de retorno da função</td><td class="tsc-note">Tipar sem duplicar</td></tr>
      <tr><td class="tsc-name">Parameters&lt;F&gt;</td><td style="color:#94a3b8">Tuple de parâmetros</td><td class="tsc-note">Wrappers de função</td></tr>
      <tr><td class="tsc-name">Awaited&lt;T&gt;</td><td style="color:#94a3b8">Desembrulha Promise</td><td class="tsc-note">Tipo de resposta async</td></tr>
      <tr><td class="tsc-name">NonNullable&lt;T&gt;</td><td style="color:#94a3b8">Remove null/undefined</td><td class="tsc-note">Após validação</td></tr>
    </table>
  </div>
  <div class="tsc-section">
    <div class="tsc-title">Narrowing — formas disponíveis</div>
    <table class="tsc-table">
      <tr><th>Técnica</th><th>Uso</th></tr>
      <tr><td class="tsc-name">typeof x === 'string'</td><td style="color:#94a3b8">Primitivos: string, number, boolean, symbol, bigint, function, undefined</td></tr>
      <tr><td class="tsc-name">x instanceof Classe</td><td style="color:#94a3b8">Instâncias de classe / construtores</td></tr>
      <tr><td class="tsc-name">'prop' in x</td><td style="color:#94a3b8">Presença de propriedade no objeto</td></tr>
      <tr><td class="tsc-name">x is Type (predicate)</td><td style="color:#94a3b8">Narrowing customizado em função</td></tr>
      <tr><td class="tsc-name">asserts x is Type</td><td style="color:#94a3b8">Lança se condição falsa — testes, validações</td></tr>
      <tr><td class="tsc-name">discriminated union</td><td style="color:#94a3b8">Campo literal que distingue membros (status, type, kind)</td></tr>
    </table>
  </div>
  <div class="tsc-section">
    <div class="tsc-title">Modificadores de tipo</div>
    <table class="tsc-table">
      <tr><th>Sintaxe</th><th>Efeito</th></tr>
      <tr><td class="tsc-code">T | U</td><td style="color:#94a3b8">Union — valor é T ou U</td></tr>
      <tr><td class="tsc-code">T & U</td><td style="color:#94a3b8">Intersection — valor é T e U</td></tr>
      <tr><td class="tsc-code">T extends U ? X : Y</td><td style="color:#94a3b8">Conditional type</td></tr>
      <tr><td class="tsc-code">T extends U ? infer R : never</td><td style="color:#94a3b8">Extrai tipo com infer</td></tr>
      <tr><td class="tsc-code">keyof T</td><td style="color:#94a3b8">Union das chaves de T</td></tr>
      <tr><td class="tsc-code">T[K]</td><td style="color:#94a3b8">Tipo do campo K em T (indexed access)</td></tr>
      <tr><td class="tsc-code">{ [K in keyof T]: T[K] }</td><td style="color:#94a3b8">Mapped type — itera campos</td></tr>
      <tr><td class="tsc-code">val satisfies T</td><td style="color:#94a3b8">Valida sem alterar tipo inferido (TS 4.9)</td></tr>
    </table>
  </div>
  <div class="tsc-section">
    <div class="tsc-title">tsconfig — opções críticas</div>
    <table class="tsc-table">
      <tr><th>Opção</th><th>Por que ativar</th></tr>
      <tr><td class="tsc-name">strict: true</td><td style="color:#94a3b8">Ativa strictNullChecks + noImplicitAny + mais — sempre ative</td></tr>
      <tr><td class="tsc-name">noUncheckedIndexedAccess</td><td style="color:#94a3b8">arr[i] retorna T | undefined — evita runtime errors</td></tr>
      <tr><td class="tsc-name">exactOptionalPropertyTypes</td><td style="color:#94a3b8">Distingue undefined explícito de campo ausente</td></tr>
      <tr><td class="tsc-name">moduleResolution: bundler</td><td style="color:#94a3b8">Para projetos com Vite/Next.js — resolve ESM corretamente</td></tr>
    </table>
  </div>
</div>`,
    },
    gotchas: [
      "Usar 'any' como atalho destrói o valor do TypeScript — o erro que você evitou hoje vai aparecer em produção amanhã. Prefira 'unknown' e faça narrowing.",
      "Asserção de tipo (as Type) ignora o compilador. Use type predicates (x is Type) quando possível — eles realmente verificam o tipo.",
      "Non-null assertion (!) suprime o erro mas não torna o código seguro. Se o valor pode ser null em runtime, o bug persiste silenciosamente.",
      "Enum gera código JavaScript em runtime e tem comportamentos sutis com reverse mapping numérico. Prefira union de string literals: type Direction = 'left' | 'right'.",
      "Desestruturar um tipo literal apaga os literais: const { status } = { status: 'ok' as const } — a const assertion precisa estar no objeto todo ou usar 'as const satisfies'.",
      "strictNullChecks desligado torna null e undefined atribuíveis a qualquer tipo — ative strict: true em projetos novos, sempre.",
      "Object.keys(obj) retorna string[], não (keyof typeof obj)[] — TypeScript não estreita porque em runtime podem existir mais chaves. Use (Object.keys(obj) as (keyof typeof obj)[]) explicitamente.",
      "Spread de tipo intersection ({ ...a, ...b } as A & B) não verifica conflito de tipos — se A e B têm campo com tipos incompatíveis, você tem um bug silencioso.",
    ],
    interview: [
      {
        q: "Qual a diferença entre 'unknown' e 'any'?",
        a: "<p><strong>any</strong>: desativa a verificação de tipos. Você pode fazer qualquer operação sem erro. Essencialmente sai do TypeScript — qualquer coisa é válida.</p><p><strong>unknown</strong>: o tipo pode ser qualquer coisa, mas você não pode usar sem primeiro narrowar. É o tipo seguro para valores de origem desconhecida: JSON.parse, catch clause, respostas de API externas.</p><p>Regra prática: use unknown quando receber dados externos e force o chamador a ser responsável pelo narrowing antes de usar. any abdica dessa responsabilidade.</p>",
        tip: "Diga 'unknown força o chamador a verificar antes de usar, any desabilita toda verificação'. Mostrar que você sabe a diferença prática com um exemplo real (catch clause) vale muito em entrevista.",
        level: "pleno",
      },
      {
        q: "Como você tiparia uma função que retorna tipos diferentes baseado no input?",
        a: "<p>Dois caminhos: function overloads ou conditional types.</p><p><strong>Function overloads</strong>: declare assinaturas múltiplas antes da implementação. A implementação usa any/unknown mas não é visível externamente — chamadores veem apenas as assinaturas tipadas.</p><pre><code>function process(x: string): string\nfunction process(x: number): number\nfunction process(x: string | number): string | number {\n  return typeof x === 'string' ? x.toUpperCase() : x * 2\n}</code></pre><p><strong>Conditional types</strong>: mais composíveis, mas mais complexos. Use quando o tipo de retorno depende de um parâmetro genérico.</p>",
        tip: "Mencione que overloads têm uma implementação única que não é visível externamente — a maioria dos devs não sabe disso e é um diferencial claro.",
        level: "senior",
      },
      {
        q: "O que é o operador 'satisfies' (TS 4.9) e quando usá-lo?",
        a: "<p>satisfies valida que um valor é compatível com um tipo <em>sem alterar o tipo inferido</em>. Com anotação de tipo (:Type), o tipo do valor é ampliado para o declarado — você perde precisão. Com satisfies, o tipo inferido é preservado e a validação acontece.</p><pre><code>// Com anotação: theme fica 'dark' | 'light'\nconst cfg: Config = { theme: 'dark', size: 16 }\ncfg.theme // 'dark' | 'light'\n\n// Com satisfies: theme fica 'dark' (literal preservado)\nconst cfg = { theme: 'dark', size: 16 } satisfies Config\ncfg.theme // 'dark'</code></pre><p>Muito útil em objetos de configuração e mapas onde você quer tanto validação quanto autocomplete preciso.</p>",
        tip: "Boa pergunta para diferenciar quem acompanha changelogs de quem não acompanha. Mostre o exemplo concreto com/sem satisfies e explique o tradeoff.",
        level: "senior",
      },
      {
        q: "Como funciona type narrowing? Cite todas as formas disponíveis.",
        a: "<p>Narrowing é o processo do compilador de afinar o tipo dentro de um branch condicional baseado em verificações de tipo.</p><ul><li><strong>typeof</strong>: primitivos — 'string', 'number', 'boolean', 'symbol', 'bigint', 'function', 'undefined'</li><li><strong>instanceof</strong>: instâncias de classe/construtores</li><li><strong>in</strong>: presença de propriedade no objeto</li><li><strong>type predicates</strong>: função retornando <code>x is Type</code> — narrowing customizado totalmente controlado</li><li><strong>asserts</strong>: <code>asserts x is Type</code> — lança se condição falsa, útil em testes e validações de entrada</li><li><strong>discriminated union</strong>: campo literal (status, kind, type) que distingue membros — mais poderoso e mais seguro</li><li><strong>truthiness narrowing</strong>: <code>if (x)</code> remove null/undefined/0/'' do tipo</li></ul>",
        tip: "Discriminated union é o mais cobrado em entrevista sênior — mostre o exemplo com status: 'ok' | 'error' e explique por que é o padrão preferido para estados exclusivos.",
        level: "pleno",
      },
      {
        q: "Quais utility types você usa no dia a dia e quando?",
        a: "<p><strong>Partial&lt;T&gt;</strong>: parâmetros de update onde nem todo campo é obrigatório (PATCH). <strong>Required&lt;T&gt;</strong>: forçar completude após aplicar Partial. <strong>Pick/Omit</strong>: criar DTOs e subconjuntos de tipo sem duplicar. <strong>Record&lt;K,V&gt;</strong>: lookup tables e configs tipadas. <strong>ReturnType/Parameters</strong>: tipar em função do que uma função retorna/recebe — sem duplicar o tipo. <strong>Awaited&lt;T&gt;</strong>: extrair o tipo de dentro de uma Promise. <strong>NonNullable&lt;T&gt;</strong>: após validação, remover null/undefined.</p><p>Caso real: type CreateUser = Omit&lt;User, 'id' | 'createdAt'&gt;, type UpdateUser = Partial&lt;Pick&lt;User, 'name' | 'email'&gt;&gt; — uma fonte de verdade (User) gera todos os tipos derivados.</p>",
        tip: "Mencione casos de uso reais (DTO de update com Partial+Pick, config com Record, inferência de retorno com ReturnType) — mostra que você usa no dia a dia, não só sabe que existe.",
        level: "pleno",
      },
      {
        q: "O que são conditional types e como você os usa na prática com infer?",
        a: "<p>Conditional types: <code>T extends U ? X : Y</code>. O poder real vem com <code>infer</code>, que extrai partes do tipo em compile-time.</p><pre><code>// Extrair tipo de retorno (o que ReturnType faz):\ntype ReturnType&lt;F&gt; = F extends (...args: any[]) => infer R ? R : never\n\n// Desembrulhar Promise (o que Awaited faz):\ntype Unwrap&lt;T&gt; = T extends Promise&lt;infer U&gt; ? U : T\n\n// Extrair primeiro item de tuple:\ntype Head&lt;T extends any[]&gt; = T extends [infer H, ...any[]] ? H : never</code></pre><p>Casos reais: DeepReadonly, extração de tipos de respostas de API, tipos condicionais baseados em flags de configuração.</p>",
        tip: "A maioria sabe que conditional types existem mas não sabe usar infer. Mostrar um exemplo com infer é o diferencial claro de sênior nessa pergunta.",
        level: "senior",
      },
      {
        q: "Quando usar 'interface' vs 'type alias'?",
        a: "<p>A diferença principal prática: interfaces suportam <strong>declaration merging</strong> — declarar o mesmo nome duas vezes faz merge dos campos. Isso é essencial para augmentar tipos de bibliotecas de terceiros (adicionar campo ao Request do Express, ao Window, ao processo).</p><p>Types são mais expressivos: suportam union, intersection, conditional types, template literal types, mapped types. Interfaces são mais simples e têm mensagens de erro mais legíveis.</p><p>Convenção atual (recomendada pelo time TypeScript): use <code>type</code> para a maioria dos casos. Reserve <code>interface</code> para objetos que precisam de declaration merging ou que você quer que outros estendam via extends.</p>",
        tip: "Declaration merging é o ponto que mais pega em entrevista — dê o exemplo concreto de augmentar o Express Request. Isso mostra que você já precisou disso de verdade.",
        level: "pleno",
      },
      {
        q: "O que são mapped types e como você os usa para criar utility types customizados?",
        a: "<p>Mapped types iteram sobre as chaves de um tipo e transformam cada uma: <code>{ [K in keyof T]: T[K] }</code>. São a base de Partial, Required, Readonly e Record.</p><p>Com 'as' você remapeia chaves. Com + e - modifica modificadores (? para opcional, readonly).</p><pre><code>// Criar getters a partir de campos:\ntype Getters&lt;T&gt; = {\n  [K in keyof T as `get${Capitalize&lt;string & K&gt;}`]: () => T[K]\n}\n// Getters&lt;{ name: string }&gt; = { getName: () => string }\n\n// DeepReadonly:\ntype DeepReadonly&lt;T&gt; = {\n  readonly [K in keyof T]: T[K] extends object ? DeepReadonly&lt;T[K]&gt; : T[K]\n}</code></pre>",
        tip: "Mostrar DeepReadonly ou Getters com remapeamento de chave é o que diferencia quem realmente entende mapped types de quem só sabe usar os utility types prontos.",
        level: "senior",
      },
      {
        q: "Como você configuraria o tsconfig para um projeto Next.js moderno?",
        a: "<p>Configuração essencial: <strong>strict: true</strong> (ativa todos os checks críticos), <strong>target: ES2017+</strong> (compatibilidade com navegadores modernos), <strong>moduleResolution: bundler</strong> (para Vite/Next.js — resolve ESM corretamente), <strong>paths</strong> (aliases de importação, ex: @/* para src/*). Opcionais mas recomendados: <strong>noUncheckedIndexedAccess: true</strong> (arr[i] retorna T | undefined — evita runtime errors), <strong>exactOptionalPropertyTypes: true</strong> (distingue undefined explícito de campo ausente).</p><p>Evite: <strong>skipLibCheck: true</strong> silenciosamente ignora erros em node_modules — só use se tiver conflitos irresolvíveis. <strong>esModuleInterop</strong> é necessário para importar libs CommonJS como default imports.</p>",
        level: "senior",
      },
    ],
    mnemonics: [
      {
        trick: "UNCLE",
        label: "Quando NÃO anotar tipo explicitamente",
        explanation: "U = União inferida automaticamente. N = Nenhuma anotação quando TS já sabe (variáveis inicializadas, retornos simples). C = Const assertions para literais. L = Literais preservados com satisfies. E = Evite any — prefira unknown. Regra: só anote quando TS não consegue inferir sozinho ou quando a anotação serve como documentação de contrato.",
      },
      {
        trick: "SPNaIF",
        label: "Formas de narrowing em ordem de uso",
        explanation: "S = typeof (strings/numbers/booleans). P = Predicate (x is Type). N = 'in' (propriedade no objeto). a = asserts (testa + lança). I = instanceof (classes). F = Field literal (discriminated union). Lembre como 'Super Predicate Narrows and Illuminates Features'.",
      },
    ],
    resources: [
      { title: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/intro.html", kind: "docs" },
      { title: "Total TypeScript (Matt Pocock)", url: "https://www.totaltypescript.com/", kind: "curso" },
      { title: "TypeScript Playground", url: "https://www.typescriptlang.org/play", kind: "pratica" },
      { title: "Type Challenges", url: "https://github.com/type-challenges/type-challenges", kind: "pratica" },
      { title: "TypeScript Deep Dive (Basarat)", url: "https://basarat.gitbook.io/typescript/", kind: "livro" },
    ],
  },

  "next-js": {
    tagline: "Framework React full-stack com SSR, SSG, App Router e Server Components.",
    why: "Next.js é o framework React mais adotado em produção. App Router (Next 13+) com Server Components muda o paradigma de desenvolvimento. Sênior precisa entender rendering strategies, caching layers, quando usar cada abordagem e como depurar problemas de cache. Em vagas fullstack e frontend sênior, Next.js é pergunta quase certa.",
    prerequisite: "React (hooks, composição de componentes, JSX). TypeScript básico. HTTP e conceitos de servidor/cliente.",
    summary: "Next.js estende React com: routing baseado em arquivo, React Server Components (RSC), Server Actions, múltiplas rendering strategies (SSR, SSG, ISR, CSR), otimizações automáticas de imagens/fontes/scripts e deployment otimizado para Vercel. O App Router (Next 13+) usa RSC por padrão — uma mudança de paradigma em relação ao Pages Router. Caching é a área mais complexa: existem quatro camadas independentes que podem interagir de formas surpreendentes. Entender qual layer está causando dado obsoleto é o principal ponto de debugging em Next.js sênior. O Pages Router ainda existe e coexiste com o App Router — projetos legados migram gradualmente.",
    howToStudy: "<strong>Modelo mental central:</strong> No App Router, cada componente é Server Component por padrão — zero JS ao cliente. Você opt-in em Client Component com 'use client'. A pergunta que guia cada decisão é: 'esse componente precisa de interatividade (estado, eventos, browser APIs)?' Se não, mantém como Server Component.<br><br><strong>Sequência recomendada:</strong><ol><li>Estude o tutorial oficial next.js/learn — passa por App Router, data fetching, caching, Server Actions em ordem lógica.</li><li>Leia a documentação de caching — é o tema mais complexo e mais cobrado em entrevistas sênior.</li><li>Construa um projeto real com: Server Components para dados, Client Components para UI interativa, Server Actions para mutations.</li><li>Depois, explore: Streaming com Suspense, Route Groups, Parallel Routes, Intercepting Routes.</li></ol>",
    diagrams: [
      {
        title: "App Router — Server vs Client Component e composição correta",
        html: `<style>
.nja-diag{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.nja-srv{background:#1c2a1c;border:1.5px solid rgba(74,222,128,.35);border-radius:8px;padding:10px 14px}
.nja-cli{background:#1c1c2a;border:1.5px solid rgba(226,232,240,.25);border-radius:8px;padding:10px 14px}
.nja-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(226,232,240,.3);display:inline}
.nja-tip:hover .nja-tb{display:block}
.nja-tb{display:none;position:absolute;bottom:calc(100%+8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:220px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.nja-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
.nja-row{display:flex;align-items:center;gap:6px;margin-bottom:6px;font-size:11px;color:#94a3b8}
.nja-ok{color:#4ade80}
.nja-no{color:#ef4444}
</style>
<div class="nja-diag">
  <p style="color:#e2e8f0;font-size:12px;font-weight:700;margin:0 0 4px">App Router — Server vs Client Component</p>
  <p style="color:#475569;font-size:10px;margin:0 0 16px">Passe o mouse nos termos <span style="border-bottom:1px dashed rgba(226,232,240,.3)">sublinhados</span></p>
  <div style="display:flex;gap:10px;margin-bottom:14px">
    <div class="nja-srv" style="flex:1">
      <div style="font-size:10px;color:#4ade80;font-weight:700;letter-spacing:.06em;margin-bottom:10px">SERVER COMPONENT (padrão)</div>
      <div class="nja-row"><span class="nja-ok">✓</span> <span class="nja-tip">async/await<span class="nja-tb">Server Components podem ser funções async. Faça fetch diretamente, sem useEffect. Next.js deduplica fetches idênticos na mesma request.</span></span> diretamente</div>
      <div class="nja-row"><span class="nja-ok">✓</span> Acesso a banco e filesystem</div>
      <div class="nja-row"><span class="nja-ok">✓</span> Ler env vars do servidor</div>
      <div class="nja-row"><span class="nja-ok">✓</span> Zero JS enviado ao cliente</div>
      <div class="nja-row"><span class="nja-no">✗</span> <span class="nja-tip">useState / useReducer<span class="nja-tb">Estado requer o browser. Server Components não têm estado — eles rodam no servidor e produzem HTML/RSC payload. Para interatividade, crie um Client Component filho.</span></span></div>
      <div class="nja-row"><span class="nja-no">✗</span> onClick, onChange, eventos</div>
      <div class="nja-row"><span class="nja-no">✗</span> window, localStorage, document</div>
    </div>
    <div class="nja-cli" style="flex:1">
      <div style="font-size:10px;color:#e2e8f0;font-weight:700;letter-spacing:.06em;margin-bottom:10px">'use client' — CLIENT COMPONENT</div>
      <div class="nja-row"><span class="nja-ok">✓</span> useState, useReducer, hooks</div>
      <div class="nja-row"><span class="nja-ok">✓</span> onClick, onChange, eventos</div>
      <div class="nja-row"><span class="nja-ok">✓</span> window, localStorage, APIs do browser</div>
      <div class="nja-row"><span class="nja-ok">✓</span> <span class="nja-tip">Receber Server Components via children<span class="nja-tb">Padrão de composição chave: Client Component com shell interativo recebe Server Components como children. O Server Component continua rodando no servidor — não vira Client só por estar dentro de um Client.</span></span></div>
      <div class="nja-row"><span class="nja-no">✗</span> Importar Server Component diretamente</div>
      <div class="nja-row"><span class="nja-no">✗</span> Acessar banco/secrets diretamente</div>
    </div>
  </div>
  <div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px 16px">
    <div style="font-size:9px;color:#e2e8f0;text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px">Padrão de composição correto</div>
    <div style="font-size:11px;color:#64748b;line-height:2">
      <span style="color:#475569">// page.tsx (Server Component)</span><br>
      <span style="color:#7c3aed">export default async function</span> <span style="color:#4ade80">Page</span>() {<br>
      &nbsp;&nbsp;<span style="color:#7c3aed">const</span> data = <span style="color:#7c3aed">await</span> db.posts.findMany()<br>
      &nbsp;&nbsp;<span style="color:#7c3aed">return</span> (<br>
      &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span class="nja-tip">InteractiveShell<span class="nja-tb">'use client' — tem useState, menu, animações. Recebe os dados como children/props do Server Component pai.</span></span>&gt; <span style="color:#475569">{'// Client Component'}</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;<span class="nja-tip">DataTable data={data}<span class="nja-tb">Server Component como children. Roda no servidor — zero JS ao cliente para renderizar a tabela de dados.</span></span> /&gt; <span style="color:#475569">{'// Server Component'}</span><br>
      &nbsp;&nbsp;&nbsp;&nbsp;&lt;/InteractiveShell&gt;<br>
      &nbsp;&nbsp;)<br>
      }
    </div>
  </div>
</div>`,
        caption: "Server Component = dados + zero JS. Client Component = interatividade. Empurre 'use client' para as folhas — componentes de dados ficam como Server Components.",
      },
      {
        title: "Rendering strategies — quando usar cada uma",
        html: `<style>
.nj-diag{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.nj-card{background:#1e293b;border-radius:10px;padding:14px 16px;border:1.5px solid #334155;flex:1}
.nj-label{font-size:9px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:8px}
.nj-tag{display:inline-block;font-size:10px;padding:2px 8px;border-radius:4px;margin:2px 2px 2px 0}
.nj-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(255,153,0,.4);display:inline}
.nj-tip:hover .nj-tb{display:block}
.nj-tb{display:none;position:absolute;bottom:calc(100%+8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:220px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.nj-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
</style>
<div class="nj-diag">
  <p style="color:#e2e8f0;font-size:12px;font-weight:700;margin:0 0 4px">Next.js — 4 estratégias de rendering</p>
  <p style="color:#475569;font-size:10px;margin:0 0 18px">Passe o mouse nos termos <span style="border-bottom:1px dashed rgba(255,153,0,.4)">sublinhados</span></p>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
    <div class="nj-card">
      <div class="nj-label" style="color:#4ade80">SSG — Static Site Generation</div>
      <div style="font-size:11px;color:#94a3b8;line-height:1.7">
        HTML gerado em <span class="nj-tip">build time<span class="nj-tb">O HTML existe antes da request. Servido do CDN — latência mínima. Não personaliza por usuário.</span></span>.<br>
        Serve do CDN. Mais rápido.<br><br>
        <strong style="color:#e2e8f0">Use para:</strong><br>
        <span class="nj-tag" style="background:#1c3a2a;color:#4ade80">blog / docs</span>
        <span class="nj-tag" style="background:#1c3a2a;color:#4ade80">landing page</span>
        <span class="nj-tag" style="background:#1c3a2a;color:#4ade80">marketing</span>
      </div>
    </div>
    <div class="nj-card">
      <div class="nj-label" style="color:#fb923c">ISR — Incremental Static Regen</div>
      <div style="font-size:11px;color:#94a3b8;line-height:1.7">
        SSG com <span class="nj-tip">revalidação em background<span class="nj-tb">Após N segundos, o próximo visitante recebe o HTML antigo, e Next.js regenera no background. Zero downtime.</span></span>.<br>
        export const revalidate = 3600<br><br>
        <strong style="color:#e2e8f0">Use para:</strong><br>
        <span class="nj-tag" style="background:#3a2010;color:#fb923c">catálogo de produtos</span>
        <span class="nj-tag" style="background:#3a2010;color:#fb923c">preços</span>
      </div>
    </div>
    <div class="nj-card">
      <div class="nj-label" style="color:#38bdf8">SSR — Server-Side Rendering</div>
      <div style="font-size:11px;color:#94a3b8;line-height:1.7">
        HTML gerado <span class="nj-tip">por request<span class="nj-tb">Cada request gera um novo HTML no servidor. Personalizável por usuário — cookies, headers, params.</span></span> no servidor.<br>
        Usa cookies, headers, auth.<br><br>
        <strong style="color:#e2e8f0">Use para:</strong><br>
        <span class="nj-tag" style="background:#0c2a3a;color:#38bdf8">dashboard</span>
        <span class="nj-tag" style="background:#0c2a3a;color:#38bdf8">checkout</span>
        <span class="nj-tag" style="background:#0c2a3a;color:#38bdf8">perfil</span>
      </div>
    </div>
    <div class="nj-card">
      <div class="nj-label" style="color:#a78bfa">CSR — Client-Side Rendering</div>
      <div style="font-size:11px;color:#94a3b8;line-height:1.7">
        JS baixado e executado no <span class="nj-tip">browser<span class="nj-tb">Sem HTML inicial. O browser baixa o bundle, executa, e renderiza. SEO comprometido sem pré-rendering.</span></span>.<br>
        Sem SEO. SPA pura.<br><br>
        <strong style="color:#e2e8f0">Use para:</strong><br>
        <span class="nj-tag" style="background:#2a1c3a;color:#a78bfa">editor rico</span>
        <span class="nj-tag" style="background:#2a1c3a;color:#a78bfa">app interno</span>
      </div>
    </div>
  </div>
  <div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:12px 16px;margin-top:10px">
    <div style="font-size:9px;color:#FF9900;text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px">Regra de ouro — App Router</div>
    <div style="font-size:11px;color:#94a3b8;line-height:1.7">
      No App Router, Next.js decide automaticamente: rota que usa <code style="color:#e2e8f0;background:#0f172a;padding:1px 4px;border-radius:3px">cookies()</code> / <code style="color:#e2e8f0;background:#0f172a;padding:1px 4px;border-radius:3px">headers()</code> → SSR. Rota com <code style="color:#e2e8f0;background:#0f172a;padding:1px 4px;border-radius:3px">export const revalidate</code> → ISR. Rota sem dados dinâmicos → SSG.
    </div>
  </div>
</div>`,
        caption: "SSG = mais rápido, ISR = catálogos que mudam raramente, SSR = personalizado por usuário, CSR = interatividade máxima sem SEO.",
      },
    ],
    keypoints: [
      {
        title: "App Router vs Pages Router — o que mudou",
        body: "App Router (Next 13+): Server Components por padrão, layouts aninhados que preservam estado ao navegar, loading.tsx e error.tsx por rota, Route Handlers. Pages Router: modelo antigo com getServerSideProps/getStaticProps, _app.tsx e _document.tsx globais. Em projetos novos, use App Router. Projetos legados migram gradualmente — ambos coexistem no mesmo projeto.",
        code: `// Pages Router (legado):
// pages/users/[id].tsx
export async function getServerSideProps({ params }) {
  const user = await db.user.findUnique({ where: { id: params.id } })
  return { props: { user } }
}

// App Router (atual):
// app/users/[id]/page.tsx
export default async function UserPage({ params }) {
  const user = await db.user.findUnique({ where: { id: params.id } })
  return <UserProfile user={user} />   // Server Component — zero boilerplate
}`,
      },
      {
        title: "Rendering strategies — implícitas no App Router",
        body: "No App Router, a estratégia de rendering é inferida automaticamente: rota com cookies()/headers() → SSR por request. Rota com fetch() normal → ISR ou SSG. Rota com export const revalidate = N → ISR. Rota totalmente estática → SSG em build time. Você não escolhe explicitamente — Next.js decide pelo que a rota usa.",
        code: `// SSG — sem dados dinâmicos (gerado em build)
export default function AboutPage() { return <About /> }

// ISR — revalida a cada 1 hora em background
export const revalidate = 3600
export default async function CatalogPage() {
  const products = await db.product.findMany()
  return <ProductGrid products={products} />
}

// SSR — usa cookies → dinâmico por request
import { cookies } from 'next/headers'
export default async function DashboardPage() {
  const session = cookies().get('session')
  const data = await getUserData(session?.value)
  return <Dashboard data={data} />
}`,
      },
      {
        title: "Caching em 4 camadas — a área mais complexa do Next.js",
        body: "Next.js tem 4 camadas independentes de cache. Entender qual está causando dado obsoleto é o principal skill de debugging em produção. (1) Request Memoization: deduplication de fetch na mesma árvore de render — dura uma request. (2) Data Cache: resultado de fetch() entre requests (persistente, em disco). (3) Full Route Cache: HTML + RSC payload para rotas estáticas. (4) Router Cache: client-side, RSC payload durante a sessão.",
        code: `// Data Cache — invalida por path ou tag
fetch('/api/posts', { next: { tags: ['posts'] } })
revalidateTag('posts')    // invalida todos com tag 'posts'
revalidatePath('/posts')  // invalida rota específica

// Opt-out de cache para dado sempre fresco:
fetch('/api/realtime', { cache: 'no-store' })

// Router Cache (client-side): invalida via:
import { useRouter } from 'next/navigation'
const router = useRouter()
router.refresh() // força re-fetch do RSC payload atual`,
      },
      {
        title: "Server Actions — mutations sem endpoint de API",
        body: "Server Actions são funções async marcadas com 'use server' que rodam no servidor e são chamadas do cliente via RPC transparente. Eliminam a necessidade de criar endpoints de API para mutations internas. Integram com formulários HTML nativamente (action={serverAction}) e com useFormStatus para loading state.",
        code: `// app/actions.ts
'use server'
export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  const parsed = postSchema.safeParse({ title })
  if (!parsed.success) return { error: parsed.error.flatten().fieldErrors }
  await db.post.create({ data: { title: parsed.data.title } })
  revalidatePath('/posts')
}

// Em Client Component:
'use client'
import { useFormStatus } from 'react-dom'
function SubmitButton() {
  const { pending } = useFormStatus()
  return <button disabled={pending}>{pending ? 'Salvando...' : 'Criar'}</button>
}
export function PostForm() {
  return (
    <form action={createPost}>
      <input name="title" required />
      <SubmitButton />
    </form>
  )
}`,
      },
      {
        title: "Streaming com Suspense — carregamento progressivo",
        body: "Server Components suportam streaming: o servidor envia HTML incrementalmente ao browser conforme partes ficam prontas. Suspense boundary mostra fallback enquanto componentes pesados carregam. Melhora Time To First Byte — o usuário vê conteúdo imediatamente enquanto dados lentos carregam em background.",
        code: `// page.tsx — streaming com Suspense
import { Suspense } from 'react'

export default function Page() {
  return (
    <>
      <Header />              {/* imediato — sem dados */}
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardData />     {/* streamado quando os dados chegam */}
      </Suspense>
      <Suspense fallback={<ActivitySkeleton />}>
        <RecentActivity />    {/* streamado independentemente */}
      </Suspense>
    </>
  )
}

// DashboardData.tsx — Server Component async
async function DashboardData() {
  const data = await fetchSlowData() // pode levar 2s — sem bloquear a página
  return <Dashboard data={data} />
}`,
      },
      {
        title: "Organização de projeto — Route Groups e colocação",
        body: "Route Groups com (parênteses) organizam rotas sem afetar a URL — útil para layouts separados (área pública vs autenticada). Colocação: componentes, hooks e utils perto das rotas que os usam. Private folders com _ nunca viram rotas. Parallel Routes (@slot) para layouts complexos com múltiplas seções independentes.",
        code: `// Estrutura recomendada com Route Groups:
app/
  (public)/               // sem layout de auth
    page.tsx              // /
    about/page.tsx        // /about
  (dashboard)/            // com layout autenticado
    layout.tsx            // shell com sidebar, nav
    dashboard/page.tsx    // /dashboard
    settings/page.tsx     // /settings
  api/
    users/route.ts        // GET/POST /api/users
  _lib/                   // _ = nunca vira rota
    db.ts`,
      },
      {
        title: "Metadata API e SEO",
        body: "App Router tem API de Metadata tipada para meta tags, Open Graph, Twitter Cards. Estático com export const metadata, dinâmico com async function generateMetadata(). Muito mais ergonômico que o Head manualizado do Pages Router. Suporta icons, manifest, robots, canonical e muito mais.",
        code: `// Metadata estático:
export const metadata: Metadata = {
  title: 'Meu Site',
  description: 'Descrição para SEO',
  openGraph: { title: 'Meu Site', images: ['/og.png'] },
}

// Metadata dinâmico (por produto, por exemplo):
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await db.product.findUnique({ where: { id: params.id } })
  return {
    title: product?.name ?? 'Produto',
    description: product?.description,
    openGraph: { images: [product?.image ?? '/og.png'] },
  }
}`,
      },
    ],
    gotchas: [
      "Colocar 'use client' no topo da árvore transforma todos os filhos importados em Client Components. Mova a interatividade para as folhas — componentes de dados ficam como Server Components.",
      "Cache agressivo do Data Cache pode servir dado obsoleto após mutations. Use revalidatePath(), revalidateTag() ou cache: 'no-store' explicitamente nos fetches críticos.",
      "Server Actions não substituem API Routes para casos de uso público (webhooks, apps mobile) — elas requerem o contexto Next.js e autenticação via cookies de sessão.",
      "Usar cookies() ou headers() em Server Component faz a rota se tornar dinamicamente renderizada (opt-out de Full Route Cache). Isso é silencioso — pode surpreender em produção.",
      "O Router Cache (client-side) dura 30s para páginas dinâmicas e 5min para estáticas. Não é invalidado por revalidatePath no servidor — requer router.refresh() no cliente.",
      "Passar funções como props de Server Component para Client Component não funciona (funções não são serializáveis). Use Server Actions para isso.",
      "next/font e next/image têm comportamento de loading diferente em desenvolvimento vs produção — sempre teste o build de produção antes de ajustar performance.",
    ],
    interview: [
      {
        q: "Quando usar SSR vs SSG vs ISR no App Router?",
        a: "<p>No App Router, a estratégia é inferida pelo que a rota usa — não é uma escolha explícita na maioria dos casos:</p><ul><li><strong>SSG</strong> (padrão): rota sem dados dinâmicos. Gerado em build time, serve do CDN. Blog, landing page, docs.</li><li><strong>ISR</strong>: <code>export const revalidate = N</code>. Dados que mudam raramente. Catálogo de produtos, preços. Regenera em background — zero downtime.</li><li><strong>SSR</strong>: rota usa cookies()/headers() ou searchParams — automaticamente dinâmica por request. Dados personalizados por usuário: dashboard, checkout.</li><li><strong>CSR</strong>: componente marcado 'use client' com fetch no browser (SWR, React Query). Apps interativos sem SEO: editores, apps internos.</li></ul>",
        tip: "Mencione ISR como 'melhor dos dois mundos' para catálogos — é o caso de uso mais ilustrativo e mostra que você entende a tradeoff performance/freshness.",
        level: "pleno",
      },
      {
        q: "O que são Server Components e quais são suas limitações?",
        a: "<p>Server Components rodam apenas no servidor, nunca no browser. Benefícios: zero bundle JS enviado ao cliente, acesso direto a DB/filesystem/secrets sem round-trip, eliminação de waterfalls cliente-servidor.</p><p>Limitações: sem useState/useReducer (requer browser), sem event handlers (onClick, onChange), sem browser APIs (window, localStorage, document), sem React Context que depende de estado client-side.</p><p>Padrão correto: toda lógica de dados vai em Server Components; interatividade fica em Client Components nas folhas da árvore. Passe Server Components como children de Client Components quando precisar manter ambos.</p>",
        tip: "A pegadinha: 'use client' não impede o componente de rodar no servidor durante SSR/hidratação — ele roda nos dois lados. Mencionar isso mostra profundidade real.",
        level: "pleno",
      },
      {
        q: "Explique as 4 camadas de cache do Next.js App Router.",
        a: "<p><strong>1. Request Memoization</strong>: deduplica fetches idênticos dentro de uma mesma árvore de render. Dois Server Components fazendo o mesmo fetch recebem a mesma resposta sem duplo hit de rede. Dura apenas por uma request — sem persistência.</p><p><strong>2. Data Cache</strong>: armazena resultado de fetch() entre requests, em disco. Persiste entre deployments por padrão. Invalida via revalidatePath/revalidateTag ou cache: 'no-store'. É aqui que dado 'grudado' mais aparece.</p><p><strong>3. Full Route Cache</strong>: armazena HTML + RSC payload para rotas estáticas em build time. Invalida via revalidação de dados ou novo build.</p><p><strong>4. Router Cache</strong>: client-side, no browser. Armazena RSC payload por segmento de rota durante a sessão. Invalida via router.refresh() ou nova navegação completa — não via revalidatePath do servidor.</p>",
        tip: "Poucos candidatos conhecem todas as 4 camadas distintas. Se você souber, claramente está além do pleno comum. Mencione o Router Cache como a camada mais surpreedente para devs — dado obsoleto que persiste mesmo após revalidation no servidor.",
        level: "senior",
      },
      {
        q: "Qual a diferença entre Server Actions e API Routes (Route Handlers)?",
        a: "<p><strong>Server Actions</strong>: funções async com 'use server', chamadas via RPC transparente. Autenticação via cookies automática. Integram com formulários HTML nativamente. Ideais para mutations internas do app. Não são endpoints HTTP públicos.</p><p><strong>Route Handlers</strong>: endpoints HTTP explícitos em app/api/. Acessíveis por qualquer cliente (mobile, terceiros). Suportam todos os métodos HTTP. Necessários para webhooks (Stripe, GitHub) — precisam de URL pública sem autenticação de sessão.</p><p>Regra prática: Server Actions para mutations de UI interna; Route Handlers para endpoints consumidos por clientes externos ou webhooks.</p>",
        tip: "Citar webhooks como o caso claro de Route Handler — precisam de acesso público sem sessão — é o diferencial concreto que o entrevistador quer ouvir.",
        level: "senior",
      },
      {
        q: "Como você organiza um projeto grande com App Router?",
        a: "<p>Padrões que funcionam em produção: (1) <strong>Route Groups</strong> com (parênteses) para separar layouts sem afetar URL — ex: (public)/sobre, (dashboard)/settings. (2) <strong>Colocação de arquivos</strong>: componentes, hooks e utils perto das rotas que os usam — não tudo em /components global. (3) <strong>Private folders</strong> com underscore (_lib, _components) — nunca viram rotas. (4) <strong>Parallel Routes</strong> (@slot) para layouts complexos com seções independentes (sidebar + main + modal). (5) <strong>Intercepting Routes</strong> para abrir modais mantendo a URL original (galeria de fotos, quick preview).</p>",
        tip: "Citar Route Groups é o indicador de quem realmente usou App Router em projeto real — a maioria não conhece. Parallel e Intercepting Routes são diferenciais sênior.",
        level: "senior",
      },
      {
        q: "Como Next.js otimiza imagens e fonts e por que isso importa?",
        a: "<p><strong>next/image</strong>: converte para WebP/AVIF automaticamente, gera srcset responsivo por tamanho de tela, lazy loading por padrão (acima da dobra: loading='eager'), reserva espaço no layout com width/height — evita CLS, serve via CDN configurado.</p><p><strong>next/font</strong>: baixa e serve fontes localmente (zero request para Google Fonts em produção), elimina FOUT (Flash of Unstyled Text) com font-display: swap, aplica size-adjust para evitar CLS de substituição de fonte.</p><p>Por que importa: imagens e fontes são as principais causas de LCP ruim e CLS — as duas métricas que mais afetam o ranking SEO via Core Web Vitals. Usar img e @import de Google Fonts em Next.js é desperdiçar otimizações automáticas.</p>",
        tip: "Conectar next/image com LCP e next/font com CLS mostra que você entende o propósito das otimizações, não só como usar.",
        level: "pleno",
      },
      {
        q: "Como você depuraria um problema de dado obsoleto em Next.js App Router?",
        a: "<p>Abordagem sistemática por camada de cache: (1) <strong>Data Cache</strong>: adicione logging no fetch e veja se a resposta está sendo servida de cache. Adicione cache: 'no-store' temporariamente para confirmar. Se o dado fresco aparece, a invalidação não está funcionando — verifique revalidatePath/revalidateTag. (2) <strong>Full Route Cache</strong>: veja se a rota está sendo tratada como estática quando deveria ser dinâmica. cookies() ou headers() devem opt-out automaticamente. (3) <strong>Router Cache</strong>: se o dado parece correto após reload mas fica obsoleto em navegação — é o Router Cache. Chame router.refresh() no cliente após mutations. (4) <strong>Request Memoization</strong>: raramente é o problema, mas se dois fetches idênticos estão conflitando, adicione parâmetros únicos ou desabilite com AbortController.</p>",
        tip: "Mostrar uma abordagem de debugging por camada (não 'tentativa e erro') é o que diferencia sênior de pleno. O entrevistador quer ver pensamento sistemático.",
        level: "senior",
      },
    ],
    resources: [
      { title: "Next.js docs", url: "https://nextjs.org/docs", kind: "docs" },
      { title: "Next.js App Router tutorial", url: "https://nextjs.org/learn", kind: "curso" },
      { title: "Next.js caching — documentação completa", url: "https://nextjs.org/docs/app/building-your-application/caching", kind: "docs" },
      { title: "Vercel — Next.js Conf talks", url: "https://nextjs.org/conf", kind: "video" },
    ],
  },

  "vue": {
    tagline: "Framework JavaScript progressivo para construir interfaces com sistema reativo baseado em Proxy.",
    why: "Vue é amplamente adotado no mercado brasileiro e europeu. Composition API (Vue 3) alinha Vue com padrões modernos de hooks. Saber Vue abre vagas onde React não domina — e saber comparar os dois em entrevista é diferencial real.",
    summary: "Vue é um framework JavaScript progressivo com sistema de reatividade baseado em Proxy (Vue 3). Tem Composition API (similar a React hooks, mas com reatividade automática) e Options API (legado, Vue 2). Template syntax com diretivas declarativas (v-if, v-for, v-model). Ecossistema maduro: Pinia (estado global), Vue Router, Nuxt (meta-framework), Vite (build).",
    diagrams: [
      {
        title: "Sistema de reatividade Vue 3 — Proxy rastreando dependências automaticamente",
        html: `<style>
.vue-diag{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.vue-box{background:#1e293b;border-radius:8px;padding:10px 14px;border:1.5px solid #334155;font-size:11px}
.vue-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(65,184,131,.4);display:inline}
.vue-tip:hover .vue-tb{display:block}
.vue-tb{display:none;position:absolute;bottom:calc(100%+8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:220px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.vue-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
@keyframes vue-pulse{0%,100%{opacity:.3}50%{opacity:1}}
.vue-flow-dot{animation:vue-pulse 1.6s ease-in-out infinite}
.vue-flow-dot:nth-child(2){animation-delay:.3s}
.vue-flow-dot:nth-child(3){animation-delay:.6s}
</style>
<div class="vue-diag">
  <p style="color:#41b883;font-size:12px;font-weight:700;margin:0 0 4px">Vue 3 — reatividade por Proxy</p>
  <p style="color:#475569;font-size:10px;margin:0 0 18px">Passe o mouse nos termos <span style="border-bottom:1px dashed rgba(65,184,131,.4)">sublinhados</span></p>
  <div style="display:flex;gap:10px;align-items:flex-start;margin-bottom:12px">
    <div class="vue-box" style="flex:1">
      <div style="font-size:9px;color:#41b883;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px">1 — Você define estado</div>
      <div style="color:#94a3b8;line-height:2">
        <span style="color:#7c3aed">const</span> state = <span class="vue-tip">reactive<span class="vue-tb">reactive() envolve o objeto num Proxy. Qualquer acesso (get) registra a dependência. Qualquer mutação (set) notifica os efeitos que dependem dela.</span></span>({ count: 0 })<br>
        <span style="color:#7c3aed">const</span> double = <span class="vue-tip">computed<span class="vue-tb">computed() cria um valor derivado. Roda automaticamente quando suas dependências mudam — e só então.</span></span>(() =&gt; state.count * 2)<br>
        <span style="color:#7c3aed">function</span> inc() { <span class="vue-tip">state.count++<span class="vue-tb">Mutação direta! Vue intercepta via Proxy setter e notifica os efeitos que dependem de state.count.</span></span> }
      </div>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:0 6px;padding-top:24px">
      <span class="vue-flow-dot" style="color:#41b883;font-size:14px">▶</span>
      <span class="vue-flow-dot" style="color:#41b883;font-size:14px">▶</span>
      <span class="vue-flow-dot" style="color:#41b883;font-size:14px">▶</span>
    </div>
    <div class="vue-box" style="flex:1">
      <div style="font-size:9px;color:#35495e;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px;color:#a8b3cf">2 — Template usa o estado</div>
      <div style="color:#94a3b8;line-height:2">
        &lt;<span style="color:#41b883">template</span>&gt;<br>
        &nbsp;&lt;p&gt;{{ <span class="vue-tip">state.count<span class="vue-tb">Ao renderizar, Vue registra state.count como dependência deste nó de template. Quando count muda, só este nó é atualizado.</span></span> }}&lt;/p&gt;<br>
        &nbsp;&lt;p&gt;{{ double }}&lt;/p&gt;<br>
        &nbsp;&lt;button <span class="vue-tip">@click<span class="vue-tb">Açúcar para v-on:click. Chama inc(), que muta state.count, que dispara re-render seletivo.</span></span>="inc"&gt;+&lt;/button&gt;<br>
        &lt;/<span style="color:#41b883">template</span>&gt;
      </div>
    </div>
  </div>
  <div style="background:#1e293b;border:1px solid #1a3a2a;border-radius:8px;padding:12px 16px">
    <div style="font-size:9px;color:#41b883;text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px">Diferença-chave: Vue vs React</div>
    <div style="display:flex;gap:10px">
      <div style="flex:1;font-size:11px;color:#94a3b8;line-height:1.7">
        <strong style="color:#41b883">Vue</strong>: rastreia dependências <em>automaticamente</em> via Proxy. Sem array de deps. Só o que mudou re-renderiza.
      </div>
      <div style="flex:1;font-size:11px;color:#94a3b8;line-height:1.7">
        <strong style="color:#61DAFB">React</strong>: você declara deps explicitamente (useEffect([dep])). Imutabilidade — criar novo objeto para mudar.
      </div>
    </div>
  </div>
</div>`,
        caption: "Vue usa Proxy para rastrear dependências automaticamente — sem array de deps como no React. Só o que realmente mudou dispara re-render.",
      },
    ],
    keypoints: [
      { title: "Composition API", body: "Vue 3 introduziu Composition API: ref(), reactive(), computed(), watch(), onMounted() e outros. Similar a React hooks em estrutura mas diferente em mecanismo — Vue rastreia dependências automaticamente por Proxy, sem array de deps manual.", code: `<script setup>
import { ref, computed } from 'vue'
const count = ref(0)
const double = computed(() => count.value * 2)
function inc() { count.value++ }
</script>` },
      { title: "Sistema de reatividade com Proxy", body: "Vue 3 usa Proxy JavaScript para interceptar acesso e mutação de propriedades. Quando você acessa reactive.prop dentro de um computed ou template, Vue registra a dependência. Quando muda, Vue re-executa só o que depende dela — sem virtual DOM diffing completo como React.", code: `const state = reactive({ count: 0, name: 'Vue' })
// Desestruturar QUEBRA a reatividade:
const { count } = state // count é number não-reativo
// Correto:
const { count } = toRefs(state) // count.value é reativo` },
      { title: "ref() vs reactive()", body: "ref() cria um wrapper reativo para qualquer valor (primitivo ou objeto). Acesso via .value em JS, auto-unwrap no template. reactive() cria um objeto Proxy — acesso direto sem .value, mas perde reatividade ao desestruturar.", code: `const n = ref(0)    // n.value em JS, {{n}} no template
const obj = reactive({ x: 1 }) // obj.x — sem .value` },
      { title: "v-model e two-way binding", body: "v-model em input é açúcar para :value + @input. Em componentes customizados: prop modelValue + emit('update:modelValue', val). Vue 3 permite múltiplos v-model: v-model:title, v-model:content.", code: `<!-- equivalente: -->
<input :value="name" @input="name = $event.target.value" />
<input v-model="name" />

<!-- em componente filho: -->
defineProps(['modelValue'])
defineEmits(['update:modelValue'])` },
      { title: "Diretivas e templates", body: "v-if/v-else: renderização condicional. v-for: lista com :key obrigatório. v-bind (ou :): binding de atributo. v-on (ou @): event listener. v-show: display:none vs v-if que remove do DOM. Sempre prefira v-if para elementos que raramente aparecem; v-show para toggle frequente." },
      { title: "defineProps e defineEmits (script setup)", body: "Com <script setup>, use defineProps e defineEmits (macros de compilador — não precisam ser importados). Props são readonly. Emits declaram o contrato de eventos do componente.", code: `const props = defineProps<{ title: string; count?: number }>()
const emit = defineEmits<{ change: [value: number] }>()
emit('change', props.count + 1)` },
    ],
    gotchas: [
      "reactive() perde reatividade quando desestruturado diretamente. Use toRefs() para converter para refs individuais reativos.",
      "v-for sem :key ou com index como key quebra o estado interno de componentes quando a lista é reordenada. Use IDs únicos estáveis.",
      "watch() é lazy por padrão (não roda no mount). Use watchEffect() para rodar imediatamente, ou { immediate: true } no watch.",
      "Componentes são case-sensitive em <script setup> mas case-insensitive em template HTML. Use PascalCase em JS e kebab-case no template para componentes.",
      "ref() que contém um objeto ainda usa Proxy internamente — você pode mutar .value.prop diretamente. Mas reatribuir .value = novoObjeto também funciona.",
    ],
    interview: [
      {
        q: "Qual a diferença entre ref() e reactive() no Vue 3?",
        a: "<p><strong>ref()</strong>: envolve qualquer valor (primitivo ou objeto) em um container reativo. Acesso via .value em JavaScript, auto-unwrap no template. Funciona com primitivos (strings, numbers) — reactive() não funciona com primitivos.</p><p><strong>reactive()</strong>: transforma um objeto em Proxy reativo diretamente. Acesso sem .value. Problema: perde reatividade quando desestruturado.</p><p>Convenção moderna com Composition API: prefira ref() para tudo — é mais consistente e funciona com toRefs() quando necessário.</p>",
        tip: "Citar o problema de desestruturação do reactive() é o ponto que mais pega em entrevista. Quem só leu a docs superficialmente não menciona.",
        level: "pleno",
      },
      {
        q: "Como funciona o sistema de reatividade do Vue 3?",
        a: "<p>Vue 3 usa JavaScript Proxy para interceptar acesso (get) e mutação (set) de propriedades. Quando um computed ou watchEffect roda, qualquer acesso a propriedade reativa registra uma dependência. Quando essa propriedade muda, Vue re-executa os efeitos que dependem dela.</p><p>É diferente do React: Vue rastreia dependências automaticamente por acesso, sem array de deps manual. A granularidade é por propriedade — só o que realmente mudou dispara re-render.</p>",
        tip: "Comparar com o React (sem array de deps, rastreamento automático) mostra que você entende o modelo mental, não só a API.",
        level: "senior",
      },
      {
        q: "Qual a diferença entre v-if e v-show?",
        a: "<p><strong>v-if</strong>: remove o elemento do DOM completamente quando false. Componentes dentro são destruídos (lifecycle hooks chamados). Custo alto na alternância, mas zero custo quando falso.</p><p><strong>v-show</strong>: aplica display:none — elemento permanece no DOM. Componente mantém estado. Custo baixo na alternância.</p><p>Use v-if para elementos que raramente mudam ou que têm custo de inicialização alto. Use v-show para toggle frequente (menu, drawer, tooltip).</p>",
        level: "pleno",
      },
      {
        q: "Como você compartilha estado global em Vue 3?",
        a: "<p><strong>Pinia</strong> é a solução oficial (substituiu Vuex). Define stores com defineStore(). Stores são reativas, têm state, getters (computed) e actions. Fácil de usar com Composition API — useStore() direto no setup.</p><p><strong>Composables</strong> com ref/reactive no módulo: para estado simples compartilhado, um composable com refs no escopo do módulo funciona bem sem Pinia.</p><p>Evite Vuex em projetos novos Vue 3 — Pinia tem melhor DX, TypeScript support e DevTools integration.</p>",
        tip: "Mencionar que Pinia é a substituição oficial do Vuex e que o próprio time Vue recomenda mostra que você está atualizado.",
        level: "pleno",
      },
      {
        q: "Como Vue se compara ao React em termos de modelo mental?",
        a: "<p><strong>Reatividade</strong>: Vue rastreia dependências automaticamente (Proxy) — sem array de deps. React requer deps explícitas em hooks.</p><p><strong>Templates vs JSX</strong>: Vue usa templates HTML com diretivas (mais familiar). React usa JSX (mais expressivo, JavaScript puro).</p><p><strong>Mutabilidade</strong>: Vue permite mutar estado diretamente (reactive.prop = valor). React exige imutabilidade (criar novo objeto/array).</p><p><strong>Dois-way binding</strong>: Vue tem v-model. React é unidirecional por padrão.</p><p>Vue tende a ter menos boilerplate para casos simples. React é mais previsível e escala melhor em equipes grandes com disciplina de imutabilidade.</p>",
        tip: "Em entrevista, evite dizer que um é melhor que o outro. Foque nos tradeoffs — é o que sênior faz.",
        level: "senior",
      },
      {
        q: "O que são composables no Vue 3?",
        a: "<p>Composables são funções que encapsulam lógica stateful reutilizável usando Composition API — equivalente aos React custom hooks. Convenção: nome começa com 'use'.</p><pre><code>function useCounter(initial = 0) {\n  const count = ref(initial)\n  function increment() { count.value++ }\n  return { count, increment }\n}</code></pre><p>Vantagens sobre mixins (Vue 2): sem colisão de nomes, origem clara de cada propriedade, composição explícita.</p>",
        tip: "Mencionar a comparação com mixins do Vue 2 e por que composables são superiores é um diferencial — mostra conhecimento de evolução do ecossistema.",
        level: "pleno",
      },
    ],
    resources: [
      { title: "Vue 3 docs", url: "https://vuejs.org/guide/introduction.html", kind: "docs" },
      { title: "Vue School — Vue 3 Fundamentals", url: "https://vueschool.io/courses/vue-js-3-fundamentals", kind: "curso" },
      { title: "Pinia docs", url: "https://pinia.vuejs.org/", kind: "docs" },
    ],
  },

  "tailwind-css": {
    tagline: "Framework CSS utility-first que gera apenas as classes usadas — sem CSS morto.",
    why: "Tailwind domina projetos modernos React/Vue. Saber configurar, usar variantes, criar componentes com cva/cn e entender o tradeoff de legibilidade e produtividade é esperado em entrevista sênior.",
    summary: "Tailwind CSS é um framework utility-first: ao invés de escrever CSS, você aplica classes atômicas diretamente no HTML/JSX (flex, p-4, text-blue-500). O build final inclui apenas as classes usadas (purge/JIT). Ecossistema: shadcn/ui, tailwind-merge, cva pra variantes de componente.",
    keypoints: [
      { title: "JIT (Just-in-Time)", body: "Modo JIT gera estilos sob demanda enquanto você salva. Classes arbitrárias (w-[327px], text-[#1a2b3c]) são geradas em tempo real. Zero CSS não usado no build final." },
      { title: "Variantes", body: "Prefixos de estado: hover:, focus:, active:, dark:, md:, lg:. Permite estilo responsivo e interativo sem CSS personalizado." },
      { title: "cn() e tailwind-merge", body: "tailwind-merge resolve conflitos de classes Tailwind (duas classes bg- simultâneas). clsx combina classes condicionalmente. cn() = clsx + twMerge — padrão em projetos profissionais.", code: `import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Uso — bg-blue-500 vence bg-red-500 (sem conflito silencioso):
cn('bg-red-500', condition && 'bg-blue-500')` },
      { title: "cva (class-variance-authority)", body: "Cria componentes com variantes type-safe: variant, size, state. Gera a string de classes baseado nos props. Padrão em design systems com Tailwind.", code: `const button = cva('rounded font-medium', {
  variants: {
    variant: { solid: 'bg-blue-600 text-white', ghost: 'bg-transparent border' },
    size:    { sm: 'px-3 py-1 text-sm', md: 'px-4 py-2' },
  },
  defaultVariants: { variant: 'solid', size: 'md' },
})` },
      { title: "Design tokens via tailwind.config", body: "Customize via tailwind.config.ts: cores semânticas, spacing, fonts, breakpoints. Estende ou substitui o tema default. Cores com CSS variables permitem dark mode automático.", code: `// tailwind.config.ts
theme: {
  extend: {
    colors: {
      primary: 'hsl(var(--color-primary) / <alpha-value>)',
    },
  },
}` },
      { title: "@apply e extração de classes", body: "@apply extrai classes repetidas para CSS semântico. Útil para elementos que aparecem em muitos lugares sem componente React/Vue. Evite overuse — perde a vantagem de utility-first.", code: `/* globals.css */
.btn-primary {
  @apply rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700;
}` },
    ],
    interview: [
      {
        q: "O que é utility-first CSS e qual o tradeoff em relação ao CSS tradicional?",
        a: "<p><strong>Utility-first</strong>: classes atômicas de propósito único (flex, p-4, text-blue-500) aplicadas diretamente no HTML/JSX. Sem alternar entre arquivo HTML e CSS.</p><p><strong>Vantagens</strong>: sem naming de classes (adeus BEM), sem CSS morto (JIT gera só o que usa), hover/responsive sem media queries separadas, consistência de design tokens automática.</p><p><strong>Tradeoffs</strong>: JSX/HTML fica verboso, legibilidade inicial mais baixa para quem não conhece as classes, difícil de reutilizar sem abstrair em componentes ou cva.</p>",
        tip: "Citar o JIT como eliminador de CSS morto mostra que você sabe como Tailwind funciona — não só que sabe usar.",
        level: "pleno",
      },
      {
        q: "Por que usar tailwind-merge em vez de apenas concatenar strings de classes?",
        a: "<p>Quando duas classes Tailwind afetam a mesma propriedade CSS (ex: bg-red-500 e bg-blue-500), a que vencer no CSS depende da ordem no stylesheet gerado — não da ordem no JSX. Concatenar strings pode produzir comportamento imprevisível.</p><p>tailwind-merge resolve isso: dado bg-red-500 bg-blue-500, ele retorna apenas bg-blue-500 (a última vence intencionalmente). Isso é essencial em componentes que aceitam className como prop.</p>",
        tip: "Demonstrar que você conhece o problema de especificidade em Tailwind é diferencial real — a maioria só usa cn() sem saber por quê.",
        level: "pleno",
      },
      {
        q: "Como você cria componentes com variantes type-safe usando Tailwind?",
        a: "<p>Com cva (class-variance-authority): define variants (variant, size, intent) como objeto, e cva retorna uma função que recebe os props e gera a string de classes correta. Totalmente integrado com TypeScript — as variantes têm autocomplete e type safety.</p><p>Padrão em design systems: Button, Badge, Input todos usam cva + cn() para combinar classes externas com as internas sem conflitos.</p>",
        tip: "Mostrar o padrão cva + cn() é o que diferencia quem usa Tailwind profissionalmente de quem só conhece classes básicas.",
        level: "pleno",
      },
      {
        q: "Como Tailwind lida com dark mode?",
        a: "<p>Tailwind suporta dark mode via classe (estratégia padrão recomendada) ou media query. Com classe: adicione dark: prefix em classes e toggle a classe 'dark' no elemento html. Com CSS variables: defina cores como variáveis (--color-primary) e redefina-as no .dark — Tailwind usa <alpha-value> para suporte a opacidade automática.</p><p>shadcn/ui usa essa abordagem: cores em CSS variables redefinidas em .dark, referenciadas com bg-primary, text-foreground etc.</p>",
        level: "pleno",
      },
      {
        q: "Por que classes dinâmicas como `bg-${color}-500` não funcionam com Tailwind?",
        a: "<p>Tailwind analisa o código em build time via regex/AST para encontrar classes completas. Classes construídas por interpolação ('bg-' + color + '-500') não aparecem como string completa — o scanner não as detecta e elas não são incluídas no CSS gerado.</p><p>Solução: mapa de classes completas: const colorMap = { red: 'bg-red-500', blue: 'bg-blue-500' } e use colorMap[color]. Ou safelist no tailwind.config para classes que devem sempre estar presentes.</p>",
        tip: "Esse é o gotcha mais comum de Tailwind em produção. Mostrar a solução com mapa de classes é o que o entrevistador quer ouvir.",
        level: "pleno",
      },
      {
        q: "Quando usar @apply vs componentes React/Vue para reutilizar estilos Tailwind?",
        a: "<p><strong>@apply</strong>: elementos HTML simples sem lógica (links no prose, headings em markdown renderizado, reset de estilos globais). Útil quando você não tem controle do HTML gerado.</p><p><strong>Componentes</strong>: qualquer elemento que aparece mais de 2-3 vezes e tem variações de props. É a abordagem preferida em ecossistemas baseados em componentes — mantém o HTML legível e reutilizável.</p><p>Regra prática: se você está copiando classes em múltiplos lugares, crie um componente. Se o HTML vem de markdown ou CMS, use @apply.</p>",
        level: "senior",
      },
    ],
    diagrams: [
      {
        title: "Tailwind JIT — do JSX ao CSS gerado",
        html: `<style>
.tw-diag{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.tw-box{background:#1e293b;border:1.5px solid #334155;border-radius:8px;padding:12px 16px;font-size:11px}
.tw-arr{color:#38bdf8;font-size:18px;text-align:center;line-height:1}
.tw-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(56,189,248,.4);display:inline}
.tw-tip:hover .tw-tb{display:block}
.tw-tb{display:none;position:absolute;bottom:calc(100%+8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:210px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.tw-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
</style>
<div class="tw-diag">
  <p style="color:#e2e8f0;font-size:12px;font-weight:700;margin:0 0 16px">Tailwind JIT — só o que você usa vai pro CSS final</p>
  <div style="display:flex;gap:8px;align-items:center">
    <div class="tw-box" style="flex:1">
      <div style="font-size:9px;color:#38bdf8;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px">Seu JSX / HTML</div>
      <div style="color:#94a3b8;line-height:2.1">
        &lt;div class="<span class="tw-tip">flex<span class="tw-tb">display: flex — utilitário atômico. JIT só gera o CSS desta classe se ela aparecer em algum arquivo do seu projeto.</span></span> <span class="tw-tip">p-4<span class="tw-tb">padding: 1rem (4 × 0.25rem). O número segue a escala de spacing do tema.</span></span> <span class="tw-tip">bg-blue-600<span class="tw-tb">background-color: #2563eb. Classes com cor+número — JIT gera só as que você usa.</span></span> <span class="tw-tip">hover:bg-blue-700<span class="tw-tb">Aplica bg-blue-700 no :hover. Variantes como hover:, dark:, md: geram seletores CSS completos automaticamente.</span></span>"&gt;
      </div>
    </div>
    <div class="tw-arr">→</div>
    <div style="display:flex;flex-direction:column;gap:6px;flex:0.6;text-align:center">
      <div style="font-size:10px;color:#475569">Scanner varre todos os arquivos</div>
      <div style="font-size:10px;color:#475569">Encontra classes completas</div>
      <div style="font-size:10px;color:#475569">Gera apenas o CSS delas</div>
    </div>
    <div class="tw-arr">→</div>
    <div class="tw-box" style="flex:1">
      <div style="font-size:9px;color:#4ade80;letter-spacing:.1em;text-transform:uppercase;margin-bottom:8px">CSS gerado (só isso)</div>
      <div style="color:#94a3b8;line-height:2.1">
        .flex { display: flex }<br>
        .p-4 { padding: 1rem }<br>
        .bg-blue-600 { background-color: #2563eb }<br>
        .hover\\:bg-blue-700:hover { background-color: #1d4ed8 }
      </div>
    </div>
  </div>
  <div style="background:#1e293b;border:1px solid #0c2a3a;border-radius:8px;padding:10px 14px;margin-top:10px;font-size:11px;color:#475569">
    <strong style="color:#94a3b8">Sem purge manual:</strong> JIT analisa em tempo real. CSS final tem apenas as classes que existem no código — zero CSS morto independente do número de utilitários Tailwind disponíveis.
  </div>
</div>`,
        caption: "JIT = zero CSS morto. O scanner lê seus arquivos, encontra classes completas e gera exatamente o CSS necessário.",
      },
    ],
    gotchas: [
      "Classes dinâmicas (bg-${color}-500) não funcionam — Tailwind não encontra classes parciais em purge. Use mapa de classes completas.",
      "Muitas classes no JSX prejudicam legibilidade. Use cn(), cva ou @apply para componentes reutilizáveis.",
      "Conflitos de classe (duas classes que afetam mesma propriedade): última vence no CSS mas não necessariamente no JSX — use tailwind-merge.",
    ],
    resources: [
      { title: "Tailwind CSS docs", url: "https://tailwindcss.com/docs", kind: "docs" },
      { title: "shadcn/ui", url: "https://ui.shadcn.com/", kind: "docs" },
      { title: "cva docs", url: "https://cva.style/docs", kind: "docs" },
    ],
  },

  "zod": {
    tagline: "Schema validation TypeScript-first com inferência de tipo automática.",
    why: "Zod se tornou padrão para validação de input em TypeScript. Integra com React Hook Form, tRPC, Prisma, OpenAI structured outputs. Saber criar schemas compostos, transformações e usar .parse vs .safeParse é básico para sênior.",
    summary: "Zod é uma biblioteca de schema declaration e validation TypeScript-first. Você define o schema uma vez e Zod infere o tipo TypeScript automaticamente (z.infer<typeof schema>). Funciona em runtime para validar dados externos (forms, APIs, env vars).",
    keypoints: [
      { title: "Schema declaration", body: "z.string(), z.number(), z.boolean(), z.object({}), z.array(), z.union(), z.enum(), z.literal(). Métodos encadeados: .min(), .max(), .email(), .optional(), .nullable(), .default().", code: `const userSchema = z.object({
  name:  z.string().min(2).max(100),
  email: z.string().email(),
  age:   z.number().int().min(18).optional(),
  role:  z.enum(['admin', 'user']).default('user'),
})` },
      { title: "z.infer", body: "Extrai o tipo TypeScript do schema: type User = z.infer<typeof userSchema>. Elimina duplicação entre runtime validation e tipos TS. Uma fonte de verdade para schema e tipo.", code: `const userSchema = z.object({ name: z.string(), age: z.number() })
type User = z.infer<typeof userSchema>
// { name: string; age: number }` },
      { title: ".parse vs .safeParse", body: ".parse lança ZodError se inválido. .safeParse retorna { success, data } ou { success: false, error } sem lançar. Use .safeParse em contextos onde você trata o erro (Server Actions, API handlers).", code: `// safeParse — não lança
const result = schema.safeParse(input)
if (!result.success) {
  const errors = result.error.flatten().fieldErrors
  return { error: errors }
}
const data = result.data // tipado corretamente` },
      { title: "Transformações", body: ".transform() converte o valor após validação. .preprocess() converte antes. Útil para coercion (string para number, string para Date). z.coerce.number() faz coercion automática.", code: `const dateSchema = z.string().transform(s => new Date(s))
const numSchema  = z.coerce.number() // '42' → 42

const trimmed = z.string().transform(s => s.trim().toLowerCase())` },
      { title: "Composição de schemas", body: ".extend(), .merge(), .pick(), .omit(), .partial() manipulam schemas existentes. Permite reutilizar schemas base e derivar variações sem duplicação.", code: `const base = z.object({ id: z.string(), name: z.string() })
const create = base.omit({ id: true })  // sem id no POST
const update = base.partial()           // todos opcionais no PATCH` },
    ],
    interview: [
      {
        q: "Qual a diferença entre .parse() e .safeParse()?",
        a: "<p><strong>.parse()</strong>: lança ZodError se o input for inválido. Use em contextos onde falha deve parar a execução (inicialização de app, validação de env vars).</p><p><strong>.safeParse()</strong>: retorna <code>{ success: true, data }</code> ou <code>{ success: false, error }</code> sem lançar. Use quando você quer tratar o erro programaticamente — Server Actions, API handlers, formulários.</p><p>Regra prática: safeParse em runtime com input do usuário, parse em startup com configuração interna.</p>",
        tip: "Mostrar o caso de uso de validação de env vars com parse() (app falha no startup com erro claro) é diferencial real.",
        level: "pleno",
      },
      {
        q: "Como Zod elimina duplicação entre schema e tipos TypeScript?",
        a: "<p>Sem Zod: você declara o tipo TypeScript e escreve validação separada — duas fontes de verdade que podem divergir. Com Zod: declare o schema uma vez e use z.infer<typeof schema> para extrair o tipo automaticamente. O tipo é gerado a partir do schema, nunca o contrário.</p><p>Isso garante que se você mudar o schema (adicionar um campo obrigatório), o tipo TypeScript muda junto e o compilador aponta onde o código precisa ser atualizado.</p>",
        level: "pleno",
      },
      {
        q: "Como você valida variáveis de ambiente com Zod?",
        a: "<p>Padrão comum em projetos Next.js: crie um arquivo env.ts que valida process.env com um schema Zod no startup.</p><pre><code>const envSchema = z.object({\n  DATABASE_URL: z.string().url(),\n  NEXTAUTH_SECRET: z.string().min(32),\n  NODE_ENV: z.enum(['development', 'production', 'test']),\n})\nexport const env = envSchema.parse(process.env)</code></pre><p>Se uma variável obrigatória faltar, o app falha no startup com mensagem clara — não em produção com comportamento imprevisível.</p>",
        tip: "Validação de env vars é um dos casos de uso mais práticos de Zod. Quem usa isso em produção claramente entende o valor real.",
        level: "pleno",
      },
      {
        q: "O que são transformações em Zod e quando usá-las?",
        a: "<p>.transform() converte o valor validado para outro formato. .preprocess() converte antes da validação (coercion). z.coerce.* faz coercion automática (string → number, string → Date).</p><p>Casos reais: campos de data que chegam como string ISO precisam virar Date; campos numéricos em query params chegam como string; campos de texto precisam de trim/lowercase antes de salvar.</p>",
        level: "pleno",
      },
      {
        q: "Como compor schemas Zod para criar variações (create vs update)?",
        a: "<p>Zod tem métodos de composição: .pick() seleciona campos, .omit() exclui, .partial() torna todos opcionais, .required() torna todos obrigatórios, .extend() adiciona campos, .merge() combina dois schemas.</p><p>Padrão CRUD: um schema base com todos os campos, create omite id (gerado pelo banco), update usa partial (nem todo campo obrigatório em PATCH).</p>",
        tip: "Mostrar o padrão base → create/update com omit e partial demonstra uso real — não apenas conhecimento da API.",
        level: "pleno",
      },
      {
        q: "Como usar Zod com React Hook Form?",
        a: "<p>Instale @hookform/resolvers. Use zodResolver(schema) como resolver do useForm. O RHF usa o schema para validação e inferência de tipos dos campos automaticamente.</p><pre><code>const form = useForm&lt;z.infer&lt;typeof formSchema&gt;&gt;({\n  resolver: zodResolver(formSchema),\n  defaultValues: { email: '', name: '' },\n})</code></pre><p>Com isso, type safety do campo, validação automática e mensagens de erro do schema sem código manual.</p>",
        level: "pleno",
      },
    ],
    diagrams: [
      {
        title: "Zod — uma fonte de verdade para schema e tipo",
        html: `<style>
.zod-diag{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.zod-box{background:#1e293b;border:1.5px solid #334155;border-radius:8px;padding:12px 16px;font-size:11px}
.zod-bad{border-color:#ef4444;background:#1e0f0f}
.zod-good{border-color:#4ade80;background:#0f1e13}
.zod-label{font-size:9px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:8px}
</style>
<div class="zod-diag">
  <p style="color:#e2e8f0;font-size:12px;font-weight:700;margin:0 0 16px">Zod — uma fonte de verdade, dois benefícios</p>
  <div style="display:flex;gap:12px;margin-bottom:12px">
    <div class="zod-box zod-bad" style="flex:1">
      <div class="zod-label" style="color:#ef4444">Sem Zod — duas fontes de verdade</div>
      <div style="color:#94a3b8;line-height:2">
        <span style="color:#475569">// tipo TypeScript</span><br>
        <span style="color:#7c3aed">type</span> User = { name: <span style="color:#38bdf8">string</span>; age: <span style="color:#38bdf8">number</span> }<br><br>
        <span style="color:#475569">// validação separada (pode divergir!)</span><br>
        <span style="color:#7c3aed">if</span> (<span style="color:#7c3aed">typeof</span> body.name !== <span style="color:#4ade80">'string'</span>) ...<br>
        <span style="color:#7c3aed">if</span> (<span style="color:#7c3aed">typeof</span> body.age  !== <span style="color:#4ade80">'number'</span>) ...
      </div>
    </div>
    <div class="zod-box zod-good" style="flex:1">
      <div class="zod-label" style="color:#4ade80">Com Zod — uma fonte de verdade</div>
      <div style="color:#94a3b8;line-height:2">
        <span style="color:#475569">// schema = validação + tipo</span><br>
        <span style="color:#7c3aed">const</span> userSchema = z.object({<br>
        &nbsp; name: z.string(),<br>
        &nbsp; age:  z.number(),<br>
        })<br>
        <span style="color:#7c3aed">type</span> User = z.<span style="color:#4ade80">infer</span>&lt;<span style="color:#7c3aed">typeof</span> userSchema&gt;
      </div>
    </div>
  </div>
  <div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:10px 14px;font-size:11px;color:#475569;line-height:1.8">
    <strong style="color:#94a3b8">Fluxo:</strong> schema → .parse(input) em runtime valida os dados → z.infer extrai o tipo em compile-time → sem divergência possível entre validação e tipo.
  </div>
</div>`,
        caption: "Schema Zod = validação em runtime + tipo TypeScript automaticamente. Mudar o schema atualiza o tipo — o compilador aponta onde o código quebra.",
      },
    ],
    gotchas: [
      "ZodError tem formato verbose. Use .flatten() ou .formErrors para mensagens amigáveis em formulários.",
      ".optional() é diferente de .nullable(): optional = pode ser undefined; nullable = pode ser null. Para ambos: .nullish().",
      "Zod valida apenas em runtime. O tipo TypeScript inferido é apenas compile-time — não garante nada sem o .parse().",
    ],
    resources: [
      { title: "Zod docs", url: "https://zod.dev/", kind: "docs" },
      { title: "Total TypeScript — Zod tutorial", url: "https://www.totaltypescript.com/tutorials/zod", kind: "curso" },
    ],
  },

  "server-components-rsc": {
    tagline: "Componentes React que rodam no servidor: zero JS cliente, acesso direto a recursos.",
    why: "RSC é a mudança mais significativa no React desde hooks. Entender o modelo mental (servidor vs cliente), quando usar cada um, e como evitar pitfalls é requisito em vaga Next.js sênior 2024+.",
    summary: "React Server Components (RSC) rodam exclusivamente no servidor. São renderizados para um formato especial (RSC payload) que o cliente usa para montar o DOM. Podem fazer fetch direto de banco, ler arquivos, usar secrets. Não enviam JS ao cliente. Client Components ('use client') são os tradicionais — interativos, com state e event handlers.",
    keypoints: [
      { title: "Server vs Client Component", body: "Server Component: sem 'use client', roda no servidor, pode acessar DB/FS/env, sem state/events, zero JS ao cliente. Client Component: 'use client' no topo, roda no browser (e também no servidor na hidratação), pode usar state/effects/events.", code: `// Server Component (default no App Router)
async function UserPage({ params }) {
  const user = await db.user.findUnique({ where: { id: params.id } })
  return <UserProfile user={user} />  // zero JS ao cliente
}

// Client Component
'use client'
function Counter() {
  const [n, setN] = useState(0)
  return <button onClick={() => setN(n+1)}>{n}</button>
}` },
      { title: "Composição correta", body: "Server Components podem passar Client Components como children ou props. Client Components NÃO podem importar Server Components — mas podem recebê-los como children (padrão de composição recomendado).", code: `// ✓ Correto: Server Component envolve Client
// page.tsx (Server)
export default function Page() {
  return (
    <Shell>            {/* Client Component */}
      <DataTable />    {/* Server Component como children */}
    </Shell>
  )
}

// ✗ Errado: Client importando Server
'use client'
import { ServerComp } from './server' // erro!` },
      { title: "Streaming e Suspense", body: "Server Components suportam streaming: enviam HTML incrementalmente ao browser conforme ficam prontos. Suspense boundary mostra fallback enquanto componentes carregam. Melhora Time To First Byte sem bloquear a página toda.", code: `export default function Page() {
  return (
    <>
      <Header />          {/* imediato */}
      <Suspense fallback={<Skeleton />}>
        <SlowDataTable /> {/* streamado quando pronto */}
      </Suspense>
    </>
  )
}` },
      { title: "Data fetching direto", body: "Faça fetch diretamente em Server Components — sem useEffect, sem useState. Múltiplos fetches em paralelo com Promise.all. Next.js deduplica fetches idênticos na mesma request (request memoization).", code: `async function Page() {
  // fetches em paralelo
  const [user, posts] = await Promise.all([
    fetch('/api/user').then(r => r.json()),
    db.post.findMany({ where: { published: true } }),
  ])
  return <Layout user={user} posts={posts} />
}` },
      { title: "Server Actions", body: "Funções marcadas com 'use server' que rodam no servidor e são chamadas do cliente via RPC. Permitem mutations (forms, updates) sem criar endpoint de API separado. Integram com formulários HTML nativamente.", code: `'use server'
export async function createPost(formData: FormData) {
  const title = formData.get('title') as string
  await db.post.create({ data: { title } })
  revalidatePath('/posts')
}

// No Client Component:
<form action={createPost}>
  <input name="title" />
  <button type="submit">Criar</button>
</form>` },
    ],
    interview: [
      {
        q: "Qual a diferença entre Server Component e Client Component?",
        a: "<p><strong>Server Component</strong>: roda apenas no servidor. Zero JavaScript enviado ao browser. Pode acessar banco de dados, filesystem, variáveis de ambiente diretamente. Não pode usar state (useState), efeitos (useEffect) ou eventos do browser (onClick).</p><p><strong>Client Component</strong>: marcado com 'use client'. Roda no browser (e também no servidor durante hidratação — em ambos). Pode usar toda a API React: hooks, eventos, browser APIs.</p><p>No App Router do Next.js, todos os componentes são Server Components por padrão — você opta para Client com 'use client'.</p>",
        tip: "A pegadinha: 'use client' não impede o componente de rodar no servidor durante SSR/hidratação — ele roda nos dois lugares. Mencionar isso é diferencial claro.",
        level: "pleno",
      },
      {
        q: "Por que 'use client' infecta a árvore de componentes?",
        a: "<p>Quando você marca um componente com 'use client', todos os componentes importados por ele também se tornam Client Components — mesmo sem terem a diretiva. Isso acontece porque o bundle do cliente precisa incluir tudo que o componente pode precisar renderizar.</p><p>Padrão correto: empurre 'use client' para as folhas da árvore. Mantenha componentes de dados e layout como Server Components. Componentes interativos (botões, forms, menus) ficam como Client nos seus próprios arquivos.</p>",
        tip: "A solução de passar Server Components como children (children prop) para um Client Component shell é o padrão avançado que diferencia sênior.",
        level: "senior",
      },
      {
        q: "Como você faz data fetching em Server Components?",
        a: "<p>Diretamente — sem useEffect, sem useState. Server Components podem ser async functions que aguardam fetches ou queries ao banco.</p><p>Para fetches em paralelo: Promise.all evita waterfalls sequenciais. Next.js deduplica fetches idênticos na mesma request (request memoization) — dois Server Components fazendo o mesmo fetch recebem a mesma resposta sem duplo hit de rede.</p><p>Benefício principal: zero round trip cliente-servidor. Os dados chegam no HTML inicial — sem loading state visível ao usuário.</p>",
        level: "pleno",
      },
      {
        q: "Quando usar Server Actions vs API Routes?",
        a: "<p><strong>Server Actions</strong>: mutations internas do app (criar post, atualizar perfil, deletar item). Integram com formulários HTML nativamente. Auth via cookies automático. Não expostas como endpoint público.</p><p><strong>API Routes</strong>: endpoints HTTP públicos consumidos por clientes externos (mobile app, terceiros, webhooks). Precisam de acesso público. Server Actions não servem para webhooks (Stripe, GitHub) porque requerem contexto Next.js.</p>",
        level: "senior",
      },
      {
        q: "O que é streaming com React Server Components?",
        a: "<p>Ao invés de aguardar todos os dados antes de enviar HTML, o servidor envia HTML incrementalmente conforme cada parte fica pronta. O browser renderiza progressivamente.</p><p>Implementação: envolva componentes lentos em Suspense. O fallback (skeleton) aparece imediatamente no HTML. Quando o dado chega, o chunk de HTML do componente real é enviado e substitui o skeleton — sem re-fetch no cliente.</p><p>Impacto: TTFB melhora, o usuário vê conteúdo progressivamente ao invés de página em branco aguardando todos os dados.</p>",
        tip: "A distinção de que o HTML do componente real é streamado — não há fetch no cliente depois — é o que a maioria não sabe explicar.",
        level: "senior",
      },
      {
        q: "Dados sensíveis (API keys) estão seguros em Server Components?",
        a: "<p>Sim, desde que não sejam passados como props para Client Components. Server Components nunca enviam seu código ou dados internos ao browser — apenas o HTML/RSC payload renderizado.</p><p>Mas cuidado: se você passa process.env.SECRET_KEY como prop para um Client Component, esse valor vai aparecer no payload enviado ao browser. Use bibliotecas como 'server-only' para garantir que módulos com secrets não sejam importados por Client Components acidentalmente.</p>",
        level: "pleno",
      },
    ],
    diagrams: [
      {
        title: "Server vs Client Component — o que roda onde",
        html: `<style>
.rsc-diag{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.rsc-col{background:#1e293b;border-radius:10px;padding:14px 16px;border:1.5px solid #334155;flex:1}
.rsc-tag{display:inline-block;font-size:10px;padding:2px 7px;border-radius:4px;margin-bottom:4px}
.rsc-row{display:flex;align-items:center;gap:6px;font-size:11px;color:#94a3b8;margin-bottom:6px}
.rsc-chk{color:#4ade80;font-size:13px}
.rsc-x{color:#ef4444;font-size:13px}
</style>
<div class="rsc-diag">
  <p style="color:#e2e8f0;font-size:12px;font-weight:700;margin:0 0 16px">React Server Components — o que cada lado pode fazer</p>
  <div style="display:flex;gap:10px;margin-bottom:12px">
    <div class="rsc-col">
      <div style="font-size:9px;color:#4ade80;letter-spacing:.1em;text-transform:uppercase;margin-bottom:10px">Server Component</div>
      <div><span class="rsc-tag" style="background:#1c3a2a;color:#4ade80">padrão no App Router</span></div>
      <br>
      <div class="rsc-row"><span class="rsc-chk">✓</span> Acessar banco de dados</div>
      <div class="rsc-row"><span class="rsc-chk">✓</span> Ler variáveis de ambiente</div>
      <div class="rsc-row"><span class="rsc-chk">✓</span> Ler filesystem</div>
      <div class="rsc-row"><span class="rsc-chk">✓</span> Zero JS enviado ao browser</div>
      <div class="rsc-row"><span class="rsc-chk">✓</span> Async functions nativas</div>
      <br>
      <div class="rsc-row"><span class="rsc-x">✗</span> useState / useReducer</div>
      <div class="rsc-row"><span class="rsc-x">✗</span> useEffect / useRef</div>
      <div class="rsc-row"><span class="rsc-x">✗</span> onClick, onChange, eventos</div>
      <div class="rsc-row"><span class="rsc-x">✗</span> window, localStorage, document</div>
    </div>
    <div class="rsc-col">
      <div style="font-size:9px;color:#38bdf8;letter-spacing:.1em;text-transform:uppercase;margin-bottom:10px">Client Component ('use client')</div>
      <div><span class="rsc-tag" style="background:#0c2a3a;color:#38bdf8">roda no browser + servidor (SSR)</span></div>
      <br>
      <div class="rsc-row"><span class="rsc-chk">✓</span> useState, useReducer, hooks</div>
      <div class="rsc-row"><span class="rsc-chk">✓</span> useEffect, useRef, useContext</div>
      <div class="rsc-row"><span class="rsc-chk">✓</span> onClick, onChange, eventos</div>
      <div class="rsc-row"><span class="rsc-chk">✓</span> window, localStorage, document</div>
      <div class="rsc-row"><span class="rsc-chk">✓</span> Receber Server Components via children</div>
      <br>
      <div class="rsc-row"><span class="rsc-x">✗</span> Importar Server Components diretamente</div>
      <div class="rsc-row"><span class="rsc-x">✗</span> Acessar banco/secrets diretamente</div>
    </div>
  </div>
  <div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:10px 14px;font-size:11px;color:#475569;line-height:1.8">
    <strong style="color:#94a3b8">Padrão de composição:</strong> Server Component envolve Client Component. Passe Server Components como <code style="color:#e2e8f0">children</code> para Client Components shell — assim a interatividade fica na borda e os dados ficam no servidor.
  </div>
</div>`,
        caption: "Server Components = dados + zero JS. Client Components = interatividade. Empurre 'use client' para as folhas da árvore.",
      },
    ],
    gotchas: [
      "'use client' infecta a árvore: todos os filhos de um Client Component são Client Components, mesmo sem a diretiva.",
      "Passar funções de servidor para cliente requer Server Actions. Não passe funções comuns como props para Client Components.",
      "Dados sensíveis (API keys) seguros em Server Components — nunca chegam ao cliente. Mas se você passar como prop para Client Component, vão.",
    ],
    resources: [
      { title: "React docs — Server Components", url: "https://react.dev/reference/rsc/server-components", kind: "docs" },
      { title: "Next.js — Server and Client Components", url: "https://nextjs.org/docs/app/building-your-application/rendering/server-components", kind: "docs" },
      { title: "Josh Comeau — Making Sense of RSC", url: "https://www.joshwcomeau.com/react/server-components/", kind: "artigo" },
    ],
  },

  "trpc": {
    tagline: "RPC type-safe end-to-end entre servidor e cliente sem schema separado.",
    why: "tRPC elimina o contrato manual entre frontend e backend TypeScript. Leve, sem codegen, integra com React Query. Popular em stacks Next.js + TypeScript. Entender quando tRPC vs REST/GraphQL é ponto de entrevista.",
    summary: "tRPC permite criar APIs type-safe sem schema definition language. O servidor define procedures (queries e mutations) e o cliente as consome com tipos automaticamente inferidos. Usa React Query no cliente para caching. Ideal para monorepos TypeScript onde frontend e backend compartilham tipos.",
    keypoints: [
      { title: "Router e procedures", body: "Router agrupa procedures. Procedure pode ser query (leitura) ou mutation (escrita). Input validado com Zod. Output inferido automaticamente.", code: `// server: router com procedures
const appRouter = router({
  user: router({
    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return db.user.findUnique({ where: { id: input.id } })
      }),
    create: protectedProcedure
      .input(z.object({ name: z.string() }))
      .mutation(async ({ input, ctx }) => {
        return db.user.create({ data: { ...input, userId: ctx.userId } })
      }),
  }),
})
export type AppRouter = typeof appRouter` },
      { title: "Type safety end-to-end", body: "Cliente importa apenas o tipo AppRouter do servidor. Mudança no procedure — campo adicionado, tipo alterado — é refletida no cliente em tempo de compilação sem codegen.", code: `// client: tipos inferidos automaticamente
const user = trpc.user.getById.useQuery({ id: '123' })
// user.data é tipado com o retorno exato do servidor` },
      { title: "Middleware e contexto", body: "t.procedure.use(middleware) adiciona lógica antes de procedures. O contexto (ctx) é construído uma vez por request e passado para todos os procedures — padrão para autenticação e injeção de dependências.", code: `const protectedProcedure = publicProcedure.use(({ ctx, next }) => {
  if (!ctx.session) throw new TRPCError({ code: 'UNAUTHORIZED' })
  return next({ ctx: { ...ctx, userId: ctx.session.userId } })
})` },
      { title: "React Query integration", body: "tRPC usa React Query embaixo. Você tem acesso a useQuery, useMutation, useInfiniteQuery com types completos do servidor. Invalida queries via utils.invalidate().", code: `const utils = trpc.useUtils()
const mutation = trpc.post.create.useMutation({
  onSuccess: () => utils.post.list.invalidate(),
})` },
      { title: "Quando NÃO usar tRPC", body: "tRPC requer TypeScript no servidor e no cliente compartilhando código. Não funciona para APIs públicas consumidas por clientes não-TypeScript (mobile nativo, terceiros), webhooks recebidos de serviços externos, ou quando o backend é de uma equipe diferente com outra linguagem." },
    ],
    interview: [
      {
        q: "Como tRPC garante type safety sem codegen?",
        a: "<p>tRPC usa o sistema de tipos TypeScript diretamente. O servidor define um AppRouter — um tipo que descreve todas as procedures, inputs e outputs. O cliente importa apenas esse tipo (não o código — só o tipo, que é apagado em runtime) e usa para inferir os tipos de todas as chamadas.</p><p>Sem codegen porque TypeScript já consegue atravessar os tipos importados e inferir o que a procedure retorna. Mudou o servidor? O erro aparece no cliente em compile-time.</p>",
        tip: "Explicar que é o sistema de tipos do TS fazendo o trabalho — não geração de código — é o que diferencia quem entende de quem só usa.",
        level: "senior",
      },
      {
        q: "Quando usar tRPC vs REST vs GraphQL?",
        a: "<p><strong>tRPC</strong>: stack TypeScript full-stack no mesmo repositório ou monorepo. Cliente e servidor controlados pela mesma equipe. Sem clientes externos. DX máxima, zero contrato explícito.</p><p><strong>REST</strong>: API pública ou consumida por múltiplos clientes (mobile, terceiros). Versionável, cacheable por HTTP, sem dependência de TypeScript no cliente.</p><p><strong>GraphQL</strong>: cliente precisa de flexibilidade para compor queries (BFF pattern, múltiplos clientes com necessidades diferentes). Overhead de schema definition e codegen se justifica pela flexibilidade.</p>",
        tip: "Saber quando não usar tRPC é tão importante quanto saber usá-lo. Citar a limitação de clientes externos mostra maturidade.",
        level: "senior",
      },
      {
        q: "Como você implementa autenticação em procedures tRPC?",
        a: "<p>Via middleware e contexto. O contexto é construído uma vez por request (ex: decodifica o JWT do cookie/header). Um protectedProcedure estende publicProcedure com um middleware que verifica ctx.session — lança UNAUTHORIZED se ausente. Todas as procedures que requerem auth estendem protectedProcedure.</p><p>O contexto tipado garante que dentro de um protectedProcedure, ctx.userId existe — TypeScript sabe disso.</p>",
        level: "pleno",
      },
      {
        q: "Como tRPC se integra com React Query?",
        a: "<p>tRPC usa React Query como engine de caching no cliente. Queries mapeiam para useQuery, mutations para useMutation, paginação para useInfiniteQuery — todos com tipos inferidos do servidor.</p><p>Para invalidação: trpc.useUtils() expõe os mesmos helpers do queryClient mas com tipos tRPC. utils.post.list.invalidate() invalida todas as queries de post.list sem passar query keys manualmente.</p>",
        level: "pleno",
      },
      {
        q: "Como você versiona uma API tRPC?",
        a: "<p>Versionar é o maior ponto fraco do tRPC: breaking changes no servidor quebram o cliente imediatamente (em compile-time — o que é bom). Estratégias: (1) Deprecate fields com comentários JSDoc @deprecated antes de remover. (2) Manter procedures antigas por um período. (3) Para apps mobile que não atualizam instantaneamente, considere REST ou GraphQL.</p><p>tRPC é ideal quando o servidor e o cliente deployam juntos (monorepo, Next.js full-stack). Quando há clientes que não atualizam em sincronia, o acoplamento forte é um problema.</p>",
        tip: "Citar essa limitação honestamente é o que sênior faz. Entrevistador quer ver que você conhece os tradeoffs.",
        level: "senior",
      },
      {
        q: "O que são subscriptions no tRPC?",
        a: "<p>tRPC suporta subscriptions via WebSocket para comunicação em tempo real. O servidor emite eventos via async generators, o cliente recebe com useSubscription. Requer configuração do transport WebSocket além do HTTP padrão.</p><p>Alternativa mais simples para muitos casos: Server-Sent Events (SSE) ou polling com staleTime baixo no React Query. Subscriptions tRPC fazem sentido para notificações em tempo real, colaboração, chats.</p>",
        level: "senior",
      },
    ],
    diagrams: [
      {
        title: "tRPC — type safety end-to-end sem codegen",
        html: `<style>
.trpc-diag{font-family:'JetBrains Mono',monospace;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.trpc-box{background:#1e293b;border:1.5px solid #334155;border-radius:8px;padding:12px 14px;font-size:11px}
.trpc-arr{color:#398ccb;text-align:center;font-size:22px;line-height:1}
.trpc-label{font-size:9px;letter-spacing:.1em;text-transform:uppercase;font-weight:700;margin-bottom:8px}
</style>
<div class="trpc-diag">
  <p style="color:#e2e8f0;font-size:12px;font-weight:700;margin:0 0 16px">tRPC — um tipo viaja do servidor ao cliente</p>
  <div style="display:flex;gap:8px;align-items:center">
    <div class="trpc-box" style="flex:1;border-color:#398ccb">
      <div class="trpc-label" style="color:#398ccb">Servidor</div>
      <div style="color:#94a3b8;line-height:2">
        <span style="color:#475569">// define a procedure</span><br>
        <span style="color:#7c3aed">const</span> appRouter = router({<br>
        &nbsp; getUser: procedure<br>
        &nbsp;&nbsp; .input(z.object({ id: <span style="color:#38bdf8">string</span> }))<br>
        &nbsp;&nbsp; .query(<span style="color:#7c3aed">async</span> ({ input }) =&gt; {<br>
        &nbsp;&nbsp;&nbsp; <span style="color:#7c3aed">return</span> db.user.findUnique(...)<br>
        &nbsp;&nbsp; }),<br>
        })<br>
        <span style="color:#7c3aed">export type</span> AppRouter = <span style="color:#7c3aed">typeof</span> appRouter
      </div>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;gap:2px">
      <div style="font-size:9px;color:#398ccb;text-align:center;white-space:nowrap">só o tipo<br>viaja →</div>
      <div class="trpc-arr">→</div>
      <div style="font-size:9px;color:#475569;text-align:center">(sem codegen)</div>
    </div>
    <div class="trpc-box" style="flex:1;border-color:#4ade80">
      <div class="trpc-label" style="color:#4ade80">Cliente</div>
      <div style="color:#94a3b8;line-height:2">
        <span style="color:#475569">// tipos inferidos automaticamente</span><br>
        <span style="color:#7c3aed">const</span> { data } = trpc.getUser.useQuery(<br>
        &nbsp; { id: <span style="color:#4ade80">'123'</span> }<br>
        )<br>
        <span style="color:#475569">// data é tipado com o retorno exato</span><br>
        <span style="color:#475569">// do servidor — sem declarar nada</span>
      </div>
    </div>
  </div>
  <div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:10px 14px;margin-top:10px;font-size:11px;color:#475569;line-height:1.8">
    <strong style="color:#94a3b8">Sem codegen:</strong> TypeScript importa o tipo AppRouter e infere tudo a partir daí. Mudar o tipo de retorno no servidor → erro no cliente em compile-time.
  </div>
</div>`,
        caption: "O tipo AppRouter viaja do servidor ao cliente em tempo de compilação — sem gerar arquivos intermediários. Runtime: chamadas HTTP normais.",
      },
    ],
    gotchas: [
      "tRPC só funciona em stacks onde servidor e cliente compartilham código TypeScript. Não serve para APIs públicas ou clientes não-TypeScript.",
      "Versionar API com tRPC é difícil — breaking changes chegam ao cliente imediatamente. Use com cuidado em APIs que clientes externos consomem.",
      "Subscriptions requerem transporte WebSocket além do HTTP padrão — configuração adicional no servidor.",
    ],
    resources: [
      { title: "tRPC docs", url: "https://trpc.io/docs", kind: "docs" },
      { title: "tRPC + Next.js example", url: "https://trpc.io/docs/client/nextjs/setup", kind: "docs" },
    ],
  },

  "web-vitals": {
    tagline: "Métricas do Google para medir UX real: LCP, INP, CLS — Core Web Vitals.",
    why: "Web Vitals afetam ranking SEO e percepção de qualidade. Sênior precisa saber o que cada métrica mede, o que causa regressão e como corrigir — e a diferença entre lab data e field data.",
    summary: "Core Web Vitals são 3 métricas do Google: LCP (Largest Contentful Paint) — velocidade de carregamento percebida, INP (Interaction to Next Paint) — responsividade a interações, CLS (Cumulative Layout Shift) — estabilidade visual. Medidos por field data (usuários reais via CrUX) e lab data (Lighthouse, PageSpeed Insights). INP substituiu FID em março de 2024.",
    keypoints: [
      { title: "LCP — Largest Contentful Paint", body: "Tempo até o maior elemento visível (imagem hero, bloco de texto) ser renderizado. Ideal < 2.5s. Causas de LCP ruim: render-blocking CSS/JS, servidor lento, imagem grande sem preload, sem CDN. Fix: preload LCP image com <link rel=preload>, otimize TTFB com CDN, converta imagens para WebP/AVIF." },
      { title: "INP — Interaction to Next Paint", body: "Latência da interação mais lenta durante toda a visita (P98). Substitui FID desde março 2024. Ideal < 200ms. Causas: long tasks no main thread, JS pesado sincronizado, rendering caro após interação. Fix: quebrar long tasks com scheduler.yield(), usar web workers para cálculo pesado, deferir scripts não críticos." },
      { title: "CLS — Cumulative Layout Shift", body: "Soma de shifts inesperados de layout durante a visita. Ideal < 0.1. Causas: imagens sem dimensão definida, ads ou embeds injetados dinamicamente, fontes web com fallback diferente (FOUT). Fix: sempre defina width/height em imagens, reserve espaço para embeds com min-height, use font-display: optional para fontes críticas." },
      { title: "Lab data vs field data", body: "Lab data (Lighthouse, WebPageTest): condições controladas, reproduzível, bom para debugging. Field data (CrUX via PageSpeed Insights, Search Console): usuários reais com dispositivos e conexões variados. Google usa field data para ranking. Ter boa pontuação no Lighthouse não garante bons Core Web Vitals em produção." },
      { title: "Ferramentas e monitoramento", body: "PageSpeed Insights: field + lab data por URL. Lighthouse: lab data local ou CI. CrUX (Chrome UX Report): field data agregado por origem. web-vitals JS library: medição em produção com envio para analytics. Vercel Speed Insights, DataDog RUM: monitoramento contínuo." },
    ],
    interview: [
      {
        q: "O que são Core Web Vitals e por que importam para um dev frontend?",
        a: "<p>Core Web Vitals são 3 métricas que medem a experiência do usuário em produção: LCP (velocidade de carregamento percebida), INP (responsividade a interações), CLS (estabilidade visual).</p><p>Importam porque: (1) são fatores de ranking no Google desde 2021 — performance ruim penaliza SEO; (2) refletem problemas reais de UX que causam abandono; (3) são responsabilidade direta do frontend — imagens, fonts, JS pesado, layout instável.</p>",
        tip: "Conectar cada métrica a uma causa que você controla como dev (LCP → imagem sem preload, CLS → imagem sem dimensão) mostra que você entende além das definições.",
        level: "pleno",
      },
      {
        q: "O que causa LCP ruim e como corrigir?",
        a: "<p>Causas mais comuns: (1) Imagem hero sem preload — o browser descobre a imagem tarde, após parsear HTML e CSS. Fix: <code>&lt;link rel=preload as=image href=hero.webp&gt;</code>. (2) TTFB alto — servidor lento ou sem CDN. Fix: CDN + cache de resposta. (3) Imagem não otimizada — formato JPEG/PNG pesado. Fix: WebP/AVIF + <code>&lt;img loading=eager&gt;</code> no LCP. (4) Render-blocking scripts no head. Fix: defer ou async em scripts não críticos.</p>",
        tip: "Preload do LCP element é a correção mais impactante e menos conhecida. Mencionar isso primeiro mostra que você vai além do óbvio.",
        level: "pleno",
      },
      {
        q: "Por que INP substituiu FID como Core Web Vital?",
        a: "<p>FID (First Input Delay) media apenas a latência da primeira interação do usuário com a página. INP (Interaction to Next Paint) mede a latência da interação mais lenta durante toda a visita (P98).</p><p>INP é mais representativo porque: apps interativos têm muitas interações, não apenas a primeira; usuários percebem lentidão em qualquer momento da sessão; FID era muito fácil de passar mesmo em apps com interações lentas subsequentes.</p>",
        level: "senior",
      },
      {
        q: "O que causa CLS e como você evita em um app React?",
        a: "<p>CLS acontece quando elementos se movem sem interação do usuário. Causas React: (1) Imagens sem dimensão — o browser não reserva espaço, conteúdo pula quando a imagem carrega. Fix: sempre defina width/height ou use aspect-ratio. (2) Conteúdo carregado assincronamente (dados de API) que empurra conteúdo existente. Fix: skeleton com tamanho fixo. (3) Fontes web — FOUT faz texto reflow. Fix: font-display: optional ou preload da fonte. (4) Next.js Image component resolve automaticamente LCP e CLS para imagens.</p>",
        tip: "Citar o Next.js Image como solução automática para CLS mostra que você conhece o ecossistema, não só o problema.",
        level: "pleno",
      },
      {
        q: "Qual a diferença entre lab data e field data?",
        a: "<p><strong>Lab data</strong> (Lighthouse, WebPageTest): condições controladas, conexão simulada, zero usuários reais. Reproduzível — bom para debugging e CI. Não necessariamente representa produção.</p><p><strong>Field data</strong> (CrUX): dados reais de usuários Chrome coletados anonimamente. Inclui variação de dispositivos, conexões, geografias. O Google usa field data para ranking — não lab data.</p><p>Prática: use Lighthouse para identificar problemas e medir regressões em CI. Monitore field data via Search Console e RUM (Real User Monitoring) em produção.</p>",
        level: "senior",
      },
      {
        q: "Como você monitoraria Core Web Vitals em produção?",
        a: "<p>Abordagem em camadas: (1) <strong>web-vitals JS library</strong>: instala um listener que captura LCP, INP, CLS reais de cada usuário e envia para seu analytics (GA4, Datadog, endpoint próprio). (2) <strong>Google Search Console</strong>: field data agregado por grupos de URLs — gratuito, mas com delay. (3) <strong>Vercel Speed Insights ou Datadog RUM</strong>: dashboards em tempo real com percentis por rota. (4) <strong>CI com Lighthouse</strong>: bloquear PR se performance regredir abaixo de threshold.</p>",
        tip: "Mostrar a camada CI (bloquear merge se Lighthouse cair) é o diferencial de sênior — não só medir, mas prevenir regressão.",
        level: "senior",
      },
    ],
    diagrams: [
      {
        title: "Core Web Vitals — o que cada métrica mede e os limites",
        html: `<style>
.wv-diag{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.wv-card{background:#1e293b;border-radius:10px;padding:14px 16px;flex:1;border:1.5px solid #334155}
.wv-bar{height:8px;border-radius:4px;margin:10px 0 6px;overflow:hidden;display:flex}
.wv-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(255,255,255,.2);display:inline}
.wv-tip:hover .wv-tb{display:block}
.wv-tb{display:none;position:absolute;bottom:calc(100%+8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:200px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.wv-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
</style>
<div class="wv-diag">
  <p style="color:#e2e8f0;font-size:12px;font-weight:700;margin:0 0 4px">Core Web Vitals — métricas e limites</p>
  <p style="color:#475569;font-size:10px;margin:0 0 16px">Passe o mouse nos termos <span style="border-bottom:1px dashed rgba(255,255,255,.2)">sublinhados</span></p>
  <div style="display:flex;gap:10px;margin-bottom:12px">
    <div class="wv-card">
      <div style="font-size:10px;color:#4ade80;font-weight:700;text-transform:uppercase;letter-spacing:.06em">LCP</div>
      <div style="font-size:11px;color:#94a3b8;margin:4px 0">Largest Contentful Paint</div>
      <div class="wv-bar">
        <div style="width:42%;background:#4ade80"></div>
        <div style="width:25%;background:#fb923c"></div>
        <div style="width:33%;background:#ef4444"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:9px;color:#475569"><span style="color:#4ade80">≤2.5s</span><span style="color:#fb923c">≤4s</span><span style="color:#ef4444">>4s</span></div>
      <div style="font-size:10px;color:#64748b;margin-top:8px;line-height:1.6"><span class="wv-tip">Maior elemento<span class="wv-tb">Geralmente a imagem hero ou o maior bloco de texto acima da dobra. O browser rastreia e reporta quando este elemento é pintado.</span></span> visível renderizado.<br><strong style="color:#e2e8f0">Fix:</strong> preload, CDN, WebP</div>
    </div>
    <div class="wv-card">
      <div style="font-size:10px;color:#38bdf8;font-weight:700;text-transform:uppercase;letter-spacing:.06em">INP</div>
      <div style="font-size:11px;color:#94a3b8;margin:4px 0">Interaction to Next Paint</div>
      <div class="wv-bar">
        <div style="width:50%;background:#4ade80"></div>
        <div style="width:25%;background:#fb923c"></div>
        <div style="width:25%;background:#ef4444"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:9px;color:#475569"><span style="color:#4ade80">≤200ms</span><span style="color:#fb923c">≤500ms</span><span style="color:#ef4444">>500ms</span></div>
      <div style="font-size:10px;color:#64748b;margin-top:8px;line-height:1.6"><span class="wv-tip">Interação mais lenta<span class="wv-tb">P98 de todas as interações (cliques, teclado, toque) durante a visita. Substitui FID desde março 2024.</span></span> da visita inteira.<br><strong style="color:#e2e8f0">Fix:</strong> quebrar long tasks, web workers</div>
    </div>
    <div class="wv-card">
      <div style="font-size:10px;color:#fb923c;font-weight:700;text-transform:uppercase;letter-spacing:.06em">CLS</div>
      <div style="font-size:11px;color:#94a3b8;margin:4px 0">Cumulative Layout Shift</div>
      <div class="wv-bar">
        <div style="width:40%;background:#4ade80"></div>
        <div style="width:25%;background:#fb923c"></div>
        <div style="width:35%;background:#ef4444"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:9px;color:#475569"><span style="color:#4ade80">≤0.1</span><span style="color:#fb923c">≤0.25</span><span style="color:#ef4444">>0.25</span></div>
      <div style="font-size:10px;color:#64748b;margin-top:8px;line-height:1.6"><span class="wv-tip">Shifts de layout<span class="wv-tb">Calculado como área do shift × distância percorrida / área do viewport. Soma acumulada de todos os shifts inesperados.</span></span> acumulados na visita.<br><strong style="color:#e2e8f0">Fix:</strong> dimensões em imagens, skeletons</div>
    </div>
  </div>
  <div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:10px 14px;font-size:11px;color:#475569;line-height:1.8">
    <strong style="color:#94a3b8">Field data vs lab:</strong> Google usa dados reais de usuários Chrome (CrUX) para ranking — não Lighthouse. Lighthouse bom no lab não garante Core Web Vitals bons em produção.
  </div>
</div>`,
        caption: "LCP = velocidade de carregamento percebida, INP = responsividade (substituiu FID em 2024), CLS = estabilidade visual. Google usa field data real para ranking.",
      },
    ],
    gotchas: [
      "Medir só em lab (Lighthouse) não equivale a field data real. Usuários têm conexões e dispositivos piores — Lighthouse rodando em máquina rápida é otimista.",
      "LCP em SPA pode ser alto porque o browser precisa baixar e executar JS antes de renderizar o conteúdo principal.",
      "CLS afeta acessibilidade: conteúdo se move enquanto o usuário está lendo ou prestes a clicar — cliques vão para o elemento errado.",
    ],
    resources: [
      { title: "web.dev — Core Web Vitals", url: "https://web.dev/vitals/", kind: "docs" },
      { title: "Chrome DevTools — Performance", url: "https://developer.chrome.com/docs/devtools/performance/", kind: "docs" },
      { title: "PageSpeed Insights", url: "https://pagespeed.web.dev/", kind: "pratica" },
    ],
  },

  "accessibility-a11y": {
    tagline: "Tornar a web usável por todos: tecnologia assistiva, WCAG, semântica HTML.",
    why: "Acessibilidade é requisito legal em vários países e afeta SEO. Sênior precisa entender WCAG, ARIA, foco, contraste. Empresas de médio/grande porte cada vez mais avaliam isso em entrevistas.",
    summary: "Acessibilidade (a11y) garante que pessoas com deficiência (visual, motora, cognitiva, auditiva) possam usar a web. Pilares: HTML semântico, ordem de foco, contraste de cor, textos alternativos, suporte a leitor de tela (VoiceOver, NVDA, JAWS). WCAG 2.1/2.2 são as diretrizes internacionais (A, AA, AAA). Ferramentas: axe DevTools, Lighthouse a11y audit, leitores de tela nativos.",
    keypoints: [
      { title: "HTML semântico", body: "Use elementos corretos: nav, main, aside, header, footer, h1-h6, button, input, label. Leitores de tela usam esses elementos para navegar. div e span não têm semântica — são invisíveis para tecnologia assistiva.", code: `<!-- ✗ sem semântica -->
<div onclick="submit()">Enviar</div>

<!-- ✓ semântico: foco, Enter/Space, role button automáticos -->
<button type="submit">Enviar</button>` },
      { title: "ARIA", body: "ARIA (Accessible Rich Internet Applications) adiciona semântica a elementos sem semântica nativa. Regra 1 da ARIA: use HTML nativo se possível — <button> é sempre melhor que <div role='button'>. ARIA não adiciona comportamento de teclado — só altera como o leitor de tela anuncia o elemento.", code: `<!-- ARIA para widget customizado -->
<div
  role="slider"
  aria-valuenow={value}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label="Volume"
  tabIndex={0}
  onKeyDown={handleKey}  {/* você implementa o teclado */}
/>` },
      { title: "Gerenciamento de foco", body: "Usuários de teclado navegam por Tab. Todo elemento interativo deve ser focável. :focus-visible mostra outline apenas para navegação por teclado (não mouse). Dialogs devem prender o foco enquanto abertos (focus trap) e restaurar ao fechar.", code: `/* ✗ Remove o outline — quebra navegação por teclado */
button:focus { outline: none }

/* ✓ Remove para mouse, mantém para teclado */
button:focus { outline: none }
button:focus-visible { outline: 2px solid #3178C6 }` },
      { title: "Contraste de cor", body: "WCAG AA exige 4.5:1 para texto normal, 3:1 para texto grande (18pt+ ou 14pt+ bold), 3:1 para elementos de UI (ícones, bordas de input). Ferramentas: Chrome DevTools (picker mostra ratio), axe, Colour Contrast Analyser." },
      { title: "Textos alternativos", body: "Imagens informativas: alt descritivo e conciso. Imagens decorativas: alt='' (leitor de tela ignora). SVGs inline: aria-label ou <title> dentro do SVG. Ícones sem texto visível ao lado: aria-label no botão ou aria-hidden no ícone + texto visível.", code: `{/* Imagem informativa */}
<img src="grafico.png" alt="Vendas cresceram 40% em março" />

{/* Decorativa */}
<img src="divider.png" alt="" />

{/* Ícone em botão */}
<button aria-label="Fechar modal">
  <XIcon aria-hidden="true" />
</button>` },
    ],
    interview: [
      {
        q: "O que é WCAG e quais são os níveis de conformidade?",
        a: "<p>WCAG (Web Content Accessibility Guidelines) são as diretrizes internacionais de acessibilidade do W3C. Organizadas em 4 princípios: Perceptível, Operável, Compreensível, Robusto (POUR).</p><p>Três níveis: <strong>A</strong> (mínimo absoluto), <strong>AA</strong> (padrão da indústria e exigência legal na maioria dos países), <strong>AAA</strong> (mais rigoroso, raramente exigido de forma integral).</p><p>Para a maioria dos projetos: conformidade AA é o objetivo. Inclui contraste 4.5:1, legendas em vídeo, texto alternativo, navegação por teclado completa.</p>",
        tip: "Mencionar os 4 princípios POUR como estrutura de raciocínio sobre a11y é o que diferencia quem estudou o tema de quem só usou axe.",
        level: "pleno",
      },
      {
        q: "Por que usar HTML semântico é a primeira linha de acessibilidade?",
        a: "<p>Elementos HTML nativos têm comportamento de acessibilidade embutido: <button> recebe foco por Tab, responde a Enter/Space, tem role='button' automático. <input> conecta ao <label> com for/htmlFor. <nav> cria landmark de navegação para leitores de tela pularem.</p><p>Substituir por divs exige reimplementar tudo manualmente com ARIA + tabIndex + event listeners. Além de mais código, é fácil errar — e erros de a11y são bugs silenciosos que só usuários de tecnologia assistiva detectam.</p>",
        tip: "A regra prática 'use o elemento HTML que descreve o que o elemento é' cobre 80% dos casos sem precisar saber ARIA.",
        level: "pleno",
      },
      {
        q: "Qual a diferença entre aria-label, aria-labelledby e aria-describedby?",
        a: "<p><strong>aria-label</strong>: texto de label diretamente no atributo. Use quando não há texto visível. Ex: botão com apenas ícone.</p><p><strong>aria-labelledby</strong>: aponta para o ID de outro elemento que serve como label. Preferível quando o label já existe visível na tela — leitores de tela anunciam o texto real.</p><p><strong>aria-describedby</strong>: texto adicional de descrição (não substitui o label). Anunciado após o label — útil para instruções ou mensagens de erro.</p>",
        tip: "aria-labelledby tem preferência sobre aria-label quando há texto visível — associar ao texto real é mais robusto que duplicar em atributo.",
        level: "senior",
      },
      {
        q: "O que é focus trap e quando você precisa implementar?",
        a: "<p>Focus trap prende a navegação por Tab dentro de um elemento enquanto ele está ativo. Necessário em: modais/dialogs, drawers, menus complexos — qualquer componente que ocupa o contexto visual e deve impedir navegação no conteúdo por baixo.</p><p>Implementação: capturar Tab e Shift+Tab dentro do container, redirecionar para o primeiro/último focável quando alcança as bordas. Ao fechar, restaurar o foco ao elemento que abriu (ex: o botão trigger). Radix UI e outras libs headless implementam isso automaticamente.</p>",
        tip: "Citar que Radix UI implementa focus trap automaticamente justifica o uso da lib além de 'acessibilidade' genérico.",
        level: "senior",
      },
      {
        q: "Como você testa acessibilidade em um projeto React?",
        a: "<p>Em camadas: (1) <strong>Linting automático</strong>: eslint-plugin-jsx-a11y detecta problemas em build time (img sem alt, label sem htmlFor, onClick em div). (2) <strong>Testes com jest-axe</strong>: axe-core analisa o DOM renderizado e reporta violações como assertions. (3) <strong>Testes com Testing Library</strong>: queries por role e label (getByRole, getByLabelText) favorecem naturalmente HTML semântico. (4) <strong>Inspeção manual</strong>: navegar por Tab, testar com VoiceOver/NVDA, verificar zoom a 200%.</p>",
        tip: "Mencionar os 4 layers (linting, axe, Testing Library, manual) mostra uma abordagem sistemática — não apenas 'uso axe no DevTools'.",
        level: "senior",
      },
      {
        q: "Como você garante acessibilidade em componentes com ícones SVG?",
        a: "<p>Depende do contexto: (1) <strong>Ícone decorativo</strong> (tem texto ao lado): aria-hidden='true' no SVG — leitor de tela ignora. (2) <strong>Ícone em botão</strong> (sem texto visível): aria-label no botão, aria-hidden no SVG. (3) <strong>SVG inline informativo</strong>: &lt;title&gt; como primeiro filho do SVG + aria-labelledby apontando para o title. (4) Nunca use alt em SVG — o atributo não existe.</p>",
        level: "pleno",
      },
    ],
    diagrams: [
      {
        title: "Árvore de acessibilidade — do HTML ao leitor de tela",
        html: `<style>
.a11y-diag{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.a11y-box{background:#1e293b;border:1.5px solid #334155;border-radius:8px;padding:12px 14px;font-size:11px}
.a11y-bad{border-color:#ef4444}
.a11y-good{border-color:#4ade80}
.a11y-tag{display:inline-block;font-size:9px;padding:2px 6px;border-radius:3px;margin-bottom:6px}
</style>
<div class="a11y-diag">
  <p style="color:#e2e8f0;font-size:12px;font-weight:700;margin:0 0 16px">HTML semântico → Accessibility Tree → Leitor de tela</p>
  <div style="display:flex;gap:10px;margin-bottom:12px">
    <div class="a11y-box a11y-bad" style="flex:1">
      <div class="a11y-tag" style="background:#3a0f0f;color:#ef4444">✗ Div sem semântica</div>
      <div style="color:#94a3b8;line-height:2;font-size:10px">
        &lt;<span style="color:#ef4444">div</span> onclick="submit()"&gt;Enviar&lt;/div&gt;<br><br>
        <strong style="color:#ef4444">Accessibility Tree:</strong><br>
        role: <em>none</em> (ignorado)<br>
        focusable: <em>não</em><br>
        keyboard: <em>não responde Enter/Space</em><br>
        Leitor de tela: <em>não anuncia nada</em>
      </div>
    </div>
    <div class="a11y-box a11y-good" style="flex:1">
      <div class="a11y-tag" style="background:#0f3a1a;color:#4ade80">✓ Button semântico</div>
      <div style="color:#94a3b8;line-height:2;font-size:10px">
        &lt;<span style="color:#4ade80">button</span> type="submit"&gt;Enviar&lt;/button&gt;<br><br>
        <strong style="color:#4ade80">Accessibility Tree:</strong><br>
        role: <em>button</em><br>
        focusable: <em>sim (Tab)</em><br>
        keyboard: <em>Enter e Space ativam</em><br>
        Leitor de tela: <em>"Enviar, botão"</em>
      </div>
    </div>
  </div>
  <div style="background:#1e293b;border:1px solid #334155;border-radius:8px;padding:10px 14px;font-size:11px;color:#475569;line-height:1.8">
    <strong style="color:#94a3b8">Regra 1 da ARIA:</strong> se há um elemento HTML nativo que faz o que você precisa, use-o. ARIA complementa — não substitui — HTML semântico e comportamento de teclado nativo.
  </div>
</div>`,
        caption: "O browser constrói um Accessibility Tree a partir do HTML. Leitores de tela navegam nessa árvore — não no DOM visual. Semântica incorreta = invisibilidade para tecnologia assistiva.",
      },
    ],
    gotchas: [
      "Remover outline de foco (outline: none) sem substituir por alternativa visual quebra a11y para usuários de teclado. Use :focus-visible para mostrar outline só em navegação por teclado.",
      "role='button' em div não adiciona comportamento de teclado (Enter/Space). Use <button> ou adicione tabIndex + onKeyDown manualmente.",
      "aria-label em elemento interativo substitui qualquer texto visível para o leitor de tela — mantenha consistência entre o que é visto e o que é anunciado.",
    ],
    resources: [
      { title: "MDN — Accessibility", url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility", kind: "docs" },
      { title: "web.dev — Accessibility", url: "https://web.dev/accessibility/", kind: "docs" },
      { title: "axe DevTools", url: "https://www.deque.com/axe/", kind: "pratica" },
      { title: "WCAG 2.1 Quick Reference", url: "https://www.w3.org/WAI/WCAG21/quickref/", kind: "docs" },
    ],
  },

  "nuxt": {
    tagline: "Meta-framework Vue com SSR, SSG, file-based routing e módulos do ecossistema.",
    why: "Nuxt é para Vue o que Next.js é para React. Se você trabalha com Vue em produção, conhecer Nuxt é obrigatório.",
    summary: "Nuxt 3 é o meta-framework Vue 3 com: routing baseado em arquivo, SSR/SSG/ISR, auto-imports de composables e components, módulos (image, auth, content, pwa), Nitro (engine de server), DevTools integrado.",
    keypoints: [
      { title: "Auto-imports", body: "Nuxt importa automaticamente composables de ~/composables/, components de ~/components/, utils de ~/utils/. Sem necessidade de import manual — convenção de arquivo substitui import explícito." },
      { title: "Rendering modes", body: "Universal (SSR default), SPA (sem server), SSG (pré-render), Hybrid (por rota com routeRules). Configure no nuxt.config.ts.", code: `// nuxt.config.ts — hybrid rendering por rota
routeRules: {
  '/':          { prerender: true },   // SSG
  '/dashboard': { ssr: false },        // SPA
  '/blog/**':   { isr: 3600 },         // ISR a cada 1h
}` },
      { title: "Módulos", body: "@nuxt/image (otimização automática), @nuxtjs/color-mode (dark mode), @nuxt/content (CMS baseado em arquivo), nuxt-auth-utils. Ecossistema extenso em nuxt.com/modules." },
      { title: "Nitro", body: "Server engine do Nuxt. Suporta múltiplos deployment targets: Node, Vercel, Netlify, Cloudflare Workers, Deno. server/api/ cria endpoints automaticamente com tipagem." },
    ],
    interview: [
      {
        q: "O que são auto-imports do Nuxt e qual o tradeoff?",
        a: "<p>Nuxt escaneia arquivos em ~/composables/, ~/components/, ~/utils/ e os importa automaticamente em qualquer arquivo — sem declaração de import. Composables como useRoute(), useState(), useFetch() também são auto-importados do core do Nuxt.</p><p>Vantagem: menos boilerplate, DX mais rápida. Tradeoff: novos devs não sabem de onde vem uma função sem conhecer a convenção. IDEs precisam de suporte para autocomplete funcionar. Configure imports explicitamente em projetos grandes se preferir rastreabilidade.</p>",
        level: "pleno",
      },
      {
        q: "Quais são os modos de rendering do Nuxt 3?",
        a: "<p><strong>Universal (SSR)</strong>: padrão. HTML gerado no servidor por request. Bom para SEO e dados personalizados.</p><p><strong>SSG</strong>: páginas pré-renderizadas em build time. Mais rápido, serve de CDN.</p><p><strong>SPA</strong>: sem server rendering — HTML vazio, Vue roda no browser. Para apps internos sem SEO.</p><p><strong>Hybrid (ISR/routeRules)</strong>: diferentes modos por rota no mesmo projeto. Home pode ser SSG, dashboard SPA, blog ISR. Configurado em routeRules do nuxt.config.ts.</p>",
        level: "pleno",
      },
      {
        q: "O que é Nitro e por que ele importa?",
        a: "<p>Nitro é o server engine do Nuxt 3 — responsável por compilar e servir o código do servidor. Suporta múltiplos targets de deploy: Node.js tradicional, Vercel Edge Functions, Netlify Functions, Cloudflare Workers, Deno. Isso significa que o mesmo código Nuxt pode ser deployado em qualquer plataforma sem mudança.</p><p>server/api/ cria endpoints automaticamente: um arquivo server/api/users.get.ts gera GET /api/users. Tipagem end-to-end com useFetch no cliente.</p>",
        level: "senior",
      },
      {
        q: "Como o Nuxt se compara ao Next.js para quem conhece React?",
        a: "<p>São equivalentes funcionalmente: meta-framework com SSR/SSG, routing baseado em arquivo, API routes. Diferenças práticas: Nuxt usa Vue (Composition API, templates) ao invés de React (JSX). Auto-imports do Nuxt são mais agressivos que o Next.js. Nitro vs Next.js server são abordagens diferentes de deployment flexibility. Módulos Nuxt vs plugins Next.js têm ecossistemas separados.</p><p>Para quem já sabe Next.js: curva de aprendizado é a Vue + convenções Nuxt, não o conceito de SSR/SSG.</p>",
        level: "senior",
      },
    ],
    gotchas: [
      "Auto-imports podem confundir novos devs no codebase — a origem de uma função não é óbvia sem conhecer as convenções de pasta.",
      "SSR requer que composables sejam SSR-safe: sem acesso a window, document, localStorage no top-level. Use onMounted() ou process.client para código browser-only.",
    ],
    resources: [
      { title: "Nuxt 3 docs", url: "https://nuxt.com/docs", kind: "docs" },
      { title: "Nuxt modules", url: "https://nuxt.com/modules", kind: "docs" },
    ],
  },

  "vite": {
    tagline: "Build tool moderna para frontend: dev server instantâneo com HMR e build otimizado via Rollup.",
    why: "Vite substituiu Webpack como padrão em projetos Vue, React e Svelte. Saber configurar plugins, lidar com env vars e entender o modelo de transformação é básico.",
    summary: "Vite usa ES modules nativos no dev server (sem bundling durante dev — arquivos são transformados sob demanda). Em produção, usa Rollup para bundle otimizado. HMR ultra-rápido. Suporta React, Vue, Svelte, Lit e mais via plugins.",
    keypoints: [
      { title: "Dev server com ESM nativo", body: "Dev server serve arquivos como ES modules nativos. O navegador faz os imports e Vite transforma cada arquivo ao ser pedido (TypeScript, JSX, CSS). Sem bundle em dev = startup em < 1s independente do tamanho do projeto." },
      { title: "HMR (Hot Module Replacement)", body: "Vite atualiza apenas o módulo alterado no browser sem reload de página. Mais preciso e rápido que webpack-dev-server porque só o arquivo editado é re-processado." },
      { title: "Rollup em produção", body: "Build de produção usa Rollup: tree-shaking, code-splitting automático, minificação. Saída bem otimizada. Differe do dev server — é um bundler tradicional, não ESM nativo.", code: `// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: { vendor: ['react', 'react-dom'] },
      },
    },
  },
})` },
      { title: "Plugins", body: "@vitejs/plugin-react (JSX + Fast Refresh), @vitejs/plugin-vue (SFC + HMR). Ecossistema extenso. Compatível com plugins Rollup — o mesmo plugin funciona em dev e build." },
      { title: "Env vars", body: "Arquivos .env, .env.local, .env.production. Apenas variáveis com prefixo VITE_ são expostas ao cliente. Acesso via import.meta.env.VITE_API_URL (não process.env).", code: `// .env
VITE_API_URL=https://api.exemplo.com
SECRET_KEY=nao-exposta  # sem VITE_ = só no server

// código cliente:
const url = import.meta.env.VITE_API_URL` },
    ],
    interview: [
      {
        q: "Por que o Vite é mais rápido que o Webpack no dev server?",
        a: "<p>Webpack empacota todos os módulos em um bundle antes de servir. Em projetos grandes, isso leva dezenas de segundos. Vite não faz bundle em dev: serve arquivos como ES modules nativos e transforma cada arquivo individualmente ao ser requisitado pelo browser. O startup é praticamente instantâneo independente do tamanho do projeto.</p><p>HMR também é mais rápido: Vite invalida apenas o módulo editado, não propaga para dependências desnecessariamente.</p>",
        tip: "A distinção 'sem bundle em dev' vs 'bundle completo no Webpack' é o coração da resposta. Mencionar isso diretamente mostra que você entende o mecanismo.",
        level: "pleno",
      },
      {
        q: "Qual a diferença entre o dev server e o build de produção do Vite?",
        a: "<p><strong>Dev server</strong>: arquivos servidos como ES modules nativos, sem bundle, transformação sob demanda. Usa esbuild para transformações rápidas de TypeScript e JSX.</p><p><strong>Build de produção</strong>: usa Rollup como bundler — gera chunks otimizados, tree-shaking, minificação, code-splitting. O resultado é um bundle tradicional otimizado para produção.</p><p>Consequência: comportamento pode diferir entre dev e prod. Sempre teste com vite preview antes de deploiar — simula o build de produção servido localmente.</p>",
        tip: "Mencionar o vite preview como passo de validação antes do deploy mostra prática real, não só conhecimento teórico.",
        level: "pleno",
      },
      {
        q: "Como variáveis de ambiente funcionam no Vite?",
        a: "<p>Vite lê arquivos .env, .env.local, .env.[mode] (ex: .env.production). Apenas variáveis com prefixo VITE_ são injetadas no bundle do cliente — as outras ficam acessíveis apenas no servidor/build script.</p><p>Acesso no código: import.meta.env.VITE_NOME (não process.env). TypeScript: declare interface ImportMetaEnv em vite-env.d.ts para autocomplete.</p>",
        level: "pleno",
      },
      {
        q: "Como você configuraria Vite para um projeto com múltiplos entry points ou micro-frontends?",
        a: "<p>Via rollupOptions.input: especifique múltiplos entry points como objeto. Cada entry gera seu próprio bundle. Para micro-frontends com Module Federation: use o plugin vite-plugin-federation (equivalente ao Webpack 5 Module Federation).</p><p>Para bibliotecas publicáveis: modo lib do Vite (build.lib) gera CJS + ESM automaticamente com externals configurados — sem incluir React/Vue no bundle da lib.</p>",
        level: "senior",
      },
    ],
    gotchas: [
      "Dynamic imports com variáveis (import('./' + file)) podem não funcionar corretamente — Vite tem limitações com globs dinâmicos. Use import.meta.glob para importação dinâmica de arquivos.",
      "Diferença de comportamento dev/prod: dev usa ESM nativo (mais permissivo), prod usa Rollup (mais estrito). Teste sempre com vite preview antes de deploiar.",
    ],
    resources: [
      { title: "Vite docs", url: "https://vitejs.dev/guide/", kind: "docs" },
      { title: "Vite plugins", url: "https://vitejs.dev/plugins/", kind: "docs" },
    ],
  },

  "shadcn-ui": {
    tagline: "Coleção de componentes acessíveis baseados em Radix UI + Tailwind, copiados no projeto.",
    why: "shadcn/ui mudou como devs constroem UI: ao invés de instalar pacote, você copia o componente e é dono do código. Padrão em projetos Next.js modernos.",
    summary: "shadcn/ui não é uma biblioteca npm — é uma CLI que copia componentes para dentro do seu projeto. Componentes são construídos sobre Radix UI (acessibilidade) e estilizados com Tailwind CSS. Você pode editar livremente.",
    keypoints: [
      { title: "Filosofia copy-paste", body: "npx shadcn@latest add button copia o componente para components/ui/button.tsx. Você possui o código — atualiza manualmente, modifica como quiser, sem depender de versão de pacote.", code: `# Adicionar componente ao projeto:
npx shadcn@latest add button dialog select

# O código vai para components/ui/ — é seu, edite à vontade` },
      { title: "Radix UI como base", body: "Componentes complexos (Dialog, Select, DropdownMenu, Tooltip) são construídos sobre Radix UI — acessível, sem estilo, headless. shadcn adiciona estilo Tailwind em cima. Você herda toda a acessibilidade do Radix." },
      { title: "Variantes com cva", body: "Componentes usam class-variance-authority (cva) para variantes type-safe: variant='default'|'destructive'|'outline', size='sm'|'md'|'lg'. Extensível com novas variantes.", code: `const buttonVariants = cva(
  'inline-flex items-center rounded-md font-medium transition-colors',
  {
    variants: {
      variant: { default: 'bg-primary text-primary-foreground', destructive: 'bg-destructive ...' },
      size:    { sm: 'h-9 px-3', md: 'h-10 px-4', lg: 'h-11 px-8' },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
)` },
      { title: "Theme com CSS variables", body: "Cores definidas como CSS variables em :root e .dark. Tokens semânticos: --primary, --background, --foreground, --muted. Troca de tema dark/light via classe 'dark' no elemento html — zero re-render." },
    ],
    interview: [
      {
        q: "O que faz do shadcn/ui diferente de uma biblioteca de componentes como MUI?",
        a: "<p>shadcn/ui não é uma dependência npm — é uma CLI que copia o código dos componentes para dentro do seu projeto. Você é dono do código, pode editar livremente, sem esperar por versão da biblioteca ou abrir PR para a lib.</p><p>MUI e similares: instala como pacote, customiza via theme/styled override, depende do ciclo de release da lib para bugs e features. shadcn: o código é seu, mas você assume a responsabilidade por updates manuais.</p>",
        tip: "A distinção 'você possui o código' é o coração da resposta. É a inversão do modelo tradicional de biblioteca.",
        level: "pleno",
      },
      {
        q: "Como shadcn/ui lida com acessibilidade?",
        a: "<p>shadcn/ui usa Radix UI como base de comportamento para componentes complexos. Radix implementa os padrões WAI-ARIA corretos: focus trap em Dialog, navegação por setas em Select, dismiss com Esc em Popover, etc.</p><p>shadcn adiciona apenas estilo Tailwind em cima do Radix — a acessibilidade vem do Radix. Isso significa que ao usar um Dialog do shadcn, você herda automaticamente: foco preso no modal, Esc para fechar, aria-modal, aria-labelledby.</p>",
        level: "pleno",
      },
      {
        q: "Como você customizaria o tema do shadcn/ui para uma marca específica?",
        a: "<p>shadcn usa CSS variables para todas as cores: --primary, --background, --foreground, --muted, --accent. Para customizar: edite as variáveis em globals.css (modo :root para light, .dark para dark). Os componentes usam apenas tokens semânticos (bg-primary, text-foreground) — trocar a variável atualiza todos os componentes automaticamente.</p><p>Para cores além do tema padrão: adicione novas CSS variables e use via Tailwind com a configuração em tailwind.config.ts.</p>",
        level: "pleno",
      },
      {
        q: "Como você atualiza componentes shadcn quando a CLI lança melhorias?",
        a: "<p>shadcn não tem atualizações automáticas — você re-roda a CLI (npx shadcn@latest add button) e o componente é sobrescrito. Mudanças locais são perdidas.</p><p>Estratégia: use git para rastrear suas customizações. Antes de atualizar, veja o diff do que vai ser sobrescrito. Para projetos com muitas customizações, pode ser mais simples aplicar o patch manualmente do que re-rodar a CLI.</p>",
        level: "senior",
      },
    ],
    gotchas: [
      "Atualizar componentes shadcn requer re-run da CLI — mudanças locais são sobrescritas. Rastreie customizações em git antes de atualizar.",
      "Nem todo projeto precisa de shadcn — em projetos simples, adiciona complexidade e dependência de Radix UI desnecessariamente.",
    ],
    resources: [
      { title: "shadcn/ui docs", url: "https://ui.shadcn.com/", kind: "docs" },
      { title: "shadcn/ui components", url: "https://ui.shadcn.com/docs/components/button", kind: "docs" },
    ],
  },

  "react-query": {
    tagline: "Biblioteca para data fetching, caching e sincronização de estado servidor no React.",
    why: "React Query (TanStack Query) resolve o problema de gerenciar estado assíncrono de servidor. Elimina boilerplate de loading/error/refetch e é padrão em stacks React modernas.",
    summary: "TanStack Query (React Query) gerencia o ciclo de vida de dados remotos: fetching, caching, background refetching, pagination, optimistic updates. Distingue estado de servidor (query cache) de estado de cliente (useState/zustand). Elimina a necessidade de Redux para estado assíncrono.",
    keypoints: [
      { title: "Query keys", body: "Todo dado é identificado por uma query key (array). Mesma key = mesmo cache. ['todos', userId] faz cache separado por usuário. Estruture como fatos sobre o dado — não como URLs.", code: `// Bom: hierárquico e específico
useQuery({ queryKey: ['posts', { userId, status: 'published' }], ... })
// Invalida tudo de posts de um usuário:
queryClient.invalidateQueries({ queryKey: ['posts', { userId }] })` },
      { title: "staleTime vs gcTime", body: "staleTime: tempo que o dado é considerado fresco (sem refetch em background). gcTime (antigo cacheTime): tempo que dado inativo fica no cache antes de ser removido. Padrão: staleTime=0 (sempre stale), gcTime=5min.", code: `useQuery({
  queryKey: ['config'],
  queryFn: fetchConfig,
  staleTime: 10 * 60 * 1000, // 10min — não refetch em background
  gcTime:    30 * 60 * 1000, // 30min — mantém no cache mesmo inativo
})` },
      { title: "Mutations e invalidação", body: "useMutation para operações que alteram dados. onSuccess invalida queries relacionadas para forçar refetch com dados atualizados. Callbacks: onMutate (antes), onSuccess, onError, onSettled.", code: `const mutation = useMutation({
  mutationFn: (data) => api.createPost(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['posts'] })
  },
})` },
      { title: "Optimistic updates", body: "Atualiza o cache antes da resposta do servidor para UX instantânea. Em onMutate: salva o estado anterior e atualiza o cache. Em onError: rollback para o estado salvo. Em onSettled: refetch para garantir consistência.", code: `onMutate: async (newPost) => {
  await queryClient.cancelQueries({ queryKey: ['posts'] })
  const previous = queryClient.getQueryData(['posts'])
  queryClient.setQueryData(['posts'], old => [...old, newPost])
  return { previous }
},
onError: (err, vars, ctx) => {
  queryClient.setQueryData(['posts'], ctx.previous)
},` },
      { title: "Infinite queries e prefetch", body: "useInfiniteQuery para listas com carregamento progressivo (infinite scroll). prefetchQuery antecipa dados antes da navegação — útil em hover de link. dehydrate/hydrate para SSR com Next.js.", code: `// Prefetch em hover:
queryClient.prefetchQuery({
  queryKey: ['post', id],
  queryFn: () => fetchPost(id),
})` },
    ],
    interview: [
      {
        q: "O que é o conceito de 'estado de servidor' e por que React Query existe?",
        a: "<p>Estado de servidor são dados que vivem no backend e precisam ser sincronizados com o cliente. Têm características únicas: podem ficar desatualizados, podem ser modificados por outros usuários, precisam de loading/error states, podem ser cacheados.</p><p>useState + useEffect para gerenciar isso vira boilerplate: loading flag, error state, refetch manual, cache manual. React Query abstrai tudo isso — você declara o que quer buscar e como cachear, ele cuida do resto.</p><p>Distinção importante: estado de servidor (React Query) ≠ estado de UI (useState/Zustand).</p>",
        tip: "A distinção clara entre estado de servidor e estado de cliente é o que o entrevistador quer ouvir primeiro. Isso mostra que você entende o problema que a lib resolve.",
        level: "pleno",
      },
      {
        q: "Como funcionam as query keys e por que são importantes?",
        a: "<p>Query keys são a identidade de um dado no cache. Mesma key = mesma entrada no cache. Array estruturado permite invalidação granular: invalidar ['posts'] invalida também ['posts', { userId }] e ['posts', postId, 'comments'].</p><p>Boas práticas: estruture como fatos sobre o dado (não URLs), use objetos para parâmetros opcionais (mais flexível que posição), seja consistente com a estrutura para que invalidação funcione corretamente.</p>",
        tip: "Mostrar que você sabe fazer invalidação hierárquica (invalidar pai invalida filhos) é diferencial claro — a maioria só sabe invalidar a key exata.",
        level: "pleno",
      },
      {
        q: "Qual a diferença entre staleTime e gcTime (cacheTime)?",
        a: "<p><strong>staleTime</strong>: por quanto tempo o dado é considerado fresco. Com staleTime=0 (padrão), o dado é imediatamente stale — React Query refetch em background sempre que o componente monta ou a janela recebe foco. Com staleTime=5min, nenhum refetch em background por 5 minutos.</p><p><strong>gcTime</strong>: por quanto tempo um dado inativo (sem observers) permanece no cache antes de ser removido. Dados removidos do cache precisam ser buscados do zero na próxima vez.</p><p>Dado stale ainda é exibido enquanto o refetch acontece em background (stale-while-revalidate).</p>",
        level: "senior",
      },
      {
        q: "Como implementar optimistic updates com React Query?",
        a: "<p>Em onMutate: (1) cancele queries em flight para evitar sobreposição; (2) salve o valor anterior do cache; (3) atualize o cache com o valor otimista. Em onError: restaure o valor salvo (rollback). Em onSettled: refetch para garantir que o cache reflete o servidor.</p><p>É mais código que uma mutation simples, mas entrega UX instantânea — o usuário vê o resultado imediatamente, e em caso de erro a UI reverte automaticamente.</p>",
        tip: "Citar os 3 passos (onMutate: cancel+save+update, onError: rollback, onSettled: refetch) mostra que você fez isso de verdade, não só leu a doc.",
        level: "senior",
      },
      {
        q: "Como usar React Query com Next.js App Router (Server Components)?",
        a: "<p>Padrão recomendado: prefetch no Server Component + hydrate no cliente. No Server Component: use QueryClient e prefetchQuery para buscar dados. Serialize com dehydrate. No Client Component: use HydrationBoundary para restaurar o cache. O usuário recebe HTML com dados já presentes e o cache do React Query já populado — sem loading state visível.</p><p>Alternativa mais simples: passar dados como props do Server para o Client Component e usar initialData no useQuery.</p>",
        level: "senior",
      },
      {
        q: "Quando usar React Query vs SWR vs fetch puro?",
        a: "<p><strong>React Query</strong>: casos complexos — mutations com invalidação, optimistic updates, infinite scroll, prefetch, devtools, SSR. API mais rica. Bundle ~13KB.</p><p><strong>SWR</strong>: data fetching simples de leitura. API mínima, bundle menor (~4KB). Bom para projetos Vercel/Next.js simples sem mutations complexas.</p><p><strong>fetch puro em Server Component</strong>: dados que só existem no servidor (Next.js App Router). Sem estado de cliente, sem cache de cliente. Mais simples quando o dado não é interativo.</p>",
        level: "pleno",
      },
    ],
    diagrams: [
      {
        title: "Ciclo de vida de uma query — stale, fetch, cache",
        html: `<style>
.rq-diag{font-family:'Space Grotesk',sans-serif;background:#0f172a;border-radius:12px;padding:22px;color:#e2e8f0}
.rq-state{border-radius:8px;padding:8px 12px;font-size:11px;text-align:center;border:1.5px solid;flex:1}
.rq-arr{color:#ff4154;font-size:16px;text-align:center;flex-shrink:0}
.rq-tip{position:relative;cursor:help;border-bottom:1px dashed rgba(255,65,84,.4);display:inline}
.rq-tip:hover .rq-tb{display:block}
.rq-tb{display:none;position:absolute;bottom:calc(100%+8px);left:50%;transform:translateX(-50%);background:#020617;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px;line-height:1.6;z-index:30;color:#94a3b8;width:210px;pointer-events:none;white-space:normal;box-shadow:0 4px 16px rgba(0,0,0,.7)}
.rq-tb::after{content:'';position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:#334155}
</style>
<div class="rq-diag">
  <p style="color:#e2e8f0;font-size:12px;font-weight:700;margin:0 0 16px">React Query — ciclo de vida de uma query</p>
  <div style="display:flex;gap:6px;align-items:center;margin-bottom:16px;flex-wrap:wrap">
    <div class="rq-state" style="background:#1a2a3a;border-color:#38bdf8;color:#38bdf8">
      <span class="rq-tip">fresh<span class="rq-tb">staleTime ainda não expirou. Nenhum refetch em background. Dado considerado atual.</span></span>
      <div style="font-size:9px;color:#475569;margin-top:4px">staleTime não expirou</div>
    </div>
    <div class="rq-arr">→</div>
    <div class="rq-state" style="background:#2a1a0a;border-color:#fb923c;color:#fb923c">
      <span class="rq-tip">stale<span class="rq-tb">staleTime expirou (default: imediatamente). React Query vai refetch em background na próxima oportunidade: mount, focus, reconnect.</span></span>
      <div style="font-size:9px;color:#475569;margin-top:4px">staleTime expirou</div>
    </div>
    <div class="rq-arr">→</div>
    <div class="rq-state" style="background:#2a1a1a;border-color:#ef4444;color:#ef4444">
      <span class="rq-tip">fetching<span class="rq-tb">Refetch em background. O dado antigo (stale) ainda é exibido — sem loading state. Quando o fetch termina, o cache é atualizado.</span></span>
      <div style="font-size:9px;color:#475569;margin-top:4px">refetch em background</div>
    </div>
    <div class="rq-arr">→</div>
    <div class="rq-state" style="background:#1a2a1a;border-color:#4ade80;color:#4ade80">
      <span class="rq-tip">fresh<span class="rq-tb">Fetch completou. Dado atualizado. staleTime começa a contar novamente.</span></span>
      <div style="font-size:9px;color:#475569;margin-top:4px">dado atualizado</div>
    </div>
  </div>
  <div style="display:flex;gap:10px">
    <div style="flex:1;background:#1e293b;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px">
      <div style="font-size:9px;color:#ff4154;text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px">staleTime = 0 (padrão)</div>
      <div style="color:#94a3b8;line-height:1.6">Dado é imediatamente stale após fetch. Refetch em background em qualquer mount ou window focus. Sempre atualizado — mais requests.</div>
    </div>
    <div style="flex:1;background:#1e293b;border:1px solid #334155;border-radius:8px;padding:10px 12px;font-size:11px">
      <div style="font-size:9px;color:#4ade80;text-transform:uppercase;letter-spacing:.1em;margin-bottom:6px">staleTime = 5min</div>
      <div style="color:#94a3b8;line-height:1.6">Dado é fresco por 5 min após o último fetch. Zero refetch em background nesse período. Menos requests — bom para dados que mudam raramente.</div>
    </div>
  </div>
</div>`,
        caption: "staleTime controla quando o dado vira stale (dispara refetch). gcTime controla quando o dado inativo é removido do cache. Stale ≠ removido — dado stale ainda aparece enquanto refetch acontece.",
      },
    ],
    gotchas: [
      "Query key muito genérica (ex: ['users']) cacheia todos os users juntos — use keys específicas com parâmetros para cache granular.",
      "Refetch automático em window focus pode surpreender. Configure refetchOnWindowFocus: false globalmente ou por query se não for desejado.",
      "Estado de servidor e estado de cliente são diferentes. Não use React Query para estado de UI local (modal aberto, form input) — use useState ou Zustand.",
    ],
    resources: [
      { title: "TanStack Query docs", url: "https://tanstack.com/query/latest", kind: "docs" },
      { title: "Dominik Dorfmeister — blog", url: "https://tkdodo.eu/blog/", kind: "artigo" },
    ],
  },

  // ─── P2 ──────────────────────────────────────────────────────────────────────

  "zustand": {
    tagline: "Gerenciamento de estado global minimalista para React — sem boilerplate.",
    why: "Zustand virou o padrão de fato para estado global em projetos React modernos, substituindo Redux na maioria dos casos. API simples, sem Provider, sem actions/reducers — só uma store com hooks.",
    summary: "Zustand é uma biblioteca de gerenciamento de estado baseada em hooks, com API mínima: create() define a store com estado e ações em um único objeto. Sem Provider obrigatório, sem actions/reducers/dispatch. O componente subscreve apenas ao slice que usa — re-renders seletivos automáticos.",
    keypoints: [
      { title: "create() — store minimalista", body: "Uma store é uma função create() que recebe set e get e retorna estado + ações. Sem Provider — funciona fora de componentes também.", code: `const useStore = create<State>((set) => ({
  count: 0,
  inc: () => set((s) => ({ count: s.count + 1 })),
  reset: () => set({ count: 0 }),
}))` },
      { title: "Seleção e re-renders", body: "Use seletores para assinar apenas o que o componente precisa. Sem seletor, o componente re-renderiza em qualquer mudança da store.", code: `// Apenas re-renderiza quando count muda:
const count = useStore((s) => s.count)
// Re-renderiza em QUALQUER mudança (evite):
const store = useStore()` },
      { title: "Slice pattern", body: "Para stores grandes, divida em slices: funções que recebem set/get e retornam um pedaço do estado. Combine no create() principal.", code: `const useStore = create<State>()((...args) => ({
  ...createCountSlice(...args),
  ...createUserSlice(...args),
}))` },
      { title: "Middleware", body: "Zustand tem middleware componível: persist (localStorage/sessionStorage), devtools (Redux DevTools), immer (estado mutável com immer). Compose com pipe.", code: `const useStore = create<State>()(
  persist(devtools(immer((set) => ({
    count: 0,
    inc: () => set((s) => { s.count++ }), // immer: mutação direta
  }))), { name: 'my-store' })
)` },
    ],
    interview: [
      { q: "Por que usar Zustand em vez de Redux?", a: "<p>Zustand tem 1/10 do boilerplate. Sem actions, reducers, dispatch, combineReducers, connect(). Uma store = um objeto com estado e funções. Sem Provider obrigatório. Re-renders seletivos automáticos com seletores.</p><p>Redux faz sentido em: projetos muito grandes com muitos devs (convenções rígidas), quando você precisa de time-travel debugging avançado ou ecossistema Redux extenso.</p><p>Zustand é suficiente para 90% dos casos e mais ergonômico.</p>", level: "pleno" },
      { q: "Como evitar re-renders desnecessários com Zustand?", a: "<p>Use seletores — funções que extraem apenas o slice que o componente precisa. Zustand usa igualdade referencial (===) por padrão para decidir se re-renderiza.</p><p>Para objetos derivados, use useShallow() do Zustand ou forneça um comparador customizado como segundo argumento do hook.</p>", tip: "Citar useShallow mostra que você foi além do tutorial básico.", level: "pleno" },
      { q: "Quando usar useState vs Zustand?", a: "<p><strong>useState</strong>: estado local de UI — form input, loading local, modal aberto. Não precisa ser compartilhado entre componentes não-relacionados.</p><p><strong>Zustand</strong>: estado que múltiplos componentes distantes precisam acessar/modificar — autenticação, carrinho, tema, dados de servidor que você quer cachear localmente.</p><p>Regra: comece com useState, extrai para Zustand quando props drilling fica profundo ou quando componentes não-relacionados precisam do mesmo estado.</p>", level: "pleno" },
      { q: "Como persistir estado do Zustand no localStorage?", a: "<p>Middleware <code>persist</code> do Zustand: envolve o create() e salva/restaura automaticamente do localStorage (ou qualquer storage configurado).</p><pre><code>const useStore = create(persist(\n  (set) => ({ token: null, setToken: (t) => set({ token: t }) }),\n  { name: 'auth-store', partialize: (s) => ({ token: s.token }) }\n))</code></pre><p>partialize define quais campos persistir — bom para não salvar estado efêmero.</p>", level: "pleno" },
    ],
    gotchas: [
      "Sem seletor, o componente re-renderiza em qualquer mudança da store — mesmo que o campo usado não tenha mudado.",
      "Objetos retornados por seletor precisam de comparação shallow para evitar re-renders. Use useShallow() do pacote zustand/shallow.",
      "Middleware deve ser aplicado de dentro para fora: persist(devtools(immer(fn))). Ordem errada causa bugs silenciosos.",
    ],
    resources: [
      { title: "Zustand docs", url: "https://docs.pmnd.rs/zustand/getting-started/introduction", kind: "docs" },
      { title: "Zustand — Slices pattern", url: "https://docs.pmnd.rs/zustand/guides/slices-pattern", kind: "docs" },
    ],
  },

  "radix-ui": {
    tagline: "Primitivos de UI headless, acessíveis e sem estilo — base do shadcn/ui.",
    why: "Radix UI resolve o problema mais difícil de componentes UI: acessibilidade e comportamento de teclado corretos em elementos complexos como Dialog, Select, Tooltip. Sem precisar implementar ARIA do zero.",
    summary: "Radix UI é uma coleção de componentes primitivos headless para React: sem estilo embutido, com comportamento, acessibilidade (ARIA) e teclado corretos. Você estiliza com Tailwind, CSS Modules ou qualquer abordagem. É a base de shadcn/ui, Radix Themes e outras design systems.",
    keypoints: [
      { title: "Headless = comportamento sem estilo", body: "Radix fornece o comportamento (focus trap em Dialog, navegação por teclado em Select, dismiss em Popover) sem CSS. Você aplica seu design em cima." },
      { title: "Composição com partes", body: "Cada componente é composto de partes exportadas (Root, Trigger, Content, etc.). Você monta a estrutura explicitamente — flexibilidade total de markup.", code: `<Dialog.Root>
  <Dialog.Trigger asChild>
    <Button>Abrir</Button>
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay />
    <Dialog.Content>...</Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>` },
      { title: "asChild prop", body: "asChild faz o componente Radix renderizar como o filho ao invés de um wrapper extra. Evita divs desnecessários e permite combinar com qualquer elemento.", code: `<Dialog.Trigger asChild>
  <button className="my-button">Clique</button>
</Dialog.Trigger>
// Renderiza: <button class="my-button" aria-haspopup="dialog">` },
      { title: "Acessibilidade embutida", body: "Radix implementa os padrões WAI-ARIA corretos: roles, aria-expanded, aria-controls, focus management, keyboard navigation. Você não precisa conhecer todos os padrões ARIA — o componente já faz certo." },
    ],
    interview: [
      { q: "Por que usar Radix UI em vez de construir seus próprios componentes?", a: "<p>Implementar corretamente componentes complexos como Dialog, Select ou Combobox leva semanas: focus trap, Esc para fechar, navegação por setas, ARIA correto, suporte a screen reader, scroll lock, z-index management. Radix resolve tudo isso — você foca no estilo.</p>", level: "pleno" },
      { q: "O que é o padrão de 'composição com partes' do Radix?", a: "<p>Ao invés de um componente monolítico com props para tudo, Radix exporta partes (Root, Trigger, Content, Title, etc.). Você monta a estrutura explicitamente no JSX. Isso dá controle total sobre o markup e permite inserir elementos customizados entre as partes.</p>", level: "pleno" },
      { q: "O que faz o prop 'asChild'?", a: "<p>asChild faz o componente Radix mesclar seu comportamento e ARIA no elemento filho ao invés de renderizar um wrapper. Evita o problema de 'div soup'. Implementado com a pattern do Slot — renderiza o filho com props mescladas do pai.</p>", tip: "Explicar que é implementado via Slot mostra que você entende o mecanismo, não só o efeito.", level: "senior" },
      { q: "Como Radix e shadcn/ui se relacionam?", a: "<p>shadcn/ui usa Radix UI como base de comportamento/acessibilidade e adiciona estilo Tailwind CSS em cima. Quando você adiciona um componente shadcn, você obtém: Radix (comportamento) + Tailwind (estilo) + cva (variantes). Você pode trocar o estilo — o comportamento vem do Radix.</p>", level: "pleno" },
    ],
    gotchas: [
      "Radix renderiza alguns componentes em Portal por padrão (Dialog, Tooltip) — isso pode causar problemas com z-index e contextos de CSS que não alcançam o body.",
      "asChild requer que o filho seja um único elemento React que aceite ref e props — não funciona com fragmentos ou componentes que não fazem forward de ref.",
      "O estilo de overlay e content são separados — estilizar o Dialog.Content não afeta o fundo escurecido (Dialog.Overlay).",
    ],
    resources: [
      { title: "Radix UI docs", url: "https://www.radix-ui.com/primitives/docs/overview/introduction", kind: "docs" },
      { title: "Radix UI — Accessibility", url: "https://www.radix-ui.com/primitives/docs/overview/accessibility", kind: "docs" },
    ],
  },

  "framer-motion": {
    tagline: "Biblioteca de animação declarativa para React com gesture support e layout animations.",
    why: "Framer Motion é o padrão de animação em projetos React profissionais. API declarativa, animações de layout automáticas e suporte a gestos tornam possível animações que seriam complexas com CSS puro.",
    summary: "Framer Motion permite animar componentes React com uma API declarativa: props animate, initial, exit em um componente <motion.div>. Suporta animações de layout (AnimatePresence, layout prop), gestos (drag, hover, tap), variants para estados e orchestration. Lida com animações complexas que CSS sozinho não resolve bem.",
    keypoints: [
      { title: "motion.* e props de animação", body: "Qualquer elemento HTML tem um equivalente motion.*. Props: initial (estado inicial), animate (estado alvo), exit (ao sair do DOM), transition (configuração de física/timing).", code: `<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.3 }}
/>` },
      { title: "AnimatePresence", body: "Permite animar componentes ao serem removidos do DOM (exit animation). Sem AnimatePresence, o exit nunca roda porque React remove imediatamente.", code: `<AnimatePresence>
  {isVisible && (
    <motion.div key="modal" exit={{ opacity: 0 }}>
      Conteúdo
    </motion.div>
  )}
</AnimatePresence>` },
      { title: "layout prop e animações de layout", body: "A prop layout faz o componente animar automaticamente quando sua posição/tamanho muda no DOM. Resolve animações de reordenação de lista, expansão de card — sem calcular posições manualmente.", code: `<motion.div layout>
  {/* Anima automaticamente quando tamanho/posição muda */}
</motion.div>` },
      { title: "Variants", body: "Variants definem estados nomeados de animação. Propagam automaticamente para filhos — o pai orquestra sem código extra nos filhos.", code: `const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}
const item = { hidden: { y: 20 }, show: { y: 0 } }
<motion.ul variants={container} initial="hidden" animate="show">
  <motion.li variants={item} />
</motion.ul>` },
    ],
    interview: [
      { q: "Por que precisamos de AnimatePresence para animações de saída?", a: "<p>React remove componentes do DOM imediatamente quando o estado muda para false. AnimatePresence intercepta essa remoção e espera o exit animation completar antes de remover. Sem ele, a animação de saída nunca acontece.</p>", level: "pleno" },
      { q: "O que faz a prop 'layout' do Framer Motion?", a: "<p>layout faz o componente medir sua posição e tamanho antes e depois de uma atualização de layout. Se mudou, anima automaticamente entre as duas posições usando a técnica FLIP (First, Last, Invert, Play). Resolve animações de reordenação sem cálculos manuais.</p>", tip: "Citar FLIP mostra que você entende a técnica por baixo, não só a prop.", level: "senior" },
      { q: "Quando usar Framer Motion vs CSS animations?", a: "<p>CSS: animações simples e repetitivas, sem lógica de estado (hover, spinner, skeleton). Mais performático, sem bundle.</p><p>Framer Motion: animações condicionais baseadas em estado React, animações de entrada/saída, reordenação de listas, gestos (drag), orchestration entre componentes. Quando CSS sozinho exigiria JS para calcular posições ou sequenciar.</p>", level: "pleno" },
      { q: "Como variants propagam para componentes filhos?", a: "<p>Quando um componente pai tem variants e muda para um estado nomeado (ex: 'show'), os filhos com variants recebem automaticamente o mesmo nome de estado — sem precisar de prop animate nos filhos. O pai orquestra via staggerChildren, delayChildren no transition. Isso permite animar listas com efeito cascata com código mínimo.</p>", level: "senior" },
    ],
    gotchas: [
      "AnimatePresence precisa de key única no filho para detectar entrada/saída corretamente. Sem key estável, pode não animar.",
      "layout prop em conjunto com position: fixed ou absoluto pode causar animações incorretas — use layoutId para shared element transitions entre componentes separados.",
      "Framer Motion adiciona ~50KB ao bundle. Para animações simples, CSS é mais performático. Use Framer apenas quando o ganho de UX justifica.",
    ],
    resources: [
      { title: "Framer Motion docs", url: "https://www.framer.com/motion/", kind: "docs" },
      { title: "Framer Motion — Examples", url: "https://www.framer.com/motion/examples/", kind: "pratica" },
    ],
  },

  "redux": {
    tagline: "Gerenciamento de estado global previsível com fluxo unidirecional — padrão legado em React.",
    why: "Redux ainda existe em muitas codebases grandes. Entender o modelo mental (actions, reducers, store) e Redux Toolkit (RTK) é necessário para manutenção e migração. Em projetos novos, prefira Zustand ou Jotai.",
    summary: "Redux implementa o padrão Flux: estado global em uma store imutável, modificado apenas via actions (objetos com type) processadas por reducers (funções puras). Redux Toolkit (RTK) reduz o boilerplate com createSlice, createAsyncThunk e immer embutido. React-Redux conecta a store com hooks useSelector e useDispatch.",
    keypoints: [
      { title: "Fluxo unidirecional", body: "UI → dispatch(action) → reducer(state, action) → novo estado → UI. Previsível e debugável. Cada mudança de estado é rastreável." },
      { title: "Redux Toolkit (RTK)", body: "createSlice gera actions e reducer juntos. Immer embutido permite 'mutação' no reducer (na verdade produz novo objeto imutável). createAsyncThunk para async.", code: `const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value++ }, // immer
    reset: (state) => { state.value = 0 },
  },
})` },
      { title: "useSelector e useDispatch", body: "useSelector subscreve ao slice da store. Memoizado — re-renderiza só quando o valor selecionado muda. useDispatch retorna dispatch para enviar actions." },
      { title: "RTK Query", body: "RTK Query é o módulo de data fetching do RTK — similar ao React Query. Gera hooks (useGetUsersQuery, useCreateUserMutation) a partir de endpoints declarados. Integrado com Redux DevTools." },
    ],
    interview: [
      { q: "Por que Redux caiu em desuso nos projetos novos?", a: "<p>Redux exige muito boilerplate mesmo com RTK: actions, reducers, selectors, Provider, configuração de middleware. Para estado assíncrono, Redux não tem resposta nativa boa — precisa de thunks ou sagas.</p><p>Alternativas modernas resolvem casos específicos melhor: React Query/SWR para estado de servidor, Zustand/Jotai para estado global simples, Context para estado de tema/auth. Redux ainda faz sentido em apps muito grandes onde convenções rígidas são vantagem.</p>", level: "pleno" },
      { q: "Qual a diferença entre actions, reducers e store no Redux?", a: "<p><strong>Action</strong>: objeto puro descrevendo o que aconteceu — { type: 'counter/increment', payload: 1 }. Não contém lógica.</p><p><strong>Reducer</strong>: função pura (state, action) => novoState. Toda lógica de transformação fica aqui. Deve ser sem side effects.</p><p><strong>Store</strong>: contém o estado global. Expõe dispatch(), getState() e subscribe(). Uma por aplicação.</p>", level: "pleno" },
      { q: "Como Redux Toolkit simplifica o Redux?", a: "<p>RTK elimina boilerplate com: createSlice (actions + reducer em um objeto), configureStore (middleware padrão incluído), createAsyncThunk (async actions com pending/fulfilled/rejected automáticos), immer embutido (mutação no reducer). Reduz 60-70% do código em relação ao Redux vanilla.</p>", level: "pleno" },
      { q: "Como você migraria uma codebase de Redux para Zustand?", a: "<p>Abordagem incremental: (1) Identifique slices independentes. (2) Crie store Zustand equivalente com mesmos campos e ações. (3) Migre componentes slice por slice — React-Redux e Zustand coexistem. (4) Remova Redux quando todos os slices migrados.</p><p>Pontos de atenção: middleware customizado (logger, analytics) precisa ser reimplementado; RTK Query migra para React Query; DevTools do Redux não funcionam com Zustand (mas Zustand tem próprio middleware devtools).</p>", tip: "Migração incremental é a resposta que mostra maturidade — sênior nunca propõe big bang rewrite.", level: "senior" },
    ],
    gotchas: [
      "Selector sem memoização em useSelector recalcula a cada render mesmo sem mudança no slice relevante. Use createSelector (reselect) para selectors derivados.",
      "Colocar dados não-serializáveis na store (funções, Promises, instâncias de classe) quebra Redux DevTools e persistência.",
      "Redux puro não tem solução nativa para async — thunks são boilerplate e sagas têm curva alta. RTK Query ou React Query são melhores para dados de servidor.",
    ],
    resources: [
      { title: "Redux Toolkit docs", url: "https://redux-toolkit.js.org/", kind: "docs" },
      { title: "Redux DevTools Extension", url: "https://github.com/reduxjs/redux-devtools", kind: "pratica" },
    ],
  },

  "formik": {
    tagline: "Biblioteca para gerenciar estado de formulários em React — validação, touched, errors.",
    why: "Formik ainda é muito encontrado em codebases React de médio/grande porte. Entender o modelo de touched/errors/values e integração com Yup é necessário para manutenção. Em projetos novos, React Hook Form é mais leve.",
    summary: "Formik gerencia o ciclo de vida de formulários: estado de valores, validação, estado de touched (campo foi tocado), submissão. Integra com Yup para validação declarativa. API via hook (useFormik) ou componentes (<Formik>, <Field>, <ErrorMessage>).",
    keypoints: [
      { title: "useFormik / <Formik>", body: "Hook principal que retorna values, errors, touched, handleChange, handleBlur, handleSubmit. initialValues define o estado inicial. onSubmit é chamado quando form é válido.", code: `const formik = useFormik({
  initialValues: { email: '', password: '' },
  validationSchema: yup.object({ email: yup.string().email().required() }),
  onSubmit: async (values) => { await login(values) },
})` },
      { title: "touched e errors", body: "errors tem os erros de validação. touched rastreia quais campos o usuário interagiu. Exibir erro apenas quando touched[field] evita mostrar todos os erros ao carregar o form." },
      { title: "Field e FieldArray", body: "<Field> conecta automaticamente handleChange/handleBlur/value ao input pelo nome. <FieldArray> gerencia arrays de campos (adicionar/remover itens dinamicamente)." },
      { title: "setFieldValue e resetForm", body: "Para campos controlados externamente (date picker, select customizado): formik.setFieldValue('campo', valor). resetForm() volta ao initialValues." },
    ],
    interview: [
      { q: "Por que Formik vs React Hook Form?", a: "<p>Formik: modelo controlado (re-render a cada keystroke), mais familiar para devs vindos de Redux, melhor documentação para casos complexos com FieldArray.</p><p>React Hook Form: não-controlado por padrão (sem re-render por keystroke), melhor performance em forms grandes, API mais moderna com register/watch/setValue. Menor bundle.</p><p>Em projetos novos, React Hook Form + Zod é o padrão atual.</p>", level: "pleno" },
      { q: "O que é 'touched' no Formik e por que importa?", a: "<p>touched é um objeto que rastreia quais campos receberam foco e perderam (onBlur). Permite mostrar erros de validação apenas nos campos que o usuário já interagiu — não em todos ao carregar o form. Sem touched, todos os erros aparecem imediatamente, degradando a UX.</p>", level: "pleno" },
      { q: "Como integrar Formik com Yup?", a: "<p>Passe o schema Yup no prop validationSchema do Formik. Formik chama schema.validate() automaticamente e popula o objeto errors com as mensagens definidas no schema. Sem necessidade de lógica de validação manual.</p>", level: "pleno" },
      { q: "Como lidar com campos customizados (date picker, select externo) no Formik?", a: "<p>Campos customizados que não usam input HTML nativo não disparam os eventos que o Formik observa. Solução: use formik.setFieldValue('campo', valor) para atualizar o valor programaticamente, e formik.setFieldTouched('campo', true) para marcar como tocado (para que o erro apareça). Ou use o componente <Field> com a prop 'component' apontando para um componente customizado que recebe field, form como props.</p>", level: "pleno" },
    ],
    gotchas: [
      "Formik re-renderiza o form completo a cada keystroke. Em forms com muitos campos, isso pode causar lentidão — use React.memo nos campos ou migre para React Hook Form.",
      "setFieldTouched() precisa ser chamado manualmente em campos customizados para que os erros apareçam corretamente.",
      "enableReinitialize: true é necessário quando initialValues muda após mount (dados carregados de API) — sem ele, o form não reflete os novos valores.",
    ],
    resources: [
      { title: "Formik docs", url: "https://formik.org/docs/overview", kind: "docs" },
    ],
  },

  "yup": {
    tagline: "Schema validation JavaScript com API fluente — par natural do Formik.",
    why: "Yup é o validador padrão com Formik e ainda aparece em muitas codebases. Em projetos novos com TypeScript, Zod é preferível (inferência de tipo melhor). Entender Yup é necessário para manutenção.",
    summary: "Yup é uma biblioteca de schema validation com API fluente e encadeada. Define regras com yup.object(), yup.string().email().required(), yup.number().min(). Assíncrono por padrão. Integra com Formik via validationSchema.",
    keypoints: [
      { title: "Schema declaration", body: "yup.object() define shape do objeto. yup.string(), yup.number(), yup.boolean(), yup.array(), yup.date(). Métodos encadeados: .required(), .min(), .max(), .email(), .url(), .matches().", code: `const schema = yup.object({
  name: yup.string().required('Nome obrigatório').min(2),
  age: yup.number().min(18, 'Maior de 18').required(),
  email: yup.string().email('E-mail inválido').required(),
})` },
      { title: "when() — validação condicional", body: "when() condiciona validação baseada em outros campos do schema.", code: `cpf: yup.string().when('tipo', {
  is: 'pessoa_fisica',
  then: (s) => s.required(),
  otherwise: (s) => s.optional(),
})` },
      { title: "Yup vs Zod", body: "Yup: API fluente, assíncrono, mais maduro. Não gera tipos TypeScript automaticamente — precisa de InferType. Zod: TypeScript-first, inferência automática com z.infer, melhor DX em TS. Em projetos TS novos, prefira Zod." },
    ],
    interview: [
      { q: "Qual a diferença entre Yup e Zod?", a: "<p>Yup é mais antigo, assíncrono por padrão e tem API fluente. Para extrair tipos TypeScript, usa yup.InferType — funciona mas é menos ergonômico. Zod é TypeScript-first: o tipo é inferido automaticamente com z.infer, não há duplicação entre schema e tipo. Em projetos TypeScript modernos, Zod é a escolha padrão. Yup ainda aparece em codebases existentes com Formik.</p>", level: "pleno" },
      { q: "Como fazer validação condicional com Yup?", a: "<p>Use when(campo, { is: valor, then: schema, otherwise: schema }). O campo pode ser uma string (nome de outro campo no objeto) ou array de nomes. then e otherwise recebem uma função que modifica o schema para a condição.</p>", level: "pleno" },
      { q: "Por que yup.string().required() aceita string vazia?", a: "<p>Por design: required() em Yup verifica apenas que o valor não é null nem undefined — string vazia ('') passa pela validação. Para rejeitar strings vazias, combine: yup.string().required('Obrigatório').min(1, 'Não pode ser vazio'). Esse é um dos gotchas mais comuns em Yup e o motivo pelo qual Zod tem comportamento diferente (required implica não-vazio em strings).</p>", tip: "Citar esse comportamento contraintuitivo mostra que você usou Yup em produção e encontrou o problema real.", level: "pleno" },
      { q: "Como extrair tipos TypeScript de um schema Yup?", a: "<p>Use yup.InferType<typeof schema>: define o schema com yup.object() e extrai o tipo com InferType. Funciona mas tem limitações: campos com .transform() podem produzir tipos incorretos porque Yup não rastreia transformações no sistema de tipos. Para TypeScript-first com inferência precisa de transformações, Zod é superior.</p>", level: "pleno" },
    ],
    gotchas: [
      "yup.required() não bloqueia string vazia — use .min(1) também se quiser rejeitar ''. String vazia passa por required.",
      "Validações são assíncronas por padrão. Em ambientes síncronos, use schema.validateSync().",
      "Yup não infere tipos TypeScript automaticamente como Zod. Use yup.InferType<typeof schema> explicitamente.",
    ],
    resources: [
      { title: "Yup docs", url: "https://github.com/jquense/yup", kind: "docs" },
    ],
  },

  "design-systems": {
    tagline: "Conjunto de componentes, tokens e guias que garantem consistência visual e de UX em escala.",
    why: "Design systems são o que diferencia empresas que escalam UI de empresas que têm inconsistência visual. Sênior precisa entender como construir, versionar e evoluir um design system — não só consumir.",
    summary: "Um design system é a combinação de: tokens de design (cores, espaçamento, tipografia), componentes UI reutilizáveis, documentação de uso e guias de acessibilidade. No código, são bibliotecas versionadas consumidas por múltiplos produtos. Ferramentas: Storybook para desenvolvimento/documentação, tokens via CSS variables ou JSON, publicação via npm.",
    keypoints: [
      { title: "Design tokens", body: "Variáveis que representam decisões de design: cores semânticas (color.primary, color.error), espaçamentos (spacing.4 = 16px), raios de borda, sombras. Definidos em JSON (Token Studio, Style Dictionary) e compilados para CSS variables, SCSS, JS.", code: `/* CSS variables geradas dos tokens */
:root {
  --color-primary: #3178C6;
  --spacing-4: 1rem;
  --radius-md: 0.5rem;
}` },
      { title: "Componentes com variantes type-safe", body: "Componentes do design system devem ter API consistente: variantes (variant, size, intent) tipadas com TypeScript, props documentadas com JSDoc. cva + TypeScript é o padrão atual para variantes type-safe." },
      { title: "Storybook", body: "Ambiente de desenvolvimento isolado para componentes. Cada componente tem Stories (cenários de uso). Permite desenvolver sem o app, documentar automaticamente props e testar visual automaticamente (Chromatic)." },
      { title: "Versionamento e breaking changes", body: "Design systems são APIs. Breaking changes (renomear prop, remover variante) precisam de major version. Use semantic versioning. Forneça changelogs detalhados e codemod quando possível." },
      { title: "Temas e multi-brand", body: "Design systems para múltiplas marcas usam token layers: tokens primitivos (azul-600: #2563eb) + tokens semânticos (color.primary: {azul-600}) + tokens por marca (marca-a.primary: {roxo-600}). CSS variables com troca de :root permitem tema dinâmico sem re-render." },
    ],
    interview: [
      { q: "Qual a diferença entre design tokens primitivos e semânticos?", a: "<p>Tokens primitivos são valores brutos: blue-500: '#3b82f6', spacing-4: '16px'. Não têm semântica de uso.</p><p>Tokens semânticos usam primitivos com nome de propósito: color.primary: '{blue-500}', color.error: '{red-600}'. Os componentes usam tokens semânticos — se você mudar qual primitivo mapeia para primary, todos os componentes atualizam automaticamente.</p><p>Essa separação é o que permite multi-brand e dark mode limpos.</p>", tip: "A maioria dos devs conhece tokens como 'variáveis de CSS'. Mostrar que você sabe a camada primitiva vs semântica é diferencial sênior.", level: "senior" },
      { q: "Como você gerencia breaking changes em um design system?", a: "<p>Semver: patch para bugfixes visuais, minor para adição de props, major para remoção/renomeação de props ou mudanças que quebram layouts. Forneça: CHANGELOG detalhado por versão, migration guide para majors, codemods automatizados quando possível (jscodeshift), período de deprecação antes de remover.</p><p>Versão com prefixo v2/ no pacote npm permite que consumidores migrem gradualmente coexistindo as versões.</p>", level: "senior" },
      { q: "Por que usar Storybook em um design system?", a: "<p>Storybook permite: desenvolvimento de componentes em isolamento (sem montar o app inteiro), documentação automática via JSDoc e prop types, teste visual com Chromatic (detecta diff de pixels entre PRs), catálogo navegável para designers e devs, stories como testes de acessibilidade automatizados (a11y addon).</p>", level: "pleno" },
      { q: "Como você implementaria suporte a dark mode em um design system?", a: "<p>A abordagem padrão: tokens semânticos via CSS variables, troca de tema via atributo no :root (data-theme='dark' ou .dark class). Os componentes usam apenas tokens semânticos (var(--color-surface)) — nunca valores primitivos diretos. Ao trocar o tema, as CSS variables são redefinidas e tudo atualiza sem re-render.</p>", level: "senior" },
    ],
    gotchas: [
      "Componentes com muita flexibilidade (muitas props, muitas variantes) tornam o design system inconsistente. Constraint é feature — design systems devem guiar, não só suportar tudo.",
      "Publicar sem Storybook é publicar sem documentação. Componentes sem stories tendem a ser usados errado.",
      "Versionamento lazy (publicar main direto, sem semver) destrói a confiança dos consumidores. Um breaking change silencioso pode quebrar múltiplos produtos.",
    ],
    resources: [
      { title: "Storybook docs", url: "https://storybook.js.org/docs", kind: "docs" },
      { title: "Token Studio", url: "https://tokens.studio/", kind: "pratica" },
      { title: "Style Dictionary", url: "https://amzn.github.io/style-dictionary/", kind: "docs" },
    ],
  },

  // ─── P3 ──────────────────────────────────────────────────────────────────────

  "javascript": {
    tagline: "A linguagem da web — base de todo frontend e backend Node.js.",
    why: "TypeScript compila para JavaScript. Entender o runtime JS (event loop, closures, prototype chain) é necessário para depurar bugs que TypeScript não previne.",
    gotchas: [
      "== faz coerção de tipo implícita (null == undefined é true). Sempre use ===.",
      "var tem function scope e hoisting. Prefira const e let que têm block scope.",
      "this muda de acordo com como a função é chamada — não onde foi definida. Arrow functions capturam o this léxico do escopo externo.",
      "JSON.parse/stringify não serializa undefined, funções ou circular refs — lança silenciosamente ou retorna undefined.",
      "0.1 + 0.2 !== 0.3 — floating point. Para dinheiro, use inteiros (centavos) ou Intl.NumberFormat.",
    ],
  },

  "html": {
    tagline: "Linguagem de marcação que estrutura o conteúdo da web com semântica.",
    why: "HTML semântico correto é a base de acessibilidade, SEO e compatibilidade. Muitos erros de a11y vêm de HTML não-semântico.",
    gotchas: [
      "Usar div/span para tudo perde semântica. Use nav, main, article, section, header, footer, h1-h6, button, input, label.",
      "label sem for/htmlFor (ou sem input como filho) não conecta ao input — click no label não foca o campo.",
      "Imagens sem alt são inacessíveis para leitores de tela. alt='' para decorativas, alt descritivo para informativas.",
      "tabindex='0' torna elemento focável via teclado. tabindex='-1' remove do fluxo de Tab mas permite foco programático.",
    ],
  },

  "css": {
    tagline: "Linguagem de estilos da web — box model, flexbox, grid, cascade, especificidade.",
    why: "CSS puro continua sendo necessário para entender o que frameworks como Tailwind geram. Debugging de layout requer conhecimento de box model, stacking context e cascade.",
    gotchas: [
      "Especificidade: id > class > tag. !important vence tudo mas cria dívida — evite. Prefira aumentar especificidade ou usar camadas (@layer).",
      "margin collapsing: margens verticais adjacentes de elementos em fluxo normal colapsam. Não acontece em flex/grid containers.",
      "position: fixed é relativo ao viewport, mas se um ancestral tiver transform, filter ou perspective, o contexto muda — o fixed vira relativo a esse ancestral.",
      "z-index só funciona em elementos com position diferente de static. Cria stacking context — elementos dentro de um contexto não concorrem com elementos fora.",
    ],
  },

  "mui": {
    tagline: "Biblioteca React de componentes Material Design — completa e madura.",
    why: "MUI ainda domina codebases corporativas e projetos internos. Entender o sistema de tema (createTheme), sx prop e como customizar é necessário para manutenção.",
    gotchas: [
      "sx prop é conveniente mas gera CSS-in-JS em runtime — em apps muito grandes, considere o impacto de performance.",
      "Customizar componentes MUI via styled() ou theme.components é o caminho correto — sobrescrever classes CSS internas quebra com atualizações.",
      "MUI v5 mudou de JSS para Emotion. Migração de v4 para v5 é significativa — não assuma compatibilidade.",
    ],
  },

  "styled-components": {
    tagline: "CSS-in-JS que usa template literals para estilizar componentes React com escopo automático.",
    why: "Styled-components ainda aparece em muitas codebases React. Com a ascensão de Tailwind e o movimento para zero-runtime CSS, está perdendo adoção — mas é necessário para manutenção.",
    gotchas: [
      "CSS-in-JS em runtime tem custo: serialização de estilos, injeção de <style> tags, re-serialização em SSR. Em apps com muitos componentes, impacta performance.",
      "Styled-components cria novas classes a cada render quando props mudam — certifique-se de que os estilos dinâmicos sejam mínimos.",
      "Com React Server Components (Next.js App Router), CSS-in-JS tradicional não funciona sem configuração extra — estilos são gerados em runtime no cliente.",
    ],
  },

  "vuetify": {
    tagline: "Biblioteca Vue de componentes Material Design — ecossistema Vue equivalente ao MUI.",
    why: "Vuetify domina projetos Vue corporativos. Se você trabalha com Vue, eventualmente vai encontrar Vuetify.",
    gotchas: [
      "Vuetify 3 é específico para Vue 3 — não confunda com Vuetify 2 (Vue 2). APIs são diferentes.",
      "Customização via variáveis SASS requer configuração do build. Simples no Vite com vite-plugin-vuetify.",
      "Componentes Vuetify são pesados em bundle. Usar tree-shaking via Vite plugin é necessário para bundle razoável.",
    ],
  },

  "scss": {
    tagline: "Superset de CSS com variáveis, nesting, mixins e funções — compila para CSS.",
    why: "SCSS ainda aparece em codebases legados e em alguns design systems. Conhecer variáveis, mixins e @use é necessário para manutenção.",
    gotchas: [
      "@import está deprecated em favor de @use e @forward. @use tem namespace automático — variáveis de outro arquivo precisam de prefixo.",
      "Nesting excessivo (mais de 3 níveis) gera especificidade alta demais e CSS difícil de sobrescrever.",
      "Variáveis SCSS ($var) são compile-time. CSS custom properties (--var) são runtime — permitem mudança dinâmica com JS. Para temas dinâmicos, prefira CSS custom properties.",
    ],
  },

  "bootstrap": {
    tagline: "Framework CSS com grid, componentes e utilitários — padrão legado.",
    why: "Bootstrap ainda está em incontáveis projetos legados. Entender o grid system e como sobrescrever estilos é necessário para manutenção.",
    gotchas: [
      "Bootstrap 5 removeu jQuery — não misture com código que depende de jQuery Bootstrap 4.",
      "Sobrescrever Bootstrap via !important cria cascata de !important difícil de gerenciar. Use variáveis SCSS antes de compilar.",
      "O grid de 12 colunas ainda é útil, mas para layouts modernos, CSS Grid nativo é mais poderoso e sem overhead de classes.",
    ],
  },

  "responsive-design": {
    tagline: "Técnica de design que adapta o layout para diferentes tamanhos de tela com CSS.",
    why: "Responsividade é esperada em todo projeto web. Entender breakpoints, unidades relativas e container queries é necessário.",
    gotchas: [
      "Media queries mobile-first (min-width) são mais manuteníveis que desktop-first (max-width). Tailwind usa mobile-first por padrão.",
      "100vw inclui a largura da scrollbar — pode causar overflow horizontal. Use 100% em elementos que devem preencher o container.",
      "Fontes em px não escalam com preferências de acessibilidade do usuário. Use rem (relativo ao font-size do root) para tipografia.",
    ],
  },

  "jotai": {
    tagline: "Gerenciamento de estado atômico para React — alternativa minimalista ao Zustand.",
    why: "Jotai adota o modelo de átomos (inspirado em Recoil) — bom para estado derivado complexo. Aparece em projetos que precisam de granularidade fina.",
    gotchas: [
      "Átomos são globais por padrão — sem Provider, o estado é compartilhado entre todas as instâncias. Use Provider para isolar estado por subárvore.",
      "Átomos derivados (atom(get => get(baseAtom) * 2)) são calculados sob demanda — não armazenam valor até serem lidos.",
      "Não use Jotai e Zustand juntos sem motivo — resolvem o mesmo problema com modelos diferentes.",
    ],
  },

  "vuex": {
    tagline: "Gerenciamento de estado oficial do Vue 2 — substituído pelo Pinia no Vue 3.",
    why: "Vuex ainda aparece em projetos Vue 2 em manutenção. Entender state/getters/mutations/actions é necessário.",
    gotchas: [
      "Vuex é específico para Vue 2 — no Vue 3, use Pinia. Tentar usar Vuex 4 no Vue 3 funciona mas é caminho sem futuro.",
      "Mutations devem ser síncronas. Async vai em actions. Violação não gera erro mas quebra o DevTools de state tracking.",
      "Namespaced modules são necessários em apps grandes mas adicionam boilerplate na chamada (store.dispatch('module/action')).",
    ],
  },

  "pinia": {
    tagline: "Gerenciamento de estado oficial do Vue 3 — simples, type-safe e com DevTools.",
    why: "Pinia é o padrão atual para estado global em Vue 3. Substitui Vuex com API mais limpa e melhor TypeScript support.",
    gotchas: [
      "Não desestruture a store diretamente — perde reatividade. Use storeToRefs() para extrair propriedades reativas.",
      "Stores Pinia são lazy — criadas na primeira chamada de useStore(). Não confie na ordem de inicialização.",
      "Actions podem ser async — mas sem a separação mutation/action do Vuex. Tudo é action em Pinia.",
    ],
  },

  "swr": {
    tagline: "Biblioteca de data fetching para React com foco em stale-while-revalidate.",
    why: "SWR da Vercel é alternativa ao React Query, mais simples e menor. Aparece em projetos Next.js da Vercel ecosystem.",
    gotchas: [
      "SWR é mais simples que React Query mas tem menos features: sem mutations nativas, sem infinite queries nativas no mesmo nível.",
      "O fetcher precisa lançar erro para SWR detectar falha — um fetch que retorna 404 sem throw não marca como erro.",
      "Cache SWR é in-memory por padrão — não persiste entre reloads. Para persistência, use middleware de cache customizado.",
    ],
  },

  "apollo-client": {
    tagline: "Cliente GraphQL com cache normalizado para React — padrão em stacks GraphQL.",
    why: "Apollo Client aparece em qualquer stack com GraphQL. Entender o cache normalizado, queries/mutations/subscriptions e políticas de fetch é necessário.",
    gotchas: [
      "O cache normalizado do Apollo pode servir dados obsoletos após mutations. Use refetchQueries ou update no cache manualmente.",
      "Apollo InMemoryCache normaliza por __typename + id — se sua API não retorna id consistentemente, o cache não funciona corretamente.",
      "Apollo adiciona peso considerável ao bundle (~30KB). Para queries simples, urql ou fetch direto são alternativas mais leves.",
    ],
  },

  "axios": {
    tagline: "Cliente HTTP com interceptors, cancelamento e transformação automática de JSON.",
    why: "Axios ainda é onipresente em codebases que não usam React Query ou SWR. Saber configurar instâncias com interceptors é necessário.",
    gotchas: [
      "Axios considera qualquer status 2xx como sucesso. 400 e 500 são erros que vão para o catch. fetch() nativo não faz isso — retorna resolved mesmo para 404.",
      "Interceptors de response são globais — cuidado ao adicionar múltiplos ou não remover ao desmontar componentes.",
      "Cancelamento com AbortController é mais moderno que CancelToken (deprecated). Use signal: controller.signal.",
    ],
  },

  "recharts": {
    tagline: "Biblioteca de gráficos React baseada em D3 — declarativa e composável.",
    why: "Recharts é a opção mais popular para gráficos em projetos React. API declarativa com componentes React — sem aprender D3 do zero.",
    gotchas: [
      "Recharts requer que o container pai tenha height definido — sem height explícito, o gráfico não renderiza.",
      "Customização avançada (tooltips, labels customizados) requer renderProps e pode ficar verboso.",
      "Performance pode degradar com muitos pontos de dados — use data sampling ou virtualização para séries grandes.",
    ],
  },

  "apexcharts": {
    tagline: "Biblioteca de gráficos JavaScript com wrapper React — rica em tipos de gráfico.",
    why: "ApexCharts aparece em dashboards e relatórios por sua riqueza de tipos de gráfico e opções de exportação.",
    gotchas: [
      "ApexCharts usa opções em objeto de configuração (não JSX puro) — diferente de Recharts. Mudanças de dados requerem re-instanciação ou uso do método updateOptions.",
      "SSR com Next.js pode falhar — ApexCharts acessa window. Use dynamic import com ssr: false.",
      "Bundle é maior que Recharts — avalie se a riqueza de gráficos justifica.",
    ],
  },

  "echarts": {
    tagline: "Biblioteca de gráficos Apache — poderosa para visualizações complexas e grandes volumes de dados.",
    why: "ECharts tem melhor performance que Recharts/ApexCharts para grandes volumes de dados. Usado em dashboards de analytics e BI.",
    gotchas: [
      "ECharts usa configuração imperativa via setOption() — menos React-like. Use echarts-for-react para wrapper declarativo.",
      "Instância ECharts precisa ser destruída no unmount para evitar memory leak.",
      "SSR não é suportado nativamente — use dynamic import no Next.js.",
    ],
  },

  "tanstack-table": {
    tagline: "Motor headless para tabelas e datagrid — sorting, filtering, pagination sem UI embutida.",
    why: "TanStack Table (React Table v8) é o padrão para tabelas complexas em React sem depender de MUI DataGrid ou ag-Grid. API headless dá controle total sobre renderização.",
    gotchas: [
      "TanStack Table é headless — você é responsável por toda a renderização. Sem CSS embutido.",
      "Sorting e filtering do lado do cliente não escalam para milhões de linhas — use server-side com manualSorting e manualFiltering.",
      "columnDef e data precisam ser memoizados para evitar re-inicialização desnecessária da tabela.",
    ],
  },

  "mui-datagrid": {
    tagline: "Componente de DataGrid do MUI — tabela com virtualização, sorting e filtering embutidos.",
    why: "MUI DataGrid aparece em projetos enterprise que já usam MUI. A versão Pro/Premium tem features avançadas (grouping, tree data, Excel export).",
    gotchas: [
      "DataGrid Community é gratuita mas limitada. Row grouping e Excel export requerem licença Pro/Premium.",
      "Virtualização pode causar problemas com impressão e testes que precisam de todos os rows no DOM.",
      "Customizar células complexas com renderCell requer cuidado com performance — use React.memo nos componentes de célula.",
    ],
  },

  "exceljs": {
    tagline: "Biblioteca Node.js/browser para leitura e escrita de arquivos Excel (.xlsx).",
    why: "Exportação para Excel é requisito comum em sistemas corporativos. ExcelJS permite gerar planilhas com formatação, fórmulas e múltiplas abas.",
    gotchas: [
      "ExcelJS em browser gera bundle significativo. Use importação dinâmica ou mova para uma API route no servidor.",
      "Fórmulas em células são armazenadas como strings — o Excel calcula ao abrir. Para valores calculados no backend, escreva o valor diretamente.",
      "Datas em Excel são números seriais. ExcelJS lida com isso automaticamente, mas ao ler, verifique o tipo da célula.",
    ],
  },

  "jspdf": {
    tagline: "Biblioteca JavaScript para geração de PDFs no browser ou Node.js.",
    why: "jsPDF aparece em sistemas que precisam de geração de PDF no cliente (sem servidor). Alternativa ao @react-pdf/renderer para casos simples.",
    gotchas: [
      "jsPDF não renderiza HTML diretamente. Para PDF a partir de HTML, use html2canvas para capturar como imagem + jsPDF para embedding.",
      "Fontes customizadas requerem embedding manual em base64 — sem isso, caracteres especiais (ã, ç, é) podem não aparecer.",
      "PDFs gerados no cliente são visíveis no bundle — não use para documentos com dados sensíveis sem server-side generation.",
    ],
  },

  "vuelidate": {
    tagline: "Biblioteca de validação de formulários para Vue 3 — baseada em composables.",
    why: "Vuelidate é o equivalente Vue do Formik/React Hook Form. Aparece em projetos Vue que precisam de validação declarativa.",
    gotchas: [
      "Vuelidate valida em tempo real por padrão — para validar apenas no submit, use $dirty flag.",
      "Regras customizadas devem retornar boolean ou Promise<boolean>. Não lançar exceção.",
      "useVuelidate() deve ser chamado no setup — não dentro de event handlers ou computed.",
    ],
  },

  "svelte": {
    tagline: "Framework JavaScript que compila para JS vanilla — sem runtime, reatividade no compilador.",
    why: "Svelte tem crescimento constante e abordagem única: compila componentes para JS imperativo otimizado. Alternativa a React/Vue para projetos que priorizam bundle mínimo.",
    gotchas: [
      "Svelte usa reatividade baseada em atribuição — reatribuir um array/objeto dispara update. Mutação direta (.push(), .x = y) não é reativa (sem reatribuição).",
      "Stores Svelte são diferentes de Pinia/Zustand — use writable(), readable(), derived(). Acesso com $ é açúcar sintático do compilador.",
      "Ecossistema menor que React/Vue. Muitas libs React não têm equivalente Svelte.",
    ],
  },

  "angularjs": {
    tagline: "Framework JavaScript legado do Google (AngularJS 1.x) — não confunda com Angular moderno.",
    why: "AngularJS (1.x) ainda roda em sistemas legados. Não confunda com Angular (2+) que é completamente diferente.",
    gotchas: [
      "AngularJS atingiu End of Life em dezembro de 2021 — sem mais patches de segurança. Migre para Angular, React ou Vue.",
      "O two-way binding via $scope e $watch tem performance cara em apps com muitos watchers. Sintoma: digest cycle lento.",
      "Não misture AngularJS com ES modules nativos — o sistema de módulos do AngularJS é próprio e anterior aos ES modules.",
    ],
  },

  "react-native": {
    tagline: "Framework para apps mobile com React — componentes nativos, sem WebView.",
    why: "React Native permite reutilizar conhecimento React para mobile. Aparece em vagas full-stack mobile/frontend.",
    gotchas: [
      "React Native não é React para browser. StyleSheet é diferente de CSS: sem cascade, sem herança de estilos, flexbox com direção column por padrão.",
      "Debugging é mais complexo — sem DevTools de browser. Use Flipper ou o React Native DevTools.",
      "Performance de listas requer FlatList ou SectionList — nunca ScrollView com map() para listas longas.",
    ],
  },

  "webpack": {
    tagline: "Bundler JavaScript — empacota módulos, assets e dependências para produção.",
    why: "Webpack ainda domina em projetos legados e em configurações que Vite não cobre (micro-frontends complexos, module federation). Entender a configuração é necessário para debugging de build.",
    gotchas: [
      "Webpack 5 Module Federation permite compartilhar código entre apps em runtime — não confunda com sharing em monorepo (compile-time).",
      "Configurações erradas de source maps podem vazar código-fonte em produção. Use hidden-source-map para produção.",
      "Plugins e loaders têm ordem de execução específica — loaders rodam de baixo para cima, plugins em hooks do ciclo de build.",
    ],
  },

  "seo": {
    tagline: "Conjunto de práticas para melhorar visibilidade de páginas em mecanismos de busca.",
    why: "SEO técnico é responsabilidade do frontend. Entender meta tags, structured data, Core Web Vitals e crawlability é esperado em projetos public-facing.",
    gotchas: [
      "SPAs renderizadas no cliente têm SEO comprometido se o crawler não executa JavaScript. Use SSR ou SSG para conteúdo indexável.",
      "Cada página deve ter title e meta description únicos. Páginas com title duplicado competem entre si nos resultados.",
      "Core Web Vitals (LCP, INP, CLS) são fatores de ranking. LCP ruim penaliza visibilidade mesmo com conteúdo ótimo.",
    ],
  },

}

export default data

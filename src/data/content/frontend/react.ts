import type { SkillContent } from '@/types'

const react: SkillContent = {
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
}

export default react

import type { Attempt } from '@/types'

/**
 * Log de tentativas de DSA (JS básico → LeetCode) e System Design.
 * Cada entrada é criada a partir de uma submissão colada no chat: código/desenho +
 * narrativa de como foi. Ordem cronológica, mais recente por último.
 */
export const ATTEMPTS: Attempt[] = [
  {
    id: 'sysdesign-2026-08-28-fundamentos-dia1',
    date: '2026-08-28',
    track: 'sysdesign',
    source: 'system-design',
    title: 'Fundamentos de System Design — dia 1 (vídeo + anotações)',
    timeSpent: '1h (20min de vídeo, resto escrevendo e digerindo)',
    outcome: 'estudo',
    narrative: 'Primeiro contato real com teoria de System Design, via vídeo em inglês. O tempo de assistir foi curto (20min), mas pensar sobre cada conceito e reescrever com as próprias palavras esticou a sessão para 1h — sinal de que o conteúdo exigiu processamento ativo, não só consumo passivo, que é exatamente o objetivo desta fase do plano.',
    studyTopics: [
      {
        titulo: 'Cada sistema quebra de um jeito diferente',
        corpo: 'Um sistema pode falhar por: (1) esgotar CPU/RAM de um único servidor — resolve-se com um load balancer, que distribui requisições entre múltiplos servidores; (2) sobrecarga do banco de dados — resolve-se com cache para "hot data" (dados quentes, muito acessados), como Redis; (3) a máquina cair por qualquer motivo — é o "single point of failure" (ponto único de falha), resolve-se com réplicas de banco de dados e armazenamento redundante (ex: S3).\n\nImportante: em nenhuma dessas correções uma linha de código de negócio é alterada. É pura abstração da infraestrutura da aplicação — o sistema muda de forma sem que nenhuma função interna seja refatorada.',
      },
      {
        titulo: 'Chaining: toda correção cria um novo problema',
        corpo: 'Padrão recorrente em System Design: Corrige → Novo problema → Corrige → Novo problema...\nExemplo: adiciona-se um load balancer para resolver sobrecarga de servidor. Mas e quando o load balancer cair? E quando o cache ou a réplica do banco ficarem desatualizados em relação à fonte principal? Cada solução introduz uma nova superfície de falha que precisa ser considerada.',
      },
      {
        titulo: 'HLD vs. LLD (High-Level Design vs. Low-Level Design)',
        corpo: 'HLD é o blueprint geral do sistema: o que provavelmente vai quebrar primeiro, e quais componentes de alto nível resolvem isso (cache, CDN, load balancer, réplicas). LLD é o nível de detalhe de implementação: como uma função específica salva dado, como é a lógica de contar curtidas, como funciona o update de um registro.\n\nExemplos de enunciados e a que altitude pertencem:\n— "Design Instagram" → HLD\n— "Design the Like Feature" → LLD\n— "Design an In-Memory Cache" → LLD\n\nRegra prática de entrevista: sempre declarar explicitamente em que altitude a resposta está sendo dada assim que a pergunta for feita ("vou responder isso em nível de HLD..."). Começar na altitude errada é um erro comum e é notado pelo entrevistador.',
      },
      {
        titulo: 'Functional vs. Non-Functional requirements',
        corpo: 'Functional = o que o sistema deve fazer. Non-Functional = quão bem o sistema deve fazer isso (latência, disponibilidade, custo, escala).\n\nExemplo usado: um "Family App" de fotos e o Instagram podem ter exatamente as mesmas funcionalidades — a diferença real entre os dois sistemas está inteiramente nos requisitos non-functional necessários para suportar 1 bilhão de usuários.\n\nUsuário nunca pede "cache" — ele pede "o site carregar mais rápido". Non-functional requirements normalmente competem entre si: um app mais rápido custa mais dinheiro para operar. Não dá para adicionar todo componente possível "só para estar preparado para tudo", porque cada componente tem custo — daí nascem os trade-offs: identificar exatamente o que o sistema precisa, e o que ele explicitamente não precisa.',
      },
      {
        titulo: 'As 5 perguntas antes de desenhar qualquer sistema',
        corpo: '1. Quantos usuários? Crescendo em que velocidade?\n\n2. Read-heavy ou write-heavy? (Ex: usuário rola 100–1000 fotos/mês no feed [read], mas posta só 2–5 fotos/mês [write] → otimizar o caminho de leitura.)\n\n3. Que dado você nunca pode perder, e que dado você pode se dar ao luxo de perder? Perder a foto que um usuário postou pode custar esse usuário para sempre. Já perder precisão no contador de likes (banco mostra 45, tela mostra 41) não tem consequência real — ninguém percebe.\n\n4. Quanta latência você pode se permitir? Ex: abrir o feed precisa carregar em menos de 200ms (deve ser instantâneo); já o upload de uma foto pode tolerar até 5 segundos de espera. Resumo: upload pode ser lento, feed tem que ser instantâneo.\n\n5. Qual o custo? Cada cópia de dado, cada servidor extra, cada cache, cada fila — tudo isso é uma conta mensal a pagar. Mais componentes não significa design melhor: o design correto é aquele que responde as 4 perguntas anteriores gastando o mínimo possível.',
      },
      {
        titulo: '"Designers" vs. "Component-collectors"',
        corpo: 'A postura que impressiona em entrevista é justificar cada componente pelo requisito que ele resolve — "vou adicionar cache porque este sistema é read-heavy e X é o dado mais acessado" — em vez de simplesmente enumerar tecnologias da moda ("vou adicionar cache!"). O entrevistador está avaliando, desde a primeira resposta, se o candidato já parte desenhando ou se primeiro faz as perguntas certas antes de desenhar qualquer coisa.',
      },
      {
        titulo: 'Monolito vs. Microsserviços',
        corpo: 'Monolito: uma única codebase, um único deploy, todas as funções podem chamar umas às outras diretamente, tudo roda no mesmo processo/servidor. Para poucos milhares de usuários, o monolito é a escolha correta — entrega mais rápido e é mais fácil de todo o time entender.\n\nMicrosserviços: divididos em vários programas independentes (ex: um serviço só de upload, outro só de leitura do feed, outro de notificações, outro de likes). Cada funcionalidade é implantada em seu próprio servidor e a comunicação entre eles acontece via rede.\n\nDuas razões reais para migrar de monolito para microsserviços:\n\n(1) Escalonamento independente — no exemplo do app de fotos, se o feed recebe 1284 leituras e apenas 3 posts no mesmo período, em microsserviços é possível dedicar 10 servidores para leitura e apenas 2 para escrita. Em um monolito tudo escala como uma unidade só: escalar o feed para 10 obriga a escalar o upload junto, mesmo sem precisar, gastando mais à toa. Microsserviços permitem casar o tráfego real com os servidores.\n\n(2) Tamanho do time — em um time de 40 devs na mesma codebase, cada mudança de um atrapalha o trabalho dos outros. Em microsserviços, cada squad trabalha isoladamente no seu próprio serviço e entrega de forma independente, tornando o ritmo de entrega mais dinâmico.\n\nPontos negativos de microsserviços: toda comunicação entre serviços depende da rede — pode ser rápida, mas também pode ser lenta ou falhar com timeout, criando uma dependência de rede que não existe no monolito. Debugging também piora: no monolito, um único log concentra todo o rastro do problema; em microsserviços, uma única requisição pode gerar 5 logs diferentes que precisam ser cruzados manualmente para reconstruir o que aconteceu.',
      },
      {
        titulo: 'Monolito com "satélites" — o meio-termo mais usado na prática',
        corpo: 'Muitas empresas não fazem nem monolito puro nem microsserviços extremos: mantêm um monolito central e extraem como serviços satélites apenas as partes que realmente se beneficiam disso. No exemplo do app de fotos: o monolito começa com upload/feed/notify/like, com dois satélites desde o início (payments, search); com o tempo, percebe-se que o feed também merece virar satélite, e essa migração é feita pontualmente — sem nunca desmontar o sistema inteiro em dezenas de microsserviços.\n\nArmadilha comum: startups pequenas (times de 5 pessoas) adotando microsserviços como modismo, terminando com ~30 serviços e gastando mais tempo debugando problemas de rede do que construindo o produto. A regra é decidir a arquitetura pelos requisitos reais do sistema, nunca por buzzword.',
      },
    ],
    gaps: [],
    analysis: 'Esta sessão não expôs gap de execução — é conteúdo novo sendo absorvido, exatamente como previsto na fase 1 do plano ("System Design: conceitos desde o início, sem prática de desenho ainda"). O ponto positivo real aqui é que você já demonstrou o "Feynman test" do princípio 06 da rotina: reescreveu cada conceito com palavras próprias e amarrou tudo a um exemplo concreto (o app de fotos), em vez de copiar definições soltas — é isso que separa reconhecer teoria de conseguir aplicá-la depois num desenho ao vivo.\n\nUm ponto a observar daqui pra frente: a lista de "5 perguntas antes de desenhar" e a distinção HLD/LLD são as duas peças mais imediatamente aplicáveis quando a fase 5 (semanas 5–8) chegar na primeira prática de desenho do zero. Vale revisitar este registro antes daquela sessão, em vez de reaprender do zero.',
    nextStep: 'Continuar a mesma playlist/fonte nos próximos dias até fechar os conceitos-base (caching patterns, load balancing em detalhe, banco relacional vs. NoSQL) antes da semana 5, quando entra a primeira prática de desenho guiado.',
  },
  {
    id: 'sysdesign-2026-08-29-scaling-load-balancer-stateless',
    date: '2026-08-29',
    track: 'sysdesign',
    source: 'system-design',
    title: 'Scaling, Load Balancer e Stateless — dia 2 (vídeo + anotações)',
    timeSpent: 'não informado',
    outcome: 'estudo',
    narrative: 'Segunda sessão da mesma fonte, aprofundando o conceito de load balancer citado no dia 1. Cobriu o mecanismo interno do load balancer (health checks, least-connections, distribuição por peso), o percurso completo de uma requisição (DNS → IP → HTTPS), e fechou com o conceito mais denso da sessão: a diferença entre aplicações stateful e stateless, incluindo o motivo real pelo qual sticky sessions são uma armadilha, não uma solução.',
    studyTopics: [
      {
        titulo: 'Vertical Scaling vs. Horizontal Scaling',
        corpo: 'Vertical scaling é o ponto de partida natural para projetos simples com poucos usuários: aumentar a capacidade de um único servidor. Tem dois problemas sérios: existe um teto de plano/hardware que é alcançado rápido, e se esse único servidor cair, o sistema inteiro cai junto (é um single point of failure). Além disso, a relação custo × capacidade tende a ser exponencial — pagar o dobro em um servidor maior costuma trazer só ~20% de ganho de eficiência, não 100%.\n\nHorizontal scaling cria vários servidores menores em vez de aumentar um único servidor. Vantagem: se um servidor morre, a aplicação continua rodando pelos demais. Duas exigências para funcionar: (1) um load balancer para decidir para qual servidor mandar cada requisição, e (2) garantir que todos os servidores compartilhem o mesmo sistema de persistência/banco de dados — senão um upload feito no servidor 1 pode não aparecer quando o usuário for visualizar via servidor 2.\n\nNa prática, muitos sistemas misturam os dois: fazem horizontal scaling com alguns servidores maiores que outros, dedicados a objetivos diferentes.',
      },
      {
        titulo: 'O percurso de uma requisição (DNS → IP → HTTPS)',
        corpo: 'Quando o usuário digita uma URL (ex: danielmoliari.com), esse nome é resolvido contra uma lista de nome=IP — como uma agenda de contatos por nome em vez de número. O DNS relaciona o nome ao IP correspondente, o IP é usado para contatar o servidor, e o servidor devolve o conteúdo e conduz toda a comunicação com o dispositivo do cliente usando o protocolo HTTP — hoje quase sempre HTTPS (o "Secure" adicionado). Essa troca de dados entre servidor e cliente é o que se chama de "request" ou "network".\n\nSempre que alguém pedir para "aumentar a velocidade" de uma request, é preciso primeiro esclarecer qual velocidade: latência (tempo de ida e volta de uma única request) ou bandwidth (quanto dado cabe em uma única request). São otimizações diferentes.',
      },
      {
        titulo: 'Load Balancer: papel e mecanismo interno',
        corpo: 'Sem load balancer: Cliente → DNS → IP do servidor único → resposta HTTPS → Cliente. Se esse servidor morre, o sistema acaba.\n\nCom load balancer: Cliente → DNS → IP do Load Balancer (um "servidor de servidores") → ele direciona a request para um dos vários servidores existentes → resposta HTTPS → Cliente. (Depois do servidor, o fluxo normalmente ainda passa por um banco de dados antes de retornar.)\n\nO load balancer não apenas distribui requests igualmente quando necessário — ele sabe quais servidores têm mais ou menos capacidade, quais estão "dead" (mortos) ou "overloaded" (sobrecarregados), porque executa Health Checks a cada poucos segundos antes de rotear qualquer request.\n\nMecanismos de decisão do load balancer:\n— Least-Connections: escolhe o servidor com menos conexões ativas no momento.\n— Distribuição por peso: em setups mistos (vertical + horizontal), se um servidor tem o dobro da capacidade de outro, o load balancer envia o dobro de requests para ele proporcionalmente.\n\nNa prática não se constrói um load balancer do zero — usa-se Nginx, HAProxy ou AWS Elastic Load Balancer. Um load balancer também é chamado, em alguns contextos, de "reverse proxy" — é o mesmo conceito com outro nome.\n\nPonto crítico: se o próprio load balancer morre, a aplicação inteira cai — por isso, em produção, é comum ter pelo menos dois load balancers redundantes.',
      },
      {
        titulo: 'Stateful vs. Stateless — e por que sticky sessions são uma armadilha',
        corpo: 'Stateful é quando cada servidor guarda memória de requests passadas — por exemplo, session files de login. Isso é problemático em horizontal scaling: se o usuário loga e o load balancer o direciona ao servidor 1 (onde a session fica salva), e na próxima requisição o load balancer o manda para o servidor 2, esse segundo servidor não tem a session file gerada no login e força o usuário a logar de novo.\n\nA solução correta é tornar a aplicação stateless: cada servidor segue o ciclo Handle → Answer → Forget (atende, responde, esquece), sem reter nada localmente. Para isso, todos os servidores compartilham um mesmo "shared storage" — vale tanto para sessions quanto para logs.\n\nUma solução alternativa (e falha) é sticky sessions: forçar o load balancer a sempre mandar as requisições daquele usuário para o mesmo servidor onde a session dele foi criada. Isso reintroduz exatamente o problema que o horizontal scaling + load balancer deveria resolver: se aquele servidor específico morrer, tudo que o usuário estava fazendo quebra — na prática, o sistema volta a se comportar como se só tivesse um servidor, mesmo tendo dez.\n\nTeste prático para saber se um design é stateful: "se este servidor sumir agora, algum usuário perde alguma coisa?" Se a resposta for sim, o design é stateful — está retendo algum tipo de dado dentro do próprio servidor.\n\nCuidado com a pergunta errada: "minha aplicação guarda dados?" não é o teste certo — um servidor que faz upload de imagens para um banco/cloud storage externo não é stateful, porque o dado vive "outside" (fora) do servidor. Stateful só se aplica quando o dado vive "inside" (dentro) do próprio servidor. A pergunta certa é: onde esse dado realmente vive?\n\nA maior parte das funcionalidades já usa banco externo naturalmente (upload de foto, download de foto, etc.) e por isso já nasce stateless. A causa mais comum de uma aplicação virar stateful, na prática, é justamente a sessão de login — que precisa persistir em algum lugar e, por padrão, tende a ficar presa nos próprios servidores se ninguém decidir explicitamente criar um shared store para ela.\n\nConclusão do vídeo: o primeiro passo para uma aplicação escalar de verdade é mantê-la stateless — só assim é possível adicionar, matar ou reiniciar qualquer servidor sem nenhum usuário notar diferença.',
      },
    ],
    gaps: [],
    analysis: 'Segunda sessão consecutiva de estudo puro, sem sinal de gap de execução — o que é esperado nesta fase. Dois pontos de qualidade a destacar: primeiro, você já detectou sozinho a armadilha das sticky sessions (que "parece" resolver o problema mas na prática devolve o sistema à fragilidade de servidor único) — esse tipo de raciocínio "essa solução resolve X mas reintroduz Y" é exatamente o padrão de "chaining" (corrige → novo problema) que você registrou no dia 1, e você aplicou esse padrão sem que estivesse explicitado no vídeo. Segundo, o teste "se esse servidor sumir, alguém perde algo?" e a distinção inside/outside do servidor são heurísticas praticamente prontas para usar ao vivo numa entrevista — não é só teoria, é uma pergunta que se verbaliza durante o próprio desenho.\n\nUm ponto de atenção para a auto-avaliação: esta sessão aprofundou um tópico (load balancer) que já tinha sido introduzido no dia 1 em vez de abrir um tópico totalmente novo — isso é saudável (mostra que a fonte tem progressão lógica), mas vale registrar quando a mesma sessão cobrir tópico 100% novo vs. aprofundamento, para não confundir "muito conteúdo visto" com "muito conteúdo novo" na hora de avaliar ritmo.',
    nextStep: 'Ao continuar a playlist, prestar atenção especial em caching patterns (cache-aside, write-through) — é o próximo tópico natural depois de load balancer + stateless, e fecha o tripé que resolve os 3 cenários de falha citados no dia 1 (CPU/RAM, database overload, single point of failure).',
  },
  {
    id: 'dsa-2026-09-01-fcc-basic-js-sessao1',
    date: '2026-09-01',
    track: 'dsa',
    source: 'js-basico',
    title: 'freeCodeCamp — Basic JavaScript (34/113 lições)',
    level: 'facil',
    timeSpent: 'não informado',
    outcome: 'resolvido',
    narrative: 'Primeira sessão real de fase 1 (fluência de sintaxe). Encontrar o curso certo tomou um tempo à parte — o primeiro link que apareceu no Google foi para o blog do freeCodeCamp (freecodecamp.org/news), sem editor interativo, e depois um segundo caminho levou ao "Daily Coding Challenge" (freecodecamp.org/learn/daily-coding-challenge), que é um desafio avulso estilo LeetCode (o do dia era "Tribonacci Sequence", nível Medium) — fora de ordem para este momento do plano. O caminho correto era freecodecamp.org/learn/javascript-algorithms-and-data-structures/, módulo "Basic JavaScript". A partir daí, 34 das 113 lições do módulo foram concluídas na sessão, sem travar em nenhuma, até bater cansaço e parar.',
    gaps: [],
    analysis: 'Nenhuma trava registrada em 34 lições é um dado bom e informativo: sugere que a fluência de sintaxe mais elementar (variáveis, tipos, loops simples, operadores) não está tão quebrada quanto o diagnóstico inicial temia — o que bate com a leitura de que o gap relatado ("erro até em lógica básica") provavelmente se concentra mais adiante, no ponto em que as lições exigem compor várias dessas peças sozinho sem nenhum código de apoio já escrito, algo que ainda não foi testado nesta faixa 1–34.\n\nO único atrito real da sessão foi de navegação, não de conteúdo: duas URLs erradas antes de achar o módulo certo. Vale anotar o link direto para não repetir a busca.',
    nextStep: 'Continuar do item 35/113 em uma próxima sessão. Prestar atenção em quando as lições passarem de "completar uma linha" para "escrever a função inteira sozinho" — esse é o ponto onde uma trava real, se existir, deve aparecer. Guardar o link direto: freecodecamp.org/learn/javascript-algorithms-and-data-structures/ → módulo Basic JavaScript.',
  },
]

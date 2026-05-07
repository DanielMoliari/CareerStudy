'use client'
import { useState } from 'react'
import type { PdfType, PdfCard, PdfBuilderFn } from '@/components/pdfs/types'
import { PdfModal } from '@/components/pdfs/PdfModal'
import { HeroCard, CollectionCard } from '@/components/pdfs/PdfCards'
import { buildQAReviewPdf } from '@/components/pdfs/QAReviewPdf'
import type { QAItem } from '@/components/pdfs/QAReviewPdf'
import { buildQuickRefPdf } from '@/components/pdfs/QuickRefPdf'
import type { QuickRefColumn } from '@/components/pdfs/QuickRefPdf'
import { buildCheatsheetPdf } from '@/components/pdfs/CheatsheetPdf'
import type { HookItem, RuleItem } from '@/components/pdfs/CheatsheetPdf'
import { buildMnemonicsPdf } from '@/components/pdfs/MnemonicsPdf'
import type { MnemonicItem } from '@/components/pdfs/MnemonicsPdf'
import { buildAntipatternsPdf } from '@/components/pdfs/AntipatternsPdf'
import type { AntiPatternItem } from '@/components/pdfs/AntipatternsPdf'
import { buildErrorRefPdf } from '@/components/pdfs/ErrorRefPdf'
import type { ErrorEntry } from '@/components/pdfs/ErrorRefPdf'

// ── Paleta Lambda (AWS) ───────────────────────────────────────────────────────
const C = '#FF9900'

// ── Cards de PDF ──────────────────────────────────────────────────────────────

const PDF_CARDS: PdfCard[] = [
  {
    id: 'qa',
    title: 'Q&A Review',
    subtitle: 'As 20 perguntas mais cobradas em entrevista Lambda',
    type: 'qa',
    pages: 9,
    description: 'Recuperação ativa nível pleno e sênior: cold start, Provisioned vs Reserved Concurrency, SnapStart, SQS + Lambda, Lambda@Edge vs CloudFront Functions, idempotência, observability com Powertools, VPC penalty e tuning de memória.',
    icon: '01',
    goal: 'Recuperação ativa',
    featured: true,
  },
  {
    id: 'cheatsheet',
    title: 'CheatSheet Lambda',
    subtitle: 'Limites, event sources, concorrência e regras de ouro em uma página',
    type: 'cheatsheet',
    pages: 2,
    description: 'Referência densa: todos os limites Lambda (timeout, memória, /tmp, pacote), comportamento de retry por event source, modelo de concorrência (Default vs Reserved vs Provisioned), regras de produção e patterns de observabilidade com Powertools.',
    icon: '02',
    goal: 'Consulta rápida',
  },
  {
    id: 'quick-ref',
    title: 'Lambda CLI Quick Ref',
    subtitle: 'aws lambda + aws logs em um cartão A4 landscape',
    type: 'quick-ref',
    pages: 1,
    description: 'Cartão A4 com 3 colunas: gerenciamento de função (invoke, update-code, publish-version), aliases e versions, configuração de concorrência, event source mappings e debugging com aws logs tail.',
    icon: '03',
    goal: 'Referência de CLI',
  },
  {
    id: 'mnemonics',
    title: 'Mnemônicos Lambda',
    subtitle: 'Truques para gravar conceitos abstratos: cold start, concorrência, retry',
    type: 'mnemonics',
    pages: 2,
    description: 'SAP para tipos de invocação, FRIO para fatores que pioram cold start, RPDT para conceitos de concorrência e CKBI para SQS+Lambda. Os truques que ancoram conceitos abstratos para entrevista.',
    icon: '04',
    goal: 'Memória de longo prazo',
  },
  {
    id: 'antipatterns',
    title: 'Anti-patterns Lambda',
    subtitle: 'Os 6 erros que mais derrubam Lambda em produção',
    type: 'antipatterns',
    pages: 3,
    description: 'Diff errado x correto: conexão DB no handler, sem DLQ em assíncrono, visibility timeout SQS menor que Lambda timeout, pacote gigante, secrets em env vars plaintext e sem idempotência em retry.',
    icon: '05',
    goal: 'Reconhecimento de padrão',
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting Guide',
    subtitle: 'Os erros operacionais mais comuns — sintoma, causa raiz, solução',
    type: 'errors',
    pages: 4,
    description: 'Diferente dos anti-patterns (erros de design), este guia cobre erros que acontecem em runtime: timeout, out of memory, throttling, cold start excessivo, falhas de IAM, ENI provisioning. Cada erro com mensagem real do CloudWatch, causa raiz e solução em código.',
    icon: '06',
    goal: 'Diagnóstico rápido',
  },
]

// ── Q&As ──────────────────────────────────────────────────────────────────────

const QAS: QAItem[] = [
  {
    level: 'Pleno',
    q: 'Como reduziria cold start em Lambda?',
    a: '<strong>Provisioned Concurrency:</strong> mantém N instâncias quentes permanentemente. Tem custo fixo — use só para funções críticas de latência.<br><br><strong>Redução do pacote:</strong> bundler (esbuild para Node), remover devDependencies, tree-shaking. Pacote menor = init mais rápido.<br><br><strong>Escolha de runtime:</strong> Node.js e Python têm cold start mais rápido que Java e .NET. <strong>SnapStart</strong> para Java: tira snapshot do estado inicializado e restaura em ms.<br><br><strong>Lazy initialization:</strong> só inicialize recursos no primeiro uso — evite inicializar tudo no global scope se não for sempre usado.',
    tip: 'A ordem importa: primeiro reduza o pacote (esbuild), depois escolha runtime (Node>Java), depois Provisioned Concurrency apenas se ainda não atingir o SLA.',
  },
  {
    level: 'Pleno',
    q: 'Lambda vs ECS — quando usar cada?',
    a: '<strong>Lambda:</strong> event-driven, esporádico, curto (menos de 15 min), escala de zero a N automaticamente, sem gerenciamento de infraestrutura. Custo-eficiente para baixo volume de requisições.<br><br><strong>ECS Fargate:</strong> serviços de longa duração, workload contínuo, latência previsível sem cold start, conexão de DB persistente (sem reconnect a cada invocação), containers maiores que 10 GB de memória.<br><br>Regra prática: começa com Lambda. Quando o custo de Lambda superar ECS em $, ou quando precisar de latência consistente sem Provisioned Concurrency, migra para ECS.',
    tip: 'O ponto de virada típico é em torno de 1M req/dia constantes — abaixo disso Lambda é mais barato; acima, ECS Fargate com Savings Plans pode ser mais econômico.',
  },
  {
    level: 'Pleno',
    q: 'O que é Reserved Concurrency e por que é importante?',
    a: 'Reserved Concurrency define o número máximo de instâncias simultâneas de uma função específica. Serve para dois propósitos opostos:<br><br>1. <strong>Proteção:</strong> limitar uma função que consome muitas conexões de DB (ex: máximo 50 instâncias = máximo 50 conexões).<br><br>2. <strong>Garantia:</strong> reservar capacidade para funções críticas — as N instâncias reservadas não são consumidas por outras funções da conta.<br><br>Atenção: definir Reserved Concurrency = 0 efetivamente desabilita a função (throttle em todas as invocações).',
    tip: 'Pegadinha frequente: Reserved=0 não é "ilimitado" — é o oposto. Para "ilimitado" não configure Reserved Concurrency (default).',
  },
  {
    level: 'Senior',
    q: 'Como funciona o modelo de retry para invocação assíncrona?',
    a: 'Em invocação assíncrona (S3 Events, SNS, EventBridge), se a função retornar erro ou timeout, Lambda faz retry automaticamente 2 vezes com backoff exponencial (espera ~1 min e ~2 min).<br><br>Após os retries, a invocação é descartada silenciosamente — a menos que você configure:<br><br><strong>DLQ:</strong> SQS ou SNS recebe a mensagem falhada. <strong>Destinations on failure:</strong> EventBridge, SQS, SNS ou outra Lambda recebe o contexto da falha. Destinations é mais rico que DLQ (inclui o input, output e metadados da falha).',
    tip: 'Sempre configure DLQ ou Destinations em Lambdas assíncronas. Falhas silenciosas são o bug mais difícil de detectar em produção.',
  },
  {
    level: 'Senior',
    q: 'Como Lambda escala e quais são os limites?',
    a: 'Lambda escala automaticamente: uma instância por requisição simultânea. Não há limite de instâncias por conta por padrão — mas há limites de concorrência.<br><br><strong>Burst limit:</strong> 3.000 instâncias simultâneas instantâneas por região (us-east-1, eu-west-1, ap-northeast-1 têm 3.000; outras têm 500-1.000). Depois do burst, +500 instâncias/minuto.<br><br><strong>Account limit:</strong> 1.000 instâncias simultâneas por padrão (aumentável via suporte). Compartilhado entre todas as funções da conta/região.<br><br>Implicação: uma função sem Reserved Concurrency pode consumir toda a capacidade da conta e causar throttling nas outras.',
    tip: 'Em entrevista, mencione que Reserved Concurrency em funções não-críticas protege funções críticas — é o argumento de produção sênior.',
  },
  {
    level: 'Senior',
    q: 'O que é Lambda SnapStart e para qual cenário foi criado?',
    a: 'SnapStart é uma feature para funções Java (Corretto 11+). O problema: Java tem cold start lento (JVM startup + inicialização de frameworks como Spring Boot pode levar 5-10 s).<br><br>Como funciona: na publicação de uma nova versão, Lambda executa a função até o fim do init, tira um snapshot do estado da memória e do disco usando CRIU (Checkpoint/Restore In Userspace). Em cada cold start, restaura esse snapshot em vez de reinicializar do zero. Cold start cai de segundos para ~150 ms.<br><br>Restrições: a função deve ser determinística na inicialização (sem random seeds, timestamps ou I/O não-reproduzíveis no init). Disponível apenas para Java no momento.',
    tip: 'Mencione CRIU pelo nome — demonstra leitura técnica da documentação. Saber as restrições de determinismo é o que diferencia quem aplicou de quem só ouviu falar.',
  },
  {
    level: 'Senior',
    q: 'Como processar mensagens SQS com Lambda de forma confiável?',
    a: 'Lambda faz polling automático do SQS quando configurado como event source. A cada poll, Lambda recebe um batch de mensagens (batch size configurável: 1-10.000 para Standard, 1-10 para FIFO).<br><br><strong>Visibility Timeout:</strong> deve ser maior que o timeout da Lambda (pelo menos 6×). Se a Lambda demorar mais que o visibility timeout, a mensagem fica visível novamente e é processada duas vezes — duplicação.<br><br><strong>Batch failure:</strong> se a Lambda retornar erro, todas as mensagens do batch voltam para a fila. Configure ReportBatchItemFailures — a Lambda retorna quais messageIds falharam, e só esses voltam para a fila.<br><br><strong>DLQ:</strong> configure na fila SQS (não na Lambda em modo polling). Mensagens que falharem N vezes (maxReceiveCount) vão para a DLQ para análise.',
    tip: 'A regra Visibility Timeout >= 6 × Lambda Timeout é o bug de produção mais comum com Lambda + SQS. Mencionar isso primeiro demonstra experiência real.',
  },
  {
    level: 'Senior',
    q: 'Quando usar Lambda@Edge vs CloudFront Functions?',
    a: 'Ambos executam código na edge integrado ao CloudFront. As diferenças são de latência, capacidade e preço:<br><br><strong>CloudFront Functions:</strong> JavaScript puro, executa em menos de 1 ms (sub-milissegundo), custo 1/6 do Lambda@Edge. Suporta apenas Viewer Request e Viewer Response. Sem acesso à rede ou sistema de arquivos. Limite de 10 KB de código. Use para: rewrites de URL, manipulação de headers, redirect de país, normalização de query strings.<br><br><strong>Lambda@Edge:</strong> Node.js ou Python, até 30 s (origin) ou 5 s (viewer), acesso à rede e ao filesystem. Suporta 4 eventos (Viewer Request/Response + Origin Request/Response). Use para: autenticação JWT antes de chegar à origem, A/B testing baseado em cookies, personalização com chamada a API externa.<br><br>Regra: tente CloudFront Functions primeiro — é mais rápido e mais barato.',
    tip: 'Em entrevista, mencione que CloudFront Functions é "viewer-only" e Lambda@Edge é "viewer + origin" — é a distinção chave que muitos esquecem.',
  },
  {
    level: 'Senior',
    q: 'Como otimizaria o custo de uma Lambda com alto volume de invocações?',
    a: '<strong>Lambda Power Tuning:</strong> ferramenta open source que testa sua função com diferentes configurações de memória (128 MB → 10 GB) e mede custo × performance. Em Lambda, memória = CPU proporcional — mais memória pode ser mais barato se a função terminar muito mais rápido.<br><br><strong>Ajuste de memória:</strong> a maioria das funções performa melhor entre 512 MB e 2 GB. Funções CPU-bound precisam de mais memória para mais vCPU. Funções I/O-bound não se beneficiam de muita memória.<br><br><strong>Redução de duração:</strong> inicializar SDKs e conexões fora do handler. Usar cliente HTTP persistente (keep-alive). Paralelizar I/O independente (Promise.all). Otimizar tamanho do bundle.<br><br><strong>Arquitetura:</strong> batching para SQS (batch size maior = menos invocações). Filtros em EventBridge. Considerar ECS Fargate para cargas muito altas e contínuas.',
    tip: 'Mencionar Lambda Power Tuning com um exemplo de custo real (GB-s antes e depois) é o que diferencia quem aplicou otimização de quem só leu sobre o assunto.',
  },
  {
    level: 'Pleno',
    q: 'O que são Lambda Destinations e como diferem de DLQ?',
    a: 'Lambda Destinations configuram onde enviar o resultado de uma invocação assíncrona — tanto em caso de sucesso quanto de falha.<br><br><strong>On Success:</strong> SQS, SNS, Lambda ou EventBridge recebe o resultado da invocação bem-sucedida. Permite encadear funções sem polling.<br><br><strong>On Failure:</strong> SQS, SNS, Lambda ou EventBridge recebe o contexto da falha após todos os retries esgotados.<br><br><strong>Destinations vs DLQ:</strong><br>- DLQ: SQS ou SNS, só para falha, contém apenas o payload original.<br>- Destinations: suporta EventBridge e Lambda (além de SQS/SNS), tanto sucesso quanto falha, payload inclui evento original + resposta + contexto. Muito mais rico.',
    tip: 'Use Destinations para novas implementações — DLQ é legado para casos simples onde só SQS basta.',
  },
  {
    level: 'Senior',
    q: 'Como Lambda funciona com DynamoDB Streams?',
    a: 'DynamoDB Streams captura toda mudança nos itens da tabela (INSERT, MODIFY, REMOVE) em ordem, particionada por shard. Lambda faz polling automático do stream quando configurado como event source.<br><br><strong>Tipos de view:</strong> KEYS_ONLY, NEW_IMAGE, OLD_IMAGE, NEW_AND_OLD_IMAGES (mais completo, mais custo).<br><br><strong>Processamento em ordem:</strong> Lambda processa registros de cada shard em ordem. Se uma invocação falhar e não tratar o erro, Lambda fica tentando o mesmo batch indefinidamente (bloqueia o shard). Configure bisectBatchOnFunctionError para dividir o batch e isolar o registro problemático, e destinationConfig.onFailure para enviar falhas para SQS/SNS.<br><br><strong>Casos de uso:</strong> invalidação de cache (ElastiCache) quando dado muda, replicação para ElasticSearch, fan-out de eventos de negócio.',
    tip: 'O bisectBatchOnFunctionError é o detalhe que diferencia. Sem isso, um único registro problemático bloqueia o shard inteiro indefinidamente.',
  },
  {
    level: 'Pleno',
    q: 'O que são Lambda Layers e quando usar?',
    a: 'Lambda Layers são pacotes ZIP que podem ser compartilhados entre múltiplas funções. O layer é montado em /opt no filesystem da Lambda em tempo de execução.<br><br><strong>Casos de uso ideais:</strong><br>- Dependências pesadas compartilhadas (sharp, pandas, numpy) — uma atualização do layer beneficia todas as funções.<br>- Runtime customizado (qualquer linguagem com Runtime Interface Client).<br>- Extensões Lambda (agentes de observabilidade, segredos injetados, proxies).<br><br><strong>Limites:</strong> máximo 5 layers por função. Tamanho total descomprimido (código + layers) menor ou igual a 250 MB. Container image não usa layers.<br><br><strong>Quando não usar:</strong> dependências pequenas que não são compartilhadas. Bundler (esbuild) que inclui só o necessário pode ser mais simples.',
    tip: 'A pegadinha: layers somam ao limite de 250 MB descomprimido junto com o código. Não é separado.',
  },
  {
    level: 'Senior',
    q: 'Como monitorar e debugar Lambda em produção?',
    a: '<strong>CloudWatch Logs:</strong> todo console.log/print vai para o Log Group /aws/lambda/{function-name}. Estruture logs em JSON. Inclua requestId, userId, e contexto de negócio.<br><br><strong>CloudWatch Metrics:</strong> monitorar Invocations, Errors, Duration p99, Throttles, ConcurrentExecutions. Crie alarmes em Errors maior que 0 e Throttles maior que 0.<br><br><strong>X-Ray:</strong> tracing distribuído — trace completo de API Gateway → Lambda → DynamoDB → S3. Identifica onde está o gargalo de latência.<br><br><strong>AWS Lambda Powertools:</strong> biblioteca open source com Logger estruturado (JSON), Tracer (X-Ray automático), Metrics (EMF — Embedded Metrics Format sem custo de PutMetricData), Idempotency (com DynamoDB), e Batch Processing (ReportBatchItemFailures automático).<br><br>Use Powertools desde o início — economiza horas de implementação de observabilidade.',
    tip: 'Em entrevista, mencionar Lambda Powertools demonstra familiaridade com as melhores práticas da comunidade AWS.',
  },
  {
    level: 'Senior',
    q: 'Como Lambda em VPC afeta cold start e acesso à internet?',
    a: 'Lambda em VPC precisa provisionar uma ENI (Elastic Network Interface). Antes de 2019, isso adicionava 8-15 s de cold start. A partir de 2019 a AWS resolveu com ENIs compartilhadas (Hyperplane) — cold start adicional caiu para menos de 100 ms.<br><br>Porém, Lambda em VPC ainda tem uma restrição: <strong>sem acesso à internet por padrão</strong>. Lambda é colocado numa subnet privada — sem rota para internet. Para acesso a APIs externas:<br><br>- <strong>NAT Gateway</strong>: na subnet pública, rota da subnet privada → NAT → internet. Funciona, mas tem custo (~$32/mês + $0.045/GB).<br>- <strong>VPC Endpoints</strong>: acesso a serviços AWS (S3, DynamoDB, SQS, SSM, Secrets Manager) dentro da VPC sem passar pela internet — mais rápido, mais barato.<br><br>Boa prática: coloque Lambda em VPC apenas quando precisar acessar RDS, ElastiCache. Para Lambda que só acessa APIs públicas, não use VPC.',
    tip: 'A combinação Lambda em VPC + sem NAT + chamada a API externa = timeout silencioso é um dos erros mais comuns. Mencionar VPC Endpoints como alternativa mais barata ao NAT demonstra profundidade.',
  },
  {
    level: 'Senior',
    q: 'Como funciona o tuning de memória Lambda para otimizar custo?',
    a: 'Em Lambda, memória determina CPU proporcional — você não configura CPU diretamente. Dobrar a memória dobra a CPU disponível.<br><br>Lambda cobra por GB-second: memória_GB × duração_s × preço_por_GBs. Se aumentar memória de 512 MB para 1 GB reduz a duração de 2 s para 0,8 s:<br>- 512 MB × 2 s = 1 GB-s<br>- 1024 MB × 0,8 s = 0,82 GB-s — mais rápido E mais barato<br><br><strong>Lambda Power Tuning</strong>: ferramenta open source da AWS (Step Functions) que executa sua função com múltiplas configurações de memória e mede custo × velocidade. Gera gráfico com o ponto ótimo.<br><br><strong>Sweet spots típicos:</strong><br>- Funções CPU-bound: 1 GB-3 GB<br>- Funções I/O-bound: aumentar memória não ajuda muito<br>- Funções de imagem/vídeo: 3 GB-10 GB',
    tip: 'O numero magico 1769 MB e onde voce ganha 1 vCPU completo. Abaixo disso, vCPU e fracionado.',
  },
  {
    level: 'Senior',
    q: 'Como fazer zero-downtime deploy de Lambda com alias e weighted routing?',
    a: 'Lambda Aliases apontam para versões específicas. Uma versão é imutável — código e configuração congelados. O alias produção (prod) pode ser redirecionado sem afetar a URL do caller.<br><br><strong>Fluxo de deploy seguro:</strong><br>1. Publicar nova versão: aws lambda publish-version → retorna version 5<br>2. Configurar weighted routing no alias: alias prod com 10% para versão 5 e 90% para versão 4<br>3. Monitorar métricas de erro nas próximas horas<br>4. Aumentar gradualmente: 10% → 50% → 100%<br>5. Se erro: reverter alias para 100% na versão anterior — sem downtime, sem redeploy<br><br>Use com CodeDeploy para automatizar: LinearXPercentEveryNMinutes ou CanaryXPercentAfterNMinutes — com rollback automático em alarme de CloudWatch.',
    tip: 'Aliases + weighted routing + CodeDeploy canary é o padrão de produção profissional para Lambda.',
  },
  {
    level: 'Pleno',
    q: 'Qual a diferença entre Provisioned Concurrency e Reserved Concurrency?',
    a: 'São conceitos opostos frequentemente confundidos:<br><br><strong>Reserved Concurrency</strong>: define o teto máximo de instâncias simultâneas de uma função. Reserva capacidade do pool da conta — as N instâncias reservadas ficam disponíveis exclusivamente para essa função e não são consumíveis por outras. Se a função atingir o limite: invocações síncronas recebem 429, assíncronas entram em retry. Custo: zero extra. Uso: proteger banco de dados de sobrecarga.<br><br><strong>Provisioned Concurrency</strong>: mantém N instâncias sempre inicializadas e prontas — sem cold start. Essas instâncias passaram pela Init Phase. Custo: você paga por cada instância provisionada por hora. Uso: APIs de baixa latência onde cold start é inaceitável.<br><br><strong>Combinação possível:</strong> Reserved=100 (máximo) + Provisioned=20 (sempre quentes). As primeiras 20 invocações têm zero cold start; da 21ª à 100ª podem ter cold start; acima de 100 são throttled.',
    tip: 'Reserved = teto (gratuito), Provisioned = instâncias quentes (pago). Em uma frase resolvido.',
  },
  {
    level: 'Senior',
    q: 'Como Lambda SnapStart funciona e por que ajuda Java especificamente?',
    a: 'SnapStart foi lançado em 2022 para resolver o cold start do Java em Lambda. JVM startup + carregamento de classes + Spring Boot pode levar 5-15 s.<br><br><strong>Como funciona:</strong><br>1. Você publica uma nova versão Java<br>2. Lambda executa a Init Phase completamente (JVM inicia, Spring Boot sobe, beans inicializados)<br>3. Lambda tira um snapshot da memória e estado do processo (CRIU)<br>4. O snapshot é armazenado em cache criptografado<br>5. No cold start: Lambda restaura o snapshot em vez de reinicializar — leva ~150-200 ms<br><br><strong>Restrições:</strong><br>- Função deve ser determinística no init: sem random seeds, sem timestamps capturados, sem conexões de rede estabelecidas no init<br>- Disponível para Java 11 (Corretto) e 17<br>- Requer publicar uma versão (não funciona com $LATEST)',
    tip: 'Mencionar CRIU (a tecnologia por baixo) demonstra leitura técnica. Saber as restrições de determinismo é o que diferencia.',
  },
  {
    level: 'Senior',
    q: 'Como escalar Lambda com SQS de forma confiável?',
    a: 'A integração Lambda + SQS tem três parâmetros críticos:<br><br><strong>1. Visibility Timeout</strong>: quando Lambda recebe mensagem, fica invisível pelo tempo configurado. Regra: Visibility Timeout >= 6 × Lambda Timeout. Senão: processamento duplicado.<br><br><strong>2. Batch Size</strong>: quantas mensagens por invocação (1-10.000 Standard, 1-10 FIFO). Batch maior = menos invocações = menor custo.<br><br><strong>3. ReportBatchItemFailures</strong>: configure a Lambda como functionResponseType: ReportBatchItemFailures. Função retorna messageIds que falharam — só esses voltam para a fila. Sem isso: erro em 1 mensagem reprocessa o batch inteiro.<br><br><strong>4. DLQ na fila SQS</strong>: mensagens que atingem maxReceiveCount vão para DLQ. Configure maxReceiveCount = 3-5.<br><br><strong>Escala automática</strong>: Lambda cria instâncias conforme mensagens chegam (até 60 instâncias por minuto, depois +60/min).',
    tip: 'O erro de Visibility Timeout muito curto é o bug de produção mais comum. Sempre verifique a regra dos 6× em entrevista.',
  },
  {
    level: 'Senior',
    q: 'Como implementar idempotência em Lambda?',
    a: 'Lambda pode ser invocada mais de uma vez com o mesmo evento em dois cenários: (1) retry automático em invocação assíncrona — 2 retries; (2) SQS at-least-once delivery.<br><br><strong>Padrão com DynamoDB:</strong><br>1. Gravar idempotency key (requestId, MessageId) antes de processar<br>2. Checar se já processou (status=completed) — se sim, retornar resultado cached<br>3. Marcar como em processamento (ConditionExpression: attribute_not_exists)<br>4. Processar e marcar como concluído<br><br><strong>AWS Lambda Powertools Idempotency</strong>: implementa esse padrão automaticamente com decorator @idempotent. Suporta DynamoDB como persistence layer e configura TTL automaticamente.',
    tip: 'Idempotência é crítica em qualquer Lambda que processa payments, envios ou operações com efeitos colaterais. Mencionar Powertools Idempotency demonstra conhecimento do ecossistema.',
  },
]

// ── Quick Reference — comandos AWS CLI Lambda ───────────────────────────────

const QR_COLUMNS: QuickRefColumn[] = [
  {
    sections: [
      {
        title: 'Função — operações básicas',
        entries: [
          { key: 'Listar funções', value: 'aws lambda list-functions --query "Functions[*].[FunctionName,Runtime,MemorySize]" --output table' },
          { key: 'Invocar (síncrono)', value: 'aws lambda invoke --function-name minha-fn --payload \'{"key":"value"}\' output.json' },
          { key: 'Invocar (assíncrono)', value: 'aws lambda invoke --function-name minha-fn --invocation-type Event --payload \'{"k":"v"}\' /dev/null' },
          { key: 'Ver config', value: 'aws lambda get-function-configuration --function-name minha-fn' },
          { key: 'Deploy código', value: 'aws lambda update-function-code --function-name minha-fn --zip-file fileb://function.zip' },
          { key: 'Deploy via S3', value: 'aws lambda update-function-code --function-name minha-fn --s3-bucket deploys --s3-key fn.zip' },
          { key: 'Deletar', value: 'aws lambda delete-function --function-name minha-fn', badge: '!destrutivo', badgeColor: '#ef4444' },
        ],
      },
      {
        title: 'Logs e debug',
        entries: [
          { key: 'Stream em tempo real', value: 'aws logs tail /aws/lambda/minha-fn --follow', badge: 'preferido', badgeColor: '#4ade80' },
          { key: 'Filtrar erros', value: 'aws logs filter-log-events --log-group-name /aws/lambda/minha-fn --filter-pattern ERROR' },
          { key: 'Logs de invocação específica', value: 'aws logs filter-log-events --log-group-name /aws/lambda/minha-fn --filter-pattern "request-id-xxx"' },
          { key: 'Definir retention', value: 'aws logs put-retention-policy --log-group-name /aws/lambda/minha-fn --retention-in-days 30', badge: 'sempre', badgeColor: '#FF9900' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Versions e Aliases',
        entries: [
          { key: 'Publicar versão', value: 'aws lambda publish-version --function-name minha-fn' },
          { key: 'Listar versões', value: 'aws lambda list-versions-by-function --function-name minha-fn' },
          { key: 'Criar alias', value: 'aws lambda create-alias --function-name minha-fn --name prod --function-version 3' },
          { key: 'Atualizar alias', value: 'aws lambda update-alias --function-name minha-fn --name prod --function-version 4' },
          { key: 'Weighted routing 10/90', value: 'aws lambda update-alias --function-name minha-fn --name prod --function-version 4 --routing-config AdditionalVersionWeights={"3"=0.9}', badge: 'canary', badgeColor: '#a78bfa' },
          { key: 'Listar aliases', value: 'aws lambda list-aliases --function-name minha-fn' },
        ],
      },
      {
        title: 'Concorrência',
        entries: [
          { key: 'Reserved Concurrency', value: 'aws lambda put-function-concurrency --function-name minha-fn --reserved-concurrent-executions 50' },
          { key: 'Remover Reserved', value: 'aws lambda delete-function-concurrency --function-name minha-fn' },
          { key: 'Provisioned Concurrency', value: 'aws lambda put-provisioned-concurrency-config --function-name minha-fn --qualifier prod --provisioned-concurrent-executions 10', badge: 'pago', badgeColor: '#f59e0b' },
          { key: 'Ver Provisioned', value: 'aws lambda get-provisioned-concurrency-config --function-name minha-fn --qualifier prod' },
        ],
      },
    ],
  },
  {
    sections: [
      {
        title: 'Event Source Mappings',
        entries: [
          { key: 'Listar mappings', value: 'aws lambda list-event-source-mappings --function-name minha-fn' },
          { key: 'Criar SQS trigger', value: 'aws lambda create-event-source-mapping --function-name minha-fn --event-source-arn arn:aws:sqs:us-east-1:123:my-queue --batch-size 10' },
          { key: 'Criar Kinesis trigger', value: 'aws lambda create-event-source-mapping --function-name minha-fn --event-source-arn arn:aws:kinesis:... --starting-position LATEST --batch-size 100' },
          { key: 'Atualizar batch size', value: 'aws lambda update-event-source-mapping --uuid xxx --batch-size 50' },
          { key: 'Pausar mapping', value: 'aws lambda update-event-source-mapping --uuid xxx --enabled false' },
          { key: 'ReportBatchItemFailures', value: 'aws lambda update-event-source-mapping --uuid xxx --function-response-types ReportBatchItemFailures', badge: 'producao', badgeColor: '#FF9900' },
        ],
      },
      {
        title: 'Layers e configuração',
        entries: [
          { key: 'Publicar layer', value: 'aws lambda publish-layer-version --layer-name shared-libs --zip-file fileb://layer.zip --compatible-runtimes nodejs20.x' },
          { key: 'Anexar layer', value: 'aws lambda update-function-configuration --function-name minha-fn --layers arn:aws:lambda:...:layer:shared:1' },
          { key: 'Atualizar memory', value: 'aws lambda update-function-configuration --function-name minha-fn --memory-size 1024' },
          { key: 'Atualizar timeout', value: 'aws lambda update-function-configuration --function-name minha-fn --timeout 60' },
          { key: 'Definir DLQ', value: 'aws lambda update-function-configuration --function-name minha-fn --dead-letter-config TargetArn=arn:aws:sqs:...:dlq' },
          { key: 'Ver concurrent executions', value: 'aws cloudwatch get-metric-statistics --namespace AWS/Lambda --metric-name ConcurrentExecutions --dimensions Name=FunctionName,Value=minha-fn --statistics Maximum --period 60 --start-time ... --end-time ...' },
        ],
      },
    ],
  },
]

// ── Cheatsheet — limites e regras ─────────────────────────────────────────────

const CHEATSHEET_HOOKS: HookItem[] = [
  { name: 'Timeout máximo', sig: '15 minutos (900 s)', desc: 'Para jobs mais longos: ECS Fargate, AWS Batch ou Step Functions decompondo em sub-Lambdas.' },
  { name: 'Memória', sig: '128 MB – 10.240 MB', desc: 'CPU é proporcional. 1 vCPU completo aos 1.769 MB. Acima disso, CPU adicional.' },
  { name: 'Pacote ZIP', sig: '50 MB upload, 250 MB descompactado', desc: 'Inclui código + layers. Use S3 para deploy de pacotes maiores que 50 MB.' },
  { name: 'Container image', sig: 'até 10 GB', desc: 'Para libs nativas pesadas (sharp, ffmpeg) ou runtimes customizados. Cold start ligeiramente maior que ZIP.' },
  { name: '/tmp storage', sig: '512 MB padrão, até 10.240 MB', desc: 'Configurável via ephemeral_storage. Use para download temporário, processamento de arquivo grande.' },
  { name: 'Burst concurrency', sig: '3.000 (us-east-1, eu-west-1)', desc: '500-1.000 em outras regiões. Depois +500/min até atingir Account Limit.' },
  { name: 'Account concurrency', sig: '1.000 (default, aumentável)', desc: 'Compartilhado entre todas as funções da conta/região. Use Reserved para reservar.' },
  { name: 'Layers', sig: '5 por função, 250 MB total', desc: 'Layers somam ao limite de 250 MB descompactado. Layers compartilhados entre funções.' },
]

const CHEATSHEET_RULES: RuleItem[] = [
  { ok: true,  t: 'Inicializar SDKs e conexões FORA do handler — reutiliza em warm' },
  { ok: true,  t: 'AWS Lambda Powertools desde dia um (Logger, Tracer, Metrics, Idempotency)' },
  { ok: true,  t: 'esbuild com tree shaking — pacote menor que 5 MB para Node.js' },
  { ok: true,  t: 'DLQ ou Destinations on_failure em toda Lambda assíncrona' },
  { ok: true,  t: 'ReportBatchItemFailures em Lambda + SQS — falha granular por mensagem' },
  { ok: true,  t: 'Visibility Timeout SQS >= 6 × Lambda Timeout (evita duplicação)' },
  { ok: true,  t: 'Idempotência via DynamoDB para Lambdas com side-effects' },
  { ok: true,  t: 'Secrets em Secrets Manager / Parameter Store, nunca env vars plaintext' },
  { ok: true,  t: 'Logs estruturados em JSON com requestId e contexto de negócio' },
  { ok: true,  t: 'Lambda Power Tuning para encontrar memória ótima (custo × velocidade)' },
  { ok: false, t: 'Conexão de DB inicializada DENTRO do handler' },
  { ok: false, t: 'Lambda assíncrona sem DLQ — falhas perdidas silenciosamente' },
  { ok: false, t: 'Pacote com devDependencies, source maps e testes' },
  { ok: false, t: 'Senhas em variáveis de ambiente plaintext' },
  { ok: false, t: 'Lambda em VPC sem necessidade — adiciona latência sem benefício' },
  { ok: false, t: 'Reserved Concurrency = 0 (efetivamente desabilita a função!)' },
  { ok: false, t: 'Lambda para workload contínuo de mais de 1M req/dia (use ECS Fargate)' },
]

// ── Mnemônicos ────────────────────────────────────────────────────────────────

const MNEMONICS: MnemonicItem[] = [
  {
    label: 'SAP — Tipos de Invocação Lambda',
    trick: 'SAP',
    expansion: [
      ['S', 'Sync — API Gateway, ALB, SDK direto. Cliente espera resposta. Sem retry Lambda.'],
      ['A', 'Async — S3 Events, SNS, EventBridge. Lambda processa, cliente não espera. Retry 2× automático + DLQ/Destinations.'],
      ['P', 'Poll — SQS, Kinesis, DynamoDB Streams. Lambda faz polling, processa em batch. Retry até maxReceiveCount ou expirar.'],
    ],
    explanation: 'Os três modelos de invocação Lambda têm comportamentos de retry e DLQ completamente diferentes. Confundi-los leva a bugs sutis em produção: API Gateway sem retry vs S3 com 2× retry vs SQS com maxReceiveCount.',
    example: '// Lambda + S3 Event = Async\n// AWS faz retry 2× automaticamente em erro\n// Configure DLQ ou Destinations on_failure',
    why: 'A pergunta "como Lambda lida com erros?" tem 3 respostas dependendo da fonte. Saber qual modelo é qual evita arquiteturas frágeis.',
  },
  {
    label: 'FRIO — Fatores que pioram cold start',
    trick: 'FRIO',
    expansion: [
      ['F', 'Framework pesado — Spring Boot, NestJS com tudo carregado. Bundler para reduzir.'],
      ['R', 'Runtime lento — Java e .NET têm JVM/CLR startup. Node.js e Python são mais rápidos. SnapStart resolve para Java.'],
      ['I', 'Imagem grande — container image de 1 GB vs ZIP de 5 MB. Tree shake e remova devDeps.'],
      ['O', 'O-VPC — Lambda em VPC adiciona ENI overhead (~100 ms hoje, era 10s antes de 2019).'],
    ],
    explanation: 'Cold start é a soma dessas 4 dimensões. Lambda Java em VPC com Spring Boot pode ter cold start de 10+ segundos. Lambda Node.js sem VPC com bundle pequeno tem ~200 ms.',
    example: '// Sem VPC + Node.js + esbuild bundle 2 MB = ~200 ms cold start\n// Com VPC + Java + Spring Boot 50 MB = ~8 s cold start',
    why: 'Em entrevista, "como reduzir cold start?" tem 4 respostas distintas — uma para cada letra de FRIO. Demonstra cobertura completa.',
  },
  {
    label: 'RPDT — Concorrência Lambda',
    trick: 'RPDT',
    expansion: [
      ['R', 'Reserved — teto máximo da função. Reserva capacidade exclusiva. CUSTO ZERO. Protege DB.'],
      ['P', 'Provisioned — instâncias quentes pré-inicializadas. Sem cold start. CUSTO POR HORA.'],
      ['D', 'Default — pool compartilhado da conta (1.000 default). Sem garantia. Cold start em novas.'],
      ['T', 'Throttle (429) — quando atinge limite. Síncrono retorna erro; assíncrono entra em retry.'],
    ],
    explanation: 'Reserved e Provisioned são opostos: Reserved é teto (gratuito), Provisioned é instância quente (pago). Combine: Reserved=100 + Provisioned=20 = primeiras 20 sem cold start, até 100 totais.',
    example: '// Reserved (proteger DB):\naws lambda put-function-concurrency --reserved-concurrent-executions 50\n\n// Provisioned (eliminar cold start):\naws lambda put-provisioned-concurrency-config --provisioned-concurrent-executions 10',
    why: 'Reserved=0 é a pegadinha clássica — desabilita a função em vez de "ilimitar". Saber a distinção R vs P em uma frase resolve a confusão em entrevista.',
  },
  {
    label: 'CKBI — SQS + Lambda confiável',
    trick: 'CKBI',
    expansion: [
      ['C', 'Concorrência reservada — limite Lambda para não estourar conexões DB.'],
      ['K', 'Keep visibility >= 6× Lambda timeout — evita reprocessamento por timeout.'],
      ['B', 'Batch + ReportBatchItemFailures — falha granular por mensagem, não pelo batch todo.'],
      ['I', 'IdEmpotência — DynamoDB com idempotency key. SQS é at-least-once.'],
    ],
    explanation: 'Os 4 parametros que precisam estar corretos juntos para SQS + Lambda funcionar em escala: sem isso, voce tem duplicacao, throttling no DB, ou perda de mensagens.',
    example: '// Visibility 360s + Lambda timeout 60s + ReportBatchItemFailures + Reserved 50',
    why: 'A combinacao certa desses 4 e a diferenca entre Lambda+SQS funcional e arquitetura quebrada em escala. Testar mentalmente os 4 antes de design system interview.',
  },
]

// ── Anti-patterns ─────────────────────────────────────────────────────────────

const ANTIPATTERNS: AntiPatternItem[] = [
  {
    title: 'Conexão DB dentro do handler',
    badDesc: 'Cada invocação abre nova conexão. Em escala (100+ instâncias simultâneas), esgota o connection limit do RDS — todas as escritas falham.',
    badCode: [
      { t: 'export async function handler(event) {\n' },
      { t: '  const pool = new Pool({\n' },
      { t: '    host: process.env.DB_HOST,\n' },
      { t: '  })   ', c: '#fca5a5' },
      { t: '// !!! nova conexao a cada invocacao\n', c: '#ef4444' },
      { t: '  const result = await pool.query("...")\n' },
      { t: '  return result\n}' },
    ],
    goodDesc: 'Pool inicializado fora do handler — executa apenas no Init Phase. Em invocações warm, o container reutiliza o pool sem reconnect.',
    goodCode: [
      { t: '// Top-level (Init Phase apenas)\n', c: '#86efac' },
      { t: 'const pool = new Pool({\n', c: '#86efac' },
      { t: '  host: process.env.DB_HOST,\n', c: '#86efac' },
      { t: '})\n', c: '#86efac' },
      { t: '\nexport async function handler(event) {\n' },
      { t: '  const result = await pool.query("...")\n' },
      { t: '  return result\n}' },
    ],
    why: 'Código fora do handler executa apenas no Init Phase (cold start). Em invocações warm, o container é reutilizado e a conexão já está aberta. Inicializar dentro do handler abre nova conexão a cada request, esgotando o RDS rapidamente. Para escalar acima de 50 instâncias, use RDS Proxy para multiplexar conexões.',
  },
  {
    title: 'Lambda assíncrona sem DLQ',
    badDesc: 'Sem dead-letter queue, falhas são descartadas silenciosamente após 2 retries. Você não sabe que algo deu errado.',
    badCode: [
      { t: 'resource "aws_lambda_function" "bad" {\n' },
      { t: '  function_name = "process-events"\n' },
      { t: '  ', c: '#fca5a5' },
      { t: '# sem dead_letter_config\n', c: '#ef4444' },
      { t: '  ', c: '#fca5a5' },
      { t: '# sem destinations on_failure\n', c: '#ef4444' },
      { t: '}' },
    ],
    goodDesc: 'Destinations on_failure capturam contexto completo (input + erro + metadata). EventBridge ou SQS recebem para investigação.',
    goodCode: [
      { t: 'resource "aws_lambda_function_event_invoke_config" "ok" {\n' },
      { t: '  function_name = aws_lambda_function.app.function_name\n' },
      { t: '  destination_config {\n', c: '#86efac' },
      { t: '    on_failure {\n', c: '#86efac' },
      { t: '      destination = aws_sqs_queue.dlq.arn\n', c: '#86efac' },
      { t: '    }\n', c: '#86efac' },
      { t: '  }\n', c: '#86efac' },
      { t: '  maximum_retry_attempts = 2\n' },
      { t: '}' },
    ],
    why: 'Em invocações assíncronas (S3, SNS, EventBridge), Lambda faz 2 retries com backoff. Após esgotar, a invocação é descartada silenciosamente. Sem DLQ ou Destinations, falhas viram bugs invisíveis em produção. Destinations é mais rico que DLQ legacy — entrega o evento original + resposta de erro + contexto.',
  },
  {
    title: 'Visibility Timeout menor que Lambda Timeout',
    badDesc: 'Lambda demora 60s, Visibility só 30s — a mensagem reaparece na fila e outra Lambda processa em paralelo. Resultado: processamento duplicado.',
    badCode: [
      { t: 'resource "aws_sqs_queue" "bad" {\n' },
      { t: '  visibility_timeout_seconds = ', c: '#fca5a5' },
      { t: '30\n', c: '#ef4444' },
      { t: '}\n\n' },
      { t: 'resource "aws_lambda_function" "bad" {\n' },
      { t: '  timeout = ', c: '#fca5a5' },
      { t: '60\n', c: '#ef4444' },
      { t: '  ', c: '#fca5a5' },
      { t: '# sem ReportBatchItemFailures\n', c: '#ef4444' },
      { t: '}' },
    ],
    goodDesc: 'Visibility >= 6× Lambda timeout dá margem para retries internos. ReportBatchItemFailures retorna apenas mensagens com erro — outras são deletadas.',
    goodCode: [
      { t: 'resource "aws_sqs_queue" "ok" {\n' },
      { t: '  visibility_timeout_seconds = ', c: '#86efac' },
      { t: '360', c: '#86efac' },
      { t: '   # 6× Lambda timeout\n' },
      { t: '}\n\n' },
      { t: 'resource "aws_lambda_event_source_mapping" "ok" {\n' },
      { t: '  function_response_types = [', c: '#86efac' },
      { t: '"ReportBatchItemFailures"', c: '#86efac' },
      { t: ']\n' },
      { t: '}' },
    ],
    why: 'SQS at-least-once delivery: se Lambda demorar mais que Visibility Timeout, a mensagem reaparece e outra Lambda pega — processamento duplicado. Regra: Visibility >= 6 × Lambda timeout. ReportBatchItemFailures evita reprocessar batch inteiro quando só 1 mensagem falhou.',
  },
  {
    title: 'Pacote Lambda gigante (cold start lento)',
    badDesc: 'devDependencies, source maps e testes incluídos — pacote de 80 MB. Cold start adicional de vários segundos só para descompactar.',
    badCode: [
      { t: '# package.json\n' },
      { t: '"dependencies": { ...prod }\n' },
      { t: '"devDependencies": { ', c: '#fca5a5' },
      { t: '...dev', c: '#ef4444' },
      { t: ' }   ', c: '#fca5a5' },
      { t: '// !!! incluido\n\n', c: '#ef4444' },
      { t: '# Deploy:\n' },
      { t: 'zip -r function.zip ', c: '#fca5a5' },
      { t: 'node_modules/ src/', c: '#ef4444' },
      { t: '   # tudo!' },
    ],
    goodDesc: 'esbuild com tree shaking inclui apenas o que é usado. AWS SDK v3 já vem no runtime — marque como external. Bundle de ~2 MB.',
    goodCode: [
      { t: '// scripts/build.js\n' },
      { t: 'await esbuild.build({\n' },
      { t: '  entryPoints: ["src/index.ts"],\n' },
      { t: '  bundle: ', c: '#86efac' },
      { t: 'true', c: '#86efac' },
      { t: ',\n' },
      { t: '  minify: ', c: '#86efac' },
      { t: 'true', c: '#86efac' },
      { t: ',\n' },
      { t: '  platform: "node",\n' },
      { t: '  external: ', c: '#86efac' },
      { t: '["@aws-sdk/*"]', c: '#86efac' },
      { t: ',\n' },
      { t: '  outfile: "dist/index.js",\n})' },
    ],
    why: 'Pacote grande aumenta o Init Phase: AWS demora mais para baixar e descompactar. esbuild com tree shaking reduz bundle de 80 MB para 2 MB. AWS SDK v3 já vem instalado no runtime — adicione "@aws-sdk/*" como external. Para Python, use Lambda Layers para libs pesadas (numpy, pandas).',
  },
  {
    title: 'Secrets em variáveis de ambiente',
    badDesc: 'Senhas hardcoded em env vars são visíveis em DescribeFunction — qualquer usuário com permissão de leitura vê. Também vazam em logs de IaC e backups.',
    badCode: [
      { t: 'resource "aws_lambda_function" "bad" {\n' },
      { t: '  environment {\n' },
      { t: '    variables = {\n' },
      { t: '      DB_PASSWORD = ', c: '#fca5a5' },
      { t: '"MinhaSenh@123!"', c: '#ef4444' },
      { t: '\n' },
      { t: '      JWT_SECRET  = ', c: '#fca5a5' },
      { t: '"secret-xyz"', c: '#ef4444' },
      { t: '\n' },
      { t: '    }\n  }\n}' },
    ],
    goodDesc: 'Apenas o ARN do secret em env var. Lambda lê o secret real do Secrets Manager via SDK. IAM permite só essa Lambda ler esse secret.',
    goodCode: [
      { t: 'resource "aws_lambda_function" "ok" {\n' },
      { t: '  environment {\n' },
      { t: '    variables = {\n' },
      { t: '      DB_SECRET_ARN = ', c: '#86efac' },
      { t: 'aws_secretsmanager_secret.db.arn', c: '#86efac' },
      { t: '\n' },
      { t: '    }\n  }\n}\n\n' },
      { t: '// No handler:\n', c: '#86efac' },
      { t: 'const secret = await sm.getSecretValue({\n' },
      { t: '  SecretId: process.env.DB_SECRET_ARN\n})' },
    ],
    why: 'Variáveis de ambiente Lambda são visíveis em DescribeFunction e em logs de CloudFormation/Terraform. Use Secrets Manager (com rotação automática) ou Parameter Store (gratis para SecureString básico). Cache o secret no init phase para não chamar a cada invocação.',
  },
  {
    title: 'Sem idempotência em Lambda assíncrona',
    badDesc: 'Lambda async faz retry automático em erro. SQS tem at-least-once delivery. Sem idempotência, side-effects (cobrança, email, escrita externa) duplicam.',
    badCode: [
      { t: 'export async function handler(event) {\n' },
      { t: '  const order = JSON.parse(event.body)\n' },
      { t: '  await chargeCustomer(order)   ', c: '#fca5a5' },
      { t: '// !!! cobra 2× em retry\n', c: '#ef4444' },
      { t: '  await sendEmail(order)         ', c: '#fca5a5' },
      { t: '// !!! envia 2 emails\n', c: '#ef4444' },
      { t: '}' },
    ],
    goodDesc: 'Lambda Powertools Idempotency armazena resultado em DynamoDB com idempotency key. Em retry, retorna resultado cached em vez de reexecutar.',
    goodCode: [
      { t: 'import { idempotent } from \n  "@aws-lambda-powertools/idempotency"\n\n' },
      { t: 'const store = new DynamoDBPersistenceLayer({\n', c: '#86efac' },
      { t: '  tableName: "idempotency"\n', c: '#86efac' },
      { t: '})\n\n', c: '#86efac' },
      { t: 'export const handler = ', c: '#86efac' },
      { t: 'idempotent', c: '#86efac' },
      { t: '({ store })(\n' },
      { t: '  async (event) => {\n' },
      { t: '    await chargeCustomer(...)\n' },
      { t: '  }\n)' },
    ],
    why: 'Lambda assíncrona faz 2 retries em erro. SQS faz at-least-once delivery. Sem idempotência, operações com side-effects (payments, emails, escrita em sistema externo) duplicam em retry. Powertools Idempotency: o decorator armazena resultado em DynamoDB indexado por idempotency key — execução repetida retorna o resultado cached.',
  },
]

// ── Troubleshooting / Error Reference ────────────────────────────────────────

const TROUBLESHOOTING_ERRORS: ErrorEntry[] = [
  {
    title: 'Task timed out after N seconds',
    errorMessage: 'Task timed out after 30.00 seconds',
    cause: 'Lambda atingiu o timeout configurado antes de retornar. Causas frequentes: chamadas de rede sem timeout próprio (ficam pendentes), DB query lenta sem index, processamento de payload grande, dependência externa lenta (Stripe, SendGrid) sem retry/circuit breaker.',
    solution: 'Aumente o timeout (até 900 s = 15 min). Ou: adicione AbortController em fetch/axios com timeout menor que o da Lambda. Para jobs longos, decomponha em sub-Lambdas via Step Functions, ou migre para ECS Fargate (sem limite de 15 min).',
    code: {
      broken: '// Sem timeout interno — espera infinitamente\nconst res = await fetch(externalApi)',
      fixed: '// Timeout interno menor que o da Lambda\nconst ctrl = new AbortController()\nsetTimeout(() => ctrl.abort(), 5000)\nconst res = await fetch(externalApi, { signal: ctrl.signal })',
    },
    severity: 'critical',
    category: 'Runtime',
    relatedErrors: ['OOM', 'Init duration'],
  },
  {
    title: 'Runtime exited with error: signal: killed (out of memory)',
    errorMessage: 'Runtime exited with error: signal: killed | Memory used: 1024 MB / Memory size: 1024 MB',
    cause: 'Lambda ultrapassou o limite de memória configurado. Causas: processamento de imagens/vídeos sem streaming, JSON.parse de payloads gigantes, vazamento de memória em variáveis globais que crescem entre invocações warm.',
    solution: 'Aumente memória (até 10240 MB) — em Lambda, mais memória = mais CPU proporcional. Use streaming para arquivos grandes (sharp.pipe, Readable streams). Limpe variáveis globais que crescem entre invocações. Use Lambda Power Tuning para encontrar memória ótima.',
    code: {
      broken: '// Lê tudo em memória\nconst img = await s3.getObject({Bucket, Key}).promise()\nconst buf = img.Body  // 500 MB!',
      fixed: '// Stream do S3 direto para sharp\nconst stream = s3.getObject({Bucket, Key}).createReadStream()\nstream.pipe(sharp().resize(800)).pipe(dest)',
    },
    severity: 'critical',
    category: 'Runtime',
    relatedErrors: ['Timeout'],
  },
  {
    title: 'Rate Exceeded — TooManyRequestsException',
    errorMessage: 'Rate Exceeded. (Service: AWSLambda; Status Code: 429; Error Code: TooManyRequestsException)',
    cause: 'Lambda atingiu limite de concorrência. Causas: pico de requisições além do account limit (1000 default), Reserved Concurrency esgotada, burst limit ultrapassado (3000 em us-east-1, depois +500/min).',
    solution: 'Solicite aumento do account limit via AWS Support. Configure Reserved Concurrency adequado. Para invocação assíncrona, AWS faz retry automático em throttle. Para síncrona, implemente retry com backoff exponencial no caller. Considere SQS como buffer entre o cliente e a Lambda.',
    code: {
      broken: '// Cliente sem retry — falha em throttle\nconst res = await lambda.invoke({FunctionName, Payload})',
      fixed: '// SDK v3 com retry automático\nconst client = new LambdaClient({\n  maxAttempts: 5,\n  retryMode: "adaptive"  // backoff exponencial\n})',
    },
    severity: 'warning',
    category: 'Concorrência',
  },
  {
    title: 'Init duration excessivo (cold start)',
    errorMessage: 'REPORT RequestId: ... Init Duration: 8523.45 ms | Duration: 120.20 ms',
    cause: 'Init Phase está lento — pacote grande, framework pesado (Spring Boot, NestJS carregando tudo), Lambda em VPC sem ENI compartilhada, runtime lento (Java, .NET sem SnapStart). Init Duration > 5 s prejudica latência percebida.',
    solution: 'Para Node/Python: bundler com tree shaking (esbuild) reduz pacote para <5 MB. Para Java: SnapStart (cold start cai de segundos para ~150 ms). Provisioned Concurrency mantém instâncias quentes (custo fixo). Marque @aws-sdk/* como external — já está no runtime.',
    code: {
      broken: '# Sem bundle — node_modules inteiro\nzip -r function.zip node_modules/ src/  # 80 MB',
      fixed: '# esbuild com tree shaking\nesbuild src/index.ts \\\n  --bundle --minify --platform=node \\\n  --external:@aws-sdk/* \\\n  --outfile=dist/index.js  # 2 MB',
    },
    severity: 'warning',
    category: 'Performance',
    relatedErrors: ['Timeout'],
  },
  {
    title: 'AccessDeniedException — IAM role missing permission',
    errorMessage: 'AccessDeniedException: User: arn:aws:sts::...:assumed-role/lambda-role/... is not authorized to perform: dynamodb:PutItem on resource: ...',
    cause: 'A IAM role da Lambda não tem permissão para o serviço/recurso acessado. Causa frequente: copiar Lambda de outra conta, esquecer de adicionar permissão nova ao adicionar feature, usar wildcard que não cobre o ARN específico.',
    solution: 'Inspecione o erro: ele diz exatamente qual ação faltou. Adicione policy à role com permissão mínima necessária. Use AWS IAM Policy Simulator para validar antes de deploy. Para troubleshooting rápido, anexe AWSLambdaBasicExecutionRole + policy específica.',
    code: {
      broken: '# Sem permissão para DynamoDB\nresource "aws_iam_role_policy" "lambda" {\n  policy = jsonencode({\n    Statement = [{ Effect = "Allow", Action = ["logs:*"] }]\n  })\n}',
      fixed: '# Permissão específica para a tabela\nStatement = [\n  { Effect = "Allow", Action = ["logs:*"], Resource = "*" },\n  {\n    Effect = "Allow",\n    Action = ["dynamodb:PutItem", "dynamodb:GetItem"],\n    Resource = aws_dynamodb_table.orders.arn\n  }\n]',
    },
    severity: 'critical',
    category: 'IAM',
  },
  {
    title: 'TooManyRequestsException em DynamoDB / RDS / API externa',
    errorMessage: 'ProvisionedThroughputExceededException: The level of configured provisioned throughput for the table was exceeded',
    cause: 'Lambda escalou e esgotou capacity de um recurso downstream — DynamoDB com capacity insuficiente, RDS com connection pool esgotado, API externa com rate limit. O problema NÃO é Lambda — é o downstream.',
    solution: 'Limite a Lambda com Reserved Concurrency proporcional à capacidade do downstream (ex: RDS com 100 conn → Reserved=80, deixando 20 para outras apps). Use RDS Proxy para multiplexar conexões. Para DynamoDB, use On-Demand mode ou aumente RCU/WCU. Implemente retry com backoff no SDK.',
    code: {
      broken: '// Lambda sem limite — sobrecarrega RDS\n// 1000 instâncias simultâneas = 1000 connections',
      fixed: '// Terraform: Reserved Concurrency limita\nresource "aws_lambda_function" "app" {\n  reserved_concurrent_executions = 80\n}\n\n// + RDS Proxy para connection pooling\nresource "aws_db_proxy" "main" { ... }',
    },
    severity: 'critical',
    category: 'Downstream',
  },
  {
    title: 'Lambda em VPC: timeout em chamadas a API externa',
    errorMessage: 'Connection timed out / ETIMEDOUT / ECONNREFUSED',
    cause: 'Lambda em subnet privada (VPC) sem rota para internet. NAT Gateway não configurado, ou Security Group bloqueando outbound, ou ACL da subnet bloqueando. Erro silencioso — Lambda apenas dá timeout depois de tentar conectar.',
    solution: 'Para acessar internet: adicione NAT Gateway na subnet pública e route table na privada apontando para ele. Para acessar serviços AWS: use VPC Endpoints (S3 e DynamoDB Gateway são gratuitos; outros são Interface Endpoints, $0.01/h). Verifique Security Group: outbound 0.0.0.0/0 na porta 443.',
    code: {
      broken: '# Lambda em VPC sem NAT — não acessa Stripe\nresource "aws_lambda_function" "app" {\n  vpc_config {\n    subnet_ids = [aws_subnet.private.id]\n    # Sem NAT, sem internet!\n  }\n}',
      fixed: '# Adicione NAT Gateway + route\nresource "aws_nat_gateway" "main" {\n  subnet_id = aws_subnet.public.id\n  allocation_id = aws_eip.nat.id\n}\n\nresource "aws_route" "private_to_nat" {\n  route_table_id = aws_route_table.private.id\n  destination_cidr_block = "0.0.0.0/0"\n  nat_gateway_id = aws_nat_gateway.main.id\n}',
    },
    severity: 'warning',
    category: 'Rede',
  },
  {
    title: 'SQS message reprocessada — visibility timeout esgotou',
    errorMessage: 'Mensagem aparece duas vezes em CloudWatch Logs com mesmo MessageId',
    cause: 'Lambda demorou mais que o Visibility Timeout da fila SQS. A mensagem voltou a ficar visível e outra invocação Lambda pegou a mesma mensagem em paralelo — processamento duplicado.',
    solution: 'Configure Visibility Timeout >= 6 × Lambda Timeout. Se Lambda timeout = 30 s, Visibility = 180 s. Configure ReportBatchItemFailures para granularidade por mensagem. Implemente idempotência via DynamoDB com idempotency key (MessageId).',
    code: {
      broken: '# Visibility 30s + Lambda 60s = duplicação\nresource "aws_sqs_queue" "main" {\n  visibility_timeout_seconds = 30\n}',
      fixed: '# Visibility 6× Lambda timeout\nresource "aws_sqs_queue" "main" {\n  visibility_timeout_seconds = 360  # 6× 60\n}\n\n// Idempotência via Powertools\nimport { idempotent } from "@aws-lambda-powertools/idempotency"\nexport const handler = idempotent({...})(async (e) => {...})',
    },
    severity: 'critical',
    category: 'SQS',
  },
  {
    title: 'Falha silenciosa em Lambda assíncrona — sem DLQ',
    errorMessage: '(sem erro visível — Lambda foi invocada, falhou 3 vezes, e ninguém soube)',
    cause: 'Em invocação assíncrona (S3, SNS, EventBridge), Lambda faz 2 retries com backoff e descarta silenciosamente após esgotar. Sem DLQ ou Destinations, a falha desaparece — você só descobre quando o usuário reclama dias depois.',
    solution: 'Configure Destinations on_failure (preferido) ou DLQ legacy em TODA Lambda assíncrona. Destinations envia evento original + erro + contexto para SQS/SNS/EventBridge/Lambda. Crie alarme CloudWatch em Errors > 0.',
    code: {
      broken: '# Lambda async sem DLQ nem Destinations\nresource "aws_lambda_function" "process_s3" {\n  function_name = "process-s3-events"\n  # falhas silenciosas!\n}',
      fixed: '# Destinations on_failure captura tudo\nresource "aws_lambda_function_event_invoke_config" "config" {\n  function_name = aws_lambda_function.process_s3.function_name\n  destination_config {\n    on_failure { destination = aws_sqs_queue.dlq.arn }\n  }\n  maximum_retry_attempts = 2\n}',
    },
    severity: 'critical',
    category: 'Confiabilidade',
    relatedErrors: ['SQS reprocessada'],
  },
  {
    title: 'Container image Lambda — image size limit exceeded',
    errorMessage: 'CodeStorageExceededException: Code storage limit exceeded for the AWS account',
    cause: 'Container image Lambda excede 10 GB descomprimido, ou imagem não é OCI-compatible, ou conta atingiu limite de armazenamento de funções (75 GB default).',
    solution: 'Reduza a imagem: multi-stage Dockerfile, COPY apenas o necessário, use base image AWS slim (public.ecr.aws/lambda/nodejs:20). Para 10 GB+: use ECS Fargate ou EKS. Para limite de conta: delete versões antigas com aws lambda delete-function-version.',
    code: {
      broken: '# Dockerfile sem multi-stage — imagem 8 GB\nFROM node:20\nCOPY . .\nRUN npm install\nCMD ["node", "index.js"]',
      fixed: '# Multi-stage com base AWS slim\nFROM node:20-alpine AS build\nCOPY package*.json ./\nRUN npm ci\nCOPY src ./src\nRUN npm run build\n\nFROM public.ecr.aws/lambda/nodejs:20\nCOPY --from=build /app/dist ./\nCMD ["index.handler"]',
    },
    severity: 'warning',
    category: 'Deploy',
  },
  {
    title: 'EFS file lock / EROFS — mount issue',
    errorMessage: 'EROFS: read-only file system / EACCES: permission denied',
    cause: 'Lambda com EFS mount tem restrições: filesystem readonly fora do mount path, permissões POSIX precisam ser configuradas no Access Point. Lambda também pode tentar gravar antes do EFS estar montado.',
    solution: 'Use Access Point com POSIX user/group corretos (uid:1000, gid:1000 padrão). Configure mount path corretamente em /mnt. Para escrita: garanta que o Access Point tem RootDirectory writable. Apenas /tmp e mount path são writable; resto do filesystem é readonly.',
    code: {
      broken: '// Tentando gravar fora do EFS mount\nfs.writeFileSync("/data/file.txt", data)  // EROFS!',
      fixed: '// Grave no path do EFS mount\nfs.writeFileSync("/mnt/efs/file.txt", data)\n// Ou em /tmp para arquivos efêmeros (até 10 GB)\nfs.writeFileSync("/tmp/temp.txt", data)',
    },
    severity: 'warning',
    category: 'Storage',
  },
  {
    title: 'Lambda Layer não encontrada / not compatible',
    errorMessage: 'Layer version arn:aws:lambda:...:layer:my-layer:1 is not compatible with the runtime nodejs20.x',
    cause: 'Layer foi publicada com runtime incompatível, ou Lambda excedeu o limite de 5 layers, ou layer + código ultrapassa 250 MB descomprimido.',
    solution: 'Publique layer com --compatible-runtimes correto. Se usar libs nativas (sharp, pg), compile na arquitetura correta (--platform=linux --arch=x64). Limite total: 5 layers + 250 MB descomprimido junto com o código. Para mais: use container image (até 10 GB).',
    code: {
      broken: '# Layer publicada sem runtime\naws lambda publish-layer-version \\\n  --layer-name shared \\\n  --zip-file fileb://layer.zip\n# Sem --compatible-runtimes!',
      fixed: '# Especifique runtime e arquitetura\naws lambda publish-layer-version \\\n  --layer-name shared \\\n  --zip-file fileb://layer.zip \\\n  --compatible-runtimes nodejs20.x \\\n  --compatible-architectures x86_64',
    },
    severity: 'info',
    category: 'Deploy',
  },
]

// ── Builders de PDF ───────────────────────────────────────────────────────────

const PDF_BUILDERS: Partial<Record<PdfType, PdfBuilderFn>> = {
  qa: () => buildQAReviewPdf({
    qa: QAS,
    accentColor: C,
    skillName: 'Lambda',
    stackLabel: 'AWS / Serverless',
  }),
  cheatsheet: () => buildCheatsheetPdf({
    skillName: 'Lambda',
    accentColor: C,
    stackLabel: 'AWS / Serverless',
    sections: {
      hooks: CHEATSHEET_HOOKS,
      depRows: [
        ['Free tier', '1M invocações + 400.000 GB-s grátis por mês'],
        ['Cold start típico', 'Node.js 100-300 ms · Python 150-400 ms · Java 1-5 s · .NET 1-3 s'],
        ['SQS batch size', 'Standard: 1-10.000 · FIFO: 1-10'],
        ['Async retry', '2× automático com backoff (~1 min, ~2 min)'],
        ['Variáveis env', '4 KB total (key=value)'],
        ['Logs Group', '/aws/lambda/{function-name}'],
        ['SnapStart', 'Apenas Java 11+ — cold start de segundos para ~150 ms'],
        ['Provisioned cost', '~$0.000004/GB-s adicional por instância quente'],
      ],
      rules: CHEATSHEET_RULES,
      performanceTips: [
        'Inicialize SDKs e conexões fora do handler — reutilizado em invocações warm',
        'esbuild bundle com tree shaking — pacote de 5 MB para Node.js, cold start 200 ms',
        'Mark @aws-sdk/* como external — já disponível no runtime, sem necessidade de bundlar',
        'Provisioned Concurrency apenas em APIs críticas onde cold start é inaceitável',
        'Lambda Power Tuning encontra sweet spot de memória — frequentemente 1.769 MB (1 vCPU completo)',
        'Para SQS: ReportBatchItemFailures + Visibility 6× Lambda timeout + maxReceiveCount 3-5',
        'Idempotência via Powertools — DynamoDB armazena resultado cached por idempotency key',
        'X-Ray + Powertools Tracer captura chamadas AWS SDK automaticamente',
      ],
      patterns: [
        { name: 'Connection Reuse', code: 'const pool = new Pool(...) // top-level\nexport handler = async (e) => pool.query(...)', desc: 'Inicializar conexões fora do handler. Container reutilizado em warm invocations evita reconnect.' },
        { name: 'Idempotency com Powertools', code: 'export handler = idempotent({store})(async (e) => {...})', desc: 'Padrão de produção para Lambdas com side-effects. DynamoDB persistence layer com TTL automático.' },
        { name: 'SQS Batch Failure', code: 'return { batchItemFailures: [{ itemIdentifier: msgId }] }', desc: 'Granularidade por mensagem. Apenas mensagens com erro voltam para a fila — outras são deletadas.' },
        { name: 'Lambda Destinations', code: 'EventInvokeConfig: { destinationConfig: { onFailure: { destination: SQS_DLQ } } }', desc: 'Substitui DLQ legacy. Captura input + output + contexto de erro para análise.' },
      ],
      mentalModels: [
        'Cold start é Init + Invoke; warm é só Invoke. Reutilização de container é graça gratuita.',
        'Memória = CPU proporcional. 1.769 MB = 1 vCPU. Mais memória pode ser mais barato se reduzir duração.',
        'Async = retry automático + DLQ; Sync = sem retry; Poll = retry até maxReceiveCount.',
        'Reserved (teto, gratis) e oposto de Provisioned (instancias quentes, pago).',
        'Lambda em VPC nao acessa internet por padrao. NAT Gateway custa; VPC Endpoints sao mais baratos.',
        'Lambda brilha em event-driven curto. Para 1M req/dia constante, ECS Fargate fica mais barato.',
      ],
    },
  }),
  'quick-ref': () => buildQuickRefPdf({
    columns: QR_COLUMNS,
    skillName: 'Lambda CLI',
    accentColor: C,
    stackLabel: 'AWS / Serverless',
    tagline: 'Comandos AWS CLI para Lambda — funções, versions, aliases, concorrência e logs',
  }),
  mnemonics: () => buildMnemonicsPdf({
    mnemonics: MNEMONICS,
    accentColor: C,
    skillName: 'Lambda',
    stackLabel: 'AWS / Serverless',
  }),
  antipatterns: () => buildAntipatternsPdf({
    antipatterns: ANTIPATTERNS,
    accentColor: C,
    skillName: 'Lambda',
    stackLabel: 'AWS / Serverless',
  }),
  errors: () => buildErrorRefPdf({
    errors: TROUBLESHOOTING_ERRORS,
    accentColor: C,
    skillName: 'Lambda',
    stackLabel: 'AWS / Serverless',
    coverTitle: 'Lambda — Guia de Troubleshooting',
  }),
}

// ── Componente principal ──────────────────────────────────────────────────────

export default function LambdaPdfs() {
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

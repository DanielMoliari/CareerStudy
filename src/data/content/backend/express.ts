import type { SkillContent } from '@/types'

const express: SkillContent = {
  tagline: "Framework Node.js minimalista: routing, middleware, sem opiniao sobre estrutura.",
  why: "Express e o framework Node.js mais usado no mundo. Entender como middleware chain funciona, error handling e como estruturar projetos grandes é base para qualquer backend Node senior.",
  summary: "Express e um framework minimalista para Node.js que adiciona routing e middleware sobre o http module nativo. Middleware functions recebem (req, res, next). Request passa em sequência pelos middlewares registrados até o handler ou error handler. Sem opiniao sobre estrutura de pastas, ORM, ou autenticação -- você escolhe tudo.",
  keypoints: [
    { title: "Middleware chain", body: "app.use((req, res, next) => {}). Cada middleware chama next() para passar pra próximo ou res.send() para encerrar. Ordem de registro importa." },
    { title: "Routing", body: "app.get('/users', handler). Express Router para modularizar. router.use() para sub-middleware. Params: req.params, req.query, req.body (com body-parser)." },
    { title: "Error handling", body: "Error middleware tem 4 parametros: (err, req, res, next). Registrado por último. next(err) propaga erro para error handler." },
    { title: "Middlewares úteis", body: "cors, helmet (segurança headers), morgan (logging), express-rate-limit, compression. body-parser incluido no Express 4.16+." },
    { title: "async/await", body: "Express não captura erros async por default. Wrapper necessário: asyncHandler(fn) = (req,res,next) => fn(req,res,next).catch(next). Express 5 captura nativamente." },
    { title: "Estrutura em escala", body: "Feature folders ao inves de layer folders. routes/ controllers/ services/ repositories/ por domínio. Evita controller gordo." },
  ],
  gotchas: [
    "async/await sem try/catch e sem asyncHandler -- erro não chega no error handler, request trava.",
    "res.send() chamado duas vezes -- Cannot set headers after they are sent.",
    "Middlewares de segurança esquecidos (helmet, rate-limit) em API pública.",
    "Body-parser limit muito pequeno -- payload grande retorna 413.",
    "next() chamado depois de res.send() -- executa próximo middleware desnecessariamente.",
  ],
  interview: [
    { q: "Como funciona o error handling no Express?", a: "<p>Error handler tem assinatura (err, req, res, next). Registrado por último com app.use(). Quando next(err) e chamado, Express pula middlewares normais e vai direto para o error handler.</p><p>Para async, precisa de wrapper ou Express 5: asyncHandler = fn => (req,res,next) => Promise.resolve(fn(req,res,next)).catch(next).</p>" },
    { q: "Como organizaria projeto Express grande?", a: "<p>Feature-based: cada domínio tem sua própria pasta com routes, controller, service, repository. Evita controller gordo e facilita encontrar código por feature, não por layer.</p><p>Centralize error handling, logging e autenticação em middlewares globais. Use dependency injection manual ou container leve.</p>" },
  ],
  resources: [
    { title: "Express docs", url: "https://expressjs.com/", kind: "docs" },
  ],
}

export default express

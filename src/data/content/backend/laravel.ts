import type { SkillContent } from '@/types'

const laravel: SkillContent = {
  tagline: "Framework PHP MVC com ORM Eloquent, Artisan CLI, filas e ecossistema maduro.",
  why: "Laravel domina o mercado PHP brasileiro. Saber Eloquent, service providers, filas e segurança básica e esperado em vagas que tem PHP no stack.",
  summary: "Laravel e um framework PHP MVC que prioriza developer experience. Eloquent ORM com ActiveRecord, Blade para templates, Artisan CLI para scaffolding e tasks, filas e jobs, eventos e listeners, broadcasting, Sanctum/Passport para auth. Ecossistema: Telescope (debug), Horizon (filas Redis), Forge (deploy), Vapor (serverless).",
  keypoints: [
    { title: "Eloquent ORM", body: "ActiveRecord. Model mapeia para tabela. Relacionamentos: hasOne, hasMany, belongsTo, belongsToMany. Eager loading: with(). Soft deletes com SoftDeletes trait." },
    { title: "Service Provider", body: "Bootstrap da aplicação. register() registra bindings no IoC container. boot() executa após todos providers registrados. Padrão para publicar config, migrations, routes." },
    { title: "Middleware", body: "Filtros HTTP: auth, rate limiting, CORS, logging. Aplica globalmente ou por route. Terminating middleware roda após response enviado." },
    { title: "Filas (Queue)", body: "Job classes para trabalho assíncrono. Drivers: sync, database, Redis (Horizon), SQS. Retry, delay, timeout, priority. Useful para email, processamento de imagem, integração." },
    { title: "Eloquent N+1", body: "Carregar relação em loop sem with() -> N queries. Detectar com Laravel Debugbar ou Telescope. Corrigir: Post::with('user')->get()." },
    { title: "Migrations", body: "php artisan make:migration. Schema::create, table, drop. Rollback com down(). Versionado em git junto com código." },
    { title: "Artisan Commands", body: "php artisan make:model, make:controller, make:migration, make:job, make:command. Criação de commands customizados para cronjobs e tasks." },
  ],
  gotchas: [
    "N+1 com Eloquent -- o clássico. Use with() ou load() para eager loading.",
    "Mass assignment sem $fillable ou $guarded -- SQL injection via create(request->all()).",
    "Debugbar em produção -- expoe queries, variáveis, session. Desabilite.",
    "Job sem handle exception -- fila trava em erro, job fica pendurado.",
    "Route caching com closure -- php artisan route:cache falha com closures em routes.",
  ],
  interview: [
    { q: "Como resolveria N+1 no Laravel?", a: "<p>Identificar: Laravel Debugbar mostra número de queries. Corrigir: eager loading com with(['relation', 'nested.relation']). Lazy eager: $model->load('relation') após carregar.</p><p>Para relações de contagem: withCount('comments') ao inves de $post->comments->count() em cada item.</p>" },
    { q: "Como funciona o IoC container do Laravel?", a: "<p>Service container resolve dependências automaticamente via reflection (type hints no construtor). Bindings registrados em service providers: $this->app->bind(Interface::class, Implementation::class).</p><p>Singleton: $this->app->singleton(). Instancia única por ciclo de vida da app.</p>" },
  ],
  resources: [
    { title: "Laravel docs", url: "https://laravel.com/docs/", kind: "docs" },
    { title: "Laracasts", url: "https://laracasts.com/", kind: "curso" },
  ],
}

export default laravel

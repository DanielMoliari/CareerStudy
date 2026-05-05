import type { SkillContent } from '@/types'

const python: SkillContent = {
  tagline: "Linguagem interpretada dinâmica, lider em AI/ML e scripting, crescendo em backend.",
  why: "Python e indispensavel para AI/ML em 2025. Senior backend que vai trabalhar com LLMs, data pipelines ou scripts precisa dominar Python alem de JS/TS.",
  summary: "Python e uma linguagem de alto nível, dinâmica, com enfase em legibilidade. Dominante em AI/ML (PyTorch, TensorFlow, HuggingFace), data science (pandas, numpy), scripting e automacao. Crescendo em backend (FastAPI, Django). GIL limita paralelismo CPU-bound em threads; use multiprocessing ou async (asyncio) para I/O concorrente.",
  keypoints: [
    { title: "GIL", body: "Global Interpreter Lock: só uma thread Python executa bytecode por vez. CPU-bound não beneficia de threads. Solução: multiprocessing, ou liberar GIL em C extension (numpy faz isso)." },
    { title: "asyncio", body: "I/O concorrente single-threaded via event loop. async def e await. aiohttp, httpx para HTTP async. asyncpg para Postgres. Base do FastAPI." },
    { title: "Tipagem", body: "Python 3.5+ tem type hints opcionais. mypy e pyright para checagem estatica. Pydantic usa tipos pra validação em runtime. FastAPI usa Pydantic automaticamente." },
    { title: "Virtual environments", body: "venv ou poetry para isolar dependências por projeto. requirements.txt ou pyproject.toml. Docker para isolar totalmente." },
    { title: "Generators e itertools", body: "yield cria generator (lazy, memória eficiente). Bom para streaming de dados grandes. itertools para combinatorics eficiente." },
    { title: "Context managers", body: "with statement. __enter__ e __exit__ garantem cleanup (arquivo fechado, conexão liberada). contextlib.contextmanager para função simples." },
    { title: "Packaging", body: "pip install. pyproject.toml (PEP 517/518). Poetry para gerenciamento completo. setuptools para distribuição." },
  ],
  gotchas: [
    "Mutable default argument: def f(x=[]) -- a lista é compartilhada entre chamadas. Use None + check.",
    "GIL: threads Python não paralelizam CPU-bound. Use multiprocessing.",
    "Late binding em closure em loop: lambda i=i workaround necessário em Python 2, ainda comum em bugs.",
    "Circular import em módulos -- reorganizar imports ou usar lazy import.",
    "float precision: 0.1 + 0.2 != 0.3 -- use decimal para cálculos financeiros.",
  ],
  interview: [
    { q: "O que e o GIL e quando importa?", a: "<p>GIL (Global Interpreter Lock) permite que so uma thread execute bytecode Python por vez, mesmo em multi-core. Isso simplifica gerenciamento de memória mas limita paralelismo CPU-bound em threads.</p><p>Para CPU-bound: use multiprocessing (cada processo tem seu próprio GIL). Para I/O-bound: threads ou asyncio funcionam bem (GIL e liberado durante I/O).</p>" },
    { q: "Diferenca entre list comprehension e generator expression?", a: "<p>List comprehension [x for x in ...] cria lista completa em memória. Generator expression (x for x in ...) cria generator lazy -- calcula sob demanda, O(1) memória.</p><p>Use generator quando processar sequência grande sem precisar de todos elementos ao mesmo tempo.</p>" },
  ],
  resources: [
    { title: "Real Python", url: "https://realpython.com/", kind: "artigo" },
    { title: "Python docs", url: "https://docs.python.org/3/", kind: "docs" },
  ],
}

export default python

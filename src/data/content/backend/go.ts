import type { SkillContent } from '@/types'

const go: SkillContent = {
  tagline: "Linguagem compilada, tipada e concorrente do Google — goroutines, performance, simplicidade.",
  why: "Go é forte em infraestrutura, CLIs e microserviços de alta performance. Cada vez mais presente em vagas de backend sênior que buscam alternativa ao Node para serviços críticos.",
  summary: "Go (Golang) é uma linguagem compilada, staticamente tipada, com garbage collector e modelo de concorrência baseado em goroutines e channels (CSP). Destaca-se por: compilação rápida, binary único sem dependências, performance próxima a C para I/O-bound, e simplicidade de linguagem. Usado em Docker, Kubernetes, Terraform, Prometheus.",
  gotchas: [
    "Goroutine leak — goroutine bloqueada em channel sem consumer vaza memória. Sempre garanta que goroutines terminam.",
    "Interface nil check — interface com tipo concreto não-nil mas valor nil pode causar panic inesperado.",
    "Erro ignorado com _ — Go force-retorna errors, ignorar com _ esconde bugs reais.",
    "Slice como referência — modificar slice passado para função modifica o original. Use copy() se precisar de isolamento.",
  ],
}

export default go

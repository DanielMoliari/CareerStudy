import type { SkillContent } from '@/types'

const rust: SkillContent = {
  tagline: "Linguagem de sistemas com ownership, sem GC e sem runtime — segurança e performance máximas.",
  why: "Rust está crescendo em WebAssembly, CLIs e infraestrutura de alto desempenho. Não é expectativa comum em backend web, mas é diferencial para sistemas críticos.",
  summary: "Rust oferece performance de C/C++ com segurança de memória garantida em compile-time via sistema de ownership e borrow checker. Sem garbage collector: memória é liberada deterministicamente. Excelente para: WebAssembly, CLIs, sistemas embarcados, serviços de alta performance onde GC pause é inaceitável.",
  gotchas: [
    "Borrow checker — a curva de aprendizado mais íngreme da linguagem. Entender ownership, borrowing e lifetimes leva tempo.",
    "Compile times longos em projetos grandes — incremental compilation ajuda mas ainda é mais lento que Go.",
    "Async no Rust (tokio) é mais complexo que em Go ou Node — futures, pinning e lifetimes interagem de formas não óbvias.",
  ],
}

export default rust

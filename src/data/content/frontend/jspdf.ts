import type { SkillContent } from '@/types'

const jspdf: SkillContent = {
    tagline: "Biblioteca JavaScript para geração de PDFs no browser ou Node.js.",
    why: "jsPDF aparece em sistemas que precisam de geração de PDF no cliente (sem servidor). Alternativa ao @react-pdf/renderer para casos simples.",
    gotchas: [
      "jsPDF não renderiza HTML diretamente. Para PDF a partir de HTML, use html2canvas para capturar como imagem + jsPDF para embedding.",
      "Fontes customizadas requerem embedding manual em base64 — sem isso, caracteres especiais (ã, ç, é) podem não aparecer.",
      "PDFs gerados no cliente são visíveis no bundle — não use para documentos com dados sensíveis sem server-side generation.",
    ],
}

export default jspdf

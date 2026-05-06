'use client'
import { useState, useEffect } from 'react'
import type { PdfCard, PdfBuilderFn } from './types'

// Paleta — duplicada intencionalmente (cada arquivo mantém sua própria cópia)
const BG      = '#0f172a'
const BG_DEEP = '#0a1220'
const CARD    = '#1e293b'
const LINE    = '#334155'
const MUTE    = '#475569'
const FG      = '#e2e8f0'
const FGMUTE  = '#94a3b8'

type BlobProviderArgs = { blob: Blob | null; loading: boolean; error: Error | null }
type BlobProviderComp = React.ComponentType<{ document: React.ReactElement; children: (args: BlobProviderArgs) => React.ReactNode }>

export function PulseLoader({ color, label }: { color: string; label: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 360, gap: 18 }}>
      <style>{`
        @keyframes cs-pulse-ring {
          0% { transform: scale(0.85); opacity: 0.7; }
          50% { transform: scale(1.1); opacity: 0.2; }
          100% { transform: scale(0.85); opacity: 0.7; }
        }
        @keyframes cs-pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
      <div style={{ position: 'relative', width: 56, height: 56 }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: `2px solid ${color}`, opacity: 0.6,
          animation: 'cs-pulse-ring 1.6s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', inset: 12, borderRadius: '50%',
          background: color, opacity: 0.85,
          animation: 'cs-pulse-dot 1.6s ease-in-out infinite',
        }} />
      </div>
      <div style={{ color: FGMUTE, fontSize: 11, fontFamily: "'JetBrains Mono',monospace", letterSpacing: 1 }}>
        {label}
      </div>
    </div>
  )
}

interface PdfModalProps {
  card: PdfCard
  onClose: () => void
  builders: Record<string, PdfBuilderFn>
  accent?: string
}

export function PdfModal({ card, onClose, builders, accent = '#61DAFB' }: PdfModalProps) {
  const [pdfDoc, setPdfDoc] = useState<React.ReactElement | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [BlobProvComp, setBlobProvComp] = useState<BlobProviderComp | null>(null)

  useEffect(() => {
    const builder = builders[card.id]
    if (!builder) { setError('PDF não implementado'); setLoading(false); return }

    Promise.all([
      builder(),
      import('@react-pdf/renderer'),
    ]).then(([doc, mod]) => {
      setPdfDoc(doc)
      if (mod.BlobProvider) setBlobProvComp(() => mod.BlobProvider as unknown as BlobProviderComp)
      setLoading(false)
    }).catch(err => {
      setError(String(err))
      setLoading(false)
    })
  }, [card.id, builders])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,.85)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}
      onClick={onClose}
    >
      <div style={{
        background: BG, border: `1px solid ${LINE}`, borderRadius: 12,
        width: '100%', maxWidth: 960, maxHeight: '92vh',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 20px 80px rgba(0,0,0,.6)',
        overflow: 'hidden',
      }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '18px 22px',
          background: CARD,
          borderBottom: `1px solid ${LINE}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              fontSize: 28, color: accent, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700,
              letterSpacing: 1, lineHeight: 1,
            }}>{card.icon}</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: FG, fontSize: 15, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif", letterSpacing: 0.2 }}>{card.title}</span>
                <span style={{ fontSize: 9, color: MUTE, background: BG_DEEP, padding: '2px 7px', borderRadius: 3, border: `1px solid ${LINE}`, fontFamily: "'JetBrains Mono',monospace" }}>
                  {card.pages}p
                </span>
              </div>
              <p style={{ color: FGMUTE, fontSize: 11, margin: '3px 0 0', fontFamily: "'JetBrains Mono',monospace" }}>{card.subtitle}</p>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'transparent', border: `1px solid ${LINE}`, borderRadius: 6,
            color: MUTE, fontSize: 12, padding: '7px 13px', cursor: 'pointer',
            fontFamily: "'JetBrains Mono',monospace",
          }}>✕ Fechar</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: 'auto', padding: 22, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {loading && <PulseLoader color={accent} label="Gerando PDF..." />}
          {error && (
            <div style={{
              padding: 16, background: '#3f1d1d22', border: '1px solid #ef444455', borderRadius: 8,
              color: '#fca5a5', fontSize: 12, fontFamily: "'JetBrains Mono',monospace",
            }}>Erro ao gerar PDF: {error}</div>
          )}
          {!loading && !error && pdfDoc && BlobProvComp && (
            <BlobProvComp document={pdfDoc}>
              {({ blob, loading: bl, error: blobErr }) => {
                if (blobErr) return <div style={{ color: '#fca5a5', fontSize: 12 }}>{String(blobErr)}</div>
                if (bl || !blob) return <PulseLoader color={accent} label="Renderizando preview..." />
                const url = URL.createObjectURL(blob)
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <object
                      data={url}
                      type="application/pdf"
                      style={{ width: '100%', height: '62vh', borderRadius: 8, border: `1px solid ${LINE}`, background: '#fff' }}
                    >
                      <div style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        height: '62vh', padding: 32, textAlign: 'center', gap: 18,
                        background: BG_DEEP, borderRadius: 8, border: `1px solid ${LINE}`,
                      }}>
                        <div style={{
                          width: 64, height: 64, borderRadius: '50%',
                          background: `${accent}22`, border: `2px solid ${accent}66`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: accent, fontSize: 28, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700,
                        }}>↓</div>
                        <div>
                          <p style={{ color: FG, fontSize: 14, margin: '0 0 6px', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>
                            Preview indisponível neste browser
                          </p>
                          <p style={{ color: FGMUTE, fontSize: 11, margin: 0, lineHeight: 1.6 }}>
                            Seu navegador não tem visualizador de PDF inline.<br />Faça download para abrir no leitor padrão.
                          </p>
                        </div>
                        <a
                          href={url}
                          download={`${card.id}.pdf`}
                          style={{
                            padding: '11px 24px', borderRadius: 8, fontSize: 12,
                            background: accent, color: BG, textDecoration: 'none',
                            fontFamily: "'JetBrains Mono',monospace", fontWeight: 700,
                            letterSpacing: 0.5,
                          }}
                        >
                          ↓ Baixar PDF
                        </a>
                      </div>
                    </object>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                      <a
                        href={url}
                        download={`${card.id}.pdf`}
                        style={{
                          padding: '11px 22px', borderRadius: 8, fontSize: 12,
                          background: `${accent}1a`, border: `1.5px solid ${accent}66`,
                          color: accent, textDecoration: 'none',
                          fontFamily: "'JetBrains Mono',monospace", fontWeight: 700,
                          letterSpacing: 0.5,
                        }}
                      >
                        ↓ Download PDF
                      </a>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          padding: '11px 22px', borderRadius: 8, fontSize: 12,
                          background: CARD, border: `1.5px solid ${LINE}`,
                          color: FG, textDecoration: 'none',
                          fontFamily: "'JetBrains Mono',monospace", fontWeight: 700,
                        }}
                      >
                        ↗ Abrir em nova aba
                      </a>
                    </div>
                  </div>
                )
              }}
            </BlobProvComp>
          )}
        </div>
      </div>
    </div>
  )
}

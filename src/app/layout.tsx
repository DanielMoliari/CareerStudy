import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CareerStudy',
  description: 'De pleno a senior — sem decoreba. Mapa de estudo com fundamentos, arquitetura e system design.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700;900&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}

'use client'
import dynamic from 'next/dynamic'

export const VISUAL_REGISTRY: Record<string, React.ComponentType> = {
  react: dynamic(() => import('@/data/content/frontend/react/ReactVisuais'), { ssr: false }),
  typescript: dynamic(() => import('@/data/content/frontend/typescript/TypescriptVisuais'), { ssr: false }),
  css: dynamic(() => import('@/data/content/frontend/css/CssVisuais'), { ssr: false }),
  html: dynamic(() => import('@/data/content/frontend/html/HtmlVisuais'), { ssr: false }),
  typeorm: dynamic(() => import('@/components/visuals/typeorm/TypeormVisuais'), { ssr: false }),
  // novas skills são adicionadas aqui
}

export const PDF_REGISTRY: Record<string, React.ComponentType> = {
  react: dynamic(() => import('@/data/content/frontend/react/ReactPdfs'), { ssr: false }),
  typescript: dynamic(() => import('@/data/content/frontend/typescript/TypescriptPdfs'), { ssr: false }),
  css: dynamic(() => import('@/data/content/frontend/css/CssPdfs'), { ssr: false }),
  html: dynamic(() => import('@/data/content/frontend/html/HtmlPdfs'), { ssr: false }),
  typeorm: dynamic(() => import('@/components/pdfs/typeorm/TypeormPdfs'), { ssr: false }),
  // novas skills são adicionadas aqui
}

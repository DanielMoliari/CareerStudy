'use client'
import dynamic from 'next/dynamic'

export const VISUAL_REGISTRY: Record<string, React.ComponentType> = {
  react: dynamic(() => import('@/data/content/frontend/react/ReactVisuais'), { ssr: false }),
  typescript: dynamic(() => import('@/data/content/frontend/typescript/TypescriptVisuais'), { ssr: false }),
  // novas skills são adicionadas aqui
}

export const PDF_REGISTRY: Record<string, React.ComponentType> = {
  react: dynamic(() => import('@/data/content/frontend/react/ReactPdfs'), { ssr: false }),
  typescript: dynamic(() => import('@/data/content/frontend/typescript/TypescriptPdfs'), { ssr: false }),
  // novas skills são adicionadas aqui
}

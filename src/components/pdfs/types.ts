'use client'

export type PdfType =
  | 'qa'
  | 'cheatsheet'
  | 'mnemonics'
  | 'antipatterns'
  | 'mindmap'
  | 'recipes'
  | 'migrations-cli'
  | 'comparative'
  | 'patterns'
  | 'commands'
  | 'errors'
  | 'quick-ref'
  | 'security'

export type PdfCard = {
  id: string
  title: string
  subtitle: string
  type: PdfType
  pages: number
  description: string
  icon: string
  goal: string
  featured?: boolean
}

export type PdfBuilderFn = () => Promise<React.ReactElement>

declare module '*.mdx' {
  import type { ComponentType } from 'react'

  export const frontmatter: {
    slug: string
    title: string
    date: string
    readingTime: number
    tags: string[]
  }

  const MDXComponent: ComponentType
  export default MDXComponent
}

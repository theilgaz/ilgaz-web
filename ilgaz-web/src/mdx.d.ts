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

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.jpeg' {
  const src: string
  export default src
}

declare module '*.png' {
  const src: string
  export default src
}

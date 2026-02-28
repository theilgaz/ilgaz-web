import Post1, { frontmatter as meta1 } from './sessizligin-basladigi-yer.mdx'
import Post2, { frontmatter as meta2 } from './essiz-yaraticinin-izniyle.mdx'
import Post3, { frontmatter as meta3 } from './yapay-zeka-caginda-yazilimcinin-yeri.mdx'
import Post4, { frontmatter as meta4 } from './kimin-gozunde-degerli.mdx'
import Post5, { frontmatter as meta5 } from './suphe-den-yakine.mdx'
import Post6, { frontmatter as meta6 } from './varolusun-agirligi.mdx'
import Post7, { frontmatter as meta7 } from './hakikatin-bedeli.mdx'
import Post8, { frontmatter as meta8 } from './uc-arayisci.mdx'
import Post9, { frontmatter as meta9 } from './yarin-kilarim.mdx'
import Post10, { frontmatter as meta10 } from './soyle-artik.mdx'
import Post18, { frontmatter as meta18 } from './gece-saat-ucte-debug.mdx'
import Post19, { frontmatter as meta19 } from './silinen-kodun-vedasi.mdx'
import Post20, { frontmatter as meta20 } from './sana-bir-sey-sormam-lazim.mdx'

export interface PostMeta {
  slug: string
  title: string
  date: string
  readingTime: number
  tags: string[]
}

export interface Post {
  meta: PostMeta
  Content: React.ComponentType
}

export const posts: Post[] = [
  { meta: meta20, Content: Post20 },
  { meta: meta10, Content: Post10 },
  { meta: meta9, Content: Post9 },
  { meta: meta8, Content: Post8 },
  { meta: meta7, Content: Post7 },
  { meta: meta6, Content: Post6 },
  { meta: meta5, Content: Post5 },
  { meta: meta4, Content: Post4 },
  { meta: meta3, Content: Post3 },
  { meta: meta2, Content: Post2 },
  { meta: meta1, Content: Post1 },
  { meta: meta18, Content: Post18 },
  { meta: meta19, Content: Post19 },
]

export const postsBySlug = Object.fromEntries(
  posts.map(p => [p.meta.slug, p])
) as Record<string, Post>

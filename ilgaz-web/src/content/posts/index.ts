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
import Post11, { frontmatter as meta11 } from './aliya-izzetbegovic.mdx'
import Post12, { frontmatter as meta12 } from './seyyid-kutup.mdx'
import Post13, { frontmatter as meta13 } from './hasan-el-benna.mdx'
import Post14, { frontmatter as meta14 } from './ali-seriati.mdx'
import Post15, { frontmatter as meta15 } from './omer-muhtar.mdx'
import Post16, { frontmatter as meta16 } from './necmettin-erbakan.mdx'
import Post17, { frontmatter as meta17 } from './seyh-samil.mdx'
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

// Taslak yazılar (henüz yayınlanmadı)
// { meta: meta17, Content: Post17 }, // dağların kartalı
// { meta: meta16, Content: Post16 }, // mücahit mühendis
// { meta: meta15, Content: Post15 }, // çöl aslanı
// { meta: meta14, Content: Post14 }, // öze dönüş çağrısı
// { meta: meta13, Content: Post13 }, // tohumun ekicisi
// { meta: meta12, Content: Post12 }, // darağacının gölgesinde
// { meta: meta11, Content: Post11 }, // bilge kral

export const postsBySlug = Object.fromEntries(
  posts.map(p => [p.meta.slug, p])
) as Record<string, Post>

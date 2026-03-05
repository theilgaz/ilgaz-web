export interface Collection {
  slug: string
  title: string
  description: string
  posts: string[] // post slugs in order
}

export const collections: Collection[] = [
  {
    slug: 'arayiscilar',
    title: 'arayışçılar',
    description: 'Gazali, Sartre ve Malcolm X. Üç farklı çağ, üç farklı coğrafya, aynı soru: hakikat nedir?',
    posts: [
      'suphe-den-yakine',
      'varolusun-agirligi',
      'hakikatin-bedeli',
      'uc-arayisci',
    ],
  },
  {
    slug: 'ummetten-portreler',
    title: 'ümmetten portreler',
    description: 'İslam dünyasının fikir adamları, liderleri ve direniş önderleri. Hayatları, mücadeleleri ve bıraktıkları miras.',
    posts: [
      'aliya-izzetbegovic',
      'seyyid-kutup',
      'hasan-el-benna',
      'ali-seriati',
      'omer-muhtar',
      'necmettin-erbakan',
      'seyh-samil',
    ],
  },
]

export const collectionsBySlug = Object.fromEntries(
  collections.map(c => [c.slug, c])
) as Record<string, Collection>

export function getCollectionForPost(postSlug: string): Collection | undefined {
  return collections.find(c => c.posts.includes(postSlug))
}

export function getPostPositionInCollection(postSlug: string, collection: Collection): number {
  return collection.posts.indexOf(postSlug)
}

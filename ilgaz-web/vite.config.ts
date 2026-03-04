import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import fs from 'node:fs'
import path from 'node:path'

function searchIndexPlugin() {
  const virtualId = 'virtual:search-index'
  const resolved = '\0' + virtualId

  return {
    name: 'search-index',
    resolveId(id: string) {
      if (id === virtualId) return resolved
    },
    load(id: string) {
      if (id !== resolved) return
      const dir = path.resolve(__dirname, 'src/content/posts')
      const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'))
      const index: Record<string, string> = {}
      for (const file of files) {
        const raw = fs.readFileSync(path.join(dir, file), 'utf-8')
        const slug = file.replace('.mdx', '')
        index[slug] = raw
          .replace(/export\s+const\s+frontmatter\s*=\s*\{[\s\S]*?\}\s*/, '')
          .replace(/import\s+.*\n/g, '')
          .replace(/[#*_`~>\[\]()!|]/g, '')
          .replace(/\{[^}]*\}/g, '')
          .replace(/\s+/g, ' ')
          .trim()
      }
      return `export const searchIndex = ${JSON.stringify(index)}`
    }
  }
}

export default defineConfig({
  plugins: [
    searchIndexPlugin(),
    { enforce: 'pre', ...mdx() },
    react(),
  ],
})

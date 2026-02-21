import { meta as seyyar42Meta, data as seyyar42Data } from './seyyar-42'

export interface ProjectMeta {
  slug: string
  name: string
  description: string
}

export interface ProjectData {
  tagline: string
  issue: string
  date: string
  status: string
  pullQuote: string
  motivation: string
  goals: string[]
  outcomes: string[]
  specs?: { label: string; value: string }[]
  heroImage?: { src: string; caption: string }
  gallery?: { src: string; caption: string }[]
}

export interface Project {
  meta: ProjectMeta
  data: ProjectData
}

export const projects: Project[] = [
  { meta: seyyar42Meta, data: seyyar42Data },
]

export const projectsBySlug = Object.fromEntries(
  projects.map(p => [p.meta.slug, p])
) as Record<string, Project>

# ilg.az — Project Instructions for Claude Code

> Persistent context for any Claude Code session working on this codebase.
> Keep this short and current; link out for anything long-form.

## What this is

A personal website for **ilg.az** (Baku, Azerbaijan) — writing-led portfolio
with a playful retro twist: **5 interchangeable themes** that the visitor
can switch between at any time.

- **Default** — Editorial warm minimal (Fraunces serif, paper palette, oxblood accent). This is the one people should fall in love with.
- **Windows 98** — Teal desktop, gray chrome, draggable windows, Start menu.
- **Windows XP** — Bliss wallpaper, Luna blue taskbar, IE6-style frame.
- **Terminal** — Black + phosphor green, keyboard-first, ASCII nav.
- **GeoCities** — Tiled bg, WordArt, marquees, visitor counter, under-construction.

**Principle:** content is theme-agnostic. A post, a project, or an "about" paragraph renders through *any* theme with no content changes. Themes are skins over the same data.

## Tech stack (recommended)

- **Astro** as the site generator — static output, file-based routes, content collections for posts/projects. Perfect fit for a personal site.
- **TypeScript** everywhere.
- **MDX** for posts so you can embed small components.
- **Vanilla CSS with CSS variables** — no Tailwind. Themes are pure `data-theme="…"` + CSS custom properties; a switcher toggles the attribute on `<html>` and persists to `localStorage`.
- **Fonts**: Fraunces (serif), Inter (sans), JetBrains Mono (mono) for default. Each theme overrides as needed (Tahoma/MS Sans Serif for 98, Trebuchet for XP, VT323 for terminal, Comic Sans/Impact for GeoCities).
- **Hosting**: Cloudflare Pages or Vercel. Keep `.az` DNS at current registrar.

## Repo layout

```
src/
  content/
    posts/              # .mdx — writing
    projects/           # .mdx — work
    now.md              # the Now page, single file
    config.ts           # content collection schemas (zod)
  layouts/
    Base.astro          # html shell, theme attr, switcher, font loading
    Post.astro          # article layout, theme-aware
  components/
    theme/
      ThemeSwitch.astro # corner control (persistent)
      themes.css        # all 5 theme palettes as @scope/[data-theme] blocks
    editorial/          # default-theme pieces (Hero, NowPanel, EntryList, WorkGrid…)
    win98/              # 98-specific chrome (DesktopIcon, Window, Taskbar, StartMenu)
    winxp/              # XP chrome
    terminal/           # terminal UI (Prompt, MenuList, AsciiBanner)
    geocities/          # marquee, WordArt, counter, webring badges
  pages/
    index.astro         # homepage — renders sections via current theme's <Layout>
    writing/
      index.astro
      [slug].astro
    work/
      index.astro
      [slug].astro
    about.astro
    now.astro
    colophon.astro
  styles/
    tokens.css          # shared design tokens (spacing, radii, motion)
    base.css            # reset + base typography
public/
  fonts/                # self-host licensed fonts
  sounds/               # optional: xp startup, 98 error ding
  images/               # photos, project thumbs
astro.config.mjs
package.json
CLAUDE.md               # this file
ROADMAP.md              # milestones
```

## Theme system — the contract

Every theme honours these CSS variables. The theme switcher flips `<html data-theme="editorial|win98|winxp|terminal|geocities">` and CSS does the rest.

```css
:root { /* editorial default */
  --bg, --bg-alt, --ink, --ink-2, --mute, --rule, --accent, --accent-soft;
  --serif, --sans, --mono, --display;
  --radius, --rule-width, --space, --shadow;
}
```

For the OS themes (98/XP), some sections wrap their content in a `<Window>` component; for terminal they pipe through a `<Prompt>` component. Use Astro slots to keep the content component unaware of chrome.

**Rule:** never hard-code a color/font/size in a page. If a theme needs it, it goes in `themes.css` as a variable.

## Content model (zod)

```ts
// posts
{ title, slug, date, tags[], summary, lang: 'en'|'az', readingTime, body }
// projects
{ title, slug, year, tagline, tags[], role, link?, repo?, status, body }
// now
{ updated, reading, building, listening, notes }
```

## Milestones — do them in order

1. **Scaffold Astro + default theme** — one working page (homepage) in the Editorial theme. Ship the content schema alongside.
2. **Writing & project pages** — routes, list + detail, MDX pipeline, RSS.
3. **Theme system** — extract CSS variables from the default, build the switcher, add no-op themes that just change the palette. Persist choice.
4. **Win 98 theme** — real chrome. Desktop icons, draggable windows, taskbar, Start menu. Homepage opens as a window.
5. **Win XP theme** — Luna taskbar, IE6 window frame, Bliss background.
6. **Terminal theme** — ASCII banner, prompt-driven nav (keyboard first), CRT scanlines.
7. **GeoCities theme** — marquee, WordArt, visitor counter (real, via Cloudflare KV), under-construction gifs.
8. **i18n (EN/AZ)** — content in both languages, `/az/…` routes, language toggle syncs with theme switch.
9. **Polish** — transitions between themes (fade, not cut), prefers-reduced-motion, a11y pass, open-graph images per theme.
10. **Ship** — deploy, RSS, sitemap, analytics-free.

## Conventions

- **File names**: kebab-case (`theme-switch.astro`, `work-card.astro`).
- **Component names**: PascalCase, co-located styles via `<style>` blocks scoped by Astro.
- **One component per file.** If it grows past ~150 lines, split.
- **No utility-class soup.** Semantic class names, variables do the theming.
- **No client JS for theming beyond the switcher.** `data-theme` + CSS.
- **Fonts must be self-hosted** under `public/fonts/` to survive without Google Fonts.

## Non-goals

- No CMS. Content lives in MDX in the repo.
- No newsletter. RSS only.
- No third-party analytics.
- No comments.
- No build-time image optimization services — use Astro's built-in `<Image>`.

## Where the current designs live

- `themes/default.html` — the approved Editorial theme (pixel reference for the Astro port).
- `Retro ilg.az — Plan & Wireframes.html` — low-fi wireframes for the 4 retro themes.
- `wireframes.jsx` — the retro wireframe components.

Port them, don't rewrite them. Lift colors, spacing, type scales verbatim from `themes/default.html`.

## Getting started in Claude Code

```
npm create astro@latest ilg-az -- --template minimal --typescript strict --yes
cd ilg-az
npm i @astrojs/mdx @astrojs/rss
# copy themes/default.html into a scratch folder for reference
# follow ROADMAP.md milestones in order
```

First prompt to Claude Code in the new repo:

> "Read `CLAUDE.md` and `ROADMAP.md`. Start Milestone 1: scaffold the Editorial theme as a single homepage route, porting visuals exactly from `themes/default.html`. Use content collections for posts, projects, and the now page; stub three of each."

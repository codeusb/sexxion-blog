import { toString } from 'mdast-util-to-string'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import type { BlogPost, TocItem } from '../types/blog'

type Frontmatter = {
  title?: string
  date?: string
  tags?: string
}

const markdownModules = import.meta.glob('../../public/**/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

export const allPosts = Object.entries(markdownModules)
  .map(([path, raw]) => parsePost(path, raw))
  .sort((a, b) => (a.date < b.date ? 1 : -1))

export function getSiblingPost(slug: string, offset: -1 | 1) {
  const index = allPosts.findIndex((post) => post.slug === slug)
  if (index === -1) {
    return undefined
  }

  return allPosts[index + offset]
}

function parsePost(path: string, raw: string): BlogPost {
  const slug = deriveSlug(path)
  const { frontmatter, content } = splitFrontmatter(raw)
  const date = frontmatter.date || new Date().toISOString().slice(0, 10)

  return {
    slug,
    title: frontmatter.title || slug,
    date,
    dateLabel: formatDate(date),
    tags: splitTags(frontmatter.tags),
    readingTime: estimateReadingTime(content),
    markdown: content,
    toc: extractToc(content),
    assetBasePath: `/${slug}/`,
  }
}

function splitFrontmatter(raw: string) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
  if (!match) {
    return { frontmatter: {} as Frontmatter, content: raw }
  }

  const frontmatter = match[1]
    .split('\n')
    .reduce<Frontmatter>((acc, line) => {
      const index = line.indexOf(':')
      if (index === -1) {
        return acc
      }

      const key = line.slice(0, index).trim() as keyof Frontmatter
      const value = line.slice(index + 1).trim().replace(/^"(.*)"$/, '$1')
      acc[key] = value
      return acc
    }, {})

  return { frontmatter, content: match[2] }
}

function extractToc(markdown: string): TocItem[] {
  const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown)
  const items: TocItem[] = []
  const usedIds = new Map<string, number>()

  visit(tree, 'heading', (node) => {
    const depth = 'depth' in node ? node.depth : 0
    if (depth !== 2 && depth !== 3) {
      return
    }

    const text = toString(node).trim()
    if (!text) {
      return
    }

    items.push({
      id: createHeadingId(text, usedIds),
      text,
      level: depth,
    })
  })

  return items
}

function createHeadingId(text: string, usedIds: Map<string, number>) {
  const base = slugify(text) || 'section'
  const seen = usedIds.get(base) ?? 0
  usedIds.set(base, seen + 1)
  return seen === 0 ? base : `${base}-${seen + 1}`
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[`*_~()[\].,!?/\\:;'"“”‘’]/g, '')
    .replace(/\s+/g, '-')
}

function deriveSlug(path: string) {
  const normalized = path.replace(/\\/g, '/')
  const segments = normalized.split('/')
  const filename = segments.at(-1)?.replace(/\.md$/, '') ?? 'post'

  if (filename === 'index' && segments.length > 1) {
    return segments.at(-2) ?? 'post'
  }

  return filename
}

function splitTags(value?: string) {
  if (!value) {
    return []
  }

  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

function estimateReadingTime(content: string) {
  const chineseChars = (content.match(/[\u4e00-\u9fff]/g) ?? []).length
  const englishWords = content
    .replace(/[\u4e00-\u9fff]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length
  const units = chineseChars + englishWords
  const minutes = Math.max(1, Math.ceil(units / 320))
  return `${minutes} min read`
}

function formatDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

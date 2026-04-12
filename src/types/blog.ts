export type TocItem = {
  id: string
  text: string
  level: 2 | 3
}

export type BlogPost = {
  slug: string
  title: string
  date: string
  dateLabel: string
  tags: string[]
  readingTime: string
  markdown: string
  toc: TocItem[]
  assetBasePath: string
}

import ReactMarkdown from 'react-markdown'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'

type MarkdownContentProps = {
  markdown: string
  assetBasePath: string
}

export function MarkdownContent({
  markdown,
  assetBasePath,
}: MarkdownContentProps) {
  return (
    <div className="article-markdown">
      <ReactMarkdown
        rehypePlugins={[rehypeSlug]}
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children, ...props }) => (
            <h2 className="article-heading-l2" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="article-subheading" {...props}>
              {children}
            </h3>
          ),
          p: ({ children, ...props }) => (
            <p className="article-paragraph" {...props}>
              {children}
            </p>
          ),
          ul: ({ children, ...props }) => (
            <ul className="article-list" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="article-list" {...props}>
              {children}
            </ol>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote className="callout" {...props}>
              {children}
            </blockquote>
          ),
          pre: ({ children }) => <>{children}</>,
          code: ({ children, className, ...props }) => {
            const code = String(children).replace(/\n$/, '')
            const isBlock = Boolean(className?.startsWith('language-') || code.includes('\n'))

            if (!isBlock) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            }

            return <CodeBlock className={className} code={code} />
          },
          hr: (props) => <hr className="article-rule" {...props} />,
          a: ({ href, children, ...props }) => {
            const isExternal = href?.startsWith('http://') || href?.startsWith('https://')
            return (
              <a
                className="inline-link"
                href={href}
                rel={isExternal ? 'noreferrer' : undefined}
                target={isExternal ? '_blank' : undefined}
                {...props}
              >
                {children}
              </a>
            )
          },
          img: ({ src, alt, ...props }) => (
            <figure className="article-figure">
              <img
                alt={alt || ''}
                src={resolveAssetPath(src, assetBasePath)}
                {...props}
              />
              {alt ? <figcaption>{alt}</figcaption> : null}
            </figure>
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  )
}

function CodeBlock({
  className,
  code,
}: {
  className?: string
  code: string
}) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
    } catch {
      console.error('Failed to copy code')
    }
  }

  return (
    <div className="code-block-shell">
      <button
        aria-label="Copy code"
        className="code-copy-button"
        onClick={handleCopy}
        title="Copy code"
        type="button"
      >
        <span className="code-copy-icon" aria-hidden="true">
          <span className="code-copy-square code-copy-square-back" />
          <span className="code-copy-square code-copy-square-front" />
        </span>
      </button>
      <pre className="code-block">
        <code className={className}>{code}</code>
      </pre>
    </div>
  )
}

function resolveAssetPath(src: string | undefined, assetBasePath: string) {
  if (!src) {
    return ''
  }

  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')) {
    return src
  }

  const baseUrl = import.meta.env.BASE_URL.replace(/\/+$/, '')
  const normalizedAssetBasePath = assetBasePath.replace(/^\/+|\/+$/g, '')
  const normalizedSrc = src.replace(/^\.\//, '')

  return `${baseUrl}/${normalizedAssetBasePath}/${normalizedSrc}`
}

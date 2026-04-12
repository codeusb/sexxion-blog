import { MarkdownContent } from "./MarkdownContent";
import type { BlogPost } from "../types/blog";

type ArticlePageProps = {
  post: BlogPost;
  previousPost?: BlogPost;
  nextPost?: BlogPost;
  onNavigate: (slug: string) => void;
};

export function ArticlePage({
  post,
  previousPost,
  nextPost,
  onNavigate,
}: ArticlePageProps) {
  return (
    <main className="page page-article">
      <article className="article">
        <button className="back-link" onClick={() => onNavigate("home")}>
          Back to Home
        </button>

        <header className="article-header">
          <h1>{post.title}</h1>
          <p className="article-meta">
            <span>{post.dateLabel}</span>
            <span>{post.readingTime}</span>
          </p>
        </header>

        <div className="article-layout">
          <div className="article-main">
            <MarkdownContent
              assetBasePath={post.assetBasePath}
              markdown={post.markdown}
            />

            <nav className="post-nav" aria-label="post navigation">
              {previousPost ? (
                <button
                  className="post-nav-card"
                  onClick={() => onNavigate(previousPost.slug)}
                >
                  <span className="post-nav-label">Previous</span>
                  <strong>{previousPost.title}</strong>
                </button>
              ) : (
                <span />
              )}

              {nextPost ? (
                <button
                  className="post-nav-card align-right"
                  onClick={() => onNavigate(nextPost.slug)}
                >
                  <span className="post-nav-label">Next</span>
                  <strong>{nextPost.title}</strong>
                </button>
              ) : null}
            </nav>
          </div>

          {post.toc.length > 0 ? (
            <aside className="toc-rail">
              <nav className="toc" aria-label="table of contents">
                <p className="toc-title">On this page</p>
                <ol className="toc-list">
                  {post.toc.map((item) => (
                    <li
                      className={`toc-item toc-item-${item.level}`}
                      key={item.id}
                    >
                      <a
                        aria-label={item.text}
                        data-label={item.text}
                        href={`#${item.id}`}
                      >
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </aside>
          ) : null}
        </div>
      </article>
    </main>
  );
}

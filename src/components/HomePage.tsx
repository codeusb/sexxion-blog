import type { BlogPost } from "../types/blog";

type HomePageProps = {
  posts: BlogPost[];
  onOpenPost: (slug: string) => void;
};

export function HomePage({ posts, onOpenPost }: HomePageProps) {
  return (
    <main className="page page-home">
      <section className="post-list" aria-label="posts">
        {posts.map((post) => (
          <article className="post-card" key={post.slug}>
            <button
              className="post-title"
              onClick={() => onOpenPost(post.slug)}
            >
              {post.title}
            </button>
            <p className="post-meta">
              <span>{post.dateLabel}</span>
              <span>{post.readingTime}</span>
            </p>
            <div className="post-tags" aria-label="tags">
              {post.tags.map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

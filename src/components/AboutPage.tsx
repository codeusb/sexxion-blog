const featuredProjects = [
  {
    name: "sexxion-blog",
    href: "https://github.com/yourname/sexxion-blog",
    description: "这个博客本身。用来记录前端、浏览器和工程实践的学习过程。",
  },
];

const socialLinks = [
  { label: "GitHub", href: "https://github.com/codeusb" },
  // { label: 'X', href: 'https://x.com/yourname' },
];

type AboutPageProps = {
  onNavigateHome: () => void;
};

export function AboutPage({ onNavigateHome }: AboutPageProps) {
  return (
    <main className="page page-about">
      <section className="about-page">
        <button className="back-link" onClick={onNavigateHome}>
          Back to home
        </button>

        <header className="about-hero">
          <p className="post-kicker">About</p>
          <h1>写代码，做项目，也把过程认真记录下来。</h1>
          <div className="about-copy">
            <p>
              我是一名前端方向的开发者，目前主要关注浏览器机制、React
              应用架构，以及把复杂问题拆解清楚的表达方式。
            </p>
            <p>todo</p>
          </div>
        </header>

        <section className="about-section">
          <p className="post-kicker">Projects</p>
          <div className="about-cards">
            {featuredProjects.map((project) => (
              <a
                className="about-card"
                href={project.href}
                key={project.name}
                rel="noreferrer"
                target="_blank"
              >
                <strong>{project.name}</strong>
                <p>{project.description}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="about-section">
          <p className="post-kicker">Elsewhere</p>
          <div className="about-links" aria-label="social links">
            {socialLinks.map((link) => (
              <a
                className="about-link"
                href={link.href}
                key={link.label}
                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                target={link.href.startsWith("http") ? "_blank" : undefined}
              >
                {link.label}
              </a>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

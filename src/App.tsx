import { useEffect, useState } from "react";
import { AboutPage } from "./components/AboutPage";
import { ArticlePage } from "./components/ArticlePage";
import { HomePage } from "./components/HomePage";
import { SiteHeader } from "./components/SiteHeader";
import { allPosts } from "./lib/blog";
import "./App.css";

function getInitialTheme() {
  if (typeof window === "undefined") {
    return "light" as const;
  }

  const storedTheme = window.localStorage.getItem("theme");
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getCurrentPath() {
  const normalized = window.location.pathname.replace(/^\/+|\/+$/g, "");
  return normalized || "home";
}

function App() {
  const [path, setPath] = useState(getCurrentPath);
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);

  useEffect(() => {
    const onPopState = () => {
      setPath(getCurrentPath());
      window.scrollTo({ top: 0, behavior: "auto" });
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const currentPost = allPosts.find((post) => post.slug === path);
  const isAboutPage = path === "about";

  useEffect(() => {
    document.title = currentPost ? `${currentPost.title}` : "sexxion";
  }, [currentPost, isAboutPage]);

  const navigate = (nextPath: string) => {
    const targetPath = nextPath === "home" ? "/" : `/${nextPath}`;
    window.history.pushState({}, "", targetPath);
    setPath(nextPath);
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  return (
    <div className="shell">
      <SiteHeader
        onNavigateAbout={() => navigate("about")}
        onNavigateHome={() => navigate("home")}
        onToggleTheme={toggleTheme}
        theme={theme}
      />

      {currentPost ? (
        <ArticlePage onNavigate={navigate} post={currentPost} />
      ) : isAboutPage ? (
        <AboutPage onNavigateHome={() => navigate("home")} />
      ) : (
        <HomePage onOpenPost={navigate} posts={allPosts} />
      )}
    </div>
  );
}

export default App;

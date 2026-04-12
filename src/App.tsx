import { useEffect, useState } from "react";
import { AboutPage } from "./components/AboutPage";
import { ArticlePage } from "./components/ArticlePage";
import { HomePage } from "./components/HomePage";
import { SiteHeader } from "./components/SiteHeader";
import { allPosts } from "./lib/blog";
import "./App.css";

const BASE_URL = import.meta.env.BASE_URL;

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

function normalizePathname(pathname: string) {
  const basePath = BASE_URL.replace(/\/+$/, "");
  const withoutBase =
    basePath && basePath !== "/" && pathname.startsWith(basePath)
      ? pathname.slice(basePath.length) || "/"
      : pathname;

  const normalized = withoutBase.replace(/^\/+|\/+$/g, "");
  return normalized || "home";
}

function getCurrentPath() {
  const redirectedPath = window.sessionStorage.getItem("spa-redirect");
  if (redirectedPath) {
    window.sessionStorage.removeItem("spa-redirect");
    const redirectedUrl = new URL(redirectedPath, window.location.origin);
    window.history.replaceState(
      {},
      "",
      `${redirectedUrl.pathname}${redirectedUrl.search}${redirectedUrl.hash}`
    );
    return normalizePathname(redirectedUrl.pathname);
  }

  return normalizePathname(window.location.pathname);
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
    const basePath = BASE_URL.replace(/\/+$/, "");
    const targetPath =
      nextPath === "home"
        ? `${basePath || "/"}${basePath ? "/" : ""}`
        : `${basePath}/${nextPath}`;
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

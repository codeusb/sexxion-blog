type SiteHeaderProps = {
  onNavigateAbout: () => void
  onNavigateHome: () => void
  onToggleTheme: () => void
  theme: 'light' | 'dark'
}

export function SiteHeader({
  onNavigateAbout,
  onNavigateHome,
  onToggleTheme,
  theme,
}: SiteHeaderProps) {
  return (
    <header className="site-header">
      <button className="wordmark" onClick={onNavigateHome}>
        sexxion
      </button>
      <div className="header-actions">
        <button
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className={`theme-toggle theme-toggle-${theme}`}
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          type="button"
        >
          <span className="theme-toggle-icon" aria-hidden="true">
            <span className="theme-toggle-sun" />
            <span className="theme-toggle-moon" />
          </span>
        </button>
        <button
          aria-label="Open profile page"
          className="signature signature-button"
          onClick={onNavigateAbout}
          type="button"
        >
          <span className="signature-avatar">D</span>
        </button>
      </div>
    </header>
  )
}

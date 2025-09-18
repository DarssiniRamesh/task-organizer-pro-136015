import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * Root application component providing the base layout:
 * - Header: App title and theme toggle
 * - Sidebar: Placeholder for filters/navigation
 * - Main: Placeholder for primary content (Tasks list area)
 * The component also controls a document-level data-theme attribute for light/dark modes.
 */
// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState(() => {
    // Respect prefers-color-scheme; allow manual override later
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="App app-shell">
      <header className="app-header">
        <div className="app-title">
          <span aria-hidden="true">🗂️</span>
          <span>Task Manager</span>
        </div>
        <div className="app-actions">
          <button
            className="btn btn-primary"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title="Toggle theme"
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </header>

      <aside className="app-sidebar">
        <div className="sidebar-section">
          <div className="sidebar-title">Filters</div>
          <div className="surface" style={{ padding: '12px' }}>
            <p className="text-muted" style={{ margin: 0 }}>
              Sidebar placeholder for filters (status, priority, date).
            </p>
          </div>
        </div>
      </aside>

      <main className="app-main">
        <div className="placeholder-card">
          <h2>Welcome</h2>
          <p>
            The Soft Mono theme is active. This is a minimalist scaffold for the
            Header / Sidebar / Main layout. Continue building features here.
          </p>
          <p className="text-muted" style={{ marginTop: '12px' }}>
            Next steps: add routing, auth screens, and task list components.
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';

/**
 * Sidebar component for Soft Mono layout.
 * Provides placeholder sections for filters and simple navigation.
 */

// PUBLIC_INTERFACE
export default function Sidebar() {
  /** Renders left sidebar with basic app navigation and a filters placeholder block. */
  const location = useLocation();

  return (
    <aside className="app-sidebar">
      <nav className="sidebar-section" aria-label="Primary">
        <div className="sidebar-title">Navigation</div>
        <div className="surface" style={{ padding: '12px' }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8 }}>
            <li>
              <Link
                className={clsx('link')}
                style={{ fontWeight: location.pathname.startsWith('/app/tasks') ? 650 : 500 }}
                to="/app/tasks"
              >
                Tasks
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <div className="sidebar-section" style={{ marginTop: 16 }}>
        <div className="sidebar-title">Filters</div>
        <div className="surface" style={{ padding: '12px' }}>
          <p className="text-muted" style={{ margin: 0 }}>
            Quick filters will appear here on larger screens.
          </p>
        </div>
      </div>
    </aside>
  );
}

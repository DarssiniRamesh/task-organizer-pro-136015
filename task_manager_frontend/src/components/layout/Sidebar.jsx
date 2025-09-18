import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';

/**
 * Sidebar component for Soft Mono layout.
 * Provides navigation and quick filter links that sync with TasksPage query params.
 */

// PUBLIC_INTERFACE
export default function Sidebar() {
  /** Renders left sidebar with basic app navigation and quick filters. */
  const location = useLocation();
  const navigate = useNavigate();

  const goToTasksWith = (patch) => {
    const sp = new URLSearchParams(location.search);
    // Clean unrelated keys
    if (patch.status) sp.set('status', patch.status);
    if (patch.priority) sp.set('priority', patch.priority);
    if (patch.due) sp.set('due', patch.due);
    const path = '/app/tasks';
    navigate({ pathname: path, search: `?${sp.toString()}` });
  };

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
        <div className="sidebar-title">Quick filters</div>
        <div className="surface" style={{ padding: '12px' }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 6 }}>
            <li>
              <button className="btn" type="button" onClick={() => goToTasksWith({ status: 'todo' })}>
                To Do
              </button>
            </li>
            <li>
              <button className="btn" type="button" onClick={() => goToTasksWith({ status: 'in_progress' })}>
                In Progress
              </button>
            </li>
            <li>
              <button className="btn" type="button" onClick={() => goToTasksWith({ status: 'done' })}>
                Done
              </button>
            </li>
            <li style={{ marginTop: 6 }}>
              <button className="btn" type="button" onClick={() => goToTasksWith({ due: 'overdue' })}>
                Overdue
              </button>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}

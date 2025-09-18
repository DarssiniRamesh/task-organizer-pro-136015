import React, { useEffect, useState } from 'react';

/**
 * FilterBar displays filtering controls: status, priority, due, sort and a search field.
 * It is controlled via a 'filters' object and onChange callback.
 */

// PUBLIC_INTERFACE
export default function FilterBar({ filters, onChange }) {
  /** Controlled filter bar with basic debounce for q. */
  const [localQ, setLocalQ] = useState(filters?.q || '');

  useEffect(() => {
    setLocalQ(filters?.q || '');
  }, [filters?.q]);

  useEffect(() => {
    const h = setTimeout(() => {
      onChange?.({ ...filters, q: localQ });
    }, 300);
    return () => clearTimeout(h);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localQ]);

  const handleChange = (key) => (e) => {
    onChange?.({ ...filters, [key]: e.target.value });
  };

  return (
    <div className="surface" style={{ padding: 16, marginBottom: 16 }} role="region" aria-label="Task filters">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 8, alignItems: 'center' }}>
        <select
          value={filters.status}
          onChange={handleChange('status')}
          aria-label="Filter by status"
          className="input"
        >
          <option value="all">All statuses</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <select
          value={filters.priority}
          onChange={handleChange('priority')}
          aria-label="Filter by priority"
          className="input"
        >
          <option value="all">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select
          value={filters.due}
          onChange={handleChange('due')}
          aria-label="Filter by due"
          className="input"
        >
          <option value="all">Any due</option>
          <option value="overdue">Overdue</option>
          <option value="today">Due today</option>
          <option value="week">Due this week</option>
        </select>

        <select
          value={filters.sort}
          onChange={handleChange('sort')}
          aria-label="Sort tasks"
          className="input"
        >
          <option value="updated_at">Recently updated</option>
          <option value="due_date">Due date</option>
          <option value="priority">Priority</option>
        </select>

        <input
          type="search"
          placeholder="Search title…"
          className="input"
          value={localQ}
          onChange={(e) => setLocalQ(e.target.value)}
          aria-label="Search tasks by title"
        />
      </div>
      <style>{`
        @media (max-width: 960px) {
          [aria-label="Task filters"] > div {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 640px) {
          [aria-label="Task filters"] > div {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

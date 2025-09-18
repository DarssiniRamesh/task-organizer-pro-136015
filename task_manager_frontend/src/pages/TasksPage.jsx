import { useEffect, useMemo, useState } from 'react';
import useTasks from '../hooks/useTasks';
import { format } from 'date-fns';

/**
 * Minimal page to test useTasks hook end-to-end.
 * This focuses on data flow and basic interactivity; full UI polish comes later.
 */

// PUBLIC_INTERFACE
export default function TasksPage() {
  const [localQ, setLocalQ] = useState('');
  const { tasks, loading, error, filters, setFilters, createTask, updateTask, deleteTask } = useTasks(
    {},
    {}
  );

  // Simple form state for creating a task
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('todo');
  const [dueDate, setDueDate] = useState('');

  const canSubmit = title.trim().length > 0;

  const handleCreate = async (e) => {
    e.preventDefault();
    const payload = {
      title: title.trim(),
      priority,
      status,
      due_date: dueDate ? new Date(dueDate).toISOString() : null,
    };
    const { error: err } = await createTask(payload);
    if (!err) {
      setTitle('');
      setDueDate('');
      setPriority('medium');
      setStatus('todo');
    }
  };

  const sortedLabel = useMemo(() => {
    if (filters.sort === 'due_date') return 'Due date';
    if (filters.sort === 'priority') return 'Priority';
    return 'Recently updated';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.sort]);

  // reflect local search text into filters with debounce-like simple approach
  useEffect(() => {
    const h = setTimeout(() => {
      setFilters((f) => ({ ...f, q: localQ }));
    }, 300);
    return () => clearTimeout(h);
  }, [localQ, setFilters]);

  return (
    <div className="app-main">
      <div className="container">
        <div className="surface" style={{ padding: 16, marginBottom: 16 }}>
          <h2 style={{ marginBottom: 8 }}>Tasks</h2>
          <div className="text-muted" style={{ fontSize: 14, marginBottom: 8 }}>
            Sorted by: {sortedLabel}
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
            <select
              value={filters.status}
              onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
              aria-label="Filter by status"
              className="auth-input"
            >
              <option value="all">All statuses</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>

            <select
              value={filters.priority}
              onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))}
              aria-label="Filter by priority"
              className="auth-input"
            >
              <option value="all">All priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <select
              value={filters.due}
              onChange={(e) => setFilters((f) => ({ ...f, due: e.target.value }))}
              aria-label="Filter by due"
              className="auth-input"
            >
              <option value="all">Any due</option>
              <option value="overdue">Overdue</option>
              <option value="today">Due today</option>
              <option value="week">Due this week</option>
            </select>

            <select
              value={filters.sort}
              onChange={(e) => setFilters((f) => ({ ...f, sort: e.target.value }))}
              aria-label="Sort tasks"
              className="auth-input"
            >
              <option value="updated_at">Recently updated</option>
              <option value="due_date">Due date</option>
              <option value="priority">Priority</option>
            </select>

            <input
              type="search"
              placeholder="Search title…"
              className="auth-input"
              value={localQ}
              onChange={(e) => setLocalQ(e.target.value)}
              style={{ flex: '1 1 240px' }}
              aria-label="Search tasks by title"
            />
          </div>

          {error && (
            <div role="alert" className="auth-error">
              {error.message}
            </div>
          )}
        </div>

        <div className="surface" style={{ padding: 16, marginBottom: 16 }}>
          <h3 style={{ marginBottom: 8 }}>New task</h3>
          <form onSubmit={handleCreate} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Task title"
              className="auth-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              aria-label="Task title"
              style={{ flex: '1 1 260px' }}
            />

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              aria-label="Priority"
              className="auth-input"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              aria-label="Status"
              className="auth-input"
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>

            <input
              type="date"
              className="auth-input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              aria-label="Due date"
            />

            <button className="btn btn-primary" type="submit" disabled={!canSubmit}>
              Add
            </button>
          </form>
        </div>

        <div className="surface" style={{ padding: 0 }}>
          <div style={{ padding: 16, borderBottom: 'var(--border)' }}>
            <h3 style={{ margin: 0 }}>Your tasks</h3>
          </div>

          {loading ? (
            <div style={{ padding: 16 }} className="text-muted">
              Loading tasks…
            </div>
          ) : tasks.length === 0 ? (
            <div style={{ padding: 16 }} className="text-muted">
              No tasks found. Create your first task above.
            </div>
          ) : (
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {tasks.map((t) => {
                const overdue =
                  t.due_date ? new Date(t.due_date).getTime() < new Date().setHours(0, 0, 0, 0) : false;
                return (
                  <li
                    key={t.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: 12,
                      borderTop: 'var(--border)',
                      borderLeft: overdue ? '3px solid var(--error)' : '3px solid transparent',
                    }}
                  >
                    <div style={{ flex: '1 1 auto' }}>
                      <div style={{ fontWeight: 600 }}>{t.title}</div>
                      <div className="text-muted" style={{ fontSize: 13 }}>
                        {t.priority} • {t.status}
                        {t.due_date ? ` • due ${format(new Date(t.due_date), 'yyyy-MM-dd')}` : ''}
                      </div>
                    </div>
                    <select
                      aria-label={`Update status for ${t.title}`}
                      className="auth-input"
                      value={t.status}
                      onChange={(e) => updateTask(t.id, { status: e.target.value })}
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                    <button className="btn" onClick={() => deleteTask(t.id)}>
                      Delete
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

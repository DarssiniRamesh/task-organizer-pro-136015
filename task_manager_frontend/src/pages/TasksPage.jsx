import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useTasks from '../hooks/useTasks';
import FilterBar from '../components/tasks/FilterBar';
import TaskList from '../components/tasks/TaskList';
import TaskFormModal from '../components/tasks/TaskFormModal';
import '../components/tasks/tasks.css';

/**
 * TasksPage: End-to-end page integrating tasks hook with UI components:
 * - FilterBar (filters, sorting, search)
 * - TaskList (listing, edit/delete)
 * - TaskFormModal (add/edit modal)
 * - URL query param sync for filters and deep-link editing
 */

// PUBLIC_INTERFACE
export default function TasksPage() {
  const { tasks, loading, error, filters, setFilters, createTask, updateTask, deleteTask } =
    useTasks(readFiltersFromQuery(useLocation().search), {});
  const navigate = useNavigate();
  const location = useLocation();

  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  // Keep URL in sync when filters change
  useEffect(() => {
    const q = new URLSearchParams();
    if (filters.status && filters.status !== 'all') q.set('status', filters.status);
    if (filters.priority && filters.priority !== 'all') q.set('priority', filters.priority);
    if (filters.due && filters.due !== 'all') q.set('due', filters.due);
    if (filters.q) q.set('q', filters.q);
    if (filters.sort && filters.sort !== 'updated_at') q.set('sort', filters.sort);
    const next = q.toString();
    const current = location.search.replace(/^\?/, '');
    if (next !== current) {
      navigate({ pathname: location.pathname, search: next ? `?${next}` : '' }, { replace: true });
    }
  }, [filters, navigate, location.pathname, location.search]);

  // Optional: observe ?id=<taskId> for deep-link edit
  useEffect(() => {
    const sp = new URLSearchParams(location.search);
    const editId = sp.get('id');
    if (editId) {
      const t = tasks.find((x) => x.id === editId);
      if (t) {
        setEditTask(t);
        setIsFormOpen(true);
      }
    }
  }, [location.search, tasks]);

  const onFilterChange = (next) => setFilters(next);

  const onNewTask = () => {
    setEditTask(null);
    setIsFormOpen(true);
  };

  const onEditTask = (t) => {
    setEditTask(t);
    setIsFormOpen(true);
    const sp = new URLSearchParams(location.search);
    sp.set('id', t.id);
    navigate({ pathname: location.pathname, search: `?${sp.toString()}` }, { replace: true });
  };

  const onDeleteTask = async (t) => {
    // simple confirm dialog per requirements
    const ok = window.confirm(`Delete "${t.title}"? This cannot be undone.`);
    if (!ok) return;
    await deleteTask(t.id);
  };

  const onStatusChange = async (id, status) => {
    await updateTask(id, { status });
  };

  const handleCloseModal = () => {
    setIsFormOpen(false);
    setEditTask(null);
    // remove id param if present
    const sp = new URLSearchParams(location.search);
    if (sp.has('id')) {
      sp.delete('id');
      navigate({ pathname: location.pathname, search: sp.toString() ? `?${sp.toString()}` : '' }, { replace: true });
    }
  };

  const handleSubmitModal = async (payload) => {
    if (editTask) {
      return await updateTask(editTask.id, payload);
    }
    return await createTask(payload);
  };

  const sortedLabel = useMemo(() => {
    if (filters.sort === 'due_date') return 'Due date';
    if (filters.sort === 'priority') return 'Priority';
    return 'Recently updated';
  }, [filters.sort]);

  return (
    <div className="app-main">
      <div className="container">
        <div className="surface" style={{ padding: 16, marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <h2 style={{ marginBottom: 4 }} aria-label="Tasks heading">Tasks</h2>
              <div className="text-muted" style={{ fontSize: 14 }}>Sorted by: {sortedLabel}</div>
            </div>
            <div>
              <button className="btn btn-primary" type="button" onClick={onNewTask} aria-haspopup="dialog" aria-label="Create new task">
                ➕ New Task
              </button>
            </div>
          </div>
        </div>

        <FilterBar filters={filters} onChange={onFilterChange} />

        {error && (
          <div role="alert" className="surface" style={{ padding: 12, borderLeft: '3px solid var(--error)', marginBottom: 12 }} aria-live="assertive">
            {error.message}
          </div>
        )}

        <div className="surface" style={{ padding: 0 }}>
          <div style={{ padding: 16, borderBottom: 'var(--border)' }}>
            <h3 style={{ margin: 0 }}>Your tasks</h3>
          </div>
          <TaskList
            tasks={tasks}
            loading={loading}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onStatusChange={onStatusChange}
          />
        </div>
      </div>

      <TaskFormModal
        open={isFormOpen}
        mode={editTask ? 'edit' : 'create'}
        initialData={editTask || undefined}
        onCancel={handleCloseModal}
        onSubmit={handleSubmitModal}
      />
    </div>
  );
}

function readFiltersFromQuery(search) {
  const sp = new URLSearchParams(search || '');
  return {
    status: sp.get('status') || 'all',
    priority: sp.get('priority') || 'all',
    due: sp.get('due') || 'all',
    q: sp.get('q') || '',
    sort: sp.get('sort') || 'updated_at',
  };
}

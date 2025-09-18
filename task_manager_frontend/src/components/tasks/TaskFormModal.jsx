import React, { useEffect, useRef, useState } from 'react';

/**
 * TaskFormModal provides an accessible modal dialog for creating or editing a task.
 * Props:
 * - open: boolean
 * - mode: 'create' | 'edit'
 * - initialData: partial task for editing
 * - onCancel(): void
 * - onSubmit(payload): Promise<{error?}>
 */

// PUBLIC_INTERFACE
export default function TaskFormModal({ open, mode = 'create', initialData, onCancel, onSubmit }) {
  /** Modal dialog with focus trap, Escape to close, and form validation. */
  const dialogRef = useRef(null);
  const firstFieldRef = useRef(null);
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [priority, setPriority] = useState(initialData?.priority ?? 'medium');
  const [status, setStatus] = useState(initialData?.status ?? 'todo');
  const [due, setDue] = useState(
    initialData?.due_date ? toDateInputValue(new Date(initialData.due_date)) : ''
  );
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    if (open) {
      setTitle(initialData?.title ?? '');
      setDescription(initialData?.description ?? '');
      setPriority(initialData?.priority ?? 'medium');
      setStatus(initialData?.status ?? 'todo');
      setDue(initialData?.due_date ? toDateInputValue(new Date(initialData.due_date)) : '');
      setLocalError(null);
      setSubmitting(false);
      setTimeout(() => firstFieldRef.current?.focus(), 0);
    }
  }, [open, initialData]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (!open) return;
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCancel?.();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    const t = title.trim();
    if (!t || t.length > 120) {
      setLocalError('Title must be between 1 and 120 characters');
      return;
    }
    setSubmitting(true);
    const payload = {
      title: t,
      description: description || '',
      priority,
      status,
      due_date: due ? new Date(due).toISOString() : null,
    };
    const { error } = (await onSubmit?.(payload)) || {};
    setSubmitting(false);
    if (error) {
      setLocalError(error.message || 'Unable to save task');
      return;
    }
    onCancel?.();
  };

  const errorId = localError ? 'task-form-error' : undefined;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-form-title"
      aria-describedby={errorId}
      className="modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'color-mix(in oklab, black 40%, transparent)',
        display: 'grid',
        placeItems: 'center',
        padding: 16,
        zIndex: 50,
      }}
    >
      <div
        ref={dialogRef}
        className="surface"
        style={{ width: '100%', maxWidth: 560, padding: 20 }}
      >
        <h3 id="task-form-title" style={{ marginBottom: 12 }}>
          {mode === 'edit' ? 'Edit task' : 'New task'}
        </h3>
        <form onSubmit={handleSubmit} aria-busy={submitting}>
          <div className="form-field">
            <label htmlFor="task-title">Title</label>
            <input
              id="task-title"
              ref={firstFieldRef}
              className="input"
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={120}
            />
          </div>

          <div className="form-field">
            <label htmlFor="task-desc">Description</label>
            <textarea
              id="task-desc"
              className="input"
              placeholder="Describe the task (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={2000}
            />
          </div>

          <div className="form-row" role="group" aria-label="Task options">
            <div className="form-field">
              <label htmlFor="task-priority">Priority</label>
              <select
                id="task-priority"
                className="input"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="task-status">Status</label>
              <select
                id="task-status"
                className="input"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="task-due">Due date</label>
              <input
                id="task-due"
                className="input"
                type="date"
                value={due}
                onChange={(e) => setDue(e.target.value)}
              />
            </div>
          </div>

          {localError ? (
            <div role="alert" id="task-form-error" className="form-error" aria-live="assertive">
              {localError}
            </div>
          ) : null}

          <div className="form-actions">
            <button type="button" className="btn" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting} aria-busy={submitting}>
              {submitting ? 'Saving…' : mode === 'edit' ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function toDateInputValue(d) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

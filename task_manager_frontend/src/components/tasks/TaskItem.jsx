import React from 'react';
import clsx from 'clsx';
import { format } from 'date-fns';

/**
 * TaskItem displays a single task row with priority/status badges, due date,
 * and actions for edit/delete.
 */

// PUBLIC_INTERFACE
export default function TaskItem({ task, onEdit, onDelete, onStatusChange }) {
  /** Renders a single task line with actions and basic meta. */

  const overdue =
    task?.due_date ? new Date(task.due_date).getTime() < new Date().setHours(0, 0, 0, 0) : false;

  const priorityClass = (p) =>
    clsx('badge', {
      'badge-low': p === 'low',
      'badge-medium': p === 'medium',
      'badge-high': p === 'high',
    });

  const statusClass = (s) =>
    clsx('badge', {
      'badge-todo': s === 'todo',
      'badge-inprogress': s === 'in_progress',
      'badge-done': s === 'done',
    });

  return (
    <li
      className="task-item"
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) auto auto auto',
        gap: 12,
        alignItems: 'center',
        padding: 12,
        borderTop: 'var(--border)',
        borderLeft: overdue ? '3px solid var(--error)' : '3px solid transparent',
      }}
    >
      <div>
        <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
          {task.title}
          {task.priority ? (
            <span className={priorityClass(task.priority)} aria-label={`Priority ${task.priority}`}>
              {task.priority}
            </span>
          ) : null}
          <span className={statusClass(task.status)} aria-label={`Status ${task.status}`}>
            {task.status === 'in_progress' ? 'in progress' : task.status}
          </span>
        </div>
        <div className="text-muted" style={{ fontSize: 13 }}>
          {task.due_date ? `Due ${format(new Date(task.due_date), 'yyyy-MM-dd')}` : 'No due date'}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <label htmlFor={`status-${task.id}`} className="text-muted" style={{ fontSize: 12 }}>
          Status
        </label>
        <select
          id={`status-${task.id}`}
          aria-label={`Update status for ${task.title}`}
          className="input"
          value={task.status}
          onChange={(e) => onStatusChange?.(task.id, e.target.value)}
        >
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button
          className="btn"
          type="button"
          onClick={() => onEdit?.(task)}
          aria-label={`Edit ${task.title}`}
          title="Edit"
        >
          ✏️ Edit
        </button>
        <button
          className="btn"
          type="button"
          onClick={() => onDelete?.(task)}
          aria-label={`Delete ${task.title}`}
          title="Delete"
        >
          🗑️ Delete
        </button>
      </div>
    </li>
  );
}

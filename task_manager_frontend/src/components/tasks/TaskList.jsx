import React from 'react';
import TaskItem from './TaskItem';
import EmptyState from './EmptyState';

/**
 * TaskList renders a UL of task items and wires callbacks.
 */

// PUBLIC_INTERFACE
export default function TaskList({ tasks, loading, onEdit, onDelete, onStatusChange }) {
  /** Renders loading state, empty state, or list items. */
  if (loading) {
    return (
      <div style={{ padding: 16 }} className="text-muted" role="status" aria-live="polite">
        Loading tasks…
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return <EmptyState />;
  }

  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {tasks.map((t) => (
        <TaskItem
          key={t.id}
          task={t}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </ul>
  );
}

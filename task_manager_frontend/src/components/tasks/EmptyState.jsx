import React from 'react';

/**
 * EmptyState shows when there are no tasks and prompts user to create one.
 */

// PUBLIC_INTERFACE
export default function EmptyState({ onCreateClick }) {
  /** Simple empty state card with CTA */
  return (
    <div style={{ padding: 16 }} className="text-muted">
      <div style={{ marginBottom: 8, fontWeight: 600, color: 'var(--text)' }}>
        No tasks found
      </div>
      <div style={{ marginBottom: 12 }}>
        Get started by creating your first task. You can set priority, status and due date.
      </div>
      {onCreateClick ? (
        <button className="btn btn-primary" type="button" onClick={onCreateClick}>
          ➕ New Task
        </button>
      ) : null}
    </div>
  );
}

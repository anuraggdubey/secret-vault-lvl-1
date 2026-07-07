import React from 'react';

export function StatusBadge({ status }: { status: 'LOCKED' | 'REVEALED' }) {
  return (
    <div className={`status-badge status-badge--${status.toLowerCase()}`}>
      <span className="status-dot" />
      {status}
    </div>
  );
}

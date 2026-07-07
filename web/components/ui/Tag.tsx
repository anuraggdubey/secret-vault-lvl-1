import React from 'react';

export function Tag({ children, tone = 'ink' }: { children: React.ReactNode; tone?: 'ink' | 'electric' }) {
  return <span className={`tag tag--${tone}`}>{children}</span>;
}

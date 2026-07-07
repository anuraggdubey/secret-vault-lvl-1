import React from 'react';

export function Tag({ children, tone = 'ink', className = '' }: { children: React.ReactNode; tone?: 'ink' | 'electric', className?: string }) {
  return <span className={`tag tag--${tone} ${className}`}>{children}</span>;
}

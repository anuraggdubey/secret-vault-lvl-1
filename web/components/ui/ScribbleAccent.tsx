import React from 'react';

export function ScribbleAccent({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 300" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M 50 280 C 70 100, 100 30, 180 30 C 260 30, 280 180, 200 240 C 120 300, 50 220, 90 140 C 120 80, 200 110, 240 120"
        stroke="currentColor"
        strokeWidth="16"
        strokeLinecap="round"
      />
    </svg>
  );
}

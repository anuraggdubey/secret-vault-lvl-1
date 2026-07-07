import React from 'react';

/**
 * VaultLogo — A minimal vault-door icon.
 * Rounded square frame, circular lock mechanism with spokes, center dot.
 * Works at 20px (navbar) and 280px (hero decoration) alike.
 */
export function VaultLogo({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Vault door frame */}
      <rect x="8" y="8" width="84" height="84" rx="8" stroke="currentColor" strokeWidth="5" fill="none" />
      {/* Lock circle */}
      <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="4" fill="none" />
      {/* Spokes — top, bottom, left, right */}
      <line x1="50" y1="30" x2="50" y2="12" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <line x1="50" y1="70" x2="50" y2="88" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <line x1="30" y1="50" x2="12" y2="50" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <line x1="70" y1="50" x2="88" y2="50" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      {/* Center keyhole dot */}
      <circle cx="50" cy="50" r="4" fill="currentColor" />
    </svg>
  );
}

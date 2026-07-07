import React from 'react';

export function VaultCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="vault-card">
      {children}
    </div>
  );
}

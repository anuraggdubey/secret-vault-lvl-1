'use client';
import React, { useState } from 'react';
import { Button } from './ui/Button';

export function CommitForm({ onCommit }: { onCommit: (secret: string, nonce: string) => void }) {
  const [secret, setSecret] = useState('');
  const [nonce, setNonce] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secret || !nonce) return;
    setLoading(true);
    // Simulate commit delay
    await new Promise(r => setTimeout(r, 1000));
    onCommit(secret, nonce);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="field-group">
        <label className="field-label">Secret Value</label>
        <input 
          type="text"
          className="field-input"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          placeholder="e.g. 42"
          disabled={loading}
        />
      </div>
      
      <div className="field-group">
        <label className="field-label">Random Nonce</label>
        <input 
          type="text"
          className="field-input"
          value={nonce}
          onChange={(e) => setNonce(e.target.value)}
          placeholder="0x..."
          disabled={loading}
        />
      </div>

      <Button variant="primary" loading={loading} className="w-full">
        Commit Secret
      </Button>
    </form>
  );
}

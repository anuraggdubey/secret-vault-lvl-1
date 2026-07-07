'use client';
import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Tooltip } from './ui/Tooltip';

export function RevealForm({ onReveal, error }: { onReveal: (secret: string, nonce: string) => void, error?: string }) {
  const [secret, setSecret] = useState('');
  const [nonce, setNonce] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secret || !nonce) return;
    setLoading(true);
    await onReveal(secret, nonce);
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="field-group">
        <label className="field-label">Secret Value <Tooltip text="The original number you committed" /></label>
        <input 
          type="text"
          className={`field-input ${error ? 'field-input--error' : ''}`}
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          placeholder="Enter the number"
          disabled={loading}
        />
      </div>
      
      <div className="field-group">
        <label className="field-label">Nonce <Tooltip text="The random bytes used to salt the hash" /></label>
        <input 
          type="text"
          className={`field-input ${error ? 'field-input--error' : ''}`}
          value={nonce}
          onChange={(e) => setNonce(e.target.value)}
          placeholder="Enter the nonce"
          disabled={loading}
        />
        {error && <div className="field-error-text">{error}</div>}
      </div>

      <Button variant="primary" loading={loading} className="w-full mt-4">
        {loading ? 'Confirming...' : 'Reveal Secret'}
      </Button>
      
      {loading && (
        <p className="text-[12px] text-[var(--ink-soft)] mt-3 text-center">
          Generating zero-knowledge proof — this can take a few seconds…
        </p>
      )}
    </form>
  );
}

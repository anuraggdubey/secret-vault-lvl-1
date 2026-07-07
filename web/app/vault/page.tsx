'use client';
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { StatusBadge } from '@/components/StatusBadge';
import { VaultCard } from '@/components/VaultCard';
import { RevealForm } from '@/components/RevealForm';
import { Tag } from '@/components/ui/Tag';
import { Button } from '@/components/ui/Button';
import { useWallet } from '@/lib/wallet-context';
import { getVaultClient, revealSecret } from '@/lib/contract-client';

export default function VaultPage() {
  const wallet = useWallet();
  const [status, setStatus] = useState<'LOCKED' | 'REVEALED'>('LOCKED');
  const [revealedValue, setRevealedValue] = useState<string | null>(null);
  const [revealError, setRevealError] = useState<string | undefined>(undefined);
  const [showWarning, setShowWarning] = useState(false);

  const handleReveal = async (secret: string, nonce: string) => {
    setRevealError(undefined);

    try {
      if (!secret || !nonce) {
        throw new Error("Missing secret or nonce");
      }

      // Initialize the mock client
      const client = getVaultClient(wallet.walletApi, 'mock_contract_address');
      
      // Simulate encoding the string nonce to bytes
      const encoder = new TextEncoder();
      const nonceBytes = encoder.encode(nonce.padEnd(32, '0')).slice(0, 32);

      // Call the contract API (which is currently mocked)
      await revealSecret(client, BigInt(secret), nonceBytes);

      setStatus('REVEALED');
      setRevealedValue(secret);
    } catch (e: any) {
      console.error(e);
      setRevealError("These values don't match the on-chain commitment or are invalid. Nothing was revealed.");
    }
  };

  return (
    <main className="min-h-screen bg-[var(--paper)] flex flex-col pt-[56px] md:pt-[72px]">
      <Navbar />

      <div className="flex-1 w-full max-w-[1200px] mx-auto px-6 md:px-12 py-12 md:py-24 flex flex-col md:flex-row gap-12">
        {/* Left column — vault interface */}
        <div className="flex-1 flex flex-col items-center md:items-start relative z-10">
          <div className="mb-6 flex justify-between items-center w-full max-w-[560px]" aria-live="polite">
            <StatusBadge status={status} />
            {wallet.connected && wallet.balance && (
              <div className="text-[13px] font-mono text-[var(--ink-soft)]">
                {wallet.balance} tNIGHT
              </div>
            )}
          </div>

          <div className="w-full relative">
            <VaultCard>
              {/* Wallet gate overlay */}
              {!wallet.connected ? (
                <div className="absolute inset-0 bg-[var(--white)]/90 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center text-center p-8">
                  <p className="font-body text-[16px] text-[var(--ink-soft)] mb-6">
                    Connect your wallet to interact with the vault
                  </p>
                  <Button 
                    size="lg" 
                    onClick={wallet.connect} 
                    loading={wallet.connecting}
                  >
                    CONNECT WALLET
                  </Button>
                </div>
              ) : null}

              <div className={!wallet.connected ? 'opacity-50 pointer-events-none' : ''}>
                {status === 'LOCKED' ? (
                  <>
                    <h2 className="font-display text-[28px] uppercase tracking-[-0.01em] mb-8">
                      Reveal Secret
                    </h2>
                    <RevealForm 
                      onReveal={handleReveal} 
                      error={revealError}
                    />
                  </>
                ) : (
                  <div className="flex flex-col items-start">
                    <h2 className="font-display text-[28px] uppercase tracking-[-0.01em] mb-4 text-[var(--ink)]">
                      Vault Contents
                    </h2>
                    
                    <div className="bg-[var(--paper)] w-full p-8 flex items-center justify-center border border-[var(--border)] mb-6 rounded-[var(--radius-sm)]">
                      <span className="font-mono text-[32px] text-[var(--ink)]">
                        {revealedValue}
                      </span>
                    </div>

                    <div className="flex flex-col gap-4 w-full">
                      <div className="flex items-center gap-2">
                        <Tag tone="electric">VERIFIED ON-CHAIN</Tag>
                      </div>
                      
                      <a 
                        href="https://explorer.preview.midnight.network" 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        <Button variant="ghost" className="self-start text-[14px]">
                          View on Explorer ↗
                        </Button>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </VaultCard>
          </div>

          {/* Insufficient funds warning */}
          {wallet.connected && wallet.rawBalance !== null && wallet.rawBalance === 0n && (
            <div className="mt-6 p-4 border-l-4 border-[var(--error)] bg-[var(--paper)] max-w-[560px]">
              <p className="text-[13px] font-body text-[var(--ink-soft)]">
                <strong>Not enough tNIGHT</strong> to cover this transaction. Get testnet funds from the{' '}
                <a 
                  href="https://faucet.preview.midnight.network" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[var(--electric)] underline"
                >
                  Preview faucet
                </a>.
              </p>
            </div>
          )}

          {/* Warning after commit */}
          {showWarning && status === 'LOCKED' && (
            <div className="mt-6 p-4 border-l-4 border-[var(--error)] bg-[var(--paper-dim)] max-w-[560px]">
              <p className="text-[13px] font-body text-[var(--ink-soft)]">
                <strong>Warning:</strong> Save your secret number and nonce somewhere safe. If you lose them, this vault can never be revealed.
              </p>
            </div>
          )}
        </div>

        {/* Right column — explainer */}
        <div className="flex-1 md:max-w-[400px]">
          <div className="sticky top-[104px]">
            <h3 className="font-display text-[22px] uppercase tracking-[-0.01em] mb-6">
              How this works
            </h3>
            
            <div className="space-y-8">
              <div>
                <Tag tone="ink">PUBLIC STATE</Tag>
                <p className="mt-3 text-[14px] leading-[1.6] text-[var(--ink-soft)]">
                  The network only sees a one-way hash (the commitment) and a locked/revealed status flag. The real value is never stored on the ledger while locked.
                </p>
              </div>

              <div>
                <Tag tone="ink">PRIVATE WITNESS</Tag>
                <p className="mt-3 text-[14px] leading-[1.6] text-[var(--ink-soft)]">
                  Your secret value and random nonce are kept locally on your machine. When you reveal, a zero-knowledge proof verifies they match the on-chain hash without leaking the values.
                </p>
              </div>

              <div>
                <Tag tone="ink">ZERO KNOWLEDGE</Tag>
                <p className="mt-3 text-[14px] leading-[1.6] text-[var(--ink-soft)]">
                  The proof is generated entirely on your device. The chain verifies it without ever seeing your secret. If the proof doesn't match, the transaction is rejected — nothing leaks.
                </p>
              </div>
            </div>

            {wallet.connected && (
              <div className="mt-12 p-4 border border-[var(--border)] bg-[var(--white)]">
                <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--ink-soft)] mb-2">
                  Connected Wallet
                </div>
                <div className="font-mono text-[13px] text-[var(--ink)] break-all">
                  {String(wallet.address || '')}
                </div>
                {wallet.balance && (
                  <div className="font-mono text-[14px] text-[var(--electric)] mt-2 font-bold">
                    {wallet.balance} tNIGHT
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

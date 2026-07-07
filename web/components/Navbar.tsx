'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from './ui/Button';
import { VaultLogo } from './ui/VaultLogo';
import { useWallet, truncateAddress } from '@/lib/wallet-context';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const wallet = useWallet();

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 h-[56px] md:h-[72px] bg-[var(--paper)] border-b border-[var(--border)] z-50 flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <VaultLogo className="w-6 h-6 text-[var(--ink)]" />
            <span className="font-display text-[18px] tracking-[-0.02em] uppercase text-[var(--ink)] mt-1">
              SECRET VAULT
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-8 text-[14px] font-[600] uppercase tracking-[0.02em] text-[var(--ink)]">
            <Link href="#" className="hover:text-[var(--electric)] transition-colors">DOCS</Link>
            <Link href="/vault" className="hover:text-[var(--electric)] transition-colors">VAULT</Link>
            <Link href="#" className="hover:text-[var(--electric)] transition-colors">ABOUT</Link>
          </div>
          
          {wallet.connected ? (
            <button 
              onClick={wallet.disconnect}
              className="flex items-center gap-3 px-4 py-2 border border-[var(--ink)] bg-[var(--white)] font-mono text-[13px] hover:bg-[var(--paper-dim)] transition-colors cursor-pointer"
            >
              <div className="w-2 h-2 rounded-full bg-[var(--success)]" />
              <div className="flex flex-col items-start">
                <span className="text-[var(--ink)]">{truncateAddress(wallet.address || '')}</span>
                {wallet.balance && (
                  <span className="text-[10px] text-[var(--ink-soft)]">{wallet.balance} tNIGHT</span>
                )}
              </div>
            </button>
          ) : (
            <Button 
              size="sm" 
              onClick={wallet.connect} 
              loading={wallet.connecting}
            >
              CONNECT ⌐
            </Button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button 
          className="md:hidden flex flex-col gap-[6px] w-8 h-8 justify-center items-end"
          onClick={() => setMobileMenuOpen(true)}
        >
          <div className="w-6 h-[1.5px] bg-[var(--ink)]" />
          <div className="w-6 h-[1.5px] bg-[var(--ink)]" />
        </button>
      </nav>

      {/* Wallet Error Banner */}
      {wallet.error && (
        <div className="fixed top-[56px] md:top-[72px] left-0 right-0 z-[49] bg-[var(--electric)] text-[var(--white)] text-[13px] font-bold uppercase tracking-[0.04em] px-6 py-3 text-center">
          {wallet.error}
          <button 
            onClick={() => {}} 
            className="ml-4 underline text-[var(--white)] opacity-80 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-[var(--paper)] z-[60] flex flex-col pt-6 px-6">
          <div className="flex justify-end mb-12">
            <button 
              className="w-8 h-8 flex items-center justify-center relative"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="absolute w-6 h-[1.5px] bg-[var(--ink)] rotate-45" />
              <div className="absolute w-6 h-[1.5px] bg-[var(--ink)] -rotate-45" />
            </button>
          </div>
          
          <div className="flex flex-col gap-6 text-[32px] font-display uppercase tracking-[-0.01em] text-[var(--ink)]">
            <Link href="#" onClick={() => setMobileMenuOpen(false)}>DOCS</Link>
            <Link href="/vault" onClick={() => setMobileMenuOpen(false)}>VAULT</Link>
            <Link href="#" onClick={() => setMobileMenuOpen(false)}>ABOUT</Link>
          </div>

          {wallet.connected && (
            <div className="mt-8 p-4 border border-[var(--ink)] bg-[var(--white)]">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-[var(--success)]" />
                <span className="font-mono text-[14px]">{truncateAddress(wallet.address || '')}</span>
              </div>
              {wallet.balance && (
                <span className="text-[12px] text-[var(--ink-soft)]">{wallet.balance} tNIGHT</span>
              )}
            </div>
          )}
          
          <div className="mt-auto pb-12">
            {wallet.connected ? (
              <Button size="lg" className="w-full" onClick={() => { wallet.disconnect(); setMobileMenuOpen(false); }}>
                DISCONNECT
              </Button>
            ) : (
              <Button size="lg" className="w-full" loading={wallet.connecting} onClick={() => { wallet.connect(); }}>
                CONNECT WALLET
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
}

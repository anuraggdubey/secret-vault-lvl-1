'use client';
import React from 'react';
import Navbar from '@/components/Navbar';
import SplitBackground from '@/components/ui/SplitBackground';
import { ScribbleAccent } from '@/components/ui/ScribbleAccent';
import { Tag } from '@/components/ui/Tag';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--paper)] flex flex-col pt-[56px] md:pt-[72px] overflow-hidden">
      <Navbar />
      <SplitBackground>
        <div className="flex-1 w-full max-w-[1200px] mx-auto px-6 md:px-12 py-12 md:py-24 relative z-10 flex flex-col md:flex-row">
          
          {/* Left Column (Content) */}
          <div className="flex-1 md:pr-16 flex flex-col justify-center">
            <Tag tone="ink" className="mb-8 self-start">OUR VISION</Tag>
            
            <h1 className="font-display text-[48px] md:text-[64px] uppercase tracking-[-0.02em] leading-[0.95] text-[var(--ink)] mb-8">
              Privacy as a <br className="hidden md:block"/> Fundamental Right.
            </h1>
            
            <div className="prose prose-lg">
              <p className="font-body text-[16px] md:text-[18px] text-[var(--ink-soft)] leading-[1.6] max-w-[48ch] mb-6">
                Secret Vault is a minimal demonstration of Midnight's commit-reveal privacy model: a user locks a secret value on-chain as a cryptographic commitment, and can later prove they knew that value — revealing it only when they choose to — without ever exposing it prematurely or to anyone who can't independently verify the match.
              </p>
              <p className="font-body text-[16px] md:text-[18px] text-[var(--ink-soft)] leading-[1.6] max-w-[48ch]">
                It's a deliberately small first step toward a broader idea: bringing on-chain, privacy-preserving proof-of-knowledge patterns (the same verification-first thinking behind our Stellar project, Execra) to a chain built for privacy by default.
              </p>
            </div>
          </div>

          {/* Right Column (Visual) */}
          <div className="flex-1 mt-16 md:mt-0 relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
              <h2 className="font-display text-[100px] md:text-[160px] tracking-[-0.04em] text-[var(--electric)] opacity-[0.08] uppercase rotate-[-90deg] md:rotate-0 whitespace-nowrap">
                CONFIDENTIAL
              </h2>
            </div>
            
            <div className="relative z-10 w-full max-w-[400px]">
              <div className="bg-[var(--white)] border border-[var(--border)] p-8 shadow-sm">
                <h3 className="font-display text-[24px] uppercase tracking-[-0.01em] mb-4">Zero Knowledge</h3>
                <p className="font-body text-[14px] text-[var(--ink-soft)] leading-[1.6] mb-6">
                  Your secrets never leave your device. The proof is generated entirely locally, meaning the network verifies your claim without ever seeing the underlying data.
                </p>
                <div className="h-[1px] w-full bg-[var(--border)] mb-6" />
                <div className="flex justify-between items-center text-[12px] font-mono text-[var(--ink-soft)] uppercase tracking-[0.05em]">
                  <span>Status</span>
                  <span className="text-[var(--electric)] font-bold">SECURE</span>
                </div>
              </div>
              
              <div className="absolute -top-12 -right-12 w-[160px] h-[160px] z-20 opacity-80 mix-blend-multiply">
                <ScribbleAccent />
              </div>
            </div>
          </div>

        </div>
      </SplitBackground>
    </main>
  );
}

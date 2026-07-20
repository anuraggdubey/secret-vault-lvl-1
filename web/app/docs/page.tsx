'use client';
import React from 'react';
import Navbar from '@/components/Navbar';
import { Tag } from '@/components/ui/Tag';

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-[var(--paper)] flex flex-col pt-[56px] md:pt-[72px]">
      <Navbar />

      <div className="flex-1 w-full max-w-[800px] mx-auto px-6 md:px-12 py-12 md:py-24">
        
        <header className="mb-16">
          <Tag tone="electric" className="mb-6">DOCUMENTATION</Tag>
          <h1 className="font-display text-[40px] md:text-[56px] uppercase tracking-[-0.02em] text-[var(--ink)] leading-[1.1]">
            Architecture & Mechanics
          </h1>
          <p className="mt-6 font-body text-[18px] text-[var(--ink-soft)] leading-[1.6]">
            Understand how Secret Vault leverages the Midnight Network's zero-knowledge proofs to separate public ledger state from private witness data.
          </p>
        </header>

        <article className="prose prose-lg max-w-none">
          
          <section className="mb-12">
            <h2 className="font-display text-[24px] uppercase tracking-[-0.01em] text-[var(--ink)] mb-4 border-b border-[var(--border)] pb-4">
              1. Core Concept
            </h2>
            <p className="font-body text-[16px] text-[var(--ink-soft)] leading-[1.7] mb-4">
              Secret Vault is the simplest possible demonstration of Midnight's core privacy primitive: <strong>commit now, reveal later, prove without exposing.</strong>
            </p>
            <ul className="list-disc pl-5 font-body text-[16px] text-[var(--ink-soft)] leading-[1.7] space-y-2">
              <li>You pick a secret number + a random nonce.</li>
              <li>You hash them together and post <strong>only the hash</strong> on-chain (the commitment).</li>
              <li>Later, you call <code>reveal()</code> with the original number + nonce.</li>
              <li>The contract recomputes the hash locally (inside a ZK circuit), checks it matches what's stored, and — only if it matches — flips the vault to REVEALED.</li>
              <li>If someone tries to reveal a wrong number, the transaction is rejected. Nothing leaks either way.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-[24px] uppercase tracking-[-0.01em] text-[var(--ink)] mb-4 border-b border-[var(--border)] pb-4">
              2. Public vs Private State
            </h2>
            <p className="font-body text-[16px] text-[var(--ink-soft)] leading-[1.7] mb-4">
              This contract keeps two things public: the <code>commitment</code> (a hash) and <code>status</code> (locked/revealed). Everything that could identify the actual secret lives only as a <strong>witness</strong>: a function implemented in the DApp's TypeScript code that runs entirely on your own machine.
            </p>
            <p className="font-body text-[16px] text-[var(--ink-soft)] leading-[1.7]">
              The chain only ever receives a zero-knowledge proof that "the witness values hash to the stored commitment" — never the values themselves, until you explicitly call <code>disclose()</code> on reveal.
            </p>
          </section>
          <section className="mb-12">
            <h2 className="font-display text-[24px] uppercase tracking-[-0.01em] text-[var(--ink)] mb-4 border-b border-[var(--border)] pb-4">
              3. Toolchain & Setup
            </h2>
            <div className="bg-[var(--white)] border border-[var(--border)] p-6 font-mono text-[13px] text-[var(--ink)] leading-[1.6]">
              # 1. Compile the contract<br/>
              docker run --rm -v "${'{PWD}'}/../contracts:/contracts" -v "${'{PWD}'}/managed:/managed" ghcr.io/midnight-ntwrk/compactc:latest compile /contracts/secret_vault.compact -o /managed/secret_vault<br/>
              <br/>
              # 2. Install SDK dependencies<br/>
              npm install @midnight-ntwrk/midnight-js<br/>
              <br/>
              # 3. Start development server<br/>
              npm run dev
            </div>
            <p className="font-body text-[14px] text-[var(--ink-soft)] leading-[1.7] mt-4">
              * Note: The Midnight GHCR registry requires authentication. If you are unauthorized, the DApp uses a built-in simulation layer to mock the SDK's zero-knowledge proof generation delays and transaction hashes so you can still test the UI.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}

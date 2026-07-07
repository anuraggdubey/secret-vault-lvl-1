import SplitBackground from '@/components/ui/SplitBackground';
import { Tag } from '@/components/ui/Tag';
import { Button } from '@/components/ui/Button';
import { VaultLogo } from '@/components/ui/VaultLogo';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden flex flex-col">
      <Navbar />
      
      <SplitBackground>
        <div className="flex-1 flex items-center justify-center pt-[72px] md:pt-0">
          <div className="max-w-[1200px] w-full px-6 md:px-12 flex flex-col md:flex-row relative z-10">
            {/* Left side text content */}
            <div className="flex-1 md:pr-12 pt-8 md:pt-16 pb-12 md:pb-16 flex flex-col justify-center">
              <div className="mb-6">
                <Tag>SECRET VAULT &middot; L1</Tag>
              </div>
              
              <h1 className="font-display text-[36px] md:text-[44px] lg:text-[52px] leading-[0.95] tracking-[-0.02em] uppercase mb-6 text-[var(--ink)]">
                COMMIT A SECRET.<br />
                PROVE IT LATER.<br />
                REVEAL NOTHING<br />
                UNTIL YOU CHOOSE.
              </h1>
              
              <p className="font-body text-[16px] md:text-[18px] leading-[1.6] max-w-[40ch] mb-10 text-[var(--ink)]">
                A zero-knowledge commit/reveal demo built on Midnight.
              </p>
              
              <Link href="/vault">
                <Button variant="primary" size="lg">
                  OPEN THE VAULT
                </Button>
              </Link>
            </div>
            
            {/* Right side large decorative text */}
            <div className="hidden md:flex flex-1 items-center justify-center relative pointer-events-none">
              <div className="absolute right-0 lg:right-[-50px] text-[var(--electric)] opacity-90 font-display text-[80px] lg:text-[100px] leading-[0.85] uppercase tracking-tighter text-right">
                LOCKED<br />REVEAL
              </div>
              <VaultLogo className="absolute top-1/2 left-[15%] w-[200px] lg:w-[240px] -translate-y-1/2 opacity-20 text-[var(--ink)]" />
            </div>
            
            {/* Mobile version of decorative text */}
            <div className="md:hidden absolute top-32 right-[-20px] text-[var(--electric)] opacity-15 font-display text-[56px] leading-[0.9] uppercase pointer-events-none z-[-1]">
              LOCKED<br />REVEAL
            </div>
          </div>
        </div>
      </SplitBackground>
    </main>
  );
}

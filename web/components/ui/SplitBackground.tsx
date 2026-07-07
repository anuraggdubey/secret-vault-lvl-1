import React from 'react';

export default function SplitBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen flex w-full">
      {/* Decorative blobs behind everything */}
      <div className="haze-blob haze-blob--pink bottom-0 left-[-100px]" />
      <div className="haze-blob haze-blob--lilac top-[20%] right-[10%]" />
      
      {/* Background split (visual only) */}
      <div className="absolute inset-0 flex pointer-events-none z-[-1]">
        <div className="w-full md:w-[55%] bg-[var(--paper)] h-full"></div>
        <div className="hidden md:block w-[45%] bg-[var(--paper-dim)] h-full"></div>
      </div>
      
      {/* Content area */}
      <div className="relative z-1 w-full flex flex-col">
        {children}
      </div>
    </div>
  );
}

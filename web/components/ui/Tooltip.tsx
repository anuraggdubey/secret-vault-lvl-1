'use client';
import React, { useState } from 'react';

export function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);

  return (
    <div 
      className="relative inline-flex items-center"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onClick={() => setShow(!show)}
    >
      <span className="w-4 h-4 rounded-full border border-[var(--ink-soft)] text-[10px] flex items-center justify-center text-[var(--ink-soft)] cursor-help">
        ?
      </span>
      {show && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[120%] w-48 bg-[var(--ink)] text-[var(--white)] text-[11px] p-2 rounded-[var(--radius-sm)] z-50 normal-case font-body leading-tight text-center">
          {text}
          <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-[var(--ink)]"></div>
        </div>
      )}
    </div>
  );
}

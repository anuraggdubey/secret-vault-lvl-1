'use client';
import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
};

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  loading, 
  disabled, 
  onClick,
  className = ''
}: ButtonProps) {
  return (
    <button
      className={`btn btn--${variant} btn--${size} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-[var(--electric)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1.5 h-1.5 bg-[var(--electric)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1.5 h-1.5 bg-[var(--electric)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </span>
      ) : children}
    </button>
  );
}

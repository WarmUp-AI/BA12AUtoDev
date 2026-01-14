import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="mb-4">
      {label && <label className="block mb-2">{label}</label>}
      <input
        className={clsx(
          'w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-card-bg)] text-[var(--color-gold)] focus:border-[var(--color-gold-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:ring-opacity-20',
          error && 'border-[var(--color-danger)]',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-[var(--color-danger)]">{error}</p>}
    </div>
  );
}

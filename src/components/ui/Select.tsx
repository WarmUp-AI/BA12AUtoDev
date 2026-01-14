import React from 'react';
import { clsx } from 'clsx';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className, ...props }: SelectProps) {
  return (
    <div className="mb-4">
      {label && <label className="block mb-2">{label}</label>}
      <select
        className={clsx(
          'w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-card-bg)] text-[var(--color-gold)] focus:border-[var(--color-gold-hover)] focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)] focus:ring-opacity-20',
          error && 'border-[var(--color-danger)]',
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-[var(--color-danger)]">{error}</p>}
    </div>
  );
}

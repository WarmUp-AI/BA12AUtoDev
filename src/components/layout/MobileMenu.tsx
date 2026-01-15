'use client';

import Link from 'next/link';
import { useEffect } from 'react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
}

export function MobileMenu({ isOpen, onClose, links }: MobileMenuProps) {
  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-80 z-[90] md:hidden"
        onClick={onClose}
      />

      {/* Menu */}
      <div className="fixed top-20 left-0 right-0 bg-[var(--color-card-bg)] border-b border-[var(--color-border)] z-[95] md:hidden">
        <div className="flex flex-col py-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="px-6 py-4 text-lg text-[var(--color-gold)] hover:bg-[var(--color-bg)] hover:text-[var(--color-gold-hover)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

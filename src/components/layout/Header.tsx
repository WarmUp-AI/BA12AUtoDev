'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { MobileMenu } from './MobileMenu';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/showroom', label: 'Showroom' },
    { href: '/sold', label: 'Sold' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-[var(--color-bg)] border-b border-[var(--color-border)]">
      <nav className="container mx-auto px-4">
        <div className="relative flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="relative z-30">
            <Image
              src="/images/LogoPNG.png"
              alt="BA12 Automotive"
              width={150}
              height={50}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation - only render on desktop */}
          <div className="hidden md:flex items-center gap-8 relative z-30">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-[var(--color-gold)] hover:text-[var(--color-gold-hover)] transition-colors duration-300 group whitespace-nowrap"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--color-gold-hover)] transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button - only render on mobile */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="md:hidden relative z-30 text-[var(--color-gold)] text-2xl focus:outline-none p-3 -mr-3 touch-manipulation active:scale-95"
            aria-label="Toggle menu"
            type="button"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        links={navLinks}
      />
    </header>
  );
}

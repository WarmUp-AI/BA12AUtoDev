'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import Image from 'next/image';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated' && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [status, router, pathname]);

  // Don't show layout on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const navLinks = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/add-car', label: 'Add Car', icon: '➕' },
    { href: '/admin/edit-car', label: 'Edit Cars', icon: '✏️' },
    { href: '/admin/analytics', label: 'Analytics', icon: '📈' },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)] overflow-x-hidden" data-admin-layout>
      {/* Admin Header */}
      <header className="bg-[var(--color-card-bg)] border-b border-[var(--color-border)] sticky top-0 z-50">
        <div className="max-w-full px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/admin" className="flex items-center gap-2">
              <Image
                src="/images/LogoPNG.png"
                alt="BA12 Automotive"
                width={120}
                height={40}
                className="h-8 md:h-10 w-auto"
              />
              <span className="text-[var(--color-gold)] text-xs md:text-sm opacity-80 hidden sm:inline">Admin</span>
            </Link>

            <div className="flex items-center gap-3 md:gap-6">
              <Link
                href="/"
                className="text-[var(--color-gold)] hover:text-[var(--color-gold-hover)] text-xs md:text-sm whitespace-nowrap"
              >
                View Site
              </Link>
              <span className="text-[var(--color-gold)] opacity-60 text-xs md:text-sm hidden md:inline truncate max-w-[150px]">
                {session.user.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: '/admin/login' })}
                className="text-[var(--color-danger)] hover:opacity-80 text-xs md:text-sm whitespace-nowrap"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <div className="flex max-w-full">
        {/* Sidebar - Desktop Only */}
        <aside className="w-64 bg-[var(--color-card-bg)] border-r border-[var(--color-border)] min-h-[calc(100vh-4rem)] hidden md:block flex-shrink-0">
          <nav className="p-4 space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-[var(--color-gold)] text-[var(--color-bg)]'
                      : 'text-[var(--color-gold)] hover:bg-[var(--color-bg)]'
                  }`}
                >
                  <span className="mr-3">{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}

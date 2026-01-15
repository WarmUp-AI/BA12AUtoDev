'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid email or password');
      } else if (result?.ok) {
        router.push('/admin');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Image
            src="/images/LogoPNG.png"
            alt="BA12 Automotive"
            width={200}
            height={60}
            className="mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-[var(--color-gold)]">Admin Login</h1>
        </div>

        {/* Login Form */}
        <div className="card">
          {error && (
            <div className="mb-4 p-3 bg-[var(--color-danger)] border border-[var(--color-danger)] rounded-lg">
              <p className="text-white text-center font-semibold">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              label="Email"
              type="email"
              placeholder="admin@ba12automotive.co.uk"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </div>

        {/* Back to site */}
        <div className="text-center mt-6">
          <a href="/" className="text-[var(--color-gold)] hover:text-[var(--color-gold-hover)] opacity-80">
            ← Back to Website
          </a>
        </div>
      </div>
    </div>
  );
}

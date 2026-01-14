'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Car } from '@/types/car';

export default function ContactPage() {
  const searchParams = useSearchParams();
  const carIdFromUrl = searchParams.get('car');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    carId: carIdFromUrl || '',
    message: '',
  });

  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const res = await fetch('/api/cars');
      if (!res.ok) throw new Error('Failed to fetch cars');

      const data = await res.json();
      // Only show available cars (not sold) in dropdown
      const availableCars = (data.cars || []).filter((car: Car) => car.price.toUpperCase() !== 'SOLD');
      setCars(availableCars);
    } catch (err) {
      console.error('Error fetching cars:', err);
      setCars([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      // Find car title if car selected
      const selectedCar = cars.find(c => c.id === formData.carId);
      const carTitle = selectedCar?.title;

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          carTitle,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to send message');
      }

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        carId: '',
        message: '',
      });
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const carOptions = [
    { value: '', label: 'General Enquiry' },
    ...cars.map(car => ({ value: car.id, label: car.title }))
  ];

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center text-[var(--color-gold)]">
            Contact Us
          </h1>
          <p className="text-center text-[var(--color-gold)] opacity-80 mb-8 text-lg">
            Have a question or interested in one of our vehicles? Get in touch!
          </p>

          {success && (
            <div className="card bg-[var(--color-gold)] bg-opacity-10 border-[var(--color-gold)] mb-6">
              <p className="text-[var(--color-gold)] text-center font-semibold">
                Thank you! Your message has been sent successfully. We'll be in touch soon.
              </p>
            </div>
          )}

          {error && (
            <div className="card bg-[var(--color-danger)] bg-opacity-10 border-[var(--color-danger)] mb-6">
              <p className="text-[var(--color-danger)] text-center font-semibold">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="card">
            <Input
              label="Name *"
              type="text"
              placeholder="Your full name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <Input
              label="Email *"
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <Input
              label="Phone"
              type="tel"
              placeholder="Your phone number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            <Select
              label="Interested in a specific car?"
              options={carOptions}
              value={formData.carId}
              onChange={(e) => setFormData({ ...formData, carId: e.target.value })}
            />

            <Textarea
              label="Message *"
              placeholder="Tell us how we can help..."
              rows={6}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Message'}
            </Button>
          </form>

          {/* Contact Info */}
          <div className="card mt-8">
            <h2 className="text-2xl font-bold mb-4 text-center text-[var(--color-gold)]">
              Other Ways to Reach Us
            </h2>
            <div className="text-center">
              <p className="text-[var(--color-gold)] opacity-80 mb-2">
                <strong>Email:</strong> sales@ba12automotive.co.uk
              </p>
              <p className="text-[var(--color-gold)] opacity-80">
                We typically respond within 24 hours
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

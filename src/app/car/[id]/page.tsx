'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CarGallery } from '@/components/car/CarGallery';
import { VideoEmbed } from '@/components/VideoEmbed';
import { Button } from '@/components/ui/Button';
import { Car } from '@/types/car';
import { formatPrice } from '@/lib/db';

export default function CarDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCar();
    trackView();
  }, [id]);

  const fetchCar = async () => {
    try {
      const res = await fetch(`/api/cars/${id}`);
      if (!res.ok) {
        throw new Error('Car not found');
      }
      const data = await res.json();
      setCar(data.car);
    } catch (err) {
      setError('Car not found');
    } finally {
      setLoading(false);
    }
  };

  const trackView = async () => {
    try {
      await fetch('/api/analytics/views', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carId: id }),
      });
    } catch (err) {
      console.error('Failed to track view:', err);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-12 min-h-screen flex items-center justify-center">
          <div className="spinner"></div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !car) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4 text-[var(--color-gold)]">Car Not Found</h1>
          <p className="text-[var(--color-gold)] opacity-80 mb-8">
            The vehicle you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/showroom">
            <Button>Browse All Vehicles</Button>
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const isSold = car.price.toUpperCase() === 'SOLD';

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-12">
        {/* Back Button */}
        <Link href="/showroom" className="inline-block mb-6 text-[var(--color-gold)] hover:text-[var(--color-gold-hover)]">
          ← Back to Showroom
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gallery Section */}
          <div>
            <CarGallery images={car.images} title={car.title} />

            {/* Video */}
            {car.video_url && (
              <div className="mt-6">
                <h3 className="text-xl font-bold mb-4 text-[var(--color-gold)]">Video</h3>
                <VideoEmbed url={car.video_url} title={car.title} />
              </div>
            )}
          </div>

          {/* Details Section */}
          <div>
            {/* Title & Price */}
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--color-gold)]">
              {car.title}
            </h1>

            <div className="mb-6">
              <div className={`text-3xl md:text-4xl font-bold ${isSold ? 'text-[var(--color-danger)]' : 'text-[var(--color-gold)]'}`}>
                {formatPrice(car.price)}
              </div>
            </div>

            {/* Specifications */}
            <div className="card mb-6">
              <h2 className="text-2xl font-bold mb-4 text-[var(--color-gold)]">Specifications</h2>
              <div className="grid grid-cols-2 gap-4">
                {car.year && (
                  <div>
                    <div className="text-[var(--color-gold)] opacity-60 text-sm mb-1">Year</div>
                    <div className="text-[var(--color-gold)] font-semibold">{car.year}</div>
                  </div>
                )}
                {car.mileage && (
                  <div>
                    <div className="text-[var(--color-gold)] opacity-60 text-sm mb-1">Mileage</div>
                    <div className="text-[var(--color-gold)] font-semibold">{car.mileage.toLocaleString()} miles</div>
                  </div>
                )}
                {car.fuel_type && (
                  <div>
                    <div className="text-[var(--color-gold)] opacity-60 text-sm mb-1">Fuel Type</div>
                    <div className="text-[var(--color-gold)] font-semibold">{car.fuel_type}</div>
                  </div>
                )}
                {car.transmission && (
                  <div>
                    <div className="text-[var(--color-gold)] opacity-60 text-sm mb-1">Transmission</div>
                    <div className="text-[var(--color-gold)] font-semibold">{car.transmission}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="card mb-6">
              <h2 className="text-2xl font-bold mb-4 text-[var(--color-gold)]">Description</h2>
              <div className="text-[var(--color-gold)] opacity-90 whitespace-pre-line leading-relaxed">
                {car.description}
              </div>
            </div>

            {/* Contact Buttons */}
            {!isSold && (
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={`/contact?car=${car.id}`} className="flex-1">
                  <Button variant="primary" className="w-full">
                    Enquire About This Car
                  </Button>
                </Link>
                <Link href="/contact" className="flex-1">
                  <Button className="w-full">
                    Call Us
                  </Button>
                </Link>
              </div>
            )}

            {isSold && (
              <div className="card bg-[var(--color-danger)] bg-opacity-10 border-[var(--color-danger)]">
                <p className="text-[var(--color-danger)] font-bold text-center">
                  This vehicle has been sold
                </p>
                <p className="text-[var(--color-gold)] opacity-80 text-center mt-2">
                  <Link href="/showroom" className="hover:text-[var(--color-gold-hover)] underline">
                    View our current stock
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

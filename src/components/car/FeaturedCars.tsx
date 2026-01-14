'use client';

import { Car } from '@/types/car';
import { CarCard } from './CarCard';
import { useEffect, useState } from 'react';

export function FeaturedCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/cars/featured')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        setCars(data.cars || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching featured cars:', err);
        setError(true);
        setLoading(false);
        setCars([]);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-[var(--color-gold)] opacity-60">
          Unable to load cars. Please ensure your database is connected.
        </p>
      </div>
    );
  }

  if (!cars || cars.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-[var(--color-gold)] opacity-60">No cars available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars.map(car => (
        <CarCard key={car.id} car={car} />
      ))}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CarFilters, FilterState } from '@/components/car/CarFilters';
import { CarGrid } from '@/components/car/CarGrid';
import { Car } from '@/types/car';

export default function ShowroomPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [makes, setMakes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async (filters?: FilterState) => {
    setLoading(true);
    try {
      let url = '/api/cars';

      if (filters) {
        const params = new URLSearchParams();
        if (filters.make) params.append('make', filters.make);
        if (filters.priceMin) params.append('priceMin', filters.priceMin);
        if (filters.priceMax) params.append('priceMax', filters.priceMax);
        if (filters.yearMin) params.append('yearMin', filters.yearMin);
        if (filters.yearMax) params.append('yearMax', filters.yearMax);
        if (filters.mileageMax) params.append('mileageMax', filters.mileageMax);
        if (filters.fuelType) params.append('fuel_type', filters.fuelType);
        if (filters.transmission) params.append('transmission', filters.transmission);
        if (filters.search) params.append('search', filters.search);
        if (filters.sortBy) params.append('sortBy', filters.sortBy);

        const queryString = params.toString();
        if (queryString) url += `?${queryString}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch cars');

      const data = await res.json();

      // Filter out SOLD cars for showroom
      const availableCars = (data.cars || []).filter((car: Car) =>
        car.price.toUpperCase() !== 'SOLD'
      );

      setCars(availableCars);
      setFilteredCars(availableCars);

      // Extract unique makes
      const uniqueMakes = Array.from(new Set(availableCars.map((car: Car) => car.make)))
        .sort();
      setMakes(uniqueMakes as string[]);
    } catch (error) {
      console.error('Error fetching cars:', error);
      setCars([]);
      setFilteredCars([]);
      setMakes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters: FilterState) => {
    fetchCars(filters);
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center text-[var(--color-gold)]">
          Our Showroom
        </h1>

        <CarFilters makes={makes} onFilterChange={handleFilterChange} />

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center">
              <p className="text-[var(--color-gold)] opacity-80">
                Showing {filteredCars.length} {filteredCars.length === 1 ? 'vehicle' : 'vehicles'}
              </p>
            </div>
            <CarGrid cars={filteredCars} />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

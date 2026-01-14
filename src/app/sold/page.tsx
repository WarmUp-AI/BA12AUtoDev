'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CarGrid } from '@/components/car/CarGrid';
import { Car } from '@/types/car';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';

export default function SoldPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [makes, setMakes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMake, setSelectedMake] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');

  useEffect(() => {
    fetchSoldCars();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [cars, selectedMake, searchTerm, sortBy]);

  const fetchSoldCars = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cars');
      if (!res.ok) throw new Error('Failed to fetch cars');

      const data = await res.json();

      // Filter only SOLD cars
      const soldCars = (data.cars || []).filter((car: Car) =>
        car.price.toUpperCase() === 'SOLD'
      );

      setCars(soldCars);
      setFilteredCars(soldCars);

      // Extract unique makes
      const uniqueMakes = Array.from(new Set(soldCars.map((car: Car) => car.make)))
        .sort();
      setMakes(uniqueMakes as string[]);
    } catch (error) {
      console.error('Error fetching sold cars:', error);
      setCars([]);
      setFilteredCars([]);
      setMakes([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...cars];

    // Filter by make
    if (selectedMake) {
      filtered = filtered.filter(car => car.make === selectedMake);
    }

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(car =>
        car.make.toLowerCase().includes(search) ||
        car.model.toLowerCase().includes(search) ||
        car.title.toLowerCase().includes(search)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date_asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'date_desc':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    setFilteredCars(filtered);
  };

  const makeOptions = [
    { value: '', label: 'All Makes' },
    ...makes.map(make => ({ value: make, label: make }))
  ];

  const sortOptions = [
    { value: 'date_desc', label: 'Recently Sold' },
    { value: 'date_asc', label: 'Oldest First' },
  ];

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-[var(--color-gold)]">
          Sold Cars Archive
        </h1>
        <p className="text-center text-[var(--color-gold)] opacity-80 mb-8 text-lg">
          Browse our previously sold vehicles
        </p>

        {/* Filters */}
        <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="text"
              placeholder="Search by make or model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <Select
              options={makeOptions}
              value={selectedMake}
              onChange={(e) => setSelectedMake(e.target.value)}
            />

            <Select
              options={sortOptions}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center">
              <p className="text-[var(--color-gold)] opacity-80">
                {filteredCars.length} sold {filteredCars.length === 1 ? 'vehicle' : 'vehicles'}
              </p>
            </div>
            <CarGrid
              cars={filteredCars}
              emptyMessage="No sold cars found matching your search."
            />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

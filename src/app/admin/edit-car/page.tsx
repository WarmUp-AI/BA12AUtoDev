'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Car } from '@/types/car';

export default function EditCarListPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      const res = await fetch('/api/cars');
      const data = await res.json();
      setCars(data.cars);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCars = cars.filter(car =>
    car.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-[var(--color-gold)]">Edit Cars</h1>

      {/* Search */}
      <div className="card mb-6">
        <input
          type="text"
          placeholder="Search by make, model, or title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-[var(--color-gold)]"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th className="text-left py-3 px-4 text-[var(--color-gold)] opacity-80">Title</th>
                  <th className="text-left py-3 px-4 text-[var(--color-gold)] opacity-80">Price</th>
                  <th className="text-left py-3 px-4 text-[var(--color-gold)] opacity-80">Year</th>
                  <th className="text-left py-3 px-4 text-[var(--color-gold)] opacity-80">Status</th>
                  <th className="text-left py-3 px-4 text-[var(--color-gold)] opacity-80">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCars.map((car) => (
                  <tr key={car.id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-bg)]">
                    <td className="py-3 px-4 text-[var(--color-gold)]">{car.title}</td>
                    <td className="py-3 px-4 text-[var(--color-gold)]">{car.price}</td>
                    <td className="py-3 px-4 text-[var(--color-gold)]">{car.year || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        car.price.toUpperCase() === 'SOLD'
                          ? 'bg-[var(--color-danger)] bg-opacity-20 text-[var(--color-danger)]'
                          : 'bg-[var(--color-gold)] bg-opacity-20 text-[var(--color-gold)]'
                      }`}>
                        {car.price.toUpperCase() === 'SOLD' ? 'Sold' : 'Available'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Link
                        href={`/admin/edit-car/${car.id}`}
                        className="text-[var(--color-gold)] hover:text-[var(--color-gold-hover)] underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredCars.length === 0 && (
              <div className="text-center py-8 text-[var(--color-gold)] opacity-60">
                No cars found matching your search.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

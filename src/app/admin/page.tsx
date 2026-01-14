'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Car } from '@/types/car';

export default function AdminDashboard() {
  const [cars, setCars] = useState<Car[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    sold: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/cars');
      const data = await res.json();

      setCars(data.cars.slice(0, 10)); // Show recent 10

      const available = data.cars.filter((c: Car) => c.price.toUpperCase() !== 'SOLD').length;
      const sold = data.cars.filter((c: Car) => c.price.toUpperCase() === 'SOLD').length;

      setStats({
        total: data.cars.length,
        available,
        sold,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-[var(--color-gold)]">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="text-[var(--color-gold)] opacity-60 text-sm mb-2">Total Vehicles</div>
          <div className="text-4xl font-bold text-[var(--color-gold)]">{stats.total}</div>
        </div>
        <div className="card">
          <div className="text-[var(--color-gold)] opacity-60 text-sm mb-2">Available</div>
          <div className="text-4xl font-bold text-[var(--color-gold)]">{stats.available}</div>
        </div>
        <div className="card">
          <div className="text-[var(--color-gold)] opacity-60 text-sm mb-2">Sold</div>
          <div className="text-4xl font-bold text-[var(--color-danger)]">{stats.sold}</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card mb-8">
        <h2 className="text-2xl font-bold mb-6 text-[var(--color-gold)]">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/add-car">
            <Button variant="primary" className="w-full">
              ➕ Add New Car
            </Button>
          </Link>
          <Link href="/admin/edit-car">
            <Button className="w-full">
              ✏️ Edit Cars
            </Button>
          </Link>
          <Link href="/admin/analytics">
            <Button className="w-full">
              📈 View Analytics
            </Button>
          </Link>
        </div>
      </div>

      {/* Recent Cars */}
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[var(--color-gold)]">Recent Cars</h2>
          <Link href="/showroom" className="text-[var(--color-gold)] hover:text-[var(--color-gold-hover)] text-sm">
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="spinner"></div>
          </div>
        ) : (
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
                {cars.map((car) => (
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
                        href={`/car/${car.id}`}
                        className="text-[var(--color-gold)] hover:text-[var(--color-gold-hover)] text-sm mr-4"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/edit-car/${car.id}`}
                        className="text-[var(--color-gold)] hover:text-[var(--color-gold-hover)] text-sm"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

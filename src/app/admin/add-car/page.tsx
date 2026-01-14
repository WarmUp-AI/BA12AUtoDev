'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CarForm } from '@/components/admin/CarForm';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { Button } from '@/components/ui/Button';

export default function AddCarPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    price: '',
    year: '',
    mileage: '',
    fuel_type: '',
    transmission: '',
    description: '',
    video_url: '',
  });
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFieldChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const carData = {
        make: formData.make,
        model: formData.model,
        price: formData.price,
        year: formData.year ? parseInt(formData.year) : undefined,
        mileage: formData.mileage ? parseInt(formData.mileage) : undefined,
        fuel_type: formData.fuel_type || undefined,
        transmission: formData.transmission || undefined,
        description: formData.description,
        video_url: formData.video_url || undefined,
        images,
      };

      const res = await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carData),
      });

      if (!res.ok) {
        throw new Error('Failed to create car');
      }

      const data = await res.json();
      router.push(`/car/${data.car.id}`);
    } catch (err) {
      setError('Failed to create car. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = images.length > 0 && !loading;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8 text-[var(--color-gold)]">Add New Car</h1>

      {error && (
        <div className="mb-6 p-4 bg-[var(--color-danger)] bg-opacity-10 border border-[var(--color-danger)] rounded-lg">
          <p className="text-[var(--color-danger)]">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card mb-6">
          <h2 className="text-xl font-bold mb-4 text-[var(--color-gold)]">Car Details</h2>
          <CarForm formData={formData} onChange={handleFieldChange} />
        </div>

        <div className="card mb-6">
          <h2 className="text-xl font-bold mb-4 text-[var(--color-gold)]">Images</h2>
          <ImageUploader onImagesChange={setImages} />
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            variant="primary"
            disabled={!canSubmit}
            className="flex-1"
          >
            {loading ? 'Creating...' : 'Create Car Listing'}
          </Button>
          <Button
            type="button"
            onClick={() => router.push('/admin')}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}

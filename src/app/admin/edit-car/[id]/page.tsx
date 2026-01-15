'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CarForm } from '@/components/admin/CarForm';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { ImageReorder } from '@/components/admin/ImageReorder';
import { Button } from '@/components/ui/Button';
import { Car } from '@/types/car';

export default function EditCarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [car, setCar] = useState<Car | null>(null);
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
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchCar();
  }, [id]);

  const fetchCar = async () => {
    try {
      const res = await fetch(`/api/cars/${id}`);
      if (!res.ok) throw new Error('Car not found');

      const data = await res.json();
      setCar(data.car);

      setFormData({
        make: data.car.make,
        model: data.car.model,
        price: data.car.price,
        year: data.car.year?.toString() || '',
        mileage: data.car.mileage?.toString() || '',
        fuel_type: data.car.fuel_type || '',
        transmission: data.car.transmission || '',
        description: data.car.description,
        video_url: data.car.video_url || '',
      });

      setImages(data.car.images);
    } catch (err) {
      setError('Failed to load car');
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess(false);

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

      const res = await fetch(`/api/cars/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carData),
      });

      if (!res.ok) {
        throw new Error('Failed to update car');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update car. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this car? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    setError('');

    try {
      const res = await fetch(`/api/cars/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete car');
      }

      router.push('/admin');
    } catch (err) {
      setError('Failed to delete car. Please try again.');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="text-center py-20">
        <p className="text-[var(--color-gold)] opacity-60 mb-4">Car not found</p>
        <Button onClick={() => router.push('/admin/edit-car')}>
          Back to List
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-gold)]">Edit Car</h1>
        <Button onClick={() => router.push('/admin/edit-car')}>
          ← Back to List
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-[var(--color-danger)] bg-opacity-10 border border-[var(--color-danger)] rounded-lg">
          <p className="text-[var(--color-danger)]">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-[var(--color-gold)] bg-opacity-10 border border-[var(--color-gold)] rounded-lg">
          <p className="text-[var(--color-gold)]">Car updated successfully!</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="card mb-6">
          <h2 className="text-xl font-bold mb-4 text-[var(--color-gold)]">Car Details</h2>
          <CarForm formData={formData} onChange={handleFieldChange} />
        </div>

        <div className="card mb-6">
          <h2 className="text-xl font-bold mb-4 text-[var(--color-gold)]">Images</h2>

          {/* Existing Images - Reorder */}
          {images.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-[var(--color-gold)]">Current Images</h3>
              <ImageReorder images={images} onReorder={setImages} />
            </div>
          )}

          {/* Upload New Images */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-[var(--color-gold)]">Add More Images</h3>
            <ImageUploader onImagesChange={(newImages) => setImages([...images, ...newImages])} existingImages={[]} />
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            type="submit"
            variant="primary"
            disabled={saving || images.length === 0}
            className="flex-1"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleDelete}
            disabled={deleting || saving}
          >
            {deleting ? 'Deleting...' : 'Delete Car'}
          </Button>
        </div>
      </form>
    </div>
  );
}

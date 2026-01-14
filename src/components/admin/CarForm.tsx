import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';

interface CarFormProps {
  formData: {
    make: string;
    model: string;
    price: string;
    year: string;
    mileage: string;
    fuel_type: string;
    transmission: string;
    description: string;
    video_url: string;
  };
  onChange: (field: string, value: string) => void;
}

export function CarForm({ formData, onChange }: CarFormProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const fuelOptions = [
    { value: '', label: 'Select Fuel Type' },
    { value: 'Petrol', label: 'Petrol' },
    { value: 'Diesel', label: 'Diesel' },
    { value: 'Electric', label: 'Electric' },
    { value: 'Hybrid', label: 'Hybrid' },
  ];

  const transmissionOptions = [
    { value: '', label: 'Select Transmission' },
    { value: 'Manual', label: 'Manual' },
    { value: 'Automatic', label: 'Automatic' },
  ];

  const yearOptions = [
    { value: '', label: 'Select Year' },
    ...years.map(year => ({ value: year.toString(), label: year.toString() }))
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Make *"
          placeholder="e.g. BMW"
          value={formData.make}
          onChange={(e) => onChange('make', e.target.value)}
          required
        />

        <Input
          label="Model *"
          placeholder="e.g. 3 Series 320d"
          value={formData.model}
          onChange={(e) => onChange('model', e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Price *"
          placeholder="e.g. 12500 or SOLD"
          value={formData.price}
          onChange={(e) => onChange('price', e.target.value)}
          required
        />

        <Select
          label="Year"
          options={yearOptions}
          value={formData.year}
          onChange={(e) => onChange('year', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Mileage"
          type="number"
          placeholder="e.g. 45000"
          value={formData.mileage}
          onChange={(e) => onChange('mileage', e.target.value)}
        />

        <Select
          label="Fuel Type"
          options={fuelOptions}
          value={formData.fuel_type}
          onChange={(e) => onChange('fuel_type', e.target.value)}
        />
      </div>

      <Select
        label="Transmission"
        options={transmissionOptions}
        value={formData.transmission}
        onChange={(e) => onChange('transmission', e.target.value)}
      />

      <Textarea
        label="Description *"
        placeholder="Detailed description of the vehicle..."
        rows={8}
        value={formData.description}
        onChange={(e) => onChange('description', e.target.value)}
        required
      />

      <Input
        label="YouTube Video URL"
        placeholder="https://youtube.com/watch?v=..."
        value={formData.video_url}
        onChange={(e) => onChange('video_url', e.target.value)}
      />
    </div>
  );
}

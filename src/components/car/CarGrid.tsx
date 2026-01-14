import { Car } from '@/types/car';
import { CarCard } from './CarCard';

interface CarGridProps {
  cars: Car[];
  emptyMessage?: string;
}

export function CarGrid({ cars, emptyMessage = "No cars found matching your criteria." }: CarGridProps) {
  if (cars.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-[var(--color-gold)] opacity-60 text-xl">{emptyMessage}</p>
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

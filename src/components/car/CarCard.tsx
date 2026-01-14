import Link from 'next/link';
import Image from 'next/image';
import { Car } from '@/types/car';
import { formatPrice } from '@/lib/db';

interface CarCardProps {
  car: Car;
}

export function CarCard({ car }: CarCardProps) {
  const primaryImage = car.images[0] || '/images/placeholder-car.jpg';

  return (
    <Link href={`/car/${car.id}`}>
      <div className="card group">
        {/* Image */}
        <div className="relative w-full aspect-[4/3] mb-4 overflow-hidden rounded-lg">
          <Image
            src={primaryImage}
            alt={car.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold mb-2 text-[var(--color-gold)] group-hover:text-[var(--color-gold-hover)] transition-colors">
          {car.title}
        </h3>

        {/* Details */}
        <div className="flex flex-wrap gap-3 mb-3 text-sm text-[var(--color-gold)] opacity-80">
          {car.year && <span>{car.year}</span>}
          {car.mileage && <span>{car.mileage.toLocaleString()} miles</span>}
          {car.fuel_type && <span>{car.fuel_type}</span>}
          {car.transmission && <span>{car.transmission}</span>}
        </div>

        {/* Price */}
        <div className="text-2xl font-bold text-[var(--color-gold)]">
          {formatPrice(car.price)}
        </div>
      </div>
    </Link>
  );
}

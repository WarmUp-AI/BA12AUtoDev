'use client';

import { useState, useEffect } from 'react';
import { Select } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface CarFiltersProps {
  makes: string[];
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  make: string;
  priceMin: string;
  priceMax: string;
  yearMin: string;
  yearMax: string;
  mileageMax: string;
  fuelType: string;
  transmission: string;
  search: string;
  sortBy: string;
}

export function CarFilters({ makes, onFilterChange }: CarFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    make: '',
    priceMin: '',
    priceMax: '',
    yearMin: '',
    yearMax: '',
    mileageMax: '',
    fuelType: '',
    transmission: '',
    search: '',
    sortBy: 'date_desc',
  });

  const [isExpanded, setIsExpanded] = useState(false);

  // Auto-expand on desktop
  useEffect(() => {
    const checkWidth = () => {
      setIsExpanded(window.innerWidth >= 768);
    };
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  const handleChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      make: '',
      priceMin: '',
      priceMax: '',
      yearMin: '',
      yearMax: '',
      mileageMax: '',
      fuelType: '',
      transmission: '',
      search: '',
      sortBy: 'date_desc',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const makeOptions = [
    { value: '', label: 'All Makes' },
    ...makes.map(make => ({ value: make, label: make }))
  ];

  const priceOptions = [
    { value: '', label: 'Any Price' },
    { value: '0-2000', label: 'Under £2,000' },
    { value: '2000-5000', label: '£2,000 - £5,000' },
    { value: '5000-10000', label: '£5,000 - £10,000' },
    { value: '10000-15000', label: '£10,000 - £15,000' },
    { value: '15000-20000', label: '£15,000 - £20,000' },
    { value: '20000-999999', label: '£20,000+' },
  ];

  const fuelOptions = [
    { value: '', label: 'All Fuel Types' },
    { value: 'Petrol', label: 'Petrol' },
    { value: 'Diesel', label: 'Diesel' },
    { value: 'Electric', label: 'Electric' },
    { value: 'Hybrid', label: 'Hybrid' },
  ];

  const transmissionOptions = [
    { value: '', label: 'All Transmissions' },
    { value: 'Manual', label: 'Manual' },
    { value: 'Automatic', label: 'Automatic' },
  ];

  const sortOptions = [
    { value: 'date_desc', label: 'Newest First' },
    { value: 'date_asc', label: 'Oldest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
  ];

  return (
    <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-lg p-4 md:p-6 mb-8">
      {/* Header - always visible */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-2xl font-bold text-[var(--color-gold)] md:cursor-default"
        >
          <span className="md:hidden">{isExpanded ? '▼' : '▶'}</span>
          <span>Filter Cars</span>
        </button>
        <Button onClick={handleReset} variant="default" className="text-sm md:text-base">
          Reset
        </Button>
      </div>

      {/* Collapsible content */}
      <div className={`${isExpanded ? 'block' : 'hidden'} space-y-4`}>
        {/* Search */}
        <div>
          <Input
            type="text"
            placeholder="Search by make or model..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
          />
        </div>

        {/* Main Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select
            label="Make"
            options={makeOptions}
            value={filters.make}
            onChange={(e) => handleChange('make', e.target.value)}
          />

          <Select
            label="Price Range"
            options={priceOptions}
            value={filters.priceMin ? `${filters.priceMin}-${filters.priceMax}` : ''}
            onChange={(e) => {
              const [min, max] = e.target.value.split('-');
              setFilters({ ...filters, priceMin: min || '', priceMax: max || '' });
              onFilterChange({ ...filters, priceMin: min || '', priceMax: max || '' });
            }}
          />

          <Select
            label="Fuel Type"
            options={fuelOptions}
            value={filters.fuelType}
            onChange={(e) => handleChange('fuelType', e.target.value)}
          />

          <Select
            label="Transmission"
            options={transmissionOptions}
            value={filters.transmission}
            onChange={(e) => handleChange('transmission', e.target.value)}
          />
        </div>

        {/* Advanced Filters */}
        <details className="border-t border-[var(--color-border)] pt-4">
          <summary className="cursor-pointer text-[var(--color-gold)] hover:text-[var(--color-gold-hover)] mb-4">
            Advanced Filters
          </summary>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="number"
              label="Year From"
              placeholder="e.g. 2015"
              value={filters.yearMin}
              onChange={(e) => handleChange('yearMin', e.target.value)}
            />
            <Input
              type="number"
              label="Year To"
              placeholder="e.g. 2024"
              value={filters.yearMax}
              onChange={(e) => handleChange('yearMax', e.target.value)}
            />
            <Input
              type="number"
              label="Max Mileage"
              placeholder="e.g. 50000"
              value={filters.mileageMax}
              onChange={(e) => handleChange('mileageMax', e.target.value)}
            />
          </div>
        </details>

        {/* Sort */}
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 border-t border-[var(--color-border)] pt-4">
          <label className="text-[var(--color-gold)]">Sort by:</label>
          <Select
            options={sortOptions}
            value={filters.sortBy}
            onChange={(e) => handleChange('sortBy', e.target.value)}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}

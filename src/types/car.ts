export interface Car {
  id: string;
  make: string;
  model: string;
  title: string;
  price: string;
  year?: number | null;
  mileage?: number | null;
  fuel_type?: string | null;
  transmission?: string | null;
  description: string;
  video_url?: string | null;
  images: string[];
  featured: boolean;
  slug: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}

export interface CarFormData {
  make: string;
  model: string;
  price: string;
  year?: number;
  mileage?: number;
  fuel_type?: string;
  transmission?: string;
  description: string;
  video_url?: string;
  images: string[];
  featured?: boolean;
}

export interface CarFilters {
  make?: string;
  priceMin?: number;
  priceMax?: number;
  yearMin?: number;
  yearMax?: number;
  mileageMax?: number;
  fuel_type?: string;
  transmission?: string;
  search?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'date_desc' | 'date_asc';
}

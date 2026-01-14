import { sql } from '@vercel/postgres';

export { sql };

// Helper to create slug from title
export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Helper to parse price string to number (handles "SOLD", "£1000", etc)
export function parsePrice(price: string): number | null {
  if (price.toUpperCase() === 'SOLD') return null;
  const numPrice = parseFloat(price.replace(/[^\d.]/g, ''));
  return isNaN(numPrice) ? null : numPrice;
}

// Helper to format price for display
export function formatPrice(price: string): string {
  if (price.toUpperCase() === 'SOLD') return 'SOLD';
  const numPrice = parsePrice(price);
  if (numPrice === null) return price;
  return `£${numPrice.toLocaleString()}`;
}

import { NextResponse } from 'next/server';
import { getFeaturedCars } from '@/lib/db/queries/cars';

export async function GET() {
  try {
    const cars = await getFeaturedCars(3);
    return NextResponse.json({ cars });
  } catch (error) {
    console.error('Error fetching featured cars:', error);
    return NextResponse.json({ error: 'Failed to fetch featured cars' }, { status: 500 });
  }
}

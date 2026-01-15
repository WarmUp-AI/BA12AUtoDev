import { NextRequest, NextResponse } from 'next/server';
import { getAllCars, createCar, getAllMakes } from '@/lib/db/queries/cars';
import { CarFilters } from '@/types/car';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const filters: CarFilters = {
      make: searchParams.get('make') || undefined,
      priceMin: searchParams.get('priceMin') ? parseInt(searchParams.get('priceMin')!) : undefined,
      priceMax: searchParams.get('priceMax') ? parseInt(searchParams.get('priceMax')!) : undefined,
      yearMin: searchParams.get('yearMin') ? parseInt(searchParams.get('yearMin')!) : undefined,
      yearMax: searchParams.get('yearMax') ? parseInt(searchParams.get('yearMax')!) : undefined,
      mileageMax: searchParams.get('mileageMax') ? parseInt(searchParams.get('mileageMax')!) : undefined,
      fuel_type: searchParams.get('fuel_type') || undefined,
      transmission: searchParams.get('transmission') || undefined,
      search: searchParams.get('search') || undefined,
      sortBy: (searchParams.get('sortBy') as any) || undefined,
    };

    const cars = await getAllCars(filters);

    return NextResponse.json({ cars });
  } catch (error) {
    console.error('Error fetching cars:', error);
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      console.error('POST /api/cars: No session found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    console.log('POST /api/cars: Received data:', {
      make: data.make,
      model: data.model,
      price: data.price,
      imageCount: data.images?.length
    });

    // Validate required fields
    if (!data.make || !data.model || !data.price || !data.description) {
      console.error('POST /api/cars: Missing required fields', {
        hasMake: !!data.make,
        hasModel: !!data.model,
        hasPrice: !!data.price,
        hasDescription: !!data.description
      });
      return NextResponse.json(
        { error: 'Missing required fields: make, model, price, and description are required' },
        { status: 400 }
      );
    }

    const car = await createCar(data);
    console.log('POST /api/cars: Car created successfully:', car.id);

    return NextResponse.json({ car }, { status: 201 });
  } catch (error) {
    console.error('Error creating car:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({
      error: 'Failed to create car',
      details: errorMessage
    }, { status: 500 });
  }
}

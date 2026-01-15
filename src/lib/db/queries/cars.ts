import { sql } from '@vercel/postgres';
import { Car, CarFormData, CarFilters } from '@/types/car';
import { createSlug, parsePrice } from '../index';

export async function getAllCars(filters?: CarFilters): Promise<Car[]> {
  let query = 'SELECT * FROM cars WHERE deleted_at IS NULL';
  const params: any[] = [];
  let paramIndex = 1;

  // Apply filters
  if (filters?.make) {
    query += ` AND LOWER(make) = LOWER($${paramIndex})`;
    params.push(filters.make);
    paramIndex++;
  }

  if (filters?.fuel_type) {
    query += ` AND LOWER(fuel_type) = LOWER($${paramIndex})`;
    params.push(filters.fuel_type);
    paramIndex++;
  }

  if (filters?.transmission) {
    query += ` AND LOWER(transmission) = LOWER($${paramIndex})`;
    params.push(filters.transmission);
    paramIndex++;
  }

  if (filters?.yearMin) {
    query += ` AND year >= $${paramIndex}`;
    params.push(filters.yearMin);
    paramIndex++;
  }

  if (filters?.yearMax) {
    query += ` AND year <= $${paramIndex}`;
    params.push(filters.yearMax);
    paramIndex++;
  }

  if (filters?.mileageMax) {
    query += ` AND mileage <= $${paramIndex}`;
    params.push(filters.mileageMax);
    paramIndex++;
  }

  if (filters?.search) {
    query += ` AND (LOWER(make) LIKE LOWER($${paramIndex}) OR LOWER(model) LIKE LOWER($${paramIndex}) OR LOWER(title) LIKE LOWER($${paramIndex}))`;
    params.push(`%${filters.search}%`);
    paramIndex++;
  }

  // Price filtering
  if (filters?.priceMin !== undefined || filters?.priceMax !== undefined) {
    // Note: Price filtering is complex because price is stored as string
    // For now, we'll fetch all and filter in memory
  }

  // Sorting
  if (filters?.sortBy) {
    switch (filters.sortBy) {
      case 'price_asc':
        query += ' ORDER BY CAST(NULLIF(REGEXP_REPLACE(price, \\\'[^0-9.]\\\', \\\'\\\', \\\'g\\\'), \\\'\\\') AS NUMERIC) ASC NULLS LAST';
        break;
      case 'price_desc':
        query += ' ORDER BY CAST(NULLIF(REGEXP_REPLACE(price, \\\'[^0-9.]\\\', \\\'\\\', \\\'g\\\'), \\\'\\\') AS NUMERIC) DESC NULLS LAST';
        break;
      case 'date_asc':
        query += ' ORDER BY created_at ASC';
        break;
      case 'date_desc':
      default:
        query += ' ORDER BY created_at DESC';
    }
  } else {
    query += ' ORDER BY created_at DESC';
  }

  const result = await sql.query(query, params);
  let cars = result.rows as Car[];

  // Client-side price filtering if needed
  if (filters?.priceMin !== undefined || filters?.priceMax !== undefined) {
    cars = cars.filter(car => {
      const price = parsePrice(car.price);
      if (price === null) return false;
      if (filters.priceMin !== undefined && price < filters.priceMin) return false;
      if (filters.priceMax !== undefined && price > filters.priceMax) return false;
      return true;
    });
  }

  return cars;
}

export async function getCarById(id: string): Promise<Car | null> {
  const result = await sql.query(
    'SELECT * FROM cars WHERE id = $1 AND deleted_at IS NULL',
    [id]
  );
  return result.rows[0] as Car || null;
}

export async function getCarBySlug(slug: string): Promise<Car | null> {
  const result = await sql.query(
    'SELECT * FROM cars WHERE slug = $1 AND deleted_at IS NULL',
    [slug]
  );
  return result.rows[0] as Car || null;
}

export async function getFeaturedCars(limit: number = 3): Promise<Car[]> {
  const result = await sql.query(
    `SELECT * FROM cars
     WHERE deleted_at IS NULL
     AND UPPER(price) != 'SOLD'
     ORDER BY RANDOM()
     LIMIT $1`,
    [limit]
  );
  return result.rows as Car[];
}

export async function createCar(data: CarFormData): Promise<Car> {
  const title = `${data.make} ${data.model}`;
  const slug = createSlug(title);

  const result = await sql.query(
    `INSERT INTO cars (make, model, title, price, year, mileage, fuel_type, transmission, description, video_url, images, featured, slug)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
     RETURNING *`,
    [
      data.make,
      data.model,
      title,
      data.price,
      data.year || null,
      data.mileage || null,
      data.fuel_type || null,
      data.transmission || null,
      data.description,
      data.video_url || null,
      JSON.stringify(data.images),
      data.featured || false,
      slug
    ]
  );

  return result.rows[0] as Car;
}

export async function updateCar(id: string, data: Partial<CarFormData>): Promise<Car | null> {
  const updates: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;

  if (data.make !== undefined) {
    updates.push(`make = $${paramIndex}`);
    params.push(data.make);
    paramIndex++;
  }

  if (data.model !== undefined) {
    updates.push(`model = $${paramIndex}`);
    params.push(data.model);
    paramIndex++;
  }

  if (data.make || data.model) {
    // Recalculate title and slug if make or model changed
    const car = await getCarById(id);
    if (car) {
      const newMake = data.make || car.make;
      const newModel = data.model || car.model;
      const title = `${newMake} ${newModel}`;
      const slug = createSlug(title);
      updates.push(`title = $${paramIndex}`);
      params.push(title);
      paramIndex++;
      updates.push(`slug = $${paramIndex}`);
      params.push(slug);
      paramIndex++;
    }
  }

  if (data.price !== undefined) {
    updates.push(`price = $${paramIndex}`);
    params.push(data.price);
    paramIndex++;
  }

  if (data.year !== undefined) {
    updates.push(`year = $${paramIndex}`);
    params.push(data.year);
    paramIndex++;
  }

  if (data.mileage !== undefined) {
    updates.push(`mileage = $${paramIndex}`);
    params.push(data.mileage);
    paramIndex++;
  }

  if (data.fuel_type !== undefined) {
    updates.push(`fuel_type = $${paramIndex}`);
    params.push(data.fuel_type);
    paramIndex++;
  }

  if (data.transmission !== undefined) {
    updates.push(`transmission = $${paramIndex}`);
    params.push(data.transmission);
    paramIndex++;
  }

  if (data.description !== undefined) {
    updates.push(`description = $${paramIndex}`);
    params.push(data.description);
    paramIndex++;
  }

  if (data.video_url !== undefined) {
    updates.push(`video_url = $${paramIndex}`);
    params.push(data.video_url);
    paramIndex++;
  }

  if (data.images !== undefined) {
    updates.push(`images = $${paramIndex}`);
    params.push(JSON.stringify(data.images));
    paramIndex++;
  }

  if (data.featured !== undefined) {
    updates.push(`featured = $${paramIndex}`);
    params.push(data.featured);
    paramIndex++;
  }

  if (updates.length === 0) {
    return await getCarById(id);
  }

  updates.push(`updated_at = NOW()`);
  params.push(id);

  const query = `UPDATE cars SET ${updates.join(', ')} WHERE id = $${paramIndex} AND deleted_at IS NULL RETURNING *`;
  const result = await sql.query(query, params);

  return result.rows[0] as Car || null;
}

export async function deleteCar(id: string): Promise<boolean> {
  // Soft delete
  const result = await sql.query(
    'UPDATE cars SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL',
    [id]
  );
  return result.rowCount !== null && result.rowCount > 0;
}

export async function getAllMakes(): Promise<string[]> {
  const result = await sql.query(
    'SELECT DISTINCT make FROM cars WHERE deleted_at IS NULL ORDER BY make'
  );
  return result.rows.map(row => row.make);
}

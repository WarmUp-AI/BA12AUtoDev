/**
 * Migration script to import cars from old JSON files to new database
 *
 * Usage:
 *   npm run migrate-cars
 *
 * This will:
 * 1. Read all JSON files from /Users/rory/BA12/htdocs/cars/*.json
 * 2. Upload images to Vercel Blob storage
 * 3. Insert car records into Postgres database
 */

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import { put } from '@vercel/blob';
import { sql } from '@vercel/postgres';
import { createReadStream } from 'fs';

// Configuration
const OLD_CARS_DIR = '/Users/rory/BA12/htdocs/cars';
const OLD_IMAGES_DIR = '/Users/rory/BA12/htdocs/images';

interface OldCarData {
  title: string;
  price: string;
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  fuelType?: string;
  transmission?: string;
  description: string;
  images: string[];
  videoUrl?: string;
  featured?: boolean;
}

async function uploadImage(imagePath: string): Promise<string> {
  try {
    const fullPath = join(OLD_IMAGES_DIR, imagePath);
    const fileBuffer = await readFile(fullPath);

    // Upload to Vercel Blob
    const blob = await put(imagePath, fileBuffer, {
      access: 'public',
    });

    console.log(`  ✓ Uploaded image: ${imagePath} -> ${blob.url}`);
    return blob.url;
  } catch (error) {
    console.error(`  ✗ Failed to upload image ${imagePath}:`, error);
    throw error;
  }
}

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function migrateCar(filePath: string): Promise<void> {
  const fileName = filePath.split('/').pop();
  console.log(`\nMigrating: ${fileName}`);

  try {
    // Read JSON file
    const fileContent = await readFile(filePath, 'utf-8');
    const carData: OldCarData = JSON.parse(fileContent);

    console.log(`  Title: ${carData.title}`);
    console.log(`  Price: ${carData.price}`);
    console.log(`  Images: ${carData.images.length}`);

    // Upload images
    const uploadedImageUrls: string[] = [];

    for (const imagePath of carData.images) {
      try {
        const url = await uploadImage(imagePath);
        uploadedImageUrls.push(url);
      } catch (error) {
        console.warn(`  ⚠ Skipping image ${imagePath}, continuing...`);
      }
    }

    if (uploadedImageUrls.length === 0) {
      console.warn(`  ⚠ No images uploaded for ${carData.title}, skipping car...`);
      return;
    }

    // Extract make and model from title if not provided
    let make = carData.make;
    let model = carData.model;

    if (!make || !model) {
      const titleParts = carData.title.split(' ');
      make = make || titleParts[0];
      model = model || titleParts.slice(1).join(' ');
    }

    // Create slug
    const slug = createSlug(carData.title);

    // Insert into database
    await sql`
      INSERT INTO cars (
        make, model, title, price, year, mileage,
        fuel_type, transmission, description,
        video_url, images, featured, slug
      ) VALUES (
        ${make},
        ${model},
        ${carData.title},
        ${carData.price},
        ${carData.year || null},
        ${carData.mileage || null},
        ${carData.fuelType || null},
        ${carData.transmission || null},
        ${carData.description},
        ${carData.videoUrl || null},
        ${JSON.stringify(uploadedImageUrls)},
        ${carData.featured || false},
        ${slug}
      )
    `;

    console.log(`  ✓ Successfully migrated: ${carData.title}`);
  } catch (error) {
    console.error(`  ✗ Failed to migrate ${fileName}:`, error);
    throw error;
  }
}

async function main() {
  console.log('🚗 Starting car migration...\n');
  console.log(`Source: ${OLD_CARS_DIR}`);
  console.log(`Images: ${OLD_IMAGES_DIR}\n`);

  try {
    // Get all JSON files
    const files = await readdir(OLD_CARS_DIR);
    const jsonFiles = files
      .filter(f => f.endsWith('.json'))
      .map(f => join(OLD_CARS_DIR, f));

    console.log(`Found ${jsonFiles.length} car listings to migrate\n`);
    console.log('─'.repeat(60));

    let successCount = 0;
    let failCount = 0;

    // Migrate each car
    for (const filePath of jsonFiles) {
      try {
        await migrateCar(filePath);
        successCount++;
      } catch (error) {
        failCount++;
        console.error(`Failed to migrate ${filePath}`);
      }
    }

    console.log('\n' + '─'.repeat(60));
    console.log('\n✨ Migration complete!');
    console.log(`  ✓ Success: ${successCount} cars`);
    if (failCount > 0) {
      console.log(`  ✗ Failed: ${failCount} cars`);
    }
    console.log('\n');

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
main();

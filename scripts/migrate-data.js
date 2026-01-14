const fs = require('fs');
const path = require('path');
const { createClient } = require('@vercel/postgres');
const { put } = require('@vercel/blob');

async function migrateData() {
  console.log('Starting data migration...\n');

  const carsDir = path.join(__dirname, '../../htdocs/cars');
  const imagesDir = path.join(__dirname, '../../htdocs/images');

  if (!fs.existsSync(carsDir)) {
    console.error('Error: Cars directory not found at', carsDir);
    process.exit(1);
  }

  // Get all JSON files
  const files = fs.readdirSync(carsDir).filter(f => f.endsWith('.json'));
  console.log(`Found ${files.length} car files to migrate\n`);

  // Connect to database
  const client = createClient();
  await client.connect();

  let successCount = 0;
  let errorCount = 0;

  for (const file of files) {
    try {
      const filePath = path.join(carsDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      console.log(`Migrating: ${data.title || data.make + ' ' + data.model}`);

      // Migrate images to Vercel Blob
      const imageUrls = [];
      if (data.images && Array.isArray(data.images)) {
        for (const imageFilename of data.images) {
          const imagePath = path.join(imagesDir, imageFilename);

          if (fs.existsSync(imagePath)) {
            try {
              const imageBuffer = fs.readFileSync(imagePath);
              const blob = await put(imageFilename, imageBuffer, {
                access: 'public',
              });
              imageUrls.push(blob.url);
              console.log(`  ✓ Uploaded image: ${imageFilename}`);
            } catch (err) {
              console.error(`  ✗ Failed to upload image: ${imageFilename}`, err.message);
            }
          } else {
            console.warn(`  ⚠ Image not found: ${imageFilename}`);
          }
        }
      }

      // Create slug from title
      const title = data.title || `${data.make} ${data.model}`;
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      // Insert into database
      await client.query(
        `INSERT INTO cars (
          make, model, title, price, year, mileage,
          fuel_type, transmission, description, video_url,
          images, slug, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          data.make,
          data.model,
          title,
          data.price,
          data.year || null,
          data.mileage || null,
          data.fuel_type || data.fuelType || null,
          data.transmission || null,
          data.description,
          data.video || data.video_url || null,
          JSON.stringify(imageUrls),
          slug,
          data.timestamp ? new Date(data.timestamp * 1000) : new Date()
        ]
      );

      console.log(`  ✓ Migrated to database with ${imageUrls.length} images\n`);
      successCount++;
    } catch (error) {
      console.error(`  ✗ Error migrating ${file}:`, error.message, '\n');
      errorCount++;
    }
  }

  await client.end();

  console.log('\n=== Migration Complete ===');
  console.log(`✓ Success: ${successCount} cars`);
  console.log(`✗ Errors: ${errorCount} cars`);
  console.log(`Total: ${files.length} cars`);
}

// Check for required environment variables
if (!process.env.DATABASE_URL) {
  console.error('Error: DATABASE_URL environment variable is required');
  process.exit(1);
}

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('Error: BLOB_READ_WRITE_TOKEN environment variable is required');
  process.exit(1);
}

migrateData().catch((error) => {
  console.error('Migration failed:', error);
  process.exit(1);
});

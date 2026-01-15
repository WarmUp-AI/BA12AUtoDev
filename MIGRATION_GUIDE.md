# Car Listings Migration Guide

This guide explains how to migrate your existing car listings from the old PHP/JSON system to the new Next.js + Postgres system.

## What Gets Migrated

- ✅ Car details (title, price, make, model, year, mileage, etc.)
- ✅ Descriptions
- ✅ All images (uploaded to Vercel Blob)
- ✅ Video URLs
- ✅ Featured status

## Prerequisites

Before running the migration:

1. ✅ **Database schema created** - Run the schema SQL in Neon
2. ✅ **Vercel Blob storage set up** - Create Blob store in Vercel
3. ✅ **Environment variables configured** - `DATABASE_URL` and `BLOB_READ_WRITE_TOKEN` set in `.env.local`

## How to Run Migration

### Step 1: Verify Old Data Exists

Check that your old car data is still at:
```bash
ls /Users/rory/BA12/htdocs/cars/*.json
ls /Users/rory/BA12/htdocs/images/
```

You should see JSON files and image files.

### Step 2: Run Migration Script

```bash
cd /Users/rory/BA12/modernized
npm run migrate-cars
```

### Step 3: Watch Progress

The script will show progress like:

```
🚗 Starting car migration...

Source: /Users/rory/BA12/htdocs/cars
Images: /Users/rory/BA12/htdocs/images

Found 15 car listings to migrate

────────────────────────────────────────────────────────────

Migrating: bmw-3-series.json
  Title: BMW 3 Series 320d M Sport
  Price: £18,995
  Images: 8
  ✓ Uploaded image: bmw-320d-1.jpg -> https://blob.vercel-storage.com/...
  ✓ Uploaded image: bmw-320d-2.jpg -> https://blob.vercel-storage.com/...
  ...
  ✓ Successfully migrated: BMW 3 Series 320d M Sport

Migrating: audi-a4.json
  ...

────────────────────────────────────────────────────────────

✨ Migration complete!
  ✓ Success: 15 cars
```

### Step 4: Verify in Admin Panel

1. Go to your site: `https://your-site.vercel.app/admin/login`
2. Login with your admin credentials
3. Check the admin dashboard - you should see all migrated cars
4. Check the showroom page - cars should be visible

## What the Script Does

1. **Reads JSON files** - Scans `/Users/rory/BA12/htdocs/cars/*.json`
2. **Uploads images** - Each image is uploaded to Vercel Blob storage
3. **Creates database records** - Inserts car data into Postgres
4. **Generates slugs** - Creates URL-friendly slugs from titles
5. **Handles errors** - Skips problematic files and continues

## Expected JSON Format

The script expects JSON files like:

```json
{
  "title": "BMW 3 Series 320d M Sport",
  "price": "£18,995",
  "make": "BMW",
  "model": "3 Series 320d M Sport",
  "year": 2019,
  "mileage": 45000,
  "fuelType": "Diesel",
  "transmission": "Automatic",
  "description": "Stunning BMW 3 Series...",
  "images": [
    "bmw-320d-1.jpg",
    "bmw-320d-2.jpg",
    "bmw-320d-3.jpg"
  ],
  "videoUrl": "https://youtube.com/watch?v=...",
  "featured": true
}
```

**Note**: If `make` and `model` are missing, they'll be extracted from the title.

## Troubleshooting

### Missing Images

If some images don't exist in `/Users/rory/BA12/htdocs/images/`:
- The script will warn you and skip those images
- The car will still be migrated with whatever images are available
- Check the console output for warnings

### Database Connection Error

```
Error: Failed to connect to database
```

**Solution**: Verify `DATABASE_URL` is set correctly in `.env.local`

### Blob Upload Error

```
Error: Missing BLOB_READ_WRITE_TOKEN
```

**Solution**:
1. Create Vercel Blob storage in Vercel dashboard
2. Copy `BLOB_READ_WRITE_TOKEN` to `.env.local`

### Duplicate Cars

If you run the migration twice, you might get duplicate slug errors:

```
Error: duplicate key value violates unique constraint "cars_slug_key"
```

**Solution**:
- Clear the database first: `DELETE FROM cars;` in Neon SQL Editor
- Or manually delete duplicate cars in the admin panel

## After Migration

### Test Everything

- [ ] Check all cars appear in showroom
- [ ] Verify images load correctly
- [ ] Test car detail pages
- [ ] Check featured cars on homepage
- [ ] Try searching and filtering

### Backup Old Data

Keep your old JSON files as backup:
```bash
cp -r /Users/rory/BA12/htdocs/cars ~/BA12-backup/
cp -r /Users/rory/BA12/htdocs/images ~/BA12-backup/
```

### Update Car Details

After migration, you can edit any car in the admin panel:
- Add better descriptions
- Reorder images
- Update prices
- Mark as sold

## Advanced: Partial Migration

If you only want to migrate specific cars:

1. Move cars you want to migrate to a separate folder
2. Update `OLD_CARS_DIR` in `scripts/migrate-cars.ts`
3. Run the migration

## Re-running Migration

If migration fails halfway:

1. **Clear partial data**:
   ```sql
   DELETE FROM cars WHERE created_at > NOW() - INTERVAL '1 hour';
   ```

2. **Re-run script**:
   ```bash
   npm run migrate-cars
   ```

## Performance

- **Small inventory (< 20 cars)**: ~2-5 minutes
- **Medium inventory (20-50 cars)**: ~5-15 minutes
- **Large inventory (50+ cars)**: ~15-30 minutes

Time depends on:
- Number of images per car
- Image file sizes
- Internet upload speed

## Support

If you encounter issues:

1. Check the console output for specific errors
2. Verify all prerequisites are met
3. Check Vercel deployment logs
4. Review `NEXT_STEPS.md` for environment setup

---

**Pro Tip**: Run the migration during off-peak hours to avoid any potential service interruptions.

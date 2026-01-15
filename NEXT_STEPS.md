# Next Steps After Deployment

Your BA12 Automotive site is now deployed! Here's what you need to do to get it fully working.

## Current Status ✅

- ✅ Code pushed to GitHub
- ✅ Vercel project deployed
- ✅ Neon Postgres database connected
- ✅ Environment variables configured
- ✅ Frontend is live

## Critical Next Steps

### 1. Initialize Database Schema

Your database is empty! You need to run the schema to create tables.

**Option A: Use Neon SQL Editor** (Recommended)

1. Go to your Neon dashboard: https://console.neon.tech
2. Select your database
3. Click **SQL Editor**
4. Copy and paste the contents of `/Users/rory/BA12/modernized/src/lib/db/migrations/schema.sql`
5. Click **Run**

**Option B: Use psql from Terminal**

```bash
# Get your POSTGRES_URL from Vercel environment variables
# Then run:
psql "YOUR_POSTGRES_URL_HERE" -f /Users/rory/BA12/modernized/src/lib/db/migrations/schema.sql
```

### 2. Create Admin User

After the schema is created, you need to create your first admin user.

**Generate password hash:**

```bash
cd /Users/rory/BA12/modernized
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('Myth1cal', 10));"
```

Replace `YourPasswordHere` with your desired password. Copy the output hash.

**Insert admin user:**

In Neon SQL Editor or psql:

```sql
INSERT INTO admin_users (email, password_hash, name)
VALUES (
  'admin@ba12automotive.co.uk',
  '$2b$10$CxJCplSSPlra4Q0rQQiyWe5dhOnTzAq.U9Y5.Sw3mKda4YYhzagnS',
  'Admin'
);
```

Replace `$2a$10$YOUR_HASH_HERE` with the hash you generated.

### 3. Set Up Blob Storage for Images

Currently, image uploads won't work. You need to add Vercel Blob storage:

1. In your Vercel project dashboard, go to **Storage** tab
2. Click **Create Database** > **Blob**
3. Name it `ba12-car-images`
4. Click **Create**
5. Vercel will automatically add `BLOB_READ_WRITE_TOKEN` to your environment variables

### 4. Update Environment Variables in Vercel

Go to **Settings** > **Environment Variables** and verify/add:

#### Required (should already be there):
- ✅ `POSTGRES_URL` (auto-added by Neon)
- ✅ `DATABASE_URL` (should equal POSTGRES_URL)

#### Update these:
- **NEXTAUTH_URL**: Change from `http://localhost:3000` to your actual domain:
  - `https://your-project-name.vercel.app` OR
  - `https://ba12automotive.co.uk` (if using custom domain)

- **NEXTAUTH_SECRET**: Generate a secure secret:
  ```bash
  openssl rand -base64 32
  ```
  Copy the output and paste as the value.

#### Optional (for email functionality):
- `RESEND_API_KEY`: Get from https://resend.com if you want contact form emails
- `EMAIL_FROM`: sales@ba12automotive.co.uk
- `EMAIL_TO`: sales@ba12automotive.co.uk

**After updating environment variables, redeploy:**
- Go to **Deployments** tab
- Click the three dots on the latest deployment
- Click **Redeploy**

### 5. Test Your Site

Once all the above is complete:

1. **Test homepage**: Visit your Vercel URL
2. **Test admin login**:
   - Go to `https://your-site.vercel.app/admin/login`
   - Login with the admin credentials you created
3. **Test adding a car**:
   - Go to `/admin/add-car`
   - Upload images (requires Blob storage)
   - Save the car
4. **Test frontend**:
   - Visit `/showroom` to see the car
   - Test filters and search
   - Click on the car to see details

### 6. Fix Any Issues

**If admin login redirects in a loop:**
- Make sure `NEXTAUTH_URL` matches your actual domain
- Make sure `NEXTAUTH_SECRET` is set
- Check browser console for errors
- The redirect callback fix I just added should prevent this

**If images fail to upload:**
- Verify Blob storage is created and connected
- Check `BLOB_READ_WRITE_TOKEN` is in environment variables
- Redeploy after adding the token

**If database queries fail:**
- Verify schema was run successfully
- Check `DATABASE_URL` is set correctly
- Look at Vercel deployment logs for SQL errors

## Optional Enhancements

### Custom Domain

1. Go to **Settings** > **Domains**
2. Add `ba12automotive.co.uk`
3. Update your DNS records as instructed by Vercel
4. Update `NEXTAUTH_URL` to use the custom domain
5. Redeploy

### Migrate Existing Car Data

If you have cars in the old JSON files at `/Users/rory/BA12/htdocs/cars/*.json`:

1. Create a migration script (I can help with this)
2. Upload images to Blob storage
3. Insert car records into Postgres

### Enable Contact Form Emails

1. Sign up at https://resend.com
2. Verify your domain `ba12automotive.co.uk`
3. Create an API key
4. Add `RESEND_API_KEY` to Vercel environment variables
5. Redeploy

## Getting Help

**Check Vercel Logs:**
- Go to **Deployments** > Click on a deployment > **Runtime Logs**
- Look for errors related to database, auth, or API routes

**Common Error Messages:**

- "Failed to connect to database" → Check DATABASE_URL is set
- "Missing API key" → Check BLOB_READ_WRITE_TOKEN or RESEND_API_KEY
- "Unauthorized" on admin routes → Check middleware.ts and auth config
- "Redirect loop" on login → Check NEXTAUTH_URL and NEXTAUTH_SECRET

**Documentation:**
- See `VERCEL_SETUP.md` for detailed deployment guide
- See `GIT_QUICK_FIX.md` for git troubleshooting

---

## Quick Checklist

- [ ] Database schema initialized
- [ ] Admin user created
- [ ] Blob storage connected
- [ ] NEXTAUTH_URL updated to production domain
- [ ] NEXTAUTH_SECRET generated and set
- [ ] Site redeployed after env var changes
- [ ] Admin login tested
- [ ] Image upload tested
- [ ] Contact form tested

Once all items are checked, your site should be fully functional! 🎉

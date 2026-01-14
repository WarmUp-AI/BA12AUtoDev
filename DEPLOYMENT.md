# BA12 Automotive - Deployment Guide

Complete guide to deploy your modernized BA12 Automotive website.

## 📋 Pre-Deployment Checklist

### 1. Set Up Database (Vercel Postgres)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Create a new Postgres database
3. Copy the connection string
4. Add to `.env.local`:
   ```bash
   DATABASE_URL="postgres://..."
   ```

5. Run the schema migration:
   ```bash
   # Connect to your database via Vercel dashboard or psql
   # Then execute the SQL in: src/lib/db/migrations/schema.sql
   ```

### 2. Set Up Vercel Blob Storage

1. In Vercel Dashboard, go to Storage
2. Create a new Blob store
3. Copy the `BLOB_READ_WRITE_TOKEN`
4. Add to `.env.local`:
   ```bash
   BLOB_READ_WRITE_TOKEN="vercel_blob_..."
   ```

### 3. Set Up Email (Resend)

1. Sign up at [Resend.com](https://resend.com)
2. Verify your domain (optional but recommended)
3. Get API key
4. Add to `.env.local`:
   ```bash
   RESEND_API_KEY="re_..."
   EMAIL_FROM="sales@ba12automotive.co.uk"
   EMAIL_TO="sales@ba12automotive.co.uk"
   ```

### 4. Configure NextAuth

Generate a secure secret:
```bash
openssl rand -base64 32
```

Add to `.env.local`:
```bash
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret"
```

## 🚀 Local Setup

### 1. Install Dependencies

```bash
cd modernized
npm install
```

### 2. Create Admin User

```bash
node scripts/create-admin.js admin@ba12automotive.co.uk yourpassword "Admin"
```

### 3. Migrate Existing Data (Optional)

If you want to migrate your existing JSON data:

```bash
node scripts/migrate-data.js
```

This will:
- Upload all images to Vercel Blob
- Import all car data to PostgreSQL
- Preserve timestamps

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

Test the admin panel at http://localhost:3000/admin/login

## 📦 Production Deployment

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - BA12 Automotive modernized"
git branch -M main
git remote add origin https://github.com/WarmUp-AI/BA12AUtoDev.git
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

4. Add Environment Variables:
   ```bash
   DATABASE_URL=postgres://...
   NEXTAUTH_URL=https://yourdomain.com
   NEXTAUTH_SECRET=your-generated-secret
   BLOB_READ_WRITE_TOKEN=vercel_blob_...
   RESEND_API_KEY=re_...
   EMAIL_FROM=sales@ba12automotive.co.uk
   EMAIL_TO=sales@ba12automotive.co.uk
   ```

5. Deploy!

### 3. Post-Deployment

1. **Create Admin User** (if not migrated):
   ```bash
   # In Vercel dashboard, go to your project > Storage > Postgres
   # Use the Query tab to run:
   INSERT INTO admin_users (email, password_hash, name)
   VALUES (
     'admin@ba12automotive.co.uk',
     '$2a$10$...', -- Generate with bcrypt
     'Admin'
   );
   ```

   To generate password hash locally:
   ```bash
   node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('yourpassword', 10));"
   ```

2. **Test Everything**:
   - [ ] Homepage loads
   - [ ] Showroom displays cars
   - [ ] Car detail pages work
   - [ ] Contact form sends emails
   - [ ] Admin login works
   - [ ] Can add/edit/delete cars
   - [ ] Image uploads work
   - [ ] Analytics displays data

3. **Configure Custom Domain** (Optional):
   - Go to Vercel project settings
   - Add your domain
   - Update DNS records
   - Update `NEXTAUTH_URL` environment variable

## 🔒 Security Notes

### Important Actions

1. **Change Default Credentials**: If you used the example password, change it immediately
2. **Enable 2FA**: On your Vercel account
3. **Backup Database**: Set up automatic backups in Vercel
4. **Monitor Logs**: Check Vercel logs regularly for errors

### Recommended Settings

```bash
# Add to Vercel environment variables for production
NODE_ENV=production
```

## 🐛 Troubleshooting

### Images Not Loading

Check:
1. `BLOB_READ_WRITE_TOKEN` is set correctly
2. Images uploaded successfully (check Vercel Blob dashboard)
3. `next.config.ts` has correct image domains

### Admin Login Not Working

Check:
1. Admin user exists in database
2. `NEXTAUTH_SECRET` is set
3. `NEXTAUTH_URL` matches your domain
4. Password hash was generated correctly

### Database Connection Errors

Check:
1. `DATABASE_URL` is correct
2. Database is accessible from Vercel
3. Schema has been migrated
4. Connection pool isn't exhausted

### Email Not Sending

Check:
1. `RESEND_API_KEY` is valid
2. Domain is verified (for production)
3. `EMAIL_FROM` and `EMAIL_TO` are set
4. Check Resend dashboard for logs

## 📊 Monitoring

### Vercel Analytics

Enable in Vercel dashboard:
- Web Analytics
- Speed Insights
- Logs

### Database Monitoring

Check Vercel Postgres dashboard for:
- Connection count
- Query performance
- Storage usage

## 🔄 Updates & Maintenance

### Updating the Site

```bash
# Make changes locally
git add .
git commit -m "Description of changes"
git push

# Vercel will automatically deploy
```

### Database Migrations

For schema changes:
1. Create new migration SQL file
2. Test locally
3. Apply to production via Vercel dashboard
4. Deploy code changes

### Backup Procedure

1. **Database**: Vercel Postgres has automatic backups
2. **Images**: Vercel Blob is automatically backed up
3. **Code**: GitHub serves as your code backup

## 📝 Notes

- All images are stored in Vercel Blob (not in the repo)
- Database uses connection pooling (handled by Vercel)
- Sessions expire after 24 hours
- Soft deletes used for cars (can be restored)
- Analytics data uses hashed IPs for privacy

## 🎉 Success Criteria

Your deployment is successful when:
- ✅ Public site accessible and loads fast
- ✅ All pages render correctly
- ✅ Images display properly
- ✅ Contact form sends emails
- ✅ Admin panel is accessible
- ✅ Can add/edit/delete cars
- ✅ Image uploads work
- ✅ Analytics tracking works
- ✅ Mobile responsive
- ✅ SEO metadata present

## 🆘 Support

If you encounter issues:
1. Check Vercel logs (Runtime Logs in dashboard)
2. Check browser console for errors
3. Verify all environment variables
4. Test locally first before deploying
5. Check the README.md for additional info

## 🔗 Useful Links

- [Vercel Dashboard](https://vercel.com/dashboard)
- [Vercel Postgres Docs](https://vercel.com/docs/storage/vercel-postgres)
- [Vercel Blob Docs](https://vercel.com/docs/storage/vercel-blob)
- [Next.js Docs](https://nextjs.org/docs)
- [Resend Docs](https://resend.com/docs)

---

Good luck with your deployment! 🚀

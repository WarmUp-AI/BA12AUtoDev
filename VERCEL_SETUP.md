# Vercel Deployment Setup Guide

This guide walks you through deploying BA12 Automotive to Vercel with all required services.

## Prerequisites

- GitHub account
- Vercel account (sign up at vercel.com)
- Your codebase pushed to GitHub

---

## Step 1: Push to GitHub (if not already done)

If you're having trouble with `git push`, here's the simplified approach:

```bash
cd /Users/rory/BA12/modernized

# Check current status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Fix build errors and prepare for Vercel deployment"

# Push to GitHub
git push origin main
```

**If you get authentication errors:**

1. Use GitHub Personal Access Token instead of password:
   - Go to GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
   - Click "Generate new token (classic)"
   - Select scopes: `repo` (full control)
   - Copy the token
   - Use this token as your password when pushing

2. Or configure SSH:
   ```bash
   # Generate SSH key (if you don't have one)
   ssh-keygen -t ed25519 -C "your_email@example.com"

   # Copy public key
   cat ~/.ssh/id_ed25519.pub

   # Add to GitHub: Settings > SSH and GPG keys > New SSH key
   # Then change remote to SSH
   git remote set-url origin git@github.com:WarmUp-AI/BA12AUtoDev.git
   ```

---

## Step 2: Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/new)
2. Click "Import Project"
3. Select your GitHub repository: `WarmUp-AI/BA12AUtoDev`
4. Configure the project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `modernized` (or leave as default if repo root is the Next.js app)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

5. **DO NOT DEPLOY YET** - we need to set up the database first

---

## Step 3: Set Up Vercel Postgres

1. In your Vercel project dashboard, go to the **Storage** tab
2. Click **Create Database**
3. Select **Postgres**
4. Choose a name (e.g., `ba12-automotive-db`)
5. Select a region (choose closest to your users, e.g., `London`)
6. Click **Create**

### Connect Database to Project

1. After database creation, click on your database
2. Go to the **Settings** tab
3. Under **Connect**, you'll see environment variables
4. Vercel automatically adds `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, etc. to your project

### Initialize Database Schema

You have two options:

#### Option A: Use Vercel Postgres Query Interface

1. In your database dashboard, click the **Query** tab
2. Copy and paste the schema from `/Users/rory/BA12/modernized/src/lib/db/migrations/schema.sql`
3. Click **Run**

#### Option B: Use Local psql with Remote Database

1. Get the connection string from Vercel:
   - Go to your database > Settings > Connection String
   - Copy the `POSTGRES_URL` value

2. Run the schema:
   ```bash
   cd /Users/rory/BA12/modernized
   psql "YOUR_POSTGRES_URL_HERE" -f src/lib/db/migrations/schema.sql
   ```

### Create Admin User

After schema is created, create your first admin user:

```sql
-- Run this in Vercel Postgres Query tab
INSERT INTO admin_users (username, password_hash)
VALUES ('admin', '$2a$10$YourBcryptHashHere');
```

To generate the bcrypt hash locally:

```bash
cd /Users/rory/BA12/modernized
node -e "const bcrypt = require('bcryptjs'); console.log(bcrypt.hashSync('YourPasswordHere', 10));"
```

Replace `YourPasswordHere` with your desired password, then copy the hash output.

---

## Step 4: Configure Environment Variables

1. In your Vercel project, go to **Settings** > **Environment Variables**
2. Add the following variables:

### Required Variables

```env
# Database (automatically added by Vercel Postgres)
POSTGRES_URL=postgres://...
POSTGRES_URL_NON_POOLING=postgres://...

# NextAuth
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-random-secret-here

# Vercel Blob Storage (for image uploads)
BLOB_READ_WRITE_TOKEN=your-blob-token-here
```

### Optional Variables (for contact form emails)

```env
# Email (Resend) - Optional
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=sales@ba12automotive.co.uk
EMAIL_TO=sales@ba12automotive.co.uk
```

### How to Get These Values

**NEXTAUTH_SECRET**:
Generate a secure random string:
```bash
openssl rand -base64 32
```

**BLOB_READ_WRITE_TOKEN**:
1. In Vercel project dashboard, go to **Storage** tab
2. Click **Create Database** > **Blob**
3. Create a new blob store (e.g., `ba12-car-images`)
4. Vercel will automatically add `BLOB_READ_WRITE_TOKEN` to your environment variables

**RESEND_API_KEY** (Optional - for email notifications):
1. Sign up at [resend.com](https://resend.com)
2. Go to API Keys section
3. Create a new API key
4. Add to Vercel environment variables

**Important**: Make sure all environment variables are set for **Production**, **Preview**, and **Development** environments (check all three boxes).

---

## Step 5: Update Database Connection

Since Vercel uses `POSTGRES_URL` but our code uses `DATABASE_URL`, we need to update the environment variable mapping:

1. In Vercel **Settings** > **Environment Variables**
2. Add a new variable:
   - **Key**: `DATABASE_URL`
   - **Value**: Reference the Vercel variable: `$POSTGRES_URL`
   - Or manually copy the `POSTGRES_URL` value

---

## Step 6: Deploy

1. Go to your project **Deployments** tab
2. Click **Redeploy** or push a new commit to trigger deployment
3. Wait for build to complete (usually 2-3 minutes)

### If Build Fails

Check the build logs for errors. Common issues:

1. **Missing environment variables**: Make sure all required env vars are set
2. **Database connection**: Verify `DATABASE_URL` is set correctly
3. **TypeScript errors**: Run `npm run build` locally first to catch issues

---

## Step 7: Set Up Custom Domain (Optional)

1. Go to project **Settings** > **Domains**
2. Add your custom domain (e.g., `ba12automotive.co.uk`)
3. Follow Vercel's DNS configuration instructions
4. Update `NEXTAUTH_URL` environment variable to your custom domain
5. Redeploy

---

## Step 8: Verify Deployment

1. Visit your deployed site: `https://your-project.vercel.app`
2. Check homepage loads correctly
3. Test admin login at `/admin/login`
4. Try uploading a car with images
5. Test contact form
6. Verify showroom filtering works

---

## Troubleshooting

### Database Connection Issues

If you see "Failed to connect to database":

1. Check `DATABASE_URL` is set in environment variables
2. Verify the database schema was created successfully
3. Check Vercel Postgres is in the same region as your deployment
4. Make sure you're using the pooling URL (`POSTGRES_URL`, not `POSTGRES_URL_NON_POOLING`)

### Image Upload Issues

If image uploads fail:

1. Verify `BLOB_READ_WRITE_TOKEN` is set
2. Check Vercel Blob storage is created and connected
3. Look at build logs for upload errors

### Contact Form Not Sending Emails

This is expected if `RESEND_API_KEY` is not configured. The form will still:
- Save submissions to database
- Show success message to user
- Log error in console

To enable emails, configure Resend as described in Step 4.

### Build Errors

Run build locally first:
```bash
cd /Users/rory/BA12/modernized
npm run build
```

If it builds locally but fails on Vercel:
1. Check Node.js version matches (18.x or higher)
2. Verify all dependencies are in `package.json`
3. Check environment variables are set correctly

---

## Monitoring and Maintenance

### View Logs
- Go to project **Deployments** tab
- Click on any deployment to see logs
- Check **Runtime Logs** for API errors

### Database Management
- Use Vercel Postgres **Query** tab for SQL queries
- Monitor database size in **Settings** > **Usage**
- Set up automatic backups in **Settings** > **Backups**

### Analytics
- Built-in analytics at `/admin/analytics` (requires login)
- View page views, popular cars, contact submissions

---

## Next Steps

1. **Migrate existing data**: Run the migration script to import cars from old JSON files
2. **Test all features**: Go through admin panel, add/edit/delete cars
3. **SEO optimization**: Submit sitemap to Google Search Console
4. **Performance**: Check Lighthouse scores and optimize images
5. **Security**: Review admin user permissions, set strong passwords

---

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check browser console for errors
3. Review this guide's troubleshooting section
4. Contact Vercel support if needed

---

## Summary Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Vercel Postgres database created
- [ ] Database schema initialized
- [ ] Admin user created
- [ ] Vercel Blob storage created
- [ ] All environment variables configured
- [ ] Successful deployment
- [ ] Admin login working
- [ ] Image uploads working
- [ ] Contact form working
- [ ] Custom domain configured (optional)

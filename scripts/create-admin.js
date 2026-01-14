require('dotenv').config({ path: '.env.local' });
const bcrypt = require('bcryptjs');
const { sql } = require('@vercel/postgres');

async function createAdmin() {
  const email = process.argv[2];
  const password = process.argv[3];
  const name = process.argv[4] || 'Admin';

  if (!email || !password) {
    console.error('Usage: node scripts/create-admin.js <email> <password> [name]');
    console.error('Example: node scripts/create-admin.js admin@ba12automotive.co.uk mypassword "Admin User"');
    process.exit(1);
  }

  if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
    console.error('\n✗ Error: DATABASE_URL or POSTGRES_URL environment variable is required');
    console.error('Make sure .env.local exists with your database connection string');
    process.exit(1);
  }

  console.log('Creating admin user...');
  console.log('Email:', email);
  console.log('Name:', name);

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    // Insert admin user
    const result = await sql`
      INSERT INTO admin_users (email, password_hash, name)
      VALUES (${email}, ${passwordHash}, ${name})
      RETURNING id, email, name
    `;

    console.log('\n✓ Admin user created successfully!');
    console.log('User ID:', result.rows[0].id);
    console.log('Email:', result.rows[0].email);
    console.log('Name:', result.rows[0].name);
    console.log('\nYou can now login at: http://localhost:3000/admin/login');
  } catch (error) {
    if (error.code === '23505') {
      console.error('\n✗ Error: User with this email already exists');
    } else {
      console.error('\n✗ Error creating admin user:', error.message);
    }
    process.exit(1);
  }
}

createAdmin();

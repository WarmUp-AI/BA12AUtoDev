import { sql } from '@vercel/postgres';
import { CarView, ContactSubmission, AnalyticsStats } from '@/types/analytics';
import crypto from 'crypto';

// Hash IP address for privacy
export function hashIP(ip: string): string {
  return crypto.createHash('sha256').update(ip).digest('hex');
}

export async function trackCarView(
  carId: string,
  ipAddress: string,
  userAgent: string
): Promise<void> {
  const ipHash = hashIP(ipAddress);

  await sql.query(
    'INSERT INTO car_views (car_id, ip_hash, user_agent) VALUES ($1, $2, $3)',
    [carId, ipHash, userAgent]
  );
}

export async function getCarViewCount(carId: string): Promise<number> {
  const result = await sql.query(
    'SELECT COUNT(*) as count FROM car_views WHERE car_id = $1',
    [carId]
  );
  return parseInt(result.rows[0]?.count || '0');
}

export async function saveContactSubmission(
  name: string,
  email: string,
  phone: string | undefined,
  carId: string | undefined,
  carTitle: string | undefined,
  message: string,
  ipAddress: string
): Promise<void> {
  const ipHash = hashIP(ipAddress);

  await sql.query(
    `INSERT INTO contact_submissions (name, email, phone, car_id, car_title, message, ip_hash)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [name, email, phone || null, carId || null, carTitle || null, message, ipHash]
  );
}

export async function getAnalyticsStats(): Promise<AnalyticsStats> {
  // Total views
  const totalViewsResult = await sql.query('SELECT COUNT(*) as count FROM car_views');
  const totalViews = parseInt(totalViewsResult.rows[0]?.count || '0');

  // Views by make
  const viewsByMakeResult = await sql.query(`
    SELECT c.make, COUNT(cv.id) as count
    FROM car_views cv
    JOIN cars c ON cv.car_id = c.id
    WHERE c.deleted_at IS NULL
    GROUP BY c.make
    ORDER BY count DESC
    LIMIT 10
  `);
  const viewsByMake = viewsByMakeResult.rows.map(row => ({
    make: row.make,
    count: parseInt(row.count)
  }));

  // Recent views (grouped by car)
  const recentViewsResult = await sql.query(`
    SELECT cv.car_id, c.title as car_title, COUNT(cv.id) as view_count, MAX(cv.viewed_at) as last_viewed
    FROM car_views cv
    JOIN cars c ON cv.car_id = c.id
    WHERE c.deleted_at IS NULL
    GROUP BY cv.car_id, c.title
    ORDER BY last_viewed DESC
    LIMIT 10
  `);
  const recentViews = recentViewsResult.rows.map(row => ({
    car_id: row.car_id,
    car_title: row.car_title,
    view_count: parseInt(row.view_count),
    last_viewed: new Date(row.last_viewed)
  }));

  // Recent contact submissions
  const recentSubmissionsResult = await sql.query(`
    SELECT * FROM contact_submissions
    ORDER BY submitted_at DESC
    LIMIT 10
  `);
  const recentSubmissions = recentSubmissionsResult.rows as ContactSubmission[];

  return {
    totalViews,
    viewsByMake,
    recentViews,
    recentSubmissions
  };
}

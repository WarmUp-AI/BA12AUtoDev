-- BA12 Automotive Database Schema

-- Cars Table
CREATE TABLE IF NOT EXISTS cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  make VARCHAR(100) NOT NULL,
  model VARCHAR(255) NOT NULL,
  title VARCHAR(500) NOT NULL,
  price VARCHAR(50) NOT NULL,
  year INTEGER,
  mileage INTEGER,
  fuel_type VARCHAR(50),
  transmission VARCHAR(50),
  description TEXT NOT NULL,
  video_url TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  featured BOOLEAN DEFAULT false,
  slug VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cars_make ON cars(make);
CREATE INDEX IF NOT EXISTS idx_cars_featured ON cars(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_cars_slug ON cars(slug);
CREATE INDEX IF NOT EXISTS idx_cars_deleted ON cars(deleted_at) WHERE deleted_at IS NULL;

-- Car Views Table (Analytics)
CREATE TABLE IF NOT EXISTS car_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP DEFAULT NOW(),
  ip_hash VARCHAR(64),
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_car_views_car_id ON car_views(car_id);
CREATE INDEX IF NOT EXISTS idx_car_views_date ON car_views(viewed_at);

-- Contact Submissions Table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  car_id UUID REFERENCES cars(id) ON DELETE SET NULL,
  car_title VARCHAR(500),
  message TEXT NOT NULL,
  submitted_at TIMESTAMP DEFAULT NOW(),
  ip_hash VARCHAR(64)
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_date ON contact_submissions(submitted_at);

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

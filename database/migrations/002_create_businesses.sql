-- ===================================
-- 002: Create businesses table
-- ===================================
-- Merchant business profiles with geolocation

-- Enable PostGIS extension for geospatial queries (if not already enabled)
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(255),
  website TEXT,
  logo_url TEXT,
  cover_image_url TEXT,
  operating_hours JSONB,
  social_media JSONB,
  verified BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_businesses_owner ON businesses(owner_id);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_active ON businesses(active);

-- Create spatial index for location-based queries
CREATE INDEX IF NOT EXISTS idx_businesses_location 
  ON businesses USING GIST (
    ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
  );

-- Enable Row Level Security
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

-- RLS Policies for businesses
CREATE POLICY "Anyone can view active businesses"
  ON businesses FOR SELECT
  USING (active = true);

CREATE POLICY "Merchants can view their own businesses"
  ON businesses FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Merchants can insert their own business"
  ON businesses FOR INSERT
  WITH CHECK (
    auth.uid() = owner_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'merchant'
    )
  );

CREATE POLICY "Business owners can update their business"
  ON businesses FOR UPDATE
  USING (auth.uid() = owner_id)
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Business owners can delete their business"
  ON businesses FOR DELETE
  USING (auth.uid() = owner_id);

-- Create updated_at trigger
CREATE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON businesses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL ON businesses TO authenticated;
GRANT SELECT ON businesses TO anon;

-- Add constraint to ensure one business per merchant (can be removed if multiple businesses allowed)
CREATE UNIQUE INDEX IF NOT EXISTS idx_businesses_one_per_owner 
  ON businesses(owner_id) 
  WHERE active = true;

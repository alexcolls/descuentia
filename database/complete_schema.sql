-- ===================================
-- DESCUENTIA COMPLETE DATABASE SCHEMA
-- ===================================
-- Run this entire file in Supabase SQL Editor
-- Or run migrations individually from the migrations/ folder

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS postgis;

-- ===================================
-- PROFILES TABLE (extends auth.users)
-- ===================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('consumer', 'merchant')),
  full_name VARCHAR(255),
  phone VARCHAR(20),
  avatar_url TEXT,
  notification_preferences JSONB DEFAULT '{"push": true, "email": true, "proximity": true}'::jsonb,
  location_permission BOOLEAN DEFAULT false,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- ===================================
-- BUSINESSES TABLE
-- ===================================

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

CREATE INDEX IF NOT EXISTS idx_businesses_owner ON businesses(owner_id);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_active ON businesses(active);
CREATE INDEX IF NOT EXISTS idx_businesses_location 
  ON businesses USING GIST (ST_SetSRID(ST_MakePoint(longitude, latitude), 4326));

-- ===================================
-- PROMOTIONS TABLE
-- ===================================

CREATE TYPE promotion_type AS ENUM ('time_based', 'fixed', 'weekly_special');
CREATE TYPE promotion_status AS ENUM ('draft', 'active', 'paused', 'expired');

CREATE TABLE IF NOT EXISTS promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  type promotion_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  discount_type VARCHAR(20) CHECK (discount_type IN ('percentage', 'fixed_amount', 'special_offer')),
  discount_value DECIMAL(10, 2),
  special_offer_text TEXT,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  max_claims_per_user INTEGER,
  total_claim_limit INTEGER,
  current_claims INTEGER DEFAULT 0,
  visibility_radius_km DECIMAL(5, 2) DEFAULT 5.0,
  applicable_items TEXT[],
  terms_conditions TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  status promotion_status DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_promotions_business ON promotions(business_id);
CREATE INDEX IF NOT EXISTS idx_promotions_status ON promotions(status);
CREATE INDEX IF NOT EXISTS idx_promotions_type ON promotions(type);
CREATE INDEX IF NOT EXISTS idx_promotions_dates ON promotions(start_date, end_date);

-- ===================================
-- COUPONS TABLE
-- ===================================

CREATE TYPE coupon_status AS ENUM ('claimed', 'redeemed', 'expired');

CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promotion_id UUID NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  qr_code TEXT UNIQUE NOT NULL,
  status coupon_status DEFAULT 'claimed',
  claimed_at TIMESTAMPTZ DEFAULT NOW(),
  redeemed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  redemption_location POINT,
  UNIQUE(promotion_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_coupons_user ON coupons(user_id);
CREATE INDEX IF NOT EXISTS idx_coupons_promotion ON coupons(promotion_id);
CREATE INDEX IF NOT EXISTS idx_coupons_status ON coupons(status);
CREATE INDEX IF NOT EXISTS idx_coupons_qr ON coupons(qr_code);

-- ===================================
-- LOYALTY PROGRAMS TABLE
-- ===================================

CREATE TABLE IF NOT EXISTS loyalty_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  stamps_required INTEGER NOT NULL,
  reward_description TEXT NOT NULL,
  stamp_value_type VARCHAR(20) CHECK (stamp_value_type IN ('per_purchase', 'per_amount')),
  stamp_value DECIMAL(10, 2),
  expiration_days INTEGER,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(business_id)
);

CREATE INDEX IF NOT EXISTS idx_loyalty_programs_business ON loyalty_programs(business_id);

-- ===================================
-- LOYALTY CARDS TABLE
-- ===================================

CREATE TABLE IF NOT EXISTS loyalty_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loyalty_program_id UUID NOT NULL REFERENCES loyalty_programs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  qr_code TEXT UNIQUE NOT NULL,
  current_stamps INTEGER DEFAULT 0,
  total_rewards_earned INTEGER DEFAULT 0,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  last_stamp_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  UNIQUE(loyalty_program_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_loyalty_cards_user ON loyalty_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_cards_program ON loyalty_cards(loyalty_program_id);

-- ===================================
-- LOYALTY TRANSACTIONS TABLE
-- ===================================

CREATE TABLE IF NOT EXISTS loyalty_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loyalty_card_id UUID NOT NULL REFERENCES loyalty_cards(id) ON DELETE CASCADE,
  stamps_awarded INTEGER NOT NULL,
  transaction_amount DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_card ON loyalty_transactions(loyalty_card_id);

-- ===================================
-- SUBSCRIPTIONS TABLE
-- ===================================

CREATE TYPE subscription_tier AS ENUM ('free', 'basic', 'pro', 'premium');
CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'trialing');

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  tier subscription_tier DEFAULT 'free',
  status subscription_status DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(business_id)
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_business ON subscriptions(business_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);

-- ===================================
-- ANALYTICS EVENTS TABLE
-- ===================================

CREATE TYPE event_type AS ENUM ('view', 'claim', 'redeem', 'share');

CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  promotion_id UUID REFERENCES promotions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  event_type event_type NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_business ON analytics_events(business_id);
CREATE INDEX IF NOT EXISTS idx_analytics_promotion ON analytics_events(promotion_id);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at);

-- ===================================
-- PUSH TOKENS TABLE
-- ===================================

CREATE TABLE IF NOT EXISTS push_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  device_type VARCHAR(20),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_push_tokens_user ON push_tokens(user_id);

-- ===================================
-- TRIGGERS
-- ===================================

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_promotions_updated_at BEFORE UPDATE ON promotions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loyalty_programs_updated_at BEFORE UPDATE ON loyalty_programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_push_tokens_updated_at BEFORE UPDATE ON push_tokens FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'consumer'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ===================================
-- ROW LEVEL SECURITY (RLS)
-- ===================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Businesses policies
CREATE POLICY "Anyone can view active businesses" ON businesses FOR SELECT USING (active = true);
CREATE POLICY "Merchants can view own businesses" ON businesses FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Merchants can insert businesses" ON businesses FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can update businesses" ON businesses FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owners can delete businesses" ON businesses FOR DELETE USING (auth.uid() = owner_id);

-- Promotions policies
CREATE POLICY "Anyone can view active promotions" ON promotions FOR SELECT USING (status = 'active');
CREATE POLICY "Merchants can view own promotions" ON promotions FOR SELECT USING (
  EXISTS (SELECT 1 FROM businesses WHERE id = promotions.business_id AND owner_id = auth.uid())
);
CREATE POLICY "Merchants can insert promotions" ON promotions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM businesses WHERE id = promotions.business_id AND owner_id = auth.uid())
);
CREATE POLICY "Merchants can update promotions" ON promotions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM businesses WHERE id = promotions.business_id AND owner_id = auth.uid())
);
CREATE POLICY "Merchants can delete promotions" ON promotions FOR DELETE USING (
  EXISTS (SELECT 1 FROM businesses WHERE id = promotions.business_id AND owner_id = auth.uid())
);

-- Coupons policies
CREATE POLICY "Users can view own coupons" ON coupons FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can claim coupons" ON coupons FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Merchants can view coupons for their promotions" ON coupons FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM promotions p
    JOIN businesses b ON b.id = p.business_id
    WHERE p.id = coupons.promotion_id AND b.owner_id = auth.uid()
  )
);
CREATE POLICY "Merchants can update coupons" ON coupons FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM promotions p
    JOIN businesses b ON b.id = p.business_id
    WHERE p.id = coupons.promotion_id AND b.owner_id = auth.uid()
  )
);

-- Loyalty programs policies
CREATE POLICY "Anyone can view active programs" ON loyalty_programs FOR SELECT USING (active = true);
CREATE POLICY "Merchants can manage programs" ON loyalty_programs FOR ALL USING (
  EXISTS (SELECT 1 FROM businesses WHERE id = loyalty_programs.business_id AND owner_id = auth.uid())
);

-- Loyalty cards policies
CREATE POLICY "Users can view own cards" ON loyalty_cards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can enroll in programs" ON loyalty_cards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Merchants can view cards for their programs" ON loyalty_cards FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM loyalty_programs lp
    JOIN businesses b ON b.id = lp.business_id
    WHERE lp.id = loyalty_cards.loyalty_program_id AND b.owner_id = auth.uid()
  )
);
CREATE POLICY "Merchants can update cards" ON loyalty_cards FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM loyalty_programs lp
    JOIN businesses b ON b.id = lp.business_id
    WHERE lp.id = loyalty_cards.loyalty_program_id AND b.owner_id = auth.uid()
  )
);

-- Subscriptions policies
CREATE POLICY "Merchants can view own subscription" ON subscriptions FOR SELECT USING (
  EXISTS (SELECT 1 FROM businesses WHERE id = subscriptions.business_id AND owner_id = auth.uid())
);
CREATE POLICY "Merchants can manage subscription" ON subscriptions FOR ALL USING (
  EXISTS (SELECT 1 FROM businesses WHERE id = subscriptions.business_id AND owner_id = auth.uid())
);

-- Analytics policies
CREATE POLICY "Merchants can view own analytics" ON analytics_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM businesses WHERE id = analytics_events.business_id AND owner_id = auth.uid())
);
CREATE POLICY "System can insert analytics" ON analytics_events FOR INSERT WITH CHECK (true);

-- Push tokens policies
CREATE POLICY "Users can manage own tokens" ON push_tokens FOR ALL USING (auth.uid() = user_id);

-- ===================================
-- GRANTS
-- ===================================

GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- ===================================
-- COMPLETE! 🎉
-- ===================================
-- Your Descuentia database is now ready to use!

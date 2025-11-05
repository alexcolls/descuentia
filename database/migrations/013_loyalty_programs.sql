-- Create loyalty_programs table (merchant-created loyalty programs)
-- This table was already created in the initial schema, but we'll ensure it exists

-- Update loyalty_programs table with additional fields if needed
ALTER TABLE loyalty_programs
ADD COLUMN IF NOT EXISTS tier_system_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS tiers JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS welcome_bonus INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS referral_bonus INTEGER DEFAULT 0;

-- Create loyalty_cards table (consumer loyalty cards)
-- This table links consumers to business loyalty programs

CREATE TABLE IF NOT EXISTS loyalty_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  loyalty_program_id UUID NOT NULL REFERENCES loyalty_programs(id) ON DELETE CASCADE,
  current_points INTEGER DEFAULT 0,
  lifetime_points INTEGER DEFAULT 0,
  current_tier TEXT DEFAULT 'bronze',
  visits_count INTEGER DEFAULT 0,
  last_visit_at TIMESTAMP WITH TIME ZONE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, business_id)
);

-- Create loyalty_transactions table for point history
CREATE TABLE IF NOT EXISTS loyalty_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loyalty_card_id UUID NOT NULL REFERENCES loyalty_cards(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL, -- 'earn', 'redeem', 'expire', 'adjust'
  points_change INTEGER NOT NULL, -- positive for earn, negative for redeem
  balance_after INTEGER NOT NULL,
  reason TEXT NOT NULL, -- 'purchase', 'reward_redeemed', 'welcome_bonus', etc.
  reference_id UUID, -- can link to coupon_id, promotion_id, etc.
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create loyalty_rewards table for redeemable rewards
CREATE TABLE IF NOT EXISTS loyalty_rewards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  loyalty_program_id UUID NOT NULL REFERENCES loyalty_programs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  points_required INTEGER NOT NULL,
  reward_type TEXT NOT NULL, -- 'discount_percentage', 'discount_fixed', 'free_item', 'special_offer'
  reward_value JSONB, -- e.g., {"percentage": 10} or {"item": "Free Coffee"}
  is_active BOOLEAN DEFAULT true,
  stock_limit INTEGER, -- null = unlimited
  stock_remaining INTEGER,
  image_url TEXT,
  valid_from TIMESTAMP WITH TIME ZONE,
  valid_until TIMESTAMP WITH TIME ZONE,
  terms_conditions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_loyalty_cards_user ON loyalty_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_cards_business ON loyalty_cards(business_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_cards_program ON loyalty_cards(loyalty_program_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_card ON loyalty_transactions(loyalty_card_id);
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_created ON loyalty_transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_loyalty_rewards_program ON loyalty_rewards(loyalty_program_id);

-- Enable Row Level Security
ALTER TABLE loyalty_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_rewards ENABLE ROW LEVEL SECURITY;

-- RLS Policies for loyalty_cards

-- Consumers can view their own loyalty cards
CREATE POLICY "Users can view own loyalty cards"
  ON loyalty_cards FOR SELECT
  USING (auth.uid() = user_id);

-- Merchants can view loyalty cards for their businesses
CREATE POLICY "Merchants can view their business loyalty cards"
  ON loyalty_cards FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = loyalty_cards.business_id
      AND businesses.owner_id = auth.uid()
    )
  );

-- Consumers can insert their own loyalty cards (join program)
CREATE POLICY "Users can create own loyalty cards"
  ON loyalty_cards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Consumers can update their own loyalty cards (limited fields)
CREATE POLICY "Users can update own loyalty cards"
  ON loyalty_cards FOR UPDATE
  USING (auth.uid() = user_id);

-- Merchants can update loyalty cards for their businesses
CREATE POLICY "Merchants can update their business loyalty cards"
  ON loyalty_cards FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = loyalty_cards.business_id
      AND businesses.owner_id = auth.uid()
    )
  );

-- RLS Policies for loyalty_transactions

-- Consumers can view their own transactions
CREATE POLICY "Users can view own loyalty transactions"
  ON loyalty_transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM loyalty_cards
      WHERE loyalty_cards.id = loyalty_transactions.loyalty_card_id
      AND loyalty_cards.user_id = auth.uid()
    )
  );

-- Merchants can view transactions for their businesses
CREATE POLICY "Merchants can view their business loyalty transactions"
  ON loyalty_transactions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM loyalty_cards
      JOIN businesses ON businesses.id = loyalty_cards.business_id
      WHERE loyalty_cards.id = loyalty_transactions.loyalty_card_id
      AND businesses.owner_id = auth.uid()
    )
  );

-- System can insert transactions (handled by backend/functions)
CREATE POLICY "Authenticated users can create loyalty transactions"
  ON loyalty_transactions FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for loyalty_rewards

-- Everyone can view active rewards
CREATE POLICY "Anyone can view active loyalty rewards"
  ON loyalty_rewards FOR SELECT
  USING (is_active = true);

-- Merchants can manage rewards for their programs
CREATE POLICY "Merchants can manage their loyalty rewards"
  ON loyalty_rewards FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM loyalty_programs
      JOIN businesses ON businesses.id = loyalty_programs.business_id
      WHERE loyalty_programs.id = loyalty_rewards.loyalty_program_id
      AND businesses.owner_id = auth.uid()
    )
  );

-- Function to automatically join loyalty program
CREATE OR REPLACE FUNCTION auto_join_loyalty_program()
RETURNS TRIGGER AS $$
BEGIN
  -- When a user claims a promotion, auto-join the business loyalty program if exists
  IF NEW.status = 'active' THEN
    INSERT INTO loyalty_cards (user_id, business_id, loyalty_program_id, current_points, welcome_bonus)
    SELECT 
      NEW.user_id,
      p.business_id,
      lp.id,
      lp.welcome_bonus,
      lp.welcome_bonus
    FROM promotions p
    JOIN loyalty_programs lp ON lp.business_id = p.business_id AND lp.is_active = true
    WHERE p.id = NEW.promotion_id
    ON CONFLICT (user_id, business_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-join loyalty program when claiming coupon
DROP TRIGGER IF EXISTS trigger_auto_join_loyalty ON coupons;
CREATE TRIGGER trigger_auto_join_loyalty
  AFTER INSERT ON coupons
  FOR EACH ROW
  EXECUTE FUNCTION auto_join_loyalty_program();

-- Function to add loyalty points
CREATE OR REPLACE FUNCTION add_loyalty_points(
  p_card_id UUID,
  p_points INTEGER,
  p_reason TEXT,
  p_description TEXT DEFAULT NULL,
  p_reference_id UUID DEFAULT NULL
)
RETURNS void AS $$
DECLARE
  v_new_balance INTEGER;
BEGIN
  -- Update card points
  UPDATE loyalty_cards
  SET 
    current_points = current_points + p_points,
    lifetime_points = lifetime_points + p_points,
    updated_at = NOW()
  WHERE id = p_card_id
  RETURNING current_points INTO v_new_balance;
  
  -- Record transaction
  INSERT INTO loyalty_transactions (
    loyalty_card_id,
    transaction_type,
    points_change,
    balance_after,
    reason,
    reference_id,
    description
  ) VALUES (
    p_card_id,
    'earn',
    p_points,
    v_new_balance,
    p_reason,
    p_reference_id,
    p_description
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to redeem loyalty points
CREATE OR REPLACE FUNCTION redeem_loyalty_points(
  p_card_id UUID,
  p_points INTEGER,
  p_reason TEXT,
  p_description TEXT DEFAULT NULL,
  p_reference_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_current_points INTEGER;
  v_new_balance INTEGER;
BEGIN
  -- Check if user has enough points
  SELECT current_points INTO v_current_points
  FROM loyalty_cards
  WHERE id = p_card_id;
  
  IF v_current_points < p_points THEN
    RETURN FALSE;
  END IF;
  
  -- Deduct points
  UPDATE loyalty_cards
  SET 
    current_points = current_points - p_points,
    updated_at = NOW()
  WHERE id = p_card_id
  RETURNING current_points INTO v_new_balance;
  
  -- Record transaction
  INSERT INTO loyalty_transactions (
    loyalty_card_id,
    transaction_type,
    points_change,
    balance_after,
    reason,
    reference_id,
    description
  ) VALUES (
    p_card_id,
    'redeem',
    -p_points,
    v_new_balance,
    p_reason,
    p_reference_id,
    p_description
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION add_loyalty_points TO authenticated;
GRANT EXECUTE ON FUNCTION redeem_loyalty_points TO authenticated;

-- Add comments
COMMENT ON TABLE loyalty_cards IS 'Consumer loyalty cards linking users to business loyalty programs';
COMMENT ON TABLE loyalty_transactions IS 'History of all loyalty point transactions';
COMMENT ON TABLE loyalty_rewards IS 'Redeemable rewards in loyalty programs';
COMMENT ON FUNCTION add_loyalty_points IS 'Adds points to a loyalty card and records transaction';
COMMENT ON FUNCTION redeem_loyalty_points IS 'Redeems points from a loyalty card if sufficient balance exists';

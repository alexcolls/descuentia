-- Create function to increment promotion redemption count
-- This is called whenever a coupon is redeemed

CREATE OR REPLACE FUNCTION increment_promotion_redemptions(promotion_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE promotions
  SET redemptions_count = COALESCE(redemptions_count, 0) + 1
  WHERE id = promotion_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION increment_promotion_redemptions(UUID) TO authenticated;

-- Add comment
COMMENT ON FUNCTION increment_promotion_redemptions IS 'Increments the redemptions_count for a promotion when a coupon is redeemed';

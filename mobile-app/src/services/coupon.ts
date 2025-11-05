import { supabase } from '@services/supabase';

export interface Coupon {
  id: string;
  promotion_id: string;
  user_id: string;
  qr_code: string;
  status: 'claimed' | 'redeemed' | 'expired';
  claimed_at: string;
  redeemed_at: string | null;
  expires_at: string | null;
  created_at: string;
}

/**
 * Generate a unique QR code string for a coupon
 * Format: COUPON-{promotionId}-{userId}-{timestamp}-{random}
 */
const generateQRCode = (promotionId: string, userId: string): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `COUPON-${promotionId.slice(0, 8)}-${userId.slice(0, 8)}-${timestamp}-${random}`;
};

/**
 * Calculate expiration date for a coupon
 * Default: 30 days from claim date
 */
const calculateExpirationDate = (daysToExpire: number = 30): string => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + daysToExpire);
  return expirationDate.toISOString();
};

/**
 * Claim a promotion and generate a coupon
 */
export const claimPromotion = async (
  promotionId: string,
  userId: string
): Promise<Coupon> => {
  try {
    // Check if user already has an active coupon for this promotion
    const { data: existingCoupon, error: checkError } = await supabase
      .from('coupons')
      .select('*')
      .eq('promotion_id', promotionId)
      .eq('user_id', userId)
      .in('status', ['claimed'])
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      // PGRST116 = no rows returned, which is fine
      throw checkError;
    }

    if (existingCoupon) {
      throw new Error('You already have an active coupon for this promotion');
    }

    // Generate unique QR code
    const qrCode = generateQRCode(promotionId, userId);

    // Create coupon
    const { data: coupon, error: createError } = await supabase
      .from('coupons')
      .insert({
        promotion_id: promotionId,
        user_id: userId,
        qr_code: qrCode,
        status: 'claimed',
        claimed_at: new Date().toISOString(),
        expires_at: calculateExpirationDate(),
      })
      .select()
      .single();

    if (createError) {
      throw createError;
    }

    // Track analytics event
    await supabase.from('analytics_events').insert({
      user_id: userId,
      promotion_id: promotionId,
      event_type: 'claim',
      event_data: { qr_code: qrCode },
    });

    return coupon;
  } catch (error) {
    console.error('Error claiming promotion:', error);
    throw error;
  }
};

/**
 * Get user's coupons with promotion and business details
 */
export const getUserCoupons = async (
  userId: string,
  status?: 'claimed' | 'redeemed' | 'expired'
): Promise<any[]> => {
  try {
    let query = supabase
      .from('coupons')
      .select(
        `
        *,
        promotion:promotions (
          id,
          title,
          discount_type,
          discount_value,
          special_offer_text,
          image_url,
          business:businesses (
            id,
            name,
            address,
            phone,
            latitude,
            longitude,
            category
          )
        )
      `
      )
      .eq('user_id', userId)
      .order('claimed_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching user coupons:', error);
    throw error;
  }
};

/**
 * Get a single coupon by ID
 */
export const getCouponById = async (couponId: string): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select(
        `
        *,
        promotion:promotions (
          id,
          title,
          description,
          discount_type,
          discount_value,
          special_offer_text,
          terms_conditions,
          image_url,
          business:businesses (
            id,
            name,
            address,
            phone,
            latitude,
            longitude,
            category
          )
        )
      `
      )
      .eq('id', couponId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching coupon:', error);
    throw error;
  }
};

/**
 * Check if coupon is expired
 */
export const isCouponExpired = (coupon: Coupon): boolean => {
  if (!coupon.expires_at) {
    return false;
  }

  const expirationDate = new Date(coupon.expires_at);
  const now = new Date();

  return now > expirationDate;
};

/**
 * Get time until coupon expires
 */
export const getTimeUntilExpiration = (coupon: Coupon): string => {
  if (!coupon.expires_at) {
    return 'No expiration';
  }

  const expirationDate = new Date(coupon.expires_at);
  const now = new Date();
  const diffMs = expirationDate.getTime() - now.getTime();

  if (diffMs <= 0) {
    return 'Expired';
  }

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) {
    return `${days} day${days !== 1 ? 's' : ''} left`;
  } else if (hours > 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''} left`;
  } else {
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${minutes} minute${minutes !== 1 ? 's' : ''} left`;
  }
};

import { supabase } from './supabase';

export interface RedemptionResult {
  success: boolean;
  message: string;
  coupon?: {
    id: string;
    code: string;
    promotion: {
      title: string;
      description: string;
      discount_type: 'percentage' | 'fixed_amount' | 'special_offer';
      discount_value?: number;
      business: {
        name: string;
      };
    };
    user: {
      full_name: string;
      email: string;
    };
  };
}

/**
 * Validates a coupon code format
 */
export const validateCouponCode = (code: string): boolean => {
  // Format: COUPON-{promoId}-{userId}-{timestamp}-{random}
  const pattern = /^COUPON-[a-f0-9-]+-[a-f0-9-]+-\d+-[a-z0-9]+$/i;
  return pattern.test(code);
};

/**
 * Redeems a coupon by scanning QR code
 * Validates ownership, expiration, and business match
 */
export const redeemCoupon = async (
  code: string,
  businessId: string
): Promise<RedemptionResult> => {
  try {
    // Validate code format
    if (!validateCouponCode(code)) {
      return {
        success: false,
        message: 'Invalid coupon code format',
      };
    }

    // Fetch coupon with all related data
    const { data: coupon, error: fetchError } = await supabase
      .from('coupons')
      .select(`
        id,
        code,
        status,
        claimed_at,
        redeemed_at,
        expires_at,
        promotion:promotions (
          id,
          title,
          description,
          discount_type,
          discount_value,
          business_id,
          business:businesses (
            id,
            name
          )
        ),
        user:profiles (
          id,
          full_name,
          email
        )
      `)
      .eq('code', code)
      .single();

    if (fetchError || !coupon) {
      return {
        success: false,
        message: 'Coupon not found',
      };
    }

    // Verify business ownership
    if (coupon.promotion.business_id !== businessId) {
      return {
        success: false,
        message: 'This coupon belongs to a different business',
      };
    }

    // Check if already redeemed
    if (coupon.status === 'redeemed') {
      return {
        success: false,
        message: `Already redeemed on ${new Date(coupon.redeemed_at).toLocaleDateString()}`,
      };
    }

    // Check if expired
    if (coupon.status === 'expired') {
      return {
        success: false,
        message: 'This coupon has expired',
      };
    }

    // Check expiration date
    const now = new Date();
    const expiresAt = new Date(coupon.expires_at);
    if (now > expiresAt) {
      // Update status to expired
      await supabase
        .from('coupons')
        .update({ status: 'expired' })
        .eq('id', coupon.id);

      return {
        success: false,
        message: `Expired on ${expiresAt.toLocaleDateString()}`,
      };
    }

    // Check if active
    if (coupon.status !== 'active') {
      return {
        success: false,
        message: 'Coupon is not active',
      };
    }

    // Redeem the coupon
    const { error: updateError } = await supabase
      .from('coupons')
      .update({
        status: 'redeemed',
        redeemed_at: now.toISOString(),
      })
      .eq('id', coupon.id);

    if (updateError) {
      throw updateError;
    }

    // Update promotion redemption count
    await supabase.rpc('increment_promotion_redemptions', {
      promotion_id: coupon.promotion.id,
    });

    return {
      success: true,
      message: 'Coupon redeemed successfully! 🎉',
      coupon: {
        id: coupon.id,
        code: coupon.code,
        promotion: {
          title: coupon.promotion.title,
          description: coupon.promotion.description,
          discount_type: coupon.promotion.discount_type,
          discount_value: coupon.promotion.discount_value,
          business: {
            name: coupon.promotion.business.name,
          },
        },
        user: {
          full_name: coupon.user.full_name,
          email: coupon.user.email,
        },
      },
    };
  } catch (error) {
    console.error('Error redeeming coupon:', error);
    return {
      success: false,
      message: 'Failed to redeem coupon. Please try again.',
    };
  }
};

/**
 * Gets coupon details without redeeming (for preview)
 */
export const getCouponDetails = async (
  code: string,
  businessId: string
): Promise<RedemptionResult> => {
  try {
    if (!validateCouponCode(code)) {
      return {
        success: false,
        message: 'Invalid coupon code format',
      };
    }

    const { data: coupon, error } = await supabase
      .from('coupons')
      .select(`
        id,
        code,
        status,
        claimed_at,
        redeemed_at,
        expires_at,
        promotion:promotions (
          id,
          title,
          description,
          discount_type,
          discount_value,
          business_id,
          business:businesses (
            id,
            name
          )
        ),
        user:profiles (
          id,
          full_name,
          email
        )
      `)
      .eq('code', code)
      .single();

    if (error || !coupon) {
      return {
        success: false,
        message: 'Coupon not found',
      };
    }

    if (coupon.promotion.business_id !== businessId) {
      return {
        success: false,
        message: 'This coupon belongs to a different business',
      };
    }

    const now = new Date();
    const expiresAt = new Date(coupon.expires_at);

    let message = '';
    if (coupon.status === 'redeemed') {
      message = `Already redeemed on ${new Date(coupon.redeemed_at).toLocaleDateString()}`;
    } else if (now > expiresAt || coupon.status === 'expired') {
      message = `Expired on ${expiresAt.toLocaleDateString()}`;
    } else if (coupon.status === 'active') {
      message = 'Ready to redeem';
    } else {
      message = 'Coupon is not active';
    }

    return {
      success: coupon.status === 'active' && now <= expiresAt,
      message,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        promotion: {
          title: coupon.promotion.title,
          description: coupon.promotion.description,
          discount_type: coupon.promotion.discount_type,
          discount_value: coupon.promotion.discount_value,
          business: {
            name: coupon.promotion.business.name,
          },
        },
        user: {
          full_name: coupon.user.full_name,
          email: coupon.user.email,
        },
      },
    };
  } catch (error) {
    console.error('Error getting coupon details:', error);
    return {
      success: false,
      message: 'Failed to load coupon details',
    };
  }
};

import { supabase } from './supabase.service';

export interface Promotion {
  id: string;
  title: string;
  description: string;
  campaign_type: 'fixed' | 'time_based' | 'weekly_special';
  discount_type: 'percentage' | 'fixed_amount' | 'special_offer';
  discount_value?: number;
  start_date?: string;
  end_date?: string;
  start_time?: string;
  end_time?: string;
  days_of_week?: number[];
  is_featured: boolean;
  visibility_radius_km: number;
  redemptions_count: number;
  status: 'active' | 'paused' | 'expired';
  created_at: string;
}

export interface PromotionStats {
  views: number;
  claims: number;
  shares: number;
  redemptions: number;
}

/**
 * Fetches all promotions for a business
 */
export const getBusinessPromotions = async (
  businessId: string
): Promise<Promotion[]> => {
  try {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching promotions:', error);
    throw error;
  }
};

/**
 * Gets detailed stats for a specific promotion
 */
export const getPromotionStats = async (
  promotionId: string
): Promise<PromotionStats> => {
  try {
    // Get analytics events counts
    const { count: views } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('promotion_id', promotionId)
      .eq('event_type', 'view');

    const { count: claims } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('promotion_id', promotionId)
      .eq('event_type', 'claim');

    const { count: shares } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .eq('promotion_id', promotionId)
      .eq('event_type', 'share');

    // Get redemptions count
    const { count: redemptions } = await supabase
      .from('coupons')
      .select('*', { count: 'exact', head: true })
      .eq('promotion_id', promotionId)
      .eq('status', 'redeemed');

    return {
      views: views || 0,
      claims: claims || 0,
      shares: shares || 0,
      redemptions: redemptions || 0,
    };
  } catch (error) {
    console.error('Error fetching promotion stats:', error);
    return { views: 0, claims: 0, shares: 0, redemptions: 0 };
  }
};

/**
 * Toggles promotion status between active and paused
 */
export const togglePromotionStatus = async (
  promotionId: string,
  currentStatus: 'active' | 'paused' | 'expired'
): Promise<{ success: boolean; newStatus: 'active' | 'paused' }> => {
  try {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';

    const { error } = await supabase
      .from('promotions')
      .update({ status: newStatus })
      .eq('id', promotionId);

    if (error) throw error;

    return { success: true, newStatus };
  } catch (error) {
    console.error('Error toggling promotion status:', error);
    throw error;
  }
};

/**
 * Deletes a promotion (soft delete by setting status to expired)
 */
export const deletePromotion = async (
  promotionId: string
): Promise<{ success: boolean }> => {
  try {
    // Soft delete - set status to expired
    const { error } = await supabase
      .from('promotions')
      .update({ status: 'expired' })
      .eq('id', promotionId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error deleting promotion:', error);
    throw error;
  }
};

/**
 * Updates promotion details
 */
export const updatePromotion = async (
  promotionId: string,
  updates: Partial<Promotion>
): Promise<{ success: boolean }> => {
  try {
    const { error } = await supabase
      .from('promotions')
      .update(updates)
      .eq('id', promotionId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('Error updating promotion:', error);
    throw error;
  }
};

/**
 * Checks if promotion is expired based on dates
 */
export const isPromotionExpired = (promotion: Promotion): boolean => {
  if (promotion.campaign_type === 'fixed') return false;

  if (promotion.campaign_type === 'time_based' && promotion.end_date) {
    const endDate = new Date(promotion.end_date);
    return new Date() > endDate;
  }

  return false;
};

/**
 * Gets promotion display status with expiration check
 */
export const getPromotionDisplayStatus = (
  promotion: Promotion
): { status: 'active' | 'paused' | 'expired'; color: string; label: string } => {
  const expired = isPromotionExpired(promotion);

  if (expired || promotion.status === 'expired') {
    return { status: 'expired', color: '#9CA3AF', label: 'Expired' };
  }

  if (promotion.status === 'paused') {
    return { status: 'paused', color: '#F59E0B', label: 'Paused' };
  }

  return { status: 'active', color: '#10B981', label: 'Active' };
};

/**
 * Formats campaign type for display
 */
export const formatCampaignType = (type: string): string => {
  switch (type) {
    case 'fixed':
      return 'Always On';
    case 'time_based':
      return 'Time Limited';
    case 'weekly_special':
      return 'Weekly Special';
    default:
      return type;
  }
};

/**
 * Formats discount for display
 */
export const formatDiscount = (
  discountType: string,
  discountValue?: number
): string => {
  if (discountType === 'percentage') {
    return `${discountValue}% OFF`;
  } else if (discountType === 'fixed_amount') {
    return `€${discountValue} OFF`;
  } else {
    return 'SPECIAL OFFER';
  }
};

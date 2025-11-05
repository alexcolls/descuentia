import { supabase } from './supabase.service';

export interface AnalyticsOverview {
  totalPromotions: number;
  activePromotions: number;
  totalRedemptions: number;
  totalClaims: number;
  totalViews: number;
  totalShares: number;
  conversionRate: number; // claims to redemptions
  engagementRate: number; // claims to views
}

export interface TimeSeriesData {
  date: string;
  views: number;
  claims: number;
  redemptions: number;
  shares: number;
}

export interface PromotionPerformance {
  id: string;
  title: string;
  views: number;
  claims: number;
  redemptions: number;
  shares: number;
  conversionRate: number;
}

export interface CategoryBreakdown {
  category: string;
  count: number;
  percentage: number;
}

/**
 * Fetches overview analytics for a business
 */
export const getAnalyticsOverview = async (
  businessId: string
): Promise<AnalyticsOverview> => {
  try {
    // Get all promotions for the business
    const { data: promotions, error: promoError } = await supabase
      .from('promotions')
      .select('id, status')
      .eq('business_id', businessId);

    if (promoError) throw promoError;

    const totalPromotions = promotions?.length || 0;
    const activePromotions =
      promotions?.filter((p) => p.status === 'active').length || 0;

    // Get promotion IDs
    const promotionIds = promotions?.map((p) => p.id) || [];

    if (promotionIds.length === 0) {
      return {
        totalPromotions: 0,
        activePromotions: 0,
        totalRedemptions: 0,
        totalClaims: 0,
        totalViews: 0,
        totalShares: 0,
        conversionRate: 0,
        engagementRate: 0,
      };
    }

    // Get analytics events
    const { count: views } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .in('promotion_id', promotionIds)
      .eq('event_type', 'view');

    const { count: claims } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .in('promotion_id', promotionIds)
      .eq('event_type', 'claim');

    const { count: shares } = await supabase
      .from('analytics_events')
      .select('*', { count: 'exact', head: true })
      .in('promotion_id', promotionIds)
      .eq('event_type', 'share');

    // Get redemptions
    const { count: redemptions } = await supabase
      .from('coupons')
      .select('*', { count: 'exact', head: true })
      .in('promotion_id', promotionIds)
      .eq('status', 'redeemed');

    const totalViews = views || 0;
    const totalClaims = claims || 0;
    const totalRedemptions = redemptions || 0;
    const totalShares = shares || 0;

    const conversionRate =
      totalClaims > 0 ? (totalRedemptions / totalClaims) * 100 : 0;
    const engagementRate =
      totalViews > 0 ? (totalClaims / totalViews) * 100 : 0;

    return {
      totalPromotions,
      activePromotions,
      totalRedemptions,
      totalClaims,
      totalViews,
      totalShares,
      conversionRate,
      engagementRate,
    };
  } catch (error) {
    console.error('Error fetching analytics overview:', error);
    throw error;
  }
};

/**
 * Fetches time series data for the last 7 days
 */
export const getTimeSeriesData = async (
  businessId: string,
  days: number = 7
): Promise<TimeSeriesData[]> => {
  try {
    // Get promotions
    const { data: promotions } = await supabase
      .from('promotions')
      .select('id')
      .eq('business_id', businessId);

    const promotionIds = promotions?.map((p) => p.id) || [];

    if (promotionIds.length === 0) {
      return [];
    }

    // Generate last N days
    const dates = Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      return date.toISOString().split('T')[0];
    });

    // Fetch events for date range
    const startDate = dates[0];
    const { data: events } = await supabase
      .from('analytics_events')
      .select('event_type, created_at')
      .in('promotion_id', promotionIds)
      .gte('created_at', startDate);

    // Fetch redemptions
    const { data: redemptions } = await supabase
      .from('coupons')
      .select('redeemed_at')
      .in('promotion_id', promotionIds)
      .eq('status', 'redeemed')
      .gte('redeemed_at', startDate);

    // Group by date
    const timeSeriesMap: Record<string, TimeSeriesData> = {};

    dates.forEach((date) => {
      timeSeriesMap[date] = {
        date,
        views: 0,
        claims: 0,
        redemptions: 0,
        shares: 0,
      };
    });

    // Count events
    events?.forEach((event) => {
      const date = event.created_at.split('T')[0];
      if (timeSeriesMap[date]) {
        if (event.event_type === 'view') timeSeriesMap[date].views++;
        else if (event.event_type === 'claim') timeSeriesMap[date].claims++;
        else if (event.event_type === 'share') timeSeriesMap[date].shares++;
      }
    });

    redemptions?.forEach((r) => {
      const date = r.redeemed_at.split('T')[0];
      if (timeSeriesMap[date]) {
        timeSeriesMap[date].redemptions++;
      }
    });

    return Object.values(timeSeriesMap);
  } catch (error) {
    console.error('Error fetching time series data:', error);
    return [];
  }
};

/**
 * Fetches top performing promotions
 */
export const getTopPromotions = async (
  businessId: string,
  limit: number = 5
): Promise<PromotionPerformance[]> => {
  try {
    const { data: promotions } = await supabase
      .from('promotions')
      .select('id, title')
      .eq('business_id', businessId);

    if (!promotions || promotions.length === 0) {
      return [];
    }

    // Get stats for each promotion
    const performancePromises = promotions.map(async (promo) => {
      const { count: views } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('promotion_id', promo.id)
        .eq('event_type', 'view');

      const { count: claims } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('promotion_id', promo.id)
        .eq('event_type', 'claim');

      const { count: shares } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .eq('promotion_id', promo.id)
        .eq('event_type', 'share');

      const { count: redemptions } = await supabase
        .from('coupons')
        .select('*', { count: 'exact', head: true })
        .eq('promotion_id', promo.id)
        .eq('status', 'redeemed');

      const totalViews = views || 0;
      const totalClaims = claims || 0;
      const totalRedemptions = redemptions || 0;
      const totalShares = shares || 0;

      const conversionRate =
        totalClaims > 0 ? (totalRedemptions / totalClaims) * 100 : 0;

      return {
        id: promo.id,
        title: promo.title,
        views: totalViews,
        claims: totalClaims,
        redemptions: totalRedemptions,
        shares: totalShares,
        conversionRate,
      };
    });

    const performances = await Promise.all(performancePromises);

    // Sort by redemptions and take top N
    return performances
      .sort((a, b) => b.redemptions - a.redemptions)
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching top promotions:', error);
    return [];
  }
};

/**
 * Formats date for display
 */
export const formatChartDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

/**
 * Formats percentage
 */
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

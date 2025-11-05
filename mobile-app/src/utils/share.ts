import { Share, Alert } from 'react-native';
import { supabase } from '@services/supabase';

/**
 * Share a promotion with friends
 */
export const sharePromotion = async (
  promotionId: string,
  promotionTitle: string,
  businessName: string,
  discountText: string,
  userId?: string
) => {
  try {
    // Create shareable link (deep link to promotion)
    const shareUrl = `https://descuentia.eu/promo/${promotionId}`;
    
    // Create share message
    const message = `🎉 Check out this deal!\n\n${discountText} at ${businessName}\n"${promotionTitle}"\n\nGet it on Descuentia: ${shareUrl}`;

    const result = await Share.share({
      message,
      title: `${discountText} at ${businessName}`,
      url: shareUrl, // iOS will use this
    });

    // Track analytics if user is logged in
    if (userId && result.action === Share.sharedAction) {
      await supabase.from('analytics_events').insert({
        user_id: userId,
        promotion_id: promotionId,
        event_type: 'share',
        event_data: {
          shared_via: result.activityType || 'unknown',
        },
      });
    }

    return result;
  } catch (error: any) {
    console.error('Error sharing promotion:', error);
    Alert.alert('Error', 'Failed to share promotion');
    throw error;
  }
};

/**
 * Share a coupon with QR code
 */
export const shareCoupon = async (
  couponCode: string,
  promotionTitle: string,
  businessName: string,
  userId?: string
) => {
  try {
    const message = `🎫 I claimed this coupon on Descuentia!\n\n"${promotionTitle}" at ${businessName}\n\nDownload Descuentia to get exclusive discounts: https://descuentia.eu`;

    const result = await Share.share({
      message,
      title: `My ${businessName} Coupon`,
    });

    // Track analytics
    if (userId && result.action === Share.sharedAction) {
      await supabase.from('analytics_events').insert({
        user_id: userId,
        event_type: 'share',
        event_data: {
          type: 'coupon',
          coupon_code: couponCode,
          shared_via: result.activityType || 'unknown',
        },
      });
    }

    return result;
  } catch (error: any) {
    console.error('Error sharing coupon:', error);
    Alert.alert('Error', 'Failed to share coupon');
    throw error;
  }
};

/**
 * Share the app itself
 */
export const shareApp = async (userId?: string) => {
  try {
    const message = `💰 Save money with Descuentia!\n\nDiscover exclusive discounts and deals from local businesses. Plus, 5% of revenue supports cancer research!\n\nDownload now: https://descuentia.eu`;

    const result = await Share.share({
      message,
      title: 'Descuentia - Save Money, Support Cancer Research',
      url: 'https://descuentia.eu',
    });

    // Track analytics
    if (userId && result.action === Share.sharedAction) {
      await supabase.from('analytics_events').insert({
        user_id: userId,
        event_type: 'share',
        event_data: {
          type: 'app',
          shared_via: result.activityType || 'unknown',
        },
      });
    }

    return result;
  } catch (error: any) {
    console.error('Error sharing app:', error);
    Alert.alert('Error', 'Failed to share app');
    throw error;
  }
};

/**
 * Copy promotion link to clipboard
 */
export const copyPromotionLink = async (
  promotionId: string,
  userId?: string
) => {
  try {
    const { default: Clipboard } = await import('@react-native-clipboard/clipboard');
    const shareUrl = `https://descuentia.eu/promo/${promotionId}`;
    
    Clipboard.setString(shareUrl);
    Alert.alert('Copied!', 'Link copied to clipboard');

    // Track analytics
    if (userId) {
      await supabase.from('analytics_events').insert({
        user_id: userId,
        promotion_id: promotionId,
        event_type: 'share',
        event_data: {
          type: 'copy_link',
        },
      });
    }
  } catch (error: any) {
    console.error('Error copying link:', error);
    Alert.alert('Error', 'Failed to copy link');
  }
};

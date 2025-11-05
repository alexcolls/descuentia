import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';

// Create a new Expo SDK client
const expo = new Expo();

export interface PushToken {
  user_id: string;
  token: string;
  platform: string;
}

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: 'default' | null;
  badge?: number;
  priority?: 'default' | 'normal' | 'high';
  channelId?: string;
}

/**
 * Send push notification to a single user
 */
export const sendPushNotification = async (
  pushToken: string,
  payload: NotificationPayload
): Promise<ExpoPushTicket | null> => {
  // Check that the token is valid
  if (!Expo.isExpoPushToken(pushToken)) {
    console.error(`Push token ${pushToken} is not a valid Expo push token`);
    return null;
  }

  const message: ExpoPushMessage = {
    to: pushToken,
    sound: payload.sound || 'default',
    title: payload.title,
    body: payload.body,
    data: payload.data,
    badge: payload.badge,
    priority: payload.priority || 'high',
    channelId: payload.channelId || 'default',
  };

  try {
    const ticketChunk = await expo.sendPushNotificationsAsync([message]);
    return ticketChunk[0];
  } catch (error) {
    console.error('Error sending push notification:', error);
    return null;
  }
};

/**
 * Send push notifications to multiple users
 */
export const sendBulkPushNotifications = async (
  tokens: string[],
  payload: NotificationPayload
): Promise<ExpoPushTicket[]> => {
  const messages: ExpoPushMessage[] = tokens
    .filter((token) => Expo.isExpoPushToken(token))
    .map((token) => ({
      to: token,
      sound: payload.sound || 'default',
      title: payload.title,
      body: payload.body,
      data: payload.data,
      badge: payload.badge,
      priority: payload.priority || 'high',
      channelId: payload.channelId || 'default',
    }));

  // Chunk messages for Expo's API limit
  const chunks = expo.chunkPushNotifications(messages);
  const tickets: ExpoPushTicket[] = [];

  for (const chunk of chunks) {
    try {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error('Error sending push notification chunk:', error);
    }
  }

  return tickets;
};

/**
 * Notification templates for different events
 */
export const NotificationTemplates = {
  // Consumer notifications
  newPromotionNearby: (businessName: string, discount: string) => ({
    title: '🎉 New Deal Nearby!',
    body: `${businessName} just posted ${discount} off! Check it out now.`,
    data: { type: 'new_promotion' },
  }),

  couponExpiringSoon: (businessName: string, hours: number) => ({
    title: '⏰ Coupon Expiring Soon',
    body: `Your coupon for ${businessName} expires in ${hours} hours. Use it before it's gone!`,
    data: { type: 'coupon_expiring' },
  }),

  loyaltyRewardEarned: (points: number, businessName: string) => ({
    title: '💎 Points Earned!',
    body: `You earned ${points} points at ${businessName}. Check your loyalty rewards!`,
    data: { type: 'loyalty_reward' },
  }),

  loyaltyTierUpgrade: (newTier: string, businessName: string) => ({
    title: '🏆 Tier Upgrade!',
    body: `Congratulations! You've reached ${newTier} tier at ${businessName}!`,
    data: { type: 'tier_upgrade' },
  }),

  specialOffer: (title: string, description: string) => ({
    title: `🌟 ${title}`,
    body: description,
    data: { type: 'special_offer' },
  }),

  // Merchant notifications
  couponRedeemed: (customerName: string, promotionTitle: string) => ({
    title: '✅ Coupon Redeemed',
    body: `${customerName} just redeemed "${promotionTitle}"`,
    data: { type: 'redemption' },
  }),

  dailySummary: (redemptions: number, newMembers: number) => ({
    title: '📊 Daily Summary',
    body: `Today: ${redemptions} redemptions, ${newMembers} new loyalty members`,
    data: { type: 'daily_summary' },
  }),

  milestoneAchieved: (milestone: string) => ({
    title: '🎯 Milestone Achieved!',
    body: milestone,
    data: { type: 'milestone' },
  }),

  subscriptionRenewal: (plan: string, amount: number) => ({
    title: '💳 Subscription Renewal',
    body: `Your ${plan} plan will renew for €${amount} in 3 days`,
    data: { type: 'subscription' },
  }),

  subscriptionUpgraded: (newPlan: string) => ({
    title: '🎉 Subscription Upgraded',
    body: `Welcome to ${newPlan}! Your new features are now active.`,
    data: { type: 'subscription' },
  }),

  lowPromotionLimit: (current: number, limit: number) => ({
    title: '⚠️ Promotion Limit',
    body: `You have ${current} of ${limit} active promotions. Upgrade for more!`,
    data: { type: 'subscription' },
  }),
};

/**
 * Helpers for common notification scenarios
 */
export const sendNewPromotionNotification = async (
  userTokens: string[],
  businessName: string,
  discount: string
): Promise<ExpoPushTicket[]> => {
  const payload = NotificationTemplates.newPromotionNearby(businessName, discount);
  return await sendBulkPushNotifications(userTokens, payload);
};

export const sendCouponExpiringNotification = async (
  userToken: string,
  businessName: string,
  hours: number
): Promise<ExpoPushTicket | null> => {
  const payload = NotificationTemplates.couponExpiringSoon(businessName, hours);
  return await sendPushNotification(userToken, payload);
};

export const sendLoyaltyRewardNotification = async (
  userToken: string,
  points: number,
  businessName: string
): Promise<ExpoPushTicket | null> => {
  const payload = NotificationTemplates.loyaltyRewardEarned(points, businessName);
  return await sendPushNotification(userToken, payload);
};

export const sendRedemptionNotification = async (
  merchantToken: string,
  customerName: string,
  promotionTitle: string
): Promise<ExpoPushTicket | null> => {
  const payload = NotificationTemplates.couponRedeemed(customerName, promotionTitle);
  return await sendPushNotification(merchantToken, payload);
};

export const sendDailySummaryNotification = async (
  merchantToken: string,
  redemptions: number,
  newMembers: number
): Promise<ExpoPushTicket | null> => {
  const payload = NotificationTemplates.dailySummary(redemptions, newMembers);
  return await sendPushNotification(merchantToken, payload);
};

export const sendMilestoneNotification = async (
  merchantToken: string,
  milestone: string
): Promise<ExpoPushTicket | null> => {
  const payload = NotificationTemplates.milestoneAchieved(milestone);
  return await sendPushNotification(merchantToken, payload);
};

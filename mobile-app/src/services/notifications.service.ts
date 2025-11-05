import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { supabase } from './supabase.service';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export interface NotificationPermissionStatus {
  granted: boolean;
  canAskAgain: boolean;
}

/**
 * Request notification permissions
 */
export const requestNotificationPermissions =
  async (): Promise<NotificationPermissionStatus> => {
    if (!Device.isDevice) {
      return { granted: false, canAskAgain: false };
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF6B6B',
      });
    }

    return {
      granted: finalStatus === 'granted',
      canAskAgain: existingStatus !== 'denied',
    };
  };

/**
 * Get Expo push token
 */
export const registerForPushNotifications = async (): Promise<string | null> => {
  if (!Device.isDevice) {
    console.log('Push notifications only work on physical devices');
    return null;
  }

  try {
    const { granted } = await requestNotificationPermissions();

    if (!granted) {
      console.log('Notification permissions not granted');
      return null;
    }

    const token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PROJECT_ID || 'your-project-id',
      })
    ).data;

    return token;
  } catch (error) {
    console.error('Error registering for push notifications:', error);
    return null;
  }
};

/**
 * Save push token to database
 */
export const savePushToken = async (userId: string, token: string): Promise<void> => {
  try {
    // Check if token already exists
    const { data: existing } = await supabase
      .from('push_tokens')
      .select('id')
      .eq('user_id', userId)
      .eq('token', token)
      .single();

    if (existing) {
      // Update last_used_at
      await supabase
        .from('push_tokens')
        .update({ last_used_at: new Date().toISOString() })
        .eq('id', existing.id);
    } else {
      // Insert new token
      await supabase.from('push_tokens').insert([
        {
          user_id: userId,
          token,
          platform: Platform.OS,
          device_info: {
            brand: Device.brand,
            modelName: Device.modelName,
            osName: Device.osName,
            osVersion: Device.osVersion,
          },
        },
      ]);
    }
  } catch (error) {
    console.error('Error saving push token:', error);
  }
};

/**
 * Remove push token from database
 */
export const removePushToken = async (userId: string, token: string): Promise<void> => {
  try {
    await supabase.from('push_tokens').delete().eq('user_id', userId).eq('token', token);
  } catch (error) {
    console.error('Error removing push token:', error);
  }
};

/**
 * Schedule local notification
 */
export const scheduleLocalNotification = async (
  title: string,
  body: string,
  data?: Record<string, any>,
  seconds: number = 0
): Promise<string> => {
  const trigger = seconds > 0 ? { seconds } : null;

  return await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      sound: true,
    },
    trigger,
  });
};

/**
 * Cancel scheduled notification
 */
export const cancelScheduledNotification = async (
  notificationId: string
): Promise<void> => {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
};

/**
 * Cancel all scheduled notifications
 */
export const cancelAllScheduledNotifications = async (): Promise<void> => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

/**
 * Get badge count
 */
export const getBadgeCount = async (): Promise<number> => {
  return await Notifications.getBadgeCountAsync();
};

/**
 * Set badge count
 */
export const setBadgeCount = async (count: number): Promise<void> => {
  await Notifications.setBadgeCountAsync(count);
};

/**
 * Clear badge
 */
export const clearBadge = async (): Promise<void> => {
  await Notifications.setBadgeCountAsync(0);
};

/**
 * Add notification received listener
 */
export const addNotificationReceivedListener = (
  callback: (notification: Notifications.Notification) => void
): Notifications.Subscription => {
  return Notifications.addNotificationReceivedListener(callback);
};

/**
 * Add notification response listener (when user taps notification)
 */
export const addNotificationResponseListener = (
  callback: (response: Notifications.NotificationResponse) => void
): Notifications.Subscription => {
  return Notifications.addNotificationResponseReceivedListener(callback);
};

/**
 * Get notification categories for settings
 */
export const getNotificationCategories = () => {
  return {
    consumer: [
      { id: 'new_promotions', label: 'New Promotions Nearby', default: true },
      { id: 'coupon_expiring', label: 'Coupon Expiring Soon', default: true },
      { id: 'loyalty_rewards', label: 'Loyalty Rewards Earned', default: true },
      { id: 'special_offers', label: 'Special Offers', default: true },
    ],
    merchant: [
      { id: 'redemptions', label: 'Customer Redemptions', default: true },
      { id: 'daily_summary', label: 'Daily Summary', default: true },
      { id: 'milestones', label: 'Milestone Achievements', default: true },
      { id: 'subscription', label: 'Subscription Updates', default: true },
    ],
  };
};

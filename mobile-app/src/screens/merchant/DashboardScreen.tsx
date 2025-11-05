import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '@store/index';
import { supabase } from '@services/supabase';

interface DashboardScreenProps {
  navigation: any;
}

interface Stats {
  activePromotions: number;
  totalRedemptions: number;
  todayRedemptions: number;
  totalViews: number;
  totalClaims: number;
  totalShares: number;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const { profile, user } = useAppSelector((state) => state.auth);
  const [stats, setStats] = useState<Stats>({
    activePromotions: 0,
    totalRedemptions: 0,
    todayRedemptions: 0,
    totalViews: 0,
    totalClaims: 0,
    totalShares: 0,
  });
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      setIsLoading(true);

      // Get merchant's business
      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .select('id')
        .eq('owner_id', user.id)
        .single();

      if (businessError) {
        console.error('Error loading business:', businessError);
        return;
      }

      if (!business) {
        Alert.alert(
          'No Business Found',
          'Please complete your business profile first.',
          [
            {
              text: 'Setup Business',
              onPress: () => navigation.navigate('BusinessSetup'),
            },
          ]
        );
        return;
      }

      setBusinessId(business.id);

      // Load stats
      await loadStats(business.id);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async (bizId: string) => {
    try {
      // Active promotions count
      const { count: activeCount } = await supabase
        .from('promotions')
        .select('*', { count: 'exact', head: true })
        .eq('business_id', bizId)
        .eq('status', 'active');

      // Total redemptions
      const { count: redemptionsCount } = await supabase
        .from('coupons')
        .select('*, promotion:promotions!inner(business_id)', {
          count: 'exact',
          head: true,
        })
        .eq('promotion.business_id', bizId)
        .eq('status', 'redeemed');

      // Today's redemptions
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: todayCount } = await supabase
        .from('coupons')
        .select('*, promotion:promotions!inner(business_id)', {
          count: 'exact',
          head: true,
        })
        .eq('promotion.business_id', bizId)
        .eq('status', 'redeemed')
        .gte('redeemed_at', today.toISOString());

      // Analytics events
      const { data: promotionIds } = await supabase
        .from('promotions')
        .select('id')
        .eq('business_id', bizId);

      const ids = promotionIds?.map((p) => p.id) || [];

      let viewsCount = 0;
      let claimsCount = 0;
      let sharesCount = 0;

      if (ids.length > 0) {
        const { count: views } = await supabase
          .from('analytics_events')
          .select('*', { count: 'exact', head: true })
          .in('promotion_id', ids)
          .eq('event_type', 'view');

        const { count: claims } = await supabase
          .from('analytics_events')
          .select('*', { count: 'exact', head: true })
          .in('promotion_id', ids)
          .eq('event_type', 'claim');

        const { count: shares } = await supabase
          .from('analytics_events')
          .select('*', { count: 'exact', head: true })
          .in('promotion_id', ids)
          .eq('event_type', 'share');

        viewsCount = views || 0;
        claimsCount = claims || 0;
        sharesCount = shares || 0;
      }

      setStats({
        activePromotions: activeCount || 0,
        totalRedemptions: redemptionsCount || 0,
        todayRedemptions: todayCount || 0,
        totalViews: viewsCount,
        totalClaims: claimsCount,
        totalShares: sharesCount,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    if (businessId) {
      await loadStats(businessId);
    }
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-600">Loading dashboard...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View className="bg-primary px-6 py-8">
          <Text className="text-white/80 text-sm mb-1">Welcome back,</Text>
          <Text className="text-white text-2xl font-bold">
            {profile?.full_name || 'Merchant'}
          </Text>
          <Text className="text-white/90 text-sm mt-2">
            {profile?.business_name || 'Business Dashboard'}
          </Text>
        </View>

        {/* Stats Grid */}
        <View className="px-4 -mt-6 mb-6">
          <View className="bg-white rounded-2xl shadow-lg p-4">
            {/* Top Row */}
            <View className="flex-row mb-4">
              <View className="flex-1 items-center py-3 border-r border-gray-200">
                <Text className="text-3xl font-bold text-primary">
                  {stats.activePromotions}
                </Text>
                <Text className="text-gray-600 text-xs mt-1">Active</Text>
                <Text className="text-gray-600 text-xs">Promotions</Text>
              </View>
              <View className="flex-1 items-center py-3">
                <Text className="text-3xl font-bold text-green-600">
                  {stats.totalRedemptions}
                </Text>
                <Text className="text-gray-600 text-xs mt-1">Total</Text>
                <Text className="text-gray-600 text-xs">Redeemed</Text>
              </View>
            </View>

            {/* Bottom Row */}
            <View className="flex-row pt-4 border-t border-gray-200">
              <View className="flex-1 items-center py-2">
                <Text className="text-xl font-bold text-orange-600">
                  {stats.todayRedemptions}
                </Text>
                <Text className="text-gray-600 text-xs mt-1">Today</Text>
              </View>
              <View className="flex-1 items-center py-2 border-l border-gray-200">
                <Text className="text-xl font-bold text-blue-600">
                  {stats.totalViews}
                </Text>
                <Text className="text-gray-600 text-xs mt-1">Views</Text>
              </View>
              <View className="flex-1 items-center py-2 border-l border-gray-200">
                <Text className="text-xl font-bold text-purple-600">
                  {stats.totalClaims}
                </Text>
                <Text className="text-gray-600 text-xs mt-1">Claims</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">
            Quick Actions
          </Text>
          <View className="flex-row flex-wrap">
            {/* Create Promotion */}
            <TouchableOpacity
              onPress={() => navigation.navigate('CreatePromotion')}
              className="w-1/2 p-2"
            >
              <View className="bg-primary rounded-2xl p-6 items-center">
                <Text className="text-4xl mb-2">➕</Text>
                <Text className="text-white font-semibold text-center">
                  New Promotion
                </Text>
              </View>
            </TouchableOpacity>

            {/* Scan QR */}
            <TouchableOpacity
              onPress={() =>
                Alert.alert('Coming Soon', 'QR scanner coming soon!')
              }
              className="w-1/2 p-2"
            >
              <View className="bg-green-500 rounded-2xl p-6 items-center">
                <Text className="text-4xl mb-2">📷</Text>
                <Text className="text-white font-semibold text-center">
                  Scan QR
                </Text>
              </View>
            </TouchableOpacity>

            {/* My Promotions */}
            <TouchableOpacity
              onPress={() =>
                Alert.alert('Coming Soon', 'Promotions list coming soon!')
              }
              className="w-1/2 p-2"
            >
              <View className="bg-blue-500 rounded-2xl p-6 items-center">
                <Text className="text-4xl mb-2">🎯</Text>
                <Text className="text-white font-semibold text-center">
                  My Promotions
                </Text>
              </View>
            </TouchableOpacity>

            {/* Analytics */}
            <TouchableOpacity
              onPress={() =>
                Alert.alert('Coming Soon', 'Analytics coming soon!')
              }
              className="w-1/2 p-2"
            >
              <View className="bg-purple-500 rounded-2xl p-6 items-center">
                <Text className="text-4xl mb-2">📊</Text>
                <Text className="text-white font-semibold text-center">
                  Analytics
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Activity */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-3">
            Recent Activity
          </Text>
          <View className="bg-white rounded-2xl shadow-md p-4">
            <Text className="text-gray-600 text-sm text-center py-8">
              No recent activity to display
            </Text>
          </View>
        </View>

        {/* Tips */}
        <View className="px-4 mb-8">
          <View className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
            <Text className="text-blue-900 font-bold text-base mb-2">
              💡 Pro Tip
            </Text>
            <Text className="text-blue-800 text-sm leading-6">
              Create weekly special promotions to drive more foot traffic to your
              business. Featured promotions get up to 3x more visibility!
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
  Image,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '@store/index';
import { fetchUserCoupons } from '@store/slices/couponsSlice';
import { CouponWithDetails } from '@store/slices/couponsSlice';
import { getTimeUntilExpiration, isCouponExpired } from '@services/coupon';

interface CouponsScreenProps {
  navigation: any;
}

export const CouponsScreen: React.FC<CouponsScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { activeCoupons, redeemedCoupons, isLoading } = useAppSelector(
    (state) => state.coupons
  );
  const { user } = useAppSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState<'active' | 'redeemed'>('active');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserCoupons(user.id));
    }
  }, [user, dispatch]);

  const handleRefresh = async () => {
    if (user) {
      setRefreshing(true);
      await dispatch(fetchUserCoupons(user.id));
      setRefreshing(false);
    }
  };

  const handleCouponPress = (coupon: CouponWithDetails) => {
    navigation.navigate('CouponDetail', { couponId: coupon.id });
  };

  const renderCouponCard = ({ item }: { item: CouponWithDetails }) => {
    const isExpired = isCouponExpired(item);
    const timeLeft = getTimeUntilExpiration(item);
    
    const discountText =
      item.promotion.discount_type === 'percentage'
        ? `-${item.promotion.discount_value}%`
        : item.promotion.discount_type === 'fixed'
        ? `-€${item.promotion.discount_value}`
        : item.promotion.special_offer_text || 'Special Offer';

    return (
      <TouchableOpacity
        onPress={() => handleCouponPress(item)}
        className="bg-white rounded-2xl shadow-md mb-4 mx-4 overflow-hidden"
      >
        <View className="flex-row">
          {/* Image/Icon Section */}
          <View className="w-24 h-24 bg-gray-200 items-center justify-center">
            {item.promotion.image_url ? (
              <Image
                source={{ uri: item.promotion.image_url }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <Text className="text-3xl">
                {item.promotion.business.category === 'restaurant'
                  ? '🍽️'
                  : item.promotion.business.category === 'retail'
                  ? '🛍️'
                  : item.promotion.business.category === 'services'
                  ? '✨'
                  : item.promotion.business.category === 'entertainment'
                  ? '🎭'
                  : '🏪'}
              </Text>
            )}
          </View>

          {/* Content Section */}
          <View className="flex-1 p-4">
            {/* Discount Badge */}
            <View className="flex-row items-center justify-between mb-2">
              <View className="bg-primary px-3 py-1 rounded-full">
                <Text className="text-white font-bold text-sm">
                  {discountText}
                </Text>
              </View>
              
              {/* Status Badge */}
              <View
                className={`px-2 py-1 rounded-full ${
                  isExpired
                    ? 'bg-gray-200'
                    : item.status === 'redeemed'
                    ? 'bg-green-100'
                    : 'bg-orange-100'
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    isExpired
                      ? 'text-gray-600'
                      : item.status === 'redeemed'
                      ? 'text-green-800'
                      : 'text-orange-800'
                  }`}
                >
                  {isExpired
                    ? 'Expired'
                    : item.status === 'redeemed'
                    ? 'Redeemed'
                    : 'Active'}
                </Text>
              </View>
            </View>

            {/* Title */}
            <Text
              className="text-base font-semibold text-gray-900 mb-1"
              numberOfLines={1}
            >
              {item.promotion.title}
            </Text>

            {/* Business Name */}
            <Text className="text-sm text-gray-600 mb-2" numberOfLines={1}>
              {item.promotion.business.name}
            </Text>

            {/* Time Info */}
            {item.status === 'claimed' && !isExpired && (
              <View className="flex-row items-center">
                <Text className="text-xs text-orange-600">⏰ {timeLeft}</Text>
              </View>
            )}
            {item.status === 'redeemed' && item.redeemed_at && (
              <Text className="text-xs text-green-600">
                ✅ Used on{' '}
                {new Date(item.redeemed_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const displayCoupons = activeTab === 'active' ? activeCoupons : redeemedCoupons;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-4 py-4 bg-white border-b border-gray-200">
        <Text className="text-2xl font-bold text-gray-900">My Coupons</Text>
        <Text className="text-sm text-gray-600 mt-1">
          {activeCoupons.length} active • {redeemedCoupons.length} redeemed
        </Text>
      </View>

      {/* Tabs */}
      <View className="flex-row bg-white px-4 py-2 border-b border-gray-200">
        <TouchableOpacity
          onPress={() => setActiveTab('active')}
          className={`flex-1 py-3 rounded-lg mr-2 ${
            activeTab === 'active' ? 'bg-primary' : 'bg-gray-100'
          }`}
        >
          <Text
            className={`text-center font-semibold ${
              activeTab === 'active' ? 'text-white' : 'text-gray-600'
            }`}
          >
            Active ({activeCoupons.length})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setActiveTab('redeemed')}
          className={`flex-1 py-3 rounded-lg ml-2 ${
            activeTab === 'redeemed' ? 'bg-primary' : 'bg-gray-100'
          }`}
        >
          <Text
            className={`text-center font-semibold ${
              activeTab === 'redeemed' ? 'text-white' : 'text-gray-600'
            }`}
          >
            Redeemed ({redeemedCoupons.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Coupons List */}
      {isLoading && !refreshing ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text className="text-gray-600 mt-4">Loading coupons...</Text>
        </View>
      ) : displayCoupons.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-6xl mb-4">
            {activeTab === 'active' ? '🎫' : '✅'}
          </Text>
          <Text className="text-xl font-bold text-gray-900 text-center mb-2">
            {activeTab === 'active'
              ? 'No Active Coupons'
              : 'No Redeemed Coupons'}
          </Text>
          <Text className="text-gray-600 text-center">
            {activeTab === 'active'
              ? 'Start claiming promotions to see your coupons here!'
              : 'Coupons you use will appear here'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={displayCoupons}
          renderItem={renderCouponCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 16 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#FF6B6B']}
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
  Linking,
  Alert,
  Dimensions,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useAppDispatch, useAppSelector } from '@store/index';
import { fetchCouponDetails, clearSelectedCoupon } from '@store/slices/couponsSlice';
import { getTimeUntilExpiration, isCouponExpired } from '@services/coupon';
import { Button } from '@components/shared/Button';
import { shareCoupon } from '@utils/share';

const { width } = Dimensions.get('window');
const QR_SIZE = Math.min(width * 0.7, 280);

interface CouponDetailScreenProps {
  navigation: any;
  route: {
    params: {
      couponId: string;
    };
  };
}

export const CouponDetailScreen: React.FC<CouponDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const dispatch = useAppDispatch();
  const { couponId } = route.params;
  
  const { selectedCoupon, isLoading } = useAppSelector((state) => state.coupons);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchCouponDetails(couponId));
    
    return () => {
      dispatch(clearSelectedCoupon());
    };
  }, [couponId, dispatch]);

  const handleGetDirections = () => {
    if (selectedCoupon) {
      const { latitude, longitude } = selectedCoupon.promotion.business;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      Linking.openURL(url);
    }
  };

  const handleCallBusiness = () => {
    if (selectedCoupon?.promotion.business.phone) {
      Linking.openURL(`tel:${selectedCoupon.promotion.business.phone}`);
    } else {
      Alert.alert('Not Available', 'Phone number not available');
    }
  };

  const handleShare = async () => {
    if (!selectedCoupon) return;

    await shareCoupon(
      selectedCoupon.qr_code,
      selectedCoupon.promotion.title,
      selectedCoupon.promotion.business.name,
      user?.id
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading || !selectedCoupon) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text className="text-gray-600 mt-4">Loading coupon...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isExpired = isCouponExpired(selectedCoupon);
  const timeUntilExpiration = getTimeUntilExpiration(selectedCoupon);
  
  const discountText =
    selectedCoupon.promotion.discount_type === 'percentage'
      ? `-${selectedCoupon.promotion.discount_value}%`
      : selectedCoupon.promotion.discount_type === 'fixed'
      ? `-€${selectedCoupon.promotion.discount_value}`
      : selectedCoupon.promotion.special_offer_text || 'Special Offer';

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header Image */}
        <View className="relative">
          {selectedCoupon.promotion.image_url ? (
            <Image
              source={{ uri: selectedCoupon.promotion.image_url }}
              className="w-full h-48"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-48 bg-gray-200 items-center justify-center">
              <Text className="text-5xl">
                {selectedCoupon.promotion.business.category === 'restaurant'
                  ? '🍽️'
                  : selectedCoupon.promotion.business.category === 'retail'
                  ? '🛍️'
                  : selectedCoupon.promotion.business.category === 'services'
                  ? '✨'
                  : selectedCoupon.promotion.business.category === 'entertainment'
                  ? '🎭'
                  : '🏪'}
              </Text>
            </View>
          )}
          
          {/* Back Button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="absolute top-4 left-4 bg-white p-3 rounded-full shadow-lg"
          >
            <Text className="text-gray-800 font-bold">←</Text>
          </TouchableOpacity>

          {/* Share Button */}
          {selectedCoupon.status === 'claimed' && !isExpired && (
            <TouchableOpacity
              onPress={handleShare}
              className="absolute top-4 left-16 bg-white p-3 rounded-full shadow-lg"
            >
              <Text className="text-gray-800 font-bold">📤</Text>
            </TouchableOpacity>
          )}

          {/* Status Badge */}
          <View
            className={`absolute top-4 right-4 px-4 py-2 rounded-full shadow-lg ${
              isExpired
                ? 'bg-gray-500'
                : selectedCoupon.status === 'redeemed'
                ? 'bg-green-500'
                : 'bg-primary'
            }`}
          >
            <Text className="text-white font-bold text-sm">
              {isExpired
                ? 'EXPIRED'
                : selectedCoupon.status === 'redeemed'
                ? 'REDEEMED'
                : 'ACTIVE'}
            </Text>
          </View>
        </View>

        {/* Content */}
        <View className="p-6">
          {/* Discount Badge */}
          <View className="items-center mb-6">
            <View className="bg-primary px-6 py-3 rounded-full">
              <Text className="text-white font-bold text-2xl">{discountText}</Text>
            </View>
          </View>

          {/* Title */}
          <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
            {selectedCoupon.promotion.title}
          </Text>

          {/* Business Info */}
          <Text className="text-lg text-gray-700 mb-6 text-center">
            {selectedCoupon.promotion.business.name}
          </Text>

          {/* QR Code Section */}
          {selectedCoupon.status === 'claimed' && !isExpired && (
            <View className="items-center mb-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
              <Text className="text-sm font-semibold text-gray-700 mb-4">
                Show this QR code to redeem
              </Text>
              
              <View className="p-4 bg-white rounded-xl">
                <QRCode
                  value={selectedCoupon.qr_code}
                  size={QR_SIZE}
                  backgroundColor="white"
                  color="black"
                />
              </View>
              
              <Text className="text-xs text-gray-500 mt-4 text-center">
                Code: {selectedCoupon.qr_code}
              </Text>
            </View>
          )}

          {/* Expiration Info */}
          <View
            className={`mb-6 p-4 rounded-xl ${
              isExpired
                ? 'bg-red-50'
                : selectedCoupon.status === 'redeemed'
                ? 'bg-green-50'
                : 'bg-orange-50'
            }`}
          >
            {selectedCoupon.status === 'redeemed' ? (
              <View>
                <Text className="text-sm text-green-800 font-semibold">
                  ✅ Redeemed
                </Text>
                {selectedCoupon.redeemed_at && (
                  <Text className="text-xs text-green-700 mt-1">
                    {formatDate(selectedCoupon.redeemed_at)}
                  </Text>
                )}
              </View>
            ) : isExpired ? (
              <Text className="text-sm text-red-800 font-semibold">
                ⚠️ This coupon has expired
              </Text>
            ) : (
              <View>
                <Text className="text-sm text-orange-800 font-semibold">
                  ⏰ {timeUntilExpiration}
                </Text>
                <Text className="text-xs text-orange-700 mt-1">
                  Claimed: {formatDate(selectedCoupon.claimed_at)}
                </Text>
              </View>
            )}
          </View>

          {/* Description */}
          {selectedCoupon.promotion.description && (
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-900 mb-2">
                About This Offer
              </Text>
              <Text className="text-base text-gray-600 leading-6">
                {selectedCoupon.promotion.description}
              </Text>
            </View>
          )}

          {/* Terms & Conditions */}
          {selectedCoupon.promotion.terms_conditions && (
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-900 mb-2">
                Terms & Conditions
              </Text>
              <Text className="text-sm text-gray-600 leading-5">
                {selectedCoupon.promotion.terms_conditions}
              </Text>
            </View>
          )}

          {/* Business Details */}
          <View className="mb-6 p-4 bg-gray-50 rounded-xl">
            <Text className="text-sm font-semibold text-gray-900 mb-3">
              Business Information
            </Text>
            
            {selectedCoupon.promotion.business.address && (
              <View className="flex-row mb-2">
                <Text className="text-gray-600 mr-2">📍</Text>
                <Text className="flex-1 text-sm text-gray-700">
                  {selectedCoupon.promotion.business.address}
                </Text>
              </View>
            )}
            
            {selectedCoupon.promotion.business.phone && (
              <TouchableOpacity
                onPress={handleCallBusiness}
                className="flex-row mb-2"
              >
                <Text className="text-gray-600 mr-2">📞</Text>
                <Text className="flex-1 text-sm text-primary underline">
                  {selectedCoupon.promotion.business.phone}
                </Text>
              </TouchableOpacity>
            )}
            
            <View className="flex-row">
              <Text className="text-gray-600 mr-2">🏷️</Text>
              <Text className="flex-1 text-sm text-gray-700 capitalize">
                {selectedCoupon.promotion.business.category}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          {selectedCoupon.status === 'claimed' && !isExpired && (
            <View className="flex-row space-x-3">
              <View className="flex-1 mr-2">
                <Button
                  title="Get Directions"
                  onPress={handleGetDirections}
                  variant="outline"
                  size="large"
                />
              </View>
              <View className="flex-1 ml-2">
                <Button
                  title="Share"
                  onPress={handleShare}
                  variant="outline"
                  size="large"
                />
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

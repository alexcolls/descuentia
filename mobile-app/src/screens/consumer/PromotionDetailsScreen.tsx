import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import { useAppDispatch, useAppSelector } from '@store/index';
import { fetchPromotionById } from '@store/slices/promotionsSlice';
import { formatDistance } from '@services/location';
import { Button } from '@components/shared/Button';

interface PromotionDetailsScreenProps {
  navigation: any;
  route: {
    params: {
      promotionId: string;
    };
  };
}

export const PromotionDetailsScreen: React.FC<PromotionDetailsScreenProps> = ({
  navigation,
  route,
}) => {
  const dispatch = useAppDispatch();
  const { promotionId } = route.params;
  
  const { promotions, isLoading } = useAppSelector((state) => state.promotions);
  const [promotion, setPromotion] = useState(
    promotions.find((p) => p.id === promotionId)
  );

  useEffect(() => {
    if (!promotion) {
      dispatch(fetchPromotionById(promotionId))
        .unwrap()
        .then((data) => setPromotion(data))
        .catch((error) => {
          Alert.alert('Error', 'Failed to load promotion details');
          navigation.goBack();
        });
    }
  }, [promotionId]);

  const handleClaimOffer = () => {
    // TODO: Navigate to coupon claiming screen
    Alert.alert('Coming Soon', 'Coupon claiming feature will be available soon!');
  };

  const handleGetDirections = () => {
    if (promotion) {
      const { latitude, longitude } = promotion.business;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
      Linking.openURL(url);
    }
  };

  const handleCallBusiness = () => {
    if (promotion?.business.phone) {
      Linking.openURL(`tel:${promotion.business.phone}`);
    } else {
      Alert.alert('Not Available', 'Phone number not available');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading || !promotion) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text className="text-gray-600 mt-4">Loading promotion...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const discountText =
    promotion.discount_type === 'percentage'
      ? `-${promotion.discount_value}%`
      : promotion.discount_type === 'fixed'
      ? `-€${promotion.discount_value}`
      : promotion.special_offer_text || 'Special Offer';

  const typeLabel =
    promotion.type === 'weekly_special'
      ? 'Weekly Special'
      : promotion.type === 'time_based'
      ? 'Limited Time'
      : 'Always Available';

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Header Image */}
        <View className="relative">
          {promotion.image_url ? (
            <Image
              source={{ uri: promotion.image_url }}
              className="w-full h-64"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-64 bg-gray-200 items-center justify-center">
              <Text className="text-6xl">
                {promotion.business.category === 'restaurant'
                  ? '🍽️'
                  : promotion.business.category === 'retail'
                  ? '🛍️'
                  : promotion.business.category === 'services'
                  ? '✨'
                  : promotion.business.category === 'entertainment'
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

          {/* Discount Badge */}
          <View className="absolute top-4 right-4 bg-primary px-4 py-2 rounded-full shadow-lg">
            <Text className="text-white font-bold text-lg">{discountText}</Text>
          </View>
        </View>

        {/* Content */}
        <View className="p-6">
          {/* Type Badge */}
          <View className="flex-row mb-3">
            <View
              className={`px-3 py-1 rounded-full ${
                promotion.type === 'weekly_special'
                  ? 'bg-purple-100'
                  : promotion.type === 'time_based'
                  ? 'bg-orange-100'
                  : 'bg-green-100'
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  promotion.type === 'weekly_special'
                    ? 'text-purple-800'
                    : promotion.type === 'time_based'
                    ? 'text-orange-800'
                    : 'text-green-800'
                }`}
              >
                {typeLabel}
              </Text>
            </View>
          </View>

          {/* Title */}
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            {promotion.title}
          </Text>

          {/* Business Info */}
          <View className="flex-row items-center mb-4">
            <Text className="text-lg text-gray-700">{promotion.business.name}</Text>
            {promotion.distance && (
              <Text className="text-sm text-gray-500 ml-2">
                • {formatDistance(promotion.distance)}
              </Text>
            )}
          </View>

          {/* Description */}
          {promotion.description && (
            <View className="mb-6">
              <Text className="text-base text-gray-600 leading-6">
                {promotion.description}
              </Text>
            </View>
          )}

          {/* Expiration Date */}
          {promotion.type === 'time_based' && promotion.end_date && (
            <View className="mb-6 p-4 bg-orange-50 rounded-xl">
              <Text className="text-sm text-orange-800">
                ⏰ Offer expires on {formatDate(promotion.end_date)}
              </Text>
            </View>
          )}

          {/* Terms & Conditions */}
          {promotion.terms_conditions && (
            <View className="mb-6">
              <Text className="text-sm font-semibold text-gray-900 mb-2">
                Terms & Conditions
              </Text>
              <Text className="text-sm text-gray-600 leading-5">
                {promotion.terms_conditions}
              </Text>
            </View>
          )}

          {/* Business Details */}
          <View className="mb-6 p-4 bg-gray-50 rounded-xl">
            <Text className="text-sm font-semibold text-gray-900 mb-3">
              Business Information
            </Text>
            
            {promotion.business.address && (
              <View className="flex-row mb-2">
                <Text className="text-gray-600 mr-2">📍</Text>
                <Text className="flex-1 text-sm text-gray-700">
                  {promotion.business.address}
                </Text>
              </View>
            )}
            
            {promotion.business.phone && (
              <TouchableOpacity
                onPress={handleCallBusiness}
                className="flex-row mb-2"
              >
                <Text className="text-gray-600 mr-2">📞</Text>
                <Text className="flex-1 text-sm text-primary underline">
                  {promotion.business.phone}
                </Text>
              </TouchableOpacity>
            )}
            
            <View className="flex-row">
              <Text className="text-gray-600 mr-2">🏷️</Text>
              <Text className="flex-1 text-sm text-gray-700 capitalize">
                {promotion.business.category}
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="space-y-3">
            <Button
              title="Claim This Offer"
              onPress={handleClaimOffer}
              size="large"
            />
            
            <Button
              title="Get Directions"
              onPress={handleGetDirections}
              variant="outline"
              size="large"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

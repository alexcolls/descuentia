import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { PromotionWithBusiness } from '@store/slices/promotionsSlice';
import { formatDistance } from '@services/location';

interface PromotionCardProps {
  promotion: PromotionWithBusiness;
  onPress?: () => void;
}

export const PromotionCard: React.FC<PromotionCardProps> = ({ promotion, onPress }) => {
  const { business, distance, discount_type, discount_value, special_offer_text, type } = promotion;

  // Get discount display text
  const getDiscountText = () => {
    if (discount_type === 'percentage' && discount_value) {
      return `-${discount_value}%`;
    } else if (discount_type === 'fixed_amount' && discount_value) {
      return `-€${discount_value}`;
    } else if (special_offer_text) {
      return special_offer_text;
    }
    return 'Special Offer';
  };

  // Get type badge
  const getTypeBadge = () => {
    switch (type) {
      case 'weekly_special':
        return { text: 'Weekly Special', color: 'bg-error' };
      case 'time_based':
        return { text: 'Limited Time', color: 'bg-warning' };
      case 'fixed':
        return { text: 'Always On', color: 'bg-success' };
      default:
        return { text: 'Offer', color: 'bg-primary' };
    }
  };

  const badge = getTypeBadge();

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-2xl shadow-lg mb-4 overflow-hidden"
      activeOpacity={0.7}
    >
      {/* Image */}
      {promotion.image_url ? (
        <Image
          source={{ uri: promotion.image_url }}
          className="w-full h-40"
          resizeMode="cover"
        />
      ) : (
        <View className="w-full h-40 bg-gray-200 items-center justify-center">
          <Text className="text-gray-400 text-4xl">🎁</Text>
        </View>
      )}

      {/* Type Badge */}
      <View className={`absolute top-3 left-3 ${badge.color} px-3 py-1 rounded-full`}>
        <Text className="text-white text-xs font-bold">{badge.text}</Text>
      </View>

      {/* Discount Badge */}
      <View className="absolute top-3 right-3 bg-primary px-4 py-2 rounded-full">
        <Text className="text-white text-lg font-bold">{getDiscountText()}</Text>
      </View>

      {/* Content */}
      <View className="p-4">
        {/* Business Name */}
        <Text className="text-gray-600 text-sm font-medium mb-1">{business.name}</Text>

        {/* Promotion Title */}
        <Text className="text-gray-900 text-lg font-bold mb-2" numberOfLines={2}>
          {promotion.title}
        </Text>

        {/* Description */}
        {promotion.description && (
          <Text className="text-gray-600 text-sm mb-3" numberOfLines={2}>
            {promotion.description}
          </Text>
        )}

        {/* Footer */}
        <View className="flex-row items-center justify-between">
          {/* Distance */}
          {distance !== undefined && (
            <View className="flex-row items-center">
              <Text className="text-gray-500 text-sm mr-1">📍</Text>
              <Text className="text-gray-700 text-sm font-medium">
                {formatDistance(distance)} away
              </Text>
            </View>
          )}

          {/* Category */}
          <View className="bg-gray-100 px-3 py-1 rounded-full">
            <Text className="text-gray-600 text-xs font-medium">{business.category}</Text>
          </View>
        </View>

        {/* Expiration (if applicable) */}
        {promotion.end_date && type === 'time_based' && (
          <View className="mt-3 pt-3 border-t border-gray-100">
            <Text className="text-gray-500 text-xs">
              ⏰ Ends: {new Date(promotion.end_date).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

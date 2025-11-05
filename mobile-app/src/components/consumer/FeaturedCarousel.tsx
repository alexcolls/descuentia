import React, { useRef } from 'react';
import { View, Text, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native';
import { PromotionWithBusiness } from '@store/slices/promotionsSlice';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.85;
const CARD_SPACING = 16;

interface FeaturedCarouselProps {
  promotions: PromotionWithBusiness[];
  onPromotionPress: (promotion: PromotionWithBusiness) => void;
}

export const FeaturedCarousel: React.FC<FeaturedCarouselProps> = ({
  promotions,
  onPromotionPress,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);

  if (promotions.length === 0) {
    return null;
  }

  return (
    <View className="mb-4">
      {/* Header */}
      <View className="px-4 mb-3">
        <Text className="text-xl font-bold text-gray-900">
          🔥 Featured This Week
        </Text>
        <Text className="text-sm text-gray-600 mt-1">
          Don't miss these amazing deals!
        </Text>
      </View>

      {/* Carousel */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_SPACING}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingHorizontal: (SCREEN_WIDTH - CARD_WIDTH) / 2,
          paddingRight: (SCREEN_WIDTH - CARD_WIDTH) / 2 + CARD_SPACING,
        }}
        className="flex-row"
      >
        {promotions.map((promotion, index) => (
          <FeaturedCard
            key={promotion.id}
            promotion={promotion}
            onPress={() => onPromotionPress(promotion)}
            isLast={index === promotions.length - 1}
          />
        ))}
      </ScrollView>
    </View>
  );
};

interface FeaturedCardProps {
  promotion: PromotionWithBusiness;
  onPress: () => void;
  isLast: boolean;
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({ promotion, onPress, isLast }) => {
  const { business, special_offer_text, discount_type, discount_value } = promotion;

  const getDiscountText = () => {
    if (discount_type === 'percentage' && discount_value) {
      return `-${discount_value}%`;
    } else if (discount_type === 'fixed_amount' && discount_value) {
      return `-€${discount_value}`;
    } else if (special_offer_text) {
      return special_offer_text;
    }
    return '2x1';
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        width: CARD_WIDTH,
        marginRight: isLast ? 0 : CARD_SPACING,
      }}
      className="rounded-3xl overflow-hidden shadow-xl"
    >
      {/* Background Image */}
      {promotion.image_url ? (
        <Image
          source={{ uri: promotion.image_url }}
          className="absolute inset-0 w-full h-full"
          resizeMode="cover"
        />
      ) : (
        <View className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary to-secondary" />
      )}

      {/* Gradient Overlay */}
      <View className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <View className="h-48 justify-end p-6">
        {/* Discount Badge */}
        <View className="absolute top-6 right-6 bg-accent px-6 py-3 rounded-2xl">
          <Text className="text-gray-900 text-2xl font-black">{getDiscountText()}</Text>
        </View>

        {/* Business Name */}
        <View className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full self-start mb-2">
          <Text className="text-white text-xs font-semibold">{business.name}</Text>
        </View>

        {/* Promotion Title */}
        <Text className="text-white text-2xl font-bold mb-2" numberOfLines={2}>
          {promotion.title}
        </Text>

        {/* CTA */}
        <View className="flex-row items-center">
          <Text className="text-white font-semibold">Claim Now</Text>
          <Text className="text-white ml-2">→</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

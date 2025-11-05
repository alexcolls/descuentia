import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Switch,
  Platform,
} from 'react-native';
import { useAppSelector } from '@store/index';
import { supabase } from '@services/supabase';
import { Button } from '@components/shared/Button';
import DateTimePicker from '@react-native-community/datetimepicker';

interface CreatePromotionScreenProps {
  navigation: any;
}

type PromotionType = 'time_based' | 'fixed' | 'weekly_special';
type DiscountType = 'percentage' | 'fixed' | 'special';

export const CreatePromotionScreen: React.FC<CreatePromotionScreenProps> = ({
  navigation,
}) => {
  const { user } = useAppSelector((state) => state.auth);

  // Form state
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<PromotionType>('fixed');
  const [discountType, setDiscountType] = useState<DiscountType>('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [specialOfferText, setSpecialOfferText] = useState('');
  const [termsConditions, setTermsConditions] = useState('');
  const [visibilityRadius, setVisibilityRadius] = useState('5');
  const [isFeatured, setIsFeatured] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadBusinessId();
  }, [user]);

  const loadBusinessId = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('businesses')
      .select('id')
      .eq('owner_id', user.id)
      .single();

    if (error) {
      Alert.alert('Error', 'Could not load business information');
      navigation.goBack();
      return;
    }

    setBusinessId(data.id);
  };

  const validateForm = (): string | null => {
    if (!title.trim()) return 'Title is required';
    if (title.length < 5) return 'Title must be at least 5 characters';
    if (title.length > 100) return 'Title must be less than 100 characters';

    if (discountType === 'percentage' || discountType === 'fixed') {
      if (!discountValue.trim()) return 'Discount value is required';
      const value = parseFloat(discountValue);
      if (isNaN(value) || value <= 0) return 'Discount value must be greater than 0';
      if (discountType === 'percentage' && value > 100) {
        return 'Percentage discount cannot exceed 100%';
      }
    }

    if (discountType === 'special' && !specialOfferText.trim()) {
      return 'Special offer text is required';
    }

    const radius = parseFloat(visibilityRadius);
    if (isNaN(radius) || radius < 0.5 || radius > 50) {
      return 'Visibility radius must be between 0.5 and 50 km';
    }

    if (type === 'time_based' || type === 'weekly_special') {
      if (endDate <= startDate) {
        return 'End date must be after start date';
      }
      if (startDate < new Date()) {
        return 'Start date cannot be in the past';
      }
    }

    return null;
  };

  const handleSubmit = async () => {
    if (!businessId) {
      Alert.alert('Error', 'Business not found');
      return;
    }

    const error = validateForm();
    if (error) {
      Alert.alert('Validation Error', error);
      return;
    }

    setIsSubmitting(true);

    try {
      const promotionData: any = {
        business_id: businessId,
        title: title.trim(),
        description: description.trim() || null,
        type,
        discount_type: discountType,
        discount_value: discountType !== 'special' ? parseFloat(discountValue) : null,
        special_offer_text: discountType === 'special' ? specialOfferText.trim() : null,
        terms_conditions: termsConditions.trim() || null,
        visibility_radius_km: parseFloat(visibilityRadius),
        featured: isFeatured,
        status: 'active',
      };

      // Add dates for time-based and weekly special promotions
      if (type === 'time_based' || type === 'weekly_special') {
        promotionData.start_date = startDate.toISOString();
        promotionData.end_date = endDate.toISOString();
      }

      const { data, error: insertError } = await supabase
        .from('promotions')
        .insert(promotionData)
        .select()
        .single();

      if (insertError) throw insertError;

      Alert.alert(
        'Success!',
        'Promotion created successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error: any) {
      console.error('Error creating promotion:', error);
      Alert.alert('Error', error.message || 'Failed to create promotion');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-primary px-6 py-6 flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
            <Text className="text-white text-2xl">←</Text>
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Create Promotion</Text>
        </View>

        <View className="p-4">
          {/* Promotion Type */}
          <View className="bg-white rounded-2xl p-4 mb-4">
            <Text className="text-base font-bold text-gray-900 mb-3">
              Promotion Type
            </Text>
            <View className="space-y-2">
              <TouchableOpacity
                onPress={() => setType('fixed')}
                className={`p-4 rounded-xl border-2 ${
                  type === 'fixed' ? 'border-primary bg-red-50' : 'border-gray-200'
                }`}
              >
                <Text className={`font-semibold ${type === 'fixed' ? 'text-primary' : 'text-gray-700'}`}>
                  Fixed Discount
                </Text>
                <Text className="text-sm text-gray-600 mt-1">
                  Always-active discount for app users
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setType('time_based')}
                className={`p-4 rounded-xl border-2 ${
                  type === 'time_based' ? 'border-primary bg-red-50' : 'border-gray-200'
                }`}
              >
                <Text className={`font-semibold ${type === 'time_based' ? 'text-primary' : 'text-gray-700'}`}>
                  Time-Based Campaign
                </Text>
                <Text className="text-sm text-gray-600 mt-1">
                  Limited-time seasonal promotion
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setType('weekly_special');
                  setIsFeatured(true);
                }}
                className={`p-4 rounded-xl border-2 ${
                  type === 'weekly_special' ? 'border-primary bg-red-50' : 'border-gray-200'
                }`}
              >
                <Text className={`font-semibold ${type === 'weekly_special' ? 'text-primary' : 'text-gray-700'}`}>
                  Weekly Special ⭐
                </Text>
                <Text className="text-sm text-gray-600 mt-1">
                  Featured high-value deal
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Basic Information */}
          <View className="bg-white rounded-2xl p-4 mb-4">
            <Text className="text-base font-bold text-gray-900 mb-3">
              Basic Information
            </Text>

            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Title *
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g., 20% off all pizzas"
              className="bg-gray-100 px-4 py-3 rounded-lg text-gray-900 mb-4"
              maxLength={100}
            />

            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Description
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Optional details about the offer"
              className="bg-gray-100 px-4 py-3 rounded-lg text-gray-900"
              multiline
              numberOfLines={3}
              maxLength={500}
            />
          </View>

          {/* Discount Configuration */}
          <View className="bg-white rounded-2xl p-4 mb-4">
            <Text className="text-base font-bold text-gray-900 mb-3">
              Discount Details
            </Text>

            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Discount Type *
            </Text>
            <View className="flex-row mb-4">
              <TouchableOpacity
                onPress={() => setDiscountType('percentage')}
                className={`flex-1 p-3 rounded-lg mr-2 ${
                  discountType === 'percentage' ? 'bg-primary' : 'bg-gray-100'
                }`}
              >
                <Text
                  className={`text-center font-semibold ${
                    discountType === 'percentage' ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  Percentage
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setDiscountType('fixed')}
                className={`flex-1 p-3 rounded-lg mx-1 ${
                  discountType === 'fixed' ? 'bg-primary' : 'bg-gray-100'
                }`}
              >
                <Text
                  className={`text-center font-semibold ${
                    discountType === 'fixed' ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  Fixed (€)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setDiscountType('special')}
                className={`flex-1 p-3 rounded-lg ml-2 ${
                  discountType === 'special' ? 'bg-primary' : 'bg-gray-100'
                }`}
              >
                <Text
                  className={`text-center font-semibold ${
                    discountType === 'special' ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  Special
                </Text>
              </TouchableOpacity>
            </View>

            {(discountType === 'percentage' || discountType === 'fixed') && (
              <>
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Discount Value *
                </Text>
                <TextInput
                  value={discountValue}
                  onChangeText={setDiscountValue}
                  placeholder={discountType === 'percentage' ? 'e.g., 20' : 'e.g., 5.00'}
                  keyboardType="numeric"
                  className="bg-gray-100 px-4 py-3 rounded-lg text-gray-900"
                />
              </>
            )}

            {discountType === 'special' && (
              <>
                <Text className="text-sm font-semibold text-gray-700 mb-2">
                  Special Offer Text *
                </Text>
                <TextInput
                  value={specialOfferText}
                  onChangeText={setSpecialOfferText}
                  placeholder="e.g., Buy 2 Get 1 Free"
                  className="bg-gray-100 px-4 py-3 rounded-lg text-gray-900"
                  maxLength={50}
                />
              </>
            )}
          </View>

          {/* Date Range (for time-based and weekly special) */}
          {(type === 'time_based' || type === 'weekly_special') && (
            <View className="bg-white rounded-2xl p-4 mb-4">
              <Text className="text-base font-bold text-gray-900 mb-3">
                Campaign Duration
              </Text>

              <Text className="text-sm font-semibold text-gray-700 mb-2">
                Start Date *
              </Text>
              <TouchableOpacity
                onPress={() => setShowStartPicker(true)}
                className="bg-gray-100 px-4 py-3 rounded-lg mb-4"
              >
                <Text className="text-gray-900">
                  {startDate.toLocaleDateString()} {startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </TouchableOpacity>

              {showStartPicker && (
                <DateTimePicker
                  value={startDate}
                  mode="datetime"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, date) => {
                    setShowStartPicker(Platform.OS === 'ios');
                    if (date) setStartDate(date);
                  }}
                />
              )}

              <Text className="text-sm font-semibold text-gray-700 mb-2">
                End Date *
              </Text>
              <TouchableOpacity
                onPress={() => setShowEndPicker(true)}
                className="bg-gray-100 px-4 py-3 rounded-lg"
              >
                <Text className="text-gray-900">
                  {endDate.toLocaleDateString()} {endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </TouchableOpacity>

              {showEndPicker && (
                <DateTimePicker
                  value={endDate}
                  mode="datetime"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(event, date) => {
                    setShowEndPicker(Platform.OS === 'ios');
                    if (date) setEndDate(date);
                  }}
                />
              )}
            </View>
          )}

          {/* Settings */}
          <View className="bg-white rounded-2xl p-4 mb-4">
            <Text className="text-base font-bold text-gray-900 mb-3">
              Settings
            </Text>

            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Visibility Radius (km) *
            </Text>
            <TextInput
              value={visibilityRadius}
              onChangeText={setVisibilityRadius}
              placeholder="e.g., 5"
              keyboardType="numeric"
              className="bg-gray-100 px-4 py-3 rounded-lg text-gray-900 mb-4"
            />

            {type !== 'weekly_special' && (
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-sm font-semibold text-gray-700">
                    Featured Promotion
                  </Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    Show in featured carousel
                  </Text>
                </View>
                <Switch
                  value={isFeatured}
                  onValueChange={setIsFeatured}
                  trackColor={{ false: '#D1D5DB', true: '#FF6B6B' }}
                />
              </View>
            )}
          </View>

          {/* Terms & Conditions */}
          <View className="bg-white rounded-2xl p-4 mb-4">
            <Text className="text-base font-bold text-gray-900 mb-3">
              Terms & Conditions
            </Text>
            <TextInput
              value={termsConditions}
              onChangeText={setTermsConditions}
              placeholder="Optional terms and conditions"
              className="bg-gray-100 px-4 py-3 rounded-lg text-gray-900"
              multiline
              numberOfLines={4}
              maxLength={1000}
            />
          </View>

          {/* Submit Button */}
          <View className="mb-8">
            <Button
              title={isSubmitting ? 'Creating...' : 'Create Promotion'}
              onPress={handleSubmit}
              size="large"
              disabled={isSubmitting}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

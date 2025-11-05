import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';
import { Ionicons } from '@expo/vector-icons';

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  recommended?: boolean;
  limits: {
    promotions: number | string;
    loyaltyProgram: boolean;
    advancedAnalytics: boolean;
    featuredPlacement: boolean;
  };
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'forever',
    features: [
      '1 active promotion',
      'Basic analytics',
      'QR code redemption',
      'Email support',
    ],
    limits: {
      promotions: '1',
      loyaltyProgram: false,
      advancedAnalytics: false,
      featuredPlacement: false,
    },
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 19,
    period: 'month',
    recommended: true,
    features: [
      '3 active promotions',
      'Loyalty program',
      'Basic analytics',
      'Email support',
    ],
    limits: {
      promotions: '3',
      loyaltyProgram: true,
      advancedAnalytics: false,
      featuredPlacement: false,
    },
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 49,
    period: 'month',
    features: [
      '10 active promotions',
      'Advanced loyalty program',
      'Advanced analytics',
      'Featured placement',
      'Priority support',
    ],
    limits: {
      promotions: '10',
      loyaltyProgram: true,
      advancedAnalytics: true,
      featuredPlacement: true,
    },
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 99,
    period: 'month',
    features: [
      'Unlimited promotions',
      'Premium loyalty features',
      'Advanced analytics + AI',
      'Priority featured placement',
      'Dedicated support',
      'Custom integrations',
    ],
    limits: {
      promotions: 'Unlimited',
      loyaltyProgram: true,
      advancedAnalytics: true,
      featuredPlacement: true,
    },
  },
];

export default function SubscriptionScreen() {
  const { user, profile } = useSelector((state: RootState) => state.auth);
  const [isProcessing, setIsProcessing] = useState(false);

  // Get current plan from profile (defaults to free)
  const currentPlanId = profile?.subscription_plan || 'free';
  const currentPlan = PLANS.find((p) => p.id === currentPlanId) || PLANS[0];

  const handleSelectPlan = async (plan: Plan) => {
    if (plan.id === currentPlanId) {
      Alert.alert('Current Plan', 'You are already on this plan');
      return;
    }

    if (plan.id === 'free') {
      Alert.alert(
        'Downgrade Plan',
        'Are you sure you want to downgrade to the Free plan? Some features will be disabled.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Downgrade',
            style: 'destructive',
            onPress: () => processSubscriptionChange(plan),
          },
        ]
      );
      return;
    }

    const isUpgrade = PLANS.indexOf(plan) > PLANS.indexOf(currentPlan);
    const action = isUpgrade ? 'Upgrade' : 'Change';

    Alert.alert(
      `${action} to ${plan.name}`,
      `You will be charged €${plan.price}/${plan.period}. Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: action,
          onPress: () => processSubscriptionChange(plan),
        },
      ]
    );
  };

  const processSubscriptionChange = async (plan: Plan) => {
    setIsProcessing(true);

    try {
      // TODO: Implement actual Stripe payment flow
      // For now, just show a placeholder
      await new Promise((resolve) => setTimeout(resolve, 1500));

      Alert.alert(
        'Coming Soon',
        'Payment integration will be available soon. This is a preview of the subscription screen.'
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to process subscription change');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPlanCard = (plan: Plan) => {
    const isCurrent = plan.id === currentPlanId;
    const isRecommended = plan.recommended && !isCurrent;

    return (
      <View
        key={plan.id}
        className={`bg-white rounded-2xl shadow-md mb-4 overflow-hidden ${
          isCurrent ? 'border-2 border-emerald-500' : ''
        }`}
      >
        {/* Recommended Badge */}
        {isRecommended && (
          <View className="bg-emerald-500 py-2">
            <Text className="text-white text-center font-bold text-xs">
              ⭐ RECOMMENDED
            </Text>
          </View>
        )}

        {/* Current Plan Badge */}
        {isCurrent && (
          <View className="bg-emerald-500 py-2">
            <Text className="text-white text-center font-bold text-xs">
              ✓ CURRENT PLAN
            </Text>
          </View>
        )}

        <View className="p-6">
          {/* Header */}
          <View className="items-center mb-4">
            <Text className="text-2xl font-bold text-gray-900 mb-2">
              {plan.name}
            </Text>
            <View className="flex-row items-end">
              <Text className="text-4xl font-bold text-primary">
                €{plan.price}
              </Text>
              <Text className="text-gray-600 text-base mb-1 ml-1">
                /{plan.period}
              </Text>
            </View>
          </View>

          {/* Features */}
          <View className="mb-6">
            {plan.features.map((feature, index) => (
              <View key={index} className="flex-row items-center mb-3">
                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                <Text className="text-gray-700 ml-3 flex-1">{feature}</Text>
              </View>
            ))}
          </View>

          {/* Action Button */}
          <TouchableOpacity
            onPress={() => handleSelectPlan(plan)}
            disabled={isCurrent || isProcessing}
            className={`py-4 rounded-xl ${
              isCurrent
                ? 'bg-gray-300'
                : plan.id === 'free'
                ? 'bg-gray-500'
                : 'bg-primary'
            }`}
          >
            {isProcessing ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-bold text-base">
                {isCurrent
                  ? 'Current Plan'
                  : plan.id === 'free'
                  ? 'Downgrade'
                  : PLANS.indexOf(plan) > PLANS.indexOf(currentPlan)
                  ? 'Upgrade'
                  : 'Select Plan'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-primary px-6 py-8">
          <Text className="text-white text-2xl font-bold mb-2">
            Subscription Plans
          </Text>
          <Text className="text-white/90 text-sm">
            Choose the plan that fits your business needs
          </Text>
        </View>

        {/* Current Plan Info */}
        <View className="px-4 -mt-6 mb-4">
          <View className="bg-white rounded-2xl shadow-lg p-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-gray-600 text-sm mb-1">
                  Your Current Plan
                </Text>
                <Text className="text-2xl font-bold text-gray-900">
                  {currentPlan.name}
                </Text>
                {currentPlan.price > 0 && (
                  <Text className="text-gray-600 text-sm mt-1">
                    €{currentPlan.price}/{currentPlan.period}
                  </Text>
                )}
              </View>
              <View className="w-16 h-16 bg-emerald-100 rounded-full items-center justify-center">
                <Ionicons name="checkmark-circle" size={32} color="#10B981" />
              </View>
            </View>

            {/* Usage Stats */}
            <View className="mt-4 pt-4 border-t border-gray-200">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-gray-600 text-sm">Active Promotions</Text>
                <Text className="text-gray-900 font-semibold">
                  {/* TODO: Get actual count from analytics */}
                  0 / {currentPlan.limits.promotions}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Plans Grid */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            All Plans
          </Text>
          {PLANS.map((plan) => renderPlanCard(plan))}
        </View>

        {/* Cancer Research Message */}
        <View className="px-4 mb-8">
          <View className="bg-pink-50 rounded-2xl p-4 border border-pink-200">
            <Text className="text-pink-900 font-bold text-base mb-2">
              💗 Supporting Cancer Research
            </Text>
            <Text className="text-pink-800 text-sm leading-6">
              5% of all subscription revenue goes directly to cancer research
              initiatives. By upgrading, you're not just growing your business
              - you're helping save lives.
            </Text>
          </View>
        </View>

        {/* FAQ */}
        <View className="px-4 mb-8">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </Text>
          <View className="bg-white rounded-2xl shadow-md p-4">
            <View className="mb-4">
              <Text className="text-gray-900 font-semibold mb-2">
                Can I change my plan anytime?
              </Text>
              <Text className="text-gray-600 text-sm">
                Yes! You can upgrade or downgrade your plan at any time. Changes
                take effect immediately.
              </Text>
            </View>
            <View className="h-px bg-gray-200 mb-4" />
            <View className="mb-4">
              <Text className="text-gray-900 font-semibold mb-2">
                What happens when I downgrade?
              </Text>
              <Text className="text-gray-600 text-sm">
                If you exceed the limits of your new plan, some features will be
                disabled until you upgrade again or reduce usage.
              </Text>
            </View>
            <View className="h-px bg-gray-200 mb-4" />
            <View>
              <Text className="text-gray-900 font-semibold mb-2">
                Do you offer refunds?
              </Text>
              <Text className="text-gray-600 text-sm">
                We offer a 14-day money-back guarantee for all paid plans, no
                questions asked.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';
import { supabase } from '@services/supabase.service';
import { Ionicons } from '@expo/vector-icons';

interface LoyaltyCard {
  id: string;
  current_points: number;
  lifetime_points: number;
  current_tier: string;
  visits_count: number;
  joined_at: string;
  business: {
    id: string;
    name: string;
    category: string;
  };
  loyalty_program: {
    id: string;
    name: string;
    points_per_euro: number;
    welcome_bonus: number;
  };
}

export default function LoyaltyCardsScreen() {
  const navigation = useNavigation();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [cards, setCards] = useState<LoyaltyCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadLoyaltyCards();
  }, []);

  const loadLoyaltyCards = async () => {
    if (!user?.id) return;

    try {
      const { data, error } = await supabase
        .from('loyalty_cards')
        .select(`
          id,
          current_points,
          lifetime_points,
          current_tier,
          visits_count,
          joined_at,
          business:businesses (
            id,
            name,
            category
          ),
          loyalty_program:loyalty_programs (
            id,
            name,
            points_per_euro,
            welcome_bonus
          )
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCards(data || []);
    } catch (error) {
      console.error('Error loading loyalty cards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadLoyaltyCards();
    setRefreshing(false);
  };

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'platinum':
        return '#E5E7EB'; // Platinum gray
      case 'gold':
        return '#FCD34D'; // Gold
      case 'silver':
        return '#D1D5DB'; // Silver
      case 'bronze':
      default:
        return '#CD7F32'; // Bronze
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'platinum':
        return 'diamond';
      case 'gold':
        return 'trophy';
      case 'silver':
        return 'medal';
      case 'bronze':
      default:
        return 'ribbon';
    }
  };

  const renderCard = ({ item }: { item: LoyaltyCard }) => {
    const tierColor = getTierColor(item.current_tier);
    const tierIcon = getTierIcon(item.current_tier);

    return (
      <TouchableOpacity
        onPress={() => {
          // Navigate to card details (to be implemented)
        }}
        className="bg-white rounded-2xl shadow-md mx-4 mb-4 overflow-hidden"
      >
        {/* Header with gradient */}
        <View
          className="px-6 py-6"
          style={{ backgroundColor: tierColor + '40' }}
        >
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-1">
              <Text className="text-lg font-bold text-gray-900 mb-1">
                {item.business.name}
              </Text>
              <Text className="text-gray-600 text-sm">
                {item.loyalty_program.name}
              </Text>
            </View>
            <View
              className="w-12 h-12 rounded-full items-center justify-center"
              style={{ backgroundColor: tierColor }}
            >
              <Ionicons name={tierIcon as any} size={24} color="#FFFFFF" />
            </View>
          </View>

          {/* Points Display */}
          <View className="bg-white rounded-xl p-4">
            <View className="flex-row items-end justify-center mb-2">
              <Text className="text-4xl font-bold text-primary">
                {item.current_points}
              </Text>
              <Text className="text-gray-600 text-base mb-1 ml-2">points</Text>
            </View>
            <Text className="text-center text-gray-600 text-sm">
              {item.lifetime_points} lifetime points
            </Text>
          </View>
        </View>

        {/* Stats Footer */}
        <View className="px-6 py-4 flex-row border-t border-gray-200">
          <View className="flex-1 items-center border-r border-gray-200">
            <View className="flex-row items-center mb-1">
              <Ionicons name="ribbon" size={16} color="#6B7280" />
              <Text className="text-gray-900 font-semibold ml-1 capitalize">
                {item.current_tier}
              </Text>
            </View>
            <Text className="text-gray-600 text-xs">Tier</Text>
          </View>
          <View className="flex-1 items-center">
            <View className="flex-row items-center mb-1">
              <Ionicons name="location" size={16} color="#6B7280" />
              <Text className="text-gray-900 font-semibold ml-1">
                {item.visits_count}
              </Text>
            </View>
            <Text className="text-gray-600 text-xs">Visits</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center px-6 py-20">
      <Ionicons name="card-outline" size={80} color="#D1D5DB" />
      <Text className="text-xl font-bold text-gray-900 mt-6 text-center">
        No Loyalty Cards Yet
      </Text>
      <Text className="text-gray-600 text-center mt-2 mb-6">
        Start claiming promotions to join loyalty programs and earn rewards!
      </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate('ConsumerMain' as never)}
        className="bg-primary px-6 py-3 rounded-xl"
      >
        <Text className="text-white font-semibold">Explore Promotions</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#10B981" />
        <Text className="text-gray-600 mt-4">Loading loyalty cards...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-primary px-6 py-6 mb-4">
        <Text className="text-white text-2xl font-bold mb-2">
          Loyalty Cards
        </Text>
        <Text className="text-white/90 text-sm">
          {cards.length} active {cards.length === 1 ? 'card' : 'cards'}
        </Text>
      </View>

      {/* Cards List */}
      <FlatList
        data={cards}
        renderItem={renderCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={cards.length === 0 ? { flex: 1 } : { paddingBottom: 16 }}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />

      {/* Info Banner */}
      {cards.length > 0 && (
        <View className="px-4 pb-4">
          <View className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
            <View className="flex-row items-center mb-2">
              <Ionicons name="information-circle" size={20} color="#3B82F6" />
              <Text className="text-blue-900 font-bold ml-2">How it works</Text>
            </View>
            <Text className="text-blue-800 text-sm">
              • Earn points when you claim and redeem coupons{'\n'}
              • Higher tiers unlock better rewards{'\n'}
              • Points never expire while your card is active
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

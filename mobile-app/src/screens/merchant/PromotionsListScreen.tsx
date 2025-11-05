import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';
import {
  getBusinessPromotions,
  togglePromotionStatus,
  deletePromotion,
  Promotion,
  getPromotionDisplayStatus,
  formatCampaignType,
  formatDiscount,
} from '@services/promotions.service';
import { Ionicons } from '@expo/vector-icons';

export default function PromotionsListScreen() {
  const navigation = useNavigation();
  const { user } = useSelector((state: RootState) => state.auth);
  const businessId = user?.business_id;

  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [filteredPromotions, setFilteredPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'paused' | 'expired'>('all');

  useEffect(() => {
    if (businessId) {
      loadPromotions();
    }
  }, [businessId]);

  useEffect(() => {
    applyFilter();
  }, [filter, promotions]);

  const loadPromotions = async () => {
    if (!businessId) return;

    try {
      setIsLoading(true);
      const data = await getBusinessPromotions(businessId);
      setPromotions(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load promotions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadPromotions();
    setRefreshing(false);
  };

  const applyFilter = () => {
    if (filter === 'all') {
      setFilteredPromotions(promotions);
    } else {
      setFilteredPromotions(
        promotions.filter((p) => {
          const displayStatus = getPromotionDisplayStatus(p);
          return displayStatus.status === filter;
        })
      );
    }
  };

  const handleToggleStatus = async (promotion: Promotion) => {
    try {
      const result = await togglePromotionStatus(promotion.id, promotion.status);

      Alert.alert(
        '✅ Success',
        `Promotion ${result.newStatus === 'active' ? 'activated' : 'paused'}`
      );

      // Reload promotions
      await loadPromotions();
    } catch (error) {
      Alert.alert('Error', 'Failed to update promotion status');
    }
  };

  const handleDelete = (promotion: Promotion) => {
    Alert.alert(
      'Delete Promotion',
      `Are you sure you want to delete "${promotion.title}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePromotion(promotion.id);
              Alert.alert('✅ Deleted', 'Promotion deleted successfully');
              await loadPromotions();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete promotion');
            }
          },
        },
      ]
    );
  };

  const renderPromotionCard = ({ item }: { item: Promotion }) => {
    const displayStatus = getPromotionDisplayStatus(item);
    const campaignType = formatCampaignType(item.campaign_type);
    const discount = formatDiscount(item.discount_type, item.discount_value);

    return (
      <View className="bg-white rounded-2xl shadow-md mb-4 mx-4 overflow-hidden">
        {/* Header with status */}
        <View className="flex-row items-center justify-between p-4 pb-2">
          <View
            className="px-3 py-1 rounded-full"
            style={{ backgroundColor: displayStatus.color + '20' }}
          >
            <Text
              className="text-xs font-semibold"
              style={{ color: displayStatus.color }}
            >
              {displayStatus.label.toUpperCase()}
            </Text>
          </View>
          {item.is_featured && (
            <View className="flex-row items-center bg-yellow-100 px-3 py-1 rounded-full">
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text className="text-yellow-700 text-xs font-semibold ml-1">
                Featured
              </Text>
            </View>
          )}
        </View>

        {/* Main content */}
        <View className="px-4 py-2">
          <Text className="text-lg font-bold text-gray-900 mb-1">
            {item.title}
          </Text>
          <Text className="text-gray-600 text-sm mb-3" numberOfLines={2}>
            {item.description}
          </Text>

          {/* Discount badge */}
          <View className="bg-emerald-500 self-start px-4 py-2 rounded-xl mb-3">
            <Text className="text-white font-bold text-base">{discount}</Text>
          </View>

          {/* Info row */}
          <View className="flex-row items-center mb-3 space-x-4">
            <View className="flex-row items-center">
              <Ionicons name="pricetag" size={16} color="#6B7280" />
              <Text className="text-gray-600 text-xs ml-1">{campaignType}</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="location" size={16} color="#6B7280" />
              <Text className="text-gray-600 text-xs ml-1">
                {item.visibility_radius_km}km radius
              </Text>
            </View>
          </View>

          {/* Stats */}
          <View className="flex-row bg-gray-50 rounded-xl p-3 mb-3">
            <View className="flex-1 items-center">
              <Text className="text-xl font-bold text-emerald-600">
                {item.redemptions_count}
              </Text>
              <Text className="text-gray-600 text-xs mt-1">Redeemed</Text>
            </View>
            <View className="flex-1 items-center border-l border-gray-200">
              <Text className="text-gray-600 text-xs">Created</Text>
              <Text className="text-gray-900 text-xs font-semibold mt-1">
                {new Date(item.created_at).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Action buttons */}
        {displayStatus.status !== 'expired' && (
          <View className="flex-row border-t border-gray-200">
            <TouchableOpacity
              onPress={() => handleToggleStatus(item)}
              className="flex-1 py-3 flex-row items-center justify-center border-r border-gray-200"
            >
              <Ionicons
                name={displayStatus.status === 'active' ? 'pause' : 'play'}
                size={18}
                color="#3B82F6"
              />
              <Text className="text-blue-600 font-semibold ml-2">
                {displayStatus.status === 'active' ? 'Pause' : 'Activate'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                Alert.alert('Coming Soon', 'Edit functionality coming soon!')
              }
              className="flex-1 py-3 flex-row items-center justify-center border-r border-gray-200"
            >
              <Ionicons name="create-outline" size={18} color="#10B981" />
              <Text className="text-emerald-600 font-semibold ml-2">Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleDelete(item)}
              className="flex-1 py-3 flex-row items-center justify-center"
            >
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
              <Text className="text-red-600 font-semibold ml-2">Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  const renderFilterButton = (
    filterValue: 'all' | 'active' | 'paused' | 'expired',
    label: string,
    icon: string
  ) => {
    const isActive = filter === filterValue;
    return (
      <TouchableOpacity
        onPress={() => setFilter(filterValue)}
        className={`flex-row items-center px-4 py-2 rounded-full mr-2 ${
          isActive ? 'bg-primary' : 'bg-gray-200'
        }`}
      >
        <Ionicons
          name={icon as any}
          size={16}
          color={isActive ? '#FFFFFF' : '#6B7280'}
        />
        <Text
          className={`ml-2 font-semibold ${
            isActive ? 'text-white' : 'text-gray-700'
          }`}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center px-6 py-20">
      <Ionicons name="megaphone-outline" size={80} color="#D1D5DB" />
      <Text className="text-xl font-bold text-gray-900 mt-6 text-center">
        {filter === 'all' ? 'No Promotions Yet' : `No ${filter} Promotions`}
      </Text>
      <Text className="text-gray-600 text-center mt-2 mb-6">
        {filter === 'all'
          ? 'Create your first promotion to start attracting customers'
          : `You don't have any ${filter} promotions`}
      </Text>
      {filter === 'all' && (
        <TouchableOpacity
          onPress={() => navigation.navigate('CreatePromotion' as never)}
          className="bg-primary px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Create Promotion</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#10B981" />
        <Text className="text-gray-600 mt-4">Loading promotions...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white border-b border-gray-200 px-4 py-4">
        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-2xl font-bold text-gray-900">
              My Promotions
            </Text>
            <Text className="text-gray-600 text-sm mt-1">
              {promotions.length} total • {filteredPromotions.length} showing
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('CreatePromotion' as never)}
            className="bg-primary w-12 h-12 rounded-full items-center justify-center"
          >
            <Ionicons name="add" size={28} color="white" />
          </TouchableOpacity>
        </View>

        {/* Filters */}
        <View className="flex-row">
          {renderFilterButton('all', 'All', 'list')}
          {renderFilterButton('active', 'Active', 'checkmark-circle')}
          {renderFilterButton('paused', 'Paused', 'pause-circle')}
          {renderFilterButton('expired', 'Expired', 'time')}
        </View>
      </View>

      {/* List */}
      <FlatList
        data={filteredPromotions}
        renderItem={renderPromotionCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 16 }}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      />
    </SafeAreaView>
  );
}

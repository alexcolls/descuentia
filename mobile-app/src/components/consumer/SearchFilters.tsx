import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView,
} from 'react-native';

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  selectedTypes: string[];
  onTypeToggle: (type: string) => void;
  maxDistance: number;
  onDistanceChange: (distance: number) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
}

const CATEGORIES = [
  { value: 'restaurant', label: 'Restaurants', emoji: '🍽️' },
  { value: 'retail', label: 'Retail', emoji: '🛍️' },
  { value: 'services', label: 'Services', emoji: '✨' },
  { value: 'entertainment', label: 'Entertainment', emoji: '🎭' },
  { value: 'health', label: 'Health & Wellness', emoji: '💪' },
  { value: 'beauty', label: 'Beauty', emoji: '💄' },
];

const PROMOTION_TYPES = [
  { value: 'weekly_special', label: 'Weekly Special', color: 'bg-purple-100 text-purple-800' },
  { value: 'time_based', label: 'Limited Time', color: 'bg-orange-100 text-orange-800' },
  { value: 'fixed', label: 'Always On', color: 'bg-green-100 text-green-800' },
];

const DISTANCES = [
  { value: 1, label: '1 km' },
  { value: 3, label: '3 km' },
  { value: 5, label: '5 km' },
  { value: 10, label: '10 km' },
  { value: 25, label: '25 km' },
];

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategories,
  onCategoryToggle,
  selectedTypes,
  onTypeToggle,
  maxDistance,
  onDistanceChange,
  onApplyFilters,
  onResetFilters,
}) => {
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);

  const activeFiltersCount =
    selectedCategories.length +
    selectedTypes.length +
    (maxDistance !== 5 ? 1 : 0);

  const handleApplyFilters = () => {
    onApplyFilters();
    setIsFilterModalVisible(false);
  };

  const handleResetFilters = () => {
    onResetFilters();
    setIsFilterModalVisible(false);
  };

  return (
    <View>
      {/* Search Bar */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-200">
        <View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-4 py-2 mr-2">
          <Text className="text-gray-400 mr-2">🔍</Text>
          <TextInput
            value={searchQuery}
            onChangeText={onSearchChange}
            placeholder="Search promotions, businesses..."
            placeholderTextColor="#9CA3AF"
            className="flex-1 text-gray-900"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => onSearchChange('')}>
              <Text className="text-gray-400 ml-2">✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Button */}
        <TouchableOpacity
          onPress={() => setIsFilterModalVisible(true)}
          className="bg-primary p-3 rounded-full relative"
        >
          <Text className="text-white">🎛️</Text>
          {activeFiltersCount > 0 && (
            <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
              <Text className="text-white text-xs font-bold">
                {activeFiltersCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Active Filters Pills */}
      {activeFiltersCount > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="bg-white border-b border-gray-200 px-4 py-2"
        >
          {selectedCategories.map((cat) => {
            const category = CATEGORIES.find((c) => c.value === cat);
            return (
              <View
                key={cat}
                className="bg-blue-100 rounded-full px-3 py-1 mr-2 flex-row items-center"
              >
                <Text className="text-xs mr-1">{category?.emoji}</Text>
                <Text className="text-blue-800 text-xs font-semibold mr-1">
                  {category?.label}
                </Text>
                <TouchableOpacity onPress={() => onCategoryToggle(cat)}>
                  <Text className="text-blue-800 text-xs">✕</Text>
                </TouchableOpacity>
              </View>
            );
          })}
          {selectedTypes.map((type) => {
            const promoType = PROMOTION_TYPES.find((t) => t.value === type);
            return (
              <View
                key={type}
                className="bg-purple-100 rounded-full px-3 py-1 mr-2 flex-row items-center"
              >
                <Text className="text-purple-800 text-xs font-semibold mr-1">
                  {promoType?.label}
                </Text>
                <TouchableOpacity onPress={() => onTypeToggle(type)}>
                  <Text className="text-purple-800 text-xs">✕</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      )}

      {/* Filter Modal */}
      <Modal
        visible={isFilterModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsFilterModalVisible(false)}
      >
        <SafeAreaView className="flex-1 bg-white">
          {/* Header */}
          <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200">
            <TouchableOpacity onPress={handleResetFilters}>
              <Text className="text-primary font-semibold">Reset</Text>
            </TouchableOpacity>
            <Text className="text-lg font-bold text-gray-900">Filters</Text>
            <TouchableOpacity onPress={() => setIsFilterModalVisible(false)}>
              <Text className="text-gray-600 font-semibold">Done</Text>
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1">
            {/* Categories */}
            <View className="p-4 border-b border-gray-200">
              <Text className="text-base font-bold text-gray-900 mb-3">
                Categories
              </Text>
              <View className="flex-row flex-wrap">
                {CATEGORIES.map((category) => {
                  const isSelected = selectedCategories.includes(category.value);
                  return (
                    <TouchableOpacity
                      key={category.value}
                      onPress={() => onCategoryToggle(category.value)}
                      className={`px-4 py-2 rounded-full mr-2 mb-2 flex-row items-center ${
                        isSelected
                          ? 'bg-primary'
                          : 'bg-gray-100'
                      }`}
                    >
                      <Text className="text-base mr-1">{category.emoji}</Text>
                      <Text
                        className={`text-sm font-semibold ${
                          isSelected ? 'text-white' : 'text-gray-700'
                        }`}
                      >
                        {category.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Promotion Types */}
            <View className="p-4 border-b border-gray-200">
              <Text className="text-base font-bold text-gray-900 mb-3">
                Promotion Types
              </Text>
              <View className="flex-row flex-wrap">
                {PROMOTION_TYPES.map((type) => {
                  const isSelected = selectedTypes.includes(type.value);
                  return (
                    <TouchableOpacity
                      key={type.value}
                      onPress={() => onTypeToggle(type.value)}
                      className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                        isSelected
                          ? 'bg-primary'
                          : 'bg-gray-100'
                      }`}
                    >
                      <Text
                        className={`text-sm font-semibold ${
                          isSelected ? 'text-white' : 'text-gray-700'
                        }`}
                      >
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Distance */}
            <View className="p-4 border-b border-gray-200">
              <Text className="text-base font-bold text-gray-900 mb-3">
                Maximum Distance
              </Text>
              <View className="flex-row flex-wrap">
                {DISTANCES.map((distance) => {
                  const isSelected = maxDistance === distance.value;
                  return (
                    <TouchableOpacity
                      key={distance.value}
                      onPress={() => onDistanceChange(distance.value)}
                      className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                        isSelected
                          ? 'bg-primary'
                          : 'bg-gray-100'
                      }`}
                    >
                      <Text
                        className={`text-sm font-semibold ${
                          isSelected ? 'text-white' : 'text-gray-700'
                        }`}
                      >
                        {distance.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Apply Button */}
          <View className="p-4 border-t border-gray-200">
            <TouchableOpacity
              onPress={handleApplyFilters}
              className="bg-primary py-4 rounded-full items-center"
            >
              <Text className="text-white font-bold text-base">
                Apply Filters
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

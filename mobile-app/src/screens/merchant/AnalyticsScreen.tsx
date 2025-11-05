import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';
import { LineChart } from 'react-native-chart-kit';
import {
  getAnalyticsOverview,
  getTimeSeriesData,
  getTopPromotions,
  AnalyticsOverview,
  TimeSeriesData,
  PromotionPerformance,
  formatChartDate,
  formatPercentage,
} from '@services/analytics.service';
import { Ionicons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

export default function AnalyticsScreen() {
  const { user } = useSelector((state: RootState) => state.auth);
  const businessId = user?.business_id;

  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [timeSeries, setTimeSeries] = useState<TimeSeriesData[]>([]);
  const [topPromotions, setTopPromotions] = useState<PromotionPerformance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (businessId) {
      loadAnalytics();
    }
  }, [businessId]);

  const loadAnalytics = async () => {
    if (!businessId) return;

    try {
      setIsLoading(true);
      const [overviewData, timeSeriesData, topPromos] = await Promise.all([
        getAnalyticsOverview(businessId),
        getTimeSeriesData(businessId, 7),
        getTopPromotions(businessId, 5),
      ]);

      setOverview(overviewData);
      setTimeSeries(timeSeriesData);
      setTopPromotions(topPromos);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
  };

  const renderKPICard = (
    label: string,
    value: string | number,
    icon: string,
    color: string,
    subtitle?: string
  ) => (
    <View className="flex-1 bg-white rounded-2xl shadow-md p-4 m-2">
      <View className="flex-row items-center justify-between mb-2">
        <View
          className="w-10 h-10 rounded-full items-center justify-center"
          style={{ backgroundColor: color + '20' }}
        >
          <Ionicons name={icon as any} size={20} color={color} />
        </View>
      </View>
      <Text className="text-2xl font-bold text-gray-900 mb-1">{value}</Text>
      <Text className="text-gray-600 text-xs">{label}</Text>
      {subtitle && (
        <Text className="text-gray-500 text-xs mt-1">{subtitle}</Text>
      )}
    </View>
  );

  const getChartData = () => {
    if (timeSeries.length === 0) {
      return {
        labels: ['No data'],
        datasets: [{ data: [0] }],
      };
    }

    return {
      labels: timeSeries.map((d) => formatChartDate(d.date)),
      datasets: [
        {
          data: timeSeries.map((d) => d.views),
          color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // Blue
          strokeWidth: 2,
        },
        {
          data: timeSeries.map((d) => d.claims),
          color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`, // Green
          strokeWidth: 2,
        },
        {
          data: timeSeries.map((d) => d.redemptions),
          color: (opacity = 1) => `rgba(249, 115, 22, ${opacity})`, // Orange
          strokeWidth: 2,
        },
      ],
    };
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#10B981" />
        <Text className="text-gray-600 mt-4">Loading analytics...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View className="bg-primary px-6 py-6">
          <Text className="text-white text-2xl font-bold">Analytics</Text>
          <Text className="text-white/90 text-sm mt-1">
            Last 7 days performance
          </Text>
        </View>

        {overview && (
          <>
            {/* KPI Grid */}
            <View className="px-2 -mt-6 mb-4">
              <View className="flex-row flex-wrap">
                {renderKPICard(
                  'Total Views',
                  overview.totalViews.toLocaleString(),
                  'eye',
                  '#3B82F6'
                )}
                {renderKPICard(
                  'Claims',
                  overview.totalClaims.toLocaleString(),
                  'download',
                  '#10B981'
                )}
              </View>
              <View className="flex-row flex-wrap">
                {renderKPICard(
                  'Redemptions',
                  overview.totalRedemptions.toLocaleString(),
                  'checkmark-circle',
                  '#F97316'
                )}
                {renderKPICard(
                  'Shares',
                  overview.totalShares.toLocaleString(),
                  'share-social',
                  '#8B5CF6'
                )}
              </View>
            </View>

            {/* Conversion Rates */}
            <View className="px-4 mb-6">
              <Text className="text-lg font-bold text-gray-900 mb-3">
                Conversion Metrics
              </Text>
              <View className="bg-white rounded-2xl shadow-md p-4">
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-1">
                    <Text className="text-gray-600 text-sm mb-1">
                      Engagement Rate
                    </Text>
                    <Text className="text-gray-500 text-xs">
                      Claims / Views
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-3xl font-bold text-emerald-600">
                      {formatPercentage(overview.engagementRate)}
                    </Text>
                  </View>
                </View>
                <View className="h-px bg-gray-200 mb-4" />
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-gray-600 text-sm mb-1">
                      Conversion Rate
                    </Text>
                    <Text className="text-gray-500 text-xs">
                      Redemptions / Claims
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-3xl font-bold text-blue-600">
                      {formatPercentage(overview.conversionRate)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Chart */}
            {timeSeries.length > 0 && (
              <View className="px-4 mb-6">
                <Text className="text-lg font-bold text-gray-900 mb-3">
                  7-Day Trend
                </Text>
                <View className="bg-white rounded-2xl shadow-md p-4">
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <LineChart
                      data={getChartData()}
                      width={Math.max(screenWidth - 48, timeSeries.length * 80)}
                      height={220}
                      chartConfig={{
                        backgroundColor: '#ffffff',
                        backgroundGradientFrom: '#ffffff',
                        backgroundGradientTo: '#ffffff',
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                        style: {
                          borderRadius: 16,
                        },
                        propsForDots: {
                          r: '4',
                          strokeWidth: '2',
                        },
                      }}
                      bezier
                      style={{
                        borderRadius: 16,
                      }}
                    />
                  </ScrollView>
                  {/* Legend */}
                  <View className="flex-row items-center justify-center mt-4 space-x-6">
                    <View className="flex-row items-center">
                      <View className="w-3 h-3 rounded-full bg-blue-500 mr-2" />
                      <Text className="text-gray-600 text-xs">Views</Text>
                    </View>
                    <View className="flex-row items-center">
                      <View className="w-3 h-3 rounded-full bg-emerald-500 mr-2" />
                      <Text className="text-gray-600 text-xs">Claims</Text>
                    </View>
                    <View className="flex-row items-center">
                      <View className="w-3 h-3 rounded-full bg-orange-500 mr-2" />
                      <Text className="text-gray-600 text-xs">Redemptions</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* Top Promotions */}
            {topPromotions.length > 0 && (
              <View className="px-4 mb-8">
                <Text className="text-lg font-bold text-gray-900 mb-3">
                  Top Performing Promotions
                </Text>
                <View className="bg-white rounded-2xl shadow-md overflow-hidden">
                  {topPromotions.map((promo, index) => (
                    <View
                      key={promo.id}
                      className={`p-4 ${
                        index < topPromotions.length - 1 ? 'border-b border-gray-200' : ''
                      }`}
                    >
                      <View className="flex-row items-center justify-between mb-3">
                        <View className="flex-1">
                          <View className="flex-row items-center mb-1">
                            <View
                              className="w-6 h-6 rounded-full items-center justify-center mr-2"
                              style={{
                                backgroundColor:
                                  index === 0
                                    ? '#FFD700'
                                    : index === 1
                                    ? '#C0C0C0'
                                    : index === 2
                                    ? '#CD7F32'
                                    : '#E5E7EB',
                              }}
                            >
                              <Text className="text-xs font-bold text-white">
                                {index + 1}
                              </Text>
                            </View>
                            <Text
                              className="text-gray-900 font-semibold flex-1"
                              numberOfLines={1}
                            >
                              {promo.title}
                            </Text>
                          </View>
                        </View>
                        <Text className="text-emerald-600 font-bold text-lg ml-2">
                          {promo.redemptions}
                        </Text>
                      </View>
                      <View className="flex-row space-x-4">
                        <View className="flex-row items-center">
                          <Ionicons name="eye" size={14} color="#6B7280" />
                          <Text className="text-gray-600 text-xs ml-1">
                            {promo.views}
                          </Text>
                        </View>
                        <View className="flex-row items-center">
                          <Ionicons name="download" size={14} color="#6B7280" />
                          <Text className="text-gray-600 text-xs ml-1">
                            {promo.claims}
                          </Text>
                        </View>
                        <View className="flex-row items-center">
                          <Ionicons name="share-social" size={14} color="#6B7280" />
                          <Text className="text-gray-600 text-xs ml-1">
                            {promo.shares}
                          </Text>
                        </View>
                        <View className="flex-row items-center">
                          <Ionicons name="trending-up" size={14} color="#10B981" />
                          <Text className="text-emerald-600 text-xs ml-1 font-semibold">
                            {formatPercentage(promo.conversionRate)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        )}

        {/* Empty State */}
        {overview && overview.totalPromotions === 0 && (
          <View className="flex-1 items-center justify-center px-6 py-20">
            <Ionicons name="bar-chart-outline" size={80} color="#D1D5DB" />
            <Text className="text-xl font-bold text-gray-900 mt-6 text-center">
              No Analytics Yet
            </Text>
            <Text className="text-gray-600 text-center mt-2">
              Create your first promotion to start tracking performance
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

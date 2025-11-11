import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';
import { supabase } from '@services/supabase';
import { Ionicons } from '@expo/vector-icons';

interface LoyaltyProgram {
  id: string;
  name: string;
  description: string;
  points_per_euro: number;
  points_per_visit: number;
  is_active: boolean;
  welcome_bonus: number;
  referral_bonus: number;
  tier_system_enabled: boolean;
}

interface ProgramStats {
  totalMembers: number;
  activeMembers: number;
  totalPointsIssued: number;
  totalPointsRedeemed: number;
}

export default function LoyaltyProgramScreen() {
  const { user } = useSelector((state: RootState) => state.auth);
  const businessId = user?.business_id;

  const [program, setProgram] = useState<LoyaltyProgram | null>(null);
  const [stats, setStats] = useState<ProgramStats>({
    totalMembers: 0,
    activeMembers: 0,
    totalPointsIssued: 0,
    totalPointsRedeemed: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: 'Loyalty Program',
    description: 'Earn points with every purchase',
    points_per_euro: 1,
    points_per_visit: 10,
    welcome_bonus: 100,
    referral_bonus: 50,
    is_active: true,
    tier_system_enabled: false,
  });

  useEffect(() => {
    if (businessId) {
      loadLoyaltyProgram();
    }
  }, [businessId]);

  const loadLoyaltyProgram = async () => {
    if (!businessId) return;

    try {
      setIsLoading(true);

      // Load program
      const { data: programData, error: programError } = await supabase
        .from('loyalty_programs')
        .select('*')
        .eq('business_id', businessId)
        .single();

      if (programError && programError.code !== 'PGRST116') {
        throw programError;
      }

      if (programData) {
        setProgram(programData);
        setFormData({
          name: programData.name,
          description: programData.description || '',
          points_per_euro: programData.points_per_euro,
          points_per_visit: programData.points_per_visit,
          welcome_bonus: programData.welcome_bonus || 0,
          referral_bonus: programData.referral_bonus || 0,
          is_active: programData.is_active,
          tier_system_enabled: programData.tier_system_enabled || false,
        });

        // Load stats
        await loadStats(programData.id);
      }
    } catch (error) {
      console.error('Error loading loyalty program:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async (programId: string) => {
    try {
      // Get total members
      const { count: totalMembers } = await supabase
        .from('loyalty_cards')
        .select('*', { count: 'exact', head: true })
        .eq('loyalty_program_id', programId);

      // Get active members (visited in last 90 days)
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      const { count: activeMembers } = await supabase
        .from('loyalty_cards')
        .select('*', { count: 'exact', head: true })
        .eq('loyalty_program_id', programId)
        .gte('last_visit_at', ninetyDaysAgo.toISOString());

      // Get card IDs for transaction stats
      const { data: cards } = await supabase
        .from('loyalty_cards')
        .select('id')
        .eq('loyalty_program_id', programId);

      const cardIds = cards?.map((c) => c.id) || [];

      let pointsIssued = 0;
      let pointsRedeemed = 0;

      if (cardIds.length > 0) {
        // Get points issued (earn transactions)
        const { data: earnTransactions } = await supabase
          .from('loyalty_transactions')
          .select('points_change')
          .in('loyalty_card_id', cardIds)
          .eq('transaction_type', 'earn');

        pointsIssued =
          earnTransactions?.reduce((sum, t) => sum + t.points_change, 0) || 0;

        // Get points redeemed (redeem transactions)
        const { data: redeemTransactions } = await supabase
          .from('loyalty_transactions')
          .select('points_change')
          .in('loyalty_card_id', cardIds)
          .eq('transaction_type', 'redeem');

        pointsRedeemed =
          Math.abs(
            redeemTransactions?.reduce((sum, t) => sum + t.points_change, 0) || 0
          );
      }

      setStats({
        totalMembers: totalMembers || 0,
        activeMembers: activeMembers || 0,
        totalPointsIssued: pointsIssued,
        totalPointsRedeemed: pointsRedeemed,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleCreate = async () => {
    if (!businessId) return;

    setIsSaving(true);

    try {
      const { data, error } = await supabase
        .from('loyalty_programs')
        .insert([
          {
            business_id: businessId,
            ...formData,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setProgram(data);
      setIsEditing(false);
      Alert.alert('Success', 'Loyalty program created successfully!');
    } catch (error) {
      console.error('Error creating loyalty program:', error);
      Alert.alert('Error', 'Failed to create loyalty program');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!program) return;

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from('loyalty_programs')
        .update(formData)
        .eq('id', program.id);

      if (error) throw error;

      setProgram({ ...program, ...formData });
      setIsEditing(false);
      Alert.alert('Success', 'Loyalty program updated successfully!');
    } catch (error) {
      console.error('Error updating loyalty program:', error);
      Alert.alert('Error', 'Failed to update loyalty program');
    } finally {
      setIsSaving(false);
    }
  };

  const renderForm = () => (
    <View className="px-4">
      {/* Program Name */}
      <View className="mb-4">
        <Text className="text-gray-700 font-semibold mb-2">Program Name</Text>
        <TextInput
          value={formData.name}
          onChangeText={(text) => setFormData({ ...formData, name: text })}
          className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
          placeholder="e.g., VIP Rewards"
        />
      </View>

      {/* Description */}
      <View className="mb-4">
        <Text className="text-gray-700 font-semibold mb-2">Description</Text>
        <TextInput
          value={formData.description}
          onChangeText={(text) =>
            setFormData({ ...formData, description: text })
          }
          className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
          placeholder="Describe your loyalty program"
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Points per Euro */}
      <View className="mb-4">
        <Text className="text-gray-700 font-semibold mb-2">
          Points per Euro Spent
        </Text>
        <TextInput
          value={String(formData.points_per_euro)}
          onChangeText={(text) =>
            setFormData({ ...formData, points_per_euro: parseInt(text) || 1 })
          }
          className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
          keyboardType="numeric"
          placeholder="1"
        />
      </View>

      {/* Points per Visit */}
      <View className="mb-4">
        <Text className="text-gray-700 font-semibold mb-2">
          Points per Visit/Redemption
        </Text>
        <TextInput
          value={String(formData.points_per_visit)}
          onChangeText={(text) =>
            setFormData({ ...formData, points_per_visit: parseInt(text) || 0 })
          }
          className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
          keyboardType="numeric"
          placeholder="10"
        />
      </View>

      {/* Welcome Bonus */}
      <View className="mb-4">
        <Text className="text-gray-700 font-semibold mb-2">Welcome Bonus</Text>
        <TextInput
          value={String(formData.welcome_bonus)}
          onChangeText={(text) =>
            setFormData({ ...formData, welcome_bonus: parseInt(text) || 0 })
          }
          className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
          keyboardType="numeric"
          placeholder="100"
        />
        <Text className="text-gray-600 text-sm mt-1">
          Points given when customers join
        </Text>
      </View>

      {/* Active Toggle */}
      <View className="flex-row items-center justify-between mb-4 bg-white rounded-xl px-4 py-3">
        <View className="flex-1">
          <Text className="text-gray-900 font-semibold">Active</Text>
          <Text className="text-gray-600 text-sm">
            Allow new members to join
          </Text>
        </View>
        <Switch
          value={formData.is_active}
          onValueChange={(value) =>
            setFormData({ ...formData, is_active: value })
          }
          trackColor={{ false: '#D1D5DB', true: '#10B981' }}
          thumbColor="#FFFFFF"
        />
      </View>

      {/* Action Buttons */}
      <View className="flex-row space-x-3 mb-6">
        <TouchableOpacity
          onPress={() => {
            setIsEditing(false);
            if (program) {
              setFormData({
                name: program.name,
                description: program.description || '',
                points_per_euro: program.points_per_euro,
                points_per_visit: program.points_per_visit,
                welcome_bonus: program.welcome_bonus || 0,
                referral_bonus: program.referral_bonus || 0,
                is_active: program.is_active,
                tier_system_enabled: program.tier_system_enabled || false,
              });
            }
          }}
          disabled={isSaving}
          className="flex-1 bg-gray-200 py-4 rounded-xl items-center"
        >
          <Text className="text-gray-700 font-semibold">Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={program ? handleUpdate : handleCreate}
          disabled={isSaving}
          className="flex-1 bg-primary py-4 rounded-xl items-center"
        >
          {isSaving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold">
              {program ? 'Save Changes' : 'Create Program'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#10B981" />
        <Text className="text-gray-600 mt-4">Loading loyalty program...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-primary px-6 py-6">
          <Text className="text-white text-2xl font-bold mb-2">
            Loyalty Program
          </Text>
          <Text className="text-white/90 text-sm">
            {program ? 'Manage your loyalty program' : 'Create a loyalty program'}
          </Text>
        </View>

        {program && !isEditing ? (
          <>
            {/* Stats Cards */}
            <View className="px-4 -mt-6 mb-6">
              <View className="bg-white rounded-2xl shadow-lg p-4">
                <View className="flex-row mb-4">
                  <View className="flex-1 items-center border-r border-gray-200">
                    <Text className="text-3xl font-bold text-primary">
                      {stats.totalMembers}
                    </Text>
                    <Text className="text-gray-600 text-xs mt-1">Total</Text>
                    <Text className="text-gray-600 text-xs">Members</Text>
                  </View>
                  <View className="flex-1 items-center">
                    <Text className="text-3xl font-bold text-green-600">
                      {stats.activeMembers}
                    </Text>
                    <Text className="text-gray-600 text-xs mt-1">Active</Text>
                    <Text className="text-gray-600 text-xs">Members</Text>
                  </View>
                </View>

                <View className="flex-row pt-4 border-t border-gray-200">
                  <View className="flex-1 items-center border-r border-gray-200">
                    <Text className="text-xl font-bold text-blue-600">
                      {stats.totalPointsIssued.toLocaleString()}
                    </Text>
                    <Text className="text-gray-600 text-xs mt-1">Points Issued</Text>
                  </View>
                  <View className="flex-1 items-center">
                    <Text className="text-xl font-bold text-purple-600">
                      {stats.totalPointsRedeemed.toLocaleString()}
                    </Text>
                    <Text className="text-gray-600 text-xs mt-1">Points Redeemed</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Program Details */}
            <View className="px-4 mb-6">
              <View className="bg-white rounded-2xl shadow-md p-4">
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-lg font-bold text-gray-900">
                    Program Details
                  </Text>
                  <TouchableOpacity
                    onPress={() => setIsEditing(true)}
                    className="px-4 py-2 bg-primary rounded-xl"
                  >
                    <Text className="text-white font-semibold">Edit</Text>
                  </TouchableOpacity>
                </View>

                <View className="space-y-3">
                  <View className="flex-row items-center py-2">
                    <Ionicons name="star" size={20} color="#10B981" />
                    <Text className="text-gray-600 ml-3 flex-1">
                      {program.points_per_euro} point per €1 spent
                    </Text>
                  </View>
                  <View className="flex-row items-center py-2">
                    <Ionicons name="location" size={20} color="#10B981" />
                    <Text className="text-gray-600 ml-3 flex-1">
                      {program.points_per_visit} points per visit
                    </Text>
                  </View>
                  <View className="flex-row items-center py-2">
                    <Ionicons name="gift" size={20} color="#10B981" />
                    <Text className="text-gray-600 ml-3 flex-1">
                      {program.welcome_bonus} welcome bonus points
                    </Text>
                  </View>
                  <View className="flex-row items-center py-2">
                    <Ionicons
                      name={program.is_active ? 'checkmark-circle' : 'close-circle'}
                      size={20}
                      color={program.is_active ? '#10B981' : '#EF4444'}
                    />
                    <Text className="text-gray-600 ml-3 flex-1">
                      {program.is_active ? 'Active' : 'Inactive'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </>
        ) : (
          <>
            <View className="h-4" />
            {renderForm()}
          </>
        )}

        {!program && !isEditing && (
          <View className="px-4">
            <View className="bg-white rounded-2xl shadow-md p-6 items-center">
              <Ionicons name="card-outline" size={80} color="#D1D5DB" />
              <Text className="text-xl font-bold text-gray-900 mt-4 text-center">
                No Loyalty Program
              </Text>
              <Text className="text-gray-600 text-center mt-2 mb-6">
                Create a loyalty program to reward your customers and increase
                retention
              </Text>
              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                className="bg-primary px-6 py-3 rounded-xl"
              >
                <Text className="text-white font-semibold">Create Program</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

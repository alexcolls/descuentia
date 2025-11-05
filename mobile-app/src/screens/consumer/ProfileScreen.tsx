import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '@store/index';
import { updateProfile, signOut } from '@store/slices/authSlice';
import { fetchUserCoupons } from '@store/slices/couponsSlice';
import { Button } from '@components/shared/Button';
import { shareApp } from '@utils/share';

interface ProfileScreenProps {
  navigation: any;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { profile, user, isLoading } = useAppSelector((state) => state.auth);
  const { coupons, activeCoupons } = useAppSelector((state) => state.coupons);

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchUserCoupons(user.id));
    }
  }, [user, dispatch]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;

    if (!fullName.trim()) {
      Alert.alert('Error', 'Full name is required');
      return;
    }

    setIsSaving(true);
    try {
      await dispatch(
        updateProfile({
          userId: user.id,
          updates: {
            full_name: fullName.trim(),
            phone: phone.trim() || null,
          },
        })
      ).unwrap();

      Alert.alert('Success', 'Profile updated successfully');
      setIsEditing(false);
    } catch (error: any) {
      Alert.alert('Error', error || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFullName(profile?.full_name || '');
    setPhone(profile?.phone || '');
    setIsEditing(false);
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => dispatch(signOut()),
      },
    ]);
  };

  const handleShareApp = async () => {
    await shareApp(user?.id);
  };

  const redeemedCount = coupons.filter((c) => c.status === 'redeemed').length;
  const totalSavings = coupons
    .filter((c) => c.status === 'redeemed')
    .reduce((sum, c) => {
      if (c.promotion.discount_type === 'percentage' && c.promotion.discount_value) {
        return sum + 10; // Estimated savings
      } else if (c.promotion.discount_type === 'fixed' && c.promotion.discount_value) {
        return sum + c.promotion.discount_value;
      }
      return sum + 5; // Default for special offers
    }, 0);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FF6B6B" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-primary px-6 py-8">
          <View className="items-center">
            <View className="w-24 h-24 bg-white rounded-full items-center justify-center mb-4">
              <Text className="text-5xl">
                {profile?.full_name?.charAt(0).toUpperCase() || '👤'}
              </Text>
            </View>
            <Text className="text-white text-2xl font-bold mb-1">
              {profile?.full_name || 'Guest User'}
            </Text>
            <Text className="text-white/80 text-sm">{user?.email}</Text>
          </View>
        </View>

        {/* Stats Cards */}
        <View className="px-4 -mt-6 mb-4">
          <View className="bg-white rounded-2xl shadow-lg p-4">
            <View className="flex-row">
              {/* Active Coupons */}
              <View className="flex-1 items-center py-3 border-r border-gray-200">
                <Text className="text-3xl font-bold text-primary">
                  {activeCoupons.length}
                </Text>
                <Text className="text-gray-600 text-sm mt-1">Active</Text>
                <Text className="text-gray-600 text-sm">Coupons</Text>
              </View>

              {/* Redeemed */}
              <View className="flex-1 items-center py-3 border-r border-gray-200">
                <Text className="text-3xl font-bold text-green-600">
                  {redeemedCount}
                </Text>
                <Text className="text-gray-600 text-sm mt-1">Redeemed</Text>
                <Text className="text-gray-600 text-sm">Offers</Text>
              </View>

              {/* Savings */}
              <View className="flex-1 items-center py-3">
                <Text className="text-3xl font-bold text-orange-600">
                  €{totalSavings.toFixed(0)}
                </Text>
                <Text className="text-gray-600 text-sm mt-1">Total</Text>
                <Text className="text-gray-600 text-sm">Saved</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Profile Information */}
        <View className="bg-white mx-4 rounded-2xl shadow-md p-6 mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900">
              Profile Information
            </Text>
            {!isEditing && (
              <TouchableOpacity onPress={() => setIsEditing(true)}>
                <Text className="text-primary font-semibold">Edit</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Full Name */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </Text>
            {isEditing ? (
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your full name"
                className="bg-gray-100 px-4 py-3 rounded-lg text-gray-900"
              />
            ) : (
              <Text className="text-gray-900 text-base">
                {profile?.full_name || 'Not set'}
              </Text>
            )}
          </View>

          {/* Email (read-only) */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Email
            </Text>
            <Text className="text-gray-900 text-base">{user?.email}</Text>
          </View>

          {/* Phone */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Phone Number
            </Text>
            {isEditing ? (
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                className="bg-gray-100 px-4 py-3 rounded-lg text-gray-900"
              />
            ) : (
              <Text className="text-gray-900 text-base">
                {profile?.phone || 'Not set'}
              </Text>
            )}
          </View>

          {/* Account Type */}
          <View>
            <Text className="text-sm font-semibold text-gray-700 mb-2">
              Account Type
            </Text>
            <View className="bg-blue-50 px-3 py-2 rounded-lg self-start">
              <Text className="text-blue-800 font-semibold capitalize">
                {profile?.role || 'Consumer'}
              </Text>
            </View>
          </View>

          {/* Edit Actions */}
          {isEditing && (
            <View className="flex-row mt-6 space-x-3">
              <View className="flex-1 mr-2">
                <Button
                  title="Cancel"
                  onPress={handleCancel}
                  variant="outline"
                  size="md"
                />
              </View>
              <View className="flex-1 ml-2">
                <Button
                  title={isSaving ? 'Saving...' : 'Save'}
                  onPress={handleSave}
                  variant="primary"
                  size="md"
                  disabled={isSaving}
                />
              </View>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View className="bg-white mx-4 rounded-2xl shadow-md mb-4">
          <TouchableOpacity
            onPress={() => navigation.navigate('CouponsTab')}
            className="flex-row items-center justify-between p-4 border-b border-gray-200"
          >
            <View className="flex-row items-center">
              <Text className="text-2xl mr-3">🎫</Text>
              <Text className="text-gray-900 font-medium">My Coupons</Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Alert.alert('Coming Soon', 'Favorites feature coming soon!')}
            className="flex-row items-center justify-between p-4 border-b border-gray-200"
          >
            <View className="flex-row items-center">
              <Text className="text-2xl mr-3">❤️</Text>
              <Text className="text-gray-900 font-medium">Favorites</Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Alert.alert('Coming Soon', 'Settings coming soon!')}
            className="flex-row items-center justify-between p-4 border-b border-gray-200"
          >
            <View className="flex-row items-center">
              <Text className="text-2xl mr-3">⚙️</Text>
              <Text className="text-gray-900 font-medium">Settings</Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleShareApp}
            className="flex-row items-center justify-between p-4"
          >
            <View className="flex-row items-center">
              <Text className="text-2xl mr-3">📤</Text>
              <Text className="text-gray-900 font-medium">Share App</Text>
            </View>
            <Text className="text-gray-400">›</Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        <View className="bg-white mx-4 rounded-2xl shadow-md p-6 mb-4">
          <Text className="text-lg font-bold text-gray-900 mb-3">
            About Descuentia
          </Text>
          <Text className="text-gray-600 text-sm leading-6 mb-3">
            Descuentia connects you with local businesses through exclusive
            discounts and promotional offers. Save money while supporting cancer
            research—5% of our revenue goes directly to the cause.
          </Text>
          <Text className="text-gray-500 text-xs">Version 0.6.0</Text>
        </View>

        {/* Sign Out */}
        <View className="px-4 pb-8">
          <Button
            title="Sign Out"
            onPress={handleSignOut}
            variant="outline"
            size="large"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

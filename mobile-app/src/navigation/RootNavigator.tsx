import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '@store/index';
import { checkSession, setSession } from '@store/slices/authSlice';
import { supabase } from '@services/supabase';
import { View, ActivityIndicator, Text } from 'react-native';

// Import screens
import { LoginScreen } from '@screens/auth/LoginScreen';
import { SignupScreen } from '@screens/auth/SignupScreen';
import { MapScreen } from '@screens/consumer/MapScreen';
import { PromotionDetailsScreen } from '@screens/consumer/PromotionDetailsScreen';
import { CouponsScreen } from '@screens/consumer/CouponsScreen';
import { CouponDetailScreen } from '@screens/consumer/CouponDetailScreen';

// Placeholder screens (to be created later)
const MerchantDashboardScreen = () => (
  <View className="flex-1 items-center justify-center bg-white">
    <Text className="text-2xl font-bold text-primary">Merchant Dashboard</Text>
    <Text className="text-gray-600 mt-2">Dashboard coming soon!</Text>
  </View>
);

const Stack = createNativeStackNavigator();

export const RootNavigator: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, profile } = useAppSelector((state) => state.auth);

  // Check for existing session on mount
  useEffect(() => {
    dispatch(checkSession());
  }, [dispatch]);

  // Listen to auth state changes
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      
      if (event === 'SIGNED_IN' && session) {
        dispatch(setSession({ user: session.user, session }));
      } else if (event === 'SIGNED_OUT') {
        dispatch(setSession({ user: null, session: null }));
      } else if (event === 'TOKEN_REFRESHED' && session) {
        dispatch(setSession({ user: session.user, session }));
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [dispatch]);

  // Show loading screen while checking session
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-primary">
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text className="text-white text-lg mt-4 font-semibold">Loading...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!isAuthenticated ? (
        // Auth Stack - User not logged in
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </Stack.Navigator>
      ) : (
        // Main App Stack - User logged in
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          {profile?.role === 'consumer' ? (
            <>
              <Stack.Screen name="Map" component={MapScreen} />
              <Stack.Screen name="PromotionDetails" component={PromotionDetailsScreen} />
              <Stack.Screen name="Coupons" component={CouponsScreen} />
              <Stack.Screen name="CouponDetail" component={CouponDetailScreen} />
            </>
          ) : (
            <Stack.Screen name="MerchantDashboard" component={MerchantDashboardScreen} />
          )}
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

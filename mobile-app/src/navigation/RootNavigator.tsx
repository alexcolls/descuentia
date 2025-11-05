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
import { PromotionDetailsScreen } from '@screens/consumer/PromotionDetailsScreen';
import { CouponDetailScreen } from '@screens/consumer/CouponDetailScreen';
import { ConsumerTabs } from '@navigation/ConsumerTabs';
import { DashboardScreen } from '@screens/merchant/DashboardScreen';
import { CreatePromotionScreen } from '@screens/merchant/CreatePromotionScreen';
import QRScannerScreen from '@screens/merchant/QRScannerScreen';
import PromotionsListScreen from '@screens/merchant/PromotionsListScreen';

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
              <Stack.Screen name="ConsumerMain" component={ConsumerTabs} />
              <Stack.Screen name="PromotionDetails" component={PromotionDetailsScreen} />
              <Stack.Screen name="CouponDetail" component={CouponDetailScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="MerchantDashboard" component={DashboardScreen} />
              <Stack.Screen name="CreatePromotion" component={CreatePromotionScreen} />
              <Stack.Screen name="QRScanner" component={QRScannerScreen} />
              <Stack.Screen name="PromotionsList" component={PromotionsListScreen} />
            </>
          )}
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

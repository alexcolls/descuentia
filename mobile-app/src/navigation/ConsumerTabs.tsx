import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MapScreen } from '@screens/consumer/MapScreen';
import { CouponsScreen } from '@screens/consumer/CouponsScreen';
import { ProfileScreen } from '@screens/consumer/ProfileScreen';

const Tab = createBottomTabNavigator();

export const ConsumerTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF6B6B',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="MapTab"
        component={MapScreen}
        options={{
          tabBarLabel: 'Discover',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 24 }}>
              {focused ? '🗺️' : '🗺️'}
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="CouponsTab"
        component={CouponsScreen}
        options={{
          tabBarLabel: 'Coupons',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 24 }}>
              {focused ? '🎫' : '🎫'}
            </Text>
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused }) => (
            <Text style={{ fontSize: 24 }}>
              {focused ? '👤' : '👤'}
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Import Text from react-native for the icons
import { Text } from 'react-native';

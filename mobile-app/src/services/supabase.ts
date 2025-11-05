import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

// Environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

// Secure storage adapter for Expo
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: ExpoSecureStoreAdapter as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Type definitions for our database tables
export interface Profile {
  id: string;
  role: 'consumer' | 'merchant';
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  notification_preferences: {
    push: boolean;
    email: boolean;
    proximity: boolean;
  };
  location_permission: boolean;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Business {
  id: string;
  owner_id: string;
  name: string;
  description: string | null;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string | null;
  email: string | null;
  website: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  operating_hours: any;
  social_media: any;
  verified: boolean;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Promotion {
  id: string;
  business_id: string;
  type: 'time_based' | 'fixed' | 'weekly_special';
  title: string;
  description: string | null;
  discount_type: 'percentage' | 'fixed_amount' | 'special_offer';
  discount_value: number | null;
  special_offer_text: string | null;
  start_date: string | null;
  end_date: string | null;
  max_claims_per_user: number | null;
  total_claim_limit: number | null;
  current_claims: number;
  visibility_radius_km: number;
  applicable_items: string[] | null;
  terms_conditions: string | null;
  image_url: string | null;
  featured: boolean;
  status: 'draft' | 'active' | 'paused' | 'expired';
  created_at: string;
  updated_at: string;
}

// Auth helper functions
export const authHelpers = {
  /**
   * Sign up a new user
   */
  signUp: async (email: string, password: string, fullName: string, role: 'consumer' | 'merchant') => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        },
      },
    });

    if (error) throw error;
    return data;
  },

  /**
   * Sign in existing user
   */
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  /**
   * Sign out current user
   */
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Get current session
   */
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  /**
   * Get current user
   */
  getUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  /**
   * Reset password
   */
  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },

  /**
   * Update password
   */
  updatePassword: async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
  },
};

// Profile helper functions
export const profileHelpers = {
  /**
   * Get profile by user ID
   */
  getProfile: async (userId: string): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update profile
   */
  updateProfile: async (userId: string, updates: Partial<Profile>) => {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Complete onboarding
   */
  completeOnboarding: async (userId: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ onboarding_completed: true })
      .eq('id', userId);

    if (error) throw error;
  },
};

export default supabase;

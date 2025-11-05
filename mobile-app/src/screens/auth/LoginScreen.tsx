import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '@store/index';
import { signIn, clearError } from '@store/slices/authSlice';
import { Button } from '@components/shared/Button';
import { Input } from '@components/shared/Input';

interface LoginScreenProps {
  navigation: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  // Validation
  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle login
  const handleLogin = async () => {
    if (!validate()) return;

    try {
      await dispatch(signIn({ email: email.trim(), password })).unwrap();
      // Navigation will be handled by the root navigator based on auth state
    } catch (err: any) {
      Alert.alert('Login Failed', err || 'Please check your credentials and try again.');
    }
  };

  // Clear error when user starts typing
  React.useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [email, password]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50"
    >
      <ScrollView
        contentContainerClassName="flex-grow"
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-6 py-12">
          {/* Header */}
          <View className="items-center mb-8">
            <Text className="text-4xl font-bold text-primary mb-2">Descuentia</Text>
            <Text className="text-lg text-gray-600">Incredible discounts near you!</Text>
          </View>

          {/* Form */}
          <View className="bg-white rounded-2xl p-6 shadow-lg">
            <Text className="text-2xl font-bold text-gray-900 mb-6">Welcome Back</Text>

            <Input
              label="Email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              editable={!isLoading}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              editable={!isLoading}
            />

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              className="self-end mb-6"
            >
              <Text className="text-primary text-sm font-medium">Forgot Password?</Text>
            </TouchableOpacity>

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={isLoading}
              size="lg"
              className="mb-4"
            />

            <View className="flex-row justify-center items-center mt-4">
              <Text className="text-gray-600 text-sm">Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text className="text-primary text-sm font-semibold">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View className="items-center mt-8">
            <Text className="text-gray-500 text-xs">
              By continuing, you agree to our Terms of Service
            </Text>
            <Text className="text-gray-500 text-xs">and Privacy Policy</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

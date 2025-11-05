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
import { signUp, clearError } from '@store/slices/authSlice';
import { Button } from '@components/shared/Button';
import { Input } from '@components/shared/Input';

interface SignupScreenProps {
  navigation: any;
}

export const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'consumer' | 'merchant'>('consumer');
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  // Validation
  const validate = (): boolean => {
    const newErrors: any = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle signup
  const handleSignup = async () => {
    if (!validate()) return;

    try {
      await dispatch(
        signUp({
          email: email.trim(),
          password,
          fullName: fullName.trim(),
          role,
        })
      ).unwrap();

      Alert.alert(
        'Success!',
        'Your account has been created. Please check your email to verify your account.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (err: any) {
      Alert.alert('Signup Failed', err || 'Please try again.');
    }
  };

  // Clear errors when typing
  React.useEffect(() => {
    dispatch(clearError());
  }, [email, password, fullName, confirmPassword]);

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
          <View className="items-center mb-6">
            <Text className="text-3xl font-bold text-primary mb-2">Create Account</Text>
            <Text className="text-base text-gray-600">Join Descuentia today</Text>
          </View>

          {/* Form */}
          <View className="bg-white rounded-2xl p-6 shadow-lg">
            {/* Role Selection */}
            <Text className="text-sm font-semibold text-gray-700 mb-3">I am a:</Text>
            <View className="flex-row mb-6">
              <TouchableOpacity
                onPress={() => setRole('consumer')}
                className={`flex-1 py-3 rounded-lg mr-2 items-center ${
                  role === 'consumer' ? 'bg-primary' : 'bg-gray-100'
                }`}
              >
                <Text className={role === 'consumer' ? 'text-white font-semibold' : 'text-gray-600'}>
                  Consumer
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => setRole('merchant')}
                className={`flex-1 py-3 rounded-lg ml-2 items-center ${
                  role === 'merchant' ? 'bg-primary' : 'bg-gray-100'
                }`}
              >
                <Text className={role === 'merchant' ? 'text-white font-semibold' : 'text-gray-600'}>
                  Merchant
                </Text>
              </TouchableOpacity>
            </View>

            <Input
              label="Full Name"
              placeholder="John Doe"
              value={fullName}
              onChangeText={setFullName}
              error={errors.fullName}
              editable={!isLoading}
            />

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
              placeholder="At least 6 characters"
              value={password}
              onChangeText={setPassword}
              error={errors.password}
              editable={!isLoading}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              error={errors.confirmPassword}
              editable={!isLoading}
            />

            <Button
              title="Create Account"
              onPress={handleSignup}
              loading={isLoading}
              size="lg"
              className="mt-2 mb-4"
            />

            <View className="flex-row justify-center items-center mt-4">
              <Text className="text-gray-600 text-sm">Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text className="text-primary text-sm font-semibold">Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View className="items-center mt-6">
            <Text className="text-gray-500 text-xs text-center px-6">
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  type?: 'text' | 'email' | 'password' | 'phone';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  type = 'text',
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const getKeyboardType = () => {
    switch (type) {
      case 'email':
        return 'email-address';
      case 'phone':
        return 'phone-pad';
      default:
        return 'default';
    }
  };

  const isPassword = type === 'password';
  const showPassword = isPassword && isPasswordVisible;

  return (
    <View className={`mb-4 ${className}`}>
      {label && (
        <Text className="text-gray-700 text-sm font-medium mb-2">{label}</Text>
      )}
      
      <View className={`flex-row items-center bg-white border rounded-lg px-4 ${
        error ? 'border-error' : 'border-gray-300'
      }`}>
        {leftIcon && <View className="mr-2">{leftIcon}</View>}
        
        <TextInput
          className="flex-1 py-3 text-gray-900"
          placeholderTextColor="#9CA3AF"
          keyboardType={getKeyboardType()}
          secureTextEntry={isPassword && !showPassword}
          autoCapitalize={type === 'email' ? 'none' : 'sentences'}
          autoCorrect={false}
          {...props}
        />
        
        {isPassword && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            className="ml-2"
          >
            <Text className="text-primary text-sm">
              {showPassword ? 'Hide' : 'Show'}
            </Text>
          </TouchableOpacity>
        )}
        
        {rightIcon && !isPassword && <View className="ml-2">{rightIcon}</View>}
      </View>
      
      {error && (
        <Text className="text-error text-xs mt-1">{error}</Text>
      )}
    </View>
  );
};

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View className="flex-1 bg-gray-50 items-center justify-center px-6">
          <Ionicons name="warning" size={80} color="#EF4444" />
          <Text className="text-2xl font-bold text-gray-900 mt-6 text-center">
            Oops! Something went wrong
          </Text>
          <Text className="text-gray-600 text-center mt-2 mb-6">
            We're sorry for the inconvenience. Please try again.
          </Text>

          {__DEV__ && this.state.error && (
            <ScrollView className="bg-red-50 rounded-xl p-4 mb-4 max-h-64 w-full">
              <Text className="text-red-900 font-bold mb-2">
                Error Details (Dev Only):
              </Text>
              <Text className="text-red-800 text-xs font-mono">
                {this.state.error.toString()}
              </Text>
              {this.state.errorInfo && (
                <Text className="text-red-700 text-xs font-mono mt-2">
                  {this.state.errorInfo.componentStack}
                </Text>
              )}
            </ScrollView>
          )}

          <TouchableOpacity
            onPress={this.handleReset}
            className="bg-primary px-8 py-4 rounded-xl"
          >
            <Text className="text-white font-bold text-base">Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

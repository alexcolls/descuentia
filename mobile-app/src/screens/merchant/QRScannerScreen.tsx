import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  ScrollView,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';
import { redeemCoupon, getCouponDetails, RedemptionResult } from '@services/redemption.service';
import { Ionicons } from '@expo/vector-icons';

export default function QRScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<RedemptionResult | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const { user } = useSelector((state: RootState) => state.auth);
  const businessId = user?.business_id;

  useEffect(() => {
    if (!permission?.granted && permission?.canAskAgain) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned || isProcessing || !businessId) return;

    setScanned(true);
    setIsProcessing(true);

    try {
      // First, get coupon details for preview
      const preview = await getCouponDetails(data, businessId);
      setPreviewData(preview);
      setShowPreview(true);
    } catch (error) {
      Alert.alert('Error', 'Failed to scan coupon');
      setScanned(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmRedemption = async () => {
    if (!businessId || !previewData?.coupon?.code) return;

    setIsProcessing(true);

    try {
      const result = await redeemCoupon(previewData.coupon.code, businessId);

      setShowPreview(false);
      setPreviewData(null);

      if (result.success) {
        Alert.alert(
          '✅ Success!',
          result.message,
          [
            {
              text: 'Scan Another',
              onPress: () => {
                setTimeout(() => setScanned(false), 500);
              },
            },
          ]
        );
      } else {
        Alert.alert(
          '❌ Cannot Redeem',
          result.message,
          [
            {
              text: 'Try Again',
              onPress: () => {
                setTimeout(() => setScanned(false), 500);
              },
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to redeem coupon');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancelPreview = () => {
    setShowPreview(false);
    setPreviewData(null);
    setTimeout(() => setScanned(false), 500);
  };

  const getDiscountDisplay = () => {
    if (!previewData?.coupon) return '';

    const { discount_type, discount_value } = previewData.coupon.promotion;

    if (discount_type === 'percentage') {
      return `${discount_value}% OFF`;
    } else if (discount_type === 'fixed_amount') {
      return `€${discount_value} OFF`;
    } else {
      return 'SPECIAL OFFER';
    }
  };

  if (!permission) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#10B981" />
        <Text className="text-gray-600 mt-4">Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-gray-50 items-center justify-center p-6">
        <Ionicons name="camera-outline" size={80} color="#9CA3AF" />
        <Text className="text-xl font-bold text-gray-900 mt-6 text-center">
          Camera Permission Required
        </Text>
        <Text className="text-gray-600 mt-2 text-center">
          We need camera access to scan QR codes from customer coupons
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="mt-6 bg-emerald-500 px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      >
        {/* Overlay */}
        <View className="flex-1 bg-black/40">
          {/* Header */}
          <View className="pt-14 px-6">
            <Text className="text-white text-2xl font-bold text-center">
              Scan Coupon QR Code
            </Text>
            <Text className="text-white/80 text-center mt-2">
              Align the QR code within the frame
            </Text>
          </View>

          {/* Scanning Frame */}
          <View className="flex-1 items-center justify-center">
            <View className="w-72 h-72 border-4 border-white/80 rounded-3xl relative">
              {/* Corner decorations */}
              <View className="absolute top-0 left-0 w-12 h-12 border-t-8 border-l-8 border-emerald-400 rounded-tl-3xl" />
              <View className="absolute top-0 right-0 w-12 h-12 border-t-8 border-r-8 border-emerald-400 rounded-tr-3xl" />
              <View className="absolute bottom-0 left-0 w-12 h-12 border-b-8 border-l-8 border-emerald-400 rounded-bl-3xl" />
              <View className="absolute bottom-0 right-0 w-12 h-12 border-b-8 border-r-8 border-emerald-400 rounded-br-3xl" />

              {/* Center crosshair */}
              <View className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Ionicons name="scan" size={40} color="#10B981" />
              </View>
            </View>

            {isProcessing && (
              <View className="mt-6 bg-black/60 px-6 py-3 rounded-full">
                <ActivityIndicator size="small" color="white" />
              </View>
            )}
          </View>

          {/* Instructions */}
          <View className="pb-12 px-6">
            <View className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <View className="flex-row items-center mb-2">
                <Ionicons name="information-circle" size={20} color="white" />
                <Text className="text-white font-semibold ml-2">How to scan:</Text>
              </View>
              <Text className="text-white/80 text-sm">
                • Ask customer to show their coupon QR code{'\n'}
                • Hold device steady and align QR code in frame{'\n'}
                • Wait for automatic scan and verification
              </Text>
            </View>
          </View>
        </View>
      </CameraView>

      {/* Preview Modal */}
      <Modal
        visible={showPreview}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCancelPreview}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl max-h-4/5">
            <ScrollView className="p-6">
              {/* Header */}
              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-2xl font-bold text-gray-900">
                  Coupon Details
                </Text>
                <TouchableOpacity
                  onPress={handleCancelPreview}
                  className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
                >
                  <Ionicons name="close" size={24} color="#374151" />
                </TouchableOpacity>
              </View>

              {previewData?.coupon && (
                <>
                  {/* Status Badge */}
                  <View
                    className={`self-start px-4 py-2 rounded-full mb-4 ${
                      previewData.success
                        ? 'bg-emerald-100'
                        : 'bg-red-100'
                    }`}
                  >
                    <Text
                      className={`font-semibold ${
                        previewData.success
                          ? 'text-emerald-700'
                          : 'text-red-700'
                      }`}
                    >
                      {previewData.message}
                    </Text>
                  </View>

                  {/* Discount Badge */}
                  <View className="bg-emerald-500 px-6 py-4 rounded-2xl mb-4 items-center">
                    <Text className="text-4xl font-bold text-white">
                      {getDiscountDisplay()}
                    </Text>
                  </View>

                  {/* Promotion Details */}
                  <View className="bg-gray-50 rounded-2xl p-4 mb-4">
                    <Text className="text-lg font-bold text-gray-900 mb-1">
                      {previewData.coupon.promotion.title}
                    </Text>
                    <Text className="text-gray-600">
                      {previewData.coupon.promotion.description}
                    </Text>
                  </View>

                  {/* Customer Info */}
                  <View className="bg-gray-50 rounded-2xl p-4 mb-4">
                    <Text className="text-sm font-semibold text-gray-500 mb-2">
                      CUSTOMER
                    </Text>
                    <View className="flex-row items-center mb-2">
                      <Ionicons name="person" size={18} color="#6B7280" />
                      <Text className="text-gray-900 ml-2">
                        {previewData.coupon.user.full_name}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <Ionicons name="mail" size={18} color="#6B7280" />
                      <Text className="text-gray-600 ml-2 text-sm">
                        {previewData.coupon.user.email}
                      </Text>
                    </View>
                  </View>

                  {/* Code */}
                  <View className="bg-gray-50 rounded-2xl p-4 mb-6">
                    <Text className="text-xs font-semibold text-gray-500 mb-1">
                      COUPON CODE
                    </Text>
                    <Text className="text-xs text-gray-600 font-mono">
                      {previewData.coupon.code}
                    </Text>
                  </View>

                  {/* Action Buttons */}
                  {previewData.success ? (
                    <View className="flex-row space-x-3">
                      <TouchableOpacity
                        onPress={handleCancelPreview}
                        disabled={isProcessing}
                        className="flex-1 bg-gray-200 py-4 rounded-xl items-center"
                      >
                        <Text className="text-gray-700 font-semibold text-base">
                          Cancel
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleConfirmRedemption}
                        disabled={isProcessing}
                        className="flex-1 bg-emerald-500 py-4 rounded-xl items-center"
                      >
                        {isProcessing ? (
                          <ActivityIndicator color="white" />
                        ) : (
                          <Text className="text-white font-bold text-base">
                            Redeem Now
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={handleCancelPreview}
                      className="bg-gray-500 py-4 rounded-xl items-center"
                    >
                      <Text className="text-white font-semibold text-base">
                        Close
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

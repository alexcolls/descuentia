import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { useAppDispatch, useAppSelector } from '@store/index';
import {
  fetchNearbyPromotions,
  fetchFeaturedPromotions,
  setUserLocation,
  PromotionWithBusiness,
} from '@store/slices/promotionsSlice';
import {
  getCurrentLocation,
  getDefaultLocation,
  Coordinates,
} from '@services/location';
import { FeaturedCarousel } from '@components/consumer/FeaturedCarousel';
import { PromotionCard } from '@components/consumer/PromotionCard';

interface MapScreenProps {
  navigation: any;
}

export const MapScreen: React.FC<MapScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const mapRef = useRef<MapView>(null);
  
  const { promotions, featuredPromotions, userLocation, radiusKm, isLoading } =
    useAppSelector((state) => state.promotions);
  const { profile } = useAppSelector((state) => state.auth);

  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<PromotionWithBusiness | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Initial location and data fetch
  useEffect(() => {
    initializeLocation();
  }, []);

  const initializeLocation = async () => {
    try {
      // Try to get current location
      const location = await getCurrentLocation();
      
      if (location) {
        const coords = location.coords;
        setCurrentLocation(coords);
        dispatch(setUserLocation(coords));
        
        // Fetch promotions near user
        dispatch(fetchNearbyPromotions({ location: coords, radiusKm }));
        dispatch(fetchFeaturedPromotions(coords));
        
        // Center map on user location
        if (mapRef.current && isMapReady) {
          mapRef.current.animateToRegion({
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          });
        }
      } else {
        // Use default location (Madrid)
        const defaultCoords = getDefaultLocation();
        setCurrentLocation(defaultCoords);
        dispatch(setUserLocation(defaultCoords));
        dispatch(fetchFeaturedPromotions(defaultCoords));
        
        Alert.alert(
          'Location Not Available',
          'Using default location. Enable location services for personalized results.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error initializing location:', error);
      const defaultCoords = getDefaultLocation();
      setCurrentLocation(defaultCoords);
      dispatch(fetchFeaturedPromotions(defaultCoords));
    }
  };

  // Handle map ready
  const onMapReady = () => {
    setIsMapReady(true);
  };

  // Handle refresh
  const handleRefresh = () => {
    if (currentLocation) {
      dispatch(fetchNearbyPromotions({ location: currentLocation, radiusKm }));
      dispatch(fetchFeaturedPromotions(currentLocation));
    }
  };

  // Handle marker press
  const handleMarkerPress = (promotion: PromotionWithBusiness) => {
    setSelectedMarker(promotion);
  };

  // Handle promotion card press
  const handlePromotionPress = (promotion: PromotionWithBusiness) => {
    navigation.navigate('PromotionDetails', { promotionId: promotion.id });
  };

  // Get initial region
  const getInitialRegion = (): Region => {
    const location = currentLocation || getDefaultLocation();
    return {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    };
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-4 py-3 bg-white border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm text-gray-600">Welcome back,</Text>
            <Text className="text-lg font-bold text-gray-900">
              {profile?.full_name || 'Guest'}
            </Text>
          </View>
          
          <View className="flex-row">
            <TouchableOpacity
              onPress={() => navigation.navigate('Coupons')}
              className="bg-gray-100 px-3 py-2 rounded-full mr-2"
            >
              <Text className="text-sm">🎫</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleRefresh}
              className="bg-primary p-3 rounded-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text className="text-white">🔄</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Stats */}
        <View className="flex-row items-center mt-2">
          <Text className="text-sm text-gray-600">
            📍 {promotions.length} discounts nearby
          </Text>
        </View>
      </View>

      {/* Map Container */}
      <View className="flex-1">
        {currentLocation ? (
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={{ flex: 1 }}
            initialRegion={getInitialRegion()}
            showsUserLocation
            showsMyLocationButton
            onMapReady={onMapReady}
            className="flex-1"
          >
            {/* Promotion Markers */}
            {promotions.map((promotion) => (
              <Marker
                key={promotion.id}
                coordinate={{
                  latitude: promotion.business.latitude,
                  longitude: promotion.business.longitude,
                }}
                onPress={() => handleMarkerPress(promotion)}
                title={promotion.title}
                description={promotion.business.name}
              >
                <View className="items-center">
                  <View className="bg-primary px-3 py-2 rounded-full shadow-lg">
                    <Text className="text-white font-bold text-xs">
                      {promotion.discount_type === 'percentage'
                        ? `-${promotion.discount_value}%`
                        : promotion.special_offer_text || '🎁'}
                    </Text>
                  </View>
                  <View className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-transparent border-t-primary" />
                </View>
              </Marker>
            ))}
          </MapView>
        ) : (
          <View className="flex-1 items-center justify-center bg-gray-50">
            <ActivityIndicator size="large" color="#FF6B6B" />
            <Text className="text-gray-600 mt-4">Loading map...</Text>
          </View>
        )}

        {/* Featured Carousel Overlay */}
        {featuredPromotions.length > 0 && (
          <View className="absolute top-0 left-0 right-0 pt-4 bg-gradient-to-b from-white/90">
            <FeaturedCarousel
              promotions={featuredPromotions}
              onPromotionPress={handlePromotionPress}
            />
          </View>
        )}

        {/* Selected Marker Card */}
        {selectedMarker && (
          <View className="absolute bottom-0 left-0 right-0 p-4 bg-transparent">
            <PromotionCard
              promotion={selectedMarker}
              onPress={() => handlePromotionPress(selectedMarker)}
            />
            <TouchableOpacity
              onPress={() => setSelectedMarker(null)}
              className="absolute top-6 right-6 bg-white p-2 rounded-full shadow-lg"
            >
              <Text className="text-gray-600 font-bold">✕</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Empty State */}
        {!isLoading && promotions.length === 0 && currentLocation && (
          <View className="absolute inset-0 items-center justify-center pointer-events-none">
            <View className="bg-white p-6 rounded-2xl shadow-lg max-w-xs">
              <Text className="text-4xl text-center mb-2">🔍</Text>
              <Text className="text-gray-900 font-bold text-center text-lg mb-2">
                No Discounts Nearby
              </Text>
              <Text className="text-gray-600 text-center text-sm">
                Try adjusting your location or check back later for new deals!
              </Text>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

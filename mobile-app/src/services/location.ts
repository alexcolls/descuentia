import * as Location from 'expo-location';
import { Alert } from 'react-native';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationResult {
  coords: Coordinates;
  timestamp: number;
}

/**
 * Request location permissions
 */
export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Location Permission Required',
        'Descuentia needs access to your location to show nearby discounts.',
        [{ text: 'OK' }]
      );
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

/**
 * Check if location permissions are granted
 */
export const checkLocationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error checking location permission:', error);
    return false;
  }
};

/**
 * Get current location
 */
export const getCurrentLocation = async (): Promise<LocationResult | null> => {
  try {
    const hasPermission = await checkLocationPermission();
    
    if (!hasPermission) {
      const granted = await requestLocationPermission();
      if (!granted) return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      coords: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
      timestamp: location.timestamp,
    };
  } catch (error) {
    console.error('Error getting current location:', error);
    Alert.alert(
      'Location Error',
      'Unable to get your current location. Please check your settings.',
      [{ text: 'OK' }]
    );
    return null;
  }
};

/**
 * Watch location changes
 */
export const watchLocation = async (
  callback: (location: LocationResult) => void
): Promise<{ remove: () => void } | null> => {
  try {
    const hasPermission = await checkLocationPermission();
    
    if (!hasPermission) {
      const granted = await requestLocationPermission();
      if (!granted) return null;
    }

    const subscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 10000, // Update every 10 seconds
        distanceInterval: 50, // Or when moved 50 meters
      },
      (location) => {
        callback({
          coords: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          timestamp: location.timestamp,
        });
      }
    );

    return subscription;
  } catch (error) {
    console.error('Error watching location:', error);
    return null;
  }
};

/**
 * Calculate distance between two coordinates (in kilometers)
 * Uses Haversine formula
 */
export const calculateDistance = (
  coord1: Coordinates,
  coord2: Coordinates
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(coord2.latitude - coord1.latitude);
  const dLon = toRad(coord2.longitude - coord1.longitude);
  
  const lat1 = toRad(coord1.latitude);
  const lat2 = toRad(coord2.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
};

/**
 * Convert degrees to radians
 */
const toRad = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Format distance for display
 */
export const formatDistance = (kilometers: number): string => {
  if (kilometers < 1) {
    return `${Math.round(kilometers * 1000)}m`;
  }
  return `${kilometers.toFixed(1)}km`;
};

/**
 * Check if coordinate is within radius
 */
export const isWithinRadius = (
  center: Coordinates,
  point: Coordinates,
  radiusKm: number
): boolean => {
  const distance = calculateDistance(center, point);
  return distance <= radiusKm;
};

/**
 * Get default location (Madrid, Spain)
 */
export const getDefaultLocation = (): Coordinates => {
  return {
    latitude: parseFloat(process.env.DEFAULT_LATITUDE || '40.416775'),
    longitude: parseFloat(process.env.DEFAULT_LONGITUDE || '-3.703790'),
  };
};

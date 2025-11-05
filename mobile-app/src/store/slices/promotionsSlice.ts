import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase, Promotion, Business } from '@services/supabase';
import { Coordinates, calculateDistance } from '@services/location';

export interface PromotionWithBusiness extends Promotion {
  business: Business;
  distance?: number;
}

interface PromotionsState {
  promotions: PromotionWithBusiness[];
  featuredPromotions: PromotionWithBusiness[];
  selectedPromotion: PromotionWithBusiness | null;
  isLoading: boolean;
  error: string | null;
  userLocation: Coordinates | null;
  radiusKm: number;
}

const initialState: PromotionsState = {
  promotions: [],
  featuredPromotions: [],
  selectedPromotion: null,
  isLoading: false,
  error: null,
  userLocation: null,
  radiusKm: 2.0, // Default 2km radius
};

/**
 * Fetch promotions near user location
 */
export const fetchNearbyPromotions = createAsyncThunk(
  'promotions/fetchNearby',
  async (
    { location, radiusKm }: { location: Coordinates; radiusKm: number },
    { rejectWithValue }
  ) => {
    try {
      // Fetch active promotions with their businesses
      const { data: promotions, error: promoError } = await supabase
        .from('promotions')
        .select(`
          *,
          business:businesses(*)
        `)
        .eq('status', 'active')
        .gte('end_date', new Date().toISOString())
        .order('created_at', { ascending: false });

      if (promoError) throw promoError;

      if (!promotions) return [];

      // Filter by distance and calculate distance for each
      const promotionsWithDistance = promotions
        .map((promo: any) => {
          const business = promo.business;
          const distance = calculateDistance(location, {
            latitude: business.latitude,
            longitude: business.longitude,
          });

          // Check if within visibility radius
          const withinVisibility = distance <= (promo.visibility_radius_km || 5);
          const withinUserRadius = distance <= radiusKm;

          if (!withinVisibility || !withinUserRadius) return null;

          return {
            ...promo,
            business,
            distance,
          } as PromotionWithBusiness;
        })
        .filter((p): p is PromotionWithBusiness => p !== null)
        .sort((a, b) => (a.distance || 0) - (b.distance || 0));

      return promotionsWithDistance;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch promotions');
    }
  }
);

/**
 * Fetch featured promotions (weekly specials)
 */
export const fetchFeaturedPromotions = createAsyncThunk(
  'promotions/fetchFeatured',
  async (location: Coordinates | null, { rejectWithValue }) => {
    try {
      const { data: promotions, error } = await supabase
        .from('promotions')
        .select(`
          *,
          business:businesses(*)
        `)
        .eq('status', 'active')
        .eq('type', 'weekly_special')
        .eq('featured', true)
        .gte('end_date', new Date().toISOString())
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      if (!promotions) return [];

      // Add distance if location provided
      const promotionsWithDistance = promotions.map((promo: any) => {
        const business = promo.business;
        const distance = location
          ? calculateDistance(location, {
              latitude: business.latitude,
              longitude: business.longitude,
            })
          : undefined;

        return {
          ...promo,
          business,
          distance,
        } as PromotionWithBusiness;
      });

      return promotionsWithDistance;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch featured promotions');
    }
  }
);

/**
 * Fetch single promotion by ID
 */
export const fetchPromotionById = createAsyncThunk(
  'promotions/fetchById',
  async (promotionId: string, { rejectWithValue }) => {
    try {
      const { data: promotion, error } = await supabase
        .from('promotions')
        .select(`
          *,
          business:businesses(*)
        `)
        .eq('id', promotionId)
        .single();

      if (error) throw error;

      return {
        ...promotion,
        business: promotion.business,
      } as PromotionWithBusiness;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch promotion');
    }
  }
);

const promotionsSlice = createSlice({
  name: 'promotions',
  initialState,
  reducers: {
    setUserLocation: (state, action: PayloadAction<Coordinates>) => {
      state.userLocation = action.payload;
    },
    setRadius: (state, action: PayloadAction<number>) => {
      state.radiusKm = action.payload;
    },
    setSelectedPromotion: (state, action: PayloadAction<PromotionWithBusiness | null>) => {
      state.selectedPromotion = action.payload;
    },
    clearPromotions: (state) => {
      state.promotions = [];
      state.featuredPromotions = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch nearby promotions
    builder
      .addCase(fetchNearbyPromotions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNearbyPromotions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.promotions = action.payload;
      })
      .addCase(fetchNearbyPromotions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch featured promotions
    builder
      .addCase(fetchFeaturedPromotions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedPromotions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featuredPromotions = action.payload;
      })
      .addCase(fetchFeaturedPromotions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch promotion by ID
    builder
      .addCase(fetchPromotionById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPromotionById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedPromotion = action.payload;
      })
      .addCase(fetchPromotionById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setUserLocation,
  setRadius,
  setSelectedPromotion,
  clearPromotions,
} = promotionsSlice.actions;

export default promotionsSlice.reducer;

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase, Promotion, Business } from '@services/supabase';
import { Coordinates, calculateDistance } from '@services/location';

export interface PromotionWithBusiness extends Promotion {
  business: Business;
  distance?: number;
}

interface PromotionsState {
  promotions: PromotionWithBusiness[];
  filteredPromotions: PromotionWithBusiness[];
  featuredPromotions: PromotionWithBusiness[];
  selectedPromotion: PromotionWithBusiness | null;
  isLoading: boolean;
  error: string | null;
  userLocation: Coordinates | null;
  radiusKm: number;
  filters: {
    searchQuery: string;
    categories: string[];
    types: string[];
    maxDistance: number;
  };
}

/**
 * Helper function to apply filters to promotions
 */
const applyFilters = (state: PromotionsState) => {
  let filtered = [...state.promotions];

  // Search query filter
  if (state.filters.searchQuery) {
    const query = state.filters.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (promo) =>
        promo.title.toLowerCase().includes(query) ||
        promo.business.name.toLowerCase().includes(query) ||
        promo.description?.toLowerCase().includes(query) ||
        promo.business.category.toLowerCase().includes(query)
    );
  }

  // Category filter
  if (state.filters.categories.length > 0) {
    filtered = filtered.filter((promo) =>
      state.filters.categories.includes(promo.business.category)
    );
  }

  // Type filter
  if (state.filters.types.length > 0) {
    filtered = filtered.filter((promo) =>
      state.filters.types.includes(promo.type)
    );
  }

  // Distance filter
  filtered = filtered.filter(
    (promo) => !promo.distance || promo.distance <= state.filters.maxDistance
  );

  state.filteredPromotions = filtered;
};

const initialState: PromotionsState = {
  promotions: [],
  filteredPromotions: [],
  featuredPromotions: [],
  selectedPromotion: null,
  isLoading: false,
  error: null,
  userLocation: null,
  radiusKm: 2.0, // Default 2km radius
  filters: {
    searchQuery: '',
    categories: [],
    types: [],
    maxDistance: 5,
  },
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
      state.filteredPromotions = [];
      state.featuredPromotions = [];
      state.error = null;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload;
      applyFilters(state);
    },
    toggleCategory: (state, action: PayloadAction<string>) => {
      const category = action.payload;
      const index = state.filters.categories.indexOf(category);
      if (index > -1) {
        state.filters.categories.splice(index, 1);
      } else {
        state.filters.categories.push(category);
      }
      applyFilters(state);
    },
    toggleType: (state, action: PayloadAction<string>) => {
      const type = action.payload;
      const index = state.filters.types.indexOf(type);
      if (index > -1) {
        state.filters.types.splice(index, 1);
      } else {
        state.filters.types.push(type);
      }
      applyFilters(state);
    },
    setMaxDistance: (state, action: PayloadAction<number>) => {
      state.filters.maxDistance = action.payload;
      applyFilters(state);
    },
    resetFilters: (state) => {
      state.filters = {
        searchQuery: '',
        categories: [],
        types: [],
        maxDistance: 5,
      };
      applyFilters(state);
    },
    applyFiltersManually: (state) => {
      applyFilters(state);
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
        applyFilters(state);
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
  setSearchQuery,
  toggleCategory,
  toggleType,
  setMaxDistance,
  resetFilters,
  applyFiltersManually,
} = promotionsSlice.actions;

export default promotionsSlice.reducer;

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  claimPromotion,
  getUserCoupons,
  getCouponById,
  Coupon,
} from '@services/coupon';

export interface CouponWithDetails extends Coupon {
  promotion: {
    id: string;
    title: string;
    description?: string;
    discount_type: 'percentage' | 'fixed' | 'special';
    discount_value?: number;
    special_offer_text?: string;
    terms_conditions?: string;
    image_url?: string;
    business: {
      id: string;
      name: string;
      address?: string;
      phone?: string;
      latitude: number;
      longitude: number;
      category: string;
    };
  };
}

interface CouponsState {
  coupons: CouponWithDetails[];
  activeCoupons: CouponWithDetails[];
  redeemedCoupons: CouponWithDetails[];
  selectedCoupon: CouponWithDetails | null;
  isLoading: boolean;
  error: string | null;
  lastFetch: number | null;
}

const initialState: CouponsState = {
  coupons: [],
  activeCoupons: [],
  redeemedCoupons: [],
  selectedCoupon: null,
  isLoading: false,
  error: null,
  lastFetch: null,
};

/**
 * Claim a promotion and create a coupon
 */
export const claimCoupon = createAsyncThunk(
  'coupons/claim',
  async (
    { promotionId, userId }: { promotionId: string; userId: string },
    { rejectWithValue }
  ) => {
    try {
      const coupon = await claimPromotion(promotionId, userId);
      
      // Fetch full coupon details with promotion and business info
      const couponDetails = await getCouponById(coupon.id);
      
      return couponDetails;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to claim coupon');
    }
  }
);

/**
 * Fetch all user's coupons
 */
export const fetchUserCoupons = createAsyncThunk(
  'coupons/fetchAll',
  async (userId: string, { rejectWithValue }) => {
    try {
      const coupons = await getUserCoupons(userId);
      return coupons;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch coupons');
    }
  }
);

/**
 * Fetch active coupons only
 */
export const fetchActiveCoupons = createAsyncThunk(
  'coupons/fetchActive',
  async (userId: string, { rejectWithValue }) => {
    try {
      const coupons = await getUserCoupons(userId, 'claimed');
      return coupons;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch active coupons');
    }
  }
);

/**
 * Fetch redeemed coupons only
 */
export const fetchRedeemedCoupons = createAsyncThunk(
  'coupons/fetchRedeemed',
  async (userId: string, { rejectWithValue }) => {
    try {
      const coupons = await getUserCoupons(userId, 'redeemed');
      return coupons;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch redeemed coupons');
    }
  }
);

/**
 * Fetch single coupon details
 */
export const fetchCouponDetails = createAsyncThunk(
  'coupons/fetchById',
  async (couponId: string, { rejectWithValue }) => {
    try {
      const coupon = await getCouponById(couponId);
      return coupon;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch coupon details');
    }
  }
);

const couponsSlice = createSlice({
  name: 'coupons',
  initialState,
  reducers: {
    clearSelectedCoupon: (state) => {
      state.selectedCoupon = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Claim coupon
    builder
      .addCase(claimCoupon.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(claimCoupon.fulfilled, (state, action: PayloadAction<CouponWithDetails>) => {
        state.isLoading = false;
        state.coupons.unshift(action.payload);
        state.activeCoupons.unshift(action.payload);
        state.selectedCoupon = action.payload;
      })
      .addCase(claimCoupon.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch all coupons
    builder
      .addCase(fetchUserCoupons.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchUserCoupons.fulfilled,
        (state, action: PayloadAction<CouponWithDetails[]>) => {
          state.isLoading = false;
          state.coupons = action.payload;
          state.activeCoupons = action.payload.filter((c) => c.status === 'claimed');
          state.redeemedCoupons = action.payload.filter((c) => c.status === 'redeemed');
          state.lastFetch = Date.now();
        }
      )
      .addCase(fetchUserCoupons.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch active coupons
    builder
      .addCase(fetchActiveCoupons.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchActiveCoupons.fulfilled,
        (state, action: PayloadAction<CouponWithDetails[]>) => {
          state.isLoading = false;
          state.activeCoupons = action.payload;
        }
      )
      .addCase(fetchActiveCoupons.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch redeemed coupons
    builder
      .addCase(fetchRedeemedCoupons.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchRedeemedCoupons.fulfilled,
        (state, action: PayloadAction<CouponWithDetails[]>) => {
          state.isLoading = false;
          state.redeemedCoupons = action.payload;
        }
      )
      .addCase(fetchRedeemedCoupons.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch coupon details
    builder
      .addCase(fetchCouponDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchCouponDetails.fulfilled,
        (state, action: PayloadAction<CouponWithDetails>) => {
          state.isLoading = false;
          state.selectedCoupon = action.payload;
        }
      )
      .addCase(fetchCouponDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedCoupon, clearError } = couponsSlice.actions;
export default couponsSlice.reducer;

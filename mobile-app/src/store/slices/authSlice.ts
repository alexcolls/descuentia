import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, Session } from '@supabase/supabase-js';
import { authHelpers, profileHelpers, Profile } from '@services/supabase';

// State interface
interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  session: null,
  profile: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Async thunks
export const signUp = createAsyncThunk(
  'auth/signUp',
  async (
    {
      email,
      password,
      fullName,
      role,
    }: {
      email: string;
      password: string;
      fullName: string;
      role: 'consumer' | 'merchant';
    },
    { rejectWithValue }
  ) => {
    try {
      const data = await authHelpers.signUp(email, password, fullName, role);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Sign up failed');
    }
  }
);

export const signIn = createAsyncThunk(
  'auth/signIn',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await authHelpers.signIn(email, password);
      
      // Fetch profile
      if (data.user) {
        const profile = await profileHelpers.getProfile(data.user.id);
        return { ...data, profile };
      }
      
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Sign in failed');
    }
  }
);

export const signOut = createAsyncThunk(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      await authHelpers.signOut();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Sign out failed');
    }
  }
);

export const checkSession = createAsyncThunk(
  'auth/checkSession',
  async (_, { rejectWithValue }) => {
    try {
      const session = await authHelpers.getSession();
      
      if (session?.user) {
        const profile = await profileHelpers.getProfile(session.user.id);
        return { session, profile };
      }
      
      return { session: null, profile: null };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Session check failed');
    }
  }
);

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (userId: string, { rejectWithValue }) => {
    try {
      const profile = await profileHelpers.getProfile(userId);
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch profile');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (
    { userId, updates }: { userId: string; updates: Partial<Profile> },
    { rejectWithValue }
  ) => {
    try {
      const profile = await profileHelpers.updateProfile(userId, updates);
      return profile;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSession: (state, action: PayloadAction<{ user: User | null; session: Session | null }>) => {
      state.user = action.payload.user;
      state.session = action.payload.session;
      state.isAuthenticated = !!action.payload.user;
    },
    setProfile: (state, action: PayloadAction<Profile | null>) => {
      state.profile = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Sign up
    builder
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.session = action.payload.session;
        state.isAuthenticated = !!action.payload.user;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Sign in
    builder
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.session = action.payload.session;
        state.profile = (action.payload as any).profile || null;
        state.isAuthenticated = !!action.payload.user;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Sign out
    builder
      .addCase(signOut.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.session = null;
        state.profile = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Check session
    builder
      .addCase(checkSession.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.session = action.payload.session;
        state.user = action.payload.session?.user || null;
        state.profile = action.payload.profile;
        state.isAuthenticated = !!action.payload.session?.user;
      })
      .addCase(checkSession.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
      });

    // Fetch profile
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setSession, setProfile } = authSlice.actions;

export default authSlice.reducer;

import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer from './slices/authSlice';
import promotionsReducer from './slices/promotionsSlice';
import couponsReducer from './slices/couponsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    promotions: promotionsReducer,
    coupons: couponsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/signUp/fulfilled', 'auth/signIn/fulfilled', 'auth/checkSession/fulfilled'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.session', 'payload.user'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.session', 'auth.user'],
      },
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export typed hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

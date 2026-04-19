import { configureStore } from '@reduxjs/toolkit';
import profileReducer from './profileSlice';

export const store = configureStore({
  reducer: {
    profile: profileReducer,
  },
});

// These types help TypeScript understand your store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
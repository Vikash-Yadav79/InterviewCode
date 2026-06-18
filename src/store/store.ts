// import { configureStore } from '@reduxjs/toolkit';
// import profileReducer from './profileSlice';

// export const store = configureStore({
//   reducer: {
//     profile: profileReducer,
//   },
// });

// // These types help TypeScript understand your store
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;




// src/store/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import bagReducer from './bagSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['bag'],
  version: 1,
};

const rootReducer = combineReducers({
  bag: bagReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
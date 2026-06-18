// src/store/bagSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BagItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  description?: string;
}

interface BagState {
  items: BagItem[];
}

const initialState: BagState = {
  items: [],
};

const bagSlice = createSlice({
  name: 'bag',
  initialState,
  reducers: {
    addToBag: (state, action: PayloadAction<Omit<BagItem, 'quantity'>>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromBag: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    increaseQuantity: (state, action: PayloadAction<number>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.quantity += 1;
      }
    },
    decreaseQuantity: (state, action: PayloadAction<number>) => {
      const itemIndex = state.items.findIndex(item => item.id === action.payload);
      if (itemIndex !== -1) {
        if (state.items[itemIndex].quantity > 1) {
          state.items[itemIndex].quantity -= 1;
        } else {
          state.items.splice(itemIndex, 1);
        }
      }
    },
    clearBag: (state) => {
      state.items = [];
    },
  },
});

export const { addToBag, removeFromBag, increaseQuantity, decreaseQuantity, clearBag } = bagSlice.actions;
export default bagSlice.reducer;
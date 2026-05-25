import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { DeliCartItem, DeliViewId } from './types';

export interface DeliWorkbenchState {
  viewId: DeliViewId;
  selectedItemId?: string;
  removedIngredientIds: string[];
  cartItems: DeliCartItem[];
}

export const initialDeliWorkbenchState: DeliWorkbenchState = {
  viewId: 'menu',
  removedIngredientIds: [],
  cartItems: [],
};

export const deliWorkbenchSlice = createSlice({
  name: 'deliWorkbench',
  initialState: initialDeliWorkbenchState,
  reducers: {
    resetWorkbench: (_state, action: PayloadAction<Partial<DeliWorkbenchState> | undefined>) => ({
      ...initialDeliWorkbenchState,
      ...action.payload,
      removedIngredientIds: action.payload?.removedIngredientIds ?? [],
      cartItems: action.payload?.cartItems ?? [],
    }),
    setViewId: (state, action: PayloadAction<DeliViewId>) => {
      state.viewId = action.payload;
    },
    setSelectedItemId: (state, action: PayloadAction<string | undefined>) => {
      state.selectedItemId = action.payload;
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      if (!state.removedIngredientIds.includes(action.payload)) {
        state.removedIngredientIds.push(action.payload);
      }
    },
    addCartItem: (state, action: PayloadAction<DeliCartItem>) => {
      state.cartItems.push(action.payload);
    },
    seedCartItemIfEmpty: (state, action: PayloadAction<DeliCartItem>) => {
      if (state.cartItems.length === 0) {
        state.cartItems.push(action.payload);
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
    },
  },
});

export const deliWorkbenchActions = deliWorkbenchSlice.actions;
export const deliWorkbenchReducer = deliWorkbenchSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { DeliCartItem, DeliViewId } from './types';

export interface DeliWorkbenchState {
  viewId: DeliViewId;
  selectedItemId?: string;
  removedIngredientIds: string[];
  cartItems: DeliCartItem[];
  /** Active search/filter text for the menu view. */
  searchFilter?: string;
  /** Active dietary filter for the menu view. */
  dietFilter?: string;
  /** Active category filter for the menu view. */
  categoryFilter?: string;
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
    setSearchFilter: (state, action: PayloadAction<string | undefined>) => {
      state.searchFilter = action.payload || undefined;
    },
    setDietFilter: (state, action: PayloadAction<string | undefined>) => {
      state.dietFilter = action.payload || undefined;
    },
    setCategoryFilter: (state, action: PayloadAction<string | undefined>) => {
      state.categoryFilter = action.payload || undefined;
    },
  },
});

export const deliWorkbenchActions = deliWorkbenchSlice.actions;
export const deliWorkbenchReducer = deliWorkbenchSlice.reducer;

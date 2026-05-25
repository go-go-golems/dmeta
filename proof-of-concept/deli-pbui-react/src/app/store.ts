import { configureStore } from '@reduxjs/toolkit';
import { deliApi } from '../domain/deli/deliApi';

export const store = configureStore({
  reducer: {
    [deliApi.reducerPath]: deliApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(deliApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { deliApi } from '../domain/deli/deliApi';
import { pbuiSessionReducer } from '../generic/clim/pbuiSessionSlice';

const rootReducer = combineReducers({
  [deliApi.reducerPath]: deliApi.reducer,
  pbuiSession: pbuiSessionReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState as RootState | undefined,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(deliApi.middleware),
  });
}

export const store = setupStore();

export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];

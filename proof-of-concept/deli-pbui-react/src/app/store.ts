import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { deliApi } from '../domain/deli/deliApi';
import { deliWorkbenchReducer } from '../domain/deli/deliWorkbenchSlice';
import { pbuiSessionReducer } from '../generic/clim/pbuiSessionSlice';

const rootReducer = combineReducers({
  [deliApi.reducerPath]: deliApi.reducer,
  pbuiSession: pbuiSessionReducer,
  deliWorkbench: deliWorkbenchReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState as RootState | undefined,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: [
          'pbuiSession.interaction.action',
          'pbuiSession.contextMenu.actions',
        ],
        ignoredActions: [
          'pbuiSession/enterSelect',
          'pbuiSession/enterConfirm',
          'pbuiSession/showContextMenu',
        ],
      },
    }).concat(deliApi.middleware),
  });
}

export const store = setupStore();

export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];

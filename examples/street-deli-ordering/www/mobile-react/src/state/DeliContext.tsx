/**
 * React context + provider for the Street Deli ordering application.
 */

import { createContext, useContext, useReducer, type Dispatch, type ReactNode } from 'react';
import type { DeliState, DeliAction } from './types';
import { deliReducer, initialState } from './deliReducer';

type DeliContextValue = {
  state: DeliState;
  dispatch: Dispatch<DeliAction>;
};

const DeliContext = createContext<DeliContextValue | null>(null);

export function DeliProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(deliReducer, initialState);
  return (
    <DeliContext.Provider value={{ state, dispatch }}>
      {children}
    </DeliContext.Provider>
  );
}

export function useDeli(): DeliContextValue {
  const ctx = useContext(DeliContext);
  if (!ctx) throw new Error('useDeli must be used within a DeliProvider');
  return ctx;
}

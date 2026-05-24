import type { ClimState, InteractionMode } from './types';

export function setMode(state: ClimState, mode: InteractionMode, modeLabel = state.modeLabel): ClimState {
  return { ...state, mode, modeLabel };
}

import type { ClimState } from './types';

export const initialClimState: ClimState = {
  mode: 'normal',
  modeLabel: 'MENU',
  commandBuffer: '',
  actionResult: 'Ready.',
};

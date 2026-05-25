import type { PresentationRef } from '../../types';

export interface PbuiPresentationRefState {
  selected?: boolean;
  selectable?: boolean;
  muted?: boolean;
  disabled?: boolean;
}

export interface PbuiPresentationRefProps {
  presentation: PresentationRef;
  state?: PbuiPresentationRefState;
  selected?: boolean;
  selectable?: boolean;
  muted?: boolean;
  disabled?: boolean;
  className?: string;
  onSelect?: () => void;
}

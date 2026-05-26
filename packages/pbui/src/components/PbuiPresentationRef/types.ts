import type { PresentationRef } from '../../types';

export interface PbuiPresentationRefState {
  selected?: boolean;
  selectable?: boolean;
  muted?: boolean;
  disabled?: boolean;
  /** True when this presentation is a compatible target for a dangerous/confirmable action. */
  dangerousTarget?: boolean;
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
  /** Right-click handler for context menu. */
  onContextMenu?: (event: React.MouseEvent) => void;
}

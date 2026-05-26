import type { ActionSpec, PresentationRef } from '../../../../generic/clim/types';
import type { DeliActionRuntimeContext } from '../../../../domain/deli/actions';
import type { DeliCommandId, MenuItem } from '../../../../domain/deli/types';

export interface DeliMenuViewProps {
  menu: MenuItem[];
  selectedItemId?: string;
  activeSelected?: PresentationRef;
  pendingAction?: ActionSpec<DeliCommandId>;
  filledArgs: Record<string, unknown>;
  actionContext: DeliActionRuntimeContext;
  onPresentationClick: (presentation: PresentationRef) => void;
  onPresentationContextMenu?: (presentation: PresentationRef, x: number, y: number) => void;
  selectMode: boolean;
}

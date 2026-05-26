import type { ActionSpec, PresentationRef } from '@go-go-golems/pbui';
import type { DeliActionRuntimeContext } from '../../../../domain/deli/actions';
import type { DeliCommandId, MenuItem } from '../../../../domain/deli/types';

export interface DeliDetailViewProps {
  selectedItem?: MenuItem;
  draft?: PresentationRef<'OrderItem'>;
  removedIngredientIds: string[];
  activeSelected?: PresentationRef;
  pendingAction?: ActionSpec<DeliCommandId>;
  filledArgs: Record<string, unknown>;
  actionContext: DeliActionRuntimeContext;
  onPresentationClick: (presentation: PresentationRef) => void;
  onPresentationContextMenu?: (presentation: PresentationRef, x: number, y: number) => void;
  selectMode: boolean;
}

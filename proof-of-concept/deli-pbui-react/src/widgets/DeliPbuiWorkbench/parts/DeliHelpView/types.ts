import type { ActionSpec } from '@go-go-golems/pbui';
import type { DeliCommandId } from '../../../../domain/deli/types';

export interface DeliHelpViewProps {
  actions: ActionSpec<DeliCommandId>[];
}

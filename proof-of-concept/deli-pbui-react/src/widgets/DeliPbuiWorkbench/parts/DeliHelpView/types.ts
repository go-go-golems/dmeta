import type { ActionSpec } from '../../../../generic/clim/types';
import type { DeliCommandId } from '../../../../domain/deli/types';

export interface DeliHelpViewProps {
  actions: ActionSpec<DeliCommandId>[];
}

import type { DeliViewId } from '../../domain/deli/types';

export interface DeliPbuiWorkbenchProps {
  initialView?: DeliViewId;
  initialSelectedItemId?: string;
  initialCart?: boolean;
}

import type { ReactNode } from 'react';
import type { ActionPresentation, ActionSpec, ClimSessionState, ContextMenuState, PresentationRef } from '../../types';

export interface PbuiShellProps {
  state: ClimSessionState;
  children: ReactNode;
  /** Application title shown in the header (e.g. "HUDSON STREET DELI"). */
  title?: string;
  commandValue?: string;
  contextMenu?: ContextMenuState;
  confirmAction?: {
    action: ActionSpec;
    ref?: PresentationRef;
  };
  onCommandChange?: (value: string) => void;
  onCommandSubmit?: (value: string) => void;
  onCommandHistoryPrevious?: () => void;
  onCommandHistoryNext?: () => void;
  onCommandCancel?: () => void;
  onContextMenuAction?: (action: ActionPresentation) => void;
  onContextMenuDismiss?: () => void;
  onConfirm?: () => void;
  onCancelConfirm?: () => void;
}

export interface PbuiCommandLineProps {
  value: string;
  result?: string;
  hint?: string;
  actionStatus?: string;
  /** Auto-focus the input when entering select/confirm mode. */
  autoFocus?: boolean;
  className?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  onHistoryPrevious?: () => void;
  onHistoryNext?: () => void;
  onCancel?: () => void;
}

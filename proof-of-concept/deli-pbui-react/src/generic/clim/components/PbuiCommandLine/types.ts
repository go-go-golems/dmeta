export interface PbuiCommandLineProps {
  value: string;
  result?: string;
  className?: string;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
}

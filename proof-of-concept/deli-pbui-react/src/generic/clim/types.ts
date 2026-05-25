export type InteractionMode = 'normal' | 'select' | 'confirm';

export interface PresentationRef<TType extends string = string> {
  type: TType;
  id: string;
  label: string;
  presentationType?: string;
  capabilities: string[];
  metadata?: Record<string, unknown>;
}

export type ActionArgSpec = RefActionArgSpec | ValueActionArgSpec;

export interface RefActionArgSpec {
  name: string;
  kind: 'ref';
  objectType: string;
  required?: boolean;
  accepts?: (ref: PresentationRef, context: unknown) => boolean;
}

export interface ValueActionArgSpec {
  name: string;
  kind: 'value';
  valueType: string;
  required?: boolean;
  presentation?: {
    kind: 'text-input' | 'number-input' | 'select' | 'autocomplete';
    label?: string;
    placeholder?: string;
  };
  accepts?: (value: unknown, context: unknown) => boolean;
}

export interface ActionResult {
  message?: string;
}

export interface ActionSpec<TAction extends string = string> {
  id: TAction;
  label: string;
  description: string;
  views: string[];
  args: ActionArgSpec[];
  requiresConfirmation?: boolean;
  confirmation?: {
    prompt: string;
    confirmLabel: string;
    cancelLabel: string;
  };
  run: (args: Record<string, unknown>, context: unknown) => ActionResult | void;
}

export interface ActionPresentation<TAction extends string = string> {
  action: ActionSpec<TAction>;
  commandLabel?: string;
  disabledReason?: string;
}

export interface ActionRequest<TAction extends string = string> {
  actionId: TAction;
  args: Record<string, unknown>;
}

export interface ClimSessionState {
  mode: InteractionMode;
  modeLabel: string;
  selected?: PresentationRef;
  pendingAction?: ActionSpec;
  commandBuffer: string;
  resultLine?: string;
}

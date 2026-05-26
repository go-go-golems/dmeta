// --- Interaction state ---

export type ActionIntent =
  | 'navigate'
  | 'inspect'
  | 'filter'
  | 'mutate'
  | 'dangerous'
  | 'external'
  | 'confirm'
  | 'cancel';

export interface PbuiInteractionNormal {
  kind: 'normal';
}

export interface PbuiInteractionSelect<TAction extends string = string> {
  kind: 'select';
  action: ActionSpec<TAction>;
  filledArgs: Record<string, unknown>;
}

export interface PbuiInteractionConfirm<TAction extends string = string> {
  kind: 'confirm';
  action: ActionSpec<TAction>;
  request: ActionRequest<TAction>;
  filledArgs: Record<string, unknown>;
}

export type PbuiInteractionState<TAction extends string = string> =
  | PbuiInteractionNormal
  | PbuiInteractionSelect<TAction>
  | PbuiInteractionConfirm<TAction>;

// --- Presentation types ---

export interface PresentationRef<TType extends string = string> {
  type: TType;
  id: string;
  label: string;
  presentationType?: string;
  capabilities: string[];
  metadata?: Record<string, unknown>;
  /** Optional copyable value (URL, path, ID) for clipboard actions. */
  copyValue?: string;
}

// --- Action argument types ---

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

// --- Action types ---

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

/** An action spec enriched with runtime presentation metadata for rendering. */
export interface ActionPresentation<TAction extends string = string> {
  action: ActionSpec<TAction>;
  commandLabel?: string;
  disabledReason?: string;
  applicableToSelected?: boolean;
  /** Typed intents derived from the action spec (dangerous, navigate, inspect, etc.). */
  intents: ActionIntent[];
  /** True when the action requires confirmation before execution. */
  requiresConfirmation: boolean;
}

export interface ActionRequest<TAction extends string = string> {
  actionId: TAction;
  args: Record<string, unknown>;
}

// --- Context menu ---

export interface ContextMenuState<TAction extends string = string> {
  visible: boolean;
  x: number;
  y: number;
  ref: PresentationRef | null;
  actions: ActionPresentation<TAction>[];
}

// --- Session state (consumed by shell and command line) ---

export interface ClimSessionState {
  mode: 'normal' | 'select' | 'confirm';
  modeLabel: string;
  selected?: PresentationRef;
  pendingAction?: ActionSpec;
  commandBuffer: string;
  resultLine?: string;
  actionStatusLine?: string;
  commandHint?: string;
}

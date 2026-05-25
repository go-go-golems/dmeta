export type InteractionMode = 'normal' | 'select' | 'confirm';

export interface PresentationRef<TType extends string = string> {
  type: TType;
  id: string;
  label: string;
  capabilities: string[];
  metadata?: Record<string, string | number | string[]>;
}

export interface ActionDescriptor<TAction extends string = string> {
  id: TAction;
  label: string;
  description: string;
  inputTypes: Record<string, 'SemanticRef' | 'string' | 'number' | 'boolean'>;
  mutatesBackend: boolean;
  requiresConfirmation: boolean;
}

export interface ActionPresentation<TAction extends string = string> {
  descriptor: ActionDescriptor<TAction>;
  commandLabel?: string;
  disabledReason?: string;
  subject?: PresentationRef;
}

export interface CommandBinding<TCommand extends string = string, TAction extends string = string> {
  id: TCommand;
  actionId: TAction;
  label: string;
  summary: string;
  views: string[];
  presentationType: string;
  surface: string;
  handler: string;
  inputMapping: Record<string, string>;
  requiresConfirmation: boolean;
  confirmation?: {
    surface: string;
    prompt: string;
    confirmLabel: string;
    cancelLabel: string;
  };
}

export interface ActionRequest<TAction extends string = string> {
  actionId: TAction;
  subject?: PresentationRef;
  inputs: Record<string, unknown>;
}

export interface ClimSessionState {
  mode: InteractionMode;
  modeLabel: string;
  selected?: PresentationRef;
  pendingAction?: ActionDescriptor;
  commandBuffer: string;
  resultLine?: string;
}

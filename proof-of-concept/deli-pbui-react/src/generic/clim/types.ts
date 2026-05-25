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
  disabledReason?: string;
  subject?: PresentationRef;
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

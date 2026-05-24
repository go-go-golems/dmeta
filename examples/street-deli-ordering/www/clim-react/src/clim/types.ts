export type InteractionMode = 'normal' | 'select' | 'confirm';

export interface PresentationRef {
  type: string;
  id: string;
  label: string;
  capabilities?: string[];
  metadata?: Record<string, string | string[]>;
}

export interface ActionPresentation {
  id: string;
  label: string;
  description?: string;
  dangerous?: boolean;
  disabled?: boolean;
}

export interface LifecycleStep {
  id: string;
  label: string;
  state: 'done' | 'active' | 'pending';
}

export interface ClimState {
  mode: InteractionMode;
  modeLabel: string;
  selectedPresentationId?: string;
  commandBuffer: string;
  actionResult?: string;
}

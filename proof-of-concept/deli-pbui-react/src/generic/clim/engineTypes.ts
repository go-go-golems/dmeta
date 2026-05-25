import type { ActionDescriptor, ActionPresentation, CommandBinding, InteractionMode, PresentationRef } from './types';

export interface PbuiViewModelDefinition<TView extends string = string, TCommand extends string = string> {
  id: TView;
  modeLabel: string;
  primaryPresentations: string[];
  defaultActions: TCommand[];
}

export interface PresentationVisualState {
  selected: boolean;
  selectable: boolean;
  disabled: boolean;
  removed: boolean;
  dangerousTarget: boolean;
}

export interface AvailabilityResult {
  enabled: boolean;
  reason?: string;
}

export interface PbuiEngineRegistries<TView extends string = string, TCommand extends string = string, TAction extends string = string> {
  views: Record<TView, PbuiViewModelDefinition<TView, TCommand>>;
  actions: Record<TAction, ActionDescriptor<TAction>>;
  commandBindings: Record<TCommand, CommandBinding<TCommand, TAction>>;
}

export interface PbuiEngineState<TView extends string = string, TCommand extends string = string, TAction extends string = string> {
  view: TView;
  mode: InteractionMode;
  selectedRef?: PresentationRef;
  pendingCommand?: CommandBinding<TCommand, TAction>;
  commandBuffer: string;
  resultLine?: string;
}

export interface ActionDerivationContext<TCommand extends string = string, TAction extends string = string> {
  bindings: CommandBinding<TCommand, TAction>[];
  actions: Record<TAction, ActionDescriptor<TAction>>;
  selected?: PresentationRef;
  defaultActionOrder?: TCommand[];
  availability?: (binding: CommandBinding<TCommand, TAction>) => AvailabilityResult;
}

export interface CompatiblePresentationContext<TCommand extends string = string, TAction extends string = string> {
  bindings: CommandBinding<TCommand, TAction>[];
  presentation: PresentationRef;
  defaultActionOrder?: TCommand[];
  canUsePresentation?: (binding: CommandBinding<TCommand, TAction>, presentation: PresentationRef) => boolean;
}

export interface DerivedActionPresentation<TAction extends string = string> extends ActionPresentation<TAction> {
  disabledReason?: string;
}

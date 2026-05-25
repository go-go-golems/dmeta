import type { ActionRequest, CommandBinding, InteractionMode, PresentationRef } from './types';

export interface PbuiSessionState<TCommand extends string = string, TAction extends string = string> {
  mode: InteractionMode;
  selectedRef?: PresentationRef;
  pendingCommand?: CommandBinding<TCommand, TAction>;
  pendingRequest?: ActionRequest<TAction>;
  commandBuffer: string;
  resultLine?: string;
}

export type PbuiSessionEvent<TCommand extends string = string, TAction extends string = string> =
  | { type: 'select-ref'; presentation?: PresentationRef; resultLine?: string }
  | { type: 'clear-selection' }
  | { type: 'set-command-buffer'; value: string }
  | { type: 'set-result'; resultLine?: string }
  | { type: 'route-changed'; commandBuffer?: string; selectedRef?: PresentationRef }
  | { type: 'enter-select'; command: CommandBinding<TCommand, TAction>; resultLine?: string }
  | { type: 'select-completed'; selectedRef: PresentationRef; commandBuffer?: string; resultLine?: string }
  | { type: 'select-cancelled'; resultLine?: string }
  | {
      type: 'enter-confirm';
      command: CommandBinding<TCommand, TAction>;
      request: ActionRequest<TAction>;
      resultLine?: string;
    }
  | { type: 'confirm-completed'; commandBuffer?: string; resultLine?: string }
  | { type: 'confirm-cancelled'; resultLine?: string };

export function initialPbuiSessionState<TCommand extends string = string, TAction extends string = string>({
  commandBuffer = 'LIST',
  resultLine,
}: {
  commandBuffer?: string;
  resultLine?: string;
} = {}): PbuiSessionState<TCommand, TAction> {
  return {
    mode: 'normal',
    commandBuffer,
    resultLine,
  };
}

export function pbuiSessionReducer<TCommand extends string = string, TAction extends string = string>(
  state: PbuiSessionState<TCommand, TAction>,
  event: PbuiSessionEvent<TCommand, TAction>,
): PbuiSessionState<TCommand, TAction> {
  switch (event.type) {
    case 'select-ref':
      return {
        ...state,
        selectedRef: event.presentation,
        resultLine: event.resultLine ?? state.resultLine,
      };
    case 'clear-selection':
      return {
        ...state,
        selectedRef: undefined,
      };
    case 'set-command-buffer':
      return {
        ...state,
        commandBuffer: event.value,
      };
    case 'set-result':
      return {
        ...state,
        resultLine: event.resultLine,
      };
    case 'route-changed':
      return {
        ...state,
        mode: 'normal',
        pendingCommand: undefined,
        pendingRequest: undefined,
        selectedRef: event.selectedRef ?? state.selectedRef,
        commandBuffer: event.commandBuffer ?? state.commandBuffer,
      };
    case 'enter-select':
      return {
        ...state,
        mode: 'select',
        pendingCommand: event.command,
        pendingRequest: undefined,
        commandBuffer: event.command.id,
        resultLine: event.resultLine ?? state.resultLine,
      };
    case 'select-completed':
      return {
        ...state,
        mode: 'normal',
        selectedRef: event.selectedRef,
        pendingCommand: undefined,
        pendingRequest: undefined,
        commandBuffer: event.commandBuffer ?? state.commandBuffer,
        resultLine: event.resultLine ?? state.resultLine,
      };
    case 'select-cancelled':
      return {
        ...state,
        mode: 'normal',
        pendingCommand: undefined,
        pendingRequest: undefined,
        resultLine: event.resultLine ?? state.resultLine,
      };
    case 'enter-confirm':
      return {
        ...state,
        mode: 'confirm',
        pendingCommand: event.command,
        pendingRequest: event.request,
        commandBuffer: event.command.id,
        resultLine: event.resultLine ?? state.resultLine,
      };
    case 'confirm-completed':
      return {
        ...state,
        mode: 'normal',
        pendingCommand: undefined,
        pendingRequest: undefined,
        commandBuffer: event.commandBuffer ?? state.commandBuffer,
        resultLine: event.resultLine ?? state.resultLine,
      };
    case 'confirm-cancelled':
      return {
        ...state,
        mode: 'normal',
        pendingCommand: undefined,
        pendingRequest: undefined,
        resultLine: event.resultLine ?? state.resultLine,
      };
    default:
      return state;
  }
}

import type { ActionPresentation, PresentationRef } from './types';

export interface ActionRequest {
  action: ActionPresentation;
  subject?: PresentationRef;
}

export function buildActionRequest(action: ActionPresentation, subject?: PresentationRef): ActionRequest {
  return { action, subject };
}

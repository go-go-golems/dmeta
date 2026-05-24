import type { ActionPresentation, PresentationRef } from './types';

export function compatibleActionsFor(_presentation?: PresentationRef): ActionPresentation[] {
  return [
    { id: 'inspect_subject', label: 'DESCRIBE', description: 'Inspect this presentation.' },
    { id: 'copy_reference', label: 'COPY-REF', description: 'Copy a stable reference.' },
  ];
}

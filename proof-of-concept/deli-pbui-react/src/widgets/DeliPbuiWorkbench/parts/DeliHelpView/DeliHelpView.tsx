import {
  actionIntents,
  actionPresentationsForSpecs,
  PbuiHelpView,
  getPrefixCommandHelp,
} from '@go-go-golems/pbui';
import type { DeliHelpViewProps } from './types';

export function DeliHelpView({ actions }: DeliHelpViewProps) {
  const actionPresentations = actionPresentationsForSpecs({ actions });
  const prefixCommands = getPrefixCommandHelp();
  return (
    <PbuiHelpView
      actions={actionPresentations}
      prefixCommands={prefixCommands}
    />
  );
}

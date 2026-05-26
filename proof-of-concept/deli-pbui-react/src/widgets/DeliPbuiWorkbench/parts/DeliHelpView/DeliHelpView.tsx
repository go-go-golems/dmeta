import { actionIntents, actionPresentationsForSpecs } from '../../../../generic/clim/actionEngine';
import { PbuiHelpView } from '../../../../generic/clim/components/PbuiHelpView';
import { getPrefixCommandHelp } from '../../../../generic/clim/commandParser';
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

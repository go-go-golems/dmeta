import { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from '../../app/store';
import { ActionHintBar, ClimShell, PresentationRefLine } from '../../generic/clim/components';
import { buildActionRequestFromBinding, summarizeActionRequest } from '../../generic/clim/runtime';
import type { ActionPresentation, ClimSessionState, PresentationRef } from '../../generic/clim/types';
import { deliActionDescriptors } from '../../domain/deli/actions';
import { commandBindingsForView } from '../../domain/deli/commandBindings';
import { useGetMenuQuery } from '../../domain/deli/deliApi';
import { deliViewModels } from '../../domain/deli/viewModels';
import type { DeliCommandId, MenuItem } from '../../domain/deli/types';

function menuItemPresentation(item: MenuItem): PresentationRef<'MenuItem'> {
  return {
    type: 'MenuItem',
    id: item.id,
    label: `${item.name} $${item.price.toFixed(2)}`,
    capabilities: ['labelable', 'composable', 'substitutable'],
    metadata: { category: item.category, tags: item.tags },
  };
}

function actionForCommand(viewId: string, commandId: DeliCommandId, subject?: PresentationRef): ActionPresentation {
  const binding = commandBindingsForView(viewId).find((candidate) => candidate.id === commandId);
  if (!binding) {
    throw new Error(`No command binding for ${commandId}`);
  }
  return {
    descriptor: deliActionDescriptors[binding.actionId],
    commandLabel: binding.label,
    subject,
  };
}

export function DeliPbuiWorkbench() {
  const { data: menu = [] } = useGetMenuQuery();
  const selected = menu[0] ? menuItemPresentation(menu[0]) : undefined;
  const [resultLine, setResultLine] = useState('Proof of concept: generic CLIM shell + Deli domain registry + RTK Query fixture data.');
  const view = deliViewModels.menu;
  const state: ClimSessionState = {
    mode: 'normal',
    modeLabel: view.modeLabel,
    selected,
    commandBuffer: 'LIST MENU',
    resultLine,
  };
  const commandBindings = commandBindingsForView(view.id);
  const actions = view.defaultActions.map((commandId) =>
    actionForCommand(view.id, commandId, commandId === 'CUSTOMIZE' ? selected : undefined),
  );

  function handleInvoke(action: ActionPresentation) {
    const binding = commandBindings.find(
      (candidate) => candidate.actionId === action.descriptor.id && candidate.label === action.commandLabel,
    );
    if (!binding) {
      setResultLine(`No command binding found for ${action.commandLabel ?? action.descriptor.id}`);
      return;
    }
    const request = buildActionRequestFromBinding(binding, action.descriptor, {
      selected: action.subject ?? selected,
      commandArguments: { tag: 'vegetarian', category: 'sandwiches' },
    });
    setResultLine(`Built action request: ${binding.id} -> ${summarizeActionRequest(request)}`);
  }

  return (
    <ClimShell state={state}>
      <section className="grid gap-3">
        <div className="border border-clim-border bg-clim-panel/40 p-3">
          <div className="text-clim-muted text-xs uppercase tracking-wide">View model</div>
          <div className="text-clim-bright">{view.id} / {view.modeLabel}</div>
          <div className="text-clim-muted text-sm">{view.primaryPresentations.join('  ')}</div>
        </div>

        <div className="grid gap-1">
          {menu.map((item) => (
            <PresentationRefLine
              key={item.id}
              presentation={menuItemPresentation(item)}
              selected={selected?.id === item.id}
              selectable
            />
          ))}
        </div>

        <ActionHintBar actions={actions} onInvoke={handleInvoke} />
      </section>
    </ClimShell>
  );
}

export function DeliPbuiWorkbenchWithProvider() {
  return (
    <Provider store={store}>
      <DeliPbuiWorkbench />
    </Provider>
  );
}

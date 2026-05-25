import { Provider } from 'react-redux';
import { store } from '../../app/store';
import { ActionHintBar, ClimShell, PresentationRefLine } from '../../generic/clim/components';
import type { ActionPresentation, ClimSessionState, PresentationRef } from '../../generic/clim/types';
import { deliActionDescriptors } from '../../domain/deli/actions';
import { useGetMenuQuery } from '../../domain/deli/deliApi';
import { deliViewModels } from '../../domain/deli/viewModels';
import type { MenuItem } from '../../domain/deli/types';

function menuItemPresentation(item: MenuItem): PresentationRef<'MenuItem'> {
  return {
    type: 'MenuItem',
    id: item.id,
    label: `${item.name} $${item.price.toFixed(2)}`,
    capabilities: ['labelable', 'composable', 'substitutable'],
    metadata: { category: item.category, tags: item.tags },
  };
}

function actionFor(id: keyof typeof deliActionDescriptors, subject?: PresentationRef): ActionPresentation {
  return { descriptor: deliActionDescriptors[id], subject };
}

export function DeliPbuiWorkbench() {
  const { data: menu = [] } = useGetMenuQuery();
  const selected = menu[0] ? menuItemPresentation(menu[0]) : undefined;
  const view = deliViewModels.menu;
  const state: ClimSessionState = {
    mode: 'normal',
    modeLabel: view.modeLabel,
    selected,
    commandBuffer: 'LIST MENU',
    resultLine: 'Proof of concept: generic CLIM shell + Deli domain registry + RTK Query fixture data.',
  };
  const actions = [actionFor('select_menu_item', selected), actionFor('return_to_menu')];

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

        <ActionHintBar actions={actions} />
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

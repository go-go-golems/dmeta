import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { store } from '../../app/store';
import type { AppStore } from '../../app/store';
import { formatInteractionStatus } from '../../generic/clim/actionStatus';
import { PbuiActionBar } from '../../generic/clim/components/PbuiActionBar';
import { PbuiHintBar } from '../../generic/clim/components/PbuiHintBar';
import { PbuiShell } from '../../generic/clim/components/PbuiShell';
import { pbuiSessionActions } from '../../generic/clim/pbuiSessionSlice';
import type { ActionSpec, ClimSessionState } from '../../generic/clim/types';
import { deliActions, deliActionsForView } from '../../domain/deli/actions';
import { useGetMenuQuery } from '../../domain/deli/deliApi';
import { deliWorkbenchActions } from '../../domain/deli/deliWorkbenchSlice';
import { cartPresentation, draftPresentation, menuItemPresentation, rehydrateDeliPresentationRef } from '../../domain/deli/pbuiPresentations';
import { deliViewModels } from '../../domain/deli/viewModels';
import type { DeliCommandId } from '../../domain/deli/types';
import { useDeliActionController, useDeliWorkbenchRouting } from './hooks';
import { DeliCartView } from './parts/DeliCartView';
import { DeliDetailView } from './parts/DeliDetailView';
import { DeliHelpView } from './parts/DeliHelpView';
import { DeliMenuView } from './parts/DeliMenuView';
import { DeliTrackerView } from './parts/DeliTrackerView';
import { DeliViewHeader } from './parts/DeliViewHeader';
import type { DeliPbuiWorkbenchProps } from './types';

export function DeliPbuiWorkbench({
  initialView = 'menu',
  initialSelectedItemId,
  initialCart = false,
}: DeliPbuiWorkbenchProps) {
  const { data: menu = [] } = useGetMenuQuery();
  const session = useAppSelector((state) => state.pbuiSession);
  const { viewId, selectedItemId, removedIngredientIds, cartItems, searchFilter, dietFilter, categoryFilter } = useAppSelector((state) => state.deliWorkbench);
  const dispatch = useAppDispatch();

  const filteredMenu = menu.filter((item) => {
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      const matches = item.name.toLowerCase().includes(q)
        || item.tags?.some((t) => t.toLowerCase().includes(q))
        || item.category?.toLowerCase().includes(q);
      if (!matches) return false;
    }
    if (dietFilter) {
      const d = dietFilter.toLowerCase();
      const matches = item.tags.some((t) => t.toLowerCase().includes(d));
      if (!matches) return false;
    }
    if (categoryFilter) {
      const c = categoryFilter.toLowerCase();
      const matches = item.category?.toLowerCase().includes(c);
      if (!matches) return false;
    }
    return true;
  });

  const activeFilters: string[] = [];
  if (searchFilter) activeFilters.push(`SEARCH: ${searchFilter}`);
  if (categoryFilter) activeFilters.push(`CATEGORY: ${categoryFilter}`);
  if (dietFilter) activeFilters.push(`DIET: ${dietFilter}`);

  const interaction = session.interaction;
  const selectedItem = menu.find((item) => item.id === selectedItemId) ?? menu[0];
  const selectedMenuPresentation = selectedItem ? menuItemPresentation(selectedItem) : undefined;
  const currentSessionSelected = rehydrateDeliPresentationRef(session.selectedRef, menu, removedIngredientIds);
  const activeSelected = currentSessionSelected ?? selectedMenuPresentation;
  const draft = draftPresentation(selectedItem);
  const cart = cartPresentation(cartItems);
  const view = deliViewModels[viewId];
  const visibleActions = deliActionsForView(view.id);

  const pendingAction = interaction.kind === 'select' ? interaction.action as ActionSpec<DeliCommandId>
    : interaction.kind === 'confirm' ? interaction.action as ActionSpec<DeliCommandId>
    : undefined;

  const mode: ClimSessionState['mode'] = interaction.kind;
  const state: ClimSessionState = {
    mode,
    modeLabel: mode === 'confirm' ? 'CONFIRM' : mode === 'select' ? `SELECT ▸ ${pendingAction?.id ?? ''}` : view.modeLabel,
    selected: activeSelected,
    pendingAction,
    commandBuffer: session.commandBuffer,
    resultLine: session.resultLine,
    actionStatusLine: formatInteractionStatus(interaction),
    commandHint: session.commandHint,
  };

  const { navigateToView, navigateBack } = useDeliWorkbenchRouting({
    initialView,
    initialSelectedItemId,
    firstMenuItemId: menu[0]?.id,
    selectedItemId,
  });

  const {
    actionContext,
    actions,
    compatibleActions,
    handleInvoke,
    handlePresentationClick,
    handlePresentationContextMenu,
    handleCommandSubmit,
    handleContextMenuAction,
    confirmPending,
    cancelPending,
  } = useDeliActionController({
    menu,
    selectedItem,
    selectedItemId,
    removedIngredientIds,
    cartItems,
    activeSelected,
    visibleActions,
    session,
    view,
    navigateToView,
    navigateBack,
  });

  useEffect(() => {
    if (initialCart && selectedItem && cartItems.length === 0) {
      dispatch(deliWorkbenchActions.seedCartItemIfEmpty({
        id: `cart.${selectedItem.id}`,
        item: selectedItem,
        removedIngredientIds: [],
        substitutions: {},
      }));
    }
  }, [initialCart, selectedItem, cartItems.length, dispatch]);

  function renderView() {
    if (viewId === 'detail') {
      return (
        <DeliDetailView
          selectedItem={selectedItem}
          draft={draft}
          removedIngredientIds={removedIngredientIds}
          activeSelected={activeSelected}
          pendingAction={pendingAction as ActionSpec<DeliCommandId> | undefined}
          filledArgs={interaction.kind === 'select' ? interaction.filledArgs : interaction.kind === 'confirm' ? interaction.filledArgs : {}}
          actionContext={actionContext}
          onPresentationClick={handlePresentationClick}
          onPresentationContextMenu={handlePresentationContextMenu}
          selectMode={interaction.kind === 'select'}
        />
      );
    }

    if (viewId === 'cart') {
      return <DeliCartView cart={cart} cartItems={cartItems} />;
    }

    if (viewId === 'help') {
      return <DeliHelpView actions={Object.values(deliActions)} />;
    }

    if (viewId === 'tracker') {
      return <DeliTrackerView />;
    }

    return (
      <DeliMenuView
        menu={filteredMenu}
        selectedItemId={selectedItemId}
        activeSelected={activeSelected}
        pendingAction={pendingAction}
        filledArgs={interaction.kind === 'select' ? interaction.filledArgs : interaction.kind === 'confirm' ? interaction.filledArgs : {}}
        actionContext={actionContext}
        onPresentationClick={handlePresentationClick}
        onPresentationContextMenu={handlePresentationContextMenu}
        selectMode={interaction.kind === 'select'}
      />
    );
  }

  return (
    <PbuiShell
      title="HUDSON STREET DELI"
      state={state}
      commandValue={session.commandBuffer}
      contextMenu={session.contextMenu}
      confirmAction={interaction.kind === 'confirm' ? { action: interaction.action as ActionSpec<DeliCommandId>, ref: session.selectedRef } : undefined}
      onCommandChange={(value) => dispatch(pbuiSessionActions.setCommandBuffer(value))}
      onCommandSubmit={handleCommandSubmit}
      onCommandHistoryPrevious={() => dispatch(pbuiSessionActions.recallPreviousCommand())}
      onCommandHistoryNext={() => dispatch(pbuiSessionActions.recallNextCommand())}
      onCommandCancel={() => handleCommandSubmit('ESC')}
      onContextMenuAction={handleContextMenuAction}
      onContextMenuDismiss={() => dispatch(pbuiSessionActions.hideContextMenu())}
      onConfirm={confirmPending}
      onCancelConfirm={cancelPending}
    >
      <section className="grid gap-3">
        <DeliViewHeader view={view} activeFilters={activeFilters.length > 0 ? activeFilters : undefined} />

        {renderView()}

        <PbuiHintBar
          selectedRef={interaction.kind === 'normal' ? session.selectedRef : undefined}
          actions={interaction.kind === 'normal' ? compatibleActions : []}
          onAction={handleInvoke}
        />

        <PbuiActionBar actions={actions} selectedCommandLabel={pendingAction?.id} onInvoke={handleInvoke} />
      </section>
    </PbuiShell>
  );
}

export function DeliPbuiWorkbenchWithProvider({ appStore = store, ...props }: DeliPbuiWorkbenchProps & { appStore?: AppStore }) {
  return (
    <Provider store={appStore}>
      <DeliPbuiWorkbench {...props} />
    </Provider>
  );
}

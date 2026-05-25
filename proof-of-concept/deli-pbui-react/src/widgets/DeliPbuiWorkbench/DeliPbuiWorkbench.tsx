import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { store } from '../../app/store';
import type { AppStore } from '../../app/store';
import { formatActionSliceStatus } from '../../generic/clim/actionStatus';
import { PbuiActionBar } from '../../generic/clim/components/PbuiActionBar';
import { PbuiConfirmPrompt } from '../../generic/clim/components/PbuiConfirmPrompt';
import { PbuiShell } from '../../generic/clim/components/PbuiShell';
import { pbuiSessionActions } from '../../generic/clim/pbuiSessionSlice';
import type { ClimSessionState } from '../../generic/clim/types';
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
  const { viewId, selectedItemId, removedIngredientIds, cartItems } = useAppSelector((state) => state.deliWorkbench);
  const dispatch = useAppDispatch();

  const selectedItem = menu.find((item) => item.id === selectedItemId) ?? menu[0];
  const selectedMenuPresentation = selectedItem ? menuItemPresentation(selectedItem) : undefined;
  const currentSessionSelected = rehydrateDeliPresentationRef(session.selectedRef, menu, removedIngredientIds);
  const activeSelected = currentSessionSelected ?? selectedMenuPresentation;
  const draft = draftPresentation(selectedItem);
  const cart = cartPresentation(cartItems);
  const view = deliViewModels[viewId];
  const visibleActions = deliActionsForView(view.id);
  const pendingAction = session.pendingActionId ? deliActions[session.pendingActionId as DeliCommandId] : undefined;
  const mode = session.mode;
  const state: ClimSessionState = {
    mode,
    modeLabel: mode === 'confirm' ? 'CONFIRM' : mode === 'select' ? 'SELECT' : view.modeLabel,
    selected: activeSelected,
    pendingAction,
    commandBuffer: session.commandBuffer,
    resultLine: session.resultLine,
    actionStatusLine: formatActionSliceStatus({ selectedActionId: session.pendingActionId, filledArgs: session.filledArgs }),
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
    handleInvoke,
    handlePresentationClick,
    handleCommandSubmit,
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
    pendingAction,
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
          pendingAction={pendingAction}
          filledArgs={session.filledArgs}
          actionContext={actionContext}
          onPresentationClick={handlePresentationClick}
          selectMode={session.mode === 'select'}
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
        menu={menu}
        selectedItemId={selectedItemId}
        activeSelected={activeSelected}
        pendingAction={pendingAction}
        filledArgs={session.filledArgs}
        actionContext={actionContext}
        onPresentationClick={handlePresentationClick}
        selectMode={session.mode === 'select'}
      />
    );
  }

  return (
    <PbuiShell
      state={state}
      commandValue={session.commandBuffer}
      onCommandChange={(value) => dispatch(pbuiSessionActions.setCommandBuffer(value))}
      onCommandSubmit={handleCommandSubmit}
      onCommandHistoryPrevious={() => dispatch(pbuiSessionActions.recallPreviousCommand())}
      onCommandHistoryNext={() => dispatch(pbuiSessionActions.recallNextCommand())}
      onCommandCancel={() => handleCommandSubmit('ESC')}
    >
      <section className="grid gap-3">
        <DeliViewHeader view={view} />

        {renderView()}

        {pendingAction && session.mode === 'confirm' ? (
          <PbuiConfirmPrompt action={pendingAction} onConfirm={confirmPending} onCancel={cancelPending} />
        ) : null}

        <PbuiActionBar actions={actions} selectedCommandLabel={session.pendingActionId} onInvoke={handleInvoke} />
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

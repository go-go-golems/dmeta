import { useEffect } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { backOrFallback, listenToRouteChanges, pushRoute, replaceRoute } from '../../../generic/clim/routing';
import { deliWorkbenchActions } from '../../../domain/deli/deliWorkbenchSlice';
import { deliRouteCodec, initialDeliRouteSnapshot, routeForDeliView } from '../../../domain/deli/pbuiRouting';
import { deliViewModels } from '../../../domain/deli/viewModels';
import { pbuiSessionActions } from '../../../generic/clim/pbuiSessionSlice';
import type { DeliViewId } from '../../../domain/deli/types';

export interface UseDeliWorkbenchRoutingOptions {
  initialView: DeliViewId;
  initialSelectedItemId?: string;
  firstMenuItemId?: string;
  selectedItemId?: string;
}

export function useDeliWorkbenchRouting({
  initialView,
  initialSelectedItemId,
  firstMenuItemId,
  selectedItemId,
}: UseDeliWorkbenchRoutingOptions) {
  const dispatch = useAppDispatch();
  const routeInitial = initialDeliRouteSnapshot(initialView, initialSelectedItemId);
  const initialItemId = routeInitial.params?.itemId ?? initialSelectedItemId ?? firstMenuItemId;

  useEffect(() => {
    dispatch(deliWorkbenchActions.resetWorkbench({ viewId: routeInitial.view, selectedItemId: initialItemId }));
    dispatch(pbuiSessionActions.resetSession({
      commandBuffer: `LIST ${deliViewModels[routeInitial.view].modeLabel}`,
      resultLine: 'Proof of concept: generic CLIM shell + Deli domain registry + RTK Query fixture data.',
    }));
    if (window.location.pathname === '/') {
      replaceRoute(deliRouteCodec, routeForDeliView(routeInitial.view, initialItemId));
    }
    return listenToRouteChanges(deliRouteCodec, (snapshot) => {
      dispatch(deliWorkbenchActions.setViewId(snapshot.view));
      if (snapshot.params?.itemId) {
        dispatch(deliWorkbenchActions.setSelectedItemId(snapshot.params.itemId));
      }
      dispatch(pbuiSessionActions.routeChanged({ commandBuffer: `LIST ${deliViewModels[snapshot.view].modeLabel}` }));
    });
  }, []);

  function navigateToView(nextView: DeliViewId, params: { itemId?: string } = {}) {
    if (params.itemId) {
      dispatch(deliWorkbenchActions.setSelectedItemId(params.itemId));
    }
    dispatch(deliWorkbenchActions.setViewId(nextView));
    pushRoute(deliRouteCodec, routeForDeliView(nextView, params.itemId ?? selectedItemId));
  }

  function navigateBack() {
    backOrFallback(deliRouteCodec, { view: 'menu' });
  }

  return { navigateToView, navigateBack };
}

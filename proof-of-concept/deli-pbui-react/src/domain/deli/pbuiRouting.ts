import { currentRoute } from '../../generic/clim/routing';
import type { RouteCodec, RouteSnapshot } from '../../generic/clim/routing';
import type { DeliViewId } from './types';

export const deliRouteCodec: RouteCodec<DeliViewId> = {
  parse(pathname) {
    const parts = pathname.split('/').filter(Boolean);
    const [view, firstParam] = parts;
    switch (view) {
      case 'detail':
        return { view: 'detail', params: { itemId: firstParam ? decodeURIComponent(firstParam) : undefined } };
      case 'substitution':
        return { view: 'substitution', params: { draftId: firstParam ? decodeURIComponent(firstParam) : undefined } };
      case 'cart':
      case 'help':
      case 'tracker':
      case 'menu':
        return { view };
      default:
        return { view: 'menu' };
    }
  },
  format(snapshot) {
    switch (snapshot.view) {
      case 'detail':
        return `/detail/${encodeURIComponent(snapshot.params?.itemId ?? '')}`;
      case 'substitution':
        return `/substitution/${encodeURIComponent(snapshot.params?.draftId ?? '')}`;
      case 'cart':
        return '/cart';
      case 'help':
        return '/help';
      case 'tracker':
        return '/tracker/current';
      case 'menu':
      default:
        return '/menu';
    }
  },
};

export function routeForDeliView(view: DeliViewId, selectedItemId?: string): RouteSnapshot<DeliViewId> {
  if (view === 'detail') {
    return { view, params: { itemId: selectedItemId } };
  }
  return { view };
}

export function initialDeliRouteSnapshot(fallbackView: DeliViewId, fallbackItemId?: string): RouteSnapshot<DeliViewId> {
  if (typeof window === 'undefined') {
    return routeForDeliView(fallbackView, fallbackItemId);
  }
  const [firstSegment] = window.location.pathname.split('/').filter(Boolean);
  if (!firstSegment || ['menu', 'detail', 'substitution', 'cart', 'help', 'tracker'].includes(firstSegment)) {
    return currentRoute(deliRouteCodec);
  }
  return routeForDeliView(fallbackView, fallbackItemId);
}

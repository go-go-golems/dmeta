export interface RouteSnapshot<TView extends string = string> {
  view: TView;
  params?: Record<string, string | undefined>;
}

export interface RouteCodec<TView extends string = string> {
  parse(pathname: string): RouteSnapshot<TView>;
  format(snapshot: RouteSnapshot<TView>): string;
}

export function currentRoute<TView extends string>(codec: RouteCodec<TView>): RouteSnapshot<TView> {
  return codec.parse(window.location.pathname);
}

export function pushRoute<TView extends string>(codec: RouteCodec<TView>, snapshot: RouteSnapshot<TView>) {
  window.history.pushState({ pbui: snapshot }, '', codec.format(snapshot));
}

export function replaceRoute<TView extends string>(codec: RouteCodec<TView>, snapshot: RouteSnapshot<TView>) {
  window.history.replaceState({ pbui: snapshot }, '', codec.format(snapshot));
}

export function backOrFallback<TView extends string>(codec: RouteCodec<TView>, fallback: RouteSnapshot<TView>) {
  if (window.history.length > 1) {
    window.history.back();
    return;
  }
  pushRoute(codec, fallback);
}

export function listenToRouteChanges<TView extends string>(
  codec: RouteCodec<TView>,
  onChange: (snapshot: RouteSnapshot<TView>) => void,
) {
  const listener = () => onChange(currentRoute(codec));
  window.addEventListener('popstate', listener);
  return () => window.removeEventListener('popstate', listener);
}

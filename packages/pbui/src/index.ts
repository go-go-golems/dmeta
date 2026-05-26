// @go-go-golems/pbui — Presentation-Based User Interface / CLIM Framework
//
// Re-exports the full public API from a single entry point.
// Sub-path imports (e.g. @go-go-golems/pbui/action-engine) are also available.

// ── Core types ──
export type {
  ActionArgSpec,
  ActionIntent,
  ActionPresentation,
  ActionRequest,
  ActionSpec,
  ClimSessionState,
  ContextMenuState,
  PbuiInteractionState,
  PresentationRef,
  RefActionArgSpec,
  ValueActionArgSpec,
} from './types';

// ── Action engine ──
export {
  actionAcceptsRef,
  actionIntents,
  actionToPresentation,
  compatibleActionPresentations,
  actionPresentationsForSpecs,
  actionsForView,
  actionsForRef,
  canFillRefArg,
  canFillValueArg,
  nextOpenArg,
  presentationVisualState,
} from './actionEngine';

// ── Action status formatting ──
export {
  formatInteractionStatus,
  describeFilledArg,
} from './actionStatus';

// ── Command parser ──
export type { CommandParseResult, PrefixCommandHelp } from './commandParser';
export {
  registerPrefixCommands,
  getPrefixCommandHelp,
  normalizeCommandKey,
  parseCommandLine,
} from './commandParser';

// ── Routing ──
export type { RouteCodec, RouteSnapshot } from './routing';
export {
  currentRoute,
  pushRoute,
  replaceRoute,
  backOrFallback,
  listenToRouteChanges,
} from './routing';

// ── Session slice (RTK) ──
export type { PbuiSessionState } from './pbuiSessionSlice';
export {
  pbuiSessionActions,
  pbuiSessionReducer,
} from './pbuiSessionSlice';

// ── Components ──
export { PbuiAction } from './components/PbuiAction/PbuiAction';
export type { PbuiActionProps } from './components/PbuiAction/types';

export { PbuiActionBar } from './components/PbuiActionBar/PbuiActionBar';
export type { PbuiActionBarProps } from './components/PbuiActionBar/types';

export { PbuiClickableText } from './components/PbuiClickableText/PbuiClickableText';
export type { PbuiClickableTextProps } from './components/PbuiClickableText/types';

export { PbuiCommandLine } from './components/PbuiCommandLine/PbuiCommandLine';
export type { PbuiCommandLineProps } from './components/PbuiCommandLine/types';

export { PbuiConfirmModal } from './components/PbuiConfirmModal/PbuiConfirmModal';

export { PbuiConfirmPrompt } from './components/PbuiConfirmPrompt/PbuiConfirmPrompt';
export type { PbuiConfirmPromptProps } from './components/PbuiConfirmPrompt/types';

export { PbuiContextMenu } from './components/PbuiContextMenu/PbuiContextMenu';

export { PbuiHelpView } from './components/PbuiHelpView/PbuiHelpView';

export { PbuiHintBar } from './components/PbuiHintBar/PbuiHintBar';

export { PbuiPresentationRef } from './components/PbuiPresentationRef/PbuiPresentationRef';
export type { PbuiPresentationRefProps } from './components/PbuiPresentationRef/types';

export { PbuiSectionLabel } from './components/PbuiSectionLabel/PbuiSectionLabel';
export type { PbuiSectionLabelProps } from './components/PbuiSectionLabel/types';

export { PbuiShell } from './components/PbuiShell/PbuiShell';
export type { PbuiShellProps } from './components/PbuiShell/types';

export { PbuiText } from './components/PbuiText/PbuiText';
export type { PbuiTextProps } from './components/PbuiText/types';

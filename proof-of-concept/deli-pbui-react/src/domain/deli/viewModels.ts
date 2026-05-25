import type { DeliCommandId, DeliViewId } from './types';

export interface DeliViewModelDefinition {
  id: DeliViewId;
  modeLabel: string;
  primaryPresentations: string[];
  defaultActions: DeliCommandId[];
}

export const deliViewModels: Record<DeliViewId, DeliViewModelDefinition> = {
  menu: {
    id: 'menu',
    modeLabel: 'MENU',
    primaryPresentations: ['pbui.presentation_ref', 'pbui.action_chooser', 'pbui.action_presentation'],
    defaultActions: ['CUSTOMIZE', 'CART', 'FILTER-DIETARY', 'FILTER-BY-CATEGORY', 'HELP'],
  },
  detail: {
    id: 'detail',
    modeLabel: 'DETAIL',
    primaryPresentations: ['pbui.composition_presentation', 'pbui.action_presentation', 'pbui.presentation_ref'],
    defaultActions: ['ADD-TO-ORDER', 'BACK', 'CART', 'HELP'],
  },
  substitution: {
    id: 'substitution',
    modeLabel: 'SUBSTITUTION',
    primaryPresentations: ['pbui.action_presentation', 'pbui.composition_presentation'],
    defaultActions: ['APPLY', 'DESCRIBE', 'BACK'],
  },
  cart: {
    id: 'cart',
    modeLabel: 'CART',
    primaryPresentations: ['pbui.composition_presentation', 'pbui.action_presentation', 'pbui.presentation_ref'],
    defaultActions: ['PLACE-ORDER', 'MENU', 'HELP'],
  },
  help: {
    id: 'help',
    modeLabel: 'HELP',
    primaryPresentations: ['pbui.action_presentation', 'pbui.inspector_panel'],
    defaultActions: ['MENU'],
  },
  tracker: {
    id: 'tracker',
    modeLabel: 'TRACKER',
    primaryPresentations: ['pbui.lifecycle_status', 'pbui.action_presentation'],
    defaultActions: ['MENU', 'HELP'],
  },
};

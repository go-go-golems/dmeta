import type { DeliCommandId } from './types';

export interface DeliViewModelDefinition {
  id: 'menu' | 'detail' | 'cart';
  modeLabel: string;
  primaryPresentations: string[];
  defaultActions: DeliCommandId[];
}

export const deliViewModels: Record<DeliViewModelDefinition['id'], DeliViewModelDefinition> = {
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
  cart: {
    id: 'cart',
    modeLabel: 'CART',
    primaryPresentations: ['pbui.composition_presentation', 'pbui.action_presentation'],
    defaultActions: ['PLACE-ORDER', 'MENU', 'HELP'],
  },
};

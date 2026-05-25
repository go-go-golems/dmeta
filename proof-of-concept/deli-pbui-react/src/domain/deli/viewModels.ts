import type { DeliActionId } from './types';

export interface DeliViewModelDefinition {
  id: 'menu' | 'detail' | 'cart';
  modeLabel: string;
  primaryPresentations: string[];
  defaultActions: DeliActionId[];
}

export const deliViewModels: Record<DeliViewModelDefinition['id'], DeliViewModelDefinition> = {
  menu: {
    id: 'menu',
    modeLabel: 'MENU',
    primaryPresentations: ['pbui.presentation_ref', 'pbui.action_chooser', 'pbui.action_presentation'],
    defaultActions: ['select_menu_item', 'return_to_menu'],
  },
  detail: {
    id: 'detail',
    modeLabel: 'DETAIL',
    primaryPresentations: ['pbui.composition_presentation', 'pbui.action_presentation', 'pbui.presentation_ref'],
    defaultActions: ['remove_part', 'apply_substitution', 'add_to_order', 'return_to_menu'],
  },
  cart: {
    id: 'cart',
    modeLabel: 'CART',
    primaryPresentations: ['pbui.composition_presentation', 'pbui.action_presentation'],
    defaultActions: ['submit_order', 'return_to_menu'],
  },
};

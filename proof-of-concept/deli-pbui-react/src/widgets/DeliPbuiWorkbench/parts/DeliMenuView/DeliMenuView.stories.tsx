import type { Meta, StoryObj } from '@storybook/react-vite';
import { deliActions } from '../../../../domain/deli/actions';
import { menuItems } from '../../../../domain/deli/fixtures';
import { menuItemPresentation } from '../../../../domain/deli/pbuiPresentations';
import { DeliMenuView } from './DeliMenuView';

export default {
  title: 'POC/Deli PBUI Workbench/Parts/DeliMenuView',
  component: DeliMenuView,
  args: {
    menu: menuItems,
    selectedItemId: menuItems[0].id,
    activeSelected: menuItemPresentation(menuItems[0]),
    filledArgs: {},
    actionContext: {
      selectedItem: menuItems[0],
      selectedItemId: menuItems[0].id,
      removedIngredientIds: [],
      cartItems: [],
      selectItem: () => undefined,
      isRemovableIngredient: () => false,
      removeIngredient: () => undefined,
      addCartItem: () => undefined,
      navigateToView: () => undefined,
      navigateBack: () => undefined,
    },
    onPresentationClick: () => undefined,
    onPresentationContextMenu: () => undefined,
    selectMode: false,
  },
} as Meta<typeof DeliMenuView>;

type Story = StoryObj<typeof DeliMenuView>;

export const Normal: Story = {};

export const SelectMode: Story = {
  args: {
    pendingAction: deliActions.CUSTOMIZE,
    selectMode: true,
  },
};

export const WithContextMenu: Story = {
  args: {
    onPresentationContextMenu: (_ref, x, y) => console.log('Context menu at', x, y),
  },
};

export const NoSelection: Story = {
  args: {
    selectedItemId: undefined,
    activeSelected: undefined,
  },
};

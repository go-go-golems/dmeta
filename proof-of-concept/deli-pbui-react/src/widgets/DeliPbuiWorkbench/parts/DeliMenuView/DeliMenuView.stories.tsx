import type { Meta, StoryObj } from '@storybook/react-vite';
import { deliActions } from '../../../../domain/deli/actions';
import { menuItems } from '../../../../domain/deli/fixtures';
import { menuItemPresentation } from '../../../../domain/deli/pbuiPresentations';
import { DeliMenuView } from './DeliMenuView';

const meta = {
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
    selectMode: false,
  },
} satisfies Meta<typeof DeliMenuView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {};

export const SelectMode: Story = {
  args: {
    pendingAction: deliActions.CUSTOMIZE,
    selectMode: true,
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { deliActions } from '../../../../domain/deli/actions';
import { menuItems } from '../../../../domain/deli/fixtures';
import { draftPresentation, ingredientPresentation } from '../../../../domain/deli/pbuiPresentations';
import { DeliDetailView } from './DeliDetailView';

const selectedItem = menuItems[0];

const meta = {
  title: 'POC/Deli PBUI Workbench/Parts/DeliDetailView',
  component: DeliDetailView,
  args: {
    selectedItem,
    draft: draftPresentation(selectedItem),
    removedIngredientIds: [],
    activeSelected: ingredientPresentation(selectedItem.ingredients[2], false),
    filledArgs: {},
    actionContext: {
      selectedItem,
      selectedItemId: selectedItem.id,
      removedIngredientIds: [],
      cartItems: [],
      selectItem: () => undefined,
      isRemovableIngredient: (id) => selectedItem.ingredients.some((ingredient) => ingredient.id === id && ingredient.removable),
      removeIngredient: () => undefined,
      addCartItem: () => undefined,
      navigateToView: () => undefined,
      navigateBack: () => undefined,
    },
    onPresentationClick: () => undefined,
    selectMode: false,
  },
} satisfies Meta<typeof DeliDetailView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SelectedIngredient: Story = {};

export const RemoveIngredientSelectMode: Story = {
  args: {
    pendingAction: deliActions['REMOVE-INGREDIENT'],
    selectMode: true,
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
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

function labelSpan(row: HTMLElement, text: string) {
  const span = Array.from(row.querySelectorAll('span')).find((candidate) => candidate.textContent?.includes(text));
  if (!span) {
    throw new Error(`Could not find label span containing ${text}`);
  }
  return span;
}

export const SelectedIngredient: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tomato = await canvas.findByRole('button', { name: /tomato/ });
    const tomatoLabel = labelSpan(tomato, 'tomato');
    expect(getComputedStyle(tomatoLabel).color).toBe('rgb(255, 255, 255)');
    expect(getComputedStyle(tomatoLabel).animationName).toBe('pulse');
  },
};

export const RemoveIngredientSelectMode: Story = {
  args: {
    pendingAction: deliActions['REMOVE-INGREDIENT'],
    selectMode: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(getComputedStyle(await canvas.findByRole('button', { name: /sourdough/ })).cursor).toBe('default');
    expect(getComputedStyle(await canvas.findByRole('button', { name: /tomato/ })).cursor).toBe('pointer');
  },
};

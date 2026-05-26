import type { Meta, StoryObj } from '@storybook/react-vite';
import { menuItems } from '../../../../domain/deli/fixtures';
import { cartPresentation } from '../../../../domain/deli/pbuiPresentations';
import { DeliCartView } from './DeliCartView';

const cartItems = [{
  id: 'cart.sandwich.hudson-classic',
  item: menuItems[0],
  removedIngredientIds: ['ingredient.tomato'],
  substitutions: {},
}];

export default {
  title: 'POC/Deli PBUI Workbench/Parts/DeliCartView',
  component: DeliCartView,
  args: {
    cart: cartPresentation(cartItems),
    cartItems,
  },
} as Meta<typeof DeliCartView>;

type Story = StoryObj<typeof DeliCartView>;

export const WithItems: Story = {};

export const Empty: Story = {
  args: {
    cart: cartPresentation([]),
    cartItems: [],
  },
};

export const MultipleItems: Story = {
  args: {
    cart: cartPresentation([...cartItems, {
      id: 'cart.salad.market-greens',
      item: menuItems[1],
      removedIngredientIds: [],
      substitutions: {},
    }]),
    cartItems: [...cartItems, {
      id: 'cart.salad.market-greens',
      item: menuItems[1],
      removedIngredientIds: [],
      substitutions: {},
    }],
  },
};

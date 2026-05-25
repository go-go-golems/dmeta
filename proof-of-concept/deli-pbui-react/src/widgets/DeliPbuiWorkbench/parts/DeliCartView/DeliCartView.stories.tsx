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

const meta = {
  title: 'POC/Deli PBUI Workbench/Parts/DeliCartView',
  component: DeliCartView,
  args: {
    cart: cartPresentation(cartItems),
    cartItems,
  },
} satisfies Meta<typeof DeliCartView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithItems: Story = {};

export const Empty: Story = {
  args: {
    cart: cartPresentation([]),
    cartItems: [],
  },
};

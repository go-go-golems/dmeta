import type { Meta, StoryObj } from '@storybook/react-vite';
import { StreetDeliOrderCart } from './StreetDeliOrderCart';
import type { CartItemViewModel } from '../../view-models/types';
import { MENU } from '../../data/menuData';

const blta = MENU.find(m => m.id === 'classic-blta')!;
const bagel = MENU.find(m => m.id === 'everything-bagel-cc')!;
const grilledCheese = MENU.find(m => m.id === 'grilled-cheese')!;

const singleItem: CartItemViewModel[] = [
  {
    id: 1,
    menuItem: blta,
    composition: blta.ingredients.map(ing => ({ ...ing, removed: false, substitution: null })),
    config: { bread: 'Standard', cut: 'Whole' },
    totalPriceCents: 1195,
  },
];

const multipleItems: CartItemViewModel[] = [
  {
    id: 1,
    menuItem: blta,
    composition: blta.ingredients.map(ing => ({ ...ing, removed: false, substitution: null })),
    config: { bread: 'Standard', cut: 'Whole' },
    totalPriceCents: 1195,
  },
  {
    id: 2,
    menuItem: bagel,
    composition: bagel.ingredients.map(ing => ({ ...ing, removed: false, substitution: null })),
    config: { toast: 'Toasted' },
    totalPriceCents: 595,
  },
  {
    id: 3,
    menuItem: grilledCheese,
    composition: grilledCheese.ingredients.map(ing => ({ ...ing, removed: false, substitution: null })),
    config: {},
    totalPriceCents: 895,
  },
];

const itemWithSubstitution: CartItemViewModel[] = [
  {
    id: 1,
    menuItem: blta,
    composition: blta.ingredients.map(ing => {
      if (ing.id === 'bacon') {
        return {
          ...ing,
          removed: true,
          substitution: {
            name: 'Smoked Tofu',
            roles: ['protein', 'umami'],
            dietary: ['vegan', 'vegetarian', 'dairy_free'],
            allergens: ['soy'],
            flavor: 'similar' as const,
            priceDeltaCents: 0,
            auto: true,
            reasoning: "Smoked tofu brings protein and smoky umami.",
          },
        };
      }
      if (ing.id === 'mayo') {
        return {
          ...ing,
          removed: true,
          substitution: {
            name: 'Hummus',
            roles: ['moisture', 'richness', 'binding', 'umami'],
            dietary: ['vegan', 'dairy_free'],
            allergens: ['may contain sesame'],
            flavor: 'complementary' as const,
            priceDeltaCents: 0,
            auto: true,
            reasoning: "Hummus replaces mayo's moisture and binding with added umami.",
          },
        };
      }
      return { ...ing, removed: false, substitution: null };
    }),
    config: { bread: 'Extra Toast', cut: 'Half' },
    totalPriceCents: 1195,
  },
];

const meta: Meta<typeof StreetDeliOrderCart> = {
  title: 'Street Deli/Organisms/StreetDeliOrderCart',
  component: StreetDeliOrderCart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Reflection-first scaffold promoted from `deli.order_cart`. ' +
          'Semantic context: WorkItem + ProductComposition; capabilities: measurable, stateful. ' +
          'Cart review surface with item list, totals, and place-order action.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof StreetDeliOrderCart>;

export const SingleItem: Story = {
  args: {
    items: singleItem,
    onRemoveItem: () => {},
    onSubmitOrder: () => {},
    onBack: () => {},
  },
};

export const MultipleItems: Story = {
  args: {
    items: multipleItems,
    onRemoveItem: () => {},
    onSubmitOrder: () => {},
    onBack: () => {},
  },
};

export const WithSubstitutions: Story = {
  args: {
    items: itemWithSubstitution,
    onRemoveItem: () => {},
    onSubmitOrder: () => {},
    onBack: () => {},
  },
};

export const EmptyCart: Story = {
  args: {
    items: [],
    onRemoveItem: () => {},
    onSubmitOrder: () => {},
    onBack: () => {},
  },
};

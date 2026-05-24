import type { Meta, StoryObj } from '@storybook/react-vite';
import { StreetDeliCompositionCard } from './StreetDeliCompositionCard';
import type { MenuItemViewModel } from '../../view-models/types';

const sampleItem: MenuItemViewModel = {
  id: 'classic-blta',
  name: 'Classic BLTA',
  category: 'sandwiches',
  basePriceCents: 1195,
  description: 'Bacon, lettuce, tomato, avocado on toasted sourdough',
  ingredients: [
    { id: 'sourdough', name: 'Sourdough Bread', roles: ['structural'], required: true, dietary: [] },
    { id: 'bacon', name: 'Bacon', roles: ['protein', 'umami', 'heat'], required: false, dietary: [] },
    { id: 'lettuce', name: 'Lettuce', roles: ['crunch', 'freshness'], required: false, dietary: ['vegan', 'dairy_free'] },
    { id: 'tomato', name: 'Tomato', roles: ['acidity', 'freshness', 'moisture'], required: false, dietary: ['vegan', 'dairy_free'] },
    { id: 'avocado', name: 'Avocado', roles: ['richness', 'moisture'], required: false, dietary: ['vegan', 'dairy_free', 'gluten_free'] },
    { id: 'mayo', name: 'Mayonnaise', roles: ['moisture', 'binding'], required: false, dietary: ['dairy_free'] },
  ],
  dietary: [],
  allergens: ['gluten', 'eggs'],
};

const vegetarianItem: MenuItemViewModel = {
  id: 'grilled-cheese',
  name: 'Grilled Cheese',
  category: 'sandwiches',
  basePriceCents: 895,
  description: 'Melted cheddar and American on griddled sourdough',
  ingredients: [
    { id: 'sourdough-2', name: 'Sourdough Bread', roles: ['structural'], required: true, dietary: [] },
    { id: 'cheddar', name: 'Cheddar Cheese', roles: ['protein', 'richness', 'umami'], required: false, dietary: ['dairy_free'] },
    { id: 'american', name: 'American Cheese', roles: ['richness', 'moisture', 'binding'], required: false, dietary: ['dairy_free'] },
    { id: 'butter-2', name: 'Butter', roles: ['richness', 'moisture'], required: false, dietary: ['dairy_free'] },
  ],
  dietary: ['vegetarian'],
  allergens: ['gluten', 'dairy'],
};

const bagelItem: MenuItemViewModel = {
  id: 'everything-bagel-cc',
  name: 'Everything Bagel w/ CC',
  category: 'bagels',
  basePriceCents: 595,
  description: 'Toasted everything bagel with scallion cream cheese',
  ingredients: [
    { id: 'everything-bagel', name: 'Everything Bagel', roles: ['structural'], required: true, dietary: [] },
    { id: 'scallion-cc', name: 'Scallion Cream Cheese', roles: ['richness', 'moisture'], required: false, dietary: ['dairy_free'] },
  ],
  dietary: ['vegetarian'],
  allergens: ['gluten', 'dairy'],
};

const meta: Meta<typeof StreetDeliCompositionCard> = {
  title: 'Street Deli/Molecules/StreetDeliCompositionCard',
  component: StreetDeliCompositionCard,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Reflection-first scaffold promoted from `deli.composition_card`. ' +
          'Semantic context: ProductComposition + ingredient_composable + dietary + measurable. ' +
          'Projection hints: labelable.label, measurable.value, ingredient_composable.parts, dietary.dietary_tags (recommended).',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof StreetDeliCompositionCard>;

export const Sandwich: Story = {
  args: {
    item: sampleItem,
    onCustomize: () => {},
  },
};

export const Vegetarian: Story = {
  args: {
    item: vegetarianItem,
    onCustomize: () => {},
  },
};

export const Bagel: Story = {
  args: {
    item: bagelItem,
    onCustomize: () => {},
  },
};

/** Multiple cards in a list layout matching the menu screen */
export const CardList: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '0 16px' }}>
      <StreetDeliCompositionCard item={sampleItem} onCustomize={() => {}} />
      <StreetDeliCompositionCard item={vegetarianItem} onCustomize={() => {}} />
      <StreetDeliCompositionCard item={bagelItem} onCustomize={() => {}} />
    </div>
  ),
};

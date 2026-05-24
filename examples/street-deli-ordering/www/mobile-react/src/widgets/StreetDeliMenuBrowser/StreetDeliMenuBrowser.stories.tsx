import type { Meta, StoryObj } from '@storybook/react-vite';
import { StreetDeliMenuBrowser } from './StreetDeliMenuBrowser';

const meta: Meta<typeof StreetDeliMenuBrowser> = {
  title: 'Street Deli/Organisms/StreetDeliMenuBrowser',
  component: StreetDeliMenuBrowser,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Reflection-first scaffold promoted from `deli.menu_browser`. ' +
          'Primary mobile ordering entrypoint: category tabs + filtered menu card list. ' +
          'Semantic context: Composition + Resource; capabilities: dietary, filter_source.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof StreetDeliMenuBrowser>;

export const AllCategories: Story = {
  args: {
    activeCategory: 'all',
    activeDietary: new Set(),
    onSelectCategory: () => {},
    onSelectItem: () => {},
  },
};

export const SandwichesTab: Story = {
  args: {
    activeCategory: 'sandwiches',
    activeDietary: new Set(),
    onSelectCategory: () => {},
    onSelectItem: () => {},
  },
};

export const BagelsTab: Story = {
  args: {
    activeCategory: 'bagels',
    activeDietary: new Set(),
    onSelectCategory: () => {},
    onSelectItem: () => {},
  },
};

export const BreakfastTab: Story = {
  args: {
    activeCategory: 'breakfast',
    activeDietary: new Set(),
    onSelectCategory: () => {},
    onSelectItem: () => {},
  },
};

export const VeganFilter: Story = {
  args: {
    activeCategory: 'all',
    activeDietary: new Set(['vegan']),
    onSelectCategory: () => {},
    onSelectItem: () => {},
  },
};

export const DairyFreeFilter: Story = {
  args: {
    activeCategory: 'all',
    activeDietary: new Set(['dairy_free']),
    onSelectCategory: () => {},
    onSelectItem: () => {},
  },
};

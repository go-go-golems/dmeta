import type { Meta, StoryObj } from '@storybook/react-vite';
import { StreetDeliCompositionCustomizer } from './StreetDeliCompositionCustomizer';
import type { CustomizingState } from '../../state/types';
import type { MenuItemViewModel } from '../../view-models/types';
import { MENU } from '../../data/menuData';

const bltaItem = MENU.find(m => m.id === 'classic-blta')!;
const bagelItem = MENU.find(m => m.id === 'everything-bagel-cc')!;

function makeDraft(item: MenuItemViewModel): CustomizingState {
  return {
    menuItem: item,
    composition: item.ingredients.map(ing => ({
      ...ing,
      removed: false,
      substitution: null,
    })),
    config: {},
    currentPriceCents: item.basePriceCents,
  };
}

function makeDraftWithRemoved(item: MenuItemViewModel, removeId: string): CustomizingState {
  return {
    menuItem: item,
    composition: item.ingredients.map(ing => ({
      ...ing,
      removed: ing.id === removeId,
      substitution: null,
    })),
    config: {},
    currentPriceCents: item.basePriceCents,
  };
}

function makeDraftWithSubstitution(item: MenuItemViewModel, removeId: string): CustomizingState {
  return {
    menuItem: item,
    composition: item.ingredients.map(ing => ({
      ...ing,
      removed: ing.id === removeId ? true : false,
      substitution: ing.id === removeId ? {
        name: 'Smoked Tofu',
        roles: ['protein', 'umami'],
        dietary: ['vegan', 'vegetarian', 'dairy_free'],
        allergens: ['soy'],
        flavor: 'similar' as const,
        priceDeltaCents: 0,
        auto: true,
        reasoning: "Smoked tofu brings protein and smoky umami.",
      } : null,
    })),
    config: {},
    currentPriceCents: item.basePriceCents,
  };
}

const meta: Meta<typeof StreetDeliCompositionCustomizer> = {
  title: 'Street Deli/Organisms/StreetDeliCompositionCustomizer',
  component: StreetDeliCompositionCustomizer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Reflection-first scaffold promoted from `deli.composition_customizer`. ' +
          'Semantic context: ProductComposition + ingredient_composable + role_preserving_substitutable + configurable + dietary. ' +
          'The most complex widget: composes ingredient list, substitution zone, config selectors, dietary summary, allergen warning, and add-to-order button.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof StreetDeliCompositionCustomizer>;

export const SandwichDefault: Story = {
  args: {
    draft: makeDraft(bltaItem),
    onRemoveIngredient: () => {},
    onUndoIngredient: () => {},
    onApplySubstitution: () => {},
    onChangeConfig: () => {},
    onAddToOrder: () => {},
  },
};

export const BagelDefault: Story = {
  args: {
    draft: makeDraft(bagelItem),
    onRemoveIngredient: () => {},
    onUndoIngredient: () => {},
    onApplySubstitution: () => {},
    onChangeConfig: () => {},
    onAddToOrder: () => {},
  },
};

export const IngredientRemoved: Story = {
  args: {
    draft: makeDraftWithRemoved(bltaItem, 'bacon'),
    onRemoveIngredient: () => {},
    onUndoIngredient: () => {},
    onApplySubstitution: () => {},
    onChangeConfig: () => {},
    onAddToOrder: () => {},
  },
};

export const SubstitutionApplied: Story = {
  args: {
    draft: makeDraftWithSubstitution(bltaItem, 'bacon'),
    onRemoveIngredient: () => {},
    onUndoIngredient: () => {},
    onApplySubstitution: () => {},
    onChangeConfig: () => {},
    onAddToOrder: () => {},
  },
};

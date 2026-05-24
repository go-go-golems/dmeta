import type { Meta, StoryObj } from '@storybook/react-vite';
import { StreetDeliIngredientRow } from './StreetDeliIngredientRow';
import type { IngredientState } from '../../view-models/types';

const baseIngredient: IngredientState = {
  id: 'bacon',
  name: 'Bacon',
  roles: ['protein', 'umami', 'heat'],
  required: false,
  dietary: [],
  removed: false,
  substitution: null,
};

const requiredIngredient: IngredientState = {
  id: 'sourdough',
  name: 'Sourdough Bread',
  roles: ['structural'],
  required: true,
  dietary: [],
  removed: false,
  substitution: null,
};

const veganIngredient: IngredientState = {
  id: 'avocado',
  name: 'Avocado',
  roles: ['richness', 'moisture'],
  required: false,
  dietary: ['vegan', 'dairy_free', 'gluten_free'],
  removed: false,
  substitution: null,
};

const removedIngredient: IngredientState = {
  ...baseIngredient,
  removed: true,
  substitution: null,
};

const substitutedIngredient: IngredientState = {
  ...baseIngredient,
  removed: true,
  substitution: {
    name: 'Smoked Tofu',
    roles: ['protein', 'umami'],
    dietary: ['vegan', 'vegetarian', 'dairy_free'],
    allergens: ['soy'],
    flavor: 'similar',
    priceDeltaCents: 0,
    auto: true,
    reasoning: "Smoked tofu brings protein and smoky umami. The closest vegan match for bacon's core roles.",
  },
};

const meta: Meta<typeof StreetDeliIngredientRow> = {
  title: 'Street Deli/Molecules/StreetDeliIngredientRow',
  component: StreetDeliIngredientRow,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Reflection-first scaffold promoted from `deli.ingredient_row`. ' +
          'Three visual states: normal, removed, substituted. Semantic context: Ingredient -> Resource; capabilities: identifiable, labelable, dietary.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof StreetDeliIngredientRow>;

export const Normal: Story = {
  args: {
    ingredient: baseIngredient,
    onRemove: () => {},
    onUndo: () => {},
  },
};

export const RequiredIngredient: Story = {
  args: {
    ingredient: requiredIngredient,
    onRemove: () => {},
    onUndo: () => {},
  },
};

export const WithDietaryTags: Story = {
  args: {
    ingredient: veganIngredient,
    onRemove: () => {},
    onUndo: () => {},
  },
};

export const Removed: Story = {
  args: {
    ingredient: removedIngredient,
    onRemove: () => {},
    onUndo: () => {},
  },
};

export const Substituted: Story = {
  args: {
    ingredient: substitutedIngredient,
    onRemove: () => {},
    onUndo: () => {},
  },
};

/** Full ingredient list matching the customizer */
export const FullIngredientList: Story = {
  render: () => {
    const ingredients: IngredientState[] = [
      { id: 'sourdough', name: 'Sourdough Bread', roles: ['structural'], required: true, dietary: [], removed: false, substitution: null },
      { id: 'bacon', name: 'Bacon', roles: ['protein', 'umami', 'heat'], required: false, dietary: [], removed: false, substitution: null },
      { id: 'lettuce', name: 'Lettuce', roles: ['crunch', 'freshness'], required: false, dietary: ['vegan', 'dairy_free'], removed: false, substitution: null },
      { id: 'tomato', name: 'Tomato', roles: ['acidity', 'freshness', 'moisture'], required: false, dietary: ['vegan', 'dairy_free'], removed: false, substitution: null },
      { id: 'avocado', name: 'Avocado', roles: ['richness', 'moisture'], required: false, dietary: ['vegan', 'dairy_free', 'gluten_free'], removed: true, substitution: null },
      { id: 'mayo', name: 'Mayonnaise', roles: ['moisture', 'binding'], required: false, dietary: ['dairy_free'], removed: true, substitution: {
        name: 'Hummus',
        roles: ['moisture', 'richness', 'binding', 'umami'],
        dietary: ['vegan', 'dairy_free'],
        allergens: ['may contain sesame'],
        flavor: 'complementary',
        priceDeltaCents: 0,
        auto: true,
        reasoning: "Hummus replaces mayo's moisture and binding with added umami.",
      }},
    ];
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {ingredients.map((ing) => (
          <StreetDeliIngredientRow
            key={ing.id}
            ingredient={ing}
            onRemove={() => {}}
            onUndo={() => {}}
          />
        ))}
      </div>
    );
  },
};

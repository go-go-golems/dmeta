import type { Meta, StoryObj } from '@storybook/react-vite';
import { StreetDeliSubstitutionChip } from './StreetDeliSubstitutionChip';
import type { SubstitutionCandidateViewModel } from '../../view-models/types';

const autoCandidate: SubstitutionCandidateViewModel = {
  name: 'Smoked Tofu',
  roles: ['protein', 'umami'],
  dietary: ['vegan', 'vegetarian', 'dairy_free'],
  allergens: ['soy'],
  flavor: 'similar',
  priceDeltaCents: 0,
  auto: true,
  reasoning: "Smoked tofu brings protein and smoky umami. The closest vegan match for bacon's core roles.",
};

const paidCandidate: SubstitutionCandidateViewModel = {
  name: 'Tempeh Bacon',
  roles: ['protein', 'umami', 'crunch'],
  dietary: ['vegan', 'vegetarian', 'dairy_free'],
  allergens: ['soy'],
  flavor: 'similar',
  priceDeltaCents: 200,
  auto: true,
  reasoning: "Tempeh bacon mimics bacon's crunch and smokiness. The most complete role substitute but costs more.",
};

const nonAutoCandidate: SubstitutionCandidateViewModel = {
  name: 'Turkey Bacon',
  roles: ['protein', 'umami'],
  dietary: [],
  allergens: [],
  flavor: 'similar',
  priceDeltaCents: 0,
  auto: false,
  reasoning: 'Turkey bacon provides protein and umami. Lighter than pork but familiar flavor direction.',
};

const freeCandidate: SubstitutionCandidateViewModel = {
  name: 'Olive Oil',
  roles: ['richness', 'moisture'],
  dietary: ['vegan', 'dairy_free', 'gluten_free'],
  allergens: [],
  flavor: 'complementary',
  priceDeltaCents: 0,
  auto: true,
  reasoning: 'Classic dairy-free fat. Light and clean.',
};

const meta: Meta<typeof StreetDeliSubstitutionChip> = {
  title: 'Street Deli/Molecules/StreetDeliSubstitutionChip',
  component: StreetDeliSubstitutionChip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Reflection-first scaffold promoted from `deli.substitution_chip`. ' +
          'Semantic context: SubstitutionSuggestion -> Substitution; capabilities: role_preserving_substitutable, dietary_substitutable, price_aware_substitutable. ' +
          'Shows original -> replacement with role tags and price delta.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof StreetDeliSubstitutionChip>;

export const AutoSuggestFree: Story = {
  args: {
    originalName: 'Bacon',
    candidate: autoCandidate,
    onApply: () => {},
  },
};

export const AutoSuggestPaid: Story = {
  args: {
    originalName: 'Bacon',
    candidate: paidCandidate,
    onApply: () => {},
  },
};

export const NonAutoCandidate: Story = {
  args: {
    originalName: 'Bacon',
    candidate: nonAutoCandidate,
    onApply: () => {},
  },
};

export const ButterReplacement: Story = {
  args: {
    originalName: 'Butter',
    candidate: freeCandidate,
    onApply: () => {},
  },
};

/** Multiple substitution options together */
export const SubstitutionOptions: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <StreetDeliSubstitutionChip originalName="Bacon" candidate={autoCandidate} onApply={() => {}} />
      <StreetDeliSubstitutionChip originalName="Bacon" candidate={paidCandidate} onApply={() => {}} />
    </div>
  ),
};

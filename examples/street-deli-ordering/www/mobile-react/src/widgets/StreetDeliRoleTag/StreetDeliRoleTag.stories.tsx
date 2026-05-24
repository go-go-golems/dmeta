import type { Meta, StoryObj } from '@storybook/react-vite';
import { StreetDeliRoleTag } from './StreetDeliRoleTag';
import type { IngredientRole } from '../../view-models/types';

const meta: Meta<typeof StreetDeliRoleTag> = {
  title: 'Street Deli/Atoms/StreetDeliRoleTag',
  component: StreetDeliRoleTag,
  tags: ['autodocs'],
  argTypes: {
    role: {
      control: 'select',
      options: [
        'structural', 'protein', 'richness', 'moisture', 'acidity',
        'crunch', 'heat', 'umami', 'garnish', 'freshness', 'binding',
      ] as IngredientRole[],
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Reflection-first scaffold promoted from `deli.role_tag`. ' +
          'Ultra-compact role tag pill showing an ingredient role like PROTEIN, RICHNESS, or CRUNCH. ' +
          'Each role maps to a semantic color from the design-language IR.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof StreetDeliRoleTag>;

export const Structural: Story = {
  args: { role: 'structural' },
};

export const Protein: Story = {
  args: { role: 'protein' },
};

export const Richness: Story = {
  args: { role: 'richness' },
};

export const Moisture: Story = {
  args: { role: 'moisture' },
};

export const Acidity: Story = {
  args: { role: 'acidity' },
};

export const Crunch: Story = {
  args: { role: 'crunch' },
};

export const Heat: Story = {
  args: { role: 'heat' },
};

export const Umami: Story = {
  args: { role: 'umami' },
};

export const Garnish: Story = {
  args: { role: 'garnish' },
};

export const Freshness: Story = {
  args: { role: 'freshness' },
};

export const Binding: Story = {
  args: { role: 'binding' },
};

/** All roles displayed together for visual comparison */
export const AllRoles: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
      {([
        'structural', 'protein', 'richness', 'moisture', 'acidity',
        'crunch', 'heat', 'umami', 'garnish', 'freshness', 'binding',
      ] as IngredientRole[]).map((role) => (
        <StreetDeliRoleTag key={role} role={role} />
      ))}
    </div>
  ),
};

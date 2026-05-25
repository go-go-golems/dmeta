import type { Meta, StoryObj } from '@storybook/react-vite';
import { PbuiPresentationRef } from './PbuiPresentationRef';
import type { PresentationRef } from '../../types';

const ingredient: PresentationRef<'Ingredient'> = {
  type: 'Ingredient',
  id: 'ingredient.turkey',
  label: 'turkey [protein]',
  capabilities: ['labelable', 'removable'],
};

const bread: PresentationRef<'Ingredient'> = {
  type: 'Ingredient',
  id: 'ingredient.sourdough',
  label: 'sourdough [bread]',
  capabilities: ['labelable'],
};

const meta = {
  title: 'Generic/CLIM/PbuiPresentationRef',
  component: PbuiPresentationRef,
} satisfies Meta<typeof PbuiPresentationRef>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  args: { presentation: ingredient },
  render: () => (
    <div className="grid gap-1 bg-clim-bg p-4 font-mono text-sm">
      <PbuiPresentationRef presentation={bread} />
      <PbuiPresentationRef presentation={ingredient} state={{ selectable: true }} onSelect={() => undefined} />
      <PbuiPresentationRef presentation={{ ...ingredient, label: 'turkey [protein] (removed)' }} state={{ muted: true }} />
      <PbuiPresentationRef presentation={ingredient} state={{ selected: true }} />
    </div>
  ),
};

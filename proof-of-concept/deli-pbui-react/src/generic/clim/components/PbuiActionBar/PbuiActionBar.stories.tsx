import type { Meta, StoryObj } from '@storybook/react-vite';
import { PbuiActionBar } from './PbuiActionBar';
import type { ActionPresentation } from '../../types';

const actions: ActionPresentation[] = [
  {
    action: {
      id: 'REMOVE-INGREDIENT',
      label: 'REMOVE-INGREDIENT',
      description: 'Remove an ingredient.',
      views: ['detail'],
      args: [{ name: 'ingredient', kind: 'ref', objectType: 'Ingredient' }],
      run: () => undefined,
    },
    commandLabel: 'REMOVE-INGREDIENT',
  },
  {
    action: {
      id: 'PLACE-ORDER',
      label: 'PLACE-ORDER',
      description: 'Submit order.',
      views: ['cart'],
      args: [],
      requiresConfirmation: true,
      run: () => undefined,
    },
    commandLabel: 'PLACE-ORDER',
  },
];

const meta = {
  title: 'Generic/CLIM/PbuiActionBar',
  component: PbuiActionBar,
} satisfies Meta<typeof PbuiActionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InlineActions: Story = {
  args: { actions, selectedCommandLabel: 'REMOVE-INGREDIENT' },
  render: () => <div className="bg-clim-bg p-4 font-mono"><PbuiActionBar actions={actions} selectedCommandLabel="REMOVE-INGREDIENT" /></div>,
};

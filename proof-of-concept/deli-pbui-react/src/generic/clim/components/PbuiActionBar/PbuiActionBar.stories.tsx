import type { Meta, StoryObj } from '@storybook/react-vite';
import { PbuiActionBar } from './PbuiActionBar';
import type { ActionPresentation } from '../../types';

const actions: ActionPresentation[] = [
  {
    descriptor: {
      id: 'remove_part',
      label: 'REMOVE-INGREDIENT',
      description: 'Remove an ingredient.',
      inputTypes: { part_ref: 'SemanticRef' },
      mutatesBackend: false,
      requiresConfirmation: false,
    },
    commandLabel: 'REMOVE-INGREDIENT',
  },
  {
    descriptor: {
      id: 'submit_order',
      label: 'PLACE-ORDER',
      description: 'Submit order.',
      inputTypes: { cart_ref: 'SemanticRef' },
      mutatesBackend: true,
      requiresConfirmation: true,
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
  args: { actions },
  render: () => <div className="bg-clim-bg p-4 font-mono"><PbuiActionBar actions={actions} /></div>,
};

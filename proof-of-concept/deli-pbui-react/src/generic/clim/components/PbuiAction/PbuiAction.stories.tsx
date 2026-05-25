import type { Meta, StoryObj } from '@storybook/react-vite';
import { PbuiAction } from './PbuiAction';
import type { ActionPresentation } from '../../types';

const customize: ActionPresentation = {
  descriptor: {
    id: 'select_menu_item',
    label: 'CUSTOMIZE',
    description: 'Customize selected menu item.',
    inputTypes: { item_ref: 'SemanticRef' },
    mutatesBackend: false,
    requiresConfirmation: false,
  },
  commandLabel: 'CUSTOMIZE',
};

const placeOrder: ActionPresentation = {
  descriptor: {
    id: 'submit_order',
    label: 'PLACE-ORDER',
    description: 'Submit cart.',
    inputTypes: { cart_ref: 'SemanticRef' },
    mutatesBackend: true,
    requiresConfirmation: true,
  },
  commandLabel: 'PLACE-ORDER',
};

const meta = {
  title: 'Generic/CLIM/PbuiAction',
  component: PbuiAction,
} satisfies Meta<typeof PbuiAction>;

export default meta;
type Story = StoryObj<typeof meta>;

export const States: Story = {
  args: { action: customize },
  render: () => (
    <div className="flex gap-4 bg-clim-bg p-4 font-mono text-sm">
      <PbuiAction action={customize} />
      <PbuiAction action={placeOrder} />
      <PbuiAction action={{ ...customize, disabledReason: 'Select a menu item first.' }} />
    </div>
  ),
};

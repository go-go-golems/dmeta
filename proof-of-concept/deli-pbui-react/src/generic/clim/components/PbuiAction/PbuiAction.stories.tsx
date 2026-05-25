import type { Meta, StoryObj } from '@storybook/react-vite';
import { PbuiAction } from './PbuiAction';
import type { ActionPresentation, ActionSpec } from '../../types';

const customizeAction: ActionSpec = {
  id: 'CUSTOMIZE',
  label: 'CUSTOMIZE',
  description: 'Customize selected menu item.',
  views: ['menu'],
  args: [{ name: 'item', kind: 'ref', objectType: 'MenuItem' }],
  run: () => undefined,
};

const placeOrderAction: ActionSpec = {
  id: 'PLACE-ORDER',
  label: 'PLACE-ORDER',
  description: 'Submit cart.',
  views: ['cart'],
  args: [],
  requiresConfirmation: true,
  run: () => undefined,
};

const customize: ActionPresentation = { action: customizeAction, commandLabel: 'CUSTOMIZE' };
const placeOrder: ActionPresentation = { action: placeOrderAction, commandLabel: 'PLACE-ORDER' };

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
      <PbuiAction action={customize} selected />
      <PbuiAction action={{ ...customize, disabledReason: 'Select a menu item first.' }} />
    </div>
  ),
};

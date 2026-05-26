import type { Meta, StoryObj } from '@storybook/react-vite';
import { actionIntents } from '../../actionEngine';
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

const backAction: ActionSpec = {
  id: 'BACK',
  label: 'BACK',
  description: 'Return to previous view.',
  views: ['detail', 'cart'],
  args: [],
  run: () => undefined,
};

function makeAp(action: ActionSpec, overrides?: Partial<ActionPresentation>): ActionPresentation {
  return {
    action,
    commandLabel: action.label,
    intents: actionIntents(action),
    requiresConfirmation: Boolean(action.requiresConfirmation),
    ...overrides,
  };
}

const customize = makeAp(customizeAction);
const placeOrder = makeAp(placeOrderAction);
const back = makeAp(backAction);

export default {
  title: 'Generic/CLIM/PbuiAction',
  component: PbuiAction,
} as Meta<typeof PbuiAction>;

type Story = StoryObj<typeof PbuiAction>;

export const States: Story = {
  args: { action: customize },
  render: () => (
    <div className="flex gap-4 bg-clim-bg p-4 font-mono text-sm">
      <PbuiAction action={customize} />
      <PbuiAction action={placeOrder} />
      <PbuiAction action={back} />
      <PbuiAction action={customize} selected />
      <PbuiAction action={makeAp(customizeAction, { disabledReason: 'Select a menu item first.' })} />
    </div>
  ),
};

export const Dangerous: Story = {
  render: () => (
    <div className="flex gap-4 bg-clim-bg p-4 font-mono text-sm">
      <PbuiAction action={placeOrder} />
      <PbuiAction action={placeOrder} selected />
    </div>
  ),
};

export const Navigation: Story = {
  render: () => (
    <div className="flex gap-4 bg-clim-bg p-4 font-mono text-sm">
      <PbuiAction action={back} />
      <PbuiAction action={back} selected />
    </div>
  ),
};
